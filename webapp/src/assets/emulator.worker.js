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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(14)
var ieee754 = __webpack_require__(15)
var isArray = __webpack_require__(16)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 1 */
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
    function BaseCart() {
        var _this = this;
        this.fourScreen = false;
        this.mapperName = 'base';
        this.supported = true;
        this.submapperId = 0;
        this.mapsBelow6000 = false;
        // shared components
        this.nextEventAt = 0;
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
        this.ROMHashFunction = null;
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
    BaseCart.prototype.handleNextEvent = function (clock) { };
    ;
    BaseCart.prototype.advanceClock = function (clock) { };
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
            chrRomData = new Uint8Array(32768); //System.Array.init(32768, 0, System.Byte);
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
        // by default  have to call Mirror() at least once to set up the bank offsets
        //        this.Mirror(0, (this.romControlBytes[0] & 1) + 1);
        this.Mirror(0, 0);
        if ((this.romControlBytes[0] & 1) === 1) {
            this.Mirror(0, 1);
        }
        else {
            this.Mirror(0, 2);
        }
        this.fourScreen = (this.romControlBytes[0] & 8) === 8;
        if ((this.romControlBytes[0] & 8) === 8) {
            this.Mirror(0, 3);
        }
        this.checkSum = ""; //ROMHashFunction(nesCart, chrRom);
        this.InitializeCart();
    };
    BaseCart.prototype.GetByte = function (clock, address) {
        var bank = 0;
        switch (address & 0xE000) {
            case 0x6000:
                return this.prgRomBank6[address & 0x1FFF];
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
        }
        return this.nesCart[bank + (address & 0x1FFF)];
    };
    BaseCart.prototype.SetByte = function (clock, address, data) {
        // throw new Error('Method not implemented.');
    };
    BaseCart.prototype.GetPPUByte = function (clock, address) {
        var bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        //while (newAddress > chrRamStart)
        //{
        //    newAddress -= chrRamStart;
        //}
        return this.chrRom[newAddress];
    };
    BaseCart.prototype.SetPPUByte = function (clock, address, data) {
        var bank = address >> 10; //, 1024)) | 0;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
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
        // this.bankStartCache.fill(0);
        // for (let i = 0; i < 16; ++i) {
        //     this.bankStartCache[i] = this.ppuBankStarts[i];
        // }
        //Mirror(-1, this.mirroring);
        //chrRamStart = ppuBankStarts[8];
        //Array.Copy(ppuBankStarts, 0, bankStartCache[0], 0, 16 * 4);
        //bankSwitchesChanged = false;
    };
    BaseCart.prototype.UpdateBankStartCache = function () {
        this.CurrentBank = 0; // (this.CurrentBank + 1) | 0;
        // for (let i = 0; i < 16; ++i) {
        //     this.bankStartCache[(this.CurrentBank * 16) + i] = this.ppuBankStarts[i];
        // }
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
    // utility functions used by mappers
    // CopyBanksXX sets up chrRom bankswitching
    BaseCart.prototype.CopyBanks = function (clock, dest, src, numberOf8kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf8kBanks << 3); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    BaseCart.prototype.CopyBanks4k = function (clock, dest, src, numberOf4kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    BaseCart.prototype.CopyBanks2k = function (clock, dest, src, numberOf2kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src << 1;
        var oneKdest = dest << 1;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    BaseCart.prototype.CopyBanks1k = function (clock, dest, src, numberOf1kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src;
        var oneKdest = dest;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < numberOf1kBanks; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
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
var BaseCart4k = /** @class */ (function () {
    //ChrRamStart: number;
    function BaseCart4k() {
        var _this = this;
        this.mapperName = 'base';
        this.supported = true;
        this.submapperId = 0;
        this.mapsBelow6000 = false;
        this.nextEventAt = 0;
        // compatible with .net array.copy method
        // shared components
        this.prgRomBank6 = new Uint8Array(new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));
        this.ppuBankStarts = new Uint32Array(new SharedArrayBuffer(16 * Uint32Array.BYTES_PER_ELEMENT));
        this.bankStartCache = new Uint32Array(new SharedArrayBuffer(4096 * Uint32Array.BYTES_PER_ELEMENT));
        this.iNesHeader = new Uint8Array(16);
        this.romControlBytes = new Uint8Array(2);
        this.nesCart = null;
        this.chrRom = null;
        this.current8 = -1;
        this.current9 = -1;
        this.currentA = -1;
        this.currentB = -1;
        this.currentC = -1;
        this.currentD = -1;
        this.currentE = -1;
        this.currentF = -1;
        this.SRAMCanWrite = false;
        this.SRAMEnabled = false;
        this.SRAMCanSave = false;
        this.prgRomCount = 0;
        this.chrRomOffset = 0;
        this.chrRamStart = 0;
        this.chrRomCount = 0;
        this.mapperId = 0;
        this.bank8start = 0;
        this.bank9start = 0;
        this.bankAstart = 0;
        this.bankBstart = 0;
        this.bankCstart = 0;
        this.bankDstart = 0;
        this.bankEstart = 0;
        this.bankFstart = 0;
        this.ROMHashFunction = null;
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
    BaseCart4k.prototype.handleNextEvent = function (clock) { };
    ;
    BaseCart4k.prototype.advanceClock = function (clock) { };
    Object.defineProperty(BaseCart4k.prototype, "NumberOfPrgRoms", {
        // external api
        get: function () {
            return this.prgRomCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCart4k.prototype, "NumberOfChrRoms", {
        get: function () {
            return this.chrRomCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCart4k.prototype, "MapperID", {
        get: function () {
            return this.mapperId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCart4k.prototype, "MapperName", {
        get: function () {
            return this.mapperName;
        },
        enumerable: true,
        configurable: true
    });
    BaseCart4k.prototype.ClearDebugEvents = function () {
        //this.DebugEvents.clear();
    };
    BaseCart4k.prototype.LoadiNESCart = function (header, prgRoms, chrRoms, prgRomData, chrRomData, chrRomOffset) {
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
            chrRomData = new Uint8Array(32768); //System.Array.init(32768, 0, System.Byte);
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
        // by default  have to call Mirror() at least once to set up the bank offsets
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
    BaseCart4k.prototype.GetByte = function (clock, address) {
        var bank = 0;
        switch (address & 0xF000) {
            case 0x6000:
            case 0x7000:
                return this.prgRomBank6[address & 0x1FFF];
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0x9000:
                bank = this.bank9start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xB000:
                bank = this.bankBstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xD000:
                bank = this.bankDstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
            case 0xF000:
                bank = this.bankFstart;
                break;
        }
        return this.nesCart[bank + (address & 0xFFF)];
    };
    BaseCart4k.prototype.SetByte = function (clock, address, data) {
        // throw new Error('Method not implemented.');
    };
    BaseCart4k.prototype.GetPPUByte = function (clock, address) {
        var bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        return this.chrRom[newAddress];
    };
    BaseCart4k.prototype.SetPPUByte = function (clock, address, data) {
        var bank = address >> 10; //, 1024)) | 0;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        this.chrRom[newAddress] = data;
    };
    BaseCart4k.prototype.SetupBankStarts = function (reg8, reg9, regA, regB, regC, regD, regE, regF) {
        this.current8 = reg8 = this.maskBankAddress(reg8);
        this.current9 = reg9 = this.maskBankAddress(reg9);
        this.currentA = regA = this.maskBankAddress(regA);
        this.currentB = regB = this.maskBankAddress(regB);
        this.currentC = regC = this.maskBankAddress(regC);
        this.currentD = regD = this.maskBankAddress(regD);
        this.currentE = regE = this.maskBankAddress(regE);
        this.currentF = regF = this.maskBankAddress(regF);
        this.bank8start = reg8 * 4096;
        this.bank9start = reg9 * 4096;
        this.bankAstart = regA * 4096;
        this.bankBstart = regB * 4096;
        this.bankCstart = regC * 4096;
        this.bankDstart = regD * 4096;
        this.bankEstart = regE * 4096;
        this.bankFstart = regF * 4096;
    };
    BaseCart4k.prototype.maskBankAddress = function (bank) {
        if (bank >= this.prgRomCount * 4) {
            var i = 0xFFFF;
            while ((bank & i) >= this.prgRomCount * 4) {
                i = i >> 1;
            }
            return (bank & i);
        }
        else {
            return bank;
        }
    };
    BaseCart4k.prototype.WriteState = function (state) {
        // throw new Error('Method not implemented.');
    };
    BaseCart4k.prototype.ReadState = function (state) {
        // throw new Error('Method not implemented.');
    };
    BaseCart4k.prototype.HandleEvent = function (Clock) {
        //  throw new Error('Method not implemented.');
    };
    BaseCart4k.prototype.ResetClock = function (Clock) {
        // throw new Error('Method not implemented.');
    };
    BaseCart4k.prototype.ResetBankStartCache = function () {
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
    BaseCart4k.prototype.UpdateBankStartCache = function () {
        this.CurrentBank = 0; // (this.CurrentBank + 1) | 0;
        for (var i = 0; i < 16; ++i) {
            this.bankStartCache[(this.CurrentBank * 16) + i] = this.ppuBankStarts[i];
        }
        //System.Array.copy(this.ppuBankStarts, 0, this.bankStartCache, this.CurrentBank * 16, 16);
        this.Whizzler.UpdatePixelInfo();
        return this.CurrentBank;
    };
    BaseCart4k.prototype.ActualChrRomOffset = function (address) {
        var bank = address >> 10 | 0;
        //int newAddress = ppuBankStarts[bank] + (address & 0x3FF);
        var newAddress = (this.bankStartCache[(this.CurrentBank * 16) + bank] + (address & 1023));
        return newAddress;
    };
    BaseCart4k.prototype.Mirror = function (clockNum, mirroring) {
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
    // utility functions used by mappers
    // CopyBanksXX sets up chrRom bankswitching
    BaseCart4k.prototype.CopyBanks = function (clock, dest, src, numberOf8kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf8kBanks << 3); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    BaseCart4k.prototype.CopyBanks4k = function (clock, dest, src, numberOf4kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    BaseCart4k.prototype.CopyBanks2k = function (clock, dest, src, numberOf2kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src << 1;
        var oneKdest = dest << 1;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    BaseCart4k.prototype.CopyBanks1k = function (clock, dest, src, numberOf1kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src;
        var oneKdest = dest;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < numberOf1kBanks; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    BaseCart4k.prototype.InitializeCart = function () {
        //throw new Error('Method not implemented.');
    };
    BaseCart4k.prototype.UpdateScanlineCounter = function () {
        //throw new Error('Method not implemented.');
    };
    return BaseCart4k;
}());
exports.BaseCart4k = BaseCart4k;
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buffer = __webpack_require__(0);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// shared buffer to get sound out
var WavSharer = /** @class */ (function () {
    function WavSharer() {
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
        while (this.audioBytesWritten >= this.chunkSize) {
            Atomics.store(this.controlBuffer, this.WAVSHARER_BUFFERPOS, this.sharedAudioBufferPos);
            Atomics.wait(this.controlBuffer, this.NES_BYTES_WRITTEN, this.audioBytesWritten);
            //this.sharedAudioBufferPos = <any>Atomics.load(this.controlBuffer, this.WAVSHARER_BUFFERPOS);
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
exports.blip_buffer_t = blip_buffer_t;
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(4);
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
    ChiChiPPU.prototype.Tick = function () {
        this.DrawTo(this.LastcpuClock + 1);
    };
    ChiChiPPU.prototype.UpdatePixelInfo = function () {
        this.nameTableMemoryStart = this.nameTableBits * 0x400;
    };
    ChiChiPPU.pal = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return ChiChiPPU;
}());
exports.ChiChiPPU = ChiChiPPU;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiCarts_1 = __webpack_require__(8);
var ChiChiAudio_1 = __webpack_require__(9);
var ChiChiTypes_1 = __webpack_require__(4);
var ChiChiControl_1 = __webpack_require__(10);
var ChiChiPPU_1 = __webpack_require__(6);
var CommonAudio_1 = __webpack_require__(5);
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
            //this.ppu.Initialize();
            //this.Cart.InitializeCart();
            this.Cpu.ResetCPU();
            this.SoundBopper.RebuildSound();
            //ClearGenieCodes();
            //this.Cpu.PowerOn();
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
            //this.Cpu.ResetCPU();
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
            this.Cpu.cheating = false;
            this.Cpu.genieCodes = new Array();
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
        this.ppu.DrawTo(this._clock);
        this.Cart.advanceClock(value);
        this._clock += value;
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
        //this.FindNextEvent();
        if (this._handleNMI) {
            this.advanceClock(7);
            this._handleNMI = false;
            this.NonMaskableInterrupt();
        }
        else if (this._handleIRQ) {
            this.advanceClock(7);
            this._handleIRQ = false;
            this.InterruptRequest();
        }
        //FetchNextInstruction();
        this._currentInstruction_Address = this._programCounter;
        this._currentInstruction_OpCode = this.GetByte((this._programCounter++) & 0xFFFF);
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];
        this.fetchInstructionParameters();
        this.execute();
        //("{0:x} {1:x} {2:x}", _currentInstruction_OpCode, _currentInstruction_AddressingMode, _currentInstruction_Address);
        if (this._debugging) {
            this.WriteInstructionHistoryAndUsage();
            this._operationCounter++;
        }
        this.advanceClock(ChiChiCPPU.cpuTiming[this._currentInstruction_OpCode]);
        this.advanceClock(this._currentInstruction_ExtraTiming);
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
        this._ticks = 4;
        this.genieCodes = [];
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
            this._programCounter &= 0xFFFF;
        }
        else {
            this._programCounter += addr;
            this._programCounter &= 0xFFFF;
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
        switch (address & 0xF000) {
            case 0:
            case 0x1000:
                if (address < 2048) {
                    result = this.Rams[address];
                }
                else {
                    result = address >> 8;
                }
                break;
            case 0x2000:
            case 0x3000:
                result = this.ppu.GetByte(this.clock, address);
                break;
            case 0x4000:
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
                        if (this.Cart.mapsBelow6000)
                            result = this.Cart.GetByte(this.clock, address);
                        else
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
                    default:
                        if (this.Cart.mapsBelow6000)
                            this.Cart.SetByte(this.clock, address, data);
                }
                break;
        }
    };
    ChiChiCPPU.prototype.FindNextEvent = function () {
        // it'll either be the ppu's NMI, or an irq from either the apu or the cart
        this.nextEvent = this.clock + this.ppu.NextEventAt; //| this.Cart.nextEventAt;
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCart_1 = __webpack_require__(1);
var Discrete = __webpack_require__(17);
var Multi = __webpack_require__(18);
var MMC1 = __webpack_require__(19);
var MMC2 = __webpack_require__(20);
var MMC3 = __webpack_require__(21);
var M068 = __webpack_require__(22);
var Nsf = __webpack_require__(23);
var Smb2j = __webpack_require__(24);
var crc = __webpack_require__(25);
var VS = __webpack_require__(37);
var VRC = __webpack_require__(38);
var VRC2 = __webpack_require__(39);
var MapperFactory = /** @class */ (function () {
    function MapperFactory() {
        this[0] = Discrete.NesCart;
        this[1] = MMC1.MMC1Cart;
        this[2] = Discrete.UxROMCart;
        this[3] = Discrete.CNROMCart;
        this[4] = MMC3.MMC3Cart;
        this[7] = Discrete.AxROMCart;
        this[9] = MMC2.MMC2Cart;
        this[10] = MMC2.MMC4Cart;
        this[11] = Discrete.ColorDreams;
        this[13] = Discrete.Mapper013Cart;
        this[23] = VRC2.KonamiVRC2Cart;
        this[30] = Discrete.Mapper030Cart;
        this[31] = Nsf.Mapper031Cart;
        this[34] = Discrete.BNROMCart;
        this[38] = Discrete.BitCorp038Cart;
        this[40] = Smb2j.Smb2jCart;
        this[51] = Multi.Mapper051Cart;
        this[58] = Multi.Mapper058Cart;
        this[66] = Discrete.MHROMCart;
        this[68] = M068.Mapper068Cart;
        this[70] = Discrete.Mapper070Cart;
        this[71] = Discrete.Mapper071Cart;
        this[75] = VRC.KonamiVRC1Cart;
        this[77] = Discrete.Mapper077Cart;
        this[81] = Discrete.Mapper081Cart;
        this[87] = Discrete.Mapper087Cart;
        //89 = Discrete.Mapper089Cart;
        this[93] = Discrete.Mapper093Cart;
        this[97] = Discrete.Irem097Cart;
        this[99] = VS.VSCart;
        this[140] = Discrete.JF1xCart;
        this[145] = Discrete.Mapper145Cart;
        this[152] = Discrete.Mapper152Cart;
        this[151] = VRC.KonamiVRC1Cart;
        this[180] = Discrete.NesCart;
        //184 = Discrete.Mapper184Cart;
        this[190] = Discrete.Mapper190Cart;
        this[202] = Multi.Mapper202Cart;
        this[212] = Multi.Mapper212Cart;
    }
    MapperFactory.prototype.createCart = function (mapper) {
        if (this[mapper]) {
            return new this[mapper]();
        }
        else {
            return new BaseCart_1.UnsupportedCart();
        }
    };
    return MapperFactory;
}());
var iNESFileHandler = /** @class */ (function () {
    function iNESFileHandler() {
    }
    iNESFileHandler.LoadROM = function (cpu, thefile) {
        var _cart = null;
        var mf = new MapperFactory();
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
        mapperId = mapperId | (iNesHeader[7] & 0xF0);
        // byte 7  lower bits PC10/VSUNI, xxPV 
        var isPC10 = (iNesHeader[7] & 0x2) == 0x2;
        var isVS = (iNesHeader[7] & 0x1) == 0x01;
        // NES2.0 stuff 
        mapperId |= (iNesHeader[8] & 0xF) << 8;
        var submapperId = iNesHeader[8] >> 4;
        // Byte 9 (Upper bits of ROM size)
        var upperPrgRomSize = iNesHeader[9] & 0xF;
        console.log('upperprgrom ' + upperPrgRomSize);
        var upperChrRomSize = (iNesHeader[9] & 0xF0) >> 4;
        console.log('upperChrRom ' + upperChrRomSize);
        // byte 10 (RAM Size) 
        var prgRamBanks = iNesHeader[10] & 0xF;
        var prgRamBanks_batteryBacked = (iNesHeader[10] >> 4) & 0xF;
        // byte 11 (video RAM size) 
        var chrRamBanks = iNesHeader[11] & 0xF;
        var chrRamBanks_batteryBacked = (iNesHeader[11] >> 4) & 0xF;
        // byte 12 (video RAM size) 
        var prgRomCount = iNesHeader[4]; // | (upperPrgRomSize << 8);
        var chrRomCount = iNesHeader[5]; // | (upperChrRomSize << 8);
        var prgRomLength = prgRomCount * 16384;
        var chrRomLength = chrRomCount * 8192;
        var theRom = new Uint8Array(prgRomLength);
        // System.Array.init(Bridge.Int.mul(prgRomCount, 16384), 0, System.Byte);
        theRom.fill(0);
        var chrRom = new Uint8Array(chrRomLength);
        chrRom.fill(0);
        // var chrRom = new Uint8Array(thefile.slice(16 + prgRomLength, 16 + prgRomLength + chrRomLength)); //System.Array.init(Bridge.Int.mul(chrRomCount, 16384), 0, System.Byte);
        // chrRom.fill(0);
        var chrOffset = 0;
        // create cart
        // bytesRead = zipStream.Read(theRom, 0, theRom.Length);
        BaseCart_1.BaseCart.arrayCopy(thefile, 16, theRom, 0, theRom.length);
        chrOffset = (16 + theRom.length) | 0;
        var len = chrRom.length;
        if (((chrOffset + chrRom.length) | 0) > thefile.length) {
            len = (thefile.length - chrOffset) | 0;
        }
        BaseCart_1.BaseCart.arrayCopy(thefile, chrOffset, chrRom, 0, len);
        _cart = mf.createCart(mapperId);
        _cart.submapperId = submapperId;
        if (_cart != null) {
            _cart.Whizzler = cpu.ppu;
            _cart.CPU = cpu;
            cpu.Cart = _cart;
            cpu.ppu.ChrRomHandler = _cart;
            _cart.ROMHashFunction = crc.crc32(new Buffer(thefile.slice(16, thefile.length))).toString(16).toUpperCase(); //Hashers.HashFunction;
            _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
        }
        return _cart;
    };
    return iNESFileHandler;
}());
exports.iNESFileHandler = iNESFileHandler;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(4);
var DMCChannel_1 = __webpack_require__(40);
var CommonAudio_1 = __webpack_require__(5);
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
        this.registers = new CommonAudio_1.QueuedPort();
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
        this.myBlipper = new CommonAudio_1.Blip(this._sampleRate / 5);
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
        this.triangle.Gain = this.triangleGain;
        this.triangle.Period = 0;
        this.noise = new NoiseChannel(this.myBlipper, 3);
        this.noise.Gain = this.noiseGain;
        this.noise.Period = 0;
        this.dmc = new DMCChannel_1.DMCChannel(this.myBlipper, 4, null);
        //  this.dmc.Gain = 873; this.dmc.Period = 10;
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
        this.registers.enqueue(new CommonAudio_1.PortWriteEntry(Clock, address, data));
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
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var chichi_1 = __webpack_require__(12);
var NesInfo = /** @class */ (function () {
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
var tendoWrapper = /** @class */ (function () {
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
        this.buffers = {};
        this.machine = new chichi_1.ChiChiMachine();
    }
    tendoWrapper.prototype.createMachine = function () {
        var _this = this;
        this.machine = new chichi_1.ChiChiMachine();
        this.machine.Cpu.ppu.byteOutBuffer = this.buffers.vbuffer;
        this.machine.SoundBopper.writer.SharedBuffer = this.buffers.abuffer;
        this.machine.SoundBopper.audioSettings = this.buffers.audioSettings;
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
        //setTimeout(()=>{
        machine.Reset();
        //},16);
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
                this.buffers = event.data;
                this.createMachine();
                //                this.sharedAudioBufferPos = 0;
                this.iops = event.data.iops;
                break;
            case 'cheats':
                this.machine.Cpu.cheating = event.data.cheats.length > 0;
                this.machine.Cpu.genieCodes = event.data.cheats;
                break;
            case 'loadrom':
                this.stop();
                this.machine = undefined;
                this.createMachine();
                this.machine.EnableSound = false;
                //this.createMachine();
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiMachine_1 = __webpack_require__(7);
exports.ChiChiCPPU = ChiChiMachine_1.ChiChiCPPU;
exports.ChiChiMachine = ChiChiMachine_1.ChiChiMachine;
var ChiChiNsfMachine_1 = __webpack_require__(41);
exports.ChiChiNsfCPPU = ChiChiNsfMachine_1.ChiChiNsfCPPU;
exports.ChiChiNsfMachine = ChiChiNsfMachine_1.ChiChiNsfMachine;
var BaseCart_1 = __webpack_require__(1);
exports.BaseCart = BaseCart_1.BaseCart;
var ChiChiCarts_1 = __webpack_require__(8);
exports.iNESFileHandler = ChiChiCarts_1.iNESFileHandler;
var ChiChiControl_1 = __webpack_require__(10);
exports.ChiChiInputHandler = ChiChiControl_1.ChiChiInputHandler;
var ChiChiAudio_1 = __webpack_require__(9);
exports.ChiChiBopper = ChiChiAudio_1.ChiChiBopper;
var CommonAudio_1 = __webpack_require__(5);
exports.WavSharer = CommonAudio_1.WavSharer;
var ChiChiPPU_1 = __webpack_require__(6);
exports.ChiChiPPU = ChiChiPPU_1.ChiChiPPU;
var ChiChiTypes_1 = __webpack_require__(4);
exports.RunningStatuses = ChiChiTypes_1.RunningStatuses;
exports.ChiChiCPPU_AddressingModes = ChiChiTypes_1.ChiChiCPPU_AddressingModes;
exports.CpuStatus = ChiChiTypes_1.CpuStatus;
exports.PpuStatus = ChiChiTypes_1.PpuStatus;
exports.ChiChiInstruction = ChiChiTypes_1.ChiChiInstruction;
exports.ChiChiSprite = ChiChiTypes_1.ChiChiSprite;
exports.AudioSettings = ChiChiTypes_1.AudioSettings;
var ChiChiCheats_1 = __webpack_require__(42);
exports.GameGenieCode = ChiChiCheats_1.GameGenieCode;
exports.ChiChiCheats = ChiChiCheats_1.ChiChiCheats;


/***/ }),
/* 13 */
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
/* 14 */
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
/* 15 */
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
/* 16 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 17 */
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
var BaseCart_1 = __webpack_require__(1);
//  Simple discrete logic mappers
var NesCart = /** @class */ (function (_super) {
    __extends(NesCart, _super);
    function NesCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // prevBSSrc = new Uint8Array(8);
    NesCart.prototype.InitializeCart = function () {
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
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    NesCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        if (this.mapperId === 3 && address >= 0x8000) {
            this.CopyBanks(clock, 0, val, 1);
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
}(BaseCart_1.BaseCart));
exports.NesCart = NesCart;
var UxROMCart = /** @class */ (function (_super) {
    __extends(UxROMCart, _super);
    function UxROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UxROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'UxROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    UxROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = 0;
            newbank81 = val << 1;
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
        }
    };
    return UxROMCart;
}(BaseCart_1.BaseCart));
exports.UxROMCart = UxROMCart;
var Mapper081Cart = /** @class */ (function (_super) {
    __extends(Mapper081Cart, _super);
    function Mapper081Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper081Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Super Gun';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper081Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = 0;
            newbank81 = ((val >> 2) & 3) << 1;
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
            var chrBank = val & 3;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrBank, 1);
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
    Mapper030Cart.prototype.InitializeCart = function () {
        this.mapperName = 'UNROM-512';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper030Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = 0;
            newbank81 = (val & 0x1F) << 1;
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
            var chrBank = (val >> 5) & 3;
            this.Whizzler.DrawTo(clock);
            this.Mirror(0, (val >> 7) & 0x1);
            this.CopyBanks(clock, 0, chrBank, 1);
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
    Mapper071Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Camerica UNROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper071Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = 0;
            newbank81 = val << 1;
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
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
    Mapper013Cart.prototype.InitializeCart = function () {
        this.mapperName = 'NES-CPROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks4k(0, 0, 0, 1);
            this.CopyBanks4k(0, 1, 1, 1);
        }
        // one 32k prg rom
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 2);
    };
    Mapper013Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            this.Whizzler.DrawTo(clock);
            this.CopyBanks4k(clock, 1, (val & 3), 1);
        }
    };
    return Mapper013Cart;
}(BaseCart_1.BaseCart));
exports.Mapper013Cart = Mapper013Cart;
var CNROMCart = /** @class */ (function (_super) {
    __extends(CNROMCart, _super);
    function CNROMCart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //for (var i = 0; i < 8; i = (i + 1) | 0) {
    //    this.prevBSSrc[i] = -1;
    //}
    //SRAMEnabled = SRAMCanSave;
    CNROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'CNROM';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    CNROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, val & 0xFF, 1);
        }
    };
    return CNROMCart;
}(BaseCart_1.BaseCart));
exports.CNROMCart = CNROMCart;
var Mapper185Cart = /** @class */ (function (_super) {
    __extends(Mapper185Cart, _super);
    function Mapper185Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //for (var i = 0; i < 8; i = (i + 1) | 0) {
    //    this.prevBSSrc[i] = -1;
    //}
    //SRAMEnabled = SRAMCanSave;
    Mapper185Cart.prototype.InitializeCart = function () {
        this.mapperName = 'CNROM + CP';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper185Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, val, 1);
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
    //for (var i = 0; i < 8; i = (i + 1) | 0) {
    //    this.prevBSSrc[i] = -1;
    //}
    //SRAMEnabled = SRAMCanSave;
    Mapper190Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MKGGROM';
        this.CopyBanks(0, 0, 0, 1);
        this.SetupBankStarts(0, 1, 0, 1);
    };
    Mapper190Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            this.prgRomBank6[address & 8191] = val & 255;
        }
        // prgBank = A14, D2, D1, D0
        if (address >= 0x8000 && address <= 0x9FFF) {
            var prgBank = (val & 7) << 1;
            this.SetupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
        }
        if (address >= 0xC000 && address <= 0xDFFF) {
            var prgBank = ((val & 7) + 8) << 1;
            this.SetupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
        }
        if (address >= 0xA000 && address <= 0xBFFF) {
            this.CopyBanks2k(clock, address & 3, val, 1);
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
    //for (var i = 0; i < 8; i = (i + 1) | 0) {
    //    this.prevBSSrc[i] = -1;
    //}
    //SRAMEnabled = SRAMCanSave;
    Mapper087Cart.prototype.InitializeCart = function () {
        this.mapperName = 'CNROM Clone';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper087Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            var chrbank = ((val & 0x1) << 1) | ((val & 0x2) >> 1);
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
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
    //for (var i = 0; i < 8; i = (i + 1) | 0) {
    //    this.prevBSSrc[i] = -1;
    //}
    //SRAMEnabled = SRAMCanSave;
    Mapper145Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Sachen Sidewinder';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    Mapper145Cart.prototype.SetByte = function (clock, address, val) {
        if ((address & 0xE100) == 0x4100) {
            var chrbank = val;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
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
    ColorDreams.prototype.InitializeCart = function () {
        this.mapperName = 'Color Dreams';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    ColorDreams.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = (val & 0x3) << 2;
            var chrbank = ((val >> 4) & 0xf);
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            // two high bits set mirroring
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }
        //         %00 = 1ScA
        //         %01 = Horz
        //         %10 = Vert
        //         %11 = 1ScB
        //this.Mirror(clock,(val >> 6));
    };
    return ColorDreams;
}(BaseCart_1.BaseCart));
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
        this.SetupBankStarts(0, 1, 2, 3);
    };
    MHROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0x3;
            var prgbank = ((val >> 4) & 0x3) << 2;
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
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
    Mapper070Cart.prototype.InitializeCart = function () {
        this.mapperName = '~Family Trainer';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper070Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0xF) << 1;
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
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
    Mapper077Cart.prototype.InitializeCart = function () {
        this.mapperName = '~Mapper 077';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper077Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = (val & 0xF) << 2;
            var chrbank = ((val >> 4) & 0xF);
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.Whizzler.DrawTo(clock);
            this.CopyBanks2k(clock, 0, chrbank, 1);
        }
    };
    return Mapper077Cart;
}(BaseCart_1.BaseCart));
exports.Mapper077Cart = Mapper077Cart;
var Mapper093Cart = /** @class */ (function (_super) {
    __extends(Mapper093Cart, _super);
    function Mapper093Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper093Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Sunsoft-2';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper093Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = ((val >> 4) & 0x7) << 1;
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
        }
    };
    return Mapper093Cart;
}(BaseCart_1.BaseCart));
exports.Mapper093Cart = Mapper093Cart;
var Mapper152Cart = /** @class */ (function (_super) {
    __extends(Mapper152Cart, _super);
    function Mapper152Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper152Cart.prototype.InitializeCart = function () {
        this.mapperName = '~FT + mirroring';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper152Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0x31) << 1;
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
            this.oneScreenOffset = (val >> 7) == 1 ? 1024 : 0;
            this.Mirror(clock, 0);
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
    JF1xCart.prototype.InitializeCart = function () {
        this.mapperName = 'Jaleco JF-11, JF-14';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    JF1xCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0x3) << 2;
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
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
}(BaseCart_1.BaseCart));
exports.Irem097Cart = Irem097Cart;
var BitCorp038Cart = /** @class */ (function (_super) {
    __extends(BitCorp038Cart, _super);
    function BitCorp038Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BitCorp038Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Bit Corp Crime Busters';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    BitCorp038Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x7000 && address <= 0x7FFF) {
            var newbank81 = 0;
            var prgbank = (val & 0x3) << 2;
            var chrbank = ((val >> 2) & 0x3);
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
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
    AxROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'AxROM';
        this.SetupBankStarts(0, 1, 2, 3);
        this.Mirror(0, 0);
    };
    AxROMCart.prototype.SetByte = function (clock, address, val) {
        if (address < 0x5000)
            return;
        if (address >= 24576 && address <= 32767) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        // val selects which bank to swap, 32k at a time
        var newbank8 = 0;
        newbank8 = (val & 15) << 2;
        this.SetupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
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
}(BaseCart_1.BaseCart));
exports.AxROMCart = AxROMCart;
// BNROM (34)
var BNROMCart = /** @class */ (function (_super) {
    __extends(BNROMCart, _super);
    function BNROMCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isNina = false;
        return _this;
    }
    BNROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'BNROM';
        if (this.chrRomCount > 1) {
            this.mapperName = 'NINA-001';
            this.isNina = true;
            this.SetByte = this.SetByteNina;
        }
        this.SetupBankStarts(0, 1, 2, 3);
        //this.Mirror(0, 0);
    };
    BNROMCart.prototype.SetByte = function (clock, address, val) {
        if (address < 0x5000)
            return;
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
        this.SetupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
        // whizzler.DrawTo(clock);
    };
    BNROMCart.prototype.SetByteNina = function (clock, address, val) {
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
                newbank8 = (val & 1) << 2;
                this.SetupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
                break;
            case 0x7FFE:
                // Select 4 KB CHR ROM bank for PPU $0000-$0FFF
                this.CopyBanks4k(clock, 0, val & 0xf, 1);
                break;
            case 0x7FFF:
                // Select 4 KB CHR ROM bank for PPU $1000-$1FFF
                this.CopyBanks4k(clock, 1, val & 0xf, 1);
                break;
        }
    };
    return BNROMCart;
}(AxROMCart));
exports.BNROMCart = BNROMCart;


/***/ }),
/* 18 */
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
var BaseCart_1 = __webpack_require__(1);
// simple discrete logic multi-carts, various pirate xxxxx-in-1s
var Mapper051Cart = /** @class */ (function (_super) {
    __extends(Mapper051Cart, _super);
    function Mapper051Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper051Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Charlie Multi-Cart';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    Mapper051Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var mode = (val >> 6) & 0x01;
            if (mode) {
                // 16k banks 
                var newbank81 = (val) << 1;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }
            else {
                // 32k banks 
                var newbank81 = 0;
                newbank81 = (val) << 2;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
            }
            this.Whizzler.DrawTo(clock);
            this.Mirror(clock, ((val >> 7) & 0x1) + 1);
            this.CopyBanks(clock, 0, (val >> 3) & 7, 1);
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
    Mapper058Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Charlie Multi-Cart';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    Mapper058Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var mode = (address >> 6) & 0x01;
            if (mode) {
                // 16k banks 
                var newbank81 = (address & 7) << 1;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }
            else {
                // 32k banks 
                var newbank81 = 0;
                newbank81 = (address & 7) << 2;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
            }
            this.Whizzler.DrawTo(clock);
            this.Mirror(clock, ((address >> 7) & 0x1) + 1);
            this.CopyBanks(clock, 0, (address >> 3) & 7, 1);
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
    Mapper202Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Multi-Cart';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 0, 1);
    };
    Mapper202Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            //let mode = ((address >> 14) & 0x01)==0x01;
            var bank = (address >> 1) & 7;
            if ((address & 1) | ((address >> 2) & 2)) {
                var newbank81 = (bank >> 1) << 2;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
            }
            else {
                var newbank81 = (bank >> 1) << 1;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }
            this.Whizzler.DrawTo(clock);
            this.Mirror(clock, ((address) & 0x1) + 1);
            this.CopyBanks(clock, 0, bank, 1);
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
    Mapper212Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Multi-Cart212';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 2);
        }
        this.SetupBankStarts(0, 1, 3, 4);
    };
    Mapper212Cart.prototype.GetByte = function (clock, address) {
        var bank = 0;
        // if (address & 0xE010) {
        //     return (address & 0xFF) | 0xA;
        // }
        switch (address & 0xE000) {
            case 0x6000:
                return (address >> 8) & 0xFF | 0xA;
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
        }
        return this.nesCart[bank + (address & 0x1FFF)];
    };
    Mapper212Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var mode = ((address >> 14) & 0x01) == 0x01;
            var bank = address & 7;
            // Write $8000-$FFFF:
            // A~[1o.. .... .... MBBb]
            if (mode) {
                // When it's 1, BB is 32 KiB PRG bank at CPU $8000.
                var newbank81 = (address & 6) << 2;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81 + 2, newbank81 + 3);
            }
            else {
                // When Banking style is 0, BBb specifies a 16 KiB PRG bank at both CPU $8000 and $C000. 
                var newbank81 = bank << 1;
                this.SetupBankStarts(newbank81, newbank81 + 1, newbank81, newbank81 + 1);
            }
            this.Whizzler.DrawTo(clock);
            this.Mirror(clock, ((address >> 3) & 0x1) + 1);
            this.CopyBanks(clock, 0, bank, 1);
        }
    };
    return Mapper212Cart;
}(BaseCart_1.BaseCart));
exports.Mapper212Cart = Mapper212Cart;


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
var BaseCart_1 = __webpack_require__(1);
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
    MMC1Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC1';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 2);
        }
        this._registers[0] = 12;
        this._registers[1] = 0;
        this._registers[2] = 0;
        this._registers[3] = 0;
        this.SetupBankStarts(0, 1, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.sequence = 0;
        this.accumulator = 0;
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
                            // 4bit0
                            // -----
                            // CPPMM
                            // |||||
                            // |||++- Mirroring (0: one-screen, lower bank; 1: one-screen, upper bank;
                            // |||               2: vertical; 3: horizontal)
                            // |++--- PRG ROM bank mode (0, 1: switch 32 KB at $8000, ignoring low bit of bank number;
                            // |                         2: fix first bank at $8000 and switch 16 KB bank at $C000;
                            // |                         3: fix last bank at $C000 and switch 16 KB bank at $8000)
                            // +----- CHR ROM bank mode (0: switch 8 KB at a time; 1: switch two separate 4 KB banks)
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
        //	bit 4 - sets 8KB or 4KB CHRROM switching mode
        // 0 = 8KB CHRROM banks, 1 = 4KB CHRROM banks
        this.Whizzler.DrawTo(clock);
        //if ((this._registers[0] & 16) === 16) {
        if (this.chrRomBankMode === 1) {
            this.CopyBanks4k(0, 0, this._registers[1], 1);
            this.CopyBanks4k(0, 1, this._registers[2], 1);
        }
        else {
            //CopyBanks(0, _registers[1], 2);
            this.CopyBanks4k(0, 0, this._registers[1], 1);
            this.CopyBanks4k(0, 1, ((this._registers[1] + 1) | 0), 1);
        }
        this.bankSwitchesChanged = true;
        this.Whizzler.UpdatePixelInfo();
    };
    MMC1Cart.prototype.setMMC1PrgBanking = function () {
        var reg = 0;
        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;
        }
        else {
            this.bank_select = 0;
        }
        // |++--- PRG ROM bank mode (0, 1: switch 32 KB at $8000, ignoring low bit of bank number;
        // |                         2: fix first bank at $8000 and switch 16 KB bank at $C000;
        // |                         3: fix last bank at $C000 and switch 16 KB bank at $8000)
        switch (this.prgRomBankMode) {
            case 0:
            case 1:
                reg = (4 * ((this._registers[3] >> 1) & 0xF) + this.bank_select) | 0;
                this.SetupBankStarts(reg, reg + 1, reg + 2, reg + 3);
                break;
            case 2:
                reg = (2 * (this._registers[3]) + this.bank_select) | 0;
                this.SetupBankStarts(0, 1, reg, reg + 1);
                break;
            case 3:
                reg = (2 * (this._registers[3]) + this.bank_select) | 0;
                this.SetupBankStarts(reg, reg + 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
                break;
        }
    };
    MMC1Cart.prototype.setMMC1Mirroring = function (clock) {
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
}(BaseCart_1.BaseCart));
exports.MMC1Cart = MMC1Cart;


