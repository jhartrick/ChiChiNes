import * as THREE from 'three';
import { WishboneMachine } from './wishbone';
import { ChiChiBopper, WavSharer } from 'chichi';

export class WishBopper  extends ChiChiBopper {
	_audioHandler: ChiChiThreeJSAudio;
	get audioHandler(): ChiChiThreeJSAudio {
		if (this._audioHandler && this._audioHandler.sound) {
			this._audioHandler.sound.stop();
		}
		this._audioHandler.setupAudio();
		return this._audioHandler;
	}
	
    // get nesAudioDataAvailable(): number {
    //     return <any>Atomics.load(this.nesInterop,this.NES_AUDIO_AVAILABLE);
    // }

    // set nesAudioDataAvailable(value: number) {
    //     <any>Atomics.store(this.nesInterop, this.NES_AUDIO_AVAILABLE, value);
       
    //     <any>Atomics.wake(this.nesInterop, this.NES_AUDIO_AVAILABLE, 321);
    // }


	constructor(wishbone: WishboneMachine) {
		const wavSharer = new WavSharer();
		super(wavSharer);

		this._audioHandler = new ChiChiThreeJSAudio(wishbone); 
	}
}

class ChiChiThreeJSAudio
{
	listener: THREE.AudioListener;
	sound: THREE.Audio;
	private wishbone: WishboneMachine;
	
	bufferBlockSize: number = 8192;
	bufferBlockCount: number = 2;
	bufferOverrunBlocks: number = 2;
	
	nesBufferWritePos: number= 0;

    private nesAudioBuffer: SharedArrayBuffer = new SharedArrayBuffer(this.bufferBlockSize * (this.bufferBlockCount + this.bufferOverrunBlocks) * Float32Array.BYTES_PER_ELEMENT);
	

	private nesAudio: Float32Array = new Float32Array(<any>this.nesAudioBuffer);

    constructor(wishbopper: WishboneMachine) {
        this.wishbone = wishbopper;
	}
	
    setupAudio() : THREE.AudioListener {
	
		this.nesAudioBuffer = new SharedArrayBuffer(this.bufferBlockSize * this.bufferBlockCount * Float32Array.BYTES_PER_ELEMENT);
		this.nesAudio = new Float32Array(<any>this.nesAudioBuffer);
	
		this.listener = new THREE.AudioListener();
		const sound = new THREE.Audio(this.listener);
		const  audioCtx = sound.context;
		const audioSource = audioCtx.createBufferSource();
			
		let lastReadPos = 0;
		sound.setNodeSource(audioSource);
		audioSource.buffer = audioCtx.createBuffer(1, 8192, 48000);
		const scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);

		audioSource.connect(scriptNode);
		scriptNode.onaudioprocess = (audioProcessingEvent) => {
			let nesBytesAvailable = this.wishbone.nesAudioDataAvailable;
			const outputBuffer = audioProcessingEvent.outputBuffer;

			const outputData = outputBuffer.getChannelData(0);

			if (this.wishbone.EnableSound ) {

				for (let sample = 0; sample < outputData.length; sample++) {
					outputData[sample] = this.nesAudio[lastReadPos++];
					if (lastReadPos >= this.nesAudio.length) {
						lastReadPos= 0;
					}
					nesBytesAvailable--;

				}
				
			} else {


				for (let sample = 0; sample < outputData.length; sample++) {
					outputData[sample] = 0; lastReadPos++;
					if (lastReadPos >= this.nesAudio.length) {
						lastReadPos= 0;
					}
					nesBytesAvailable--;

				}
			
			}
			if (nesBytesAvailable < 0) {
				//console.log ('audio overrun')
				//nesBytesAvailable = 0;
			}
			this.wishbone.nesAudioDataAvailable = nesBytesAvailable;
			
			
			// nesService.clearAudio();
		}

		scriptNode.connect(audioCtx.destination);
		audioSource.loop = true;
		audioSource.start();
			// this.sound.setLoop(true);
			// this.sound.play();
			//this.nesService.SetAudioBuffer();
		this.wishbone.WaveForms.SharedBuffer = this.nesAudio;
		return this.listener;
	}
	
}
