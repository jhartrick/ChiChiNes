import { IChiChiAPU, WavSharer, AudioSettings } from 'chichi';
import * as THREE from 'three';

import { RunningStatuses, StateBuffer } from 'chichi';
import { Subject } from 'rxjs/Subject';
import { LocalAudioSettings } from './audio.localsettings';

export interface ThreeJSAudioSettings extends LocalAudioSettings {
    items: any;
    listener: any;
}

export function buildSound(wavForms: WavSharer, options?: any): ThreeJSAudioSettings {
    const bufferBlockSize = 8192;
    const bufferBlockCountBits = 2;
    const chunkSize = 1024;
    // tslint:disable-next-line:no-bitwise
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
		volume: 0,
        sampleRate: audioCtx.sampleRate,
        muted: false,
        listener: listener,
        items: {
            sound: sound,
            source: audioSource,
            scriptNode: scriptNode,
            gainNode: gainNode
        }
    };

    scriptNode.onaudioprocess = (audioProcessingEvent) => {
		const outputData = audioProcessingEvent.outputBuffer.getChannelData(0);
		const loop = len => pos =>pos < 0 ? pos + len : pos;
		const lerp = (first: number, second: number, at: number) => first + (second - first) * at;
		
        let nesBytesAvailable = wavForms.audioBytesWritten;

		lastReadPos = wavForms.bufferPosition - nesBytesAvailable;
        if (lastReadPos < 0) {
            lastReadPos += nesAudio.length;
		}
		
		loop(nesAudio.length)(lastReadPos);

        for (let sample = 0; sample < outputData.length; sample++) {
            outputData[sample] = nesAudio[lastReadPos++];
            if (lastReadPos >= nesAudio.length) {
                lastReadPos = 0;
            }
			nesBytesAvailable--;
        }
		if (nesBytesAvailable < 0) {
			nesBytesAvailable = 0;
		}
		wavForms.audioBytesWritten = nesBytesAvailable;

        // wavForms.wakeSleepers(); // = nesBytesAvailable;
    };

    scriptNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    audioSource.loop = true;
    audioSource.start();

    result.sampleRate = audioCtx.sampleRate;

    return result;
}
