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
/******/ 	return __webpack_require__(__webpack_require__.s = 41);
/******/ })
/************************************************************************/
/******/ ({

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Debugger = /** @class */ (function () {
    function Debugger() {
        this.lastInstructions = new Array();
        this.decodedStatusRegister = '';
    }
    Object.defineProperty(Debugger.prototype, "cpu", {
        get: function () { return this._cpu; },
        set: function (value) {
            this._cpu = value;
            this._cpu.addDebugEvent(function () {
                //this.updateState();
            });
        },
        enumerable: true,
        configurable: true
    });
    ;
    Debugger.decodeCpuStatusRegister = function (sr) {
        var result = '';
        result += ' N:' + (sr & Debugger.SRMasks_NegativeResultMask ? '1' : '0');
        result += ' O:' + (sr & Debugger.SRMasks_OverflowMask ? '1' : '0');
        result += ' E:' + (sr & Debugger.SRMasks_ExpansionMask ? '1' : '0');
        result += ' B:' + (sr & Debugger.SRMasks_BreakCommandMask ? '1' : '0');
        result += ' D:' + (sr & Debugger.SRMasks_DecimalModeMask ? '1' : '0');
        result += ' I:' + (sr & Debugger.SRMasks_InterruptDisableMask ? '1' : '0');
        result += ' Z:' + (sr & Debugger.SRMasks_ZeroResultMask ? '1' : '0');
        result += ' C:' + (sr & Debugger.SRMasks_CarryMask ? '1' : '0');
        return result;
    };
    Debugger.prototype.appendInstructionPage = function () {
        //    this.setInstructionPage(this.machine.Cpu.InstructionHistory, this.machine.Cpu.InstructionHistoryPointer & 0xFF);
    };
    Debugger.prototype.setInstructionPage = function (inst, start, frameNumber) {
        var curPos = start + 1;
        for (var j = 0; j < inst.length; ++j) {
            var i = (curPos + j) & 0xFF;
            var instr = inst[i] ?
                {
                    asm: this.disassemble(inst[i]),
                    AddressingMode: inst[i].AddressingMode,
                    Address: inst[i].Address,
                    OpCode: inst[i].OpCode,
                    Parameters0: inst[i].Parameters0,
                    Parameters1: inst[i].Parameters1,
                    ExtraTiming: inst[i].ExtraTiming,
                    Length: inst[i].Length,
                    frame: inst[i].frame,
                    time: inst[i].time,
                    A: inst[i].A,
                    X: inst[i].X,
                    Y: inst[i].Y,
                    SR: inst[i].SR,
                    SP: inst[i].SP
                } : {
                asm: 'none',
                AddressingMode: 0,
                Address: 0,
                OpCode: 0,
                Parameters0: 0,
                Parameters1: 0,
                ExtraTiming: 0,
                Length: 0,
                frame: 0,
                time: 0,
                A: 0,
                X: 0,
                Y: 0,
                SR: 0,
                SP: 0
            };
            if (instr.asm != 'none')
                this.lastInstructions.push(instr);
            //' DecodedInstruction (this.disassemble(inst[i]), inst);
        }
    };
    Debugger.prototype.getMnemnonic = function (opcode) {
        switch (opcode) {
            case 0x80:
            case 0x82:
            case 0xC2:
            case 0xE2:
            case 0x04:
            case 0x14:
            case 0x34:
            case 0x44:
            case 0x54:
            case 0x64:
            case 0x74:
            case 0xD4:
            case 0xF4:
            //SKB()
            case 0x0C:
            case 0x1C:
            case 0x3C:
            case 0x5C:
            case 0x7C:
            case 0xDC:
            case 0xFC:
                //SKW';
                //DecodeAddress';
                return 'DOP';
            case 0x69:
            case 0x65:
            case 0x75:
            case 0x6d:
            case 0x7d:
            case 0x79:
            case 0x61:
            case 0x71:
                return 'ADC';
            case 0x29:
            case 0x25:
            case 0x35:
            case 0x2d:
            case 0x3d:
            case 0x39:
            case 0x21:
            case 0x31:
                return 'AND';
            case 0x0a:
            case 0x06:
            case 0x16:
            case 0x0e:
            case 0x1e:
                return 'ASL';
            case 0x90:
                return 'BCC';
            case 0xb0:
                return 'BCS';
            case 0xf0:
                return 'BEQ';
            case 0x24:
            case 0x2c:
                return 'BIT';
            case 0x30:
                return 'BMI';
            case 0xd0:
                return 'BNE';
            case 0x10:
                return 'BPL';
            case 0x00:
                return 'BRK';
            case 0x50:
                return 'BVC';
            case 0x70:
                return 'BVS';
            case 0x18:
                return 'CLC';
            case 0xd8:
                return 'CLD';
            case 0x58:
                return 'CLI';
            case 0xb8:
                return 'CLV';
            case 0xc9:
            case 0xc5:
            case 0xd5:
            case 0xcd:
            case 0xdd:
            case 0xd9:
            case 0xc1:
            case 0xd1:
                return 'CMP';
            case 0xe0:
            case 0xe4:
            case 0xec:
                return 'CPX';
            case 0xc0:
            case 0xc4:
            case 0xcc:
                return 'CPY';
            case 0xc6:
            case 0xd6:
            case 0xce:
            case 0xde:
                return 'DEC';
            case 0xca:
                return 'DEX';
            case 0x88:
                return 'DEY';
            case 0x49:
            case 0x45:
            case 0x55:
            case 0x4d:
            case 0x5d:
            case 0x59:
            case 0x41:
            case 0x51:
                return 'EOR';
            case 0xe6:
            case 0xf6:
            case 0xee:
            case 0xfe:
                return 'INC';
            case 0xe8:
                return 'INX';
            case 0xc8:
                return 'INY';
            case 0x4c:
            case 0x6c:
                return 'JMP';
            case 0x20:
                return 'JSR';
            case 0xa9:
            case 0xa5:
            case 0xb5:
            case 0xad:
            case 0xbd:
            case 0xb9:
            case 0xa1:
            case 0xb1:
                return 'LDA';
            case 0xa2:
            case 0xa6:
            case 0xb6:
            case 0xae:
            case 0xbe:
                return 'LDX';
            case 0xa0:
            case 0xa4:
            case 0xb4:
            case 0xac:
            case 0xbc:
                return 'LDY';
            case 0x4a:
            case 0x46:
            case 0x56:
            case 0x4e:
            case 0x5e:
                return 'LSR';
            case 0xea:
            case 0x1a:
            case 0x3a:
            case 0x5a:
            case 0x7a:
            case 0xda:
            case 0xfa:
            //case 0x04:
            //case 0x14:
            //case 0x34:
            //case 0x44:
            //case 0x64:
            //case 0x80:
            //case 0x82:
            case 0x89:
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
                return 'NOP';
            case 0x09:
            case 0x05:
            case 0x15:
            case 0x0d:
            case 0x1d:
            case 0x19:
            case 0x01:
            case 0x11:
                return 'ORA';
            case 0x48:
                return 'PHA';
            case 0x08:
                return 'PHP';
            case 0x68:
                return 'PLA';
            case 0x28:
                return 'PLP';
            case 0x2a:
            case 0x26:
            case 0x36:
            case 0x2e:
            case 0x3e:
                return 'ROL';
            case 0x6a:
            case 0x66:
            case 0x76:
            case 0x6e:
            case 0x7e:
                return 'ROR';
            case 0x40:
                return 'RTI';
            case 0x60:
                return 'RTS';
            case 0xeb: // undocumented sbc immediate
            case 0xe9:
            case 0xe5:
            case 0xf5:
            case 0xed:
            case 0xfd:
            case 0xf9:
            case 0xe1:
            case 0xf1:
                return 'SBC';
            case 0x38:
                return 'SEC';
            case 0xf8:
                return 'SED';
            case 0x78:
                return 'SEI';
            case 0x85:
            case 0x95:
            case 0x8d:
            case 0x9d:
            case 0x99:
            case 0x81:
            case 0x91:
                return 'STA';
            case 0x86:
            case 0x96:
            case 0x8e:
                return 'STX';
            case 0x84:
            case 0x94:
            case 0x8c:
                return 'STY';
            case 0xaa:
                return 'TAX';
            case 0xa8:
                return 'TAY';
            case 0xba:
                return 'TSX';
            case 0x8a:
                return 'TXA';
            case 0x9a:
                return 'TXS';
            case 0x98:
                return 'TYA';
            //undocumented opcodes
            case 0x0b:
            case 0x2b:
                return 'AAC';
            case 0x4b:
                return 'ASR';
            case 0x6b:
                return 'ARR';
            case 0xab:
                return 'ATX';
            default:
                return 'UNK';
        }
    };
    Debugger.prototype.disassemble = function (inst) {
        if (!inst || !inst.OpCode)
            return '';
        var parms = "";
        parms = parms + inst.Parameters0.toString(16);
        parms = parms + inst.Parameters1.toString(16);
        var AddressingModes = {
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
        };
        var result = inst.Address.toString(16) + ': ';
        switch (inst.AddressingMode) {
            case AddressingModes.Accumulator:
                result += this.getMnemnonic(inst.OpCode);
                break;
            case AddressingModes.Implicit:
                result += this.getMnemnonic(inst.OpCode);
                break;
            case AddressingModes.Immediate:
                result += this.getMnemnonic(inst.OpCode) + ' #' + inst.Parameters0.toString(16); // string.Format("{0} #${1:x2}", , inst.Parameters0);
                break;
            case AddressingModes.ZeroPage:
                result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16);
                break;
            case AddressingModes.ZeroPageX:
                result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16) + ', ' + inst.X.toString(16);
                break;
            case AddressingModes.ZeroPageY:
                result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16) + ', ' + inst.Y.toString(16);
                break;
            case AddressingModes.Relative:
                if ((inst.Parameters0 & 128) == 128) {
                    result += this.getMnemnonic(inst.OpCode) + ' *' + inst.Parameters0.toString(16); // string.Format("{0} *{1}", getMnemnonic(inst.OpCode), (byte)inst.Parameters0);
                }
                else {
                    result += this.getMnemnonic(inst.OpCode) + ' *+' + inst.Parameters0.toString(16);
                }
                break;
            case AddressingModes.Absolute:
                var addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16);
                break;
            case AddressingModes.AbsoluteX:
                var addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16) + ',' + inst.X.toString(16);
                break;
            case AddressingModes.AbsoluteY:
                var addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16) + ',' + inst.Y.toString(16);
                break;
            case AddressingModes.Indirect:
                var addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' (' + addr.toString(16) + ')';
                break;
            case AddressingModes.IndexedIndirect:
                result += this.getMnemnonic(inst.OpCode) + ' (' + inst.Parameters0.toString(16) + ', ' + inst.X.toString(16);
                +')';
                break;
            case AddressingModes.IndirectIndexed:
                result += this.getMnemnonic(inst.OpCode) + ' (' + inst.Parameters0.toString(16) + ', ' + inst.Y.toString(16);
                +')';
                break;
        }
        return result;
    };
    Debugger.SRMasks_CarryMask = 0x01;
    Debugger.SRMasks_ZeroResultMask = 0x02;
    Debugger.SRMasks_InterruptDisableMask = 0x04;
    Debugger.SRMasks_DecimalModeMask = 0x08;
    Debugger.SRMasks_BreakCommandMask = 0x10;
    Debugger.SRMasks_ExpansionMask = 0x20;
    Debugger.SRMasks_OverflowMask = 0x40;
    Debugger.SRMasks_NegativeResultMask = 0x80;
    return Debugger;
}());
exports.Debugger = Debugger;


/***/ })

/******/ });