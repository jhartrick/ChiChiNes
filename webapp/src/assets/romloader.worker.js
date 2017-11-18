(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["romloader"] = factory();
	else
		root["romloader"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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



var base64 = __webpack_require__(8)
var ieee754 = __webpack_require__(9)
var isArray = __webpack_require__(10)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

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
        // compatible with .net array.copy method
        // shared components
        this.nextEventAt = 0;
        this.prgRomCount = 0;
        this.chrRomOffset = 0;
        this.chrRomCount = 0;
        this.chrRamStart = 0;
        this.chrRamLength = 0;
        this.mapperId = 0;
        this.prgRomBank6 = new Uint8Array(new SharedArrayBuffer(8192 * Uint8Array.BYTES_PER_ELEMENT));
        // starting locations of PPU 0x0000-0x3FFF in 1k blocks
        this.ppuBankStarts = new Uint32Array(new SharedArrayBuffer(16 * Uint32Array.BYTES_PER_ELEMENT));
        // starting locations of PRG rom 0x6000-0xFFFF in 4K blocks
        this.prgBankStarts = new Uint32Array(new SharedArrayBuffer(10 * Uint32Array.BYTES_PER_ELEMENT));
        this.iNesHeader = new Uint8Array(16);
        this.romControlBytes = new Uint8Array(2);
        this.nesCart = null;
        this.chrRom = null;
        this.SRAMCanWrite = false;
        this.SRAMEnabled = false;
        this.SRAMCanSave = false;
        this.ROMHashFunction = null;
        this.mirroring = -1;
        this.updateIRQ = function () {
            _this.NMIHandler();
        };
        this.bankSwitchesChanged = false;
        this.oneScreenOffset = 0;
        this.irqRaised = false;
        this.DebugEvents = null;
        this.usesSRAM = false;
        this.ramMask = 0x1fff;
        this.prgRomBank6.fill(0);
        for (var i = 0; i < 16; i++) {
            this.ppuBankStarts[i] = i * 0x400;
        }
        for (var i = 0; i < 8; i++) {
            this.prgBankStarts[i] = i * 0x1000;
        }
    }
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
    BaseCart.prototype.LoadiNESCart = function (header, prgRoms, chrRoms, prgRomData, chrRomData, chrRomOffset, cartInfo) {
        this.cartInfo = cartInfo;
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
        this.chrRamLength = 4096;
        BaseCart.arrayCopy(chrRomData, 0, this.chrRom, 0, chrRomData.length);
        this.prgRomCount = this.iNesHeader[4];
        this.chrRomCount = this.iNesHeader[5];
        this.romControlBytes[0] = this.iNesHeader[6];
        this.romControlBytes[1] = this.iNesHeader[7];
        this.usesSRAM = (this.romControlBytes[0] & 2) === 2;
    };
    BaseCart.prototype.installCart = function (ppu, cpu) {
        this.Whizzler = ppu;
        this.CPU = cpu;
        //setup mirroring 
        this.mirror(0, 0);
        if ((this.romControlBytes[0] & 1) === 1) {
            this.mirror(0, 1);
        }
        else {
            this.mirror(0, 2);
        }
        this.fourScreen = (this.romControlBytes[0] & 8) === 8;
        if ((this.romControlBytes[0] & 8) === 8) {
            this.mirror(0, 3);
        }
        // initialize
        this.InitializeCart();
    };
    BaseCart.prototype.GetByte = function (clock, address) {
        var bank = (address >> 12) - 0x6;
        if (bank < 2) {
            if (this.usesSRAM) {
                return this.prgRomBank6[address & this.ramMask];
            }
            else {
                return address >> 8;
            }
        }
        return this.nesCart[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    };
    BaseCart.prototype.peekByte = function (address) {
        return this.nesCart[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
    };
    BaseCart.prototype.setPrgRam = function (address, data) {
        if (address >= 0x6000 && address <= 0x7fff) {
            this.prgRomBank6[address & 0x1fff] = data;
        }
    };
    BaseCart.prototype.SetByte = function (clock, address, data) {
        if (this.usesSRAM) {
            this.setPrgRam(address, data);
        }
    };
    BaseCart.prototype.GetPPUByte = function (clock, address) {
        var bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        return this.chrRom[newAddress];
    };
    BaseCart.prototype.SetPPUByte = function (clock, address, data) {
        var bank = address >> 10; //, 1024)) | 0;
        var newAddress = this.ppuBankStarts[bank] + (address & 0x3FF);
        this.chrRom[newAddress] = data;
    };
    BaseCart.prototype.Setup6BankStarts = function (reg6, reg8, regA, regC, regE) {
        reg6 = this.MaskBankAddress(reg6);
        this.prgBankStarts[0] = reg6 * 8192;
        this.prgBankStarts[1] = (this.prgBankStarts[0] + 4096);
        this.SetupBankStarts(reg8, regA, regC, regE);
    };
    BaseCart.prototype.SetupBankStarts = function (reg8, regA, regC, regE) {
        reg8 = this.MaskBankAddress(reg8);
        regA = this.MaskBankAddress(regA);
        regC = this.MaskBankAddress(regC);
        regE = this.MaskBankAddress(regE);
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
            if (bank >= _this.prgRomCount * 4) {
                var i = 0xFFFF;
                while ((bank & i) >= _this.prgRomCount * 4) {
                    i = i >> 1;
                }
                return (bank & i);
            }
            else {
                return bank;
            }
        });
        for (var i = 0; i < banks.length; ++i) {
            if (i >= this.prgBankStarts.length) {
                break;
            }
            this.prgBankStarts[start + i] = banks[i] * 4096;
        }
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
            dest = this.chrRomCount - 1;
        }
        var oneKsrc = src << 3;
        var oneKdest = dest << 3;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf8kBanks << 3); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.copyBanks4k = function (clock, dest, src, numberOf4kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 2;
        }
        var oneKsrc = src << 2;
        var oneKdest = dest << 2;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf4kBanks << 2); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.copyBanks2k = function (clock, dest, src, numberOf2kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 4;
        }
        var oneKsrc = src << 1;
        var oneKdest = dest << 1;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < (numberOf2kBanks << 1); i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.copyBanks1k = function (clock, dest, src, numberOf1kBanks) {
        if (dest >= this.chrRomCount) {
            dest = this.chrRomCount - 8;
        }
        var oneKsrc = src;
        var oneKdest = dest;
        //TODO: get whizzler reading ram from INesCart.GetPPUByte then be calling this
        //  setup ppuBankStarts in 0x400 block chunks 
        for (var i = 0; i < numberOf1kBanks; i++) {
            this.ppuBankStarts[oneKdest + i] = (oneKsrc + i) * 1024;
        }
    };
    BaseCart.prototype.InitializeCart = function (reset) {
        //throw new Error('Method not implemented.');
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
    UnsupportedCart.prototype.InitializeCart = function () {
        this.mapperName = 'unsupported';
        // maybe this will work - give it a go!
        this.SetupBankStarts(0, 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
        this.mirror(0, 0);
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
            this.irqEnable = (val & 0x2) == 0x2;
            this.irqMode = (val & 0x4) == 0x4;
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
        _this.latches = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];
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
        this.GetByte = this.getByteMicrowire;
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
            case 0x7000:
                this.prgRomBank6[data & this.ramMask] = data;
                break;
            case 0x8000:
                var bank8 = data & 0x1F;
                if (this.swapMode) {
                    this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                }
                else {
                    this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }
                break;
            case 0x9000:
                this.vrc4mirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                var bankA = data & 0x1F;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
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
                    this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                }
                else {
                    this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }
                break;
            case 0x9000:
                this.vrc2mirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                var bankA = data & 0x1F;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
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
                    this.SetupBankStarts(this.prgRomCount * 2 - 2, this.currentA, bank8, this.currentE);
                }
                else {
                    this.SetupBankStarts(bank8, this.currentA, this.prgRomCount * 2 - 2, this.currentE);
                }
                break;
            case 0x9000:
                this.vrc2mirroring(clock, address, data);
                break;
            case 0xa000:
                // 8kib prg rom at A000
                var bankA = data & 0x1F;
                this.SetupBankStarts(this.current8, bankA, this.currentC, this.currentE);
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
    KonamiVRC2Cart.prototype.InitializeCart = function () {
        this.mapperName = 'KonamiVRC2';
        this.usesSRAM = true;
        this.ramMask = 0xfff;
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
        this.SetByte = this.setByteVRC4;
        switch (this.ROMHashFunction) {
            case 'CC9FFEC': // ganbare goemon 2 
            case 'B27B8CF4':// Gryzor (contra j)
                this.SetByte = this.setByteVRC2;
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
    KonamiVRC022Cart.prototype.InitializeCart = function () {
        this.mapperName = 'KonamiVRC2a';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
        this.regNums = [0x0, 0x2, 0x1, 0x3];
        this.vrcmirroring = this.vrc2mirroring;
        this.useMicrowire();
        this.SetByte = this.setByteVRC2a;
        switch (this.ROMHashFunction) {
            case 'D4645E14':
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
    Konami021Cart.prototype.InitializeCart = function () {
        this.mapperName = 'KonamiVRC2';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
        this.regNums = [
            0x00,
            0x02,
            0x04,
            0x06,
        ];
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
        this.SetByte = this.setByteVRC2;
    };
    return Konami021Cart;
}(VRC2or4Cart));
exports.Konami021Cart = Konami021Cart;
var Konami025Cart = /** @class */ (function (_super) {
    __extends(Konami025Cart, _super);
    function Konami025Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Konami025Cart.prototype.InitializeCart = function () {
        this.usesSRAM = true;
        this.mapperName = 'KonamiVRC4';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 1, 1);
        this.copyBanks4k(0, 1, 0, 1);
        this.regNums = [0x000, 0x002, 0x001, 0x003];
        this.regMask = 0xf;
        switch (this.ROMHashFunction) {
            case '4A601A2C':// teenage mutant ninja turtles j
                this.regNums = [
                    0x000, 0x008, 0x004, 0x00C
                ];
                break;
        }
        this.SetByte = this.setByteVRC4;
    };
    return Konami025Cart;
}(VRC2or4Cart));
exports.Konami025Cart = Konami025Cart;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiCarts_1 = __webpack_require__(6);
var romLoader = /** @class */ (function () {
    function romLoader() {
    }
    romLoader.prototype.loadRom = function (data, name) {
        var cart = ChiChiCarts_1.iNESFileHandler.loadRomFile(data);
        return cart;
    };
    return romLoader;
}());
exports.romLoader = romLoader;
exports.loader = new romLoader();


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
Object.defineProperty(exports, "__esModule", { value: true });
var crc = __webpack_require__(11);
var BaseCart_1 = __webpack_require__(1);
var Discrete = __webpack_require__(23);
var Multi = __webpack_require__(24);
var MMC1 = __webpack_require__(25);
var MMC2 = __webpack_require__(26);
var MMC3 = __webpack_require__(27);
var M068 = __webpack_require__(28);
var Nsf = __webpack_require__(29);
var Smb2j = __webpack_require__(30);
var VS = __webpack_require__(31);
var VRC = __webpack_require__(32);
var VRC2 = __webpack_require__(4);
var VRC6 = __webpack_require__(33);
var Sunsoft = __webpack_require__(34);
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
        this[21] = VRC2.Konami021Cart;
        this[22] = VRC2.KonamiVRC022Cart;
        this[23] = VRC2.KonamiVRC2Cart;
        this[24] = VRC6.Konami026Cart;
        this[25] = VRC2.Konami025Cart;
        this[26] = VRC6.Konami026Cart;
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
        this[78] = Discrete.Mapper078Cart;
        this[79] = Discrete.Mapper079Cart;
        this[81] = Discrete.Mapper081Cart;
        this[87] = Discrete.Mapper087Cart;
        this[89] = Sunsoft.Mapper089Cart;
        this[93] = Sunsoft.Mapper093Cart;
        this[94] = Discrete.Mapper094Cart;
        this[97] = Discrete.Irem097Cart;
        this[99] = VS.VSCart;
        this[140] = Discrete.JF1xCart;
        this[145] = Discrete.Mapper145Cart;
        this[151] = VRC.KonamiVRC1Cart;
        this[152] = Discrete.Mapper152Cart;
        this[180] = Discrete.NesCart;
        this[184] = Sunsoft.Mapper184Cart;
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
            _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
        }
        return _cart;
    };
    iNESFileHandler.loadRomFile = function (thefile) {
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
        _cart.ROMHashFunction = crc.crc32(new Buffer(thefile.slice(16, thefile.length))).toString(16).toUpperCase(); //Hashers.HashFunction;
        _cart.LoadiNESCart(iNesHeader, prgRomCount, chrRomCount, theRom, chrRom, chrOffset);
        // if (_cart != null) {
        // }
        return _cart;
    };
    return iNESFileHandler;
}());
exports.iNESFileHandler = iNESFileHandler;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  crc1: __webpack_require__(12),
  crc8: __webpack_require__(13),
  crc81wire: __webpack_require__(14),
  crc16: __webpack_require__(15),
  crc16ccitt: __webpack_require__(16),
  crc16modbus: __webpack_require__(17),
  crc16xmodem: __webpack_require__(18),
  crc16kermit: __webpack_require__(19),
  crc24: __webpack_require__(20),
  crc32: __webpack_require__(21),
  crcjam: __webpack_require__(22)
};

