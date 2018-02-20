(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["chichi"] = factory();
	else
		root["chichi"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
var NameTableMirroring;
(function (NameTableMirroring) {
    NameTableMirroring[NameTableMirroring["OneScreen"] = 0] = "OneScreen";
    NameTableMirroring[NameTableMirroring["Vertical"] = 1] = "Vertical";
    NameTableMirroring[NameTableMirroring["Horizontal"] = 2] = "Horizontal";
    NameTableMirroring[NameTableMirroring["FourScreen"] = 3] = "FourScreen";
})(NameTableMirroring = exports.NameTableMirroring || (exports.NameTableMirroring = {}));
var BaseCart = /** @class */ (function () {
    //ChrRamStart: number;
    function BaseCart(romFile) {
        var _this = this;
        this.romFile = romFile;
        this.batterySRAM = false;
        this.ramMask = 0x1fff;
        this.fileName = '';
        this.oneScreenOffset = 0;
        this.fourScreen = false;
        this.mapperName = 'base';
        this.supported = true;
        this.submapperId = 0;
        this.mapsBelow6000 = false;
        // compatible with .net array.copy method
        // shared components
        this.nextEventAt = 0;
        this.prgRomCount = 0;
        this.chrRomOffset = 0;
        this.chrRomCount = 0;
        this.chrRamStart = 0;
        this.chrRamLength = 0;
        this.mapperId = 0;
        this.chrRam = new Uint8Array(0x2000);
        this.prgRomBank6 = new Uint8Array(0x2000);
        // starting locations of PPU 0x0000-0x3FFF in 1k blocks
        this.ppuBankStarts = new Uint32Array(16);
        // starting locations of PRG rom 0x6000-0xFFFF in 4K blocks
        this.prgBankStarts = new Uint32Array(10);
        this.SRAMCanWrite = false;
        this.SRAMEnabled = false;
        this.SRAMCanSave = false;
        this.ROMHashFunction = null;
        this.mirroring = -1;
        this.updateIRQ = function () {
            _this.NMIHandler();
        };
        this.irqRaised = false;
        this.usesSRAM = false;
        this.loadFile(romFile);
    }
    BaseCart.prototype.setupMapperStateBuffer = function (buffer, start) {
    };
    BaseCart.prototype.advanceClock = function (clock) { };
    Object.defineProperty(BaseCart.prototype, "current6", {
        get: function () {
            return this.prgBankStarts[0] / 8192;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseCart.prototype, "current8", {
        get: function () {
            return this.prgBankStarts[2] / 8192;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseCart.prototype, "currentA", {
        get: function () {
            return this.prgBankStarts[4] / 8192;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseCart.prototype, "currentC", {
        get: function () {
            return this.prgBankStarts[6] / 8192;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BaseCart.prototype, "currentE", {
        get: function () {
            return this.prgBankStarts[8] / 8192;
        },
        enumerable: true,
        configurable: true
    });
    ;
    BaseCart.prototype.setupStateBuffer = function (sb) {
        var _this = this;
        sb.onRestore.subscribe(function (buffer) {
            _this.attachStateBuffer(buffer);
        });
        sb.pushSegment(0x2000, 'prgram')
            .pushSegment(10 * Uint32Array.BYTES_PER_ELEMENT, 'prgbankstarts')
            .pushSegment(16 * Uint32Array.BYTES_PER_ELEMENT, 'ppubankstarts')
            .pushSegment(this.romFile.chrRomCount === 0 ? 0x2000 : 0, 'chrrom')
            .pushSegment(0x2000, 'chrram');
        return sb;
    };
    BaseCart.prototype.attachStateBuffer = function (sb) {
        var seg = sb.getSegment('prgram');
        this.prgRomBank6 = new Uint8Array(seg.buffer, seg.start, seg.size);
        seg = sb.getSegment('prgbankstarts');
        this.prgBankStarts = new Uint32Array(seg.buffer, seg.start, 10);
        seg = sb.getSegment('chrram');
        this.chrRam = new Uint8Array(seg.buffer, seg.start, seg.size);
        seg = sb.getSegment('ppubankstarts');
        this.ppuBankStarts = new Uint32Array(seg.buffer, seg.start, 16);
        seg = sb.getSegment('chrrom');
        if (seg.size > 0) {
            this.chrRom = new Uint8Array(seg.buffer, seg.start, seg.size);
        }
    };
    BaseCart.prototype.loadFile = function (file) {
        this.prgRomCount = file.prgRomCount;
        this.chrRomCount = file.chrRomCount;
        this.prgRom = file.prgRom;
        if (file.chrRomCount > 0) {
            // const chrRomBuffer = new ArrayBuffer((file.chrRomLength) * Uint8Array.BYTES_PER_ELEMENT)
            this.chrRom = file.chrRom;
            this.chrRamStart = file.chrRomLength;
            // BaseCart.arrayCopy(file.chrRom, 0, this.chrRom, 0, file.chrRomLength);
        }
        this.chrRamLength = 0x2000;
        this.usesSRAM = file.usesSRAM;
        this.batterySRAM = file.batterySRAM;
        this.ROMHashFunction = file.romCRC;
        this.mirroring = file.mirroring;
        this.fourScreen = file.fourScreen;
    };
    BaseCart.prototype.installCart = function (ppu, cpu) {
        this.Whizzler = ppu;
        this.CPU = cpu;
        // this.NMIHandler = () => { this.CPU._handleIRQ = true; };
        this.prgRomBank6.fill(0);
        for (var i = 0; i < 16; i++) {
            this.ppuBankStarts[i] = i * 0x400;
        }
        for (var i = 0; i < 8; i++) {
            this.prgBankStarts[i] = i * 0x1000;
        }
        this.mirroring = this.romFile.mirroring;
        this.mirror(0, this.mirroring);
        this.initializeCart();
    };
    BaseCart.prototype.getByte = function (clock, address) {
        var bank = (address >> 12) - 0x6;
        if (bank < 2) {
            if (this.usesSRAM) {
                return this.prgRomBank6[address & this.ramMask];
            }
            else {
                return (address >> 8) & 0xff;
            }
        }
        return this.prgRom[this.prgBankStarts[bank] + (address & 0xfff)];
    };
    BaseCart.prototype.peekByte = function (address) {
        return this.prgRom[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    };
    BaseCart.prototype.setPrgRam = function (address, data) {
        if (address >= 0x6000 && address <= 0x7fff) {
            this.prgRomBank6[address & 0x1fff] = data;
        }
    };
    BaseCart.prototype.setByte = function (clock, address, data) {
        if (this.usesSRAM) {
            this.setPrgRam(address, data);
        }
    };
    BaseCart.prototype.getPPUByte = function (clock, address) {
        var bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        if (bank < 8) {
            return this.chrRom[newAddress];
        }
        else {
            return this.chrRam[newAddress & 0x1fff];
        }
    };
    BaseCart.prototype.setPPUByte = function (clock, address, data) {
        var bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        if (bank < 8) {
            this.chrRom[newAddress] = data;
        }
        else {
            this.chrRam[newAddress & 0x1fff] = data;
        }
    };
    BaseCart.prototype.setup6BankStarts = function (reg6, reg8, regA, regC, regE) {
        reg6 = reg6 % (this.prgRomCount * 2);
        this.prgBankStarts[0] = reg6 * 8192;
        this.prgBankStarts[1] = (this.prgBankStarts[0] + 4096);
        this.setupBankStarts(reg8, regA, regC, regE);
    };
    BaseCart.prototype.setupBankStarts = function (reg8, regA, regC, regE) {
        reg8 = reg8 % (this.prgRomCount * 2);
        regA = regA % (this.prgRomCount * 2);
        regC = regC % (this.prgRomCount * 2);
        regE = regE % (this.prgRomCount * 2);
        this.prgBankStarts[2] = reg8 * 8192;
        this.prgBankStarts[3] = (this.prgBankStarts[2] + 4096);
        this.prgBankStarts[4] = regA * 8192;
        this.prgBankStarts[5] = (this.prgBankStarts[4] + 4096);
        this.prgBankStarts[6] = regC * 8192;
        this.prgBankStarts[7] = (this.prgBankStarts[6] + 4096);
        this.prgBankStarts[8] = regE * 8192;
        this.prgBankStarts[9] = (this.prgBankStarts[8] + 4096);
    };
    BaseCart.prototype.setupBanks4k = function (start, banks) {
        var _this = this;
        banks = banks.map(function (bank) {
            return bank % (_this.prgRomCount << 2);
        });
        for (var i = 0; i < banks.length; ++i) {
            if (i >= this.prgBankStarts.length) {
                break;
            }
            this.prgBankStarts[start + i] = banks[i] * 4096;
        }
    };
    BaseCart.prototype.maskBankAddress = function (bank) {
        return bank % (this.prgRomCount * 2);
    };
    // 0 - onescreen, 1 -v, 2- h, 3 - fourscreen
    BaseCart.prototype.mirror = function (clockNum, mirroring) {
        this.mirroring = mirroring;
        switch (mirroring) {
            case 0:
                this.ppuBankStarts[8] = (this.chrRamStart + this.oneScreenOffset);
                this.ppuBankStarts[9] = (this.chrRamStart + this.oneScreenOffset);
                this.ppuBankStarts[10] = (this.chrRamStart + this.oneScreenOffset);
                this.ppuBankStarts[11] = (this.chrRamStart + this.oneScreenOffset);
                break;
            case 1:
                this.ppuBankStarts[8] = (this.chrRamStart + 0);
                this.ppuBankStarts[9] = (this.chrRamStart + 1024);
                this.ppuBankStarts[10] = (this.chrRamStart + 0);
                this.ppuBankStarts[11] = (this.chrRamStart + 1024);
                break;
            case 2:
                this.ppuBankStarts[8] = (this.chrRamStart + 0);
                this.ppuBankStarts[9] = (this.chrRamStart + 0);
                this.ppuBankStarts[10] = (this.chrRamStart + 1024);
                this.ppuBankStarts[11] = (this.chrRamStart + 1024);
                break;
            case 3:
                this.ppuBankStarts[8] = (this.chrRamStart + 0);
                this.ppuBankStarts[9] = (this.chrRamStart + 1024);
                this.ppuBankStarts[10] = (this.chrRamStart + 2048);
                this.ppuBankStarts[11] = (this.chrRamStart + 3072);
                break;
        }
    };
    // utility functions used by mappers
    // CopyBanksXX sets up chrRom bankswitching
    BaseCart.prototype.copyBanks = function (clock, dest, src, numberOf8kBanks) {
        if (dest >= this.chrRomCount) {
            dest = dest % this.chrRomCount;
        }
        if (src >= this.chrRomCount) {
            src = src % this.chrRomCount;
        }
        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        for (var i = 0; i < (numberOf8kBanks << 3); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.copyBanks4k = function (clock, dest, src, numberOf4kBanks) {
        var chrCount = this.chrRomCount << 1;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }
        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.copyBanks2k = function (clock, dest, src, numberOf2kBanks) {
        var chrCount = this.chrRomCount << 2;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }
        var oneKsrc = src << 1;
        var oneKdest = dest << 1;
        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.copyBanks1k = function (clock, dest, src, numberOf1kBanks) {
        var chrCount = this.chrRomCount << 3;
        if (dest >= chrCount) {
            dest = dest % chrCount;
        }
        if (src >= chrCount) {
            src = src % chrCount;
        }
        var oneKsrc = src;
        var oneKdest = dest;
        for (var i = 0; i < numberOf1kBanks; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.initializeCart = function (hardReset) {
        //setup mirroring 
        this.mirroring = this.romFile.mirroring;
        this.fourScreen = this.romFile.fourScreen;
        this.mirror(0, this.mirroring);
    };
    BaseCart.prototype.updateScanlineCounter = function () {
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
    UnsupportedCart.prototype.initializeCart = function () {
        this.mapperName = 'unsupported';
        // maybe this will work - give it a go!
        this.setupBankStarts(0, 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
        this.mirror(0, 0);
    };
    return UnsupportedCart;
}(BaseCart));
exports.UnsupportedCart = UnsupportedCart;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(63)
var ieee754 = __webpack_require__(64)
var isArray = __webpack_require__(65)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buffer = __webpack_require__(1);

var createBuffer = _buffer.Buffer.from && _buffer.Buffer.alloc && _buffer.Buffer.allocUnsafe && _buffer.Buffer.allocUnsafeSlow ? _buffer.Buffer.from

// support for Node < 5.10
: function (val) {
  return new _buffer.Buffer(val);
};

exports.default = createBuffer;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (model, calc) {
  var fn = function fn(buf, previous) {
    return calc(buf, previous) >>> 0;
  };
  fn.signed = calc;
  fn.unsigned = fn;
  fn.model = model;

  return fn;
};

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
var _root = __window || __global || __self;
exports.root = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();
//# sourceMappingURL=root.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = __webpack_require__(29);
var isObject_1 = __webpack_require__(30);
var isFunction_1 = __webpack_require__(16);
var tryCatch_1 = __webpack_require__(31);
var errorObject_1 = __webpack_require__(17);
var UnsubscriptionError_1 = __webpack_require__(32);
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = /** @class */ (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = __webpack_require__(5);
var Symbol = root_1.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DMCChannel_1 = __webpack_require__(22);
var SquareChannel_1 = __webpack_require__(23);
var TriangleChannel_1 = __webpack_require__(24);
var NoiseChannel_1 = __webpack_require__(25);
var ChiChiAPU = /** @class */ (function () {
    function ChiChiAPU(writer) {
        this.writer = writer;
        this.frameMode = false;
        this.pulseTable = [];
        this.tndTable = [];
        this.throwingIRQs = false;
        this.reg15 = 0;
        this._sampleRate = 44100;
        this.muted = false;
        this.lastFrameHit = 0;
        this.currentClock = 0;
        this.frameClocker = 0;
        //Muted: boolean;
        this._interruptRaised = false;
        this.sequence4 = [7457, 14913, 22371, 29828, 29829, 29831];
        this.sequence5 = [7457, 14913, 22371, 29828, 37282, 37283];
        this.lastOutput = 0;
        this.rebuildSound();
        for (var i = 0; i < 31; ++i) {
            this.pulseTable.push(95.52 / (8128.0 / i + 100));
        }
        for (var i = 0; i < 203; ++i) {
            this.tndTable.push(163.67 / (24329.0 / i + 100));
        }
    }
    ChiChiAPU.prototype.irqHandler = function () {
    };
    Object.defineProperty(ChiChiAPU.prototype, "audioSettings", {
        get: function () {
            var settings = {
                sampleRate: this._sampleRate,
                master_volume: 1.0,
                enableSquare0: this.square0.playing,
                enableSquare1: this.square1.playing,
                enableTriangle: this.triangle.playing,
                enableNoise: this.noise.playing,
                enableDMC: this.dmc.playing,
                synced: this.writer.synced
            };
            return settings;
        },
        set: function (value) {
            this.noise.playing = value.enableNoise;
            this.dmc.playing = value.enableDMC;
            this.square0.playing = value.enableSquare0;
            this.square1.playing = value.enableSquare1;
            this.triangle.playing = value.enableTriangle;
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
    Object.defineProperty(ChiChiAPU.prototype, "interruptRaised", {
        get: function () {
            return this._interruptRaised || this.dmc.interruptRaised;
        },
        set: function (val) {
            this._interruptRaised = val;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiAPU.prototype.rebuildSound = function () {
        var _this = this;
        this.writer.blip_new(this._sampleRate / 5);
        this.writer.blip_set_rates(ChiChiAPU.clock_rate, this._sampleRate);
        //this.writer = new ChiChiNES.BeepsBoops.WavSharer();
        this.writer.audioBytesWritten = 0;
        this.square0 = new SquareChannel_1.SquareChannel(0, function (number) { return _this.mixAndOutputAudio(number); });
        this.square0.period = 10;
        this.square0.sweepComplement = true;
        this.square1 = new SquareChannel_1.SquareChannel(1, function (number) { return _this.mixAndOutputAudio(number); });
        this.square1.period = 10;
        this.square1.sweepComplement = false;
        this.triangle = new TriangleChannel_1.TriangleChannel(2, function (number) { return _this.mixAndOutputAudio(number); });
        this.triangle.period = 0;
        this.noise = new NoiseChannel_1.NoiseChannel(3, function (number) { return _this.mixAndOutputAudio(number); });
        this.noise.period = 0;
        this.dmc = new DMCChannel_1.DMCChannel(4, function (number) { return _this.mixAndOutputAudio(number); }, function (address) {
            _this.memoryMap.cpu.borrowedCycles += 4;
            return _this.memoryMap.getByte(0, address);
        });
    };
    ChiChiAPU.prototype.GetByte = function (Clock, address) {
        if (address === 0x4000) {
            this._interruptRaised = false;
        }
        if (address === 0x4015) {
            var result = (this.dmc.interruptRaised ? 0x80 : 0) | (this.interruptRaised ? 0x40 : 0) | (this.dmc.length > 0 ? 0x10 : 0) | ((this.square0.length > 0) ? 1 : 0) | ((this.square1.length > 0) ? 2 : 0) | ((this.triangle.length > 0) ? 4 : 0) | ((this.square0.length > 0) ? 8 : 0) | (this._interruptRaised ? 64 : 0);
            this.interruptRaised = false;
            return result;
        }
        else {
            return 66;
        }
    };
    ChiChiAPU.prototype.SetByte = function (clock, address, data) {
        if (address === 16384) {
            this._interruptRaised = false;
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
                this.dmc.writeRegister(address - 0x4010, data, clock);
                this.dmc.run(this.currentClock);
                break;
            case 0x4015:
                this.reg15 = data;
                this.square0.writeRegister(4, data & 1, clock);
                this.square1.writeRegister(4, data & 2, clock);
                this.triangle.writeRegister(4, data & 4, clock);
                this.noise.writeRegister(4, data & 8, clock);
                this.dmc.writeRegister(4, data & 0x10, clock);
                break;
            case 0x4017:
                this.throwingIRQs = ((data & 64) !== 64);
                this.frameMode = ((data & 128) == 128);
                // if (!this.frameMode) {
                //     this.endFrame(clock);
                // }
                this.memoryMap.cpu.borrowedCycles += 2;
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
        if (this.lastFrameHit >= (this.frameMode ? 4 : 3)) {
            this.lastFrameHit = 0;
            this.frameClocker = 0;
            this.endFrame(time);
            if (this.throwingIRQs && !this.frameMode) {
                this._interruptRaised = true;
                this.irqHandler();
            }
        }
        else {
            this.lastFrameHit++;
        }
    };
    ChiChiAPU.prototype.runFrameEvents = function (time, step) {
        this.triangle.frameClock(time, step);
        this.noise.frameClock(time, step);
        this.square0.frameClock(time, step);
        this.square1.frameClock(time, step);
    };
    ChiChiAPU.prototype.endFrame = function (time) {
        this.square0.endFrame(time);
        this.square1.endFrame(time);
        this.triangle.endFrame(time);
        this.noise.endFrame(time);
        this.dmc.endFrame(time);
        this.writer.blip_end_frame(time);
        this.writer.readElementsLoop();
        this.currentClock = 0;
    };
    ChiChiAPU.prototype.mixAndOutputAudio = function (clock) {
        var out = this.pulseTable[this.square0.output + this.square1.output];
        out += this.tndTable[(3 * this.triangle.output) + (2 * this.noise.output) + this.dmc.output];
        var delta = (out * 0x10000) - this.lastOutput;
        this.lastOutput += delta;
        this.writer.blip_add_delta(clock, delta);
    };
    ChiChiAPU.clock_rate = 1789772.727;
    return ChiChiAPU;
}());
exports.ChiChiAPU = ChiChiAPU;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(4);
var maxSpritesPerScanline = 64;
var nesPallette = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var ChiChiPPU = /** @class */ (function () {
    function ChiChiPPU() {
        this.LastcpuClock = 0;
        this.greyScale = false;
        // members
        // scanline position
        this.yPosition = 0;
        this.xPosition = 0;
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
        this.clipSprites = false;
        this.clipTiles = false;
        this.tilesVisible = false;
        this.spritesVisible = false;
        this.nameTableMemoryStart = 0;
        this.backgroundPatternTableIndex = 0;
        //PPU implementation
        this.address = 0;
        this.status = 0;
        this.controlByte0 = 0;
        this.controlByte1 = 0;
        this.spriteAddress = 0;
        this.currentXPosition = 0;
        this.currentYPosition = 0;
        this.hScroll = 0;
        this.vScroll = 0;
        this.lockedHScroll = 0;
        this.lockedVScroll = 0;
        this.shouldRender = false;
        this.framesRun = 0;
        this.hitSprite = false;
        this.addressLatchIsHigh = true;
        this.isRendering = true;
        this.frameClock = 0;
        this.oddFrame = true;
        this.frameOn = false;
        this.nameTableBits = 0;
        this.palette = new Uint8Array(32);
        this.openBus = 0;
        this.xNTXor = 0;
        this.yNTXor = 0;
        this.spriteRAMBuffer = new ArrayBuffer(256 * Uint8Array.BYTES_PER_ELEMENT);
        this.spriteRAM = new Uint8Array(this.spriteRAMBuffer); // System.Array.init(256, 0, System.Int32);
        this.spritesOnLine = new Array(512); // System.Array.init(512, 0, System.Int32);
        this.currentTileIndex = 0;
        this.fetchTile = true;
        // tile bytes currently latched in ppu
        this.patternEntry = 0;
        this.patternEntryByte2 = 0;
        // pixelBuffer = createRawPixelBuffer(new ArrayBuffer(256*256*4));
        this.pixelBuffer = createDecodedPixelBuffer()(new ArrayBuffer(256 * 256 * 4));
        this.initSprites();
    }
    //    public byteOutBuffer = new Uint8Array(256 * 256 * 4); // System.Array.init(262144, 0, System.Int32);
    ChiChiPPU.prototype.GetPPUStatus = function () {
        return {
            status: this.status,
            controlByte0: this.controlByte0,
            controlByte1: this.controlByte1,
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
            if ((this.controlByte0 & 32) === 32) {
                spritePatternTable = 4096;
            }
            return spritePatternTable;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiPPU.prototype.initialize = function () {
        this.address = 0;
        this.status = 0;
        this.controlByte0 = 0;
        this.controlByte1 = 0;
        this.hScroll = 0;
        this.vScroll = 0;
        //this.scanlineNum = 0;
        //this.scanlinePos = 0;
        this.spriteAddress = 0;
        this.initSprites();
    };
    ChiChiPPU.prototype.setupVINT = function () {
        this.status = this.status | 128;
        this.framesRun = this.framesRun + 1;
        if (this.controlByte0 & 128) {
            this.cpu.handleNMI = true;
        }
    };
    ChiChiPPU.prototype.setByte = function (Clock, address, data) {
        switch (address & 7) {
            case 0:
                this.controlByte0 = data;
                this.openBus = data;
                this.nameTableBits = this.controlByte0 & 3;
                this.backgroundPatternTableIndex = ((this.controlByte0 & 16) >> 4) * 0x1000;
                this.nameTableMemoryStart = this.nameTableBits * 0x400;
                break;
            case 1:
                this.isRendering = (data & 0x18) !== 0;
                this.controlByte1 = data;
                this.emphasisBits = (this.controlByte1 >> 5) & 7;
                this.greyScale = (this.controlByte1 & 0x1) === 0x1;
                this.clipTiles = (this.controlByte1 & 0x02) !== 0x02;
                this.clipSprites = (this.controlByte1 & 0x04) !== 0x04;
                this.tilesVisible = (this.controlByte1 & 0x08) === 0x08;
                this.spritesVisible = (this.controlByte1 & 0x10) === 0x10;
                break;
            case 2:
                this.ppuReadBuffer = data;
                this.openBus = data;
                break;
            case 3:
                this.spriteAddress = data & 0xFF;
                this.openBus = this.spriteAddress;
                break;
            case 4:
                this.spriteRAM[this.spriteAddress] = data;
                this.spriteAddress = (this.spriteAddress + 1) & 255;
                this.unpackedSprites[this.spriteAddress >> 2].Changed = true;
                this.spriteChanges = true;
                break;
            case 5:
                if (this.addressLatchIsHigh) {
                    this.hScroll = data;
                    this.lockedHScroll = this.hScroll & 7;
                    this.addressLatchIsHigh = false;
                }
                else {
                    this.vScroll = data;
                    if (data > 240) {
                        this.vScroll = data - 256;
                    }
                    if (!this.frameOn || (this.frameOn && !this.isRendering)) {
                        this.lockedVScroll = this.vScroll;
                    }
                    this.addressLatchIsHigh = true;
                    this.updatePixelInfo();
                }
                break;
            case 6:
                if (this.addressLatchIsHigh) {
                    this.address = (this.address & 0xFF) | ((data & 0x3F) << 8);
                    this.addressLatchIsHigh = false;
                }
                else {
                    this.address = (this.address & 0x7F00) | data & 0xFF;
                    this.addressLatchIsHigh = true;
                    this.hScroll = ((this.address & 0x1f) << 3);
                    this.vScroll = (((this.address >> 5) & 0x1f) << 3);
                    this.vScroll |= ((this.address >> 12) & 3);
                    if (this.frameOn) {
                        this.lockedHScroll = this.hScroll;
                        this.lockedVScroll = this.vScroll;
                        this.lockedVScroll = this.lockedVScroll - this.currentYPosition;
                    }
                    this.nameTableBits = ((this.address >> 10) & 3);
                    this.nameTableMemoryStart = this.nameTableBits * 0x400;
                }
                break;
            case 7:
                if ((this.address & 0xFF00) === 0x3F00) {
                    var palAddress = (this.address) & 0x1F;
                    this.palette[palAddress] = data;
                    if ((this.address & 0xFFEF) === 0x3F00) {
                        this.palette[(palAddress ^ 16) & 0x1F] = data;
                    }
                }
                else {
                    // if ((this._PPUAddress & 0xF000) === 0x2000) {
                    //     this.memoryMap.setPPUByte(Clock, this._PPUAddress, data);
                    // }
                    this.memoryMap.setPPUByte(Clock, this.address, data);
                }
                // if controlbyte0.4, set ppuaddress + 32, else inc
                if ((this.controlByte0 & 4) === 4) {
                    this.address = (this.address + 32);
                }
                else {
                    this.address = (this.address + 1);
                }
                // reset the flag which makex xxx6 set the high byte of address
                this.addressLatchIsHigh = true;
                this.address = (this.address & 0x3FFF);
                break;
        }
    };
    ChiChiPPU.prototype.getByte = function (Clock, address) {
        switch (address & 7) {
            case 3:
            case 0:
            case 1:
            case 5:
            case 6:
                return this.openBus;
            case 2:
                var ret = 0;
                this.addressLatchIsHigh = true;
                ret = (this.ppuReadBuffer & 0x1F) | this.status;
                if ((ret & 0x80) === 0x80) {
                    this.status = this.status & ~0x80;
                }
                return ret;
            case 4:
                return this.spriteRAM[this.spriteAddress];
            case 7:
                var tmp = 0;
                if ((this.address & 0xFF00) === 0x3F00) {
                    tmp = this.palette[this.address & 0x1F];
                    this.ppuReadBuffer = this.memoryMap.getPPUByte(Clock, this.address - 4096);
                }
                else {
                    tmp = this.ppuReadBuffer;
                    if (this.address >= 0x2000 && this.address <= 0x2FFF) {
                        this.ppuReadBuffer = this.memoryMap.getPPUByte(Clock, this.address);
                    }
                    else {
                        this.ppuReadBuffer = this.memoryMap.getPPUByte(Clock, this.address & 0x3FFF);
                    }
                }
                if ((this.controlByte0 & 4) === 4) {
                    this.address = this.address + 32;
                }
                else {
                    this.address = this.address + 1;
                }
                this.address = (this.address & 0x3FFF);
                return tmp;
        }
        return 0;
    };
    ChiChiPPU.prototype.copySprites = function (copyFrom) {
        for (var i = 0; i < 256; ++i) {
            var spriteLocation = (this.spriteAddress + i) & 255;
            if (this.spriteRAM[spriteLocation] !== this.memoryMap.Rams[copyFrom + i]) {
                this.spriteRAM[spriteLocation] = this.memoryMap.Rams[copyFrom + i];
                this.unpackedSprites[(spriteLocation >> 2) & 255].Changed = true;
            }
        }
        this._spriteCopyHasHappened = true;
        this.spriteChanges = true;
    };
    ChiChiPPU.prototype.initSprites = function () {
        this.currentSprites = new Array(maxSpritesPerScanline);
        for (var i = 0; i < maxSpritesPerScanline; ++i) {
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
                if ((this.controlByte0 & 8) === 8) {
                    spritePatternTable = 4096;
                }
                xPos = this.currentXPosition - currSprite.XPosition;
                yLine = this.currentYPosition - currSprite.YPosition - 1;
                yLine = yLine & (this.spriteSize - 1);
                tileIndex = currSprite.TileIndex;
                if ((this.controlByte0 & 32) === 32) {
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
                patternEntry = this.memoryMap.getPPUByte(0, spritePatternTable + tileIndex * 16 + yLine);
                patternEntryBit2 = this.memoryMap.getPPUByte(0, spritePatternTable + tileIndex * 16 + yLine + 8);
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
        var patternEntry = 0;
        var patternEntryBit2 = 0;
        if (sprite.v.FlipY) {
            y = this.spriteSize - y - 1;
        }
        if (y >= 8) {
            y += 8;
        }
        var dataAddress = patternTableIndex + (tileIndex << 4) + y;
        patternEntry = this.memoryMap.getPPUByte(this.LastcpuClock, dataAddress);
        patternEntryBit2 = this.memoryMap.getPPUByte(this.LastcpuClock, dataAddress + 8);
        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    };
    ChiChiPPU.prototype.preloadSprites = function (scanline) {
        this.spritesOnThisScanline = 0;
        var yLine = this.currentYPosition - 1;
        for (var spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            var spriteID = ((spriteNum + this.spriteAddress) & 0xff) >> 2;
            var y = this.unpackedSprites[spriteID].YPosition + 1;
            if (scanline >= y && scanline < y + this.spriteSize) {
                // var spId = spriteNum >> 2;
                // if (spId < 32) {
                //     this.outBuffer[(64768) + yLine] |= 1 << spId;
                // } else {
                //     this.outBuffer[(65024) + yLine] |= 1 << (spId - 32);
                // }
                this.currentSprites[this.spritesOnThisScanline] = this.unpackedSprites[spriteID];
                this.currentSprites[this.spritesOnThisScanline].IsVisible = true;
                this.spritesOnThisScanline++;
                if (this.spritesOnThisScanline === maxSpritesPerScanline) {
                    break;
                }
            }
        }
        if (this.spritesOnThisScanline > 7) {
            this.status = this.status | 32;
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
        var LookUp = this.memoryMap.getPPUByte(0, 8192 + ppuNameTableMemoryStart + 960 + (i >> 2) + ((j >> 2) * 8));
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
                    this.pixelBuffer.reset();
                    this.currentXPosition = 0;
                    this.currentYPosition = 0;
                    this.xNTXor = 0;
                    this.yNTXor = 0;
                    if ((this.controlByte1 & 0x18) !== 0) {
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
                    this.status = 0;
                    this.hitSprite = false;
                    this.spriteSize = ((this.controlByte0 & 0x20) === 0x20) ? 16 : 8;
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
                this.renderPixel(this.LastcpuClock + ticks);
            }
            this.frameClock++;
            if (this.frameClock >= 89342) {
                this.frameClock = 0;
            }
        }
    };
    ChiChiPPU.prototype.renderPixel = function (clock) {
        if (this.currentXPosition < 256 && this.currentYPosition <= 240) {
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
                var tileIndex = this.memoryMap.getPPUByte(clock, tileNametablePosition);
                var patternTableYOffset = this.yPosition & 7;
                var patternID = this.backgroundPatternTableIndex + (tileIndex * 16) + patternTableYOffset;
                this.patternEntry = this.memoryMap.getPPUByte(clock, patternID);
                this.patternEntryByte2 = this.memoryMap.getPPUByte(clock, patternID + 8);
                this.currentAttributeByte = this.getAttrEntry(ppuNameTableMemoryStart, xTilePosition, this.yPosition >> 3);
                /* end fetch next tile */
            }
            var tilesVis = this.tilesVisible;
            var spriteVis = this.spritesVisible;
            if (this.currentXPosition < 8) {
                tilesVis = tilesVis && !this.clipTiles;
                spriteVis = tilesVis && !this.clipSprites;
            }
            this.spriteZeroHit = false;
            var tilePixel = tilesVis ? this.getNameTablePixel() : 0;
            var spritePixel = spriteVis ? this.getSpritePixel() : 0;
            if (!this.hitSprite && this.spriteZeroHit && tilePixel !== 0) {
                this.hitSprite = true;
                this.status = this.status | 64;
            }
            var pixel = this.palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
            this.pixelBuffer.draw(pixel);
            // this.byteOutBuffer[this.vbufLocation * 4] = this.palette[];
            // this.byteOutBuffer[(this.vbufLocation * 4) + 1] = this.emphasisBits;
            // this.vbufLocation++;
        }
        this.currentXPosition++;
        if (this.currentXPosition > 340) {
            this.currentXPosition = 0;
            this.currentYPosition++;
            this.preloadSprites(this.currentYPosition);
            if (this.spritesOnThisScanline >= 7) {
                this.status = this.status | 32;
            }
            this.lockedHScroll = this.hScroll;
            this.memoryMap.advanceScanline(1);
            this.updatePixelInfo();
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
    };
    ChiChiPPU.prototype.updatePixelInfo = function () {
        this.nameTableMemoryStart = this.nameTableBits * 0x400;
    };
    ChiChiPPU.prototype.setupStateBuffer = function (sb) {
        var _this = this;
        sb.onRestore.subscribe(function (buffer) {
            _this.attachStateBuffer(buffer);
        });
        sb.onUpdateBuffer.subscribe(function (buffer) {
            _this.updateStateBuffer(buffer);
        });
        sb.pushSegment(256 * Uint8Array.BYTES_PER_ELEMENT, 'spriteram')
            .pushSegment(2, 'ppuaddress')
            .pushSegment(2, 'spriteaddress')
            .pushSegment(2, 'ppucontrolbytes')
            .pushSegment(2, 'ppustatus')
            .pushSegment(2, 'hvscroll')
            .pushSegment(2, 'lockedhvscroll');
        return sb;
    };
    ChiChiPPU.prototype.attachStateBuffer = function (sb) {
        this.spriteRAM = sb.getUint8Array('spriteram');
        this.address = sb.getUint16Array('ppuaddress')[0];
        this.spriteAddress = sb.getUint8Array('spriteaddress')[0];
        var cbytes = sb.getUint8Array('ppucontrolbytes');
        this.controlByte0 = cbytes[0];
        this.controlByte1 = cbytes[1];
        this.status = sb.getUint8Array('ppustatus')[0];
        var scroll = sb.getUint8Array('hvscroll');
        this.hScroll = scroll[0];
        this.vScroll = scroll[1];
        var lscroll = sb.getUint8Array('lockedhvscroll');
        this.lockedHScroll = lscroll[0];
        this.lockedVScroll = lscroll[1];
        this.nameTableBits = this.controlByte0 & 3;
        this.backgroundPatternTableIndex = ((this.controlByte0 & 16) >> 4) * 0x1000;
        this.greyScale = (this.controlByte1 & 0x1) === 0x1;
        this.emphasisBits = (this.controlByte1 >> 5) & 7;
        this.spritesVisible = (this.controlByte1 & 0x10) === 0x10;
        this.tilesVisible = (this.controlByte1 & 0x08) === 0x08;
        this.clipTiles = (this.controlByte1 & 0x02) !== 0x02;
        this.clipSprites = (this.controlByte1 & 0x04) !== 0x04;
    };
    ChiChiPPU.prototype.updateStateBuffer = function (sb) {
        sb.getUint16Array('ppuaddress')[0] = this.address;
        sb.getUint8Array('spriteaddress')[0] = this.spriteAddress;
        var cbytes = sb.getUint8Array('ppucontrolbytes');
        cbytes[0] = this.controlByte0;
        cbytes[1] = this.controlByte1;
        sb.getUint8Array('ppustatus')[0] = this.status;
        var scroll = sb.getUint8Array('hvscroll');
        scroll[0] = this.hScroll;
        scroll[1] = this.vScroll;
        var lscroll = sb.getUint8Array('lockedhvscroll');
        lscroll[0] = this.lockedHScroll;
        lscroll[1] = this.lockedVScroll;
    };
    return ChiChiPPU;
}());
exports.ChiChiPPU = ChiChiPPU;
var createRawPixelBuffer = function (buffer) {
    var vbufLocation = 0;
    var byteOutBuffer = new Uint8Array(buffer);
    var draw = function (pixel) {
        byteOutBuffer[vbufLocation * 4] = pixel;
        vbufLocation++;
    };
    var reset = function () {
        vbufLocation = 0;
    };
    return {
        reset: reset,
        buffer: buffer,
        draw: draw
    };
};
var createDecodedPixelBuffer = function (palette) {
    if (palette === void 0) { palette = nesPallette; }
    return function (buffer) {
        var vbufLocation = 0;
        var byteOutBuffer = new Uint8Array(buffer);
        var intArray = new Uint32Array(buffer);
        var draw = function (pixel) {
            intArray[vbufLocation++] = palette[pixel & 63] | 0xff000000;
        };
        var reset = function () {
            vbufLocation = 0;
        };
        return {
            reset: reset,
            buffer: buffer,
            draw: draw
        };
    };
};
exports.PixelBuffers = {
    createRawPixelBuffer: createRawPixelBuffer,
    createDecodedPixelBuffer: createDecodedPixelBuffer
};


/***/ }),
/* 10 */
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
var NES_BYTES_WRITTEN = 0;
var WAVSHARER_BLOCKTHREAD = 1;
var WAVSHARER_BUFFERPOS = 2;
var time_unit = 2097152;
var buf_extra = 18;
var phase_count = 32;
var time_bits = 21;
var delta_bits = 15;
//sinc values
var bl_step = [
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
// shared buffer to get sound out
var WavSharer = /** @class */ (function () {
    function WavSharer() {
        this.neswait = false;
        this.synced = true;
        this.controlBuffer = new Int32Array(new ArrayBuffer(3 * Int32Array.BYTES_PER_ELEMENT));
        this.sharedAudioBufferPos = 0;
        this.SharedBufferLength = 8192;
        this.chunkSize = 1024;
        this.SharedBuffer = new Float32Array(this.SharedBufferLength);
    }
    Object.defineProperty(WavSharer.prototype, "bufferPosition", {
        get: function () {
            return this.controlBuffer[WAVSHARER_BUFFERPOS];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WavSharer.prototype, "audioBytesWritten", {
        get: function () {
            return this.controlBuffer[NES_BYTES_WRITTEN];
        },
        set: function (value) {
            this.controlBuffer[NES_BYTES_WRITTEN] = value;
        },
        enumerable: true,
        configurable: true
    });
    WavSharer.prototype.wakeSleepers = function () {
        // this.audioBytesWritten = 0;
        this.neswait = false;
        // <any>Atomics.wake(this.controlBuffer, this.NES_BYTES_WRITTEN, 99999);
    };
    WavSharer.prototype.synchronize = function () {
        if (this.synced) {
            if (this.audioBytesWritten >= this.chunkSize) {
                this.controlBuffer[WAVSHARER_BUFFERPOS] = this.sharedAudioBufferPos;
                this.neswait = true;
                // <any>Atomics.wait(this.controlBuffer, this.NES_BYTES_WRITTEN, this.audioBytesWritten);
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
var ChiChiWavSharer = /** @class */ (function (_super) {
    __extends(ChiChiWavSharer, _super);
    // blipper     
    function ChiChiWavSharer(sb) {
        var _this = _super.call(this) || this;
        sb.onRestore.subscribe(function (buffer) {
            _this.SharedBuffer = buffer.getFloat32Array('abuffer');
        });
        _this.blip_new(44100 / 5);
        return _this;
    }
    ChiChiWavSharer.prototype.blip_new = function (size) {
        this.blipBuffer = new BlipBuffer(size + buf_extra);
        this.blipBuffer.size = size;
        this.blipBuffer.factor = 0;
        this.blip_clear();
    };
    ChiChiWavSharer.prototype.blip_set_rates = function (clock_rate, sample_rate) {
        this.blipBuffer.factor = time_unit / clock_rate * sample_rate + (0.9999847412109375);
    };
    ChiChiWavSharer.prototype.blip_clear = function () {
        this.blipBuffer.offset = 0;
        this.blipBuffer.avail = 0;
        this.blipBuffer.integrator = 0;
        // this.blipBuffer.samples.fill(0);
    };
    // blip_clocks_needed(samples: number): number {
    //     const needed = samples * ChiChiWavSharer.time_unit - this.blipBuffer.offset;
    //     return ((needed + this.blipBuffer.factor - 1) / this.blipBuffer.factor) | 0;
    // }
    ChiChiWavSharer.prototype.blip_end_frame = function (t) {
        var off = t * this.blipBuffer.factor + this.blipBuffer.offset;
        this.blipBuffer.avail += off >> time_bits;
        this.blipBuffer.offset = off & (time_unit - 1);
    };
    ChiChiWavSharer.prototype.remove_samples = function (count) {
        var remain = this.blipBuffer.avail + buf_extra - count;
        this.blipBuffer.avail -= count;
        this.blipBuffer.samples.copyWithin(0, count, count + remain);
        this.blipBuffer.samples.fill(0, remain, remain + count);
        this.blipBuffer.arrayLength = count;
    };
    // reads 'count' elements into array 'outbuf', beginning at 'start' and looping at array boundary if needed
    // returns number of elements written
    ChiChiWavSharer.prototype.readElementsLoop = function () {
        var outbuf = this.SharedBuffer;
        var start = this.sharedAudioBufferPos;
        var count = this.blipBuffer.avail;
        var inPtr = 0, outPtr = start;
        var end = count;
        var sum = this.blipBuffer.integrator;
        var high = 1.0, low = -1.0;
        var factor = 1.0;
        var offset = low + 1.0 * factor;
        factor *= 1.0 / (1 << 15); // (1 /(samplerange/2))
        if (count !== 0) {
            do {
                var st = sum >> delta_bits;
                sum = sum + this.blipBuffer.samples[inPtr];
                inPtr++;
                outPtr++;
                if (outPtr >= outbuf.length) {
                    outPtr = 0;
                }
                outbuf[outPtr] = st * factor + offset;
                sum = sum - (st << (7));
            } while (end-- > 0);
            this.blipBuffer.integrator = sum;
            this.remove_samples(count);
        }
        this.sharedAudioBufferPos = outPtr;
        this.audioBytesWritten += count;
        this.synchronize();
        return count;
    };
    ChiChiWavSharer.prototype.blip_add_delta = function (time, delta) {
        if (delta === 0) {
            return;
        }
        var fixedTime = (time * this.blipBuffer.factor + this.blipBuffer.offset) | 0;
        var outPtr = (this.blipBuffer.avail + (fixedTime >> time_bits));
        var phase_shift = 16;
        //const phase = System.Int64.clip32(fixedTime.shr(phase_shift).and(System.Int64((ChiChiWavSharer.phase_count - 1))));
        var phase = (fixedTime >> phase_shift & (phase_count - 1)) >>> 0;
        var inStep = phase; // bl_step[phase];
        var rev = phase_count - phase; // bl_step[phase_count - phase];
        var interp_bits = 15;
        var interp = (fixedTime >> (phase_shift - interp_bits) & ((1 << interp_bits) - 1));
        var delta2 = (delta * interp) >> interp_bits;
        delta -= delta2;
        for (var i = 0; i < 8; ++i) {
            this.blipBuffer.samples[outPtr + i] += (bl_step[inStep][i] * delta) + (bl_step[inStep][i] * delta2);
            this.blipBuffer.samples[outPtr + (15 - i)] += (bl_step[rev][i] * delta) + (bl_step[rev - 1][i] * delta2);
        }
    };
    return ChiChiWavSharer;
}(WavSharer));
exports.ChiChiWavSharer = ChiChiWavSharer;
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
var getElements = function (blipBuffer, buffer) {
    var outbuf = [];
    var start = 0;
    var count = blipBuffer.avail;
    var inPtr = 0, outPtr = start;
    var end = count;
    var sum = blipBuffer.integrator;
    var high = 1.0, low = -1.0;
    var offset = low + 1.0;
    var factor = 1.0 / (1 << 15); // (1 /(samplerange/2))
    if (count !== 0) {
        do {
            var st = sum >> delta_bits;
            sum = sum + blipBuffer.samples[inPtr];
            inPtr++;
            outbuf.push(st * factor + offset);
            sum = sum - (st << (7));
        } while (end-- > 0);
        blipBuffer.integrator = sum;
    }
    return outbuf;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(4);
var ChiChiControl_1 = __webpack_require__(12);
var PRG_CTR = 0;
var PRG_ADR = 1;
var SRMasks_CarryMask = 0x01;
var SRMasks_ZeroResultMask = 0x02;
var SRMasks_InterruptDisableMask = 0x04;
var SRMasks_DecimalModeMask = 0x08;
var SRMasks_BreakCommandMask = 0x10;
var SRMasks_ExpansionMask = 0x20;
var SRMasks_OverflowMask = 0x40;
var SRMasks_NegativeResultMask = 0x80;
var cpuTiming = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
var addressModes = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
//chichipig
var ChiChiCPPU = /** @class */ (function () {
    function ChiChiCPPU(bopper, ppu) {
        var _this = this;
        //timing
        this.clock = 0;
        this.borrowedCycles = 0;
        // CPU Status
        this.cpuStatus16 = new Uint16Array(2);
        this.programCounter = 0;
        this.addressBus = 0;
        this.handleNMI = false;
        // CPU Op info
        this.cpuStatus = new Uint8Array(8);
        // system ram
        this.stackPointer = 255;
        this.statusRegister = 0;
        this.accumulator = 0;
        this.indexRegisterX = 0;
        this.indexRegisterY = 0;
        this.dataBus = 0;
        this._operationCounter = 0;
        // Current Instruction
        this._currentInstruction_AddressingMode = ChiChiTypes_1.ChiChiCPPU_AddressingModes.Bullshit;
        this._currentInstruction_Address = 0;
        this._currentInstruction_OpCode = 0;
        this._currentInstruction_Parameters0 = 0;
        this._currentInstruction_Parameters1 = 0;
        this._currentInstruction_ExtraTiming = 0;
        this.systemClock = 0;
        // debug helpers
        this.instructionUsage = new Uint32Array(256); //System.Array.init(256, 0, System.Int32);
        this.debugging = false;
        // #region Cheats
        this.cheating = false;
        this.genieCodes = new Array();
        // #endregion cheats
        this.instructionHistoryPointer = 255;
        this._instructionHistory = new Array(256); //System.Array.init(256, null, ChiChiInstruction);
        this.PadOne = new ChiChiControl_1.ChiChiInputHandler();
        this.PadTwo = new ChiChiControl_1.ChiChiInputHandler();
        // writeInstructionHistory(): void {
        //     const inst: ChiChiInstruction = new ChiChiInstruction();
        //     inst.time = this.systemClock;
        //     inst.A = this.accumulator;
        //     inst.X = this.indexRegisterX;
        //     inst.Y = this.indexRegisterY;
        //     inst.SR = this.statusRegister;
        //     inst.SP = this.stackPointer;
        //     inst.frame = this.clock;
        //     inst.OpCode = this._currentInstruction_OpCode;
        //     inst.Parameters0 = this._currentInstruction_Parameters0;
        //     inst.Parameters1 = this._currentInstruction_Parameters1;
        //     inst.Address = this._currentInstruction_Address;
        //     inst.AddressingMode = this._currentInstruction_AddressingMode;
        //     inst.ExtraTiming = this._currentInstruction_ExtraTiming;
        //     this._instructionHistory[(this.instructionHistoryPointer--) & 255] = inst;
        //     this.instructionUsage[this._currentInstruction_OpCode]++;
        //     if ((this.instructionHistoryPointer & 255) === 255) {
        //         this.FireDebugEvent("instructionHistoryFull");
        //     }
        // }
        // FireDebugEvent(s: any): void {
        // }
        // GetStatus(): CpuStatus {
        //     return {
        //         PC: this.programCounter,
        //         A: this.accumulator,
        //         X: this.indexRegisterX,
        //         Y: this.indexRegisterY,
        //         SP: this.stackPointer,
        //         SR: this.statusRegister
        //     }
        // }
        this.setupStateBuffer = function (sb) { return setupStateBuffer(_this, sb); };
        this.SoundBopper = bopper;
        // init PPU
        this.ppu = ppu;
        for (var i = 0; i < this._instructionHistory.length; ++i) {
            this._instructionHistory[i] = new ChiChiTypes_1.ChiChiInstruction();
        }
    }
    ChiChiCPPU.prototype.advanceClock = function (value) {
        if (value) {
            this.memoryMap.advanceClock(value);
            this.clock += value;
        }
    };
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
        this.statusRegister = (value ? (this.statusRegister | Flag) : (this.statusRegister & ~Flag));
        this.statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    };
    ChiChiCPPU.prototype.GetFlag = function (flag) {
        return ((this.statusRegister & flag) === flag);
    };
    ChiChiCPPU.prototype.interruptRequest = function () {
        if (!this.GetFlag(SRMasks_InterruptDisableMask)) {
            this.advanceClock(7);
            this.setFlag(SRMasks_InterruptDisableMask, true);
            var newStatusReg1 = this.statusRegister & ~0x10 | 0x20;
            this.pushStack(this.programCounter >> 8);
            this.pushStack(this.programCounter);
            this.pushStack(this.statusRegister);
            this.programCounter = this.getByte(0xFFFE) + (this.getByte(0xFFFF) << 8);
        }
    };
    ChiChiCPPU.prototype.nonMaskableInterrupt = function () {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        var newStatusReg = this.statusRegister & ~0x10 | 0x20;
        this.setFlag(SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.pushStack(this.programCounter >> 8);
        this.pushStack(this.programCounter & 0xFF);
        //c7ab
        // push sr onto stack
        this.pushStack(newStatusReg);
        // point pc to interrupt service routine
        var lowByte = this.getByte(0xFFFA);
        var highByte = this.getByte(0xFFFB);
        var jumpTo = lowByte | (highByte << 8);
        this.programCounter = jumpTo;
        //nonOpCodeticks = 7;
    };
    ChiChiCPPU.prototype.step = function () {
        this._currentInstruction_ExtraTiming = 0;
        if (this.handleNMI) {
            this.advanceClock(7);
            this.handleNMI = false;
            this.nonMaskableInterrupt();
        }
        else if (this.memoryMap.irqRaised()) {
            this.interruptRequest();
        }
        //FetchNextInstruction();
        this._currentInstruction_Address = this.programCounter;
        this._currentInstruction_OpCode = this.getByte(this.programCounter);
        this.programCounter = (this.programCounter + 1) & 0xffff;
        this._currentInstruction_AddressingMode = addressModes[this._currentInstruction_OpCode];
        this.fetchInstructionParameters();
        this.execute();
        this.advanceClock(cpuTiming[this._currentInstruction_OpCode]);
        this.advanceClock(this._currentInstruction_ExtraTiming);
        if (this.borrowedCycles) {
            this.advanceClock(this.borrowedCycles);
            this.borrowedCycles = 0;
        }
        // if (this.debugging) {
        //     this.writeInstructionHistory();
        //     this._operationCounter++;
        // }
    };
    ChiChiCPPU.prototype.fetchInstructionParameters = function () {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.getByte((this.programCounter++) & 0xFFFF);
                this._currentInstruction_Parameters1 = this.getByte((this.programCounter++) & 0xFFFF);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.getByte((this.programCounter++) & 0xFFFF);
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
        this.statusRegister = 52;
        this._operationCounter = 0;
        this.stackPointer = 253;
        this.programCounter = this.getByte(0xFFFC) | (this.getByte(0xFFFD) << 8);
        this.advanceClock(4);
        this.genieCodes = [];
    };
    ChiChiCPPU.prototype.PowerOn = function () {
        // powers up with this state
        this.statusRegister = 52;
        this.stackPointer = 253;
        this._operationCounter = 0;
        this.advanceClock(4);
        this.programCounter = this.getByte(0xFFFC) | (this.getByte(0xFFFD) << 8);
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
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this.indexRegisterX) | 0));
                if ((result & 0xFF) < this.indexRegisterX) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteY:
                // absolute, y indexed - two paramaters + Index register y
                result = (((((this._currentInstruction_Parameters1 << 8) | this._currentInstruction_Parameters0) + this.indexRegisterY) | 0));
                if ((result & 0xFF) < this.indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPage:
                // first parameter represents offset in zero page
                result = this._currentInstruction_Parameters0;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageX:
                result = (((this._currentInstruction_Parameters0 + this.indexRegisterX) | 0)) & 0xFF;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageY:
                result = ((((this._currentInstruction_Parameters0 & 0xFF) + (this.indexRegisterY & 0xFF)) | 0)) & 0xFF;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect:
                lowByte = this._currentInstruction_Parameters0;
                highByte = this._currentInstruction_Parameters1 << 8;
                var indAddr = (highByte | lowByte) & 65535;
                var indirectAddr = (this.getByte(indAddr));
                lowByte = (((lowByte + 1) | 0)) & 0xFF;
                indAddr = (highByte | lowByte) & 65535;
                indirectAddr = indirectAddr | (this.getByte(indAddr) << 8);
                result = indirectAddr;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
                var addr = (((this._currentInstruction_Parameters0 + this.indexRegisterX) | 0)) & 0xFF;
                lowByte = this.getByte(addr);
                addr = (addr + 1) | 0;
                highByte = this.getByte(addr & 0xFF);
                highByte = highByte << 8;
                result = highByte | lowByte;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectIndexed:
                lowByte = this.getByte(this._currentInstruction_Parameters0);
                highByte = this.getByte((((this._currentInstruction_Parameters0 + 1) | 0)) & 0xFF) << 8;
                addr = (lowByte | highByte);
                result = (addr + this.indexRegisterY) | 0;
                if ((result & 0xFF) > this.indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
                result = (((this.programCounter + this._currentInstruction_Parameters0) | 0));
                break;
            default:
                this.handleBadOperation();
                break;
        }
        return result & 65535;
    };
    ChiChiCPPU.prototype.handleBadOperation = function () {
        //throw new Error('Method not implemented.');
    };
    ChiChiCPPU.prototype.handleBreakpoint = function () {
    };
    ChiChiCPPU.prototype.decodeOperand = function () {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                this.dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator:
                return this.accumulator;
            default:
                this.dataBus = this.getByte(this.decodeAddress());
                return this.dataBus;
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
                // SKB, SKW, DOP, - undocumented noops
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
                carryFlag = (this.statusRegister & 1);
                result = (this.accumulator + data + carryFlag) | 0;
                // carry flag
                this.setFlag(SRMasks_CarryMask, result > 255);
                // overflow flag
                this.setFlag(SRMasks_OverflowMask, ((this.accumulator ^ data) & 128) !== 128 && ((this.accumulator ^ result) & 128) === 128);
                // occurs when bit 7 is set
                this.accumulator = result & 0xFF;
                this.setZNFlags(this.accumulator);
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
                this.accumulator = (this.accumulator & this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 10:
            case 6:
            case 22:
            case 14:
            case 30:
                //ASL
                data = this.decodeOperand();
                // set carry flag
                this.setFlag(SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                }
                else {
                    this.setByte(this.decodeAddress(), data);
                }
                this.setZNFlags(data);
                break;
            case 144:
                //BCC
                if ((this.statusRegister & 1) !== 1) {
                    this.branch();
                }
                break;
            case 176:
                //BCS();
                if ((this.statusRegister & 1) === 1) {
                    this.branch();
                }
                break;
            case 240:
                //BEQ();
                if ((this.statusRegister & 2) === 2) {
                    this.branch();
                }
                break;
            case 36:
            case 44:
                //BIT();
                data = this.decodeOperand();
                // overflow is bit 6
                this.setFlag(SRMasks_OverflowMask, (data & 64) === 64);
                // negative is bit 7
                if ((data & 128) === 128) {
                    this.statusRegister = this.statusRegister | 128;
                }
                else {
                    this.statusRegister = this.statusRegister & 127;
                }
                if ((data & this.accumulator) === 0) {
                    this.statusRegister = this.statusRegister | 2;
                }
                else {
                    this.statusRegister = this.statusRegister & 253;
                }
                break;
            case 48:
                //BMI();
                if ((this.statusRegister & 128) === 128) {
                    this.branch();
                }
                break;
            case 208:
                //BNE();
                if ((this.statusRegister & 2) !== 2) {
                    this.branch();
                }
                break;
            case 16:
                // BPL();
                if ((this.statusRegister & 128) !== 128) {
                    this.branch();
                }
                break;
            case 0:
                // BRK();
                this.programCounter = this.programCounter + 1;
                this.pushStack(this.programCounter >> 8 & 0xFF);
                this.pushStack(this.programCounter & 0xFF);
                data = this.statusRegister | 16 | 32;
                this.pushStack(data);
                this.statusRegister = this.statusRegister | 20;
                this.addressBus = 65534;
                lowByte = this.getByte(this.addressBus);
                this.addressBus = 65535;
                highByte = this.getByte(this.addressBus);
                this.programCounter = lowByte + highByte * 256;
                break;
            case 80:
                // BVC();
                if ((this.statusRegister & 64) !== 64) {
                    this.branch();
                }
                break;
            case 112:
                // BVS();
                if ((this.statusRegister & 64) === 64) {
                    this.branch();
                }
                break;
            case 24:
                // CLC();
                this.setFlag(SRMasks_CarryMask, false);
                break;
            case 216:
                // CLD();
                this.setFlag(SRMasks_DecimalModeMask, false);
                break;
            case 88:
                // CLI();
                this.setFlag(SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                // CLV();
                this.setFlag(SRMasks_OverflowMask, false);
                break;
            case 201:
            case 197:
            case 213:
            case 205:
            case 221:
            case 217:
            case 193:
            case 209:
                // CMP();
                data = (this.accumulator + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 224:
            case 228:
            case 236:
                // CPX();
                data = (this.indexRegisterX + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 192:
            case 196:
            case 204:
                // CPY();
                data = (this.indexRegisterY + 256 - this.decodeOperand());
                this.compare(data);
                break;
            case 198:
            case 214:
            case 206:
            case 222:
                // DEC();
                data = this.decodeOperand();
                data = (data - 1) & 0xFF;
                this.setByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 202:
                // DEX();
                this.indexRegisterX = this.indexRegisterX - 1;
                this.indexRegisterX = this.indexRegisterX & 0xFF;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 136:
                //DEY();
                this.indexRegisterY = this.indexRegisterY - 1;
                this.indexRegisterY = this.indexRegisterY & 0xFF;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 73:
            case 69:
            case 85:
            case 77:
            case 93:
            case 89:
            case 65:
            case 81:
                // EOR();
                this.accumulator = (this.accumulator ^ this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 230:
            case 246:
            case 238:
            case 254:
                // INC();
                data = this.decodeOperand();
                data = (data + 1) & 0xFF;
                this.setByte(this.decodeAddress(), data);
                this.setZNFlags(data);
                break;
            case 232:
                //INX();
                this.indexRegisterX = this.indexRegisterX + 1;
                this.indexRegisterX = this.indexRegisterX & 0xFF;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 200:
                this.indexRegisterY = this.indexRegisterY + 1;
                this.indexRegisterY = this.indexRegisterY & 0xFF;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 76:
            case 108:
                // JMP();
                // 6052 indirect jmp bug
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect && this._currentInstruction_Parameters0 === 255) {
                    this.programCounter = 255 | this._currentInstruction_Parameters1 << 8;
                }
                else {
                    this.programCounter = this.decodeAddress();
                }
                break;
            case 32:
                //JSR();
                this.pushStack((this.programCounter >> 8) & 0xFF);
                this.pushStack((this.programCounter - 1) & 0xFF);
                this.programCounter = this.decodeAddress();
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
                this.accumulator = this.decodeOperand();
                this.setZNFlags(this.accumulator);
                break;
            case 162:
            case 166:
            case 182:
            case 174:
            case 190:
                //LDX();
                this.indexRegisterX = this.decodeOperand();
                this.setZNFlags(this.indexRegisterX);
                break;
            case 160:
            case 164:
            case 180:
            case 172:
            case 188:
                //LDY();
                this.indexRegisterY = this.decodeOperand();
                this.setZNFlags(this.indexRegisterY);
                break;
            case 74:
            case 70:
            case 86:
            case 78:
            case 94:
                //LSR();
                data = this.decodeOperand();
                //LSR shifts all bits right one position. 0 is shifted into bit 7 and the original bit 0 is shifted into the Carry. 
                this.setFlag(SRMasks_CarryMask, (data & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                data = data >> 1 & 0xFF;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                }
                else {
                    this.setByte(this.decodeAddress(), data);
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
                //NOP();
                this.decodeAddress();
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
                this.accumulator = (this.accumulator | this.decodeOperand());
                this.setZNFlags(this.accumulator);
                break;
            case 72:
                //PHA();
                this.pushStack(this.accumulator);
                break;
            case 8:
                //PHP();
                data = this.statusRegister | 16 | 32;
                this.pushStack(data);
                break;
            case 104:
                //PLA();
                this.accumulator = this.popStack();
                this.setZNFlags(this.accumulator);
                break;
            case 40:
                //PLP();
                this.statusRegister = this.popStack(); // | 0x20;
                break;
            case 42:
            case 38:
            case 54:
            case 46:
            case 62:
                //ROL();
                data = this.decodeOperand();
                // old carry bit shifted into bit 1
                oldbit = (this.statusRegister & 1) === 1 ? 1 : 0;
                this.setFlag(SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                }
                else {
                    this.setByte(this.decodeAddress(), data);
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
                oldbit = (this.statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.setFlag(SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                }
                else {
                    this.setByte(this.decodeAddress(), data);
                }
                break;
            case 64:
                //RTI();
                this.statusRegister = this.popStack(); // | 0x20;
                lowByte = this.popStack();
                highByte = this.popStack();
                this.programCounter = ((highByte << 8) | lowByte);
                break;
            case 96:
                //RTS();
                lowByte = (this.popStack() + 1) & 0xFF;
                highByte = this.popStack();
                this.programCounter = ((highByte << 8) | lowByte);
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
                carryFlag = ((this.statusRegister ^ 1) & 1);
                result = (((this.accumulator - data) & 4095) - carryFlag) & 4095;
                // set overflow flag if sign bit of accumulator changed
                this.setFlag(SRMasks_OverflowMask, ((this.accumulator ^ result) & 128) === 128 && ((this.accumulator ^ data) & 128) === 128);
                this.setFlag(SRMasks_CarryMask, (result < 256));
                this.accumulator = (result) & 0xFF;
                this.setZNFlags(this.accumulator);
                break;
            case 56:
                //SEC();
                this.setFlag(SRMasks_CarryMask, true);
                break;
            case 248:
                //SED();
                this.setFlag(SRMasks_DecimalModeMask, true);
                break;
            case 120:
                //SEI();
                this.setFlag(SRMasks_InterruptDisableMask, true);
                break;
            case 133:
            case 149:
            case 141:
            case 157:
            case 153:
            case 129:
            case 145:
                //STA();
                this.setByte(this.decodeAddress(), this.accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.setByte(this.decodeAddress(), this.indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.setByte(this.decodeAddress(), this.indexRegisterY);
                break;
            case 170:
                //TAX();
                this.indexRegisterX = this.accumulator;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 168:
                //TAY();
                this.indexRegisterY = this.accumulator;
                this.setZNFlags(this.indexRegisterY);
                break;
            case 186:
                //TSX();
                this.indexRegisterX = this.stackPointer;
                this.setZNFlags(this.indexRegisterX);
                break;
            case 138:
                //TXA();
                this.accumulator = this.indexRegisterX;
                this.setZNFlags(this.accumulator);
                break;
            case 154:
                //TXS();
                this.stackPointer = this.indexRegisterX;
                break;
            case 152:
                //TYA();
                this.accumulator = this.indexRegisterY;
                this.setZNFlags(this.accumulator);
                break;
            case 11:
            case 43:
                //AAC();
                //AND byte with accumulator. If result is negative then carry is set.
                //Status flags: N,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator & 0xFF;
                this.setFlag(SRMasks_CarryMask, (this.accumulator & 128) === 128);
                this.setZNFlags(this.accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator;
                this.setFlag(SRMasks_CarryMask, (this.accumulator & 1) === 1);
                this.accumulator = this.accumulator >> 1;
                this.setZNFlags(this.accumulator);
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
                this.accumulator = this.decodeOperand() & this.accumulator;
                if ((this.statusRegister & 1) === 1) {
                    this.accumulator = (this.accumulator >> 1) | 128;
                }
                else {
                    this.accumulator = (this.accumulator >> 1);
                }
                // original bit 0 shifted to carry
                //            target.SetFlag(CPUStatusBits.Carry, (); 
                this.setFlag(SRMasks_CarryMask, (this.accumulator & 1) === 1);
                switch (this.accumulator & 48) {
                    case 48:
                        this.setFlag(SRMasks_CarryMask, true);
                        this.setFlag(SRMasks_InterruptDisableMask, false);
                        break;
                    case 0:
                        this.setFlag(SRMasks_CarryMask, false);
                        this.setFlag(SRMasks_InterruptDisableMask, false);
                        break;
                    case 16:
                        this.setFlag(SRMasks_CarryMask, false);
                        this.setFlag(SRMasks_InterruptDisableMask, true);
                        break;
                    case 32:
                        this.setFlag(SRMasks_CarryMask, true);
                        this.setFlag(SRMasks_InterruptDisableMask, true);
                        break;
                }
                break;
            case 171:
                //ATX();
                //AND byte with accumulator, then transfer accumulator to X register.
                //Status flags: N,Z
                this.indexRegisterX = (this.accumulator = this.decodeOperand() & this.accumulator);
                this.setZNFlags(this.indexRegisterX);
                break;
        }
    };
    ChiChiCPPU.prototype.setZNFlags = function (data) {
        //zeroResult = (data & 0xFF) == 0;
        //negativeResult = (data & 0x80) == 0x80;
        if ((data & 255) === 0) {
            this.statusRegister |= 2;
        }
        else {
            this.statusRegister &= -3;
        } // ((int)CPUStatusMasks.ZeroResultMask);
        if ((data & 128) === 128) {
            this.statusRegister |= 128;
        }
        else {
            this.statusRegister &= -129;
        } // ((int)CPUStatusMasks.NegativeResultMask);
    };
    ChiChiCPPU.prototype.compare = function (data) {
        this.setFlag(SRMasks_CarryMask, data > 255);
        this.setZNFlags(data & 255);
    };
    ChiChiCPPU.prototype.branch = function () {
        var highByte = (this.programCounter >> 8) & 0xff;
        this._currentInstruction_ExtraTiming = 1;
        var addr = this._currentInstruction_Parameters0 & 255;
        if ((addr & 128) === 128) {
            addr = addr - 256;
        }
        this.programCounter += addr;
        this.programCounter &= 0xffff;
        var newHighByte = (this.programCounter >> 8) & 0xff;
        if (highByte != newHighByte) {
            this._currentInstruction_ExtraTiming = 2;
        }
    };
    ChiChiCPPU.prototype.nmiHandler = function () {
        this.handleNMI = true;
    };
    ChiChiCPPU.prototype.pushStack = function (data) {
        this.memoryMap.Rams[this.stackPointer + 256] = data;
        this.stackPointer--;
        if (this.stackPointer < 0) {
            this.stackPointer = 255;
        }
    };
    ChiChiCPPU.prototype.popStack = function () {
        this.stackPointer++;
        if (this.stackPointer > 255) {
            this.stackPointer = 0;
        }
        return this.memoryMap.Rams[this.stackPointer + 256];
    };
    ChiChiCPPU.prototype.getByte = function (address) {
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
    ChiChiCPPU.prototype.setByte = function (address, data) {
        if (!this.memoryMap) {
            return;
        }
        this.memoryMap.setByte(this.clock, address, data);
    };
    ChiChiCPPU.prototype.HandleNextEvent = function () {
        // this.ppu.HandleEvent(this.clock);
        // this.FindNextEvent();
    };
    ChiChiCPPU.prototype.ResetInstructionHistory = function () {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 0xFF;
    };
    return ChiChiCPPU;
}());
exports.ChiChiCPPU = ChiChiCPPU;
function setupStateBuffer(cpu, sb) {
    sb.onRestore.subscribe(function (buffer) {
        attachStateBuffer(cpu, buffer);
    });
    sb.onUpdateBuffer.subscribe(function (buffer) {
        updateStateBuffer(cpu, buffer);
    });
    sb.pushSegment(2 * Uint16Array.BYTES_PER_ELEMENT, 'cpu_status_16')
        .pushSegment(8, 'cpu_status');
    return sb;
}
function attachStateBuffer(cpu, sb) {
    cpu.cpuStatus = sb.getUint8Array('cpu_status');
    cpu.cpuStatus16 = sb.getUint16Array('cpu_status_16');
}
function updateStateBuffer(cpu, sb) {
    cpu.cpuStatus16[PRG_CTR] = cpu.programCounter;
    cpu.cpuStatus16[PRG_ADR] = cpu.addressBus;
    cpu.cpuStatus[0] = cpu.statusRegister;
    cpu.cpuStatus[1] = cpu.accumulator;
    cpu.cpuStatus[2] = cpu.indexRegisterX;
    cpu.cpuStatus[3] = cpu.indexRegisterY;
    cpu.cpuStatus[4] = cpu.dataBus;
    cpu.cpuStatus[5] = cpu.stackPointer;
}


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
    }
    ChiChiControlPad.prototype.getPadState = function () {
        return this.padOneState;
    };
    ChiChiControlPad.prototype.refresh = function () {
    };
    ChiChiControlPad.prototype.getByte = function (clock) {
        var result = (this.currentByte >> this.readNumber) & 0x01;
        this.readNumber = (this.readNumber + 1) & 7;
        return (result | 0x40) & 0xFF;
    };
    ChiChiControlPad.prototype.setByte = function (clock, data) {
        if ((data & 1) == 1) {
            this.currentByte = this.getPadState();
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
// export const createPad = () => {
//     let currentByte = 0;
//     let readNumber = 0;
//     let padOneState = 0;
//     const getByte = () => {
//         let result = (currentByte >> readNumber) & 0x01;
//         readNumber = (readNumber + 1) & 7;
//         return (result | 0x40) & 0xFF;
//     }
//     const setByte = (data: number): void => {
//         if ((data & 1) == 1) {
//             currentByte = padOneState;
//             // if im pushing up, i cant be pushing down
//             if ((currentByte & 16) == 16) { currentByte = currentByte & ~32; }
//             // if im pushign left, i cant be pushing right.. seriously, the nes will glitch
//             if ((currentByte & 64) == 64) { currentByte = currentByte & ~128; }
//             readNumber = 0;
//         }
//     }
//     return {
//         setByte,
//         getByte
//     }
// }


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = __webpack_require__(26);
exports.bufferType = "ArrayBuffer";
var StateBuffer = /** @class */ (function () {
    function StateBuffer() {
        this.data = {
            buffer: undefined,
            segments: new Array()
        };
        this.bufferSize = 0;
        this.onRestore = new Subject_1.Subject();
        // thrown when writing clients should update the buffer
        this.onUpdateBuffer = new Subject_1.Subject();
    }
    // pre-allocates a segment of <size> bytes in the StateBuffer, returns StateBuffer
    StateBuffer.prototype.pushSegment = function (size, name) {
        var seg = this.data.segments.findIndex(function (v, i) { return v.name == name; });
        if (seg === -1) {
            var start = this.bufferSize;
            this.data.segments.push({ name: name, start: start, size: size });
            this.bufferSize += size;
        }
        return this;
    };
    // builds a new state buffer
    StateBuffer.prototype.build = function () {
        this.data.buffer = new ArrayBuffer(this.bufferSize);
        this.onRestore.next(this);
        return this;
    };
    // request buffer updates
    StateBuffer.prototype.updateBuffer = function () {
        this.onUpdateBuffer.next(this);
    };
    // helper functions to retrieve data from buffer
    StateBuffer.prototype.getSegment = function (name) {
        var x = this.data.segments.find(function (seg) { return seg.name === name; });
        return { buffer: this.data.buffer, start: x.start, size: x.size };
    };
    StateBuffer.prototype.getUint8Array = function (name) {
        var x = this.data.segments.find(function (seg) { return seg.name === name; });
        return new Uint8Array(this.data.buffer, x.start, x.size);
    };
    StateBuffer.prototype.getUint16Array = function (name) {
        var x = this.data.segments.find(function (seg) { return seg.name === name; });
        return new Uint16Array(this.data.buffer, x.start, x.size / Uint16Array.BYTES_PER_ELEMENT);
    };
    StateBuffer.prototype.getUint32Array = function (name) {
        var x = this.data.segments.find(function (seg) { return seg.name === name; });
        return new Uint32Array(this.data.buffer, x.start, x.size / Uint32Array.BYTES_PER_ELEMENT);
    };
    StateBuffer.prototype.getFloat32Array = function (name) {
        var x = this.data.segments.find(function (seg) { return seg.name === name; });
        return new Float32Array(this.data.buffer, x.start, x.size / Float32Array.BYTES_PER_ELEMENT);
    };
    StateBuffer.prototype.syncBuffer = function (config) {
        this.data = config;
        this.onRestore.next(this);
    };
    return StateBuffer;
}());
exports.StateBuffer = StateBuffer;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 15 */
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
var isFunction_1 = __webpack_require__(16);
var Subscription_1 = __webpack_require__(6);
var Observer_1 = __webpack_require__(18);
var rxSubscriber_1 = __webpack_require__(7);
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = /** @class */ (function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.destination = destinationOrNext;
                        _this.destination.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = /** @class */ (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer_1.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

/***/ }),
/* 19 */
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
var BaseCart_1 = __webpack_require__(0);
var VRCIrqBase = /** @class */ (function (_super) {
    __extends(VRCIrqBase, _super);
    function VRCIrqBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.irqLatch = 0;
        _this.prescaler = 341;
        _this.irqCounter = 0;
        _this.irqMode = false;
        _this.irqEnableAfterAck = false;
        _this.irqEnable = false;
        return _this;
    }
    VRCIrqBase.prototype.tickIrq = function () {
        if (this.irqCounter >= 0xff) {
            this.irqCounter = this.irqLatch;
            this.irqRaised = true;
        }
        else {
            this.irqCounter++;
        }
    };
    VRCIrqBase.prototype.tick = function (ticks) {
        if (this.irqMode) {
            for (var i = 0; i < ticks; ++i) {
                this.tickIrq();
            }
        }
        else {
            this.prescaler -= ticks * 3;
            if (this.prescaler <= 0) {
                this.tickIrq();
                this.prescaler += 341;
            }
        }
    };
    VRCIrqBase.prototype.advanceClock = function (ticks) {
        if (this.irqEnable) {
            this.tick(ticks);
        }
    };
    VRCIrqBase.prototype.ackIrq = function () {
        this.irqRaised = false;
        this.irqEnable = this.irqEnableAfterAck;
    };
    Object.defineProperty(VRCIrqBase.prototype, "irqControl", {
        set: function (val) {
            this.irqEnableAfterAck = (val & 0x1) == 0x1;
            var enable = (val & 0x2) == 0x2;
            this.irqMode = (val & 0x4) == 0x4;
            this.irqEnable = enable;
        },
        enumerable: true,
        configurable: true
    });
    return VRCIrqBase;
}(BaseCart_1.BaseCart));
exports.VRCIrqBase = VRCIrqBase;
// this base class contains the common irq functionality for a whole bunch of konami vrc mappers use
var VRC2or4Cart = /** @class */ (function (_super) {
    __extends(VRC2or4Cart, _super);
    function VRC2or4Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.microwire = false;
        _this.vrc2 = false;
        _this.swapMode = false;
        _this.microwireLatch = 0;
        _this.latches = [0, 0, 0, 0, 0, 0, 0, 0];
        _this.regNums = [
            0x00,
            0x01,
            0x02,
            0x03,
        ];
        _this.regMask = 0xf;
        _this.ramMask = 0xfff;
        _this.vrc2mirroring = function (clock, address, data) {
            if (address <= 0x9003) {
                switch (data & 1) {
                    case 0:
                        _this.mirror(clock, 1);
                        break;
                    case 1:
                        _this.mirror(clock, 2);
                        break;
                }
            }
        };
        _this.vrc4mirroring = function (clock, address, data) {
            if (address <= 0x9001) {
                switch (data & 7) {
                    case 0:// vertical
                        _this.mirror(clock, 1);
                        break;
                    case 1:// horizontal
                        _this.mirror(clock, 2);
                        break;
                    case 2:// onescreen - low
                        _this.oneScreenOffset = 0x0;
                        _this.mirror(clock, 0);
                        break;
                    case 3:// onescreen - high
                        _this.oneScreenOffset = 0x0400;
                        _this.mirror(clock, 0);
                        break;
                }
            }
            if (address == 0x9002 || address == 0x9003) {
                _this.swapMode = (data & 2) == 2;
            }
        };
        _this.vrcmirroring = _this.vrc4mirroring;
        return _this;
    }
    VRC2or4Cart.prototype.useMicrowire = function () {
        this.getByte = this.getByteMicrowire;
        this.microwire = true;
    };
    VRC2or4Cart.prototype.getByteMicrowire = function (clock, address) {
        // LDA $6100 and LDA $6000 will return $60|latch
        if (address >= 0x6000 && address <= 0x7FFF) {
            return (address >> 8) | this.microwireLatch;
        }
        return this.peekByte(address);
    };
    VRC2or4Cart.prototype.setByteVRC4 = function (clock, address, data) {
        switch (address & 0xf000) {
            case 0x6000:
                this.prgRomBank6[data & this.ramMask] = data;
                break;
            case 0x7000:
                break;
            case 0x8000:
                var bank8 = data & 0x1F;
                if (this.swapMode) {
                    this.setupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                }
                else {
                    this.setupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }
                break;
            case 0x9000:
                this.vrc4mirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                var bankA = data & 0x1F;
                this.setupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
                var addmask = address & this.regMask;
                var bank = ((address >> 12) & 0xf) - 0xb;
                var index = bank << 1;
                if (addmask == this.regNums[0]) {
                    this.latches[index] = (this.latches[index] & 0x1f0) | (data & 0xf);
                    this.copyBanks1k(clock, index, this.latches[index], 1);
                }
                else if (addmask == this.regNums[1]) {
                    this.latches[index] = (this.latches[index] & 0xf) | ((data << 4) & 0x1f0);
                    this.copyBanks1k(clock, index, this.latches[index], 1);
                }
                else if (addmask == this.regNums[2]) {
                    this.latches[index + 1] = (this.latches[index + 1] & 0x1f0) | (data & 0xf);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1], 1);
                }
                else if (addmask == this.regNums[3]) {
                    this.latches[index + 1] = (this.latches[index + 1] & 0xf) | ((data << 4) & 0x1f0);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1], 1);
                }
                break;
            case 0xf000:
                switch (address & 0x3) {
                    case 0:
                        this.irqLatch = (this.irqLatch & 0xf0) | (data & 0xf);
                        break;
                    case 1:
                        this.irqLatch = (this.irqLatch & 0x0f) | ((data << 4) & 0xf0);
                        break;
                    case 2:
                        this.irqControl = data;
                        break;
                    case 3:
                        this.ackIrq();
                        break;
                }
        }
    };
    VRC2or4Cart.prototype.setByteVRC2 = function (clock, address, data) {
        switch (address & 0xf000) {
            case 0x6000:
            case 0x7000:
                this.microwireLatch = data & 0x1;
                break;
            case 0x8000:
                var bank8 = data & 0x1F;
                if (this.swapMode) {
                    this.setupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                }
                else {
                    this.setupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }
                break;
            case 0x9000:
                this.vrc2mirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                var bankA = data & 0x1F;
                this.setupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
                var addmask = address & this.regMask;
                var bank = ((address >> 12) & 0xf) - 0xb;
                var index = bank << 1;
                if (addmask == this.regNums[0]) {
                    this.latches[index] = (this.latches[index] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index, this.latches[index], 1);
                }
                else if (addmask == this.regNums[1]) {
                    this.latches[index] = (this.latches[index] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index, this.latches[index], 1);
                }
                else if (addmask == this.regNums[2]) {
                    this.latches[index + 1] = (this.latches[index + 1] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1], 1);
                }
                else if (addmask == this.regNums[3]) {
                    this.latches[index + 1] = (this.latches[index + 1] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1], 1);
                }
                break;
            case 0xf000:
                if ((address & 0x3) == 0x0) {
                    this.irqLatch = (this.irqLatch & 0xf0) | (data & 0xf);
                }
                else if ((address & 0x3) == 0x1) {
                    this.irqLatch = (this.irqLatch & 0x0f) | ((data << 4) & 0xf0);
                }
                else if ((address & 0x3) == 0x2) {
                    this.irqControl = data;
                }
                else if ((address & 0x3) == 0x3) {
                    this.ackIrq();
                }
                break;
        }
    };
    VRC2or4Cart.prototype.setByteVRC2a = function (clock, address, data) {
        switch (address & 0xf000) {
            case 0x6000:
            case 0x7000:
                if (this.microwire) {
                    this.microwireLatch = data & 0x1;
                }
                else {
                    this.prgRomBank6[data & this.ramMask] = data;
                }
                break;
            case 0x8000:
                var bank8 = data & 0x1F;
                if (this.swapMode) {
                    this.setupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                }
                else {
                    this.setupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }
                break;
            case 0x9000:
                this.vrc2mirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                var bankA = data & 0x1F;
                this.setupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
                var addmask = address & this.regMask;
                var bank = ((address >> 12) & 0xf) - 0xb;
                var index = bank << 1;
                if (addmask == this.regNums[0]) {
                    this.latches[index] = (this.latches[index] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index, this.latches[index] >> 1, 1);
                }
                else if (addmask == this.regNums[1]) {
                    this.latches[index] = (this.latches[index] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index, this.latches[index] >> 1, 1);
                }
                else if (addmask == this.regNums[2]) {
                    this.latches[index + 1] = (this.latches[index + 1] & 0xf0) | (data & 0xf);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1] >> 1, 1);
                }
                else if (addmask == this.regNums[3]) {
                    this.latches[index + 1] = (this.latches[index + 1] & 0xf) | ((data << 4) & 0xf0);
                    this.copyBanks1k(clock, index + 1, this.latches[index + 1] >> 1, 1);
                }
                break;
            case 0xf000:
                if ((address & 0x3) == 0x0) {
                    this.irqLatch = (this.irqLatch & 0xf0) | (data & 0xf);
                }
                else if ((address & 0x3) == 0x1) {
                    this.irqLatch = (this.irqLatch & 0x0f) | ((data << 4) & 0xf0);
                }
                else if ((address & 0x3) == 0x2) {
                    this.irqControl = data;
                }
                else if ((address & 0x3) == 0x3) {
                    this.ackIrq();
                }
                break;
        }
        // const map = this.writeMap;
        // for (let i =0;i < map.length; ++i) {
        //     const x = map[i].mask & address;
        //     if (map[i].address.find( (v) => {
        //         return v ==  x; 
        //     })) {
        //         map[i].func(clock, address,data);
        //         return;
        //     }
        // }
    };
    return VRC2or4Cart;
}(VRCIrqBase));
exports.VRC2or4Cart = VRC2or4Cart;
var KonamiVRC2Cart = /** @class */ (function (_super) {
    __extends(KonamiVRC2Cart, _super);
    function KonamiVRC2Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KonamiVRC2Cart.prototype.altRegNums = function () {
        this.regNums = [
            0x00,
            0x04,
            0x08,
            0x0c,
        ];
        this.regMask = 0xf;
    };
    KonamiVRC2Cart.prototype.initializeCart = function () {
        this.mapperName = 'KonamiVRC24';
        this.usesSRAM = true;
        this.ramMask = 0xfff;
        this.setupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
        this.setByte = this.setByteVRC4;
        switch (this.ROMHashFunction) {
            case 'CC9FFEC': // ganbare goemon 2 
            case 'B27B8CF4':// Gryzor (contra j)
                this.setByte = this.setByteVRC2;
                this.useMicrowire();
                break;
            case 'D467C0CC': // parodius da!
            case 'C1FBF659': // boku dracula kun
            case '91328C1D': // tiny toon adventures j
            case 'FCBF28B1':
                this.altRegNums();
                break;
        }
    };
    return KonamiVRC2Cart;
}(VRC2or4Cart));
exports.KonamiVRC2Cart = KonamiVRC2Cart;
var KonamiVRC022Cart = /** @class */ (function (_super) {
    __extends(KonamiVRC022Cart, _super);
    function KonamiVRC022Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KonamiVRC022Cart.prototype.initializeCart = function () {
        this.mapperName = 'KonamiVRC2a';
        this.setupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
        this.regNums = [0x0, 0x2, 0x1, 0x3];
        this.vrcmirroring = this.vrc2mirroring;
        this.useMicrowire();
        this.setByte = this.setByteVRC2a;
        switch (this.ROMHashFunction) {
            case 'D4645E14':
                this.vrcmirroring = this.vrc4mirroring;
                break;
        }
    };
    return KonamiVRC022Cart;
}(VRC2or4Cart));
exports.KonamiVRC022Cart = KonamiVRC022Cart;
var Konami021Cart = /** @class */ (function (_super) {
    __extends(Konami021Cart, _super);
    function Konami021Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Konami021Cart.prototype.initializeCart = function () {
        this.mapperName = 'KonamiVRC2';
        this.setupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
        this.regNums = [
            0x00,
            0x02,
            0x04,
            0x06,
        ];
        this.regMask = 0xf0;
        switch (this.ROMHashFunction) {
            case '286FCD20':// ganbare goemon gaiden 2
                this.regNums = [
                    0x000,
                    0x040,
                    0x080,
                    0x0c0,
                ];
                this.regMask = 0xf0;
                this.ramMask = 0x1fff;
                break;
        }
        this.setByte = this.setByteVRC2;
    };
    return Konami021Cart;
}(VRC2or4Cart));
exports.Konami021Cart = Konami021Cart;
var Konami025Cart = /** @class */ (function (_super) {
    __extends(Konami025Cart, _super);
    function Konami025Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Konami025Cart.prototype.initializeCart = function () {
        this.usesSRAM = true;
        this.mapperName = 'KonamiVRC4';
        this.setupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.regNums = [0x000, 0x002, 0x001, 0x003];
        this.regMask = 0xf;
        switch (this.ROMHashFunction) {
            case '4A601A2C':// teenage mutant ninja turtles j
                this.regNums = [
                    0x000, 0x008, 0x004, 0x00C
                ];
                break;
        }
        this.setByte = this.setByteVRC4;
    };
    return Konami025Cart;
}(VRC2or4Cart));
exports.Konami025Cart = Konami025Cart;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// export { ChiChiStateManager, ChiChiState } from './ChiChiState';
var ChiChiMachine_1 = __webpack_require__(21);
exports.ChiChiMachine = ChiChiMachine_1.ChiChiMachine;
var ChiChiCPU_1 = __webpack_require__(11);
exports.ChiChiCPPU = ChiChiCPU_1.ChiChiCPPU;
var ChiChiAudio_1 = __webpack_require__(8);
exports.ChiChiAPU = ChiChiAudio_1.ChiChiAPU;
var ChiChiPPU_1 = __webpack_require__(9);
exports.PixelBuffers = ChiChiPPU_1.PixelBuffers;
exports.ChiChiPPU = ChiChiPPU_1.ChiChiPPU;
var BaseCart_1 = __webpack_require__(0);
exports.BaseCart = BaseCart_1.BaseCart;
var ChiChiControl_1 = __webpack_require__(12);
exports.ChiChiInputHandler = ChiChiControl_1.ChiChiInputHandler;
var CommonAudio_1 = __webpack_require__(10);
exports.WavSharer = CommonAudio_1.WavSharer;
var ChiChiTypes_1 = __webpack_require__(4);
exports.RunningStatuses = ChiChiTypes_1.RunningStatuses;
exports.DebugStepTypes = ChiChiTypes_1.DebugStepTypes;
exports.ChiChiCPPU_AddressingModes = ChiChiTypes_1.ChiChiCPPU_AddressingModes;
exports.CpuStatus = ChiChiTypes_1.CpuStatus;
exports.PpuStatus = ChiChiTypes_1.PpuStatus;
exports.ChiChiInstruction = ChiChiTypes_1.ChiChiInstruction;
exports.ChiChiSprite = ChiChiTypes_1.ChiChiSprite;
var ChiChiCheats_1 = __webpack_require__(39);
exports.ChiChiCheats = ChiChiCheats_1.ChiChiCheats;
var DebugHelpers_1 = __webpack_require__(40);
exports.DebugHelpers = DebugHelpers_1.DebugHelpers;
// import * as ChiChiMessages from './worker/worker.message';
// export { ChiChiMessages } 
var StateBuffer_1 = __webpack_require__(13);
exports.StateBuffer = StateBuffer_1.StateBuffer;
var ChiChiCarts_1 = __webpack_require__(41);
exports.iNESFileHandler = ChiChiCarts_1.iNESFileHandler;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiAudio_1 = __webpack_require__(8);
var ChiChiTypes_1 = __webpack_require__(4);
var ChiChiPPU_1 = __webpack_require__(9);
var CommonAudio_1 = __webpack_require__(10);
var ChiChiCPU_1 = __webpack_require__(11);
var StateBuffer_1 = __webpack_require__(13);
var ChiChiMemoryMap_1 = __webpack_require__(38);
//machine wrapper
var ChiChiMachine = /** @class */ (function () {
    function ChiChiMachine(cpu) {
        var _this = this;
        this.frameJustEnded = true;
        this.frameOn = false;
        this.totalCPUClocks = 0;
        this._enableSound = false;
        this.evenFrame = true;
        this.sb = new StateBuffer_1.StateBuffer();
        var wavSharer = new CommonAudio_1.ChiChiWavSharer(this.sb);
        this.SoundBopper = new ChiChiAudio_1.ChiChiAPU(wavSharer);
        this.WaveForms = wavSharer;
        this.ppu = new ChiChiPPU_1.ChiChiPPU();
        this.Cpu = cpu ? cpu : new ChiChiCPU_1.ChiChiCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.ppu.NMIHandler = function () { _this.Cpu.nmiHandler(); };
        this.ppu.frameFinished = function () { _this.frameFinished(); };
        this.mapFactory = ChiChiMemoryMap_1.setupMemoryMap(this.Cpu)(this.ppu)(this.SoundBopper)(this.Cpu.PadOne)(this.Cpu.PadTwo);
    }
    ChiChiMachine.prototype.loadCart = function (cart) {
        this.mapFactory(cart);
        this.RebuildStateBuffer();
        cart.installCart(this.ppu, this.Cpu);
    };
    Object.defineProperty(ChiChiMachine.prototype, "StateBuffer", {
        get: function () {
            return this.sb;
        },
        enumerable: true,
        configurable: true
    });
    ChiChiMachine.prototype.RebuildStateBuffer = function () {
        var stateBuffer = new StateBuffer_1.StateBuffer();
        this.Cpu.memoryMap.setupStateBuffer(stateBuffer);
        this.Cpu.setupStateBuffer(stateBuffer);
        this.ppu.setupStateBuffer(stateBuffer);
        this.Cart.setupStateBuffer(stateBuffer);
        stateBuffer.build();
        this.sb = stateBuffer;
    };
    ChiChiMachine.prototype.Drawscreen = function () {
    };
    Object.defineProperty(ChiChiMachine.prototype, "Cart", {
        get: function () {
            if (this.Cpu && this.Cpu.memoryMap && this.Cpu.memoryMap.cart) {
                return this.Cpu.memoryMap.cart;
            }
            else {
                return undefined;
            }
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
    ChiChiMachine.prototype.Reset = function () {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            this.Cart.initializeCart(true);
            this.Cpu.ResetCPU();
            this.SoundBopper.rebuildSound();
            //ClearGenieCodes();
            //this.Cpu.PowerOn();
            this.RunState = ChiChiTypes_1.RunningStatuses.Running;
        }
    };
    ChiChiMachine.prototype.PowerOn = function () {
        if (this.Cpu && this.Cart && this.Cart.supported) {
            this.Cart.initializeCart();
            this.Cpu.ppu.initialize();
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
        this.Cpu.step();
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
            this.Cpu.step();
        } while (this.frameOn);
        this.totalCPUClocks = 0;
        this.Cpu.Clock = 0;
        this.ppu.LastcpuClock = 0;
    };
    ChiChiMachine.prototype.EjectCart = function () {
        this.Cpu.memoryMap = null;
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DMCChannel = /** @class */ (function () {
    function DMCChannel(chan, onWriteAudio, handleDma) {
        this.onWriteAudio = onWriteAudio;
        this.handleDma = handleDma;
        this.playing = true;
        this.output = 0;
        this.interruptRaised = false;
        this.time = 0;
        this.internalClock = 0;
        this.isFetching = false;
        this.buffer = 0;
        this.bufferIsEmpty = false;
        this.outbits = 0;
        this.freqTable = [
            0x1AC, 0x17C, 0x154, 0x140, 0x11E, 0x0FE, 0x0E2, 0x0D6,
            0x0BE, 0x0A0, 0x08E, 0x080, 0x06A, 0x054, 0x048, 0x036,
        ];
        this.shiftreg = 0;
        this.silenced = false;
        this.cycles = 0;
        this.nextRead = 0;
        this.lengthCounter = 0;
        this.length = 0;
        this.address = 0;
        this.interruptEnabled = 0;
        this.frequency = 0;
        this.loopFlag = 0;
        this._chan = 0;
        this._chan = chan;
    }
    DMCChannel.prototype.writeRegister = function (register, data, time) {
        switch (register) {
            case 0:
                this.frequency = data & 0xf;
                this.loopFlag = (data >> 6) & 0x1;
                this.interruptEnabled = (data >> 7) & 1;
                if (this.interruptEnabled === 0) {
                    this.interruptRaised = false;
                }
                break;
            case 1:
                this.output = data & 0x7f;
                this.onWriteAudio(this.time);
                break;
            case 2:
                this.address = data;
                break;
            case 3:
                this.length = data;
                break;
            case 4:
                this.interruptRaised = false;
                if (data) {
                    if (!this.lengthCounter) {
                        this.nextRead = 0xC000 | ((this.address << 6) & 0xffff);
                        this.lengthCounter = (this.length << 4) + 1;
                    }
                }
                else {
                    this.lengthCounter = 0;
                }
                break;
        }
    };
    DMCChannel.prototype.run = function (endTime) {
        if (!this.playing) {
            this.time = endTime;
            this.output = 0;
            return;
        }
        for (; this.time < endTime; this.time++) {
            if (--this.cycles <= 0) {
                this.cycles = this.freqTable[this.frequency];
                if (!this.silenced) {
                    if (this.shiftreg & 1) {
                        if (this.output <= 0x7D) {
                            this.output += 2;
                            this.onWriteAudio(this.time);
                        }
                    }
                    else {
                        if (this.output >= 0x02) {
                            this.output -= 2;
                            this.onWriteAudio(this.time);
                        }
                    }
                    this.shiftreg >>= 1;
                }
                if (--this.outbits <= 0) {
                    this.outbits = 8;
                    if (!this.bufferIsEmpty) {
                        this.shiftreg = this.buffer;
                        this.bufferIsEmpty = true;
                        this.silenced = false;
                    }
                    else {
                        this.silenced = true;
                    }
                }
            }
            if (this.bufferIsEmpty && !this.isFetching && this.lengthCounter) {
                this.isFetching = true;
                this.fetch();
                this.lengthCounter--;
            }
        }
    };
    DMCChannel.prototype.fetch = function () {
        this.buffer = this.handleDma(this.nextRead);
        this.bufferIsEmpty = false;
        this.isFetching = false;
        if (++this.nextRead == 0x10000)
            this.nextRead = 0x8000;
        if (!this.lengthCounter) {
            if (this.loopFlag) {
                this.nextRead = 0xC000 | ((this.address << 6) & 0xffff);
                this.lengthCounter = (this.length << 4) + 1;
            }
            else if (this.interruptEnabled) {
                this.interruptRaised = true;
            }
        }
    };
    DMCChannel.prototype.endFrame = function (time) {
        this.run(time);
        this.time = 0;
    };
    return DMCChannel;
}());
exports.DMCChannel = DMCChannel;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SquareChannel = /** @class */ (function () {
    function SquareChannel(chan, onWriteAudio) {
        this.onWriteAudio = onWriteAudio;
        this.output = 0;
        this.playing = true;
        this.channelNumber = 0;
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
        this.latchedLength = 0;
        this.period = 0;
        this.rawTimer = 0;
        this.volume = 0;
        this.time = 0;
        this.envelope = 0;
        this.looping = false;
        this.enabled = false;
        this.doodies = [2, 6, 30, 249];
        this.sweepShift = 0;
        this.sweepCounter = 0;
        this.sweepDivider = 0;
        this.sweepNegateFlag = false;
        this.sweepEnabled = false;
        this.startSweep = false;
        this.sweepInvalid = false;
        this.phase = 0;
        this.envelopeTimer = 0;
        this.envelopeStart = false;
        this.envelopeConstantVolume = false;
        this.envelopeVolume = 0;
        this.sweepComplement = false;
        this.dutyCycle = 0;
        this.channelNumber = chan;
        this.enabled = true;
        this.sweepDivider = 1;
        this.envelopeTimer = 15;
    }
    // functions
    SquareChannel.prototype.writeRegister = function (register, data, time) {
        switch (register) {
            case 0:
                this.envelopeConstantVolume = (data & 0x10) === 0x10;
                this.volume = data & 15;
                this.dutyCycle = this.doodies[(data >> 6) & 0x3];
                this.looping = (data & 0x20) === 0x20;
                this.sweepInvalid = false;
                break;
            case 1:
                this.sweepShift = data & 7;
                this.sweepNegateFlag = (data & 8) === 8;
                this.sweepDivider = (data >> 4) & 7;
                this.sweepEnabled = (data & 0x80) === 0x80;
                this.startSweep = true;
                this.sweepInvalid = false;
                break;
            case 2:
                this.period &= 0x700;
                this.period |= data;
                this.rawTimer = this.period;
                break;
            case 3:
                this.period &= 0xFF;
                this.period |= (data & 7) << 8;
                this.rawTimer = this.period;
                this.phase = 0;
                // setup length
                if (this.enabled) {
                    this.latchedLength = this.lengthCounts[(data >> 3) & 0x1f];
                }
                this.envelopeStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this.latchedLength = 0;
                }
                break;
        }
    };
    SquareChannel.prototype.run = function (end_time) {
        if (!this.playing) {
            this.time = end_time;
            this.output = 0;
            return;
        }
        var period = this.sweepEnabled ? ((this.period + 1) & 0x7FF) << 1 : ((this.rawTimer + 1) & 0x7FF) << 1;
        if (period === 0) {
            this.time = end_time;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }
        var volume = this.envelopeConstantVolume ? this.volume : this.envelopeVolume;
        if (this.latchedLength === 0 || volume === 0 || this.sweepInvalid) {
            this.phase += ((end_time - this.time) / period) & 7;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }
        for (; this.time < end_time; this.time += period, this.phase++) {
            this.output = (this.dutyCycle >> (this.phase & 7) & 1) * volume;
            this.onWriteAudio(this.time);
        }
        this.phase &= 7;
    };
    SquareChannel.prototype.endFrame = function (time) {
        this.run(time);
        this.time = 0;
    };
    SquareChannel.prototype.frameClock = function (time, step) {
        this.run(time);
        if (!this.envelopeStart) {
            this.envelopeTimer--;
            if (this.envelopeTimer === 0) {
                this.envelopeTimer = this.volume + 1;
                if (this.envelopeVolume > 0) {
                    this.envelopeVolume--;
                }
                else {
                    this.envelopeVolume = this.looping ? 15 : 0;
                }
            }
        }
        else {
            this.envelopeStart = false;
            this.envelopeTimer = this.volume + 1;
            this.envelopeVolume = 15;
        }
        switch (step) {
            case 1:
            case 3:
                --this.sweepCounter;
                if (this.sweepCounter === 0) {
                    this.sweepCounter = this.sweepDivider + 1;
                    if (this.sweepEnabled && this.sweepShift > 0) {
                        var sweep = this.period >> this.sweepShift;
                        if (this.sweepComplement) {
                            this.period += this.sweepNegateFlag ? ~sweep : sweep;
                        }
                        else {
                            this.period += this.sweepNegateFlag ? ~sweep + 1 : sweep;
                        }
                        this.sweepInvalid = (this.rawTimer < 8 || (this.period & 2048) === 2048);
                        //if (_sweepInvalid)
                        //{
                        //    _sweepInvalid = true;
                        //}
                    }
                }
                if (this.startSweep) {
                    this.startSweep = false;
                    this.sweepCounter = this.sweepDivider + 1;
                }
                if (!this.looping && this.latchedLength > 0) {
                    this.latchedLength--;
                }
                break;
        }
    };
    return SquareChannel;
}());
exports.SquareChannel = SquareChannel;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TriangleChannel = /** @class */ (function () {
    function TriangleChannel(chan, onWriteAudio) {
        this.onWriteAudio = onWriteAudio;
        this.playing = true;
        this.output = 0;
        this._chan = 0;
        this.lengthCounts = [
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
        ];
        this.length = 0;
        this.period = 0;
        this.time = 0;
        this.envelope = 0;
        this.looping = false;
        this.enabled = false;
        this.linCtr = 0;
        this._phase = 0;
        this._linVal = 0;
        this.linStart = false;
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
                this.period &= 0xff;
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
        if (!this.playing) {
            this.time = end_time;
            this.output = 0;
            return;
        }
        var period = this.period + 1;
        if (this.linCtr === 0 || this.length === 0 || this.period < 4) {
            // leave it at it's current phase
            this.time = end_time;
            return;
        }
        for (; this.time < end_time; this.time += period, this._phase = (this._phase + 1) % 32) {
            this.output = this._phase < 16 ? this._phase : 31 - this._phase;
            this.onWriteAudio(this.time);
        }
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NoiseChannel = /** @class */ (function () {
    function NoiseChannel(chan, onWriteAudio) {
        this.onWriteAudio = onWriteAudio;
        this.playing = true;
        this.output = 0;
        this.period = 0;
        this.enabled = false;
        this.chan = 0;
        this.noisePeriods = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
        this.lengthCounts = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
        this.time = 0;
        this.envConstantVolume = false;
        this.envVolume = 0;
        this.phase = 0;
        this.envTimer = 0;
        this.envStart = false;
        this.length = 0;
        this.volume = 0;
        this.looping = false;
        this.chan = chan;
        this.phase = 1;
        this.envTimer = 15;
    }
    NoiseChannel.prototype.writeRegister = function (register, data, time) {
        // Run(time);
        switch (register) {
            case 0:
                this.envConstantVolume = (data & 16) === 16;
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
                this.envStart = true;
                break;
            case 4:
                this.enabled = (data !== 0);
                if (!this.enabled) {
                    this.length = 0;
                }
                break;
        }
    };
    NoiseChannel.prototype.run = function (end_time) {
        if (!this.playing) {
            this.time = end_time;
            this.output = 0;
            return;
        }
        var volume = this.envConstantVolume ? this.volume : this.envVolume;
        if (this.length === 0) {
            volume = 0;
        }
        if (this.period === 0) {
            this.time = end_time;
            this.output = 0;
            this.onWriteAudio(this.time);
            return;
        }
        if (this.phase === 0) {
            this.phase = 1;
        }
        for (; this.time < end_time; this.time += this.period) {
            var new15 = this.looping ? ((this.phase & 1) ^ ((this.phase >> 6) & 1))
                : ((this.phase & 1) ^ ((this.phase >> 1) & 1));
            this.output = this.phase & 1 * volume;
            this.onWriteAudio(this.time);
            this.phase = ((this.phase >> 1) | (new15 << 14)) & 0xffff;
        }
    };
    NoiseChannel.prototype.endFrame = function (time) {
        this.run(time);
        this.time = 0;
    };
    NoiseChannel.prototype.frameClock = function (time, step) {
        this.run(time);
        if (!this.envStart) {
            this.envTimer--;
            if (this.envTimer === 0) {
                this.envTimer = this.volume + 1;
                if (this.envVolume > 0) {
                    this.envVolume--;
                }
                else {
                    this.envVolume = this.looping ? 15 : 0;
                }
            }
        }
        else {
            this.envStart = false;
            this.envTimer = this.volume + 1;
            this.envVolume = 15;
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
/* 26 */
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
var Observable_1 = __webpack_require__(27);
var Subscriber_1 = __webpack_require__(15);
var Subscription_1 = __webpack_require__(6);
var ObjectUnsubscribedError_1 = __webpack_require__(36);
var SubjectSubscription_1 = __webpack_require__(37);
var rxSubscriber_1 = __webpack_require__(7);
/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = /** @class */ (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
    }
    return SubjectSubscriber;
}(Subscriber_1.Subscriber));
exports.SubjectSubscriber = SubjectSubscriber;
/**
 * @class Subject<T>
 */
var Subject = /** @class */ (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable_1.Observable));
exports.Subject = Subject;
/**
 * @class AnonymousSubject<T>
 */
var AnonymousSubject = /** @class */ (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription_1.Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));
exports.AnonymousSubject = AnonymousSubject;
//# sourceMappingURL=Subject.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = __webpack_require__(5);
var toSubscriber_1 = __webpack_require__(28);
var observable_1 = __webpack_require__(33);
var pipe_1 = __webpack_require__(34);
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = /** @class */ (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
     *
     * @example <caption>Subscribe with an Observer</caption>
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Subscribe with functions</caption>
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Cancel a subscription</caption>
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     *
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * @example
     *
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(15);
var rxSubscriber_1 = __webpack_require__(7);
var Observer_1 = __webpack_require__(18);
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var errorObject_1 = __webpack_require__(17);
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;
//# sourceMappingURL=tryCatch.js.map

/***/ }),
/* 32 */
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
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = /** @class */ (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        var _this = _super.call(this) || this;
        _this.errors = errors;
        var err = Error.call(_this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '');
        _this.name = err.name = 'UnsubscriptionError';
        _this.stack = err.stack;
        _this.message = err.message;
        return _this;
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = __webpack_require__(5);
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.observable = getSymbolObservable(root_1.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;
//# sourceMappingURL=observable.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var noop_1 = __webpack_require__(35);
/* tslint:enable:max-line-length */
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
/* @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=pipe.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-empty */
function noop() { }
exports.noop = noop;
//# sourceMappingURL=noop.js.map

/***/ }),
/* 36 */
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
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
var ObjectUnsubscribedError = /** @class */ (function (_super) {
    __extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        var _this = this;
        var err = _this = _super.call(this, 'object unsubscribed') || this;
        _this.name = err.name = 'ObjectUnsubscribedError';
        _this.stack = err.stack;
        _this.message = err.message;
        return _this;
    }
    return ObjectUnsubscribedError;
}(Error));
exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ }),
/* 37 */
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
var Subscription_1 = __webpack_require__(6);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubjectSubscription = /** @class */ (function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.subscriber = subscriber;
        _this.closed = false;
        return _this;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_1.Subscription));
exports.SubjectSubscription = SubjectSubscription;
//# sourceMappingURL=SubjectSubscription.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getByte = function (cpu) { return function (ppu) { return function (apu) { return function (Rams) { return function (pad1) { return function (pad2) { return function (cart) {
    return function (clock, address) {
        var result = 0;
        // check high byte, find appropriate handler
        switch (address & 0xF000) {
            case 0:
            case 0x1000:
                if (address < 2048) {
                    result = Rams[address];
                }
                else {
                    result = address >> 8;
                }
                break;
            case 0x2000:
            case 0x3000:
                result = ppu.getByte(clock, address);
                break;
            case 0x4000:
                switch (address) {
                    case 0x4015:
                        result = apu.GetByte(clock, address);
                        break;
                    case 0x4016:
                        result = pad1.GetByte(clock, address);
                        break;
                    case 0x4017:
                        result = pad2.GetByte(clock, address);
                        break;
                    default:
                        if (cart.mapsBelow6000)
                            result = cart.getByte(clock, address);
                        else
                            result = address >> 8;
                        break;
                }
                break;
            case 0x5000:
                // ??
                result = address >> 8;
                break;
            case 0x6000:
            case 0x7000:
            case 0x8000:
            case 0x9000:
            case 0xa000:
            case 0xb000:
            case 0xc000:
            case 0xd000:
            case 0xe000:
            case 0xf000:
                // cart 
                result = cart.getByte(clock, address);
                break;
            default:
                throw new Error("Bullshit!");
        }
        return result & 255;
    };
}; }; }; }; }; }; };
var setByte = function (cpu) { return function (ppu) { return function (apu) { return function (Rams) { return function (pad1) { return function (pad2) { return function (cart) {
    return function (clock, address, data) {
        // check high byte, find appropriate handler
        if (address < 2048) {
            Rams[address & 2047] = data;
            return;
        }
        switch (address & 61440) {
            case 0:
            case 0x1000:
                // nes sram
                Rams[address & 2047] = data;
                break;
            case 20480:
                cart.setByte(clock, address, data);
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
                cart.setByte(clock, address, data);
                break;
            case 8192:
            case 12288:
                ppu.setByte(clock, address, data);
                break;
            case 16384:
                switch (address) {
                    case 0x4000:
                    case 0x4001:
                    case 0x4002:
                    case 0x4003:
                    case 0x4004:
                    case 0x4005:
                    case 0x4006:
                    case 0x4007:
                    case 0x4008:
                    case 0x4009:
                    case 0x400a:
                    case 0x400b:
                    case 0x400c:
                    case 0x400d:
                    case 0x400e:
                    case 0x400f:
                    case 0x4010:
                    case 0x4011:
                    case 0x4012:
                    case 0x4013:
                    case 0x4015:
                    case 0x4017:
                        apu.SetByte(clock, address, data);
                        break;
                    case 0x4014:
                        ppu.copySprites(data * 256);
                        cpu._currentInstruction_ExtraTiming = cpu._currentInstruction_ExtraTiming + 513;
                        if (clock & 1) {
                            cpu._currentInstruction_ExtraTiming++;
                        }
                        break;
                    case 0X4016:
                        pad1.SetByte(clock, address, (data & 1) | 0x40);
                        pad2.SetByte(clock, address, (data & 1) | 0x40);
                        break;
                    default:
                        if (cart.mapsBelow6000)
                            cart.setByte(clock, address, data);
                }
                break;
        }
    };
}; }; }; }; }; }; };
var cpuMap = {
    getByte: getByte,
    setByte: setByte
};
exports.setupMemoryMap = function (cpu) { return function (ppu) { return function (apu) { return function (pad1) { return function (pad2) {
    var Rams = new Uint8Array(new ArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));
    var clocked = [ppu, apu];
    var setupStateBuffer = function (sb) {
        sb.onRestore.subscribe(function (buffer) {
            Rams = buffer.getUint8Array('rams');
        });
        sb.pushSegment(8192 * Uint8Array.BYTES_PER_ELEMENT, 'rams');
        return sb;
    };
    return function (cart) {
        clocked.push(cart);
        var cpuBus = {
            getByte: getByte(cpu)(ppu)(apu)(Rams)(pad1)(pad2),
            setByte: setByte(cpu)(ppu)(apu)(Rams)(pad1)(pad2)
        };
        var result = {
            ppu: ppu,
            apu: apu,
            pad1: pad1,
            pad2: pad2,
            cpu: cpu,
            Rams: Rams,
            cart: cart,
            setupStateBuffer: setupStateBuffer,
            getByte: cpuBus.getByte(cart),
            setByte: cpuBus.setByte(cart),
            getPPUByte: function (clock, address) { return cart.getPPUByte(clock, address); },
            setPPUByte: function (clock, address, data) { return cart.setPPUByte(clock, address, data); },
            irqRaised: function () { return cart.irqRaised || apu.interruptRaised; },
            advanceClock: function (ticks) { return clocked.forEach(function (p) { return p.advanceClock(ticks); }); },
            advanceScanline: function (ticks) {
                while (ticks-- >= 0) {
                    cart.updateScanlineCounter();
                }
            },
        };
        cpu.memoryMap = apu.memoryMap = ppu.memoryMap = result;
        return result;
    };
}; }; }; }; };


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ggDigits = ['A', 'P', 'Z', 'L', 'G', 'I', 'T', 'Y', 'E', 'O', 'X', 'U', 'K', 'S', 'V', 'N'];
function gameGenieCodeToPatch(code) {
    var patch = null;
    var hexCode = code.split('').map(function (c) {
        return ggDigits.findIndex(function (p) { return p === c; });
    });
    // magic spell that makes the gamegenie appear!
    // http://tuxnes.sourceforge.net/gamegenie.html
    var address = 0x8000 +
        ((hexCode[3] & 7) << 12)
        | ((hexCode[5] & 7) << 8) | ((hexCode[4] & 8) << 8)
        | ((hexCode[2] & 7) << 4) | ((hexCode[1] & 8) << 4)
        | (hexCode[4] & 7) | (hexCode[3] & 8);
    var data = 0;
    var compare = 0;
    if (hexCode.length == 6) {
        data =
            ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4)
                | (hexCode[0] & 7) | (hexCode[5] & 8);
        patch = {
            address: address, data: data, compare: compare, active: true
        };
    }
    else if (hexCode.length == 8) {
        data =
            ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4)
                | (hexCode[0] & 7) | (hexCode[7] & 8);
        compare =
            ((hexCode[7] & 7) << 4) | ((hexCode[6] & 8) << 4)
                | (hexCode[6] & 7) | (hexCode[5] & 8);
        patch = {
            address: address, data: data, compare: compare, active: true
        };
    }
    return patch;
}
exports.ChiChiCheats = {
    gameGenieCodeToPatch: gameGenieCodeToPatch
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(4);
var DebugHelpers = /** @class */ (function () {
    function DebugHelpers() {
    }
    DebugHelpers.disassemble = function (inst) {
        if (!inst || !inst.OpCode) {
            return '';
        }
        var parms = '';
        var addr = 0;
        parms = parms + inst.Parameters0.toString(16);
        parms = parms + inst.Parameters1.toString(16);
        var result = inst.Address.toString(16) + ': ';
        switch (inst.AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator:
                result += this.getMnemnonic(inst.OpCode);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Implicit:
                result += this.getMnemnonic(inst.OpCode);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                result += this.getMnemnonic(inst.OpCode) + ' #' + inst.Parameters0.toString(16);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPage:
                result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageX:
                result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16) + ', ' + inst.X.toString(16);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageY:
                result += this.getMnemnonic(inst.OpCode) + ' ' + inst.Parameters0.toString(16) + ', ' + inst.Y.toString(16);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
                if ((inst.Parameters0 & 128) === 128) {
                    result += this.getMnemnonic(inst.OpCode) + ' *' + inst.Parameters0.toString(16);
                }
                else {
                    result += this.getMnemnonic(inst.OpCode) + ' *+' + inst.Parameters0.toString(16);
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Absolute:
                addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX:
                addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16) + ',' + inst.X.toString(16);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteY:
                addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' ' + addr.toString(16) + ',' + inst.Y.toString(16);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect:
                addr = (inst.Parameters1 * 256 | inst.Parameters0);
                result += this.getMnemnonic(inst.OpCode) + ' (' + addr.toString(16) + ')';
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
                result += this.getMnemnonic(inst.OpCode) + ' (' + inst.Parameters0.toString(16) + ', ' + inst.X.toString(16);
                +')';
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectIndexed:
                result += this.getMnemnonic(inst.OpCode) + ' (' + inst.Parameters0.toString(16) + ', ' + inst.Y.toString(16);
                +')';
                break;
        }
        return result;
    };
    DebugHelpers.getMnemnonic = function (opcode) {
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
            case 0x0C:
            case 0x1C:
            case 0x3C:
            case 0x5C:
            case 0x7C:
            case 0xDC:
            case 0xFC:
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
                // case 0x3c:
                // case 0x5c:
                // case 0x7c:
                // case 0xdc:
                // case 0xfc:
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
            // undocumented opcodes
            case 0x0b:
            case 0x2b:
                return 'AAC';
            case 0x4b:
                return 'ASR';
            case 0x6b:
                return 'ARR';
            case 0xab:
                return 'ATX';
        }
    };
    return DebugHelpers;
}());
exports.DebugHelpers = DebugHelpers;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BaseCart_1 = __webpack_require__(0);
var Discrete = __webpack_require__(42);
var CNROMCart_1 = __webpack_require__(43);
var Multi = __webpack_require__(44);
var MMC1 = __webpack_require__(45);
var MMC2 = __webpack_require__(46);
var MMC3 = __webpack_require__(47);
var M068 = __webpack_require__(48);
var Nsf = __webpack_require__(49);
var Smb2j = __webpack_require__(50);
var VS = __webpack_require__(51);
var VRC = __webpack_require__(52);
var VRC2 = __webpack_require__(19);
var VRC6 = __webpack_require__(53);
var Sunsoft = __webpack_require__(54);
var Mapper034 = __webpack_require__(55);
var Mapper015 = __webpack_require__(56);
var Mapper112 = __webpack_require__(57);
var Mapper132 = __webpack_require__(58);
var Mapper133 = __webpack_require__(59);
var Mapper193 = __webpack_require__(60);
var Mapper228 = __webpack_require__(61);
var NESFile = __webpack_require__(62);
var MapperFactory = {
    0: Discrete.NesCart,
    1: MMC1.MMC1Cart,
    2: Discrete.UxROMCart,
    3: CNROMCart_1.CNROMCart,
    4: MMC3.MMC3Cart,
    7: Discrete.AxROMCart,
    9: MMC2.MMC2Cart,
    10: MMC2.MMC4Cart,
    11: Discrete.ColorDreams,
    13: Discrete.Mapper013Cart,
    15: Mapper015.Mapper015Cart,
    21: VRC2.Konami021Cart,
    22: VRC2.KonamiVRC022Cart,
    23: VRC2.KonamiVRC2Cart,
    24: VRC6.Konami026Cart,
    25: VRC2.Konami025Cart,
    26: VRC6.Konami026Cart,
    30: Discrete.Mapper030Cart,
    31: Nsf.Mapper031Cart,
    34: Mapper034.BNROMCart,
    38: Discrete.BitCorp038Cart,
    40: Smb2j.Smb2jCart,
    51: Multi.Mapper051Cart,
    58: Multi.Mapper058Cart,
    66: Discrete.MHROMCart,
    68: M068.Mapper068Cart,
    70: Discrete.Mapper070Cart,
    71: Discrete.Mapper071Cart,
    75: VRC.KonamiVRC1Cart,
    77: Discrete.Mapper077Cart,
    78: Discrete.Mapper078Cart,
    79: Discrete.Mapper079Cart,
    81: Discrete.Mapper081Cart,
    87: Discrete.Mapper087Cart,
    89: Sunsoft.Mapper089Cart,
    93: Sunsoft.Mapper093Cart,
    94: Discrete.Mapper094Cart,
    97: Discrete.Irem097Cart,
    99: VS.VSCart,
    112: Mapper112.Mapper112Cart,
    132: Mapper132.Mapper132Cart,
    133: Mapper133.Mapper133Cart,
    140: Discrete.JF1xCart,
    145: Discrete.Mapper145Cart,
    151: VRC.KonamiVRC1Cart,
    152: Discrete.Mapper152Cart,
    180: Discrete.NesCart,
    184: Sunsoft.Mapper184Cart,
    190: Discrete.Mapper190Cart,
    193: Mapper193.Mapper193Cart,
    202: Multi.Mapper202Cart,
    212: Multi.Mapper212Cart,
    228: Mapper228.Mapper228Cart,
};
var createCart = function (file) { return (MapperFactory[file.mapperId] !== undefined) ? new MapperFactory[file.mapperId](file) : new BaseCart_1.UnsupportedCart(file); };
exports.iNESFileHandler = function (buffer) { return createCart(NESFile.decodeFile(buffer)); };


/***/ }),
/* 42 */
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
var BaseCart_1 = __webpack_require__(0);
//  Simple discrete logic mappers
var NesCart = /** @class */ (function (_super) {
    __extends(NesCart, _super);
    function NesCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // prevBSSrc = new Uint8Array(8);
    NesCart.prototype.initializeCart = function () {
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        switch (this.mapperId) {
            case 0:
                this.mapperName = 'NROM';
                break;
            case 180:
                this.mapperName = 'UNROM (Crazy Climber?)';
                break;
        }
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    NesCart.prototype.setByte = function (clock, address, val) {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        if (this.mapperId === 180 && address >= 32768) {
            var newbankC1 = 0;
            newbankC1 = val * 2;
            // keep two LOW banks, swap high banks
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.setupBankStarts(this.current8, this.currentA, newbankC1, ((newbankC1 + 1) | 0));
        }
    };
    return NesCart;
}(BaseCart_1.BaseCart));
exports.NesCart = NesCart;
var UxROMCart = /** @class */ (function (_super) {
    __extends(UxROMCart, _super);
    function UxROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UxROMCart.prototype.initializeCart = function () {
        this.mapperName = 'UxROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    UxROMCart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = val << 1;
            this.setupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
        }
    };
    return UxROMCart;
}(BaseCart_1.BaseCart));
exports.UxROMCart = UxROMCart;
var Mapper094Cart = /** @class */ (function (_super) {
    __extends(Mapper094Cart, _super);
    function Mapper094Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper094Cart.prototype.initializeCart = function () {
        this.mapperName = 'HVC-UN1ROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper094Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = ((val >> 2) & 0x7) << 1;
            this.setupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
        }
    };
    return Mapper094Cart;
}(BaseCart_1.BaseCart));
exports.Mapper094Cart = Mapper094Cart;
var Mapper081Cart = /** @class */ (function (_super) {
    __extends(Mapper081Cart, _super);
    function Mapper081Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper081Cart.prototype.initializeCart = function () {
        this.mapperName = 'Super Gun';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper081Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = ((val >> 2) & 3) << 1;
            this.setupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
            var chrBank = val & 3;
            this.copyBanks(clock, 0, chrBank, 1);
        }
    };
    return Mapper081Cart;
}(BaseCart_1.BaseCart));
exports.Mapper081Cart = Mapper081Cart;
var Mapper030Cart = /** @class */ (function (_super) {
    __extends(Mapper030Cart, _super);
    function Mapper030Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper030Cart.prototype.initializeCart = function () {
        this.mapperName = 'UNROM-512';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper030Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = 0;
            newbank81 = (val & 0x1F) << 1;
            this.setupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
            var chrBank = (val >> 5) & 3;
            this.mirror(0, (val >> 7) & 0x1);
            this.copyBanks(clock, 0, chrBank, 1);
        }
    };
    return Mapper030Cart;
}(BaseCart_1.BaseCart));
exports.Mapper030Cart = Mapper030Cart;
var Mapper071Cart = /** @class */ (function (_super) {
    __extends(Mapper071Cart, _super);
    function Mapper071Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper071Cart.prototype.initializeCart = function () {
        this.mapperName = 'Camerica UNROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper071Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = 0;
            newbank81 = val << 1;
            this.setupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
        }
    };
    return Mapper071Cart;
}(BaseCart_1.BaseCart));
exports.Mapper071Cart = Mapper071Cart;
var Mapper013Cart = /** @class */ (function (_super) {
    __extends(Mapper013Cart, _super);
    function Mapper013Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //SRAMEnabled = SRAMCanSave;
    Mapper013Cart.prototype.initializeCart = function () {
        this.mapperName = 'NES-CPROM';
        this.copyBanks4k(0, 0, 0, 1);
        this.copyBanks4k(0, 1, 1, 1);
        // one 32k prg rom
        this.setupBankStarts(0, 1, 2, 3);
        this.mirror(0, 2);
    };
    Mapper013Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            this.copyBanks4k(clock, 1, (val & 3), 1);
        }
    };
    return Mapper013Cart;
}(BaseCart_1.BaseCart));
exports.Mapper013Cart = Mapper013Cart;
var Mapper185Cart = /** @class */ (function (_super) {
    __extends(Mapper185Cart, _super);
    function Mapper185Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper185Cart.prototype.initializeCart = function () {
        this.mapperName = 'CNROM + CP';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper185Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            this.copyBanks(clock, 0, val, 1);
        }
    };
    return Mapper185Cart;
}(BaseCart_1.BaseCart));
exports.Mapper185Cart = Mapper185Cart;
var Mapper190Cart = /** @class */ (function (_super) {
    __extends(Mapper190Cart, _super);
    function Mapper190Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper190Cart.prototype.initializeCart = function () {
        this.mapperName = 'MKGGROM';
        this.usesSRAM = true;
        this.copyBanks(0, 0, 0, 2);
        this.setupBankStarts(0, 1, 0, 1);
        this.mirror(0, 1);
    };
    Mapper190Cart.prototype.setByte = function (clock, address, val) {
        this.setPrgRam(address, val);
        // prgBank = A14, D2, D1, D0
        if (address >= 0x8000 && address <= 0x9FFF) {
            var prgBank = (val & 7) << 1;
            this.setupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
        }
        if (address >= 0xA000 && address <= 0xBFFF) {
            this.copyBanks2k(clock, address & 3, val, 1);
        }
        if (address >= 0xC000 && address <= 0xDFFF) {
            var prgBank = ((val & 7) + 8) << 1;
            this.setupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
        }
    };
    return Mapper190Cart;
}(BaseCart_1.BaseCart));
exports.Mapper190Cart = Mapper190Cart;
var Mapper087Cart = /** @class */ (function (_super) {
    __extends(Mapper087Cart, _super);
    function Mapper087Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper087Cart.prototype.initializeCart = function () {
        this.mapperName = 'CNROM Clone';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper087Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            var chrbank = ((val & 0x1) << 1) | ((val & 0x2) >> 1);
            this.copyBanks(clock, 0, chrbank, 1);
        }
    };
    return Mapper087Cart;
}(BaseCart_1.BaseCart));
exports.Mapper087Cart = Mapper087Cart;
var Mapper145Cart = /** @class */ (function (_super) {
    __extends(Mapper145Cart, _super);
    function Mapper145Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper145Cart.prototype.initializeCart = function () {
        this.mapperName = 'Sachen Sidewinder';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 2, 3);
    };
    Mapper145Cart.prototype.setByte = function (clock, address, val) {
        if ((address & 0xE100) == 0x4100) {
            var chrbank = val;
            this.copyBanks(clock, 0, chrbank, 1);
        }
    };
    return Mapper145Cart;
}(BaseCart_1.BaseCart));
exports.Mapper145Cart = Mapper145Cart;
var ColorDreams = /** @class */ (function (_super) {
    __extends(ColorDreams, _super);
    function ColorDreams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // https://wiki.nesdev.com/w/index.php/Color_Dreams
    ColorDreams.prototype.initializeCart = function () {
        this.mapperName = 'Color Dreams';
        //  if (this.chrRomCount > 0) {
        //      this.copyBanks(0, 0, 0, 1);
        //  }
        this.setupBankStarts(0, 1, 2, 3);
    };
    ColorDreams.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = (val & 0x3) << 2;
            var chrbank = ((val >> 4) & 0xf);
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            // two high bits set mirroring
            this.copyBanks(clock, 0, chrbank, 1);
        }
        //         %00 = 1ScA
        //         %01 = Horz
        //         %10 = Vert
        //         %11 = 1ScB
        //this.mirror(clock,(val >> 6));
    };
    return ColorDreams;
}(BaseCart_1.BaseCart));
exports.ColorDreams = ColorDreams;
var MHROMCart = /** @class */ (function (_super) {
    __extends(MHROMCart, _super);
    function MHROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MHROMCart.prototype.initializeCart = function () {
        this.mapperName = 'GxROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 2, 3);
    };
    MHROMCart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0x3;
            var prgbank = ((val >> 4) & 0x3) << 2;
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.copyBanks(clock, 0, chrbank, 1);
        }
    };
    return MHROMCart;
}(BaseCart_1.BaseCart));
exports.MHROMCart = MHROMCart;
var Mapper070Cart = /** @class */ (function (_super) {
    __extends(Mapper070Cart, _super);
    function Mapper070Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper070Cart.prototype.initializeCart = function () {
        this.mapperName = '~Family Trainer';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.mirror(0, 1);
    };
    Mapper070Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0xF) << 1;
            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.copyBanks(clock, 0, chrbank, 1);
            this.oneScreenOffset = (val >> 7) == 1 ? 1024 : 0;
            this.mirror(clock, 0);
        }
    };
    return Mapper070Cart;
}(BaseCart_1.BaseCart));
exports.Mapper070Cart = Mapper070Cart;
var Mapper077Cart = /** @class */ (function (_super) {
    __extends(Mapper077Cart, _super);
    function Mapper077Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper077Cart.prototype.initializeCart = function () {
        this.mapperName = '~Mapper 077';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper077Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = (val & 0xF) << 2;
            var chrbank = ((val >> 4) & 0xF);
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.copyBanks2k(clock, 0, chrbank, 1);
        }
    };
    return Mapper077Cart;
}(BaseCart_1.BaseCart));
exports.Mapper077Cart = Mapper077Cart;
var Mapper079Cart = /** @class */ (function (_super) {
    __extends(Mapper079Cart, _super);
    function Mapper079Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper079Cart.prototype.initializeCart = function () {
        this.mapsBelow6000 = true;
        this.usesSRAM = false;
        this.mapperName = 'NINA-003-006';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
        }
        this.setupBankStarts((this.prgRomCount * 2) - 4, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper079Cart.prototype.setByte = function (clock, address, val) {
        if ((address >> 13) == 2 && (address & 0x100)) {
            var prgbank = ((val >> 3) & 0x1) << 2;
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            var chrbank = (val & 0x7);
            this.copyBanks(clock, 0, chrbank, 1);
        }
    };
    return Mapper079Cart;
}(BaseCart_1.BaseCart));
exports.Mapper079Cart = Mapper079Cart;
var Mapper078Cart = /** @class */ (function (_super) {
    __extends(Mapper078Cart, _super);
    function Mapper078Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // default to cosmo carrier
        _this.isHolyDiver = false;
        return _this;
    }
    Mapper078Cart.prototype.initializeCart = function () {
        this.mapperName = 'Holy Diver / Cosmo Carrier';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        if (this.ROMHashFunction == 'BA51AC6F') {
            this.isHolyDiver = true;
            this.mirror(0, 1);
        }
        else {
            this.mirror(0, 0);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper078Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = ((val) & 0xF) << 1;
            var chrbank = (val >> 4) & 0xF;
            var mirroring = (val >> 3) & 1;
            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.copyBanks(clock, 0, chrbank, 1);
            if (this.isHolyDiver) {
                if (mirroring == 0) {
                    this.mirror(clock, 2);
                }
                else {
                    this.mirror(clock, 1);
                }
            }
            else {
                this.oneScreenOffset = mirroring * 1024;
                this.mirror(clock, 0);
            }
        }
    };
    return Mapper078Cart;
}(BaseCart_1.BaseCart));
exports.Mapper078Cart = Mapper078Cart;
var Mapper152Cart = /** @class */ (function (_super) {
    __extends(Mapper152Cart, _super);
    function Mapper152Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper152Cart.prototype.initializeCart = function () {
        this.mapperName = '~FT + onescreen mirroring';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.oneScreenOffset = 0;
        this.mirror(0, 0);
    };
    Mapper152Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0x31) << 1;
            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.copyBanks(clock, 0, chrbank, 1);
            this.oneScreenOffset = (val >> 7) == 1 ? 1024 : 0;
            this.mirror(clock, 0);
        }
    };
    return Mapper152Cart;
}(BaseCart_1.BaseCart));
exports.Mapper152Cart = Mapper152Cart;
var JF1xCart = /** @class */ (function (_super) {
    __extends(JF1xCart, _super);
    function JF1xCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JF1xCart.prototype.initializeCart = function () {
        this.mapperName = 'Jaleco JF-11, JF-14';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 2, 3);
    };
    JF1xCart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0x3) << 2;
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.copyBanks(clock, 0, chrbank, 1);
        }
    };
    return JF1xCart;
}(BaseCart_1.BaseCart));
exports.JF1xCart = JF1xCart;
var Irem097Cart = /** @class */ (function (_super) {
    __extends(Irem097Cart, _super);
    function Irem097Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Irem097Cart.prototype.initializeCart = function () {
        this.mapperName = '~Irem TAM-S1 IC';
        this.usesSRAM = false;
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts((this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1, 0, 1);
    };
    Irem097Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xffff) {
            var newbankC1 = 0;
            newbankC1 = (val & 0xf) << 1;
            // keep two LOW banks, swap high banks
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.setupBankStarts(this.current8, this.currentA, newbankC1, newbankC1 + 1);
            // two high bits set mirroring
            //         %00 = 1ScA
            //         %01 = Horz
            //         %10 = Vert
            //         %11 = 1ScB
            switch ((val >> 6) & 3) {
                case 0:
                    this.oneScreenOffset = 0;
                    this.mirror(clock, 0);
                    break;
                case 1:
                    this.mirror(clock, 2);
                    break;
                case 2:
                    this.mirror(clock, 1);
                    break;
                case 2:
                    this.oneScreenOffset = 0x400;
                    this.mirror(clock, 0);
                    break;
            }
        }
    };
    return Irem097Cart;
}(BaseCart_1.BaseCart));
exports.Irem097Cart = Irem097Cart;
var BitCorp038Cart = /** @class */ (function (_super) {
    __extends(BitCorp038Cart, _super);
    function BitCorp038Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BitCorp038Cart.prototype.initializeCart = function () {
        this.mapperName = 'Bit Corp Crime Busters';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 2, 3);
    };
    BitCorp038Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x7000 && address <= 0x7FFF) {
            var newbank81 = 0;
            var prgbank = (val & 0x3) << 2;
            var chrbank = ((val >> 2) & 0x3);
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.copyBanks(clock, 0, chrbank, 1);
        }
    };
    return BitCorp038Cart;
}(BaseCart_1.BaseCart));
exports.BitCorp038Cart = BitCorp038Cart;
//  Mapper 7 and derivatives 34
var AxROMCart = /** @class */ (function (_super) {
    __extends(AxROMCart, _super);
    function AxROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // prevBSSrc = new Uint8Array(8);
    AxROMCart.prototype.initializeCart = function () {
        this.mapperName = 'AxROM';
        this.setupBankStarts(0, 1, 2, 3);
        this.mirror(0, 0);
    };
    AxROMCart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xffff) {
            var newbank8 = 0;
            newbank8 = (val & 7) << 2;
            this.setupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
            // whizzler.DrawTo(clock);
            if (val & 16) {
                this.oneScreenOffset = 1024;
            }
            else {
                this.oneScreenOffset = 0;
            }
            this.mirror(clock, 0);
        }
    };
    return AxROMCart;
}(BaseCart_1.BaseCart));
exports.AxROMCart = AxROMCart;


