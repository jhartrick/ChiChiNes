import { AudioSettings } from './ChiChiTypes'

// shared buffer to get sound out
export class WavSharer  {
    sharedAudioBufferPos: number = 0;
    bufferWasRead: boolean;
    static sample_size = 1;

    Frequency: number = 48000;
    SharedBuffer: Float32Array;
    SharedBufferLength: number = 8192;

    BufferAvailable: boolean = true;

    constructor() {
        this.SharedBuffer = new Float32Array(this.SharedBufferLength);
    }

        
        // private flushAudio() {
        // //  debugger;
        //     const len = this.SharedBufferLength;

        //     for (let i = 0; i < len; ++i) {
        //         this.sharedAudioBufferPos++;
        //         if (this.sharedAudioBufferPos >= this.sharedAudioBuffer.length) {
        //             this.sharedAudioBufferPos = 0;
        //         }
        //         this.sharedAudioBuffer[this.sharedAudioBufferPos ] = this.machine.WaveForms.SharedBuffer[i];
        //         this.audioBytesWritten++;
        //     }
        //     while (this.audioBytesWritten >= this.sharedAudioBuffer.length >> 2) {
        //         <any>Atomics.store(this.iops, 3, this.audioBytesWritten);
        //         <any>Atomics.wait(this.iops, 3, this.audioBytesWritten);
        //         this.audioBytesWritten = <any>Atomics.load(this.iops, 3);
        //     }

        // }
        

        BytesWritten: (sender: any, e: any) => void;
        WavesWritten(remain: number): void {

        var n = (this.SharedBuffer.length / WavSharer.sample_size) | 0;
        if (n > remain) {
            n = remain;
        }
        this.SharedBufferLength = n;

        //if (fileWriting)
        //{
        //        appendToFile.WriteWaves(_sharedBuffer, _sharedBufferLength);
        //}
        this.bufferWasRead = false;
        this.BufferAvailable = true;
    }

    ReadWaves(): void {

        this.BufferAvailable = false;
        this.SharedBufferLength = 0;
        this.bufferWasRead = true;
        // bufferReadResetEvent.Set();
    }

    SetSharedBuffer(values: any): void {
        this.SharedBuffer = values;
    }


}


//apu classes
class blip_buffer_t  {
    constructor(public size: number) {
        this.samples = new Array<number>(size);
        this.samples.fill(0);
    }
    factor: number = 0;
    samples: Array<number>;
    offset = 0;
    avail = 0;
    integrator = 0;
    time_bits = 0;
    arrayLength = 0;
}

class Blip  {
    static time_unit = 2097152;
    static buf_extra = 18;
    static phase_count = 32;
    static time_bits = 21;

    private bass_shift = 8;
    private end_frame_extra = 2;
    private half_width = 8;
    private phase_bits = 5;
    static delta_bits = 15;