/***/ }),
/* 20 */
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
var BaseCart_1 = __webpack_require__(1);
var MMC2Cart = /** @class */ (function (_super) {
    __extends(MMC2Cart, _super);
    function MMC2Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selector = [0, 0];
        _this.banks = [0, 0, 0, 0];
        return _this;
    }
    MMC2Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC2';
        this.selector[0] = 1;
        this.selector[1] = 2;
        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;
        this.SetupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.CopyBanks(0, 0, this.banks[this.selector[0]], 1);
        this.CopyBanks(0, 1, this.banks[this.selector[1]], 1);
    };
    MMC2Cart.prototype.CopyBanks = function (clock, dest, src, numberOf4kBanks) {
        if (dest >= this.chrRomCount) {
            dest = (this.chrRomCount - 1) | 0;
        }
        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    MMC2Cart.prototype.GetPPUByte = function (clock, address) {
        var bank = 0;
        if (address == 0xFD8) {
            bank = (address >> 11) & 0x2;
            this.selector[0] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, this.banks[this.selector[0]], 1);
        }
        else if (address == 0xFE8) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.selector[0] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, this.banks[this.selector[0]], 1);
        }
        else if (address >= 0x1FD8 && address <= 0x1FDF) {
            bank = (address >> 11) & 0x2;
            this.selector[1] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 1, this.banks[this.selector[1]], 1);
        }
        else if (address >= 0x1FE8 && address <= 0x1FEF) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.selector[1] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 1, this.banks[this.selector[1]], 1);
        }
        bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 1023);
        var data = this.chrRom[newAddress];
        return data;
    };
    MMC2Cart.prototype.SetByte = function (clock, address, val) {
        this.Whizzler.DrawTo(clock);
        switch (address >> 12) {
            case 0x6:
            case 0x7:
                if (this.SRAMEnabled && this.SRAMCanWrite) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
                break;
            case 0xA:
                this.SetupBankStarts((val & 0xF), this.currentA, this.currentC, this.currentE);
                break;
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 0, this.banks[this.selector[0]], 1);
                this.Whizzler.UnpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 1, this.banks[this.selector[1]], 1);
                break;
            case 0xF:
                this.Mirror(clock, (val & 0x1) + 1);
                break;
        }
        // this.SetupBankStarts()
        //chr.SwapBanks<SIZE_4K,0x0000>( banks[selector[0]], banks[selector[1]] );
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
    MMC4Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC4';
        this.selector[0] = 1;
        this.selector[1] = 2;
        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.CopyBanks(0, 0, this.banks[this.selector[0]], 1);
        this.CopyBanks(0, 1, this.banks[this.selector[1]], 1);
    };
    MMC4Cart.prototype.CopyBanks = function (clock, dest, src, numberOf4kBanks) {
        if (dest >= this.chrRomCount) {
            dest = (this.chrRomCount - 1) | 0;
        }
        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[((oneKdest + i) | 0)] = (oneKsrc + i) * 1024;
        }
        this.UpdateBankStartCache();
    };
    MMC4Cart.prototype.GetPPUByte = function (clock, address) {
        var bank = 0;
        if (address >= 0xFD8 && address <= 0xFDF) {
            bank = (address >> 11) & 0x2;
            this.selector[0] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, this.banks[this.selector[0]], 1);
        }
        else if (address >= 0xFE8 && address <= 0xFEF) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.selector[0] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, this.banks[this.selector[0]], 1);
        }
        else if (address >= 0x1FD8 && address <= 0x1FDF) {
            bank = (address >> 11) & 0x2;
            this.selector[1] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 1, this.banks[this.selector[1]], 1);
        }
        else if (address >= 0x1FE8 && address <= 0x1FEF) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.selector[1] = bank;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 1, this.banks[this.selector[1]], 1);
        }
        bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 1023);
        var data = this.chrRom[newAddress];
        return data;
    };
    MMC4Cart.prototype.SetByte = function (clock, address, val) {
        this.Whizzler.DrawTo(clock);
        switch (address >> 12) {
            case 0x6:
            case 0x7:
                if (this.SRAMEnabled && this.SRAMCanWrite) {
                    this.prgRomBank6[address & 8191] = val & 255;
                }
                break;
            case 0xA:
                var bank8 = (val & 0xF) << 1;
                this.SetupBankStarts(bank8, bank8 + 1, this.currentC, this.currentE);
                break;
            case 0xB:
            case 0xC:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 0, this.banks[this.selector[0]], 1);
                this.Whizzler.UnpackSprites();
                break;
            case 0xD:
            case 0xE:
                this.banks[(address - 0xB000) >> 12] = val & 0x1f;
                //this.CopyBanks(clock,0,this.banks[this.selector[0]], 1);
                this.Whizzler.DrawTo(clock);
                this.CopyBanks(clock, 1, this.banks[this.selector[1]], 1);
                break;
            case 0xF:
                this.Mirror(clock, (val & 0x1) + 1);
                break;
        }
    };
    return MMC4Cart;
}(BaseCart_1.BaseCart));
exports.MMC4Cart = MMC4Cart;


