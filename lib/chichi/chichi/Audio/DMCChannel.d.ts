import { Channel } from "./IChannel";
export declare class DMCChannel implements Channel {
    onWriteAudio: (time: number) => void;
    private handleDma;
    playing: boolean;
    output: number;
    interruptRaised: boolean;
    private time;
    private internalClock;
    private isFetching;
    private buffer;
    private bufferIsEmpty;
    private outbits;
    private freqTable;
    private shiftreg;
    private silenced;
    private cycles;
    private nextRead;
    private lengthCounter;
    length: number;
    private address;
    private interruptEnabled;
    private frequency;
    private loopFlag;
    private _chan;
    constructor(chan: number, onWriteAudio: (time: number) => void, handleDma: (address: number) => number);
    writeRegister(register: number, data: number, time: number): void;
    run(endTime: number): void;
    fetch(): void;
    endFrame(time: number): void;
}
