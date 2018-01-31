import { IChiChiAPU, WavSharer, AudioSettings } from 'chichi';
import * as THREE from 'three';

import { RunningStatuses, StateBuffer } from 'chichi';
import { Subject } from 'rxjs/Subject';
import { LocalAudioSettings } from './audio.localsettings';

export interface ThreeJSAudioSettings extends LocalAudioSettings {
	items: any;
	listener: any;
}

export function buildSound(wavForms: WavSharer, options? : any): ThreeJSAudioSettings {

	const chunkSize = 512;
	const bufferBlockSize = 4096;
	const bufferBlockCountBits = 2;	
	const bufferSize: number = bufferBlockSize << bufferBlockCountBits;

	const listener = new THREE.AudioListener();
	const sound = new THREE.Audio(listener);

	const nesAudio = wavForms.SharedBuffer;

	const audioCtx = sound.context;
	const audioSource = audioCtx.createBufferSource();
	sound.setNodeSource(audioSource);
	const sampleRate = audioCtx.sampleRate;

	let lastReadPos = 0;

	audioSource.buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
	const scriptNode = audioCtx.createScriptProcessor(chunkSize, 1, 1);
	const gainNode = audioCtx.createGain();
	gainNode.gain.value = 1.0;

	audioSource.connect(gainNode);
	audioSource.connect(scriptNode);

	const result = {
		volume: gainNode.gain,
		sampleRate: audioCtx.sampleRate,
		muted: false,
		listener: listener,
		items: {
			sound: sound,
			source: audioSource,
			scriptNode: scriptNode,
			gainNode: gainNode
		}
	}
	
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

	result.sampleRate = audioCtx.sampleRate;

	return result;
}