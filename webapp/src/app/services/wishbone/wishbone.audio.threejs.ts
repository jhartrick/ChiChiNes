import { IChiChiAPU, WavSharer, AudioSettings } from 'chichi';
import * as THREE from 'three';
import { LocalAudioSettings } from './wishbone.audio.localsettings';
import { NESService } from '../NESService';
import { WishboneMachine } from './wishbone';
import { RunningStatuses } from 'chichi';
import { Subject } from 'rxjs/Subject';

export class ThreeJSAudioSettings implements LocalAudioSettings {
	constructor(private gainNode: GainNode, public listener: THREE.AudioListener) {
	}
	_muted: boolean = false;
	_lastVol = 0;
	sampleRate: number;
    get volume(): number {
		return this.gainNode.gain.value;
	}
    set volume(value: number) {
		this.gainNode.gain.value = value;
	}

	get muted(): boolean {
		return this._muted;
	}
	set muted(value: boolean) {
		this._muted = value;
		this._lastVol = this._muted ? this.gainNode.gain.value : 1;
		this.gainNode.gain.value = this._muted ? 0: this._lastVol;
	}

	abuffer: Float32Array;
}


export class ChiChiThreeJSAudio {

	
    constructor(private wishbone: WishboneMachine) {
		wishbone.statusChanged.subscribe((status)=>{
			if (status !== RunningStatuses.Running) {
				this.settings.abuffer.fill(0);
			}

		});
	}

	settings: ThreeJSAudioSettings;

	onRebuild: Subject<ThreeJSAudioSettings> = new Subject<ThreeJSAudioSettings>();
	
	getSound(options? : any): ThreeJSAudioSettings {
		const bufferBlockSize = 4096;
		const bufferBlockCountBits = 2;
		const chunkSize = 512;
		const bufferSize: number = bufferBlockSize << bufferBlockCountBits;

		const nesAudioBuffer = new SharedArrayBuffer(bufferSize * Float32Array.BYTES_PER_ELEMENT);
		const nesAudio = new Float32Array(<any>nesAudioBuffer);
		
		const listener = new THREE.AudioListener();
		
		const sound = new THREE.Audio(listener);
		const audioCtx = sound.context;
		const audioSource = audioCtx.createBufferSource();
		let lastReadPos = 0;
		sound.setNodeSource(audioSource);
		console.log (audioCtx.sampleRate);
		const sampleRate = audioCtx.sampleRate;
		
		audioSource.buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
		const scriptNode = audioCtx.createScriptProcessor(chunkSize, 1, 1);
		const gainNode = audioCtx.createGain();
		gainNode.gain.value = 1.0;

		audioSource.connect(gainNode);
		audioSource.connect(scriptNode);

		const result = new ThreeJSAudioSettings(gainNode, listener);
		const wavForms = this.wishbone.WaveForms;
		
		scriptNode.onaudioprocess = (audioProcessingEvent) => {
			
			let nesBytesAvailable = wavForms.audioBytesWritten;
			lastReadPos = wavForms.bufferPosition - nesBytesAvailable;

			if (lastReadPos < 0) {
				lastReadPos += nesAudio.length;
			}

			const outputBuffer = audioProcessingEvent.outputBuffer;
			const outputData = outputBuffer.getChannelData(0);

			for (let sample = 0; sample < outputData.length; sample++) {
				outputData[sample] = nesAudio[lastReadPos++];
				if (lastReadPos >= nesAudio.length) {
					lastReadPos = 0;
				}
				nesBytesAvailable--;
			}

			wavForms.audioBytesWritten = nesBytesAvailable;
		
			wavForms.wakeSleepers(); // = nesBytesAvailable;
		}

		scriptNode.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		audioSource.loop = true;
		audioSource.start();
		
		this.wishbone.WaveForms.SharedBuffer = nesAudio;

		
		result.abuffer = nesAudio;
		result.sampleRate = audioCtx.sampleRate;
		this.settings = result;
		this.onRebuild.next(this.settings);
		return result;
	}

}
