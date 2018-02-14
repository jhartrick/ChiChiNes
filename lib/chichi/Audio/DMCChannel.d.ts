import { Blip } from "./CommonAudio";
import { ChiChiCPPU } from "../ChiChiMachine";
export declare class DMCChannel {
    private cpu;
    time: number;
    internalClock: number;
    fetching: boolean;
    buffer: number;
    bufempty: boolean;
    outbits: number;
    freqTable: number[];
    shiftreg: number;
    silenced: boolean;
    cycles: number;
    curAddr: number;
    lengthCtr: number;
    length: number;
    addr: number;
    pos: number;
    pcmdata: number;
    doirq: number;
    frequency: number;
    wavehold: number;
    _chan: number;
    delta: number;
    private _bleeper;
    constructor(bleeper: Blip, chan: number, cpu: ChiChiCPPU);
    WriteRegister(register: number, data: number, time: number): void;
    Run(end_time: number): void;
    fetch(): void;
    UpdateAmplitude(new_amp: number): void;
    EndFrame(time: number): void;
    FrameClock(time: number, step: number): void;
}