/***/ }),
/* 43 */
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
var BaseCart_1 = __webpack_require__(0);
var CNROMCart = /** @class */ (function (_super) {
    __extends(CNROMCart, _super);
    function CNROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CNROMCart.prototype.initializeCart = function () {
        this.mapperName = 'CNROM';
        this.usesSRAM = false;
        // this.copyBanks(0, 0, 0, 2);
        if (this.prgRomCount == 1) {
            this.setupBankStarts(0, 1, 0, 1);
        }
        else {
            this.setupBankStarts(0, 1, 2, 3);
        }
    };
    CNROMCart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xffff) {
            var x = val & 0xf; // > this.chrRomCount - 1? this.chrRomCount -1 : val;
            this.copyBanks(clock, 0, x, 1);
        }
    };
    return CNROMCart;
}(BaseCart_1.BaseCart));
exports.CNROMCart = CNROMCart;


/***/ }),
/* 44 */
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
var BaseCart_1 = __webpack_require__(0);
// simple discrete logic multi-carts, various pirate xxxxx-in-1s
var Mapper051Cart = /** @class */ (function (_super) {
    __extends(Mapper051Cart, _super);
    function Mapper051Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bank = 0;
        _this.mode = 0;
        return _this;
    }
    Mapper051Cart.prototype.initializeCart = function () {
        this.usesSRAM = true;
        this.mapperName = 'Ball Games 11 in 1';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 2, 3);
    };
    Mapper051Cart.prototype.updateBanks = function () {
        var offset = 0;
        if (this.mode & 0x1) {
            //prg.SwapBank<SIZE_32K,0x0000>( bank );
            var b = this.bank << 2;
            this.setupBankStarts(b, b + 1, b + 2, b + 3);
            offset = 0x23;
        }
        else {
            var b = this.bank << 1;
            this.setupBankStarts(b, b + 1, this.currentC, this.currentE);
            offset = 0x2F;
        }
        //wrk.SwapBank<SIZE_8K,0x0000>( offset | (bank << 2) );
        //ppu.SetMirroring( (mode == 0x3) ? Ppu::NMT_H : Ppu::NMT_V );
        if (this.mode == 3) {
            this.mirror(0, 1);
        }
        else {
            this.mirror(0, 2);
        }
    };
    Mapper051Cart.prototype.setByte = function (clock, address, val) {
        switch (address & 0xe000) {
            case 0x6000:
                this.mode = ((val >> 3) & 0x2) | ((val >> 1) & 0x1);
                this.updateBanks();
                break;
            case 0x8000:
                this.bank = val & 0xf;
                this.updateBanks();
                break;
            case 0xc000:
                this.bank = val & 0xf;
                this.mode = ((val >> 3) & 0x2) | (this.mode & 0x1);
                break;
            case 0xe000:
        }
    };
    return Mapper051Cart;
}(BaseCart_1.BaseCart));
exports.Mapper051Cart = Mapper051Cart;
var Mapper058Cart = /** @class */ (function (_super) {
    __extends(Mapper058Cart, _super);
    function Mapper058Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper058Cart.prototype.initializeCart = function () {
        this.mapperName = 'Charlie Multi-Cart';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 2, 3);
    };
    Mapper058Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var mode = (address >> 6) & 0x01;
            if (mode) {
                // 16k banks 
                var newbank81 = (address & 7) << 1;
                this.setupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }
            else {
                // 32k banks 
                var newbank81 = 0;
                newbank81 = (address & 7) << 2;
                this.setupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
            }
            this.mirror(clock, ((address >> 7) & 0x1) + 1);
            this.copyBanks(clock, 0, (address >> 3) & 7, 1);
        }
    };
    return Mapper058Cart;
}(BaseCart_1.BaseCart));
exports.Mapper058Cart = Mapper058Cart;
var Mapper202Cart = /** @class */ (function (_super) {
    __extends(Mapper202Cart, _super);
    function Mapper202Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper202Cart.prototype.initializeCart = function () {
        this.mapperName = 'Multi-Cart';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBankStarts(0, 1, 0, 1);
    };
    Mapper202Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000) {
            //let mode = ((address >> 14) & 0x01)==0x01;
            var bank = (address >> 1) & 7;
            if ((address & 1) | ((address >> 2) & 2)) {
                var newbank81 = (bank >> 1) << 2;
                this.setupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
            }
            else {
                var newbank81 = (bank >> 1) << 1;
                this.setupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }
            this.mirror(clock, ((address) & 0x1) + 1);
            this.copyBanks(clock, 0, bank, 1);
        }
    };
    return Mapper202Cart;
}(BaseCart_1.BaseCart));
exports.Mapper202Cart = Mapper202Cart;
var Mapper212Cart = /** @class */ (function (_super) {
    __extends(Mapper212Cart, _super);
    function Mapper212Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper212Cart.prototype.initializeCart = function () {
        this.mapperName = 'Multi-Cart212';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
        }
        this.setupBankStarts(0, 1, 3, 4);
    };
    Mapper212Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var mode = ((address >> 14) & 0x01) == 0x01;
            var bank = address & 7;
            // Write $8000-$FFFF:
            // A~[1o.. .... .... MBBb]
            if (mode) {
                // When it's 1, BB is 32 KiB PRG bank at CPU $8000.
                var newbank81 = (address & 6) << 2;
                this.setupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
            }
            else {
                // When Banking style is 0, BBb specifies a 16 KiB PRG bank at both CPU $8000 and $C000. 
                var newbank81 = bank << 1;
                this.setupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }
            this.mirror(clock, ((address >> 3) & 0x1) + 1);
            this.copyBanks(clock, 0, bank, 1);
        }
    };
    return Mapper212Cart;
}(BaseCart_1.BaseCart));
exports.Mapper212Cart = Mapper212Cart;


