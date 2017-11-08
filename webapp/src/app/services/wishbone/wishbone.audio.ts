import * as THREE from 'three';
import { WishboneMachine } from './wishbone';
import { ChiChiBopper, WavSharer, AudioSettings } from 'chichi';

export class WishBopper  extends ChiChiBopper {

	_audioHandler: ChiChiThreeJSAudio;

	get audioHandler(): ChiChiThreeJSAudio {
		return this._audioHandler;
	}

	private _audioSettings: AudioSettings = new AudioSettings();
	private wishbone: WishboneMachine;

	get audioSettings(): AudioSettings {
		return this._audioSettings;
	}
	
	set audioSettings(value: AudioSettings) {
		this._audioSettings = value;
		// this.wishbone.RequestSync();
	}

	RebuildSound() {
		if (this._audioHandler) {
			this._audioHandler.setupAudio();
			this.audioSettings.sampleRate = this._audioHandler.sampleRate;
			this.wishbone.RequestSync();
		}
	}

	constructor(wavSharer: WavSharer, wishbone: WishboneMachine) {
		super(wavSharer);
		this.wishbone = wishbone;

		this._audioHandler = new ChiChiThreeJSAudio(this.wishbone);

	}
}

class ChiChiThreeJSAudio
{
	listener: THREE.AudioListener;
	sound: THREE.Audio;
	private wishbone: WishboneMachine;

	bufferBlockSize = 4096;
	bufferBlockCountBits = 	2;
	chunkSize = 512;
	bufferSize: number = this.bufferBlockSize << this.bufferBlockCountBits;

	nesBufferWritePos = 0;
	sampleRate: number = -1;


    private nesAudioBuffer: SharedArrayBuffer = new SharedArrayBuffer((this.bufferBlockSize << this.bufferBlockCountBits) * Float32Array.BYTES_PER_ELEMENT);
	private nesAudio: Float32Array = new Float32Array(<any>this.nesAudioBuffer);

    constructor(wishbopper: WishboneMachine) {
        this.wishbone = wishbopper;
	}

	

	setupAudio(): THREE.AudioListener {

		this.bufferSize = this.bufferBlockSize << this.bufferBlockCountBits;
		this.nesAudioBuffer = new SharedArrayBuffer((this.bufferBlockSize << this.bufferBlockCountBits) * Float32Array.BYTES_PER_ELEMENT);
		this.nesAudio = new Float32Array(<any>this.nesAudioBuffer);

		this.listener = new THREE.AudioListener();
		const sound = new THREE.Audio(this.listener);
		const  audioCtx = sound.context;

		const audioSource = audioCtx.createBufferSource();

		let lastReadPos = 0;
		sound.setNodeSource(audioSource);
		console.log (audioCtx.sampleRate);
		if (this.sampleRate < 0) {
			this.sampleRate = audioCtx.sampleRate;
		}
		audioSource.buffer = audioCtx.createBuffer(1, this.bufferSize, this.sampleRate);
		const scriptNode = audioCtx.createScriptProcessor(this.chunkSize, 1, 1);

		audioSource.connect(scriptNode);

		scriptNode.onaudioprocess = (audioProcessingEvent) => {
			const wavForms = this.wishbone.WaveForms;
			
			let nesBytesAvailable = wavForms.audioBytesWritten;
			lastReadPos = wavForms.bufferPosition - nesBytesAvailable;
			if (lastReadPos < 0) {
				lastReadPos += this.nesAudio.length;
			}
			const outputBuffer = audioProcessingEvent.outputBuffer;

			const outputData = outputBuffer.getChannelData(0);

			if (this.wishbone.EnableSound ) {
				for (let sample = 0; sample < outputData.length; sample++) {
					outputData[sample] = this.nesAudio[lastReadPos++];
					if (lastReadPos >= this.nesAudio.length) {
						lastReadPos = 0;
					}
					nesBytesAvailable--;
				}
			} else {
				for (let sample = 0; sample < outputData.length; sample++) {
					outputData[sample] = 0; lastReadPos++;
					if (lastReadPos >= this.nesAudio.length) {
						lastReadPos = 0;
					}
					nesBytesAvailable--;
				}
			}

			// console.log ('audio overrun')
			// nesBytesAvailable = 0;

			wavForms.audioBytesWritten = nesBytesAvailable;
			wavForms.wakeSleepers(); // = nesBytesAvailable;
		}

		scriptNode.connect(audioCtx.destination);
		audioSource.loop = true;
		audioSource.start();

		this.wishbone.WaveForms.SharedBuffer = this.nesAudio;

		return this.listener;
	}

}