/***/ }),
/* 21 */
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
var BaseCart_1 = __webpack_require__(1);
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
                this.CPU._handleIRQ = true;
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
                    this.CPU._handleIRQ = true;
                    this.irqRaised = true;
                    //this.updateIRQ();
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
                this.CPU._handleIRQ = true;
            }
            if (this._mmc3IrqVal > 0) {
                this.scanlineCounter = this._mmc3IrqVal;
            }
        }
    };
    return MMC3Cart;
}(BaseCart_1.BaseCart));
exports.MMC3Cart = MMC3Cart;


/***/ }),
/* 22 */
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
var BaseCart_1 = __webpack_require__(1);
// BNROM (34)
var Mapper068Cart = /** @class */ (function (_super) {
    __extends(Mapper068Cart, _super);
    function Mapper068Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper068Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Sunsoft-4';
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        //this.Mirror(0, 0);
    };
    Mapper068Cart.prototype.SetByte = function (clock, address, val) {
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
                this.SetupBankStarts(newbank8, newbank8 + 1, this.currentC, this.currentE);
                break;
            case 0x8000:
                //Map a 2 KiB CHR ROM bank into PPU $0000.    
                this.CopyBanks2k(clock, 0, val, 1);
                break;
            case 0x9000:
                // Map a 2 KiB CHR ROM bank into PPU $0800.  
                this.CopyBanks2k(clock, 1, val, 1);
                break;
            case 0xA000:
                // Map a 2 KiB CHR ROM bank into PPU $1000.  
                this.CopyBanks2k(clock, 2, val, 1);
                break;
            case 0xB000:
                // Map a 2 KiB CHR ROM bank into PPU $1800.   
                this.CopyBanks2k(clock, 3, val, 1);
                break;
            case 0xC000:
                // Map a 1 KiB CHR ROM bank in place of the lower nametable (CIRAM $000-$3FF). Only D6-D0 are used; D7 is ignored and treated as 1, so nametables must be in the last 128 KiB of CHR ROM.   
                this.CopyBanks1k(clock, 8, val | 0x80, 1);
                break;
            case 0xD000:
                // Map a 1 KiB CHR ROM bank in place of the upper nametable (CIRAM $400-$7FF). Only D6-D0 are used; D7 is ignored and treated as 1.  
                this.CopyBanks1k(clock, 9, val | 0x80, 1);
                break;
            case 0xE000:
                this.Whizzler.DrawTo(clock);
                this.Mirror(clock, val & 0x3);
                var useCRAM = (val & 0x10) == 0x10;
                break;
        }
        // this.Whizzler.DrawTo(clock);
        // whizzler.DrawTo(clock);
    };
    return Mapper068Cart;
}(BaseCart_1.BaseCart));
exports.Mapper068Cart = Mapper068Cart;