/***/ }),
/* 45 */
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
var BaseCart_1 = __webpack_require__(0);
// MMC 
var MMC1Cart = /** @class */ (function (_super) {
    __extends(MMC1Cart, _super);
    function MMC1Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chrRomBankMode = 0;
        _this.prgRomBankMode = 0;
        _this.lastClock = 0;
        _this.sequence = 0;
        _this.accumulator = 0;
        _this.bank_select = 0;
        _this._registers = new Array(4);
        _this.lastwriteAddress = 0;
        return _this;
    }
    MMC1Cart.prototype.initializeCart = function () {
        this.mapperName = 'MMC1';
        this.usesSRAM = true;
        this.mapsBelow6000 = false;
        this.ramMask = 0x1fff;
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
        }
        this._registers[0] = 12;
        this._registers[1] = 0;
        this._registers[2] = 0;
        this._registers[3] = 0;
        this.setupBankStarts(0, 1, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.sequence = 0;
        this.accumulator = 0;
    };
    MMC1Cart.prototype.setByte = function (clock, address, val) {
        // if write is to a different register, reset
        switch (address & 0xf000) {
            case 0x6000:
            case 0x7000:
                this.prgRomBank6[address & 0x1fff] = val & 0xff;
                break;
            default:
                this.lastwriteAddress = address;
                if ((val & 128) === 128) {
                    this._registers[0] = this._registers[0] | 12;
                    this.accumulator = 0;
                    this.sequence = 0;
                }
                else {
                    if ((val & 1) === 1) {
                        this.accumulator = this.accumulator | (1 << this.sequence);
                    }
                    this.sequence++;
                }
                if (this.sequence === 5) {
                    var regnum = (address & 0x7fff) >> 13;
                    this._registers[regnum] = this.accumulator;
                    this.sequence = 0;
                    this.accumulator = 0;
                    switch (regnum) {
                        case 0:
                            this.setMMC1Mirroring(clock);
                            this.prgRomBankMode = (this._registers[0] >> 2) & 0x3;
                            this.chrRomBankMode = (this._registers[0] >> 4) & 0x1;
                            break;
                        case 1:
                        case 2:
                            this.setMMC1ChrBanking(clock);
                            break;
                        case 3:
                            this.setMMC1PrgBanking();
                            break;
                    }
                }
                break;
        }
    };
    MMC1Cart.prototype.setMMC1ChrBanking = function (clock) {
        if (this.chrRomBankMode === 1) {
            this.copyBanks4k(clock, 0, this._registers[1], 1);
            this.copyBanks4k(clock, 1, this._registers[2], 1);
        }
        else {
            this.copyBanks4k(clock, 0, this._registers[1], 1);
            this.copyBanks4k(clock, 1, this._registers[1] + 1, 1);
        }
    };
    MMC1Cart.prototype.setMMC1PrgBanking = function () {
        var reg = 0;
        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;
        }
        else {
            this.bank_select = 0;
        }
        if ((this._registers[0] & 8) === 0) {
            reg = (4 * ((this._registers[3] >> 1) & 15) + this.bank_select);
            this.setupBankStarts(reg, reg + 1, reg + 2, reg + 3);
        }
        else {
            reg = (2 * (this._registers[3]) + this.bank_select);
            if ((this._registers[0] & 4) === 4) {
                this.setupBankStarts(reg, reg + 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
            }
            else {
                this.setupBankStarts(0, 1, reg, reg + 1);
            }
        }
    };
    MMC1Cart.prototype.setMMC1Mirroring = function (clock) {
        switch (this._registers[0] & 3) {
            case 0:
                this.oneScreenOffset = 0;
                this.mirror(clock, 0);
                break;
            case 1:
                this.oneScreenOffset = 1024;
                this.mirror(clock, 0);
                break;
            case 2:
                this.mirror(clock, 1);
                break;
            case 3:
                this.mirror(clock, 2);
                break;
        }
    };
    return MMC1Cart;
}(BaseCart_1.BaseCart));
exports.MMC1Cart = MMC1Cart;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// MMC2 and MMC4
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
var BaseCart_1 = __webpack_require__(0);
var MMC2Cart = /** @class */ (function (_super) {
    __extends(MMC2Cart, _super);
    function MMC2Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.latches = [0, 0];
        _this.banks = [0, 0, 0, 0];
        return _this;
    }
    MMC2Cart.prototype.initializeCart = function () {
        this.mapperName = 'MMC2';
        this.latches[0] = 1;
        this.latches[1] = 2;
        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;
        this.setupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks4k(0, 0, this.banks[this.latches[0]], 1);
        this.copyBanks4k(0, 1, this.banks[this.latches[1]], 1);
    };
    MMC2Cart.prototype.getPPUByte = function (clock, address) {
        var bank = 0;
        if (address == 0xfd8) {
            bank = (address >> 11) & 0x2;
            this.latches[0] = bank;
            this.copyBanks4k(clock, 0, this.banks[this.latches[0]], 1);
        }
        else if (address == 0xfe8) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.latches[0] = bank;
            this.copyBanks4k(clock, 0, this.banks[this.latches[0]], 1);
        }
        else if (address >= 0x1fd8 && address <= 0x1fdf) {
            bank = (address >> 11) & 0x2;
            this.latches[1] = bank;
            this.copyBanks4k(clock, 1, this.banks[this.latches[1]], 1);
        }
        else if (address >= 0x1fe8 && address <= 0x1fef) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.latches[1] = bank;
            this.copyBanks4k(clock, 1, this.banks[this.latches[1]], 1);
        }
        // bank = address >> 10 ;
        // let newAddress = this.ppuBankStarts[bank] + (address & 1023);
        return _super.prototype.getPPUByte.call(this, clock, address); // this.chrRom[newAddress];
    };
    MMC2Cart.prototype.setByte = function (clock, address, val) {
        switch (address >> 12) {
            case 0x6:
            case 0x7:
                this.prgRomBank6[address & 0x1fff] = val & 0xff;
                break;
            case 0xA:
                this.setupBankStarts((val & 0xF), this.currentA, this.currentC, this.currentE);
                break;
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock, 0, this.banks[this.latches[0]], 1);
                //this.Whizzler.unpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock, 1, this.banks[this.latches[1]], 1);
                break;
            case 0xF:
                this.mirror(clock, (val & 0x1) + 1);
                break;
        }
    };
    return MMC2Cart;
}(BaseCart_1.BaseCart));
exports.MMC2Cart = MMC2Cart;
var MMC4Cart = /** @class */ (function (_super) {
    __extends(MMC4Cart, _super);
    function MMC4Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selector = [0, 0];
        _this.banks = [0, 0, 0, 0];
        return _this;
    }
    MMC4Cart.prototype.initializeCart = function () {
        this.mapperName = 'MMC4';
        this.selector[0] = 1;
        this.selector[1] = 2;
        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks4k(0, 0, this.banks[this.selector[0]], 1);
        this.copyBanks4k(0, 1, this.banks[this.selector[1]], 1);
    };
    MMC4Cart.prototype.getPPUByte = function (clock, address) {
        var bank = 0;
        if (address >= 0xFD8 && address <= 0xFDF) {
            bank = (address >> 11) & 0x2;
            this.selector[0] = bank;
            this.copyBanks4k(clock, 0, this.banks[this.selector[0]], 1);
        }
        else if (address >= 0xFE8 && address <= 0xFEF) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.selector[0] = bank;
            this.copyBanks4k(clock, 0, this.banks[this.selector[0]], 1);
        }
        else if (address >= 0x1FD8 && address <= 0x1FDF) {
            bank = (address >> 11) & 0x2;
            this.selector[1] = bank;
            this.copyBanks4k(clock, 1, this.banks[this.selector[1]], 1);
        }
        else if (address >= 0x1FE8 && address <= 0x1FEF) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.selector[1] = bank;
            this.copyBanks4k(clock, 1, this.banks[this.selector[1]], 1);
        }
        bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 1023);
        var data = this.chrRom[newAddress];
        return data;
    };
    MMC4Cart.prototype.setByte = function (clock, address, val) {
        switch (address >> 12) {
            case 0x6:
            case 0x7:
                if (this.SRAMEnabled && this.SRAMCanWrite) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
                break;
            case 0xA:
                var bank8 = (val & 0xF) << 1;
                this.setupBankStarts(bank8, bank8 + 1, this.currentC, this.currentE);
                break;
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock, 0, this.banks[this.selector[0]], 1);
                this.Whizzler.unpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock, 1, this.banks[this.selector[1]], 1);
                break;
            case 0xF:
                this.mirror(clock, (val & 0x1) + 1);
                break;
        }
    };
    return MMC4Cart;
}(BaseCart_1.BaseCart));
exports.MMC4Cart = MMC4Cart;


