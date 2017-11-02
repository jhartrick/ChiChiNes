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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var chichi_1 = __webpack_require__(1);
var NesInfo = (function () {
    function NesInfo() {
        this.bufferupdate = false;
        this.stateupdate = true;
        this.runStatus = {};
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
var tendoWrapper = (function () {
    function tendoWrapper() {
        this.framesRendered = 0;
        this.startTime = 0;
        this.runTimeout = 0;
        this.Debugging = false;
        this.frameFinished = false;
        this.ready = false;
        this.framesPerSecond = 0;
        this.iops = new Int32Array(16);
        this.cartName = 'unk';
        this.sharedAudioBufferPos = 0;
        this.audioBytesWritten = 0;
        this.machine = new chichi_1.ChiChiMachine();
    }
    tendoWrapper.prototype.createMachine = function () {
        var _this = this;
        this.machine = new chichi_1.ChiChiMachine();
        this.machine.Drawscreen = function () {
            // flush audio
            // globals.postMessage({ frame: true, fps: framesPerSecond });
        };
        this.ready = true;
        this.machine.Cpu.addDebugEvent(function () {
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
        });
        this.machine.Cpu.Debugging = false;
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
    tendoWrapper.prototype.flushAudio = function () {
        //  debugger;
        var len = this.machine.WaveForms.SharedBufferLength;
        for (var i = 0; i < len; ++i) {
            this.sharedAudioBufferPos++;
            if (this.sharedAudioBufferPos >= this.sharedAudioBuffer.length) {
                this.sharedAudioBufferPos = 0;
            }
            this.sharedAudioBuffer[this.sharedAudioBufferPos] = this.machine.WaveForms.SharedBuffer[i];
            this.audioBytesWritten++;
        }
        while (this.audioBytesWritten >= this.sharedAudioBuffer.length >> 2) {
            Atomics.store(this.iops, 3, this.audioBytesWritten);
            Atomics.wait(this.iops, 3, this.audioBytesWritten);
            this.audioBytesWritten = Atomics.load(this.iops, 3);
        }
    };
    tendoWrapper.prototype.runInnerLoop = function () {
        this.machine.PadOne.padOneState = this.iops[2] & 0xFF;
        this.machine.PadTwo.padOneState = (this.iops[2] >> 8) & 0xFF;
        this.machine.RunFrame();
        this.framesPerSecond = 0;
        //this.flushAudio();
        if ((this.framesRendered++) === 60) {
            // this.updateState();
            this.framesPerSecond = ((this.framesRendered / (new Date().getTime() - this.startTime)) * 1000);
            this.framesRendered = 0;
            this.startTime = new Date().getTime();
            this.iops[1] = this.framesPerSecond;
            // if (this.framesPerSecond < 60 && this.runTimeout > 0) {
            //     this.runTimeout--;
            // } else if (this.runTimeout < 50) {
            //     this.runTimeout++;
            // }
        }
        //this.runInnerLoop();
        //setTimeout(() => { this.runInnerLoop(); }, this.runTimeout); 
    };
    tendoWrapper.prototype.run = function (reset) {
        var _this = this;
        this.iops[3] = 12312312;
        var framesRendered = 0;
        var machine = this.machine;
        if (reset) {
            machine.Reset();
        }
        machine.Cpu.Debugging = false;
        this.startTime = new Date().getTime();
        clearInterval(this.interval);
        this.interval = setInterval(function () {
            _this.iops[0] = 1;
            while (_this.iops[0] == 1) {
                _this.runInnerLoop();
            }
        }, 1);
        this.runStatus = machine.RunState; // runStatuses.Running;
    };
    tendoWrapper.prototype.runFrame = function () {
        clearInterval(this.interval);
        this.frameFinished = false;
        var machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        // intervalId = setInterval(() => 
        machine.RunFrame();
        this.runStatus = this.machine.RunState;
        this.frameFinished = true;
    };
    tendoWrapper.prototype.reset = function () {
        var machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        machine.Reset();
        this.runStatus = this.machine.RunState;
    };
    tendoWrapper.prototype.step = function () {
        clearInterval(this.interval);
        var machine = this.machine;
        machine.Cpu.Debugging = this.Debugging;
        machine.Step();
        this.runStatus = this.machine.RunState;
    };
    tendoWrapper.prototype.handleMessage = function (event) {
        var machine = this.machine;
        switch (event.data.command) {
            case 'create':
                this.createMachine();
                this.machine.Cpu.ppu.byteOutBuffer = event.data.vbuffer;
                this.machine.SoundBopper.writer.SharedBuffer = this.sharedAudioBuffer = event.data.abuffer;
                this.machine.SoundBopper.audioSettings = event.data.audioSettings;
                this.sharedAudioBufferPos = 0;
                this.iops = event.data.iops;
                break;
            case 'loadrom':
                this.stop();
                //this.createMachine();
                this.machine.EnableSound = false;
                this.machine.LoadCart(event.data.rom);
                this.updateBuffers();
                break;
            case 'loadnsf':
                this.stop();
                //this.createNsfMachine();
                this.updateBuffers();
                break;
            case 'audiosettings':
                this.machine.SoundBopper.audioSettings = event.data.settings;
                break;
            case 'mute':
                this.machine.EnableSound = false;
                break;
            case 'unmute':
                this.machine.EnableSound = true;
                break;
            case 'run':
                this.Debugging = false;
                this.run(true);
                break;
            case 'runframe':
                this.Debugging = true;
                this.runFrame();
                break;
            case 'step':
                this.Debugging = true;
                this.step();
                break;
            case 'continue':
                this.run(false);
                break;
            case 'stop':
                this.machine.EnableSound = false;
                this.stop();
                break;
            case 'reset':
                this.reset();
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
/* 1 */
/***/ (function(module, exports) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
var AudioSettings = /** @class */ (function () {
    function AudioSettings() {
        this.sampleRate = 44100;
        this.master_volume = 0.0;
        this.enableSquare0 = true;
        this.enableSquare1 = true;
        this.enableTriangle = true;
        this.enableNoise = true;
        this.enablePCM = true;
    }
    return AudioSettings;
}());
exports.AudioSettings = AudioSettings;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiMemMap = /** @class */ (function () {
    function ChiChiMemMap() {
    }
    ChiChiMemMap.prototype.getByte = function (address) {
        return 0;
    };
    ChiChiMemMap.prototype.setByte = function (address, data) {
    };
    return ChiChiMemMap;
}());
exports.ChiChiMemMap = ChiChiMemMap;
var ChiChiPPU = /** @class */ (function () {
    function ChiChiPPU() {
        this.LastcpuClock = 0;
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
        //
        this.outBuffer = new Uint8Array(65536);
        // 'internal
        this.byteOutBuffer = new Uint8Array(256 * 256 * 4); // System.Array.init(262144, 0, System.Int32);
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
            //}
            //else
            //{
            //    return (6823 - frameClock) / 3;
            //}
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
    Object.defineProperty(ChiChiPPU.prototype, "PPU_FrameFinishHandler", {
        get: function () {
            return this.frameFinished;
        },
        set: function (value) {
            this.frameFinished = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChiChiPPU.prototype, "PPU_NameTableMemoryStart", {
        get: function () {
            return this.nameTableMemoryStart;
        },
        set: function (value) {
            this.nameTableMemoryStart = value;
        },
        enumerable: true,
        configurable: true
    });
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
    ChiChiPPU.prototype.SetupVINT = function () {
        this._PPUStatus = this._PPUStatus | 128;
        //this.NMIHasBeenThrownThisFrame = false;
        // HandleVBlankIRQ = true;
        this._frames = this._frames + 1;
        //isRendering = false;
        if (this.NMIIsThrown) {
            this.NMIHandler();
            //this._handleNMI = true;
            //this.HandleVBlankIRQ = true;
            //this.NMIHasBeenThrownThisFrame = true;
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
    ChiChiPPU.prototype.UpdatePPUControlByte0 = function () {
        if ((this._PPUControlByte0 & 16)) {
            this.backgroundPatternTableIndex = 4096;
        }
        else {
            this.backgroundPatternTableIndex = 0;
        }
    };
    ChiChiPPU.prototype.SetByte = function (Clock, address, data) {
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
                this.backgroundPatternTableIndex = ((this._PPUControlByte0 & 16) >> 4) * 0x1000;
                // if we toggle /vbl we can throw multiple NMIs in a vblank period
                //if ((data & 0x80) == 0x80 && NMIHasBeenThrownThisFrame)
                //{
                //     NMIHasBeenThrownThisFrame = false;
                //}
                //UpdatePixelInfo();
                this.nameTableMemoryStart = this.nameTableBits * 0x400;
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
                this.isRendering = (data & 0x18) !== 0;
                this._PPUControlByte1 = data;
                this._spritesAreVisible = (this._PPUControlByte1 & 0x10) === 0x10;
                this._tilesAreVisible = (this._PPUControlByte1 & 0x08) === 0x08;
                this._clipTiles = (this._PPUControlByte1 & 0x02) !== 0x02;
                this._clipSprites = (this._PPUControlByte1 & 0x04) !== 0x04;
                //UpdatePixelInfo();
                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 2:
                this.ppuReadBuffer = data;
                this._openBus = data;
                break;
            case 3:
                //3	    -	internal object attribute memory index pointer 
                //          (64 attributes, 32 bits each, byte granular access). 
                //          stored value post-increments on access to port 4.
                this._spriteAddress = data & 0xFF;
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
                    this._PPUAddress = (this._PPUAddress & 0xFF) | ((data & 0x3F) << 8);
                    this.PPUAddressLatchIsHigh = false;
                }
                else {
                    //            //b) Write lower address byte into $2006
                    this._PPUAddress = (this._PPUAddress & 0x7F00) | data & 0xFF;
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
                    this._hScroll = ((this._PPUAddress & 0x1F) << 3); // +(currentXPosition & 7);
                    this._vScroll = (((this._PPUAddress >> 5) & 0x1F) << 3);
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
                if ((this._PPUAddress & 0xFF00) === 0x3F00) {
                    this.DrawTo(Clock);
                    //WriteToNESPalette(_PPUAddress, (byte)data);
                    var palAddress = (this._PPUAddress) & 0x1F;
                    this._palette[palAddress] = data;
                    // rgb32OutBuffer[255 * 256 + palAddress] = data;
                    if ((this._PPUAddress & 0xFFEF) === 0x3F00) {
                        this._palette[(palAddress ^ 16) & 0x1F] = data;
                    }
                    // these palettes are all mirrored every 0x10 bytes
                    this.UpdatePixelInfo();
                }
                else {
                    // if its a nametable byte, mask it according to current mirroring
                    if ((this._PPUAddress & 0xF000) === 0x2000) {
                        this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
                    }
                    else {
                        if (this.vidRamIsRam) {
                            this.chrRomHandler.SetPPUByte(Clock, this._PPUAddress, data);
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
                this._PPUAddress = (this._PPUAddress & 0x3FFF);
                break;
        }
    };
    ChiChiPPU.prototype.GetByte = function (Clock, address) {
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
                return this._openBus;
            case 2:
                var ret = 0;
                this.PPUAddressLatchIsHigh = true;
                // bit 7 is set to 0 after a read occurs
                // return lower 5 latched bits, and the status
                ret = (this.ppuReadBuffer & 0x1F) | this._PPUStatus;
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
                if ((this._PPUAddress & 0xFF00) === 0x3F00) {
                    // these palettes are all mirrored every 0x10 bytes
                    tmp = this._palette[this._PPUAddress & 0x1F];
                    // palette read should also read vram into read buffer
                    // info i found on the nesdev forums
                    // When you read PPU $3F00-$3FFF, you get immediate data from Palette RAM 
                    // (without the 1-read delay usually present when reading from VRAM) and the PPU 
                    // will also fetch nametable data from the corresponding address (which is mirrored from PPU $2F00-$2FFF). 
                    // note: writes do not work this way 
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
    ChiChiPPU.prototype.HandleEvent = function (Clock) {
        this.DrawTo(Clock);
    };
    ChiChiPPU.prototype.ResetClock = function (Clock) {
        this.LastcpuClock = Clock;
    };
    ChiChiPPU.prototype.CopySprites = function (copyFrom) {
        // should copy 0x100 items from source to spriteRAM, 
        // starting at SpriteAddress, and wrapping around
        // should set spriteDMA flag
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
    ChiChiPPU.prototype.InitSprites = function () {
        this.currentSprites = new Array(this._maxSpritesPerScanline); //ChiChiSprite;
        for (var i = 0; i < this._maxSpritesPerScanline; ++i) {
            this.currentSprites[i] = new ChiChiTypes_1.ChiChiSprite();
        }
        this.unpackedSprites = new Array(64);
        for (var i = 0; i < 64; ++i) {
            this.unpackedSprites[i] = new ChiChiTypes_1.ChiChiSprite();
        }
    };
    ChiChiPPU.prototype.GetSpritePixel = function () {
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
    ChiChiPPU.prototype.WhissaSpritePixel = function (patternTableIndex, x, y, sprite, tileIndex) {
        // 8x8 tile
        var patternEntry = 0;
        var patternEntryBit2 = 0;
        if (sprite.v.FlipY) {
            y = this.spriteSize - y - 1;
        }
        if (y >= 8) {
            y += 8;
        }
        patternEntry = this.chrRomHandler.GetPPUByte(0, patternTableIndex + tileIndex * 16 + y);
        patternEntryBit2 = this.chrRomHandler.GetPPUByte(0, patternTableIndex + tileIndex * 16 + y + 8);
        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    };
    ChiChiPPU.prototype.PreloadSprites = function (scanline) {
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
    ChiChiPPU.prototype.UnpackSprites = function () {
        //Buffer.BlockCopy
        //var outBufferloc = 65280;
        //for (var i = 0; i < 256; i += 4) {
        //    this.outBuffer[outBufferloc] = (this.spriteRAM[i] << 24) | (this.spriteRAM[i + 1] << 16) | (this.spriteRAM[i + 2] << 8) | (this.spriteRAM[i + 3] << 0);
        //    outBufferloc++;
        //}
        // Array.Copy(spriteRAM, 0, outBuffer, 255 * 256 * 4, 256);
        for (var currSprite = 0; currSprite < this.unpackedSprites.length; ++currSprite) {
            if (this.unpackedSprites[currSprite].Changed) {
                this.UnpackSprite(currSprite);
            }
        }
    };
    ChiChiPPU.prototype.UnpackSprite = function (currSprite) {
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
    ChiChiPPU.prototype.GetNameTablePixel = function () {
        var result = ((this.patternEntry & 128) >> 7) | ((this.patternEntryByte2 & 128) >> 6);
        this.patternEntry <<= 1;
        this.patternEntryByte2 <<= 1;
        if (result > 0) {
            result |= this.currentAttributeByte;
        }
        return result & 255;
    };
    ChiChiPPU.prototype.FetchNextTile = function () {
        var ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
        var xTilePosition = this.xPosition >> 3;
        var tileRow = (this.yPosition >> 3) % 30 << 5;
        var tileNametablePosition = 8192 + ppuNameTableMemoryStart + xTilePosition + tileRow;
        var TileIndex = this.chrRomHandler.GetPPUByte(0, tileNametablePosition);
        var patternTableYOffset = this.yPosition & 7;
        var patternID = this.backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;
        this.patternEntry = this.chrRomHandler.GetPPUByte(0, patternID);
        this.patternEntryByte2 = this.chrRomHandler.GetPPUByte(0, patternID + 8);
        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
    };
    ChiChiPPU.prototype.GetAttributeTableEntry = function (ppuNameTableMemoryStart, i, j) {
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
    ChiChiPPU.prototype.DrawTo = function (cpuClockNum) {
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
                    break;
                case 6820:
                    this._PPUStatus = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this._PPUControlByte0 & 0x20) === 0x20) ? 16 : 8;
                    if ((this._PPUControlByte1 & 0x18) !== 0) {
                        this.isRendering = true;
                    }
                    this.frameOn = true;
                    this.chrRomHandler.ResetBankStartCache();
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
                case 89342://ChiChiNES.CPU2A03.frameClockEnd:
                    this.shouldRender = true;
                    //__frameFinished = true;
                    this.frameFinished();
                    this.SetupVINT();
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
                        this.xNTXor = (this.xPosition & 0x100) ? 0x400 : 0;
                        this.xPosition &= 0xFF;
                        /* fetch next tile */
                        var ppuNameTableMemoryStart = this.nameTableMemoryStart ^ this.xNTXor ^ this.yNTXor;
                        var xTilePosition = this.xPosition >> 3;
                        var tileRow = (this.yPosition >> 3) % 30 << 5;
                        var tileNametablePosition = 0x2000 + ppuNameTableMemoryStart + xTilePosition + tileRow;
                        var TileIndex = this.chrRomHandler.GetPPUByte(0, tileNametablePosition);
                        var patternTableYOffset = this.yPosition & 7;
                        var patternID = this.backgroundPatternTableIndex + (TileIndex * 16) + patternTableYOffset;
                        this.patternEntry = this.chrRomHandler.GetPPUByte(0, patternID);
                        this.patternEntryByte2 = this.chrRomHandler.GetPPUByte(0, patternID + 8);
                        this.currentAttributeByte = this.GetAttributeTableEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                        /* end fetch next tile */
                    }
                    /* draw pixel */
                    var tilePixel = this._tilesAreVisible ? this.GetNameTablePixel() : 0;
                    // bool foregroundPixel = isForegroundPixel;
                    var spritePixel = this._spritesAreVisible ? this.GetSpritePixel() : 0;
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
                if (this.currentXPosition === 324) {
                    this.chrRomHandler.UpdateScanlineCounter();
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
        }
        this.LastcpuClock = cpuClockNum;
    };
    ChiChiPPU.prototype.UpdatePixelInfo = function () {
        this.nameTableMemoryStart = this.nameTableBits * 0x400;
    };
    ChiChiPPU.pal = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return ChiChiPPU;
}());
exports.ChiChiPPU = ChiChiPPU;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiCarts_1 = __webpack_require__(3);
var ChiChiAudio_1 = __webpack_require__(4);
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiControl_1 = __webpack_require__(5);
var ChiChiPPU_1 = __webpack_require__(1);
//machine wrapper
var ChiChiMachine = /** @class */ (function () {
    function ChiChiMachine(cpu) {
        var _this = this;
        this.frameJustEnded = true;
        this.frameOn = false;
        this.totalCPUClocks = 0;
        this._enableSound = false;
        var wavSharer = new ChiChiAudio_1.WavSharer();
        this.SoundBopper = new ChiChiAudio_1.ChiChiBopper(wavSharer);
        this.WaveForms = wavSharer;
        this.ppu = new ChiChiPPU_1.ChiChiPPU();
        this.Cpu = cpu ? cpu : new ChiChiCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.ppu.NMIHandler = function () {
            _this.Cpu.NMIHandler();
        };
        this.ppu.frameFinished = function () { _this.FrameFinished(); };
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
    ChiChiMachine.prototype.Reset = function () {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            // ForceStop();
            this.SoundBopper.RebuildSound();
            this.ppu.Initialize();
            this.Cart.InitializeCart();
            this.Cpu.ResetCPU();
            //ClearGenieCodes();
            this.Cpu.PowerOn();
            this.RunState = ChiChiTypes_1.RunningStatuses.Running;
        }
    };
    ChiChiMachine.prototype.PowerOn = function () {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            this.Cpu.ppu.Initialize();
            this.Cart.InitializeCart();
            // if (this.SRAMReader !=  null && this.Cart.UsesSRAM) {
            //     this.Cart.SRAM = this.SRAMReader(this.Cart.ChiChiNES$INESCart$CheckSum);
            // }
            this.Cpu.ResetCPU();
            //ClearGenieCodes();
            this.Cpu.PowerOn();
            this.SoundBopper.RebuildSound();
            this.RunState = ChiChiTypes_1.RunningStatuses.Running;
        }
    };
    ChiChiMachine.prototype.PowerOff = function () {
        this.RunState = ChiChiTypes_1.RunningStatuses.Off;
    };
    ChiChiMachine.prototype.Step = function () {
        if (this.frameJustEnded) {
            this.Cpu.FindNextEvent();
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
        //_cpu.RunFrame();
        this.Cpu.FindNextEvent();
        do {
            this.Cpu.Step();
        } while (this.frameOn);
        this.totalCPUClocks = this.Cpu.Clock;
        this.SoundBopper.FlushFrame(this.totalCPUClocks);
        this.SoundBopper.EndFrame(this.totalCPUClocks);
        //this.SoundBopper.writer.ReadWaves();
        this.totalCPUClocks = 0;
        this.Cpu.Clock = 0;
        this.ppu.LastcpuClock = 0;
    };
    ChiChiMachine.prototype.EjectCart = function () {
        this.Cpu.Cart = null;
        this.ppu.ChrRomHandler = null;
    };
    ChiChiMachine.prototype.LoadNSF = function (rom) {
    };
    ChiChiMachine.prototype.LoadCart = function (rom) {
        var _this = this;
        this.EjectCart();
        var cart = ChiChiCarts_1.iNESFileHandler.LoadROM(this.Cpu, rom);
        if (cart != null) {
            this.Cpu.Cart = cart; // Bridge.cast(this.Cart, ChiChiNES.IClockedMemoryMappedIOElement);
            this.Cart.NMIHandler = function () { _this.Cpu.InterruptRequest(); };
            this.ppu.ChrRomHandler = this.Cart;
        }
        else {
            throw new Error("Unsupported ROM type - load failed.");
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
exports.ChiChiMachine = ChiChiMachine;
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
        this.clock = 0;
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
        this.instructionHistoryPointer = 255;
        this._instructionHistory = new Array(256); //System.Array.init(256, null, ChiChiInstruction);
        // ppu events
        // ppu variables 
        this.backgroundPatternTableIndex = 0;
        //private PPU_HandleVBlankIRQ: boolean;
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
        //
        this.outBuffer = new Uint8Array(65536);
        // 'internal
        this.byteOutBuffer = new Uint8Array(256 * 256 * 4); // System.Array.init(262144, 0, System.Int32);
        this.debugEvents = new Array();
        //this.$initialize();
        // BuildOpArray();
        this.SoundBopper = bopper;
        bopper.NMIHandler = this.IRQUpdater;
        // init PPU
        this.ppu = ppu;
        this.ppu.InitSprites();
        this._padOne = new ChiChiControl_1.ChiChiInputHandler();
        this._padTwo = new ChiChiControl_1.ChiChiInputHandler();
        for (var i = 0; i < this._instructionHistory.length; ++i) {
            this._instructionHistory[i] = new ChiChiTypes_1.ChiChiInstruction();
        }
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
        this.debugEvents.push(value);
    };
    ChiChiCPPU.prototype.removeDebugEvent = function (value) {
        // throw new Error('Method not implemented.');
    };
    Object.defineProperty(ChiChiCPPU.prototype, "Clock", {
        get: function () {
            return this.clock;
        },
        set: function (value) {
            this.clock = value;
            if (value === 0) {
                this.systemClock = (this.systemClock + this.clock) & 0xFFFFFFFFFF;
            }
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
        if (!this.GetFlag(this.SRMasks_InterruptDisableMask)) {
            this.SetFlag(this.SRMasks_InterruptDisableMask, true);
            var newStatusReg1 = this._statusRegister & ~0x10 | 0x20;
            // if enabled
            // push pc onto stack (high byte first)
            this.PushStack(this._programCounter >> 8);
            this.PushStack(this._programCounter);
            // push sr onto stack
            this.PushStack(this._statusRegister);
            // point pc to interrupt service routine
            this._programCounter = this.GetByte(0xFFFE) + (this.GetByte(0xFFFF) << 8);
            // nonOpCodeticks = 7;
        }
    };
    ChiChiCPPU.prototype.NonMaskableInterrupt = function () {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        var newStatusReg = this._statusRegister & ~0x10 | 0x20;
        this.SetFlag(this.SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.PushStack(this._programCounter >> 8);
        this.PushStack(this._programCounter & 0xFF);
        //c7ab
        // push sr onto stack
        this.PushStack(newStatusReg);
        // point pc to interrupt service routine
        var lowByte = this.GetByte(0xFFFA);
        var highByte = this.GetByte(0xFFFB);
        var jumpTo = lowByte | (highByte << 8);
        this._programCounter = jumpTo;
        //nonOpCodeticks = 7;
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
        //let tickCount = 0;
        this._currentInstruction_ExtraTiming = 0;
        // this.ppu.DrawTo(this.clock);
        if (this.nextEvent <= this.clock) {
            this.HandleNextEvent();
        }
        if (this._handleNMI) {
            this._handleNMI = false;
            this.clock += 7;
            this.NonMaskableInterrupt();
        }
        else if (this._handleIRQ) {
            this._handleIRQ = false;
            this.clock += 7;
            this.InterruptRequest();
        }
        //FetchNextInstruction();
        this._currentInstruction_Address = this._programCounter;
        this._currentInstruction_OpCode = this.GetByte(this._programCounter++);
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];
        //FetchInstructionParameters();
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.GetByte(this._programCounter++);
                this._currentInstruction_Parameters1 = this.GetByte(this._programCounter++);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.GetByte(this._programCounter++);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Implicit:
                break;
            default:
                //  throw new Error("Invalid address mode!!");
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
    ChiChiCPPU.prototype.DecodeOperand = function () {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                this._dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator:
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
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
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
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
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
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
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
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX) {
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
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
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
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
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
        this._handleIRQ = this.SoundBopper.IRQAsserted || this.Cart.irqRaised;
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
                result = this.ppu.GetByte(this.clock, address);
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
                result = this.Cart.GetByte(this.clock, address);
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
                this.Cart.SetByte(this.clock, address, data);
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
                this.Cart.SetByte(this.clock, address, data);
                break;
            case 8192:
            case 12288:
                this.ppu.SetByte(this.clock, address, data);
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
                        this.ppu.CopySprites(data * 256);
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
        this.nextEvent = this.clock + this.ppu.NextEventAt;
    };
    ChiChiCPPU.prototype.HandleNextEvent = function () {
        this.ppu.HandleEvent(this.clock);
        this.FindNextEvent();
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
        for (var i = 0; i < this.debugEvents.length; ++i) {
            this.debugEvents[i].call(this, s);
        }
        //throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.PeekInstruction = function (address) {
        throw new Error('Method not implemented.');
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
    // statics
    ChiChiCPPU.cpuTiming = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
    ChiChiCPPU.addressModes = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
    return ChiChiCPPU;
}());
exports.ChiChiCPPU = ChiChiCPPU;


/***/ }),
/* 3 */
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
var iNESFileHandler = /** @class */ (function () {
    function iNESFileHandler() {
    }
    iNESFileHandler.LoadROM = function (cpu, thefile) {
        var _cart = null;
        var iNesHeader = thefile.slice(0, 16);
        var bytesRead = 16;
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
        mapperId = mapperId >> 4;
        mapperId = (mapperId + iNesHeader[7]) | 0;
        var prgRomCount = iNesHeader[4];
        var chrRomCount = iNesHeader[5];
        var prgRomLength = prgRomCount * 16384;
        var chrRomLength = chrRomCount * 16384;
        var theRom = new Uint8Array(prgRomLength); //System.Array.init(Bridge.Int.mul(prgRomCount, 16384), 0, System.Byte);
        theRom.fill(0);
        var chrRom = new Uint8Array(chrRomLength);
        chrRom.fill(0);
        //var chrRom = new Uint8Array(thefile.slice(16 + prgRomLength, 16 + prgRomLength + chrRomLength)); //System.Array.init(Bridge.Int.mul(chrRomCount, 16384), 0, System.Byte);
        //chrRom.fill(0);
        var chrOffset = 0;
        //bytesRead = zipStream.Read(theRom, 0, theRom.Length);
        BaseCart.arrayCopy(thefile, 16, theRom, 0, theRom.length);
        chrOffset = (16 + theRom.length) | 0;
        var len = chrRom.length;
        if (((chrOffset + chrRom.length) | 0) > thefile.length) {
            len = (thefile.length - chrOffset) | 0;
        }
        BaseCart.arrayCopy(thefile, chrOffset, chrRom, 0, len);
        //zipStream.Read(chrRom, 0, chrRom.Length);
        switch (mapperId) {
            case 0:
            case 2:
            case 180:
            case 3:
                _cart = new NesCart();
                break;
            case 97:
                _cart = new Irem097Cart();
                break;
            case 7:
                _cart = new AxROMCart();
                break;
            case 11:
                _cart = new ColorDreams();
                break;
            case 66:
                _cart = new MHROMCart();
                break;
            case 34:
                if (chrRomCount > 0) {
                    _cart = new NINA001Cart();
                }
                else {
                    _cart = new BNROMCart();
                }
                break;
            case 1:
                _cart = new MMC1Cart();
                break;
            case 4:
                _cart = new MMC3Cart();
                break;
            default:
                _cart = new UnsupportedCart();
        }
        if (_cart != null) {
            _cart.Whizzler = cpu.ppu;
            _cart.CPU = cpu;
            cpu.Cart = _cart;
            cpu.ppu.ChrRomHandler = _cart;
            _cart.ROMHashFunction = null; //Hashers.HashFunction;
            _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
        }
        return _cart;
    };
    iNESFileHandler.LoadNSF = function (cpu, thefile) {
        var _cart = null;
        var iNesHeader = thefile.slice(0, 0x80);
        var bytesRead = 0x80;
        var mapperId = (iNesHeader[6] & 240);
        mapperId = mapperId >> 4;
        mapperId = (mapperId + iNesHeader[7]) | 0;
        var prgRomLength = thefile.length - 0x80;
        var theRom = new Array(prgRomLength); //System.Array.init(Bridge.Int.mul(prgRomCount, 16384), 0, System.Byte);
        theRom.fill(0);
        var chrRom = new Array(0);
        chrRom.fill(0);
        //var chrRom = new Uint8Array(thefile.slice(16 + prgRomLength, 16 + prgRomLength + chrRomLength)); //System.Array.init(Bridge.Int.mul(chrRomCount, 16384), 0, System.Byte);
        //chrRom.fill(0);
        var chrOffset = 0;
        //bytesRead = zipStream.Read(theRom, 0, theRom.Length);
        BaseCart.arrayCopy(thefile, 0x80, theRom, 0, theRom.length);
        //zipStream.Read(chrRom, 0, chrRom.Length);
        _cart = new NsfCart();
        if (_cart != null) {
            _cart.Whizzler = cpu.ppu;
            _cart.CPU = cpu;
            cpu.Cart = _cart;
            cpu.ppu.ChrRomHandler = _cart;
            _cart.ROMHashFunction = null; //Hashers.HashFunction;
            //_cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
        }
        return _cart;
    };
    return iNESFileHandler;
}());
exports.iNESFileHandler = iNESFileHandler;
var NameTableMirroring;
(function (NameTableMirroring) {
    NameTableMirroring[NameTableMirroring["OneScreen"] = 0] = "OneScreen";
    NameTableMirroring[NameTableMirroring["Vertical"] = 1] = "Vertical";
    NameTableMirroring[NameTableMirroring["Horizontal"] = 2] = "Horizontal";
    NameTableMirroring[NameTableMirroring["FourScreen"] = 3] = "FourScreen";
})(NameTableMirroring = exports.NameTableMirroring || (exports.NameTableMirroring = {}));
var BaseCart = /** @class */ (function () {
    //ChrRamStart: number;
    function BaseCart() {
        var _this = this;
        this.mapperName = 'base';
        this.supported = true;
        // shared components
        this.prgRomBank6 = new Uint8Array(new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));
        this.ppuBankStarts = new Uint32Array(new SharedArrayBuffer(16 * Uint32Array.BYTES_PER_ELEMENT));
        this.bankStartCache = new Uint32Array(new SharedArrayBuffer(4096 * Uint32Array.BYTES_PER_ELEMENT));
        this.iNesHeader = new Uint8Array(16);
        this.romControlBytes = new Uint8Array(2);
        this.nesCart = null;
        this.chrRom = null;
        this.current8 = -1;
        this.currentA = -1;
        this.currentC = -1;
        this.currentE = -1;
        this.SRAMCanWrite = false;
        this.SRAMEnabled = false;
        this.SRAMCanSave = false;
        this.prgRomCount = 0;
        this.chrRomOffset = 0;
        this.chrRamStart = 0;
        this.chrRomCount = 0;
        this.mapperId = 0;
        this.bank8start = 0;
        this.bankAstart = 0;
        this.bankCstart = 0;
        this.bankEstart = 0;
        this._ROMHashfunction = null;
        this.checkSum = null;
        this.mirroring = -1;
        this.updateIRQ = function () {
            _this.NMIHandler();
        };
        this.bankSwitchesChanged = false;
        this.oneScreenOffset = 0;
        this.irqRaised = false;
        this.DebugEvents = null;
        //IRQAsserted: boolean;
        //NextEventAt: number;
        //PpuBankStarts: any;
        //BankStartCache: any;
        this.CurrentBank = 0;
        //BankSwitchesChanged: boolean;
        //OneScreenOffset: number;
        this.UsesSRAM = false;
        this.prgRomBank6.fill(0);
        for (var i = 0; i < 16; i = (i + 1) | 0) {
            this.ppuBankStarts[i] = i * 1024;
        }
    }
    // compatible with .net array.copy method
    BaseCart.arrayCopy = function (src, spos, dest, dpos, len) {
        if (!dest) {
            throw new Error("dest Value cannot be null");
        }
        if (!src) {
            throw new Error("src Value cannot be null");
        }
        if (spos < 0 || dpos < 0 || len < 0) {
            throw new Error("Number was less than the array's lower bound in the first dimension");
        }
        if (len > (src.length - spos) || len > (dest.length - dpos)) {
            throw new Error("Destination array was not long enough. Check destIndex and length, and the array's lower bounds");
        }
        if (spos < dpos && src === dest) {
            while (--len >= 0) {
                dest[dpos + len] = src[spos + len];
            }
        }
        else {
            for (var i = 0; i < len; i++) {
                dest[dpos + i] = src[spos + i];
            }
        }
    };
    Object.defineProperty(BaseCart.prototype, "NumberOfPrgRoms", {
        // external api
        get: function () {
            return this.prgRomCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCart.prototype, "NumberOfChrRoms", {
        get: function () {
            return this.chrRomCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCart.prototype, "MapperID", {
        get: function () {
            return this.mapperId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCart.prototype, "MapperName", {
        get: function () {
            return this.mapperName;
        },
        enumerable: true,
        configurable: true
    });
    BaseCart.prototype.ClearDebugEvents = function () {
        //this.DebugEvents.clear();
    };
    BaseCart.prototype.LoadiNESCart = function (header, prgRoms, chrRoms, prgRomData, chrRomData, chrRomOffset) {
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
        this.iNesHeader = new Uint8Array(header.slice(0, 16));
        //System.Array.copy(header, 0, this.iNesHeader, 0, header.length);
        this.prgRomCount = prgRoms;
        this.chrRomCount = chrRoms;
        //  this.nesCart = System.Array.init(prgRomData.length, 0, System.Byte);
        // System.Array.copy(prgRomData, 0, this.nesCart, 0, prgRomData.length);
        this.nesCart = new Uint8Array(prgRomData.length);
        BaseCart.arrayCopy(prgRomData, 0, this.nesCart, 0, prgRomData.length);
        if (this.chrRomCount === 0) {
            // chrRom is going to be RAM
            chrRomData = new Array(32768); //System.Array.init(32768, 0, System.Byte);
            chrRomData.fill(0);
        }
        var chrRomBuffer = new SharedArrayBuffer((chrRomData.length + 4096) * Uint8Array.BYTES_PER_ELEMENT);
        this.chrRom = new Uint8Array(chrRomBuffer); //     System.Array.init(((chrRomData.length + 4096) | 0), 0, System.Int32);
        this.chrRamStart = chrRomData.length;
        BaseCart.arrayCopy(chrRomData, 0, this.chrRom, 0, chrRomData.length);
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
        }
        else {
            this.Mirror(0, 2);
        }
        if ((this.romControlBytes[0] & 8) === 8) {
            this.Mirror(0, 3);
        }
        this.checkSum = ""; //ROMHashFunction(nesCart, chrRom);
        this.InitializeCart();
    };
    BaseCart.prototype.GetByte = function (clock, address) {
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
            throw new Error("THis is broken!");
        }
        return this.nesCart[((bank + (address & 8191)) | 0)];
    };
    BaseCart.prototype.SetByte = function (clock, address, data) {
        // throw new Error('Method not implemented.');
    };
    BaseCart.prototype.GetPPUByte = function (clock, address) {
        var bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 1023);
        //while (newAddress > chrRamStart)
        //{
        //    newAddress -= chrRamStart;
        //}
        return this.chrRom[newAddress];
    };
    BaseCart.prototype.SetPPUByte = function (clock, address, data) {
        var bank = address >> 10; //, 1024)) | 0;
        var newAddress = this.bankStartCache[(this.CurrentBank << 4) + bank] + (address & 1023); // ppuBankStarts[bank] + (address & 0x3FF);
        this.chrRom[newAddress] = data;
    };
    BaseCart.prototype.SetupBankStarts = function (reg8, regA, regC, regE) {
        reg8 = this.MaskBankAddress(reg8);
        regA = this.MaskBankAddress(regA);
        regC = this.MaskBankAddress(regC);
        regE = this.MaskBankAddress(regE);
        this.current8 = reg8;
        this.currentA = regA;
        this.currentC = regC;
        this.currentE = regE;
        this.bank8start = reg8 * 8192;
        this.bankAstart = regA * 8192;
        this.bankCstart = regC * 8192;
        this.bankEstart = regE * 8192;
    };
    BaseCart.prototype.MaskBankAddress = function (bank) {
        if (bank >= this.prgRomCount * 2) {
            var i = 255;
            while ((bank & i) >= this.prgRomCount * 2) {
                i = i >> 1;
            }
            return (bank & i);
        }
        else {
            return bank;
        }
    };
    BaseCart.prototype.WriteState = function (state) {
        // throw new Error('Method not implemented.');
    };
    BaseCart.prototype.ReadState = function (state) {
        // throw new Error('Method not implemented.');
    };
    BaseCart.prototype.HandleEvent = function (Clock) {
        //  throw new Error('Method not implemented.');
    };
    BaseCart.prototype.ResetClock = function (Clock) {
        // throw new Error('Method not implemented.');
    };
    BaseCart.prototype.ResetBankStartCache = function () {
        // if (currentBank > 0)
        this.CurrentBank = 0;
        // Array.Clear(bankStartCache, 0, 16 * 256 * 256);
        //System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, 0, 16);
        this.bankStartCache.fill(0);
        for (var i = 0; i < 16; ++i) {
            this.bankStartCache[i] = this.ppuBankStarts[i];
        }
        //Mirror(-1, this.mirroring);
        //chrRamStart = ppuBankStarts[8];
        //Array.Copy(ppuBankStarts, 0, bankStartCache[0], 0, 16 * 4);
        //bankSwitchesChanged = false;
    };
    BaseCart.prototype.UpdateBankStartCache = function () {
        this.CurrentBank = (this.CurrentBank + 1) | 0;
        for (var i = 0; i < 16; ++i) {
            this.bankStartCache[(this.CurrentBank * 16) + i] = this.ppuBankStarts[i];
        }
        //System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, this.CurrentBank * 16, 16);
        this.Whizzler.UpdatePixelInfo();
        return this.CurrentBank;
    };
    BaseCart.prototype.ActualChrRomOffset = function (address) {
        var bank = address >> 10 | 0;
        //int newAddress = ppuBankStarts[bank] + (address & 0x3FF);
        var newAddress = (this.bankStartCache[(this.CurrentBank * 16) + bank] + (address & 1023));
        return newAddress;
    };
    BaseCart.prototype.Mirror = function (clockNum, mirroring) {
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
        //    //        must contain 2kB of additional VRAM 
        this.mirroring = mirroring;
        if (clockNum > -1) {
            this.Whizzler.DrawTo(clockNum);
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
        this.Whizzler.UpdatePixelInfo();
    };
    BaseCart.prototype.InitializeCart = function () {
        //throw new Error('Method not implemented.');
    };
    BaseCart.prototype.UpdateScanlineCounter = function () {
        //throw new Error('Method not implemented.');
    };
    return BaseCart;
}());
exports.BaseCart = BaseCart;
var UnsupportedCart = /** @class */ (function (_super) {
    __extends(UnsupportedCart, _super);
    function UnsupportedCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.supported = false;
        return _this;
    }
    UnsupportedCart.prototype.InitializeCart = function () {
        this.mapperName = 'unsupported';
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
    };
    return UnsupportedCart;
}(BaseCart));
exports.UnsupportedCart = UnsupportedCart;
var NesCart = /** @class */ (function (_super) {
    __extends(NesCart, _super);
    function NesCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //PPUBankStarts: any;
    NesCart.prototype.InitializeCart = function () {
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        switch (this.mapperId) {
            case 0:
                this.mapperName = 'NROM';
                break;
            case 2:
                this.mapperName = 'UxROM';
                break;
            case 3:
                this.mapperName = 'CNROM';
                break;
            case 180:
                this.mapperName = 'UNROM (Crazy Climber?)';
                break;
        }
        switch (this.mapperId) {
            case 0:
            case 2:
            case 180:
            case 3:
                if (this.chrRomCount > 0) {
                    this.CopyBanks(0, 0, 0, 1);
                }
                this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
                break;
            default:
                throw new Error("Mapper " + (this.mapperId.toString() || "") + " not implemented.");
        }
    };
    NesCart.prototype.CopyBanks = function (clock, dest, src, numberOf8kBanks) {
        if (dest >= this.chrRomCount) {
            dest = (this.chrRomCount - 1) | 0;
        }
        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf8kBanks << 3); i = (i + 1) | 0) {
            this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    NesCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        if (this.mapperId === 3 && address >= 32768) {
            this.CopyBanks(clock, 0, val, 1);
        }
        if (this.mapperId === 2 && address >= 32768) {
            var newbank81 = 0;
            newbank81 = val * 2;
            // keep two high banks, swap low banks
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
        }
        if (this.mapperId === 180 && address >= 32768) {
            var newbankC1 = 0;
            newbankC1 = val * 2;
            // keep two LOW banks, swap high banks
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));
        }
    };
    return NesCart;
}(BaseCart));
exports.NesCart = NesCart;
var ColorDreams = /** @class */ (function (_super) {
    __extends(ColorDreams, _super);
    function ColorDreams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorDreams.prototype.InitializeCart = function () {
        this.mapperName = 'Color Dreams';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    ColorDreams.prototype.SetByte = function (clock, address, val) {
        var newbank81 = 0;
        newbank81 = (val & 0x3);
        // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
        this.SetupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
        // two high bits set mirroring
        this.Whizzler.DrawTo(clock);
        var chrBank = (val >> 4) & 0xF;
        this.CopyBanks(clock, 0, chrBank, 1);
        //         %00 = 1ScA
        //         %01 = Horz
        //         %10 = Vert
        //         %11 = 1ScB
        //this.Mirror(clock,(val >> 6));
    };
    return ColorDreams;
}(NesCart));
exports.ColorDreams = ColorDreams;
var MHROMCart = /** @class */ (function (_super) {
    __extends(MHROMCart, _super);
    function MHROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MHROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'GxROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts((this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1, 0, 1);
    };
    MHROMCart.prototype.SetByte = function (clock, address, val) {
        var newbank81 = 0;
        var chrbank = (val & 0x15) << 2;
        var prgbank = ((val >> 4) & 0x3) * 2;
        this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
        this.Whizzler.DrawTo(clock);
        this.CopyBanks(clock, 0, chrbank, 1);
    };
    return MHROMCart;
}(NesCart));
exports.MHROMCart = MHROMCart;
var Irem097Cart = /** @class */ (function (_super) {
    __extends(Irem097Cart, _super);
    function Irem097Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Irem097Cart.prototype.InitializeCart = function () {
        this.mapperName = '~Irem TAM-S1 IC';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts((this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1, 0, 1);
    };
    Irem097Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        var newbankC1 = 0;
        newbankC1 = (val & 0xF) * 2;
        // keep two LOW banks, swap high banks
        // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
        this.SetupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));
        // two high bits set mirroring
        this.Whizzler.DrawTo(clock);
        //         %00 = 1ScA
        //         %01 = Horz
        //         %10 = Vert
        //         %11 = 1ScB
        this.Mirror(clock, (val >> 6));
    };
    return Irem097Cart;
}(NesCart));
exports.Irem097Cart = Irem097Cart;
//  Mapper 7 and derivatives 34
var AxROMCart = /** @class */ (function (_super) {
    __extends(AxROMCart, _super);
    function AxROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // prevBSSrc = new Uint8Array(8);
    AxROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'AxROM';
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
    };
    AxROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        // val selects which bank to swap, 32k at a time
        var newbank8 = 0;
        newbank8 = (val & 15) << 2;
        this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
        // whizzler.DrawTo(clock);
        if ((val & 16) === 16) {
            this.oneScreenOffset = 1024;
        }
        else {
            this.oneScreenOffset = 0;
        }
        this.Whizzler.DrawTo(clock);
        this.Mirror(clock, 0);
    };
    return AxROMCart;
}(BaseCart));
exports.AxROMCart = AxROMCart;
var NsfCart = /** @class */ (function (_super) {
    __extends(NsfCart, _super);
    function NsfCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadNsfAt = 0;
        _this.bank_select = 0;
        _this.rams = new Uint8Array(0xFFFFFFFF);
        return _this;
    }
    NsfCart.prototype.InitializeCart = function () {
        this.mapperName = 'NSF';
    };
    NsfCart.prototype.GetPPUByte = function (clock, address) {
        return 0;
    };
    NsfCart.prototype.GetByte = function (clock, address) {
        return this.rams[address];
    };
    NsfCart.prototype.__SetByte = function (address, data) {
        var bank = 0;
        this.rams[address] = data;
    };
    NsfCart.prototype.LoadNSFFile = function (header, prgRoms, chrRoms, prgRomData, chrRomData, chrRomOffset) {
        this.mapperId = -1;
        //        $000    5   STRING  'N', 'E', 'S', 'M', $1A(denotes an NES sound format file)
        //        $005    1   BYTE    Version number (currently $01)
        //        $006    1   BYTE    Total songs   (1 = 1 song, 2 = 2 songs, etc)
        //        $007    1   BYTE    Starting song (1 = 1st song, 2 = 2nd song, etc)
        //        $008    2   WORD    (lo, hi) load address of data ($8000 - FFFF)
        //        $00A    2   WORD    (lo, hi) init address of data ($8000 - FFFF)
        //        $00C    2   WORD    (lo, hi) play address of data ($8000 - FFFF)
        //        $00E    32  STRING  The name of the song, null terminated
        //        $02E    32  STRING  The artist, if known, null terminated
        //        $04E    32  STRING  The copyright holder, null terminated
        //        $06E    2   WORD    (lo, hi) Play speed, in 1 / 1000000th sec ticks, NTSC(see text)
        //        $070    8   BYTE    Bankswitch init values (see text, and FDS section)
        //        $078    2   WORD    (lo, hi) Play speed, in 1 / 1000000th sec ticks, PAL(see text)
        //        $07A    1   BYTE    PAL/ NTSC bits
        //        bit 0: if clear, this is an NTSC tune
        //        bit 0: if set, this is a PAL tune
        //        bit 1: if set, this is a dual PAL/ NTSC tune
        //        bits 2- 7: not used.they * must * be 0
        //        $07B    1   BYTE    Extra Sound Chip Support
        //        bit 0: if set, this song uses VRC6 audio
        //        bit 1: if set, this song uses VRC7 audio
        //        bit 2: if set, this song uses FDS audio
        //        bit 3: if set, this song uses MMC5 audio
        //        bit 4: if set, this song uses Namco 163 audio
        //        bit 5: if set, this song uses Sunsoft 5B audio
        //        bits 6, 7: future expansion: they * must * be 0
        //        $07C    1   BYTE    Extra Sound Chip Support (Cont.)
        //        bits 0- 3: future expansion: they * must * be 0
        //        bits 4- 7: unavailable(conflicts with NSF2 backwards compatibility)
        //        $07D    3   ----    3 extra bytes for expansion (must be $00)
        //        $080    nnn ----    The music program/ data follows until end of file
        this.prgRomCount = prgRoms;
        this.chrRomCount = chrRoms;
        this.SetupBankStarts(0, 1, 3, 4);
        this.songCount = header[0x06];
        this.firstSong = header[0x07];
        this.loadNsfAt = (header[0x09] << 8) + header[0x08];
        this.initNsfAt = (header[0x0B] << 8) + header[0x0A];
        this.runNsfAt = (header[0x0D] << 8) + header[0x0C];
        this.songName = header.slice(0x0E, 0x0e + 32).map(function (v) { return String.fromCharCode(v); }).join('').trim();
        this.artist = header.slice(0x02E, 0x0e + 32).map(function (v) { return String.fromCharCode(v); }).join('').trim();
        this.copyright = header.slice(0x4E, 0x0e + 32).map(function (v) { return String.fromCharCode(v); }).join('').trim();
        var address = this.loadNsfAt;
        for (var i = 0; i < prgRomData.length - 0x80; ++i) {
            this.__SetByte(address + i, prgRomData[0x80 + i]);
        }
        // set init code at reset spot
        this.__SetByte(0xFFFC, header[0x0A]);
        this.__SetByte(0xFFFD, header[0x0B]); // << 8)
        this.prgRomCount = prgRomData.length / 1024;
        this.chrRomCount = 0; //this.iNesHeader[5];
        this.SRAMEnabled = true;
        this.checkSum = ""; //ROMHashFunction(nesCart, chrRom);
        this.InitializeCart();
    };
    return NsfCart;
}(BaseCart));
exports.NsfCart = NsfCart;
var BNROMCart = /** @class */ (function (_super) {
    __extends(BNROMCart, _super);
    function BNROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BNROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'BNROM';
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
    };
    BNROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        // val selects which bank to swap, 32k at a time
        var newbank8 = 0;
        newbank8 = (val & 15) << 2;
        this.Whizzler.DrawTo(clock);
        this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
        // whizzler.DrawTo(clock);
    };
    return BNROMCart;
}(AxROMCart));
exports.BNROMCart = BNROMCart;
var NINA001Cart = /** @class */ (function (_super) {
    __extends(NINA001Cart, _super);
    function NINA001Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NINA001Cart.prototype.InitializeCart = function () {
        this.mapperName = 'BNROM';
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
    };
    NINA001Cart.prototype.CopyBanks = function (clock, dest, src, numberOf4kBanks) {
        if (dest >= this.chrRomCount) {
            dest = (this.chrRomCount - 1) | 0;
        }
        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        for (var i = 0; i < (numberOf4kBanks << 2); i = (i + 1) | 0) {
            this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    NINA001Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        switch (address) {
            case 0x7FFD:
                // val selects which bank to swap, 32k at a time
                var newbank8 = 0;
                newbank8 = (val & 15) << 2;
                this.SetupBankStarts(newbank8, ((newbank8 + 1) | 0), ((newbank8 + 2) | 0), ((newbank8 + 3) | 0));
                break;
            case 0x7FFE:
                // Select 4 KB CHR ROM bank for PPU $0000-$0FFF
                this.CopyBanks(clock, 0, val, 1);
                break;
            case 0x7FFF:
                // Select 4 KB CHR ROM bank for PPU $1000-$1FFF
                this.CopyBanks(clock, 1, val, 1);
                break;
        }
    };
    return NINA001Cart;
}(AxROMCart));
exports.NINA001Cart = NINA001Cart;
// MMC 
var MMC1Cart = /** @class */ (function (_super) {
    __extends(MMC1Cart, _super);
    function MMC1Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastClock = 0;
        _this.sequence = 0;
        _this.accumulator = 0;
        _this.bank_select = 0;
        _this._registers = new Array(4);
        _this.lastwriteAddress = 0;
        return _this;
    }
    MMC1Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC1';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 4);
        }
        this._registers[0] = 12;
        this._registers[1] = 0;
        this._registers[2] = 0;
        this._registers[3] = 0;
        this.SetupBankStarts(0, 1, ((this.prgRomCount * 2 - 2) | 0), ((this.prgRomCount * 2 - 1) | 0));
        this.sequence = 0;
        this.accumulator = 0;
    };
    MMC1Cart.prototype.MaskBankAddress$1 = function (bank) {
        if (bank >= (this.prgRomCount << 1)) {
            var i;
            i = 255;
            while ((bank & i) >= this.prgRomCount * 2) {
                i = (i >> 1) & 255;
            }
            return (bank & i);
        }
        else {
            return bank;
        }
    };
    MMC1Cart.prototype.CopyBanks = function (dest, src, numberOf4kBanks) {
        if (this.chrRomCount > 0) {
            var oneKdest = dest * 4;
            var oneKsrc = src * 4;
            //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
            //  setup ppuBankStarts in 0x400 block chunks 
            for (var i = 0; i < (numberOf4kBanks << 2); i = (i + 1) | 0) {
                this.ppuBankStarts[((oneKdest + i) | 0)] = (((oneKsrc + i) | 0)) << 10;
            }
            //Array.Copy(chrRom, src * 0x1000, whizzler.cartCopyVidRAM, dest * 0x1000, numberOf4kBanks * 0x1000);
        }
        this.UpdateBankStartCache();
    };
    MMC1Cart.prototype.SetByte = function (clock, address, val) {
        // if write is to a different register, reset
        this.lastClock = clock;
        switch (address & 0xF000) {
            case 0x6000:
            case 0x7000:
                this.prgRomBank6[address & 8191] = val & 255;
                break;
            default:
                this.lastwriteAddress = address;
                if ((val & 128) === 128) {
                    this._registers[0] = this._registers[0] | 12;
                    this.accumulator = 0; // _registers[(address / 0x2000) & 3];
                    this.sequence = 0;
                }
                else {
                    if ((val & 1) === 1) {
                        this.accumulator = this.accumulator | (1 << this.sequence);
                    }
                    this.sequence = (this.sequence + 1) | 0;
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
    };
    MMC1Cart.prototype.SetMMC1ChrBanking = function (clock) {
        //	bit 4 - sets 8KB or 4KB CHRROM switching mode
        // 0 = 8KB CHRROM banks, 1 = 4KB CHRROM banks
        this.Whizzler.DrawTo(clock);
        if ((this._registers[0] & 16) === 16) {
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, this._registers[2], 1);
        }
        else {
            //CopyBanks(0, _registers[1], 2);
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, ((this._registers[1] + 1) | 0), 1);
        }
        this.bankSwitchesChanged = true;
        this.Whizzler.UpdatePixelInfo();
    };
    MMC1Cart.prototype.SetMMC1PrgBanking = function () {
        var reg = 0;
        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;
        }
        else {
            this.bank_select = 0;
        }
        if ((this._registers[0] & 8) === 0) {
            reg = (4 * ((this._registers[3] >> 1) & 15) + this.bank_select) | 0;
            this.SetupBankStarts(reg, ((reg + 1) | 0), ((reg + 2) | 0), ((reg + 3) | 0));
        }
        else {
            reg = (2 * (this._registers[3]) + this.bank_select) | 0;
            //bit 2 - toggles between low PRGROM area switching and high
            //PRGROM area switching
            //0 = high PRGROM switching, 1 = low PRGROM switching
            if ((this._registers[0] & 4) === 4) {
                // select 16k bank in register 3 (setupbankstarts switches 8k banks)
                this.SetupBankStarts(reg, ((reg + 1) | 0), (((this.prgRomCount << 1) - 2) | 0), (((this.prgRomCount << 1) - 1) | 0));
                //SetupBanks(reg8, reg8 + 1, 0xFE, 0xFF);
            }
            else {
                this.SetupBankStarts(0, 1, reg, ((reg + 1) | 0));
            }
        }
    };
    MMC1Cart.prototype.SetMMC1Mirroring = function (clock) {
        //bit 1 - toggles between H/V and "one-screen" mirroring
        //0 = one-screen mirroring, 1 = H/V mirroring
        this.Whizzler.DrawTo(clock);
        switch (this._registers[0] & 3) {
            case 0:
                this.oneScreenOffset = 0;
                this.Mirror(clock, 0);
                break;
            case 1:
                this.oneScreenOffset = 1024;
                this.Mirror(clock, 0);
                break;
            case 2:
                this.Mirror(clock, 1); // vertical
                break;
            case 3:
                this.Mirror(clock, 2); // horizontal
                break;
        }
        this.bankSwitchesChanged = true;
        this.Whizzler.UpdatePixelInfo();
    };
    return MMC1Cart;
}(BaseCart));
exports.MMC1Cart = MMC1Cart;
var MMC2Cart = /** @class */ (function (_super) {
    __extends(MMC2Cart, _super);
    function MMC2Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastClock = 0;
        _this.sequence = 0;
        _this.accumulator = 0;
        _this.bank_select = 0;
        _this._registers = new Array(4);
        _this.lastwriteAddress = 0;
        return _this;
    }
    MMC2Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC2';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 4);
        }
        this._registers[0] = 12;
        this._registers[1] = 0;
        this._registers[2] = 0;
        this._registers[3] = 0;
        this.SetupBankStarts(0, 1, ((this.prgRomCount * 2 - 2) | 0), ((this.prgRomCount * 2 - 1) | 0));
        this.sequence = 0;
        this.accumulator = 0;
    };
    MMC2Cart.prototype.MaskBankAddress$1 = function (bank) {
        if (bank >= (this.prgRomCount << 1)) {
            var i;
            i = 255;
            while ((bank & i) >= this.prgRomCount * 2) {
                i = (i >> 1) & 255;
            }
            return (bank & i);
        }
        else {
            return bank;
        }
    };
    MMC2Cart.prototype.CopyBanks = function (dest, src, numberOf4kBanks) {
        if (this.chrRomCount > 0) {
            var oneKdest = dest * 4;
            var oneKsrc = src * 4;
            //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
            //  setup ppuBankStarts in 0x400 block chunks 
            for (var i = 0; i < (numberOf4kBanks << 2); i = (i + 1) | 0) {
                this.ppuBankStarts[((oneKdest + i) | 0)] = (((oneKsrc + i) | 0)) << 10;
            }
            //Array.Copy(chrRom, src * 0x1000, whizzler.cartCopyVidRAM, dest * 0x1000, numberOf4kBanks * 0x1000);
        }
        this.UpdateBankStartCache();
    };
    MMC2Cart.prototype.SetByte = function (clock, address, val) {
        // if write is to a different register, reset
        this.lastClock = clock;
        switch (address & 61440) {
            case 24576:
            case 28672:
                this.prgRomBank6[address & 8191] = val & 255;
                break;
            default:
                this.lastwriteAddress = address;
                if ((val & 128) === 128) {
                    this._registers[0] = this._registers[0] | 12;
                    this.accumulator = 0; // _registers[(address / 0x2000) & 3];
                    this.sequence = 0;
                }
                else {
                    if ((val & 1) === 1) {
                        this.accumulator = this.accumulator | (1 << this.sequence);
                    }
                    this.sequence = (this.sequence + 1) | 0;
                }
                if (this.sequence === 5) {
                    var regnum = (address & 32767) >> 13;
                    this._registers[(address & 32767) >> 13] = this.accumulator;
                    this.sequence = 0;
                    this.accumulator = 0;
                    switch (regnum) {
                        case 0:
                            this.SetMMC2Mirroring(clock);
                            break;
                        case 1:
                        case 2:
                            this.SetMMC2ChrBanking(clock);
                            break;
                        case 3:
                            this.SetMMC2PrgBanking();
                            break;
                    }
                }
                break;
        }
    };
    MMC2Cart.prototype.SetMMC2ChrBanking = function (clock) {
        //	bit 4 - sets 8KB or 4KB CHRROM switching mode
        // 0 = 8KB CHRROM banks, 1 = 4KB CHRROM banks
        this.Whizzler.DrawTo(clock);
        if ((this._registers[0] & 16) === 16) {
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, this._registers[2], 1);
        }
        else {
            //CopyBanks(0, _registers[1], 2);
            this.CopyBanks(0, this._registers[1], 1);
            this.CopyBanks(1, ((this._registers[1] + 1) | 0), 1);
        }
        this.bankSwitchesChanged = true;
        this.Whizzler.UpdatePixelInfo();
    };
    MMC2Cart.prototype.SetMMC2PrgBanking = function () {
        var reg = 0;
        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;
        }
        else {
            this.bank_select = 0;
        }
        if ((this._registers[0] & 8) === 0) {
            reg = (4 * ((this._registers[3] >> 1) & 15) + this.bank_select) | 0;
            this.SetupBankStarts(reg, ((reg + 1) | 0), ((reg + 2) | 0), ((reg + 3) | 0));
        }
        else {
            reg = (2 * (this._registers[3]) + this.bank_select) | 0;
            //bit 2 - toggles between low PRGROM area switching and high
            //PRGROM area switching
            //0 = high PRGROM switching, 1 = low PRGROM switching
            if ((this._registers[0] & 4) === 4) {
                // select 16k bank in register 3 (setupbankstarts switches 8k banks)
                this.SetupBankStarts(reg, ((reg + 1) | 0), (((this.prgRomCount << 1) - 2) | 0), (((this.prgRomCount << 1) - 1) | 0));
                //SetupBanks(reg8, reg8 + 1, 0xFE, 0xFF);
            }
            else {
                this.SetupBankStarts(0, 1, reg, ((reg + 1) | 0));
            }
        }
    };
    MMC2Cart.prototype.SetMMC2Mirroring = function (clock) {
        //bit 1 - toggles between H/V and "one-screen" mirroring
        //0 = one-screen mirroring, 1 = H/V mirroring
        this.Whizzler.DrawTo(clock);
        switch (this._registers[0] & 3) {
            case 0:
                this.oneScreenOffset = 0;
                this.Mirror(clock, 0);
                break;
            case 1:
                this.oneScreenOffset = 1024;
                this.Mirror(clock, 0);
                break;
            case 2:
                this.Mirror(clock, 1); // vertical
                break;
            case 3:
                this.Mirror(clock, 2); // horizontal
                break;
        }
        this.bankSwitchesChanged = true;
        this.Whizzler.UpdatePixelInfo();
    };
    return MMC2Cart;
}(BaseCart));
exports.MMC2Cart = MMC2Cart;
var MMC3Cart = /** @class */ (function (_super) {
    __extends(MMC3Cart, _super);
    function MMC3Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._registers = new Uint8Array(4);
        _this.chr2kBank0 = 0;
        _this.chr2kBank1 = 1;
        _this.chr1kBank0 = 0;
        _this.chr1kBank1 = 0;
        _this.chr1kBank2 = 0;
        _this.chr1kBank3 = 0;
        _this.prgSwap = 0;
        _this.prgSwitch1 = 0;
        _this.prgSwitch2 = 0;
        _this.prevBSSrc = new Uint8Array(8);
        _this._mmc3Command = 0;
        _this._mmc3ChrAddr = 0;
        _this._mmc3IrqVal = 0;
        _this._mmc3TmpVal = 0;
        _this.scanlineCounter = 0;
        _this._mmc3IrcOn = false;
        _this.ppuBankSwap = false;
        _this.PPUBanks = new Uint32Array(8);
        return _this;
    }
    MMC3Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC3';
        this._registers.fill(0);
        this.PPUBanks.fill(0);
        this.prevBSSrc.fill(0);
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
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 8);
        }
    };
    MMC3Cart.prototype.MaskBankAddress = function (bank) {
        if (bank >= this.prgRomCount * 2) {
            var i = 255;
            while ((bank & i) >= this.prgRomCount * 2) {
                i = i >> 1;
            }
            return (bank & i);
        }
        else {
            return bank;
        }
    };
    MMC3Cart.prototype.CopyBanks = function (dest, src, numberOf1kBanks) {
        var $t;
        if (this.chrRomCount > 0) {
            for (var i = 0; i < numberOf1kBanks; i = (i + 1) | 0) {
                this.ppuBankStarts[((dest + i) | 0)] = (src + i) * 1024;
            }
            this.bankSwitchesChanged = true;
            //Array.Copy(chrRom, src * 0x400, whizzler.cartCopyVidRAM, dest * 0x400, numberOf1kBanks * 0x400);
        }
    };
    MMC3Cart.prototype.SetByte = function (clock, address, val) {
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
                }
                else {
                    this.ppuBankSwap = false;
                    this._mmc3ChrAddr = 0;
                }
                if ((val & 64) === 64) {
                    this.prgSwap = 1;
                }
                else {
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
                }
                else {
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
                if (this.updateIRQ) {
                    this.updateIRQ();
                }
                break;
            case 57345:
                this._mmc3IrcOn = true;
                break;
        }
    };
    MMC3Cart.prototype.SwapChrBanks = function () {
        if (this.ppuBankSwap) {
            this.CopyBanks(0, this.chr1kBank0, 1);
            this.CopyBanks(1, this.chr1kBank1, 1);
            this.CopyBanks(2, this.chr1kBank2, 1);
            this.CopyBanks(3, this.chr1kBank3, 1);
            this.CopyBanks(4, this.chr2kBank0, 2);
            this.CopyBanks(6, this.chr2kBank1, 2);
        }
        else {
            this.CopyBanks(4, this.chr1kBank0, 1);
            this.CopyBanks(5, this.chr1kBank1, 1);
            this.CopyBanks(6, this.chr1kBank2, 1);
            this.CopyBanks(7, this.chr1kBank3, 1);
            this.CopyBanks(0, this.chr2kBank0, 2);
            this.CopyBanks(2, this.chr2kBank1, 2);
        }
    };
    MMC3Cart.prototype.SwapPrgRomBanks = function () {
        //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
        //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)
        if (this.prgSwap === 1) {
            this.SetupBankStarts(((this.prgRomCount * 2 - 2) | 0), this.prgSwitch2, this.prgSwitch1, ((this.prgRomCount * 2 - 1) | 0));
        }
        else {
            this.SetupBankStarts(this.prgSwitch1, this.prgSwitch2, ((this.prgRomCount * 2 - 2) | 0), ((this.prgRomCount * 2 - 1) | 0));
        }
    };
    MMC3Cart.prototype.UpdateScanlineCounter = function () {
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
        }
        else {
            this.scanlineCounter = (((this.scanlineCounter - 1) | 0)) & 255;
        }
        if (this.scanlineCounter === 0) {
            if (this._mmc3IrcOn) {
                this.irqRaised = true;
                if (this.updateIRQ) {
                    this.updateIRQ();
                }
            }
            if (this._mmc3IrqVal > 0) {
                this.scanlineCounter = this._mmc3IrqVal;
            }
        }
    };
    return MMC3Cart;
}(BaseCart));
exports.MMC3Cart = MMC3Cart;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(0);
// shared buffer to get sound out
var WavSharer = /** @class */ (function () {
    function WavSharer() {
        this.NES_BYTES_WRITTEN = 0;
        this.WAVSHARER_BLOCKTHREAD = 1;
        this.controlBuffer = new Int32Array(new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT));
        this.sharedAudioBufferPos = 0;
        this.SharedBufferLength = 8192;
        this.chunkSize = 2048;
        this.SharedBuffer = new Float32Array(this.SharedBufferLength);
    }
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
        while (this.audioBytesWritten >= this.chunkSize) {
            Atomics.wait(this.controlBuffer, this.NES_BYTES_WRITTEN, this.audioBytesWritten);
        }
    };
    WavSharer.sample_size = 1;
    return WavSharer;
}());
exports.WavSharer = WavSharer;
//apu classes
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
        this.samples.fill(0);
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
        this.BlipBuffer.samples.fill(0);
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
    };
    Blip.prototype.ReadBytes = function (outbuf, count, stereo) {
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
    };
    // reads 'count' elements into array 'outbuf', beginning at 'start' and looping at array boundary if needed
    // returns number of elements written
    Blip.prototype.ReadElementsLoop = function (wavSharer) {
        var outbuf = wavSharer.SharedBuffer;
        var start = wavSharer.sharedAudioBufferPos;
        var count = this.BlipBuffer.avail;
        var inPtr = 0, outPtr = start;
        var end = count;
        var sum = this.BlipBuffer.integrator;
        if (count !== 0) {
            var step = 1;
            do {
                var st = sum >> Blip.delta_bits; /* assumes right shift preserves sign */
                sum = sum + this.BlipBuffer.samples[inPtr];
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
            this.BlipBuffer.integrator = sum;
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
        var fixedTime = (time * this.BlipBuffer.factor + this.BlipBuffer.offset) | 0;
        var outPtr = (this.BlipBuffer.avail + (fixedTime >> Blip.time_bits));
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
            this.BlipBuffer.samples[outPtr + i] += (Blip.bl_step[inStep][i] * delta) + (Blip.bl_step[inStep][i] * delta2);
            this.BlipBuffer.samples[outPtr + (15 - i)] += (Blip.bl_step[rev][i] * delta) + (Blip.bl_step[rev - 1][i] * delta2);
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
var PortWriteEntry = /** @class */ (function () {
    function PortWriteEntry(time, address, data) {
        this.time = time;
        this.address = address;
        this.data = data;
    }
    return PortWriteEntry;
}());
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
var DMCChannel = /** @class */ (function () {
    function DMCChannel(bleeper, chan) {
    }
    DMCChannel.prototype.WriteRegister = function (register, data, time) {
        //throw new Error('Method not implemented.');
    };
    DMCChannel.prototype.Run = function (end_time) {
        //throw new Error('Method not implemented.');
    };
    DMCChannel.prototype.UpdateAmplitude = function (new_amp) {
        // throw new Error('Method not implemented.');
    };
    DMCChannel.prototype.EndFrame = function (time) {
        //  throw new Error('Method not implemented.');
    };
    DMCChannel.prototype.FrameClock = function (time, step) {
        //  throw new Error('Method not implemented.');
    };
    return DMCChannel;
}());
var NoiseChannel = /** @class */ (function () {
    function NoiseChannel(bleeper, chan) {
        this._bleeper = null;
        this._chan = 0;
        this.NoisePeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
        this.LengthCounts = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
        this._length = 0;
        this._period = 0;
        this._volume = 0;
        this._time = 0;
        this._envConstantVolume = false;
        this._envVolume = 0;
        this._looping = false;
        this._enabled = false;
        this.amplitude = 0;
        this._phase = 0;
        this.gain = 0;
        this._envTimer = 0;
        this._envStart = false;
        this._bleeper = bleeper;
        this._chan = chan;
        this._enabled = true;
        this._phase = 1;
        this._envTimer = 15;
    }
    Object.defineProperty(NoiseChannel.prototype, "Period", {
        get: function () {
            return this._period;
        },
        set: function (value) {
            this._period = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NoiseChannel.prototype, "Volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NoiseChannel.prototype, "Time", {
        get: function () {
            return this._time;
        },
        set: function (value) {
            this._time = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NoiseChannel.prototype, "Looping", {
        get: function () {
            return this._looping;
        },
        set: function (value) {
            this._looping = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NoiseChannel.prototype, "Enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NoiseChannel.prototype, "Gain", {
        get: function () {
            return this.gain;
        },
        set: function (value) {
            this.gain = value;
        },
        enumerable: true,
        configurable: true
    });
    NoiseChannel.prototype.WriteRegister = function (register, data, time) {
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
    };
    NoiseChannel.prototype.Run = function (end_time) {
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
            case 2:
                if (!this._looping && this._length > 0) {
                    this._length--;
                }
                break;
        }
    };
    return NoiseChannel;
}());
var TriangleChannel = /** @class */ (function () {
    function TriangleChannel(bleeper, chan) {
        this._chan = 0;
        this.LengthCounts = new Uint8Array([
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
        this.LengthCounts = new Uint8Array([
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
    };
    SquareChannel.prototype.Run = function (end_time) {
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
        this.throwingIRQs = false;
        this.reg15 = 0;
        this.master_vol = 4369;
        this.registers = new QueuedPort();
        this._sampleRate = 44100;
        this.square0Gain = 873;
        this.square1Gain = 873;
        this.triangleGain = 1004;
        this.noiseGain = 567;
        this.muted = false;
        this.lastFrameHit = 0;
        this.RebuildSound();
    }
    Object.defineProperty(ChiChiBopper.prototype, "audioSettings", {
        get: function () {
            var settings = new ChiChiTypes_1.AudioSettings();
            settings.sampleRate = this._sampleRate;
            settings.enableNoise = this.EnableNoise;
            settings.enableSquare0 = this.EnableSquare0;
            settings.enableSquare1 = this.EnableSquare1;
            settings.enableTriangle = this.enableTriangle;
            return settings;
        },
        set: function (value) {
            this.EnableNoise = value.enableNoise;
            this.EnableSquare0 = value.enableSquare0;
            this.EnableSquare1 = value.enableSquare1;
            this.enableTriangle = value.enableTriangle;
            if (value.sampleRate != this._sampleRate) {
                this._sampleRate = value.sampleRate;
                this.RebuildSound();
            }
        },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(ChiChiBopper.prototype, "enableTriangle", {
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
        this.myBlipper = new Blip(this._sampleRate / 5);
        this.myBlipper.blip_set_rates(ChiChiBopper.clock_rate, this._sampleRate);
        //this.writer = new ChiChiNES.BeepsBoops.WavSharer();
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
        this.noise = new NoiseChannel(this.myBlipper, 3);
        this.noise.Gain = this.noiseGain;
        this.noise.Period = 0;
        this.dmc = new DMCChannel(this.myBlipper, 4);
        this.dmc.Gain = 873;
        this.dmc.Period = 10;
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
        this.registers.enqueue(new PortWriteEntry(Clock, address, data));
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
        //var count = this.myBlipper.ReadBytes(this.writer.SharedBuffer, this.writer.SharedBuffer.length / 2, 0);
        // const startPos = this.writer.sharedAudioBufferPos;
        this.myBlipper.ReadElementsLoop(this.writer);
        //this.writer.audioBytesWritten += count;
        //this.writer.sharedAudioBufferPos += count;
        //this.writer.WavesWritten(count);
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
exports.ChiChiBopper = ChiChiBopper;


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiMachine_1 = __webpack_require__(2);
exports.ChiChiCPPU = ChiChiMachine_1.ChiChiCPPU;
exports.ChiChiMachine = ChiChiMachine_1.ChiChiMachine;
var ChiChiNsfMachine_1 = __webpack_require__(7);
exports.ChiChiNsfCPPU = ChiChiNsfMachine_1.ChiChiNsfCPPU;
exports.ChiChiNsfMachine = ChiChiNsfMachine_1.ChiChiNsfMachine;
var ChiChiCarts_1 = __webpack_require__(3);
exports.BaseCart = ChiChiCarts_1.BaseCart;
exports.NesCart = ChiChiCarts_1.NesCart;
exports.AxROMCart = ChiChiCarts_1.AxROMCart;
exports.NsfCart = ChiChiCarts_1.NsfCart;
exports.MMC1Cart = ChiChiCarts_1.MMC1Cart;
exports.MMC3Cart = ChiChiCarts_1.MMC3Cart;
exports.iNESFileHandler = ChiChiCarts_1.iNESFileHandler;
var ChiChiControl_1 = __webpack_require__(5);
exports.ChiChiInputHandler = ChiChiControl_1.ChiChiInputHandler;
var ChiChiAudio_1 = __webpack_require__(4);
exports.WavSharer = ChiChiAudio_1.WavSharer;
exports.ChiChiBopper = ChiChiAudio_1.ChiChiBopper;
var ChiChiPPU_1 = __webpack_require__(1);
exports.ChiChiPPU = ChiChiPPU_1.ChiChiPPU;
var ChiChiTypes_1 = __webpack_require__(0);
exports.RunningStatuses = ChiChiTypes_1.RunningStatuses;
exports.ChiChiCPPU_AddressingModes = ChiChiTypes_1.ChiChiCPPU_AddressingModes;
exports.CpuStatus = ChiChiTypes_1.CpuStatus;
exports.PpuStatus = ChiChiTypes_1.PpuStatus;
exports.ChiChiInstruction = ChiChiTypes_1.ChiChiInstruction;
exports.ChiChiSprite = ChiChiTypes_1.ChiChiSprite;
exports.AudioSettings = ChiChiTypes_1.AudioSettings;


/***/ }),
/* 7 */
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
var ChiChiMachine_1 = __webpack_require__(2);
var ChiChiPPU_1 = __webpack_require__(1);
var ChiChiNsfMachine = /** @class */ (function (_super) {
    __extends(ChiChiNsfMachine, _super);
    function ChiChiNsfMachine() {
        var _this = _super.call(this) || this;
        _this.ppu = new ChiChiPPU_1.ChiChiPPU();
        _this.Cpu = new ChiChiNsfCPPU(_this.SoundBopper, _this.ppu);
        _this.Cpu.ppu = _this.ppu;
        _this.Cpu.frameFinished = function () { _this.FrameFinished(); };
        return _this;
    }
    ChiChiNsfMachine.prototype.LoadNsf = function (rom) {
        this.Cpu.LoadNsf(rom);
    };
    return ChiChiNsfMachine;
}(ChiChiMachine_1.ChiChiMachine));
exports.ChiChiNsfMachine = ChiChiNsfMachine;
var ChiChiNsfCPPU = /** @class */ (function (_super) {
    __extends(ChiChiNsfCPPU, _super);
    function ChiChiNsfCPPU() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.runNsfAt = 0;
        _this.loadNsfAt = 0;
        _this.initNsfAt = 0;
        _this.firstSong = 0;
        _this.songCount = 0;
        return _this;
    }
    ChiChiNsfCPPU.prototype.__SetByte = function (address, data) {
        var bank = 0;
        this.Rams[address] = data;
    };
    ChiChiNsfCPPU.prototype.GetByte = function (address) {
        return this.Rams[address];
    };
    ChiChiNsfCPPU.prototype.LoadNsf = function (nsfFile) {
        var header = nsfFile.slice(0, 16);
        var ramsBuffer = new SharedArrayBuffer(0x10000 * Uint8Array.BYTES_PER_ELEMENT);
        this.Rams = new Uint8Array(ramsBuffer); // System.Array.init(vv, 0, System.Int32);
        this.Rams.fill(0);
        //        $000    5   STRING  'N', 'E', 'S', 'M', $1A(denotes an NES sound format file)
        //        $005    1   BYTE    Version number (currently $01)
        //        $006    1   BYTE    Total songs   (1 = 1 song, 2 = 2 songs, etc)
        //        $007    1   BYTE    Starting song (1 = 1st song, 2 = 2nd song, etc)
        //        $008    2   WORD    (lo, hi) load address of data ($8000 - FFFF)
        //        $00A    2   WORD    (lo, hi) init address of data ($8000 - FFFF)
        //        $00C    2   WORD    (lo, hi) play address of data ($8000 - FFFF)
        //        $00E    32  STRING  The name of the song, null terminated
        //        $02E    32  STRING  The artist, if known, null terminated
        //        $04E    32  STRING  The copyright holder, null terminated
        //        $06E    2   WORD    (lo, hi) Play speed, in 1 / 1000000th sec ticks, NTSC(see text)
        //        $070    8   BYTE    Bankswitch init values (see text, and FDS section)
        //        $078    2   WORD    (lo, hi) Play speed, in 1 / 1000000th sec ticks, PAL(see text)
        //        $07A    1   BYTE    PAL/ NTSC bits
        //        bit 0: if clear, this is an NTSC tune
        //        bit 0: if set, this is a PAL tune
        //        bit 1: if set, this is a dual PAL/ NTSC tune
        //        bits 2- 7: not used.they * must * be 0
        //        $07B    1   BYTE    Extra Sound Chip Support
        //        bit 0: if set, this song uses VRC6 audio
        //        bit 1: if set, this song uses VRC7 audio
        //        bit 2: if set, this song uses FDS audio
        //        bit 3: if set, this song uses MMC5 audio
        //        bit 4: if set, this song uses Namco 163 audio
        //        bit 5: if set, this song uses Sunsoft 5B audio
        //        bits 6, 7: future expansion: they * must * be 0
        //        $07C    1   BYTE    Extra Sound Chip Support (Cont.)
        //        bits 0- 3: future expansion: they * must * be 0
        //        bits 4- 7: unavailable(conflicts with NSF2 backwards compatibility)
        //        $07D    3   ----    3 extra bytes for expansion (must be $00)
        //        $080    nnn ----    The music program/ data follows until end of file
        this.songCount = header[0x06];
        this.firstSong = header[0x07];
        this.loadNsfAt = (header[0x09] << 8) + header[0x08];
        this.initNsfAt = (header[0x0B] << 8) + header[0x0A];
        this.runNsfAt = (header[0x0D] << 8) + header[0x0C];
        this.songName = header.slice(0x0E, 0x0e + 32).map(function (v) { return String.fromCharCode(v); }).join('').trim();
        this.artist = header.slice(0x02E, 0x0e + 32).map(function (v) { return String.fromCharCode(v); }).join('').trim();
        this.copyright = header.slice(0x4E, 0x0e + 32).map(function (v) { return String.fromCharCode(v); }).join('').trim();
        var address = this.loadNsfAt;
        nsfFile = nsfFile.slice(16, nsfFile.length);
        for (var i = 0; i < nsfFile.length - 0x80; ++i) {
            this.__SetByte(address + i, nsfFile[0x80 + i]);
        }
        this.InitNsf();
    };
    ChiChiNsfCPPU.prototype.InitNsf = function () {
        this.SetByte(0x4017, 0x40);
        this._accumulator = this.firstSong;
        this._indexRegisterX = 0;
        this._programCounter = this.initNsfAt;
        debugger;
        while (this._programCounter != this.runNsfAt) {
            this.Step();
        }
        console.log("ready to play");
    };
    return ChiChiNsfCPPU;
}(ChiChiMachine_1.ChiChiCPPU));
exports.ChiChiNsfCPPU = ChiChiNsfCPPU;


/***/ })
/******/ ]);

/***/ })
/******/ ]);
});
//# sourceMappingURL=emulator.worker.map