/***/ }),
/* 23 */
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
var BaseCart_1 = __webpack_require__(1);
// simple discrete logic multi-carts, various pirate xxxxx-in-1s
var Mapper031Cart = /** @class */ (function (_super) {
    __extends(Mapper031Cart, _super);
    function Mapper031Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.registers = [0, 0, 0, 0, 0, 0, 0, 0xFF];
        return _this;
    }
    Mapper031Cart.prototype.InitializeCart = function () {
        this.mapsBelow6000 = true;
        this.mapperName = 'NSF Compilation';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(this.registers[0], this.registers[1], this.registers[2], this.registers[3], this.registers[4], this.registers[5], this.registers[6], this.registers[7]);
        //         this.SetupBankStarts(0, 0, 0, 0,  (this.prgRomCount * 4) - 4,  (this.prgRomCount * 4) - 3, (this.prgRomCount * 4) - 2, (this.prgRomCount * 4) - 1);
    };
    Mapper031Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            this.prgRomBank6[address & 8191] = val & 255;
        }
        if ((address & 0xFFF0) === 0x5FF0) {
            this.registers[address & 0x7] = val;
            this.SetupBankStarts(this.registers[0], this.registers[1], this.registers[2], this.registers[3], this.registers[4], this.registers[5], this.registers[6], this.registers[7]);
        }
        // switch (address) {
        //     case 0x5FF8:
        //         this.registers[address & 0x7] = val;
        //     //AAA  PPPP PPPP
        //         this.SetupBankStarts(val, this.current9,  this.currentA, this.currentB, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FF9:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, val,  this.currentA, this.currentB, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFA:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  val, this.currentB, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFB:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, val, this.currentC, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFC:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, val, this.currentD, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFD:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, this.currentC, val, this.currentE , this.currentF);
        //         break;
        //     case 0x5FFE:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, this.currentC, this.currentD, val , this.currentF);
        //         break;
        //     case 0x5FFF:
        //         this.registers[address & 0x7] = val;
        //         this.SetupBankStarts(this.current8, this.current9,  this.currentA, this.currentB, this.currentC, this.currentD, this.currentE , val);
        //         break;
        //     } 
    };
    Mapper031Cart.prototype.GetByte = function (clock, address) {
        var bank = 0;
        switch (address & 0xF000) {
            // case 0x5000: 
            //     return this.registers[address & 0x7];
            case 0x6000:
            case 0x7000:
                return this.prgRomBank6[address & 0x1FFF];
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0x9000:
                bank = this.bank9start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xB000:
                bank = this.bankBstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xD000:
                bank = this.bankDstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
            case 0xF000:
                bank = this.bankFstart;
                break;
        }
        return this.nesCart[bank + (address & 0xFFF)];
    };
    return Mapper031Cart;
}(BaseCart_1.BaseCart4k));
exports.Mapper031Cart = Mapper031Cart;