/***/ }),
/* 47 */
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
var BaseCart_1 = __webpack_require__(0);
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
    MMC3Cart.prototype.initializeCart = function () {
        this.usesSRAM = true;
        this.mapperName = 'MMC3';
        this._registers.fill(0);
        this.PPUBanks.fill(0);
        this.prevBSSrc.fill(0);
        this.prgSwap = 1;
        //SetupBanks(0, 1, 0xFE, 0xFF);
        this.prgSwitch1 = 0;
        this.prgSwitch2 = 1;
        this.swapPrgBanks();
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
            this.copyBanks1k(0, 0, 0, 8);
        }
    };
    MMC3Cart.prototype.setByte = function (clock, address, val) {
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
                this.swapPrgBanks();
                break;
            case 32769:
                switch (this._mmc3Command) {
                    case 0:
                        this.chr2kBank0 = val;
                        this.swapChrBanks();
                        // CopyBanks(0, val, 1);
                        // CopyBanks(1, val + 1, 1);
                        break;
                    case 1:
                        this.chr2kBank1 = val;
                        this.swapChrBanks();
                        // CopyBanks(2, val, 1);
                        // CopyBanks(3, val + 1, 1);
                        break;
                    case 2:
                        this.chr1kBank0 = val;
                        this.swapChrBanks();
                        //CopyBanks(4, val, 1);
                        break;
                    case 3:
                        this.chr1kBank1 = val;
                        this.swapChrBanks();
                        //CopyBanks(5, val, 1);
                        break;
                    case 4:
                        this.chr1kBank2 = val;
                        this.swapChrBanks();
                        //CopyBanks(6, val, 1);
                        break;
                    case 5:
                        this.chr1kBank3 = val;
                        this.swapChrBanks();
                        //CopyBanks(7, val, 1);
                        break;
                    case 6:
                        this.prgSwitch1 = val;
                        this.swapPrgBanks();
                        break;
                    case 7:
                        this.prgSwitch2 = val;
                        this.swapPrgBanks();
                        break;
                }
                break;
            case 40960:
                if ((val & 1) === 1) {
                    this.mirror(clock, 2);
                }
                else {
                    this.mirror(clock, 1);
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
                    this.irqRaised = true;
                }
                break;
            case 49153:
                this._mmc3TmpVal = this._mmc3IrqVal;
                break;
            case 57344:
                this._mmc3IrcOn = false;
                this.irqRaised = false;
                break;
            case 57345:
                this._mmc3IrcOn = true;
                //this._mmc3IrqVal = this._mmc3TmpVal;
                break;
        }
    };
    MMC3Cart.prototype.swapChrBanks = function () {
        if (this.ppuBankSwap) {
            this.copyBanks1k(0, 0, this.chr1kBank0, 1);
            this.copyBanks1k(0, 1, this.chr1kBank1, 1);
            this.copyBanks1k(0, 2, this.chr1kBank2, 1);
            this.copyBanks1k(0, 3, this.chr1kBank3, 1);
            this.copyBanks1k(0, 4, this.chr2kBank0, 2);
            this.copyBanks1k(0, 6, this.chr2kBank1, 2);
        }
        else {
            this.copyBanks1k(0, 4, this.chr1kBank0, 1);
            this.copyBanks1k(0, 5, this.chr1kBank1, 1);
            this.copyBanks1k(0, 6, this.chr1kBank2, 1);
            this.copyBanks1k(0, 7, this.chr1kBank3, 1);
            this.copyBanks1k(0, 0, this.chr2kBank0, 2);
            this.copyBanks1k(0, 2, this.chr2kBank1, 2);
        }
    };
    MMC3Cart.prototype.swapPrgBanks = function () {
        //|+-------- PRG ROM bank configuration (0: $8000-$9FFF swappable, $C000-$DFFF fixed to second-last bank;
        //|                                      1: $C000-$DFFF swappable, $8000-$9FFF fixed to second-last bank)
        if (this.prgSwap === 1) {
            this.setupBankStarts(this.prgRomCount * 2 - 2, this.prgSwitch2, this.prgSwitch1, this.prgRomCount * 2 - 1);
        }
        else {
            this.setupBankStarts(this.prgSwitch1, this.prgSwitch2, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        }
    };
    MMC3Cart.prototype.updateScanlineCounter = function () {
        //if (scanlineCounter == -1) return;
        if (this.scanlineCounter === 0) {
            this.scanlineCounter = this._mmc3IrqVal;
            if (this._mmc3IrqVal === 0) {
                if (this._mmc3IrcOn) {
                    this.irqRaised = true;
                    //this.updateIRQ();
                }
                this.scanlineCounter = -1;
                return;
            }
            else {
                this.scanlineCounter = this._mmc3IrqVal;
            }
        }
        if (this._mmc3TmpVal !== 0) {
            this.scanlineCounter = this._mmc3TmpVal;
            this._mmc3TmpVal = 0;
        }
        else {
            this.scanlineCounter = (this.scanlineCounter + 1) & 255;
        }
    };
    return MMC3Cart;
}(BaseCart_1.BaseCart));
exports.MMC3Cart = MMC3Cart;


