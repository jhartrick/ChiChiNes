// utility classes
var ChiChiCPPU_AddressingModes;
(function (ChiChiCPPU_AddressingModes) {
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["Bullshit"] = 0] = "Bullshit";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["Implicit"] = 1] = "Implicit";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["Accumulator"] = 2] = "Accumulator";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["Immediate"] = 3] = "Immediate";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["ZeroPage"] = 4] = "ZeroPage";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["ZeroPageX"] = 5] = "ZeroPageX";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["ZeroPageY"] = 6] = "ZeroPageY";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["Relative"] = 7] = "Relative";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["Absolute"] = 8] = "Absolute";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["AbsoluteX"] = 9] = "AbsoluteX";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["AbsoluteY"] = 10] = "AbsoluteY";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["Indirect"] = 11] = "Indirect";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["IndexedIndirect"] = 12] = "IndexedIndirect";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["IndirectIndexed"] = 13] = "IndirectIndexed";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["IndirectZeroPage"] = 14] = "IndirectZeroPage";
    ChiChiCPPU_AddressingModes[ChiChiCPPU_AddressingModes["IndirectAbsoluteX"] = 15] = "IndirectAbsoluteX";
})(ChiChiCPPU_AddressingModes || (ChiChiCPPU_AddressingModes = {}));
var ChiChiInstruction = /** @class */ (function () {
    function ChiChiInstruction() {
    }
    return ChiChiInstruction;
}());
var ChiChiSprite = /** @class */ (function () {
    function ChiChiSprite() {
        this.YPosition = 0;
        this.XPosition = 0;
        this.SpriteNumber = 0;
        this.Foreground = false;
        this.IsVisible = false;
        this.TileIndex = 0;
        this.AttributeByte = 0;
        this.FlipX = false;
        this.FlipY = false;
        this.Changed = false;
    }
    return ChiChiSprite;
}());
//input classes
var ChiChiInputHandler = /** @class */ (function () {
    function ChiChiInputHandler() {
        this.ControlPad = new ChiChiControlPad();
    }
    ChiChiInputHandler.prototype.controlPad_NextControlByteSet = function (sender, e) {
        // throw new Error("Method not implemented.");
    };
    ChiChiInputHandler.prototype.GetByte = function (clock, address) {
        return this.ControlPad.getByte(clock);
    };
    ChiChiInputHandler.prototype.SetByte = function (clock, address, data) {
        return this.ControlPad.setByte(clock, data);
    };
    ChiChiInputHandler.prototype.SetNextControlByte = function (data) {
    };
    ChiChiInputHandler.prototype.HandleEvent = function (Clock) {
    };
    ChiChiInputHandler.prototype.ResetClock = function (Clock) {
    };
    return ChiChiInputHandler;
}());
var ChiChiControlPad = /** @class */ (function () {
    function ChiChiControlPad() {
        this.currentByte = 0;
        this.readNumber = 0;
        this.padOneState = 0;
        this.CurrentByte = 0;
    }
    ChiChiControlPad.prototype.refresh = function () {
    };
    ChiChiControlPad.prototype.getByte = function (clock) {
        var result = (this.currentByte >> this.readNumber) & 0x01;
        this.readNumber = (this.readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    };
    ChiChiControlPad.prototype.setByte = function (clock, data) {
        if ((data & 1) == 1) {
            this.currentByte = this.padOneState;
            // if im pushing up, i cant be pushing down
            if ((this.currentByte & 16) == 16)
                this.currentByte = this.currentByte & ~32;
            // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
            if ((this.currentByte & 64) == 64)
                this.currentByte = this.currentByte & ~128;
            this.readNumber = 0;
        }
    };
    return ChiChiControlPad;
}());
var blip_buffer_t = /** @class */ (function () {
    function blip_buffer_t(size) {
        this.size = size;
        this.factor = 0;
        this.offset = 0;
        this.avail = 0;
        this.integrator = 0;
        this.time_bits = 0;
        this.arrayLength = 0;
        this.samples = new Array(size);
    }
    return blip_buffer_t;
}());
var Blip = /** @class */ (function () {
    // functions
    function Blip(size) {
        this.bass_shift = 8;
        this.end_frame_extra = 2;
        this.half_width = 8;
        this.phase_bits = 5;
        this.blip_new(size);
    }
    Blip.prototype.blip_new = function (size) {
        this.BlipBuffer = new blip_buffer_t(size);
        this.BlipBuffer.size = size;
        this.BlipBuffer.factor = 0;
        this.blip_clear();
    };
    Blip.prototype.blip_set_rates = function (clock_rate, sample_rate) {
        this.BlipBuffer.factor = Blip.time_unit / clock_rate * sample_rate + (0.9999847412109375);
    };
    Blip.prototype.blip_clear = function () {
        this.BlipBuffer.offset = 0;
        this.BlipBuffer.avail = 0;
        this.BlipBuffer.integrator = 0;
        this.BlipBuffer.samples = new Array(this.BlipBuffer.size + Blip.buf_extra);
    };
    Blip.prototype.blip_clocks_needed = function (samples) {
        var needed = samples * Blip.time_unit - this.BlipBuffer.offset;
        /* Fails if buffer can't hold that many more samples */
        //assert( s->avail + samples <= s->size );
        return ((needed + this.BlipBuffer.factor - 1) / this.BlipBuffer.factor) | 0;
    };
    Blip.prototype.blip_end_frame = function (t) {
        var off = t * this.BlipBuffer.factor + this.BlipBuffer.offset;
        this.BlipBuffer.avail += off >> Blip.time_bits;
        this.BlipBuffer.offset = off & (Blip.time_unit - 1);
    };
    Blip.prototype.remove_samples = function (count) {
        var remain = this.BlipBuffer.avail + Blip.buf_extra - count;
        this.BlipBuffer.avail -= count;
        this.BlipBuffer.samples.copyWithin(count, 0, remain);
        // for (let i = 0; i < remain; i++) {
        //     this.BlipBuffer.samples[count + i] = this.BlipBuffer.samples[i];
        // }
        this.BlipBuffer.samples.fill(0, 0, count);
        // for (let i = 0;i < count; ++i) {
        //     this.BlipBuffer.samples[i] = 0;
        // } 
        //        this.BlipBuffer.samples = this
        //        System.Array.copy(this._blipBuffer.samples, count, this._blipBuffer.samples, 0, remain);
        //        System.Array.fill(this._blipBuffer.samples, 0, remain, count);
        this.BlipBuffer.arrayLength = count;
    };
    Blip.prototype.ReadBytes = function (outbuf, count, stereo) {
        var $t;
        if (count > this.BlipBuffer.avail) {
            count = this.BlipBuffer.avail;
        }
        if (count !== 0) {
            var step = 1;
            //int inPtr  = BLIP_SAMPLES( s );
            //buf_t const* end = in + count;
            var inPtr = 0, outPtr = 0;
            var endPtr = inPtr + count;
            var sum = this.BlipBuffer.integrator;
            do {
                var st = sum >> Blip.delta_bits; /* assumes right shift preserves sign */
                sum = sum + this.BlipBuffer.samples[inPtr];
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
            this.BlipBuffer.integrator = sum;
            this.remove_samples(count);
        }
        return count;
    };
    Blip.prototype.blip_add_delta = function (time, delta) {
        var $t, $t1;
        if (delta === 0) {
            return;
        }
        var fixedTime = (time * this.BlipBuffer.factor + this.BlipBuffer.offset) | 0;
        var outPtr = (this.BlipBuffer.avail + (fixedTime >> Blip.time_bits));
        var phase_shift = 16;
        //const phase = System.Int64.clip32(fixedTime.shr(phase_shift).and(System.Int64((ChiChiNES.BeepsBoops.Blip.phase_count - 1))));
        var phase = (fixedTime >> phase_shift & (Blip.phase_count - 1)) | 0;
        var inStep = phase; // bl_step[phase];
        var rev = Blip.phase_count - phase; // bl_step[phase_count - phase];
        var interp_bits = 15;
        var interp = (fixedTime >> (phase_shift - interp_bits) & ((1 << interp_bits) - 1));
        var delta2 = (delta * interp) >> interp_bits;
        delta -= delta2;
        /* Fails if buffer size was exceeded */
        //assert( out <= &BLIP_SAMPLES( s ) [s->size] );
        for (var i = 0; i < 8; ++i) {
            this.BlipBuffer.samples[outPtr + i] += Blip.bl_step[inStep][i] * delta + Blip.bl_step[inStep][i] * delta2;
            this.BlipBuffer.samples[outPtr + (15 - i)] += Blip.bl_step[rev][i] * delta + Blip.bl_step[rev - 1][i] * delta2;
        }
    };
    Blip.prototype.blip_add_delta_fast = function (time, delta) {
        var fixedTime = time * this.BlipBuffer.factor + this.BlipBuffer.offset;
        var outPtr = this.BlipBuffer.avail + (fixedTime >> Blip.time_bits);
        var delta_unit = 1 << Blip.delta_bits;
        var phase_shift = Blip.time_bits - Blip.delta_bits;
        var phase = fixedTime >> phase_shift & (delta_unit - 1);
        var delta2 = delta * phase;
        /* Fails if buffer size was exceeded */
        //assert( out <= &BLIP_SAMPLES( s ) [s->size] );
        this.BlipBuffer.samples[outPtr + 8] += delta * delta_unit - delta2;
        this.BlipBuffer.samples[outPtr + 9] += delta2;
        //out [8] += delta * delta_unit - delta2;
        //out [9] += delta2;
    };
    Blip.time_unit = 2097152;
    Blip.buf_extra = 18;
    Blip.phase_count = 32;
    Blip.time_bits = 21;
    Blip.delta_bits = 15;
    //sinc values
    Blip.bl_step = [[43, -115,
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
    return Blip;
}());
//apu classes
var TriangleChannel = /** @class */ (function () {
    function TriangleChannel(bleeper, chan) {
        this._bleeper = null;
        this._chan = 0;
        this.LengthCounts = new Uint8Array([10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30]);
        this._length = 0;
        this._period = 0;
        this._time = 0;
        this._envelope = 0;
        this._looping = false;
        this._enabled = false;
        this._amplitude = 0;
        this._gain = 0;
        this._linCtr = 0;
        this._phase = 0;
        this._linVal = 0;
        this._linStart = false;
        this._bleeper = bleeper;
        this._chan = chan;
        this._enabled = true;
    }
    Object.defineProperty(TriangleChannel.prototype, "Period", {
        get: function () {
            return this._period;
        },
        set: function (value) {
            this._period = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleChannel.prototype, "Time", {
        get: function () {
            return this._time;
        },
        set: function (value) {
            this._time = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleChannel.prototype, "Envelope", {
        get: function () {
            return this._envelope;
        },
        set: function (value) {
            this._envelope = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleChannel.prototype, "Looping", {
        get: function () {
            return this._looping;
        },
        set: function (value) {
            this._looping = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleChannel.prototype, "Enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleChannel.prototype, "Gain", {
        get: function () {
            return this._gain;
        },
        set: function (value) {
            this._gain = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleChannel.prototype, "Amplitude", {
        get: function () {
            return this._amplitude;
        },
        set: function (value) {
            this._amplitude = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleChannel.prototype, "Length", {
        get: function () {
            return this._length;
        },
        set: function (value) {
            this._length = value;
        },
        enumerable: true,
        configurable: true
    });
    TriangleChannel.prototype.WriteRegister = function (register, data, time) {
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
    };
    TriangleChannel.prototype.Run = function (end_time) {
        var period = this._period + 1;
        if (this._linCtr === 0 || this._length === 0 || this._period < 4) {
            // leave it at it's current phase
            this._time = end_time;
            return;
        }
        for (; this._time < end_time; this._time += period, this._phase = (this._phase + 1) % 32) {
            this.UpdateAmplitude(this._phase < 16 ? this._phase : 31 - this._phase);
        }
    };
    TriangleChannel.prototype.UpdateAmplitude = function (new_amp) {
        var delta = new_amp * this._gain - this._amplitude;
        this._amplitude += delta;
        this._bleeper.blip_add_delta(this._time, delta);
    };
    TriangleChannel.prototype.EndFrame = function (time) {
        this.Run(time);
        this._time = 0;
    };
    TriangleChannel.prototype.FrameClock = function (time, step) {
        this.Run(time);
        if (this._linStart) {
            this._linCtr = this._linVal;
        }
        else {
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
    };
    return TriangleChannel;
}());
var SquareChannel = /** @class */ (function () {
    function SquareChannel(bleeper, chan) {
        this._chan = 0;
        this._bleeper = null;
        this.LengthCounts = new Uint8Array([10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30]);
        this._dutyCycle = 0;
        this._length = 0;
        this._timer = 0;
        this._rawTimer = 0;
        this._volume = 0;
        this._time = 0;
        this._envelope = 0;
        this._looping = false;
        this._enabled = false;
        this._amplitude = 0;
        this.doodies = [2, 6, 30, 249];
        this._sweepShift = 0;
        this._sweepCounter = 0;
        this._sweepDivider = 0;
        this._sweepNegateFlag = false;
        this._sweepEnabled = false;
        this._startSweep = false;
        this._sweepInvalid = false;
        this._phase = 0;
        this._gain = 0;
        this._envTimer = 0;
        this._envStart = false;
        this._envConstantVolume = false;
        this._envVolume = 0;
        this._sweepComplement = false;
        this._bleeper = bleeper;
        this._chan = chan;
        this._enabled = true;
        this._sweepDivider = 1;
        this._envTimer = 15;
    }
    Object.defineProperty(SquareChannel.prototype, "DutyCycle", {
        // properties
        get: function () {
            return this._dutyCycle;
        },
        set: function (value) {
            this._dutyCycle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "Period", {
        get: function () {
            return this._timer;
        },
        set: function (value) {
            this._timer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "Volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "Time", {
        get: function () {
            return this._time;
        },
        set: function (value) {
            this._time = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "Envelope", {
        get: function () {
            return this._envelope;
        },
        set: function (value) {
            this._envelope = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "Looping", {
        get: function () {
            return this._looping;
        },
        set: function (value) {
            this._looping = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "Enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "Gain", {
        get: function () {
            return this._gain;
        },
        set: function (value) {
            this._gain = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SquareChannel.prototype, "SweepComplement", {
        get: function () {
            return this._sweepComplement;
        },
        set: function (value) {
            this._sweepComplement = value;
        },
        enumerable: true,
        configurable: true
    });
    // functions
    SquareChannel.prototype.WriteRegister = function (register, data, time) {
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
    };
    SquareChannel.prototype.Run = function (end_time) {
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
    };
    SquareChannel.prototype.UpdateAmplitude = function (new_amp) {
        var delta = new_amp * this._gain - this._amplitude;
        this._amplitude += delta;
        this._bleeper.blip_add_delta(this._time, delta);
    };
    SquareChannel.prototype.EndFrame = function (time) {
        this.Run(time);
        this._time = 0;
    };
    SquareChannel.prototype.FrameClock = function (time, step) {
        this.Run(time);
        if (!this._envStart) {
            this._envTimer--;
            if (this._envTimer === 0) {
                this._envTimer = this._volume + 1;
                if (this._envVolume > 0) {
                    this._envVolume--;
                }
                else {
                    this._envVolume = this._looping ? 15 : 0;
                }
            }
        }
        else {
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
                        }
                        else {
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
    };
    return SquareChannel;
}());
var ChiChiBopper = /** @class */ (function () {
    function ChiChiBopper(writer) {
        this.writer = writer;
        //private writer: ChiChiNES.BeepsBoops.WavSharer;
        this.throwingIRQs = false;
        this.reg15 = 0;
        this.master_vol = 4369;
        this.registers = new ChiChiNES.PortQueueing.QueuedPort();
        this._sampleRate = 44100;
        this.square0Gain = 873;
        this.square1Gain = 873;
        this.triangleGain = 1004;
        this.noiseGain = 567;
        this.muted = false;
        this.lastFrameHit = 0;
    }
    Object.defineProperty(ChiChiBopper.prototype, "SampleRate", {
        get: function () {
            return this._sampleRate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiBopper.prototype, "sampleRate", {
        set: function (value) {
            this._sampleRate = value;
            this.RebuildSound();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiBopper.prototype, "EnableSquare0", {
        get: function () {
            return this.square0.Gain > 0;
        },
        set: function (value) {
            this.square0.Gain = value ? this.square0Gain : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiBopper.prototype, "EnableSquare1", {
        get: function () {
            return this.square1.Gain > 0;
        },
        set: function (value) {
            this.square1.Gain = value ? this.square1Gain : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiBopper.prototype, "EnableTriangle", {
        get: function () {
            return this.triangle.Gain > 0;
        },
        set: function (value) {
            this.triangle.Gain = value ? this.triangleGain : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiBopper.prototype, "EnableNoise", {
        get: function () {
            return this.noise.Gain > 0;
        },
        set: function (value) {
            this.noise.Gain = value ? this.noiseGain : 0;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiBopper.prototype.RebuildSound = function () {
        var $t;
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
        this.triangle.Gain = this.triangleGain;
        this.triangle.Period = 0;
        this.noise = ($t = new ChiChiNES.BeepsBoops.NoiseChannel(this.myBlipper, 3), $t.Gain = this.noiseGain, $t.Period = 0, $t);
        this.dmc = ($t = new ChiChiNES.BeepsBoops.DMCChannel(this.myBlipper, 4), $t.Gain = 873, $t.Period = 10, $t);
    };
    ChiChiBopper.prototype.GetByte = function (Clock, address) {
        if (address === 16384) {
            this.InterruptRaised = false;
        }
        if (address === 16405) {
            return this.ReadStatus();
        }
        else {
            return 66;
        }
    };
    ChiChiBopper.prototype.ReadStatus = function () {
        return ((this.square0.Length > 0) ? 1 : 0) | ((this.square1.Length > 0) ? 2 : 0) | ((this.triangle.Length > 0) ? 4 : 0) | ((this.square0.Length > 0) ? 8 : 0) | (this.InterruptRaised ? 64 : 0);
    };
    ChiChiBopper.prototype.SetByte = function (Clock, address, data) {
        if (address === 16384) {
            this.InterruptRaised = false;
        }
        this.DoSetByte(Clock, address, data);
        this.registers.enqueue(new ChiChiNES.PortQueueing.PortWriteEntry(Clock, address, data));
    };
    ChiChiBopper.prototype.DoSetByte = function (Clock, address, data) {
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
    };
    ChiChiBopper.prototype.UpdateFrame = function (time) {
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
        }
        else {
            this.lastFrameHit++;
        }
    };
    ChiChiBopper.prototype.RunFrameEvents = function (time, step) {
        this.triangle.FrameClock(time, step);
        this.noise.FrameClock(time, step);
        this.square0.FrameClock(time, step);
        this.square1.FrameClock(time, step);
    };
    ChiChiBopper.prototype.EndFrame = function (time) {
        this.square0.EndFrame(time);
        this.square1.EndFrame(time);
        this.triangle.EndFrame(time);
        this.noise.EndFrame(time);
        if (!this.muted) {
            this.myBlipper.blip_end_frame(time);
        }
        var count = this.myBlipper.ReadBytes(this.writer.SharedBuffer, this.writer.SharedBuffer.length / 2, 0);
        this.writer.WavesWritten(count);
    };
    ChiChiBopper.prototype.FlushFrame = function (time) {
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
    };
    ChiChiBopper.prototype.HandleEvent = function (Clock) {
        this.UpdateFrame(Clock);
        this.lastClock = Clock;
        if (Clock > 29780) {
            this.writer;
            {
                this.EndFrame(Clock);
            }
        }
    };
    ChiChiBopper.prototype.ResetClock = function (Clock) {
        this.lastClock = Clock;
    };
    ChiChiBopper.clock_rate = 1789772.727;
    return ChiChiBopper;
}());
//machine wrapper
var ChiChiMachine = /** @class */ (function () {
    function ChiChiMachine() {
        var _this = this;
        this.frameJustEnded = true;
        this.frameOn = false;
        this.totalCPUClocks = 0;
        this._enableSound = false;
        var wavSharer = new ChiChiNES.BeepsBoops.WavSharer();
        this.SoundBopper = new ChiChiBopper(wavSharer);
        this.WaveForms = wavSharer;
        this.Cpu = new ChiChiCPPU(this.SoundBopper);
        this.Cpu.frameFinished = function () { _this.FrameFinished(); };
        this.Initialize();
    }
    ChiChiMachine.prototype.Drawscreen = function () {
    };
    Object.defineProperty(ChiChiMachine.prototype, "Cart", {
        get: function () {
            return this.Cpu.Cart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiMachine.prototype, "EnableSound", {
        get: function () {
            return this._enableSound;
        },
        set: function (value) {
            this.SoundBopper.Muted = !value;
            this._enableSound = value;
            if (this._enableSound) {
                this.SoundBopper.RebuildSound();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiMachine.prototype, "PadOne", {
        get: function () {
            return this.Cpu.PadOne.ControlPad;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiMachine.prototype, "PadTwo", {
        get: function () {
            return this.Cpu.PadTwo.ControlPad;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiMachine.prototype.Initialize = function () {
    };
    ChiChiMachine.prototype.Reset = function () {
        if (this.Cpu != null && this.Cart != null) {
            // ForceStop();
            this.SoundBopper.RebuildSound();
            this.Cpu.PPU_Initialize();
            this.Cart.ChiChiNES$INESCart$InitializeCart();
            this.Cpu.ResetCPU();
            //ClearGenieCodes();
            this.Cpu.PowerOn();
            this.RunState = ChiChiNES.Machine.ControlPanel.RunningStatuses.Running;
        }
    };
    ChiChiMachine.prototype.PowerOn = function () {
        if (this.Cpu != null && this.Cart != null) {
            this.SoundBopper.RebuildSound();
            this.Cpu.PPU_Initialize();
            this.Cart.ChiChiNES$INESCart$InitializeCart();
            // if (this.SRAMReader !=  null && this.Cart.UsesSRAM) {
            //     this.Cart.SRAM = this.SRAMReader(this.Cart.ChiChiNES$INESCart$CheckSum);
            // }
            this.Cpu.ResetCPU();
            //ClearGenieCodes();
            this.Cpu.PowerOn();
            this.RunState = ChiChiNES.Machine.ControlPanel.RunningStatuses.Running;
        }
    };
    ChiChiMachine.prototype.PowerOff = function () {
        this.EjectCart();
        this.RunState = ChiChiNES.Machine.ControlPanel.RunningStatuses.Unloaded;
    };
    ChiChiMachine.prototype.Step = function () {
        if (this.frameJustEnded) {
            this.Cpu.FindNextEvent();
            this.frameOn = true;
            this.frameJustEnded = false;
        }
        this.Cpu.Step();
        if (!this.frameOn) {
            this.totalCPUClocks = this.Cpu.Clock;
            this.totalCPUClocks = 0;
            this.Cpu.Clock = 0;
            this.Cpu.LastcpuClock = 0;
            this.frameJustEnded = true;
        }
        //_cpu.Clock = _totalCPUClocks;
        //breakpoints: HandleBreaks();        
    };
    ChiChiMachine.prototype.RunFrame = function () {
        this.frameOn = true;
        this.frameJustEnded = false;
        //_cpu.RunFrame();
        this.Cpu.FindNextEvent();
        do {
            this.Cpu.Step();
        } while (this.frameOn);
        this.totalCPUClocks = this.Cpu.Clock;
        this.SoundBopper.FlushFrame(this.totalCPUClocks);
        this.SoundBopper.EndFrame(this.totalCPUClocks);
        this.totalCPUClocks = 0;
        this.Cpu.Clock = 0;
        this.Cpu.LastcpuClock = 0;
    };
    ChiChiMachine.prototype.EjectCart = function () {
        this.Cpu.Cart = null;
        this.Cpu.ChrRomHandler = null;
    };
    ChiChiMachine.prototype.LoadCart = function (rom) {
        this.EjectCart();
        var cart = ChiChiNES.ROMLoader.iNESFileHandler.LoadROM(this.Cpu, rom);
        if (cart != null) {
            this.Cpu.Cart = cart; // Bridge.cast(this.Cart, ChiChiNES.IClockedMemoryMappedIOElement);
            this.Cpu.Cart.NMIHandler = this.Cpu.InterruptRequest;
            this.Cpu.ChrRomHandler = this.Cart;
        }
        else {
            throw new ChiChiNES.ROMLoader.CartLoadException.ctor("Unsupported ROM type - load failed.");
        }
    };
    ChiChiMachine.prototype.HasState = function (index) {
        throw new Error("Method not implemented.");
    };
    ChiChiMachine.prototype.GetState = function (index) {
        throw new Error("Method not implemented.");
    };
    ChiChiMachine.prototype.SetState = function (index) {
        throw new Error("Method not implemented.");
    };
    ChiChiMachine.prototype.SetupSound = function () {
        throw new Error("Method not implemented.");
    };
    ChiChiMachine.prototype.FrameFinished = function () {
        this.frameJustEnded = true;
        this.frameOn = false;
        this.Drawscreen();
    };
    ChiChiMachine.prototype.dispose = function () {
    };
    return ChiChiMachine;
}());
//chichipig
var ChiChiCPPU = /** @class */ (function () {
    function ChiChiCPPU(bopper) {
        this.SRMasks_CarryMask = 0x01;
        this.SRMasks_ZeroResultMask = 0x02;
        this.SRMasks_InterruptDisableMask = 0x04;
        this.SRMasks_DecimalModeMask = 0x08;
        this.SRMasks_BreakCommandMask = 0x10;
        this.SRMasks_ExpansionMask = 0x20;
        this.SRMasks_OverflowMask = 0x40;
        this.SRMasks_NegativeResultMask = 0x80;
        this.vbufLocation = 0;
        this.yPosition = 0;
        this.xPosition = 0;
        this.currentAttributeByte = 0;
        this.spriteSize = 0;
        this.spritesOnThisScanline = 0;
        this.spriteZeroHit = false;
        this.isForegroundPixel = false;
        this._spriteCopyHasHappened = false;
        this.LastcpuClock = 0;
        this.spriteChanges = false;
        this.ppuReadBuffer = 0;
        this._clipSprites = false;
        this._clipTiles = false;
        this._tilesAreVisible = false;
        this._spritesAreVisible = false;
        this.nameTableMemoryStart = 0;
        this._reset = false;
        //timing
        this.clock = 0;
        this._ticks = 0;
        // CPU Status
        this._statusRegister = 0;
        this._programCounter = 0;
        this._handleNMI = false;
        this._handleIRQ = false;
        this._addressBus = 0;
        this._dataBus = 0;
        this._operationCounter = 0;
        this._accumulator = 0;
        this._indexRegisterX = 0;
        this._indexRegisterY = 0;
        // Current Instruction
        this._currentInstruction_AddressingMode = ChiChiCPPU_AddressingModes.Bullshit;
        this._currentInstruction_Address = 0;
        this._currentInstruction_OpCode = 0;
        this._currentInstruction_Parameters0 = 0;
        this._currentInstruction_Parameters1 = 0;
        this._currentInstruction_ExtraTiming = 0;
        this.systemClock = 0;
        this.nextEvent = -1;
        // CPU Op info
        this.clockcount = new Uint8Array(256); // System.Array.init(256, 0, System.Int32);
        this._cheating = false;
        this.__frameFinished = true;
        // system ram
        this.Rams = new Uint8Array(8192); // System.Array.init(vv, 0, System.Int32);
        this._stackPointer = 255;
        // debug helpers
        this.instructionUsage = new Uint32Array(256); //System.Array.init(256, 0, System.Int32);
        this._debugging = false;
        this.instructionHistoryPointer = 255;
        this._instructionHistory = new Array(256); //System.Array.init(256, null, ChiChiInstruction);
        // 'internal
        this.currentXPosition = 0;
        this.currentYPosition = 0;
        this._hScroll = 0;
        this._vScroll = 0;
        this.lockedHScroll = 0;
        this.lockedVScroll = 0;
        this.scanlineNum = 0;
        this.scanlinePos = 0;
        this.NMIHasBeenThrownThisFrame = false;
        this.shouldRender = false;
        this._frames = 0;
        this.hitSprite = false;
        this.PPUAddressLatchIsHigh = false;
        this.p32 = new Uint32Array(256); // System.Array.init(256, 0, System.Int32);
        this.isRendering = true;
        this.frameClock = 0;
        this.FrameEnded = false;
        this.frameOn = false;
        //private framePalette = System.Array.init(256, 0, System.Int32);
        this.nameTableBits = 0;
        this.vidRamIsRam = true;
        this._palette = new Uint8Array(32); // System.Array.init(32, 0, System.Int32);
        this._openBus = 0;
        this.sprite0scanline = 0;
        this.sprite0x = 0;
        this._maxSpritesPerScanline = 64;
        this.spriteRAM = new Uint8Array(256); // System.Array.init(256, 0, System.Int32);
        this.spritesOnLine = new Array(512); // System.Array.init(512, 0, System.Int32);
        this.patternEntry = 0;
        this.patternEntryByte2 = 0;
        this.currentTileIndex = 0;
        this.xNTXor = 0;
        this.yNTXor = 0;
        this.fetchTile = true;
        this.outBuffer = new Uint8Array(65536);
        this.drawInfo = new Uint8Array(65536);
        this.byteOutBuffer = new Uint8Array(256 * 256 * 4); // System.Array.init(262144, 0, System.Int32);
        //this.$initialize();
        // BuildOpArray();
        this.SoundBopper = bopper;
        bopper.NMIHandler = this.IRQUpdater;
        // init PPU
        this.PPU_InitSprites();
        this._padOne = new ChiChiInputHandler();
        this._padTwo = new ChiChiInputHandler();
        //this.vBuffer = System.Array.init(61440, 0, System.Byte);
        //ChiChiNES.CPU2A03.GetPalRGBA();
    }
    Object.defineProperty(ChiChiCPPU.prototype, "Debugging", {
        get: function () {
            return this._debugging;
        },
        set: function (value) {
            this._debugging = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "InstructionHistory", {
        get: function () {
            return this._instructionHistory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "InstructionHistoryPointer", {
        get: function () {
            return this.instructionHistoryPointer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "PadOne", {
        get: function () {
            return this._padOne;
        },
        set: function (value) {
            this._padOne = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "PadTwo", {
        get: function () {
            return this._padTwo;
        },
        set: function (value) {
            this._padTwo = value;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiCPPU.prototype.addDebugEvent = function (value) {
        //throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.removeDebugEvent = function (value) {
        // throw new Error('Method not implemented.');
    };
    Object.defineProperty(ChiChiCPPU.prototype, "PPU_NameTableMemoryStart", {
        get: function () {
            return this.nameTableMemoryStart;
        },
        set: function (value) {
            this.nameTableMemoryStart = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "Clock", {
        get: function () { return this.clock; },
        set: function (value) {
            this.clock = value;
            if (value === 0) {
                this.systemClock = (this.systemClock + this.clock) & 0xFFFFFFFFFF;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "ChrRomHandler", {
        get: function () {
            return this.chrRomHandler;
        },
        set: function (value) {
            this.chrRomHandler = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "PPU_NextEventAt", {
        get: function () {
            if (this.frameClock < 6820) {
                return (6820 - this.frameClock) / 3;
            }
            else {
                return (((89345 - this.frameClock) / 341) / 3);
            }
            //}
            //else
            //{
            //    return (6823 - frameClock) / 3;
            //}
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiCPPU.prototype, "PPU_FrameFinishHandler", {
        get: function () {
            return this.frameFinished;
        },
        set: function (value) {
            this.frameFinished = value;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiCPPU.prototype.SetFlag = function (Flag, value) {
        this._statusRegister = (value ? (this._statusRegister | Flag) : (this._statusRegister & ~Flag));
        this._statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    };
    ChiChiCPPU.prototype.GetFlag = function (flag) {
        return ((this._statusRegister & flag) === flag);
    };
    ChiChiCPPU.prototype.InterruptRequest = function () {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        if (this.GetFlag(this.SRMasks_InterruptDisableMask)) {
            return;
        }
        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
        var newStatusReg = this._statusRegister & -17 | 32;
        // if enabled
        // push pc onto stack (high byte first)
        this.PushStack(this._programCounter >> 8);
        this.PushStack(this._programCounter);
        // push sr onto stack
        this.PushStack(this._statusRegister);
        // point pc to interrupt service routine
        this._programCounter = this.GetByte(65534) + (this.GetByte(65535) << 8);
        // nonOpCodeticks = 7;
    };
    ChiChiCPPU.prototype.NonMaskableInterrupt = function () {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        var newStatusReg = this._statusRegister & -17 | 32;
        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.PushStack(this._programCounter >> 8);
        this.PushStack(this._programCounter & 255);
        //c7ab
        // push sr onto stack
        this.PushStack(newStatusReg);
        // point pc to interrupt service routine
        var lowByte = this.GetByte(65530);
        var highByte = this.GetByte(65531);
        var jumpTo = lowByte | (highByte << 8);
        this._programCounter = jumpTo;
    };
    ChiChiCPPU.prototype.CheckEvent = function () {
        if (this.nextEvent === -1) {
            this.FindNextEvent();
        }
    };
    ChiChiCPPU.prototype.RunFast = function () {
        while (this.clock < 29780) {
            this.Step();
        }
    };
    ChiChiCPPU.prototype.Step = function () {
        var tickCount = 0;
        this._currentInstruction_ExtraTiming = 0;
        this.DrawTo(this.clock);
        if (this.nextEvent <= this.clock) {
            this.HandleNextEvent();
        }
        if (this._handleNMI) {
            this._handleNMI = false;
            this.clock += 7;
            this.NonMaskableInterrupt();
            //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
            //  set is pushed on the stack, then the I flag is set. 
            var newStatusReg = this._statusRegister & -17 | 32;
            this.SetFlag(this.SRMasks_InterruptDisableMask, true);
            // push pc onto stack (high byte first)
            this.PushStack(this._programCounter >> 8);
            this.PushStack(this._programCounter & 0xFF);
            //c7ab
            // push sr onto stack
            this.PushStack(newStatusReg);
            // point pc to interrupt service routine
            var lowByte = this.GetByte(65530);
            var highByte = this.GetByte(65531);
            var jumpTo = lowByte | (highByte << 8);
            this._programCounter = jumpTo;
            //nonOpCodeticks = 7;
        }
        else if (this._handleIRQ) {
            this._handleIRQ = false;
            this.clock += 7;
            //InterruptRequest();
            //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
            //  set is pushed on the stack, then the I flag is set. 
            if (!this.GetFlag(this.SRMasks_InterruptDisableMask)) {
                this.SetFlag(this.SRMasks_InterruptDisableMask, true);
                var newStatusReg1 = this._statusRegister & -17 | 32;
                // if enabled
                // push pc onto stack (high byte first)
                this.PushStack(this._programCounter >> 8);
                this.PushStack(this._programCounter);
                // push sr onto stack
                this.PushStack(this._statusRegister);
                // point pc to interrupt service routine
                this._programCounter = this.GetByte(65534) + (this.GetByte(65535) << 8);
                // nonOpCodeticks = 7;
            }
        }
        //FetchNextInstruction();
        this._currentInstruction_Address = this._programCounter;
        this._currentInstruction_OpCode = this.GetByte(this._programCounter++);
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];
        //FetchInstructionParameters();
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.GetByte(this._programCounter++);
                this._currentInstruction_Parameters1 = this.GetByte(this._programCounter++);
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiCPPU_AddressingModes.Relative:
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.GetByte(this._programCounter++);
                break;
            case ChiChiCPPU_AddressingModes.Accumulator:
            case ChiChiCPPU_AddressingModes.Implicit:
                break;
            default:
                //  throw new NotImplementedException("Invalid address mode!!");
                break;
        }
        this.Execute();
        //("{0:x} {1:x} {2:x}", _currentInstruction_OpCode, _currentInstruction_AddressingMode, _currentInstruction_Address);
        if (this._debugging) {
            this.WriteInstructionHistoryAndUsage();
            this._operationCounter++;
        }
        this.clock += ChiChiCPPU.cpuTiming[this._currentInstruction_OpCode] + this._currentInstruction_ExtraTiming;
    };
    ChiChiCPPU.prototype.ResetCPU = function () {
        this._statusRegister = 52;
        this._operationCounter = 0;
        this._stackPointer = 253;
        this._programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
        this._ticks = 4;
    };
    ChiChiCPPU.prototype.PowerOn = function () {
        // powers up with this state
        this._statusRegister = 52;
        this._stackPointer = 253;
        this._operationCounter = 0;
        this._ticks = 4;
        // wram initialized to 0xFF, with some exceptions
        // probably doesn't affect games, but why not?
        for (var i = 0; i < 2048; ++i) {
            this.Rams[i] = 255;
        }
        this.Rams[8] = 247;
        this.Rams[9] = 239;
        this.Rams[10] = 223;
        this.Rams[15] = 191;
        this._programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
    };
    ChiChiCPPU.prototype.GetState = function (outStream) {
        //throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.SetState = function (inStream) {
        // throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.RunFrame = function () {
        this.FindNextEvent();
        do {
            this.Step();
        } while (!this.__frameFinished);
    };
    ChiChiCPPU.prototype.DecodeAddress = function () {
        this._currentInstruction_ExtraTiming = 0;
        var result = 0;
        var lowByte = 0;
        var highByte = 0;
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Absolute:
                // two parameters refer to the memory position
                result = ((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0);
                break;
            case ChiChiCPPU_AddressingModes.AbsoluteX:
                // absolute, x indexed - two paramaters + Index register x
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterX) | 0));
                if ((result & 0xFF) < this._indexRegisterX) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.AbsoluteY:
                // absolute, y indexed - two paramaters + Index register y
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterY) | 0));
                if ((result & 0xFF) < this._indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.ZeroPage:
                // first parameter represents offset in zero page
                result = this._currentInstruction_Parameters0;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageX:
                result = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 0xFF;
                break;
            case ChiChiCPPU_AddressingModes.ZeroPageY:
                result = ((((this._currentInstruction_Parameters0 & 0xFF) + (this._indexRegisterY & 0xFF)) | 0)) & 0xFF;
                break;
            case ChiChiCPPU_AddressingModes.Indirect:
                lowByte = this._currentInstruction_Parameters0;
                highByte = this._currentInstruction_Parameters1 << 8;
                var indAddr = (highByte | lowByte) & 65535;
                var indirectAddr = (this.GetByte(indAddr));
                lowByte = (((lowByte + 1) | 0)) & 0xFF;
                indAddr = (highByte | lowByte) & 65535;
                indirectAddr = indirectAddr | (this.GetByte(indAddr) << 8);
                result = indirectAddr;
                break;
            case ChiChiCPPU_AddressingModes.IndexedIndirect:
                var addr = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 0xFF;
                lowByte = this.GetByte(addr);
                addr = (addr + 1) | 0;
                highByte = this.GetByte(addr & 0xFF);
                highByte = highByte << 8;
                result = highByte | lowByte;
                break;
            case ChiChiCPPU_AddressingModes.IndirectIndexed:
                lowByte = this.GetByte(this._currentInstruction_Parameters0);
                highByte = this.GetByte((((this._currentInstruction_Parameters0 + 1) | 0)) & 0xFF) << 8;
                addr = (lowByte | highByte);
                result = (addr + this._indexRegisterY) | 0;
                if ((result & 0xFF) > this._indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiCPPU_AddressingModes.Relative:
                result = (((this._programCounter + this._currentInstruction_Parameters0) | 0));
                break;
            default:
                this.HandleBadOperation();
                break;
        }
        return result & 65535;
    };
    ChiChiCPPU.prototype.HandleBadOperation = function () {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.DecodeOperand = function () {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiCPPU_AddressingModes.Immediate:
                this._dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiCPPU_AddressingModes.Accumulator:
                return this._accumulator;
            default:
                this._dataBus = this.GetByte(this.DecodeAddress());
                return this._dataBus;
        }
    };
    ChiChiCPPU.prototype.Execute = function () {
        var data = 0;
        var lowByte = 0;
        var highByte = 0;
        var carryFlag = 0;
        var result = 0;
        var oldbit = 0;
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
                //SKB, SKW, DOP, - undocumented noops
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
                //ADC
                data = this.DecodeOperand();
                carryFlag = (this._statusRegister & 1);
                result = (this._accumulator + data + carryFlag) | 0;
                // carry flag
                this.SetFlag(this.SRMasks_CarryMask, result > 255);
                // overflow flag
                this.SetFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ data) & 128) !== 128 && ((this._accumulator ^ result) & 128) === 128);
                // occurs when bit 7 is set
                this._accumulator = result & 0xFF;
                this.SetZNFlags(this._accumulator);
                break;
            case 41:
            case 37:
            case 53:
            case 45:
            case 61:
            case 57:
            case 33:
            case 49:
                //AND
                this._accumulator = (this._accumulator & this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
                break;
            case 10:
            case 6:
            case 22:
            case 14:
            case 30:
                //ASL
                data = this.DecodeOperand();
                // set carry flag
                this.SetFlag(this.SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.DecodeAddress(), data);
                }
                this.SetZNFlags(data);
                break;
            case 144:
                //BCC
                if ((this._statusRegister & 1) !== 1) {
                    this.Branch();
                }
                break;
            case 176:
                //BCS();
                if ((this._statusRegister & 1) === 1) {
                    this.Branch();
                }
                break;
            case 240:
                //BEQ();
                if ((this._statusRegister & 2) === 2) {
                    this.Branch();
                }
                break;
            case 36:
            case 44:
                //BIT();
                data = this.DecodeOperand();
                // overflow is bit 6
                this.SetFlag(this.SRMasks_OverflowMask, (data & 64) === 64);
                // negative is bit 7
                if ((data & 128) === 128) {
                    this._statusRegister = this._statusRegister | 128;
                }
                else {
                    this._statusRegister = this._statusRegister & 127;
                }
                if ((data & this._accumulator) === 0) {
                    this._statusRegister = this._statusRegister | 2;
                }
                else {
                    this._statusRegister = this._statusRegister & 253;
                }
                break;
            case 48:
                //BMI();
                if ((this._statusRegister & 128) === 128) {
                    this.Branch();
                }
                break;
            case 208:
                //BNE();
                if ((this._statusRegister & 2) !== 2) {
                    this.Branch();
                }
                break;
            case 16:
                //BPL();
                if ((this._statusRegister & 128) !== 128) {
                    this.Branch();
                }
                break;
            case 0:
                //BRK();
                //BRK causes a non-maskable interrupt and increments the program counter by one. 
                //Therefore an RTI will go to the address of the BRK +2 so that BRK may be used to replace a two-byte instruction 
                // for debugging and the subsequent RTI will be correct. 
                // push pc onto stack (high byte first)
                this._programCounter = this._programCounter + 1;
                this.PushStack(this._programCounter >> 8 & 0xFF);
                this.PushStack(this._programCounter & 0xFF);
                // push sr onto stack
                //PHP and BRK push the current status with bits 4 and 5 set on the stack; 
                data = this._statusRegister | 16 | 32;
                this.PushStack(data);
                // set interrupt disable, and break flags
                // BRK then sets the I flag.
                this._statusRegister = this._statusRegister | 20;
                // point pc to interrupt service routine
                this._addressBus = 65534;
                lowByte = this.GetByte(this._addressBus);
                this._addressBus = 65535;
                highByte = this.GetByte(this._addressBus);
                this._programCounter = lowByte + highByte * 256;
                break;
            case 80:
                //BVC();
                if ((this._statusRegister & 64) !== 64) {
                    this.Branch();
                }
                break;
            case 112:
                //BVS();
                if ((this._statusRegister & 64) === 64) {
                    this.Branch();
                }
                break;
            case 24:
                //CLC();
                this.SetFlag(this.SRMasks_CarryMask, false);
                break;
            case 216:
                //CLD();
                this.SetFlag(this.SRMasks_DecimalModeMask, false);
                break;
            case 88:
                //CLI();
                this.SetFlag(this.SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                //CLV();
                this.SetFlag(this.SRMasks_OverflowMask, false);
                break;
            case 201:
            case 197:
            case 213:
            case 205:
            case 221:
            case 217:
            case 193:
            case 209:
                //CMP();
                data = (this._accumulator + 256 - this.DecodeOperand());
                this.Compare(data);
                break;
            case 224:
            case 228:
            case 236:
                //CPX();
                data = (this._indexRegisterX + 256 - this.DecodeOperand());
                this.Compare(data);
                break;
            case 192:
            case 196:
            case 204:
                //CPY();
                data = (this._indexRegisterY + 256 - this.DecodeOperand());
                this.Compare(data);
                break;
            case 198:
            case 214:
            case 206:
            case 222:
                //DEC();
                data = this.DecodeOperand();
                data = (data - 1) & 0xFF;
                this.SetByte(this.DecodeAddress(), data);
                this.SetZNFlags(data);
                break;
            case 202:
                //DEX();
                this._indexRegisterX = this._indexRegisterX - 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 136:
                //DEY();
                this._indexRegisterY = this._indexRegisterY - 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.SetZNFlags(this._indexRegisterY);
                break;
            case 73:
            case 69:
            case 85:
            case 77:
            case 93:
            case 89:
            case 65:
            case 81:
                //EOR();
                this._accumulator = (this._accumulator ^ this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
                break;
            case 230:
            case 246:
            case 238:
            case 254:
                //INC();
                data = this.DecodeOperand();
                data = (data + 1) & 0xFF;
                this.SetByte(this.DecodeAddress(), data);
                this.SetZNFlags(data);
                break;
            case 232:
                //INX();
                this._indexRegisterX = this._indexRegisterX + 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 200:
                this._indexRegisterY = this._indexRegisterY + 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.SetZNFlags(this._indexRegisterY);
                break;
            case 76:
            case 108:
                // JMP();
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this._programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                }
                else {
                    this._programCounter = this.DecodeAddress();
                }
                break;
            case 32:
                //JSR();
                this.PushStack((this._programCounter >> 8) & 0xFF);
                this.PushStack((this._programCounter - 1) & 0xFF);
                this._programCounter = this.DecodeAddress();
                break;
            case 169:
            case 165:
            case 181:
            case 173:
            case 189:
            case 185:
            case 161:
            case 177:
                //LDA();
                this._accumulator = this.DecodeOperand();
                this.SetZNFlags(this._accumulator);
                break;
            case 162:
            case 166:
            case 182:
            case 174:
            case 190:
                //LDX();
                this._indexRegisterX = this.DecodeOperand();
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 160:
            case 164:
            case 180:
            case 172:
            case 188:
                //LDY();
                this._indexRegisterY = this.DecodeOperand();
                this.SetZNFlags(this._indexRegisterY);
                break;
            case 74:
            case 70:
            case 86:
            case 78:
            case 94:
                //LSR();
                data = this.DecodeOperand();
                //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 
                this.SetFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                data = data >> 1 & 0xFF;
                this.SetZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.DecodeAddress(), data);
                }
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
                //NOP();
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.AbsoluteX) {
                    this.DecodeAddress();
                }
                break;
            case 9:
            case 5:
            case 21:
            case 13:
            case 29:
            case 25:
            case 1:
            case 17:
                //ORA();
                this._accumulator = (this._accumulator | this.DecodeOperand());
                this.SetZNFlags(this._accumulator);
                break;
            case 72:
                //PHA();
                this.PushStack(this._accumulator);
                break;
            case 8:
                //PHP();
                data = this._statusRegister | 16 | 32;
                this.PushStack(data);
                break;
            case 104:
                //PLA();
                this._accumulator = this.PopStack();
                this.SetZNFlags(this._accumulator);
                break;
            case 40:
                //PLP();
                this._statusRegister = this.PopStack(); // | 0x20;
                break;
            case 42:
            case 38:
            case 54:
            case 46:
            case 62:
                //ROL();
                data = this.DecodeOperand();
                // old carry bit shifted into bit 1
                oldbit = (this._statusRegister & 1) === 1 ? 1 : 0;
                this.SetFlag(this.SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.SetZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.DecodeAddress(), data);
                }
                break;
            case 106:
            case 102:
            case 118:
            case 110:
            case 126:
                //ROR();
                data = this.DecodeOperand();
                // old carry bit shifted into bit 7
                oldbit = (this._statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.SetFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.SetZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.DecodeAddress(), data);
                }
                break;
            case 64:
                //RTI();
                this._statusRegister = this.PopStack(); // | 0x20;
                lowByte = this.PopStack();
                highByte = this.PopStack();
                this._programCounter = ((highByte << 8) | lowByte);
                break;
            case 96:
                //RTS();
                lowByte = (this.PopStack() + 1) & 0xFF;
                highByte = this.PopStack();
                this._programCounter = ((highByte << 8) | lowByte);
                break;
            case 235:
            case 233:
            case 229:
            case 245:
            case 237:
            case 253:
            case 249:
            case 225:
            case 241:// undocumented sbc immediate
                //SBC();
                // start the read process
                data = this.DecodeOperand() & 4095;
                carryFlag = ((this._statusRegister ^ 1) & 1);
                result = (((this._accumulator - data) & 4095) - carryFlag) & 4095;
                // set overflow flag if sign bit of accumulator changed
                this.SetFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ result) & 128) === 128 && ((this._accumulator ^ data) & 128) === 128);
                this.SetFlag(this.SRMasks_CarryMask, (result < 256));
                this._accumulator = (result) & 0xFF;
                this.SetZNFlags(this._accumulator);
                break;
            case 56:
                //SEC();
                this.SetFlag(this.SRMasks_CarryMask, true);
                break;
            case 248:
                //SED();
                this.SetFlag(this.SRMasks_DecimalModeMask, true);
                break;
            case 120:
                //SEI();
                this.SetFlag(this.SRMasks_InterruptDisableMask, true);
                break;
            case 133:
            case 149:
            case 141:
            case 157:
            case 153:
            case 129:
            case 145:
                //STA();
                this.SetByte(this.DecodeAddress(), this._accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.SetByte(this.DecodeAddress(), this._indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.SetByte(this.DecodeAddress(), this._indexRegisterY);
                break;
            case 170:
                //TAX();
                this._indexRegisterX = this._accumulator;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 168:
                //TAY();
                this._indexRegisterY = this._accumulator;
                this.SetZNFlags(this._indexRegisterY);
                break;
            case 186:
                //TSX();
                this._indexRegisterX = this._stackPointer;
                this.SetZNFlags(this._indexRegisterX);
                break;
            case 138:
                //TXA();
                this._accumulator = this._indexRegisterX;
                this.SetZNFlags(this._accumulator);
                break;
            case 154:
                //TXS();
                this._stackPointer = this._indexRegisterX;
                break;
            case 152:
                //TYA();
                this._accumulator = this._indexRegisterY;
                this.SetZNFlags(this._accumulator);
                break;
            case 11:
            case 43:
                //AAC();
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this._accumulator = this.DecodeOperand() & this._accumulator & 0xFF;
                this.SetFlag(this.SRMasks_CarryMask, (this._accumulator & 128) === 128);
                this.SetZNFlags(this._accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this._accumulator = this.DecodeOperand() & this._accumulator;
                this.SetFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                this._accumulator = this._accumulator >> 1;
                this.SetZNFlags(this._accumulator);
                break;
            case 107:
                //ARR();
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
                }
                else {
                    this._accumulator = (this._accumulator >> 1);
                }
                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 
                this.SetFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                switch (this._accumulator & 48) {
                    case 48:
                        this.SetFlag(this.SRMasks_CarryMask, true);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 0:
                        this.SetFlag(this.SRMasks_CarryMask, false);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 16:
                        this.SetFlag(this.SRMasks_CarryMask, false);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                    case 32:
                        this.SetFlag(this.SRMasks_CarryMask, true);
                        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                }
                break;
            case 171:
                //ATX();
                //AND byte with accumulator, then transfer accumulator to X register.
                //Status flags: N,Z
                this._indexRegisterX = (this._accumulator = this.DecodeOperand() & this._accumulator);
                this.SetZNFlags(this._indexRegisterX);
                break;
        }
    };
    ChiChiCPPU.prototype.SetZNFlags = function (data) {
        //zeroResult = (data & 0xFF) == 0;
        //negativeResult = (data & 0x80) == 0x80;
        if ((data & 255) === 0) {
            this._statusRegister |= 2;
        }
        else {
            this._statusRegister &= -3;
        } // ((int)CPUStatusMasks.ZeroResultMask);
        if ((data & 128) === 128) {
            this._statusRegister |= 128;
        }
        else {
            this._statusRegister &= -129;
        } // ((int)CPUStatusMasks.NegativeResultMask);
    };
    ChiChiCPPU.prototype.Compare = function (data) {
        this.SetFlag(this.SRMasks_CarryMask, data > 255);
        this.SetZNFlags(data & 255);
    };
    ChiChiCPPU.prototype.Branch = function () {
        this._currentInstruction_ExtraTiming = 1;
        var addr = this._currentInstruction_Parameters0 & 255;
        if ((addr & 128) === 128) {
            addr = addr - 256;
            this._programCounter += addr;
        }
        else {
            this._programCounter += addr;
        }
        if ((this._programCounter & 255) < addr) {
            this._currentInstruction_ExtraTiming = 2;
        }
    };
    ChiChiCPPU.prototype.NMIHandler = function () {
        this._handleNMI = true;
    };
    ChiChiCPPU.prototype.IRQUpdater = function () {
        this._handleIRQ = this.SoundBopper.IRQAsserted || this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$IRQAsserted;
    };
    ChiChiCPPU.prototype.LoadBytes = function (offset, bytes) {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.LoadBytes$1 = function (offset, bytes, length) {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.PushStack = function (data) {
        this.Rams[this._stackPointer + 256] = data;
        this._stackPointer--;
        if (this._stackPointer < 0) {
            this._stackPointer = 255;
        }
    };
    ChiChiCPPU.prototype.PopStack = function () {
        this._stackPointer++;
        if (this._stackPointer > 255) {
            this._stackPointer = 0;
        }
        return this.Rams[this._stackPointer + 256];
    };
    ChiChiCPPU.prototype.GetByte = function (address) {
        var result = 0;
        // check high byte, find appropriate handler
        switch (address & 61440) {
            case 0:
            case 4096:
                if (address < 2048) {
                    result = this.Rams[address];
                }
                else {
                    result = address >> 8;
                }
                break;
            case 8192:
            case 12288:
                result = this.PPU_GetByte(this.clock, address);
                break;
            case 16384:
                switch (address) {
                    case 16406:
                        result = this._padOne.GetByte(this.clock, address);
                        break;
                    case 16407:
                        result = this._padTwo.GetByte(this.clock, address);
                        break;
                    case 16405:
                        result = this.SoundBopper.GetByte(this.clock, address);
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
                result = this.Cart.ChiChiNES$IClockedMemoryMappedIOElement$GetByte(this.clock, address);
                break;
            default:
                throw new System.Exception("Bullshit!");
        }
        //if (_cheating && memoryPatches.ContainsKey(address))
        //{
        //    return memoryPatches[address].Activated ? memoryPatches[address].GetData(result) & 0xFF : result & 0xFF;
        //}
        return result & 255;
    };
    ChiChiCPPU.prototype.PeekByte = function (address) {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.PeekBytes = function (start, finish) {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.SetByte = function (address, data) {
        // check high byte, find appropriate handler
        if (address < 2048) {
            this.Rams[address & 2047] = data;
            return;
        }
        switch (address & 61440) {
            case 0:
            case 4096:
                // nes sram
                this.Rams[address & 2047] = data;
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
                this.PPU_SetByte(this.clock, address, data);
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
                        this.SoundBopper.SetByte(this.clock, address, data);
                        break;
                    case 16404:
                        this.PPU_CopySprites(data * 256);
                        this._currentInstruction_ExtraTiming = this._currentInstruction_ExtraTiming + 512;
                        break;
                    case 16406:
                        this._padOne.SetByte(this.clock, address, data & 1);
                        this._padTwo.SetByte(this.clock, address, data & 1);
                        break;
                }
                break;
        }
    };
    ChiChiCPPU.prototype.FindNextEvent = function () {
        // it'll either be the ppu's NMI, or an irq from either the apu or the cart
        this.nextEvent = this.clock + this.PPU_NextEventAt;
    };
    ChiChiCPPU.prototype.HandleNextEvent = function () {
        this.PPU_HandleEvent(this.clock);
        this.FindNextEvent();
    };
    ChiChiCPPU.prototype.ResetInstructionHistory = function () {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 255;
    };
    ChiChiCPPU.prototype.WriteInstructionHistoryAndUsage = function () {
        var inst = new ChiChiInstruction();
        inst.time = this.systemClock;
        inst.A = this._accumulator;
        inst.X = this._indexRegisterX;
        inst.Y = this._indexRegisterY;
        inst.SR = this._statusRegister;
        inst.SP = this._stackPointer;
        inst.frame = this.clock;
        inst.OpCode = this._currentInstruction_OpCode;
        inst.Parameters0 = this._currentInstruction_Parameters0;
        inst.Parameters1 = this._currentInstruction_Parameters1;
        inst.Address = this._currentInstruction_Address;
        inst.AddressingMode = this._currentInstruction_AddressingMode;
        inst.ExtraTiming = this._currentInstruction_ExtraTiming;
        this._instructionHistory[(this.instructionHistoryPointer--) & 255] = inst;
        this.instructionUsage[this._currentInstruction_OpCode]++;
        if ((this.instructionHistoryPointer & 255) === 255) {
            this.FireDebugEvent("instructionHistoryFull");
        }
    };
    ChiChiCPPU.prototype.FireDebugEvent = function (s) {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.PeekInstruction = function (address) {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.PPU_Initialize = function () {
        this._PPUAddress = 0;
        this._PPUStatus = 0;
        this._PPUControlByte0 = 0;
        this._PPUControlByte1 = 0;
        this._hScroll = 0;
        this._vScroll = 0;
        this.scanlineNum = 0;
        this.scanlinePos = 0;
        this._spriteAddress = 0;
    };
    ChiChiCPPU.prototype.PPU_WriteState = function (writer) {
        throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.PPU_ReadState = function (state) {
        throw new Error('Method not implemented.');
    };
    Object.defineProperty(ChiChiCPPU.prototype, "PPU_NMIIsThrown", {
        get: function () {
            return (this._PPUControlByte0 & 128) === 128;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiCPPU.prototype.PPU_SetupVINT = function () {
        this._PPUStatus = this._PPUStatus | 128;
        this.NMIHasBeenThrownThisFrame = false;
        // HandleVBlankIRQ = true;
        this._frames = this._frames + 1;
        //isRendering = false;
        if (this.PPU_NMIIsThrown) {
            //this.NMIHandler();
            this._handleNMI = true;
            this.PPU_HandleVBlankIRQ = true;
            this.NMIHasBeenThrownThisFrame = true;
        }
    };
    ChiChiCPPU.prototype.PPU_VidRAM_GetNTByte = function (address) {
        var result = 0;
        if (address >= 8192 && address < 12288) {
            result = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, address);
        }
        else {
            result = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, address);
        }
        return result;
    };
    ChiChiCPPU.prototype.UpdatePPUControlByte0 = function () {
        if ((this._PPUControlByte0 & 16)) {
            this._backgroundPatternTableIndex = 4096;
        }
        else {
            this._backgroundPatternTableIndex = 0;
        }
    };
    ChiChiCPPU.prototype.PPU_SetByte = function (Clock, address, data) {
        // DrawTo(Clock);
        //if (_isDebugging)
        //{
        //    Events.Enqueue(new PPUWriteEvent { IsWrite = true, DataWritten = data, FrameClock = frameClock, RegisterAffected = address, ScanlineNum = frameClock / 341, ScanlinePos = frameClock % 341 });
        //}
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
                this._backgroundPatternTableIndex = ((this._PPUControlByte0 & 16) >> 4) * 4096;
                // if we toggle /vbl we can throw multiple NMIs in a vblank period
                //if ((data & 0x80) == 0x80 && NMIHasBeenThrownThisFrame)
                //{
                //     NMIHasBeenThrownThisFrame = false;
                //}
                //UpdatePixelInfo();
                this.nameTableMemoryStart = this.nameTableBits * 1024;
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
                this.nameTableMemoryStart = this.nameTableBits * 1024;
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
                this.spriteRAM[this._spriteAddress] = data;
                // UnpackSprite(_spriteAddress / 4);
                this._spriteAddress = (this._spriteAddress + 1) & 255;
                this.unpackedSprites[this._spriteAddress >> 2].Changed = true;
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
                }
                else {
                    // during rendering, a write here will not post to the rendering counter
                    this.DrawTo(Clock);
                    this._vScroll = data;
                    if (data > 240) {
                        this._vScroll = data - 256;
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
                }
                else {
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
                    this._vScroll |= ((this._PPUAddress >> 12) & 3);
                    this.nameTableBits = ((this._PPUAddress >> 10) & 3);
                    if (this.frameOn) {
                        this.lockedHScroll = this._hScroll;
                        this.lockedVScroll = this._vScroll;
                        this.lockedVScroll = this.lockedVScroll - this.currentYPosition;
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
                    //WriteToNESPalette(_PPUAddress, (byte)data);
                    var palAddress = (this._PPUAddress) & 31;
                    this._palette[palAddress] = data;
                    // rgb32OutBuffer[255 * 256 + palAddress] = data;
                    if ((this._PPUAddress & 65519) === 16128) {
                        this._palette[(palAddress ^ 16) & 31] = data;
                        // rgb32OutBuffer[255 * 256 + palAddress ^ 0x10] = data;
                    }
                    // these palettes are all mirrored every 0x10 bytes
                    this.UpdatePixelInfo();
                    // _vidRAM[_PPUAddress ^ 0x1000] = (byte)data;
                }
                else {
                    // if its a nametable byte, mask it according to current mirroring
                    if ((this._PPUAddress & 61440) === 8192) {
                        this.chrRomHandler.ChiChiNES$INESCart$SetPPUByte(Clock, this._PPUAddress, data);
                    }
                    else {
                        if (this.vidRamIsRam) {
                            this.chrRomHandler.ChiChiNES$INESCart$SetPPUByte(Clock, this._PPUAddress, data);
                        }
                    }
                }
                // if controlbyte0.4, set ppuaddress + 32, else inc
                if ((this._PPUControlByte0 & 4) === 4) {
                    this._PPUAddress = (this._PPUAddress + 32);
                }
                else {
                    this._PPUAddress = (this._PPUAddress + 1);
                }
                // reset the flag which makex xxx6 set the high byte of address
                this.PPUAddressLatchIsHigh = true;
                this._PPUAddress = (this._PPUAddress & 16383);
                break;
        }
    };
    ChiChiCPPU.prototype.PPU_GetByte = function (Clock, address) {
        //if (_isDebugging)
        //{
        //    Events.Enqueue(new PPUWriteEvent { IsWrite = false, DataWritten = 0, FrameClock = frameClock, RegisterAffected = address, ScanlineNum = frameClock / 341, ScanlinePos = frameClock % 341 });
        //}
        switch (address & 7) {
            case 3:
            case 0:
            case 1:
            case 5:
            case 6:
                return 0;
            // return this._openBus;
            case 2:
                var ret;
                this.PPUAddressLatchIsHigh = true;
                // bit 7 is set to 0 after a read occurs
                // return lower 5 latched bits, and the status
                ret = (this.ppuReadBuffer & 31) | this._PPUStatus;
                this.DrawTo(Clock);
                if ((ret & 0x80) === 0x80) {
                    this._PPUStatus = this._PPUStatus & ~0x80;
                }
                this.UpdatePixelInfo();
                //}
                //this._openBus = ret;
                return ret;
            case 4:
                var tmp = this.spriteRAM[this._spriteAddress];
                //ppuLatch = spriteRAM[SpriteAddress];
                // should not increment on read ?
                //SpriteAddress = (SpriteAddress + 1) & 0xFF;
                //this._openBus = tmp;
                return tmp;
            case 7:
                // palette reads shouldn't be buffered like regular vram reads, they re internal
                if ((this._PPUAddress & 65280) === 16128) {
                    // these palettes are all mirrored every 0x10 bytes
                    tmp = this._palette[this._PPUAddress & 31];
                    // palette read should also read vram into read buffer
                    // info i found on the nesdev forums
                    // When you read PPU $3F00-$3FFF, you get immediate data from Palette RAM 
                    // (without the 1-read delay usually present when reading from VRAM) and the PPU 
                    // will also fetch nametable data from the corresponding address (which is mirrored from PPU $2F00-$2FFF). 
                    // note: writes do not work this way 
                    this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress - 4096);
                }
                else {
                    tmp = this.ppuReadBuffer;
                    if (this._PPUAddress >= 0x2000 && this._PPUAddress <= 0x2FFF) {
                        this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress);
                    }
                    else {
                        this.ppuReadBuffer = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(Clock, this._PPUAddress & 16383);
                    }
                }
                if ((this._PPUControlByte0 & 4) === 4) {
                    this._PPUAddress = this._PPUAddress + 32;
                }
                else {
                    this._PPUAddress = this._PPUAddress + 1;
                }
                this._PPUAddress = (this._PPUAddress & 16383);
                return tmp;
        }
        //throw new NotImplementedException(string.Format("PPU.GetByte() recieved invalid address {0,4:x}", address));
        return 0;
    };
    ChiChiCPPU.prototype.PPU_HandleEvent = function (Clock) {
        this.DrawTo(Clock);
    };
    ChiChiCPPU.prototype.PPU_ResetClock = function (Clock) {
        this.LastcpuClock = Clock;
    };
    ChiChiCPPU.prototype.PPU_CopySprites = function (copyFrom) {
        // should copy 0x100 items from source to spriteRAM, 
        // starting at SpriteAddress, and wrapping around
        // should set spriteDMA flag
        for (var i = 0; i < 256; ++i) {
            var spriteLocation = (this._spriteAddress + i) & 255;
            if (this.spriteRAM[spriteLocation] !== this.Rams[copyFrom + i]) {
                this.spriteRAM[spriteLocation] = this.Rams[copyFrom + i];
                this.unpackedSprites[(spriteLocation >> 2) & 255].Changed = true;
            }
        }
        this._spriteCopyHasHappened = true;
        this.spriteChanges = true;
    };
    ChiChiCPPU.prototype.PPU_InitSprites = function () {
        this.currentSprites = new Array(this._maxSpritesPerScanline); //ChiChiSprite;
        for (var i = 0; i < this._maxSpritesPerScanline; ++i) {
            this.currentSprites[i] = new ChiChiSprite();
        }
        this.unpackedSprites = new Array(64);
        for (var i = 0; i < 64; ++i) {
            this.unpackedSprites[i] = new ChiChiSprite();
        }
    };
    ChiChiCPPU.prototype.PPU_GetSpritePixel = function () {
        this.isForegroundPixel = false;
        this.spriteZeroHit = false;
        var result = 0;
        var yLine = 0;
        var xPos = 0;
        var tileIndex = 0;
        for (var i = 0; i < this.spritesOnThisScanline; ++i) {
            var currSprite = this.currentSprites[i];
            if (currSprite.XPosition > 0 && this.currentXPosition >= currSprite.XPosition && this.currentXPosition < currSprite.XPosition + 8) {
                var spritePatternTable = 0;
                if ((this._PPUControlByte0 & 8) === 8) {
                    spritePatternTable = 4096;
                }
                xPos = this.currentXPosition - currSprite.XPosition;
                yLine = this.currentYPosition - currSprite.YPosition - 1;
                yLine = yLine & (this.spriteSize - 1);
                tileIndex = currSprite.TileIndex;
                if ((this._PPUControlByte0 & 32) === 32) {
                    if ((tileIndex & 1) === 1) {
                        spritePatternTable = 4096;
                        tileIndex = tileIndex ^ 1;
                    }
                    else {
                        spritePatternTable = 0;
                    }
                }
                //result = WhissaSpritePixel(spritePatternTable, xPos, yLine, ref currSprite, tileIndex);
                // 8x8 tile
                var patternEntry;
                var patternEntryBit2;
                if (currSprite.FlipY) {
                    yLine = this.spriteSize - yLine - 1;
                }
                if (yLine >= 8) {
                    yLine += 8;
                }
                patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine);
                patternEntryBit2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine + 8);
                result = (currSprite.FlipX ? ((patternEntry >> xPos) & 1) | (((patternEntryBit2 >> xPos) << 1) & 2) : ((patternEntry >> 7 - xPos) & 1) | (((patternEntryBit2 >> 7 - xPos) << 1) & 2)) & 255;
                if (result !== 0) {
                    if (currSprite.SpriteNumber === 0) {
                        this.spriteZeroHit = true;
                    }
                    this.isForegroundPixel = currSprite.Foreground;
                    return (result | currSprite.AttributeByte);
                }
            }
        }
        return 0;
    };
    ChiChiCPPU.prototype.PPU_WhissaSpritePixel = function (patternTableIndex, x, y, sprite, tileIndex) {
        // 8x8 tile
        var patternEntry = 0;
        var patternEntryBit2 = 0;
        if (sprite.v.FlipY) {
            y = this.spriteSize - y - 1;
        }
        if (y >= 8) {
            y += 8;
        }
        patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternTableIndex + tileIndex * 16 + y);
        patternEntryBit2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternTableIndex + tileIndex * 16 + y + 8);
        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    };
    ChiChiCPPU.prototype.PPU_PreloadSprites = function (scanline) {
        this.spritesOnThisScanline = 0;
        this.sprite0scanline = -1;
        var yLine = this.currentYPosition - 1;
        this.outBuffer[(64768) + yLine] = 0;
        this.outBuffer[(65024) + yLine] = 0;
        //spritesOnLine[2 * yLine] = 0;
        //spritesOnLine[2 * yLine + 1] = 0;
        for (var spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            var spriteID = ((spriteNum + this._spriteAddress) & 255) >> 2;
            var y = this.unpackedSprites[spriteID].YPosition + 1;
            if (scanline >= y && scanline < y + this.spriteSize) {
                if (spriteID === 0) {
                    this.sprite0scanline = scanline;
                    this.sprite0x = this.unpackedSprites[spriteID].XPosition;
                }
                var spId = spriteNum >> 2;
                if (spId < 32) {
                    this.outBuffer[(64768) + yLine] |= 1 << spId;
                }
                else {
                    this.outBuffer[(65024) + yLine] |= 1 << (spId - 32);
                }
                this.currentSprites[this.spritesOnThisScanline] = this.unpackedSprites[spriteID];
                this.currentSprites[this.spritesOnThisScanline].IsVisible = true;
                this.spritesOnThisScanline++;
                if (this.spritesOnThisScanline === this._maxSpritesPerScanline) {
                    break;
                }
            }
        }
        if (this.spritesOnThisScanline > 7) {
            this._PPUStatus = this._PPUStatus | 32;
        }
    };
    ChiChiCPPU.prototype.PPU_UnpackSprites = function () {
        //Buffer.BlockCopy
        var outBufferloc = 65280;
        for (var i = 0; i < 256; i += 4) {
            this.outBuffer[outBufferloc] = (this.spriteRAM[i] << 24) | (this.spriteRAM[i + 1] << 16) | (this.spriteRAM[i + 2] << 8) | (this.spriteRAM[i + 3] << 0);
            outBufferloc++;
        }
        // Array.Copy(spriteRAM, 0, outBuffer, 255 * 256 * 4, 256);
        for (var currSprite = 0; currSprite < this.unpackedSprites.length; ++currSprite) {
            if (this.unpackedSprites[currSprite].Changed) {
                this.UnpackSprite(currSprite);
            }
        }
    };
    ChiChiCPPU.prototype.UnpackSprite = function (currSprite) {
        var attrByte = this.spriteRAM[(currSprite << 2) + 2 | 0];
        this.unpackedSprites[currSprite].IsVisible = true;
        this.unpackedSprites[currSprite].AttributeByte = ((attrByte & 3) << 2) | 16;
        this.unpackedSprites[currSprite].YPosition = this.spriteRAM[currSprite * 4];
        this.unpackedSprites[currSprite].XPosition = this.spriteRAM[currSprite * 4 + 3];
        this.unpackedSprites[currSprite].SpriteNumber = currSprite;
        this.unpackedSprites[currSprite].Foreground = (attrByte & 32) !== 32;
        this.unpackedSprites[currSprite].FlipX = (attrByte & 64) === 64;
        this.unpackedSprites[currSprite].FlipY = (attrByte & 128) === 128;
        this.unpackedSprites[currSprite].TileIndex = this.spriteRAM[currSprite * 4 + 1];
        this.unpackedSprites[currSprite].Changed = false;
    };
    ChiChiCPPU.prototype.PPU_GetNameTablePixel = function () {
        var result = ((this.patternEntry & 128) >> 7) | ((this.patternEntryByte2 & 128) >> 6);
        this.patternEntry <<= 1;
        this.patternEntryByte2 <<= 1;
        if (result > 0) {
            result |= this.currentAttributeByte;
        }
        return result & 255;
    };
    ChiChiCPPU.prototype.FetchNextTile = function () {
        var ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
        var xTilePosition = this.xPosition >> 3;
        var tileRow = (this.yPosition >> 3) % 30 << 5;
        var tileNametablePosition = 8192 + ppuNameTableMemoryStart + xTilePosition + tileRow;
        var TileIndex = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, tileNametablePosition);
        var patternTableYOffset = this.yPosition & 7;
        var patternID = this._backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;
        this.patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID);
        this.patternEntryByte2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID + 8);
        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
    };
    ChiChiCPPU.prototype.GetAttributeTableEntry = function (ppuNameTableMemoryStart, i, j) {
        var LookUp = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, 8192 + ppuNameTableMemoryStart + 960 + (i >> 2) + ((j >> 2) * 8));
        switch ((i & 2) | (j & 2) * 2) {
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
    };
    ChiChiCPPU.prototype.DrawTo = function (cpuClockNum) {
        var frClock = (cpuClockNum - this.LastcpuClock) * 3;
        if (this.frameClock < 6820) {
            // if the frameclock +frClock is in vblank (< 6820) dont do nothing, just update it
            if (this.frameClock + frClock < 6820) {
                this.frameClock += frClock;
                frClock = 0;
            }
            else {
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
                    //PPU_ClearVINT();
                    this._PPUStatus = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this._PPUControlByte0 & 32) === 32) ? 16 : 8;
                    if ((this._PPUControlByte1 & 24) !== 0) {
                        this.isRendering = true;
                    }
                    this.frameOn = true;
                    this.chrRomHandler.ChiChiNES$INESCart$ResetBankStartCache();
                    // setFrameOn();
                    if (this.spriteChanges) {
                        this.PPU_UnpackSprites();
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
                case 89342://ChiChiNES.CPU2A03.frameClockEnd:
                    this.shouldRender = true;
                    //__frameFinished = true;
                    this.frameFinished();
                    this.PPU_SetupVINT();
                    this.frameOn = false;
                    this.frameClock = 0;
                    //if (_isDebugging)
                    //    events.Clear();
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
                        var tileRow = (this.yPosition >> 3) % 30 << 5;
                        var tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;
                        var TileIndex = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, tileNametablePosition);
                        var patternTableYOffset = this.yPosition & 7;
                        var patternID = this._backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;
                        this.patternEntry = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID);
                        this.patternEntryByte2 = this.chrRomHandler.ChiChiNES$INESCart$GetPPUByte(0, patternID + 8);
                        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                        /* end fetch next tile */
                    }
                    /* draw pixel */
                    var tilePixel = this._tilesAreVisible ? this.PPU_GetNameTablePixel() : 0;
                    // bool foregroundPixel = isForegroundPixel;
                    var spritePixel = this._spritesAreVisible ? this.PPU_GetSpritePixel() : 0;
                    if (!this.hitSprite && this.spriteZeroHit && tilePixel !== 0) {
                        this.hitSprite = true;
                        this._PPUStatus = this._PPUStatus | 64;
                    }
                    //var x = pal[_palette[(foregroundPixel || (tilePixel == 0 && spritePixel != 0)) ? spritePixel : tilePixel]];
                    //var x = 
                    this.byteOutBuffer[this.vbufLocation * 4] = this._palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
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
                    this.PPU_PreloadSprites(this.currentYPosition);
                    if (this.spritesOnThisScanline >= 7) {
                        this._PPUStatus = this._PPUStatus | 32;
                    }
                    this.lockedHScroll = this._hScroll;
                    this.UpdatePixelInfo();
                    //PPU_RunNewScanlineEvents 
                    this.yPosition = this.currentYPosition + this.lockedVScroll;
                    if (this.yPosition < 0) {
                        this.yPosition += 240;
                    }
                    if (this.yPosition >= 240) {
                        this.yPosition -= 240;
                        this.yNTXor = 2048;
                    }
                    else {
                        this.yNTXor = 0;
                    }
                }
            }
        }
        this.LastcpuClock = cpuClockNum;
    };
    ChiChiCPPU.prototype.UpdatePixelInfo = function () {
        this.nameTableMemoryStart = this.nameTableBits * 1024;
    };
    ChiChiCPPU.prototype.GetStatus = function () {
        return {
            PC: this._programCounter,
            A: this._accumulator,
            X: this._indexRegisterX,
            Y: this._indexRegisterY,
            SP: this._stackPointer,
            SR: this._statusRegister
        };
    };
    ChiChiCPPU.prototype.GetPPUStatus = function () {
        return {
            status: this._PPUStatus,
            controlByte0: this._PPUControlByte0,
            controlByte1: this._PPUControlByte1,
            nameTableStart: this.nameTableMemoryStart,
            currentTile: this.currentTileIndex,
            lockedVScroll: this.lockedVScroll,
            lockedHScroll: this.lockedHScroll,
            X: this.currentXPosition,
            Y: this.currentYPosition
        };
    };
    // statics 
    ChiChiCPPU.cpuTiming = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
    ChiChiCPPU.pal = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    ChiChiCPPU.addressModes = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
    return ChiChiCPPU;
}());
//# sourceMappingURL=ChiChi.HWCore.js.map