/***/ }),
/* 24 */
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
var BaseCart_1 = __webpack_require__(1);
var Smb2jCart = /** @class */ (function (_super) {
    __extends(Smb2jCart, _super);
    function Smb2jCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.irqEnabled = false;
        _this.irqCounter = 0;
        _this.bank6start = 0;
        _this.current6 = 0;
        return _this;
    }
    Smb2jCart.prototype.InitializeCart = function () {
        this.mapperName = 'Smb2j';
        this.Setup6BankStarts(6, 4, 5, 1, 7);
        this.CopyBanks(0, 0, 0, 1);
    };
    Smb2jCart.prototype.handleNextEvent = function (clock) {
        // if (this.nextEventAt <= clock) {
        //     if (this.irqEnabled) {
        //         this.CPU._handleIRQ = true;
        //         this.irqEnabled = false;
        //         this.nextEventAt = 0;
        //     }
        // }
    };
    ;
    Smb2jCart.prototype.advanceClock = function (value) {
        if (this.irqEnabled) {
            this.irqCounter -= value;
            if (this.irqCounter <= 0) {
                this.irqCounter = 0;
                this.Whizzler.DrawTo(this.CPU.clock);
                this.CPU._handleIRQ = true;
                this.irqEnabled = false;
            }
        }
    };
    Smb2jCart.prototype.Setup6BankStarts = function (reg6, reg8, regA, regC, regE) {
        this.current6 = reg6 = this.MaskBankAddress(reg6);
        this.current8 = reg8 = this.MaskBankAddress(reg8);
        this.currentA = regA = this.MaskBankAddress(regA);
        this.currentC = regC = this.MaskBankAddress(regC);
        this.currentE = regE = this.MaskBankAddress(regE);
        this.bank6start = reg6 * 8192;
        this.bank8start = reg8 * 8192;
        this.bankAstart = regA * 8192;
        this.bankCstart = regC * 8192;
        this.bankEstart = regE * 8192;
    };
    Smb2jCart.prototype.GetByte = function (clock, address) {
        var bank = 0;
        switch (address & 0xE000) {
            case 0x6000:
                bank = this.bank6start;
                break;
            case 0x8000:
                bank = this.bank8start;
                break;
            case 0xA000:
                bank = this.bankAstart;
                break;
            case 0xC000:
                bank = this.bankCstart;
                break;
            case 0xE000:
                bank = this.bankEstart;
                break;
        }
        return this.nesCart[bank + (address & 0x1FFF)];
    };
    Smb2jCart.prototype.SetByte = function (clock, address, data) {
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
                this.Setup6BankStarts(this.current6, this.current8, this.currentA, data, this.currentE);
                break;
        }
    };
    return Smb2jCart;
}(BaseCart_1.BaseCart));
exports.Smb2jCart = Smb2jCart;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  crc1: __webpack_require__(26),
  crc8: __webpack_require__(27),
  crc81wire: __webpack_require__(28),
  crc16: __webpack_require__(29),
  crc16ccitt: __webpack_require__(30),
  crc16modbus: __webpack_require__(31),
  crc16xmodem: __webpack_require__(32),
  crc16kermit: __webpack_require__(33),
  crc24: __webpack_require__(34),
  crc32: __webpack_require__(35),
  crcjam: __webpack_require__(36)
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

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
var BaseCart_1 = __webpack_require__(1);
var VSCart = /** @class */ (function (_super) {
    __extends(VSCart, _super);
    function VSCart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        _this.bankSelect = 0;
        return _this;
    }
    VSCart.prototype.InitializeCart = function () {
        this.mapperName = 'VS Unisystem';
        this.mapsBelow6000 = true;
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    VSCart.prototype.SetByte = function (clock, address, val) {
        if (address == 0x4016) {
            this.bankSelect = val;
            var chrbank = (val >> 2) & 0x1;
            if (this.prgRomCount > 2) {
                this.SetupBankStarts(chrbank, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
            }
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }
    };
    return VSCart;
}(BaseCart_1.BaseCart));
exports.VSCart = VSCart;


/***/ }),
/* 38 */
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
var BaseCart_1 = __webpack_require__(1);
var KonamiVRC1Cart = /** @class */ (function (_super) {
    __extends(KonamiVRC1Cart, _super);
    function KonamiVRC1Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chrbank0 = 0;
        _this.chrbank1 = 0;
        return _this;
    }
    KonamiVRC1Cart.prototype.InitializeCart = function () {
        this.mapperName = 'KonamiVRC1';
        if (this.mapperId == 151) {
            this.mapperName = 'KonamiVRC1 (VS)';
        }
        this.SetupBankStarts(0, 0, 0, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);
    };
    KonamiVRC1Cart.prototype.SetByte = function (clock, address, data) {
        switch (address & 0xF000) {
            case 0x8000:
                // 8kib prg rom at 8000
                var bank8 = data & 0xF;
                this.SetupBankStarts(bank8, this.currentA, this.currentC, this.currentE);
                break;
            case 0xA000:
                // 8kib prg rom at A000
                var bankA = data & 0xF;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0xC000:
                // 8kib prg rom at C000
                var bankC = data & 0xF;
                this.SetupBankStarts(this.current8, this.currentA, bankC, this.currentE);
                break;
            case 0x9000:
                this.Whizzler.DrawTo(clock);
                if (!this.fourScreen) {
                    this.Mirror(clock, (data & 1) + 1);
                }
                this.chrbank0 = (data & 2) << 3;
                this.chrbank1 = (data & 4) << 2;
                // this.CopyBanks4k(clock, 0, this.chrbank0 , 1);
                // this.CopyBanks4k(clock, 1, this.chrbank1 , 1);
                break;
            case 0xE000:
                // 8kib prg rom at 8000
                this.CopyBanks4k(clock, 0, this.chrbank0 | (data & 0xF), 1);
                break;
            case 0xF000:
                // 8kib prg rom at 8000
                this.CopyBanks4k(clock, 1, this.chrbank1 | (data & 0xF), 1);
                break;
        }
    };
    return KonamiVRC1Cart;
}(BaseCart_1.BaseCart));
exports.KonamiVRC1Cart = KonamiVRC1Cart;