/***/ }),
/* 48 */
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
var BaseCart_1 = __webpack_require__(0);
// BNROM (34)
var Mapper068Cart = /** @class */ (function (_super) {
    __extends(Mapper068Cart, _super);
    function Mapper068Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cramStart = 0;
        _this.cromStart = 0;
        return _this;
    }
    Mapper068Cart.prototype.initializeCart = function () {
        this.mapperName = 'Sunsoft-4';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.cramStart = this.chrRamStart;
        //this.mirror(0, 0);
    };
    Mapper068Cart.prototype.setByte = function (clock, address, val) {
        if (address < 0x5000)
            return;
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        switch (address & 0xF000) {
            case 0xF000:
                var newbank8 = (val * 0xF) << 1;
                this.setupBankStarts(newbank8, newbank8 + 1, this.currentC, this.currentE);
                break;
            case 0x8000:
                //Map a 2 KiB CHR ROM bank into PPU $0000.    
                this.copyBanks2k(clock, 0, val, 1);
                break;
            case 0x9000:
                // Map a 2 KiB CHR ROM bank into PPU $0800.  
                this.copyBanks2k(clock, 1, val, 1);
                break;
            case 0xA000:
                // Map a 2 KiB CHR ROM bank into PPU $1000.  
                this.copyBanks2k(clock, 2, val, 1);
                break;
            case 0xB000:
                // Map a 2 KiB CHR ROM bank into PPU $1800.   
                this.copyBanks2k(clock, 3, val, 1);
                break;
            case 0xC000:
                // Map a 1 KiB CHR ROM bank in place of the lower nametable (CIRAM $000-$3FF). Only D6-D0 are used; D7 is ignored and treated as 1, so nametables must be in the last 128 KiB of CHR ROM.   
                this.cromStart = (val | 0x80) * 0x400;
                this.chrRamStart = this.cromStart;
                this.copyBanks1k(clock, 8, val | 0x80, 1);
                break;
            case 0xD000:
                // Map a 1 KiB CHR ROM bank in place of the upper nametable (CIRAM $400-$7FF). Only D6-D0 are used; D7 is ignored and treated as 1.  
                this.copyBanks1k(clock, 9, val | 0x80, 1);
                break;
            case 0xE000:
                var useCRAM = (val & 0x10) == 0x10;
                if (useCRAM) {
                    this.chrRamStart = this.cramStart;
                }
                else {
                    this.chrRamStart = this.cromStart;
                }
                this.mirror(clock, val & 0x3);
                break;
        }
        // this.Whizzler.DrawTo(clock);
        // whizzler.DrawTo(clock);
    };
    return Mapper068Cart;
}(BaseCart_1.BaseCart));
exports.Mapper068Cart = Mapper068Cart;