/***/ }),
/* 12 */
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
/* 13 */
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
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
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
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
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
            this.copyBanks(0, 0, 0, 1);
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
            this.copyBanks(clock, 0, val, 1);
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
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    UxROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = val << 1;
            this.SetupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
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
    Mapper094Cart.prototype.InitializeCart = function () {
        this.mapperName = 'HVC-UN1ROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper094Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = ((val >> 2) & 0x7) << 1;
            this.SetupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
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
    Mapper081Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Super Gun';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper081Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = ((val >> 2) & 3) << 1;
            this.SetupBankStarts(newbank81, newbank81 + 1, this.currentC, this.currentE);
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
    Mapper030Cart.prototype.InitializeCart = function () {
        this.mapperName = 'UNROM-512';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper030Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            var newbank81 = 0;
            newbank81 = (val & 0x1F) << 1;
            this.SetupBankStarts(newbank81, ((newbank81 + 1) | 0), this.currentC, this.currentE);
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
    Mapper071Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Camerica UNROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
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
        this.copyBanks4k(0, 0, 0, 1);
        this.copyBanks4k(0, 1, 1, 1);
        // one 32k prg rom
        this.SetupBankStarts(0, 1, 2, 3);
        this.mirror(0, 2);
    };
    Mapper013Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000) {
            this.copyBanks4k(clock, 1, (val & 3), 1);
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
        this.usesSRAM = false;
        // this.copyBanks(0, 0, 0, 2);
        if (this.prgRomCount == 1) {
            this.SetupBankStarts(0, 1, 0, 1);
        }
        else {
            this.SetupBankStarts(0, 1, 2, 3);
        }
    };
    CNROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xffff) {
            var x = val & 0xf; // > this.chrRomCount - 1? this.chrRomCount -1 : val;
            this.copyBanks(clock, 0, x, 1);
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
    Mapper185Cart.prototype.InitializeCart = function () {
        this.mapperName = 'CNROM + CP';
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper185Cart.prototype.SetByte = function (clock, address, val) {
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
    Mapper190Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MKGGROM';
        this.usesSRAM = true;
        this.copyBanks(0, 0, 0, 2);
        this.SetupBankStarts(0, 1, 0, 1);
        this.mirror(0, 1);
    };
    Mapper190Cart.prototype.SetByte = function (clock, address, val) {
        this.setPrgRam(address, val);
        // prgBank = A14, D2, D1, D0
        if (address >= 0x8000 && address <= 0x9FFF) {
            var prgBank = (val & 7) << 1;
            this.SetupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
        }
        if (address >= 0xA000 && address <= 0xBFFF) {
            this.copyBanks2k(clock, address & 3, val, 1);
        }
        if (address >= 0xC000 && address <= 0xDFFF) {
            var prgBank = ((val & 7) + 8) << 1;
            this.SetupBankStarts(prgBank, prgBank + 1, this.currentC, this.currentE);
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
    Mapper087Cart.prototype.InitializeCart = function () {
        this.mapperName = 'CNROM Clone';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper087Cart.prototype.SetByte = function (clock, address, val) {
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
    Mapper145Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Sachen Sidewinder';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    Mapper145Cart.prototype.SetByte = function (clock, address, val) {
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
    ColorDreams.prototype.InitializeCart = function () {
        this.mapperName = 'Color Dreams';
        //  if (this.chrRomCount > 0) {
        //      this.copyBanks(0, 0, 0, 1);
        //  }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    ColorDreams.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = (val & 0x3) << 2;
            var chrbank = ((val >> 4) & 0xf);
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
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
    MHROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'GxROM';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    MHROMCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0x3;
            var prgbank = ((val >> 4) & 0x3) << 2;
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
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
    Mapper070Cart.prototype.InitializeCart = function () {
        this.mapperName = '~Family Trainer';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.mirror(0, 1);
    };
    Mapper070Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0xF) << 1;
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
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
    Mapper077Cart.prototype.InitializeCart = function () {
        this.mapperName = '~Mapper 077';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper077Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = (val & 0xF) << 2;
            var chrbank = ((val >> 4) & 0xF);
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
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
    Mapper079Cart.prototype.InitializeCart = function () {
        this.mapsBelow6000 = true;
        this.usesSRAM = false;
        this.mapperName = 'NINA-003-006';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
        }
        this.SetupBankStarts((this.prgRomCount * 2) - 4, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper079Cart.prototype.SetByte = function (clock, address, val) {
        if ((address >> 13) == 2 && (address & 0x100)) {
            var chrbank = (val & 0x7);
            var prgbank = ((val >> 3) & 0x1) << 2;
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
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
    Mapper078Cart.prototype.InitializeCart = function () {
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
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper078Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var prgbank = ((val) & 0xF) << 1;
            var chrbank = (val >> 4) & 0xF;
            var mirroring = (val >> 3) & 1;
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
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
    Mapper152Cart.prototype.InitializeCart = function () {
        this.mapperName = '~FT + onescreen mirroring';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.oneScreenOffset = 0;
        this.mirror(0, 0);
    };
    Mapper152Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0x31) << 1;
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
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
    JF1xCart.prototype.InitializeCart = function () {
        this.mapperName = 'Jaleco JF-11, JF-14';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    JF1xCart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            var newbank81 = 0;
            var chrbank = (val) & 0xF;
            var prgbank = ((val >> 4) & 0x3) << 2;
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
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
    Irem097Cart.prototype.InitializeCart = function () {
        this.mapperName = '~Irem TAM-S1 IC';
        this.usesSRAM = false;
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts((this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1, 0, 1);
    };
    Irem097Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xffff) {
            var newbankC1 = 0;
            newbankC1 = (val & 0xf) << 1;
            // keep two LOW banks, swap high banks
            // SetupBanks(newbank8, newbank8 + 1, currentC, currentE);
            this.SetupBankStarts(this.current8, this.currentA, newbankC1, newbankC1 + 1);
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
    BitCorp038Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Bit Corp Crime Busters';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, 2, 3);
    };
    BitCorp038Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x7000 && address <= 0x7FFF) {
            var newbank81 = 0;
            var prgbank = (val & 0x3) << 2;
            var chrbank = ((val >> 2) & 0x3);
            this.SetupBankStarts(prgbank, prgbank + 1, prgbank + 2, prgbank + 3);
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
    AxROMCart.prototype.InitializeCart = function () {
        this.mapperName = 'AxROM';
        this.SetupBankStarts(0, 1, 2, 3);
        this.mirror(0, 0);
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
        this.mirror(clock, 0);
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
        this.usesSRAM = true;
        this.mapperName = 'BNROM';
        this.SetupBankStarts(0, 1, 2, 3);
        if (this.chrRomCount > 1) {
            this.mapperName = 'NINA-001';
            this.isNina = true;
            this.SetByte = this.SetByteNina;
            this.SetupBankStarts(0, 1, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        }
        //this.mirror(0, 0);
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
        this.SetupBankStarts(newbank8, newbank8 + 1, newbank8 + 2, newbank8 + 3);
        // whizzler.DrawTo(clock);
    };
    BNROMCart.prototype.SetByteNina = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7fff) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 0x1ff] = val & 255;
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
                this.copyBanks4k(clock, 0, val & 0xf, 1);
                break;
            case 0x7FFF:
                // Select 4 KB CHR ROM bank for PPU $1000-$1FFF
                this.copyBanks4k(clock, 1, val & 0xf, 1);
                break;
        }
    };
    return BNROMCart;
}(AxROMCart));
exports.BNROMCart = BNROMCart;


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
// simple discrete logic multi-carts, various pirate xxxxx-in-1s
var Mapper051Cart = /** @class */ (function (_super) {
    __extends(Mapper051Cart, _super);
    function Mapper051Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper051Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Charlie Multi-Cart';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
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
            this.mirror(clock, ((val >> 7) & 0x1) + 1);
            this.copyBanks(clock, 0, (val >> 3) & 7, 1);
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
            this.copyBanks(0, 0, 0, 1);
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
    Mapper202Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Multi-Cart';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 1);
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
    Mapper212Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Multi-Cart212';
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
        }
        this.SetupBankStarts(0, 1, 3, 4);
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
            this.mirror(clock, ((address >> 3) & 0x1) + 1);
            this.copyBanks(clock, 0, bank, 1);
        }
    };
    return Mapper212Cart;
}(BaseCart_1.BaseCart));
exports.Mapper212Cart = Mapper212Cart;


/***/ }),
/* 25 */
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
        this.usesSRAM = true;
        if (this.chrRomCount > 0) {
            this.copyBanks(0, 0, 0, 2);
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
        switch (address & 0xe000) {
            case 0x6000:
                this.prgRomBank6[address & 8191] = val & 255;
                break;
            case 0x8000:
            case 0xa000:
            case 0xc000:
            case 0xe000:
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
                    this.sequence = (this.sequence + 1) | 0;
                }
                if (this.sequence === 5) {
                    var regnum = (address & 32767) >> 13;
                    this._registers[(address & 32767) >> 13] = this.accumulator;
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
        if (this.chrRomCount > 0) {
            if (this.chrRomBankMode === 1) {
                this.copyBanks4k(clock, 0, this._registers[1], 1);
                this.copyBanks4k(clock, 1, this._registers[2], 1);
            }
            else {
                this.copyBanks4k(clock, 0, this._registers[1], 1);
                this.copyBanks4k(clock, 1, this._registers[1] + 1, 1);
            }
        }
        this.bankSwitchesChanged = true;
    };
    MMC1Cart.prototype.setMMC1PrgBanking = function () {
        var reg = 0;
        if (this.prgRomCount === 32) {
            this.bank_select = (this._registers[1] & 16) << 1;
        }
        else {
            this.bank_select = 0;
        }
        switch (this.prgRomBankMode) {
            case 0:
            case 1:
                reg = (((this._registers[3] >> 1) & 0xf) << 2) + this.bank_select;
                this.SetupBankStarts(reg, reg + 1, reg + 2, reg + 3);
                break;
            case 2:
                reg = (this._registers[3] << 1) + this.bank_select;
                this.SetupBankStarts(0, 1, reg, reg + 1);
                break;
            case 3:
                reg = (this._registers[3] << 1) + this.bank_select;
                this.SetupBankStarts(reg, reg + 1, (this.prgRomCount << 1) - 2, (this.prgRomCount << 1) - 1);
                break;
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
        this.bankSwitchesChanged = true;
    };
    return MMC1Cart;
}(BaseCart_1.BaseCart));
exports.MMC1Cart = MMC1Cart;


/***/ }),
/* 26 */
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
        _this.latches = [0, 0];
        _this.banks = [0, 0, 0, 0];
        return _this;
    }
    MMC2Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC2';
        this.latches[0] = 1;
        this.latches[1] = 2;
        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;
        this.SetupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks4k(0, 0, this.banks[this.latches[0]], 1);
        this.copyBanks4k(0, 1, this.banks[this.latches[1]], 1);
    };
    MMC2Cart.prototype.GetPPUByte = function (clock, address) {
        var bank = 0;
        if (address == 0xFD8) {
            bank = (address >> 11) & 0x2;
            this.latches[0] = bank;
            this.copyBanks4k(clock, 0, this.banks[this.latches[0]], 1);
        }
        else if (address == 0xFE8) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.latches[0] = bank;
            this.copyBanks4k(clock, 0, this.banks[this.latches[0]], 1);
        }
        else if (address >= 0x1FD8 && address <= 0x1FDF) {
            bank = (address >> 11) & 0x2;
            this.latches[1] = bank;
            this.copyBanks4k(clock, 1, this.banks[this.latches[1]], 1);
        }
        else if (address >= 0x1FE8 && address <= 0x1FEF) {
            bank = ((address >> 11) & 0x2) | 0x1;
            this.latches[1] = bank;
            this.copyBanks4k(clock, 1, this.banks[this.latches[1]], 1);
        }
        bank = address >> 10;
        var newAddress = this.ppuBankStarts[bank] + (address & 1023);
        return this.chrRom[newAddress];
    };
    MMC2Cart.prototype.SetByte = function (clock, address, val) {
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
                //this.copyBanks4k(clock,0,this.banks[this.selector[0]], 1);
                this.copyBanks4k(clock, 0, this.banks[this.latches[0]], 1);
                this.Whizzler.unpackSprites();
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
    MMC4Cart.prototype.InitializeCart = function () {
        this.mapperName = 'MMC4';
        this.selector[0] = 1;
        this.selector[1] = 2;
        this.banks[0] = 0;
        this.banks[1] = 0;
        this.banks[2] = 0;
        this.banks[3] = 0;
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.copyBanks4k(0, 0, this.banks[this.selector[0]], 1);
        this.copyBanks4k(0, 1, this.banks[this.selector[1]], 1);
    };
    MMC4Cart.prototype.GetPPUByte = function (clock, address) {
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
    MMC4Cart.prototype.SetByte = function (clock, address, val) {
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
/* 27 */
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
            this.SetupBankStarts(this.prgRomCount * 2 - 2, this.prgSwitch2, this.prgSwitch1, this.prgRomCount * 2 - 1);
        }
        else {
            this.SetupBankStarts(this.prgSwitch1, this.prgSwitch2, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        }
    };
    MMC3Cart.prototype.updateScanlineCounter = function () {
        //if (scanlineCounter == -1) return;
        if (this.scanlineCounter === 0) {
            this.scanlineCounter = this._mmc3IrqVal;
            //Writing $00 to $C000 will result in a single IRQ being generated on the next rising edge of PPU A12. 
            //No more IRQs will be generated until $C000 is changed to a non-zero value, upon which the 
            // counter will start counting from the new value, generating an IRQ once it reaches zero. 
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
/* 28 */
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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cramStart = 0;
        _this.cromStart = 0;
        return _this;
    }
    Mapper068Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Sunsoft-4';
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.cramStart = this.chrRamStart;
        //this.mirror(0, 0);
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
/* 29 */
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
            this.copyBanks(0, 0, 0, 1);
        }
        this.setupBanks4k(2, this.registers);
    };
    Mapper031Cart.prototype.SetByte = function (clock, address, val) {
        if ((address & 0xFFF0) === 0x5FF0) {
            this.registers[address & 0x7] = val;
            this.setupBanks4k(2, this.registers);
        }
    };
    return Mapper031Cart;
}(BaseCart_1.BaseCart));
exports.Mapper031Cart = Mapper031Cart;


