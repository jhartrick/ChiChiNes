import { AudioSettings } from './ChiChiTypes'
import { DMCChannel } from './Audio/DMCChannel';
import { Blip, QueuedPort, WavSharer, PortWriteEntry } from './Audio/CommonAudio';




class NoiseChannel {
    private _bleeper: any = null;
    private _chan = 0;
    private NoisePeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
    private LengthCounts = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
    private _length = 0;
    private _period = 0;
    private _volume = 0;
    private _time = 0;
    private _envConstantVolume = false;
    private _envVolume = 0;
    private _looping = false;
    private _enabled = false;
    private amplitude = 0;
    private _phase = 0;
    private gain = 0;
    private _envTimer = 0;
    private _envStart = false;

    constructor(bleeper: Blip, chan: number) {
        this._bleeper = bleeper;
        this._chan = chan;
        this._enabled = true;
        this._phase = 1;
        this._envTimer = 15;

    }

    Length: number;

    get Period(): number {
        return this._period;
    }

    set Period(value: number) {
        this._period = value;
    }

    get Volume(): number {
        return this._volume;
    }

    set Volume(value: number) {
        this._volume = value;
    }


    get Time(): number {
        return this._time;
    }

    set Time(value: number) {
        this._time = value;
    }

    get Looping(): boolean {
        return this._looping;
    }

    set Looping(value: boolean) {
        this._looping = value;
    }

    get Enabled(): boolean {
        return this._enabled;
    }

    set Enabled(value: boolean) {
        this._enabled = value;
    }

    get Gain(): number {
        return this.gain;
    }

    set Gain(value: number) {
        this.gain = value;
    }

    WriteRegister(register: number, data: number, time: number): void {
        // Run(time);

        switch (register) {
            case 0:
                this._envConstantVolume = (data & 16) === 16;
                this._volume = data & 15;
                this._looping = (data & 128) === 128;
                break;
            case 1:
                break;
            case 2:
                this._period = this.NoisePeriods[data & 15];
                // _period |= data;
                break;
            case 3:
                // setup length
                if (this._enabled) {
                    this._length = this.LengthCounts[(data >> 3) & 31];
                }
                this._envStart = true;
                break;
            case 4:
                this._enabled = (data !== 0);
                if (!this._enabled) {
                    this._length = 0;
                }
                break;
        }
    }

    Run(end_time: number): void {
        var volume = this._envConstantVolume ? this._volume : this._envVolume;
        if (this._length === 0) {
            volume = 0;
        }
        if (this._period === 0) {
            this._time = end_time;
            this.UpdateAmplitude(0);
            return;
        }

        if (this._phase === 0) {
            this._phase = 1;
        }

        for (; this._time < end_time; this._time += this._period) {
            var new15;
            if (this._looping) {
                new15 = ((this._phase & 1) ^ ((this._phase >> 6) & 1));
            } else {
                new15 = ((this._phase & 1) ^ ((this._phase >> 1) & 1));
            }
            this.UpdateAmplitude(this._phase & 1 * volume);
            this._phase = ((this._phase >> 1) | (new15 << 14)) & 65535;



        }
    }

    UpdateAmplitude(amp: number) {
        var delta = amp * this.gain - this.amplitude;
        this.amplitude += delta;
        this._bleeper.blip_add_delta(this._time, delta);
    }

    EndFrame(time: number) {
        this.Run(time);
        this._time = 0;
    }

    FrameClock(time: number, step: number) {
        this.Run(time);

        if (!this._envStart) {
            this._envTimer--;
            if (this._envTimer === 0) {
                this._envTimer = this._volume + 1;
                if (this._envVolume > 0) {
                    this._envVolume--;
                } else {
                    this._envVolume = this._looping ? 15 : 0;
                }

            }
        } else {
            this._envStart = false;
            this._envTimer = this._volume + 1;
            this._envVolume = 15;
        }

        switch (step) {
            case 1:
            case 2:
                if (!this._looping && this._length > 0) {
                    this._length--;
                }
                break;
        }
    }
}

class TriangleChannel {
    private _bleeper: Blip;
    private _chan = 0;
    