/***/ }),
/* 49 */
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
var BaseCart_1 = __webpack_require__(0);
var Mapper031Cart = /** @class */ (function (_super) {
    __extends(Mapper031Cart, _super);
    function Mapper031Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mapsBelow6000 = true;
        _this.registers = [0, 0, 0, 0, 0, 0, 0, 0xff];
        return _this;
    }
    Mapper031Cart.prototype.initializeCart = function () {
        this.mapperName = 'NSF Compilation';
        this.setupBanks4k(2, this.registers);
    };
    Mapper031Cart.prototype.setByte = function (clock, address, val) {
        if ((address & 0xfff0) === 0x5ff0) {
            this.registers[address & 0x7] = val;
            this.setupBanks4k(2, this.registers);
        }
    };
    return Mapper031Cart;
}(BaseCart_1.BaseCart));
exports.Mapper031Cart = Mapper031Cart;


/***/ }),
/* 50 */
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
var BaseCart_1 = __webpack_require__(0);
var Smb2jCart = /** @class */ (function (_super) {
    __extends(Smb2jCart, _super);
    function Smb2jCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.irqEnabled = false;
        _this.irqCounter = 0;
        return _this;
    }
    Smb2jCart.prototype.initializeCart = function () {
        this.mapperName = 'Smb2j pirate';
        this.usesSRAM = false;
        this.setup6BankStarts(6, 4, 5, 1, 7);
        this.copyBanks(0, 0, 0, 1);
    };
    Smb2jCart.prototype.advanceClock = function (value) {
        if (this.irqEnabled) {
            this.irqCounter -= value;
            if (this.irqCounter <= 0) {
                this.irqCounter = 0;
                this.irqRaised = true;
                this.irqEnabled = false;
            }
        }
    };
    Smb2jCart.prototype.getByte = function (clock, address) {
        return this.prgRom[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    };
    Smb2jCart.prototype.setByte = function (clock, address, data) {
        switch (address & 0xE000) {
            case 0x8000:
                this.irqRaised = false;
                this.irqEnabled = false;
                break;
            case 0xA000:
                this.irqEnabled = true;
                this.irqCounter = 4096;
                this.nextEventAt = clock + 4096;
                break;
            case 0xE000:
                this.setup6BankStarts(this.current6, this.current8, this.currentA, data, this.currentE);
                break;
        }
    };
    return Smb2jCart;
}(BaseCart_1.BaseCart));
exports.Smb2jCart = Smb2jCart;