    //sinc values
    static bl_step = [[43, -115,
        350,
        -488,
        1136,
        -914,
        5861,
        21022
    ], [
        44,
        -118,
        348,
        -473,
        1076,
        -799,
        5274,
        21001
    ], [
        45,
        -121,
        344,
        -454,
        1011,
        -677,
        4706,
        20936
    ], [
        46,
        -122,
        336,
        -431,
        942,
        -549,
        4156,
        20829
    ], [
        47,
        -123,
        327,
        -404,
        868,
        -418,
        3629,
        20679
    ], [
        47,
        -122,
        316,
        -375,
        792,
        -285,
        3124,
        20488
    ], [
        47,
        -120,
        303,
        -344,
        714,
        -151,
        2644,
        20256
    ], [
        46,
        -117,
        289,
        -310,
        634,
        -17,
        2188,
        19985
    ], [
        46,
        -114,
        273,
        -275,
        553,
        117,
        1758,
        19675
    ], [
        44,
        -108,
        255,
        -237,
        471,
        247,
        1356,
        19327
    ], [
        43,
        -103,
        237,
        -199,
        390,
        373,
        981,
        18944
    ], [
        42,
        -98,
        218,
        -160,
        310,
        495,
        633,
        18527
    ], [
        40,
        -91,
        198,
        -121,
        231,
        611,
        314,
        18078
    ], [
        38,
        -84,
        178,
        -81,
        153,
        722,
        22,
        17599
    ], [
        36,
        -76,
        157,
        -43,
        80,
        824,
        -241,
        17092
    ], [
        34,
        -68,
        135,
        -3,
        8,
        919,
        -476,
        16558
    ], [
        32,
        -61,
        115,
        34,
        -60,
        1006,
        -683,
        16001
    ], [
        29,
        -52,
        94,
        70,
        -123,
        1083,
        -862,
        15422
    ], [
        27,
        -44,
        73,
        106,
        -184,
        1152,
        -1015,
        14824
    ], [
        25,
        -36,
        53,
        139,
        -239,
        1211,
        -1142,
        14210
    ], [
        22,
        -27,
        34,
        170,
        -290,
        1261,
        -1244,
        13582
    ], [
        20,
        -20,
        16,
        199,
        -335,
        1301,
        -1322,
        12942
    ], [
        18,
        -12,
        -3,
        226,
        -375,
        1331,
        -1376,
        12293
    ], [
        15,
        -4,
        -19,
        250,
        -410,
        1351,
        -1408,
        11638
    ], [
        13,
        3,
        -35,
        272,
        -439,
        1361,
        -1419,
        10979
    ], [
        11,
        9,
        -49,
        292,
        -464,
        1362,
        -1410,
        10319
    ], [
        9,
        16,
        -63,
        309,
        -483,
        1354,
        -1383,
        9660
    ], [
        7,
        22,
        -75,
        322,
        -496,
        1337,
        -1339,
        9005
    ], [
        6,
        26,
        -85,
        333,
        -504,
        1312,
        -1280,
        8355
    ], [
        4,
        31,
        -94,
        341,
        -507,
        1278,
        -1205,
        7713
    ], [
        3,
        35,
        -102,
        347,
        -506,
        1238,
        -1119,
        7082
    ], [
        1,
        40,
        -110,
        350,
        -499,
        1190,
        -1021,
        6464
    ], [
        0,
        43,
        -115,
        350,
        -488,
        1136,
        -914,
        5861
    ]];

    // functions
    constructor(size: number) {
        this.blip_new(size);
    }

    BlipBuffer: blip_buffer_t;
    blip_samples_avail: number;
    blip_new(size: number): void {
        this.BlipBuffer = new blip_buffer_t(size);
        this.BlipBuffer.size = size;
        this.BlipBuffer.factor = 0;
        this.blip_clear();
    }

    blip_set_rates(clock_rate: number, sample_rate: number): void {
        this.BlipBuffer.factor = Blip.time_unit / clock_rate * sample_rate + (0.9999847412109375);
    }
    blip_clear(): void {
        this.BlipBuffer.offset = 0;
        this.BlipBuffer.avail = 0;
        this.BlipBuffer.integrator = 0;
        this.BlipBuffer.samples = new Array<number>(this.BlipBuffer.size + Blip.buf_extra);
        this.BlipBuffer.samples.fill(0);
    }
    blip_clocks_needed(samples: number): number {
        const needed = samples * Blip.time_unit - this.BlipBuffer.offset;

        /* Fails if buffer can't hold that many more samples */
        //assert( s->avail + samples <= s->size );
        return ((needed + this.BlipBuffer.factor - 1) / this.BlipBuffer.factor) | 0;
    }

