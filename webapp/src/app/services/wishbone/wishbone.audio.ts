import { WishboneMachine } from './wishbone';
import { IMemoryMap, IChiChiAPU, IChiChiAPUState, WavSharer, AudioSettings } from 'chichi';
import { LocalAudioSettings } from './wishbone.audio.localsettings';

export interface IAudioHandler {
	getSound() : any;
}

export class WishboneAPU  implements IChiChiAPU {
	memoryMap: IMemoryMap;
	sampleRate: number;
	interruptRaised: boolean;
	irqHandler() {};
	enableSquare0: boolean;
	enableSquare1: boolean;
	enableTriangle: boolean;
	enableNoise: boolean;
	GetByte(clock: number, address: number): number {
		throw new Error("Method not implemented.");
	}
	SetByte(clock: number, address: number, data: number): void {
		throw new Error("Method not implemented.");
	}
	rebuildSound(): void {
		throw new Error("Method not implemented.");
	}
	advanceClock(ticks: number): void {
		throw new Error("Method not implemented.");
	}

	writer: WavSharer;


	_audioHandler: IAudioHandler;
	get audioHandler(): IAudioHandler {
		return this._audioHandler;
	}

	set audioHandler(value: IAudioHandler) {
		this._audioHandler = value;
		
	}

	private _audioSettings: AudioSettings = {
		sampleRate: 44100,
		master_volume: 1.0,
		enableSquare0: true,
		enableSquare1: true,
		enableTriangle: true,
		enableNoise: true,
		enableDMC: true,
		synced: true
	};
	
	_localSettings: LocalAudioSettings = {
		sampleRate: 41000,
		volume: 0, 
		muted: false
	}

	get localSettings(): LocalAudioSettings {
		return this._localSettings;
	}

	get audioSettings(): AudioSettings {
		return this._audioSettings;
	}
	
	set audioSettings(value: AudioSettings) {
		this._audioSettings = value;
		// this.wishbone.RequestSync();
	}
	
	cloneSettings() : AudioSettings {
		return {
			sampleRate: this.audioSettings.sampleRate ? this.audioSettings.sampleRate : 441000,
			master_volume: this.audioSettings.master_volume,
			enableSquare0: this.audioSettings.enableSquare0,
			enableSquare1:  this.audioSettings.enableSquare1,
			enableTriangle:  this.audioSettings.enableTriangle,
			enableNoise:  this.audioSettings.enableNoise,
			enableDMC: this.audioSettings.enableDMC,
			synced: this.audioSettings.synced
		}
	}

	updateSettings(value: AudioSettings) {
		if (value) {
			this._audioSettings.sampleRate = value.sampleRate;
			this._audioSettings.enableNoise = value.enableNoise;
			this._audioSettings.enableSquare0 = value.enableSquare0;
			this._audioSettings.enableSquare1 = value.enableSquare1;
			this._audioSettings.enableTriangle = value.enableTriangle;
			this._audioSettings.enableDMC = value.enableDMC;
			this._audioSettings.master_volume = value.master_volume;
			this._audioSettings.synced = value.synced;
		}
		
	}

	setupAudio() : any {
		this._localSettings = this.audioHandler.getSound();
		this.audioSettings.sampleRate = this._localSettings.sampleRate;
		return this._localSettings;
		
	}

	constructor(wavSharer: WavSharer) {
		this.writer = wavSharer;
	}

	state: IChiChiAPUState;
}