/***/ }),
/* 51 */
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
var BaseCart_1 = __webpack_require__(0);
var VSCart = /** @class */ (function (_super) {
    __extends(VSCart, _super);
    function VSCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.coin = 0;
        _this.dips1 = 0x0;
        _this.dips2 = 0x0;
        _this.customPalette = [430, 326, 44, 660, 0, 755, 14, 630, 555, 310, 70, 3, 764, 770, 4, 572,
            737, 200, 27, 747, 0, 222, 510, 740, 653, 53, 447, 140, 403, 0, 473, 357,
            503, 31, 420, 6, 407, 507, 333, 704, 22, 666, 36, 20, 111, 773, 444, 707,
            757, 777, 320, 700, 760, 276, 777, 467, 0, 750, 637, 567, 360, 657, 77, 120];
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        _this.reg16 = 0;
        _this.bankSelect = 0;
        _this.clocks = 0;
        return _this;
    }
    VSCart.prototype.initializeCart = function () {
        // this.usesSRAM = true;
        this.mapperName = 'VS Unisystem';
        this.mapsBelow6000 = true;
        this.setupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0, 0, 0, 1);
        this.mirror(0, 3);
    };
    VSCart.prototype.getByte = function (clock, address) {
        if (address == 0x4020) {
            return this.coin;
        }
        if (address >= 0x8000) {
            return this.peekByte(address);
        }
    };
    VSCart.prototype.setByte = function (clock, address, val) {
        this.setPrgRam(address, val);
        if (address == 0x4016) {
            this.bankSelect = val;
            var chrbank = (val >> 2) & 0x1;
            if (this.prgRomCount > 2) {
                this.setupBankStarts(chrbank, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
            }
            this.copyBanks(clock, 0, chrbank, 1);
        }
        if (address === 0x4020) {
            this.coin = val;
        }
    };
    return VSCart;
}(BaseCart_1.BaseCart));
exports.VSCart = VSCart;


/***/ }),
/* 52 */
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
var BaseCart_1 = __webpack_require__(0);
var KonamiVRC1Cart = /** @class */ (function (_super) {
    __extends(KonamiVRC1Cart, _super);
    function KonamiVRC1Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chrLatches = [0, 0, 0, 0, 0, 0, 0, 0];
        return _this;
    }
    KonamiVRC1Cart.prototype.initializeCart = function () {
        this.mapperName = 'KonamiVRC1';
        if (this.mapperId == 151) {
            this.mapperName = 'KonamiVRC1 (VS)';
            this.fourScreen = true;
            this.mirror(0, 3);
        }
        this.setupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
    };
    KonamiVRC1Cart.prototype.setByte = function (clock, address, data) {
        switch (address & 0xF000) {
            case 0x8000:
                // 8kib prg rom at 8000
                var bank8 = data & 0xF;
                this.setupBankStarts(bank8, this.currentA, this.currentC, this.currentE);
                break;
            case 0xA000:
                // 8kib prg rom at A000
                var bankA = data & 0xF;
                this.setupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0xC000:
                // 8kib prg rom at C000
                var bankC = data & 0xF;
                this.setupBankStarts(this.current8, this.currentA, bankC, this.currentE);
                break;
            case 0x9000:
                if (!this.fourScreen) {
                    if ((data & 1) == 1) {
                        this.mirror(clock, 2);
                    }
                    else {
                        this.mirror(clock, 1);
                    }
                }
                this.chrLatches[0] = ((data >> 1) & 1) << 4;
                this.chrLatches[2] = ((data >> 2) & 1) << 4;
                this.syncChrBanks(clock);
                break;
            case 0xE000:
                // 8kib prg rom at 8000
                this.chrLatches[1] = (data & 0xF);
                this.syncChrBanks(clock);
                break;
            case 0xF000:
                // 8kib prg rom at 8000
                this.chrLatches[3] = (data & 0xF);
                this.syncChrBanks(clock);
                break;
        }
    };
    KonamiVRC1Cart.prototype.syncChrBanks = function (clock) {
        this.copyBanks4k(clock, 0, this.chrLatches[0] | this.chrLatches[1], 1);
        this.copyBanks4k(clock, 1, this.chrLatches[2] | this.chrLatches[3], 1);
    };
    return KonamiVRC1Cart;
}(BaseCart_1.BaseCart));
exports.KonamiVRC1Cart = KonamiVRC1Cart;


/***/ }),
/* 53 */
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
var KonamiVRC2_1 = __webpack_require__(19);
var Konami026Cart = /** @class */ (function (_super) {
    __extends(Konami026Cart, _super);
    function Konami026Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.runCounter = false;
        _this.chrselect = 0;
        _this.chrA10Mode = false;
        _this.nameTableSource = false;
        _this.mirrorMode = 0;
        _this.bankMode = 0;
        _this.prgRamEnable = false;
        _this.swapMode = false;
        _this.microwireLatch = 0;
        _this.vrc6Registers = [0, 0, 0, 0, 0, 0, 0, 0];
        return _this;
    }
    Konami026Cart.prototype.updateChrBanks = function (clock) {
        // bank0  0 - 0x3ff
        this.copyBanks1k(clock, 0, this.vrc6Registers[0], 1);
        // bank1  0x400 - 0x7ff
        var bank = this.vrc6Registers[1];
        switch (this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[0];
                break;
        }
        this.copyBanks1k(clock, 1, bank, 1);
        // bank2  0x800 - 0xbff
        bank = this.vrc6Registers[2];
        switch (this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[1];
                break;
        }
        this.copyBanks1k(clock, 2, bank, 1);
        // bank3  0xc00 - 0xfff
        bank = this.vrc6Registers[3];
        switch (this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[1];
                break;
        }
        this.copyBanks1k(clock, 3, bank, 1);
        // bank4  0x1000 - 0x13ff
        bank = this.vrc6Registers[4];
        switch (this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[2];
                break;
        }
        this.copyBanks1k(clock, 4, bank, 1);
        // bank5 0x1400 - 0x17ff
        bank = this.vrc6Registers[5];
        switch (this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[2];
                break;
            case 2:
            case 3:
                bank = this.vrc6Registers[4];
                break;
        }
        this.copyBanks1k(clock, 5, bank, 1);
        // bank6 0x1800 - 0x1bff
        bank = this.vrc6Registers[6];
        switch (this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[3];
                break;
            case 2:
            case 3:
                bank = this.vrc6Registers[5];
                break;
        }
        this.copyBanks1k(clock, 6, bank, 1);
        // bank7 0x1800 - 0x1bff
        bank = this.vrc6Registers[7];
        switch (this.chrselect & 3) {
            case 1:
                bank = this.vrc6Registers[3];
                break;
            case 2:
            case 3:
                bank = this.vrc6Registers[5];
                break;
        }
        this.copyBanks1k(clock, 7, bank, 1);
        // bank8 0x2000 - 0x23ff
        switch (this.chrselect & 7) {
            case 1:
            case 5:
                bank = this.vrc6Registers[4];
                break;
            case 2:
            case 3:
            case 4:
            case 0:
            case 6:
            case 7:
                bank = this.vrc6Registers[6];
                break;
        }
        this.copyBanks1k(clock, 8, bank, 1);
        // bank9 0x2400 - 0x27ff
        switch (this.chrselect & 7) {
            case 1:
            case 5:
                bank = this.vrc6Registers[5];
                break;
            case 2:
            case 3:
            case 4:
                bank = this.vrc6Registers[7];
                break;
            case 0:
            case 6:
            case 7:
                bank = this.vrc6Registers[6];
                break;
        }
        this.copyBanks1k(clock, 9, bank, 1);
        // bank10 0x2800 - 0x2bff
        switch (this.chrselect & 7) {
            case 1:
            case 5:
            case 2:
            case 3:
            case 4:
                bank = this.vrc6Registers[6];
                break;
            case 0:
            case 6:
            case 7:
                bank = this.vrc6Registers[7];
                break;
        }
        this.copyBanks1k(clock, 10, bank, 1);
        this.copyBanks1k(clock, 11, this.vrc6Registers[7], 1);
        if ((this.chrselect & 0x20) == 0x20) {
            // switch(this.chrselect & 0xF) {
            //     case 0:
            //     case 7:
            //         this.mirror(clock,1);
            //         break;
            //     case 4: case 3:
            //         this.mirror(clock,2);
            //         break;
            //     case 8: case 0xF:
            //         this.oneScreenOffset = 0;
            //         this.mirror(clock,0);
            //         break;
            //     case 8: case 0xF:
            //         this.oneScreenOffset = 0x400;
            //         this.mirror(clock,0);
            //         break;
            // }
        }
    };
    Konami026Cart.prototype.initializeCart = function () {
        this.mapperName = 'KonamiVRC6';
        this.setupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
    };
    Konami026Cart.prototype.setByte = function (clock, address, data) {
        switch (address & 0xF000) {
            case 0x8000:
                if (address <= 0x8003) {
                    // 16kib prg rom at 8000
                    var bank8 = (data & 0xF) << 1;
                    this.setupBankStarts(bank8, bank8 + 1, this.currentC, this.currentE);
                }
                break;
            case 0xC000:
                if (address <= 0xC003) {
                    // 8kib prg rom at C000
                    var bankC = data & 0xF;
                    this.setupBankStarts(this.current8, this.currentA, bankC, this.currentE);
                }
                break;
            case 0xB000:
                if ((address & 3) == 3) {
                    this.chrselect = data;
                    this.prgRamEnable = (data & 0x80) == 0x80;
                    this.bankMode = data & 0x3;
                    this.mirrorMode = (data >> 2) & 0x3;
                    this.nameTableSource = ((data >> 4) & 0x1) == 0x01;
                    this.chrA10Mode = ((data >> 5) & 0x1) == 0x01;
                    this.updateChrBanks(clock);
                }
                break;
            case 0xD000:
                if (address <= 0xD003) {
                    this.vrc6Registers[address & 3] = data;
                    this.updateChrBanks(clock);
                }
                break;
            case 0xE000:
                if (address <= 0xE003) {
                    this.vrc6Registers[4 + (address & 3)] = data;
                    this.updateChrBanks(clock);
                }
                break;
            case 0xF000:
                switch (address & 0x3) {
                    case 0:
                        this.irqLatch = data;
                        break;
                    case 1:
                        this.irqControl = data;
                        break;
                    case 2:
                        this.ackIrq();
                        break;
                }
                break;
        }
    };
    return Konami026Cart;
}(KonamiVRC2_1.VRCIrqBase));
exports.Konami026Cart = Konami026Cart;


/***/ }),
/* 54 */
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
var BaseCart_1 = __webpack_require__(0);
var Mapper093Cart = /** @class */ (function (_super) {
    __extends(Mapper093Cart, _super);
    function Mapper093Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper093Cart.prototype.initializeCart = function () {
        this.usesSRAM = true;
        this.mapperName = 'Sunsoft-2';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper093Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = ((val >> 4) & 0x7) << 1;
            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
        }
    };
    return Mapper093Cart;
}(BaseCart_1.BaseCart));
exports.Mapper093Cart = Mapper093Cart;
var Mapper089Cart = /** @class */ (function (_super) {
    __extends(Mapper089Cart, _super);
    function Mapper089Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper089Cart.prototype.initializeCart = function () {
        this.mapperName = 'Sunsoft-2 on 3';
        // if (this.chrRomCount > 0) {
        //     this.copyBanks(0, 0, 0, 1);
        // }
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper089Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xffff) {
            var lobank = val & 0x7;
            lobank |= ((val >> 4) & 8);
            var prgbank = ((val >> 4) & 0x7) << 1;
            this.oneScreenOffset = (val & 8) ? 1024 : 0;
            this.mirror(clock, 0);
            this.setupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.copyBanks(clock, 0, lobank, 1);
        }
    };
    return Mapper089Cart;
}(BaseCart_1.BaseCart));
exports.Mapper089Cart = Mapper089Cart;
var Mapper184Cart = /** @class */ (function (_super) {
    __extends(Mapper184Cart, _super);
    function Mapper184Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper184Cart.prototype.initializeCart = function () {
        this.usesSRAM = false;
        this.mapperName = 'Sunsoft-1';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks4k(0, 0, 3, 1);
        this.copyBanks4k(0, 1, 0, 1);
    };
    Mapper184Cart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            var lobank = val & 0x3;
            var hibank = ((val >> 4) & 0xf);
            this.copyBanks4k(clock, 0, lobank, 1);
            this.copyBanks4k(clock, 1, hibank, 1);
        }
    };
    return Mapper184Cart;
}(BaseCart_1.BaseCart));
exports.Mapper184Cart = Mapper184Cart;


/***/ }),
/* 55 */
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
var BaseCart_1 = __webpack_require__(0);
// BNROM (34)
var BNROMCart = /** @class */ (function (_super) {
    __extends(BNROMCart, _super);
    function BNROMCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isNina = false;
        return _this;
    }
    BNROMCart.prototype.initializeCart = function () {
        this.mapperName = 'BNROM';
        this.setupBankStarts(0, 1, 2, 3);
        if (this.chrRomCount > 1) {
            this.usesSRAM = true;
            this.mapperName = 'NINA-001';
            this.isNina = true;
            this.setByte = this.SetByteNina;
            this.setupBankStarts(0, 1, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        }
        //this.mirror(0, 0);
    };
    BNROMCart.prototype.setByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xffff) {
            // val selects which bank to swap, 32k at a time
            var newbank8 = 0;
            newbank8 = (val & 15) << 2;
            this.setupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
        }
        // whizzler.DrawTo(clock);
    };
    BNROMCart.prototype.SetByteNina = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7fff) {
            this.prgRomBank6[address & 0x1fff] = val & 255;
            return;
        }
        switch (address) {
            case 0x7FFD:
                // val selects which bank to swap, 32k at a time
                var newbank8 = 0;
                newbank8 = (val & 1) << 2;
                this.setupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
                break;
            case 0x7FFE:
                // Select 4 KB CHR ROM bank for PPU $0000-$0FFF
                this.copyBanks4k(clock, 0, val & 0xf, 1);
                break;
            case 0x7FFF:
                // Select 4 KB CHR ROM bank for PPU $1000-$1FFF
                this.copyBanks4k(clock, 1, val & 0xf, 1);
                break;
        }
    };
    return BNROMCart;
}(BaseCart_1.BaseCart));
exports.BNROMCart = BNROMCart;


/***/ }),
/* 56 */
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
// 
var BaseCart_1 = __webpack_require__(0);
var Mapper015Cart = /** @class */ (function (_super) {
    __extends(Mapper015Cart, _super);
    function Mapper015Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper015Cart.prototype.initializeCart = function () {
        this.mapperName = 'Contra 100-in-1';
        this.usesSRAM = true;
        this.setupBankStarts(0, 1, 2, 3);
        this.mirror(0, 2);
    };
    Mapper015Cart.prototype.setByte = function (clock, address, data) {
        if (address >= 0x6000 && address <= 0xffff) {
            this.prgRomBank6[address & 0x1fff] = data;
        }
        else if (address >= 0x8000 && address <= 0xffff) {
            var bankmode = address & 3;
            var bank = data & 0x3f;
            var subbank = (data >> 7) & 1;
            var mirror = (data >> 6) & 1;
            this.mirror(clock, 2 - mirror);
            switch (bankmode) {
                case 0:
                    bank = bank << 2;
                    this.setupBankStarts(bank ^ subbank, (bank + 1) ^ subbank, (bank + 2) ^ subbank, (bank + 3) ^ subbank);
                    break;
                case 2:
                    bank = (bank | subbank);
                    this.setupBankStarts(bank, bank, bank, bank);
                    break;
                case 1:
                case 3:
                    bank = (bank << 1);
                    bank |= subbank;
                    this.setupBankStarts(bank, bank + 1, (~address >> 1 & 1), (bank) + 1);
                    break;
            }
        }
    };
    return Mapper015Cart;
}(BaseCart_1.BaseCart));
exports.Mapper015Cart = Mapper015Cart;


/***/ }),
/* 57 */
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
// 
var BaseCart_1 = __webpack_require__(0);
var Mapper112Cart = /** @class */ (function (_super) {
    __extends(Mapper112Cart, _super);
    function Mapper112Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.registers = [0, 0, 0, 0, 0, 0, 0, 0];
        _this.latch = 0;
        return _this;
    }
    Mapper112Cart.prototype.initializeCart = function () {
        this.mapperName = 'asder';
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper112Cart.prototype.updateBanks = function () {
        this.setupBankStarts(this.registers[0], this.registers[1], this.currentC, this.currentE);
        this.copyBanks2k(0, 0, this.registers[2], 1);
        this.copyBanks2k(0, 1, this.registers[3], 1);
        this.copyBanks1k(0, 4, this.registers[4], 1);
        this.copyBanks1k(0, 5, this.registers[5], 1);
        this.copyBanks1k(0, 6, this.registers[6], 1);
        this.copyBanks1k(0, 7, this.registers[7], 1);
    };
    Mapper112Cart.prototype.setByte = function (clock, address, data) {
        if (address >= 0x8000 && address <= 0xffff) {
            switch (address & 0xe001) {
                case 0x8000:
                    this.latch = data & 7;
                    break;
                case 0xa000:
                    this.registers[this.latch] = data;
                    this.updateBanks();
                case 0xe000:
                    this.mirror(clock, (data & 1) == 1 ? 1 : 2);
                    break;
            }
        }
    };
    return Mapper112Cart;
}(BaseCart_1.BaseCart));
exports.Mapper112Cart = Mapper112Cart;


/***/ }),
/* 58 */
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
// 
var BaseCart_1 = __webpack_require__(0);
var Mapper132Cart = /** @class */ (function (_super) {
    __extends(Mapper132Cart, _super);
    function Mapper132Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.registers = [0, 0, 0, 0];
        return _this;
    }
    Mapper132Cart.prototype.initializeCart = function () {
        this.mapperName = 'Mapper 132';
        this.mapsBelow6000 = true;
        this.usesSRAM = false;
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0, 0, this.chrRomCount - 1, 1);
        this.mirror(0, 1);
    };
    Mapper132Cart.prototype.getByte = function (clock, address) {
        var bank = (address >> 12) - 0x6;
        if (address >= 0x4100 && address <= 0x4103) {
            return (this.registers[1] ^ this.registers[2]) | (0x40);
        }
        return this.prgRom[this.prgBankStarts[bank] + (address & 0xfff)];
    };
    Mapper132Cart.prototype.setByte = function (clock, address, data) {
        if (address >= 0x4100 && address <= 0x4103) {
            this.registers[address & 0x3] = data;
        }
        else if (address >= 0x8000 && address <= 0xffff) {
            var prgBank = this.registers[2] << 2;
            this.setupBankStarts(prgBank, prgBank + 1, prgBank + 2, prgBank + 3);
            this.copyBanks(clock, 0, this.registers[2], 1);
        }
    };
    return Mapper132Cart;
}(BaseCart_1.BaseCart));
exports.Mapper132Cart = Mapper132Cart;


/***/ }),
/* 59 */
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
// 
var BaseCart_1 = __webpack_require__(0);
var Mapper133Cart = /** @class */ (function (_super) {
    __extends(Mapper133Cart, _super);
    function Mapper133Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper133Cart.prototype.initializeCart = function () {
        this.mapperName = 'Jovial Race (Sachen)';
        this.usesSRAM = false;
        this.mapsBelow6000 = true;
        this.setupBankStarts((this.prgRomCount << 1) - 4, (this.prgRomCount << 1) - 3, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
        this.copyBanks(0, 0, 0, 1);
        this.mirror(0, 1);
    };
    Mapper133Cart.prototype.setByte = function (clock, address, data) {
        if (address >= 0x4100 && address <= 0x6000) {
            var chrbank = data & 3;
            this.copyBanks(clock, 0, chrbank, 1);
            var prgbank = ((data >> 2) & 1) << 2;
            this.setupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
        }
    };
    return Mapper133Cart;
}(BaseCart_1.BaseCart));
exports.Mapper133Cart = Mapper133Cart;


/***/ }),
/* 60 */
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
var BaseCart_1 = __webpack_require__(0);
var Mapper193Cart = /** @class */ (function (_super) {
    __extends(Mapper193Cart, _super);
    function Mapper193Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper193Cart.prototype.initializeCart = function () {
        this.mapperName = 'NTDEC TC-112';
        this.usesSRAM = false;
        this.setupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0, 0, this.chrRomCount - 1, 1);
        this.mirror(0, 1);
    };
    Mapper193Cart.prototype.setByte = function (clock, address, data) {
        console.log('set: 0x' + address.toString(16) + '( 0x' + data.toString(16) + ')');
        if (address >= 0x6000 && address <= 0x7fff) {
            switch (address & 0x3) {
                case 0x0:
                    this.copyBanks4k(clock, 0, (data >> 2) & 63, 1);
                    break;
                case 0x1:
                    this.copyBanks2k(clock, 2, data >> 1, 1);
                    break;
                case 0x2:
                    this.copyBanks2k(clock, 3, data >> 1, 1);
                    break;
                case 0x3:
                    this.setupBankStarts(data, this.currentA, this.currentC, this.currentE);
                    break;
            }
        }
    };
    return Mapper193Cart;
}(BaseCart_1.BaseCart));
exports.Mapper193Cart = Mapper193Cart;


