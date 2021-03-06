import { Channel } from "./IChannel";
export declare class SquareChannel implements Channel {
    onWriteAudio: (x: number) => void;
    output: number;
    playing: boolean;
    private channelNumber;
    private lengthCounts;
    private latchedLength;
    period: number;
    private rawTimer;
    private volume;
    private time;
    private envelope;
    private looping;
    private enabled;
    private doodies;
    private sweepShift;
    private sweepCounter;
    private sweepDivider;
    private sweepNegateFlag;
    private sweepEnabled;
    private startSweep;
    private sweepInvalid;
    private phase;
    private envelopeTimer;
    private envelopeStart;
    private envelopeConstantVolume;
    private envelopeVolume;
    constructor(chan: number, onWriteAudio: (x: number) => void);
    length: number;
    sweepComplement: boolean;
    dutyCycle: number;
    writeRegister(register: number, data: number, time: number): void;
    run(end_time: number): void;
    endFrame(time: number): void;
    frameClock(time: number, step: number): void;
}
