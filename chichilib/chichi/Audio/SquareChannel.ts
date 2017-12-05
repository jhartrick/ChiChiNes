import { IChannel } from "./IChannel";

export class SquareChannel implements IChannel {
    output: number = 0;
    playing =  true;
    
    private _chan = 0;
    private lengthCounts = new Uint8Array(
        [
            0x0A,0xFE,
	        0x14,0x02,
	        0x28,0x04,
	        0x50,0x06,
	        0xA0,0x08,
	        0x3C,0x0A,
	        0x0E,0x0C,
	        0x1A,0x0E,
	        0x0C,0x10,
	        0x18,0x12,
	        0x30,0x14,
	        0x60,0x16,
	        0xC0,0x18,
	        0x48,0x1A,
	        0x10,0x1C,
	        0x20,0x1E
        ]);

    private _length = 0;
    period = 0;
    private _rawTimer = 0;
    private volume = 0;
    private time = 0;
    private envelope = 0;
    private looping = false;
    private enabled = false;
    private doodies: number[] = [2, 6, 30, 249];
    private _sweepShift = 0;
    private _sweepCounter = 0;
    private _sweepDivider = 0;
    private _sweepNegateFlag = false;
    private _sweepEnabled = false;
    private _startSweep = false;
    private _sweepInvalid = false;
    private _phase = 0;
    private _envTimer = 0;
    private _envStart = false;
    private _envConstantVolume = false;
    private _envVolume = 0;


    constructor(chan: number, public onWriteAudio: (x: number)=> void) {
        this._chan = chan;

        this.enabled = true;
        this._sweepDivider = 1;
        this._envTimer = 15;
    }

    // properties
    length: number;
    sweepComplement = false;
    dutyCycle = 0;

    // functions
    writeRegister(register: number, data: number, time: number): void {
        switch (register) {
            case 0:
                this._envConstantVolume = (data & 0x10) === 0x10;
                this.volume = data & 15;
                this.dutyCycle = this.doodies[(data >> 6) & 0x3];
                this.looping = (data & 0x20) === 0x20;
                this._sweepInvalid = false;
                break;
            case 1:
                this._sweepShift = data & 7;
                this._sweepNegateFlag = (data & 8) === 8;
                this._sweepDivider = (data >> 4) & 7;
                this._sweepEnabled = (data & 0x80) === 0x80;
                this._startSweep = true;
                this._sweepInvalid = false;
                break;
            case 2:
                this.period &= 0x700;
                this.period |= data;
                this._rawTimer = this.period;
                break;
            case 3:
                this.period &= 0xFF;
                this.period |= (data & 7) << 8;
                this._rawTimer = this.period;
                this._phase = 0;
                // setup length
                if (this.enabled) {
                    this._length = this.lengthCounts[(data >> 3) & 0x1f];
                }
                this._envStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this._length = 0;
                }
                break;
        }
    }

    run(end_time: number): void {
        if (!this.playing) {
            this.time = end_time;
            this.output = 0;
            return ;
        }

        const period = this._sweepEnabled ? ((this.period + 1) & 0x7FF) << 1 : ((this._rawTimer + 1) & 0x7FF) << 1;

        if (period === 0) {
            this.time = end_time;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }

        const volume = this._envConstantVolume ? this.volume : this._envVolume;

        if (this._length === 0 || volume === 0 || this._sweepInvalid) {
            this._phase += ((end_time - this.time) / period) & 7;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }
        for (; this.time < end_time; this.time += period, this._phase++) {
            this.output = (this.dutyCycle >> (this._phase & 7) & 1) * volume;
            this.onWriteAudio(this.time);
        }
        this._phase &= 7;
    }
    

    endFrame(time: number): void {
        this.run(time);

        this.time = 0;
    }

    frameClock(time: number, step: number): void {
        this.run(time);

        if (!this._envStart) {
            this._envTimer--;
            if (this._envTimer === 0) {
                this._envTimer = this.volume + 1;
                if (this._envVolume > 0) {
                    this._envVolume--;
                } else {
                    this._envVolume = this.looping ? 15 : 0;
                }
            }
        } else {
            this._envStart = false;
            this._envTimer = this.volume + 1;
            this._envVolume = 15;
        }

        switch (step) {
            case 1:
            case 3:
                --this._sweepCounter;
                if (this._sweepCounter === 0) {
                    this._sweepCounter = this._sweepDivider + 1;
                    if (this._sweepEnabled && this._sweepShift > 0) {
                        var sweep = this.period >> this._sweepShift;
                        if (this.sweepComplement) {
                            this.period += this._sweepNegateFlag ? ~sweep : sweep;
                        } else {
                            this.period += this._sweepNegateFlag ? ~sweep + 1 : sweep;
                        }
                        this._sweepInvalid = (this._rawTimer < 8 || (this.period & 2048) === 2048);
                        //if (_sweepInvalid)
                        //{
                        //    _sweepInvalid = true;
                        //}
                    }
                }
                if (this._startSweep) {
                    this._startSweep = false;
                    this._sweepCounter = this._sweepDivider + 1;

                }
                if (!this.looping && this._length > 0) {
                    this._length--;
                }
                break;
        }
    }
}