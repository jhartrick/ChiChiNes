import { AudioSettings } from './ChiChiTypes';
import { WavSharer } from './Audio/CommonAudio';
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
    advanceClock(ticks: number): void;
    state: IChiChiAPUState;
}
export declare class ChiChiAPU implements IChiChiAPU {
    writer: WavSharer;
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
    private muted;
    private lastFrameHit;
    currentClock: number;
    frameClocker: number;
    constructor(writer: WavSharer);
    audioSettings: AudioSettings;
    sampleRate: number;
    interruptRaised: boolean;
    enableSquare0: boolean;
    enableSquare1: boolean;
    enableTriangle: boolean;
    enableNoise: boolean;
    rebuildSound(): void;
    GetByte(Clock: number, address: number): number;
    SetByte(clock: number, address: number, data: number): void;
    advanceClock(ticks: number): void;
    updateFrame(time: number): void;
    runFrameEvents(time: number, step: number): void;
    endFrame(time: number): void;
    state: IChiChiAPUState;
}