    blip_end_frame(t: number): void {
        let off = t * this.BlipBuffer.factor + this.BlipBuffer.offset;
        this.BlipBuffer.avail += off >> Blip.time_bits;
        this.BlipBuffer.offset = off & (Blip.time_unit - 1);
    }
    remove_samples(count: number): void {
        var remain = this.BlipBuffer.avail + Blip.buf_extra - count;
        this.BlipBuffer.avail -= count;
        this.BlipBuffer.samples.copyWithin(0, count, count + remain);

        //for (let i = 0; i < remain; i++) {
        //     this.BlipBuffer.samples[count + i] = this.BlipBuffer.samples[i];
        // }

        this.BlipBuffer.samples.fill(0, remain, remain + count);
        //for (let i = 0;i < count; ++i) {
        //    this.BlipBuffer.samples[i + remain] = 0;
        //} 

        //        this.BlipBuffer.samples = this
        //        System.Array.copy(this._blipBuffer.samples, count, this._blipBuffer.samples, 0, remain);
        //        System.Array.fill(this._blipBuffer.samples, 0, remain, count);

        this.BlipBuffer.arrayLength = count;
    }

    ReadBytes(outbuf: any, count: number, stereo: number): number {
        if (count > this.BlipBuffer.avail) {
            count = this.BlipBuffer.avail;
        }

        if (count !== 0) {
            const step = 1;
            //int inPtr  = BLIP_SAMPLES( s );
            //buf_t const* end = in + count;
            let inPtr = 0, outPtr = 0;
            let endPtr = inPtr + count;
            let sum = this.BlipBuffer.integrator;

            do {
                let st = sum >> Blip.delta_bits; /* assumes right shift preserves sign */
                sum = sum + this.BlipBuffer.samples[inPtr];
                inPtr++;
                if (st !== st) {
                    st = (st >> 31) ^ 32767;
                }
                var f = st / 65536; // (st/0xFFFF) * 2 - 1;
                //if (f < -1) {
                //    f = -1;
                //}
                //if (f > 1) {
                //    f = 1;
                //}
                outbuf[outPtr] = f;
                // outbuf[outPtr+ 1] = (byte)(st >> 8);
                outPtr += step;
                sum = sum - (st << (7));
            } while (inPtr !== endPtr);

            this.BlipBuffer.integrator = sum;

            this.remove_samples(count);
        }

        return count;
    }

    // reads 'count' elements into array 'outbuf', beginning at 'start' and looping at array boundary if needed
    // returns number of elements written
    ReadElementsLoop(outbuf: any, count: number, start: number): number {
        if (count > this.BlipBuffer.avail) {
            count = this.BlipBuffer.avail;
        }
        let inPtr = 0, outPtr = start;
        let endPtr = inPtr + count;
        let sum = this.BlipBuffer.integrator;

        if (count !== 0) {
            const step = 1;
            //int inPtr  = BLIP_SAMPLES( s );
            //buf_t const* end = in + count;

            do {
                let st = sum >> Blip.delta_bits; /* assumes right shift preserves sign */
                sum = sum + this.BlipBuffer.samples[inPtr];
                inPtr++;
                if (st !== st) {
                    st = (st >> 31) ^ 32767;
                }
                var f = st / 65536; // (st/0xFFFF) * 2 - 1;
                //if (f < -1) {
                //    f = -1;
                //}
                //if (f > 1) {
                //    f = 1;
                //}
                outbuf[outPtr] = f;
                // outbuf[outPtr+ 1] = (byte)(st >> 8);
                outPtr += step;
                if (outPtr >= outbuf.length) {
                    outPtr=0;
                }
                sum = sum - (st << (7));
            } while (inPtr !== endPtr);

            this.BlipBuffer.integrator = sum;

            this.remove_samples(count);
        }

        return outPtr;
    }


