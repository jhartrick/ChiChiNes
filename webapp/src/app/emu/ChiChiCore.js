/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 16.3.2
 */
Bridge.assembly("ChiChiCore", function ($asm, globals) {
    "use strict";

    Bridge.define("ChiChiNES.AddressingModes", {
        $kind: "enum",
        statics: {
            fields: {
                Bullshit: 0,
                Implicit: 1,
                Accumulator: 2,
                Immediate: 3,
                ZeroPage: 4,
                ZeroPageX: 5,
                ZeroPageY: 6,
                Relative: 7,
                Absolute: 8,
                AbsoluteX: 9,
                AbsoluteY: 10,
                Indirect: 11,
                IndexedIndirect: 12,
                IndirectIndexed: 13,
                IndirectZeroPage: 14,
                IndirectAbsoluteX: 15
            }
        }
    });

    Bridge.define("ChiChiNES.IClockedMemoryMappedIOElement", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.BeepsBoops.Blip", {
        statics: {
            fields: {
                bass_shift: 0,
                end_frame_extra: 0,
                time_bits: 0,
                half_width: 0,
                phase_bits: 0,
                delta_bits: 0,
                buf_extra: 0,
                phase_count: 0,
                time_unit: 0,
                bl_step: null
            },
            ctors: {
                init: function () {
                    this.bass_shift = 8;
                    this.end_frame_extra = 2;
                    this.time_bits = 21;
                    this.half_width = 8;
                    this.phase_bits = 5;
                    this.delta_bits = 15;
                    this.bl_step = System.Array.create(0, [[
                        43, 
                        -115, 
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
                    ]], System.Int32, 33, 8);
                },
                ctor: function () {
                    ChiChiNES.BeepsBoops.Blip.time_unit = 2097152;
                    ChiChiNES.BeepsBoops.Blip.buf_extra = 18;
                    ChiChiNES.BeepsBoops.Blip.phase_count = 32;
                }
            }
        },
        fields: {
            _blipBuffer: null
        },
        props: {
            BlipBuffer: {
                get: function () {
                    return this._blipBuffer;
                },
                set: function (value) {
                    this._blipBuffer = value;
                }
            },
            blip_samples_avail: {
                get: function () {
                    return this._blipBuffer.avail;
                }
            }
        },
        ctors: {
            ctor: function (size) {
                this.$initialize();
                this.blip_new(size);
            }
        },
        methods: {
            blip_new: function (size) {
                this._blipBuffer = new ChiChiNES.BeepsBoops.Blip.blip_buffer_t(size);
                this._blipBuffer.size = size;
                this._blipBuffer.factor = 0;
                this.blip_clear();
            },
            blip_set_rates: function (clock_rate, sample_rate) {
                this._blipBuffer.factor = ChiChiNES.BeepsBoops.Blip.time_unit / clock_rate * sample_rate + (0.9999847412109375);

                /* Fails if clock_rate exceeds maximum, relative to sample_rate */
                System.Diagnostics.Debug.assert(this._blipBuffer.factor > 0);
            },
            blip_clear: function () {
                this._blipBuffer.offset = 0;
                this._blipBuffer.avail = 0;
                this._blipBuffer.integrator = 0;
                this._blipBuffer.samples = System.Array.init(this._blipBuffer.size + ChiChiNES.BeepsBoops.Blip.buf_extra, 0, System.Int32);
                //memset(BLIP_SAMPLES(s), 0, (s.size + buf_extra) * sizeof(buf_t));
            },
            blip_clocks_needed: function (samples) {
                var needed = samples * ChiChiNES.BeepsBoops.Blip.time_unit - this._blipBuffer.offset;

                /* Fails if buffer can't hold that many more samples */
                //assert( s->avail + samples <= s->size );

                return System.Int64.clip32((System.Int64(needed).add(System.Int64(this._blipBuffer.factor)).sub(System.Int64(1))).div(System.Int64(this._blipBuffer.factor)));

            },
            blip_end_frame: function (t) {
                var off = t * this._blipBuffer.factor + this._blipBuffer.offset;
                this._blipBuffer.avail += off >> ChiChiNES.BeepsBoops.Blip.time_bits;
                this._blipBuffer.offset = off & (ChiChiNES.BeepsBoops.Blip.time_unit - 1);

                /* Fails if buffer size was exceeded */
                //assert(s->avail <= s->size);
            },
            remove_samples: function (count) {
                var remain = this._blipBuffer.avail + ChiChiNES.BeepsBoops.Blip.buf_extra - count;
                this._blipBuffer.avail -= count;

                System.Array.copy(this._blipBuffer.samples, count, this._blipBuffer.samples, 0, remain);
                System.Array.fill(this._blipBuffer.samples, 0, remain, count);

                this._blipBuffer.arrayLength = count;
            },
            ReadBytes: function (outbuf, count, stereo) {
                var $t;
                if (count > this._blipBuffer.avail) {
                    count = this._blipBuffer.avail;
                }

                if (count !== 0) {
                    var step = 1;
                    //int inPtr  = BLIP_SAMPLES( s );
                    //buf_t const* end = in + count;
                    var inPtr = 0, outPtr = 0;
                    var endPtr = inPtr + count;
                    var sum = this._blipBuffer.integrator;

                    do {
                        var st = sum >> ChiChiNES.BeepsBoops.Blip.delta_bits; /* assumes right shift preserves sign */
                        sum = sum + ($t = this._blipBuffer.samples)[inPtr];
                        inPtr++;
                        if (st !== st) {
                            st = (st >> 31) ^ 32767;
                        }
                        var f = st / 32768; // (st/0xFFFF) * 2 - 1;
                        if (f < -1) {
                            f = -1;
                        }
                        if (f > 1) {
                            f = 1;
                        }
                        outbuf[outPtr] = f;
                        // outbuf[outPtr+ 1] = (byte)(st >> 8);
                        outPtr += step;
                        sum = sum - (st << (7));
                    } while (inPtr !== endPtr);

                    this._blipBuffer.integrator = sum;

                    this.remove_samples(count);
                }

                return count;
            },
            blip_add_delta: function (time, delta) {
                var $t, $t1;
                if (delta === 0) {
                    return;
                }
                var fixedTime = System.Int64(time * this._blipBuffer.factor + this._blipBuffer.offset);

                var outPtr = System.Int64.clip32(System.Int64(this._blipBuffer.avail).add((fixedTime.shr(ChiChiNES.BeepsBoops.Blip.time_bits))));

                var phase_shift = 16;
                var phase = System.Int64.clip32(fixedTime.shr(phase_shift).and(System.Int64((ChiChiNES.BeepsBoops.Blip.phase_count - 1))));

                var inStep = phase; // bl_step[phase];
                var rev = ChiChiNES.BeepsBoops.Blip.phase_count - phase; // bl_step[phase_count - phase];

                var interp_bits = 15;
                var interp = System.Int64.clip32(fixedTime.shr((phase_shift - interp_bits)).and(System.Int64(((1 << interp_bits) - 1))));
                var delta2 = (delta * interp) >> interp_bits;
                delta -= delta2;

                /* Fails if buffer size was exceeded */
                //assert( out <= &BLIP_SAMPLES( s ) [s->size] );

                for (var i = 0; i < 8; ++i) {
                    ($t = this._blipBuffer.samples)[outPtr + i] += ChiChiNES.BeepsBoops.Blip.bl_step.get([inStep, i]) * delta + ChiChiNES.BeepsBoops.Blip.bl_step.get([inStep + 1, i]) * delta2;
                    ($t1 = this._blipBuffer.samples)[outPtr + (15 - i)] += ChiChiNES.BeepsBoops.Blip.bl_step.get([rev, i]) * delta + ChiChiNES.BeepsBoops.Blip.bl_step.get([rev - 1, i]) * delta2;
                }

            },
            blip_add_delta_fast: function (time, delta) {
                var $t, $t1;
                var fixedTime = time * this._blipBuffer.factor + this._blipBuffer.offset;

                var outPtr = this._blipBuffer.avail + (fixedTime >> ChiChiNES.BeepsBoops.Blip.time_bits);

                var delta_unit = 32768;
                var phase_shift = 6;
                var phase = fixedTime >> phase_shift & (delta_unit - 1);
                var delta2 = delta * phase;

                /* Fails if buffer size was exceeded */
                //assert( out <= &BLIP_SAMPLES( s ) [s->size] );


                ($t = this._blipBuffer.samples)[outPtr + 8] += delta * delta_unit - delta2;
                ($t1 = this._blipBuffer.samples)[outPtr + 9] += delta2;
                //out [8] += delta * delta_unit - delta2;
                //out [9] += delta2;
            }
        }
    });

    Bridge.define("ChiChiNES.BeepsBoops.Blip.blip_buffer_t", {
        fields: {
            factor: 0,
            offset: 0,
            avail: 0,
            size: 0,
            integrator: 0,
            arrayLength: 0,
            samples: null
        },
        ctors: {
            ctor: function (size) {
                this.$initialize();
                this.samples = System.Array.init(size, 0, System.Int32);
                this.arrayLength = size;

            }
        }
    });

    Bridge.define("ChiChiNES.BeepsBoops.IAPU", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.BeepsBoops.DMCChannel", {
        fields: {
            _chan: 0,
            _bleeper: null,
            LengthCounts: null,
            _dutyCycle: 0,
            _length: 0,
            _timer: 0,
            _rawTimer: 0,
            _volume: 0,
            _time: 0,
            _envelope: 0,
            _looping: false,
            _enabled: false,
            _amplitude: 0,
            doodies: null,
            _sweepShift: 0,
            _sweepCounter: 0,
            _sweepDivider: 0,
            _sweepNegateFlag: false,
            _sweepEnabled: false,
            _startSweep: false,
            _sweepInvalid: false,
            _irqEnabled: false,
            rate: 0,
            dCounter: 0,
            sampleAddress: 0,
            _phase: 0,
            _gain: 0,
            _envTimer: 0,
            _envStart: false,
            _envConstantVolume: false,
            _envVolume: 0,
            _sweepComplement: false
        },
        props: {
            Length: {
                get: function () {
                    return this._length;
                },
                set: function (value) {
                    this._length = value;
                }
            },
            /**
             * Duty cycle of current square wave
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.DMCChannel
             * @function DutyCycle
             * @type number
             */
            DutyCycle: {
                get: function () {
                    return this._dutyCycle;
                },
                set: function (value) {
                    this._dutyCycle = value;
                }
            },
            /**
             * Period of current waveform
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.DMCChannel
             * @function Period
             * @type number
             */
            Period: {
                get: function () {
                    return this._timer;
                },
                set: function (value) {
                    this._timer = value;
                }
            },
            /**
             * Volume envelope for current waveform
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.DMCChannel
             * @function Volume
             * @type number
             */
            Volume: {
                get: function () {
                    return this._volume;
                },
                set: function (value) {
                    this._volume = value;
                }
            },
            /**
             * current time in channel
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.DMCChannel
             * @function Time
             * @type number
             */
            Time: {
                get: function () {
                    return this._time;
                },
                set: function (value) {
                    this._time = value;
                }
            },
            Envelope: {
                get: function () {
                    return this._envelope;
                },
                set: function (value) {
                    this._envelope = value;
                }
            },
            Looping: {
                get: function () {
                    return this._looping;
                },
                set: function (value) {
                    this._looping = value;
                }
            },
            Enabled: {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this._enabled = value;
                }
            },
            /**
             * Master gain
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.DMCChannel
             * @function Gain
             * @type number
             */
            Gain: {
                get: function () {
                    return this._gain;
                },
                set: function (value) {
                    this._gain = value;
                }
            },
            /**
             * True for ones complement, false for twos complement
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.DMCChannel
             * @function SweepComplement
             * @type boolean
             */
            SweepComplement: {
                get: function () {
                    return this._sweepComplement;
                },
                set: function (value) {
                    this._sweepComplement = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.LengthCounts = System.Array.init([10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30], System.Byte);
                this._enabled = true;
                this.doodies = System.Array.init([2, 6, 30, 249], System.Byte);
                this._sweepDivider = 1;
                this._irqEnabled = false;
                this._envTimer = 15;
            },
            ctor: function (bleeper, chan) {
                this.$initialize();
                this._bleeper = bleeper;
                this._chan = chan;
            }
        },
        methods: {
            WriteRegister: function (register, data, time) {
                // Run(time);

                switch (register) {
                    case 0: 
                        this._irqEnabled = (data & 128) === 128;
                        this._looping = (data & 64) === 64;
                        this.rate = data & 15;
                        break;
                    case 1: 
                        this.dCounter = data & 127;
                        break;
                    case 2: 
                        this.sampleAddress = (data << 6) | 49152;
                        break;
                    case 3: 
                        this._timer = data & 255;
                        this._timer <<= 4;
                        this._timer &= 1;
                        break;
                }
            },
            Run: function (end_time) {

                for (; this._time < end_time; this._time++) {
                    this.UpdateAmplitude((this._dutyCycle >> (this._phase & 7) & 1));
                }
                this._phase &= 7;
            },
            UpdateAmplitude: function (new_amp) {
                var delta = new_amp * this._gain - this._amplitude;

                this._amplitude += delta;
                this._bleeper.blip_add_delta(this._time, delta);
            },
            EndFrame: function (time) {
                this.Run(time);

                this._time = 0;
            },
            FrameClock: function (time, step) {
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
    });

    Bridge.define("ChiChiNES.BeepsBoops.IWavReader", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.BeepsBoops.IWavWriter", {
        inherits: [System.IDisposable],
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.BeepsBoops.NoiseChannel", {
        fields: {
            _bleeper: null,
            _chan: 0,
            NoisePeriods: null,
            LengthCounts: null,
            _length: 0,
            _period: 0,
            _volume: 0,
            _time: 0,
            _envConstantVolume: false,
            _envVolume: 0,
            _looping: false,
            _enabled: false,
            amplitude: 0,
            _phase: 0,
            gain: 0,
            _envTimer: 0,
            _envStart: false
        },
        props: {
            Length: {
                get: function () {
                    return this._length;
                },
                set: function (value) {
                    this._length = value;
                }
            },
            /**
             * Period of current waveform
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.NoiseChannel
             * @function Period
             * @type number
             */
            Period: {
                get: function () {
                    return this._period;
                },
                set: function (value) {
                    this._period = value;
                }
            },
            /**
             * Volume envelope for current waveform
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.NoiseChannel
             * @function Volume
             * @type number
             */
            Volume: {
                get: function () {
                    return this._volume;
                },
                set: function (value) {
                    this._volume = value;
                }
            },
            /**
             * current time in channel
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.NoiseChannel
             * @function Time
             * @type number
             */
            Time: {
                get: function () {
                    return this._time;
                },
                set: function (value) {
                    this._time = value;
                }
            },
            Looping: {
                get: function () {
                    return this._looping;
                },
                set: function (value) {
                    this._looping = value;
                }
            },
            Enabled: {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this._enabled = value;
                }
            },
            Gain: {
                get: function () {
                    return this.gain;
                },
                set: function (value) {
                    this.gain = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.NoisePeriods = System.Array.init([4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068], System.Int32);
                this.LengthCounts = System.Array.init([10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30], System.Byte);
                this._enabled = true;
                this._phase = 1;
                this._envTimer = 15;
            },
            ctor: function (bleeper, chan) {
                this.$initialize();
                this._bleeper = bleeper;
                this._chan = chan;
            }
        },
        methods: {
            WriteRegister: function (register, data, time) {
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
            },
            Run: function (end_time) {
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
            },
            UpdateAmplitude: function (amp) {
                var delta = amp * this.gain - this.amplitude;
                this.amplitude += delta;
                this._bleeper.blip_add_delta(this._time, delta);
            },
            EndFrame: function (time) {
                this.Run(time);
                this._time = 0;
            },
            FrameClock: function (time, step) {
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
                        if (!!(!this._looping & this._length > 0)) {
                            this._length--;
                        }
                        break;
                }
            }
        }
    });

    Bridge.define("ChiChiNES.BeepsBoops.SoundStatusChangeEventArgs", {
        fields: {
            muted: false
        },
        props: {
            Muted: {
                get: function () {
                    return this.muted;
                },
                set: function (value) {
                    this.muted = value;
                }
            }
        }
    });

    Bridge.define("ChiChiNES.BeepsBoops.SquareChannel", {
        fields: {
            _chan: 0,
            _bleeper: null,
            LengthCounts: null,
            _dutyCycle: 0,
            _length: 0,
            _timer: 0,
            _rawTimer: 0,
            _volume: 0,
            _time: 0,
            _envelope: 0,
            _looping: false,
            _enabled: false,
            _amplitude: 0,
            doodies: null,
            _sweepShift: 0,
            _sweepCounter: 0,
            _sweepDivider: 0,
            _sweepNegateFlag: false,
            _sweepEnabled: false,
            _startSweep: false,
            _sweepInvalid: false,
            _phase: 0,
            _gain: 0,
            _envTimer: 0,
            _envStart: false,
            _envConstantVolume: false,
            _envVolume: 0,
            _sweepComplement: false
        },
        props: {
            Length: {
                get: function () {
                    return this._length;
                },
                set: function (value) {
                    this._length = value;
                }
            },
            /**
             * Duty cycle of current square wave
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.SquareChannel
             * @function DutyCycle
             * @type number
             */
            DutyCycle: {
                get: function () {
                    return this._dutyCycle;
                },
                set: function (value) {
                    this._dutyCycle = value;
                }
            },
            /**
             * Period of current waveform
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.SquareChannel
             * @function Period
             * @type number
             */
            Period: {
                get: function () {
                    return this._timer;
                },
                set: function (value) {
                    this._timer = value;
                }
            },
            /**
             * Volume envelope for current waveform
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.SquareChannel
             * @function Volume
             * @type number
             */
            Volume: {
                get: function () {
                    return this._volume;
                },
                set: function (value) {
                    this._volume = value;
                }
            },
            /**
             * current time in channel
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.SquareChannel
             * @function Time
             * @type number
             */
            Time: {
                get: function () {
                    return this._time;
                },
                set: function (value) {
                    this._time = value;
                }
            },
            Envelope: {
                get: function () {
                    return this._envelope;
                },
                set: function (value) {
                    this._envelope = value;
                }
            },
            Looping: {
                get: function () {
                    return this._looping;
                },
                set: function (value) {
                    this._looping = value;
                }
            },
            Enabled: {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this._enabled = value;
                }
            },
            /**
             * Master gain
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.SquareChannel
             * @function Gain
             * @type number
             */
            Gain: {
                get: function () {
                    return this._gain;
                },
                set: function (value) {
                    this._gain = value;
                }
            },
            /**
             * True for ones complement, false for twos complement
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.SquareChannel
             * @function SweepComplement
             * @type boolean
             */
            SweepComplement: {
                get: function () {
                    return this._sweepComplement;
                },
                set: function (value) {
                    this._sweepComplement = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.LengthCounts = System.Array.init([10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30], System.Byte);
                this._enabled = true;
                this.doodies = System.Array.init([2, 6, 30, 249], System.Byte);
                this._sweepDivider = 1;
                this._envTimer = 15;
            },
            ctor: function (bleeper, chan) {
                this.$initialize();
                this._bleeper = bleeper;
                this._chan = chan;
            }
        },
        methods: {
            WriteRegister: function (register, data, time) {
                // Run(time);

                switch (register) {
                    case 0: 
                        this._envConstantVolume = (data & 16) === 16;
                        this._volume = data & 15;
                        this._dutyCycle = this.doodies[(data >> 6) & 3];
                        this._looping = (data & 32) === 32;
                        this._sweepInvalid = false;
                        break;
                    case 1: 
                        this._sweepShift = data & 7;
                        this._sweepNegateFlag = (data & 8) === 8;
                        this._sweepDivider = (data >> 4) & 7;
                        this._sweepEnabled = (data & 128) === 128;
                        this._startSweep = true;
                        this._sweepInvalid = false;
                        break;
                    case 2: 
                        this._timer &= 1792;
                        this._timer |= data;
                        this._rawTimer = this._timer;
                        break;
                    case 3: 
                        this._timer &= 255;
                        this._timer |= (data & 7) << 8;
                        this._rawTimer = this._timer;
                        this._phase = 0;
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
            },
            Run: function (end_time) {
                var period = this._sweepEnabled ? ((this._timer + 1) & 2047) << 1 : ((this._rawTimer + 1) & 2047) << 1;

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
            },
            UpdateAmplitude: function (new_amp) {
                var delta = new_amp * this._gain - this._amplitude;

                this._amplitude += delta;
                this._bleeper.blip_add_delta(this._time, delta);
            },
            EndFrame: function (time) {
                this.Run(time);

                this._time = 0;
            },
            FrameClock: function (time, step) {
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
    });

    Bridge.define("ChiChiNES.BeepsBoops.TriangleChannel", {
        fields: {
            _bleeper: null,
            _chan: 0,
            LengthCounts: null,
            _length: 0,
            _period: 0,
            _time: 0,
            _envelope: 0,
            _looping: false,
            _enabled: false,
            _amplitude: 0,
            _gain: 0,
            _linCtr: 0,
            _phase: 0,
            _linVal: 0,
            _linStart: false
        },
        props: {
            Length: {
                get: function () {
                    return this._length;
                },
                set: function (value) {
                    this._length = value;
                }
            },
            /**
             * Period of current waveform
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.TriangleChannel
             * @function Period
             * @type number
             */
            Period: {
                get: function () {
                    return this._period;
                },
                set: function (value) {
                    this._period = value;
                }
            },
            /**
             * current time in channel
             *
             * @instance
             * @public
             * @memberof ChiChiNES.BeepsBoops.TriangleChannel
             * @function Time
             * @type number
             */
            Time: {
                get: function () {
                    return this._time;
                },
                set: function (value) {
                    this._time = value;
                }
            },
            Envelope: {
                get: function () {
                    return this._envelope;
                },
                set: function (value) {
                    this._envelope = value;
                }
            },
            Looping: {
                get: function () {
                    return this._looping;
                },
                set: function (value) {
                    this._looping = value;
                }
            },
            Enabled: {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this._enabled = value;
                }
            },
            Amplitude: {
                get: function () {
                    return this._amplitude;
                },
                set: function (value) {
                    this._amplitude = value;
                }
            },
            Gain: {
                get: function () {
                    return this._gain;
                },
                set: function (value) {
                    this._gain = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.LengthCounts = System.Array.init([10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30], System.Int32);
                this._enabled = true;
            },
            ctor: function (bleeper, chan) {
                this.$initialize();
                this._bleeper = bleeper;
                this._chan = chan;
            }
        },
        methods: {
            WriteRegister: function (register, data, time) {
                //Run(time);

                switch (register) {
                    case 0: 
                        this._looping = (data & 128) === 128;
                        this._linVal = data & 127;
                        break;
                    case 1: 
                        break;
                    case 2: 
                        this._period &= 1792;
                        this._period |= data;
                        break;
                    case 3: 
                        this._period &= 255;
                        this._period |= (data & 7) << 8;
                        // setup lengthhave
                        if (this._enabled) {
                            this._length = this.LengthCounts[(data >> 3) & 31];
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
            },
            Run: function (end_time) {

                var period = this._period + 1;
                if (this._linCtr === 0 || this._length === 0 || this._period < 4) {
                    // leave it at it's current phase
                    this._time = end_time;
                    return;
                }

                for (; this._time < end_time; this._time += period, this._phase = (this._phase + 1) % 32) {
                    this.UpdateAmplitude(this._phase < 16 ? this._phase : 31 - this._phase);
                }
            },
            UpdateAmplitude: function (new_amp) {
                var delta = new_amp * this._gain - this._amplitude;
                this._amplitude += delta;
                this._bleeper.blip_add_delta(this._time, delta);
            },
            EndFrame: function (time) {
                this.Run(time);
                this._time = 0;
            },
            FrameClock: function (time, step) {
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
    });

    Bridge.define("ChiChiNES.CartDebugEvent", {
        fields: {
            clock: 0,
            eventType: null
        },
        props: {
            Clock: {
                get: function () {
                    return this.clock;
                },
                set: function (value) {
                    this.clock = value;
                }
            },
            EventType: {
                get: function () {
                    return this.eventType;
                },
                set: function (value) {
                    this.eventType = value;
                }
            }
        },
        methods: {
            toString: function () {
                return System.String.format("{0}: {1}", this.clock, this.eventType);
            }
        }
    });

    Bridge.define("ChiChiNES.ClockedRequestEventArgs", {
        props: {
            Clock: 0
        }
    });

    Bridge.define("ChiChiNES.ControlByteEventArgs", {
        fields: {
            nextValue: 0
        },
        props: {
            NextValue: {
                get: function () {
                    return this.nextValue;
                },
                set: function (value) {
                    this.nextValue = value;
                }
            }
        },
        ctors: {
            ctor: function (value) {
                this.$initialize();
                this.nextValue = value;
            }
        }
    });

    Bridge.define("ChiChiNES.CPU2A03", {
        statics: {
            fields: {
                cpuTiming: null
            },
            ctors: {
                init: function () {
                    this.cpuTiming = System.Array.init([7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0], System.Int32);
                }
            }
        },
        fields: {
            _ticks: 0,
            _operationCounter: 0,
            _accumulator: 0,
            _indexRegisterX: 0,
            _indexRegisterY: 0,
            _programCounter: 0,
            _statusRegister: 0,
            _addressBus: 0,
            _reset: false,
            _currentInstruction_AddressingMode: 0,
            _currentInstruction_Address: 0,
            _currentInstruction_OpCode: 0,
            _currentInstruction_Parameters0: 0,
            _currentInstruction_Parameters1: 0,
            _currentInstruction_ExtraTiming: 0,
            clock: 0,
            systemClock: System.UInt64(0),
            _handleNMI: false,
            _handleIRQ: false,
            nextEvent: 0,
            runningHard: false,
            clockcount: null,
            instruction: null,
            addressmode: null,
            memoryPatches: null,
            genieCodes: null,
            _cheating: false,
            lowByte: 0,
            highByte: 0,
            Rams: null,
            _pixelWhizzler: null,
            _cart: null,
            _padOne: null,
            _padTwo: null,
            soundBopper: null,
            nmiHandler: null,
            irqUpdater: null,
            _stackPointer: 0,
            instructionUsage: null,
            _debugging: false,
            instructionHistoryPointer: 0,
            _instructionHistory: null
        },
        events: {
            DebugEvent: null
        },
        props: {
            Accumulator: {
                get: function () {
                    return this._accumulator;
                },
                set: function (value) {
                    this._accumulator = value;
                }
            },
            IndexRegisterY: {
                get: function () {
                    return this._indexRegisterY;
                },
                set: function (value) {
                    this._indexRegisterY = value;
                }
            },
            IndexRegisterX: {
                get: function () {
                    return this._indexRegisterX;
                },
                set: function (value) {
                    this._indexRegisterX = value;
                }
            },
            ProgramCounter: {
                get: function () {
                    return this._programCounter;
                },
                set: function (value) {
                    this._programCounter = value;
                }
            },
            StatusRegister: {
                get: function () {
                    return this._statusRegister;
                },
                set: function (value) {
                    this._statusRegister = value;
                }
            },
            AddressCodePage: {
                get: function () {
                    var retval = this.AddressBus >> 8;
                    return retval;
                }
            },
            AddressLowByte: {
                get: function () {
                    return this.AddressBus & 255;
                }
            },
            AddressBus: {
                get: function () {
                    return this._addressBus;
                },
                set: function (value) {
                    this._addressBus = value;
                }
            },
            DataBus: 0,
            MemoryLock: false,
            ReadWrite: false,
            Ready: false,
            Reset: {
                get: function () {
                    return this._reset;
                },
                set: function (value) {
                    this._reset = value;
                    if (this._reset) {
                        this.ResetCPU();
                    }
                }
            },
            /**
             * read only access to the current instruction pointed to by the program counter
             *
             * @instance
             * @public
             * @readonly
             * @memberof ChiChiNES.CPU2A03
             * @function CurrentInstruction
             * @type ChiChiNES.CPU2A03.Instruction
             */
            CurrentInstruction: {
                get: function () {
                    return new ChiChiNES.CPU2A03.Instruction.ctor();
                }
            },
            OperationCounter: {
                get: function () {
                    return this._operationCounter;
                }
            },
            Clock: {
                get: function () {
                    return this.clock;
                },
                set: function (value) {
                    if (value === 0) {
                        this.systemClock = (this.systemClock.add(Bridge.Int.clipu64(this.clock))).and(System.UInt64(System.Int64([-1,65535])));
                        this.clock = value;
                    }
                }
            },
            RunningHard: {
                get: function () {
                    return this.runningHard;
                },
                set: function (value) {
                    this.runningHard = value;
                }
            },
            /**
             * number of full clock ticks elapsed since emulation started
             *
             * @instance
             * @public
             * @memberof ChiChiNES.CPU2A03
             * @function Ticks
             * @type number
             */
            Ticks: {
                get: function () {
                    return this._ticks;
                },
                set: function (value) {
                    if (value === 2147483647) {
                        this._ticks = 0;
                    } else {
                        this._ticks = value;
                    }
                }
            },
            MemoryPatches: {
                get: function () {
                    return this.memoryPatches;
                },
                set: function (value) {
                    this.memoryPatches = value;
                }
            },
            GenieCodes: {
                get: function () {
                    return this.genieCodes;
                },
                set: function (value) {
                    this.genieCodes = value;
                }
            },
            Cheating: {
                get: function () {
                    return this._cheating;
                },
                set: function (value) {
                    this._cheating = value;
                }
            },
            SoundBopper: {
                get: function () {
                    return this.soundBopper;
                },
                set: function (value) {
                    this.soundBopper = value;
                    this.soundBopper.ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler = this.irqUpdater;
                }
            },
            PadOne: {
                get: function () {
                    return this._padOne;
                },
                set: function (value) {
                    this._padOne = value;
                }
            },
            PadTwo: {
                get: function () {
                    return this._padTwo;
                },
                set: function (value) {
                    this._padTwo = value;
                }
            },
            Cart: {
                get: function () {
                    return this._cart;
                },
                set: function (value) {
                    this._cart = value;
                    this._cart.ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler = this.irqUpdater;
                }
            },
            PixelWhizzler: {
                get: function () {
                    return this._pixelWhizzler;
                },
                set: function (value) {
                    this._pixelWhizzler = value;
                    this._pixelWhizzler.ChiChiNES$IPPU$NMIHandler = this.nmiHandler;
                }
            },
            StackPointer: {
                get: function () {
                    return this._stackPointer;
                }
            },
            Debugging: {
                get: function () {
                    return this._debugging;
                },
                set: function (value) {
                    this._debugging = value;
                }
            },
            InstructionUsage: {
                get: function () {
                    return this.instructionUsage;
                }
            },
            InstructionHistoryPointer: {
                get: function () {
                    return this.instructionHistoryPointer;
                }
            },
            InstructionHistory: {
                get: function () {
                    return this._instructionHistory;
                }
            }
        },
        ctors: {
            init: function () {
                this._ticks = 0;
                this._operationCounter = 0;
                this._accumulator = 0;
                this._indexRegisterX = 0;
                this._indexRegisterY = 0;
                this._reset = false;
                this._currentInstruction_AddressingMode = ChiChiNES.AddressingModes.Bullshit;
                this._currentInstruction_Address = 0;
                this._currentInstruction_OpCode = 0;
                this._currentInstruction_Parameters0 = 0;
                this._currentInstruction_Parameters1 = 0;
                this._currentInstruction_ExtraTiming = 0;
                this.systemClock = System.UInt64(0);
                this.nextEvent = -1;
                this.clockcount = System.Array.init(256, 0, System.Int32);
                this.instruction = System.Array.init(256, 0, System.Int32);
                this.addressmode = System.Array.init(256, 0, ChiChiNES.AddressingModes);
                this.memoryPatches = new (System.Collections.Generic.Dictionary$2(System.Int32,ChiChiNES.Hacking.IMemoryPatch))();
                this.genieCodes = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Int32))();
                this._cheating = false;
                this.Rams = System.Array.init(8192, 0, System.Byte);
                this._stackPointer = 255;
                this.instructionUsage = System.Array.init(256, 0, System.Int32);
                this._debugging = false;
                this.instructionHistoryPointer = 255;
                this._instructionHistory = System.Array.init(256, null, ChiChiNES.CPU2A03.Instruction);
            },
            ctor: function (whizzler, bopper) {
                this.$initialize();
                // BuildOpArray();

                this._padOne = new ChiChiNES.InputHandler.ctor();
                this._padTwo = new ChiChiNES.InputHandler.ctor();
                this._pixelWhizzler = whizzler;

                this.SoundBopper = bopper;
                this.nmiHandler = Bridge.fn.cacheBind(this, this.NMIHandler);
                this.irqUpdater = Bridge.fn.cacheBind(this, this.IRQUpdater);
                bopper.NMIHandler = Bridge.fn.cacheBind(this, this.IRQUpdater);

                this._pixelWhizzler.ChiChiNES$IPPU$NMIHandler = this.nmiHandler;
            }
        },
        methods: {
            getSRMask: function (flag) {
                switch (flag) {
                    case ChiChiNES.CPUStatusBits.Carry: 
                        return 1;
                    case ChiChiNES.CPUStatusBits.ZeroResult: 
                        return 2;
                    case ChiChiNES.CPUStatusBits.InterruptDisable: 
                        return 4;
                    case ChiChiNES.CPUStatusBits.DecimalMode: 
                        return 8;
                    case ChiChiNES.CPUStatusBits.BreakCommand: 
                        return 16;
                    case ChiChiNES.CPUStatusBits.Expansion: 
                        return 32;
                    case ChiChiNES.CPUStatusBits.Overflow: 
                        return 64;
                    case ChiChiNES.CPUStatusBits.NegativeResult: 
                        return 128;
                }
                return 0;
            },
            SetFlag: function (Flag, value) {
                this._statusRegister = (value ? (this._statusRegister | Flag) : (this._statusRegister & ~Flag));

                this._statusRegister = this._statusRegister | (ChiChiNES.CPUStatusMasks.ExpansionMask);
            },
            GetFlag: function (Flag) {
                var flag = Flag;
                return ((this._statusRegister & flag) === flag);
            },
            InterruptRequest: function () {

                //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
                //  set is pushed on the stack, then the I flag is set. 
                if (this.GetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask)) {
                    return;
                }
                this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, true);

                var newStatusReg = this._statusRegister & -17 | 32;

                // if enabled

                // push pc onto stack (high byte first)
                this.PushStack(((Bridge.Int.div(this.ProgramCounter, 256)) | 0));
                this.PushStack(this.ProgramCounter);
                // push sr onto stack
                this.PushStack(this.StatusRegister);

                // point pc to interrupt service routine

                this.ProgramCounter = (this.GetByte$1(65534) + (this.GetByte$1(65535) << 8)) | 0;

                // nonOpCodeticks = 7;
            },
            NonMaskableInterrupt: function () {

                //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
                //  set is pushed on the stack, then the I flag is set. 
                var newStatusReg = this._statusRegister & -17 | 32;

                this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, true);
                // push pc onto stack (high byte first)
                this.PushStack(this._programCounter >> 8);
                this.PushStack(this._programCounter & 255);
                //c7ab
                // push sr onto stack
                this.PushStack(newStatusReg);
                // point pc to interrupt service routine
                var lowByte = (this.GetByte$1(65530)) & 255;
                var highByte = (this.GetByte$1(65531)) & 255;
                var jumpTo = lowByte | (highByte << 8);
                this.ProgramCounter = jumpTo;
                //nonOpCodeticks = 7;
            },
            CheckEvent: function () {
                if (this.nextEvent === -1) {
                    this.FindNextEvent();
                }
            },
            RunFast: function () {
                while (this.clock < 29780) {
                    this.Step();
                }
            },
            Step: function () {
                // int tickCount = 0;
                this._currentInstruction_ExtraTiming = 0;

                //_pixelWhizzler.DrawTo(clock);
                if (this.nextEvent <= this.clock) {
                    this.HandleNextEvent();
                }

                if (this._handleNMI) {
                    this._handleNMI = false;
                    this.clock = (this.clock + 7) | 0;
                    //NonMaskableInterrupt();

                    //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
                    //  set is pushed on the stack, then the I flag is set. 
                    var newStatusReg = this._statusRegister & -17 | 32;

                    this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, true);
                    // push pc onto stack (high byte first)
                    this.PushStack(this._programCounter >> 8);
                    this.PushStack(this._programCounter & 255);
                    //c7ab
                    // push sr onto stack
                    this.PushStack(newStatusReg);
                    // point pc to interrupt service routine
                    var lowByte = (this.GetByte$1(65530)) & 255;
                    var highByte = (this.GetByte$1(65531)) & 255;
                    var jumpTo = lowByte | (highByte << 8);
                    this.ProgramCounter = jumpTo;
                    //nonOpCodeticks = 7;
                } else if (this._handleIRQ) {
                    this._handleIRQ = false;
                    this.clock = (this.clock + 7) | 0;
                    //InterruptRequest();
                    //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
                    //  set is pushed on the stack, then the I flag is set. 
                    if (this.GetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask)) {
                        return;
                    }
                    this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, true);

                    var newStatusReg1 = this._statusRegister & -17 | 32;

                    // if enabled

                    // push pc onto stack (high byte first)
                    this.PushStack(((Bridge.Int.div(this.ProgramCounter, 256)) | 0));
                    this.PushStack(this.ProgramCounter);
                    // push sr onto stack
                    this.PushStack(this.StatusRegister);

                    // point pc to interrupt service routine

                    this.ProgramCounter = (this.GetByte$1(65534) + (this.GetByte$1(65535) << 8)) | 0;

                    // nonOpCodeticks = 7;

                }

                //FetchNextInstruction();
                this._currentInstruction_Address = this._programCounter;
                this._currentInstruction_OpCode = this.GetByte$1(Bridge.identity(this._programCounter, (this._programCounter = (this._programCounter + 1) | 0)));
                this._currentInstruction_AddressingMode = this.addressmode[this._currentInstruction_OpCode];

                //FetchInstructionParameters();
                switch (this._currentInstruction_AddressingMode) {
                    case ChiChiNES.AddressingModes.Absolute: 
                    case ChiChiNES.AddressingModes.AbsoluteX: 
                    case ChiChiNES.AddressingModes.AbsoluteY: 
                    case ChiChiNES.AddressingModes.Indirect: 
                        // case AddressingModes.IndirectAbsoluteX:
                        this._currentInstruction_Parameters0 = this.GetByte$1(Bridge.identity(this._programCounter, (this._programCounter = (this._programCounter + 1) | 0)));
                        this._currentInstruction_Parameters1 = this.GetByte$1(Bridge.identity(this._programCounter, (this._programCounter = (this._programCounter + 1) | 0)));
                        break;
                    case ChiChiNES.AddressingModes.ZeroPage: 
                    case ChiChiNES.AddressingModes.ZeroPageX: 
                    case ChiChiNES.AddressingModes.ZeroPageY: 
                    case ChiChiNES.AddressingModes.Relative: 
                    case ChiChiNES.AddressingModes.IndexedIndirect: 
                    case ChiChiNES.AddressingModes.IndirectIndexed: 
                    case ChiChiNES.AddressingModes.IndirectZeroPage: 
                    case ChiChiNES.AddressingModes.Immediate: 
                        this._currentInstruction_Parameters0 = this.GetByte$1(Bridge.identity(this._programCounter, (this._programCounter = (this._programCounter + 1) | 0)));
                        break;
                    case ChiChiNES.AddressingModes.Accumulator: 
                    case ChiChiNES.AddressingModes.Implicit: 
                        break;
                    default: 
                        //  throw new NotImplementedException("Invalid address mode!!");
                        break;
                }

                this.Execute();

                //("{0:x} {1:x} {2:x}", _currentInstruction_OpCode, _currentInstruction_AddressingMode, _currentInstruction_Address);
                if (this._debugging) {
                    this.WriteInstructionHistoryAndUsage();
                    this._operationCounter = (this._operationCounter + 1) | 0;
                }

                this.clock = (this.clock + (((ChiChiNES.CPU2A03.cpuTiming[this._currentInstruction_OpCode] + this._currentInstruction_ExtraTiming) | 0))) | 0;
            },
            /**
             * runs up to x clock cycles, then returns
             *
             * @instance
             * @public
             * @this ChiChiNES.CPU2A03
             * @memberof ChiChiNES.CPU2A03
             * @param   {number}    count
             * @return  {void}
             */
            RunCycles: function (count) {
                var startCycles = this._ticks;

                while (((this._ticks - startCycles) | 0) < count) {
                    this.Step();
                }

            },
            setupticks: function () {

                this.clockcount[0] = 7;
                //instruction(0x0] = INS_BRK;
                this.addressmode[0] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[1] = 6;
                //instruction(0x1] = INS_ORA;
                this.addressmode[1] = ChiChiNES.AddressingModes.IndexedIndirect;
                this.clockcount[2] = 2;
                //instruction(0x2] = INS_NOP;
                this.addressmode[2] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[3] = 2;
                //instruction(0x3] = INS_NOP;
                this.addressmode[3] = ChiChiNES.AddressingModes.Bullshit;
                this.clockcount[4] = 3;
                //instruction(0x4] = INS_NOP;
                this.addressmode[4] = ChiChiNES.AddressingModes.Bullshit;
                this.clockcount[5] = 3;
                //instruction(0x5] = INS_ORA;
                this.addressmode[5] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[6] = 5;
                //instruction(0x6] = INS_ASL;

                this.addressmode[6] = ChiChiNES.AddressingModes.ZeroPage;

                // asl-ora
                this.clockcount[7] = 2;
                //instruction(0x7] = INS_NOP;
                this.addressmode[7] = ChiChiNES.AddressingModes.Bullshit;

                this.clockcount[8] = 3;
                //instruction(0x8] = INS_PHP;
                this.addressmode[8] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[9] = 3;
                //instruction(0x9] = INS_ORA;
                this.addressmode[9] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[10] = 2;
                //instruction(0xa] = INS_ASLA;
                this.addressmode[10] = ChiChiNES.AddressingModes.Accumulator;
                this.clockcount[11] = 2;
                //instruction(0xb] = AAC;
                this.addressmode[11] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[12] = 4;
                //instruction(0xc] = INS_NOP;
                this.addressmode[12] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[13] = 4;
                //instruction(0xd] = INS_ORA;
                this.addressmode[13] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[14] = 6;
                //instruction(0xe] = INS_ASL;
                this.addressmode[14] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[15] = 2;
                //instruction(0xf] = INS_NOP;
                this.addressmode[15] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[16] = 2;
                //instruction(0x10] = INS_BPL;

                this.addressmode[16] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[17] = 5;
                //instruction(0x11] = INS_ORA;

                this.addressmode[17] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[18] = 3;
                //instruction(0x12] = INS_ORA;

                this.addressmode[18] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[19] = 2;
                //instruction(0x13] = INS_NOP;
                this.addressmode[19] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[20] = 3;
                //instruction(0x14] = INS_NOP;
                this.addressmode[20] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[21] = 4;
                //instruction(0x15] = INS_ORA;
                this.addressmode[21] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[22] = 6;
                //instruction(0x16] = INS_ASL;
                this.addressmode[22] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[23] = 2;
                //instruction(0x17] = INS_NOP;
                this.addressmode[23] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[24] = 2;
                //instruction(0x18] = INS_CLC;
                this.addressmode[24] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[25] = 4;
                //instruction(0x19] = INS_ORA;

                this.addressmode[25] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[26] = 2;
                //instruction(0x1a] = INS_INA;
                this.addressmode[26] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[27] = 2;
                //instruction(0x1b] = INS_NOP;
                this.addressmode[27] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[28] = 4;
                //instruction(0x1c] = INS_NOP;
                this.addressmode[28] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[29] = 4;
                //instruction(0x1d] = INS_ORA;
                this.addressmode[29] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[30] = 7;
                //instruction(0x1e] = INS_ASL;
                this.addressmode[30] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[31] = 2;
                //instruction(0x1f] = INS_NOP;
                this.addressmode[31] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[32] = 6;
                //instruction(0x20] = INS_JSR;
                this.addressmode[32] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[33] = 6;
                //instruction(0x21] = INS_AND;

                this.addressmode[33] = ChiChiNES.AddressingModes.IndexedIndirect;
                this.clockcount[34] = 2;
                //instruction(0x22] = INS_NOP;
                this.addressmode[34] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[35] = 2;
                //instruction(0x23] = INS_NOP;
                this.addressmode[35] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[36] = 3;
                //instruction(0x24] = INS_BIT;
                this.addressmode[36] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[37] = 3;
                //instruction(0x25] = INS_AND;
                this.addressmode[37] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[38] = 5;
                //instruction(0x26] = INS_ROL;
                this.addressmode[38] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[39] = 2;
                //instruction(0x27] = INS_NOP;
                this.addressmode[39] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[40] = 4;
                //instruction(0x28] = INS_PLP;
                this.addressmode[40] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[41] = 3;
                //instruction(0x29] = INS_AND;

                this.addressmode[41] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[42] = 2;
                //instruction(0x2a] = INS_ROLA;
                this.addressmode[42] = ChiChiNES.AddressingModes.Accumulator;

                // undocumented
                this.clockcount[43] = 2;
                //instruction(0x2b] = INS_NOP; AAC
                this.addressmode[43] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[44] = 4;
                //instruction(0x2c] = INS_BIT;
                this.addressmode[44] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[45] = 4;
                //instruction(0x2d] = INS_AND;
                this.addressmode[45] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[46] = 6;
                //instruction(0x2e] = INS_ROL;
                this.addressmode[46] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[47] = 2;
                //instruction(0x2f] = INS_NOP;
                this.addressmode[47] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[48] = 2;
                //instruction(0x30] = INS_BMI;
                this.addressmode[48] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[49] = 5;
                //instruction(0x31] = INS_AND;
                this.addressmode[49] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[50] = 3;
                //instruction(0x32] = INS_AND;
                this.addressmode[50] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[51] = 2;
                //instruction(0x33] = INS_NOP;
                this.addressmode[51] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[52] = 4;
                //instruction(0x34] = INS_BIT;
                this.addressmode[52] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[53] = 4;
                //instruction(0x35] = INS_AND;
                this.addressmode[53] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[54] = 6;
                //instruction(0x36] = INS_ROL;
                this.addressmode[54] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[55] = 2;
                //instruction(0x37] = INS_NOP;
                this.addressmode[55] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[56] = 2;
                //instruction(0x38] = INS_SEC;
                this.addressmode[56] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[57] = 4;
                //instruction(0x39] = INS_AND;
                this.addressmode[57] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[58] = 2;
                //instruction(0x3a] = INS_DEA;
                this.addressmode[58] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[59] = 2;
                //instruction(0x3b] = INS_NOP;
                this.addressmode[59] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[60] = 4;
                //instruction(0x3c] = INS_BIT;
                this.addressmode[60] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[61] = 4;
                //instruction(0x3d] = INS_AND;
                this.addressmode[61] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[62] = 7;
                //instruction(0x3e] = INS_ROL;
                this.addressmode[62] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[63] = 2;
                //instruction(0x3f] = INS_NOP;
                this.addressmode[63] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[64] = 6;
                //instruction(0x40] = INS_RTI;
                this.addressmode[64] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[65] = 6;
                //instruction(0x41] = INS_EOR;
                this.addressmode[65] = ChiChiNES.AddressingModes.IndexedIndirect;
                this.clockcount[66] = 2;
                //instruction(0x42] = INS_NOP;
                this.addressmode[66] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[67] = 2;
                //instruction(0x43] = INS_NOP;
                this.addressmode[67] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[68] = 2;
                //instruction(0x44] = INS_NOP;
                this.addressmode[68] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[69] = 3;
                //instruction(0x45] = INS_EOR;
                this.addressmode[69] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[70] = 5;
                //instruction(0x46] = INS_LSR;
                this.addressmode[70] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[71] = 2;
                //instruction(0x47] = INS_NOP;
                this.addressmode[71] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[72] = 3;
                //instruction(0x48] = INS_PHA;
                this.addressmode[72] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[73] = 3;
                //instruction(0x49] = INS_EOR;
                this.addressmode[73] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[74] = 2;
                //instruction(0x4a] = INS_LSRA;
                this.addressmode[74] = ChiChiNES.AddressingModes.Accumulator;
                this.clockcount[75] = 2;
                //instruction(0x4b] = INS_ASR;
                this.addressmode[75] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[76] = 3;
                //instruction(0x4c] = INS_JMP;
                this.addressmode[76] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[77] = 4;
                //instruction(0x4d] = INS_EOR;
                this.addressmode[77] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[78] = 6;
                //instruction(0x4e] = INS_LSR;
                this.addressmode[78] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[79] = 2;
                //instruction(0x4f] = INS_NOP;
                this.addressmode[79] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[80] = 2;
                //instruction(0x50] = INS_BVC;
                this.addressmode[80] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[81] = 5;
                //instruction(0x51] = INS_EOR;
                this.addressmode[81] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[82] = 3;
                //instruction(0x52] = INS_EOR;
                this.addressmode[82] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[83] = 2;
                //instruction(0x53] = INS_NOP;
                this.addressmode[83] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[84] = 2;
                //instruction(0x54] = INS_NOP;
                this.addressmode[84] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[85] = 4;
                //instruction(0x55] = INS_EOR;
                this.addressmode[85] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[86] = 6;
                //instruction(0x56] = INS_LSR;
                this.addressmode[86] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[87] = 2;
                //instruction(0x57] = INS_NOP;
                this.addressmode[87] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[88] = 2;
                //instruction(0x58] = INS_CLI;
                this.addressmode[88] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[89] = 4;
                //instruction(0x59] = INS_EOR;
                this.addressmode[89] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[90] = 3;
                //instruction(0x5a] = INS_PHY;
                this.addressmode[90] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[91] = 2;
                //instruction(0x5b] = INS_NOP;
                this.addressmode[91] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[92] = 2;
                //instruction(0x5c] = INS_NOP;
                this.addressmode[92] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[93] = 4;
                //instruction(0x5d] = INS_EOR;
                this.addressmode[93] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[94] = 7;
                //instruction(0x5e] = INS_LSR;
                this.addressmode[94] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[95] = 2;
                //instruction(0x5f] = INS_NOP;
                this.addressmode[95] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[96] = 6;
                //instruction(0x60] = INS_RTS;
                this.addressmode[96] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[97] = 6;
                //instruction(0x61] = INS_ADC;
                this.addressmode[97] = ChiChiNES.AddressingModes.IndexedIndirect;
                this.clockcount[98] = 2;
                //instruction(0x62] = INS_NOP;
                this.addressmode[98] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[99] = 2;
                //instruction(0x63] = INS_NOP;
                this.addressmode[99] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[100] = 3;
                //instruction(0x64] = INS_NOP;
                this.addressmode[100] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[101] = 3;
                //instruction(0x65] = INS_ADC;
                this.addressmode[101] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[102] = 5;
                //instruction(0x66] = INS_ROR;
                this.addressmode[102] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[103] = 2;
                //instruction(0x67] = INS_NOP;
                this.addressmode[103] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[104] = 4;
                //instruction(0x68] = INS_PLA;
                this.addressmode[104] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[105] = 3;
                //instruction(0x69] = INS_ADC;
                this.addressmode[105] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[106] = 2;
                //instruction(0x6a] = INS_RORA;
                this.addressmode[106] = ChiChiNES.AddressingModes.Accumulator;

                this.clockcount[107] = 2;
                //instruction(0x6b] = INS_ARR; U
                this.addressmode[107] = ChiChiNES.AddressingModes.Immediate;

                this.clockcount[108] = 5;
                //instruction(0x6c] = INS_JMP;

                this.addressmode[108] = ChiChiNES.AddressingModes.Indirect;
                this.clockcount[109] = 4;
                //instruction(0x6d] = INS_ADC;
                this.addressmode[109] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[110] = 6;
                //instruction(0x6e] = INS_ROR;
                this.addressmode[110] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[111] = 2;
                //instruction(0x6f] = INS_NOP;
                this.addressmode[111] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[112] = 2;
                //instruction(0x70] = INS_BVS;
                this.addressmode[112] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[113] = 5;
                //instruction(0x71] = INS_ADC;
                this.addressmode[113] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[114] = 3;
                //instruction(0x72] = INS_ADC;
                this.addressmode[114] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[115] = 2;
                //instruction(0x73] = INS_NOP;
                this.addressmode[115] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[116] = 4;
                //instruction(0x74] = INS_NOP;
                this.addressmode[116] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[117] = 4;
                //instruction(0x75] = INS_ADC;
                this.addressmode[117] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[118] = 6;
                //instruction(0x76] = INS_ROR;
                this.addressmode[118] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[119] = 2;
                //instruction(0x77] = INS_NOP;
                this.addressmode[119] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[120] = 2;
                //instruction(0x78] = INS_SEI;
                this.addressmode[120] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[121] = 4;
                //instruction(0x79] = INS_ADC;
                this.addressmode[121] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[122] = 4;
                //instruction(0x7a] = INS_PLY;
                this.addressmode[122] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[123] = 2;
                //instruction(0x7b] = INS_NOP;
                this.addressmode[123] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[124] = 6;
                //instruction(0x7c] = INS_JMP;

                this.addressmode[124] = ChiChiNES.AddressingModes.IndirectAbsoluteX;
                this.clockcount[125] = 4;
                //instruction(0x7d] = INS_ADC;
                this.addressmode[125] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[126] = 7;
                //instruction(0x7e] = INS_ROR;
                this.addressmode[126] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[127] = 2;
                //instruction(0x7f] = INS_NOP;
                this.addressmode[127] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[128] = 2;
                //instruction(0x80] = INS_BRA;
                this.addressmode[128] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[129] = 6;
                //instruction(0x81] = INS_STA;
                this.addressmode[129] = ChiChiNES.AddressingModes.IndexedIndirect;
                this.clockcount[130] = 2;
                //instruction(0x82] = INS_NOP;
                this.addressmode[130] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[131] = 2;
                //instruction(0x83] = INS_NOP;
                this.addressmode[131] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[132] = 2;
                //instruction(0x84] = INS_STY;
                this.addressmode[132] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[133] = 2;
                //instruction(0x85] = INS_STA;
                this.addressmode[133] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[134] = 2;
                //instruction(0x86] = INS_STX;
                this.addressmode[134] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[135] = 2;
                //instruction(0x87] = INS_NOP;
                this.addressmode[135] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[136] = 2;
                //instruction(0x88] = INS_DEY;
                this.addressmode[136] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[137] = 2;
                //instruction(0x89] = INS_BIT;
                this.addressmode[137] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[138] = 2;
                //instruction(0x8a] = INS_TXA;
                this.addressmode[138] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[139] = 2;
                //instruction(0x8b] = INS_NOP;
                this.addressmode[139] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[140] = 4;
                //instruction(0x8c] = INS_STY;
                this.addressmode[140] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[141] = 4;
                //instruction(0x8d] = INS_STA;
                this.addressmode[141] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[142] = 4;
                //instruction(0x8e] = INS_STX;
                this.addressmode[142] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[143] = 2;
                //instruction(0x8f] = INS_NOP;
                this.addressmode[143] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[144] = 2;
                //instruction(0x90] = INS_BCC;
                this.addressmode[144] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[145] = 6;
                //instruction(0x91] = INS_STA;
                this.addressmode[145] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[146] = 3;
                //instruction(0x92] = INS_STA;
                this.addressmode[146] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[147] = 2;
                //instruction(0x93] = INS_NOP;
                this.addressmode[147] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[148] = 4;
                //instruction(0x94] = INS_STY;
                this.addressmode[148] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[149] = 4;
                //instruction(0x95] = INS_STA;
                this.addressmode[149] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[150] = 4;
                //instruction(0x96] = INS_STX;
                this.addressmode[150] = ChiChiNES.AddressingModes.ZeroPageY;
                this.clockcount[151] = 2;
                //instruction(0x97] = INS_NOP;
                this.addressmode[151] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[152] = 2;
                //instruction(0x98] = INS_TYA;
                this.addressmode[152] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[153] = 5;
                //instruction(0x99] = INS_STA;
                this.addressmode[153] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[154] = 2;
                //instruction(0x9a] = INS_TXS;
                this.addressmode[154] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[155] = 2;
                //instruction(0x9b] = INS_NOP;
                this.addressmode[155] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[156] = 4;
                //instruction(0x9c] = INS_NOP;
                this.addressmode[156] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[157] = 5;
                //instruction(0x9d] = INS_STA;
                this.addressmode[157] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[158] = 5;
                //instruction(0x9e] = INS_NOP;
                this.addressmode[158] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[159] = 2;
                //instruction(0x9f] = INS_NOP;
                this.addressmode[159] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[160] = 3;
                //instruction(0xa0] = INS_LDY;
                this.addressmode[160] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[161] = 6;
                //instruction(0xa1] = INS_LDA;
                this.addressmode[161] = ChiChiNES.AddressingModes.IndexedIndirect;
                this.clockcount[162] = 3;
                //instruction(0xa2] = INS_LDX;
                this.addressmode[162] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[163] = 2;
                //instruction(0xa3] = INS_NOP;
                this.addressmode[163] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[164] = 3;
                //instruction(0xa4] = INS_LDY;
                this.addressmode[164] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[165] = 3;
                //instruction(0xa5] = INS_LDA;
                this.addressmode[165] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[166] = 3;
                //instruction(0xa6] = INS_LDX;
                this.addressmode[166] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[167] = 2;
                //instruction(0xa7] = INS_NOP;
                this.addressmode[167] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[168] = 2;
                //instruction(0xa8] = INS_TAY;
                this.addressmode[168] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[169] = 3;
                //instruction(0xa9] = INS_LDA;
                this.addressmode[169] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[170] = 2;
                //instruction(0xaa] = INS_TAX;
                this.addressmode[170] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[171] = 2;
                //instruction(0xab] = INS_NOP; ATX U
                this.addressmode[171] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[172] = 4;
                //instruction(0xac] = INS_LDY;
                this.addressmode[172] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[173] = 4;
                //instruction(0xad] = INS_LDA;
                this.addressmode[173] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[174] = 4;
                //instruction(0xae] = INS_LDX;
                this.addressmode[174] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[175] = 2;
                //instruction(0xaf] = INS_NOP;
                this.addressmode[175] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[176] = 2;
                //instruction(0xb0] = INS_BCS;
                this.addressmode[176] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[177] = 5;
                //instruction(0xb1] = INS_LDA;
                this.addressmode[177] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[178] = 3;
                //instruction(0xb2] = INS_LDA;
                this.addressmode[178] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[179] = 2;
                //instruction(0xb3] = INS_NOP;
                this.addressmode[179] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[180] = 4;
                //instruction(0xb4] = INS_LDY;
                this.addressmode[180] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[181] = 4;
                //instruction(0xb5] = INS_LDA;
                this.addressmode[181] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[182] = 4;
                //instruction(0xb6] = INS_LDX;

                this.addressmode[182] = ChiChiNES.AddressingModes.ZeroPageY;
                this.clockcount[183] = 2;
                //instruction(0xb7] = INS_NOP;
                this.addressmode[183] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[184] = 2;
                //instruction(0xb8] = INS_CLV;
                this.addressmode[184] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[185] = 4;
                //instruction(0xb9] = INS_LDA;
                this.addressmode[185] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[186] = 2;
                //instruction(0xba] = INS_TSX;
                this.addressmode[186] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[187] = 2;
                //instruction(0xbb] = INS_NOP;
                this.addressmode[187] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[188] = 4;
                //instruction(0xbc] = INS_LDY;
                this.addressmode[188] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[189] = 4;
                //instruction(0xbd] = INS_LDA;
                this.addressmode[189] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[190] = 4;
                //instruction(0xbe] = INS_LDX;
                this.addressmode[190] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[191] = 2;
                //instruction(0xbf] = INS_NOP;
                this.addressmode[191] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[192] = 3;
                //instruction(0xc0] = INS_CPY;
                this.addressmode[192] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[193] = 6;
                //instruction(0xc1] = INS_CMP;
                this.addressmode[193] = ChiChiNES.AddressingModes.IndexedIndirect;

                this.clockcount[194] = 2;
                //instruction(0xc2] = INS_NOP;
                this.addressmode[194] = ChiChiNES.AddressingModes.Immediate;

                this.clockcount[195] = 2;
                //instruction(0xc3] = INS_NOP;
                this.addressmode[195] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[196] = 3;
                //instruction(0xc4] = INS_CPY;
                this.addressmode[196] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[197] = 3;
                //instruction(0xc5] = INS_CMP;
                this.addressmode[197] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[198] = 5;
                //instruction(0xc6] = INS_DEC;
                this.addressmode[198] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[199] = 2;
                //instruction(0xc7] = INS_NOP;
                this.addressmode[199] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[200] = 2;
                //instruction(0xc8] = INS_INY;
                this.addressmode[200] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[201] = 3;
                //instruction(0xc9] = INS_CMP;
                this.addressmode[201] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[202] = 2;
                //instruction(0xca] = INS_DEX;
                this.addressmode[202] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[203] = 2;
                //instruction(0xcb] = INS_NOP; AXS
                this.addressmode[203] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[204] = 4;
                //instruction(0xcc] = INS_CPY;
                this.addressmode[204] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[205] = 4;
                //instruction(0xcd] = INS_CMP;
                this.addressmode[205] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[206] = 6;
                //instruction(0xce] = INS_DEC;
                this.addressmode[206] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[207] = 2;
                //instruction(0xcf] = INS_NOP;
                this.addressmode[207] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[208] = 2;
                //instruction(0xd0] = INS_BNE;
                this.addressmode[208] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[209] = 5;
                //instruction(0xd1] = INS_CMP;
                this.addressmode[209] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[210] = 3;
                //instruction(0xd2] = INS_CMP;
                this.addressmode[210] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[211] = 2;
                //instruction(0xd3] = INS_NOP;
                this.addressmode[211] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[212] = 2;
                //instruction(0xd4] = INS_NOP;
                this.addressmode[212] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[213] = 4;
                //instruction(0xd5] = INS_CMP;
                this.addressmode[213] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[214] = 6;
                //instruction(0xd6] = INS_DEC;
                this.addressmode[214] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[215] = 2;
                //instruction(0xd7] = INS_NOP;
                this.addressmode[215] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[216] = 2;
                //instruction(0xd8] = INS_CLD;
                this.addressmode[216] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[217] = 4;
                //instruction(0xd9] = INS_CMP;
                this.addressmode[217] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[218] = 3;
                //instruction(0xda] = INS_PHX;
                this.addressmode[218] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[219] = 2;
                //instruction(0xdb] = INS_NOP;
                this.addressmode[219] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[220] = 2;
                //instruction(0xdc] = INS_NOP;
                this.addressmode[220] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[221] = 4;
                //instruction(0xdd] = INS_CMP;
                this.addressmode[221] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[222] = 7;
                //instruction(0xde] = INS_DEC;
                this.addressmode[222] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[223] = 2;
                //instruction(0xdf] = INS_NOP;
                this.addressmode[223] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[224] = 3;
                //instruction(0xe0] = INS_CPX;
                this.addressmode[224] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[225] = 6;
                //instruction(0xe1] = INS_SBC;
                this.addressmode[225] = ChiChiNES.AddressingModes.IndexedIndirect;
                this.clockcount[226] = 2;
                //instruction(0xe2] = INS_NOP;
                this.addressmode[226] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[227] = 2;
                //instruction(0xe3] = INS_NOP;
                this.addressmode[227] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[228] = 3;
                //instruction(0xe4] = INS_CPX;
                this.addressmode[228] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[229] = 3;
                //instruction(0xe5] = INS_SBC;
                this.addressmode[229] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[230] = 5;
                //instruction(0xe6] = INS_INC;
                this.addressmode[230] = ChiChiNES.AddressingModes.ZeroPage;
                this.clockcount[231] = 2;
                //instruction(0xe7] = INS_NOP;
                this.addressmode[231] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[232] = 2;
                //instruction(0xe8] = INS_INX;
                this.addressmode[232] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[233] = 3;
                //instruction(0xe9] = INS_SBC;
                this.addressmode[233] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[234] = 2;
                //instruction(0xea] = INS_NOP;
                this.addressmode[234] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[235] = 2;
                //instruction(0xeb] = INS_NOP;
                this.addressmode[235] = ChiChiNES.AddressingModes.Immediate;
                this.clockcount[236] = 4;
                //instruction(0xec] = INS_CPX;
                this.addressmode[236] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[237] = 4;
                //instruction(0xed] = INS_SBC;
                this.addressmode[237] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[238] = 6;
                //instruction(0xee] = INS_INC;
                this.addressmode[238] = ChiChiNES.AddressingModes.Absolute;
                this.clockcount[239] = 2;
                //instruction(0xef] = INS_NOP;
                this.addressmode[239] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[240] = 2;
                //instruction(0xf0] = INS_BEQ;
                this.addressmode[240] = ChiChiNES.AddressingModes.Relative;
                this.clockcount[241] = 5;
                //instruction(0xf1] = INS_SBC;
                this.addressmode[241] = ChiChiNES.AddressingModes.IndirectIndexed;
                this.clockcount[242] = 3;
                //instruction(0xf2] = INS_SBC;
                this.addressmode[242] = ChiChiNES.AddressingModes.IndirectZeroPage;
                this.clockcount[243] = 2;
                //instruction(0xf3] = INS_NOP;
                this.addressmode[243] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[244] = 2;
                //instruction(0xf4] = INS_NOP;
                this.addressmode[244] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[245] = 4;
                //instruction(0xf5] = INS_SBC;
                this.addressmode[245] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[246] = 6;
                //instruction(0xf6] = INS_INC;
                this.addressmode[246] = ChiChiNES.AddressingModes.ZeroPageX;
                this.clockcount[247] = 2;
                //instruction(0xf7] = INS_NOP;
                this.addressmode[247] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[248] = 2;
                //instruction(0xf8] = INS_SED;
                this.addressmode[248] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[249] = 4;
                //instruction(0xf9] = INS_SBC;
                this.addressmode[249] = ChiChiNES.AddressingModes.AbsoluteY;
                this.clockcount[250] = 4;
                //instruction(0xfa] = INS_PLX;
                this.addressmode[250] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[251] = 2;
                //instruction(0xfb] = INS_NOP;
                this.addressmode[251] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[252] = 2;
                //instruction(0xfc] = INS_NOP;
                this.addressmode[252] = ChiChiNES.AddressingModes.Implicit;
                this.clockcount[253] = 4;
                //instruction(0xfd] = INS_SBC;
                this.addressmode[253] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[254] = 7;
                //instruction(0xfe] = INS_INC;
                this.addressmode[254] = ChiChiNES.AddressingModes.AbsoluteX;
                this.clockcount[255] = 2;
                //instruction(0xff] = INS_NOP;
                this.addressmode[255] = ChiChiNES.AddressingModes.Implicit;
            },
            ResetCPU: function () {
                this._statusRegister = 52;
                this._operationCounter = 0;
                this._stackPointer = 253;
                this.setupticks();
                this.Ticks = 4;
                this.ProgramCounter = (this.GetByte$1(65532) + Bridge.Int.mul(this.GetByte$1(65533), 256)) | 0;
            },
            PowerOn: function () {
                // powers up with this state
                this._statusRegister = 52;
                this._stackPointer = 253;
                this._operationCounter = 0;
                this.setupticks();
                this.Ticks = 4;

                // wram initialized to 0xFF, with some exceptions
                // probably doesn't affect games, but why not?
                for (var i = 0; i < 2048; i = (i + 1) | 0) {
                    this.Rams[i] = 255;
                }
                this.Rams[8] = 247;
                this.Rams[9] = 239;
                this.Rams[10] = 223;
                this.Rams[15] = 191;

                this.ProgramCounter = (this.GetByte$1(65532) + Bridge.Int.mul(this.GetByte$1(65533), 256)) | 0;
            },
            GetState: function (outStream) {
                outStream.enqueue(this._programCounter);
                outStream.enqueue(this._accumulator);
                outStream.enqueue(this._indexRegisterX);
                outStream.enqueue(this._indexRegisterY);
                outStream.enqueue(this._statusRegister);
                outStream.enqueue(this._stackPointer);
                for (var i = 0; i < 2048; i = (i + 4) | 0) {
                    outStream.enqueue((this.Rams[i] << 24) | (this.Rams[((i + 1) | 0)] << 16) | (this.Rams[((i + 2) | 0)] << 8) | (this.Rams[((i + 3) | 0)]));
                }
            },
            SetState: function (inStream) {
                this._programCounter = inStream.dequeue();
                this._accumulator = inStream.dequeue();
                this._indexRegisterX = inStream.dequeue();
                this._indexRegisterY = inStream.dequeue();
                this._statusRegister = inStream.dequeue();
                this._stackPointer = inStream.dequeue();
                var packedByte = 0;
                for (var i = 0; i < 2048; i = (i + 4) | 0) {
                    packedByte = inStream.dequeue();
                    this.Rams[i] = (packedByte >> 24) & 255;
                    this.Rams[((i + 1) | 0)] = (packedByte >> 16) & 255;
                    this.Rams[((i + 2) | 0)] = (packedByte >> 8) & 255;
                    this.Rams[((i + 3) | 0)] = packedByte & 255;

                }
            },
            DecodeAddress: function () {
                this._currentInstruction_ExtraTiming = 0;
                var result = 0;
                switch (this._currentInstruction_AddressingMode) {
                    case ChiChiNES.AddressingModes.Absolute: 
                        // two parameters refer to the memory position
                        result = ((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0);
                        break;
                    case ChiChiNES.AddressingModes.AbsoluteX: 
                        // absolute, x indexed - two paramaters + Index register x
                        result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterX) | 0));
                        if ((result & 255) < this._indexRegisterX) {
                            this._currentInstruction_ExtraTiming = 1;
                        }
                        break;
                    case ChiChiNES.AddressingModes.AbsoluteY: 
                        // absolute, y indexed - two paramaters + Index register y
                        result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterY) | 0));
                        if ((result & 255) < this._indexRegisterY) {
                            this._currentInstruction_ExtraTiming = 1;
                        }
                        break;
                    case ChiChiNES.AddressingModes.ZeroPage: 
                        // first parameter represents offset in zero page
                        result = this._currentInstruction_Parameters0 & 255;
                        break;
                    case ChiChiNES.AddressingModes.ZeroPageX: 
                        result = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 255;
                        break;
                    case ChiChiNES.AddressingModes.ZeroPageY: 
                        result = ((((this._currentInstruction_Parameters0 & 255) + (this._indexRegisterY & 255)) | 0)) & 255;
                        break;
                    case ChiChiNES.AddressingModes.Indirect: 
                        this.lowByte = this._currentInstruction_Parameters0;
                        this.highByte = this._currentInstruction_Parameters1 << 8;
                        var indAddr = (this.highByte | this.lowByte) & 65535;
                        var indirectAddr = (this.GetByte$1(indAddr));
                        this.lowByte = (((this.lowByte + 1) | 0)) & 255;
                        indAddr = (this.highByte | this.lowByte) & 65535;
                        indirectAddr = indirectAddr | (this.GetByte$1(indAddr) << 8);
                        result = indirectAddr;
                        break;
                    case ChiChiNES.AddressingModes.IndexedIndirect: 
                        var addr = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 255;
                        this.lowByte = this.GetByte$1(addr);
                        addr = (addr + 1) | 0;
                        this.highByte = this.GetByte$1(addr & 255);
                        this.highByte = this.highByte << 8;
                        result = this.highByte | this.lowByte;
                        break;
                    case ChiChiNES.AddressingModes.IndirectIndexed: 
                        this.lowByte = this.GetByte$1(this._currentInstruction_Parameters0 & 255);
                        this.highByte = this.GetByte$1((((this._currentInstruction_Parameters0 + 1) | 0)) & 255) << 8;
                        addr = (this.lowByte | this.highByte);
                        result = (addr + this._indexRegisterY) | 0;
                        if ((result & 255) > this._indexRegisterY) {
                            this._currentInstruction_ExtraTiming = 1;
                        }
                        break;
                    case ChiChiNES.AddressingModes.Relative: 
                        result = (((this._programCounter + this._currentInstruction_Parameters0) | 0));
                        break;
                    default: 
                        this.HandleBadOperation();
                        break;
                }
                return (result & 65535);
            },
            HandleBadOperation: function () {
                throw new System.NotImplementedException("Executors.DecodeAddress() recieved an invalid addressmode");
            },
            DecodeOperand: function () {
                switch (this._currentInstruction_AddressingMode) {
                    case ChiChiNES.AddressingModes.Immediate: 
                        this.DataBus = this._currentInstruction_Parameters0;
                        return this._currentInstruction_Parameters0;
                    case ChiChiNES.AddressingModes.Accumulator: 
                        return this._accumulator;
                    default: 
                        this.DataBus = this.GetByte$1(this.DecodeAddress());
                        return this.DataBus;
                }
            },
            StoreOperand: function (address) { },
            Execute: function () {
                switch (this._currentInstruction_OpCode) {
                    case 128: 
                    case 130: 
                    case 194: 
                    case 226: 
                    case 4: 
                    case 20: 
                    case 52: 
                    case 68: 
                    case 84: 
                    case 100: 
                    case 116: 
                    case 212: 
                    case 244: 
                    case 12: 
                    case 28: 
                    case 60: 
                    case 92: 
                    case 124: 
                    case 220: 
                    case 252: 
                        //SKB()
                        //SKW();
                        this.DecodeAddress();
                        break;
                    case 105: 
                    case 101: 
                    case 117: 
                    case 109: 
                    case 125: 
                    case 121: 
                    case 97: 
                    case 113: 
                        this.ADC();
                        break;
                    case 41: 
                    case 37: 
                    case 53: 
                    case 45: 
                    case 61: 
                    case 57: 
                    case 33: 
                    case 49: 
                        this.AND();
                        break;
                    case 10: 
                    case 6: 
                    case 22: 
                    case 14: 
                    case 30: 
                        this.ASL();
                        break;
                    case 144: 
                        this.BCC();
                        break;
                    case 176: 
                        this.BCS();
                        break;
                    case 240: 
                        this.BEQ();
                        break;
                    case 36: 
                    case 44: 
                        this.BIT();
                        break;
                    case 48: 
                        this.BMI();
                        break;
                    case 208: 
                        this.BNE();
                        break;
                    case 16: 
                        this.BPL();
                        break;
                    case 0: 
                        this.BRK();
                        break;
                    case 80: 
                        this.BVC();
                        break;
                    case 112: 
                        this.BVS();
                        break;
                    case 24: 
                        this.CLC();
                        break;
                    case 216: 
                        this.CLD();
                        break;
                    case 88: 
                        this.CLI();
                        break;
                    case 184: 
                        this.CLV();
                        break;
                    case 201: 
                    case 197: 
                    case 213: 
                    case 205: 
                    case 221: 
                    case 217: 
                    case 193: 
                    case 209: 
                        this.CMP();
                        break;
                    case 224: 
                    case 228: 
                    case 236: 
                        this.CPX();
                        break;
                    case 192: 
                    case 196: 
                    case 204: 
                        this.CPY();
                        break;
                    case 198: 
                    case 214: 
                    case 206: 
                    case 222: 
                        this.DEC();
                        break;
                    case 202: 
                        this.DEX();
                        break;
                    case 136: 
                        this.DEY();
                        break;
                    case 73: 
                    case 69: 
                    case 85: 
                    case 77: 
                    case 93: 
                    case 89: 
                    case 65: 
                    case 81: 
                        this.EOR();
                        break;
                    case 230: 
                    case 246: 
                    case 238: 
                    case 254: 
                        this.INC();
                        break;
                    case 232: 
                        this.INX();
                        break;
                    case 200: 
                        this.INY();
                        break;
                    case 76: 
                    case 108: 
                        this.JMP();
                        break;
                    case 32: 
                        this.JSR();
                        break;
                    case 169: 
                    case 165: 
                    case 181: 
                    case 173: 
                    case 189: 
                    case 185: 
                    case 161: 
                    case 177: 
                        this.LDA();
                        break;
                    case 162: 
                    case 166: 
                    case 182: 
                    case 174: 
                    case 190: 
                        this.LDX();
                        break;
                    case 160: 
                    case 164: 
                    case 180: 
                    case 172: 
                    case 188: 
                        this.LDY();
                        break;
                    case 74: 
                    case 70: 
                    case 86: 
                    case 78: 
                    case 94: 
                        this.LSR();
                        break;
                    case 234: 
                    case 26: 
                    case 58: 
                    case 90: 
                    case 122: 
                    case 218: 
                    case 250: 
                    case 137: 
                        //case 0x04:
                        //case 0x14:
                        //case 0x34:
                        //case 0x44:
                        //case 0x64:
                        //case 0x80:
                        //case 0x82:
                        //case 0xc2:
                        //case 0xd4:
                        //case 0xe2:
                        //case 0xf4:
                        //case 0x0c:
                        //case 0x1c:
                        //case 0x3c:
                        //case 0x5c:
                        //case 0x7c:
                        //case 0xdc:
                        //case 0xfc:
                        this.NOP();
                        break;
                    case 9: 
                    case 5: 
                    case 21: 
                    case 13: 
                    case 29: 
                    case 25: 
                    case 1: 
                    case 17: 
                        this.ORA();
                        break;
                    case 72: 
                        this.PHA();
                        break;
                    case 8: 
                        this.PHP();
                        break;
                    case 104: 
                        this.PLA();
                        break;
                    case 40: 
                        this.PLP();
                        break;
                    case 42: 
                    case 38: 
                    case 54: 
                    case 46: 
                    case 62: 
                        this.ROL();
                        break;
                    case 106: 
                    case 102: 
                    case 118: 
                    case 110: 
                    case 126: 
                        this.ROR();
                        break;
                    case 64: 
                        this.RTI();
                        break;
                    case 96: 
                        this.RTS();
                        break;
                    case 235: 
                    case 233: 
                    case 229: 
                    case 245: 
                    case 237: 
                    case 253: 
                    case 249: 
                    case 225: 
                    case 241:  // undocumented sbc immediate
                        this.SBC();
                        break;
                    case 56: 
                        this.SEC();
                        break;
                    case 248: 
                        this.SED();
                        break;
                    case 120: 
                        this.SEI();
                        break;
                    case 133: 
                    case 149: 
                    case 141: 
                    case 157: 
                    case 153: 
                    case 129: 
                    case 145: 
                        this.STA();
                        break;
                    case 134: 
                    case 150: 
                    case 142: 
                        this.STX();
                        break;
                    case 132: 
                    case 148: 
                    case 140: 
                        this.STY();
                        break;
                    case 170: 
                        this.TAX();
                        break;
                    case 168: 
                        this.TAY();
                        break;
                    case 186: 
                        this.TSX();
                        break;
                    case 138: 
                        this.TXA();
                        break;
                    case 154: 
                        this.TXS();
                        break;
                    case 152: 
                        this.TYA();
                        break;
                    case 11: 
                    case 43: 
                        this.AAC();
                        break;
                    case 75: 
                        this.ASR();
                        break;
                    case 107: 
                        this.ARR();
                        break;
                    case 171: 
                        this.ATX();
                        break;
                }
            },
            SetZNFlags: function (data) {

                //zeroResult = (data & 0xFF) == 0;
                //negativeResult = (data & 0x80) == 0x80;

                if ((data & 255) === 0) {
                    this._statusRegister = this._statusRegister | 2;
                } else {
                    this._statusRegister = this._statusRegister & (-3);
                } // ((int)CPUStatusMasks.ZeroResultMask);

                if ((data & 128) === 128) {
                    this._statusRegister = this._statusRegister | 128;
                } else {
                    this._statusRegister = this._statusRegister & (-129);
                } // ((int)CPUStatusMasks.NegativeResultMask);
                //SetFlag(CPUStatusBits.ZeroResult, (data & 0xFF) == 0);
                //SetFlag(CPUStatusBits.NegativeResult, (data & 0x80) == 0x80);
            },
            LDA: function () {

                this._accumulator = this.DecodeOperand();

                this.SetZNFlags(this._accumulator);

            },
            LDX: function () {

                this._indexRegisterX = this.DecodeOperand();
                this.SetZNFlags(this._indexRegisterX);
            },
            LDY: function () {
                this._indexRegisterY = this.DecodeOperand();
                this.SetZNFlags(this._indexRegisterY);
            },
            STA: function () {
                this.SetByte$1(this.DecodeAddress(), this._accumulator);
            },
            STX: function () {
                this.SetByte$1(this.DecodeAddress(), this._indexRegisterX);
            },
            STY: function () {
                this.SetByte$1(this.DecodeAddress(), this._indexRegisterY);
            },
            SED: function () {
                this.SetFlag(ChiChiNES.CPUStatusMasks.DecimalModeMask, true);
                // StatusRegister = StatusRegister | 0x8;
            },
            CLD: function () {
                this.SetFlag(ChiChiNES.CPUStatusMasks.DecimalModeMask, false);
                //            StatusRegister = StatusRegister & 0xF7;
            },
            JMP: function () {
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiNES.AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this._programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                } else {
                    this._programCounter = this.DecodeAddress();
                }
            },
            DEC: function () {
                var val = (this.DecodeOperand()) & 255;
                val = (val - 1) & 255;
                this.SetByte$1(this.DecodeAddress(), val);
                this.SetZNFlags(val);
            },
            INC: function () {
                var val = (this.DecodeOperand()) & 255;
                val = (val + 1) & 255;
                this.SetByte$1(this.DecodeAddress(), val);
                this.SetZNFlags(val);
            },
            ADC: function () {
                // start the read process
                var data = this.DecodeOperand();
                var carryFlag = (this._statusRegister & 1);
                var result = (((((this._accumulator + data) | 0) + carryFlag) | 0));

                // carry flag

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, result > 255);

                // overflow flag
                // SetFlag(CPUStatusBits.Overflow, (result > 0x7f || ~result > 0x7f));
                this.SetFlag(ChiChiNES.CPUStatusMasks.OverflowMask, ((this._accumulator ^ data) & 128) !== 128 && ((this._accumulator ^ result) & 128) === 128);

                // occurs when bit 7 is set
                this._accumulator = result & 255;
                this.SetZNFlags(this._accumulator);

            },
            LSR: function () {
                var rst = this.DecodeOperand();
                //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, (rst & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                rst = rst >> 1 & 255;

                this.SetZNFlags(rst);

                if (this._currentInstruction_AddressingMode === ChiChiNES.AddressingModes.Accumulator) {
                    this._accumulator = rst;
                } else {
                    this.SetByte$1(this.DecodeAddress(), rst);
                }
            },
            SKB: function () {
                // _programCounter++;
            },
            SBC: function () {
                // start the read process

                var data = (this.DecodeOperand()) >>> 0;

                var carryFlag = ((this._statusRegister ^ 1) & 1);

                var result = System.Int64.clipu32(System.Int64(this._accumulator).sub(System.Int64(data)).sub(System.Int64(carryFlag)));

                // set overflow flag if sign bit of accumulator changed
                this.SetFlag(ChiChiNES.CPUStatusMasks.OverflowMask, ((System.Int64(this._accumulator).xor(System.Int64(result))).and(System.Int64(128))).equals(System.Int64(128)) && ((System.Int64(this._accumulator).xor(System.Int64(data))).and(System.Int64(128))).equals(System.Int64(128)));

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, (result < 256));

                this._accumulator = result | 0;
                this.SetZNFlags(this._accumulator);


            },
            AND: function () {
                this._accumulator = (this._accumulator & this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
            },
            ORA: function () {

                this._accumulator = (this._accumulator | this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
            },
            EOR: function () {
                this._accumulator = (this._accumulator ^ this.DecodeOperand());
                this.SetZNFlags(this.Accumulator);
            },
            ASL: function () {
                var data = this.DecodeOperand();
                // set carry flag

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, ((data & 128) === 128));

                data = (data << 1) & 254;

                if (this._currentInstruction_AddressingMode === ChiChiNES.AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte$1(this.DecodeAddress(), data);
                }


                this.SetZNFlags(data);
            },
            BIT: function () {

                var operand = this.DecodeOperand();
                // overflow is bit 6
                this.SetFlag(ChiChiNES.CPUStatusMasks.OverflowMask, (operand & 64) === 64);
                //if ((operand & 64) == 64)
                //{
                //    _statusRegister = _statusRegister | 0x40;
                //}
                //else
                //{
                //    _statusRegister = _statusRegister & 0xBF;
                //}

                // negative is bit 7
                if ((operand & 128) === 128) {
                    this._statusRegister = this._statusRegister | 128;
                } else {
                    this._statusRegister = this._statusRegister & 127;
                }

                if ((operand & this.Accumulator) === 0) {
                    this._statusRegister = this._statusRegister | 2;
                } else {
                    this._statusRegister = this._statusRegister & 253;
                }

            },
            SEC: function () {
                // carry flag bit 0
                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, true);
            },
            CLC: function () {
                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, false);
            },
            SEI: function () {
                //StatusRegister = StatusRegister | 0x4;
                this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, true);
            },
            CLI: function () {
                //            StatusRegister = StatusRegister & 0xFB;
                this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, false);
            },
            CLV: function () {
                this.SetFlag(ChiChiNES.CPUStatusMasks.OverflowMask, false);

            },
            Compare: function (data) {
                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, data > 255);
                this.SetZNFlags(data & 255);
            },
            CMP: function () {
                var data = (((((this.Accumulator + 256) | 0) - this.DecodeOperand()) | 0));
                this.Compare(data);
            },
            CPX: function () {
                var data = (((((this._indexRegisterX + 256) | 0) - this.DecodeOperand()) | 0));
                this.Compare(data);
            },
            CPY: function () {
                var data = (((((this._indexRegisterY + 256) | 0) - this.DecodeOperand()) | 0));
                this.Compare(data);
            },
            NOP: function () {
                if (this._currentInstruction_AddressingMode === ChiChiNES.AddressingModes.AbsoluteX) {
                    this.DecodeAddress();
                }
            },
            Branch: function () {
                System.Diagnostics.Debug.assert(ChiChiNES.CPU2A03.cpuTiming[this._currentInstruction_OpCode] === 2);

                this._currentInstruction_ExtraTiming = 1;
                var addr = this._currentInstruction_Parameters0 & 255;
                if ((addr & 128) === 128) {
                    addr = (addr - 256) | 0;
                    this._programCounter = (this._programCounter + addr) | 0;
                } else {
                    this._programCounter = (this._programCounter + addr) | 0;
                }

                if ((this._programCounter & 255) < addr) {
                    this._currentInstruction_ExtraTiming = 2;
                }

            },
            BCC: function () {

                if ((this._statusRegister & 1) !== 1) {
                    this.Branch();
                }
            },
            BCS: function () {
                if ((this._statusRegister & 1) === 1) {
                    this.Branch();
                }
            },
            BPL: function () {
                if ((this._statusRegister & 128) !== 128) {
                    this.Branch();
                }
            },
            BMI: function () {
                if ((this._statusRegister & 128) === 128) {
                    this.Branch();
                }
            },
            BVC: function () {
                if ((this._statusRegister & 64) !== 64) {
                    this.Branch();
                }
            },
            BVS: function () {
                if ((this._statusRegister & 64) === 64) {
                    this.Branch();
                }
            },
            BNE: function () {
                if ((this._statusRegister & 2) !== 2) {
                    this.Branch();
                }
            },
            BEQ: function () {
                if ((this._statusRegister & 2) === 2) {
                    this.Branch();
                }
            },
            DEX: function () {
                this._indexRegisterX = (this._indexRegisterX - 1) | 0;
                this._indexRegisterX = this._indexRegisterX & 255;
                this.SetZNFlags(this._indexRegisterX);
            },
            DEY: function () {
                this._indexRegisterY = (this._indexRegisterY - 1) | 0;
                this._indexRegisterY = this._indexRegisterY & 255;
                this.SetZNFlags(this._indexRegisterY);
            },
            INX: function () {
                this._indexRegisterX = (this._indexRegisterX + 1) | 0;
                this._indexRegisterX = this._indexRegisterX & 255;
                this.SetZNFlags(this._indexRegisterX);
            },
            INY: function () {
                this._indexRegisterY = (this._indexRegisterY + 1) | 0;
                this._indexRegisterY = this._indexRegisterY & 255;
                this.SetZNFlags(this._indexRegisterY);
            },
            TAX: function () {
                this._indexRegisterX = this._accumulator;
                this.SetZNFlags(this._indexRegisterX);

            },
            TXA: function () {
                this._accumulator = this._indexRegisterX;
                this.SetZNFlags(this._accumulator);
            },
            TAY: function () {
                this._indexRegisterY = this._accumulator;
                this.SetZNFlags(this._indexRegisterY);
            },
            TYA: function () {
                this._accumulator = this._indexRegisterY;
                this.SetZNFlags(this._accumulator);
            },
            TXS: function () {
                this._stackPointer = this._indexRegisterX;
            },
            TSX: function () {
                this._indexRegisterX = this._stackPointer;
                this.SetZNFlags(this._indexRegisterX);
            },
            PHA: function () {
                this.PushStack(this._accumulator);
            },
            PLA: function () {
                this._accumulator = this.PopStack();
                this.SetZNFlags(this._accumulator);
            },
            PHP: function () {
                //PHP and BRK push the current status with bits 4 and 5 set on the stack; 
                // BRK then sets the I flag.
                var newStatus = this._statusRegister | 16 | 32;
                this.PushStack(newStatus);
            },
            PLP: function () {
                this._statusRegister = this.PopStack(); // | 0x20;
            },
            JSR: function () {
                this.PushStack((this._programCounter >> 8) & 255);
                this.PushStack((((this._programCounter - 1) | 0)) & 255);

                this._programCounter = this.DecodeAddress();
            },
            ROR: function () {
                var data = this.DecodeOperand();

                // old carry bit shifted into bit 7
                var oldbit = 0;
                if (this.GetFlag(ChiChiNES.CPUStatusMasks.CarryMask)) {
                    oldbit = 128;
                }

                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, (data & 1) === 1);

                data = (data >> 1) | oldbit;

                this.SetZNFlags(data);

                if (this._currentInstruction_AddressingMode === ChiChiNES.AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte$1(this.DecodeAddress(), data);
                }
            },
            ROL: function () {
                var data = this.DecodeOperand();

                var oldbit = 0;
                if (this.GetFlag(ChiChiNES.CPUStatusMasks.CarryMask)) {
                    oldbit = 1;
                }
                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, (data & 128) === 128);

                data = data << 1;
                data = data & 255;
                data = data | oldbit;
                this.SetZNFlags(data);

                if (this._currentInstruction_AddressingMode === ChiChiNES.AddressingModes.Accumulator) {
                    this._accumulator = data;
                } else {
                    this.SetByte$1(this.DecodeAddress(), data);
                }
            },
            RTS: function () {
                var high, low;
                low = (((this.PopStack() + 1) | 0)) & 255;
                high = this.PopStack();
                this._programCounter = ((high << 8) | low);
            },
            RTI: function () {
                this._statusRegister = this.PopStack(); // | 0x20;
                var low = this.PopStack();
                var high = this.PopStack();
                this._programCounter = ((((Bridge.Int.mul(256, high)) + low) | 0));
            },
            BRK: function () {
                //BRK causes a non-maskable interrupt and increments the program counter by one. 
                //Therefore an RTI will go to the address of the BRK +2 so that BRK may be used to replace a two-byte instruction 
                // for debugging and the subsequent RTI will be correct. 
                // push pc onto stack (high byte first)
                this._programCounter = (this._programCounter + 1) | 0;
                this.PushStack(this._programCounter >> 8 & 255);
                this.PushStack(this._programCounter & 255);
                // push sr onto stack

                //PHP and BRK push the current status with bits 4 and 5 set on the stack; 

                var newStatus = this._statusRegister | 16 | 32;

                this.PushStack(newStatus);

                // set interrupt disable, and break flags
                // BRK then sets the I flag.
                this._statusRegister = this._statusRegister | 20;

                // point pc to interrupt service routine
                this.AddressBus = 65534;
                var lowByte = this.GetByte();
                this.AddressBus = 65535;
                var highByte = this.GetByte();

                this._programCounter = (lowByte + Bridge.Int.mul(highByte, 256)) | 0;
            },
            AAC: function () {
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this._accumulator = this.DecodeOperand() & this._accumulator & 255;

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, (this._accumulator & 128) === 128);

                this.SetZNFlags(this._accumulator);

            },
            ASR: function () {
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this._accumulator = this.DecodeOperand() & this._accumulator;

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, (this._accumulator & 1) === 1);
                this._accumulator = this._accumulator >> 1;

                this.SetZNFlags(this._accumulator);

            },
            ARR: function () {
                //AND byte with accumulator, then rotate one bit right in accu - mulator and
                //  check bit 5 and 6:
                //If both bits are 1: set C, clear V. 0x30
                //If both bits are 0: clear C and V.
                //If only bit 5 is 1: set V, clear C.
                //If only bit 6 is 1: set C and V.
                //Status flags: N,V,Z,C
                this._accumulator = this.DecodeOperand() & this._accumulator;

                if ((this._statusRegister & 1) === 1) {
                    this._accumulator = (this._accumulator >> 1) | 128;
                } else {
                    this._accumulator = (this._accumulator >> 1);
                }

                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 

                this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, (this._accumulator & 1) === 1);


                switch (this._accumulator & 48) {
                    case 48: 
                        this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, true);
                        this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, false);
                        break;
                    case 0: 
                        this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, false);
                        this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, false);
                        break;
                    case 16: 
                        this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, false);
                        this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, true);
                        break;
                    case 32: 
                        this.SetFlag(ChiChiNES.CPUStatusMasks.CarryMask, true);
                        this.SetFlag(ChiChiNES.CPUStatusMasks.InterruptDisableMask, true);
                        break;
                }
            },
            ATX: function () {
                //AND byte with accumulator, then transfer accumulator to X register.
                //Status flags: N,Z
                this._indexRegisterX = (this._accumulator = this.DecodeOperand() & this._accumulator);
                this.SetZNFlags(this._indexRegisterX);
            },
            NMIHandler: function () {
                this._handleNMI = true;
            },
            IRQUpdater: function () {
                this._handleIRQ = !!(this.soundBopper.ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted | this._cart.ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted);
            },
            LoadBytes: function (offset, bytes) {
                System.Array.copy(bytes, 0, this.Rams, offset, bytes.length);
            },
            LoadBytes$1: function (offset, bytes, length) {
                System.Array.copy(bytes, 0, this.Rams, offset, length);
            },
            PushStack: function (data) {
                this.Rams[((this._stackPointer + 256) | 0)] = data & 255;
                this._stackPointer = (this._stackPointer - 1) | 0;
                if (this._stackPointer < 0) {
                    this._stackPointer = 255;
                }
            },
            PopStack: function () {
                this._stackPointer = (this._stackPointer + 1) | 0;
                if (this._stackPointer > 255) {
                    this._stackPointer = 0;
                }
                return this.Rams[((this._stackPointer + 256) | 0)] & 255;
            },
            GetByte: function () {
                this.DataBus = this.GetByte$1(this.AddressBus);
                return this.DataBus;
            },
            GetByte$1: function (address) {
                var result = 0;


                // check high byte, find appropriate handler
                switch (address & 61440) {
                    case 0: 
                    case 4096: 
                        if (address < 2048) {
                            result = this.Rams[address];
                        } else {
                            result = address >> 8;
                        }
                        break;
                    case 8192: 
                    case 12288: 
                        result = this._pixelWhizzler.ChiChiNES$IPPU$GetByte(this.clock, address);
                        break;
                    case 16384: 
                        switch (address) {
                            case 16406: 
                                result = this._padOne.GetByte(this.clock, address);
                                break;
                            case 16407: 
                                //result = _padTwo.GetByte(clock, address);
                                break;
                            case 16405: 
                                result = this.soundBopper.ChiChiNES$IClockedMemoryMappedIOElement$GetByte(this.clock, address);
                                break;
                            default: 
                                // return open bus?
                                result = address >> 8;
                                break;
                        }
                        break;
                    case 20480: 
                        // ??
                        result = address >> 8;
                        break;
                    case 24576: 
                    case 28672: 
                    case 32768: 
                    case 36864: 
                    case 40960: 
                    case 45056: 
                    case 49152: 
                    case 53248: 
                    case 57344: 
                    case 61440: 
                        // cart 
                        result = this._cart.ChiChiNES$IClockedMemoryMappedIOElement$GetByte(this.clock, address);
                        break;
                    default: 
                        throw new System.Exception("Bullshit!");
                }
                if (this._cheating && this.memoryPatches.containsKey(address)) {

                    return this.memoryPatches.get(address).ChiChiNES$Hacking$IMemoryPatch$Activated ? this.memoryPatches.get(address).ChiChiNES$Hacking$IMemoryPatch$GetData(result) & 255 : result & 255;
                }

                return result & 255;
            },
            PeekByte: function (address) {
                var result = 0;


                // check high byte, find appropriate handler
                switch (address & 61440) {
                    case 0: 
                    case 4096: 
                        if (address < 2048) {
                            result = this.Rams[address];
                        } else {
                            result = address >> 8;
                        }
                        break;
                    case 8192: 
                    case 12288: 
                        result = this._pixelWhizzler.ChiChiNES$IPPU$GetByte(this.clock, address);
                        break;
                    case 16384: 
                        switch (address) {
                            case 16406: 
                                result = 0; //  _padOne.GetByte(clock, address);
                                break;
                            case 16407: 
                                //result = _padTwo.GetByte(clock, address);
                                break;
                            case 16405: 
                                result = 0; //  soundBopper.GetByte(clock, address);
                                break;
                            default: 
                                // return open bus?
                                result = address >> 8;
                                break;
                        }
                        break;
                    case 20480: 
                        // ??
                        result = address >> 8;
                        break;
                    case 24576: 
                    case 28672: 
                    case 32768: 
                    case 36864: 
                    case 40960: 
                    case 45056: 
                    case 49152: 
                    case 53248: 
                    case 57344: 
                    case 61440: 
                        // cart 
                        result = this._cart.ChiChiNES$IClockedMemoryMappedIOElement$GetByte(this.clock, address);
                        break;
                    default: 
                        throw new System.Exception("Bullshit!");
                }
                if (this._cheating && this.memoryPatches.containsKey(address)) {

                    return this.memoryPatches.get(address).ChiChiNES$Hacking$IMemoryPatch$Activated ? this.memoryPatches.get(address).ChiChiNES$Hacking$IMemoryPatch$GetData(result) & 255 : result & 255;
                }

                return result & 255;
            },
            /**
             * gets an array of cpu memory, without affecting emulation
             *
             * @instance
             * @public
             * @this ChiChiNES.CPU2A03
             * @memberof ChiChiNES.CPU2A03
             * @param   {number}            start     
             * @param   {number}            finish
             * @return  {Array.<number>}
             */
            PeekBytes: function (start, finish) {
                var array = System.Array.init(((finish - start) | 0), 0, System.Int32);
                for (var i = 0; i < ((finish - start) | 0); i = (i + 1) | 0) {
                    array[i] = this.PeekByte(((start + i) | 0));
                }
                return array;
            },
            SetByte: function () {

                this.SetByte$1(this.AddressBus, this.DataBus & 255);
            },
            SetByte$1: function (address, data) {
                // check high byte, find appropriate handler
                if (address < 2048) {
                    this.Rams[address & 2047] = data & 255;
                    return;
                }
                switch (address & 61440) {
                    case 0: 
                    case 4096: 
                        // nes sram
                        this.Rams[address & 2047] = data & 255;
                        break;
                    case 20480: 
                        this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(this.clock, address, data);
                        break;
                    case 24576: 
                    case 28672: 
                    case 32768: 
                    case 36864: 
                    case 40960: 
                    case 45056: 
                    case 49152: 
                    case 53248: 
                    case 57344: 
                    case 61440: 
                        // cart rom banks
                        this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(this.clock, address, data);
                        break;
                    case 8192: 
                    case 12288: 
                        this._pixelWhizzler.ChiChiNES$IPPU$SetByte(this.clock, address, data);
                        break;
                    case 16384: 
                        switch (address) {
                            case 16384: 
                            case 16385: 
                            case 16386: 
                            case 16387: 
                            case 16388: 
                            case 16389: 
                            case 16390: 
                            case 16391: 
                            case 16392: 
                            case 16393: 
                            case 16394: 
                            case 16395: 
                            case 16396: 
                            case 16397: 
                            case 16398: 
                            case 16399: 
                            case 16405: 
                            case 16407: 
                                this.soundBopper.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(this.clock, address, data);
                                break;
                            case 16404: 
                                this._pixelWhizzler.ChiChiNES$IPPU$CopySprites(Bridge.ref(this, "Rams"), Bridge.Int.mul(data, 256));
                                this._currentInstruction_ExtraTiming = (this._currentInstruction_ExtraTiming + 512) | 0;
                                break;
                            case 16406: 
                                this._padOne.SetByte(this.clock, address, data & 1);
                                //  _padTwo.SetByte(clock, address, data & 1);
                                break;
                        }
                        break;
                }
            },
            FindNextEvent: function () {
                // it'll either be the ppu's NMI, or an irq from either the apu or the cart
                this.nextEvent = (this.clock + this._pixelWhizzler.ChiChiNES$IPPU$NextEventAt) | 0;

            },
            HandleNextEvent: function () {
                this._pixelWhizzler.ChiChiNES$IPPU$HandleEvent(this.Clock);
                this.FindNextEvent();
            },
            ResetInstructionHistory: function () {
                //_instructionHistory = new Instruction[0x100];
                this.instructionHistoryPointer = 255;

            },
            WriteInstructionHistoryAndUsage: function () {
                var $t;

                this._instructionHistory[(Bridge.identity(this.instructionHistoryPointer, (this.instructionHistoryPointer = (this.instructionHistoryPointer - 1) | 0))) & 255] = ($t = new ChiChiNES.CPU2A03.Instruction.ctor(), $t.time = this.systemClock, $t.A = this._accumulator, $t.X = this._indexRegisterX, $t.Y = this._indexRegisterY, $t.SR = this._statusRegister, $t.SP = this._stackPointer, $t.frame = this.clock, $t.OpCode = this._currentInstruction_OpCode, $t.Parameters0 = this._currentInstruction_Parameters0, $t.Parameters1 = this._currentInstruction_Parameters1, $t.Address = this._currentInstruction_Address, $t.AddressingMode = this._currentInstruction_AddressingMode, $t.ExtraTiming = this._currentInstruction_ExtraTiming, $t);
                this.instructionUsage[this._currentInstruction_OpCode] = (this.instructionUsage[this._currentInstruction_OpCode] + 1) | 0;
                if ((this.instructionHistoryPointer & 255) === 255) {
                    this.FireDebugEvent("instructionHistoryFull");
                }

            },
            FireDebugEvent: function (s) {
                !Bridge.staticEquals(this.DebugEvent, null) ? this.DebugEvent(this, { }) : null;
            },
            PeekInstruction: function (address) {
                //TODO: this needs to be non-invasive
                var inst = new ChiChiNES.CPU2A03.Instruction.ctor();

                //inst.OpCode = GetByte(address++);
                //inst.AddressingMode = addressmode[inst.OpCode];
                //inst.Length = 1;
                //FetchInstructionParameters(ref inst, address);
                return inst;
            }
        }
    });

    Bridge.define("ChiChiNES.CPU2A03.Instruction", {
        fields: {
            AddressingMode: 0,
            frame: 0,
            time: System.UInt64(0),
            A: 0,
            X: 0,
            Y: 0,
            SR: 0,
            SP: 0,
            Address: 0,
            OpCode: 0,
            Parameters0: 0,
            Parameters1: 0,
            ExtraTiming: 0,
            Length: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
            },
            $ctor1: function (inst) {
                this.$initialize();
                this.AddressingMode = inst.AddressingMode;
                this.Address = inst.Address;
                this.OpCode = inst.OpCode;
                this.Parameters0 = inst.Parameters0;
                this.Parameters1 = inst.Parameters1;
                this.ExtraTiming = inst.ExtraTiming;
                this.Length = inst.Length;


            }
        }
    });

    Bridge.define("ChiChiNES.CPUStatusBits", {
        $kind: "enum",
        statics: {
            fields: {
                Carry: 0,
                ZeroResult: 1,
                InterruptDisable: 2,
                DecimalMode: 3,
                BreakCommand: 4,
                Expansion: 5,
                Overflow: 6,
                NegativeResult: 7
            }
        }
    });

    Bridge.define("ChiChiNES.CPUStatusMasks", {
        $kind: "enum",
        statics: {
            fields: {
                CarryMask: 1,
                ZeroResultMask: 2,
                InterruptDisableMask: 4,
                DecimalModeMask: 8,
                BreakCommandMask: 16,
                ExpansionMask: 32,
                OverflowMask: 64,
                NegativeResultMask: 128
            }
        }
    });

    Bridge.define("ChiChiNES.Hacking.IMemoryPatch", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.IControlPad", {
        inherits: [System.IDisposable],
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.IMemoryMappedIOElement", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.Interaction.CallbackType", {
        $kind: "enum",
        statics: {
            fields: {
                None: 0,
                NoArgs: 1,
                Array: 2,
                IntPtr: 3
            }
        }
    });

    /** @namespace ChiChiNES.Interaction */

    /**
     * Defines what the main windows interaction with the current renderer
     *
     * @abstract
     * @public
     * @class ChiChiNES.Interaction.IDisplayContext
     */
    Bridge.define("ChiChiNES.Interaction.IDisplayContext", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.Interaction.InvalidDisplayContextException", {
        inherits: [System.Exception],
        ctors: {
            ctor: function (s) {
                this.$initialize();
                System.Exception.ctor.call(this, s);
            },
            $ctor1: function (s, innerException) {
                this.$initialize();
                System.Exception.ctor.call(this, s, innerException);
            }
        }
    });

    Bridge.define("ChiChiNES.Interaction.NESDisplayPluginAttribute", {
        inherits: [System.Attribute]
    });

    Bridge.define("ChiChiNES.Interaction.NESPixelFormats", {
        $kind: "enum",
        statics: {
            fields: {
                RGB: 0,
                BGR: 1,
                Indexed: 2
            }
        }
    });

    Bridge.define("ChiChiNES.IPixelAwareDevice", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.IPPU", {
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.Machine.ControlPanel.RunningStatuses", {
        $kind: "enum",
        statics: {
            fields: {
                Unloaded: 0,
                Off: 1,
                Running: 2,
                Frozen: 3,
                Paused: 4
            }
        }
    });

    Bridge.define("ChiChiNES.NameTableMirroring", {
        $kind: "enum",
        statics: {
            fields: {
                OneScreen: 0,
                Vertical: 1,
                Horizontal: 2,
                FourScreen: 3
            }
        }
    });

    Bridge.define("ChiChiNES.NESMachine", {
        inherits: [System.IDisposable],
        fields: {
            _currCartName: null,
            runState: 0,
            lastSaveState: null,
            currentSaveSlot: 0,
            _cpu: null,
            _ppu: null,
            _cart: null,
            _sharedWave: null,
            soundBopper: null,
            _enableSound: false,
            breakpointHit: false,
            tiler: null,
            soundThreader: null,
            doDraw: false,
            isDebugging: false,
            _totalCPUClocks: 0,
            frameCount: 0,
            /**
             * runs a "step", either a pending non-maskable interrupt, maskable interupt, or a sprite DMA transfer,
              or a regular machine cycle, then runs the appropriate number of PPU clocks based on CPU action
              ppuclocks = cpuclocks * 3
             note: this approach relies on very precise cpu timing
             *
             * @instance
             * @private
             * @memberof ChiChiNES.NESMachine
             * @default true
             * @type boolean
             */
            frameOn: false,
            frameJustEnded: false
        },
        events: {
            SoundStatusChanged: null,
            Drawscreen: null
        },
        props: {
            CurrentCartName: {
                get: function () {
                    return this._currCartName;
                }
            },
            RunState: {
                get: function () {
                    return this.runState;
                },
                set: function (value) {
                    if (this.runState !== value) {
                        this.runState = value;
                        //if (RunStatusChangedEvent != null) RunStatusChangedEvent(this, EventArgs.Empty);
                    }
                }
            },
            CurrentSaveSlot: {
                get: function () {
                    return this.currentSaveSlot;
                },
                set: function (value) {
                    if (value >= 0 && value <= 10) {
                        this.currentSaveSlot = value;
                    }
                }
            },
            Cpu: {
                get: function () {
                    return this._cpu;
                },
                set: function (value) {
                    this._cpu = value;
                }
            },
            Cart: {
                get: function () {
                    return this._cart;
                }
            },
            SoundBopper: {
                get: function () {
                    return this.soundBopper;
                },
                set: function (value) {
                    this.soundBopper = value;
                }
            },
            WaveForms: {
                get: function () {
                    return this._sharedWave;
                }
            },
            EnableSound: {
                get: function () {
                    return this._enableSound;
                },
                set: function (value) {
                    var $t;

                    if (this._enableSound !== value) {
                        if (!Bridge.staticEquals(this.SoundStatusChanged, null)) {
                            this.SoundStatusChanged(this, ($t = new ChiChiNES.BeepsBoops.SoundStatusChangeEventArgs(), $t.Muted = !value, $t));
                        }
                        this.soundBopper.Muted = !value;
                        this._enableSound = value;
                    }
                }
            },
            Tiler: {
                get: function () {
                    return this.tiler;
                }
            },
            FrameCount: {
                get: function () {
                    return this.frameCount;
                },
                set: function (value) {
                    this.frameCount = value;
                }
            },
            IsRunning: {
                get: function () {
                    return true;
                }
            },
            PPU: {
                get: function () {
                    return this._ppu;
                }
            },
            PadOne: {
                get: function () {
                    return this._cpu.PadOne.ControlPad;
                },
                set: function (value) {
                    this._cpu.PadOne.ControlPad = value;
                }
            },
            PadTwo: {
                get: function () {
                    return this._cpu.PadTwo.ControlPad;
                },
                set: function (value) {
                    this._cpu.PadTwo.ControlPad = value;
                    this.PPU.ChiChiNES$IPPU$PixelAwareDevice = Bridge.as(value, ChiChiNES.IPixelAwareDevice);
                }
            },
            SRAMReader: null,
            SRAMWriter: null
        },
        alias: ["dispose", "System$IDisposable$dispose"],
        ctors: {
            init: function () {
                this._currCartName = "";
                this.runState = ChiChiNES.Machine.ControlPanel.RunningStatuses.Unloaded;
                this.lastSaveState = System.Array.init(10, null, System.Array.type(System.Int32));
                this._enableSound = true;
                this.breakpointHit = false;
                this.doDraw = false;
                this._totalCPUClocks = 0;
                this.frameCount = 0;
                this.frameOn = true;
                this.frameJustEnded = false;
            },
            ctor: function (cpu, ppu, tiler, wavSharer, soundBopper, soundThread) {
                this.$initialize();

                //machineWorkQueue = new MachineQueue(UpdateQueue);

                this._cpu = cpu;
                this._ppu = ppu;
                this._ppu.ChiChiNES$IPPU$FrameFinishHandler = Bridge.fn.cacheBind(this, this.FrameFinished);
                this.tiler = tiler;

                this._sharedWave = wavSharer;
                this.soundBopper = soundBopper;
                this._cpu.SoundBopper = soundBopper;

                this.soundThreader = soundThread;
                this.addSoundStatusChanged(Bridge.fn.cacheBind(this.soundThreader, this.soundThreader.OnSoundStatusChanged));

                this.Initialize();
            }
        },
        methods: {
            Initialize: function () {
                this._cpu.Clock = 0;
                this.frameCount = 0;
                // SetupTimer();
            },
            Reset: function () {
                if (this._cpu != null && this._cart != null) {
                    // ForceStop();
                    this.soundBopper.RebuildSound();
                    this._ppu.ChiChiNES$IPPU$Initialize();
                    this._cart.ChiChiNES$INESCart$InitializeCart();
                    this._cpu.ResetCPU();
                    this.ClearGenieCodes();
                    this._cpu.PowerOn();
                    this.RunState = ChiChiNES.Machine.ControlPanel.RunningStatuses.Running;
                }
            },
            PowerOn: function () {
                if (this._cpu != null && this._cart != null) {

                    this.soundBopper.RebuildSound();
                    this._ppu.ChiChiNES$IPPU$Initialize();
                    this._cart.ChiChiNES$INESCart$InitializeCart();
                    if (!Bridge.staticEquals(this.SRAMReader, null) && this._cart.ChiChiNES$INESCart$UsesSRAM) {
                        this._cart.ChiChiNES$INESCart$SRAM = this.SRAMReader(this._cart.ChiChiNES$INESCart$CheckSum);
                    }
                    this._cpu.ResetCPU();
                    this.ClearGenieCodes();
                    this._cpu.PowerOn();
                    this.RunState = ChiChiNES.Machine.ControlPanel.RunningStatuses.Running;
                }
            },
            PowerOff: function () {
                if (this._cart != null && !Bridge.staticEquals(this.SRAMWriter, null) && this._cart.ChiChiNES$INESCart$UsesSRAM) {
                    this.SRAMWriter(this._cart.ChiChiNES$INESCart$CheckSum, this._cart.ChiChiNES$INESCart$SRAM);
                }
                //ThreadStoptendo();
            },
            EjectCart: function () {
                if (this._cart != null && !Bridge.staticEquals(this.SRAMWriter, null) && this._cart.ChiChiNES$INESCart$UsesSRAM) {
                    this.SRAMWriter(this._cart.ChiChiNES$INESCart$CheckSum, this._cart.ChiChiNES$INESCart$SRAM);
                }
                //ForceStop();
                this._cart = null;
                this._currCartName = null;
                this.RunState = ChiChiNES.Machine.ControlPanel.RunningStatuses.Unloaded;
                //_ppu.CurrentScanLine = 0;
            },
            LoadCart: function (rom) {

                this.EjectCart();



                // if (runState == NES.Machine.ControlPanel.RunningStatuses.Running) ThreadStoptendo();

                this._currCartName = "Streamed";


                this._cart = ChiChiNES.ROMLoader.iNESFileHandler.LoadROM(this._ppu, rom);
                if (this._cart != null) {


                    this._cpu.Cart = Bridge.cast(this._cart, ChiChiNES.IClockedMemoryMappedIOElement);
                    this._cpu.Cart.ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler = Bridge.fn.cacheBind(this._cpu, this._cpu.InterruptRequest);
                    this._ppu.ChiChiNES$IPPU$ChrRomHandler = this._cart;


                } else {
                    throw new ChiChiNES.ROMLoader.CartLoadException.ctor("Unsupported ROM type - load failed.");
                }
            },
            GoTendo_NoThread: function (fileName) {
                // EjectCart();

                // //if (runState == NES.Machine.ControlPanel.RunningStatuses.Running) ThreadStoptendo();


                // _cart = iNESFileHandler.LoadROM(fileName, _ppu);
                // if (_cart != null)
                // {


                //     _cpu.Cart = (IClockedMemoryMappedIOElement)_cart;
                //     _cpu.Cart.NMIHandler = _cpu.InterruptRequest;
                //     _ppu.ChrRomHandler = _cart;


                //     PowerOn();
                //     //while (runState != NES.Machine.ControlPanel.RunningStatuses.Running)
                //     // ThreadRuntendo();
                // }
                // else
                // {
                //     throw new CartLoadException("Unsupported ROM type - load failed.");
                // }

            },
            GoTendo: function (fileName) {
                //EjectCart();

                //if (runState == NES.Machine.ControlPanel.RunningStatuses.Running) ThreadStoptendo();

                //_currCartName = Path.GetFileName(fileName);

                //_cart = iNESFileHandler.GetCart(fileName, _ppu);
                //if (_cart != null)
                //{


                //    _cpu.Cart = (IClockedMemoryMappedIOElement)_cart;
                //    _cpu.Cart.NMIHandler = _cpu.InterruptRequest;
                //    _ppu.ChrRomHandler = _cart;


                //    PowerOn();
                //    //while (runState != NES.Machine.ControlPanel.RunningStatuses.Running)
                //    //ThreadRuntendo();
                //}
                //else
                //{
                //    throw new CartLoadException("Unsupported ROM type - load failed.");
                //}

            },
            HasState: function (index) {
                return (this.lastSaveState != null && this.lastSaveState[index] != null);
            },
            GetState: function (index) {
                var state = new (System.Collections.Generic.Queue$1(System.Int32)).ctor();
                state = new (System.Collections.Generic.Queue$1(System.Int32)).ctor();
                this._cpu.GetState(state);
                this._ppu.ChiChiNES$IPPU$WriteState(state);
                this._cart.ChiChiNES$INESCart$WriteState(state);
                this.lastSaveState[index] = System.Array.init(state.Count, 0, System.Int32);
                state.copyTo$1(this.lastSaveState[index], 0);
            },
            SetState: function (index) {
                if (this.lastSaveState != null) {
                    var cloneState = new (System.Collections.Generic.Queue$1(System.Int32)).$ctor1(this.lastSaveState[index]);
                    this._cpu.SetState(cloneState);
                    this._ppu.ChiChiNES$IPPU$ReadState(cloneState);
                    this._cart.ChiChiNES$INESCart$ReadState(cloneState);
                }
            },
            ClearGenieCodes: function () {
                this._cpu.GenieCodes.clear();
                this._cpu.Cheating = false;
            },
            AddGameGenieCode: function (code, patch) {
                var $t;
                var hexCode = System.Array.init(code.length, 0, System.Byte);
                var i = 0;


                $t = Bridge.getEnumerator(code.toUpperCase());
                try {
                    while ($t.moveNext()) {
                        var c = $t.Current;
                        var digit = 0;
                        switch (c) {
                            case 65: 
                                digit = 0;
                                break;
                            case 80: 
                                digit = 1;
                                break;
                            case 90: 
                                digit = 2;
                                break;
                            case 76: 
                                digit = 3;
                                break;
                            case 71: 
                                digit = 4;
                                break;
                            case 73: 
                                digit = 5;
                                break;
                            case 84: 
                                digit = 6;
                                break;
                            case 89: 
                                digit = 7;
                                break;
                            case 69: 
                                digit = 8;
                                break;
                            case 79: 
                                digit = 9;
                                break;
                            case 88: 
                                digit = 10;
                                break;
                            case 85: 
                                digit = 11;
                                break;
                            case 75: 
                                digit = 12;
                                break;
                            case 83: 
                                digit = 13;
                                break;
                            case 86: 
                                digit = 14;
                                break;
                            case 78: 
                                digit = 15;
                                break;
                        }
                        hexCode[Bridge.identity(i, (i = (i + 1) | 0))] = digit;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }
                // magic spell that makes the genie appear!
                // http://tuxnes.sourceforge.net/gamegenie.html
                var address = ((32768 + ((hexCode[3] & 7) << 12)) | 0) | ((hexCode[5] & 7) << 8) | ((hexCode[4] & 8) << 8) | ((hexCode[2] & 7) << 4) | ((hexCode[1] & 8) << 4) | (hexCode[4] & 7) | (hexCode[3] & 8);


                var data = 0;
                var compare = 0;
                if (hexCode.length === 6) {
                    data = ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4) | (hexCode[0] & 7) | (hexCode[5] & 8);

                    patch.v = new ChiChiNES.Hacking.MemoryPatch(address, data);
                } else if (hexCode.length === 8) {
                    data = ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4) | (hexCode[0] & 7) | (hexCode[7] & 8);
                    compare = ((hexCode[7] & 7) << 4) | ((hexCode[6] & 8) << 4) | (hexCode[6] & 7) | (hexCode[5] & 8);

                    patch.v = new ChiChiNES.Hacking.ComparedMemoryPatch(address, (compare & 255), (data & 255));
                } else {
                    // not a genie code!  
                    patch.v = null;
                    return false;
                }
                try {
                    patch.v.ChiChiNES$Hacking$IMemoryPatch$Activated = true;
                    this._cpu.MemoryPatches.add(address, patch.v);
                    this._cpu.Cheating = true;
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);
                    this._cpu.Cheating = false;
                }
                return this._cpu.Cheating;
            },
            WriteWAVToFile: function (writer) {
                this._sharedWave.AppendFile(writer);
            },
            StopWritingWAV: function () {
                this._sharedWave.AppendFile(null);
            },
            SetupSound: function () {
                this._sharedWave = new ChiChiNES.BeepsBoops.WavSharer.ctor();
                //writer = new wavwriter(44100, "d:\\nesout.wav");
                this.soundBopper = new ChiChiNES.BeepsBoops.Bopper(this._sharedWave);
            },
            Runtendo: function () {
                this.isDebugging = false;
                this.RunFrame();
            },
            dispose: function () {


                if (this._cart != null && this._cart.ChiChiNES$INESCart$CheckSum != null && !Bridge.staticEquals(this.SRAMWriter, null)) {
                    this.SRAMWriter(this._cart.ChiChiNES$INESCart$CheckSum, this._cart.ChiChiNES$INESCart$SRAM);
                }


                Bridge.sleep(100);
                this._sharedWave.Dispose();
                this.soundThreader.dispose();
            },
            Step: function () {
                if (this.frameJustEnded) {
                    this._cpu.FindNextEvent();
                    this.frameOn = true;
                    this.frameJustEnded = false;
                }
                this._cpu.Step();

                if (!this.frameOn) {
                    this._totalCPUClocks = this._cpu.Clock;
                    //lock (_sharedWave)
                    //{
                    //    soundBopper.FlushFrame(_totalCPUClocks);
                    //    soundBopper.EndFrame(_totalCPUClocks);
                    //}
                    this._totalCPUClocks = 0;
                    this._cpu.Clock = 0;
                    this._ppu.ChiChiNES$IPPU$LastcpuClock = 0;
                    this.frameJustEnded = true;
                }
                //_cpu.Clock = _totalCPUClocks;
                //breakpoints: HandleBreaks();

            },
            RunFrame: function () {

                this.frameOn = true;
                this.frameJustEnded = false;

                this._cpu.FindNextEvent();
                do {
                    this._cpu.Step();
                } while (this.frameOn);
                this._totalCPUClocks = this._cpu.Clock;
                this._sharedWave;
                {
                    this.soundBopper.FlushFrame(this._totalCPUClocks);
                    this.soundBopper.EndFrame(this._totalCPUClocks);
                }

                if (this.PadOne != null) {
                    this.PadOne.ChiChiNES$IControlPad$refresh();
                }

                this._totalCPUClocks = 0;
                this._cpu.Clock = 0;
                this._ppu.ChiChiNES$IPPU$LastcpuClock = 0;


            },
            FrameFinished: function () {
                this.frameJustEnded = true;
                this.frameOn = false;
                this.Drawscreen(this, { });
            }
        }
    });

    Bridge.define("ChiChiNES.NESSprite", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new ChiChiNES.NESSprite(); }
            }
        },
        fields: {
            YPosition: 0,
            XPosition: 0,
            SpriteNumber: 0,
            Foreground: false,
            IsVisible: false,
            TileIndex: 0,
            AttributeByte: 0,
            FlipX: false,
            FlipY: false,
            Changed: false
        },
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([3351033891, this.YPosition, this.XPosition, this.SpriteNumber, this.Foreground, this.IsVisible, this.TileIndex, this.AttributeByte, this.FlipX, this.FlipY, this.Changed]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, ChiChiNES.NESSprite)) {
                    return false;
                }
                return Bridge.equals(this.YPosition, o.YPosition) && Bridge.equals(this.XPosition, o.XPosition) && Bridge.equals(this.SpriteNumber, o.SpriteNumber) && Bridge.equals(this.Foreground, o.Foreground) && Bridge.equals(this.IsVisible, o.IsVisible) && Bridge.equals(this.TileIndex, o.TileIndex) && Bridge.equals(this.AttributeByte, o.AttributeByte) && Bridge.equals(this.FlipX, o.FlipX) && Bridge.equals(this.FlipY, o.FlipY) && Bridge.equals(this.Changed, o.Changed);
            },
            $clone: function (to) {
                var s = to || new ChiChiNES.NESSprite();
                s.YPosition = this.YPosition;
                s.XPosition = this.XPosition;
                s.SpriteNumber = this.SpriteNumber;
                s.Foreground = this.Foreground;
                s.IsVisible = this.IsVisible;
                s.TileIndex = this.TileIndex;
                s.AttributeByte = this.AttributeByte;
                s.FlipX = this.FlipX;
                s.FlipY = this.FlipY;
                s.Changed = this.Changed;
                return s;
            }
        }
    });

    Bridge.define("ChiChiNES.PortQueueing.PortWriteEntry", {
        fields: {
            time: 0,
            address: 0,
            data: 0
        },
        ctors: {
            ctor: function (time, address, data) {
                this.$initialize();
                this.time = time;
                this.address = address;
                this.data = data;
            }
        }
    });

    Bridge.define("ChiChiNES.PPUWriteEvent", {
        inherits: [System.ComponentModel.INotifyPropertyChanged],
        fields: {
            isWrite: false,
            scanlineNum: 0,
            scanlinePos: 0,
            frameClock: 0,
            registerAffected: 0,
            dataWritten: 0
        },
        events: {
            PropertyChanged: null
        },
        props: {
            IsWrite: {
                get: function () {
                    return this.isWrite;
                },
                set: function (value) {
                    this.isWrite = value;
                }
            },
            ScanlineNum: {
                get: function () {
                    return this.scanlineNum;
                },
                set: function (value) {
                    this.scanlineNum = value;
                }
            },
            ScanlinePos: {
                get: function () {
                    return this.scanlinePos;
                },
                set: function (value) {
                    this.scanlinePos = value;
                }
            },
            FrameClock: {
                get: function () {
                    return this.frameClock;
                },
                set: function (value) {
                    this.frameClock = value;
                }
            },
            RegisterAffected: {
                get: function () {
                    return this.registerAffected;
                },
                set: function (value) {
                    this.registerAffected = value;
                }
            },
            DataWritten: {
                get: function () {
                    return this.dataWritten;
                },
                set: function (value) {
                    this.dataWritten = value;
                }
            },
            Text: {
                get: function () {
                    return this.toString();
                }
            }
        },
        alias: ["addPropertyChanged", "System$ComponentModel$INotifyPropertyChanged$addPropertyChanged",
        "removePropertyChanged", "System$ComponentModel$INotifyPropertyChanged$removePropertyChanged"],
        methods: {
            toString: function () {
                return System.String.format(" {0:x2} written to {1:x4} at {2}, {3}", this.registerAffected, this.dataWritten, this.scanlineNum, this.scanlinePos);
            }
        }
    });

    Bridge.define("ChiChiNES.ROMLoader.CartLoadException", {
        inherits: [System.Exception],
        ctors: {
            $ctor1: function (message, innerException) {
                this.$initialize();
                System.Exception.ctor.call(this, message, innerException);
            },
            ctor: function (message) {
                this.$initialize();
                System.Exception.ctor.call(this, message);
            }
        }
    });

    Bridge.define("ChiChiNES.ROMLoader.iNESFileHandler", {
        statics: {
            methods: {
                LoadROM: function (ppu, thefile) {
                    var _cart = null;
                    var iNesHeader = System.Array.init(16, 0, System.Byte);
                    var bytesRead = 16;
                    System.Array.copy(thefile, 0, iNesHeader, 0, 16);
                    /* 
                    .NES file format
                    ---------------------------------------------------------------------------
                    0-3      String "NES^Z" used to recognize .NES files.
                    4        Number of 16kB ROM banks.
                    5        Number of 8kB VROM banks.
                    6        bit 0     1 for vertical mirroring, 0 for horizontal mirroring
                    bit 1     1 for battery-backed RAM at $6000-$7FFF
                    bit 2     1 for a 512-byte trainer at $7000-$71FF
                    bit 3     1 for a four-screen VRAM layout 
                    bit 4-7   Four lower bits of ROM Mapper Type.
                    7        bit 0-3   Reserved, must be zeroes!
                    bit 4-7   Four higher bits of ROM Mapper Type.
                    8-15     Reserved, must be zeroes!
                    16-...   ROM banks, in ascending order. If a trainer is present, its
                    512 bytes precede the ROM bank contents.
                    ...-EOF  VROM banks, in ascending order.
                    ---------------------------------------------------------------------------
                    */
                    var mapperId = (iNesHeader[6] & 240);
                    mapperId = (Bridge.Int.div(mapperId, 16)) | 0;
                    mapperId = (mapperId + iNesHeader[7]) | 0;

                    var prgRomCount = iNesHeader[4];
                    var chrRomCount = iNesHeader[5];

                    var theRom = System.Array.init(Bridge.Int.mul(prgRomCount, 16384), 0, System.Byte);
                    var chrRom = System.Array.init(Bridge.Int.mul(chrRomCount, 16384), 0, System.Byte);

                    var chrOffset = 0;

                    //bytesRead = zipStream.Read(theRom, 0, theRom.Length);
                    System.Array.copy(thefile, 16, theRom, 0, theRom.length);
                    chrOffset = (16 + theRom.length) | 0;
                    var len = chrRom.length;
                    if (((chrOffset + chrRom.length) | 0) > thefile.length) {
                        len = (thefile.length - chrOffset) | 0;
                    }
                    System.Array.copy(thefile, chrOffset, chrRom, 0, len);
                    //zipStream.Read(chrRom, 0, chrRom.Length);
                    switch (mapperId) {
                        case 0: 
                        case 2: 
                        case 3: 
                        case 7: 
                            _cart = new ChiChiNES.CPU.NESCart();
                            break;
                        case 1: 
                            _cart = new ChiChiNES.NesCartMMC1();
                            break;
                        case 4: 
                            _cart = new ChiChiNES.NesCartMMC3();
                            break;
                    }

                    if (_cart != null) {
                        _cart.ChiChiNES$INESCart$Whizzler = ppu;
                        ppu.ChiChiNES$IPPU$ChrRomHandler = _cart;
                        _cart.ChiChiNES$INESCart$ROMHashFunction = null; //Hashers.HashFunction;
                        _cart.ChiChiNES$INESCart$LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
                    }

                    return _cart;

                }
            }
        }
    });

    Bridge.define("ChiChiNES.Sound.IWavStreamer", {
        inherits: [System.IDisposable],
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.Sound.SoundThreader", {
        inherits: [System.IDisposable],
        fields: {
            _wavePlayer: null
        },
        props: {
            WavePlayer: {
                get: function () {
                    return this._wavePlayer;
                },
                set: function (value) {
                    this._wavePlayer = value;
                }
            }
        },
        alias: ["dispose", "System$IDisposable$dispose"],
        ctors: {
            ctor: function (streamer) {
                this.$initialize();

                this._wavePlayer = streamer;

                //ThreadPool.QueueUserWorkItem(PlaySound, null);

            }
        },
        methods: {
            OnSoundStatusChanged: function (sender, e) {
                this._wavePlayer.ChiChiNES$Sound$IWavStreamer$Muted = e.Muted;
            },
            PlaySound: function (o) {
                this._wavePlayer.ChiChiNES$Sound$IWavStreamer$playPCM();
            },
            dispose: function () {
                this._wavePlayer.System$IDisposable$dispose();
            }
        }
    });

    Bridge.define("ChiChiNES.TileDoodler", {
        fields: {
            _ppu: null,
            currentNameTableEntries: null,
            currentPatternTableEntries: null
        },
        props: {
            XOffset: 0,
            YOffset: 0
        },
        ctors: {
            init: function () {
                this.currentNameTableEntries = System.Array.init(32, null, System.Array.type(System.Array.type(System.Int32)));
                this.currentPatternTableEntries = System.Array.init(2, null, System.Array.type(System.Array.type(System.Array.type(System.Int32))));
            },
            ctor: function (ppu) {
                var $t, $t1, $t2, $t3;
                this.$initialize();
                this._ppu = ppu;

                this.currentPatternTableEntries = System.Array.init(2, null, System.Array.type(System.Array.type(System.Array.type(System.Int32))));
                for (var pt = 0; pt < 2; pt = (pt + 1) | 0) {
                    this.currentPatternTableEntries[pt] = System.Array.init(32, null, System.Array.type(System.Array.type(System.Int32)));
                    for (var x = 0; x < 32; x = (x + 1) | 0) {
                        ($t = this.currentPatternTableEntries[pt])[x] = System.Array.init(30, null, System.Array.type(System.Int32));
                        for (var y = 0; y < 30; y = (y + 1) | 0) {
                            ($t1 = ($t2 = this.currentPatternTableEntries[pt])[x])[y] = System.Array.init(8, 0, System.Int32);
                        }

                    }
                }

                this.currentNameTableEntries = System.Array.init(32, null, System.Array.type(System.Array.type(System.Int32)));
                for (var i = 0; i < 32; i = (i + 1) | 0) {
                    this.currentNameTableEntries[i] = System.Array.init(30, null, System.Array.type(System.Int32));
                    for (var j = 0; j < 30; j = (j + 1) | 0) {
                        ($t3 = this.currentNameTableEntries[i])[j] = System.Array.init(8, 0, System.Int32);
                    }
                }

            }
        },
        methods: {
            GetPatternTableEntry: function (PatternTable, TileIndex, attributeByte, actualAddress) {
                var $t, $t1, $t2;
                // 8x8 tile
                var result = System.Array.init(64, 0, System.Int32);

                actualAddress.v = System.Array.init(8, 0, System.Int32);

                for (var i = 0; i < 8; i = (i + 1) | 0) {
                    var patternEntry = this._ppu.ChiChiNES$IPPU$ChrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0));

                    actualAddress.v[i] = this._ppu.ChiChiNES$IPPU$ChrRomHandler.ChiChiNES$INESCart$ActualChrRomOffset(((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0));

                    var patternEntryBit2 = this._ppu.ChiChiNES$IPPU$ChrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0) + 8) | 0));

                    for (var bit = 0; bit < 8; bit = (bit + 1) | 0) {
                        if ((patternEntry & ($t = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                            result[(((Bridge.Int.mul(i, 8)) + bit) | 0)] = 1 | attributeByte;
                        }
                        if ((patternEntryBit2 & ($t1 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                            result[($t2 = (((Bridge.Int.mul(i, 8)) + bit) | 0))] = result[$t2] | (2 | attributeByte);
                        }
                    }

                }

                return result;
            },
            GetSprite: function (PatternTable, TileIndex, attributeByte, flipX, flipY) {
                var $t, $t1, $t2, $t3, $t4, $t5;
                // 8x8 tile
                var result = System.Array.init(64, 0, System.Int32);
                var yMultiplyer = 8;


                for (var i = 0; i < 8; i = (i + 1) | 0) {
                    var patternEntry;
                    var patternEntryBit2;
                    if (flipY) {
                        patternEntry = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + 7) | 0) - i) | 0));
                        patternEntryBit2 = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + 7) | 0) - i) | 0) + 8) | 0));
                    } else {

                        patternEntry = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0));
                        patternEntryBit2 = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0) + 8) | 0));
                    }
                    if (flipX) {
                        for (var bit = 7; bit >= 0; bit = (bit - 1) | 0) {
                            if ((patternEntry & ($t = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                                result[(((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0)] = 1 | attributeByte;
                            }
                            if ((patternEntryBit2 & ($t1 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                                result[($t2 = (((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0))] = result[$t2] | (2 | attributeByte);
                            }
                        }
                    } else {
                        for (var bit1 = 0; bit1 < 8; bit1 = (bit1 + 1) | 0) {
                            if ((patternEntry & ($t3 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit1]) !== 0) {
                                result[(((Bridge.Int.mul(i, 8)) + bit1) | 0)] = 1 | attributeByte;
                            }
                            if ((patternEntryBit2 & ($t4 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit1]) !== 0) {
                                result[($t5 = (((Bridge.Int.mul(i, 8)) + bit1) | 0))] = result[$t5] | (2 | attributeByte);
                            }
                        }
                    }

                }
                return result;
            },
            TryGetSprite: function (result, PatternTable, TileIndex, attributeByte, flipX, flipY) {
                var $t, $t1, $t2, $t3, $t4, $t5;
                // 8x8 tile
                var yMultiplyer = 8;
                var hasData = false;

                for (var i = 0; i < 8; i = (i + 1) | 0) {
                    var patternEntry;
                    var patternEntryBit2;
                    if (flipY) {
                        patternEntry = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + 7) | 0) - i) | 0));
                        patternEntryBit2 = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + 7) | 0) - i) | 0) + 8) | 0));
                    } else {
                        patternEntry = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0));
                        patternEntryBit2 = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + i) | 0) + 8) | 0));
                    }

                    if (flipX) {
                        for (var bit = 7; bit >= 0; bit = (bit - 1) | 0) {
                            result[(((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0)] = 0;
                            if ((patternEntry & ($t = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                                result[(((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0)] = 1 | attributeByte;
                                hasData = true;
                            }
                            if ((patternEntryBit2 & ($t1 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                                result[($t2 = (((((Bridge.Int.mul(i, yMultiplyer)) + 7) | 0) - bit) | 0))] = result[$t2] | (2 | attributeByte);
                                hasData = true;
                            }
                        }
                    } else {
                        for (var bit1 = 0; bit1 < 8; bit1 = (bit1 + 1) | 0) {
                            result[(((Bridge.Int.mul(i, 8)) + bit1) | 0)] = 0;
                            if ((patternEntry & ($t3 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit1]) !== 0) {
                                result[(((Bridge.Int.mul(i, 8)) + bit1) | 0)] = 1 | attributeByte;
                                hasData = true;
                            }
                            if ((patternEntryBit2 & ($t4 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit1]) !== 0) {
                                result[($t5 = (((Bridge.Int.mul(i, 8)) + bit1) | 0))] = result[$t5] | (2 | attributeByte);
                                hasData = true;
                            }
                        }
                    }
                }
                return hasData;
            },
            /**
             * Gets a 1x8 line from a particular pattern table
             *
             * @instance
             * @public
             * @this ChiChiNES.TileDoodler
             * @memberof ChiChiNES.TileDoodler
             * @param   {System.Int32}    result           
             * @param   {number}          startPosition    
             * @param   {number}          LineNumber       
             * @param   {number}          PatternTable     
             * @param   {number}          TileIndex        
             * @param   {number}          attributeByte
             * @return  {void}
             */
            GetPatternTableLine: function (result, startPosition, LineNumber, PatternTable, TileIndex, attributeByte) {
                var $t, $t1, $t2;
                // 8x8 tile

                var patternEntry = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + LineNumber) | 0));
                var patternEntryBit2 = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((PatternTable + Bridge.Int.mul(TileIndex, 16)) | 0) + LineNumber) | 0) + 8) | 0));

                for (var bit = 0; bit < 8; bit = (bit + 1) | 0) {
                    if ((patternEntry & ($t = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                        result.v[(((Bridge.Int.mul(LineNumber, 8)) + bit) | 0)] = 1 | attributeByte;
                    }
                    if ((patternEntryBit2 & ($t1 = ChiChiNES.PixelWhizzler.PowersOfTwo)[bit]) !== 0) {
                        result.v[($t2 = (((Bridge.Int.mul(LineNumber, 8)) + bit) | 0))] = result.v[$t2] | (2 | attributeByte);
                    }
                }
            },
            DrawRect: function (newData, width, height, xPos, yPos) {
                var $t;

                for (var j = 0; j < height; j = (j + 1) | 0) {
                    for (var i = 0; i < width; i = (i + 1) | 0) {

                        var xPosition = (((xPos + 8) | 0) - i) | 0;
                        var yPosition = (yPos + j) | 0;

                        if (xPosition >= 256 || yPosition >= 240) {
                            return;
                        }
                        ($t = this._ppu.ChiChiNES$IPPU$CurrentFrame)[((Bridge.Int.mul(yPosition, 256) + xPosition) | 0)] = (newData[(((Bridge.Int.mul(j, width)) + i) | 0)]) & 255;
                    }
                }
            },
            MergeRect: function (newData, width, height, xPos, yPos, inFront) {
                var $t;

                if (inFront) {
                    this.MergeRectBehind(newData, width, height, xPos, yPos);
                    return;
                }

                for (var j = 0; j < height; j = (j + 1) | 0) {
                    for (var i = 0; i < width; i = (i + 1) | 0) {

                        var xPosition = (((xPos + 8) | 0) - i) | 0;
                        var yPosition = (yPos + j) | 0;

                        if (xPosition >= 256 || yPosition >= 240) {
                            return;
                        }
                        if (newData[(((Bridge.Int.mul(j, width)) + i) | 0)] !== 0) {
                            ($t = this._ppu.ChiChiNES$IPPU$CurrentFrame)[((Bridge.Int.mul(yPosition, 256) + xPosition) | 0)] = (this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte((((newData[(((Bridge.Int.mul(j, width)) + i) | 0)]) + 16128) | 0))) & 255;
                        }
                    }
                }
            },
            MergeRectBehind: function (newData, width, height, xPos, yPos) {
                var $t, $t1;

                for (var j = 0; j < height; j = (j + 1) | 0) {
                    for (var i = 0; i < width; i = (i + 1) | 0) {

                        var xPosition = (((xPos + 8) | 0) - i) | 0;
                        var yPosition = (yPos + j) | 0;

                        if (xPosition >= 256 || yPosition >= 240) {
                            return;
                        }
                        if (($t = this._ppu.ChiChiNES$IPPU$CurrentFrame)[((Bridge.Int.mul(yPosition, 256) + xPosition) | 0)] === this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(16128)) {
                            ($t1 = this._ppu.ChiChiNES$IPPU$CurrentFrame)[((Bridge.Int.mul(yPosition, 256) + xPosition) | 0)] = (this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte((((newData[(((Bridge.Int.mul(j, width)) + i) | 0)]) + 16128) | 0))) & 255;
                        }
                    }
                }
            },
            DrawAllTiles: function () {
                var $t;
                if (this.YOffset > 256) {
                    this.YOffset = this.YOffset & 255;
                }
                if (this.XOffset > 256) {
                    this.XOffset = this.XOffset & 255;
                }

                //_ppu.RawBuffer = new byte[_ppu.RawBuffer.Length + 1];

                var NameTable = (8192 + (Bridge.Int.mul(1024, (this._ppu.ChiChiNES$IPPU$PPUControlByte0 & 3)))) | 0;
                var nt2 = (Bridge.Int.div((NameTable & 3072), 1024)) | 0;

                //int PatternTable;
                //if ((_ppu.PPUControlByte0 & 0x10) != 0)
                //    PatternTable = 0x1000;
                //else
                //    PatternTable = 0;

                for (var i = 0; i < 32; i = (i + 1) | 0) {
                    for (var j = 0; j < 30; j = (j + 1) | 0) {
                        //int TileIndex = (byte)_ppu.NameTable[_ppu.Mirror[nt2], i + (j * 32)];
                        var TileIndex = (this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((8192 + this._ppu.ChiChiNES$IPPU$NameTableMemoryStart) | 0) + i) | 0) + (Bridge.Int.mul(j, 32))) | 0))) & 255;

                        var addToCol = this.GetAttributeTableEntry(this._ppu.ChiChiNES$IPPU$NameTableMemoryStart, i, j);
                        this.DrawRect(this.GetPatternTableEntry(this._ppu.ChiChiNES$IPPU$PatternTableIndex, TileIndex, addToCol, Bridge.ref(($t = this.currentNameTableEntries[i]), j)), 8, 8, (((Bridge.Int.mul(i, 8)) + this.XOffset) | 0), (((Bridge.Int.mul(j, 8)) + this.YOffset) | 0));

                    }
                }
            },
            GetAttributeTableEntry: function (ppuNameTableMemoryStart, i, j) {
                //int LookUp = _ppu.NameTable[_ppu.Mirror[nameTableIndex],
                //    0x3C0 + (i / 4) + ((j / 4) * 0x8)];

                var LookUp = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((((8192 + ppuNameTableMemoryStart) | 0) + 960) | 0) + (((Bridge.Int.div(i, 4)) | 0))) | 0) + (Bridge.Int.mul((((Bridge.Int.div(j, 4)) | 0)), 8))) | 0));

                var AttribByte = 0;
                switch ((i & 2) | Bridge.Int.mul((j & 2), 2)) {
                    case 0: 
                        AttribByte = (LookUp << 2) & 12;
                        break;
                    case 2: 
                        AttribByte = LookUp & 12;
                        break;
                    case 4: 
                        AttribByte = (LookUp >> 2) & 12;
                        break;
                    case 6: 
                        AttribByte = (LookUp >> 4) & 12;
                        break;
                }
                return AttribByte;
            },
            /**
             * Returns a pixel
             *
             * @instance
             * @public
             * @this ChiChiNES.TileDoodler
             * @memberof ChiChiNES.TileDoodler
             * @param   {number}    xPosition    X position of pixel (0 to 255)
             * @param   {number}    yPosition    Y position of pixel (0 to 239)
             * @return  {number}
             */
            GetNameTablePixel: function (xPosition, yPosition) {
                var ppuNameTableMemoryStart = this._ppu.ChiChiNES$IPPU$NameTableMemoryStart;
                //yPosition += 1;
                xPosition = (xPosition + this._ppu.ChiChiNES$IPPU$HScroll) | 0;

                if (xPosition > 255) {
                    xPosition = (xPosition - 256) | 0;
                    // from loopy's doc
                    // you can think of bits 0,1,2,3,4 of the vram address as the "x scroll"(*8)
                    //that the ppu increments as it draws.  as it wraps from 31 to 0, bit 10 is
                    //switched.  you should see how this causes horizontal wrapping between name
                    //tables (0,1) and (2,3).

                    ppuNameTableMemoryStart = ppuNameTableMemoryStart ^ 1024;


                }
                var xTilePosition = (Bridge.Int.div(xPosition, 8)) | 0;
                // index of this pixels bit in pattern table
                var patternTableEntryIndex = (7 - (xPosition & 7)) | 0;

                yPosition = (yPosition + this._ppu.ChiChiNES$IPPU$VScroll) | 0;
                if (yPosition > 240) {
                    yPosition = (yPosition - 241) | 0;
                    ppuNameTableMemoryStart = ppuNameTableMemoryStart ^ 2048;
                }

                var yTilePosition = (Bridge.Int.div(yPosition, 8)) | 0;

                var patternTableYOffset = yPosition & 7;


                //int mirrorIndexLookup = (nameTableMemoryStart & 0xC00) / 0x400;
                //int TileIndex = (byte)_ppu.NameTable[_ppu.CurrentNameTable, xTilePosition + (yTilePosition * 32)];

                var TileIndex = (this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((8192 + ppuNameTableMemoryStart) | 0) + xTilePosition) | 0) + ((Bridge.Int.mul(yTilePosition, 32)))) | 0))) & 255;

                var patternEntry = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((this._ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(TileIndex, 16)) | 0) + patternTableYOffset) | 0));
                var patternEntryByte2 = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((this._ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(TileIndex, 16)) | 0) + 8) | 0) + patternTableYOffset) | 0));

                var attributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, yTilePosition);

                // i want the patternTableEntryIndex'th bit of patternEntry in the 1st bit of pixel
                return ((((patternEntry >> patternTableEntryIndex) & 1) | (Bridge.Int.mul(((patternEntryByte2 >> patternTableEntryIndex) & 1), 2)) | attributeByte) & 255);
            },
            SpriteZeroHit: function (xPosition, yPosition) {
                var $t, $t1, $t2, $t3;
                var y = ($t = this._ppu.ChiChiNES$IPPU$SpriteRam)[0];
                var yLine = yPosition % 8;
                var xPos = xPosition % 8;
                if (yPosition > y && yPosition <= ((y + 9) | 0)) {
                    var tileIndex = ($t1 = this._ppu.ChiChiNES$IPPU$SpriteRam)[1];
                    var patternEntry = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((this._ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(tileIndex, 16)) | 0) + 7) | 0) - yLine) | 0));
                    var patternEntryBit2 = this._ppu.ChiChiNES$IPPU$VidRAM_GetNTByte(((((((((this._ppu.ChiChiNES$IPPU$PatternTableIndex + Bridge.Int.mul(tileIndex, 16)) | 0) + 7) | 0) - yLine) | 0) + 8) | 0));

                    if (((patternEntry & ($t2 = ChiChiNES.PixelWhizzler.PowersOfTwo)[xPos]) !== 0) || ((patternEntryBit2 & ($t3 = ChiChiNES.PixelWhizzler.PowersOfTwo)[xPos]) !== 0)) {
                        return true;
                    }
                }
                return false;
            },
            DrawSprite: function (spriteNum) {
                var $t, $t1, $t2, $t3;
                var spriteAddress = Bridge.Int.mul(4, spriteNum);
                var y = ($t = this._ppu.ChiChiNES$IPPU$SpriteRam)[spriteAddress];
                var attributeByte = ($t1 = this._ppu.ChiChiNES$IPPU$SpriteRam)[((spriteAddress + 2) | 0)];
                var x = ($t2 = this._ppu.ChiChiNES$IPPU$SpriteRam)[((spriteAddress + 3) | 0)];
                var tileIndex = ($t3 = this._ppu.ChiChiNES$IPPU$SpriteRam)[((spriteAddress + 1) | 0)];

                var attrColor = ((attributeByte & 3) << 2) | 16;
                var isInFront = (attributeByte & 32) === 32;
                var flipX = (attributeByte & 64) === 64;
                var flipY = (attributeByte & 128) === 128;

                var spritePatternTable = 0;
                // if these are 8x16 sprites, read high and low, draw
                if ((this._ppu.ChiChiNES$IPPU$PPUControlByte0 & 32) === 32) {
                    if ((tileIndex & 1) === 1) {
                        spritePatternTable = 4096;
                    }
                    var getPatternTableEntry = this.GetSprite(spritePatternTable, tileIndex, attrColor, flipX, flipY);
                    // spritePatternTable = spritePatternTable ^ 0x1000;
                    tileIndex = (tileIndex + 1) | 0;
                    var getPatternTableEntryBottom = this.GetSprite(spritePatternTable, tileIndex, attrColor, flipX, flipY);

                    if (flipY) {
                        this.MergeRect(getPatternTableEntryBottom, 8, 8, ((x - 1) | 0), ((y + 1) | 0), isInFront);
                        this.MergeRect(getPatternTableEntry, 8, 8, ((x - 1) | 0), ((y + 9) | 0), isInFront);
                    } else {
                        this.MergeRect(getPatternTableEntry, 8, 8, ((x - 1) | 0), ((y + 1) | 0), isInFront);
                        this.MergeRect(getPatternTableEntryBottom, 8, 8, ((x - 1) | 0), ((y + 9) | 0), isInFront);
                    }
                } else {
                    // 8x8 sprites
                    if ((this._ppu.ChiChiNES$IPPU$PPUControlByte0 & 8) === 8) {
                        spritePatternTable = 4096;
                    }
                    var getPatternTableEntry1 = this.GetSprite(spritePatternTable, tileIndex, attrColor, flipX, flipY);

                    this.MergeRect(getPatternTableEntry1, 8, 8, ((x - 1) | 0), ((y + 1) | 0), isInFront);
                }

                return;
            },
            DrawAllSprites: function () {
                for (var i = 63; i >= 0; i = (i - 1) | 0) {

                    this.DrawSprite(i);
                }
            },
            /**
             * returns a 128x128 buffer for the tiles
             *
             * @instance
             * @public
             * @this ChiChiNES.TileDoodler
             * @memberof ChiChiNES.TileDoodler
             * @param   {number}            PatternTable
             * @return  {Array.<number>}
             */
            DoodlePatternTable: function (PatternTable) {
                var $t, $t1;
                var patTable = 0;
                switch (PatternTable) {
                    case 4096: 
                        patTable = 1;
                        break;
                    case 0: 
                        patTable = 0;
                        break;
                }

                // return a 16x16 x 64 per tile pattern table for display
                var patterns = { v : System.Array.init(16384, 0, System.Int32) };
                var tile;
                for (var j = 0; j < 16; j = (j + 1) | 0) {
                    for (var i = 0; i < 16; i = (i + 1) | 0) {
                        tile = this.GetPatternTableEntry(PatternTable, (((i) + Bridge.Int.mul(j, 16)) | 0), 0, Bridge.ref(($t = ($t1 = this.currentPatternTableEntries[patTable])[i]), j));
                        this.DrawTile(patterns, 128, 128, tile, Bridge.Int.mul(i, 8), Bridge.Int.mul(j, 8));
                    }
                }
                return patterns.v;
            },
            /**
             * returns a pixel array representing a current nametable in memory
             nametable will be 0,0x400, 0x800, 0xC00, mapped to 0x200 + Nametable
             *
             * @instance
             * @public
             * @this ChiChiNES.TileDoodler
             * @memberof ChiChiNES.TileDoodler
             * @param   {number}            NameTable
             * @return  {Array.<number>}
             */
            DoodleNameTable: function (NameTable) {
                var $t;

                var result = { v : System.Array.init(61440, 0, System.Int32) };

                for (var i = 0; i < 32; i = (i + 1) | 0) {
                    for (var j = 0; j < 30; j = (j + 1) | 0) {

                        var address = (((((8192 + NameTable) | 0) + i) | 0) + (Bridge.Int.mul(j, 32))) | 0;
                        var TileIndex = this._ppu.ChiChiNES$IPPU$ChrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, address);

                        var addToCol = this.GetAttributeTableEntry(NameTable, i, j);
                        var tile = this.GetPatternTableEntry(this._ppu.ChiChiNES$IPPU$PatternTableIndex, TileIndex, addToCol, Bridge.ref(($t = this.currentNameTableEntries[i]), j));
                        this.DrawTile(result, 256, 240, tile, Bridge.Int.mul(i, 8), Bridge.Int.mul(j, 8));
                    }
                }
                return result.v;
            },
            DrawTile: function (destBuffer, width, height, tile, xPos, yPos) {

                for (var j = 0; j < 8; j = (j + 1) | 0) {
                    for (var i = 0; i < 8; i = (i + 1) | 0) {

                        var xPosition = (((xPos + 8) | 0) - i) | 0;
                        var yPosition = Bridge.Int.mul((((yPos + j) | 0)), width);

                        if (xPos > height) {
                            break;
                        }
                        if (((yPosition + xPosition) | 0) >= destBuffer.v.length) {
                            break;
                        }

                        destBuffer.v[((yPosition + xPosition) | 0)] = (tile[(((Bridge.Int.mul(j, 8)) + i) | 0)]) & 255;
                    }
                }
            },
            GetNameTableEntryLocation: function (x, y) {
                var $t, $t1;
                return ($t = ($t1 = this.currentNameTableEntries[((Bridge.Int.div(x, 32)) | 0)])[((Bridge.Int.div(y, 30)) | 0)])[y & 7];
            },
            GetPatternEntryLocation: function (table, x, y) {
                var $t, $t1, $t2;
                return ($t = ($t1 = ($t2 = this.currentPatternTableEntries[table])[((Bridge.Int.div(x, 32)) | 0)])[((Bridge.Int.div(y, 30)) | 0)])[y & 7];
            }
        }
    });

    Bridge.define("ChiChiNES.INESCart", {
        inherits: [ChiChiNES.IClockedMemoryMappedIOElement],
        $kind: "interface"
    });

    Bridge.define("ChiChiNES.BeepsBoops.Bopper", {
        inherits: [ChiChiNES.IClockedMemoryMappedIOElement,ChiChiNES.BeepsBoops.IAPU],
        statics: {
            fields: {
                master_vol: 0,
                clock_rate: 0
            },
            ctors: {
                init: function () {
                    this.master_vol = 4369;
                    this.clock_rate = 1789772.727;
                }
            }
        },
        fields: {
            square0: null,
            square1: null,
            triangle: null,
            noise: null,
            writer: null,
            dmc: null,
            myBlipper: null,
            _throwingIRQs: false,
            registers: null,
            _sampleRate: 0,
            square0Gain: 0,
            square1Gain: 0,
            triangleGain: 0,
            noiseGain: 0,
            reg15: 0,
            muted: false,
            lastFrameHit: 0,
            _writeBuffer: null,
            _interruptRaised: false,
            lastClock: 0
        },
        props: {
            Enabled: false,
            SampleRate: {
                get: function () {
                    return this._sampleRate;
                },
                set: function (value) {
                    this._sampleRate = value;
                    this.RebuildSound();
                }
            },
            Muted: {
                get: function () {
                    return this.muted;
                },
                set: function (value) {
                    this.muted = value;
                }
            },
            WriteBuffer: {
                get: function () {
                    return this._writeBuffer;
                },
                set: function (value) {
                    this._writeBuffer = value;
                }
            },
            InterruptRaised: {
                get: function () {
                    return this._interruptRaised;
                },
                set: function (value) {
                    this._interruptRaised = value;
                }
            },
            EnableSquare0: {
                get: function () {
                    return (this.square0.Gain !== 0);
                },
                set: function (value) {
                    this.square0.Gain = (value) ? this.square0Gain : 0;
                }
            },
            EnableSquare1: {
                get: function () {
                    return (this.square1.Gain !== 0);
                },
                set: function (value) {
                    this.square1.Gain = (value) ? this.square1Gain : 0;
                }
            },
            EnableTriangle: {
                get: function () {
                    return (this.triangle.Gain !== 0);
                },
                set: function (value) {
                    this.triangle.Gain = (value) ? this.triangleGain : 0;
                }
            },
            EnableNoise: {
                get: function () {
                    return (this.noise.Gain !== 0);
                },
                set: function (value) {
                    this.noise.Gain = (value) ? this.noiseGain : 0;
                }
            },
            NMIHandler: {
                get: function () {
                    return null;
                },
                set: function (value) { }
            },
            IRQAsserted: {
                get: function () {
                    return false;
                },
                set: function (value) {
                    // throw new NotImplementedException();
                }
            },
            NextEventAt: {
                get: function () {
                    return 7445 * (this.lastFrameHit + 1) - this.lastClock;
                }
            }
        },
        alias: [
            "GetByte", "ChiChiNES$IClockedMemoryMappedIOElement$GetByte",
            "SetByte", "ChiChiNES$IClockedMemoryMappedIOElement$SetByte",
            "Muted", "ChiChiNES$BeepsBoops$IAPU$Muted",
            "UpdateFrame", "ChiChiNES$BeepsBoops$IAPU$UpdateFrame",
            "EndFrame", "ChiChiNES$BeepsBoops$IAPU$EndFrame",
            "InterruptRaised", "ChiChiNES$BeepsBoops$IAPU$InterruptRaised",
            "EnableSquare0", "ChiChiNES$BeepsBoops$IAPU$EnableSquare0",
            "EnableSquare1", "ChiChiNES$BeepsBoops$IAPU$EnableSquare1",
            "EnableTriangle", "ChiChiNES$BeepsBoops$IAPU$EnableTriangle",
            "EnableNoise", "ChiChiNES$BeepsBoops$IAPU$EnableNoise",
            "NMIHandler", "ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler",
            "IRQAsserted", "ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted",
            "NextEventAt", "ChiChiNES$IClockedMemoryMappedIOElement$NextEventAt",
            "HandleEvent", "ChiChiNES$IClockedMemoryMappedIOElement$HandleEvent",
            "ResetClock", "ChiChiNES$IClockedMemoryMappedIOElement$ResetClock"
        ],
        ctors: {
            init: function () {
                this.registers = new ChiChiNES.PortQueueing.QueuedPort();
                this._sampleRate = 44100;
                this.square0Gain = 873;
                this.square1Gain = 873;
                this.triangleGain = 1004;
                this.noiseGain = 567;
                this.muted = false;
                this.lastFrameHit = 0;
                this._writeBuffer = System.Array.init(1024, 0, System.Int16);
            },
            ctor: function (output) {
                this.$initialize();

                this.writer = output;
                this._sampleRate = output.Frequency;
                this.RebuildSound();
            }
        },
        methods: {
            RebuildSound: function () {
                var $t;
                this.myBlipper = new ChiChiNES.BeepsBoops.Blip(this._sampleRate / 5);
                this.myBlipper.blip_set_rates(ChiChiNES.BeepsBoops.Bopper.clock_rate, this._sampleRate);


                this.registers.clear();
                this._interruptRaised = false;
                this.square0Gain = 873;
                this.square1Gain = 873;
                this.triangleGain = 1004;
                this.noiseGain = 567;

                this.square0 = ($t = new ChiChiNES.BeepsBoops.SquareChannel(this.myBlipper, 0), $t.Gain = this.square0Gain, $t.Period = 10, $t.SweepComplement = true, $t);
                this.square1 = ($t = new ChiChiNES.BeepsBoops.SquareChannel(this.myBlipper, 1), $t.Gain = this.square1Gain, $t.Period = 10, $t.SweepComplement = false, $t);
                this.triangle = ($t = new ChiChiNES.BeepsBoops.TriangleChannel(this.myBlipper, 2), $t.Gain = this.triangleGain, $t.Period = 0, $t);
                this.noise = ($t = new ChiChiNES.BeepsBoops.NoiseChannel(this.myBlipper, 3), $t.Gain = this.noiseGain, $t.Period = 0, $t);
                this.dmc = ($t = new ChiChiNES.BeepsBoops.DMCChannel(this.myBlipper, 4), $t.Gain = 873, $t.Period = 10, $t);
            },
            GetByte: function (Clock, address) {
                if (address === 16384) {
                    this._interruptRaised = false;
                }
                if (address === 16405) {
                    return this.ReadStatus();
                } else {
                    return 66;
                }
            },
            ReadStatus: function () {
                return ((this.square0.Length > 0) ? 1 : 0) | ((this.square1.Length > 0) ? 2 : 0) | ((this.triangle.Length > 0) ? 4 : 0) | ((this.square0.Length > 0) ? 8 : 0) | (this._interruptRaised ? 64 : 0);
            },
            SetByte: function (Clock, address, data) {
                if (address === 16384) {
                    this._interruptRaised = false;
                }
                if (this.Enabled) {
                    this.DoSetByte(Clock, address, data);
                    this.registers.enqueue(new ChiChiNES.PortQueueing.PortWriteEntry(Clock, address, data));
                }

            },
            DoSetByte: function (Clock, address, data) {
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
                        this._throwingIRQs = ((data & 64) !== 64);
                        this.lastFrameHit = 0;
                        break;
                }
            },
            UpdateFrame: function (time) {
                if (this.muted) {
                    return;
                }

                this.RunFrameEvents(time, this.lastFrameHit);
                if (this.lastFrameHit === 3) {

                    if (this._throwingIRQs) {
                        this._interruptRaised = true;
                    }
                    this.lastFrameHit = 0;
                    //EndFrame(time);
                } else {
                    this.lastFrameHit++;
                }


            },
            RunFrameEvents: function (time, step) {
                this.triangle.FrameClock(time, step);
                this.noise.FrameClock(time, step);
                this.square0.FrameClock(time, step);
                this.square1.FrameClock(time, step);
                // dmc.FrameClock(time, step);
            },
            EndFrame: function (time) {
                if (!this.Enabled) {
                    return;
                }

                this.square0.EndFrame(time);
                this.square1.EndFrame(time);
                this.triangle.EndFrame(time);
                this.noise.EndFrame(time);

                if (!this.muted) {
                    this.myBlipper.blip_end_frame(time);
                }

                this.writer.Locker;
                {
                    var count = this.myBlipper.ReadBytes(this.writer.SharedBuffer, this.writer.SharedBuffer.length / 2, 0);
                    this.writer.WavesWritten(count);
                }
            },
            FlushFrame: function (time) {
                if (!this.Enabled) {
                    return;
                }

                var currentClock = 0;
                var frameClocker = 0;
                var currentEntry;
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
                var clockDelta = currentClock % 7445;

                if (this.lastFrameHit === 0) {
                    this.UpdateFrame(7445);
                }
                while (this.lastFrameHit > 0) {
                    this.UpdateFrame(7445 * (this.lastFrameHit + 1));
                }
            },
            HandleEvent: function (Clock) {
                this.UpdateFrame(Clock);
                this.lastClock = Clock;

                if (Clock > 29780) {
                    this.writer;
                    {
                        this.EndFrame(Clock);
                    }
                }
            },
            ResetClock: function (Clock) {
                this.lastClock = Clock;
            }
        }
    });

    Bridge.define("ChiChiNES.BeepsBoops.WavSharer", {
        inherits: [ChiChiNES.BeepsBoops.IWavReader],
        statics: {
            fields: {
                sample_size: 0
            },
            ctors: {
                init: function () {
                    this.sample_size = 2;
                }
            }
        },
        fields: {
            _NESTooFast: false,
            Locker: null,
            frequency: 0,
            _sharedBuffer: null,
            _sharedBufferLength: 0,
            _bufferAvailable: false,
            appendToFile: null,
            fileWriting: false,
            bufferWasRead: false,
            bytesWritten: null
        },
        props: {
            NESTooFast: {
                get: function () {
                    return this._NESTooFast;
                },
                set: function (value) {
                    this._NESTooFast = value;
                }
            },
            Frequency: {
                get: function () {
                    return this.frequency;
                }
            },
            SharedBuffer: {
                get: function () {
                    return this._sharedBuffer;
                },
                set: function (value) {
                    this._sharedBuffer = value;
                }
            },
            SharedBufferLength: {
                get: function () {
                    return this._sharedBufferLength;
                },
                set: function (value) {
                    this._sharedBufferLength = value;
                }
            },
            BufferAvailable: {
                get: function () {
                    return this._bufferAvailable;
                }
            },
            BytesWritten: {
                get: function () {
                    return this.bytesWritten;
                },
                set: function (value) {
                    this.bytesWritten = value;
                }
            }
        },
        alias: [
            "Frequency", "ChiChiNES$BeepsBoops$IWavReader$Frequency",
            "SharedBuffer", "ChiChiNES$BeepsBoops$IWavReader$SharedBuffer",
            "SharedBufferLength", "ChiChiNES$BeepsBoops$IWavReader$SharedBufferLength",
            "BufferAvailable", "ChiChiNES$BeepsBoops$IWavReader$BufferAvailable",
            "StartReadWaves", "ChiChiNES$BeepsBoops$IWavReader$StartReadWaves",
            "ReadWaves", "ChiChiNES$BeepsBoops$IWavReader$ReadWaves",
            "BytesWritten", "ChiChiNES$BeepsBoops$IWavReader$BytesWritten",
            "SetSharedBuffer", "ChiChiNES$BeepsBoops$IWavReader$SetSharedBuffer"
        ],
        ctors: {
            init: function () {
                this.Locker = { };
                this.frequency = 44100;
            },
            $ctor1: function (frequency) {
                ChiChiNES.BeepsBoops.WavSharer.ctor.call(this);
                this.frequency = frequency;
            },
            ctor: function () {
                this.$initialize();
                // should hold a frame worth
                //pendingWaves = new Queue<byte>(1500);

                this._sharedBuffer = System.Array.init(8192, 0, System.Single);
            }
        },
        methods: {
            WavesWritten: function (remain) {
                var n = (Bridge.Int.div(this._sharedBuffer.length, ChiChiNES.BeepsBoops.WavSharer.sample_size)) | 0;
                if (n > remain) {
                    n = remain;
                }
                this._sharedBufferLength = Bridge.Int.mul(n, 2);

                //if (fileWriting)
                //{
                //        appendToFile.WriteWaves(_sharedBuffer, _sharedBufferLength);
                //}
                this.bufferWasRead = false;
                this._bufferAvailable = true;
                this.WroteBytes();
            },
            AppendFile: function (writer) {
                this.appendToFile = writer;
                this.fileWriting = (this.appendToFile != null);
            },
            Dispose: function () {
                if (null != this.appendToFile) {
                    this.appendToFile.System$IDisposable$dispose();
                }
            },
            StartReadWaves: function () { },
            ReadWaves: function () {

                this._bufferAvailable = false;
                this._sharedBufferLength = 0;
                this.bufferWasRead = true;
                // bufferReadResetEvent.Set();
            },
            WroteBytes: function () {
                if (!Bridge.staticEquals(this.bytesWritten, null)) {
                    this.bytesWritten(this, { });
                }
            },
            SetSharedBuffer: function (values) {
                this._sharedBuffer = values;
            }
        }
    });

    Bridge.define("ChiChiNES.Hacking.ComparedMemoryPatch", {
        inherits: [ChiChiNES.Hacking.IMemoryPatch],
        fields: {
            _CompareData: 0,
            _ReplaceData: 0
        },
        props: {
            Activated: false,
            Address: 0
        },
        alias: [
            "Activated", "ChiChiNES$Hacking$IMemoryPatch$Activated",
            "Address", "ChiChiNES$Hacking$IMemoryPatch$Address",
            "GetData", "ChiChiNES$Hacking$IMemoryPatch$GetData"
        ],
        ctors: {
            ctor: function (Address, CompareToData, ReplaceWithData) {
                this.$initialize();
                this._CompareData = CompareToData;
                this._ReplaceData = ReplaceWithData;
                this.Address = Address;
            }
        },
        methods: {
            GetData: function (data) {
                return (data === this._CompareData) ? this._ReplaceData : data;
            },
            toString: function () {
                return System.String.format("{0} = {1} if {2} Activated: {3}", this.Address, this._ReplaceData, this._CompareData, this.Activated);
            }
        }
    });

    Bridge.define("ChiChiNES.Hacking.MemoryPatch", {
        inherits: [ChiChiNES.Hacking.IMemoryPatch],
        fields: {
            _data: 0
        },
        props: {
            Activated: false,
            Address: 0
        },
        alias: [
            "Activated", "ChiChiNES$Hacking$IMemoryPatch$Activated",
            "Address", "ChiChiNES$Hacking$IMemoryPatch$Address",
            "GetData", "ChiChiNES$Hacking$IMemoryPatch$GetData"
        ],
        ctors: {
            ctor: function (Address, Data) {
                this.$initialize();
                this._data = Data;
                this.Address = Address;
            }
        },
        methods: {
            GetData: function (data) {
                return this._data;
            },
            toString: function () {
                return System.String.format("{0} = {1}  Activated: {2}", this.Address, this._data, this.Activated);
            }
        }
    });

    Bridge.define("ChiChiNES.InputHandler", {
        inherits: [ChiChiNES.IClockedMemoryMappedIOElement],
        fields: {
            currentByte: 0,
            nextByte: 0,
            controlPad: null,
            isZapper: false,
            inputLock: null
        },
        props: {
            IsZapper: {
                get: function () {
                    return this.isZapper;
                },
                set: function (value) {
                    this.isZapper = value;
                }
            },
            ControlPad: {
                get: function () {
                    return this.controlPad;
                },
                set: function (value) {
                    this.controlPad = value;
                }
            },
            CurrentByte: {
                get: function () {

                    return this.currentByte;
                },
                set: function (value) {
                    this.currentByte = value;
                }
            },
            NMIHandler: {
                get: function () {
                    throw new System.NotImplementedException();
                },
                set: function (value) {
                    throw new System.NotImplementedException();
                }
            },
            IRQAsserted: {
                get: function () {
                    throw new System.NotImplementedException();
                },
                set: function (value) {
                    throw new System.NotImplementedException();
                }
            },
            NextEventAt: {
                get: function () {
                    throw new System.NotImplementedException();
                }
            }
        },
        alias: [
            "GetByte", "ChiChiNES$IClockedMemoryMappedIOElement$GetByte",
            "SetByte", "ChiChiNES$IClockedMemoryMappedIOElement$SetByte",
            "NMIHandler", "ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler",
            "IRQAsserted", "ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted",
            "NextEventAt", "ChiChiNES$IClockedMemoryMappedIOElement$NextEventAt",
            "HandleEvent", "ChiChiNES$IClockedMemoryMappedIOElement$HandleEvent",
            "ResetClock", "ChiChiNES$IClockedMemoryMappedIOElement$ResetClock"
        ],
        ctors: {
            init: function () {
                this.isZapper = false;
                this.inputLock = { };
            },
            ctor: function () {
                this.$initialize();
                this.controlPad = null;
            },
            $ctor1: function (padOne) {
                this.$initialize();
                this.ControlPad = padOne;
            }
        },
        methods: {
            controlPad_NextControlByteSet: function (sender, e) {
                this.SetNextControlByte(e.NextValue);
            },
            GetByte: function (clock, address) {
                return this.controlPad.ChiChiNES$IControlPad$getByte(clock);


            },
            SetByte: function (clock, address, data) {
                this.controlPad.ChiChiNES$IControlPad$setByte(clock, data);
            },
            SetNextControlByte: function (data) {

                this.nextByte = data;

            },
            HandleEvent: function (Clock) {
                throw new System.NotImplementedException();
            },
            ResetClock: function (Clock) {
                throw new System.NotImplementedException();
            }
        }
    });

    /** @namespace ChiChiNES */

    /**
     * plugs up a nes control port, when nothing else is using it
     *
     * @public
     * @class ChiChiNES.NullControlPad
     * @implements  ChiChiNES.IControlPad
     */
    Bridge.define("ChiChiNES.NullControlPad", {
        inherits: [ChiChiNES.IControlPad],
        props: {
            CurrentByte: {
                get: function () {
                    return 0;
                },
                set: function (value) { }
            }
        },
        alias: [
            "CurrentByte", "ChiChiNES$IControlPad$CurrentByte",
            "refresh", "ChiChiNES$IControlPad$refresh",
            "getByte", "ChiChiNES$IControlPad$getByte",
            "setByte", "ChiChiNES$IControlPad$setByte",
            "dispose", "System$IDisposable$dispose"
        ],
        methods: {
            refresh: function () { },
            getByte: function (clock) {
                return 0;
            },
            setByte: function (clock, data) { },
            dispose: function () { }
        }
    });

    Bridge.define("ChiChiNES.PixelWhizzler", {
        inherits: [ChiChiNES.IPPU,ChiChiNES.IClockedMemoryMappedIOElement],
        statics: {
            fields: {
                ScanlinePreRenderDummyScanline: 0,
                ScanlineRenderingStartsOn: 0,
                ScanlineRenderingEndsOn: 0,
                ScanlineLastRenderedPixel: 0,
                ScanlineTotalLength: 0,
                ScanlineEventPPUXIncremented: 0,
                ScanlineEventPPUXReset: 0,
                ScanlineEventPPUYIncremented: 0,
                vBufferWidth: 0,
                _powersOfTwo: null,
                pal: null,
                frameClockEnd: 0
            },
            props: {
                PowersOfTwo: {
                    get: function () {
                        return ChiChiNES.PixelWhizzler._powersOfTwo;
                    }
                }
            },
            ctors: {
                init: function () {
                    this.ScanlinePreRenderDummyScanline = 20;
                    this.ScanlineRenderingStartsOn = 21;
                    this.ScanlineRenderingEndsOn = 260;
                    this.ScanlineLastRenderedPixel = 255;
                    this.ScanlineTotalLength = 340;
                    this.ScanlineEventPPUXIncremented = 3;
                    this.ScanlineEventPPUXReset = 257;
                    this.ScanlineEventPPUYIncremented = 251;
                    this.vBufferWidth = 256;
                    this._powersOfTwo = System.Array.init(32, 0, System.Int32);
                    this.pal = System.Array.init([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], System.Int32);
                    this.frameClockEnd = 89342;
                },
                ctor: function () {
                    for (var i = 0; i < 32; i = (i + 1) | 0) {
                        ChiChiNES.PixelWhizzler._powersOfTwo[i] = Bridge.Int.clip32(Math.pow(2.0, i));
                    }
                }
            },
            methods: {
                
                GetPalRGBA: function () {
                    //Open App.Path & "\" + file For Binary As #FileNum
                    for (var n = 0; n < 64; n = (n + 1) | 0) {
                        ChiChiNES.PixelWhizzler.pal[((n + 64) | 0)] = ChiChiNES.PixelWhizzler.pal[n];
                        ChiChiNES.PixelWhizzler.pal[((n + 128) | 0)] = ChiChiNES.PixelWhizzler.pal[n];
                        ChiChiNES.PixelWhizzler.pal[((n + 192) | 0)] = ChiChiNES.PixelWhizzler.pal[n];
                    }
                    return ChiChiNES.PixelWhizzler.pal;
                }
            }
        },
        fields: {
            currentXPosition: 0,
            currentYPosition: 0,
            scanlineNum: 0,
            scanlinePos: 0,
            _isDebugging: false,
            shouldRender: false,
            vBuffer: null,
            nameTableIndex: 0,
            _frames: 0,
            hitSprite: false,
            _PPUControlByte0: 0,
            _PPUControlByte1: 0,
            _spritesAreVisible: false,
            _tilesAreVisible: false,
            _PPUStatus: 0,
            _PPUAddress: 0,
            ppuReadBuffer: 0,
            PPUAddressLatchIsHigh: false,
            /**
             * Initializes the rendering pallette with the bytes in a BGR format, instead of the default RGB format
             *
             * @instance
             * @private
             * @memberof ChiChiNES.PixelWhizzler
             * @type Array.<number>
             */
            p32: null,
            _backgroundPatternTableIndex: 0,
            needToDraw: false,
            isRendering: false,
            frameClock: 0,
            FrameEnded: false,
            frameOn: false,
            framePalette: null,
            nameTableMemoryStart: 0,
            lastcpuClock: 0,
            rgb32OutBuffer: null,
            byteOutBuffer: null,
            outBuffer: null,
            vbufLocation: 0,
            drawInfo: null,
            pixelDevices: null,
            _clipTiles: false,
            _clipSprites: false,
            nameTableBits: 0,
            vidRamIsRam: false,
            _palette: null,
            _openBus: 0,
            currentPalette: 0,
            nmiHandler: null,
            frameFinished: null,
            NMIHasBeenThrownThisFrame: false,
            _hScroll: 0,
            _vScroll: 0,
            lockedHScroll: 0,
            lockedVScroll: 0,
            spriteChanges: false,
            _spriteCopyHasHappened: false,
            sprite0scanline: 0,
            sprite0x: 0,
            spriteZeroHit: false,
            isForegroundPixel: false,
            currentSprites: null,
            unpackedSprites: null,
            _maxSpritesPerScanline: 0,
            spriteRAM: null,
            _spriteAddress: 0,
            spritesOnThisScanline: 0,
            spriteSize: 0,
            spritesOnLine: null,
            patternEntry: 0,
            patternEntryByte2: 0,
            currentAttributeByte: 0,
            currentTileIndex: 0,
            xNTXor: 0,
            yNTXor: 0,
            fetchTile: false,
            xPosition: 0,
            yPosition: 0,
            chrRomHandler: null,
            events: null
        },
        props: {
            CurrentYPosition: {
                get: function () {
                    return this.currentYPosition;
                }
            },
            CurrentXPosition: {
                get: function () {
                    return this.currentXPosition;
                }
            },
            ScanlinePos: {
                get: function () {
                    return this.scanlinePos;
                }
            },
            ScanlineNum: {
                get: function () {
                    return this.scanlineNum;
                }
            },
            IsDebugging: {
                get: function () {
                    return this._isDebugging;
                },
                set: function (value) {
                    this._isDebugging = value;
                }
            },
            ShouldRender: {
                get: function () {
                    return this.shouldRender;
                },
                set: function (value) {
                    this.shouldRender = value;
                }
            },
            Frames: {
                get: function () {
                    return this._frames;
                }
            },
            HandleVBlankIRQ: false,
            VROM: null,
            PPUControlByte0: {
                get: function () {
                    return this._PPUControlByte0;
                },
                set: function (value) {
                    if (this._PPUControlByte0 !== value) {
                        this._PPUControlByte0 = value;
                        this.UpdatePPUControlByte0();
                    }
                }
            },
            NMIIsThrown: {
                get: function () {
                    return (this._PPUControlByte0 & 128) === 128;
                }
            },
            PPUControlByte1: {
                get: function () {
                    return this._PPUControlByte1;
                },
                set: function (value) {
                    this._PPUControlByte1 = value;
                }
            },
            BackgroundVisible: {
                get: function () {
                    return this._tilesAreVisible;
                }
            },
            SpritesAreVisible: {
                get: function () {
                    return this._spritesAreVisible;
                }
            },
            PPUStatus: {
                get: function () {
                    return this._PPUStatus;
                },
                set: function (value) {
                    this._PPUStatus = value;
                }
            },
            PPUAddress: {
                get: function () {
                    return this._PPUAddress;
                },
                set: function (value) {
                    this._PPUAddress = value;
                }
            },
            PatternTableIndex: {
                get: function () {
                    return this._backgroundPatternTableIndex;
                }
            },
            NeedToDraw: {
                get: function () {
                    return this.needToDraw;
                }
            },
            IsRendering: {
                get: function () {
                    return this.isRendering;
                }
            },
            FrameOn: {
                get: function () {
                    return this.frameOn;
                },
                set: function (value) {
                    this.frameOn = value;
                }
            },
            NameTableMemoryStart: {
                get: function () {
                    return this.nameTableMemoryStart;
                },
                set: function (value) {
                    this.nameTableMemoryStart = value;
                }
            },
            CurrentFrame: {
                get: function () {
                    return this.vBuffer;
                }
            },
            LastcpuClock: {
                get: function () {
                    return this.lastcpuClock;
                },
                set: function (value) {
                    this.lastcpuClock = value;
                }
            },
            OutBuffer: {
                get: function () {
                    return this.outBuffer;
                }
            },
            VideoBuffer: {
                get: function () {
                    return this.rgb32OutBuffer;
                }
            },
            PixelAwareDevice: {
                get: function () {
                    return this.pixelDevices;
                },
                set: function (value) {
                    this.pixelDevices = value;
                }
            },
            ByteOutBuffer: {
                get: function () {
                    return this.byteOutBuffer;
                },
                set: function (value) {
                    this.byteOutBuffer = value;
                }
            },
            Palette: {
                get: function () {
                    return this._palette;
                },
                set: function (value) {
                    this._palette = value;
                }
            },
            CurrentPalette: {
                get: function () {
                    return this.currentPalette;
                }
            },
            NMIHandler: {
                get: function () {
                    return this.nmiHandler;
                },
                set: function (value) {
                    this.nmiHandler = value;
                }
            },
            /**
             * ppu doesnt throw irq's
             *
             * @instance
             * @public
             * @memberof ChiChiNES.PixelWhizzler
             * @function IRQAsserted
             * @type boolean
             */
            IRQAsserted: {
                get: function () {
                    throw new System.NotImplementedException();
                },
                set: function (value) {
                    throw new System.NotImplementedException();
                }
            },
            NextEventAt: {
                get: function () {
                    if (this.frameClock < 6820) {
                        return ((Bridge.Int.div((((6820 - this.frameClock) | 0)), 3)) | 0);
                    } else {
                        return (((Bridge.Int.div((((Bridge.Int.div((((89345 - this.frameClock) | 0)), 341)) | 0)), 3)) | 0));
                    }
                    //}
                    //else
                    //{
                    //    return (6823 - frameClock) / 3;
                    //}
                }
            },
            FrameFinishHandler: {
                get: function () {
                    return this.frameFinished;
                },
                set: function (value) {
                    this.frameFinished = value;
                }
            },
            NMIOccurred: {
                get: function () {
                    return (this._PPUStatus & 128) === 128;
                }
            },
            HScroll: {
                get: function () {
                    return this.lockedHScroll;
                }
            },
            VScroll: {
                get: function () {
                    return this.lockedVScroll;
                }
            },
            SpriteCopyHasHappened: {
                get: function () {
                    return this._spriteCopyHasHappened;
                },
                set: function (value) {
                    this._spriteCopyHasHappened = value;
                }
            },
            MaxSpritesPerScanline: {
                get: function () {
                    return this._maxSpritesPerScanline;
                },
                set: function (value) {
                    this._maxSpritesPerScanline = value;
                }
            },
            SpriteRam: {
                get: function () {
                    return this.spriteRAM;
                }
            },
            SpritesOnLine: {
                get: function () {
                    return this.spritesOnLine;
                }
            },
            ChrRomHandler: {
                get: function () {
                    return this.chrRomHandler;
                },
                set: function (value) {
                    this.chrRomHandler = value;
                }
            },
            Events: {
                get: function () {
                    return this.events;
                }
            }
        },
        alias: [
            "ScanlinePos", "ChiChiNES$IPPU$ScanlinePos",
            "ScanlineNum", "ChiChiNES$IPPU$ScanlineNum",
            "Initialize", "ChiChiNES$IPPU$Initialize",
            "WriteState", "ChiChiNES$IPPU$WriteState",
            "ReadState", "ChiChiNES$IPPU$ReadState",
            "VidRAM_GetNTByte", "ChiChiNES$IPPU$VidRAM_GetNTByte",
            "PPUControlByte0", "ChiChiNES$IPPU$PPUControlByte0",
            "PPUControlByte1", "ChiChiNES$IPPU$PPUControlByte1",
            "SpritesAreVisible", "ChiChiNES$IPPU$SpritesAreVisible",
            "SetupBufferForDisplay", "ChiChiNES$IPPU$SetupBufferForDisplay",
            "PatternTableIndex", "ChiChiNES$IPPU$PatternTableIndex",
            "NameTableMemoryStart", "ChiChiNES$IPPU$NameTableMemoryStart",
            "CurrentFrame", "ChiChiNES$IPPU$CurrentFrame",
            "RenderScanline", "ChiChiNES$IPPU$RenderScanline",
            "LastcpuClock", "ChiChiNES$IPPU$LastcpuClock",
            "DrawTo", "ChiChiNES$IPPU$DrawTo",
            "VideoBuffer", "ChiChiNES$IPPU$VideoBuffer",
            "SetVideoBuffer", "ChiChiNES$IPPU$SetVideoBuffer",
            "UpdatePixelInfo", "ChiChiNES$IPPU$UpdatePixelInfo",
            "PixelAwareDevice", "ChiChiNES$IPPU$PixelAwareDevice",
            "ByteOutBuffer", "ChiChiNES$IPPU$ByteOutBuffer",
            "Palette", "ChiChiNES$IPPU$Palette",
            "SetByte", "ChiChiNES$IClockedMemoryMappedIOElement$SetByte",
            "SetByte", "ChiChiNES$IPPU$SetByte",
            "GetByte", "ChiChiNES$IClockedMemoryMappedIOElement$GetByte",
            "GetByte", "ChiChiNES$IPPU$GetByte",
            "NMIHandler", "ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler",
            "NMIHandler", "ChiChiNES$IPPU$NMIHandler",
            "IRQAsserted", "ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted",
            "NextEventAt", "ChiChiNES$IClockedMemoryMappedIOElement$NextEventAt",
            "NextEventAt", "ChiChiNES$IPPU$NextEventAt",
            "HandleEvent", "ChiChiNES$IClockedMemoryMappedIOElement$HandleEvent",
            "HandleEvent", "ChiChiNES$IPPU$HandleEvent",
            "ResetClock", "ChiChiNES$IClockedMemoryMappedIOElement$ResetClock",
            "ResetClock", "ChiChiNES$IPPU$ResetClock",
            "FrameFinishHandler", "ChiChiNES$IPPU$FrameFinishHandler",
            "SetupVINT", "ChiChiNES$IPPU$SetupVINT",
            "HScroll", "ChiChiNES$IPPU$HScroll",
            "VScroll", "ChiChiNES$IPPU$VScroll",
            "SpriteRam", "ChiChiNES$IPPU$SpriteRam",
            "CopySprites", "ChiChiNES$IPPU$CopySprites",
            "SpritesOnLine", "ChiChiNES$IPPU$SpritesOnLine",
            "PreloadSprites", "ChiChiNES$IPPU$PreloadSprites",
            "ChrRomHandler", "ChiChiNES$IPPU$ChrRomHandler"
        ],
        ctors: {
            init: function () {
                this.currentXPosition = 0;
                this.currentYPosition = 0;
                this.scanlineNum = 0;
                this.scanlinePos = 0;
                this.shouldRender = false;
                this._frames = 0;
                this.hitSprite = false;
                this.PPUAddressLatchIsHigh = true;
                this.p32 = System.Array.init(256, 0, System.Int32);
                this.needToDraw = true;
                this.isRendering = true;
                this.frameClock = 0;
                this.FrameEnded = false;
                this.frameOn = false;
                this.framePalette = System.Array.init(256, 0, System.Int32);
                this.rgb32OutBuffer = System.Array.init(65536, 0, System.Int32);
                this.byteOutBuffer = System.Array.init(262144, 0, System.Byte);
                this.outBuffer = System.Array.init(65536, 0, System.Int32);
                this.drawInfo = System.Array.init(65536, 0, System.Int32);
                this.nameTableBits = 0;
                this.vidRamIsRam = true;
                this._palette = System.Array.init(32, 0, System.Byte);
                this._openBus = 0;
                this.currentPalette = 0;
                this.NMIHasBeenThrownThisFrame = false;
                this._hScroll = 0;
                this._vScroll = 0;
                this.lockedHScroll = 0;
                this.lockedVScroll = 0;
                this.sprite0scanline = -1;
                this.sprite0x = -1;
                this._maxSpritesPerScanline = 64;
                this.spriteRAM = System.Array.init(256, 0, System.Byte);
                this.spritesOnLine = System.Array.init(512, 0, System.Int32);
                this.patternEntry = 0;
                this.patternEntryByte2 = 0;
                this.currentTileIndex = 0;
                this.xNTXor = 0;
                this.yNTXor = 0;
                this.fetchTile = true;
                this.events = new (System.Collections.Generic.Queue$1(ChiChiNES.PPUWriteEvent)).ctor();
            },
            ctor: function () {
                this.$initialize();
                this.InitSprites();

                this.vBuffer = System.Array.init(61440, 0, System.Byte);

                ChiChiNES.PixelWhizzler.GetPalRGBA();

                //for (int i = 0; i < 256; ++i)
                //    palCache[i] = new byte[32];
            }
        },
        methods: {
            Initialize: function () {
                this._PPUAddress = 0;
                this._PPUStatus = 0;
                this._PPUControlByte0 = 0;
                this._PPUControlByte1 = 0;
                this._hScroll = 0;
                this.scanlineNum = 0;
                this.scanlinePos = 0;
                this._spriteAddress = 0;
            },
            WriteState: function (writer) {

                writer.enqueue(this._PPUStatus);
                writer.enqueue(this._PPUControlByte0);
                writer.enqueue(this._hScroll);
                writer.enqueue(this._vScroll);
                writer.enqueue(this.scanlineNum);
                writer.enqueue(this.scanlinePos);
                writer.enqueue(this.currentYPosition);
                writer.enqueue(this.currentXPosition);
                writer.enqueue(this.nameTableIndex);
                writer.enqueue(this._backgroundPatternTableIndex);


                writer.enqueue(this.patternEntry);
                writer.enqueue(this.patternEntryByte2);
                writer.enqueue(this.currentAttributeByte);
                writer.enqueue(this.xNTXor);
                writer.enqueue(this.yNTXor);
                writer.enqueue(this.fetchTile ? 0 : 1);
                writer.enqueue(this.xPosition);
                writer.enqueue(this.yPosition);


                writer.enqueue(this.lastcpuClock);
                writer.enqueue(this.vbufLocation);


                for (var i = 0; i < 16384; i = (i + 4) | 0) {

                    writer.enqueue(this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, i) << 24 | (this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((i + 1) | 0)) << 16) | (this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((i + 2) | 0)) << 8) | (this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((i + 3) | 0)) << 0));
                }
                writer.enqueue(this._spriteAddress);

                for (var i1 = 0; i1 < 256; i1 = (i1 + 4) | 0) {

                    writer.enqueue((this.spriteRAM[i1] << 24) | (this.spriteRAM[((i1 + 1) | 0)] << 16) | (this.spriteRAM[((i1 + 2) | 0)] << 8) | (this.spriteRAM[((i1 + 3) | 0)]));
                }

                for (var i2 = 0; i2 < ChiChiNES.PixelWhizzler.pal.length; i2 = (i2 + 4) | 0) {

                    writer.enqueue((ChiChiNES.PixelWhizzler.pal[i2] << 24) | (ChiChiNES.PixelWhizzler.pal[((i2 + 1) | 0)] << 16) | (ChiChiNES.PixelWhizzler.pal[((i2 + 2) | 0)] << 8) | (ChiChiNES.PixelWhizzler.pal[((i2 + 3) | 0)]));
                }

                for (var i3 = 0; i3 < this._palette.length; i3 = (i3 + 4) | 0) {

                    writer.enqueue((this._palette[i3] << 24) | (this._palette[((i3 + 1) | 0)] << 16) | (this._palette[((i3 + 2) | 0)] << 8) | (this._palette[((i3 + 3) | 0)]));
                }

            },
            ReadState: function (state) {
                this._PPUStatus = state.dequeue();
                this._PPUControlByte0 = state.dequeue();
                this._hScroll = state.dequeue();
                this._vScroll = state.dequeue();
                this.scanlineNum = state.dequeue();
                this.scanlinePos = state.dequeue();
                this.currentYPosition = state.dequeue();
                this.currentXPosition = state.dequeue();
                this.nameTableIndex = state.dequeue();
                this._backgroundPatternTableIndex = state.dequeue();
                //_mirroring= state.Dequeue();
                //oneScreenMirrorOffset= state.Dequeue();
                //currentMirrorMask= state.Dequeue();

                this.patternEntry = state.dequeue();
                this.patternEntryByte2 = state.dequeue();
                this.currentAttributeByte = state.dequeue();
                this.xNTXor = state.dequeue();
                this.yNTXor = state.dequeue();
                this.fetchTile = (state.dequeue() === 1);
                this.xPosition = state.dequeue();
                this.yPosition = state.dequeue();

                this.lastcpuClock = state.dequeue();
                this.vbufLocation = state.dequeue();

                var packedByte = 0;
                for (var i = 0; i < 16384; i = (i + 4) | 0) {
                    packedByte = state.dequeue();
                    this.chrRomHandler.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(0, i, ((packedByte >> 24) & 255));
                    this.chrRomHandler.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(0, ((i + 1) | 0), ((packedByte >> 16) & 255));
                    this.chrRomHandler.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(0, ((i + 2) | 0), ((packedByte >> 8) & 255));
                    this.chrRomHandler.ChiChiNES$IClockedMemoryMappedIOElement$SetByte(0, ((i + 3) | 0), (packedByte & 255));
                }

                this._spriteAddress = state.dequeue();

                for (var i1 = 0; i1 < 256; i1 = (i1 + 4) | 0) {
                    packedByte = state.dequeue();
                    this.spriteRAM[i1] = (packedByte >> 24) & 255;
                    this.spriteRAM[((i1 + 1) | 0)] = (packedByte >> 16) & 255;
                    this.spriteRAM[((i1 + 2) | 0)] = (packedByte >> 8) & 255;
                    this.spriteRAM[((i1 + 3) | 0)] = packedByte & 255;
                }

                for (var i2 = 0; i2 < ChiChiNES.PixelWhizzler.pal.length; i2 = (i2 + 4) | 0) {
                    packedByte = state.dequeue();
                    ChiChiNES.PixelWhizzler.pal[i2] = (packedByte >> 24) & 255;
                    ChiChiNES.PixelWhizzler.pal[((i2 + 1) | 0)] = (packedByte >> 16) & 255;
                    ChiChiNES.PixelWhizzler.pal[((i2 + 2) | 0)] = (packedByte >> 8) & 255;
                    ChiChiNES.PixelWhizzler.pal[((i2 + 3) | 0)] = packedByte & 255;
                }

                for (var i3 = 0; i3 < this._palette.length; i3 = (i3 + 4) | 0) {
                    packedByte = state.dequeue();
                    this._palette[i3] = (packedByte >> 24) & 255;
                    this._palette[((i3 + 1) | 0)] = (packedByte >> 16) & 255;
                    this._palette[((i3 + 2) | 0)] = (packedByte >> 8) & 255;
                    this._palette[((i3 + 3) | 0)] = packedByte & 255;
                }

                this.UnpackSprites();
                this.PreloadSprites(this.scanlineNum);

            },
            VidRAM_GetNTByte: function (address) {
                var result = 0;
                if (address >= 8192 && address < 12288) {

                    result = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, address);

                } else {
                    result = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, address);
                }
                return result;
            },
            UpdatePPUControlByte0: function () {
                if ((this._PPUControlByte0 & 16) === 16) {
                    this._backgroundPatternTableIndex = 4096;
                } else {
                    this._backgroundPatternTableIndex = 0;
                }
            },
            /**
             * Fills an external buffer with rgb color values, relative to current state of PPU's pallete ram
             *
             * @instance
             * @public
             * @this ChiChiNES.PixelWhizzler
             * @memberof ChiChiNES.PixelWhizzler
             * @param   {System.Int32}    buffer
             * @return  {void}
             */
            SetupBufferForDisplay: function (buffer) {
                for (var i = 0; i < 30; i = (i + 1) | 0) {
                    this.p32[i] = ChiChiNES.PixelWhizzler.pal[i]; // pal[_vidRAM[i + 0x3F00]];
                }

                for (var i1 = 0; i1 < buffer.v.length; i1 = (i1 + 4) | 0) {
                    buffer.v[i1] = this.p32[buffer.v[i1]];
                    buffer.v[((i1 + 1) | 0)] = this.p32[buffer.v[((i1 + 1) | 0)] & 255];
                    buffer.v[((i1 + 2) | 0)] = this.p32[buffer.v[((i1 + 2) | 0)] & 255];
                    buffer.v[((i1 + 3) | 0)] = this.p32[buffer.v[((i1 + 3) | 0)] & 255];
                }
            },
            RenderScanline: function (scanlineNum) {
                throw new System.NotImplementedException();
            },
            /**
             * draws from the lastcpuClock to the current one
             *
             * @instance
             * @public
             * @this ChiChiNES.PixelWhizzler
             * @memberof ChiChiNES.PixelWhizzler
             * @param   {number}    cpuClockNum
             * @return  {void}
             */
            DrawTo: function (cpuClockNum) {
                var frClock = (cpuClockNum - this.lastcpuClock) * 3;

                if (this.frameClock < 6820) {
                    // if the frameclock +frClock is in vblank (< 6820) dont do nothing, just update it
                    if (this.frameClock + frClock < 6820) {
                        this.frameClock += frClock;
                        frClock = 0;
                    } else {
                        //find number of pixels to draw since frame start
                        frClock += this.frameClock - 6820;
                        this.frameClock = 6820;
                    }
                }
                for (var i = 0; i < frClock; ++i) {
                    switch (this.frameClock++) {
                        case 0: 
                            //frameFinished();
                            break;
                        case 6820: 
                            this.ClearVINT();
                            this.frameOn = true;
                            //
                            this.ClearNESPalette();
                            this.chrRomHandler.ChiChiNES$INESCart$ResetBankStartCache();
                            // setFrameOn();
                            if (this.spriteChanges) {
                                this.UnpackSprites();
                                this.spriteChanges = false;
                            }
                            break;
                        case 7161: 
                            //lockedVScroll = _vScroll;
                            this.vbufLocation = 0;
                            //curBufPos = bufStart;
                            this.xNTXor = 0;
                            this.yNTXor = 0;
                            this.currentXPosition = 0;
                            this.currentYPosition = 0;
                            break;
                        case ChiChiNES.PixelWhizzler.frameClockEnd: 
                            //if (fillRGB) FillBuffer();
                            this.shouldRender = true;
                            this.frameFinished();
                            this.SetupVINT();
                            this.frameOn = false;
                            this.frameClock = 0;
                            if (this._isDebugging) {
                                this.events.clear();
                            }
                            break;
                    }

                    if (this.frameClock >= 7161 && this.frameClock <= 89342) {


                        if (this.currentXPosition < 256 && this.vbufLocation < 61440) {
                            /* update x position */
                            this.xPosition = this.currentXPosition + this.lockedHScroll;


                            if ((this.xPosition & 7) === 0) {
                                this.xNTXor = ((this.xPosition & 256) === 256) ? 1024 : 0;
                                this.xPosition &= 255;

                                /* fetch next tile */
                                var ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;

                                var xTilePosition = this.xPosition >> 3;

                                //int tileRow = (yPosition >> 3) % 30 << 5;

                                //int tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;

                                var TileIndex = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, 8192 + ppuNameTableMemoryStart + xTilePosition + ((this.yPosition >> 3) % 30 << 5));

                                var patternTableYOffset = this.yPosition & 7;

                                var patternID = this._backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;

                                this.patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID);
                                this.patternEntryByte2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID + 8);

                                this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                                /* end fetch next tile */

                            }

                            /* draw pixel */
                            var tilePixel = this._tilesAreVisible ? this.GetNameTablePixel() : 0;
                            var foregroundPixel = { v : false };
                            var spritePixel = this._spritesAreVisible ? this.GetSpritePixel(foregroundPixel) : 0;

                            if (!this.hitSprite && this.spriteZeroHit && tilePixel !== 0) {
                                this.hitSprite = true;
                                this._PPUStatus = this._PPUStatus | 64;
                            }

                            //var x = pal[_palette[(foregroundPixel || (tilePixel == 0 && spritePixel != 0)) ? spritePixel : tilePixel]];
                            //var x = 

                            this.byteOutBuffer[this.vbufLocation * 4] = this._palette[(foregroundPixel.v || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
                            //byteOutBuffer[(vbufLocation * 4) + 1] = x;// (byte)(x >> 8);
                            //byteOutBuffer[(vbufLocation * 4) + 2] = x;//  (byte)(x >> 16);
                            //byteOutBuffer[(vbufLocation * 4) + 3] = 0xFF;// (byte)(x);// (byte)rgb32OutBuffer[vbufLocation];

                            this.vbufLocation++;
                        }
                        if (this.currentXPosition === 256) {
                            this.chrRomHandler.ChiChiNES$INESCart$UpdateScanlineCounter();
                        }
                        this.currentXPosition++;

                        if (this.currentXPosition > 340) {

                            this.currentXPosition = 0;
                            this.currentYPosition++;

                            this.PreloadSprites(this.currentYPosition);
                            if (this.spritesOnThisScanline >= 7) {
                                this._PPUStatus = this._PPUStatus | 32;
                            }

                            this.lockedHScroll = this._hScroll;

                            this.UpdatePixelInfo();
                            this.RunNewScanlineEvents();

                        }

                    }

                }
                this.lastcpuClock = cpuClockNum;
            },
            BumpScanline: function () {


            },
            UpdateXPosition: function () {

            },
            FillBuffer: function () {

                //int i = 0;
                //while (i < 256 * 240 )
                //{
                //    int tile = (outBuffer[i] & 0x0F);
                //    int sprite = ((outBuffer[i] >> 4) & 0x0F) + 16;
                //    int isSprite = (outBuffer[i] >> 8) & 64;
                //    int curPal = (outBuffer[i] >> 24) & 0xFF;

                //    uint pixel;
                //    if (isSprite > 0)
                //    {
                //        pixel = palCache[curPal][sprite];
                //    }
                //    else
                //    {
                //        pixel = palCache[curPal][tile];
                //    }
                //    rgb32OutBuffer[i] = pal[pixel];
                //    i++;
                //}
            },
            SetVideoBuffer: function (inBuffer) {
                this.rgb32OutBuffer = inBuffer;
            },
            DrawPixel: function () {

            },
            UpdatePixelInfo: function () {
                this.nameTableMemoryStart = Bridge.Int.mul(this.nameTableBits, 1024);
            },
            ClippingTilePixels: function () {
                return this._clipTiles;
            },
            ClippingSpritePixels: function () {
                return this._clipSprites;
            },
            SetByte: function (Clock, address, data) {
                var $t;
                // DrawTo(Clock);
                if (this._isDebugging) {
                    this.Events.enqueue(($t = new ChiChiNES.PPUWriteEvent(), $t.IsWrite = true, $t.DataWritten = data, $t.FrameClock = this.frameClock, $t.RegisterAffected = address, $t.ScanlineNum = ((Bridge.Int.div(this.frameClock, 341)) | 0), $t.ScanlinePos = this.frameClock % 341, $t));
                }
                this.needToDraw = true;
                //Writable 2C02 registers
                //-----------------------

                //4 	-	returns object attribute memory 
                //      location indexed by port 3, then increments port 3.

                //6	    -	PPU address port to access with port 7.

                //7	    -	PPU memory write port.


                switch (address & 7) {
                    case 0: 
                        this.DrawTo(Clock);
                        this._PPUControlByte0 = data;
                        this._openBus = data;
                        this.nameTableBits = this._PPUControlByte0 & 3;
                        this._backgroundPatternTableIndex = Bridge.Int.mul(((this._PPUControlByte0 & 16) >> 4), 4096);
                        // if we toggle /vbl we can throw multiple NMIs in a vblank period
                        //if ((data & 0x80) == 0x80 && NMIHasBeenThrownThisFrame)
                        //{
                        //     NMIHasBeenThrownThisFrame = false;
                        //}
                        //UpdatePixelInfo();
                        this.nameTableMemoryStart = Bridge.Int.mul(this.nameTableBits, 1024);
                        break;
                    case 1: 
                        //1	    0	disable composite colorburst (when 1). Effectively causes gfx to go black & white.
                        //      1	left side screen column (8 pixels wide) playfield clipping (when 0).
                        //      2	left side screen column (8 pixels wide) object clipping (when 0).
                        //      3	enable playfield display (on 1).
                        //      4	enable objects display (on 1).
                        //      5	R (to be documented)
                        //      6	G (to be documented)
                        //      7	B (to be documented)
                        this.DrawTo(Clock);
                        this.isRendering = (data & 24) !== 0;
                        this._PPUControlByte1 = data;
                        this._spritesAreVisible = (this._PPUControlByte1 & 16) === 16;
                        this._tilesAreVisible = (this._PPUControlByte1 & 8) === 8;
                        this._clipTiles = (this._PPUControlByte1 & 2) !== 2;
                        this._clipSprites = (this._PPUControlByte1 & 4) !== 4;
                        //UpdatePixelInfo();
                        this.nameTableMemoryStart = Bridge.Int.mul(this.nameTableBits, 1024);
                        break;
                    case 2: 
                        this.ppuReadBuffer = data;
                        this._openBus = data;
                        break;
                    case 3: 
                        //3	    -	internal object attribute memory index pointer 
                        //          (64 attributes, 32 bits each, byte granular access). 
                        //          stored value post-increments on access to port 4.
                        this._spriteAddress = data & 255;
                        this._openBus = this._spriteAddress;
                        break;
                    case 4: 
                        this.spriteRAM[this._spriteAddress] = data & 255;
                        // UnpackSprite(_spriteAddress / 4);
                        this._spriteAddress = (((this._spriteAddress + 1) | 0)) & 255;
                        this.unpackedSprites[((Bridge.Int.div(this._spriteAddress, 4)) | 0)].Changed = true;
                        this.spriteChanges = true;
                        break;
                    case 5: 
                        //5	    -	scroll offset port.
                        // on 1st read (high), bits 0,1,2 go to fine horizonal scroll, rest to select tile
                        // on 2nd read, bits 0,1,2 go to fine vertical scroll, rest to select tile
                        // during render, writes to FH are applied immediately
                        if (this.PPUAddressLatchIsHigh) {
                            //if (isRendering)
                            //{
                            //    fineHorizontalScroll = data & 0x7;
                            //    horizontalTileIndex = data >> 3;
                            //}  
                            this.DrawTo(Clock);
                            this._hScroll = data;

                            this.lockedHScroll = this._hScroll & 7;
                            this.UpdatePixelInfo();

                            this.PPUAddressLatchIsHigh = false;
                        } else {
                            // during rendering, a write here will not post to the rendering counter
                            this.DrawTo(Clock);
                            this._vScroll = data;
                            if (data > 240) {
                                this._vScroll = (data - 256) | 0;
                            }

                            if (!this.frameOn || (this.frameOn && !this.isRendering)) {
                                this.lockedVScroll = this._vScroll;
                            }

                            this.PPUAddressLatchIsHigh = true;
                            this.UpdatePixelInfo();

                        }
                        break;
                    case 6: 
                        //Since the PPU's external address bus is only 14 bits in width, 
                        //the top two bits of the value written are ignored. 
                        if (this.PPUAddressLatchIsHigh) {
                            //            //a) Write upper address byte into $2006
                            this._PPUAddress = (this._PPUAddress & 255) | ((data & 63) << 8);
                            this.PPUAddressLatchIsHigh = false;
                        } else {
                            //            //b) Write lower address byte into $2006
                            this._PPUAddress = (this._PPUAddress & 32512) | data & 255;
                            this.PPUAddressLatchIsHigh = true;

                            // writes here during rendering directly affect the scroll counter
                            // from Marat Fazulamans doc

                            //Address Written into $2006
                            //xxYYSSYYYYYXXXXX
                            //   | |  |     |
                            //   | |  |     +---- Horizontal scroll in tiles (i.e. 1 = 8 pixels)
                            //   | |  +--------- Vertical scroll in tiles (i.e. 1 = 8 pixels)
                            //   | +------------ Number of Name Table ($2000,$2400,$2800,$2C00)
                            //   +-------------- Additional vertical scroll in pixels (0..3)

                            // on second write during frame, loopy t (_hscroll, _vscroll) is copied to loopy_v (lockedHscroll, lockedVScroll)

                            this.DrawTo(Clock);
                            this._hScroll = ((this._PPUAddress & 31) << 3); // +(currentXPosition & 7);
                            this._vScroll = (((this._PPUAddress >> 5) & 31) << 3);
                            this._vScroll = this._vScroll | ((this._PPUAddress >> 12) & 3);

                            this.nameTableBits = ((this._PPUAddress >> 10) & 3);
                            if (this.frameOn) {

                                this.lockedHScroll = this._hScroll;
                                this.lockedVScroll = this._vScroll;
                                this.lockedVScroll = (this.lockedVScroll - this.currentYPosition) | 0;

                            }
                            this.UpdatePixelInfo();
                            // relock vscroll during render when this happens
                        }
                        break;
                    case 7: 
                        //            //Writing to PPU memory:
                        //            //c) Write data into $2007. After each write, the
                        //            //   address will increment either by 1 (bit 2 of
                        //            //   $2000 is 0) or by 32 (bit 2 of $2000 is 1).
                        // ppuLatch = data;
                        if ((this._PPUAddress & 65280) === 16128) {
                            this.DrawTo(Clock);
                            this.WriteToNESPalette(this._PPUAddress, (data & 255));
                            // these palettes are all mirrored every 0x10 bytes
                            this.UpdatePixelInfo();

                            // _vidRAM[_PPUAddress ^ 0x1000] = (byte)data;
                        } else {
                            // if its a nametable byte, mask it according to current mirroring
                            if ((this._PPUAddress & 61440) === 8192) {
                                this.chrRomHandler.ChiChiNES$INESCart$SetPPUByte(Clock, this._PPUAddress, (data & 255));
                            } else {
                                if (this.vidRamIsRam) {
                                    this.chrRomHandler.ChiChiNES$INESCart$SetPPUByte(Clock, this._PPUAddress, (data & 255));
                                }
                            }
                        }
                        // if controlbyte0.4, set ppuaddress + 32, else inc
                        if ((this.PPUControlByte0 & 4) === 4) {
                            this._PPUAddress = (((this._PPUAddress + 32) | 0));
                        } else {
                            this._PPUAddress = (((this._PPUAddress + 1) | 0));
                        }
                        // reset the flag which makex xxx6 set the high byte of address
                        this.PPUAddressLatchIsHigh = true;
                        this.PPUAddress = (this.PPUAddress & 16383);
                        break;
                }
            },
            GetByte: function (Clock, address) {
                var $t;
                if (this._isDebugging) {
                    this.Events.enqueue(($t = new ChiChiNES.PPUWriteEvent(), $t.IsWrite = false, $t.DataWritten = 0, $t.FrameClock = this.frameClock, $t.RegisterAffected = address, $t.ScanlineNum = ((Bridge.Int.div(this.frameClock, 341)) | 0), $t.ScanlinePos = this.frameClock % 341, $t));
                }

                switch (address & 7) {
                    case 3: 
                    case 0: 
                    case 1: 
                    case 5: 
                    case 6: 
                        return this._openBus;
                    case 2: 
                        var ret;
                        this.PPUAddressLatchIsHigh = true;
                        // bit 7 is set to 0 after a read occurs
                        // return lower 5 latched bits, and the status
                        ret = (this.ppuReadBuffer & 31) | this._PPUStatus;
                        //ret = _PPUStatus;
                        //{
                        //If read during HBlank and Bit #7 of $2000 is set to 0, then switch to Name Table #0
                        //if ((PPUControlByte0 & 0x80) == 0 && scanlinePos > 0xFF)
                        //{
                        //    nameTableMemoryStart = 0;
                        //}
                        // clear vblank flag if read
                        this.DrawTo(Clock);
                        if ((ret & 128) === 128) {


                            this._PPUStatus = this._PPUStatus & -129;

                        }
                        this.UpdatePixelInfo();
                        //}
                        this._openBus = ret;
                        return ret;
                    case 4: 
                        var tmp = this.spriteRAM[this._spriteAddress];
                        //ppuLatch = spriteRAM[SpriteAddress];
                        // should not increment on read ?
                        //SpriteAddress = (SpriteAddress + 1) & 0xFF;
                        this._openBus = tmp;
                        return tmp;
                    case 7: 
                        //        If Mapper = 9 Then
                        //            If PPUAddress < &H2000& Then
                        //                map9_latch tmp, (PPUAddress And &H1000&)
                        //            End If
                        //        End If
                        // palette reads shouldn't be buffered like regular vram reads, they re internal
                        if ((this.PPUAddress & 65280) === 16128) {
                            // these palettes are all mirrored every 0x10 bytes
                            tmp = this._palette[this.PPUAddress & 31];
                            // palette read should also read vram into read buffer

                            // info i found on the nesdev forums

                            // When you read PPU $3F00-$3FFF, you get immediate data from Palette RAM 
                            // (without the 1-read delay usually present when reading from VRAM) and the PPU 
                            // will also fetch nametable data from the corresponding address (which is mirrored from PPU $2F00-$2FFF). 

                            // note: writes do not work this way 
                            this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, ((this._PPUAddress - 4096) | 0));
                        } else {
                            tmp = this.ppuReadBuffer;
                            if (!!(this._PPUAddress >= 8192 & this._PPUAddress <= 12287)) {
                                this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress);
                            } else {
                                this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress & 16383);
                            }
                        }
                        if ((this._PPUControlByte0 & 4) === 4) {
                            this._PPUAddress = (this._PPUAddress + 32) | 0;
                        } else {
                            this._PPUAddress = (this._PPUAddress + 1) | 0;
                        }
                        this._PPUAddress = (this._PPUAddress & 16383);
                        return tmp;
                }
                //throw new NotImplementedException(string.Format("PPU.GetByte() recieved invalid address {0,4:x}", address));
                return 0;
            },
            ClearNESPalette: function () {
                //currentPalette = 0;
                //palCache[currentPalette] = new byte[32];
                //Array.Copy(_palette, 0, palCache[currentPalette], 0, 32);
            },
            WriteToNESPalette: function (address, data) {
                var palAddress = (address) & 31;
                this._palette[palAddress] = data;
                // rgb32OutBuffer[255 * 256 + palAddress] = data;
                if ((this._PPUAddress & 65519) === 16128) {
                    this._palette[(palAddress ^ 16) & 31] = data;
                    // rgb32OutBuffer[255 * 256 + palAddress ^ 0x10] = data;
                }
            },
            HandleEvent: function (Clock) {
                this.DrawTo(Clock);
            },
            ResetClock: function (Clock) {
                this.lastcpuClock = Clock;
            },
            SetupVINT: function () {
                this._PPUStatus = this._PPUStatus | 128;
                this.NMIHasBeenThrownThisFrame = false;
                // HandleVBlankIRQ = true;
                this._frames = (this._frames + 1) | 0;
                //isRendering = false;
                this.needToDraw = false;

                if (this.NMIIsThrown) {
                    this.nmiHandler();
                    this.HandleVBlankIRQ = true;
                    this.NMIHasBeenThrownThisFrame = true;
                }

            },
            ClearVINT: function () {
                this._PPUStatus = 0;
                this.hitSprite = false;
                this.spriteSize = ((this._PPUControlByte0 & 32) === 32) ? 16 : 8;
                if ((this._PPUControlByte1 & 24) !== 0) {
                    this.isRendering = true;
                }
                //scanlineNum = ScanlinePreRenderDummyScanline;
                //scanlinePos = 0;

                //RunNewScanlineEvents();

            },
            RunEndOfScanlineRenderEvents: function () {

            },
            RunNewScanlineEvents: function () {




                this.yPosition = (this.currentYPosition + this.lockedVScroll) | 0;

                if (this.yPosition < 0) {
                    this.yPosition = (this.yPosition + 240) | 0;
                }
                if (this.yPosition >= 240) {
                    this.yPosition = (this.yPosition - 240) | 0;
                    this.yNTXor = 2048;
                } else {
                    this.yNTXor = 0;
                }


            },
            UpdateSprites: function () {
                // sprite enable
                // left col object clipping
                // active object pattern table
                // color bits
                // b/w color
            },
            UpdateTiles: function () {
                // color bits
                // b/w color
                // background enable
                // left col bg clipping
                // scroll regs
                // x/y nametable 
                // pattern table
            },
            CopySprites: function (source, copyFrom) {
                // should copy 0x100 items from source to spriteRAM, 
                // starting at SpriteAddress, and wrapping around
                // should set spriteDMA flag
                for (var i = 0; i < 256; i = (i + 1) | 0) {
                    var spriteLocation = (((this._spriteAddress + i) | 0)) & 255;
                    if (this.spriteRAM[spriteLocation] !== source.v[((copyFrom + i) | 0)]) {
                        this.spriteRAM[spriteLocation] = source.v[((copyFrom + i) | 0)];
                        this.unpackedSprites[((Bridge.Int.div(spriteLocation, 4)) | 0)].Changed = true;
                    }
                }
                this._spriteCopyHasHappened = true;
                this.spriteChanges = true;

            },
            InitSprites: function () {
                this.currentSprites = System.Array.init(this._maxSpritesPerScanline, function (){
                    return new ChiChiNES.NESSprite();
                }, ChiChiNES.NESSprite);
                for (var i = 0; i < this._maxSpritesPerScanline; i = (i + 1) | 0) {
                    this.currentSprites[i] = new ChiChiNES.NESSprite();
                }

                this.unpackedSprites = System.Array.init(64, function (){
                    return new ChiChiNES.NESSprite();
                }, ChiChiNES.NESSprite);

                for (var i1 = 0; i1 < 64; i1 = (i1 + 1) | 0) {
                    this.unpackedSprites[i1] = new ChiChiNES.NESSprite();
                }

            },
            GetSpritePixel: function (isForegroundPixel) {
                isForegroundPixel.v = false;
                this.spriteZeroHit = false;
                var result = 0;
                var yLine = 0;
                var xPos = 0;
                var tileIndex = 0;

                for (var i = 0; i < this.spritesOnThisScanline; i = (i + 1) | 0) {
                    var currSprite = this.currentSprites[i].$clone();
                    if (currSprite.XPosition > 0 && this.currentXPosition >= currSprite.XPosition && this.currentXPosition < ((currSprite.XPosition + 8) | 0)) {

                        var spritePatternTable = 0;
                        if ((this._PPUControlByte0 & 8) === 8) {
                            spritePatternTable = 4096;
                        }
                        xPos = (this.currentXPosition - currSprite.XPosition) | 0;
                        yLine = (((this.currentYPosition - currSprite.YPosition) | 0) - 1) | 0;

                        yLine = yLine & (((this.spriteSize - 1) | 0));

                        tileIndex = currSprite.TileIndex;

                        if ((this._PPUControlByte0 & 32) === 32) {
                            if ((tileIndex & 1) === 1) {
                                spritePatternTable = 4096;
                                tileIndex = tileIndex ^ 1;
                            } else {
                                spritePatternTable = 0;
                            }
                        }

                        //result = WhissaSpritePixel(spritePatternTable, xPos, yLine, ref currSprite, tileIndex);
                        // 8x8 tile
                        var patternEntry;
                        var patternEntryBit2;

                        if (currSprite.FlipY) {
                            yLine = (((this.spriteSize - yLine) | 0) - 1) | 0;
                        }

                        if (yLine >= 8) {
                            yLine = (yLine + 8) | 0;
                        }

                        patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((spritePatternTable + Bridge.Int.mul(tileIndex, 16)) | 0) + yLine) | 0));
                        patternEntryBit2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((((spritePatternTable + Bridge.Int.mul(tileIndex, 16)) | 0) + yLine) | 0) + 8) | 0));

                        result = (currSprite.FlipX ? ((patternEntry >> xPos) & 1) | (((patternEntryBit2 >> xPos) << 1) & 2) : ((patternEntry >> ((7 - xPos) | 0)) & 1) | (((patternEntryBit2 >> ((7 - xPos) | 0)) << 1) & 2)) & 255;

                        if (result !== 0) {
                            if (currSprite.SpriteNumber === 0) {
                                this.spriteZeroHit = true;
                            }
                            isForegroundPixel.v = currSprite.Foreground;
                            return ((result | currSprite.AttributeByte) & 255);
                        }
                    }
                }
                return 0;
            },
            WhissaSpritePixel: function (patternTableIndex, x, y, sprite, tileIndex) {
                // 8x8 tile
                var patternEntry;
                var patternEntryBit2;

                if (sprite.v.FlipY) {
                    y = (((this.spriteSize - y) | 0) - 1) | 0;
                }

                if (y >= 8) {
                    y = (y + 8) | 0;
                }

                patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((patternTableIndex + Bridge.Int.mul(tileIndex, 16)) | 0) + y) | 0));
                patternEntryBit2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((((patternTableIndex + Bridge.Int.mul(tileIndex, 16)) | 0) + y) | 0) + 8) | 0));

                return ((sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> ((7 - x) | 0)) & 1) | (((patternEntryBit2 >> ((7 - x) | 0)) << 1) & 2)) & 255);
            },
            /**
             * populates the currentSpritesXXX arrays with the first 8 visible sprites on the 
             denoted scanline.
             *
             * @instance
             * @public
             * @this ChiChiNES.PixelWhizzler
             * @memberof ChiChiNES.PixelWhizzler
             * @param   {number}    scanline    the scanline to preload sprites for
             * @return  {void}
             */
            PreloadSprites: function (scanline) {
                var $t, $t1;
                this.spritesOnThisScanline = 0;
                this.sprite0scanline = -1;

                var yLine = (this.currentYPosition - 1) | 0;
                this.outBuffer[(((64768) + yLine) | 0)] = 0;
                this.outBuffer[(((65024) + yLine) | 0)] = 0;
                //spritesOnLine[2 * yLine] = 0;
                //spritesOnLine[2 * yLine + 1] = 0;
                for (var spriteNum = 0; spriteNum < 256; spriteNum = (spriteNum + 4) | 0) {
                    var spriteID = ((((spriteNum + this._spriteAddress) | 0)) & 255) >> 2;

                    var y = (this.unpackedSprites[spriteID].YPosition + 1) | 0;

                    if (scanline >= y && scanline < ((y + this.spriteSize) | 0)) {
                        if (spriteID === 0) {
                            this.sprite0scanline = scanline;
                            this.sprite0x = this.unpackedSprites[spriteID].XPosition;
                        }

                        var spId = (Bridge.Int.div(spriteNum, 4)) | 0;
                        if (spId < 32) {
                            this.outBuffer[($t = (((64768) + yLine) | 0))] = this.outBuffer[$t] | (1 << spId);
                        } else {
                            this.outBuffer[($t1 = (((65024) + yLine) | 0))] = this.outBuffer[$t1] | (1 << (((spId - 32) | 0)));
                        }

                        this.currentSprites[this.spritesOnThisScanline] = this.unpackedSprites[spriteID].$clone();
                        this.currentSprites[this.spritesOnThisScanline].IsVisible = true;

                        this.spritesOnThisScanline = (this.spritesOnThisScanline + 1) | 0;
                        if (this.spritesOnThisScanline === this._maxSpritesPerScanline) {
                            break;
                        }
                    }
                }
                if (this.spritesOnThisScanline > 7) {
                    this._PPUStatus = this._PPUStatus | 32;
                }

            },
            UnpackSprites: function () {
                //Buffer.BlockCopy
                var outBufferloc = 65280;
                for (var i = 0; i < 256; i = (i + 4) | 0) {
                    this.outBuffer[outBufferloc] = (this.spriteRAM[i] << 24) | (this.spriteRAM[((i + 1) | 0)] << 16) | (this.spriteRAM[((i + 2) | 0)] << 8) | (this.spriteRAM[((i + 3) | 0)] << 0);
                    outBufferloc = (outBufferloc + 1) | 0;
                }
                // Array.Copy(spriteRAM, 0, outBuffer, 255 * 256 * 4, 256);
                for (var currSprite = 0; currSprite < this.unpackedSprites.length; currSprite = (currSprite + 1) | 0) {
                    if (this.unpackedSprites[currSprite].Changed) {
                        this.UnpackSprite(currSprite);
                    }
                }
            },
            UnpackSprite: function (currSprite) {
                var attrByte = this.spriteRAM[((Bridge.Int.mul(currSprite, 4) + 2) | 0)];
                this.unpackedSprites[currSprite].IsVisible = true;
                this.unpackedSprites[currSprite].AttributeByte = ((attrByte & 3) << 2) | 16;
                this.unpackedSprites[currSprite].YPosition = this.spriteRAM[Bridge.Int.mul(currSprite, 4)];
                this.unpackedSprites[currSprite].XPosition = this.spriteRAM[((Bridge.Int.mul(currSprite, 4) + 3) | 0)];
                this.unpackedSprites[currSprite].SpriteNumber = currSprite;
                this.unpackedSprites[currSprite].Foreground = (attrByte & 32) !== 32;
                this.unpackedSprites[currSprite].FlipX = (attrByte & 64) === 64;
                this.unpackedSprites[currSprite].FlipY = (attrByte & 128) === 128;
                this.unpackedSprites[currSprite].TileIndex = this.spriteRAM[((Bridge.Int.mul(currSprite, 4) + 1) | 0)];
                this.unpackedSprites[currSprite].Changed = false;
            },
            /**
             * Returns a pixel
             *
             * @instance
             * @public
             * @this ChiChiNES.PixelWhizzler
             * @memberof ChiChiNES.PixelWhizzler
             * @return  {number}
             */
            GetNameTablePixel: function () {
                var result = ((this.patternEntry & 128) >> 7) | ((this.patternEntryByte2 & 128) >> 6);
                this.patternEntry = this.patternEntry << 1;
                this.patternEntryByte2 = this.patternEntryByte2 << 1;
                if (result > 0) {
                    result = result | this.currentAttributeByte;
                }
                return (result & 255);
            },
            FetchNextTile: function () {
                var ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;

                var xTilePosition = this.xPosition >> 3;

                var tileRow = (this.yPosition >> 3) % 30 << 5;

                var tileNametablePosition = (((((8192 + ppuNameTableMemoryStart) | 0) + xTilePosition) | 0) + tileRow) | 0;

                var TileIndex = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, tileNametablePosition);

                var patternTableYOffset = this.yPosition & 7;

                var patternID = (((this._backgroundPatternTableIndex + (Bridge.Int.mul(TileIndex, 16))) | 0) + patternTableYOffset) | 0;

                this.patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID);
                this.patternEntryByte2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((patternID + 8) | 0));

                this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
            },
            GetNameTablePixelOld: function () {
                var xPosition = this.currentXPosition, yPosition = this.currentYPosition;
                // int patternTableIndex = PatternTableIndex;

                var ppuNameTableMemoryStart = this.nameTableMemoryStart;
                //yPosition = 1;
                xPosition = (xPosition + this.lockedHScroll) | 0;

                if (xPosition > 255) {
                    xPosition = (xPosition - 256) | 0;
                    // from loopy's doc
                    // you can think of bits 0,1,2,3,4 of the vram address as the "x scroll"(*8)
                    //that the ppu increments as it draws.  as it wraps from 31 to 0, bit 10 is
                    //switched.  you should see how this causes horizontal wrapping between name
                    //tables (0,1) and (2,3).

                    ppuNameTableMemoryStart = ppuNameTableMemoryStart ^ 1024;
                }
                // index of this pixels bit in pattern table
                var patternTableEntryIndex = (7 - (xPosition & 7)) | 0;


                yPosition = (yPosition + this.lockedVScroll) | 0;
                if (yPosition < 0) {
                    yPosition = (yPosition + 240) | 0;
                }
                if (yPosition >= 240) {
                    yPosition = (yPosition - 240) | 0;
                    ppuNameTableMemoryStart = ppuNameTableMemoryStart ^ 2048;
                }

                var tileRow = (((Bridge.Int.div(yPosition, 8)) | 0)) % 30;

                var tileNametablePosition = (((((8192 + ppuNameTableMemoryStart) | 0) + (((Bridge.Int.div(xPosition, 8)) | 0))) | 0) + (Bridge.Int.mul(tileRow, 32))) | 0;

                var TileIndex = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, tileNametablePosition);


                var patternTableYOffset = yPosition & 7;


                var patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((this._backgroundPatternTableIndex + (Bridge.Int.mul(TileIndex, 16))) | 0) + patternTableYOffset) | 0));
                var patternEntryByte2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((((this._backgroundPatternTableIndex + (Bridge.Int.mul(TileIndex, 16))) | 0) + 8) | 0) + patternTableYOffset) | 0));


                // i want the patternTableEntryIndex'th bit of patternEntry in the 1st bit of pixel
                var result = (((patternEntry >> patternTableEntryIndex) & 1) | (Bridge.Int.mul(((patternEntryByte2 >> patternTableEntryIndex) & 1), 2))) & 255;

                if (result > 0) {
                    result = (result | ((this.GetAttributeTableEntry(ppuNameTableMemoryStart, ((Bridge.Int.div(xPosition, 8)) | 0), ((Bridge.Int.div(yPosition, 8)) | 0))) & 255)) & 255;
                }
                return result;
            },
            GetAttributeTableEntry: function (ppuNameTableMemoryStart, i, j) {
                var LookUp = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, ((((((((8192 + ppuNameTableMemoryStart) | 0) + 960) | 0) + (((Bridge.Int.div(i, 4)) | 0))) | 0) + (Bridge.Int.mul((((Bridge.Int.div(j, 4)) | 0)), 8))) | 0));

                switch ((i & 2) | Bridge.Int.mul((j & 2), 2)) {
                    case 0: 
                        return (LookUp << 2) & 12;
                    case 2: 
                        return LookUp & 12;
                    case 4: 
                        return (LookUp >> 2) & 12;
                    case 6: 
                        return (LookUp >> 4) & 12;
                }
                return 0;
            }
        }
    });

    Bridge.define("ChiChiNES.PortQueueing.QueuedPort", {
        inherits: [System.Collections.Generic.Queue$1(ChiChiNES.PortQueueing.PortWriteEntry)],
        ctors: {
            ctor: function () {
                this.$initialize();
                System.Collections.Generic.Queue$1(ChiChiNES.PortQueueing.PortWriteEntry).$ctor2.call(this, 256);
            }
        }
    });

    Bridge.define("ChiChiNES.BaseCart", {
        inherits: [ChiChiNES.INESCart],
        fields: {
            pixelEffects: null,
            debugging: false,
            debugEvents: null,
            iNesHeader: null,
            romControlBytes: null,
            nesCart: null,
            chrRom: null,
            /**
             * @instance
             * @memberof ChiChiNES.BaseCart
             * @type number
             */
            current8: 0,
            currentA: 0,
            currentC: 0,
            currentE: 0,
            SRAMCanWrite: false,
            SRAMEnabled: false,
            SRAMCanSave: false,
            prgRomCount: 0,
            chrRomCount: 0,
            mapperId: 0,
            bank8start: 0,
            bankAstart: 0,
            bankCstart: 0,
            bankEstart: 0,
            prgRomBank6: null,
            _ROMHashfunction: null,
            chrRomOffset: 0,
            chrRamStart: 0,
            whizzler: null,
            irqRaised: false,
            checkSum: null,
            mirroring: 0,
            updateIRQ: null,
            ppuBankStarts: null,
            bankStartCache: null,
            currentBank: 0,
            bankSwitchesChanged: false,
            nullEffect: null,
            oneScreenOffset: 0
        },
        props: {
            Debugging: {
                get: function () {
                    return this.debugging;
                },
                set: function (value) {
                    this.debugging = value;
                }
            },
            DebugEvents: {
                get: function () {
                    return this.debugEvents;
                },
                set: function (value) {
                    this.debugEvents = value;
                }
            },
            ChrRom: {
                get: function () {
                    return this.chrRom;
                },
                set: function (value) {
                    this.chrRom = value;
                }
            },
            ChrRomCount: {
                get: function () {
                    return this.chrRomCount;
                }
            },
            PrgRomCount: {
                get: function () {
                    return this.prgRomCount;
                }
            },
            ROMHashFunction: {
                get: function () {
                    return this._ROMHashfunction;
                },
                set: function (value) {
                    this._ROMHashfunction = value;
                }
            },
            Whizzler: {
                get: function () {
                    return this.whizzler;
                },
                set: function (value) {
                    this.whizzler = value;
                }
            },
            IrqRaised: {
                get: function () {
                    return this.irqRaised;
                },
                set: function (value) {
                    this.irqRaised = value;
                }
            },
            CheckSum: {
                get: function () {
                    return this.checkSum;
                }
            },
            CPU: {
                get: function () {
                    throw new System.NotImplementedException();
                },
                set: function (value) {
                    throw new System.NotImplementedException();
                }
            },
            SRAM: {
                get: function () {
                    return this.prgRomBank6;
                },
                set: function (value) {
                    if (value != null && value.length === this.prgRomBank6.length) {
                        this.prgRomBank6 = value;
                    }
                }
            },
            CartName: null,
            NumberOfPrgRoms: {
                get: function () {
                    return this.prgRomCount;
                }
            },
            NumberOfChrRoms: {
                get: function () {
                    return this.chrRomCount;
                }
            },
            MapperID: {
                get: function () {
                    return this.mapperId;
                }
            },
            Mirroring: {
                get: function () {
                    return this.mirroring;
                }
            },
            NMIHandler: {
                get: function () {
                    return this.updateIRQ;
                },
                set: function (value) {
                    this.updateIRQ = value;
                }
            },
            IRQAsserted: {
                get: function () {
                    return false;
                },
                set: function (value) {

                }
            },
            NextEventAt: {
                get: function () {
                    return -1;
                }
            },
            PpuBankStarts: {
                get: function () {
                    return this.ppuBankStarts;
                },
                set: function (value) {
                    this.ppuBankStarts = value;
                }
            },
            BankStartCache: {
                get: function () {
                    return this.bankStartCache;
                }
            },
            CurrentBank: {
                get: function () {
                    return this.currentBank;
                }
            },
            BankSwitchesChanged: {
                get: function () {
                    return this.bankSwitchesChanged;
                },
                set: function (value) {
                    this.bankSwitchesChanged = value;
                }
            },
            OneScreenOffset: {
                get: function () {
                    return this.oneScreenOffset;
                },
                set: function (value) {
                    this.oneScreenOffset = value;
                }
            },
            UsesSRAM: false,
            ChrRamStart: {
                get: function () {
                    return this.chrRamStart;
                }
            },
            PPUBankStarts: {
                get: function () {
                    return this.ppuBankStarts;
                },
                set: function (value) {
                    throw new System.NotImplementedException();
                }
            }
        },
        alias: [
            "ChrRom", "ChiChiNES$INESCart$ChrRom",
            "ROMHashFunction", "ChiChiNES$INESCart$ROMHashFunction",
            "LoadiNESCart", "ChiChiNES$INESCart$LoadiNESCart",
            "Whizzler", "ChiChiNES$INESCart$Whizzler",
            "UpdateScanlineCounter", "ChiChiNES$INESCart$UpdateScanlineCounter",
            "GetByte", "ChiChiNES$IClockedMemoryMappedIOElement$GetByte",
            "CheckSum", "ChiChiNES$INESCart$CheckSum",
            "WriteState", "ChiChiNES$INESCart$WriteState",
            "ReadState", "ChiChiNES$INESCart$ReadState",
            "CPU", "ChiChiNES$INESCart$CPU",
            "SRAM", "ChiChiNES$INESCart$SRAM",
            "CartName", "ChiChiNES$INESCart$CartName",
            "NumberOfPrgRoms", "ChiChiNES$INESCart$NumberOfPrgRoms",
            "NumberOfChrRoms", "ChiChiNES$INESCart$NumberOfChrRoms",
            "MapperID", "ChiChiNES$INESCart$MapperID",
            "Mirroring", "ChiChiNES$INESCart$Mirroring",
            "NMIHandler", "ChiChiNES$IClockedMemoryMappedIOElement$NMIHandler",
            "IRQAsserted", "ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted",
            "NextEventAt", "ChiChiNES$IClockedMemoryMappedIOElement$NextEventAt",
            "HandleEvent", "ChiChiNES$IClockedMemoryMappedIOElement$HandleEvent",
            "ResetClock", "ChiChiNES$IClockedMemoryMappedIOElement$ResetClock",
            "BankStartCache", "ChiChiNES$INESCart$BankStartCache",
            "CurrentBank", "ChiChiNES$INESCart$CurrentBank",
            "ResetBankStartCache", "ChiChiNES$INESCart$ResetBankStartCache",
            "UpdateBankStartCache", "ChiChiNES$INESCart$UpdateBankStartCache",
            "BankSwitchesChanged", "ChiChiNES$INESCart$BankSwitchesChanged",
            "GetPPUByte", "ChiChiNES$INESCart$GetPPUByte",
            "ActualChrRomOffset", "ChiChiNES$INESCart$ActualChrRomOffset",
            "SetPPUByte", "ChiChiNES$INESCart$SetPPUByte",
            "FetchPixelEffect", "ChiChiNES$INESCart$FetchPixelEffect",
            "UsesSRAM", "ChiChiNES$INESCart$UsesSRAM",
            "ChrRamStart", "ChiChiNES$INESCart$ChrRamStart",
            "PPUBankStarts", "ChiChiNES$INESCart$PPUBankStarts"
        ],
        ctors: {
            init: function () {
                this.pixelEffects = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Array.type(System.Byte)))();
                this.debugging = false;
                this.debugEvents = new (System.Collections.Generic.List$1(ChiChiNES.CartDebugEvent)).ctor();
                this.iNesHeader = System.Array.init(16, 0, System.Byte);
                this.romControlBytes = System.Array.init(2, 0, System.Byte);
                this.current8 = -1;
                this.currentA = -1;
                this.currentC = -1;
                this.currentE = -1;
                this.prgRomBank6 = System.Array.init(8192, 0, System.Byte);
                this.chrRomOffset = 0;
                this.chrRamStart = 0;
                this.mirroring = -1;
                this.ppuBankStarts = System.Array.init(16, 0, System.Int32);
                this.bankStartCache = System.Array.init(4096, 0, System.Int32);
                this.currentBank = 0;
                this.bankSwitchesChanged = false;
                this.nullEffect = System.Array.init([0, 0, 0, 0, 0, 0, 0, 0], System.Byte);
            },
            ctor: function () {
                this.$initialize();

                var effect = System.Array.init([1, 1, 1, 1, 1, 1, 1, 1], System.Byte);
                this.pixelEffects.add(3408, effect);
                this.pixelEffects.add(0, effect);

                for (var i = 21264; i < 21696; i = (i + 1) | 0) {
                    this.pixelEffects.add(((i - 16400) | 0), effect);
                }

                for (var i1 = 0; i1 < 16; i1 = (i1 + 1) | 0) {
                    this.ppuBankStarts[i1] = Bridge.Int.mul(i1, 1024);
                }
            }
        },
        methods: {
            ClearDebugEvents: function () {
                this.debugEvents.clear();
            },
            LoadiNESCart: function (header, prgRoms, chrRoms, prgRomData, chrRomData, chrRomOffset) {
                this.romControlBytes[0] = header[6];
                this.romControlBytes[1] = header[7];

                this.mapperId = (this.romControlBytes[0] & 240) >> 4;
                this.mapperId = (this.mapperId + (this.romControlBytes[1] & 240)) | 0;
                this.chrRomOffset = chrRomOffset;
                /* 
                .NES file format
                ---------------------------------------------------------------------------
                0-3      String "NES^Z" used to recognize .NES files.
                4        Number of 16kB ROM banks.
                5        Number of 8kB VROM banks.
                6        bit 0     1 for vertical mirroring, 0 for horizontal mirroring
                        bit 1     1 for battery-backed RAM at $6000-$7FFF
                        bit 2     1 for a 512-byte trainer at $7000-$71FF
                        bit 3     1 for a four-screen VRAM layout 
                        bit 4-7   Four lower bits of ROM Mapper Type.
                7        bit 0-3   Reserved, must be zeroes!
                        bit 4-7   Four higher bits of ROM Mapper Type.
                8-15     Reserved, must be zeroes!
                16-...   ROM banks, in ascending order. If a trainer i6s present, its
                        512 bytes precede the ROM bank contents.
                ...-EOF  VROM banks, in ascending order.
                ---------------------------------------------------------------------------
                */

                System.Array.copy(header, 0, this.iNesHeader, 0, header.length);
                this.prgRomCount = prgRoms;
                this.chrRomCount = chrRoms;

                this.nesCart = System.Array.init(prgRomData.length, 0, System.Byte);
                System.Array.copy(prgRomData, 0, this.nesCart, 0, prgRomData.length);

                if (this.chrRomCount === 0) {
                    // chrRom is going to be RAM
                    chrRomData = System.Array.init(32768, 0, System.Byte);
                }


                this.chrRom = System.Array.init(((chrRomData.length + 4096) | 0), 0, System.Byte);

                this.chrRamStart = chrRomData.length;

                System.Array.copy(chrRomData, 0, this.chrRom, 0, chrRomData.length);

                this.prgRomCount = this.iNesHeader[4];
                this.chrRomCount = this.iNesHeader[5];


                this.romControlBytes[0] = this.iNesHeader[6];
                this.romControlBytes[1] = this.iNesHeader[7];

                this.SRAMCanSave = (this.romControlBytes[0] & 2) === 2;
                this.SRAMEnabled = true;

                this.UsesSRAM = (this.romControlBytes[0] & 2) === 2;

                // rom0.0=0 is horizontal mirroring, rom0.0=1 is vertical mirroring

                // by default we have to call Mirror() at least once to set up the bank offsets
                this.Mirror(0, 0);
                if ((this.romControlBytes[0] & 1) === 1) {
                    this.Mirror(0, 1);
                } else {
                    this.Mirror(0, 2);
                }

                if ((this.romControlBytes[0] & 8) === 8) {
                    this.Mirror(0, 3);
                }


                this.checkSum = ""; //ROMHashFunction(nesCart, chrRom);

                this.InitializeCart();

            },
            UpdateScanlineCounter: function () { },
            GetByte: function (clock, address) {
                var bank = 0;

                switch (address & 57344) {
                    case 24576: 
                        return this.prgRomBank6[address & 8191];
                    case 32768: 
                        bank = this.bank8start;
                        break;
                    case 40960: 
                        bank = this.bankAstart;
                        break;
                    case 49152: 
                        bank = this.bankCstart;
                        break;
                    case 57344: 
                        bank = this.bankEstart;
                        break;
                }
                // if cart is half sized, adjust
                if (((bank + (address & 8191)) | 0) > this.nesCart.length) {
                    throw new System.Exception("THis is broken!");
                }
                return this.nesCart[((bank + (address & 8191)) | 0)];


            },
            SetupBankStarts: function (reg8, regA, regC, regE) {
                reg8 = this.MaskBankAddress(reg8);
                regA = this.MaskBankAddress(regA);
                regC = this.MaskBankAddress(regC);
                regE = this.MaskBankAddress(regE);

                this.current8 = reg8;
                this.currentA = regA;
                this.currentC = regC;
                this.currentE = regE;
                this.bank8start = Bridge.Int.mul(reg8, 8192);
                this.bankAstart = Bridge.Int.mul(regA, 8192);
                this.bankCstart = Bridge.Int.mul(regC, 8192);
                this.bankEstart = Bridge.Int.mul(regE, 8192);

            },
            MaskBankAddress: function (bank) {
                if (bank >= Bridge.Int.mul(this.prgRomCount, 2)) {
                    var i = 255;
                    while ((bank & i) >= Bridge.Int.mul(this.prgRomCount, 2)) {
                        i = i >> 1;
                    }
                    return (bank & i);
                } else {
                    return bank;
                }
            },
            WriteState: function (state) {
                state.enqueue(this.SRAMCanWrite ? 1 : 0);
                state.enqueue(this.SRAMEnabled ? 1 : 0);
                state.enqueue(this.SRAMCanSave ? 1 : 0);

                state.enqueue(this.prgRomCount);
                state.enqueue(this.chrRomCount);

                state.enqueue(this.mapperId);

                state.enqueue(this.bank8start);
                state.enqueue(this.bankAstart);
                state.enqueue(this.bankCstart);
                state.enqueue(this.bankEstart);

                for (var i = 0; i < 8192; i = (i + 4) | 0) {

                    state.enqueue((this.prgRomBank6[i] << 24) | (this.prgRomBank6[((i + 1) | 0)] << 16) | (this.prgRomBank6[((i + 2) | 0)] << 8) | (this.prgRomBank6[((i + 3) | 0)]));
                }
            },
            ReadState: function (state) {
                this.SRAMCanWrite = state.dequeue() === 1;
                this.SRAMEnabled = state.dequeue() === 1;
                this.SRAMCanSave = state.dequeue() === 1;

                this.prgRomCount = state.dequeue();
                this.chrRomCount = state.dequeue();

                this.mapperId = state.dequeue();

                this.bank8start = state.dequeue();
                this.bankAstart = state.dequeue();
                this.bankCstart = state.dequeue();
                this.bankEstart = state.dequeue();

                var packedByte = 0;
                for (var i = 0; i < 8192; i = (i + 4) | 0) {
                    packedByte = state.dequeue();
                    this.prgRomBank6[i] = (packedByte >> 24) & 255;
                    this.prgRomBank6[((i + 1) | 0)] = (packedByte >> 16) & 255;
                    this.prgRomBank6[((i + 2) | 0)] = (packedByte >> 8) & 255;
                    this.prgRomBank6[((i + 3) | 0)] = packedByte & 255;

                }
            },
            HandleEvent: function (Clock) { },
            ResetClock: function (Clock) { },
            ResetBankStartCache: function () {
                // if (currentBank > 0)
                this.currentBank = 0;
                // Array.Clear(bankStartCache, 0, 16 * 256 * 256);
                System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, 0, 16);

                //Mirror(-1, this.mirroring);
                //chrRamStart = ppuBankStarts[8];
                //Array.Copy(ppuBankStarts, 0, bankStartCache[0], 0, 16 * 4);
                //bankSwitchesChanged = false;
            },
            UpdateBankStartCache: function () {
                this.currentBank = (this.currentBank + 1) | 0;
                System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, Bridge.Int.mul(this.currentBank, 16), 16);
                this.whizzler.ChiChiNES$IPPU$UpdatePixelInfo();
                return this.currentBank;

            },
            GetPPUByte: function (clock, address) {
                var bank = (Bridge.Int.div(address, 1024)) | 0;
                var newAddress = (this.ppuBankStarts[bank] + (address & 1023)) | 0;

                //while (newAddress > chrRamStart)
                //{
                //    newAddress -= chrRamStart;
                //}
                return this.chrRom[newAddress];
            },
            ActualChrRomOffset: function (address) {
                var bank = (Bridge.Int.div(address, 1024)) | 0;
                //int newAddress = ppuBankStarts[bank] + (address & 0x3FF);
                var newAddress = (this.bankStartCache[(((Bridge.Int.mul(this.currentBank, 16)) + bank) | 0)] + (address & 1023)) | 0;

                return newAddress;
            },
            SetPPUByte: function (clock, address, data) {
                var bank = (Bridge.Int.div(address, 1024)) | 0;
                var newAddress = (this.bankStartCache[(((Bridge.Int.mul(this.currentBank, 16)) + bank) | 0)] + (address & 1023)) | 0; // ppuBankStarts[bank] + (address & 0x3FF);
                this.chrRom[newAddress] = data;
            },
            FetchPixelEffect: function (vramAddress) {
                var bank = (Bridge.Int.div(vramAddress, 1024)) | 0;
                var newAddress = (this.ppuBankStarts[bank] + (vramAddress & 1023)) | 0;

                if (this.pixelEffects.containsKey(newAddress)) {
                    return this.pixelEffects.get(newAddress);
                } else {
                    return this.nullEffect;
                }

            },
            Mirror: function (clockNum, mirroring) {
                var $t;
                //    //            A11 A10 Effect
                //    //----------------------------------------------------------
                //    // 0   0  All four screen buffers are mapped to the same
                //    //        area of memory which repeats at $2000, $2400,
                //    //        $2800, and $2C00.
                //    // 0   x  "Upper" and "lower" screen buffers are mapped to
                //    //        separate areas of memory at $2000, $2400 and
                //    //        $2800, $2C00. ( horizontal mirroring)
                //    // x   0  "Left" and "right" screen buffers are mapped to
                //    //        separate areas of memory at $2000, $2800 and
                //    //        $2400,$2C00.  (vertical mirroring)
                //    // x   x  All four screen buffers are mapped to separate
                //    //        areas of memory. In this case, the cartridge
                //    //        must contain 2kB of additional VRAM (i got vram up the wazoo)
                //    // 0xC00 = 110000000000
                //    // 0x800 = 100000000000
                //    // 0x400 = 010000000000
                //    // 0x000 = 000000000000

                if (this.debugging) {
                    this.DebugEvents.add(($t = new ChiChiNES.CartDebugEvent(), $t.Clock = clockNum, $t.EventType = System.String.format("Mirror set to {0}", mirroring), $t));
                }

                //if (mirroring == this.mirroring) return;

                this.mirroring = mirroring;

                if (clockNum > -1) {
                    this.whizzler.ChiChiNES$IPPU$DrawTo(clockNum);
                }

                //Console.WriteLine("Mirroring set to {0}", mirroring);

                switch (mirroring) {
                    case 0: 
                        this.ppuBankStarts[8] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                        this.ppuBankStarts[9] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                        this.ppuBankStarts[10] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                        this.ppuBankStarts[11] = (((this.chrRamStart + 0) | 0) + this.oneScreenOffset) | 0;
                        break;
                    case 1: 
                        this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                        this.ppuBankStarts[9] = (this.chrRamStart + 1024) | 0;
                        this.ppuBankStarts[10] = (this.chrRamStart + 0) | 0;
                        this.ppuBankStarts[11] = (this.chrRamStart + 1024) | 0;
                        break;
                    case 2: 
                        this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                        this.ppuBankStarts[9] = (this.chrRamStart + 0) | 0;
                        this.ppuBankStarts[10] = (this.chrRamStart + 1024) | 0;
                        this.ppuBankStarts[11] = (this.chrRamStart + 1024) | 0;
                        break;
                    case 3: 
                        this.ppuBankStarts[8] = (this.chrRamStart + 0) | 0;
                        this.ppuBankStarts[9] = (this.chrRamStart + 1024) | 0;
                        this.ppuBankStarts[10] = (this.chrRamStart + 2048) | 0;
                        this.ppuBankStarts[11] = (this.chrRamStart + 3072) | 0;
                        break;
                }
                this.UpdateBankStartCache();
                this.whizzler.ChiChiNES$IPPU$UpdatePixelInfo();

            }
        }
    });

    Bridge.define("ChiChiNES.CPU.NESCart", {
        inherits: [ChiChiNES.BaseCart],
        fields: {
            prgRomBank6$1: null,
            prevBSSrc: null
        },
        alias: [
            "InitializeCart", "ChiChiNES$INESCart$InitializeCart",
            "SetByte", "ChiChiNES$IClockedMemoryMappedIOElement$SetByte"
        ],
        ctors: {
            init: function () {
                this.prgRomBank6$1 = System.Array.init(2048, 0, System.Byte);
                this.prevBSSrc = System.Array.init(8, 0, System.Int32);
            }
        },
        methods: {
            InitializeCart: function () {

                for (var i = 0; i < 8; i = (i + 1) | 0) {
                    this.prevBSSrc[i] = -1;
                }
                //SRAMEnabled = SRAMCanSave;


                switch (this.mapperId) {
                    case 0: 
                    case 1: 
                    case 2: 
                    case 3: 
                        if (this.ChrRomCount > 0) {
                            this.CopyBanks(0, 0, 0, 1);
                        }
                        this.SetupBankStarts(0, 1, ((Bridge.Int.mul(this.PrgRomCount, 2) - 2) | 0), ((Bridge.Int.mul(this.PrgRomCount, 2) - 1) | 0));
                        break;
                    case 7: 
                        //SetupBanks(0, 1, 2, 3);
                        this.SetupBankStarts(0, 1, 2, 3);
                        this.Mirror(0, 0);
                        break;
                    default: 
                        throw new System.NotImplementedException("Mapper " + (this.mapperId.toString() || "") + " not implemented.");
                }
            },
            CopyBanks: function (clock, dest, src, numberOf8kBanks) {

                if (dest >= this.ChrRomCount) {
                    dest = (this.ChrRomCount - 1) | 0;
                }

                var oneKsrc = Bridge.Int.mul(src, 8);
                var oneKdest = Bridge.Int.mul(dest, 8);
                //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
                //  setup ppuBankStarts in 0x400 block chunks 
                for (var i = 0; i < (Bridge.Int.mul(numberOf8kBanks, 8)); i = (i + 1) | 0) {
                    this.ppuBankStarts[((oneKdest + i) | 0)] = Bridge.Int.mul((((oneKsrc + i) | 0)), 1024);

                }
                this.UpdateBankStartCache();
            },
            SetByte: function (clock, address, val) {
                if (address >= 24576 && address <= 32767) {
                    if (this.SRAMEnabled) {
                        this.prgRomBank6$1[address & 8191] = val & 255;
                    }

                    return;
                }

                if (this.mapperId === 7) {
                    // val selects which bank to swap, 32k at a time
                    var newbank8 = 0;
                    newbank8 = Bridge.Int.mul(4, (val & 15));

                    this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
                    // whizzler.DrawTo(clock);
                    if ((val & 16) === 16) {
                        this.OneScreenOffset = 1024;
                    } else {
                        this.OneScreenOffset = 0;
                    }
                    this.Mirror(clock, 0);
                }

                if (this.mapperId === 3 && address >= 32768) {

                    this.CopyBanks(clock, 0, val, 1);
                }

                if (this.mapperId === 2 && address >= 32768) {
                    var newbank81 = 0;

                    newbank81 = (Bridge.Int.mul((val), 2));
                    // keep two high banks, swap low banks

                    // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
                    this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
                }





            }
        }
    });

    Bridge.define("ChiChiNES.NesCartMMC1", {
        inherits: [ChiChiNES.BaseCart],
        fields: {
            sequence: 0,
            accumulator: 0,
            bank_select: 0,
            _registers: null,
            lastwriteAddress: 0,
            lastClock: 0
        },
        alias: [
            "InitializeCart", "ChiChiNES$INESCart$InitializeCart",
            "SetByte", "ChiChiNES$IClockedMemoryMappedIOElement$SetByte"
        ],
        ctors: {
            init: function () {
                this.sequence = 0;
                this.accumulator = 0;
                this.bank_select = 0;
                this._registers = System.Array.init(4, 0, System.Int32);
                this.lastwriteAddress = 0;
            }
        },
        methods: {
            InitializeCart: function () {

                if (this.ChrRomCount > 0) {
                    this.CopyBanks(0, 0, 4);
                }
                this._registers[0] = 12;
                this._registers[1] = 0;
                this._registers[2] = 0;
                this._registers[3] = 0;

                this.SetupBankStarts(0, 1, this.PrgRomCount * 2 - 2, this.PrgRomCount * 2 - 1);

                this.sequence = 0;
                this.accumulator = 0;
            },
            MaskBankAddress$1: function (bank) {
                if (bank >= this.PrgRomCount * 2) {
                    var i;
                    i = 255;
                    while ((bank & i) >= this.PrgRomCount * 2) {

                        i = i / 2;
                    }

                    return (bank & i);
                } else {
                    return bank;
                }
            },
            CopyBanks: function (dest, src, numberOf4kBanks) {
                if (this.ChrRomCount > 0) {
                    var oneKdest = dest * 4;
                    var oneKsrc = src * 4;
                    //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
                    //  setup ppuBankStarts in 0x400 block chunks 
                    for (var i = 0; i < (numberOf4kBanks * 4); ++i) {
                        this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
                    }

                    //Array.Copy(chrRom, src * 0x1000, whizzler.cartCopyVidRAM, dest * 0x1000, numberOf4kBanks * 0x1000);
                }
                this.UpdateBankStartCache();
            },
            SetByte: function (clock, address, val) {
                // if write is to a different register, reset
                this.lastClock = clock;
                switch (address & 61440) {
                    case 24576: 
                    case 28672: 
                        this.prgRomBank6[address & 8191] = val;
                        break;
                    default: 
                        this.lastwriteAddress = address;
                        if ((val & 128) === 128) {
                            this._registers[0] = this._registers[0] | 12;
                            this.accumulator = 0; // _registers[(address / 0x2000) & 3];
                            this.sequence = 0;
                        } else {
                            if ((val & 1) === 1) {
                                this.accumulator = this.accumulator | (1 << this.sequence);
                            }
                            this.sequence = this.sequence + 1;
                        }
                        if (this.sequence === 5) {
                            var regnum = (address & 32767) >> 13;
                            this._registers[(address & 32767) >> 13] = this.accumulator;
                            this.sequence = 0;
                            this.accumulator = 0;

                            switch (regnum) {
                                case 0: 
                                    this.SetMMC1Mirroring(clock);
                                    break;
                                case 1: 
                                case 2: 
                                    this.SetMMC1ChrBanking(clock);
                                    break;
                                case 3: 
                                    this.SetMMC1PrgBanking();
                                    break;
                            }

                        }
                        break;
                }

            },
            SetMMC1ChrBanking: function (clock) {
                //	bit 4 - sets 8KB or 4KB CHRROM switching mode
                // 0 = 8KB CHRROM banks, 1 = 4KB CHRROM banks
                this.whizzler.ChiChiNES$IPPU$DrawTo(clock);
                if ((this._registers[0] & 16) === 16) {
                    this.CopyBanks(0, this._registers[1], 1);
                    this.CopyBanks(1, this._registers[2], 1);
                } else {
                    //CopyBanks(0, _registers[1], 2);
                    this.CopyBanks(0, this._registers[1], 1);
                    this.CopyBanks(1, this._registers[1] + 1, 1);
                }
                this.BankSwitchesChanged = true;

                this.whizzler.ChiChiNES$IPPU$UpdatePixelInfo();
            },
            SetMMC1PrgBanking: function () {
                var reg;
                if (this.PrgRomCount === 32) {
                    this.bank_select = (this._registers[1] & 16) << 1;

                } else {
                    this.bank_select = 0;
                }


                if ((this._registers[0] & 8) === 0) {
                    reg = 4 * ((this._registers[3] >> 1) & 15) + this.bank_select;
                    this.SetupBankStarts(reg, reg + 1, reg + 2, reg + 3);
                } else {
                    reg = 2 * (this._registers[3]) + this.bank_select;
                    //bit 2 - toggles between low PRGROM area switching and high
                    //PRGROM area switching
                    //0 = high PRGROM switching, 1 = low PRGROM switching
                    if ((this._registers[0] & 4) === 4) {
                        // select 16k bank in register 3 (setupbankstarts switches 8k banks)
                        this.SetupBankStarts(reg, reg + 1, this.PrgRomCount * 2 - 2, this.PrgRomCount * 2 - 1);
                        //SetupBanks(reg8, reg8 + 1, 0xFE, 0xFF);
                    } else {
                        this.SetupBankStarts(0, 1, reg, reg + 1);
                    }
                }
            },
            SetMMC1Mirroring: function (clock) {
                //bit 1 - toggles between H/V and "one-screen" mirroring
                //0 = one-screen mirroring, 1 = H/V mirroring
                this.whizzler.ChiChiNES$IPPU$DrawTo(clock);
                switch (this._registers[0] & 3) {
                    case 0: 
                        this.OneScreenOffset = 0;
                        this.Mirror(clock, 0);
                        break;
                    case 1: 
                        this.OneScreenOffset = 1024;
                        this.Mirror(clock, 0);
                        break;
                    case 2: 
                        this.Mirror(clock, 1); // vertical
                        break;
                    case 3: 
                        this.Mirror(clock, 2); // horizontal
                        break;
                }
                this.BankSwitchesChanged = true;
                this.whizzler.ChiChiNES$IPPU$UpdatePixelInfo();
            }
        }
    });

    Bridge.define("ChiChiNES.NesCartMMC3", {
        inherits: [ChiChiNES.BaseCart],
        fields: {
            _registers: null,
            chr2kBank0: 0,
            chr2kBank1: 0,
            chr1kBank0: 0,
            chr1kBank1: 0,
            chr1kBank2: 0,
            chr1kBank3: 0,
            prgSwap: 0,
            prgSwitch1: 0,
            prgSwitch2: 0,
            prevBSSrc: null,
            _mmc3Command: 0,
            _mmc3ChrAddr: 0,
            _mmc3IrqVal: 0,
            _mmc3TmpVal: 0,
            scanlineCounter: 0,
            _mmc3IrcOn: false,
            ppuBankSwap: false,
            PPUBanks: null
        },
        props: {
            IRQAsserted: {
                get: function () {
                    return this.irqRaised;
                },
                set: function (value) {
                    this.irqRaised = value;
                }
            }
        },
        alias: [
            "InitializeCart", "ChiChiNES$INESCart$InitializeCart",
            "IRQAsserted", "ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted",
            "SetByte", "ChiChiNES$IClockedMemoryMappedIOElement$SetByte",
            "UpdateScanlineCounter", "ChiChiNES$INESCart$UpdateScanlineCounter"
        ],
        ctors: {
            init: function () {
                this._registers = System.Array.init(4, 0, System.Int32);
                this.chr2kBank0 = 0;
                this.chr2kBank1 = 1;
                this.chr1kBank0 = 0;
                this.chr1kBank1 = 0;
                this.chr1kBank2 = 0;
                this.chr1kBank3 = 0;
                this.prgSwap = 0;
                this.prgSwitch1 = 0;
                this.prgSwitch2 = 0;
                this.prevBSSrc = System.Array.init(8, 0, System.Int32);
                this._mmc3Command = 0;
                this._mmc3ChrAddr = 0;
                this._mmc3IrqVal = 0;
                this._mmc3TmpVal = 0;
                this.scanlineCounter = 0;
                this._mmc3IrcOn = false;
                this.ppuBankSwap = false;
                this.PPUBanks = System.Array.init(8, 0, System.Int32);
            }
        },
        methods: {
            InitializeCart: function () {

                this.prgSwap = 1;

                //SetupBanks(0, 1, 0xFE, 0xFF);
                this.prgSwitch1 = 0;
                this.prgSwitch2 = 1;
                this.SwapPrgRomBanks();
                this._mmc3IrqVal = 0;
                this._mmc3IrcOn = false;
                this._mmc3TmpVal = 0;

                this.chr2kBank0 = 0;
                this.chr2kBank1 = 0;

                this.chr1kBank0 = 0;
                this.chr1kBank1 = 0;
                this.chr1kBank2 = 0;
                this.chr1kBank3 = 0;

                if (this.ChrRomCount > 0) {
                    this.CopyBanks(0, 0, 8);
                }
            },
            MaskBankAddress: function (bank) {

                if (bank >= Bridge.Int.mul(this.PrgRomCount, 2)) {
                    var i = 255;
                    while ((bank & i) >= Bridge.Int.mul(this.PrgRomCount, 2)) {
                        i = i >> 1;
                    }
                    return (bank & i);
                } else {
                    return bank;
                }
            },
            CopyBanks: function (dest, src, numberOf1kBanks) {
                var $t;
                if (this.ChrRomCount > 0) {
                    for (var i = 0; i < numberOf1kBanks; i = (i + 1) | 0) {
                        ($t = this.PpuBankStarts)[((dest + i) | 0)] = Bridge.Int.mul((((src + i) | 0)), 1024);
                    }
                    this.BankSwitchesChanged = true;
                    //Array.Copy(chrRom, src * 0x400, whizzler.cartCopyVidRAM, dest * 0x400, numberOf1kBanks * 0x400);
                }
            },
            SetByte: function (clock, address, val) {
                if (address >= 24576 && address < 32768) {
                    if (this.SRAMEnabled && this.SRAMCanWrite) {
                        this.prgRomBank6[address & 8191] = val & 255;
                    }
                    return;
                }
                //Bank select ($8000-$9FFE, even)

                //7  bit  0
                //---- ----
                //CPxx xRRR
                //||    |||
                //||    +++- Specify which bank register to update on next write to Bank Data register
                //_mmc3Command
                //||         0: Select 2 KB CHR bank at PPU $0000-$07FF (or $1000-$17FF);
                //||         1: Select 2 KB CHR bank at PPU $0800-$0FFF (or $1800-$1FFF);
                //||         2: Select 1 KB CHR bank at PPU $1000-$13FF (or $0000-$03FF);
                //||         3: Select 1 KB CHR bank at PPU $1400-$17FF (or $0400-$07FF);
                //||         4: Select 1 KB CHR bank at PPU $1800-$1BFF (or $0800-$0BFF);
                //||         5: Select 1 KB CHR bank at PPU $1C00-$1FFF (or $0C00-$0FFF);
                //||         6: Select 8 KB PRG bank at $8000-$9FFF (or $C000-$DFFF);
                //||         7: Select 8 KB PRG bank at $A000-$BFFF

                //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
                //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)
                //+--------- CHR ROM bank configuration (0: two 2 KB banks at $0000-$0FFF, four 1 KB banks at $1000-$1FFF;
                //                                       1: four 1 KB banks at $0000-$0FFF, two 2 KB banks at $1000-$1FFF)
                switch (address & 57345) {
                    case 32768: 
                        this._mmc3Command = val & 7;
                        if ((val & 128) === 128) {
                            this.ppuBankSwap = true;
                            this._mmc3ChrAddr = 4096;
                        } else {
                            this.ppuBankSwap = false;
                            this._mmc3ChrAddr = 0;
                        }
                        if ((val & 64) === 64) {
                            this.prgSwap = 1;
                        } else {
                            this.prgSwap = 0;
                        }
                        this.SwapPrgRomBanks();
                        break;
                    case 32769: 
                        switch (this._mmc3Command) {
                            case 0: 
                                this.chr2kBank0 = val;
                                this.SwapChrBanks();
                                // CopyBanks(0, val, 1);
                                // CopyBanks(1, val + 1, 1);
                                break;
                            case 1: 
                                this.chr2kBank1 = val;
                                this.SwapChrBanks();
                                // CopyBanks(2, val, 1);
                                // CopyBanks(3, val + 1, 1);
                                break;
                            case 2: 
                                this.chr1kBank0 = val;
                                this.SwapChrBanks();
                                //CopyBanks(4, val, 1);
                                break;
                            case 3: 
                                this.chr1kBank1 = val;
                                this.SwapChrBanks();
                                //CopyBanks(5, val, 1);
                                break;
                            case 4: 
                                this.chr1kBank2 = val;
                                this.SwapChrBanks();
                                //CopyBanks(6, val, 1);
                                break;
                            case 5: 
                                this.chr1kBank3 = val;
                                this.SwapChrBanks();
                                //CopyBanks(7, val, 1);
                                break;
                            case 6: 
                                this.prgSwitch1 = val;
                                this.SwapPrgRomBanks();
                                break;
                            case 7: 
                                this.prgSwitch2 = val;
                                this.SwapPrgRomBanks();
                                break;
                        }
                        break;
                    case 40960: 
                        if ((val & 1) === 1) {
                            this.Mirror(clock, 2);
                        } else {
                            this.Mirror(clock, 1);
                        }
                        break;
                    case 40961: 
                        //PRG RAM protect ($A001-$BFFF, odd)
                        //7  bit  0
                        //---- ----
                        //RWxx xxxx
                        //||
                        //|+-------- Write protection (0: allow writes; 1: deny writes)
                        //+--------- Chip enable (0: disable chip; 1: enable chip)
                        this.SRAMCanWrite = ((val & 64) === 0);
                        this.SRAMEnabled = ((val & 128) === 128);
                        break;
                    case 49152: 
                        this._mmc3IrqVal = val;
                        if (val === 0) {
                            // special treatment for one-time irq handling
                            this.scanlineCounter = 0;
                        }
                        break;
                    case 49153: 
                        this._mmc3TmpVal = this._mmc3IrqVal;
                        break;
                    case 57344: 
                        this._mmc3IrcOn = false;
                        this._mmc3IrqVal = this._mmc3TmpVal;
                        this.irqRaised = false;
                        if (!Bridge.staticEquals(this.updateIRQ, null)) {
                            this.updateIRQ();
                        }
                        break;
                    case 57345: 
                        this._mmc3IrcOn = true;
                        break;
                }
            },
            SwapChrBanks: function () {
                if (this.ppuBankSwap) {
                    this.CopyBanks(0, this.chr1kBank0, 1);
                    this.CopyBanks(1, this.chr1kBank1, 1);
                    this.CopyBanks(2, this.chr1kBank2, 1);
                    this.CopyBanks(3, this.chr1kBank3, 1);
                    this.CopyBanks(4, this.chr2kBank0, 2);
                    this.CopyBanks(6, this.chr2kBank1, 2);
                } else {
                    this.CopyBanks(4, this.chr1kBank0, 1);
                    this.CopyBanks(5, this.chr1kBank1, 1);
                    this.CopyBanks(6, this.chr1kBank2, 1);
                    this.CopyBanks(7, this.chr1kBank3, 1);
                    this.CopyBanks(0, this.chr2kBank0, 2);
                    this.CopyBanks(2, this.chr2kBank1, 2);
                }
            },
            SwapPrgRomBanks: function () {
                //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
                //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)

                if (this.prgSwap === 1) {

                    this.SetupBankStarts(((Bridge.Int.mul(this.PrgRomCount, 2) - 2) | 0), this.prgSwitch2, this.prgSwitch1, ((Bridge.Int.mul(this.PrgRomCount, 2) - 1) | 0));
                } else {
                    this.SetupBankStarts(this.prgSwitch1, this.prgSwitch2, ((Bridge.Int.mul(this.PrgRomCount, 2) - 2) | 0), ((Bridge.Int.mul(this.PrgRomCount, 2) - 1) | 0));
                }

            },
            UpdateScanlineCounter: function () {
                //if (scanlineCounter == -1) return;

                if (this.scanlineCounter === 0) {
                    this.scanlineCounter = this._mmc3IrqVal;
                    //Writing $00 to $C000 will result in a single IRQ being generated on the next rising edge of PPU A12. 
                    //No more IRQs will be generated until $C000 is changed to a non-zero value, upon which the 
                    // counter will start counting from the new value, generating an IRQ once it reaches zero. 
                    if (this._mmc3IrqVal === 0) {
                        if (this._mmc3IrcOn) {
                            this.irqRaised = true;
                            this.updateIRQ();
                        }
                        this.scanlineCounter = -1;
                        return;
                    }
                }

                if (this._mmc3TmpVal !== 0) {
                    this.scanlineCounter = this._mmc3TmpVal;
                    this._mmc3TmpVal = 0;
                } else {
                    this.scanlineCounter = (((this.scanlineCounter - 1) | 0)) & 255;
                }

                if (this.scanlineCounter === 0) {
                    if (this._mmc3IrcOn) {
                        this.irqRaised = true;
                        if (!Bridge.staticEquals(this.updateIRQ, null)) {
                            this.updateIRQ();
                        }
                    }
                    if (this._mmc3IrqVal > 0) {
                        this.scanlineCounter = this._mmc3IrqVal;
                    }
                }

            }
        }
    });
});
