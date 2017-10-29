import { AudioSettings } from './ChiChiTypes';
export declare class WavSharer {
    
       
    bufferWasRead: boolean;
    static sample_size: number;
    Locker: any;

    NESTooFast: boolean;
    Frequency: number;
    SharedBuffer: any;
    SharedBufferLength: number;
    BufferAvailable: boolean;
    constructor();
    BytesWritten: (sender: any, e: any) => void;
    WavesWritten(remain: number): void;
    ReadWaves(): void;
    SetSharedBuffer(values: any): void;
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