    blip_add_delta(time: number, delta: number): void {
        if (delta === 0) {
            return;
        }
        const fixedTime = (time * this.BlipBuffer.factor + this.BlipBuffer.offset) | 0;

        const outPtr = (this.BlipBuffer.avail + (fixedTime >> Blip.time_bits));

        const phase_shift = 16;
        //const phase = System.Int64.clip32(fixedTime.shr(phase_shift).and(System.Int64((Blip.phase_count - 1))));
        const phase = (fixedTime >> phase_shift & (Blip.phase_count - 1)) >>> 0;

        const inStep = phase; // bl_step[phase];
        const rev = Blip.phase_count - phase; // bl_step[phase_count - phase];

        const interp_bits = 15;
        const interp = (fixedTime >> (phase_shift - interp_bits) & ((1 << interp_bits) - 1));
        const delta2 = (delta * interp) >> interp_bits;
        delta -= delta2;

        /* Fails if buffer size was exceeded */
        //assert( out <= &BLIP_SAMPLES( s ) [s->size] );

        for (var i = 0; i < 8; ++i) {
            this.BlipBuffer.samples[outPtr + i] += (Blip.bl_step[inStep][i] * delta) + (Blip.bl_step[inStep][i] * delta2);
            this.BlipBuffer.samples[outPtr + (15 - i)] += (Blip.bl_step[rev][i] * delta) + (Blip.bl_step[rev - 1][i] * delta2);
        }

    }
    blip_add_delta_fast(time: number, delta: number): void {
        const fixedTime = time * this.BlipBuffer.factor + this.BlipBuffer.offset;

        const outPtr = this.BlipBuffer.avail + (fixedTime >> Blip.time_bits);

        const delta_unit = 1 << Blip.delta_bits;
        const phase_shift = Blip.time_bits - Blip.delta_bits;
        const phase = fixedTime >> phase_shift & (delta_unit - 1);
        const delta2 = delta * phase;

        /* Fails if buffer size was exceeded */
        //assert( out <= &BLIP_SAMPLES( s ) [s->size] );


        this.BlipBuffer.samples[outPtr + 8] += delta * delta_unit - delta2;
        this.BlipBuffer.samples[outPtr + 9] += delta2;
        //out [8] += delta * delta_unit - delta2;
        //out [9] += delta2;
    }

}

class PortWriteEntry {
    constructor(public time: number, public address: number, public data: number) { }
}

class QueuedPort {
    private array = new Array<PortWriteEntry>();

    get Count(): number {
        return this.array.length;
    }

    clear() {
        this.array.length = 0;
    }
    enqueue(item: PortWriteEntry) {
        this.array.push(item);
    }

    dequeue(): PortWriteEntry {
        return this.array.pop();
    }

}

class DMCChannel  {
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

    constructor(bleeper: Blip, chan: number) {

    }

    WriteRegister(register: number, data: number, time: number): void {
        //throw new Error('Method not implemented.');
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
        var period = this._sweepEnabled ? ((this._timer + 1) & 0x7FF) << 1 : ((this._rawTimer + 1) & 0x7FF) << 1;

        if (period === 0) {
            this._time = end_time;
            this.UpdateAmplitude(0);
            return;
        }

        var volume = this._envConstantVolume ? this._volume : this._envVolume;


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
        //this._sampleRate = value.sampleRate;
        this.EnableNoise = value.enableNoise;
        this.EnableSquare0 = value.enableSquare0;
        this.EnableSquare1 = value.enableSquare1;
        this.enableTriangle = value.enableTriangle;
        //this.RebuildSound();
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
    private _sampleRate = 48000;
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

    Muted: boolean;
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
        this.writer.Frequency = this.sampleRate;
        //this.writer.

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

        this.dmc = new DMCChannel(this.myBlipper, 4);
        this.dmc.Gain = 873; this.dmc.Period = 10;
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


        var count = this.myBlipper.ReadBytes(this.writer.SharedBuffer, this.writer.SharedBuffer.length / 2, 0);
        //var count = this.myBlipper.ReadBytesLoop(this.writer.SharedBuffer, this.writer.SharedBuffer.length, start, 0 )
        this.writer.WavesWritten(count);
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