    private LengthCounts = new Uint8Array([
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
        0x20,0x1E]);
    private _length = 0;
    private _period = 0;
    private _time = 0;
    private _envelope = 0;
    private _looping = false;
    private _enabled = false;
    private _amplitude = 0;
    private _gain = 0;
    private _linCtr = 0;
    private _phase = 0;
    private _linVal = 0;
    private _linStart = false;

    constructor(bleeper: Blip, chan: number) {
        this._bleeper = bleeper;
        this._chan = chan;

        this._enabled = true;
    }

    get Period(): number {
        return this._period;
    }

    set Period(value: number) {
        this._period = value;
    }


    get Time(): number {
        return this._time;
    }

    set Time(value: number) {
        this._time = value;
    }

    get Envelope(): number {
        return this._envelope;
    }

    set Envelope(value: number) {
        this._envelope = value;
    }
    get Looping(): boolean {
        return this._looping;
    }

    set Looping(value: boolean) {
        this._looping = value;
    }

    get Enabled(): boolean {
        return this._enabled;
    }

    set Enabled(value: boolean) {
        this._enabled = value;
    }

    get Gain(): number {
        return this._gain;
    }

    set Gain(value: number) {
        this._gain = value;
    }

    get Amplitude(): number {
        return this._amplitude;
    }

    set Amplitude(value: number) {
        this._amplitude = value;
    }

    get Length(): number {
        return this._length;
    }

    set Length(value: number) {
        this._length = value;
    }


    WriteRegister(register: number, data: number, time: number): void {
        //Run(time);

        switch (register) {
            case 0:
                this._looping = (data & 0x80) === 0x80;
                this._linVal = data & 0x7F;
                break;
            case 1:
                break;
            case 2:
                this._period &= 0x700;
                this._period |= data;
                break;
            case 3:
                this._period &= 0xFF;
                this._period |= (data & 7) << 8;
                // setup lengthhave
                if (this._enabled) {
                    this._length = this.LengthCounts[(data >> 3) & 0x1f];
                }
                this._linStart = true;
                break;
            case 4:
                this._enabled = (data !== 0);
                if (!this._enabled) {
                    this._length = 0;
                }
                break;
        }
    }
    Run(end_time: number): void {
        var period = this._period + 1;
        if (this._linCtr === 0 || this._length === 0 || this._period < 4) {
            // leave it at it's current phase
            this._time = end_time;
            return;
        }

        for (; this._time < end_time; this._time += period, this._phase = (this._phase + 1) % 32) {
            this.UpdateAmplitude(this._phase < 16 ? this._phase : 31 - this._phase);
        }
    }
    UpdateAmplitude(new_amp: number): void {
        var delta = new_amp * this._gain - this._amplitude;
        this._amplitude += delta;
        this._bleeper.blip_add_delta(this._time, delta);
    }
    EndFrame(time: number): void {
        this.Run(time);
        this._time = 0;
    }
    FrameClock(time: number, step: number): void {
        this.Run(time);

        if (this._linStart) {
            this._linCtr = this._linVal;

        } else {
            if (this._linCtr > 0) {
                this._linCtr--;
            }
        }

        if (!this._looping) {
            this._linStart = false;
        }

        switch (step) {
            case 1:
            case 3:
                if (this._length > 0 && !this._looping) {
                    this._length--;
                }
                break;
        }
    }

}