/***/ }),
/* 30 */
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
        return _this;
    }
    Smb2jCart.prototype.InitializeCart = function () {
        this.mapperName = 'Smb2j pirate';
        this.usesSRAM = false;
        this.Setup6BankStarts(6, 4, 5, 1, 7);
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
    Smb2jCart.prototype.GetByte = function (clock, address) {
        return this.nesCart[this.prgBankStarts[(address >> 12) - 0x6] + (address & 0xFFF)];
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
/* 31 */
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
        _this.reg16 = 0;
        _this.bankSelect = 0;
        return _this;
    }
    VSCart.prototype.InitializeCart = function () {
        // this.usesSRAM = true;
        this.mapperName = 'VS Unisystem';
        this.mapsBelow6000 = true;
        this.SetupBankStarts(0, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        this.mirror(0, 3);
    };
    VSCart.prototype.SetByte = function (clock, address, val) {
        this.setPrgRam(address, val);
        if (address == 0x4016) {
            this.bankSelect = val;
            var chrbank = (val >> 2) & 0x1;
            if (this.prgRomCount > 2) {
                this.SetupBankStarts(chrbank, (this.prgRomCount * 2) - 3, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
            }
            this.copyBanks(clock, 0, chrbank, 1);
        }
    };
    return VSCart;
}(BaseCart_1.BaseCart));
exports.VSCart = VSCart;


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
var BaseCart_1 = __webpack_require__(1);
var KonamiVRC1Cart = /** @class */ (function (_super) {
    __extends(KonamiVRC1Cart, _super);
    function KonamiVRC1Cart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chrLatches = [0, 0, 0, 0, 0, 0, 0, 0];
        return _this;
    }
    KonamiVRC1Cart.prototype.InitializeCart = function () {
        this.mapperName = 'KonamiVRC1';
        if (this.mapperId == 151) {
            this.mapperName = 'KonamiVRC1 (VS)';
            this.mirror(0, 3);
        }
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
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
                if (!this.fourScreen) {
                    this.mirror(clock, (data & 1) + 1);
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
/* 33 */
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
var KonamiVRC2_1 = __webpack_require__(4);
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
    Konami026Cart.prototype.InitializeCart = function () {
        this.mapperName = 'KonamiVRC6';
        this.SetupBankStarts(0, 0, this.prgRomCount * 2 - 2, this.prgRomCount * 2 - 1);
        this.copyBanks4k(0, 0, 0, 2);
    };
    Konami026Cart.prototype.SetByte = function (clock, address, data) {
        switch (address & 0xF000) {
            case 0x8000:
                if (address <= 0x8003) {
                    // 16kib prg rom at 8000
                    var bank8 = (data & 0xF) << 1;
                    this.SetupBankStarts(bank8, bank8 + 1, this.currentC, this.currentE);
                }
                break;
            case 0xC000:
                if (address <= 0xC003) {
                    // 8kib prg rom at C000
                    var bankC = data & 0xF;
                    this.SetupBankStarts(this.current8, this.currentA, bankC, this.currentE);
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
/* 34 */
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
var Mapper093Cart = /** @class */ (function (_super) {
    __extends(Mapper093Cart, _super);
    function Mapper093Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper093Cart.prototype.InitializeCart = function () {
        this.usesSRAM = true;
        this.mapperName = 'Sunsoft-2';
        // if (this.chrRomCount > 0) {
        //     this.copyBanks(0, 0, 0, 1);
        // }
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
var Mapper089Cart = /** @class */ (function (_super) {
    __extends(Mapper089Cart, _super);
    function Mapper089Cart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapper089Cart.prototype.InitializeCart = function () {
        this.mapperName = 'Sunsoft-2 on 3';
        // if (this.chrRomCount > 0) {
        //     this.copyBanks(0, 0, 0, 1);
        // }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    Mapper089Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x8000 && address <= 0xFFFF) {
            var lobank = val & 0x7;
            lobank |= ((val >> 4) & 8);
            var prgbank = ((val >> 4) & 0x7) << 1;
            var mirror = (val & 8) ? 1024 : 0;
            this.oneScreenOffset = mirror;
            this.mirror(clock, 0);
            this.SetupBankStarts(prgbank, prgbank + 1, this.currentC, this.currentE);
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
    Mapper184Cart.prototype.InitializeCart = function () {
        this.usesSRAM = false;
        this.mapperName = 'Sunsoft-1';
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
        // this.copyBanks4k(0, 0, 0, 1);
        // this.copyBanks4k(0, 3, 1, 1);
    };
    Mapper184Cart.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            var lobank = val & 0xf;
            var hibank = (val >> 4);
            this.copyBanks4k(clock, 0, lobank, 1);
            this.copyBanks4k(clock, 1, hibank, 1);
        }
    };
    return Mapper184Cart;
}(BaseCart_1.BaseCart));
exports.Mapper184Cart = Mapper184Cart;


/***/ })
/******/ ]);
});