/***/ }),
/* 61 */
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
// 
var BaseCart_1 = __webpack_require__(0);
var Mapper228Cart = /** @class */ (function (_super) {
    __extends(Mapper228Cart, _super);
    function Mapper228Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper228Cart.prototype.initializeCart = function () {
        this.mapperName = 'Cheetahmen II/Action 52';
        this.usesSRAM = false;
        this.setupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks(0, 0, 0, 1);
        this.mirror(0, 1);
        this.setByte(0, 0x8000, 0);
    };
    Mapper228Cart.prototype.setByte = function (clock, address, data) {
        if (address > 0x8000 && address < 0xffff) {
            var size = (address >> 5) & 1;
            var chr = (data & 0x3) | ((address & 0xf) << 4);
            var mode = (address >> 5) & 1;
            var chip = (address >> 11) & 0x3;
            var mirror = (address >> 13) & 0x1;
            var page = (address >> 6) & 0x1f;
            this.copyBanks(clock, 0, chr, 1);
            if (mode) {
                page = page << 2;
                this.setupBankStarts(page, page + 1, page + 2, page + 3);
            }
            else {
                switch (size) {
                    case 1:
                        page = page << 1;
                        this.setupBankStarts(page, page + 1, page, page + 1);
                    case 0:
                        var page0 = (page & 0xfe) << 1;
                        var page1 = (page & 0xff) << 1;
                        this.setupBankStarts(page0, page0 + 1, page1, page1 + 1);
                        break;
                }
            }
            this.mirror(clock, 2 - mirror);
        }
    };
    return Mapper228Cart;
}(BaseCart_1.BaseCart));
exports.Mapper228Cart = Mapper228Cart;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
Object.defineProperty(exports, "__esModule", { value: true });
var crc = __webpack_require__(66);
exports.decodeFile = function (buffer) {
    var rom = new Uint8Array(buffer, 16);
    var mapperBytes = new Uint8Array(buffer, 6, 3);
    var romCountArray = new Uint8Array(buffer, 4, 2);
    var ramCountArray = new Uint8Array(buffer, 10, 2);
    var prgRomCount = romCountArray[0];
    var prgRomLength = prgRomCount * 0x4000;
    var chrRomCount = romCountArray[1];
    var chrRomLength = chrRomCount * 0x2000;
    var mirroring = (function () {
        if ((mapperBytes[0] & 8) === 8) {
            return 3;
        }
        if ((mapperBytes[0] & 1) === 1) {
            return 1;
        }
        else {
            return 2;
        }
    })();
    var mapperId = (function () {
        var maps = mapperBytes;
        var id = (maps[0] & 240);
        id = id >> 4;
        id = id | (maps[1] & 0xf0);
        id |= (maps[2] & 0xF) << 8;
        return id;
    })();
    return {
        magicNumber: new Uint8Array(buffer, 0, 3),
        // [78, 69, 83]
        romCountArray: romCountArray,
        mapperBytes: mapperBytes,
        ramCountArray: ramCountArray,
        prgRom: new Uint8Array(buffer, 16, prgRomLength),
        chrRom: new Uint8Array(buffer, 16 + prgRomLength, chrRomLength),
        mapperId: mapperId,
        submapperId: mapperBytes[2] >> 4,
        prgRomCount: prgRomCount,
        prgRomLength: prgRomLength,
        chrRomCount: chrRomCount,
        chrRomLength: chrRomLength,
        prgRamBanks: ramCountArray[0] & 0xf,
        prgRamBanksBatteryBacked: (ramCountArray[0] >> 4) & 0xf,
        chrRamBanks: ramCountArray[1] & 0xf,
        chrRamBanksBatteryBacked: (ramCountArray[1] >> 4) & 0xf,
        isPC10: (mapperBytes[1] & 0x2) == 0x02,
        isVS: (mapperBytes[1] & 0x1) == 0x01,
        usesSRAM: (mapperBytes[0] & 2) === 2,
        batterySRAM: (mapperBytes[0] & 2) === 2,
        mirroring: mirroring,
        fourScreen: (mapperBytes[0] & 8) === 8,
        romCRC: crc.crc32(new Buffer(rom)).toString(16).toUpperCase()
    };
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 64 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 65 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  crc1: __webpack_require__(67),
  crc8: __webpack_require__(68),
  crc81wire: __webpack_require__(69),
  crc16: __webpack_require__(70),
  crc16ccitt: __webpack_require__(71),
  crc16modbus: __webpack_require__(72),
  crc16xmodem: __webpack_require__(73),
  crc16kermit: __webpack_require__(74),
  crc24: __webpack_require__(75),
  crc32: __webpack_require__(76),
  crcjam: __webpack_require__(77)
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _define_crc2.default)('crc1', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = ~~previous;
  var accum = 0;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    accum += byte;
  }

  crc += accum % 256;
  return crc % 256;
});

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-8 --generate=c`
var TABLE = [0x00, 0x07, 0x0e, 0x09, 0x1c, 0x1b, 0x12, 0x15, 0x38, 0x3f, 0x36, 0x31, 0x24, 0x23, 0x2a, 0x2d, 0x70, 0x77, 0x7e, 0x79, 0x6c, 0x6b, 0x62, 0x65, 0x48, 0x4f, 0x46, 0x41, 0x54, 0x53, 0x5a, 0x5d, 0xe0, 0xe7, 0xee, 0xe9, 0xfc, 0xfb, 0xf2, 0xf5, 0xd8, 0xdf, 0xd6, 0xd1, 0xc4, 0xc3, 0xca, 0xcd, 0x90, 0x97, 0x9e, 0x99, 0x8c, 0x8b, 0x82, 0x85, 0xa8, 0xaf, 0xa6, 0xa1, 0xb4, 0xb3, 0xba, 0xbd, 0xc7, 0xc0, 0xc9, 0xce, 0xdb, 0xdc, 0xd5, 0xd2, 0xff, 0xf8, 0xf1, 0xf6, 0xe3, 0xe4, 0xed, 0xea, 0xb7, 0xb0, 0xb9, 0xbe, 0xab, 0xac, 0xa5, 0xa2, 0x8f, 0x88, 0x81, 0x86, 0x93, 0x94, 0x9d, 0x9a, 0x27, 0x20, 0x29, 0x2e, 0x3b, 0x3c, 0x35, 0x32, 0x1f, 0x18, 0x11, 0x16, 0x03, 0x04, 0x0d, 0x0a, 0x57, 0x50, 0x59, 0x5e, 0x4b, 0x4c, 0x45, 0x42, 0x6f, 0x68, 0x61, 0x66, 0x73, 0x74, 0x7d, 0x7a, 0x89, 0x8e, 0x87, 0x80, 0x95, 0x92, 0x9b, 0x9c, 0xb1, 0xb6, 0xbf, 0xb8, 0xad, 0xaa, 0xa3, 0xa4, 0xf9, 0xfe, 0xf7, 0xf0, 0xe5, 0xe2, 0xeb, 0xec, 0xc1, 0xc6, 0xcf, 0xc8, 0xdd, 0xda, 0xd3, 0xd4, 0x69, 0x6e, 0x67, 0x60, 0x75, 0x72, 0x7b, 0x7c, 0x51, 0x56, 0x5f, 0x58, 0x4d, 0x4a, 0x43, 0x44, 0x19, 0x1e, 0x17, 0x10, 0x05, 0x02, 0x0b, 0x0c, 0x21, 0x26, 0x2f, 0x28, 0x3d, 0x3a, 0x33, 0x34, 0x4e, 0x49, 0x40, 0x47, 0x52, 0x55, 0x5c, 0x5b, 0x76, 0x71, 0x78, 0x7f, 0x6a, 0x6d, 0x64, 0x63, 0x3e, 0x39, 0x30, 0x37, 0x22, 0x25, 0x2c, 0x2b, 0x06, 0x01, 0x08, 0x0f, 0x1a, 0x1d, 0x14, 0x13, 0xae, 0xa9, 0xa0, 0xa7, 0xb2, 0xb5, 0xbc, 0xbb, 0x96, 0x91, 0x98, 0x9f, 0x8a, 0x8d, 0x84, 0x83, 0xde, 0xd9, 0xd0, 0xd7, 0xc2, 0xc5, 0xcc, 0xcb, 0xe6, 0xe1, 0xe8, 0xef, 0xfa, 0xfd, 0xf4, 0xf3];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-8', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = ~~previous;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = TABLE[(crc ^ byte) & 0xff] & 0xff;
  }

  return crc;
});

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=dallas-1-wire --generate=c`
var TABLE = [0x00, 0x5e, 0xbc, 0xe2, 0x61, 0x3f, 0xdd, 0x83, 0xc2, 0x9c, 0x7e, 0x20, 0xa3, 0xfd, 0x1f, 0x41, 0x9d, 0xc3, 0x21, 0x7f, 0xfc, 0xa2, 0x40, 0x1e, 0x5f, 0x01, 0xe3, 0xbd, 0x3e, 0x60, 0x82, 0xdc, 0x23, 0x7d, 0x9f, 0xc1, 0x42, 0x1c, 0xfe, 0xa0, 0xe1, 0xbf, 0x5d, 0x03, 0x80, 0xde, 0x3c, 0x62, 0xbe, 0xe0, 0x02, 0x5c, 0xdf, 0x81, 0x63, 0x3d, 0x7c, 0x22, 0xc0, 0x9e, 0x1d, 0x43, 0xa1, 0xff, 0x46, 0x18, 0xfa, 0xa4, 0x27, 0x79, 0x9b, 0xc5, 0x84, 0xda, 0x38, 0x66, 0xe5, 0xbb, 0x59, 0x07, 0xdb, 0x85, 0x67, 0x39, 0xba, 0xe4, 0x06, 0x58, 0x19, 0x47, 0xa5, 0xfb, 0x78, 0x26, 0xc4, 0x9a, 0x65, 0x3b, 0xd9, 0x87, 0x04, 0x5a, 0xb8, 0xe6, 0xa7, 0xf9, 0x1b, 0x45, 0xc6, 0x98, 0x7a, 0x24, 0xf8, 0xa6, 0x44, 0x1a, 0x99, 0xc7, 0x25, 0x7b, 0x3a, 0x64, 0x86, 0xd8, 0x5b, 0x05, 0xe7, 0xb9, 0x8c, 0xd2, 0x30, 0x6e, 0xed, 0xb3, 0x51, 0x0f, 0x4e, 0x10, 0xf2, 0xac, 0x2f, 0x71, 0x93, 0xcd, 0x11, 0x4f, 0xad, 0xf3, 0x70, 0x2e, 0xcc, 0x92, 0xd3, 0x8d, 0x6f, 0x31, 0xb2, 0xec, 0x0e, 0x50, 0xaf, 0xf1, 0x13, 0x4d, 0xce, 0x90, 0x72, 0x2c, 0x6d, 0x33, 0xd1, 0x8f, 0x0c, 0x52, 0xb0, 0xee, 0x32, 0x6c, 0x8e, 0xd0, 0x53, 0x0d, 0xef, 0xb1, 0xf0, 0xae, 0x4c, 0x12, 0x91, 0xcf, 0x2d, 0x73, 0xca, 0x94, 0x76, 0x28, 0xab, 0xf5, 0x17, 0x49, 0x08, 0x56, 0xb4, 0xea, 0x69, 0x37, 0xd5, 0x8b, 0x57, 0x09, 0xeb, 0xb5, 0x36, 0x68, 0x8a, 0xd4, 0x95, 0xcb, 0x29, 0x77, 0xf4, 0xaa, 0x48, 0x16, 0xe9, 0xb7, 0x55, 0x0b, 0x88, 0xd6, 0x34, 0x6a, 0x2b, 0x75, 0x97, 0xc9, 0x4a, 0x14, 0xf6, 0xa8, 0x74, 0x2a, 0xc8, 0x96, 0x15, 0x4b, 0xa9, 0xf7, 0xb6, 0xe8, 0x0a, 0x54, 0xd7, 0x89, 0x6b, 0x35];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('dallas-1-wire', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = ~~previous;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = TABLE[(crc ^ byte) & 0xff] & 0xff;
  }

  return crc;
});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-16 --generate=c`
var TABLE = [0x0000, 0xc0c1, 0xc181, 0x0140, 0xc301, 0x03c0, 0x0280, 0xc241, 0xc601, 0x06c0, 0x0780, 0xc741, 0x0500, 0xc5c1, 0xc481, 0x0440, 0xcc01, 0x0cc0, 0x0d80, 0xcd41, 0x0f00, 0xcfc1, 0xce81, 0x0e40, 0x0a00, 0xcac1, 0xcb81, 0x0b40, 0xc901, 0x09c0, 0x0880, 0xc841, 0xd801, 0x18c0, 0x1980, 0xd941, 0x1b00, 0xdbc1, 0xda81, 0x1a40, 0x1e00, 0xdec1, 0xdf81, 0x1f40, 0xdd01, 0x1dc0, 0x1c80, 0xdc41, 0x1400, 0xd4c1, 0xd581, 0x1540, 0xd701, 0x17c0, 0x1680, 0xd641, 0xd201, 0x12c0, 0x1380, 0xd341, 0x1100, 0xd1c1, 0xd081, 0x1040, 0xf001, 0x30c0, 0x3180, 0xf141, 0x3300, 0xf3c1, 0xf281, 0x3240, 0x3600, 0xf6c1, 0xf781, 0x3740, 0xf501, 0x35c0, 0x3480, 0xf441, 0x3c00, 0xfcc1, 0xfd81, 0x3d40, 0xff01, 0x3fc0, 0x3e80, 0xfe41, 0xfa01, 0x3ac0, 0x3b80, 0xfb41, 0x3900, 0xf9c1, 0xf881, 0x3840, 0x2800, 0xe8c1, 0xe981, 0x2940, 0xeb01, 0x2bc0, 0x2a80, 0xea41, 0xee01, 0x2ec0, 0x2f80, 0xef41, 0x2d00, 0xedc1, 0xec81, 0x2c40, 0xe401, 0x24c0, 0x2580, 0xe541, 0x2700, 0xe7c1, 0xe681, 0x2640, 0x2200, 0xe2c1, 0xe381, 0x2340, 0xe101, 0x21c0, 0x2080, 0xe041, 0xa001, 0x60c0, 0x6180, 0xa141, 0x6300, 0xa3c1, 0xa281, 0x6240, 0x6600, 0xa6c1, 0xa781, 0x6740, 0xa501, 0x65c0, 0x6480, 0xa441, 0x6c00, 0xacc1, 0xad81, 0x6d40, 0xaf01, 0x6fc0, 0x6e80, 0xae41, 0xaa01, 0x6ac0, 0x6b80, 0xab41, 0x6900, 0xa9c1, 0xa881, 0x6840, 0x7800, 0xb8c1, 0xb981, 0x7940, 0xbb01, 0x7bc0, 0x7a80, 0xba41, 0xbe01, 0x7ec0, 0x7f80, 0xbf41, 0x7d00, 0xbdc1, 0xbc81, 0x7c40, 0xb401, 0x74c0, 0x7580, 0xb541, 0x7700, 0xb7c1, 0xb681, 0x7640, 0x7200, 0xb2c1, 0xb381, 0x7340, 0xb101, 0x71c0, 0x7080, 0xb041, 0x5000, 0x90c1, 0x9181, 0x5140, 0x9301, 0x53c0, 0x5280, 0x9241, 0x9601, 0x56c0, 0x5780, 0x9741, 0x5500, 0x95c1, 0x9481, 0x5440, 0x9c01, 0x5cc0, 0x5d80, 0x9d41, 0x5f00, 0x9fc1, 0x9e81, 0x5e40, 0x5a00, 0x9ac1, 0x9b81, 0x5b40, 0x9901, 0x59c0, 0x5880, 0x9841, 0x8801, 0x48c0, 0x4980, 0x8941, 0x4b00, 0x8bc1, 0x8a81, 0x4a40, 0x4e00, 0x8ec1, 0x8f81, 0x4f40, 0x8d01, 0x4dc0, 0x4c80, 0x8c41, 0x4400, 0x84c1, 0x8581, 0x4540, 0x8701, 0x47c0, 0x4680, 0x8641, 0x8201, 0x42c0, 0x4380, 0x8341, 0x4100, 0x81c1, 0x8081, 0x4040];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-16', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = ~~previous;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc ^ byte) & 0xff] ^ crc >> 8) & 0xffff;
  }

  return crc;
});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=ccitt --generate=c`
var TABLE = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('ccitt', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = typeof previous !== 'undefined' ? ~~previous : 0xffff;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc >> 8 ^ byte) & 0xff] ^ crc << 8) & 0xffff;
  }

  return crc;
});

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-16-modbus --generate=c`
var TABLE = [0x0000, 0xc0c1, 0xc181, 0x0140, 0xc301, 0x03c0, 0x0280, 0xc241, 0xc601, 0x06c0, 0x0780, 0xc741, 0x0500, 0xc5c1, 0xc481, 0x0440, 0xcc01, 0x0cc0, 0x0d80, 0xcd41, 0x0f00, 0xcfc1, 0xce81, 0x0e40, 0x0a00, 0xcac1, 0xcb81, 0x0b40, 0xc901, 0x09c0, 0x0880, 0xc841, 0xd801, 0x18c0, 0x1980, 0xd941, 0x1b00, 0xdbc1, 0xda81, 0x1a40, 0x1e00, 0xdec1, 0xdf81, 0x1f40, 0xdd01, 0x1dc0, 0x1c80, 0xdc41, 0x1400, 0xd4c1, 0xd581, 0x1540, 0xd701, 0x17c0, 0x1680, 0xd641, 0xd201, 0x12c0, 0x1380, 0xd341, 0x1100, 0xd1c1, 0xd081, 0x1040, 0xf001, 0x30c0, 0x3180, 0xf141, 0x3300, 0xf3c1, 0xf281, 0x3240, 0x3600, 0xf6c1, 0xf781, 0x3740, 0xf501, 0x35c0, 0x3480, 0xf441, 0x3c00, 0xfcc1, 0xfd81, 0x3d40, 0xff01, 0x3fc0, 0x3e80, 0xfe41, 0xfa01, 0x3ac0, 0x3b80, 0xfb41, 0x3900, 0xf9c1, 0xf881, 0x3840, 0x2800, 0xe8c1, 0xe981, 0x2940, 0xeb01, 0x2bc0, 0x2a80, 0xea41, 0xee01, 0x2ec0, 0x2f80, 0xef41, 0x2d00, 0xedc1, 0xec81, 0x2c40, 0xe401, 0x24c0, 0x2580, 0xe541, 0x2700, 0xe7c1, 0xe681, 0x2640, 0x2200, 0xe2c1, 0xe381, 0x2340, 0xe101, 0x21c0, 0x2080, 0xe041, 0xa001, 0x60c0, 0x6180, 0xa141, 0x6300, 0xa3c1, 0xa281, 0x6240, 0x6600, 0xa6c1, 0xa781, 0x6740, 0xa501, 0x65c0, 0x6480, 0xa441, 0x6c00, 0xacc1, 0xad81, 0x6d40, 0xaf01, 0x6fc0, 0x6e80, 0xae41, 0xaa01, 0x6ac0, 0x6b80, 0xab41, 0x6900, 0xa9c1, 0xa881, 0x6840, 0x7800, 0xb8c1, 0xb981, 0x7940, 0xbb01, 0x7bc0, 0x7a80, 0xba41, 0xbe01, 0x7ec0, 0x7f80, 0xbf41, 0x7d00, 0xbdc1, 0xbc81, 0x7c40, 0xb401, 0x74c0, 0x7580, 0xb541, 0x7700, 0xb7c1, 0xb681, 0x7640, 0x7200, 0xb2c1, 0xb381, 0x7340, 0xb101, 0x71c0, 0x7080, 0xb041, 0x5000, 0x90c1, 0x9181, 0x5140, 0x9301, 0x53c0, 0x5280, 0x9241, 0x9601, 0x56c0, 0x5780, 0x9741, 0x5500, 0x95c1, 0x9481, 0x5440, 0x9c01, 0x5cc0, 0x5d80, 0x9d41, 0x5f00, 0x9fc1, 0x9e81, 0x5e40, 0x5a00, 0x9ac1, 0x9b81, 0x5b40, 0x9901, 0x59c0, 0x5880, 0x9841, 0x8801, 0x48c0, 0x4980, 0x8941, 0x4b00, 0x8bc1, 0x8a81, 0x4a40, 0x4e00, 0x8ec1, 0x8f81, 0x4f40, 0x8d01, 0x4dc0, 0x4c80, 0x8c41, 0x4400, 0x84c1, 0x8581, 0x4540, 0x8701, 0x47c0, 0x4680, 0x8641, 0x8201, 0x42c0, 0x4380, 0x8341, 0x4100, 0x81c1, 0x8081, 0x4040];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-16-modbus', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = typeof previous !== 'undefined' ? ~~previous : 0xffff;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc ^ byte) & 0xff] ^ crc >> 8) & 0xffff;
  }

  return crc;
});

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _define_crc2.default)('xmodem', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = typeof previous !== 'undefined' ? ~~previous : 0x0;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    var code = crc >>> 8 & 0xFF;

    code ^= byte & 0xFF;
    code ^= code >>> 4;
    crc = crc << 8 & 0xFFFF;
    crc ^= code;
    code = code << 5 & 0xFFFF;
    crc ^= code;
    code = code << 7 & 0xFFFF;
    crc ^= code;
  }

  return crc;
});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=kermit --generate=c`
var TABLE = [0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf, 0x8c48, 0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7, 0x1081, 0x0108, 0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e, 0x9cc9, 0x8d40, 0xbfdb, 0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876, 0x2102, 0x308b, 0x0210, 0x1399, 0x6726, 0x76af, 0x4434, 0x55bd, 0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e, 0xfae7, 0xc87c, 0xd9f5, 0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e, 0x54b5, 0x453c, 0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd, 0xc974, 0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb, 0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3, 0x5285, 0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a, 0xdecd, 0xcf44, 0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72, 0x6306, 0x728f, 0x4014, 0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9, 0xef4e, 0xfec7, 0xcc5c, 0xddd5, 0xa96a, 0xb8e3, 0x8a78, 0x9bf1, 0x7387, 0x620e, 0x5095, 0x411c, 0x35a3, 0x242a, 0x16b1, 0x0738, 0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862, 0x9af9, 0x8b70, 0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e, 0xf0b7, 0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff, 0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036, 0x18c1, 0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e, 0xa50a, 0xb483, 0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5, 0x2942, 0x38cb, 0x0a50, 0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd, 0xb58b, 0xa402, 0x9699, 0x8710, 0xf3af, 0xe226, 0xd0bd, 0xc134, 0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7, 0x6e6e, 0x5cf5, 0x4d7c, 0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1, 0xa33a, 0xb2b3, 0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72, 0x3efb, 0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232, 0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a, 0xe70e, 0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1, 0x6b46, 0x7acf, 0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9, 0xf78f, 0xe606, 0xd49d, 0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330, 0x7bc7, 0x6a4e, 0x58d5, 0x495c, 0x3de3, 0x2c6a, 0x1ef1, 0x0f78];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('kermit', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = typeof previous !== 'undefined' ? ~~previous : 0x0000;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc ^ byte) & 0xff] ^ crc >> 8) & 0xffff;
  }

  return crc;
});

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-drive --model=crc-24 --generate=c`
var TABLE = [0x000000, 0x864cfb, 0x8ad50d, 0x0c99f6, 0x93e6e1, 0x15aa1a, 0x1933ec, 0x9f7f17, 0xa18139, 0x27cdc2, 0x2b5434, 0xad18cf, 0x3267d8, 0xb42b23, 0xb8b2d5, 0x3efe2e, 0xc54e89, 0x430272, 0x4f9b84, 0xc9d77f, 0x56a868, 0xd0e493, 0xdc7d65, 0x5a319e, 0x64cfb0, 0xe2834b, 0xee1abd, 0x685646, 0xf72951, 0x7165aa, 0x7dfc5c, 0xfbb0a7, 0x0cd1e9, 0x8a9d12, 0x8604e4, 0x00481f, 0x9f3708, 0x197bf3, 0x15e205, 0x93aefe, 0xad50d0, 0x2b1c2b, 0x2785dd, 0xa1c926, 0x3eb631, 0xb8faca, 0xb4633c, 0x322fc7, 0xc99f60, 0x4fd39b, 0x434a6d, 0xc50696, 0x5a7981, 0xdc357a, 0xd0ac8c, 0x56e077, 0x681e59, 0xee52a2, 0xe2cb54, 0x6487af, 0xfbf8b8, 0x7db443, 0x712db5, 0xf7614e, 0x19a3d2, 0x9fef29, 0x9376df, 0x153a24, 0x8a4533, 0x0c09c8, 0x00903e, 0x86dcc5, 0xb822eb, 0x3e6e10, 0x32f7e6, 0xb4bb1d, 0x2bc40a, 0xad88f1, 0xa11107, 0x275dfc, 0xdced5b, 0x5aa1a0, 0x563856, 0xd074ad, 0x4f0bba, 0xc94741, 0xc5deb7, 0x43924c, 0x7d6c62, 0xfb2099, 0xf7b96f, 0x71f594, 0xee8a83, 0x68c678, 0x645f8e, 0xe21375, 0x15723b, 0x933ec0, 0x9fa736, 0x19ebcd, 0x8694da, 0x00d821, 0x0c41d7, 0x8a0d2c, 0xb4f302, 0x32bff9, 0x3e260f, 0xb86af4, 0x2715e3, 0xa15918, 0xadc0ee, 0x2b8c15, 0xd03cb2, 0x567049, 0x5ae9bf, 0xdca544, 0x43da53, 0xc596a8, 0xc90f5e, 0x4f43a5, 0x71bd8b, 0xf7f170, 0xfb6886, 0x7d247d, 0xe25b6a, 0x641791, 0x688e67, 0xeec29c, 0x3347a4, 0xb50b5f, 0xb992a9, 0x3fde52, 0xa0a145, 0x26edbe, 0x2a7448, 0xac38b3, 0x92c69d, 0x148a66, 0x181390, 0x9e5f6b, 0x01207c, 0x876c87, 0x8bf571, 0x0db98a, 0xf6092d, 0x7045d6, 0x7cdc20, 0xfa90db, 0x65efcc, 0xe3a337, 0xef3ac1, 0x69763a, 0x578814, 0xd1c4ef, 0xdd5d19, 0x5b11e2, 0xc46ef5, 0x42220e, 0x4ebbf8, 0xc8f703, 0x3f964d, 0xb9dab6, 0xb54340, 0x330fbb, 0xac70ac, 0x2a3c57, 0x26a5a1, 0xa0e95a, 0x9e1774, 0x185b8f, 0x14c279, 0x928e82, 0x0df195, 0x8bbd6e, 0x872498, 0x016863, 0xfad8c4, 0x7c943f, 0x700dc9, 0xf64132, 0x693e25, 0xef72de, 0xe3eb28, 0x65a7d3, 0x5b59fd, 0xdd1506, 0xd18cf0, 0x57c00b, 0xc8bf1c, 0x4ef3e7, 0x426a11, 0xc426ea, 0x2ae476, 0xaca88d, 0xa0317b, 0x267d80, 0xb90297, 0x3f4e6c, 0x33d79a, 0xb59b61, 0x8b654f, 0x0d29b4, 0x01b042, 0x87fcb9, 0x1883ae, 0x9ecf55, 0x9256a3, 0x141a58, 0xefaaff, 0x69e604, 0x657ff2, 0xe33309, 0x7c4c1e, 0xfa00e5, 0xf69913, 0x70d5e8, 0x4e2bc6, 0xc8673d, 0xc4fecb, 0x42b230, 0xddcd27, 0x5b81dc, 0x57182a, 0xd154d1, 0x26359f, 0xa07964, 0xace092, 0x2aac69, 0xb5d37e, 0x339f85, 0x3f0673, 0xb94a88, 0x87b4a6, 0x01f85d, 0x0d61ab, 0x8b2d50, 0x145247, 0x921ebc, 0x9e874a, 0x18cbb1, 0xe37b16, 0x6537ed, 0x69ae1b, 0xefe2e0, 0x709df7, 0xf6d10c, 0xfa48fa, 0x7c0401, 0x42fa2f, 0xc4b6d4, 0xc82f22, 0x4e63d9, 0xd11cce, 0x575035, 0x5bc9c3, 0xdd8538];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-24', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = typeof previous !== 'undefined' ? ~~previous : 0xb704ce;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = (TABLE[(crc >> 16 ^ byte) & 0xff] ^ crc << 8) & 0xffffff;
  }

  return crc;
});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=crc-32 --generate=c`
var TABLE = [0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f, 0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9, 0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('crc-32', function (buf, previous) {
  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = previous === 0 ? 0 : ~~previous ^ -1;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = TABLE[(crc ^ byte) & 0xff] ^ crc >>> 8;
  }

  return crc ^ -1;
});

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(1);

var _create_buffer = __webpack_require__(2);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(3);

var _define_crc2 = _interopRequireDefault(_define_crc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generated by `./pycrc.py --algorithm=table-driven --model=jam --generate=c`
var TABLE = [0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f, 0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9, 0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d];

if (typeof Int32Array !== 'undefined') TABLE = new Int32Array(TABLE);

module.exports = (0, _define_crc2.default)('jam', function (buf) {
  var previous = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

  if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _create_buffer2.default)(buf);

  var crc = previous === 0 ? 0 : ~~previous;

  for (var index = 0; index < buf.length; index++) {
    var byte = buf[index];
    crc = TABLE[(crc ^ byte) & 0xff] ^ crc >>> 8;
  }

  return crc;
});

/***/ })
/******/ ]);
});