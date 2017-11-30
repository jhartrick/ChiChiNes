(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["emulator.worker"] = factory();
	else
		root["emulator.worker"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// utility classes
Object.defineProperty(exports, "__esModule", { value: true });
var BufferMaker = /** @class */ (function () {
    function BufferMaker() {
    }
    BufferMaker.MakeUint32Array = function (count) {
        return new Uint32Array(count);
    };
    BufferMaker.MakeUint8Array = function (count) {
        return new Uint8Array(count);
    };
    return BufferMaker;
}());
exports.BufferMaker = BufferMaker;
var RunningStatuses;
(function (RunningStatuses) {
    RunningStatuses[RunningStatuses["Unloaded"] = 0] = "Unloaded";
    RunningStatuses[RunningStatuses["Off"] = 1] = "Off";
    RunningStatuses[RunningStatuses["Running"] = 2] = "Running";
    RunningStatuses[RunningStatuses["Frozen"] = 3] = "Frozen";
    RunningStatuses[RunningStatuses["Paused"] = 4] = "Paused";
})(RunningStatuses = exports.RunningStatuses || (exports.RunningStatuses = {}));
var DebugStepTypes;
(function (DebugStepTypes) {
    DebugStepTypes[DebugStepTypes["Instruction"] = 0] = "Instruction";
    DebugStepTypes[DebugStepTypes["Frame"] = 1] = "Frame";
})(DebugStepTypes = exports.DebugStepTypes || (exports.DebugStepTypes = {}));
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
})(ChiChiCPPU_AddressingModes = exports.ChiChiCPPU_AddressingModes || (exports.ChiChiCPPU_AddressingModes = {}));
var CpuStatus = /** @class */ (function () {
    function CpuStatus() {
        this.PC = 0;
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.SP = 0;
        this.SR = 0;
    }
    return CpuStatus;
}());
exports.CpuStatus = CpuStatus;
var PpuStatus = /** @class */ (function () {
    function PpuStatus() {
        this.status = 0;
        this.controlByte0 = 0;
        this.controlByte1 = 0;
        this.nameTableStart = 0;
        this.currentTile = 0;
        this.lockedVScroll = 0;
        this.lockedHScroll = 0;
        this.X = 0;
        this.Y = 0;
    }
    return PpuStatus;
}());
exports.PpuStatus = PpuStatus;
var ChiChiInstruction = /** @class */ (function () {
    function ChiChiInstruction() {
        this.AddressingMode = 0;
        this.frame = 0;
        this.time = 0;
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.SR = 0;
        this.SP = 0;
        this.Address = 0;
        this.OpCode = 0;
        this.Parameters0 = 0;
        this.Parameters1 = 0;
        this.ExtraTiming = 0;
        this.Length = 0;
    }
    return ChiChiInstruction;
}());
exports.ChiChiInstruction = ChiChiInstruction;
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
exports.ChiChiSprite = ChiChiSprite;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// shared buffer to get sound out
var WavSharer = /** @class */ (function () {
    function WavSharer() {
        this.synced = true;
        this.NES_BYTES_WRITTEN = 0;
        this.WAVSHARER_BLOCKTHREAD = 1;
        this.WAVSHARER_BUFFERPOS = 2;
        this.controlBuffer = new Int32Array(new SharedArrayBuffer(3 * Int32Array.BYTES_PER_ELEMENT));
        this.sharedAudioBufferPos = 0;
        this.SharedBufferLength = 8192;
        this.chunkSize = 1024;
        this.SharedBuffer = new Float32Array(this.SharedBufferLength);
    }
    Object.defineProperty(WavSharer.prototype, "bufferPosition", {
        get: function () {
            return Atomics.load(this.controlBuffer, this.WAVSHARER_BUFFERPOS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WavSharer.prototype, "audioBytesWritten", {
        get: function () {
            return Atomics.load(this.controlBuffer, this.NES_BYTES_WRITTEN);
        },
        set: function (value) {
            Atomics.store(this.controlBuffer, this.NES_BYTES_WRITTEN, value);
        },
        enumerable: true,
        configurable: true
    });
    WavSharer.prototype.wakeSleepers = function () {
        Atomics.wake(this.controlBuffer, this.NES_BYTES_WRITTEN, 99999);
    };
    WavSharer.prototype.synchronize = function () {
        if (this.synced) {
            while (this.audioBytesWritten >= this.chunkSize) {
                Atomics.store(this.controlBuffer, this.WAVSHARER_BUFFERPOS, this.sharedAudioBufferPos);
                Atomics.wait(this.controlBuffer, this.NES_BYTES_WRITTEN, this.audioBytesWritten);
            }
        }
        else {
            this.audioBytesWritten = this.chunkSize;
        }
    };
    WavSharer.sample_size = 1;
    return WavSharer;
}());
exports.WavSharer = WavSharer;
//apu classes
var BlipBuffer = /** @class */ (function () {
    function BlipBuffer(size) {
        this.size = size;
        this.factor = 0;
        this.offset = 0;
        this.avail = 0;
        this.integrator = 0;
        this.time_bits = 0;
        this.arrayLength = 0;
        this.samples = new Array(size);
        this.samples.fill(0);
    }
    return BlipBuffer;
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
        this.blipBuffer = new BlipBuffer(size);
        this.blipBuffer.size = size;
        this.blipBuffer.factor = 0;
        this.blip_clear();
    };
    Blip.prototype.blip_set_rates = function (clock_rate, sample_rate) {
        this.blipBuffer.factor = Blip.time_unit / clock_rate * sample_rate + (0.9999847412109375);
    };
    Blip.prototype.blip_clear = function () {
        this.blipBuffer.offset = 0;
        this.blipBuffer.avail = 0;
        this.blipBuffer.integrator = 0;
        this.blipBuffer.samples = new Array(this.blipBuffer.size + Blip.buf_extra);
        this.blipBuffer.samples.fill(0);
    };
    Blip.prototype.blip_clocks_needed = function (samples) {
        var needed = samples * Blip.time_unit - this.blipBuffer.offset;
        return ((needed + this.blipBuffer.factor - 1) / this.blipBuffer.factor) | 0;
    };
    Blip.prototype.blip_end_frame = function (t) {
        var off = t * this.blipBuffer.factor + this.blipBuffer.offset;
        this.blipBuffer.avail += off >> Blip.time_bits;
        this.blipBuffer.offset = off & (Blip.time_unit - 1);
    };
    Blip.prototype.remove_samples = function (count) {
        var remain = this.blipBuffer.avail + Blip.buf_extra - count;
        this.blipBuffer.avail -= count;
        this.blipBuffer.samples.copyWithin(0, count, count + remain);
        this.blipBuffer.samples.fill(0, remain, remain + count);
        this.blipBuffer.arrayLength = count;
    };
    Blip.prototype.ReadBytes = function (outbuf, count, stereo) {
        if (count > this.blipBuffer.avail) {
            count = this.blipBuffer.avail;
        }
        if (count !== 0) {
            var step = 1;
            var inPtr = 0, outPtr = 0;
            var endPtr = inPtr + count;
            var sum = this.blipBuffer.integrator;
            do {
                var st = sum >> Blip.delta_bits; /* assumes right shift preserves sign */
                sum = sum + this.blipBuffer.samples[inPtr];
                inPtr++;
                if (st !== st) {
                    st = (st >> 31) ^ 32767;
                }
                var f = st / 65536;
                outbuf[outPtr] = f;
                // outbuf[outPtr+ 1] = (byte)(st >> 8);
                outPtr += step;
                sum = sum - (st << (7));
            } while (inPtr !== endPtr);
            this.blipBuffer.integrator = sum;
            this.remove_samples(count);
        }
        return count;
    };
    // reads 'count' elements into array 'outbuf', beginning at 'start' and looping at array boundary if needed
    // returns number of elements written
    Blip.prototype.ReadElementsLoop = function (wavSharer) {
        var outbuf = wavSharer.SharedBuffer;
        var start = wavSharer.sharedAudioBufferPos;
        var count = this.blipBuffer.avail;
        var inPtr = 0, outPtr = start;
        var end = count;
        var sum = this.blipBuffer.integrator;
        if (count !== 0) {
            var step = 1;
            do {
                var st = sum >> Blip.delta_bits; /* assumes right shift preserves sign */
                sum = sum + this.blipBuffer.samples[inPtr];
                inPtr++;
                if (st !== st) {
                    st = (st >> 31) ^ 32767;
                }
                var f = st / 65536; // (st/0xFFFF) * 2 - 1;
                outPtr += step;
                if (outPtr >= outbuf.length) {
                    outPtr = 0;
                }
                outbuf[outPtr] = f;
                // outbuf[outPtr+ 1] = (byte)(st >> 8);
                sum = sum - (st << (7));
            } while (end-- > 0);
            this.blipBuffer.integrator = sum;
            this.remove_samples(count);
        }
        wavSharer.sharedAudioBufferPos = outPtr;
        wavSharer.audioBytesWritten += count;
        wavSharer.synchronize();
        return count;
    };
    Blip.prototype.blip_add_delta = function (time, delta) {
        if (delta === 0) {
            return;
        }
        var fixedTime = (time * this.blipBuffer.factor + this.blipBuffer.offset) | 0;
        var outPtr = (this.blipBuffer.avail + (fixedTime >> Blip.time_bits));
        var phase_shift = 16;
        //const phase = System.Int64.clip32(fixedTime.shr(phase_shift).and(System.Int64((Blip.phase_count - 1))));
        var phase = (fixedTime >> phase_shift & (Blip.phase_count - 1)) >>> 0;
        var inStep = phase; // bl_step[phase];
        var rev = Blip.phase_count - phase; // bl_step[phase_count - phase];
        var interp_bits = 15;
        var interp = (fixedTime >> (phase_shift - interp_bits) & ((1 << interp_bits) - 1));
        var delta2 = (delta * interp) >> interp_bits;
        delta -= delta2;
        /* Fails if buffer size was exceeded */
        //assert( out <= &BLIP_SAMPLES( s ) [s->size] );
        for (var i = 0; i < 8; ++i) {
            this.blipBuffer.samples[outPtr + i] += (Blip.bl_step[inStep][i] * delta) + (Blip.bl_step[inStep][i] * delta2);
            this.blipBuffer.samples[outPtr + (15 - i)] += (Blip.bl_step[rev][i] * delta) + (Blip.bl_step[rev - 1][i] * delta2);
        }
    };
    Blip.prototype.blip_add_delta_fast = function (time, delta) {
        var fixedTime = time * this.blipBuffer.factor + this.blipBuffer.offset;
        var outPtr = this.blipBuffer.avail + (fixedTime >> Blip.time_bits);
        var delta_unit = 1 << Blip.delta_bits;
        var phase_shift = Blip.time_bits - Blip.delta_bits;
        var phase = fixedTime >> phase_shift & (delta_unit - 1);
        var delta2 = delta * phase;
        /* Fails if buffer size was exceeded */
        //assert( out <= &BLIP_SAMPLES( s ) [s->size] );
        this.blipBuffer.samples[outPtr + 8] += delta * delta_unit - delta2;
        this.blipBuffer.samples[outPtr + 9] += delta2;
        //out [8] += delta * delta_unit - delta2;
        //out [9] += delta2;
    };
    Blip.time_unit = 2097152;
    Blip.buf_extra = 18;
    Blip.phase_count = 32;
    Blip.time_bits = 21;
    Blip.delta_bits = 15;
    //sinc values
    Blip.bl_step = [
        [43, -115, 350, -488, 1136, -914, 5861, 21022],
        [44, -118, 348, -473, 1076, -799, 5274, 21001],
        [45, -121, 344, -454, 1011, -677, 4706, 20936],
        [46, -122, 336, -431, 942, -549, 4156, 20829],
        [47, -123, 327, -404, 868, -418, 3629, 20679],
        [47, -122, 316, -375, 792, -285, 3124, 20488],
        [47, -120, 303, -344, 714, -151, 2644, 20256],
        [46, -117, 289, -310, 634, -17, 2188, 19985],
        [46, -114, 273, -275, 553, 117, 1758, 19675],
        [44, -108, 255, -237, 471, 247, 1356, 19327],
        [43, -103, 237, -199, 390, 373, 981, 18944],
        [42, -98, 218, -160, 310, 495, 633, 18527],
        [40, -91, 198, -121, 231, 611, 314, 18078],
        [38, -84, 178, -81, 153, 722, 22, 17599],
        [36, -76, 157, -43, 80, 824, -241, 17092],
        [34, -68, 135, -3, 8, 919, -476, 16558],
        [32, -61, 115, 34, -60, 1006, -683, 16001],
        [29, -52, 94, 70, -123, 1083, -862, 15422],
        [27, -44, 73, 106, -184, 1152, -1015, 14824],
        [25, -36, 53, 139, -239, 1211, -1142, 14210],
        [22, -27, 34, 170, -290, 1261, -1244, 13582],
        [20, -20, 16, 199, -335, 1301, -1322, 12942],
        [18, -12, -3, 226, -375, 1331, -1376, 12293],
        [15, -4, -19, 250, -410, 1351, -1408, 11638],
        [13, 3, -35, 272, -439, 1361, -1419, 10979],
        [11, 9, -49, 292, -464, 1362, -1410, 10319],
        [9, 16, -63, 309, -483, 1354, -1383, 9660],
        [7, 22, -75, 322, -496, 1337, -1339, 9005],
        [6, 26, -85, 333, -504, 1312, -1280, 8355],
        [4, 31, -94, 341, -507, 1278, -1205, 7713],
        [3, 35, -102, 347, -506, 1238, -1119, 7082],
        [1, 40, -110, 350, -499, 1190, -1021, 6464],
        [0, 43, -115, 350, -488, 1136, -914, 5861],
    ];
    return Blip;
}());
exports.Blip = Blip;
var PortWriteEntry = /** @class */ (function () {
    function PortWriteEntry(time, address, data) {
        this.time = time;
        this.address = address;
        this.data = data;
    }
    return PortWriteEntry;
}());
exports.PortWriteEntry = PortWriteEntry;
var QueuedPort = /** @class */ (function () {
    function QueuedPort() {
        this.array = new Array();
    }
    Object.defineProperty(QueuedPort.prototype, "Count", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    QueuedPort.prototype.clear = function () {
        this.array.length = 0;
    };
    QueuedPort.prototype.enqueue = function (item) {
        this.array.push(item);
    };
    QueuedPort.prototype.dequeue = function () {
        return this.array.pop();
    };
    return QueuedPort;
}());
exports.QueuedPort = QueuedPort;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var worker_interop_1 = __webpack_require__(3);
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiMachine_1 = __webpack_require__(4);
var ChiChiState_1 = __webpack_require__(13);
var CCMessage = __webpack_require__(14);
var NesInfo = /** @class */ (function () {
    function NesInfo() {
        this.bufferupdate = false;
        this.stateupdate = true;
        this.machine = {};
        this.cartInfo = {};
        this.sound = {};
        this.Cpu = {};
        this.Cart = {};
        this.debug = {
            currentCpuStatus: {
                PC: 0,
                A: 0,
                X: 0,
                Y: 0,
                SP: 0,
                SR: 0
            },
            currentPPUStatus: {}
        };
    }
    return NesInfo;
}());
var CommandHandler = /** @class */ (function () {
    function CommandHandler(command, handler) {
        this.command = command;
        this.handler = handler;
    }
    CommandHandler.prototype.process = function (command) {
        try {
            var cmdResp = this.handler(command);
            if (cmdResp) {
                return cmdResp;
            }
            return new CCMessage.WorkerResponse(command, true);
        }
        catch (e) {
            return new CCMessage.WorkerResponse(command, false, e.toString());
        }
    };
    return CommandHandler;
}());
var tendoWrapper = /** @class */ (function () {
    function tendoWrapper() {
        var _this = this;
        this.framesRendered = 0;
        this.startTime = 0;
        this.runTimeout = 0;
        this.Debugging = false;
        this.frameFinished = false;
        this.ready = false;
        this.framesPerSecond = 0;
        this.cartName = 'unk';
        this.sharedAudioBufferPos = 0;
        this.commands = new Array();
        this.buffers = {
            vbuffer: [],
            abuffer: []
        };
        // attach require.js "require" fn here in bootstrapper
        this.require = {};
        this.machine = new ChiChiMachine_1.ChiChiMachine();
        this.interop = new worker_interop_1.WorkerInterop(new Int32Array((new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT))));
        this.commands.push(new CommandHandler(CCMessage.CMD_CREATE, function (val) {
            return _this.createMachine(val);
        }));
        this.commands.push(new CommandHandler(CCMessage.CMD_LOADROM, function (val) {
            return _this.loadCart(val);
        }));
        this.commands.push(new CommandHandler(CCMessage.CMD_CHEAT, function (val) {
            return _this.cheat(val);
        }));
        this.commands.push(new CommandHandler(CCMessage.CMD_AUDIOSETTINGS, function (val) {
            _this.applyAudioSettings(val);
        }));
        this.commands.push(new CommandHandler(CCMessage.CMD_RUNSTATUS, function (val) {
            _this.changeRunStatus(val);
        }));
        this.commands.push(new CommandHandler(CCMessage.CMD_DEBUGSTEP, function (val) {
            _this.Debugging = true;
            switch (val.stepType) {
                case ChiChiTypes_1.DebugStepTypes.Frame:
                    _this.debugRunFrame();
                    break;
                case ChiChiTypes_1.DebugStepTypes.Instruction:
                    _this.debugRunStep();
                    break;
            }
            _this.updateState();
        }));
        this.commands.push(new CommandHandler(CCMessage.CMD_RESET, function (val) {
            _this.machine.Reset();
        }));
    }
    tendoWrapper.prototype.createMachine = function (message) {
        var _this = this;
        this.machine = new ChiChiMachine_1.ChiChiMachine();
        this.machine.Cpu.ppu.byteOutBuffer = this.buffers.vbuffer = message.vbuffer;
        this.machine.SoundBopper.writer.SharedBuffer = this.buffers.abuffer = message.abuffer;
        this.interop = new worker_interop_1.WorkerInterop(message.iops);
        this.machine.SoundBopper.audioSettings = message.audioSettings;
        this.machine.Drawscreen = function () {
            // flush audio
            // globals.postMessage({ frame: true, fps: framesPerSecond });
        };
        this.ready = true;
        this.machine.Cpu.FireDebugEvent = function () {
            var info = new NesInfo();
            info.debug = {
                currentCpuStatus: _this.machine.Cpu.GetStatus ? _this.machine.Cpu.GetStatus() : {
                    PC: 0,
                    A: 0,
                    X: 0,
                    Y: 0,
                    SP: 0,
                    SR: 0
                },
                currentPPUStatus: _this.machine.ppu.GetPPUStatus ? _this.machine.ppu.GetPPUStatus() : {},
                InstructionHistory: {
                    Buffer: _this.machine.Cpu.InstructionHistory.slice(0),
                    Index: _this.machine.Cpu.InstructionHistoryPointer,
                    Finish: false
                }
            };
            postMessage(info);
            //this.updateState();
        };
        this.machine.Cpu.Debugging = false;
        return new CCMessage.WorkerResponse(message, true);
    };
    tendoWrapper.prototype.updateBuffers = function () {
        var machine = this.machine;
        var info = new NesInfo();
        info.bufferupdate = true;
        info.stateupdate = false;
        if (this.machine && this.machine.Cart) {
            info.Cpu = {
                Rams: this.machine.Cpu.Rams,
                spriteRAM: this.machine.Cpu.ppu.spriteRAM
            };
            info.Cart = {
                //buffers
                chrRom: this.machine.Cart.chrRom,
                prgRomBank6: this.machine.Cart.prgRomBank6,
                ppuBankStarts: this.machine.Cart.ppuBankStarts,
                bankStartCache: this.machine.Cart.bankStartCache,
            };
            info.sound = {
                waveForms_controlBuffer: this.machine.WaveForms.controlBuffer
            };
        }
        postMessage(info);
    };
    tendoWrapper.prototype.updateState = function () {
        var machine = this.machine;
        var info = new NesInfo();
        if (this.machine && this.machine.Cart) {
            info.machine = {
                runStatus: this.runStatus
            };
            info.Cpu = {
                //Rams: this.machine.Cpu.Rams,
                status: this.machine.Cpu.GetStatus(),
                ppuStatus: this.machine.Cpu.ppu.GetPPUStatus(),
                backgroundPatternTableIndex: this.machine.Cpu.ppu.backgroundPatternTableIndex,
                _PPUControlByte0: this.machine.Cpu.ppu._PPUControlByte0,
                _PPUControlByte1: this.machine.Cpu.ppu._PPUControlByte1
            };
            info.cartInfo = {
                mapperId: this.machine.Cart.MapperID,
                name: this.cartName,
                prgRomCount: this.machine.Cart.NumberOfPrgRoms,
                chrRomCount: this.machine.Cart.NumberOfChrRoms
            };
            info.Cart = {
                //buffers
                //chrRom: (<any>this.machine.Cart).chrRom,
                //prgRomBank6: (<any>this.machine.Cart).prgRomBank6,
                //ppuBankStarts: (<any>this.machine.Cart).ppuBankStarts,
                //bankStartCache: (<any>this.machine.Cart).bankStartCache,
                CurrentBank: this.machine.Cart.CurrentBank,
                // integers
                current8: this.machine.Cart.current8,
                currentA: this.machine.Cart.currentA,
                currentC: this.machine.Cart.currentC,
                currentE: this.machine.Cart.currentE,
                bank8start: this.machine.Cart.bank8start,
                bankAstart: this.machine.Cart.bankAstart,
                bankCstart: this.machine.Cart.bankCstart,
                bankEstart: this.machine.Cart.bankEstart
            };
        }
        if (machine) {
            if (machine.SoundBopper && machine.SoundBopper.audioSettings) {
                info.sound = {
                    soundEnabled: machine.EnableSound,
                    settings: machine.SoundBopper.audioSettings
                };
            }
            if (this.machine.Cpu.Debugging) {
                info.debug = {
                    currentCpuStatus: this.machine.Cpu.GetStatus ? this.machine.Cpu.GetStatus() : {
                        PC: 0,
                        A: 0,
                        X: 0,
                        Y: 0,
                        SP: 0,
                        SR: 0
                    },
                    currentPPUStatus: this.machine.ppu.GetPPUStatus ? this.machine.ppu.GetPPUStatus() : {},
                    InstructionHistory: {
                        Buffer: this.machine.Cpu.InstructionHistory.slice(0),
                        Index: this.machine.Cpu.InstructionHistoryPointer,
                        Finish: true
                    }
                };
            }
        }
        postMessage(info);
    };
    tendoWrapper.prototype.drawScreen = function () { };
    tendoWrapper.prototype.stop = function () {
        clearInterval(this.interval);
        this.machine.PowerOff();
        this.runStatus = this.machine.RunState;
    };
    tendoWrapper.prototype.changeRunStatus = function (data) {
        switch (data.status) {
            case ChiChiTypes_1.RunningStatuses.Off:
                this.stop();
                break;
            case ChiChiTypes_1.RunningStatuses.Running:
                if (this.runStatus === ChiChiTypes_1.RunningStatuses.Paused) {
                    this.run(false);
                }
                else {
                    this.run(true);
                }
                break;
            case ChiChiTypes_1.RunningStatuses.Paused:
                clearInterval(this.interval);
                break;
            case ChiChiTypes_1.RunningStatuses.Unloaded:
                clearInterval(this.interval);
                this.stop();
                break;
        }
        this.runStatus = data.status;
    };
    tendoWrapper.prototype.runInnerLoop = function () {
        this.machine.PadOne.padOneState = this.interop.controlPad0; // [this.interop.NES_CONTROL_PAD_0] & 0xFF;
        this.machine.PadTwo.padOneState = this.interop.controlPad1; // [this.interop.NES_CONTROL_PAD_1] & 0xFF;
        this.machine.RunFrame();
        this.framesPerSecond = 0;
        if ((this.framesRendered++) === 60) {
            this.framesPerSecond = ((this.framesRendered / (new Date().getTime() - this.startTime)) * 1000);
            this.framesRendered = 0;
            this.startTime = new Date().getTime();
            this.interop.fps = this.framesPerSecond;
        }
    };
    tendoWrapper.prototype.run = function (reset) {
        var _this = this;
        var framesRendered = 0;
        var machine = this.machine;
        if (reset) {
            machine.Reset();
        }
        clearInterval(this.interval);
        this.interval = setInterval(function () {
            machine.Cpu.Debugging = false;
            machine.WaveForms.audioBytesWritten = 0;
            machine.WaveForms.sharedAudioBufferPos = 0;
            _this.startTime = new Date().getTime();
            _this.interop.loop();
            while (_this.interop.looping) {
                _this.runInnerLoop();
            }
        }, 0);
        this.runStatus = machine.RunState; // runStatuses.Running;
    };
    tendoWrapper.prototype.debugRunFrame = function () {
        clearInterval(this.interval);
        this.frameFinished = false;
        var machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        // intervalId = setInterval(() => 
        machine.RunFrame();
        this.runStatus = this.machine.RunState;
        this.frameFinished = true;
    };
    tendoWrapper.prototype.debugRunStep = function () {
        clearInterval(this.interval);
        var machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        machine.Step();
        this.runStatus = this.machine.RunState;
    };
    tendoWrapper.prototype.loadCart = function (cmd) {
        var _this = this;
        var loader;
        this.require({
            baseUrl: "./assets"
        }, ['romloader.worker'], function (romloader) {
            var machine = _this.machine;
            var cart = romloader.loader.loadRom(cmd.rom, cmd.name);
            cart.installCart(_this.machine.ppu, _this.machine.Cpu);
            machine.Cart.NMIHandler = function () { _this.machine.Cpu._handleIRQ = true; };
            _this.machine.Cpu.cheating = false;
            _this.machine.Cpu.genieCodes = new Array();
            _this.updateBuffers();
            delete romloader.loader;
            _this.require.undef('romloader.worker');
        });
        return new CCMessage.WorkerResponse(cmd, true);
    };
    tendoWrapper.prototype.cheat = function (data) {
        this.machine.Cpu.cheating = data.cheats.length > 0;
        this.machine.Cpu.genieCodes = data.cheats;
        return new CCMessage.WorkerResponse(data, true);
    };
    tendoWrapper.prototype.applyAudioSettings = function (data) {
        this.machine.SoundBopper.audioSettings = data.audioSettings;
    };
    tendoWrapper.prototype.handleMessage = function (event) {
        var handler = this.commands.find(function (c) { return c.command == event.data.command; });
        if (handler) {
            var resp = handler.process(event.data);
            postMessage(resp);
            this.updateState();
            return;
        }
        var machine = this.machine;
        switch (event.data.command) {
            case 'getstate':
                var state = new ChiChiState_1.ChiChiStateManager().read(this.machine);
                postMessage({ state: state });
                break;
            case 'setstate':
                new ChiChiState_1.ChiChiStateManager().write(this.machine, event.data.state);
                break;
            default:
                return;
        }
        this.updateState();
    };
    return tendoWrapper;
}());
exports.tendoWrapper = tendoWrapper;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WorkerInterop = /** @class */ (function () {
    function WorkerInterop(interopBuffer) {
        this.interopBuffer = interopBuffer;
        this.NES_GAME_LOOP_CONTROL = 0;
        this.NES_FPS = 1;
        this.NES_CONTROL_PAD_0 = 2;
        this.NES_AUDIO_AVAILABLE = 3;
        this.NES_CONTROL_PAD_1 = 4;
    }
    WorkerInterop.prototype.loop = function () {
        Atomics.store(this.interopBuffer, this.NES_GAME_LOOP_CONTROL, 1);
    };
    WorkerInterop.prototype.unloop = function () {
        Atomics.store(this.interopBuffer, this.NES_GAME_LOOP_CONTROL, 0);
    };
    Object.defineProperty(WorkerInterop.prototype, "looping", {
        get: function () {
            return this.interopBuffer[this.NES_GAME_LOOP_CONTROL] > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkerInterop.prototype, "fps", {
        get: function () {
            return this.interopBuffer[this.NES_FPS] & 0xff;
        },
        set: function (val) {
            this.interopBuffer[this.NES_FPS] = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkerInterop.prototype, "controlPad0", {
        get: function () {
            return this.interopBuffer[this.NES_CONTROL_PAD_0] & 0xff;
        },
        set: function (val) {
            this.interopBuffer[this.NES_CONTROL_PAD_0] = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkerInterop.prototype, "controlPad1", {
        get: function () {
            return this.interopBuffer[this.NES_CONTROL_PAD_1] & 0xff;
        },
        set: function (val) {
            this.interopBuffer[this.NES_CONTROL_PAD_1] = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkerInterop.prototype, "audioAvailable", {
        get: function () {
            return this.interopBuffer[this.NES_AUDIO_AVAILABLE];
        },
        set: function (val) {
            this.interopBuffer[this.NES_AUDIO_AVAILABLE] = val;
        },
        enumerable: true,
        configurable: true
    });
    return WorkerInterop;
}());
exports.WorkerInterop = WorkerInterop;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiAudio_1 = __webpack_require__(5);
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiPPU_1 = __webpack_require__(10);
var CommonAudio_1 = __webpack_require__(1);
var ChiChiCPU_1 = __webpack_require__(11);
//machine wrapper
var ChiChiMachine = /** @class */ (function () {
    function ChiChiMachine(cpu) {
        var _this = this;
        this.frameJustEnded = true;
        this.frameOn = false;
        this.totalCPUClocks = 0;
        this._enableSound = false;
        this.evenFrame = true;
        var wavSharer = new CommonAudio_1.WavSharer();
        this.SoundBopper = new ChiChiAudio_1.ChiChiAPU(wavSharer);
        this.WaveForms = wavSharer;
        this.ppu = new ChiChiPPU_1.ChiChiPPU();
        this.Cpu = cpu ? cpu : new ChiChiCPU_1.ChiChiCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.ppu.NMIHandler = function () { _this.Cpu.nmiHandler(); };
        this.SoundBopper.irqHandler = function () { _this.Cpu.irqUpdater(); };
        this.ppu.frameFinished = function () { _this.frameFinished(); };
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
            this._enableSound = value;
            if (this._enableSound) {
                this.SoundBopper.rebuildSound();
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
    ChiChiMachine.prototype.Reset = function () {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            this.Cart.InitializeCart(true);
            this.Cpu.ResetCPU();
            this.SoundBopper.rebuildSound();
            //ClearGenieCodes();
            //this.Cpu.PowerOn();
            this.RunState = ChiChiTypes_1.RunningStatuses.Running;
        }
    };
    ChiChiMachine.prototype.PowerOn = function () {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            this.Cart.InitializeCart();
            this.Cpu.ppu.Initialize();
            this.SoundBopper.rebuildSound();
            this.Cpu.PowerOn();
            this.RunState = ChiChiTypes_1.RunningStatuses.Running;
        }
    };
    ChiChiMachine.prototype.PowerOff = function () {
        this.RunState = ChiChiTypes_1.RunningStatuses.Off;
    };
    ChiChiMachine.prototype.Step = function () {
        if (this.frameJustEnded) {
            this.frameOn = true;
            this.frameJustEnded = false;
        }
        this.Cpu.Step();
        if (!this.frameOn) {
            this.totalCPUClocks = 0;
            this.Cpu.Clock = 0;
            this.ppu.LastcpuClock = 0;
            this.frameJustEnded = true;
        }
    };
    ChiChiMachine.prototype.RunFrame = function () {
        this.frameOn = true;
        this.frameJustEnded = false;
        do {
            this.Cpu.Step();
        } while (this.frameOn);
        this.totalCPUClocks = 0;
        this.Cpu.Clock = 0;
        this.ppu.LastcpuClock = 0;
    };
    ChiChiMachine.prototype.EjectCart = function () {
        this.Cpu.Cart = null;
        this.ppu.chrRomHandler = null;
    };
    ChiChiMachine.prototype.LoadNSF = function (rom) {
    };
    ChiChiMachine.prototype.frameFinished = function () {
        this.frameJustEnded = true;
        this.frameOn = false;
        this.Drawscreen();
    };
    ChiChiMachine.prototype.dispose = function () {
    };
    return ChiChiMachine;
}());
exports.ChiChiMachine = ChiChiMachine;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DMCChannel_1 = __webpack_require__(6);
var SquareChannel_1 = __webpack_require__(7);
var TriangleChannel_1 = __webpack_require__(8);
var NoiseChannel_1 = __webpack_require__(9);
var CommonAudio_1 = __webpack_require__(1);
var ChiChiAPU = /** @class */ (function () {
    function ChiChiAPU(writer) {
        this.writer = writer;
        this.frameMode = false;
        this.throwingIRQs = false;
        this.reg15 = 0;
        this._sampleRate = 44100;
        this.master_vol = 4369;
        this.square0Gain = 873;
        this.square1Gain = 873;
        this.triangleGain = 1004;
        this.noiseGain = 567;
        this.muted = false;
        this.lastFrameHit = 0;
        this.currentClock = 0;
        this.frameClocker = 0;
        //Muted: boolean;
        this.interruptRaised = false;
        this.sequence4 = [7457, 14913, 22371, 29828, 29829, 29831];
        this.sequence5 = [7457, 14913, 22371, 37281, 37282, 37283];
        this.rebuildSound();
    }
    ChiChiAPU.prototype.irqHandler = function () {
    };
    Object.defineProperty(ChiChiAPU.prototype, "audioSettings", {
        get: function () {
            var settings = {
                sampleRate: this._sampleRate,
                master_volume: 1.0,
                enableSquare0: this.enableSquare0,
                enableSquare1: this.enableSquare1,
                enableTriangle: this.enableTriangle,
                enableNoise: this.enableNoise,
                enablePCM: false,
                synced: this.writer.synced
            };
            return settings;
        },
        set: function (value) {
            this.enableNoise = value.enableNoise;
            this.enableSquare0 = value.enableSquare0;
            this.enableSquare1 = value.enableSquare1;
            this.enableTriangle = value.enableTriangle;
            this.writer.synced = value.synced;
            if (value.sampleRate != this._sampleRate) {
                this._sampleRate = value.sampleRate;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiAPU.prototype, "sampleRate", {
        get: function () {
            return this._sampleRate;
        },
        set: function (value) {
            this._sampleRate = value;
            this.rebuildSound();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiAPU.prototype, "enableSquare0", {
        get: function () {
            return this.square0.gain > 0;
        },
        set: function (value) {
            this.square0.gain = value ? this.square0Gain : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiAPU.prototype, "enableSquare1", {
        get: function () {
            return this.square1.gain > 0;
        },
        set: function (value) {
            this.square1.gain = value ? this.square1Gain : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiAPU.prototype, "enableTriangle", {
        get: function () {
            return this.triangle.gain > 0;
        },
        set: function (value) {
            this.triangle.gain = value ? this.triangleGain : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiAPU.prototype, "enableNoise", {
        get: function () {
            return this.noise.gain > 0;
        },
        set: function (value) {
            this.noise.gain = value ? this.noiseGain : 0;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiAPU.prototype.rebuildSound = function () {
        this.myBlipper = new CommonAudio_1.Blip(this._sampleRate / 5);
        this.myBlipper.blip_set_rates(ChiChiAPU.clock_rate, this._sampleRate);
        //this.writer = new ChiChiNES.BeepsBoops.WavSharer();
        this.writer.audioBytesWritten = 0;
        this.square0Gain = 873;
        this.square1Gain = 873;
        this.triangleGain = 1004;
        this.noiseGain = 567;
        this.square0 = new SquareChannel_1.SquareChannel(this.myBlipper, 0);
        this.square0.gain = this.square0Gain;
        this.square0.period = 10;
        this.square0.sweepComplement = true;
        this.square1 = new SquareChannel_1.SquareChannel(this.myBlipper, 0);
        this.square1.gain = this.square1Gain;
        this.square1.period = 10;
        this.square1.sweepComplement = false;
        this.triangle = new TriangleChannel_1.TriangleChannel(this.myBlipper, 2);
        this.triangle.gain = this.triangleGain;
        this.triangle.period = 0;
        this.noise = new NoiseChannel_1.NoiseChannel(this.myBlipper, 3);
        this.noise.gain = this.noiseGain;
        this.noise.period = 0;
        this.dmc = new DMCChannel_1.DMCChannel(this.myBlipper, 4, null);
    };
    ChiChiAPU.prototype.GetByte = function (Clock, address) {
        if (address === 0x4000) {
            this.interruptRaised = false;
        }
        if (address === 0x4015) {
            return ((this.square0.length > 0) ? 1 : 0) | ((this.square1.length > 0) ? 2 : 0) | ((this.triangle.length > 0) ? 4 : 0) | ((this.square0.length > 0) ? 8 : 0) | (this.interruptRaised ? 64 : 0);
        }
        else {
            return 66;
        }
    };
    ChiChiAPU.prototype.SetByte = function (clock, address, data) {
        if (address === 16384) {
            this.interruptRaised = false;
        }
        switch (address) {
            case 0x4000:
            case 0x4001:
            case 0x4002:
            case 0x4003:
                this.square0.writeRegister(address - 0x4000, data, clock);
                break;
            case 0x4004:
            case 0x4005:
            case 0x4006:
            case 0x4007:
                this.square1.writeRegister(address - 0x4004, data, clock);
                break;
            case 0x4008:
            case 0x4009:
            case 0x400a:
            case 0x400b:
                this.triangle.writeRegister(address - 0x4008, data, clock);
                break;
            case 0x400c:
            case 0x400d:
            case 0x400e:
            case 0x400f:
                this.noise.writeRegister(address - 0x400c, data, clock);
                break;
            case 0x4010:
            case 0x4011:
            case 0x4012:
            case 0x4013:
                this.dmc.WriteRegister(address - 0x40010, data, clock);
                break;
            case 0x4015:
                this.reg15 = data;
                this.square0.writeRegister(4, data & 1, clock);
                this.square1.writeRegister(4, data & 2, clock);
                this.triangle.writeRegister(4, data & 4, clock);
                this.noise.writeRegister(4, data & 8, clock);
                break;
            case 0x4017:
                this.throwingIRQs = ((data & 64) !== 64);
                this.frameMode = ((data & 128) == 128);
                //this.endFrame(clock);
                //this.lastFrameHit = 0;
                break;
        }
    };
    ChiChiAPU.prototype.advanceClock = function (ticks) {
        this.currentClock += ticks;
        this.frameClocker += ticks;
        var nextStep = this.frameMode ? this.sequence5[this.lastFrameHit] : this.sequence4[this.lastFrameHit];
        if (this.frameClocker >= nextStep) {
            this.updateFrame(this.currentClock);
        }
    };
    ChiChiAPU.prototype.updateFrame = function (time) {
        this.runFrameEvents(time, this.lastFrameHit);
        if (this.lastFrameHit === (this.frameMode ? 4 : 3)) {
            this.lastFrameHit = 0;
            this.frameClocker = 0;
            this.endFrame(time);
            if (this.throwingIRQs && !this.frameMode) {
                this.interruptRaised = true;
                this.irqHandler();
            }
        }
        else {
            this.lastFrameHit++;
        }
    };
    ChiChiAPU.prototype.runFrameEvents = function (time, step) {
        this.triangle.frameClock(time, step);
        this.noise.FrameClock(time, step);
        this.square0.frameClock(time, step);
        this.square1.frameClock(time, step);
        this.dmc.FrameClock(time, step);
    };
    ChiChiAPU.prototype.endFrame = function (time) {
        this.square0.endFrame(time);
        this.square1.endFrame(time);
        this.triangle.endFrame(time);
        this.noise.EndFrame(time);
        this.myBlipper.blip_end_frame(time);
        this.myBlipper.ReadElementsLoop(this.writer);
        this.currentClock = 0;
    };
    Object.defineProperty(ChiChiAPU.prototype, "state", {
        get: function () {
            return {
                audioSettings: this.audioSettings,
                sampleRate: this.sampleRate,
                interruptRaised: this.interruptRaised,
                enableSquare0: this.enableSquare0,
                enableSquare1: this.enableSquare1,
                enableTriangle: this.enableTriangle,
                enableNoise: this.enableNoise
            };
        },
        set: function (value) {
            this.audioSettings = value.audioSettings;
            this.sampleRate = value.sampleRate;
            this.interruptRaised = value.interruptRaised;
            this.enableSquare0 = value.enableSquare0;
            this.enableSquare1 = value.enableSquare1;
            this.enableTriangle = value.enableTriangle;
            this.enableNoise = value.enableNoise;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiAPU.clock_rate = 1789772.727;
    return ChiChiAPU;
}());
exports.ChiChiAPU = ChiChiAPU;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DMCChannel = /** @class */ (function () {
    function DMCChannel(bleeper, chan, cpu) {
        this.cpu = cpu;
        this.internalClock = 0;
        this.fetching = false;
        this.buffer = 0;
        this.bufempty = false;
        this.outbits = 0;
        this.freqTable = [
            0x1AC, 0x17C, 0x154, 0x140, 0x11E, 0x0FE, 0x0E2, 0x0D6,
            0x0BE, 0x0A0, 0x08E, 0x080, 0x06A, 0x054, 0x048, 0x036,
        ];
        this.shiftreg = 0;
        this.silenced = false;
        this.cycles = 0;
        this.curAddr = 0;
        this.lengthCtr = 0;
        this.length = 0;
        this.addr = 0;
        this.pos = 0;
        this.pcmdata = 0;
        this.doirq = 0;
        this.frequency = 0;
        this.wavehold = 0;
        this._chan = 0;
        this.delta = 0;
        this._bleeper = null;
        this._bleeper = bleeper;
        this._chan = chan;
    }
    DMCChannel.prototype.WriteRegister = function (register, data, time) {
        switch (register) {
            case 0:
                this.frequency = data & 0xF;
                this.wavehold = (data >> 6) & 0x1;
                this.doirq = data >> 7;
                if (!this.doirq) {
                    //CPU::WantIRQ &= ~IRQ_DPCM;
                }
                break;
            case 1:
                this.pcmdata = data & 0x7F;
                this.pos = (this.pcmdata - 0x40) * 3;
                break;
            case 2:
                this.addr = data;
                break;
            case 3:
                this.length = data;
                break;
            case 4:
                if (data) {
                    if (!this.lengthCtr) {
                        this.curAddr = 0xC000 | (this.addr << 6);
                        this.lengthCtr = (this.length << 4) + 1;
                    }
                }
                else {
                    this.lengthCtr = 0;
                }
                // CPU::WantIRQ &= ~IRQ_DPCM;
                break;
        }
    };
    DMCChannel.prototype.Run = function (end_time) {
        // this uses pre-decrement due to the lookup table
        for (; this.time < end_time; this.time++) {
            for (var i = 0; i < 8; ++i) {
                if (!--this.cycles) {
                    this.cycles = this.freqTable[this.frequency];
                    if (!this.silenced) {
                        if (this.shiftreg & 1) {
                            if (this.pcmdata <= 0x7D)
                                this.pcmdata += 2;
                        }
                        else {
                            if (this.pcmdata >= 0x02)
                                this.pcmdata -= 2;
                        }
                        this.shiftreg >>= 1;
                        this.pos = (this.pcmdata - 0x40) * 3;
                        this._bleeper.blip_add_delta(this.time, this.pcmdata);
                    }
                    if (!--this.outbits) {
                        this.outbits = 8;
                        if (!this.bufempty) {
                            this.shiftreg = this.buffer;
                            this.bufempty = true;
                            this.silenced = false;
                        }
                        else {
                            this.silenced = true;
                        }
                    }
                }
                if (this.bufempty && !this.fetching && this.lengthCtr && (this.internalClock & 1)) {
                    this.fetching = true;
                    //CPU::EnableDMA |= DMA_PCM;
                    // decrement LengthCtr now, so $4015 reads are updated in time
                    this.lengthCtr--;
                }
            }
        }
    };
    DMCChannel.prototype.fetch = function () {
        this.buffer = this.cpu.GetByte(this.curAddr);
        this.bufempty = false;
        this.fetching = false;
        if (++this.curAddr == 0x10000)
            this.curAddr = 0x8000;
        if (!this.lengthCtr) {
            if (this.wavehold) {
                this.curAddr = 0xC000 | (this.addr << 6);
                this.lengthCtr = (this.length << 4) + 1;
            }
            else if (this.doirq) {
                this.cpu._handleIRQ = true;
            }
        }
    };
    DMCChannel.prototype.EndFrame = function (time) {
        this.Run(time);
    };
    DMCChannel.prototype.FrameClock = function (time, step) {
        this.Run(time);
    };
    return DMCChannel;
}());
exports.DMCChannel = DMCChannel;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SquareChannel = /** @class */ (function () {
    function SquareChannel(bleeper, chan) {
        this._chan = 0;
        this._bleeper = null;
        this.lengthCounts = new Uint8Array([
            0x0A, 0xFE,
            0x14, 0x02,
            0x28, 0x04,
            0x50, 0x06,
            0xA0, 0x08,
            0x3C, 0x0A,
            0x0E, 0x0C,
            0x1A, 0x0E,
            0x0C, 0x10,
            0x18, 0x12,
            0x30, 0x14,
            0x60, 0x16,
            0xC0, 0x18,
            0x48, 0x1A,
            0x10, 0x1C,
            0x20, 0x1E
        ]);
        this._length = 0;
        this.period = 0;
        this._rawTimer = 0;
        this.volume = 0;
        this.time = 0;
        this.envelope = 0;
        this.looping = false;
        this.enabled = false;
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
        this._envTimer = 0;
        this._envStart = false;
        this._envConstantVolume = false;
        this._envVolume = 0;
        this.gain = 0;
        this.sweepComplement = false;
        this.dutyCycle = 0;
        this._bleeper = bleeper;
        this._chan = chan;
        this.enabled = true;
        this._sweepDivider = 1;
        this._envTimer = 15;
    }
    // functions
    SquareChannel.prototype.writeRegister = function (register, data, time) {
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
    };
    SquareChannel.prototype.run = function (end_time) {
        var period = this._sweepEnabled ? ((this.period + 1) & 0x7FF) << 1 : ((this._rawTimer + 1) & 0x7FF) << 1;
        if (period === 0) {
            this.time = end_time;
            this.updateAmplitude(0);
            return;
        }
        var volume = this._envConstantVolume ? this.volume : this._envVolume;
        if (this._length === 0 || volume === 0 || this._sweepInvalid) {
            this._phase += ((end_time - this.time) / period) & 7;
            this.time = end_time;
            this.updateAmplitude(0);
            return;
        }
        for (; this.time < end_time; this.time += period, this._phase++) {
            this.updateAmplitude((this.dutyCycle >> (this._phase & 7) & 1) * volume);
        }
        this._phase &= 7;
    };
    SquareChannel.prototype.updateAmplitude = function (new_amp) {
        var delta = new_amp * this.gain - this._amplitude;
        this._amplitude += delta;
        this._bleeper.blip_add_delta(this.time, delta);
    };
    SquareChannel.prototype.endFrame = function (time) {
        this.run(time);
        this.time = 0;
    };
    SquareChannel.prototype.frameClock = function (time, step) {
        this.run(time);
        if (!this._envStart) {
            this._envTimer--;
            if (this._envTimer === 0) {
                this._envTimer = this.volume + 1;
                if (this._envVolume > 0) {
                    this._envVolume--;
                }
                else {
                    this._envVolume = this.looping ? 15 : 0;
                }
            }
        }
        else {
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
                        }
                        else {
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
    };
    return SquareChannel;
}());
exports.SquareChannel = SquareChannel;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TriangleChannel = /** @class */ (function () {
    function TriangleChannel(bleeper, chan) {
        this._chan = 0;
        this.lengthCounts = new Uint8Array([
            0x0A, 0xFE,
            0x14, 0x02,
            0x28, 0x04,
            0x50, 0x06,
            0xA0, 0x08,
            0x3C, 0x0A,
            0x0E, 0x0C,
            0x1A, 0x0E,
            0x0C, 0x10,
            0x18, 0x12,
            0x30, 0x14,
            0x60, 0x16,
            0xC0, 0x18,
            0x48, 0x1A,
            0x10, 0x1C,
            0x20, 0x1E
        ]);
        this.length = 0;
        this.period = 0;
        this.time = 0;
        this.envelope = 0;
        this.looping = false;
        this.enabled = false;
        this.amplitude = 0;
        this.gain = 0;
        this.linCtr = 0;
        this._phase = 0;
        this._linVal = 0;
        this.linStart = false;
        this._bleeper = bleeper;
        this._chan = chan;
        this.enabled = true;
    }
    TriangleChannel.prototype.writeRegister = function (register, data, time) {
        //Run(time);
        switch (register) {
            case 0:
                this.looping = (data & 0x80) === 0x80;
                this._linVal = data & 0x7F;
                break;
            case 1:
                break;
            case 2:
                this.period &= 0x700;
                this.period |= data;
                break;
            case 3:
                this.period &= 0xFF;
                this.period |= (data & 7) << 8;
                // setup lengthhave
                if (this.enabled) {
                    this.length = this.lengthCounts[(data >> 3) & 0x1f];
                }
                this.linStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this.length = 0;
                }
                break;
        }
    };
    TriangleChannel.prototype.run = function (end_time) {
        var period = this.period + 1;
        if (this.linCtr === 0 || this.length === 0 || this.period < 4) {
            // leave it at it's current phase
            this.time = end_time;
            return;
        }
        for (; this.time < end_time; this.time += period, this._phase = (this._phase + 1) % 32) {
            this.updateAmplitude(this._phase < 16 ? this._phase : 31 - this._phase);
        }
    };
    TriangleChannel.prototype.updateAmplitude = function (new_amp) {
        var delta = new_amp * this.gain - this.amplitude;
        this.amplitude += delta;
        this._bleeper.blip_add_delta(this.time, delta);
    };
    TriangleChannel.prototype.endFrame = function (time) {
        this.run(time);
        this.time = 0;
    };
    TriangleChannel.prototype.frameClock = function (time, step) {
        this.run(time);
        if (this.linStart) {
            this.linCtr = this._linVal;
        }
        else {
            if (this.linCtr > 0) {
                this.linCtr--;
            }
        }
        if (!this.looping) {
            this.linStart = false;
        }
        switch (step) {
            case 1:
            case 3:
                if (this.length > 0 && !this.looping) {
                    this.length--;
                }
                break;
        }
    };
    return TriangleChannel;
}());
exports.TriangleChannel = TriangleChannel;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NoiseChannel = /** @class */ (function () {
    function NoiseChannel(bleeper, chan) {
        this._bleeper = null;
        this._chan = 0;
        this.noisePeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
        this.lengthCounts = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
        this._time = 0;
        this._envConstantVolume = false;
        this._envVolume = 0;
        this.amplitude = 0;
        this._phase = 0;
        this._envTimer = 0;
        this._envStart = false;
        this.length = 0;
        this.period = 0;
        this.volume = 0;
        this.looping = false;
        this.gain = 0;
        this.enabled = true;
        this._bleeper = bleeper;
        this._chan = chan;
        this._phase = 1;
        this._envTimer = 15;
    }
    NoiseChannel.prototype.writeRegister = function (register, data, time) {
        // Run(time);
        switch (register) {
            case 0:
                this._envConstantVolume = (data & 16) === 16;
                this.volume = data & 15;
                this.looping = (data & 128) === 128;
                break;
            case 1:
                break;
            case 2:
                this.period = this.noisePeriods[data & 15];
                // _period |= data;
                break;
            case 3:
                // setup length
                if (this.enabled) {
                    this.length = this.lengthCounts[(data >> 3) & 31];
                }
                this._envStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this.length = 0;
                }
                break;
        }
    };
    NoiseChannel.prototype.Run = function (end_time) {
        var volume = this._envConstantVolume ? this.volume : this._envVolume;
        if (this.length === 0) {
            volume = 0;
        }
        if (this.period === 0) {
            this._time = end_time;
            this.UpdateAmplitude(0);
            return;
        }
        if (this._phase === 0) {
            this._phase = 1;
        }
        for (; this._time < end_time; this._time += this.period) {
            var new15;
            if (this.looping) {
                new15 = ((this._phase & 1) ^ ((this._phase >> 6) & 1));
            }
            else {
                new15 = ((this._phase & 1) ^ ((this._phase >> 1) & 1));
            }
            this.UpdateAmplitude(this._phase & 1 * volume);
            this._phase = ((this._phase >> 1) | (new15 << 14)) & 65535;
        }
    };
    NoiseChannel.prototype.UpdateAmplitude = function (amp) {
        var delta = amp * this.gain - this.amplitude;
        this.amplitude += delta;
        this._bleeper.blip_add_delta(this._time, delta);
    };
    NoiseChannel.prototype.EndFrame = function (time) {
        this.Run(time);
        this._time = 0;
    };
    NoiseChannel.prototype.FrameClock = function (time, step) {
        this.Run(time);
        if (!this._envStart) {
            this._envTimer--;
            if (this._envTimer === 0) {
                this._envTimer = this.volume + 1;
                if (this._envVolume > 0) {
                    this._envVolume--;
                }
                else {
                    this._envVolume = this.looping ? 15 : 0;
                }
            }
        }
        else {
            this._envStart = false;
            this._envTimer = this.volume + 1;
            this._envVolume = 15;
        }
        switch (step) {
            case 1:
            case 2:
                if (!this.looping && this.length > 0) {
                    this.length--;
                }
                break;
        }
    };
    return NoiseChannel;
}());
exports.NoiseChannel = NoiseChannel;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiPPU = /** @class */ (function () {
    function ChiChiPPU() {
        this.LastcpuClock = 0;
        this.greyScale = false;
        // private members
        // scanline position
        this.yPosition = 0;
        this.xPosition = 0;
        // current draw location in outbuffer    
        this.vbufLocation = 0;
        this.currentAttributeByte = 0;
        // sprite info
        this.spriteSize = 0;
        this.spritesOnThisScanline = 0;
        this._spriteCopyHasHappened = false;
        this.spriteZeroHit = false;
        this.emphasisBits = 0;
        this.isForegroundPixel = false;
        this.spriteChanges = false;
        this.ppuReadBuffer = 0;
        this._clipSprites = false;
        this._clipTiles = false;
        this._tilesAreVisible = false;
        this._spritesAreVisible = false;
        this.nameTableMemoryStart = 0;
        this.backgroundPatternTableIndex = 0;
        //PPU implementation
        this._PPUAddress = 0;
        this._PPUStatus = 0;
        this._PPUControlByte0 = 0;
        this._PPUControlByte1 = 0;
        this._spriteAddress = 0;
        this.currentXPosition = 0;
        this.currentYPosition = 0;
        this._hScroll = 0;
        this._vScroll = 0;
        this.lockedHScroll = 0;
        this.lockedVScroll = 0;
        //private scanlineNum = 0;
        //private scanlinePos = 0;
        this.shouldRender = false;
        //private NMIHasBeenThrownThisFrame = false;
        this._frames = 0;
        this.hitSprite = false;
        this.PPUAddressLatchIsHigh = true;
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
        this.xNTXor = 0;
        this.yNTXor = 0;
        this.spriteRAMBuffer = new SharedArrayBuffer(256 * Uint8Array.BYTES_PER_ELEMENT);
        this.spriteRAM = new Uint8Array(this.spriteRAMBuffer); // System.Array.init(256, 0, System.Int32);
        this.spritesOnLine = new Array(512); // System.Array.init(512, 0, System.Int32);
        this.currentTileIndex = 0;
        this.fetchTile = true;
        // tile bytes currently latched in ppu
        this.patternEntry = 0;
        this.patternEntryByte2 = 0;
        this.byteOutBuffer = new Uint8Array(256 * 256 * 4); // System.Array.init(262144, 0, System.Int32);
        this.oddFrame = true;
        this.initSprites();
    }
    Object.defineProperty(ChiChiPPU.prototype, "ChrRomHandler", {
        get: function () {
            return this.chrRomHandler;
        },
        set: function (value) {
            this.chrRomHandler = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiPPU.prototype, "NextEventAt", {
        get: function () {
            if (this.frameClock < 6820) {
                return (6820 - this.frameClock) / 3;
            }
            else {
                return (((89345 - this.frameClock) / 341) / 3);
            }
        },
        enumerable: true,
        configurable: true
    });
    ChiChiPPU.prototype.GetPPUStatus = function () {
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
    Object.defineProperty(ChiChiPPU.prototype, "PatternTableIndex", {
        get: function () {
            return this.backgroundPatternTableIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiPPU.prototype, "SpritePatternTableIndex", {
        get: function () {
            var spritePatternTable = 0;
            if ((this._PPUControlByte0 & 32) === 32) {
                spritePatternTable = 4096;
            }
            return spritePatternTable;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiPPU.prototype.Initialize = function () {
        this._PPUAddress = 0;
        this._PPUStatus = 0;
        this._PPUControlByte0 = 0;
        this._PPUControlByte1 = 0;
        this._hScroll = 0;
        this._vScroll = 0;
        //this.scanlineNum = 0;
        //this.scanlinePos = 0;
        this._spriteAddress = 0;
        this.initSprites();
    };
    ChiChiPPU.prototype.WriteState = function (writer) {
        throw new Error('Method not implemented.');
    };
    ChiChiPPU.prototype.ReadState = function (state) {
        throw new Error('Method not implemented.');
    };
    Object.defineProperty(ChiChiPPU.prototype, "NMIIsThrown", {
        get: function () {
            return (this._PPUControlByte0 & 128) === 128;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiPPU.prototype.setupVINT = function () {
        this._PPUStatus = this._PPUStatus | 128;
        this._frames = this._frames + 1;
        if (this._PPUControlByte0 & 128) {
            this.cpu._handleNMI = true;
        }
    };
    ChiChiPPU.prototype.VidRAM_GetNTByte = function (address) {
        var result = 0;
        if (address >= 8192 && address < 12288) {
            result = this.chrRomHandler.GetPPUByte(0, address);
        }
        else {
            result = this.chrRomHandler.GetPPUByte(0, address);
        }
        return result;
    };
    ChiChiPPU.prototype.SetByte = function (Clock, address, data) {
        switch (address & 7) {
            case 0:
                this._PPUControlByte0 = data;
                this._openBus = data;
                this.nameTableBits = this._PPUControlByte0 & 3;
                this.backgroundPatternTableIndex = ((this._PPUControlByte0 & 16) >> 4) * 0x1000;
                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 1:
                this.isRendering = (data & 0x18) !== 0;
                this._PPUControlByte1 = data;
                this.emphasisBits = (this._PPUControlByte1 >> 5) & 7;
                this.greyScale = (this._PPUControlByte1 & 0x1) === 0x1;
                this._clipTiles = (this._PPUControlByte1 & 0x02) !== 0x02;
                this._clipSprites = (this._PPUControlByte1 & 0x04) !== 0x04;
                this._tilesAreVisible = (this._PPUControlByte1 & 0x08) === 0x08;
                this._spritesAreVisible = (this._PPUControlByte1 & 0x10) === 0x10;
                break;
            case 2:
                this.ppuReadBuffer = data;
                this._openBus = data;
                break;
            case 3:
                this._spriteAddress = data & 0xFF;
                this._openBus = this._spriteAddress;
                break;
            case 4:
                this.spriteRAM[this._spriteAddress] = data;
                this._spriteAddress = (this._spriteAddress + 1) & 255;
                this.unpackedSprites[this._spriteAddress >> 2].Changed = true;
                this.spriteChanges = true;
                break;
            case 5:
                if (this.PPUAddressLatchIsHigh) {
                    this._hScroll = data;
                    this.lockedHScroll = this._hScroll & 7;
                    this.PPUAddressLatchIsHigh = false;
                }
                else {
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
                if (this.PPUAddressLatchIsHigh) {
                    this._PPUAddress = (this._PPUAddress & 0xFF) | ((data & 0x3F) << 8);
                    this.PPUAddressLatchIsHigh = false;
                }
                else {
                    this._PPUAddress = (this._PPUAddress & 0x7F00) | data & 0xFF;
                    this.PPUAddressLatchIsHigh = true;
                    this._hScroll = ((this._PPUAddress & 0x1f) << 3);
                    this._vScroll = (((this._PPUAddress >> 5) & 0x1f) << 3);
                    this._vScroll |= ((this._PPUAddress >> 12) & 3);
                    if (this.frameOn) {
                        this.lockedHScroll = this._hScroll;
                        this.lockedVScroll = this._vScroll;
                        this.lockedVScroll = this.lockedVScroll - this.currentYPosition;
                    }
                    this.nameTableBits = ((this._PPUAddress >> 10) & 3);
                    this.nameTableMemoryStart = this.nameTableBits * 0x400;
                }
                break;
            case 7:
                if ((this._PPUAddress & 0xFF00) === 0x3F00) {
                    var palAddress = (this._PPUAddress) & 0x1F;
                    this._palette[palAddress] = data;
                    if ((this._PPUAddress & 0xFFEF) === 0x3F00) {
                        this._palette[(palAddress ^ 16) & 0x1F] = data;
                    }
                }
                else {
                    // if ((this._PPUAddress & 0xF000) === 0x2000) {
                    //     this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
                    // }
                    this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
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
                this._PPUAddress = (this._PPUAddress & 0x3FFF);
                break;
        }
    };
    ChiChiPPU.prototype.GetByte = function (Clock, address) {
        switch (address & 7) {
            case 3:
            case 0:
            case 1:
            case 5:
            case 6:
                return this._openBus;
            case 2:
                var ret = 0;
                this.PPUAddressLatchIsHigh = true;
                ret = (this.ppuReadBuffer & 0x1F) | this._PPUStatus;
                if ((ret & 0x80) === 0x80) {
                    this._PPUStatus = this._PPUStatus & ~0x80;
                }
                return ret;
            case 4:
                return this.spriteRAM[this._spriteAddress];
            case 7:
                var tmp = 0;
                if ((this._PPUAddress & 0xFF00) === 0x3F00) {
                    tmp = this._palette[this._PPUAddress & 0x1F];
                    this.ppuReadBuffer = this.chrRomHandler.GetPPUByte(Clock, this._PPUAddress - 4096);
                }
                else {
                    tmp = this.ppuReadBuffer;
                    if (this._PPUAddress >= 0x2000 && this._PPUAddress <= 0x2FFF) {
                        this.ppuReadBuffer = this.chrRomHandler.GetPPUByte(Clock, this._PPUAddress);
                    }
                    else {
                        this.ppuReadBuffer = this.chrRomHandler.GetPPUByte(Clock, this._PPUAddress & 0x3FFF);
                    }
                }
                if ((this._PPUControlByte0 & 4) === 4) {
                    this._PPUAddress = this._PPUAddress + 32;
                }
                else {
                    this._PPUAddress = this._PPUAddress + 1;
                }
                this._PPUAddress = (this._PPUAddress & 0x3FFF);
                return tmp;
        }
        return 0;
    };
    ChiChiPPU.prototype.copySprites = function (copyFrom) {
        for (var i = 0; i < 256; ++i) {
            var spriteLocation = (this._spriteAddress + i) & 255;
            if (this.spriteRAM[spriteLocation] !== this.cpu.Rams[copyFrom + i]) {
                this.spriteRAM[spriteLocation] = this.cpu.Rams[copyFrom + i];
                this.unpackedSprites[(spriteLocation >> 2) & 255].Changed = true;
            }
        }
        this._spriteCopyHasHappened = true;
        this.spriteChanges = true;
    };
    ChiChiPPU.prototype.initSprites = function () {
        this.currentSprites = new Array(this._maxSpritesPerScanline);
        for (var i = 0; i < this._maxSpritesPerScanline; ++i) {
            this.currentSprites[i] = new ChiChiTypes_1.ChiChiSprite();
        }
        this.unpackedSprites = new Array(64);
        for (var i = 0; i < 64; ++i) {
            this.unpackedSprites[i] = new ChiChiTypes_1.ChiChiSprite();
        }
    };
    ChiChiPPU.prototype.getSpritePixel = function () {
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
                var patternEntry = 0;
                var patternEntryBit2 = 0;
                if (currSprite.FlipY) {
                    yLine = this.spriteSize - yLine - 1;
                }
                if (yLine >= 8) {
                    yLine += 8;
                }
                patternEntry = this.chrRomHandler.GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine);
                patternEntryBit2 = this.chrRomHandler.GetPPUByte(0, spritePatternTable + tileIndex * 16 + yLine + 8);
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
    ChiChiPPU.prototype.decodeSpritePixel = function (patternTableIndex, x, y, sprite, tileIndex) {
        // 8x8 tile
        var patternEntry = 0;
        var patternEntryBit2 = 0;
        if (sprite.v.FlipY) {
            y = this.spriteSize - y - 1;
        }
        if (y >= 8) {
            y += 8;
        }
        var dataAddress = patternTableIndex + (tileIndex << 4) + y;
        patternEntry = this.chrRomHandler.GetPPUByte(this.LastcpuClock, dataAddress);
        patternEntryBit2 = this.chrRomHandler.GetPPUByte(this.LastcpuClock, dataAddress + 8);
        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    };
    ChiChiPPU.prototype.preloadSprites = function (scanline) {
        this.spritesOnThisScanline = 0;
        this.sprite0scanline = -1;
        var yLine = this.currentYPosition - 1;
        for (var spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            var spriteID = ((spriteNum + this._spriteAddress) & 0xff) >> 2;
            var y = this.unpackedSprites[spriteID].YPosition + 1;
            if (scanline >= y && scanline < y + this.spriteSize) {
                if (spriteID === 0) {
                    this.sprite0scanline = scanline;
                    this.sprite0x = this.unpackedSprites[spriteID].XPosition;
                }
                // var spId = spriteNum >> 2;
                // if (spId < 32) {
                //     this.outBuffer[(64768) + yLine] |= 1 << spId;
                // } else {
                //     this.outBuffer[(65024) + yLine] |= 1 << (spId - 32);
                // }
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
    ChiChiPPU.prototype.unpackSprites = function () {
        for (var currSprite = 0; currSprite < this.unpackedSprites.length; ++currSprite) {
            if (this.unpackedSprites[currSprite].Changed) {
                this.unpackSprite(currSprite);
            }
        }
    };
    ChiChiPPU.prototype.unpackSprite = function (currSprite) {
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
    ChiChiPPU.prototype.getNameTablePixel = function () {
        var result = ((this.patternEntry & 128) >> 7) | ((this.patternEntryByte2 & 128) >> 6);
        this.patternEntry <<= 1;
        this.patternEntryByte2 <<= 1;
        if (result > 0) {
            result |= this.currentAttributeByte;
        }
        return result & 255;
    };
    ChiChiPPU.prototype.getAttrEntry = function (ppuNameTableMemoryStart, i, j) {
        var LookUp = this.chrRomHandler.GetPPUByte(0, 8192 + ppuNameTableMemoryStart + 960 + (i >> 2) + ((j >> 2) * 8));
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
    ChiChiPPU.prototype.advanceClock = function (ticks) {
        var ppuTicks = ticks * 3;
        if (this.frameClock > 89002) {
            this.frameClock += ppuTicks;
            if (this.frameClock > 89342) {
                ppuTicks = this.frameClock - 89342;
            }
            else {
                return;
            }
        }
        while (ppuTicks--) {
            switch (this.frameClock) {
                case 0:// start of rendering
                    this.shouldRender = true;
                    this.vbufLocation = 0;
                    this.currentXPosition = 0;
                    this.currentYPosition = 0;
                    this.xNTXor = 0;
                    this.yNTXor = 0;
                    if ((this._PPUControlByte1 & 0x18) !== 0) {
                        this.oddFrame = !this.oddFrame;
                        this.isRendering = true;
                    }
                    break;
                case 81840:// ChiChiNES.CPU2A03.frameClockEnd:
                    this.shouldRender = false;
                    this.frameFinished();
                    this.frameOn = false;
                    break;
                case 82523:// first tick on scanline after post-render line
                    this.setupVINT();
                    break;
                case 89002:
                    this._PPUStatus = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this._PPUControlByte0 & 0x20) === 0x20) ? 16 : 8;
                    if (this.spriteChanges) {
                        this.unpackSprites();
                        this.spriteChanges = false;
                    }
                    this.frameOn = true;
                    if (this.oddFrame)
                        this.frameClock++;
                    break;
            }
            if (this.frameOn) {
                if (this.currentXPosition < 256 && this.vbufLocation < 61440) {
                    /* update x position */
                    this.xPosition = (this.currentXPosition + this.lockedHScroll);
                    if ((this.xPosition & 7) === 0) {
                        this.xNTXor = (this.xPosition & 0x100) ? 0x400 : 0;
                        this.xPosition &= 0xFF;
                        /* fetch next tile */
                        var ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
                        var xTilePosition = this.xPosition >> 3;
                        var tileRow = (this.yPosition >> 3) % 30 << 5;
                        var tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;
                        var tileIndex = this.chrRomHandler.GetPPUByte(this.LastcpuClock + ticks, tileNametablePosition);
                        var patternTableYOffset = this.yPosition & 7;
                        var patternID = this.backgroundPatternTableIndex + (tileIndex * 16) + patternTableYOffset;
                        this.patternEntry = this.chrRomHandler.GetPPUByte(this.LastcpuClock + ticks, patternID);
                        this.patternEntryByte2 = this.chrRomHandler.GetPPUByte(this.LastcpuClock + ticks, patternID + 8);
                        this.currentAttributeByte = this.getAttrEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                        /* end fetch next tile */
                    }
                    var tilesVis = this._tilesAreVisible;
                    var spriteVis = this._spritesAreVisible;
                    if (this.currentXPosition < 8) {
                        tilesVis = tilesVis && !this._clipTiles;
                        spriteVis = tilesVis && !this._clipSprites;
                    }
                    this.spriteZeroHit = false;
                    var tilePixel = tilesVis ? this.getNameTablePixel() : 0;
                    var spritePixel = spriteVis ? this.getSpritePixel() : 0;
                    if (!this.hitSprite && this.spriteZeroHit && tilePixel !== 0) {
                        this.hitSprite = true;
                        this._PPUStatus = this._PPUStatus | 64;
                    }
                    this.byteOutBuffer[this.vbufLocation * 4] = this._palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
                    this.byteOutBuffer[(this.vbufLocation * 4) + 1] = this.emphasisBits;
                    this.vbufLocation++;
                }
                if (this.currentXPosition === 324) {
                    this.chrRomHandler.updateScanlineCounter();
                }
                this.currentXPosition++;
                if (this.currentXPosition > 340) {
                    this.currentXPosition = 0;
                    this.currentYPosition++;
                    this.preloadSprites(this.currentYPosition);
                    if (this.spritesOnThisScanline >= 7) {
                        this._PPUStatus = this._PPUStatus | 32;
                    }
                    this.lockedHScroll = this._hScroll;
                    this.UpdatePixelInfo();
                    //RunNewScanlineEvents 
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
            this.frameClock++;
            if (this.frameClock >= 89342) {
                this.frameClock = 0;
            }
        }
    };
    ChiChiPPU.prototype.UpdatePixelInfo = function () {
        this.nameTableMemoryStart = this.nameTableBits * 0x400;
    };
    Object.defineProperty(ChiChiPPU.prototype, "state", {
        get: function () {
            return {
                _PPUControlByte0: this._PPUControlByte0,
                _PPUControlByte1: this._PPUControlByte1,
                _PPUAddress: this._PPUAddress,
                _PPUStatus: this._PPUStatus,
                _spriteAddress: this._spriteAddress,
                currentXPosition: this.currentXPosition,
                currentYPosition: this.currentYPosition,
                _hScroll: this._hScroll,
                _vScroll: this._vScroll,
                lockedHScroll: this.lockedHScroll,
                lockedVScroll: this.lockedVScroll,
                spriteRAM: this.spriteRAM.slice()
            };
        },
        set: function (value) {
            this._PPUControlByte0 = value._PPUControlByte0;
            this._PPUControlByte1 = value._PPUControlByte1;
            this._PPUAddress = value._PPUAddress;
            this._PPUStatus = value._PPUStatus;
            this._spriteAddress = value._spriteAddress;
            this.currentXPosition = value.currentXPosition;
            this.currentYPosition = value.currentYPosition;
            this._hScroll = value._hScroll;
            this._vScroll = value._vScroll;
            this.lockedHScroll = value.lockedHScroll;
            this.lockedVScroll = value.lockedVScroll;
            for (var i = 0; i < this.spriteRAM.length; ++i) {
                this.spriteRAM[i] = value.spriteRAM[i];
            }
            this.nameTableBits = this._PPUControlByte0 & 3;
            this.backgroundPatternTableIndex = ((this._PPUControlByte0 & 16) >> 4) * 0x1000;
            this.greyScale = (this._PPUControlByte1 & 0x1) === 0x1;
            this.emphasisBits = (this._PPUControlByte1 >> 5) & 7;
            this._spritesAreVisible = (this._PPUControlByte1 & 0x10) === 0x10;
            this._tilesAreVisible = (this._PPUControlByte1 & 0x08) === 0x08;
            this._clipTiles = (this._PPUControlByte1 & 0x02) !== 0x02;
            this._clipSprites = (this._PPUControlByte1 & 0x04) !== 0x04;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiPPU.pal = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return ChiChiPPU;
}());
exports.ChiChiPPU = ChiChiPPU;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiControl_1 = __webpack_require__(12);
//chichipig
var ChiChiCPPU = /** @class */ (function () {
    function ChiChiCPPU(bopper, ppu) {
        this.SRMasks_CarryMask = 0x01;
        this.SRMasks_ZeroResultMask = 0x02;
        this.SRMasks_InterruptDisableMask = 0x04;
        this.SRMasks_DecimalModeMask = 0x08;
        this.SRMasks_BreakCommandMask = 0x10;
        this.SRMasks_ExpansionMask = 0x20;
        this.SRMasks_OverflowMask = 0x40;
        this.SRMasks_NegativeResultMask = 0x80;
        this._reset = false;
        //timing
        this._clock = 0;
        this._ticks = 0;
        // CPU Status
        this._statusRegister = 0;
        this._programCounter = 0;
        this._handleNMI = false;
        this._handleIRQ = false;
        // CPU Op info
        this._addressBus = 0;
        this._dataBus = 0;
        this._operationCounter = 0;
        this._accumulator = 0;
        this._indexRegisterX = 0;
        this._indexRegisterY = 0;
        // Current Instruction
        this._currentInstruction_AddressingMode = ChiChiTypes_1.ChiChiCPPU_AddressingModes.Bullshit;
        this._currentInstruction_Address = 0;
        this._currentInstruction_OpCode = 0;
        this._currentInstruction_Parameters0 = 0;
        this._currentInstruction_Parameters1 = 0;
        this._currentInstruction_ExtraTiming = 0;
        this.systemClock = 0;
        this.nextEvent = -1;
        //tbi
        this._cheating = false;
        this.__frameFinished = true;
        // system ram
        this._ramsBuffer = new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT);
        this.Rams = new Uint8Array(this._ramsBuffer); // System.Array.init(vv, 0, System.Int32);
        this._stackPointer = 255;
        // debug helpers
        this.instructionUsage = new Uint32Array(256); //System.Array.init(256, 0, System.Int32);
        this._debugging = false;
        // #region Cheats
        this.cheating = false;
        this.genieCodes = new Array();
        // #endregion cheats
        this.instructionHistoryPointer = 255;
        this._instructionHistory = new Array(256); //System.Array.init(256, null, ChiChiInstruction);
        this.SoundBopper = bopper;
        // init PPU
        this.ppu = ppu;
        this._padOne = new ChiChiControl_1.ChiChiInputHandler();
        this._padTwo = new ChiChiControl_1.ChiChiInputHandler();
        for (var i = 0; i < this._instructionHistory.length; ++i) {
            this._instructionHistory[i] = new ChiChiTypes_1.ChiChiInstruction();
        }
    }
    Object.defineProperty(ChiChiCPPU.prototype, "clock", {
        get: function () {
            return this._clock;
        },
        set: function (value) {
            this._clock = value;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiCPPU.prototype.advanceClock = function (value) {
        if (value) {
            this.ppu.advanceClock(value);
            this.SoundBopper.advanceClock(value);
            this.Cart.advanceClock(value);
            this._clock += value;
        }
    };
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
    ChiChiCPPU.prototype.cheat = function (address, result) {
        var patch = this.genieCodes.find(function (v) { return v.address == address; });
        if (!patch)
            return result;
        if (patch.data > 0xFF) {
            // its a comparison
            var compare = patch.data >> 8;
            if (compare == result) {
                result = patch.data & 0xFF;
            }
        }
        else {
            result = patch.data;
        }
        return result;
    };
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
    Object.defineProperty(ChiChiCPPU.prototype, "Clock", {
        get: function () {
            return this.clock;
        },
        set: function (value) {
            this.advanceClock(value);
            this.clock = value;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiCPPU.prototype.setFlag = function (Flag, value) {
        this._statusRegister = (value ? (this._statusRegister | Flag) : (this._statusRegister & ~Flag));
        this._statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    };
    ChiChiCPPU.prototype.GetFlag = function (flag) {
        return ((this._statusRegister & flag) === flag);
    };
    ChiChiCPPU.prototype.interruptRequest = function () {
        this._handleIRQ = false;
        if (!this.GetFlag(this.SRMasks_InterruptDisableMask)) {
            this.advanceClock(7);
            this.setFlag(this.SRMasks_InterruptDisableMask, true);
            var newStatusReg1 = this._statusRegister & ~0x10 | 0x20;
            this.pushStack(this._programCounter >> 8);
            this.pushStack(this._programCounter);
            this.pushStack(this._statusRegister);
            this._programCounter = this.GetByte(0xFFFE) + (this.GetByte(0xFFFF) << 8);
        }
    };
    ChiChiCPPU.prototype.nonMaskableInterrupt = function () {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        var newStatusReg = this._statusRegister & ~0x10 | 0x20;
        this.setFlag(this.SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.pushStack(this._programCounter >> 8);
        this.pushStack(this._programCounter & 0xFF);
        //c7ab
        // push sr onto stack
        this.pushStack(newStatusReg);
        // point pc to interrupt service routine
        var lowByte = this.GetByte(0xFFFA);
        var highByte = this.GetByte(0xFFFB);
        var jumpTo = lowByte | (highByte << 8);
        this._programCounter = jumpTo;
        //nonOpCodeticks = 7;
    };
    ChiChiCPPU.prototype.Step = function () {
        //let tickCount = 0;
        this._currentInstruction_ExtraTiming = 0;
        //this.FindNextEvent();
        if (this._handleNMI) {
            this.advanceClock(7);
            this._handleNMI = false;
            this.nonMaskableInterrupt();
        }
        else if (this.Cart.irqRaised || this.SoundBopper.interruptRaised) {
            this.interruptRequest();
        }
        //FetchNextInstruction();
        this._currentInstruction_Address = this._programCounter;
        this._currentInstruction_OpCode = this.GetByte(this._programCounter);
        this._programCounter = (this._programCounter + 1) & 0xffff;
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];
        this.fetchInstructionParameters();
        this.advanceClock(ChiChiCPPU.cpuTiming[this._currentInstruction_OpCode]);
        this.execute();
        this.advanceClock(this._currentInstruction_ExtraTiming);
        //("{0:x} {1:x} {2:x}", _currentInstruction_OpCode, _currentInstruction_AddressingMode, _currentInstruction_Address);
        if (this._debugging) {
            this.WriteInstructionHistoryAndUsage();
            this._operationCounter++;
        }
        //this.clock += ;
    };
    ChiChiCPPU.prototype.fetchInstructionParameters = function () {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.GetByte((this._programCounter++) & 0xFFFF);
                this._currentInstruction_Parameters1 = this.GetByte((this._programCounter++) & 0xFFFF);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.GetByte((this._programCounter++) & 0xFFFF);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Implicit:
                break;
            default:
                //  throw new Error("Invalid address mode!!");
                break;
        }
    };
    ChiChiCPPU.prototype.ResetCPU = function () {
        this._statusRegister = 52;
        this._operationCounter = 0;
        this._stackPointer = 253;
        this._programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
        this.advanceClock(4);
        this.genieCodes = [];
    };
    ChiChiCPPU.prototype.PowerOn = function () {
        // powers up with this state
        this._statusRegister = 52;
        this._stackPointer = 253;
        this._operationCounter = 0;
        this.advanceClock(4);
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
    ChiChiCPPU.prototype.decodeAddress = function () {
        this._currentInstruction_ExtraTiming = 0;
        var result = 0;
        var lowByte = 0;
        var highByte = 0;
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Absolute:
                // two parameters refer to the memory position
                result = ((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX:
                // absolute, x indexed - two paramaters + Index register x
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterX) | 0));
                if ((result & 0xFF) < this._indexRegisterX) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteY:
                // absolute, y indexed - two paramaters + Index register y
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this._indexRegisterY) | 0));
                if ((result & 0xFF) < this._indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPage:
                // first parameter represents offset in zero page
                result = this._currentInstruction_Parameters0;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageX:
                result = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 0xFF;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageY:
                result = ((((this._currentInstruction_Parameters0 & 0xFF) + (this._indexRegisterY & 0xFF)) | 0)) & 0xFF;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect:
                lowByte = this._currentInstruction_Parameters0;
                highByte = this._currentInstruction_Parameters1 << 8;
                var indAddr = (highByte | lowByte) & 65535;
                var indirectAddr = (this.GetByte(indAddr));
                lowByte = (((lowByte + 1) | 0)) & 0xFF;
                indAddr = (highByte | lowByte) & 65535;
                indirectAddr = indirectAddr | (this.GetByte(indAddr) << 8);
                result = indirectAddr;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
                var addr = (((this._currentInstruction_Parameters0 + this._indexRegisterX) | 0)) & 0xFF;
                lowByte = this.GetByte(addr);
                addr = (addr + 1) | 0;
                highByte = this.GetByte(addr & 0xFF);
                highByte = highByte << 8;
                result = highByte | lowByte;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectIndexed:
                lowByte = this.GetByte(this._currentInstruction_Parameters0);
                highByte = this.GetByte((((this._currentInstruction_Parameters0 + 1) | 0)) & 0xFF) << 8;
                addr = (lowByte | highByte);
                result = (addr + this._indexRegisterY) | 0;
                if ((result & 0xFF) > this._indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
                result = (((this._programCounter + this._currentInstruction_Parameters0) | 0));
                break;
            default:
                this.HandleBadOperation();
                break;
        }
        return result & 65535;
    };
    ChiChiCPPU.prototype.HandleBadOperation = function () {
        //throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.handleBreakpoint = function () {
    };
    ChiChiCPPU.prototype.decodeOperand = function () {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                this._dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator:
                return this._accumulator;
            default:
                this._dataBus = this.GetByte(this.decodeAddress());
                return this._dataBus;
        }
    };
    ChiChiCPPU.prototype.execute = function () {
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
                this.decodeAddress();
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
                data = this.decodeOperand();
                carryFlag = (this._statusRegister & 1);
                result = (this._accumulator + data + carryFlag) | 0;
                // carry flag
                this.setFlag(this.SRMasks_CarryMask, result > 255);
                // overflow flag
                this.setFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ data) & 128) !== 128 && ((this._accumulator ^ result) & 128) === 128);
                // occurs when bit 7 is set
                this._accumulator = result & 0xFF;
                this.setZNFlags(this._accumulator);
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
                this._accumulator = (this._accumulator & this.decodeOperand());
                this.setZNFlags(this._accumulator);
                break;
            case 10:
            case 6:
            case 22:
            case 14:
            case 30:
                //ASL
                data = this.decodeOperand();
                // set carry flag
                this.setFlag(this.SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.decodeAddress(), data);
                }
                this.setZNFlags(data);
                break;
            case 144:
                //BCC
                if ((this._statusRegister & 1) !== 1) {
                    this.branch();
                }
                break;
            case 176:
                //BCS();
                if ((this._statusRegister & 1) === 1) {
                    this.branch();
                }
                break;
            case 240:
                //BEQ();
                if ((this._statusRegister & 2) === 2) {
                    this.branch();
                }
                break;
            case 36:
            case 44:
                //BIT();
                data = this.decodeOperand();
                // overflow is bit 6
                this.setFlag(this.SRMasks_OverflowMask, (data & 64) === 64);
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
                    this.branch();
                }
                break;
            case 208:
                //BNE();
                if ((this._statusRegister & 2) !== 2) {
                    this.branch();
                }
                break;
            case 16:
                //BPL();
                if ((this._statusRegister & 128) !== 128) {
                    this.branch();
                }
                break;
            case 0:
                //BRK();
                //BRK causes a non-maskable interrupt and increments the program counter by one. 
                //Therefore an RTI will go to the address of the BRK +2 so that BRK may be used to replace a two-byte instruction 
                // for debugging and the subsequent RTI will be correct. 
                // push pc onto stack (high byte first)
                this._programCounter = this._programCounter + 1;
                this.pushStack(this._programCounter >> 8 & 0xFF);
                this.pushStack(this._programCounter & 0xFF);
                // push sr onto stack
                //PHP and BRK push the current status with bits 4 and 5 set on the stack; 
                data = this._statusRegister | 16 | 32;
                this.pushStack(data);
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
                    this.branch();
                }
                break;
            case 112:
                //BVS();
                if ((this._statusRegister & 64) === 64) {
                    this.branch();
                }
                break;
            case 24:
                //CLC();
                this.setFlag(this.SRMasks_CarryMask, false);
                break;
            case 216:
                //CLD();
                this.setFlag(this.SRMasks_DecimalModeMask, false);
                break;
            case 88:
                //CLI();
                this.setFlag(this.SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                //CLV();
                this.setFlag(this.SRMasks_OverflowMask, false);
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
                data = (this._accumulator + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 224:
            case 228:
            case 236:
                //CPX();
                data = (this._indexRegisterX + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 192:
            case 196:
            case 204:
                //CPY();
                data = (this._indexRegisterY + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 198:
            case 214:
            case 206:
            case 222:
                //DEC();
                data = this.decodeOperand();
                data = (data - 1) & 0xFF;
                this.SetByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 202:
                //DEX();
                this._indexRegisterX = this._indexRegisterX - 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 136:
                //DEY();
                this._indexRegisterY = this._indexRegisterY - 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.setZNFlags(this._indexRegisterY);
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
                this._accumulator = (this._accumulator ^ this.decodeOperand());
                this.setZNFlags(this._accumulator);
                break;
            case 230:
            case 246:
            case 238:
            case 254:
                //INC();
                data = this.decodeOperand();
                data = (data + 1) & 0xFF;
                this.SetByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 232:
                //INX();
                this._indexRegisterX = this._indexRegisterX + 1;
                this._indexRegisterX = this._indexRegisterX & 0xFF;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 200:
                this._indexRegisterY = this._indexRegisterY + 1;
                this._indexRegisterY = this._indexRegisterY & 0xFF;
                this.setZNFlags(this._indexRegisterY);
                break;
            case 76:
            case 108:
                // JMP();
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this._programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                }
                else {
                    this._programCounter = this.decodeAddress();
                }
                break;
            case 32:
                //JSR();
                this.pushStack((this._programCounter >> 8) & 0xFF);
                this.pushStack((this._programCounter - 1) & 0xFF);
                this._programCounter = this.decodeAddress();
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
                this._accumulator = this.decodeOperand();
                this.setZNFlags(this._accumulator);
                break;
            case 162:
            case 166:
            case 182:
            case 174:
            case 190:
                //LDX();
                this._indexRegisterX = this.decodeOperand();
                this.setZNFlags(this._indexRegisterX);
                break;
            case 160:
            case 164:
            case 180:
            case 172:
            case 188:
                //LDY();
                this._indexRegisterY = this.decodeOperand();
                this.setZNFlags(this._indexRegisterY);
                break;
            case 74:
            case 70:
            case 86:
            case 78:
            case 94:
                //LSR();
                data = this.decodeOperand();
                //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 
                this.setFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                data = data >> 1 & 0xFF;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.decodeAddress(), data);
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
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX) {
                    this.decodeAddress();
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
                this._accumulator = (this._accumulator | this.decodeOperand());
                this.setZNFlags(this._accumulator);
                break;
            case 72:
                //PHA();
                this.pushStack(this._accumulator);
                break;
            case 8:
                //PHP();
                data = this._statusRegister | 16 | 32;
                this.pushStack(data);
                break;
            case 104:
                //PLA();
                this._accumulator = this.popStack();
                this.setZNFlags(this._accumulator);
                break;
            case 40:
                //PLP();
                this._statusRegister = this.popStack(); // | 0x20;
                break;
            case 42:
            case 38:
            case 54:
            case 46:
            case 62:
                //ROL();
                data = this.decodeOperand();
                // old carry bit shifted into bit 1
                oldbit = (this._statusRegister & 1) === 1 ? 1 : 0;
                this.setFlag(this.SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.decodeAddress(), data);
                }
                break;
            case 106:
            case 102:
            case 118:
            case 110:
            case 126:
                //ROR();
                data = this.decodeOperand();
                // old carry bit shifted into bit 7
                oldbit = (this._statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.setFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this._accumulator = data;
                }
                else {
                    this.SetByte(this.decodeAddress(), data);
                }
                break;
            case 64:
                //RTI();
                this._statusRegister = this.popStack(); // | 0x20;
                lowByte = this.popStack();
                highByte = this.popStack();
                this._programCounter = ((highByte << 8) | lowByte);
                break;
            case 96:
                //RTS();
                lowByte = (this.popStack() + 1) & 0xFF;
                highByte = this.popStack();
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
                data = this.decodeOperand() & 4095;
                carryFlag = ((this._statusRegister ^ 1) & 1);
                result = (((this._accumulator - data) & 4095) - carryFlag) & 4095;
                // set overflow flag if sign bit of accumulator changed
                this.setFlag(this.SRMasks_OverflowMask, ((this._accumulator ^ result) & 128) === 128 && ((this._accumulator ^ data) & 128) === 128);
                this.setFlag(this.SRMasks_CarryMask, (result < 256));
                this._accumulator = (result) & 0xFF;
                this.setZNFlags(this._accumulator);
                break;
            case 56:
                //SEC();
                this.setFlag(this.SRMasks_CarryMask, true);
                break;
            case 248:
                //SED();
                this.setFlag(this.SRMasks_DecimalModeMask, true);
                break;
            case 120:
                //SEI();
                this.setFlag(this.SRMasks_InterruptDisableMask, true);
                break;
            case 133:
            case 149:
            case 141:
            case 157:
            case 153:
            case 129:
            case 145:
                //STA();
                this.SetByte(this.decodeAddress(), this._accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.SetByte(this.decodeAddress(), this._indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.SetByte(this.decodeAddress(), this._indexRegisterY);
                break;
            case 170:
                //TAX();
                this._indexRegisterX = this._accumulator;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 168:
                //TAY();
                this._indexRegisterY = this._accumulator;
                this.setZNFlags(this._indexRegisterY);
                break;
            case 186:
                //TSX();
                this._indexRegisterX = this._stackPointer;
                this.setZNFlags(this._indexRegisterX);
                break;
            case 138:
                //TXA();
                this._accumulator = this._indexRegisterX;
                this.setZNFlags(this._accumulator);
                break;
            case 154:
                //TXS();
                this._stackPointer = this._indexRegisterX;
                break;
            case 152:
                //TYA();
                this._accumulator = this._indexRegisterY;
                this.setZNFlags(this._accumulator);
                break;
            case 11:
            case 43:
                //AAC();
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this._accumulator = this.decodeOperand() & this._accumulator & 0xFF;
                this.setFlag(this.SRMasks_CarryMask, (this._accumulator & 128) === 128);
                this.setZNFlags(this._accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this._accumulator = this.decodeOperand() & this._accumulator;
                this.setFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                this._accumulator = this._accumulator >> 1;
                this.setZNFlags(this._accumulator);
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
                this._accumulator = this.decodeOperand() & this._accumulator;
                if ((this._statusRegister & 1) === 1) {
                    this._accumulator = (this._accumulator >> 1) | 128;
                }
                else {
                    this._accumulator = (this._accumulator >> 1);
                }
                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 
                this.setFlag(this.SRMasks_CarryMask, (this._accumulator & 1) === 1);
                switch (this._accumulator & 48) {
                    case 48:
                        this.setFlag(this.SRMasks_CarryMask, true);
                        this.setFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 0:
                        this.setFlag(this.SRMasks_CarryMask, false);
                        this.setFlag(this.SRMasks_InterruptDisableMask, false);
                        break;
                    case 16:
                        this.setFlag(this.SRMasks_CarryMask, false);
                        this.setFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                    case 32:
                        this.setFlag(this.SRMasks_CarryMask, true);
                        this.setFlag(this.SRMasks_InterruptDisableMask, true);
                        break;
                }
                break;
            case 171:
                //ATX();
                //AND byte with accumulator, then transfer accumulator to X register.
                //Status flags: N,Z
                this._indexRegisterX = (this._accumulator = this.decodeOperand() & this._accumulator);
                this.setZNFlags(this._indexRegisterX);
                break;
        }
    };
    ChiChiCPPU.prototype.setZNFlags = function (data) {
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
    ChiChiCPPU.prototype.compare = function (data) {
        this.setFlag(this.SRMasks_CarryMask, data > 255);
        this.setZNFlags(data & 255);
    };
    ChiChiCPPU.prototype.branch = function () {
        var highByte = (this._programCounter >> 8) & 0xff;
        this._currentInstruction_ExtraTiming = 1;
        var addr = this._currentInstruction_Parameters0 & 255;
        if ((addr & 128) === 128) {
            addr = addr - 256;
        }
        this._programCounter += addr;
        this._programCounter &= 0xffff;
        var newHighByte = (this._programCounter >> 8) & 0xff;
        if (highByte != newHighByte) {
            this._currentInstruction_ExtraTiming = 2;
        }
    };
    ChiChiCPPU.prototype.nmiHandler = function () {
        this._handleNMI = true;
    };
    ChiChiCPPU.prototype.irqUpdater = function () {
        this._handleIRQ = this.SoundBopper.interruptRaised || this.Cart.irqRaised;
    };
    ChiChiCPPU.prototype.pushStack = function (data) {
        this.Rams[this._stackPointer + 256] = data;
        this._stackPointer--;
        if (this._stackPointer < 0) {
            this._stackPointer = 255;
        }
    };
    ChiChiCPPU.prototype.popStack = function () {
        this._stackPointer++;
        if (this._stackPointer > 255) {
            this._stackPointer = 0;
        }
        return this.Rams[this._stackPointer + 256];
    };
    ChiChiCPPU.prototype.GetByte = function (address) {
        if (!this.memoryMap) {
            return 0;
        }
        var result = this.memoryMap.getByte(this.clock, address);
        if (this.cheating) {
            var patch = this.genieCodes.find(function (v) { return v.address == address; });
            if (patch && patch.active && patch.address == address) {
                if (patch.compare > -1) {
                    return (patch.compare == result ? patch.data : result) & 0xFF;
                }
                else {
                    return patch.data;
                }
            }
        }
        return result & 255;
    };
    ChiChiCPPU.prototype.SetByte = function (address, data) {
        if (!this.memoryMap) {
            return;
        }
        this.memoryMap.setByte(this.clock, address, data);
    };
    ChiChiCPPU.prototype.PeekByte = function (address) {
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
                result = 0;
                //result = this.PPU_GetByte(this.clock, address);
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
                result = 0;
                //result = this.Cart.GetByte(this.clock, address);
                break;
            default:
                throw new Error("Bullshit!");
        }
        //if (_cheating && memoryPatches.ContainsKey(address))
        //{
        //    return memoryPatches[address].Activated ? memoryPatches[address].GetData(result) & 0xFF : result & 0xFF;
        //}
        return result & 255;
    };
    ChiChiCPPU.prototype.PeekBytes = function (start, finish) {
        var array = new Array();
        for (var i = 0; i < finish; ++i) {
            if (i < this.Rams.length)
                array.push(this.Rams[i]);
        }
        return array;
    };
    ChiChiCPPU.prototype.HandleNextEvent = function () {
        // this.ppu.HandleEvent(this.clock);
        // this.FindNextEvent();
    };
    ChiChiCPPU.prototype.ResetInstructionHistory = function () {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 0xFF;
    };
    ChiChiCPPU.prototype.WriteInstructionHistoryAndUsage = function () {
        var inst = new ChiChiTypes_1.ChiChiInstruction();
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
    Object.defineProperty(ChiChiCPPU.prototype, "state", {
        get: function () {
            return {
                clock: this.clock,
                _statusRegister: this._statusRegister,
                _programCounter: this._programCounter,
                _handleNMI: this._handleNMI,
                _handleIRQ: this._handleIRQ,
                _addressBus: this._addressBus,
                _dataBus: this._dataBus,
                _operationCounter: this._operationCounter,
                _accumulator: this._accumulator,
                _indexRegisterX: this._indexRegisterX,
                _indexRegisterY: this._indexRegisterY,
                _currentInstruction_AddressingMode: this._currentInstruction_AddressingMode,
                _currentInstruction_Address: this._currentInstruction_Address,
                _currentInstruction_OpCode: this._currentInstruction_OpCode,
                _currentInstruction_Parameters0: this._currentInstruction_Parameters0,
                _currentInstruction_Parameters1: this._currentInstruction_Parameters1,
                _currentInstruction_ExtraTiming: this._currentInstruction_ExtraTiming,
                systemClock: this.systemClock,
                nextEvent: this.nextEvent,
                Rams: this.Rams.slice(),
                Debugging: this.Debugging,
                cheating: this.cheating,
                genieCodes: this.genieCodes
            };
        },
        set: function (value) {
            this.clock = value.clock,
                this._statusRegister = value._statusRegister,
                this._programCounter = value._programCounter,
                this._handleNMI = value._handleNMI,
                this._handleIRQ = value._handleIRQ,
                this._addressBus = value._addressBus,
                this._dataBus = value._dataBus,
                this._operationCounter = value._operationCounter,
                this._accumulator = value._accumulator,
                this._indexRegisterX = value._indexRegisterX,
                this._indexRegisterY = value._indexRegisterY,
                this._currentInstruction_AddressingMode = value._currentInstruction_AddressingMode,
                this._currentInstruction_Address = value._currentInstruction_Address,
                this._currentInstruction_OpCode = value._currentInstruction_OpCode,
                this._currentInstruction_Parameters0 = value._currentInstruction_Parameters0,
                this._currentInstruction_Parameters1 = value._currentInstruction_Parameters1,
                this._currentInstruction_ExtraTiming = value._currentInstruction_ExtraTiming,
                this.systemClock = value.systemClock,
                this.nextEvent = value.nextEvent,
                this.Debugging = value.Debugging,
                this.cheating = value.cheating,
                this.genieCodes = value.genieCodes;
            for (var i = 0; i < this.Rams.length; ++i) {
                this.Rams[i] = value.Rams[i];
            }
        },
        enumerable: true,
        configurable: true
    });
    // statics
    ChiChiCPPU.cpuTiming = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
    ChiChiCPPU.addressModes = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
    return ChiChiCPPU;
}());
exports.ChiChiCPPU = ChiChiCPPU;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.ChiChiInputHandler = ChiChiInputHandler;
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
exports.ChiChiControlPad = ChiChiControlPad;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiState = /** @class */ (function () {
    function ChiChiState() {
    }
    return ChiChiState;
}());
exports.ChiChiState = ChiChiState;
var ChiChiStateManager = /** @class */ (function () {
    function ChiChiStateManager() {
    }
    ChiChiStateManager.prototype.read = function (machine) {
        var state = new ChiChiState();
        state.apu = machine.SoundBopper.state;
        state.ppu = machine.ppu.state;
        state.cart = machine.Cart.state;
        state.cpu = machine.Cpu.state;
        return state;
    };
    ChiChiStateManager.prototype.write = function (machine, value) {
        if (value.ppu) {
            machine.ppu.state = value.ppu;
        }
        if (value.apu) {
            machine.SoundBopper.state = value.apu;
        }
        if (value.cart) {
            machine.Cart.state = value.cart;
        }
        if (value.cpu) {
            machine.Cpu.state = value.cpu;
        }
    };
    return ChiChiStateManager;
}());
exports.ChiChiStateManager = ChiChiStateManager;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMD_CREATE = 'create';
exports.CMD_LOADROM = 'loadrom';
exports.CMD_CHEAT = 'cheats';
exports.CMD_AUDIOSETTINGS = 'audioSettings';
exports.CMD_RUNSTATUS = 'runstatus';
exports.CMD_RESET = 'reset';
exports.CMD_DEBUGSTEP = 'debugstep';
var lastId = 0;
var WorkerMessage = /** @class */ (function () {
    function WorkerMessage() {
        this.command = 'null';
        this.messageId = Date.now();
    }
    WorkerMessage.prototype.execute = function () { };
    return WorkerMessage;
}());
exports.WorkerMessage = WorkerMessage;
var CreateCommand = /** @class */ (function (_super) {
    __extends(CreateCommand, _super);
    function CreateCommand(vbuffer, abuffer, audioSettings, iops) {
        var _this = _super.call(this) || this;
        _this.vbuffer = vbuffer;
        _this.abuffer = abuffer;
        _this.audioSettings = audioSettings;
        _this.iops = iops;
        _this.command = exports.CMD_CREATE;
        return _this;
    }
    return CreateCommand;
}(WorkerMessage));
exports.CreateCommand = CreateCommand;
var LoadRomCommand = /** @class */ (function (_super) {
    __extends(LoadRomCommand, _super);
    function LoadRomCommand(rom, name) {
        var _this = _super.call(this) || this;
        _this.rom = rom;
        _this.name = name;
        _this.command = exports.CMD_LOADROM;
        return _this;
    }
    return LoadRomCommand;
}(WorkerMessage));
exports.LoadRomCommand = LoadRomCommand;
var RunStatusCommand = /** @class */ (function (_super) {
    __extends(RunStatusCommand, _super);
    function RunStatusCommand(status) {
        var _this = _super.call(this) || this;
        _this.status = status;
        _this.command = exports.CMD_RUNSTATUS;
        return _this;
    }
    return RunStatusCommand;
}(WorkerMessage));
exports.RunStatusCommand = RunStatusCommand;
var ResetCommand = /** @class */ (function (_super) {
    __extends(ResetCommand, _super);
    function ResetCommand() {
        var _this = _super.call(this) || this;
        _this.command = exports.CMD_RESET;
        return _this;
    }
    return ResetCommand;
}(WorkerMessage));
exports.ResetCommand = ResetCommand;
var DebugCommand = /** @class */ (function (_super) {
    __extends(DebugCommand, _super);
    function DebugCommand(stepType) {
        var _this = _super.call(this) || this;
        _this.stepType = stepType;
        _this.command = exports.CMD_DEBUGSTEP;
        return _this;
    }
    return DebugCommand;
}(WorkerMessage));
exports.DebugCommand = DebugCommand;
var CheatCommand = /** @class */ (function (_super) {
    __extends(CheatCommand, _super);
    function CheatCommand(cheats) {
        var _this = _super.call(this) || this;
        _this.cheats = cheats;
        _this.command = exports.CMD_CHEAT;
        return _this;
    }
    return CheatCommand;
}(WorkerMessage));
exports.CheatCommand = CheatCommand;
var AudioCommand = /** @class */ (function (_super) {
    __extends(AudioCommand, _super);
    function AudioCommand(audioSettings) {
        var _this = _super.call(this) || this;
        _this.audioSettings = audioSettings;
        _this.command = exports.CMD_CHEAT;
        return _this;
    }
    return AudioCommand;
}(WorkerMessage));
exports.AudioCommand = AudioCommand;
var WorkerResponse = /** @class */ (function () {
    function WorkerResponse(msg, success, error) {
        this.success = success;
        this.error = error;
        this.messageId = msg.messageId;
    }
    return WorkerResponse;
}());
exports.WorkerResponse = WorkerResponse;


/***/ })
/******/ ]);
});