/***/ }),
/* 39 */
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
var BaseCart_1 = __webpack_require__(1);
var KonamiVRC2Cart = /** @class */ (function (_super) {
    __extends(KonamiVRC2Cart, _super);
    function KonamiVRC2Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chrbank0 = 0;
        _this.chrbank0_1 = 0;
        _this.chrbank1 = 0;
        _this.chrbank1_1 = 0;
        _this.chrbankc1_1 = 0;
        _this.chrbankc1 = 0;
        _this.chrbankc0_1 = 0;
        _this.chrbankc0 = 0;
        _this.chrbankd1_1 = 0;
        _this.chrbankd1 = 0;
        _this.chrbankd0_1 = 0;
        _this.chrbankd0 = 0;
        _this.chrbanke1_1 = 0;
        _this.chrbanke1 = 0;
        _this.chrbanke0_1 = 0;
        _this.chrbanke0 = 0;
        _this.latches = [
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
        ];
        _this.regNums = [
            0x00,
            0x01,
            0x02,
            0x03,
        ];
        _this.irqLatch = 0;
        return _this;
    }
    KonamiVRC2Cart.prototype.InitializeCart = function () {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.CopyBanks4k(0, 0, 0, 2);
        switch (this.ROMHashFunction) {
            case 'C1FBF659': // boku dracula kun
            case '91328C1D':// tiny toon adventures j
                this.regNums = [
                    0x00,
                    0x04,
                    0x08,
                    0x0c,
                ];
                break;
        }
    };
    KonamiVRC2Cart.prototype.SetByte = function (clock, address, data) {
        switch (address & 0xF000) {
            case 0x6000:
                break;
            case 0x8000:
                // 8kib prg rom at 8000
                var bank8 = data & 0x1F;
                this.SetupBankStarts(bank8, this.currentA, this.currentC, this.currentE);
                break;
            case 0xA000:
                // 8kib prg rom at A000
                var bankA = data & 0x1F;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
                break;
            case 0x9000:
                if (address <= 0x9003) {
                    switch (data & 7) {
                        case 0:// vertical
                            this.Mirror(clock, 2);
                            break;
                        case 1:// horizontal
                            this.Mirror(clock, 1);
                            break;
                        case 2:// onescreen - low
                            this.oneScreenOffset = 0;
                            this.Mirror(clock, 0);
                            break;
                        case 3:// onescreen - high
                            this.oneScreenOffset = 0x400;
                            this.Mirror(clock, 0);
                            break;
                    }
                }
                // this.CopyBanks4k(clock, 0, this.chrbank0 , 1);
                // this.CopyBanks4k(clock, 1, this.chrbank1 , 1);
                break;
            case 0xB000:
                if ((address & 0xFFF) == this.regNums[0]) {
                    this.chrbank0 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[1]) {
                    this.chrbank0_1 = (data & 0xf) << 4;
                }
                if ((address & 0xFFF) == this.regNums[2]) {
                    this.chrbank1 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[3]) {
                    this.chrbank1_1 = (data & 0xf) << 4;
                }
                this.CopyBanks1k(clock, 0, this.chrbank0 | this.chrbank0_1, 1);
                this.CopyBanks1k(clock, 1, this.chrbank1 | this.chrbank1_1, 1);
                break;
            case 0xc000:
                if ((address & 0xFFF) == this.regNums[0]) {
                    this.chrbankc0 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[1]) {
                    this.chrbankc0_1 = (data & 0xf) << 4;
                }
                if ((address & 0xFFF) == this.regNums[2]) {
                    this.chrbankc1 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[3]) {
                    this.chrbankc1_1 = (data & 0xf) << 4;
                }
                this.CopyBanks1k(clock, 2, this.chrbankc0 | this.chrbankc0_1, 1);
                this.CopyBanks1k(clock, 3, this.chrbankc1 | this.chrbankc1_1, 1);
                break;
            case 0xd000:
                if ((address & 0xFFF) == this.regNums[0]) {
                    this.chrbankd0 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[1]) {
                    this.chrbankd0_1 = (data & 0xf) << 4;
                }
                if ((address & 0xFFF) == this.regNums[2]) {
                    this.chrbankd1 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[3]) {
                    this.chrbankd1_1 = (data & 0xf) << 4;
                }
                this.CopyBanks1k(clock, 4, this.chrbankd0 | this.chrbankd0_1, 1);
                this.CopyBanks1k(clock, 5, this.chrbankd1 | this.chrbankd1_1, 1);
                break;
            case 0xe000:
                if ((address & 0xFFF) == this.regNums[0]) {
                    this.chrbanke0 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[1]) {
                    this.chrbanke0_1 = (data & 0xf) << 4;
                }
                if ((address & 0xFFF) == this.regNums[2]) {
                    this.chrbanke1 = data & 0xF;
                }
                if ((address & 0xFFF) == this.regNums[3]) {
                    this.chrbanke1_1 = (data & 0xf) << 4;
                }
                this.CopyBanks1k(clock, 6, this.chrbanke0 | this.chrbanke0_1, 1);
                this.CopyBanks1k(clock, 7, this.chrbanke1 | this.chrbanke1_1, 1);
                break;
        }
    };
    return KonamiVRC2Cart;
}(BaseCart_1.BaseCart));
exports.KonamiVRC2Cart = KonamiVRC2Cart;


