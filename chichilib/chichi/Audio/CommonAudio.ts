
// shared buffer to get sound out
export class WavSharer  {
    synced =true;
    
    readonly NES_BYTES_WRITTEN = 0;
    readonly WAVSHARER_BLOCKTHREAD = 1;
    readonly WAVSHARER_BUFFERPOS = 2;

    controlBuffer = new Int32Array(<any>new SharedArrayBuffer(3 * Int32Array.BYTES_PER_ELEMENT));
    sharedAudioBufferPos: number = 0;

    get bufferPosition(): number {
        return <any>Atomics.load(this.controlBuffer, this.WAVSHARER_BUFFERPOS); 
    }

    bufferWasRead: boolean;
    static sample_size = 1;

    SharedBuffer: Float32Array;
    SharedBufferLength: number = 8192;
    chunkSize: number = 1024;

    constructor() {
        this.SharedBuffer = new Float32Array(this.SharedBufferLength);
    }

    get audioBytesWritten(): number {
        return <any>Atomics.load(this.controlBuffer, this.NES_BYTES_WRITTEN);
    }
    
    set audioBytesWritten(value:number) {
        <any>Atomics.store(this.controlBuffer, this.NES_BYTES_WRITTEN, value);
    }

    wakeSleepers() {
        <any>Atomics.wake(this.controlBuffer, this.NES_BYTES_WRITTEN, 99999);
    }

    synchronize(): void {
        if (this.synced) {
            while (this.audioBytesWritten >= this.chunkSize)
            {
                <any>Atomics.store(this.controlBuffer, this.WAVSHARER_BUFFERPOS, this.sharedAudioBufferPos);
                <any>Atomics.wait(this.controlBuffer, this.NES_BYTES_WRITTEN, this.audioBytesWritten);
            }
        } else {
            this.audioBytesWritten = this.chunkSize;
        }
    }

}


//apu classes
export class blip_buffer_t  {
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

export class Blip  {
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
    ReadElementsLoop(wavSharer: WavSharer): number {
        let outbuf = wavSharer.SharedBuffer;
        let start = wavSharer.sharedAudioBufferPos;

        let count = this.BlipBuffer.avail;
        let inPtr = 0, outPtr = start;
        let end = count;
        let sum = this.BlipBuffer.integrator;

        if (count !== 0) {
            const step = 1;
            do {
                let st = sum >> Blip.delta_bits; /* assumes right shift preserves sign */
                sum = sum + this.BlipBuffer.samples[inPtr];
                inPtr++;
                if (st !== st) {
                    st = (st >> 31) ^ 32767;
                }
                var f = st / 65536; // (st/0xFFFF) * 2 - 1;

                outPtr += step;
                if (outPtr >= outbuf.length) {
                    outPtr=0;
                }
                outbuf[outPtr] = f;
                // outbuf[outPtr+ 1] = (byte)(st >> 8);
                sum = sum - (st << (7));
            } while (end-- > 0);

            this.BlipBuffer.integrator = sum;

            this.remove_samples(count);
        }
        wavSharer.sharedAudioBufferPos = outPtr;
        wavSharer.audioBytesWritten += count;
        wavSharer.synchronize();
        return count;
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

export class PortWriteEntry {
    constructor(public time: number, public address: number, public data: number) { }
}

export class QueuedPort {
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
