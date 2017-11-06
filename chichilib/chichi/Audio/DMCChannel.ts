import { Blip } from "./CommonAudio";

export class DMCChannel  {
    curSample: number;
    freqs = [
        0x1AC * 12,
        0x17C * 12,
        0x154 * 12,
        0x140 * 12,
        0x11E * 12,
        0x0FE * 12,
        0x0E2 * 12,
        0x0D6 * 12,
        0x0BE * 12,
        0x0A0 * 12,
        0x08E * 12,
        0x080 * 12,
        0x06A * 12,
        0x054 * 12,
        0x048 * 12,
        0x036 * 12
    ];
    frequency: number;
    Length: number;
    DutyCycle: number;
    Period: number;
    Volume: number;
    Time: number;
    Envelope: number;
    Looping: boolean;
    Enabled: boolean;
    Gain: number;
    SweepComplement: boolean;
    regs = {
        ctrl:  0,
        address: 0,
        lengthCounter: 0
    };
    out = {
        shifter : 0,
        dac: 0,
        buffer: 0,
        active : false
    }   

    REG0_FREQUENCY  = 0x0F;
    REG0_LOOP       = 0x40;
    REG0_IRQ_ENABLE = 0x80;
    INP_STEP        = 8;

    constructor(bleeper: Blip, chan: number) {

    }

    WriteRegister(register: number, data: number, time: number): void {
        switch (register) {
        case 0:
            this.regs.ctrl = data;
            this.frequency = this.freqs[data & this.REG0_FREQUENCY];
            break;
        case 1:
            this.out.dac = data & 0x7F;
            this.curSample = this.out.dac * this.Volume;
            break;
        case 2:
            this.regs.address = 0xC000 | (data << 6);
            break;
        case 3:
            this.regs.lengthCounter = (data << 4) + 1;
            break;
        }
    }

    Run(end_time: number): void {
        //throw new Error('Method not implemented.');
    }

    UpdateAmplitude(new_amp: number): void {
        // throw new Error('Method not implemented.');
    }

    EndFrame(time: number): void {
        //  throw new Error('Method not implemented.');
    }

    FrameClock(time: number, step: number): void {
        //  throw new Error('Method not implemented.');
    }


}