import * as THREE from 'three';
import { WishboneMachine } from '../services/wishbone/wishbone';

export class ChiChiThreeJSAudio
{
	listener: any;
	sound: THREE.Audio;
	private wishbone: WishboneMachine;
	
	bufferBlockSize: number = 8192;
	bufferBlockCount: number = 4;
	bufferOverrunBlocks: number = 0;
	
	nesBufferWritePos: number= 0;

    private nesAudioBuffer: SharedArrayBuffer = new SharedArrayBuffer(this.bufferBlockSize * (this.bufferBlockCount + this.bufferOverrunBlocks) * Float32Array.BYTES_PER_ELEMENT);
	

	private nesAudio: Float32Array = new Float32Array(<any>this.nesAudioBuffer);

    constructor(wishbone: WishboneMachine) {
        this.wishbone = wishbone;
	}
	
    setupAudio() : THREE.AudioListener {
	
		this.nesAudioBuffer = new SharedArrayBuffer(this.bufferBlockSize * this.bufferBlockCount * Float32Array.BYTES_PER_ELEMENT);
		this.nesAudio = new Float32Array(<any>this.nesAudioBuffer);
	
		const listener = new THREE.AudioListener();
		const sound = new THREE.Audio(listener);

		const  audioCtx = sound.context;
			
		const audioSource = audioCtx.createBufferSource();
			
		let lastReadPos = 0;
		sound.setNodeSource(audioSource);
		audioSource.buffer = audioCtx.createBuffer(1, 8192, 44100);
		const scriptNode = audioCtx.createScriptProcessor(2048, 1, 1);

		audioSource.connect(scriptNode);
		scriptNode.onaudioprocess = (audioProcessingEvent) => {
			let nesBytesAvailable = this.wishbone.nesAudioDataAvailable;
			const outputBuffer = audioProcessingEvent.outputBuffer;

			const outputData = outputBuffer.getChannelData(0);

			if (this.wishbone.EnableSound) {

				for (let sample = 0; sample < outputData.length; sample++) {
					outputData[sample] = this.nesAudio[lastReadPos++];
					if (lastReadPos >= this.nesAudio.length) {
						lastReadPos= 0;
					}
					nesBytesAvailable--;

					// this.wishbone.nesAudioDataAvailable = nesBytesAvailable;
					
				}
				
			} else {


				for (let sample = 0; sample < outputData.length; sample++) {
					outputData[sample] = 0; lastReadPos++;
					if (lastReadPos >= this.nesAudio.length) {
						lastReadPos= 0;
					}
					nesBytesAvailable--;

					// this.wishbone.nesAudioDataAvailable = nesBytesAvailable;
					
				}
			
			}
			if (nesBytesAvailable < 0) {
				//console.log ('audio overrun')
				nesBytesAvailable = 0;
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
		return listener;
	}
	
}