class SquareChannel {
    Length: number;
    private _chan = 0;
    private _bleeper: Blip = null;
    private LengthCounts = new Uint8Array(
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
    private _dutyCycle = 0;
    private _length = 0;
    private _timer = 0;
    private _rawTimer = 0;
    private _volume = 0;
    private _time = 0;
    private _envelope = 0;
    private _looping = false;
    private _enabled = false;
    private _amplitude = 0;
    private doodies: number[] = [2, 6, 30, 249];
    private _sweepShift = 0;
    private _sweepCounter = 0;
    private _sweepDivider = 0;
    private _sweepNegateFlag = false;
    private _sweepEnabled = false;
    private _startSweep = false;
    private _sweepInvalid = false;
    private _phase = 0;
    private _gain = 0;
    private _envTimer = 0;
    private _envStart = false;
    private _envConstantVolume = false;
    private _envVolume = 0;
    private _sweepComplement = false;

    constructor(bleeper: Blip, chan: number) {
        this._bleeper = bleeper;
        this._chan = chan;

        this._enabled = true;
        this._sweepDivider = 1;
        this._envTimer = 15;
    }
    // properties
    get DutyCycle(): number {
        return this._dutyCycle;
    }

    set DutyCycle(value: number) {
        this._dutyCycle = value;
    }

    get Period(): number {
        return this._timer;
    }

    set Period(value: number) {
        this._timer = value;
    }

    get Volume(): number {
        return this._volume;
    }

    set Volume(value: number) {
        this._volume = value;
    }

    get Time(): number {
        return this._time;
    }

    set Time(value: number) {
        this._time = value;
    }

    get Envelope(): number {
        return this._envelope;
    }

    set Envelope(value: number) {
        this._envelope = value;
    }

    get Looping(): boolean {
        return this._looping;
    }

    set Looping(value: boolean) {
        this._looping = value;
    }

    get Enabled(): boolean {
        return this._enabled;
    }

    set Enabled(value: boolean) {
        this._enabled = value;
    }

    get Gain(): number {
        return this._gain;
    }

    set Gain(value: number) {
        this._gain = value;
    }

    get SweepComplement(): boolean {
        return this._sweepComplement;
    }

    set SweepComplement(value: boolean) {
        this._sweepComplement = value;
    }

    // functions
    WriteRegister(register: number, data: number, time: number): void {
        switch (register) {
            case 0:
                this._envConstantVolume = (data & 0x10) === 0x10;
                this._volume = data & 15;
                this._dutyCycle = this.doodies[(data >> 6) & 0x3];
                this._looping = (data & 0x20) === 0x20;
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
                this._timer &= 0x700;
                this._timer |= data;
                this._rawTimer = this._timer;
                break;
            case 3:
                this._timer &= 0xFF;
                this._timer |= (data & 7) << 8;
                this._rawTimer = this._timer;
                this._phase = 0;
                // setup length
                if (this._enabled) {
                    this._length = this.LengthCounts[(data >> 3) & 0x1f];
                }
                this._envStart = true;
                break;
            case 4:
                this._enabled = (data !== 0);
                if (!this._enabled) {
                    this._length = 0;
                }
                break;
        }
    }

    Run(end_time: number): void {
        const period = this._sweepEnabled ? ((this._timer + 1) & 0x7FF) << 1 : ((this._rawTimer + 1) & 0x7FF) << 1;

        if (period === 0) {
            this._time = end_time;
            this.UpdateAmplitude(0);
            return;
        }

        const volume = this._envConstantVolume ? this._volume : this._envVolume;


        if (this._length === 0 || volume === 0 || this._sweepInvalid) {
            this._phase += ((end_time - this._time) / period) & 7;
            this._time = end_time;
            this.UpdateAmplitude(0);
            return;
        }
        for (; this._time < end_time; this._time += period, this._phase++) {
            this.UpdateAmplitude((this._dutyCycle >> (this._phase & 7) & 1) * volume);
        }
        this._phase &= 7;
    }
    UpdateAmplitude(new_amp: number): void {
        const delta = new_amp * this._gain - this._amplitude;

        this._amplitude += delta;
        this._bleeper.blip_add_delta(this._time, delta);
    }
    EndFrame(time: number): void {
        this.Run(time);

        this._time = 0;
    }
    FrameClock(time: number, step: number): void {
        this.Run(time);

        if (!this._envStart) {
            this._envTimer--;
            if (this._envTimer === 0) {
                this._envTimer = this._volume + 1;
                if (this._envVolume > 0) {
                    this._envVolume--;
                } else {
                    this._envVolume = this._looping ? 15 : 0;
                }
            }
        } else {
            this._envStart = false;
            this._envTimer = this._volume + 1;
            this._envVolume = 15;
        }

        switch (step) {
            case 1:
            case 3:
                --this._sweepCounter;
                if (this._sweepCounter === 0) {
                    this._sweepCounter = this._sweepDivider + 1;
                    if (this._sweepEnabled && this._sweepShift > 0) {
                        var sweep = this._timer >> this._sweepShift;
                        if (this._sweepComplement) {
                            this._timer += this._sweepNegateFlag ? ~sweep : sweep;
                        } else {
                            this._timer += this._sweepNegateFlag ? ~sweep + 1 : sweep;
                        }
                        this._sweepInvalid = (this._rawTimer < 8 || (this._timer & 2048) === 2048);
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
                if (!this._looping && this._length > 0) {
                    this._length--;
                }
                break;
        }
    }
}

export class ChiChiBopper {

    set audioSettings(value: AudioSettings) {
        this.EnableNoise = value.enableNoise;
        this.EnableSquare0 = value.enableSquare0;
        this.EnableSquare1 = value.enableSquare1;
        this.enableTriangle = value.enableTriangle;
        if (value.sampleRate != this._sampleRate) {
            this._sampleRate = value.sampleRate;
            this.RebuildSound();
        }
    }

    get audioSettings(): AudioSettings {
        const settings = new AudioSettings();
        settings.sampleRate = this._sampleRate;
        settings.enableNoise = this.EnableNoise;
        settings.enableSquare0 = this.EnableSquare0;
        settings.enableSquare1 = this.EnableSquare1;
        settings.enableTriangle = this.enableTriangle;
        return settings;
    }

    lastClock: number;
    throwingIRQs: boolean = false;
    reg15: number = 0;
    // blipper
    private myBlipper: Blip;
    // channels 
    private square0: SquareChannel;
    private square1: SquareChannel;
    private triangle: TriangleChannel;
    private noise: NoiseChannel;
    private dmc: DMCChannel;


    private master_vol = 4369;
    private static clock_rate = 1789772.727;
    private registers = new QueuedPort();
    private _sampleRate = 44100;
    private square0Gain = 873;
    private square1Gain = 873;
    private triangleGain = 1004;
    private noiseGain = 567;
    private muted = false;
    private lastFrameHit = 0;

    constructor(public writer: WavSharer) {
        this.RebuildSound();
    }
    get SampleRate(): number {
        return this._sampleRate;
    }

    set sampleRate(value: number) {
        this._sampleRate = value;
        this.RebuildSound();
    }

    //Muted: boolean;
    InterruptRaised: boolean;
    get EnableSquare0(): boolean {
        return this.square0.Gain > 0;
    }

    set EnableSquare0(value: boolean) {
        this.square0.Gain = value ? this.square0Gain : 0;
    }

    get EnableSquare1(): boolean {
        return this.square1.Gain > 0;
    }

    set EnableSquare1(value: boolean) {
        this.square1.Gain = value ? this.square1Gain : 0;
    }

    get enableTriangle(): boolean {
        return this.triangle.Gain > 0;
    }

    set enableTriangle(value: boolean) {
        this.triangle.Gain = value ? this.triangleGain : 0;
    }

    get EnableNoise(): boolean {
        return this.noise.Gain > 0;
    }

    set EnableNoise(value: boolean) {
        this.noise.Gain = value ? this.noiseGain : 0;
    }

    NMIHandler: () => void;
    IRQAsserted: boolean;
    NextEventAt: number;

    RebuildSound(): void {
        this.myBlipper = new Blip(this._sampleRate / 5);
        this.myBlipper.blip_set_rates(ChiChiBopper.clock_rate, this._sampleRate);
        //this.writer = new ChiChiNES.BeepsBoops.WavSharer();
        this.writer.audioBytesWritten = 0;

        this.registers.clear();
        this.InterruptRaised = false;
        this.square0Gain = 873;
        this.square1Gain = 873;
        this.triangleGain = 1004;
        this.noiseGain = 567;

        this.square0 = new SquareChannel(this.myBlipper, 0);
        this.square0.Gain = this.square0Gain;
        this.square0.Period = 10;
        this.square0.SweepComplement = true;

        this.square1 = new SquareChannel(this.myBlipper, 0);
        this.square1.Gain = this.square1Gain;
        this.square1.Period = 10;
        this.square1.SweepComplement = false;

        this.triangle = new TriangleChannel(this.myBlipper, 2);
        this.triangle.Gain = this.triangleGain; this.triangle.Period = 0;

        this.noise = new NoiseChannel(this.myBlipper, 3);
        this.noise.Gain = this.noiseGain; this.noise.Period = 0;

        this.dmc = new DMCChannel(this.myBlipper, 4, null);
      //  this.dmc.Gain = 873; this.dmc.Period = 10;
    }

    GetByte(Clock: number, address: number): number {
        if (address === 16384) {
            this.InterruptRaised = false;
        }
        if (address === 16405) {
            return this.ReadStatus();
        } else {
            return 66;
        }
    }

    ReadStatus(): number {
        return ((this.square0.Length > 0) ? 1 : 0) | ((this.square1.Length > 0) ? 2 : 0) | ((this.triangle.Length > 0) ? 4 : 0) | ((this.square0.Length > 0) ? 8 : 0) | (this.InterruptRaised ? 64 : 0);
    }

    SetByte(Clock: number, address: number, data: number): void {
        if (address === 16384) {
            this.InterruptRaised = false;
        }
        this.DoSetByte(Clock, address, data);
        this.registers.enqueue(new PortWriteEntry(Clock, address, data));

    }

    DoSetByte(Clock: number, address: number, data: number): void {
        switch (address) {
            case 16384:
            case 16385:
            case 16386:
            case 16387:
                this.square0.WriteRegister(address - 16384, data, Clock);
                break;
            case 16388:
            case 16389:
            case 16390:
            case 16391:
                this.square1.WriteRegister(address - 16388, data, Clock);
                break;
            case 16392:
            case 16393:
            case 16394:
            case 16395:
                this.triangle.WriteRegister(address - 16392, data, Clock);
                break;
            case 16396:
            case 16397:
            case 16398:
            case 16399:
                this.noise.WriteRegister(address - 16396, data, Clock);
                break;
            case 16400:
            case 16401:
            case 16402:
            case 16403:
                // dmc.WriteRegister(address - 0x40010, data, Clock);
                break;
            case 16405:
                this.reg15 = data;
                this.square0.WriteRegister(4, data & 1, Clock);
                this.square1.WriteRegister(4, data & 2, Clock);
                this.triangle.WriteRegister(4, data & 4, Clock);
                this.noise.WriteRegister(4, data & 8, Clock);
                break;
            case 16407:
                this.throwingIRQs = ((data & 64) !== 64);
                this.lastFrameHit = 0;
                break;
        }
    }

    UpdateFrame(time: number): void {
        if (this.muted) {
            return;
        }

        this.RunFrameEvents(time, this.lastFrameHit);
        if (this.lastFrameHit === 3) {

            if (this.throwingIRQs) {
                this.InterruptRaised = true;
            }
            this.lastFrameHit = 0;
            //EndFrame(time);
        } else {
            this.lastFrameHit++;
        }

    }

    RunFrameEvents(time: number, step: number): void {
        this.triangle.FrameClock(time, step);
        this.noise.FrameClock(time, step);
        this.square0.FrameClock(time, step);
        this.square1.FrameClock(time, step);
    }

    EndFrame(time: number): void {
        this.square0.EndFrame(time);
        this.square1.EndFrame(time);
        this.triangle.EndFrame(time);
        this.noise.EndFrame(time);

        if (!this.muted) {
            this.myBlipper.blip_end_frame(time);
        }


        //var count = this.myBlipper.ReadBytes(this.writer.SharedBuffer, this.writer.SharedBuffer.length / 2, 0);
       // const startPos = this.writer.sharedAudioBufferPos;
        this.myBlipper.ReadElementsLoop(this.writer);
        //this.writer.audioBytesWritten += count;
        //this.writer.sharedAudioBufferPos += count;
        //this.writer.WavesWritten(count);
    }

    FlushFrame(time: number): void {

        let currentClock = 0;
        let frameClocker = 0;
        let currentEntry;
        while (this.registers.Count > 0) {
            currentEntry = this.registers.dequeue();
            if (frameClocker > 7445) {
                frameClocker -= 7445;
                this.UpdateFrame(7445);
            }
            this.DoSetByte(currentEntry.time, currentEntry.address, currentEntry.data);
            currentClock = currentEntry.time;
            frameClocker = currentEntry.time;
        }

        // hit the latest frame boundary, maybe too much math for too little reward
        let clockDelta = currentClock % 7445;

        if (this.lastFrameHit === 0) {
            this.UpdateFrame(7445);
        }
        while (this.lastFrameHit > 0) {
            this.UpdateFrame(7445 * (this.lastFrameHit + 1));
        }
    }

    HandleEvent(Clock: number): void {
        this.UpdateFrame(Clock);
        this.lastClock = Clock;

        if (Clock > 29780) {
            this.writer;
            {
                this.EndFrame(Clock);
            }
        }
    }
    ResetClock(Clock: number): void {
        this.lastClock = Clock;
    }

}
