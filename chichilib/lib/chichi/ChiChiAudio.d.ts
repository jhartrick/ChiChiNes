import { AudioSettings } from './ChiChiTypes';
export declare class WavSharer {
    readonly NES_BYTES_WRITTEN: number;
    readonly WAVSHARER_BLOCKTHREAD: number;
    controlBuffer: Int32Array;
    sharedAudioBufferPos: number;
    bufferWasRead: boolean;
    static sample_size: number;
    SharedBuffer: Float32Array;
    SharedBufferLength: number;
    chunkSize: number;
    constructor();
    audioBytesWritten: number;
    wakeSleepers(): void;
    synchronize(): void;
}
export declare class ChiChiBopper {
    writer: WavSharer;
    audioSettings: AudioSettings;
    lastClock: number;
    throwingIRQs: boolean;
    reg15: number;
    private myBlipper;
    private square0;
    private square1;
    private triangle;
    private noise;
    private dmc;
    private master_vol;
    private static clock_rate;
    private registers;
    private _sampleRate;
    private square0Gain;
    private square1Gain;
    private triangleGain;
    private noiseGain;
    private muted;
    private lastFrameHit;
    constructor(writer: WavSharer);
    readonly SampleRate: number;
    sampleRate: number;
    Muted: boolean;
    InterruptRaised: boolean;
    EnableSquare0: boolean;
    EnableSquare1: boolean;
    enableTriangle: boolean;
    EnableNoise: boolean;
    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;
    RebuildSound(): void;
    GetByte(Clock: number, address: number): number;
    ReadStatus(): number;
    SetByte(Clock: number, address: number, data: number): void;
    DoSetByte(Clock: number, address: number, data: number): void;
    UpdateFrame(time: number): void;
    RunFrameEvents(time: number, step: number): void;
    EndFrame(time: number): void;
    FlushFrame(time: number): void;
    HandleEvent(Clock: number): void;
    ResetClock(Clock: number): void;
}