/***/ }),
/* 40 */
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
    DMCChannel.prototype.UpdateAmplitude = function (new_amp) {
    };
    DMCChannel.prototype.EndFrame = function (time) {
    };
    DMCChannel.prototype.FrameClock = function (time, step) {
    };
    return DMCChannel;
}());
exports.DMCChannel = DMCChannel;


/***/ }),
/* 41 */
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
var ChiChiMachine_1 = __webpack_require__(7);
var ChiChiPPU_1 = __webpack_require__(6);
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


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GameGenieCode = /** @class */ (function () {
    function GameGenieCode() {
        this.active = false;
    }
    return GameGenieCode;
}());
exports.GameGenieCode = GameGenieCode;
var GeniePatch = /** @class */ (function () {
    function GeniePatch() {
        this.address = -1;
        this.data = -1;
        this.compare = -1;
        this.active = true;
    }
    return GeniePatch;
}());
exports.GeniePatch = GeniePatch;
var ChiChiCheats = /** @class */ (function () {
    function ChiChiCheats() {
    }
    ChiChiCheats.prototype.gameGenieCodeToPatch = function (code) {
        var hexCode = new Uint8Array(code.length);
        var i = 0;
        var patch = null;
        for (var j = 0; j < code.length; ++j) {
            var c = code.charAt(j);
            var digit = 0;
            switch (c) {
                case 'A':
                    digit = 0x0;
                    break;
                case 'P':
                    digit = 0x1;
                    break;
                case 'Z':
                    digit = 0x2;
                    break;
                case 'L':
                    digit = 0x3;
                    break;
                case 'G':
                    digit = 0x4;
                    break;
                case 'I':
                    digit = 0x5;
                    break;
                case 'T':
                    digit = 0x6;
                    break;
                case 'Y':
                    digit = 0x7;
                    break;
                case 'E':
                    digit = 0x8;
                    break;
                case 'O':
                    digit = 0x9;
                    break;
                case 'X':
                    digit = 0xA;
                    break;
                case 'U':
                    digit = 0xB;
                    break;
                case 'K':
                    digit = 0xC;
                    break;
                case 'S':
                    digit = 0xD;
                    break;
                case 'V':
                    digit = 0xE;
                    break;
                case 'N':
                    digit = 0xF;
                    break;
            }
            hexCode[i++] = digit;
        }
        // magic spell that makes the genie appear!
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
            patch = new GeniePatch();
            patch.address = address;
            patch.data = data;
        }
        else if (hexCode.length == 8) {
            data =
                ((hexCode[1] & 7) << 4) | ((hexCode[0] & 8) << 4)
                    | (hexCode[0] & 7) | (hexCode[7] & 8);
            compare =
                ((hexCode[7] & 7) << 4) | ((hexCode[6] & 8) << 4)
                    | (hexCode[6] & 7) | (hexCode[5] & 8);
            patch = new GeniePatch();
            patch.address = address;
            patch.data = data;
            patch.compare = compare;
        }
        else {
            // not a genie code!  
            patch = null;
        }
        return patch;
    };
    return ChiChiCheats;
}());
exports.ChiChiCheats = ChiChiCheats;
var XmlHolder = /** @class */ (function () {
    function XmlHolder() {
    }
    XmlHolder.ggXML = "";
    return XmlHolder;
}());


/***/ })
/******/ ]);
});