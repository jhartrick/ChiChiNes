import { AudioSettings } from './ChiChiTypes';
import { WavSharer } from './Audio/CommonAudio';
import { IMemoryMap } from './ChiChiMemoryMap';
export interface IChiChiAPUState {
    audioSettings: AudioSettings;
    sampleRate: number;
    interruptRaised: boolean;
    enableSquare0: boolean;
    enableSquare1: boolean;
    enableTriangle: boolean;
    enableNoise: boolean;
}
export interface IChiChiAPU extends IChiChiAPUState {
    writer: WavSharer;
    irqHandler(): void;
    GetByte(clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    rebuildSound(): void;
    memoryMap: IMemoryMap;
    advanceClock(ticks: number): void;
    state: IChiChiAPUState;
}
export declare class ChiChiAPU implements IChiChiAPU {
    writer: WavSharer;
    frameMode: boolean;
    irqHandler(): any;
    lastClock: number;
    throwingIRQs: boolean;
    reg15: number;
    private myBlipper;
    private square0;
    private square1;
    private triangle;
    private noise;
    private dmc;
    private _sampleRate;
    private static clock_rate;
    private master_vol;
    private square0Gain;
    private square1Gain;
    private triangleGain;
    private noiseGain;
    private dmcGain;
    private muted;
    private lastFrameHit;
    memoryMap: IMemoryMap;
    currentClock: number;
    frameClocker: number;
    constructor(writer: WavSharer);
    audioSettings: AudioSettings;
    sampleRate: number;
    _interruptRaised: boolean;
    interruptRaised: boolean;
    enableSquare0: boolean;
    enableSquare1: boolean;
    enableTriangle: boolean;
    enableNoise: boolean;
    enableDMC: boolean;
    rebuildSound(): void;
    GetByte(Clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    sequence4: number[];
    sequence5: number[];
    advanceClock(ticks: number): void;
    updateFrame(time: number): void;
    runFrameEvents(time: number, step: number): void;
    endFrame(time: number): void;
    state: IChiChiAPUState;
}
