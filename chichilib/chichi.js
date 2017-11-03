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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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



var base64 = __webpack_require__(11)
var ieee754 = __webpack_require__(12)
var isArray = __webpack_require__(13)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 1 */
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
/* 2 */
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(3);
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiCarts_1 = __webpack_require__(6);
var ChiChiAudio_1 = __webpack_require__(7);
var ChiChiTypes_1 = __webpack_require__(3);
var ChiChiControl_1 = __webpack_require__(8);
var ChiChiPPU_1 = __webpack_require__(4);
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
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
var crc = __webpack_require__(14);
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
                _cart = new NesCart();
                break;
            case 3:
                _cart = new CNROMCart();
                break;
            case 87:
                _cart = new Mapper087Cart();
                break;
            case 145:
                _cart = new Mapper145Cart();
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
            case 70:
                _cart = new Mapper070Cart();
                break;
            case 152:
                _cart = new Mapper152Cart();
                break;
            case 140:
                _cart = new JF1xCart();
                break;
            case 38:
                _cart = new BitCorp038Cart();
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
            _cart.ROMHashFunction = crc.crc32(new Buffer(thefile.slice(16, thefile.length))).toString(16).toUpperCase(); //Hashers.HashFunction;
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
        if (this.mapperId === 3 && address >= 0x8000) {
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
            this.CopyBanks(clock, 0, val, 1);
        }
    };
    return CNROMCart;
}(NesCart));
exports.CNROMCart = CNROMCart;
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
}(NesCart));
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
}(NesCart));
exports.Mapper145Cart = Mapper145Cart;
var VSSystemGames = /** @class */ (function (_super) {
    __extends(VSSystemGames, _super);
    function VSSystemGames() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //for (var i = 0; i < 8; i = (i + 1) | 0) {
        //    this.prevBSSrc[i] = -1;
        //}
        //SRAMEnabled = SRAMCanSave;
        _this.supported = false;
        return _this;
    }
    VSSystemGames.prototype.InitializeCart = function () {
        this.mapperName = 'VS System';
        if (this.chrRomCount > 0) {
            this.CopyBanks(0, 0, 0, 1);
        }
        this.SetupBankStarts(0, 1, (this.prgRomCount * 2) - 2, (this.prgRomCount * 2) - 1);
    };
    VSSystemGames.prototype.SetByte = function (clock, address, val) {
        if (address >= 0x6000 && address <= 0x7FFF) {
            if (this.SRAMEnabled) {
                this.prgRomBank6[address & 8191] = val & 255;
            }
            return;
        }
        // TODO: Cpu.ppu mem mapping needs changing vs unisystem and pc10 (new machine extensions?)
        if (address >= 4016) {
            var chrbank = val;
            this.Whizzler.DrawTo(clock);
            this.CopyBanks(clock, 0, chrbank, 1);
        }
    };
    return VSSystemGames;
}(NesCart));
exports.VSSystemGames = VSSystemGames;
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
}(NesCart));
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
}(NesCart));
exports.Mapper070Cart = Mapper070Cart;
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
}(NesCart));
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
}(NesCart));
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
}(NesCart));
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
}(NesCart));
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(3);
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
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiMachine_1 = __webpack_require__(5);
exports.ChiChiCPPU = ChiChiMachine_1.ChiChiCPPU;
exports.ChiChiMachine = ChiChiMachine_1.ChiChiMachine;
var ChiChiNsfMachine_1 = __webpack_require__(26);
exports.ChiChiNsfCPPU = ChiChiNsfMachine_1.ChiChiNsfCPPU;
exports.ChiChiNsfMachine = ChiChiNsfMachine_1.ChiChiNsfMachine;
var ChiChiCarts_1 = __webpack_require__(6);
exports.BaseCart = ChiChiCarts_1.BaseCart;
exports.NesCart = ChiChiCarts_1.NesCart;
exports.AxROMCart = ChiChiCarts_1.AxROMCart;
exports.NsfCart = ChiChiCarts_1.NsfCart;
exports.MMC1Cart = ChiChiCarts_1.MMC1Cart;
exports.MMC3Cart = ChiChiCarts_1.MMC3Cart;
exports.iNESFileHandler = ChiChiCarts_1.iNESFileHandler;
var ChiChiControl_1 = __webpack_require__(8);
exports.ChiChiInputHandler = ChiChiControl_1.ChiChiInputHandler;
var ChiChiAudio_1 = __webpack_require__(7);
exports.WavSharer = ChiChiAudio_1.WavSharer;
exports.ChiChiBopper = ChiChiAudio_1.ChiChiBopper;
var ChiChiPPU_1 = __webpack_require__(4);
exports.ChiChiPPU = ChiChiPPU_1.ChiChiPPU;
var ChiChiTypes_1 = __webpack_require__(3);
exports.RunningStatuses = ChiChiTypes_1.RunningStatuses;
exports.ChiChiCPPU_AddressingModes = ChiChiTypes_1.ChiChiCPPU_AddressingModes;
exports.CpuStatus = ChiChiTypes_1.CpuStatus;
exports.PpuStatus = ChiChiTypes_1.PpuStatus;
exports.ChiChiInstruction = ChiChiTypes_1.ChiChiInstruction;
exports.ChiChiSprite = ChiChiTypes_1.ChiChiSprite;
exports.AudioSettings = ChiChiTypes_1.AudioSettings;
var ChiChiCheats_1 = __webpack_require__(27);
exports.GameGenieCode = ChiChiCheats_1.GameGenieCode;
exports.ChiChiCheats = ChiChiCheats_1.ChiChiCheats;


/***/ }),
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  crc1: __webpack_require__(15),
  crc8: __webpack_require__(16),
  crc81wire: __webpack_require__(17),
  crc16: __webpack_require__(18),
  crc16ccitt: __webpack_require__(19),
  crc16modbus: __webpack_require__(20),
  crc16xmodem: __webpack_require__(21),
  crc16kermit: __webpack_require__(22),
  crc24: __webpack_require__(23),
  crc32: __webpack_require__(24),
  crcjam: __webpack_require__(25)
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _buffer = __webpack_require__(0);

var _create_buffer = __webpack_require__(1);

var _create_buffer2 = _interopRequireDefault(_create_buffer);

var _define_crc = __webpack_require__(2);

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
var ChiChiMachine_1 = __webpack_require__(5);
var ChiChiPPU_1 = __webpack_require__(4);
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
/* 27 */
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
    ChiChiCheats.prototype.getCheatsForGame = function (crc) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(XmlHolder.ggXML, 'text/xml');
        var ggCodes = new Array();
        var nodes = xmlDoc.evaluate('/database/game[@crc="' + crc + '"]/gamegenie', xmlDoc, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();
        while (result) {
            var ggCode = {
                code: result.attributes.code.value,
                description: result.attributes.description.value,
                active: false
            };
            ggCodes.push(ggCode);
            result = nodes.iterateNext();
        }
        return ggCodes;
    };
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
    XmlHolder.ggXML = "<database>\n    <game code=\"CLV-H-FKTWT\" name=\"10-Yard Fight\" crc=\"3D564757\">\n      <gamegenie code=\"ZEEXIPIE\" description=\"Your team runs faster\" />\n    </game>\n    <game code=\"CLV-H-THQIF\" name=\"1942\" crc=\"171251E3\">\n      <gamegenie code=\"SZXLKEVK\" description=\"Infinite lives - 1P game\" />\n      <gamegenie code=\"OLZNEE\" description=\"Don't die when touched\" />\n      <gamegenie code=\"PAEIXKNY\" description=\"Most enemies die instantly\" />\n      <gamegenie code=\"SZESPUVK\" description=\"Infinite rolls\" />\n      <gamegenie code=\"AEUSGZAP\" description=\"Rapid fire\" />\n      <gamegenie code=\"ALKUTGEL\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"SXULIKSO\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"SZELGKSO\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"SZKULGAX\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"IESUTYZA\" description=\"Start with 6 lives - 1P game\" />\n      <gamegenie code=\"AESUTYZE\" description=\"Start with 9 lives - 1P game\" />\n      <gamegenie code=\"IAKUUAZA\" description=\"After continue, P1 has 6 lives in 2P game\" />\n      <gamegenie code=\"AAKUUAZE\" description=\"After continue, P1 has 9 lives in 2P game\" />\n      <gamegenie code=\"IASUOAZA\" description=\"P2 has 6 lives - 2P game\" />\n      <gamegenie code=\"AASUOAZE\" description=\"P2 has 9 lives - 2P game\" />\n      <gamegenie code=\"PASIOALE\" description=\"Start with 9 rolls - both players\" />\n    </game>\n    <game code=\"CLV-H-LSFTO\" name=\"1943: The Battle of Midway\" crc=\"12C6D5C7\">\n      <gamegenie code=\"SUTXGN\" description=\"Infinite power-ups\" />\n      <gamegenie code=\"SGOUZUVK\" description=\"Infinite weapon upgrade time\" />\n      <gamegenie code=\"OUNLAZGA\" description=\"Infinite energy\" />\n      <gamegenie code=\"SXVLZXSE\" description=\"Infinite energy (alt 2) (1 of 2)\" />\n      <gamegenie code=\"VVOULXVK\" description=\"Infinite energy (alt 2) (2 of 2)\" />\n      <gamegenie code=\"NSKIELGA\" description=\"Don't instantly die from touching boss planes\" />\n      <gamegenie code=\"LEEPXLAE\" description=\"Always shoot power shots\" />\n      <gamegenie code=\"ZESNLLLE\" description=\"10 power points\" />\n      <gamegenie code=\"GOSNLLLA\" description=\"20 power points\" />\n      <gamegenie code=\"TOSNLLLE\" description=\"30 power points\" />\n      <gamegenie code=\"AENSKLAP\" description=\"Hit anywhere (1 of 7)\" />\n      <gamegenie code=\"GZESEGEL\" description=\"Hit anywhere (2 of 7)\" />\n      <gamegenie code=\"SLSKOEOO\" description=\"Hit anywhere (3 of 7)\" />\n      <gamegenie code=\"SXOINUOO\" description=\"Hit anywhere (4 of 7)\" />\n      <gamegenie code=\"SXXGVEOO\" description=\"Hit anywhere (5 of 7)\" />\n      <gamegenie code=\"SZKTSXOO\" description=\"Hit anywhere (6 of 7)\" />\n      <gamegenie code=\"SZVGSVOO\" description=\"Hit anywhere (7 of 7)\" />\n      <gamegenie code=\"AEVYZLAE\" description=\"Start on mission 5\" />\n      <gamegenie code=\"ZOVYZLAA\" description=\"Start on mission 10\" />\n      <gamegenie code=\"GOVYZLAE\" description=\"Start on mission 15\" />\n      <gamegenie code=\"TXVYZLAA\" description=\"Start on mission 20\" />\n    </game>\n    <game code=\"CLV-H-IHFWY\" name=\"3-D Battles of Worldrunner, The\" crc=\"E6A477B2\">\n      <gamegenie code=\"ATPXIG\" description=\"Invincibility\" />\n      <gamegenie code=\"AEUOLTPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXUPZGVG\" description=\"Infinite time\" />\n      <gamegenie code=\"NNXOYGEK\" description=\"Slow down timer\" />\n      <gamegenie code=\"AVXOYGEG\" description=\"Speed up timer\" />\n      <gamegenie code=\"OXUONISX\" description=\"Autofire\" />\n      <gamegenie code=\"AEUOVIGA\" description=\"Start with and keep laser missiles\" />\n      <gamegenie code=\"PEUPPTLA\" description=\"Start with 1 life (1 of 2)\" />\n      <gamegenie code=\"PLVOLTLL\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"TEUPPTLA\" description=\"Start with 6 lives (1 of 2)\" />\n      <gamegenie code=\"TLVOLTLL\" description=\"Start with 6 lives (2 of 2)\" />\n      <gamegenie code=\"PEUPPTLE\" description=\"Start with 9 lives (1 of 2)\" />\n      <gamegenie code=\"PLVOLTLU\" description=\"Start with 9 lives (2 of 2)\" />\n      <gamegenie code=\"XZEAUOOZ\" description=\"Start on world XX (1 of 3)\" />\n      <gamegenie code=\"VAEASPSA\" description=\"Start on world XX (2 of 3)\" />\n      <gamegenie code=\"PAEAKPAA\" description=\"Start on world 2 (3 of 3)\" />\n      <gamegenie code=\"ZAEAKPAA\" description=\"Start on world 3 (3 of 3)\" />\n      <gamegenie code=\"LAEAKPAA\" description=\"Start on world 4 (3 of 3)\" />\n      <gamegenie code=\"GAEAKPAA\" description=\"Start on world 5 (3 of 3)\" />\n      <gamegenie code=\"IAEAKPAA\" description=\"Start on world 6 (3 of 3)\" />\n      <gamegenie code=\"TAEAKPAA\" description=\"Start on world 7 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-IXXON\" name=\"720\u00B0\" crc=\"49F745E0\">\n      <gamegenie code=\"SZUYASVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"PEXKLZLE\" description=\"9 continues\" />\n      <gamegenie code=\"TEXKLZLA\" description=\"6 continues\" />\n      <gamegenie code=\"PEXKLZLA\" description=\"No continues instead of 2\" />\n      <gamegenie code=\"GEKKYZAA\" description=\"Start with all equipment\" />\n      <gamegenie code=\"ZEKKYZAA\" description=\"Start with half equipment\" />\n      <gamegenie code=\"XVXGGXSX\" description=\"Start on level XX (1 of 2)\" />\n      <gamegenie code=\"OXXGIXTE\" description=\"Start on level XX (2 of 2)\" />\n      <gamegenie code=\"ZEXGTZZA\" description=\"Start on level 2 (3 of 3)\" />\n      <gamegenie code=\"LEXGTZZA\" description=\"Start on level 3 (3 of 3)\" />\n      <gamegenie code=\"GEXGTZZA\" description=\"Start on level 4 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-QZIVA\" name=\"8 Eyes\" crc=\"326AB3B6\">\n      <gamegenie code=\"EIUUSLEY\" description=\"Invincibility - Orin\" />\n      <gamegenie code=\"EINGVPEY\" description=\"Invincibility - Cutrus\" />\n      <gamegenie code=\"SXOUSUSE\" description=\"Infinite health - Orin\" />\n      <gamegenie code=\"SXNGNOSE\" description=\"Infinite health - Cutrus\" />\n      <gamegenie code=\"GXOUSUSE\" description=\"Most attacks won't damage Orin\" />\n      <gamegenie code=\"GXNGNOSE\" description=\"Most attacks won't damage Cutrus\" />\n      <gamegenie code=\"AGVXGXYZ\" description=\"Start with more health - Orin\" />\n      <gamegenie code=\"AGVXIXYZ\" description=\"Start with more health - Cutrus\" />\n      <gamegenie code=\"SAOVUTVA\" description=\"Start with all weapons\" />\n      <gamegenie code=\"YGVXTXYX\" description=\"Start with max ammo\" />\n      <gamegenie code=\"SXSLKVSE\" description=\"Infinite ammo\" />\n      <gamegenie code=\"YZVXTZAE\" description=\"Start with some item power\" />\n      <gamegenie code=\"GXSLKVSE\" description=\"Never lose item power once gained\" />\n      <gamegenie code=\"VTOVNTVA\" description=\"Start with Dagger\" />\n    </game>\n    <game code=\"CLV-H-ZOHPB\" name=\"Abadox: The Deadly Inner War\" crc=\"B134D713\">\n      <gamegenie code=\"PEIGPN\" description=\"Infinite lives (lives never decrease)\" />\n      <gamegenie code=\"VVIGAY\" description=\"Infinite lives (lives increase when you die)\" />\n      <gamegenie code=\"AVVTXYSZ\" description=\"Invincible against touching enemies\" />\n      <gamegenie code=\"AEXSLIEG\" description=\"Invincible against walls (does not stop music)\" />\n      <gamegenie code=\"EIESEIEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"EYESKTEI\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"ESSYIPEP\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"EUNNZPEI\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"EUUYPPEP\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"GZOYAZAL\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"ZANGKGPA\" description=\"Start on level 2\" />\n      <gamegenie code=\"LANGKGPA\" description=\"Start on level 3\" />\n      <gamegenie code=\"IANGKGPA\" description=\"Start on level 4\" />\n      <gamegenie code=\"TANGKGPA\" description=\"Start on level 6\" />\n    </game>\n    <game code=\"CLV-H-CLHFJ\" name=\"Addams Family, The\" crc=\"65518EAE\">\n      <gamegenie code=\"SXPATK\" description=\"Invincibility\" />\n      <gamegenie code=\"PEVGGALA\" description=\"Start with 1 life - 1st game only\" />\n      <gamegenie code=\"TEVGGALA\" description=\"Start with 6 lives - 1st game only\" />\n      <gamegenie code=\"PEVGGALE\" description=\"Start with 9 lives - 1st game only\" />\n      <gamegenie code=\"GXSVAUVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GXKKZSVK\" description=\"Infinite life\" />\n      <gamegenie code=\"GXEVLVVK\" description=\"Infinite Things\" />\n      <gamegenie code=\"AINEGYEI\" description=\"Walk through walls (1 of 2)\" />\n      <gamegenie code=\"ASEAYYEI\" description=\"Walk through walls (2 of 2)\" />\n      <gamegenie code=\"GXEZGTEP\" description=\"Get items from anywhere - from above\" />\n      <gamegenie code=\"GXEXLTEL\" description=\"Get items from anywhere - from below\" />\n      <gamegenie code=\"GXOZITEP\" description=\"Get items from anywhere - from the right\" />\n      <gamegenie code=\"GXOXYTEP\" description=\"Get items from anywhere - from the left\" />\n      <gamegenie code=\"ELEZOGEP\" description=\"No Piranha Plant enemies\" />\n      <gamegenie code=\"PEKGTAAA\" description=\"Start in the tree\" />\n      <gamegenie code=\"ZEKGTAAA\" description=\"Start in the crypt\" />\n      <gamegenie code=\"LEKGTAAA\" description=\"Start in the hallway\" />\n      <gamegenie code=\"AEKGTAAE\" description=\"Start in Fester's room\" />\n      <gamegenie code=\"PEKGTAAE\" description=\"Start in Pugsly's room\" />\n      <gamegenie code=\"ZEKGTAAE\" description=\"Start in the toy room\" />\n      <gamegenie code=\"LEKGTAAE\" description=\"Start in Wednesday's room\" />\n      <gamegenie code=\"GEKGTAAE\" description=\"Start in the attic\" />\n      <gamegenie code=\"YEKGTAAE\" description=\"Start in a secret room\" />\n      <gamegenie code=\"AOKGTAAA\" description=\"Start in a secret room\" />\n      <gamegenie code=\"POKGTAAA\" description=\"Start in a secret room\" />\n      <gamegenie code=\"IOKGTAAE\" description=\"Start in the bone room\" />\n      <gamegenie code=\"PXKGTAAA\" description=\"Start in the freezer\" />\n      <gamegenie code=\"ZXKGTAAA\" description=\"Start in the furnace\" />\n      <gamegenie code=\"AXKGTAAA\" description=\"Start in Gomez's room\" />\n    </game>\n    <game code=\"CLV-H-JUJYV\" name=\"Addams Family, The: Pugsley's Scavenger Hunt\" crc=\"063E5653\">\n      <gamegenie code=\"ATGKAG\" description=\"Invincibility\" />\n      <gamegenie code=\"SZGKAK\" description=\"Infinite health\" />\n      <gamegenie code=\"AAKGYGPA\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"ESVONGEY\" description=\"Enemies can't move horizontally\" />\n      <gamegenie code=\"EIEOEIEY\" description=\"Enemies can't move vertically\" />\n      <gamegenie code=\"APKOOIAL\" description=\"No enemies\" />\n      <gamegenie code=\"EIEKYGEY\" description=\"Sweets count as extra lives also\" />\n      <gamegenie code=\"GXOVPYEY\" description=\"Always able to fly (alt)\" />\n      <gamegenie code=\"GXUTKPEY\" description=\"Invincibility status effect\" />\n      <gamegenie code=\"PEVKZTIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PEVKZTIE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXUGZKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SULGZK\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"PENKZTZA\" description=\"Start with 1 heart\" />\n      <gamegenie code=\"GENKZTZA\" description=\"Start with 4 hearts\" />\n      <gamegenie code=\"AASVUGIL\" description=\"Always able to fly\" />\n      <gamegenie code=\"AOVTETAO\" description=\"Mega-jump\" />\n    </game>\n    <game code=\"CLV-H-RTYIH\" name=\"DragonStrike, Advanced Dungeons &amp; Dragons\" crc=\"2C5908A7\">\n      <gamegenie code=\"ATGGNY\" description=\"Invincibility\" />\n      <gamegenie code=\"SZGGNN\" description=\"Infinite health\" />\n      <gamegenie code=\"OTKGSYSV\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"GPKZGEAZ\" description=\"Start with less health - bronze dragon\" />\n      <gamegenie code=\"AIKZGEAZ\" description=\"Start with more health - bronze dragon\" />\n      <gamegenie code=\"TPKZIEGU\" description=\"Start with less health - silver dragon\" />\n      <gamegenie code=\"AIKZIEGL\" description=\"Start with more health - silver dragon\" />\n      <gamegenie code=\"ZZKZTAAS\" description=\"Start with less health - gold dragon\" />\n      <gamegenie code=\"ITKZTAAI\" description=\"Start with more health - gold dragon\" />\n      <gamegenie code=\"GZKKNNSE\" description=\"Weapon power doesn't weaken with health\" />\n      <gamegenie code=\"TTXGIALT\" description=\"Gold dragon has excellent armor class\" />\n      <gamegenie code=\"YGXKAAPG\" description=\"Gold dragon flies faster\" />\n      <gamegenie code=\"ATXGYAGV\" description=\"Silver dragon flies faster\" />\n      <gamegenie code=\"YIXGTALI\" description=\"Bronze dragon flies faster\" />\n    </game>\n    <game code=\"CLV-H-VJJOF\" name=\"Heroes of the Lance, Advanced Dungeons &amp; Dragons\" crc=\"B17574F3\">\n      <gamegenie code=\"SUOAZGSP\" description=\"Infinite HP for party in most battles\" />\n    </game>\n    <game code=\"CLV-H-LPRCU\" name=\"Hillsfar, Advanced Dungeons &amp; Dragons\" crc=\"5DE61639\">\n      <gamegenie code=\"AOULILAZ\" description=\"Faster timer when lock-picking\" />\n      <gamegenie code=\"ASULILAZ\" description=\"Slower timer when lock-picking\" />\n      <gamegenie code=\"ENULILAZ\" description=\"Very slow timer when lock-picking\" />\n      <gamegenie code=\"SXKUTSVK\" description=\"Infinite Knock Rings (1 of 2)\" />\n      <gamegenie code=\"AEKUISAI\" description=\"Infinite Knock Rings (2 of 2)\" />\n      <gamegenie code=\"IEVANKZA\" description=\"Start with 50% less gold on a character that you create\" />\n      <gamegenie code=\"YEVANKZE\" description=\"Start with 50% more gold on a character that you create\" />\n      <gamegenie code=\"GOVANKZA\" description=\"Start with 100% more gold on a character that you create\" />\n    </game>\n    <game code=\"CLV-H-BAUCD\" name=\"Pool of Radiance, Advanced Dungeons &amp; Dragons\" crc=\"25952141\">\n      <gamegenie code=\"SOLAUN\" description=\"Create super characters\" />\n      <gamegenie code=\"XGLAUN\" description=\"Girdle Of Giant strength (Must be used to be effective) (1 of 2)\" />\n      <gamegenie code=\"GGLAUP\" description=\"Girdle Of Giant strength (Must be used to be effective) (2 of 2)\" />\n      <gamegenie code=\"TLGAXL\" description=\"Extra EXP points\" />\n      <gamegenie code=\"AXLALN\" description=\"One hit ends battle with no gold or EXP\" />\n    </game>\n    <game code=\"CLV-H-NYMYR\" name=\"Adventures in the Magic Kingdom, Disney's\" crc=\"5DBD6099\">\n      <gamegenie code=\"ATPNTI\" description=\"Invincibility\" />\n      <gamegenie code=\"AVXNXPVG\" description=\"Infinite health\" />\n      <gamegenie code=\"ATXYKZEL\" description=\"Infinite time\" />\n      <gamegenie code=\"SZSTGVVK\" description=\"Infinite candles\" />\n      <gamegenie code=\"SXKYUOVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"LAKUTGTA\" description=\"'Life' costs less\" />\n      <gamegenie code=\"GAKUTGTE\" description=\"'Life' costs more\" />\n      <gamegenie code=\"GAKUYKAA\" description=\"'Freeze' costs less\" />\n      <gamegenie code=\"YAKUYKAE\" description=\"'Freeze' costs more\" />\n      <gamegenie code=\"IASLAKZA\" description=\"'Invincible' costs less\" />\n      <gamegenie code=\"GPSLAKZA\" description=\"'Invincible' costs more\" />\n      <gamegenie code=\"TASLPKGA\" description=\"'Life Up' costs less\" />\n      <gamegenie code=\"APSLPKGE\" description=\"'Life Up' costs more\" />\n      <gamegenie code=\"PEVEIALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEVEIALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEVEIALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXKYUOVK\" description=\"Never lose a life in 'attractions'\" />\n      <gamegenie code=\"NYKULZKU\" description=\"More 'Freeze' time\" />\n      <gamegenie code=\"AGKULZKL\" description=\"Less 'Freeze' time\" />\n      <gamegenie code=\"EGSUYXGL\" description=\"More 'Invincible' time\" />\n      <gamegenie code=\"EYKVNKXN\" description=\"Mega-jump\" />\n      <gamegenie code=\"PAVAZPLA\" description=\"Start with less health in attractions\" />\n      <gamegenie code=\"IAVAZPLA\" description=\"Start with more health in attractions\" />\n      <gamegenie code=\"PAVAZPLE\" description=\"Start with even more health in attractions\" />\n      <gamegenie code=\"SXXNXPVG\" description=\"Almost infinite health in attractions\" />\n      <gamegenie code=\"GXELLXSN\" description=\"All items for free (1 of 2)\" />\n      <gamegenie code=\"AAXUAXGY\" description=\"All items for free (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SEAIR\" name=\"Adventures of Bayou Billy, The\" crc=\"67751094\">\n      <gamegenie code=\"GZOVLLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEKVIZYA\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SXOOUKVK\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"EZNATKKZ\" description=\"Always have X weapon (1 of 3)\" />\n      <gamegenie code=\"XTNEAGYE\" description=\"Always have X weapon (2 of 3)\" />\n      <gamegenie code=\"PANAYGOG\" description=\"Always have pistol (3 of 3)\" />\n      <gamegenie code=\"ZANAYGOG\" description=\"Always have knife (3 of 3)\" />\n      <gamegenie code=\"LANAYGOG\" description=\"Always have ugly stick (3 of 3)\" />\n      <gamegenie code=\"IANAYGOG\" description=\"Always have whip (3 of 3)\" />\n      <gamegenie code=\"IEOVAYGA\" description=\"Start a new game to view the ending (game A or B)\" />\n      <gamegenie code=\"AAETAGZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAETAGZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAETAGZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"UYEVGKPU\" description=\"Start on level XX (1 of 3)\" />\n      <gamegenie code=\"AAEVAGGA\" description=\"Start on level XX (2 of 3)\" />\n      <gamegenie code=\"PAEVZGAA\" description=\"Start on level 2 (3 of 3)\" />\n      <gamegenie code=\"ZAEVZGAA\" description=\"Start on level 3 (3 of 3)\" />\n      <gamegenie code=\"LAEVZGAA\" description=\"Start on level 4 (3 of 3)\" />\n      <gamegenie code=\"GAEVZGAA\" description=\"Start on level 5 (3 of 3)\" />\n      <gamegenie code=\"IAEVZGAA\" description=\"Start on level 6 (3 of 3)\" />\n      <gamegenie code=\"TAEVZGAA\" description=\"Start on level 7 (3 of 3)\" />\n      <gamegenie code=\"YAEVZGAA\" description=\"Start on level 8 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-BBXDC\" name=\"Captain Comic: The Adventure\" crc=\"A5E89675\">\n      <gamegenie code=\"SLATVK\" description=\"Infinite health\" />\n      <gamegenie code=\"SZATZN\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZATEK\" description=\"Invincibility\" />\n    </game>\n    <game code=\"CLV-H-JJUKX\" name=\"Adventures of Dino Riki\" crc=\"9BDE3267\">\n      <gamegenie code=\"ATLAEZ\" description=\"Invincibility\" />\n      <gamegenie code=\"GKNONOSU\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"XPEPOZLE\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"YGEPEZGV\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"SZEETTVG\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"AESEPGZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IESEPGZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AESEPGZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZUENZVG\" description=\"Start with infinite life hearts\" />\n      <gamegenie code=\"GESEIGZA\" description=\"Start with 4 life hearts\" />\n      <gamegenie code=\"AESEIGZE\" description=\"Start with 8 life hearts\" />\n      <gamegenie code=\"VVEAPISA\" description=\"Start as Macho-Riki\" />\n      <gamegenie code=\"IEVASPIG\" description=\"Once Macho, stay Macho\" />\n      <gamegenie code=\"VKEAPISA\" description=\"Start and stay as Macho-Riki\" />\n      <gamegenie code=\"AEKAOPZA\" description=\"Don't fall into the pits (you'll still lose any special ability you currently have)\" />\n      <gamegenie code=\"TKSAAGSA\" description=\"Start on stage XX (1 of 2)\" />\n      <gamegenie code=\"ZEKEIGAA\" description=\"Start on stage 2-1 (2 of 2)\" />\n      <gamegenie code=\"GEKEIGAA\" description=\"Start on stage 3-1 (2 of 2)\" />\n      <gamegenie code=\"TEKEIGAA\" description=\"Start on stage 4-1 (2 of 2)\" />\n      <gamegenie code=\"AEKEIGAE\" description=\"Start on stage 4-2 (2 of 2)\" />\n      <gamegenie code=\"ZEKEIGAE\" description=\"Start on stage 4-3 (2 of 2)\" />\n      <gamegenie code=\"GEKEIGAE\" description=\"Start on stage 4-4 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-WDTDT\" name=\"After Burner\" crc=\"F699EE7E\">\n      <gamegenie code=\"SKXVPZVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SKNAXZVG\" description=\"Infinite missiles\" />\n      <gamegenie code=\"SZKOLZSA\" description=\"Invincibility\" />\n    </game>\n    <game code=\"CLV-H-AOXUC\" name=\"Air Fortress\" crc=\"35C41CD4\">\n      <gamegenie code=\"SXKKNSSE\" description=\"Infinite energy (1 of 2)\" />\n      <gamegenie code=\"SZEGOVSE\" description=\"Infinite energy (2 of 2)\" />\n      <gamegenie code=\"ESSXAYEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ENSXIYEI\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SGUPKGVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZUPKGVG\" description=\"Infinite lives outside fortress\" />\n      <gamegenie code=\"PAVPKZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAVPKZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAVPKZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"APKZNGIA\" description=\"Double Bombs on pick-up\" />\n      <gamegenie code=\"AAKPSTPA\" description=\"Infinite Beam Bullets\" />\n      <gamegenie code=\"GXKKSIST\" description=\"Don't take damage inside fortress (1 of 2)\" />\n      <gamegenie code=\"GXNKNIST\" description=\"Don't take damage inside fortress (2 of 2)\" />\n      <gamegenie code=\"YYNXUZGV\" description=\"Extra energy on pick-up(1 of 2)\" />\n      <gamegenie code=\"YNEZEZGV\" description=\"Extra energy on pick-up(2 of 2)\" />\n      <gamegenie code=\"XZSOXXPZ\" description=\"Start on level XX (1 of 3)\" />\n      <gamegenie code=\"VASOKZSA\" description=\"Start on level XX (2 of 3)\" />\n      <gamegenie code=\"PASOUZYA\" description=\"Start on level 2 (3 of 3)\" />\n      <gamegenie code=\"ZASOUZYA\" description=\"Start on level 3 (3 of 3)\" />\n      <gamegenie code=\"LASOUZYA\" description=\"Start on level 4 (3 of 3)\" />\n      <gamegenie code=\"GASOUZYA\" description=\"Start on level 5 (3 of 3)\" />\n      <gamegenie code=\"IASOUZYA\" description=\"Start on level 6 (3 of 3)\" />\n      <gamegenie code=\"TASOUZYA\" description=\"Start on level 7 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-KXJBR\" name=\"Airwolf\" crc=\"489EF6A2\">\n      <gamegenie code=\"SUTAPX\" description=\"Infinite lives\" />\n      <gamegenie code=\"SLTXSN\" description=\"Infinite health\" />\n      <gamegenie code=\"PAUGVILA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAUGVILA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAUGVILE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PVXKKKLI\" description=\"Start at last mission reached\" />\n      <gamegenie code=\"TPVAPXYE\" description=\"Start with 30 missiles\" />\n      <gamegenie code=\"IZVAPXYE\" description=\"Start with 45 missiles\" />\n      <gamegenie code=\"GXSZAPVG\" description=\"Start with infinite missiles\" />\n      <gamegenie code=\"IEVAISYA\" description=\"Sets missiles to 5 when you refuel\" />\n      <gamegenie code=\"TOVAISYE\" description=\"Sets missiles to 30 when you refuel\" />\n    </game>\n    <game code=\"CLV-H-VZVNM\" name=\"Al Unser Jr. Turbo Racing\" crc=\"5BC9D7A1\">\n      <gamegenie code=\"AENSANPZ\" description=\"Can't be slowed down by signs and grass, prevents suspension from being shot (1 of 3)\" />\n      <gamegenie code=\"SZEIOAVG\" description=\"Can't be slowed down by signs and grass, prevents suspension from being shot (2 of 3)\" />\n      <gamegenie code=\"SZSIOASA\" description=\"Can't be slowed down by signs and grass, prevents suspension from being shot (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-WTENM\" name=\"Alfred Chicken\" crc=\"63E992AC\">\n      <gamegenie code=\"SXZNIG\" description=\"Invincibility\" />\n      <gamegenie code=\"AVGLXA\" description=\"Infinite time (alt)\" />\n      <gamegenie code=\"SXGNXE\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"AASGITZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PASGITZA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"EVKNKAPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"AVULEESZ\" description=\"Infinite time\" />\n      <gamegenie code=\"NNXYKPZU\" description=\"255 points for each present collected\" />\n      <gamegenie code=\"GVXYKPZL\" description=\"108 points for each present collected\" />\n      <gamegenie code=\"PAKLTPTA\" description=\"Only need 1 diamond for an extra life\" />\n      <gamegenie code=\"OZXKXZOU\" description=\"X balloons needed to complete a level (1 of 2)\" />\n      <gamegenie code=\"LAXKUZPI\" description=\"3 balloons needed to complete a level (2 of 2)\" />\n      <gamegenie code=\"ZAXKUZPI\" description=\"2 balloons needed to complete a level (2 of 2)\" />\n      <gamegenie code=\"PAXKUZPI\" description=\"1 balloon needed to complete a level (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BSELI\" name=\"Alien\u00B3\" crc=\"C527C297\">\n      <gamegenie code=\"SXOPNKVK\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"YEKVUPGV\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"YESIGIGV\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"AEOLYVIA\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"ATKYZIST\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"SXUYUXSE\" description=\"Infinite health\" />\n      <gamegenie code=\"SUEUTXSO\" description=\"Infinite time\" />\n      <gamegenie code=\"SZKVZXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXOSNKVT\" description=\"Infinite gun heat\" />\n      <gamegenie code=\"IPUZTALA\" description=\"Super-jump (1 of 2)\" />\n      <gamegenie code=\"IPUXPALA\" description=\"Super-jump (2 of 2)\" />\n      <gamegenie code=\"AASGKNYA\" description=\"Invincible against long falls\" />\n      <gamegenie code=\"NNKVNPAE\" description=\"Always have Radar\" />\n      <gamegenie code=\"SZVXVXVK\" description=\"Infinite Radar\" />\n      <gamegenie code=\"SXXSNKVK\" description=\"Infinite ammo for Machine gun\" />\n      <gamegenie code=\"SZVSSKVK\" description=\"Infinite ammo for Grenade Launcher\" />\n      <gamegenie code=\"SZKLVSVK\" description=\"Infinite ammo for Grenade Launcher 2\" />\n      <gamegenie code=\"SZEIUOVK\" description=\"Infinite ammo for Flame Thrower\" />\n      <gamegenie code=\"TUVUYLZG\" description=\"Level skip (pause and press any key (except left)\" />\n    </game>\n    <game code=\"CLV-H-LVJIN\" name=\"Alien Syndrome\" crc=\"CBF4366F\">\n      <gamegenie code=\"SZUNYXVK\" description=\"Infinite time\" />\n      <gamegenie code=\"GUONPPLL\" description=\"Set timer to 440\" />\n      <gamegenie code=\"PAOGPIGA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"AAOGPIGE\" description=\"Start with 8 lives - both players\" />\n      <gamegenie code=\"PAVKGIAA\" description=\"Start with Flame Thrower\" />\n      <gamegenie code=\"ZAVKGIAA\" description=\"Start with Fireball\" />\n      <gamegenie code=\"LAVKGIAA\" description=\"Start with Laser\" />\n      <gamegenie code=\"AEEKXONY\" description=\"Don't lose life when shot or touched\" />\n      <gamegenie code=\"AANGVXNY\" description=\"Don't lose life from falling down holes\" />\n      <gamegenie code=\"PEXGGLGA\" description=\"1 life after continue\" />\n      <gamegenie code=\"AEXGGLGE\" description=\"8 lives after continue\" />\n      <gamegenie code=\"KUNNXLAA\" description=\"Start on round X (1 of 3)\" />\n      <gamegenie code=\"LENNULAZ\" description=\"Start on round X (2 of 3)\" />\n      <gamegenie code=\"PENNELAP\" description=\"Start on round 2 (3 of 3)\" />\n      <gamegenie code=\"ZENNELAP\" description=\"Start on round 3 (3 of 3)\" />\n      <gamegenie code=\"LENNELAP\" description=\"Start on round 4 (3 of 3)\" />\n      <gamegenie code=\"GENNELAP\" description=\"Start on round 5 (3 of 3)\" />\n      <gamegenie code=\"IENNELAP\" description=\"Start on round 6 (3 of 3)\" />\n      <gamegenie code=\"TENNELAP\" description=\"Start on round 7 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-MZRUJ\" name=\"Alpha Mission\" crc=\"DBF90772\">\n      <gamegenie code=\"OUXKZPOP\" description=\"Invincibility\" />\n      <gamegenie code=\"SXSPYZVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PASATLLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TASATLLA\" description=\"Start with double lives\" />\n      <gamegenie code=\"PASATLLE\" description=\"Start with triple lives\" />\n      <gamegenie code=\"NYKAYLLE\" description=\"Start with all weapons available\" />\n      <gamegenie code=\"GZNAILSA\" description=\"Keep power up after death\" />\n      <gamegenie code=\"GZNAYLSA\" description=\"Keep energy after death\" />\n      <gamegenie code=\"GAEOUEAA\" description=\"Thunder uses 25% normal energy\" />\n      <gamegenie code=\"TEXLPTZA\" description=\"Triple energy gained on 'E' pick-up\" />\n      <gamegenie code=\"ZEULGTGA\" description=\"Less energy lost on 'Bad E' pick-ups\" />\n      <gamegenie code=\"SZEGGASA\" description=\"Shield doesn't use energy\" />\n      <gamegenie code=\"IZNAEGSA\" description=\"You can re-use weapon after selecting\" />\n    </game>\n    <game code=\"CLV-H-OBKIN\" name=\"Amagon\" crc=\"E2B43A68\">\n      <gamegenie code=\"ESNIZLEY\" description=\"Invincibility\" />\n      <gamegenie code=\"AVOXGOOZ\" description=\"Invincible against enemies\" />\n      <gamegenie code=\"ATXZPOOZ\" description=\"Invincible against bullets\" />\n      <gamegenie code=\"AVNZAOOZ\" description=\"Invincible against area boss\" />\n      <gamegenie code=\"AAXGNYPA\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"PEOVIZGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"AEOVIZGE\" description=\"Start with 8 lives\" />\n      <gamegenie code=\"GZSZIZSP\" description=\"Infinite mega-power\" />\n      <gamegenie code=\"PEOVPZGA\" description=\"Start with no bullets\" />\n      <gamegenie code=\"YEOVPZGA\" description=\"Start with 600 bullets\" />\n      <gamegenie code=\"AAVYLTPA\" description=\"Infinite ammo\" />\n      <gamegenie code=\"SLVYGTSP\" description=\"Infinite ammo (alt)\" />\n      <gamegenie code=\"PAVKUIZA\" description=\"Gain 10 bullets on pick-up\" />\n      <gamegenie code=\"LAVKUIZA\" description=\"Gain 30 bullets on pick-up\" />\n    </game>\n    <game code=\"CLV-H-YHPFR\" name=\"American Gladiators\" crc=\"1973AEA8\">\n      <gamegenie code=\"PEXALTIA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"AEXALTIE\" description=\"Start with 8 lives - P1\" />\n      <gamegenie code=\"ZEXALTIE\" description=\"Start with 10 lives - P1\" />\n      <gamegenie code=\"GOXALTIA\" description=\"Start with 20 lives - P1\" />\n      <gamegenie code=\"PEVALTIA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"AEVALTIE\" description=\"Start with 8 lives - P2\" />\n      <gamegenie code=\"ZEVALTIE\" description=\"Start with 10 lives - P2\" />\n      <gamegenie code=\"GOVALTIA\" description=\"Start with 20 lives - P2\" />\n      <gamegenie code=\"PEXAPTAA\" description=\"Start on level 2 - P1\" />\n      <gamegenie code=\"ZEXAPTAA\" description=\"Start on level 3 - P1\" />\n      <gamegenie code=\"LEXAPTAA\" description=\"Start on level 4 - P1\" />\n      <gamegenie code=\"PEVAPTAA\" description=\"Start on level 2 - P2\" />\n      <gamegenie code=\"ZEVAPTAA\" description=\"Start on level 3 - P2\" />\n      <gamegenie code=\"LEVAPTAA\" description=\"Start on level 4 - P2\" />\n      <gamegenie code=\"GLUOZGLV\" description=\"Less joust time\" />\n      <gamegenie code=\"GZXXLUVK\" description=\"Stop joust timer\" />\n      <gamegenie code=\"GLOEGALV\" description=\"Less cannonball time\" />\n      <gamegenie code=\"GZEPGOVK\" description=\"Stop cannonball time\" />\n      <gamegenie code=\"GLKXXZLV\" description=\"Less wall time\" />\n      <gamegenie code=\"GXOXEXVS\" description=\"Stop wall timer\" />\n      <gamegenie code=\"LTXATNIL\" description=\"More assault time\" />\n      <gamegenie code=\"PZXATNIU\" description=\"Less assault time\" />\n      <gamegenie code=\"GZSAINVK\" description=\"Stop assault timer\" />\n      <gamegenie code=\"LTSOZOIL\" description=\"More power ball time - level 1\" />\n      <gamegenie code=\"LTSOLOAL\" description=\"More power ball time - level 2\" />\n      <gamegenie code=\"LTSOGPLL\" description=\"More power ball time - level 3\" />\n      <gamegenie code=\"LTSOIOTZ\" description=\"More power ball time - level 4\" />\n    </game>\n    <game code=\"CLV-H-OTXZO\" name=\"Anticipation\" crc=\"99A9F57E\">\n      <gamegenie code=\"ZUUPYNPP\" description=\"More time to answer questions\" />\n      <gamegenie code=\"YEUPYNPO\" description=\"Less time to answer questions\" />\n      <gamegenie code=\"AANZATEG\" description=\"Infinite chances\" />\n    </game>\n    <game code=\"CLV-H-CIKTQ\" name=\"Arch Rivals: A Basketbrawl!\" crc=\"C740EB46\">\n      <gamegenie code=\"GZVPOZEI\" description=\"Never miss a shot - both players\" />\n      <gamegenie code=\"ALXLNZGU\" description=\"More time for a quarter (1 of 2)\" />\n      <gamegenie code=\"ALNLPPGU\" description=\"More time for a quarter (2 of 2)\" />\n      <gamegenie code=\"ZLXLNZGL\" description=\"Less time for a quarter (1 of 2)\" />\n      <gamegenie code=\"ZLNLPPGL\" description=\"Less time for a quarter (2 of 2)\" />\n      <gamegenie code=\"AVNPLAAZ\" description=\"Run faster without ball (1 of 2)\" />\n      <gamegenie code=\"ATVPAPAZ\" description=\"Run faster without ball (2 of 2)\" />\n      <gamegenie code=\"IXVOPAGA\" description=\"Super speed (1 of 2)\" />\n      <gamegenie code=\"IZSPGPGA\" description=\"Super speed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-JTOPO\" name=\"Archon\" crc=\"F304F1B9\">\n      <gamegenie code=\"AASSIEUT\" description=\"Unrestricted ground movement\" />\n      <gamegenie code=\"AAKIGAGA\" description=\"Unrestricted flying movement\" />\n    </game>\n    <game code=\"CLV-H-RYPYJ\" name=\"Arkanoid\" crc=\"32FB0583\">\n      <gamegenie code=\"OZNEATVK\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"SZNEATVG\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"AESXNALL\" description=\"Paddle hits ball anywhere (1 of 2)\" />\n      <gamegenie code=\"ASVZNAEP\" description=\"Paddle hits ball anywhere (2 of 2)\" />\n      <gamegenie code=\"PAOPUGLA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"TAOPUGLA\" description=\"Start with 6 lives - P1\" />\n      <gamegenie code=\"PAOPUGLE\" description=\"Start with 9 lives - P1\" />\n      <gamegenie code=\"SXVATAAX\" description=\"No lasers\" />\n      <gamegenie code=\"VVZZPP\" description=\"Square ball\" />\n      <gamegenie code=\"GZOONGPA\" description=\"Start on boss level\" />\n      <gamegenie code=\"AAOONGPA\" description=\"Start on level 00\" />\n      <gamegenie code=\"PAOONGPA\" description=\"Start on level 01\" />\n      <gamegenie code=\"ZAOONGPA\" description=\"Start on level 02\" />\n      <gamegenie code=\"LAOONGPA\" description=\"Start on level 03\" />\n      <gamegenie code=\"GAOONGPA\" description=\"Start on level 04\" />\n      <gamegenie code=\"IAOONGPA\" description=\"Start on level 05\" />\n      <gamegenie code=\"TAOONGPA\" description=\"Start on level 06\" />\n      <gamegenie code=\"YAOONGPA\" description=\"Start on level 07\" />\n      <gamegenie code=\"AAOONGPE\" description=\"Start on level 08\" />\n      <gamegenie code=\"PAOONGPE\" description=\"Start on level 09\" />\n      <gamegenie code=\"ZAOONGPE\" description=\"Start on level 10\" />\n      <gamegenie code=\"LAOONGPE\" description=\"Start on level 11\" />\n      <gamegenie code=\"GAOONGPE\" description=\"Start on level 12\" />\n      <gamegenie code=\"IAOONGPE\" description=\"Start on level 13\" />\n      <gamegenie code=\"TAOONGPE\" description=\"Start on level 14\" />\n      <gamegenie code=\"YAOONGPE\" description=\"Start on level 15\" />\n      <gamegenie code=\"APOONGPA\" description=\"Start on level 16\" />\n      <gamegenie code=\"PPOONGPA\" description=\"Start on level 17\" />\n      <gamegenie code=\"ZPOONGPA\" description=\"Start on level 18\" />\n      <gamegenie code=\"LPOONGPA\" description=\"Start on level 19\" />\n      <gamegenie code=\"GPOONGPA\" description=\"Start on level 20\" />\n      <gamegenie code=\"IPOONGPA\" description=\"Start on level 21\" />\n      <gamegenie code=\"YPOONGPA\" description=\"Start on level 22\" />\n      <gamegenie code=\"YPOONGPA\" description=\"Start on level 23\" />\n      <gamegenie code=\"APOONGPE\" description=\"Start on level 24\" />\n      <gamegenie code=\"PPOONGPE\" description=\"Start on level 25\" />\n      <gamegenie code=\"ZPOONGPE\" description=\"Start on level 26\" />\n      <gamegenie code=\"LPOONGPE\" description=\"Start on level 27\" />\n      <gamegenie code=\"GPOONGPE\" description=\"Start on level 28\" />\n      <gamegenie code=\"IPOONGPE\" description=\"Start on level 29\" />\n      <gamegenie code=\"TPOONGPE\" description=\"Start on level 30\" />\n      <gamegenie code=\"YPOONGPE\" description=\"Start on level 31\" />\n      <gamegenie code=\"AZOONGPA\" description=\"Start on level 32\" />\n      <gamegenie code=\"PZOONGPA\" description=\"Start on level 33\" />\n      <gamegenie code=\"ZZOONGPA\" description=\"Start on level 34\" />\n      <gamegenie code=\"LZOONGPA\" description=\"Start on level 35\" />\n      <gamegenie code=\"GZOONGPA\" description=\"Start on level 36\" />\n    </game>\n    <game code=\"CLV-H-WJFTK\" name=\"Arkista's Ring\" crc=\"1425D7F4\">\n      <gamegenie code=\"AAXXXTEG\" description=\"Hit anywhere\" />\n      <gamegenie code=\"AAKPZNAP\" description=\"Walk through walls (1 of 4)\" />\n      <gamegenie code=\"AAOPYNYA\" description=\"Walk through walls (2 of 4)\" />\n      <gamegenie code=\"AEEOZNKP\" description=\"Walk through walls (3 of 4)\" />\n      <gamegenie code=\"AESOGTTP\" description=\"Walk through walls (4 of 4)\" />\n      <gamegenie code=\"PAKETILA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAKETILA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAKETILE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZULXKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"ZAKATIIA\" description=\"Start with fewer hearts\" />\n      <gamegenie code=\"PAKATIIE\" description=\"Start with more hearts\" />\n      <gamegenie code=\"LAEPYSYA\" description=\"Less damage from powerful monsters\" />\n      <gamegenie code=\"GZOPTIST\" description=\"Infinite health\" />\n      <gamegenie code=\"IPUAGSLA\" description=\"Start with 20 continues\" />\n      <gamegenie code=\"TAUAGSLA\" description=\"Start with 5 continues\" />\n    </game>\n    <game code=\"CLV-H-VTPJG\" name=\"Astyanax\" crc=\"054CB4EB\">\n      <gamegenie code=\"EYNAGPEI\" description=\"Invincibility\" />\n      <gamegenie code=\"AUEKGUAP\" description=\"Infinite SP (spell)\" />\n      <gamegenie code=\"SZUGTISA\" description=\"Infinite health\" />\n      <gamegenie code=\"GXKSKPEL\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"GXUISPAL\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"EEEEIZYY\" description=\"Multi-jump (1 of 3)\" />\n      <gamegenie code=\"EEEEYZAP\" description=\"Multi-jump (2 of 3)\" />\n      <gamegenie code=\"ZUOAPZIL\" description=\"Multi-jump (3 of 3)\" />\n      <gamegenie code=\"AZKAVZGO\" description=\"Double health and SP\" />\n      <gamegenie code=\"PAKEKZAA\" description=\"Start with Blast Spell\" />\n      <gamegenie code=\"ZAKEKZAA\" description=\"Start with Bind Spell\" />\n      <gamegenie code=\"GPKAXZGA\" description=\"Start with extra weapon power\" />\n      <gamegenie code=\"SZUGEUVK\" description=\"Keep weapons after death\" />\n      <gamegenie code=\"IEUEUGZA\" description=\"Start with double lives (1 of 2)\" />\n      <gamegenie code=\"IASAXZZA\" description=\"Start with double lives (2 of 2)\" />\n      <gamegenie code=\"AEUEUGZE\" description=\"Start with triple lives (1 of 2)\" />\n      <gamegenie code=\"AASAXZZE\" description=\"Start with triple lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-HNIBN\" name=\"Athena\" crc=\"27DDF227\">\n      <gamegenie code=\"GZUZLISA\" description=\"Infinite health (after first 2 units)\" />\n      <gamegenie code=\"AAULLYPA\" description=\"Infinite time\" />\n      <gamegenie code=\"AOKEOPEL\" description=\"Collect items from anywhere\" />\n      <gamegenie code=\"AEKNLPZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEKNLPZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEKNLPZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AXKNYOGA\" description=\"Start with energy boost\" />\n      <gamegenie code=\"YASVAYIA\" description=\"Start with extra time\" />\n      <gamegenie code=\"GASVAYIA\" description=\"Start with less time\" />\n    </game>\n    <game code=\"CLV-H-VUGKO\" name=\"Attack of the Killer Tomatoes\" crc=\"7C6F615F\">\n      <gamegenie code=\"SXYYTO\" description=\"Infinite health\" />\n      <gamegenie code=\"SKYYGK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AVTYTP\" description=\"Invincibility\" />\n    </game>\n    <game code=\"CLV-H-OGDAQ\" name=\"Baby Boomer\" crc=\"BBE40DC4\">\n      <gamegenie code=\"SGKTZXVK\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-BSUPT\" name=\"Back to the Future\" crc=\"A55FA397\">\n      <gamegenie code=\"AENEXZIA\" description=\"Invincibility - Street stages (1 of 3)\" />\n      <gamegenie code=\"AONENZYL\" description=\"Invincibility - Street stages (2 of 3)\" />\n      <gamegenie code=\"APUEKLEY\" description=\"Invincibility - Street stages (3 of 3)\" />\n      <gamegenie code=\"SZKEGOVK\" description=\"Never lose a life in Hill Valley game\" />\n      <gamegenie code=\"SXOELOVK\" description=\"Never lose a life in Cafe game\" />\n      <gamegenie code=\"SXKALOVK\" description=\"Never lose a life in School game\" />\n      <gamegenie code=\"SXVELOVK\" description=\"Never lose a life in Dancing Hall game\" />\n      <gamegenie code=\"AVVOUZSZ\" description=\"Disable all timers\" />\n      <gamegenie code=\"PEXEGAGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"AEXEGAGE\" description=\"Start with 8 lives\" />\n    </game>\n    <game code=\"CLV-H-DJUKH\" name=\"Back to the Future II &amp; III\" crc=\"37BA3261\">\n      <gamegenie code=\"ZAXKZZPA\" description=\"Start with 20 lives\" />\n      <gamegenie code=\"LAXKZZPA\" description=\"Start with 30 lives\" />\n      <gamegenie code=\"SXXELOVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"ZAXKYZPA\" description=\"Start with 20 nuclear fuel units\" />\n      <gamegenie code=\"LAXKYZPA\" description=\"Start with 30 nuclear fuel units\" />\n      <gamegenie code=\"PEKASEPO\" description=\"Quicker shots\" />\n      <gamegenie code=\"GZKAKGSA\" description=\"Keep shots\" />\n      <gamegenie code=\"GZEEPZST\" description=\"Infinite fuel (1 of 2)\" />\n      <gamegenie code=\"GZOEZZST\" description=\"Infinite fuel (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BNWMP\" name=\"Bad Dudes\" crc=\"161D717B\">\n      <gamegenie code=\"APEETPEY\" description=\"Infinite health\" />\n      <gamegenie code=\"SZOEAOSE\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"SZNKASVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GXOKASVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"SGVYOUVK\" description=\"Infinite time\" />\n      <gamegenie code=\"AAUPIOGI\" description=\"Hit anywhere\" />\n      <gamegenie code=\"AIEAZPAP\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"AVSOYOSZ\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"ELEAPOZE\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"AOUSNGEY\" description=\"One hit kills\" />\n      <gamegenie code=\"PENXYZLA\" description=\"Start with 1 life and 1 continue\" />\n      <gamegenie code=\"TENXYZLA\" description=\"Start with double lives and continues\" />\n      <gamegenie code=\"PENXYZLE\" description=\"Start with triple lives and continues\" />\n      <gamegenie code=\"PESAIYIE\" description=\"Gain double usual energy from drinks\" />\n    </game>\n    <game code=\"CLV-H-ANXDX\" name=\"Bad News Baseball\" crc=\"40DAFCBA\">\n      <gamegenie code=\"XTOPAKEV\" description=\"Balls are considered strikes\" />\n      <gamegenie code=\"PAEGAPEP\" description=\"Play as girls team (2 of 2)\" />\n      <gamegenie code=\"PYEGZPLP\" description=\"Play as girls team (1 of 2)\" />\n    </game>\n    <game code=\"CLV-H-RRKVO\" name=\"Bad Street Brawler\" crc=\"1AE7B933\">\n      <gamegenie code=\"SUNGXOSO\" description=\"Infinite health\" />\n      <gamegenie code=\"SIXILYVI\" description=\"Infinite time\" />\n      <gamegenie code=\"SZOITNVK\" description=\"Don't die at time out\" />\n      <gamegenie code=\"OZOIYPVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SGESGZVG\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"PAXITALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAXITALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAXITALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GEUZZYAA\" description=\"Start on level 5\" />\n      <gamegenie code=\"PEUZZYAE\" description=\"Start on level 10\" />\n      <gamegenie code=\"TEUZZYAE\" description=\"Start on level 15\" />\n    </game>\n    <game code=\"CLV-H-BVOIF\" name=\"Barbie\" crc=\"18B249E5\">\n      <gamegenie code=\"ESUSAIEY\" description=\"Invincibility (blinks)\" />\n      <gamegenie code=\"SXKSKNVK\" description=\"Infinite Z's\" />\n      <gamegenie code=\"SZVAAVVK\" description=\"Can re-enter Barbie's dream an infinite number of times\" />\n      <gamegenie code=\"AEEEYAZA\" description=\"Cannot re-enter Barbie's dream\" />\n      <gamegenie code=\"PEEZEZIE\" description=\"Start with 9 Z's - 1st credit only\" />\n      <gamegenie code=\"PEEZEZIA\" description=\"Start with 1 Z - 1st credit only\" />\n    </game>\n    <game code=\"CLV-H-YZHDF\" name=\"Baseball\" crc=\"AFDCBD24\">\n      <gamegenie code=\"OZSIZYSX\" description=\"Balls are considered strikes\" />\n    </game>\n    <game code=\"CLV-H-NTDZI\" name=\"Baseball Simulator 1.000\" crc=\"1F6EA423\">\n      <gamegenie code=\"PESEPTLA\" description=\"1 strike and you're out\" />\n      <gamegenie code=\"ZESEPTLA\" description=\"2 strikes and you're out\" />\n      <gamegenie code=\"IESEPTLA\" description=\"5 strikes and you're out\" />\n      <gamegenie code=\"SZVAYTVT\" description=\"Strikes aren't counted\" />\n      <gamegenie code=\"SZNAATVT\" description=\"Balls aren't counted\" />\n      <gamegenie code=\"PESALTGA\" description=\"1 ball and you walk\" />\n      <gamegenie code=\"ZESALTGA\" description=\"2 balls and you walk\" />\n      <gamegenie code=\"LESALTGA\" description=\"3 balls and you walk\" />\n      <gamegenie code=\"PESALTGE\" description=\"9 balls and you walk\" />\n      <gamegenie code=\"OXVZITVV\" description=\"Strike outs aren't allowed\" />\n    </game>\n    <game code=\"CLV-H-KLEKX\" name=\"Baseball Stars\" crc=\"40D159B6\">\n      <gamegenie code=\"AEVSPGLA\" description=\"Balls are considered strikes\" />\n    </game>\n    <game code=\"CLV-H-JGARE\" name=\"Baseball Stars II\" crc=\"18A9F0D9\">\n      <gamegenie code=\"OXKILGEN\" description=\"Balls are considered strikes\" />\n      <gamegenie code=\"SZSSZSVV\" description=\"Strikes do not count\" />\n      <gamegenie code=\"SXSITKVV\" description=\"Balls do not count\" />\n      <gamegenie code=\"PAVIPILA\" description=\"One strike for an out\" />\n      <gamegenie code=\"ZAVIPILA\" description=\"Two strikes for an out\" />\n      <gamegenie code=\"GAVIPILA\" description=\"Four strikes for an out\" />\n      <gamegenie code=\"IAVIPILA\" description=\"Five strikes for an out (only 3 show on screen)\" />\n      <gamegenie code=\"PESSIGGA\" description=\"One ball for a walk\" />\n      <gamegenie code=\"ZESSIGGA\" description=\"Two balls for a walk\" />\n      <gamegenie code=\"LESSIGGA\" description=\"Three balls for a walk\" />\n      <gamegenie code=\"IESSIGGA\" description=\"Five balls for a walk (only 3 show on screen)\" />\n      <gamegenie code=\"TESSIGGA\" description=\"Six balls for a walk (only 3 show on screen)\" />\n      <gamegenie code=\"PANILTLA\" description=\"One out per side instead of 3 - against human players\" />\n      <gamegenie code=\"ZANILTLA\" description=\"Two outs per side - against human players\" />\n      <gamegenie code=\"GANILTLA\" description=\"Four outs per side - against human players\" />\n      <gamegenie code=\"PAOAILLA\" description=\"One out per side instead of 3 - against computer\" />\n      <gamegenie code=\"ZAOAILLA\" description=\"Two outs per side - against computer\" />\n      <gamegenie code=\"GAOAILLA\" description=\"Four outs per side - against computer\" />\n      <gamegenie code=\"PEXPVGLZ\" description=\"Game ends after 1 inning\" />\n      <gamegenie code=\"LEXPVGLZ\" description=\"Game ends after 2 innings\" />\n      <gamegenie code=\"TEXPVGLZ\" description=\"Game ends after 3 innings\" />\n      <gamegenie code=\"AEXPVGLX\" description=\"Game ends after 4 innings\" />\n      <gamegenie code=\"ZEXPVGLX\" description=\"Game ends after 5 innings\" />\n      <gamegenie code=\"GEXPVGLX\" description=\"Game ends after 6 innings\" />\n      <gamegenie code=\"TEXPVGLX\" description=\"Game ends after 7 innings\" />\n      <gamegenie code=\"AOXPVGLZ\" description=\"Game ends after 8 innings\" />\n    </game>\n    <game code=\"CLV-H-SQJMQ\" name=\"Bases Loaded 3, Ryne Sandberg Plays\" crc=\"3ECA3DDA\">\n      <gamegenie code=\"NYVPOETE\" description=\"Balls are counted as strikes (1 of 2)\" />\n      <gamegenie code=\"TAVPUEON\" description=\"Balls are counted as strikes (2 of 2)\" />\n      <gamegenie code=\"SXOPSEVV\" description=\"Some strikes aren't counted\" />\n      <gamegenie code=\"AEOPXAZA\" description=\"1 strike and you're out\" />\n      <gamegenie code=\"PEOPXAZA\" description=\"2 strikes and you're out\" />\n      <gamegenie code=\"SXKOXEVV\" description=\"Balls aren't counted\" />\n      <gamegenie code=\"SXOAIUVV\" description=\"Strike outs aren't counted\" />\n      <gamegenie code=\"PEOEGLLA\" description=\"Each strike out counts as 3 outs\" />\n      <gamegenie code=\"ZEOEGLLA\" description=\"Each strike out counts as 2 outs\" />\n      <gamegenie code=\"IEOEGLLA\" description=\"5 strike outs allowed\" />\n      <gamegenie code=\"PEOEGLLA\" description=\"9 strike outs allowed\" />\n      <gamegenie code=\"SZSYGNVV\" description=\"Computer can't score (1 of 2)\" />\n      <gamegenie code=\"SZSNTNVN\" description=\"Computer can't score (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-HWVXF\" name=\"Bases Loaded 4\" crc=\"28F9B41F\">\n      <gamegenie code=\"SZNXGUVV\" description=\"Balls do not count\" />\n      <gamegenie code=\"SXOXYUVV\" description=\"Strikes do not count\" />\n      <gamegenie code=\"PEOXGLZA\" description=\"2 strikes and you're out\" />\n      <gamegenie code=\"LEOXGLZA\" description=\"4 strikes and you're out\" />\n      <gamegenie code=\"AANZGLLA\" description=\"1 ball and you walk\" />\n      <gamegenie code=\"PANZGLLA\" description=\"2 balls and you walk\" />\n      <gamegenie code=\"ZANZGLLA\" description=\"3 balls and you walk\" />\n      <gamegenie code=\"PANPUTAA\" description=\"Some batters start with count of 1 and 1 - 2P mode (1 of 2)\" />\n      <gamegenie code=\"PEOETGAA\" description=\"Some batters start with count of 1 and 1 - 2P mode (2 of 2)\" />\n      <gamegenie code=\"ZEOETGAA\" description=\"Some batters start with count of 2 and 2 - 2P mode (1 of 2)\" />\n      <gamegenie code=\"ZANPUTAA\" description=\"Some batters start with count of 2 and 2 - 2P mode (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-RCFAI\" name=\"Bases Loaded II: Second Season\" crc=\"B9CF171F\">\n      <gamegenie code=\"SXKKIVGK\" description=\"Balls are considered strikes\" />\n      <gamegenie code=\"PEOGOALA\" description=\"1 strike and you're out - most of the time\" />\n      <gamegenie code=\"ZEOGOALA\" description=\"2 strikes and you're out - most of the time\" />\n      <gamegenie code=\"SZOEVXVV\" description=\"Outs aren't counted\" />\n      <gamegenie code=\"PAOEUZZA\" description=\"Only 2 outs allowed\" />\n      <gamegenie code=\"AAOEUZZA\" description=\"Only 1 out allowed\" />\n      <gamegenie code=\"SXNAXOVV\" description=\"Strikes aren't counted (1 of 2)\" />\n      <gamegenie code=\"SXSGUKVV\" description=\"Strikes aren't counted (2 of 2)\" />\n      <gamegenie code=\"SZEEXXVV\" description=\"Balls aren't counted (1 of 2)\" />\n      <gamegenie code=\"SZEESXVV\" description=\"Balls aren't counted (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-VBBGK\" name=\"Batman: Return of the Joker\" crc=\"03EC46AF\">\n      <gamegenie code=\"SXOLZOSE\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"SZSZKXSE\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"SZXZONSE\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"SZEGLVSE\" description=\"Infinite health\" />\n      <gamegenie code=\"SKSKGKVK\" description=\"Infinite weapons\" />\n      <gamegenie code=\"SZVUIASE\" description=\"Invincible to bosses\" />\n      <gamegenie code=\"SZXZONSE\" description=\"Protection from enemy bullets\" />\n      <gamegenie code=\"SZSZKXSE\" description=\"Protection from collisions\" />\n      <gamegenie code=\"SXSATXSE\" description=\"Protection from electric grids\" />\n      <gamegenie code=\"AEUAOLZE\" description=\"Jump higher\" />\n      <gamegenie code=\"AOUAOLZA\" description=\"Jump very high\" />\n      <gamegenie code=\"AEXILGZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"GVXILGZA\" description=\"Start with 100 lives\" />\n      <gamegenie code=\"GAVXVLZA\" description=\"Each Backpack Energy Capsule counts as two\" />\n      <gamegenie code=\"AAVXVLZE\" description=\"Each Backpack Energy Capsule counts as four\" />\n      <gamegenie code=\"AAKOPIZA\" description=\"Invincibility lasts until the end of stage\" />\n      <gamegenie code=\"GEOSPKVN\" description=\"Start with 7 Backpack Energy Capsules instead of none\" />\n      <gamegenie code=\"GEOSTKTA\" description=\"Start with 3 life increments instead of 8\" />\n      <gamegenie code=\"GASOTOTA\" description=\"Continue game with 3 life increments instead of 8\" />\n      <gamegenie code=\"SZXSZSVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GXEUIOSE\" description=\"Don't get stunned when hit\" />\n      <gamegenie code=\"AEUUAPGA\" description=\"Stand your ground (1 of 2)\" />\n      <gamegenie code=\"GXKLAOKE\" description=\"Stand your ground (2 of 2)\" />\n      <gamegenie code=\"VNULTONN\" description=\"Intense knock-back when hit (may get stuck if you knock back into a wall) (1 of 2)\" />\n      <gamegenie code=\"PEUUGPAA\" description=\"Intense knock-back when hit (may get stuck if you knock back into a wall) (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-AVGKE\" name=\"Batman\" crc=\"13C6617E\">\n      <gamegenie code=\"PPOPEZVG\" description=\"Infinite health\" />\n      <gamegenie code=\"SKGGTT\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"SKGGGT\" description=\"Regenerates health meter (except Joker's gun)\" />\n      <gamegenie code=\"SXEPOGSA\" description=\"Infinite weapons\" />\n      <gamegenie code=\"SZKPNUGK\" description=\"Hit anywhere + one hit kills\" />\n      <gamegenie code=\"SZUGGTVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEESKGZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEESKGZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEESKGZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GEEPOTPA\" description=\"Extra health on heart pick-up\" />\n      <gamegenie code=\"GZNOUGST\" description=\"Infinite bullets on pick-up\" />\n      <gamegenie code=\"GPSPXVZA\" description=\"Double usual bullets on pick-up\" />\n      <gamegenie code=\"IASPXVZA\" description=\"Half usual bullets on pick-up\" />\n      <gamegenie code=\"SNUPIKKI\" description=\"Multi-jump\" />\n    </game>\n    <game code=\"CLV-H-PPEVO\" name=\"Batman Returns\" crc=\"C247A23D\">\n      <gamegenie code=\"PAOGVSPX\" description=\"Enable level select\" />\n      <gamegenie code=\"SXSKGKVK\" description=\"Infinite Batarangs\" />\n      <gamegenie code=\"ESUXIPEP\" description=\"Hit anywhere (excludes driving stages) (1 of 2)\" />\n      <gamegenie code=\"ESUZZPEP\" description=\"Hit anywhere (excludes driving stages) (2 of 2)\" />\n      <gamegenie code=\"GZOZIZEL\" description=\"One hit kills (excludes driving stages)\" />\n      <gamegenie code=\"AAVASZZA\" description=\"Don't lose health from spin attack\" />\n      <gamegenie code=\"GZEGLVSE\" description=\"Almost infinite lives and health\" />\n      <gamegenie code=\"AUSAPPAP\" description=\"Small hearts give more health\" />\n      <gamegenie code=\"YAKZTIZE\" description=\"Power punch\" />\n      <gamegenie code=\"YAKXLIIE\" description=\"Power slide attack\" />\n      <gamegenie code=\"ZPKXZIIE\" description=\"Power jump kick\" />\n      <gamegenie code=\"GESAKIPA\" description=\"Walk faster horizontally (1 of 2)\" />\n      <gamegenie code=\"GEVEVIPA\" description=\"Walk faster horizontally (2 of 2)\" />\n      <gamegenie code=\"PAXELAIE\" description=\"Start with 9 Batarangs\" />\n      <gamegenie code=\"YLOALEAX\" description=\"Start with full health\" />\n      <gamegenie code=\"APOALEAZ\" description=\"Start with less health\" />\n    </game>\n    <game code=\"CLV-H-UTUMB\" name=\"Battle of Olympus, The\" crc=\"6B53006A\">\n      <gamegenie code=\"SXSSNASA\" description=\"Infinite health\" />\n      <gamegenie code=\"ENOAPGEI\" description=\"Invincibility\" />\n      <gamegenie code=\"APVEIGES\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"ATVETKVT\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AEVESSOT\" description=\"Get items from anywhere (press down) (1 of 2)\" />\n      <gamegenie code=\"GXVANIEL\" description=\"Get items from anywhere (press down) (2 of 2)\" />\n      <gamegenie code=\"AAUGPAAO\" description=\"Start with less stamina\" />\n      <gamegenie code=\"AZUGPAAP\" description=\"Start with more stamina\" />\n      <gamegenie code=\"AAEGOZZA\" description=\"Start with Sandals of Hermes\" />\n      <gamegenie code=\"GZUKGASA\" description=\"Start with XX (1 of 3)\" />\n      <gamegenie code=\"GZUKTASA\" description=\"Start with XX (2 of 3)\" />\n      <gamegenie code=\"PAUGYAAA\" description=\"Start with Staff of Fennel (3 of 3)\" />\n      <gamegenie code=\"ZAUGYAAA\" description=\"Start with Sword (3 of 3)\" />\n      <gamegenie code=\"LAUGYAAA\" description=\"Start with Divine Sword (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-PCGFD\" name=\"Battle Tank, Garry Kitchen's\" crc=\"90D68A43\">\n      <gamegenie code=\"SKOPAAVT\" description=\"Infinite energy\" />\n      <gamegenie code=\"SKUAANSE\" description=\"Infinite fuel\" />\n      <gamegenie code=\"SIXTEEVS\" description=\"Infinite weapons (1 of 2)\" />\n      <gamegenie code=\"SGKVINVK\" description=\"Infinite weapons (2 of 2)\" />\n      <gamegenie code=\"SLXTEEVS\" description=\"Infinite ammo\" />\n      <gamegenie code=\"TOVZIAZL\" description=\"Start with half 150mm ammo\" />\n      <gamegenie code=\"LVVZIAZL\" description=\"Start with double 150mm ammo\" />\n      <gamegenie code=\"ZUVXTAPA\" description=\"Start with more wire guided shells\" />\n      <gamegenie code=\"LVVXTAPA\" description=\"Start with max wire guided shells\" />\n      <gamegenie code=\"ZUNXAAPA\" description=\"Start with more smoke shells\" />\n      <gamegenie code=\"LVNXAAPA\" description=\"Start with max smoke shells\" />\n      <gamegenie code=\"LGEZPPVO\" description=\"Start with less 50mm shells\" />\n      <gamegenie code=\"NYEZPPVO\" description=\"Start with max 50mm shells\" />\n      <gamegenie code=\"GTEZIOEG\" description=\"Start with less 50mm ammo after mission 5\" />\n      <gamegenie code=\"NYEZIOEK\" description=\"Start with max 50mm ammo after mission 5\" />\n      <gamegenie code=\"SXOPAAVT\" description=\"Take infinite hits (1 of 2)\" />\n      <gamegenie code=\"SXSLNPSA\" description=\"Take infinite hits (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ZPKDS\" name=\"Battleship\" crc=\"50CCC8ED\">\n      <gamegenie code=\"PEUAUGIA\" description=\"1 round per level\" />\n      <gamegenie code=\"LEUAUGIA\" description=\"3 rounds per level\" />\n      <gamegenie code=\"SZUAOSOU\" description=\"Each ship can take only one hit\" />\n      <gamegenie code=\"SAXAOISP\" description=\"You only have RIM-66 missiles\" />\n      <gamegenie code=\"VASEOGSA\" description=\"Start on level XX (1 of 3)\" />\n      <gamegenie code=\"VASASGSA\" description=\"Start on level XX (2 of 3)\" />\n      <gamegenie code=\"PASAKGAA\" description=\"Start on level 2 (3 of 3)\" />\n      <gamegenie code=\"ZASAKGAA\" description=\"Start on level 3 (3 of 3)\" />\n      <gamegenie code=\"LASAKGAA\" description=\"Start on level 4 (3 of 3)\" />\n      <gamegenie code=\"GASAKGAA\" description=\"Start on level 5 (3 of 3)\" />\n      <gamegenie code=\"IASAKGAA\" description=\"Start on level 6 (3 of 3)\" />\n      <gamegenie code=\"TASAKGAA\" description=\"Start on level 7 (3 of 3)\" />\n      <gamegenie code=\"YASAKGAA\" description=\"Start on level 8 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-EEOQF\" name=\"Battletoads &amp; Double Dragon: The Ultimate Team\" crc=\"CEB65B06\">\n      <gamegenie code=\"IEEOOALA\" description=\"Start with full lives\" />\n      <gamegenie code=\"AEEOOALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"GXXLAAVI\" description=\"Infinite lives (except stage 4)\" />\n      <gamegenie code=\"GZSOXPVI\" description=\"Infinite lives on stage 4\" />\n      <gamegenie code=\"PEVELZZE\" description=\"Start with 10 continues\" />\n      <gamegenie code=\"IYKNIKGX\" description=\"Bonus score gives invincibility (instead of invincibility pod)\" />\n      <gamegenie code=\"YPSYPGIE\" description=\"Longer invincibility\" />\n      <gamegenie code=\"ILSYPGIA\" description=\"Even longer invincibility\" />\n      <gamegenie code=\"AOSEVAZA\" description=\"Double Dragon super punch\" />\n      <gamegenie code=\"AOUEUAGA\" description=\"Battletoads super punch\" />\n      <gamegenie code=\"AXUIPOYA\" description=\"Stronger enemies\" />\n    </game>\n    <game code=\"CLV-H-YIWQJ\" name=\"Battletoads\" crc=\"279710DC\">\n      <gamegenie code=\"GXXZZLVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"OUAILU\" description=\"One hit kills\" />\n      <gamegenie code=\"GXEILUSO\" description=\"Enemies easier to kill\" />\n      <gamegenie code=\"EYSAUVEI\" description=\"Mega-jumping\" />\n      <gamegenie code=\"AEUZITPA\" description=\"Super fast punching\" />\n      <gamegenie code=\"YXUKXNAE\" description=\"Maximum health from flies\" />\n      <gamegenie code=\"AENTAIPL\" description=\"Force 2-player mode\" />\n      <gamegenie code=\"AENVZILA\" description=\"Start with 0 lives\" />\n      <gamegenie code=\"PENVZILA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TENVZILA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PENVZILE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"ZAXAALAA\" description=\"Start on level 2 - Wookie Hole\" />\n      <gamegenie code=\"LAXAALAA\" description=\"Start on level 3 - Turbo Tunnel\" />\n      <gamegenie code=\"GAXAALAA\" description=\"Start on level 4 - Arctic Cavern\" />\n      <gamegenie code=\"IAXAALAA\" description=\"Start on level 5 - Surf City\" />\n      <gamegenie code=\"TAXAALAA\" description=\"Start on level 6 - Karnath's Lair\" />\n      <gamegenie code=\"YAXAALAA\" description=\"Start on level 7 - Volkmire's Inferno\" />\n      <gamegenie code=\"AAXAALAE\" description=\"Start on level 8 - Intruder Excluder\" />\n      <gamegenie code=\"PAXAALAE\" description=\"Start on level 9 - Terra Tubes\" />\n      <gamegenie code=\"ZAXAALAE\" description=\"Start on level 10 - Rat Race\" />\n      <gamegenie code=\"LAXAALAE\" description=\"Start on level 11 - Clinger Winger\" />\n      <gamegenie code=\"GAXAALAE\" description=\"Start on level 12 - The Revolution\" />\n      <gamegenie code=\"AOUKXNAA\" description=\"Double health from flies\" />\n    </game>\n    <game code=\"CLV-H-YVZCV\" name=\"Bee 52\" crc=\"6C93377C\">\n      <gamegenie code=\"AIXTPLEI\" description=\"Hit anywhere - sting attack (1 of 2)\" />\n      <gamegenie code=\"APXTZULU\" description=\"Hit anywhere - sting attack (2 of 2)\" />\n      <gamegenie code=\"EINTILEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SXNTLPSA\" description=\"Invincibility (alt)\" />\n      <gamegenie code=\"SXSGOSVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZXNXTAX\" description=\"Keep pick-ups\" />\n      <gamegenie code=\"GZSSTTEI\" description=\"Don't get stunned\" />\n      <gamegenie code=\"PAXYKGLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAXYKGLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAXYKGLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GXNKNTAL\" description=\"Fly quicker (1 of 2)\" />\n      <gamegenie code=\"GZOKUYAP\" description=\"Fly quicker (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-KEZXY\" name=\"Beetlejuice\" crc=\"EB84C54C\">\n      <gamegenie code=\"EIEISGEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SZOSYNSE\" description=\"Invincibility (blinking)\" />\n      <gamegenie code=\"AAOITYPA\" description=\"Infinite hits\" />\n      <gamegenie code=\"SZOIYKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEOAAALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEOAAALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEOAAALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PEOAIAZA\" description=\"Take fewer hits to die (1 of 2)\" />\n      <gamegenie code=\"PENSYLZA\" description=\"Take fewer hits to die (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-OHZUO\" name=\"Best of the Best: Championship Karate\" crc=\"A6A725B8\">\n      <gamegenie code=\"AANIGYPA\" description=\"Each round is XX (1 of 3)\" />\n      <gamegenie code=\"OZVSYYSE\" description=\"Each round is XX (2 of 3)\" />\n      <gamegenie code=\"ZANIANTI\" description=\"Each round is 0:20 (3 of 3)\" />\n      <gamegenie code=\"LANIANTI\" description=\"Each round is 0:30 (3 of 3)\" />\n      <gamegenie code=\"GANIANTI\" description=\"Each round is 0:40 (3 of 3)\" />\n      <gamegenie code=\"IANIANTI\" description=\"Each round is 0:50 (3 of 3)\" />\n      <gamegenie code=\"ZANIGYPA\" description=\"Each round is 2:00\" />\n      <gamegenie code=\"LANIGYPA\" description=\"Each round is 3:00\" />\n      <gamegenie code=\"GANIGYPA\" description=\"Each round is 4:00\" />\n      <gamegenie code=\"IANIGYPA\" description=\"Each round is 5:00\" />\n      <gamegenie code=\"TANIGYPA\" description=\"Each round is 6:00\" />\n      <gamegenie code=\"YANIGYPA\" description=\"Each round is 7:00\" />\n      <gamegenie code=\"AANIGYPE\" description=\"Each round is 8:00\" />\n      <gamegenie code=\"PANIGYPE\" description=\"Each round is 9:00\" />\n      <gamegenie code=\"PAOSUZIA\" description=\"Each match is 1 round instead of 5\" />\n      <gamegenie code=\"ZAOSUZIA\" description=\"Each match is 2 rounds\" />\n      <gamegenie code=\"LAOSUZIA\" description=\"Each match is 3 rounds\" />\n      <gamegenie code=\"GAOSUZIA\" description=\"Each match is 4 rounds\" />\n      <gamegenie code=\"TAOSUZIA\" description=\"Each match is 6 rounds\" />\n      <gamegenie code=\"SXVSAZVG\" description=\"Infinite time (round never ends)\" />\n      <gamegenie code=\"ZLEAZETP\" description=\"Start with 50 resistance points\" />\n      <gamegenie code=\"ZLEAPEAZ\" description=\"Start with 50 strength points\" />\n      <gamegenie code=\"ZLEALAGP\" description=\"Start with 50 reflex points\" />\n      <gamegenie code=\"TGEAZETP\" description=\"Start with 70 resistance points\" />\n      <gamegenie code=\"TGEAPEAZ\" description=\"Start with 70 strength points\" />\n      <gamegenie code=\"TGEALAGP\" description=\"Start with 70 reflex points\" />\n      <gamegenie code=\"AEETOPZA\" description=\"Gain more XX in training (1 of 2)\" />\n      <gamegenie code=\"AAEVVAGE\" description=\"Gain more strength and reflex points in training (2 of 2)\" />\n      <gamegenie code=\"APEVVAGA\" description=\"Gain more resistance points in training (2 of 2)\" />\n      <gamegenie code=\"OXNSGIOU\" description=\"All physical types are XX (1 of 2)\" />\n      <gamegenie code=\"TONSIIZE\" description=\"All physical types are 30 (may cause graphic errors) (2 of 2)\" />\n      <gamegenie code=\"ZUNSIIZA\" description=\"All physical types are 50 (may cause graphic errors) (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-TOPBA\" name=\"Bible Adventures\" crc=\"680DA78D\">\n      <gamegenie code=\"SUVIKXSO\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-KBNMJ\" name=\"Big Nose the Caveman\" crc=\"BD154C3E\">\n      <gamegenie code=\"SXNNEISA\" description=\"Invincibility\" />\n      <gamegenie code=\"PEUYITLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEUAITLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEUYITLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXOTPAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SUOTPAVK\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"ANENAKLL\" description=\"Slower timer\" />\n      <gamegenie code=\"AXENAKLL\" description=\"Faster timer\" />\n      <gamegenie code=\"AEEYYZPA\" description=\"Never lose bones when buying\" />\n      <gamegenie code=\"XXXYITSZ\" description=\"Start on XX (1 of 3)\" />\n      <gamegenie code=\"VEKYAVSE\" description=\"Start on XX (2 of 3)\" />\n      <gamegenie code=\"AOUGTAE\" description=\"Start on Monster Island (3 of 3)\" />\n      <gamegenie code=\"ZOUGTAE\" description=\"Start on Terror Island (3 of 3)\" />\n      <gamegenie code=\"EIXVIPEY\" description=\"Always enable instant win level\" />\n    </game>\n    <game code=\"CLV-H-UGJGS\" name=\"Bigfoot\" crc=\"C42E648A\">\n      <gamegenie code=\"SUKXVUVS\" description=\"Infinite nitros\" />\n      <gamegenie code=\"NNKXXLGV\" description=\"Longer nitro boost\" />\n      <gamegenie code=\"AXKXXLGT\" description=\"Shorter nitro boost\" />\n      <gamegenie code=\"GEKAOKAA\" description=\"Engines are half price\" />\n      <gamegenie code=\"PEKAOKAE\" description=\"Engines cost more\" />\n      <gamegenie code=\"LEKAXGTA\" description=\"Tires are half price\" />\n      <gamegenie code=\"PEKAXGTE\" description=\"Tires cost more\" />\n      <gamegenie code=\"ZEKAUGGA\" description=\"Transmission work is half price\" />\n      <gamegenie code=\"AEKAUGGE\" description=\"Transmission work is double price\" />\n      <gamegenie code=\"PEKAKGZA\" description=\"Suspension is half price\" />\n      <gamegenie code=\"TEKAKGZA\" description=\"Suspension is triple price\" />\n      <gamegenie code=\"VTVUYOVN\" description=\"P1 gets P2's nitros (1 of 2)\" />\n      <gamegenie code=\"SZVUAOSE\" description=\"P1 gets P2's nitros (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-KXLTB\" name=\"Bill &amp; Ted's Excellent Video Game Adventure\" crc=\"C4B6ED3C\">\n      <gamegenie code=\"SZKUPXVK\" description=\"Infinite skeleton keys\" />\n      <gamegenie code=\"SZEKUOSE\" description=\"Infinite coins for locals\" />\n      <gamegenie code=\"OUOOUEOO\" description=\"Infinite Good Stuff\" />\n      <gamegenie code=\"SXOTTOSE\" description=\"Phone call segments cost only 1 coin\" />\n      <gamegenie code=\"OOKKUTIO\" description=\"Ted starts with 99 coins instead of 15\" />\n      <gamegenie code=\"OOSVAPIO\" description=\"Bill starts with 99 coins\" />\n      <gamegenie code=\"IEKKUTIP\" description=\"Ted starts with 5 coins\" />\n      <gamegenie code=\"IESVAPIP\" description=\"Bill starts with 5 coins\" />\n    </game>\n    <game code=\"CLV-H-XTZAN\" name=\"Bill Elliott's NASCAR Challenge\" crc=\"847D672D\">\n      <gamegenie code=\"EUEKTLEP\" description=\"Accelerate faster\" />\n      <gamegenie code=\"SZUETKVK\" description=\"Infinite 'free time' in the pits\" />\n      <gamegenie code=\"SXOAZVVK\" description=\"Freeze timer while crew works on car in pits\" />\n    </game>\n    <game code=\"CLV-H-YRDCL\" name=\"Bionic Commando\" crc=\"D2574720\">\n      <gamegenie code=\"AVSTYNVG\" description=\"Invincibility\" />\n      <gamegenie code=\"SZNUIYVG\" description=\"Infinite lives in main game\" />\n      <gamegenie code=\"SXUEZPVG\" description=\"Infinite lives in sub-game\" />\n      <gamegenie code=\"SXSTYNVK\" description=\"Don't take damage from bullets and collisions\" />\n      <gamegenie code=\"VTNZXVVK\" description=\"Don't take damage from spikes\" />\n      <gamegenie code=\"SZUOAOVK\" description=\"Don't take damange from bullets and collisions in sub-game\" />\n      <gamegenie code=\"ATOVUGAZ\" description=\"Hit anywhere (1 of 5)\" />\n      <gamegenie code=\"AVKOPEEP\" description=\"Hit anywhere (2 of 5)\" />\n      <gamegenie code=\"AVNVUKAL\" description=\"Hit anywhere (3 of 5)\" />\n      <gamegenie code=\"AVXENVSL\" description=\"Hit anywhere (4 of 5)\" />\n      <gamegenie code=\"SZKTVUOO\" description=\"Hit anywhere (5 of 5)\" />\n      <gamegenie code=\"XYXUUOEN\" description=\"Autofire - main game\" />\n      <gamegenie code=\"AAKUOOZA\" description=\"Use with BIO Code 11 for improved autofire with normal gun\" />\n      <gamegenie code=\"AAUGSZZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAUGSZZA\" description=\"Start with double lives\" />\n      <gamegenie code=\"AAUGSZZE\" description=\"Start with triple lives\" />\n      <gamegenie code=\"VGKKNXUK\" description=\"Start with 3-way gun\" />\n      <gamegenie code=\"LAUKOZAA\" description=\"Start with 3 life energy capsules (1 of 2)\" />\n      <gamegenie code=\"XTUKUXVU\" description=\"Start with 3 life energy capsules (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-QPEMJ\" name=\"Blades of Steel\" crc=\"8AB52A24\">\n      <gamegenie code=\"AINXIYEI\" description=\"Invincibility in mini-game\" />\n      <gamegenie code=\"GEUGTTYA\" description=\"Faster timer\" />\n      <gamegenie code=\"GOUGTTYA\" description=\"Slower timer\" />\n      <gamegenie code=\"PAXZLGIA\" description=\"Players can take only one punch\" />\n      <gamegenie code=\"AAOSSAAZ\" description=\"Player with puck doesn't slow down\" />\n      <gamegenie code=\"YASGITLA\" description=\"Start a new game to view the ending\" />\n    </game>\n    <game code=\"CLV-H-YZRVU\" name=\"Blaster Master\" crc=\"3F0FD764\">\n      <gamegenie code=\"XVLAKO\" description=\"Infinite car health\" />\n      <gamegenie code=\"NNKKGZAE\" description=\"Start with all abilities\" />\n      <gamegenie code=\"LTEKPLAA\" description=\"Start with 99 of each weapon\" />\n      <gamegenie code=\"NYEKPLAE\" description=\"Start with 99 of each weapon and max Hover\" />\n      <gamegenie code=\"YAASLY\" description=\"Enemies are killed instantly\" />\n      <gamegenie code=\"SZUGYIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAEGZLZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAEGZLZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAEGZLZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZXOALVG\" description=\"Infinite Hover\" />\n      <gamegenie code=\"GZSOEEVK\" description=\"Infinite Homing Missiles\" />\n      <gamegenie code=\"GXKPEOVK\" description=\"Infinite Thunderbreaks\" />\n      <gamegenie code=\"GXSOVXVK\" description=\"Infinite Multi-Warheads\" />\n      <gamegenie code=\"IAEKPLAA\" description=\"Start with 5 of each weapon\" />\n      <gamegenie code=\"ZAEKPLAE\" description=\"Start with 10 of each weapon\" />\n      <gamegenie code=\"YAEKPLAE\" description=\"Start with 15 of each weapon\" />\n      <gamegenie code=\"PENKTXAE\" description=\"Start on world 2\" />\n      <gamegenie code=\"ZENKTXAE\" description=\"Start on world 3\" />\n      <gamegenie code=\"LENKTXAE\" description=\"Start on world 4\" />\n      <gamegenie code=\"GENKTXAE\" description=\"Start on world 5\" />\n      <gamegenie code=\"IENKTXAE\" description=\"Start on world 6\" />\n      <gamegenie code=\"TENKTXAE\" description=\"Start on world 7\" />\n      <gamegenie code=\"YENKTXAE\" description=\"Start on world 8\" />\n      <gamegenie code=\"OXNKIXPE\" description=\"Start at the boss of world X (1 of 2)\" />\n      <gamegenie code=\"AENKTXAA\" description=\"Start at the boss of world 1 (2 of 2)\" />\n      <gamegenie code=\"PENKTXAA\" description=\"Start at the boss of world 2 (2 of 2)\" />\n      <gamegenie code=\"ZENKTXAA\" description=\"Start at the boss of world 3 (2 of 2)\" />\n      <gamegenie code=\"LENKTXAA\" description=\"Start at the boss of world 4 (2 of 2)\" />\n      <gamegenie code=\"GENKTXAA\" description=\"Start at the boss of world 5 (2 of 2)\" />\n      <gamegenie code=\"IENKTXAA\" description=\"Start at the boss of world 6 (2 of 2)\" />\n      <gamegenie code=\"TENKTXAA\" description=\"Start at the boss of world 7 (2 of 2)\" />\n      <gamegenie code=\"YENKTXAA\" description=\"Start at the boss of world 8 (2 of 2)\" />\n      <gamegenie code=\"ZGUKZITP\" description=\"Die to see ending\" />\n    </game>\n    <game code=\"CLV-H-ZSLTV\" name=\"Blue Marlin, The\" crc=\"F37BEFD5\">\n      <gamegenie code=\"GENTUIZA\" description=\"Line is a 1000 yards long\" />\n      <gamegenie code=\"AESVOXEG\" description=\"Catch fish right after they bite - most of the time\" />\n      <gamegenie code=\"PESVOXEK\" description=\"When fish bite they are close to the boat\" />\n      <gamegenie code=\"OOSVOXEK\" description=\"Line is set to 153 feet\" />\n      <gamegenie code=\"PESVXIAA\" description=\"Pull fish in quicker\" />\n      <gamegenie code=\"OZSVKKPV\" description=\"Vitality always at max (1 of 2)\" />\n      <gamegenie code=\"YASVSGPE\" description=\"Vitality always at max (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-KTZRY\" name=\"Blues Brothers, The\" crc=\"9F2EEF20\">\n      <gamegenie code=\"SUOVAEVS\" description=\"Infinite health\" />\n      <gamegenie code=\"SUUVYEVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"EIXTAGEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"EIVTVIEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"PESYAPAA\" description=\"Multi-jump\" />\n    </game>\n    <game code=\"CLV-H-BTEZZ\" name=\"Bo Jackson Baseball\" crc=\"5FD2AAB1\">\n      <gamegenie code=\"AEEGYKAP\" description=\"Balls are considered strikes\" />\n    </game>\n    <game code=\"CLV-H-ZUDTD\" name=\"Bomberman\" crc=\"DB9DCF89\">\n      <gamegenie code=\"OXVGITSX\" description=\"Immune to explosions\" />\n      <gamegenie code=\"SZIGAT\" description=\"Infinite time\" />\n      <gamegenie code=\"SXPKAG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAOGTYYL\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"AAOKIYAL\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AAVKXZZA\" description=\"Remove all breakable blocks\" />\n      <gamegenie code=\"AEZKLL\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PEZKLU\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"VPGKGG\" description=\"Decrease time\" />\n      <gamegenie code=\"VYGKGK\" description=\"Increase timer\" />\n      <gamegenie code=\"ZELGYU\" description=\"Start on stage 10\" />\n      <gamegenie code=\"GOLGYL\" description=\"Start on stage 20\" />\n      <gamegenie code=\"TOLGYU\" description=\"Start on stage 30\" />\n      <gamegenie code=\"AXLGYU\" description=\"Start on stage 40\" />\n      <gamegenie code=\"ZULGYL\" description=\"Start on stage 50\" />\n      <gamegenie code=\"AXKKALAP\" description=\"Start with double power Bomb blasts\" />\n      <gamegenie code=\"AUKKALAP\" description=\"Start with triple power Bomb blasts\" />\n      <gamegenie code=\"EEKKALAP\" description=\"Start with maximum power Bomb blasts\" />\n      <gamegenie code=\"NYXKUIEX\" description=\"Increase Bomb detonation time\" />\n      <gamegenie code=\"AYXKUIEZ\" description=\"Reduce Bomb detonation time\" />\n      <gamegenie code=\"GXEKLGSA\" description=\"Never lose Detonator after pick-up\" />\n      <gamegenie code=\"AESKGUIZ\" description=\"Start with Detonator, max Bomb power and use up to 10 Bombs\" />\n      <gamegenie code=\"XZEGNIVZ\" description=\"Use up to 10 Bombs (1 of 2)\" />\n      <gamegenie code=\"PAEKEIGN\" description=\"Use up to 10 Bombs (2 of 2)\" />\n      <gamegenie code=\"OXEKVPSX\" description=\"Start with and keep Detonator (1 of 2)\" />\n      <gamegenie code=\"AESKNKTA\" description=\"Start with and keep Detonator (2 of 2)\" />\n      <gamegenie code=\"OZNKNNPK\" description=\"Walk through walls (1 of 2)\" />\n      <gamegenie code=\"AEEGEYPA\" description=\"Walk through walls (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-UQUEX\" name=\"Bomberman II\" crc=\"1EBB5B42\">\n      <gamegenie code=\"GXKGKXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GXXONEVK\" description=\"Infinite time\" />\n      <gamegenie code=\"SZXATLOU\" description=\"Hit anywhere (all enemies killed with one bomb) (3 of 4)\" />\n      <gamegenie code=\"LPXAYUYX\" description=\"Hit anywhere (all enemies killed with one bomb) (1 of 4)\" />\n      <gamegenie code=\"PTXEAUPZ\" description=\"Hit anywhere (all enemies killed with one bomb) (2 of 4)\" />\n      <gamegenie code=\"XTXEPLEE\" description=\"Hit anywhere (all enemies killed with one bomb) (4 of 4)\" />\n      <gamegenie code=\"AAKLVPAZ\" description=\"Remove all breakable blocks (1 of 2)\" />\n      <gamegenie code=\"SZKUNPAX\" description=\"Remove all breakable blocks (2 of 2)\" />\n      <gamegenie code=\"LVXOUELL\" description=\"Slower timer\" />\n      <gamegenie code=\"TOXOUELU\" description=\"Faster timer\" />\n      <gamegenie code=\"AEKAZYLA\" description=\"Always have Detonator\" />\n      <gamegenie code=\"YNEOLXLK\" description=\"Bomb has a longer fuse\" />\n      <gamegenie code=\"AXEOLXLG\" description=\"Bomb has a shorter fuse\" />\n      <gamegenie code=\"GXOLSXVS\" description=\"Stop Bombs from exploding\" />\n      <gamegenie code=\"EASPTANG\" description=\"Dollar sign acts as flame face\" />\n      <gamegenie code=\"GYSPTANG\" description=\"Dollar sign acts as Bomb\" />\n      <gamegenie code=\"KASPTANK\" description=\"Dollar sign acts as heart with Bomb\" />\n      <gamegenie code=\"OPSPTANG\" description=\"Dollar sign acts as skate\" />\n      <gamegenie code=\"OZSPTANK\" description=\"Dollar sign acts as vest for a short time\" />\n      <gamegenie code=\"GAXKSTAA\" description=\"Super start (1 of 2)\" />\n      <gamegenie code=\"GASKKTAA\" description=\"Super start (2 of 2)\" />\n      <gamegenie code=\"OXXAPYSX\" description=\"Immune to explosions (1 of 2)\" />\n      <gamegenie code=\"PEXAZNVZ\" description=\"Immune to explosions (2 of 2)\" />\n      <gamegenie code=\"OXOEGYSX\" description=\"Walk through walls (1 of 2)\" />\n      <gamegenie code=\"PEOEINSZ\" description=\"Walk through walls (2 of 2)\" />\n      <gamegenie code=\"AEEGEPZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEEGEPZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEEGEPZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-GWVHE\" name=\"Bonk's Adventure\" crc=\"4E44FF44\">\n      <gamegenie code=\"SZVZINVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAXXZILA\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"LINXTZYZ\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AEKAAAZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEKAAAZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEKAAAZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GEUAAEGA\" description=\"Start with less initial energy (but more maximum energy)\" />\n      <gamegenie code=\"AOUAAEGE\" description=\"Start with more energy\" />\n      <gamegenie code=\"GXEEYEGA\" description=\"Super-jump when normal\" />\n      <gamegenie code=\"GXVPIKSE\" description=\"Keep speed up after powered down\" />\n      <gamegenie code=\"GASZTYAA\" description=\"Gain energy from picking up smiles\" />\n      <gamegenie code=\"YEXELAAA\" description=\"Start on stage 2-1\" />\n      <gamegenie code=\"IEXELAAE\" description=\"Start on stage 3-1\" />\n      <gamegenie code=\"ZOXELAAA\" description=\"Start on stage 4-1\" />\n      <gamegenie code=\"YOXELAAA\" description=\"Start on Stage 5-1\" />\n      <gamegenie code=\"PXXELAAA\" description=\"Start on stage 6-1\" />\n    </game>\n    <game code=\"CLV-H-ISODZ\" name=\"Boulder Dash\" crc=\"A8F4D99E\">\n      <gamegenie code=\"AAEGLTPA\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"AVKKPLSZ\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"IKEKYOYX\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"AEUGVGIZ\" description=\"One Diamond needed to open exit\" />\n      <gamegenie code=\"SLEZXTVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXSGSYAX\" description=\"Infinite time\" />\n      <gamegenie code=\"PAKIELLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAKIELLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAKIELLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PEOXEYLA\" description=\"1 life after continue\" />\n      <gamegenie code=\"TEOXEYLA\" description=\"6 lives after continue\" />\n      <gamegenie code=\"PEOXEYLE\" description=\"9 lives after continue\" />\n      <gamegenie code=\"YOSGXNYU\" description=\"Speed up timer\" />\n      <gamegenie code=\"NNSGXNYU\" description=\"Slow down timer\" />\n    </game>\n    <game code=\"CLV-H-OWTJL\" name=\"Boy and His Blob, A: Trouble on Blobolonia, David Crane's\" crc=\"4D1AC58C\">\n      <gamegenie code=\"AAULNGIA\" description=\"1 life only\" />\n      <gamegenie code=\"ZAULNGIE\" description=\"Double lives\" />\n      <gamegenie code=\"GXXEOPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAVKIPPA\" description=\"Infinite Jellybeans\" />\n      <gamegenie code=\"SXEEZAAX\" description=\"Fast play\" />\n      <gamegenie code=\"AVOGAEOZ\" description=\"Invincibility (restart if you die underwater and get stuck by being unable to call your Blob)\" />\n      <gamegenie code=\"AVOPVGEI\" description=\"Never take damage from enemies\" />\n      <gamegenie code=\"APEUUIAA\" description=\"Gives 10 Orange Jellybeans\" />\n      <gamegenie code=\"AONUSGAA\" description=\"10 Lime Jellybeans\" />\n      <gamegenie code=\"OONLOGZN\" description=\"99 Licorice Jellybeans\" />\n      <gamegenie code=\"AUNLUGIP\" description=\"Double Strawberry Jellybeans\" />\n      <gamegenie code=\"TUNLNKAP\" description=\"Double Cola Jellybeans\" />\n      <gamegenie code=\"AKNUOGGX\" description=\"Double Cinnamon Jellybeans\" />\n      <gamegenie code=\"GXNUUGZP\" description=\"Double Apple Jellybeans\" />\n      <gamegenie code=\"AVNUNGAL\" description=\"Double Vanilla Jellybeans\" />\n      <gamegenie code=\"ZPELNITA\" description=\"Double Ketchup Jellybeans\" />\n      <gamegenie code=\"AONLSGTE\" description=\"Triple Coconut Jellybeans\" />\n      <gamegenie code=\"APELUITE\" description=\"Triple Rootbeer Jellybeans\" />\n      <gamegenie code=\"APEUSIAA\" description=\"10 Vitamin A for Vita-Blaster\" />\n      <gamegenie code=\"APEUNIAA\" description=\"10 Vitamin B for Vita-Blaster\" />\n      <gamegenie code=\"APOLOIAA\" description=\"10 Vitamin C for Vita-Blaster\" />\n      <gamegenie code=\"SZXLXKSU\" description=\"Start with 101 of all starting Jellybeans (1 of 2)\" />\n      <gamegenie code=\"YYXLUGEY\" description=\"Start with 101 of all starting Jellybeans (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-VFUUQ\" name=\"Bram Stoker's Dracula\" crc=\"DFA111F1\">\n      <gamegenie code=\"NUNTZUKU\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXNTPUVK\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"ASVIAPEI\" description=\"Invincibility\" />\n      <gamegenie code=\"SZKLVZAX\" description=\"Invincibility after getting hit\" />\n      <gamegenie code=\"SUXLISVS\" description=\"Infinite energy (except falling off cliffs)\" />\n      <gamegenie code=\"SXXLISVS\" description=\"Infinite health\" />\n      <gamegenie code=\"AEVGPPPA\" description=\"Infinite time\" />\n      <gamegenie code=\"SXNKGOSE\" description=\"Infinite time (alt) (1 of 2)\" />\n      <gamegenie code=\"SXNGYOSE\" description=\"Infinite time (alt) (2 of 2)\" />\n      <gamegenie code=\"SZNVVSVK\" description=\"Infinite ammo\" />\n      <gamegenie code=\"ZEVGPPPA\" description=\"Faster timer\" />\n      <gamegenie code=\"UUETEIZE\" description=\"Infinite weapons (except scene 1 daytime)\" />\n      <gamegenie code=\"AANGYZIA\" description=\"Always have 63 ammo\" />\n      <gamegenie code=\"NNSNGPZE\" description=\"Disable axe\" />\n    </game>\n    <game code=\"CLV-H-WPRRM\" name=\"Break Time: The National Pool Tour\" crc=\"5F0BCE2A\">\n      <gamegenie code=\"VAVEILSA\" description=\"Start in XX (1 of 2)\" />\n      <gamegenie code=\"PAVEGLAA\" description=\"Start in Milwaukee (2 of 2)\" />\n      <gamegenie code=\"ZAVEGLAA\" description=\"Start in Atlanta (2 of 2)\" />\n      <gamegenie code=\"LAVEGLAA\" description=\"Start in Los Angeles (2 of 2)\" />\n      <gamegenie code=\"GAVEGLAA\" description=\"Start in Las Vegas (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FQMDC\" name=\"BreakThru\" crc=\"A5E8D2CD\">\n      <gamegenie code=\"GZUKYPVG\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"GZKSLZVG\" description=\"Infinite weapon time\" />\n      <gamegenie code=\"LTUKTLAA\" description=\"Start each life with 3-way firing and 99 seconds\" />\n      <gamegenie code=\"PEUKPZLA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"PEKGGZLA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"TEUKPZLA\" description=\"Start with 6 lives - P1\" />\n      <gamegenie code=\"TEKGGZLA\" description=\"Start with 6 lives - P2\" />\n      <gamegenie code=\"PEUKPZLE\" description=\"Start with 9 lives - P1\" />\n      <gamegenie code=\"PEKGGZLE\" description=\"Start with 9 lives - P2\" />\n      <gamegenie code=\"ZANKLZPA\" description=\"Start on level 2\" />\n      <gamegenie code=\"LANKLZPA\" description=\"Start on level 3\" />\n      <gamegenie code=\"GANKLZPA\" description=\"Start on level 4\" />\n      <gamegenie code=\"IANKLZPA\" description=\"Start on level 5\" />\n    </game>\n    <game code=\"CLV-H-PGBNK\" name=\"Bubble Bath Babes\" crc=\"68AFEF5F\">\n      <gamegenie code=\"AAKAIAPE\" description=\"View slideshow (1 of 4)\" />\n      <gamegenie code=\"VTXEXPSA\" description=\"View slideshow (2 of 4)\" />\n      <gamegenie code=\"EAXEUPGV\" description=\"View slideshow (3 of 4)\" />\n      <gamegenie code=\"GAUASOLE\" description=\"View slideshow (4 of 4)\" />\n      <gamegenie code=\"SZEOLLVG\" description=\"Infinite credits\" />\n    </game>\n    <game code=\"CLV-H-OCUZV\" name=\"Bucky O'Hare\" crc=\"E19EE99C\">\n      <gamegenie code=\"AEUEOYEL\" description=\"Multi-jump (1 of 2)\" />\n      <gamegenie code=\"AEXAUYAP\" description=\"Multi-jump (2 of 2)\" />\n      <gamegenie code=\"GXOEZTEL\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"GZNEYTEL\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"OXEAGVPV\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"OXOEYVPV\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"SLKSVUSO\" description=\"One hit kills\" />\n      <gamegenie code=\"ENKEVGAP\" description=\"All characters always selectable\" />\n      <gamegenie code=\"AESGILPE\" description=\"Press Start to complete the level (1 of 4)\" />\n      <gamegenie code=\"AESKALPA\" description=\"Press Start to complete the level (2 of 4)\" />\n      <gamegenie code=\"GOSGYUPE\" description=\"Press Start to complete the level (3 of 4)\" />\n      <gamegenie code=\"OXSGGUPK\" description=\"Press Start to complete the level (4 of 4)\" />\n      <gamegenie code=\"PEUKEIZE\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"AAELXYZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAELXYZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAELXYZE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"AEXGVYZA\" description=\"1 life after continue\" />\n      <gamegenie code=\"IEXGVYZA\" description=\"6 lives after continue\" />\n      <gamegenie code=\"PEXGVYZE\" description=\"10 lives after continue\" />\n      <gamegenie code=\"SZVKOTVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"TAOLKYGP\" description=\"Start with 1/2 health\" />\n      <gamegenie code=\"EPELVNKE\" description=\"Double Bucky's special health\" />\n      <gamegenie code=\"KZELVNKA\" description=\"Triple Bucky's special health\" />\n      <gamegenie code=\"KAEUXNGE\" description=\"All characters start with normal special health\" />\n      <gamegenie code=\"EPEUXNGE\" description=\"All characters start with 2x special health\" />\n      <gamegenie code=\"KZEUXNGA\" description=\"All characters start with 3x special health\" />\n    </game>\n    <game code=\"CLV-H-YDJZI\" name=\"Bugs Bunny Birthday Blowout, The\" crc=\"126EBF66\">\n      <gamegenie code=\"ATYZPL\" description=\"Invincibility\" />\n      <gamegenie code=\"SXEZGUSE\" description=\"Infinite health\" />\n      <gamegenie code=\"SZVIGKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"LAOANZTE\" description=\"Mega-jumping Bugs\" />\n      <gamegenie code=\"AEOXPZGE\" description=\"Two hearts of energy gained on pick-up\" />\n      <gamegenie code=\"PEOXPZGA\" description=\"Less energy gained on pick-up\" />\n      <gamegenie code=\"ATNZALAL\" description=\"Stunned for longer\" />\n      <gamegenie code=\"IPNZALAL\" description=\"Stunned for less time\" />\n      <gamegenie code=\"AASAKOTL\" description=\"Use hammer when stunned\" />\n    </game>\n    <game code=\"CLV-H-ATGJY\" name=\"Bugs Bunny Crazy Castle, The\" crc=\"E50A9130\">\n      <gamegenie code=\"SZOKGPVG\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"PAUGPAIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZAUGPAIE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"GXETZZEI\" description=\"Invincibility\" />\n      <gamegenie code=\"GXKGZZEY\" description=\"Baddies go as fast as Bugs Bunny\" />\n      <gamegenie code=\"GASGAAPA\" description=\"Make platforms invisible\" />\n      <gamegenie code=\"PXXTGGEN\" description=\"Start with super rabbit punches (1 of 2)\" />\n      <gamegenie code=\"PXXTAGAO\" description=\"Start with super rabbit punches (2 of 2)\" />\n      <gamegenie code=\"SZOKGAAX\" description=\"Start on level XX (1 of 2)\" />\n      <gamegenie code=\"PEXYVYAE\" description=\"Start on level 10 (2 of 2)\" />\n      <gamegenie code=\"LOXYVYAA\" description=\"Start on level 20 (2 of 2)\" />\n      <gamegenie code=\"IOXYVYAE\" description=\"Start on level 30 (2 of 2)\" />\n      <gamegenie code=\"YXXYVYAA\" description=\"Start on level 40 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GWXDW\" name=\"Bump 'n' Jump\" crc=\"A0A095C4\">\n      <gamegenie code=\"AAVPNLGP\" description=\"Jump OK, even with no power\" />\n      <gamegenie code=\"ZAUZAIPA\" description=\"Gain double power on every pick-up\" />\n      <gamegenie code=\"AGVONLAA\" description=\"Jump OK at any speed\" />\n      <gamegenie code=\"PANPNLIE\" description=\"Set jump OK speed to 190\" />\n      <gamegenie code=\"LANPNLIA\" description=\"Set jump OK speed to 130\" />\n      <gamegenie code=\"GEOAGGAA\" description=\"Start on scene 5\" />\n      <gamegenie code=\"PEOAGGAE\" description=\"Start on scene 10\" />\n      <gamegenie code=\"TEOAGGAE\" description=\"Start on scene 15\" />\n    </game>\n    <game code=\"CLV-H-KHSHW\" name=\"Burai Fighter\" crc=\"CE228874\">\n      <gamegenie code=\"PEOLATIE\" description=\"Extra lives for Eagle level\" />\n      <gamegenie code=\"AEOLPTGE\" description=\"Extra lives for Albatross level\" />\n      <gamegenie code=\"TEOLZTLA\" description=\"Extra lives for Ace level\" />\n      <gamegenie code=\"VNOTENVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"LAXTTPPA\" description=\"More power for weapons\" />\n      <gamegenie code=\"ZAXTTPPE\" description=\"Maximum power for weapons\" />\n      <gamegenie code=\"PASVTPZE\" description=\"Increase cobalt power picked up\" />\n      <gamegenie code=\"VTVNIPSA\" description=\"Start with laser\" />\n      <gamegenie code=\"VTNYPPSA\" description=\"Start with rotating pod\" />\n      <gamegenie code=\"OUVNAXOO\" description=\"Never lose weapon power\" />\n      <gamegenie code=\"KXNYLZSA\" description=\"Never lose speed up\" />\n      <gamegenie code=\"KXVNYZSA\" description=\"Never lose weapons\" />\n      <gamegenie code=\"KXNYPZSA\" description=\"Never lose rotating pod\" />\n      <gamegenie code=\"AVVNLXOZ\" description=\"Never lose anything\" />\n    </game>\n    <game code=\"CLV-H-HFNDT\" name=\"BurgerTime\" crc=\"DAF9D7E3\">\n      <gamegenie code=\"SZSTVAVI\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"AASGKLGE\" description=\"Start with 8 lives\" />\n      <gamegenie code=\"SLKIZYVI\" description=\"Start with infinite peppers\" />\n      <gamegenie code=\"APVGSLIA\" description=\"Start with double peppers\" />\n      <gamegenie code=\"GZVIAZEI\" description=\"Anti-gravity shoes\" />\n      <gamegenie code=\"YPESOUGO\" description=\"Peter Pepper gets super speed\" />\n      <gamegenie code=\"SZKNNIAX\" description=\"Fast play for experts\" />\n      <gamegenie code=\"SXVSSXSU\" description=\"Monsters always move slowly\" />\n      <gamegenie code=\"SXVSSXSU\" description=\"Monsters move at XX speed (1 of 2)\" />\n      <gamegenie code=\"GOVSVXAO\" description=\"Monsters move at double speed (2 of 2)\" />\n      <gamegenie code=\"YOVSVXAO\" description=\"Monsters move at quadruple speed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-XXNIX\" name=\"Cabal\" crc=\"BDF046EF\">\n      <gamegenie code=\"ENNOLGEI\" description=\"Invincibility\" />\n      <gamegenie code=\"GXEOZZVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"SSEOZZVI\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"UNUOTTNN\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"UNUOTTNY\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"KYVEOZUY\" description=\"Start with 20 Grenades\" />\n      <gamegenie code=\"NYVEOZUY\" description=\"Start with 50 Grenades\" />\n      <gamegenie code=\"AEUXSIPA\" description=\"Infinite Grenades\" />\n      <gamegenie code=\"GAVXNGGE\" description=\"12 Grenades on pick-up\" />\n      <gamegenie code=\"ZAVXNGGA\" description=\"2 Grenades on pick-up\" />\n      <gamegenie code=\"AKOPLZEG\" description=\"Shorter immunity\" />\n      <gamegenie code=\"NNOPLLEK\" description=\"Longer immunity\" />\n    </game>\n    <game code=\"CLV-H-PNNHQ\" name=\"Captain America and the Avengers\" crc=\"58C7DDAF\">\n      <gamegenie code=\"OLNUNEOO\" description=\"Infinite life - Captain America and Hawkeye, 1P mode\" />\n      <gamegenie code=\"SZSULYVG\" description=\"Infinite continues\" />\n      <gamegenie code=\"GPNXIUZA\" description=\"Large power stones worth 20 points\" />\n      <gamegenie code=\"TPNXIUZE\" description=\"Large power stones worth 30 points\" />\n      <gamegenie code=\"ZLNXIUZA\" description=\"Large power stones worth 50 points\" />\n      <gamegenie code=\"ZAUZILPE\" description=\"Small power stones worth 10 points\" />\n      <gamegenie code=\"LSUPUELO\" description=\"Hawkeye shoots arrows faster\" />\n      <gamegenie code=\"VYNXTXNN\" description=\"Faster Captain America and Hawkeye - one direction only (1 of 2)\" />\n      <gamegenie code=\"ZEEZAZPA\" description=\"Faster Captain America and Hawkeye - one direction only (2 of 2)\" />\n      <gamegenie code=\"SYNXTXNN\" description=\"Even faster Captain America and Hawkeye - one direction only (1 of 2)\" />\n      <gamegenie code=\"LEEZAZPA\" description=\"Even faster Captain America and Hawkeye - one direction only (2of 2)\" />\n    </game>\n    <game code=\"CLV-H-XWYOY\" name=\"Captain Planet and the Planeteers\" crc=\"0B404915\">\n      <gamegenie code=\"SZNKNUSE\" description=\"Invincibility\" />\n      <gamegenie code=\"SKNLYVVK\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"SXNLYVVK\" description=\"Infinite lives - outside levels\" />\n      <gamegenie code=\"SZSUGVVK\" description=\"Infinite lives - inside levels\" />\n      <gamegenie code=\"PAETITGE\" description=\"Start with 10 lives - inside levels\" />\n      <gamegenie code=\"PAETITGA\" description=\"Start with 2 lives - inside levels\" />\n      <gamegenie code=\"SZNXGXVK\" description=\"Infinite power - outside levels (1 of 2)\" />\n      <gamegenie code=\"SZVXPKVK\" description=\"Infinite power - outside levels (2 of 2)\" />\n      <gamegenie code=\"SXXXEUVK\" description=\"Infinite power - inside levels (1 of 2)\" />\n      <gamegenie code=\"SZEUGKVK\" description=\"Infinite power - inside levels (2 of 2)\" />\n      <gamegenie code=\"AANVAEGZ\" description=\"Start inside level 1 instead of outside\" />\n      <gamegenie code=\"PENVIGGA\" description=\"Start with 2 lives instead of 5 - outside levels\" />\n      <gamegenie code=\"PENVIGGE\" description=\"Start with 10 lives - outside levels\" />\n    </game>\n    <game code=\"CLV-H-DBTQP\" name=\"Captain SkyHawk\" crc=\"EFD26E37\">\n      <gamegenie code=\"OZKAIGVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SGKAIGVG\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"PEUITIIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZEUITIIE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"OZXPUZVK\" description=\"Infinite Maverick missiles\" />\n      <gamegenie code=\"OXKPVGVK\" description=\"Infinite Hawk Bombs\" />\n      <gamegenie code=\"LESITITA\" description=\"Start with half Hawk Bombs\" />\n      <gamegenie code=\"GOSITITA\" description=\"Start with 20 Hawk Bombs\" />\n      <gamegenie code=\"AESSZIZE\" description=\"Start with 8 Phoenix and Maverick missiles\" />\n      <gamegenie code=\"GENXKGZA\" description=\"Double cost of Hawk Bombs\" />\n      <gamegenie code=\"GAXZKIZA\" description=\"Double cost of Phoenix missiles\" />\n      <gamegenie code=\"ZAOZEIIE\" description=\"Double cost of Maverick missiles\" />\n    </game>\n    <game code=\"CLV-H-QKSHM\" name=\"Casino Kid\" crc=\"05A688C8\">\n      <gamegenie code=\"OXKEPTES\" description=\"Always win hand in Blackjack\" />\n      <gamegenie code=\"OXOEIIEO\" description=\"Can always bet all money in Blackjack\" />\n      <gamegenie code=\"SZOOUKGK\" description=\"Always win hand in Poker\" />\n      <gamegenie code=\"VAVAKXAT\" description=\"Can always bet all money in Poker\" />\n    </game>\n    <game code=\"CLV-H-ZCUUW\" name=\"Casino Kid II\" crc=\"7329118D\">\n      <gamegenie code=\"AZKKYOTG\" description=\"Start new game with $82 instead of $200\" />\n      <gamegenie code=\"EGKKYOTK\" description=\"Start new game with $512\" />\n      <gamegenie code=\"AZSGGPAA\" description=\"Start new game with $21,171\" />\n      <gamegenie code=\"EGSGGPAE\" description=\"Start new game with $131,272\" />\n      <gamegenie code=\"AASKPPAE\" description=\"Start new game with $1,342,377\" />\n      <gamegenie code=\"AZSKPPAA\" description=\"Start new game with $5,368,909\" />\n      <gamegenie code=\"PAOASGIE\" description=\"Can't double down in blackjack (game will say you do not have enough money)\" />\n      <gamegenie code=\"PAKAVIIE\" description=\"Can't split in blackjack (game will say you do not have enough money)\" />\n    </game>\n    <game code=\"CLV-H-SHQRS\" name=\"Castelian\" crc=\"0AE6C9E2\">\n      <gamegenie code=\"SXKTEISA\" description=\"Invincibility\" />\n      <gamegenie code=\"SLOKZLVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"SIOKZLVI\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"PEVGYPLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEVGYPLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEVGYPLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"IAOGTZZA\" description=\"Start with 5 continues\" />\n      <gamegenie code=\"AAOGTZZE\" description=\"Start with 8 continues\" />\n      <gamegenie code=\"SZNXYAVG\" description=\"Infinite time\" />\n    </game>\n    <game code=\"CLV-H-IKMEF\" name=\"Castle of Deceit\" crc=\"345D3A1A\">\n      <gamegenie code=\"SXNIOUVK\" description=\"Infinite energy\" />\n      <gamegenie code=\"SZOSYSVK\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-TTHAA\" name=\"Castle of Dragon\" crc=\"2F2D1FA9\">\n      <gamegenie code=\"PEVPULAP\" description=\"Stop Skeletons from fighting\" />\n      <gamegenie code=\"GEOGYZPA\" description=\"Faster fighting\" />\n      <gamegenie code=\"ZPSLONLP\" description=\"Super strong enemies\" />\n      <gamegenie code=\"SZVUSNVK\" description=\"No harm from most enemy attacks\" />\n      <gamegenie code=\"YNOLSYAE\" description=\"Infinite health\" />\n      <gamegenie code=\"NYXKLAGE\" description=\"Super health\" />\n      <gamegenie code=\"ZAXGLAAA\" description=\"Start with Knives\" />\n      <gamegenie code=\"LAXGLAAA\" description=\"Start with Knives and Mace\" />\n      <gamegenie code=\"EAXGLAAA\" description=\"Start with Armor\" />\n      <gamegenie code=\"UAXGLAAA\" description=\"Start with Armor, Knives and Mace\" />\n    </game>\n    <game code=\"CLV-H-MXFOL\" name=\"Castlequest\" crc=\"12906664\">\n      <gamegenie code=\"SXUEXSSE\" description=\"Invincibility\" />\n      <gamegenie code=\"SXKAVIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"ATSXATEY\" description=\"Infinite keys\" />\n      <gamegenie code=\"LKUZTZZU\" description=\"75 lives instead of 50\" />\n      <gamegenie code=\"POUZTZZU\" description=\"25 lives instead of 50\" />\n      <gamegenie code=\"SXKNKLVG\" description=\"Don't lose life from 'reset' or 'back' options\" />\n      <gamegenie code=\"SZOEIUVK\" description=\"Use sword (press 'B') as long as you like\" />\n      <gamegenie code=\"XXOAZGYA\" description=\"Now you can move while using sword\" />\n      <gamegenie code=\"IAEEALYP\" description=\"Must use with the last code for permanent sword-wielding ability\" />\n      <gamegenie code=\"GAXEGIZA\" description=\"Supercharged speed-up (1 of 2)\" />\n      <gamegenie code=\"GAUEGIZA\" description=\"Supercharged speed-up (2 of 2)\" />\n      <gamegenie code=\"AAXEGIZE\" description=\"Turbo fuel-injected 16-valve speed-up (1 of 2)\" />\n      <gamegenie code=\"AAUEGIZE\" description=\"Turbo fuel-injected 16-valve speed-up (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-OTBWY\" name=\"Castlevania III: Dracula's Curse\" crc=\"ED2465BE\">\n      <gamegenie code=\"EIOAZPEY\" description=\"Invincibility (disable if you cannot enter a door)\" />\n      <gamegenie code=\"SZKLPZSA\" description=\"Invincibility (disable if you cannot enter a door) (alt)\" />\n      <gamegenie code=\"OXEEZZSE\" description=\"Infinite health\" />\n      <gamegenie code=\"OXOAUPSE\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEELYXAP\" description=\"Hit anywhere (Whip)\" />\n      <gamegenie code=\"AVVAELAP\" description=\"Multi-jump (01 of 15)\" />\n      <gamegenie code=\"EISOKAIV\" description=\"Multi-jump (02 of 15)\" />\n      <gamegenie code=\"EPSPKAEL\" description=\"Multi-jump (03 of 15)\" />\n      <gamegenie code=\"IASONATZ\" description=\"Multi-jump (04 of 15)\" />\n      <gamegenie code=\"IASOXEGA\" description=\"Multi-jump (05 of 15)\" />\n      <gamegenie code=\"IAVPOEAA\" description=\"Multi-jump (06 of 15)\" />\n      <gamegenie code=\"OZSOOAES\" description=\"Multi-jump (07 of 15)\" />\n      <gamegenie code=\"PSSPINYG\" description=\"Multi-jump (08 of 15)\" />\n      <gamegenie code=\"PSVPYUYG\" description=\"Multi-jump (09 of 15)\" />\n      <gamegenie code=\"SASOUESX\" description=\"Multi-jump (10 of 15)\" />\n      <gamegenie code=\"SASPVESX\" description=\"Multi-jump (11 of 15)\" />\n      <gamegenie code=\"SZSPOAGA\" description=\"Multi-jump (12 of 15)\" />\n      <gamegenie code=\"SZUPOASA\" description=\"Multi-jump (13 of 15)\" />\n      <gamegenie code=\"TZSPXEOG\" description=\"Multi-jump (14 of 15)\" />\n      <gamegenie code=\"ZASPUEAE\" description=\"Multi-jump (15 of 15)\" />\n      <gamegenie code=\"ATUEGXSA\" description=\"No knock-back when hurt\" />\n      <gamegenie code=\"PALUYL\" description=\"Start with 9500 seconds\" />\n      <gamegenie code=\"OOKPPAIE\" description=\"Start each stage with 99 hearts\" />\n      <gamegenie code=\"AAUPLLAG\" description=\"Bosses have no health\" />\n      <gamegenie code=\"LAUPLVPA\" description=\"High jump\" />\n      <gamegenie code=\"ZEVOGTPA\" description=\"Walk twice as fast to the right\" />\n      <gamegenie code=\"VYXOANNN\" description=\"Walk twice as fast to the left\" />\n      <gamegenie code=\"OPELUZEP\" description=\"Infinite hearts\" />\n    </game>\n    <game code=\"CLV-H-YVOEQ\" name=\"Championship Pool\" crc=\"CDC641FC\">\n      <gamegenie code=\"PAOUYALA\" description=\"1 foul loses the game (instead of 3) - only in 10-ball in party mode\" />\n      <gamegenie code=\"ZAOUYALA\" description=\"2 fouls in a row loses the game - only on 9 and 10-ball in party mode\" />\n      <gamegenie code=\"SLNUKXSO\" description=\"Fouls don't count - only on 9 and 10-ball and rotation in party mode\" />\n      <gamegenie code=\"SUOLXXSO\" description=\"Number of fouls is not cleared after a good shot (3 fouls don't have to be in a row to lose) - only on 10-ball in party mode\" />\n      <gamegenie code=\"OZVETASX\" description=\"Always break in XX (1 of 2)\" />\n      <gamegenie code=\"AAVEYEST\" description=\"Always break in 9 or 10-ball (2 of 2) - P1\" />\n      <gamegenie code=\"PAVEYEST\" description=\"Always break in 9 or 10-ball (2 of 2) - P2\" />\n    </game>\n    <game code=\"CLV-H-IZZIF\" name=\"Cheetah Men II (U) [!p]\" crc=\"9AB274AE\">\n      <gamegenie code=\"SXEZGUVK\" description=\"Infinite health - level 4\" />\n      <gamegenie code=\"SXUXGUVK\" description=\"Infinite health - level 1 and 2\" />\n      <gamegenie code=\"SXSXGUVK\" description=\"Infinite health - level 3\" />\n      <gamegenie code=\"SXXUIXVK\" description=\"Infinite lives - level 4\" />\n      <gamegenie code=\"SZEUYUVK\" description=\"Infinite lives - level 3\" />\n      <gamegenie code=\"SZNUAUVK\" description=\"Infinite lives - level 1 and 2\" />\n    </game>\n    <game code=\"CLV-H-YCCUX\" name=\"Chessmaster, The\" crc=\"D7F6320C\">\n      <gamegenie code=\"AAVKNLTI\" description=\"Move pieces anywhere (1 of 3)\" />\n      <gamegenie code=\"SZNGULSA\" description=\"Move pieces anywhere (3 of 3)\" />\n      <gamegenie code=\"SZNKELSA\" description=\"Move pieces anywhere (2 of 3)\" />\n    </game>\n    <game code=\"CLV-H-URPXD\" name=\"Chip 'n Dale Rescue Rangers, Disney's\" crc=\"8BF29CB6\">\n      <gamegenie code=\"AOEITEEN\" description=\"Infinite health\" />\n      <gamegenie code=\"AAKGSGPA\" description=\"Multi-jump (1 of 2)\" />\n      <gamegenie code=\"SXXKEOZA\" description=\"Multi-jump (2 of 2)\" />\n      <gamegenie code=\"ATUEENSL\" description=\"Freeze mechanical bulldog\" />\n      <gamegenie code=\"AVKAVNSL\" description=\"Freeze mechanical mice\" />\n      <gamegenie code=\"AVOPTESL\" description=\"Freeze buzzer\" />\n      <gamegenie code=\"AVNOLKSL\" description=\"Freeze buzz bomb\" />\n      <gamegenie code=\"AVVPZSSL\" description=\"Freeze racket-rod\" />\n      <gamegenie code=\"ATSOYKSL\" description=\"Freeze ditz\" />\n      <gamegenie code=\"ATSPANSL\" description=\"Freeze hawk bomber\" />\n      <gamegenie code=\"AVVOOUSL\" description=\"Freeze bouncing boxes\" />\n      <gamegenie code=\"ZEXKNPTE\" description=\"Mega-jump\" />\n      <gamegenie code=\"GAEIIEVI\" description=\"Never get stunned\" />\n      <gamegenie code=\"IVEKINEO\" description=\"Press Start to finish the level\" />\n    </game>\n    <game code=\"CLV-H-NBEFH\" name=\"Chip 'n Dale Rescue Rangers 2, Disney's\" crc=\"FC5783A7\">\n      <gamegenie code=\"EIXZEZEY\" description=\"Invincibility (glitchy)\" />\n      <gamegenie code=\"SSXLLEVS\" description=\"Infinite health\" />\n      <gamegenie code=\"OUXLLEVS\" description=\"Infinite health - both players\" />\n      <gamegenie code=\"XVXXXGVS\" description=\"Never get stunned\" />\n      <gamegenie code=\"PEUYIILA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"ZEUYIILA\" description=\"Start with 2 lives - both players\" />\n      <gamegenie code=\"GEUYIILA\" description=\"Start with 4 lives - both players\" />\n      <gamegenie code=\"IEUYIILA\" description=\"Start with 5 lives - both players\" />\n      <gamegenie code=\"NXKZKTVI\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"GXKZKTVI\" description=\"Almost infinite lives - both players\" />\n      <gamegenie code=\"PEOYZILA\" description=\"Start with 1 heart - both players\" />\n      <gamegenie code=\"ZEOYZILA\" description=\"Start with 2 hearts - both players\" />\n      <gamegenie code=\"GEOYZILA\" description=\"Start with 4 hearts - both players\" />\n      <gamegenie code=\"IEOYZILA\" description=\"Start with 5 hearts - both players\" />\n      <gamegenie code=\"PANNAILA\" description=\"Start with 1 credit\" />\n      <gamegenie code=\"ZANNAILA\" description=\"Start with 2 credits\" />\n      <gamegenie code=\"TANNAILA\" description=\"Start with 6 credits\" />\n      <gamegenie code=\"PANNAILE\" description=\"Start with 9 credits\" />\n      <gamegenie code=\"NYNNAILE\" description=\"Start with 255 credits (ignore the counter)\" />\n      <gamegenie code=\"OXUNGIVK\" description=\"Infinite credits\" />\n    </game>\n    <game code=\"CLV-H-EKGMO\" name=\"Chubby Cherub\" crc=\"77833016\">\n      <gamegenie code=\"SZEAYZVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZEXIYSA\" description=\"Infinite power\" />\n      <gamegenie code=\"AEOAAZZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEOAAZZA\" description=\"Start with double lives\" />\n      <gamegenie code=\"AEOAAZZE\" description=\"Start with triple lives\" />\n      <gamegenie code=\"GEVAKVAA\" description=\"Half regular power gained from food\" />\n      <gamegenie code=\"PENXATZA\" description=\"Slow down power loss on the ground\" />\n      <gamegenie code=\"LENXTVPA\" description=\"Slow down power loss in the air\" />\n      <gamegenie code=\"ZANEVSUT\" description=\"Infinite Gau (shots)\" />\n      <gamegenie code=\"AASXOAGE\" description=\"Double Gau (shots) on candy pick-up\" />\n      <gamegenie code=\"IEOALZPA\" description=\"Start on Stage 5 (1 of 2)\" />\n      <gamegenie code=\"GEOAPZAA\" description=\"Start on Stage 5 (2 of 2)\" />\n      <gamegenie code=\"ZEOALZPE\" description=\"Start on Stage 10 (1 of 2)\" />\n      <gamegenie code=\"PEOAPZAE\" description=\"Start on Stage 10 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-MGKBV\" name=\"Circus Caper\" crc=\"D152FB02\">\n      <gamegenie code=\"SYNNPGLA\" description=\"Invincibility in normal levels (1 of 3)\" />\n      <gamegenie code=\"TANNAGZS\" description=\"Invincibility in normal levels (2 of 3)\" />\n      <gamegenie code=\"AZNYYKSZ\" description=\"Invincibility in normal levels (3 of 3)\" />\n      <gamegenie code=\"GZEYPSSE\" description=\"Infinite power (health)\" />\n      <gamegenie code=\"SZEYPSSE\" description=\"Infinite power (health) (alt)\" />\n      <gamegenie code=\"AASVNAZA\" description=\"Full health from food\" />\n      <gamegenie code=\"NNOTNLAE\" description=\"Start with lots of weapons\" />\n      <gamegenie code=\"ZEVGGAPA\" description=\"Start on stage 2 (starts on stage 1 after continuing)\" />\n      <gamegenie code=\"LEVGGAPA\" description=\"Start on stage 3 (starts on stage 1 after continuing)\" />\n      <gamegenie code=\"GEVGGAPA\" description=\"Start on stage 4 (starts on stage 1 after continuing)\" />\n      <gamegenie code=\"IEVGGAPA\" description=\"Start on stage 5 (starts on stage 1 after continuing)\" />\n      <gamegenie code=\"TEVGGAPA\" description=\"Start on stage 6 (starts on stage 1 after continuing)\" />\n    </game>\n    <game code=\"CLV-H-KHPUK\" name=\"City Connection\" crc=\"AE8666B4\">\n      <gamegenie code=\"SZNSTPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"IEKEYIZA\" description=\"Start with double lives\" />\n      <gamegenie code=\"AEKEYIZE\" description=\"Start with triple lives\" />\n      <gamegenie code=\"SXKPZGVG\" description=\"Infinite Oil\" />\n      <gamegenie code=\"AXSAPIIA\" description=\"Start with extra Oil\" />\n      <gamegenie code=\"PEKEIIAA\" description=\"Start on level 1\" />\n      <gamegenie code=\"ZEKEIIAA\" description=\"Start on level 2\" />\n      <gamegenie code=\"LEKEIIAA\" description=\"Start on level 3\" />\n      <gamegenie code=\"GEKEIIAA\" description=\"Start on level 4\" />\n      <gamegenie code=\"IEKEIIAA\" description=\"Start on level 5\" />\n    </game>\n    <game code=\"CLV-H-KJKNK\" name=\"Clash At Demonhead\" crc=\"82AFA828\">\n      <gamegenie code=\"ENOPLZEI\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ESSPPAEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SZEGZISA\" description=\"Infinite health\" />\n      <gamegenie code=\"SXNZKSVK\" description=\"Infinite barrier hits\" />\n      <gamegenie code=\"VZSULOVV\" description=\"Don't die when power hits zero\" />\n      <gamegenie code=\"VNNGNUSO\" description=\"Start with 1 of each item\" />\n      <gamegenie code=\"SXKZGSVS\" description=\"Infinite supply of all items bought\" />\n      <gamegenie code=\"AVUGAGST\" description=\"All items in shop are free\" />\n      <gamegenie code=\"TAUGKGKY\" description=\"Start with extra cash (1 of 2)\" />\n      <gamegenie code=\"UPUGVKXO\" description=\"Start with extra cash (2 of 2)\" />\n      <gamegenie code=\"AAEKVGAO\" description=\"Start with 50% power (1 of 3)\" />\n      <gamegenie code=\"AEVZNPAO\" description=\"Start with 50% power (2 of 3)\" />\n      <gamegenie code=\"ZAOGXGGA\" description=\"Start with 50% power (3 of 3)\" />\n      <gamegenie code=\"APEKVGAO\" description=\"Start with 150% power (1 of 3)\" />\n      <gamegenie code=\"TAOGXGGA\" description=\"Start with 150% power (2 of 3)\" />\n      <gamegenie code=\"AOVZNPAO\" description=\"Start with 150% power (3 of 3)\" />\n      <gamegenie code=\"AZEKVGAP\" description=\"Start with 200% power (1 of 3)\" />\n      <gamegenie code=\"AAOGXGGE\" description=\"Start with 200% power (2 of 3)\" />\n      <gamegenie code=\"AXVZNPAP\" description=\"Start with 200% power (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-MEPFA\" name=\"Cliffhanger\" crc=\"57C2AE4E\">\n      <gamegenie code=\"PASGVGLA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"IASGVGLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"YASGVGLA\" description=\"Start with 8 lives\" />\n      <gamegenie code=\"PASGVGLE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"SXEKKSVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZVPOKVK\" description=\"Protection from most hits\" />\n      <gamegenie code=\"PAKGUGLA\" description=\"Start with 1 continue\" />\n      <gamegenie code=\"IAKGUGLA\" description=\"Start with 5 continues\" />\n      <gamegenie code=\"YAKGUGLA\" description=\"Start with 7 continues\" />\n      <gamegenie code=\"PAKGUGLE\" description=\"Start with 9 continues\" />\n      <gamegenie code=\"ULOTSYTN\" description=\"Infinite continues\" />\n      <gamegenie code=\"SUNPXXSO\" description=\"Don't burn money at campfire\" />\n      <gamegenie code=\"AXOKNGAP\" description=\"Start with 2x health (does not show on meter)\" />\n      <gamegenie code=\"AEOKNGAO\" description=\"Start with 1/2 health\" />\n      <gamegenie code=\"VTVKVKSE\" description=\"Start with $100\" />\n      <gamegenie code=\"VTVKUKSE\" description=\"Start with $10,000\" />\n      <gamegenie code=\"VGVKUKSE\" description=\"Start with $650,000 (displays $xx0000 until you pick up first money bag)\" />\n      <gamegenie code=\"YONKKXAP\" description=\"Some bags contain mega-money, some contain no money\" />\n    </game>\n    <game code=\"CLV-H-YEZVX\" name=\"Clu Clu Land\" crc=\"48F68D40\">\n      <gamegenie code=\"GXLILL\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"GZPGSL\" description=\"Infinite time\" />\n      <gamegenie code=\"PAGKGL\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"APGKGL\" description=\"Start with 10 lives - both players\" />\n      <gamegenie code=\"TEYIGL\" description=\"Increase extra time\" />\n      <gamegenie code=\"VTSKPLSA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"IEVISZZA\" description=\"Shoot more rays\" />\n      <gamegenie code=\"AOVSOZAZ\" description=\"Shoot shorter rays\" />\n      <gamegenie code=\"ASVSOZAZ\" description=\"Shoot longer rays\" />\n      <gamegenie code=\"AASIAYGA\" description=\"Enemy can go thru gold bars\" />\n    </game>\n    <game code=\"CLV-H-DZVFZ\" name=\"Cobra Command\" crc=\"2D75C7A9\">\n      <gamegenie code=\"GZSSNGST\" description=\"Immune to weapon damage\" />\n      <gamegenie code=\"SXUAAOVK\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"AAUVGZGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"AAUVGZGE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-YBJUM\" name=\"Cobra Triangle\" crc=\"C8AD4F32\">\n      <gamegenie code=\"ATVXKLEI\" description=\"Invincibility\" />\n      <gamegenie code=\"SZUXZVVK\" description=\"Infinite continue options\" />\n      <gamegenie code=\"SZEVNOVK\" description=\"Don't lose life after dying from damage\" />\n      <gamegenie code=\"SZVTSOVK\" description=\"Don't lose life after dying from time running out\" />\n      <gamegenie code=\"ENXTPVSA\" description=\"Never lose your power-ups (1 of 2)\" />\n      <gamegenie code=\"LEXTZVAX\" description=\"Never lose your power-ups (2 of 2)\" />\n      <gamegenie code=\"VVXEAUSE\" description=\"Gain an extra minute (1 of 2)\" />\n      <gamegenie code=\"LOXEPLIP\" description=\"Gain an extra minute (2 of 2)\" />\n      <gamegenie code=\"EIXLPGEL\" description=\"Hit anywhere (1 of 6)\" />\n      <gamegenie code=\"ESKZXGEL\" description=\"Hit anywhere (2 of 6)\" />\n      <gamegenie code=\"KPULZGNO\" description=\"Hit anywhere (3 of 6)\" />\n      <gamegenie code=\"OLKXOSOO\" description=\"Hit anywhere (4 of 6)\" />\n      <gamegenie code=\"TAXLZGZO\" description=\"Hit anywhere (5 of 6)\" />\n      <gamegenie code=\"YOKZUKZP\" description=\"Hit anywhere (6 of 6)\" />\n    </game>\n    <game code=\"CLV-H-ZOYGF\" name=\"Code Name: Viper\" crc=\"E2313813\">\n      <gamegenie code=\"SZSSGIAX\" description=\"Invincibility\" />\n      <gamegenie code=\"STVPVOON\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"AASOVZPA\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"SZVOSOSE\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"SZOVKNVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAOXLZPA\" description=\"Infinite Machine Gun\" />\n      <gamegenie code=\"AENXZPPA\" description=\"Infinite Gun\" />\n      <gamegenie code=\"GTOVEYZL\" description=\"Double usual bullets on new life\" />\n      <gamegenie code=\"PPOVEYZU\" description=\"Half bullets on new life\" />\n      <gamegenie code=\"VVNVGKSE\" description=\"Start with Machine Gun and 256 bullets\" />\n      <gamegenie code=\"VTOTONSE\" description=\"Machine Gun with 256 bullets on new life\" />\n      <gamegenie code=\"SXKEVNOU\" description=\"Upper level jump (1 of 2)\" />\n      <gamegenie code=\"ONEOYEXN\" description=\"Upper level jump (2 of 2)\" />\n      <gamegenie code=\"GZOTONSE\" description=\"Keep Machine Gun after dying (1 of 2)\" />\n      <gamegenie code=\"GZEVVNSE\" description=\"Keep Machine Gun after dying (2 of 2)\" />\n      <gamegenie code=\"AASIVEAL\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"APOOSGLA\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"GLXPEGLP\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"SZOOKKSU\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"AEESIIGA\" description=\"Have Bomb (can exit level without the Bomb)\" />\n      <gamegenie code=\"PENTAGLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TENTAGLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PENTAGLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GTETLIZL\" description=\"Start with double usual bullets\" />\n      <gamegenie code=\"PPETLIZU\" description=\"Start with half usual bullets\" />\n    </game>\n    <game code=\"CLV-H-KBJQL\" name=\"Commando\" crc=\"82BE4724\">\n      <gamegenie code=\"ATNITPSA\" description=\"Invincibility\" />\n      <gamegenie code=\"EZEGNOVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZEGNOVK\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"XVULASXK\" description=\"Infinite Grenades\" />\n      <gamegenie code=\"AAEIEYGP\" description=\"Get items from anywhere (1 of 2)\" />\n      <gamegenie code=\"AAKIAVKI\" description=\"Get items from anywhere (2 of 2)\" />\n      <gamegenie code=\"AENTTLLI\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"AAETTGLG\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AEELGNPA\" description=\"Walk through anything (1 of 2)\" />\n      <gamegenie code=\"AASLLYTA\" description=\"Walk through anything (2 of 2)\" />\n      <gamegenie code=\"AEKKIILA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"TEKKIILA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"PEKKIILE\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"AOSGIIIA\" description=\"Start with double rations of grenades\" />\n    </game>\n    <game code=\"CLV-H-TYMCW\" name=\"Conan\" crc=\"C6000085\">\n      <gamegenie code=\"SXUEYYAX\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SZVAPGAX\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXKISTVG\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"SZVSULVG\" description=\"Infinite lives (2 of 2)\" />\n      <gamegenie code=\"SXSTOOSE\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-RUKWC\" name=\"Conquest of the Crystal Palace\" crc=\"20A5219B\">\n      <gamegenie code=\"ESVIYPEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SEVIIPSZ\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXOVLIAX\" description=\"Invincibility (alt)\" />\n      <gamegenie code=\"GZVTAPAX\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZVTLPSA\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"VVKSZOSU\" description=\"Infinite energy (will display wrong info)\" />\n      <gamegenie code=\"SXXTAIAX\" description=\"Infinite energy for Farron\" />\n      <gamegenie code=\"SUPILU\" description=\"Infinite fire power\" />\n      <gamegenie code=\"GPEYUXTA\" description=\"Maximum energy without Life Crystal\" />\n      <gamegenie code=\"GZXVPPAX\" description=\"Don't use up money when buying things (1 of 2)\" />\n      <gamegenie code=\"GZUTZPAX\" description=\"Don't use up money when buying things (2 of 2)\" />\n      <gamegenie code=\"AAVIGTZA\" description=\"Super-jump without Flight Crystal (1 of 2)\" />\n      <gamegenie code=\"PAVITTLA\" description=\"Super-jump without Flight Crystal (2 of 2)\" />\n      <gamegenie code=\"IOUSLVTA\" description=\"Increase super-jump to mega-jump\" />\n      <gamegenie code=\"IKUSLVTA\" description=\"Increase super-jump to super-mega-jump\" />\n    </game>\n    <game code=\"CLV-H-WBAOK\" name=\"Contra\" crc=\"F6035030\">\n      <gamegenie code=\"SXKVPZAX\" description=\"Invincibility\" />\n      <gamegenie code=\"SLTIYG\" description=\"Invincibility (blinking)\" />\n      <gamegenie code=\"AAVITGIA\" description=\"Invincibility (blinking) (alt)\" />\n      <gamegenie code=\"SLAIUZ\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"GXIIUX\" description=\"Keep weapons after losing life\" />\n      <gamegenie code=\"ATKSZSOZ\" description=\"Multi-jump - both players (1 of 7)\" />\n      <gamegenie code=\"AZNITGSL\" description=\"Multi-jump - both players (2 of 7)\" />\n      <gamegenie code=\"NPNIYGEU\" description=\"Multi-jump - both players (3 of 7)\" />\n      <gamegenie code=\"SUEIAGVI\" description=\"Multi-jump - both players (4 of 7)\" />\n      <gamegenie code=\"SUVSOPSP\" description=\"Multi-jump - both players (5 of 7)\" />\n      <gamegenie code=\"VINSAGEY\" description=\"Multi-jump - both players (6 of 7)\" />\n      <gamegenie code=\"XTNSPKAE\" description=\"Multi-jump - both players (7 of 7)\" />\n      <gamegenie code=\"UNVSYVKN\" description=\"Jump higher (1 of 2)\" />\n      <gamegenie code=\"XNVSPVUN\" description=\"Jump higher (2 of 2)\" />\n      <gamegenie code=\"ESEVALEP\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"GXXTPLEL\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"GZNVYLEL\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"SXKTYLAX\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"VYVIPNNN\" description=\"Run twice as fast (1 of 2)\" />\n      <gamegenie code=\"ZASSIYPA\" description=\"Run twice as fast (2 of 2)\" />\n      <gamegenie code=\"LLKSIAIX\" description=\"Press Start to complete the level\" />\n      <gamegenie code=\"PEIIXZ\" description=\"Start new life with Machine Gun\" />\n      <gamegenie code=\"ZEIIXZ\" description=\"Start new life with Fireball\" />\n      <gamegenie code=\"LEIIXZ\" description=\"Start new life with Spread Gun\" />\n      <gamegenie code=\"GEIIXZ\" description=\"Start new life with Laser\" />\n      <gamegenie code=\"ALNKPKYL\" description=\"Start on level x\" />\n      <gamegenie code=\"PANGIGAA\" description=\"Start on level 2\" />\n      <gamegenie code=\"ZANGIGAA\" description=\"Start on level 3\" />\n      <gamegenie code=\"LANGIGAA\" description=\"Start on level 4\" />\n      <gamegenie code=\"GANGIGAA\" description=\"Start on level 5\" />\n      <gamegenie code=\"IANGIGAA\" description=\"Start on level 6\" />\n      <gamegenie code=\"TANGIGAA\" description=\"Start on level 7\" />\n      <gamegenie code=\"YANGIGAA\" description=\"Start on level 8\" />\n    </game>\n    <game code=\"CLV-H-YXGJE\" name=\"Contra Force\" crc=\"A94591B0\">\n      <gamegenie code=\"SXKXZIAX\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SXUZPIAX\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"OUOXVKOO\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"AANVIAPA\" description=\"Infinite lives - all characters\" />\n      <gamegenie code=\"PAUYTTLE\" description=\"Start with 9 lives - all characters\" />\n      <gamegenie code=\"TAUYTTLA\" description=\"Start with 6 lives - all characters\" />\n      <gamegenie code=\"PAUYTTLA\" description=\"Start with 1 life - all characters\" />\n      <gamegenie code=\"OUEXNKOO\" description=\"Keep weapons after death\" />\n    </game>\n    <game code=\"CLV-H-UKKJL\" name=\"Cool World\" crc=\"D73AA04C\">\n      <gamegenie code=\"GXUVTKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXSTOTVG\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"SXVVKTVG\" description=\"Infinite Erasers\" />\n      <gamegenie code=\"AZNZEYAE\" description=\"Lots of Erasers\" />\n      <gamegenie code=\"LEVLGZPA\" description=\"Start with 3 Bombs\" />\n      <gamegenie code=\"TEVLGZPA\" description=\"Start with 6 Bombs\" />\n      <gamegenie code=\"PEVLGZPE\" description=\"Start with 9 Bombs\" />\n      <gamegenie code=\"PEKGYAZA\" description=\"Start with 2 lives (1 of 2)\" />\n      <gamegenie code=\"PAKZKYZA\" description=\"Start with 2 lives (2 of 2)\" />\n      <gamegenie code=\"TEKGYAZA\" description=\"Start with 7 lives (1 of 2)\" />\n      <gamegenie code=\"TAKZKYZA\" description=\"Start with 7 lives (2 of 2)\" />\n      <gamegenie code=\"PEKGYAZE\" description=\"Start with 10 lives (1 of 2)\" />\n      <gamegenie code=\"PAKZKYZE\" description=\"Start with 10 lives (2 of 2)\" />\n      <gamegenie code=\"LEKKGAPA\" description=\"Start with 3 Erasers (1 of 2)\" />\n      <gamegenie code=\"LAVXXYPA\" description=\"Start with 3 Erasers (2 of 2)\" />\n      <gamegenie code=\"TEKKGAPA\" description=\"Start with 6 Erasers (1 of 2)\" />\n      <gamegenie code=\"TAVXXYPA\" description=\"Start with 6 Erasers (2 of 2)\" />\n      <gamegenie code=\"PEKKGAPE\" description=\"Start with 9 Erasers (1 of 2)\" />\n      <gamegenie code=\"PAVXXYPE\" description=\"Start with 9 Erasers (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FJSQY\" name=\"Cowboy Kid\" crc=\"D18E6BE3\">\n      <gamegenie code=\"GNXPAUTS\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"OXOOIUOK\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"OUNKEUOO\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-JSWFX\" name=\"CrackOut\" crc=\"7E9BCA05\">\n      <gamegenie code=\"SZNUXAVG\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-BSHHB\" name=\"Crash 'n The Boys: Street Challenge\" crc=\"C7F0C457\">\n      <gamegenie code=\"ASVUAIIA\" description=\"Start with 50 Gold\" />\n      <gamegenie code=\"OOVUAIIE\" description=\"Start with 99 Gold\" />\n    </game>\n    <game code=\"CLV-H-VUIHV\" name=\"Crystalis\" crc=\"1335CB05\">\n      <gamegenie code=\"AEKOUPTA\" description=\"Walk through walls\" />\n      <gamegenie code=\"AAOPETLA\" description=\"Faster sword charge\" />\n      <gamegenie code=\"OZNOOKZK\" description=\"Always fire X shot (1 of 2)\" />\n      <gamegenie code=\"PANOXKZG\" description=\"Always fire charged shot (2 of 2)\" />\n      <gamegenie code=\"LANOXKZG\" description=\"Always fire bracelet charged shot (2 of 2)\" />\n      <gamegenie code=\"SZEPEVGK\" description=\"Allow sword charge while moving\" />\n      <gamegenie code=\"NYVSPZGV\" description=\"First pupil gives you more gold\" />\n      <gamegenie code=\"SXNOVXSE\" description=\"Magic doesn't use up MP\" />\n      <gamegenie code=\"AASVVNYA\" description=\"Immune to poison\" />\n      <gamegenie code=\"AEKTSNYA\" description=\"Immune to paralysis\" />\n      <gamegenie code=\"TEOTVYGA\" description=\"Stronger poison\" />\n      <gamegenie code=\"ZEOTVYGA\" description=\"Weaker poison\" />\n      <gamegenie code=\"SZUOIVSE\" description=\"Don't get charged for boarding at Inn (1 of 2)\" />\n      <gamegenie code=\"SZKPLVSE\" description=\"Don't get charged for boarding at Inn (2 of 2)\" />\n      <gamegenie code=\"SXVPUOSE\" description=\"Don't get charged for items in shops (1 of 2)\" />\n      <gamegenie code=\"SXVOOOSE\" description=\"Don't get charged for items in shops (2 of 2)\" />\n      <gamegenie code=\"VVOGUOSE\" description=\"Start with some gold\" />\n    </game>\n    <game code=\"CLV-H-ZSVDV\" name=\"Cyberball\" crc=\"88338ED5\">\n      <gamegenie code=\"SXUYAKVK\" description=\"Infinite level time\" />\n      <gamegenie code=\"PENOYLLA\" description=\"Start with level time at 1 minute\" />\n      <gamegenie code=\"ZENOYLLA\" description=\"Start with level time at 2 minutes\" />\n      <gamegenie code=\"IENOYLLA\" description=\"Start with level time at 5 minutes\" />\n      <gamegenie code=\"PENOYLLE\" description=\"Start with level time at 9 minutes\" />\n      <gamegenie code=\"AAXEZAZA\" description=\"Goals worth 0 points\" />\n      <gamegenie code=\"PAXEZAZA\" description=\"Goals worth 1 points\" />\n      <gamegenie code=\"IAXEZAZA\" description=\"Goals worth 5 points\" />\n      <gamegenie code=\"PAXEZAZE\" description=\"Goals worth 9 points\" />\n      <gamegenie code=\"LTXEZAZA\" description=\"Goals worth mega points\" />\n    </game>\n    <game code=\"CLV-H-WPNZE\" name=\"Cybernoid: The Fighting Machine\" crc=\"AC8DCDEA\">\n      <gamegenie code=\"SZVZGOVK\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"NYEATXNY\" description=\"Start with 1 life\" />\n      <gamegenie code=\"UYEATXNN\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"AAEATXNN\" description=\"Start with 18 lives\" />\n      <gamegenie code=\"GOOZZPZA\" description=\"20 Genocides on new life\" />\n      <gamegenie code=\"SZNPVOVK\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"SXEUSSVK\" description=\"Infinite Genocides\" />\n      <gamegenie code=\"SXOPUSVK\" description=\"Infinite Shields\" />\n      <gamegenie code=\"SZNOLNVK\" description=\"Infinite Seekers\" />\n      <gamegenie code=\"NNOEPPAE\" description=\"Start with Rear Laser\" />\n      <gamegenie code=\"GZKZZOSE\" description=\"Keep Rear Laser after death\" />\n      <gamegenie code=\"GZKXAOSE\" description=\"Keep Mace after death (1 of 2)\" />\n      <gamegenie code=\"GZKZIOSE\" description=\"Keep Mace after death (2 of 2)\" />\n      <gamegenie code=\"GPUETZPA\" description=\"Start new life with 20 Shields (1 of 2)\" />\n      <gamegenie code=\"GOOZYPPA\" description=\"Start new life with 20 Shields (2 of 2)\" />\n      <gamegenie code=\"GPKAZZIA\" description=\"Start with 20 Seekers and Bouncers (1 of 2)\" />\n      <gamegenie code=\"GOOXGPIA\" description=\"Start with 20 Seekers and Bouncers (2 of 2)\" />\n      <gamegenie code=\"AZUALZGO\" description=\"Start with double Bombs (1 of 2)\" />\n      <gamegenie code=\"AXEXIPGO\" description=\"Start with double Bombs (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-HAGMF\" name=\"Indy Heat, Danny Sullivan's\" crc=\"C1B43207\">\n      <gamegenie code=\"SZELSOVS\" description=\"Infinite turbos\" />\n      <gamegenie code=\"SXVASVSO\" description=\"Infinite fuel\" />\n      <gamegenie code=\"NYUOZLGV\" description=\"Start with $255,000\" />\n      <gamegenie code=\"SVKLTOSO\" description=\"Everything costs how much you have\" />\n      <gamegenie code=\"OUVZAXOO\" description=\"Don't take damage in the front\" />\n    </game>\n    <game code=\"CLV-H-KKEFK\" name=\"Darkman\" crc=\"398B8182\">\n      <gamegenie code=\"SXKGUSSE\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-UTVGS\" name=\"Darkwing Duck, Disney's\" crc=\"5DCE2EEA\">\n      <gamegenie code=\"EYUEIPEI\" description=\"Invincibility\" />\n      <gamegenie code=\"AVVNSOOG\" description=\"Infinite health\" />\n      <gamegenie code=\"GZOGSUVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SGOGSUVK\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"AVUEUOSZ\" description=\"Infinite gas (if you avoid the Go missions)\" />\n      <gamegenie code=\"IYEAKPAY\" description=\"More gas on pick-up\" />\n      <gamegenie code=\"AUXAYAEY\" description=\"One hit kills\" />\n      <gamegenie code=\"SXNYUOSE\" description=\"Start with infinite health\" />\n      <gamegenie code=\"PYSKXPLY\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"IYSKXPLY\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AYSKXPLN\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-ULRGS\" name=\"Dash Galaxy in the Alien Asylum\" crc=\"67811DA6\">\n      <gamegenie code=\"XVUGLNSX\" description=\"Invincibility\" />\n      <gamegenie code=\"SZVPTOVK\" description=\"Can't lose lives in rooms\" />\n      <gamegenie code=\"SZUPLOVK\" description=\"Can't lose lives in elevator shaft\" />\n      <gamegenie code=\"PENPIALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TENPIALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PENPIALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"LVNPIALA\" description=\"Start with 99 lives\" />\n      <gamegenie code=\"NYSXAOAN\" description=\"Oxygen used up more slowly in shaft\" />\n      <gamegenie code=\"AYXXSNNY\" description=\"Oxygen used up more quickly in rooms\" />\n      <gamegenie code=\"SZOPISVK\" description=\"Infinite Oxygen\" />\n      <gamegenie code=\"AAEPZIPA\" description=\"No damage from shots and collisions\" />\n      <gamegenie code=\"VTNSEXSX\" description=\"Infinite Bombs in elevator shaft\" />\n      <gamegenie code=\"VVVSXXSX\" description=\"Infinite Bombs in rooms\" />\n      <gamegenie code=\"VVOSSXSX\" description=\"Infinite Detonators in shafts\" />\n      <gamegenie code=\"VTESNUSX\" description=\"Infinite Detonators in rooms\" />\n      <gamegenie code=\"VTEZIKSX\" description=\"Infinite Keys in shafts\" />\n      <gamegenie code=\"VVOXTOSX\" description=\"Infinite Keys in rooms\" />\n      <gamegenie code=\"OZEPOISE\" description=\"Start on level XX (1 of 2)\" />\n      <gamegenie code=\"IAEPXSVI\" description=\"Start on level 5 (2 of 2)\" />\n      <gamegenie code=\"ZAEPXSVS\" description=\"Start on level 10 (2 of 2)\" />\n      <gamegenie code=\"YAEPXSVS\" description=\"Start on level 15 (2 of 2)\" />\n      <gamegenie code=\"GPEPXSVI\" description=\"Start on level 20 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-LGFDQ\" name=\"Day Dreamin' Davey\" crc=\"E145B441\">\n      <gamegenie code=\"SXSPZGSA\" description=\"Infinite health\" />\n      <gamegenie code=\"AANLZKZG\" description=\"Hit anywhere\" />\n    </game>\n    <game code=\"CLV-H-CFPLJ\" name=\"Days of Thunder\" crc=\"12748678\">\n      <gamegenie code=\"NYKNIUNO\" description=\"Start with more fuel\" />\n      <gamegenie code=\"YIKNIUNO\" description=\"Start with less fuel\" />\n      <gamegenie code=\"SXEYPUSU\" description=\"Faster acceleration\" />\n      <gamegenie code=\"AAVOEXNY\" description=\"Tires don't burst\" />\n      <gamegenie code=\"SNXOSKEY\" description=\"Better left-hand cornering\" />\n      <gamegenie code=\"IEUNLLLA\" description=\"Maximum acceleration (1 of 2)\" />\n      <gamegenie code=\"SXEYPUSU\" description=\"Maximum acceleration (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GHBER\" name=\"Deadly Towers\" crc=\"C2730C30\">\n      <gamegenie code=\"OXXOXOPX\" description=\"Invincibility\" />\n      <gamegenie code=\"GXSONPST\" description=\"Infinite HP\" />\n      <gamegenie code=\"YYXELPZU\" description=\"Start with 127 Ludder\" />\n      <gamegenie code=\"LGXELPZU\" description=\"Start with 75 Ludder\" />\n      <gamegenie code=\"ZEUPKYPE\" description=\"1 Ludder gives 10 on pick-up\" />\n      <gamegenie code=\"GOUPUYIA\" description=\"5 Ludder gives 20 on pick-up\" />\n      <gamegenie code=\"GXUGLVON\" description=\"Shopkeeper forgets to charge you\" />\n    </game>\n    <game code=\"CLV-H-GUBQC\" name=\"Defender II\" crc=\"A2AF25D0\">\n      <gamegenie code=\"SXVIOTSA\" description=\"Invincibility\" />\n      <gamegenie code=\"GXTGEY\" description=\"Infinite lives\" />\n      <gamegenie code=\"GXYSGI\" description=\"Infinite Smart Bombs\" />\n      <gamegenie code=\"PELGNY\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TELGNY\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PELGNN\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"YETVIL\" description=\"Super speed (1 of 2)\" />\n      <gamegenie code=\"YAZVPG\" description=\"Super speed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-IZCAF\" name=\"Defender of the Crown\" crc=\"28FB71AE\">\n      <gamegenie code=\"ZAVVALGO\" description=\"Only 10 soldiers in your Garrison\" />\n      <gamegenie code=\"AZVVALGO\" description=\"40 soldiers in your Garrison\" />\n      <gamegenie code=\"AAEOUPPA\" description=\"Soldiers for free\" />\n      <gamegenie code=\"LAEOUPPA\" description=\"Triple the cost of soldiers\" />\n      <gamegenie code=\"GAEOKOAA\" description=\"Halve the cost of knights\" />\n      <gamegenie code=\"APEOKOAA\" description=\"Double the cost of knights\" />\n      <gamegenie code=\"YAEOSOYA\" description=\"Halve the cost of catapults\" />\n      <gamegenie code=\"ZAEOVPGO\" description=\"Halve the cost of castles\" />\n    </game>\n    <game code=\"CLV-H-YEIKK\" name=\"Demon Sword\" crc=\"4681691A\">\n      <gamegenie code=\"SZUEUZAX\" description=\"Invincibility\" />\n      <gamegenie code=\"AESVLTPA\" description=\"Infinite powers and lives\" />\n      <gamegenie code=\"SXSIYASA\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZKGTTSA\" description=\"Infinite health (life)\" />\n      <gamegenie code=\"VTVTAESX\" description=\"Phoenix always rescues you\" />\n      <gamegenie code=\"SLNNANSO\" description=\"Infinite Fire, Lightning, Power Beams on pick-up\" />\n      <gamegenie code=\"VTNXAOSE\" description=\"Extra dart strength\" />\n      <gamegenie code=\"ALXGAYSU\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"ATXGPNEP\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"SXNKPVGK\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"ATNXAOSA\" description=\"Start on level X (1 of 2)\" />\n      <gamegenie code=\"PANZLPAA\" description=\"Start on level 2 (2 of 2)\" />\n      <gamegenie code=\"ZANZLPAA\" description=\"Start on level 3 (2 of 2)\" />\n      <gamegenie code=\"LANZLPAA\" description=\"Start on level 4 (2 of 2)\" />\n      <gamegenie code=\"GANZLPAA\" description=\"Start on level 5 (2 of 2)\" />\n      <gamegenie code=\"IANZLPAA\" description=\"Start on level 6 (2 of 2)\" />\n      <gamegenie code=\"XZNZGPSA\" description=\"Start with 44 X (1 of 2)\" />\n      <gamegenie code=\"VEEZYOSE\" description=\"Start with 44 Red Spheres (2 of 2)\" />\n      <gamegenie code=\"VEEXZOSE\" description=\"Start with 44 Black Spheres (2 of 2)\" />\n      <gamegenie code=\"VANXLOSE\" description=\"Start with 44 Fire Spheres (2 of 2)\" />\n      <gamegenie code=\"VANXTOSE\" description=\"Start with 44 Lightning bolts (2 of 2)\" />\n      <gamegenie code=\"VEEZPOSE\" description=\"Start with 44 Power beams (2 of 2)\" />\n      <gamegenie code=\"AEVSUIZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEVSUIZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEVSUIZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-CLSMZ\" name=\"Destination Earthstar\" crc=\"EB9960EE\">\n      <gamegenie code=\"SXVSVIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"ISNEUUOP\" description=\"Less energy\" />\n      <gamegenie code=\"NNNEUUOO\" description=\"More energy\" />\n      <gamegenie code=\"XTNVSNXK\" description=\"Don't lose special weapon in sub-game\" />\n      <gamegenie code=\"PAVTXGLA\" description=\"Start with 1 life\" />\n    </game>\n    <game code=\"CLV-H-OIKBT\" name=\"Destiny of an Emperor\" crc=\"A558FB52\">\n      <gamegenie code=\"OZNNZGSK\" description=\"No random battles (1 of 2)\" />\n      <gamegenie code=\"SXSYYKPU\" description=\"No random battles (2 of 2)\" />\n      <gamegenie code=\"SZUYTUGK\" description=\"Walk anywhere\" />\n      <gamegenie code=\"AEKPZZGT\" description=\"Buy 300 provisions for no money\" />\n      <gamegenie code=\"AENLULZL\" description=\"Dagger costs nothing\" />\n      <gamegenie code=\"AEVLKGZL\" description=\"Bandana costs nothing\" />\n      <gamegenie code=\"AENUKLGT\" description=\"Flail costs nothing\" />\n      <gamegenie code=\"AEXLXGGT\" description=\"Robe costs nothing\" />\n      <gamegenie code=\"AEUUXLGP\" description=\"Elixir A costs nothing\" />\n      <gamegenie code=\"AEXUVLGT\" description=\"Resurrect costs nothing\" />\n      <gamegenie code=\"AEXLVUEG\" description=\"Steed costs nothing\" />\n      <gamegenie code=\"AEEUKUEG\" description=\"Gullwing costs nothing\" />\n      <gamegenie code=\"AEKPIZYZ\" description=\"Buy 30,000 provisions for no money (1 of 2)\" />\n      <gamegenie code=\"AEKPTZAP\" description=\"Buy 30,000 provisions for no money (2 of 2)\" />\n      <gamegenie code=\"AEXUOKGZ\" description=\"Leather costs nothing (1 of 2)\" />\n      <gamegenie code=\"AEXUXGPA\" description=\"Leather costs nothing (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-DSUFL\" name=\"Dick Tracy\" crc=\"D738C059\">\n      <gamegenie code=\"GXVOINSV\" description=\"Infinite health\" />\n      <gamegenie code=\"AOVOGNAU\" description=\"Take more damage\" />\n      <gamegenie code=\"SZXZEOVK\" description=\"Infinite hand gun bullets\" />\n      <gamegenie code=\"SXVXZEVK\" description=\"Infinite machine gun bullets\" />\n      <gamegenie code=\"GOEPIOZA\" description=\"More super punches on pick-up\" />\n      <gamegenie code=\"SZKZIXVK\" description=\"Infinite super punches\" />\n      <gamegenie code=\"SZEXIXVK\" description=\"Infinite tear gas\" />\n      <gamegenie code=\"KYVZAANY\" description=\"Mega-jump\" />\n    </game>\n    <game code=\"CLV-H-TGJTD\" name=\"Die Hard\" crc=\"085DE7C9\">\n      <gamegenie code=\"SXEZTYSA\" description=\"Infinite health against Pistol ammo\" />\n      <gamegenie code=\"SXOZIYSA\" description=\"Infinite health against Submachine Gun ammo\" />\n      <gamegenie code=\"SXXZLYSA\" description=\"Infinite health against punches\" />\n      <gamegenie code=\"ATNALXVG\" description=\"Infinite Pistol ammo\" />\n      <gamegenie code=\"ATNEIXVG\" description=\"Infinite Submachine Gun ammo\" />\n      <gamegenie code=\"ATVEIZSZ\" description=\"Infinite ammo on all guns\" />\n      <gamegenie code=\"AVUNGPSZ\" description=\"Infinite time\" />\n      <gamegenie code=\"PEOKIPAP\" description=\"Start with 1 life point instead of 16\" />\n      <gamegenie code=\"ZEOKIPAP\" description=\"Start with 2 life points\" />\n      <gamegenie code=\"GEOKIPAP\" description=\"Start with 4 life points\" />\n      <gamegenie code=\"AEOKIPAO\" description=\"Start with 8 life point\" />\n      <gamegenie code=\"GEOKIPAO\" description=\"Start with 12 life points\" />\n      <gamegenie code=\"GOOKIPAP\" description=\"Start with 20 life points\" />\n      <gamegenie code=\"SXOYYUSE\" description=\"Lose foot health very slowly\" />\n      <gamegenie code=\"AEXGPOYA\" description=\"Start with no Pistol ammo instead of 15\" />\n      <gamegenie code=\"IEXGPOYA\" description=\"Start with 5 Pistol ammo\" />\n      <gamegenie code=\"ZEXGPOYE\" description=\"Start with 10 Pistol ammo\" />\n      <gamegenie code=\"GOXGPOYA\" description=\"Start with 20 Pistol ammo\" />\n      <gamegenie code=\"POXGPOYE\" description=\"Start with 25 Pistol ammo\" />\n      <gamegenie code=\"ENUYPOGL\" description=\"Time runs at 1/4 normal speed\" />\n      <gamegenie code=\"KUUYPOGL\" description=\"Time runs at 1/3 normal speed\" />\n      <gamegenie code=\"ANUYPOGU\" description=\"Time runs at 1/2 normal speed\" />\n      <gamegenie code=\"TOUYPOGU\" description=\"Time runs at 2x normal speed\" />\n      <gamegenie code=\"GOUYPOGL\" description=\"Time runs at 3x normal speed\" />\n      <gamegenie code=\"YEUYPOGU\" description=\"Time runs at 4x normal speed\" />\n    </game>\n    <game code=\"CLV-H-JFYEF\" name=\"Dig Dug II: Trouble in Paradise\" crc=\"DBB06A25\">\n      <gamegenie code=\"GZETIZEI\" description=\"Instant inflate and explode\" />\n      <gamegenie code=\"PEETOPLA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"AEETOPLE\" description=\"Start with 8 lives - both players\" />\n      <gamegenie code=\"SZXLSVVK\" description=\"Never lose lives from touching water\" />\n      <gamegenie code=\"SXVKLVVK\" description=\"Never lose lives from Fygar's flame\" />\n      <gamegenie code=\"SXNIPEVK\" description=\"Never lose lives from hitting enemies\" />\n      <gamegenie code=\"OZNYPUPX\" description=\"Turbo speed (1 of 2)\" />\n      <gamegenie code=\"ZANYZLLA\" description=\"Turbo speed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ZRHSU\" name=\"Digger T. Rock: The Legend of the Lost City\" crc=\"1CEE0C21\">\n      <gamegenie code=\"SXSYOPVG\" description=\"Infinite health\" />\n      <gamegenie code=\"SXVAYTVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAONOGAE\" description=\"Start with weapons\" />\n      <gamegenie code=\"IAUGZUPA\" description=\"Less rocks on pick-up\" />\n      <gamegenie code=\"SZEYTVVK\" description=\"Infinite rocks on pick-up\" />\n      <gamegenie code=\"SXEUIUVK\" description=\"Infinite rope on pick-up\" />\n      <gamegenie code=\"SXEXTEVK\" description=\"Infinite dynamite on pick-up\" />\n    </game>\n    <game code=\"CLV-H-DNGWM\" name=\"Dirty Harry\" crc=\"0C2E7863\">\n      <gamegenie code=\"GXXGXGST\" description=\"Infinite health\" />\n      <gamegenie code=\"AEVLIPZA\" description=\"Maximum health from Chili Dogs\" />\n      <gamegenie code=\"SXUKOKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"ZESSTSPO\" description=\"Only 10 Magnum Bullets allowed (1 of 2)\" />\n      <gamegenie code=\"ZEVIZSPO\" description=\"Only 10 Magnum Bullets allowed (2 of 2)\" />\n      <gamegenie code=\"ZUSSTSPP\" description=\"50 Magnum Bullets allowed (1 of 2)\" />\n      <gamegenie code=\"ZUVIZSPP\" description=\"50 Magnum Bullets allowed (2 of 2)\" />\n      <gamegenie code=\"PANSGIIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZANSGIIE\" description=\"Start with 10 lives\" />\n    </game>\n    <game code=\"CLV-H-NANMR\" name=\"Donkey Kong 3\" crc=\"B3D74C0D\">\n      <gamegenie code=\"AVVGELEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SZNKOPVI\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"PEEGITLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PEEGITLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"ZEKKGYEE\" description=\"Reduce the time for pros\" />\n      <gamegenie code=\"ZAOSZAPA\" description=\"Normal spray more powerful\" />\n      <gamegenie code=\"ZLOSLAAA\" description=\"Normal spray longer\" />\n      <gamegenie code=\"AASSYPPA\" description=\"Spray cuts through baddies\" />\n      <gamegenie code=\"AAKVZALL\" description=\"Normal bees explode\" />\n      <gamegenie code=\"TEXKVGLA\" description=\"Speeding Stanley\" />\n    </game>\n    <game code=\"CLV-H-JWIVC\" name=\"Donkey Kong Jr. Math\" crc=\"0504B007\">\n      <gamegenie code=\"AAKILSZA\" description=\"Always answer correctly (1 of 2)\" />\n      <gamegenie code=\"AAUILSZP\" description=\"Always answer correctly (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ZKJBP\" name=\"Double Dare\" crc=\"2B378D11\">\n      <gamegenie code=\"SXXANUVK\" description=\"Infinite time to answer questions\" />\n    </game>\n    <game code=\"CLV-H-OOCPH\" name=\"Double Dragon\" crc=\"0F1CC048\">\n      <gamegenie code=\"EEUTLZZE\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEUTLZZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEUTLZZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEUTLZZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"VKKYXLVT\" description=\"Gain hearts quickly\" />\n      <gamegenie code=\"EKINNL\" description=\"Gain a heart every time you hit an enemy\" />\n      <gamegenie code=\"XTKNXEZK\" description=\"More health - P2 or computer\" />\n      <gamegenie code=\"XTKYOEZK\" description=\"More health - P1\" />\n      <gamegenie code=\"IIIOOO\" description=\"No enemies\" />\n      <gamegenie code=\"IIIEOO\" description=\"Enemies will not fight back\" />\n      <gamegenie code=\"KOTKOK\" description=\"Slow motion\" />\n      <gamegenie code=\"AAUNYLPA\" description=\"Infinite time\" />\n      <gamegenie code=\"AZUYZLAL\" description=\"Timer will count down faster\" />\n      <gamegenie code=\"APUYZLAL\" description=\"Timer will count down super-fast\" />\n      <gamegenie code=\"NYZSIU\" description=\"Disable level 4 wall trap\" />\n    </game>\n    <game code=\"CLV-H-OKFWV\" name=\"Double Dragon III: The Sacred Stones\" crc=\"50FD0CC6\">\n      <gamegenie code=\"SZUUPAAX\" description=\"Infinite health - Bill, Jimmy and Chin\" />\n      <gamegenie code=\"NNEPXGGS\" description=\"Start with 255 health - Billy and Jimmy\" />\n      <gamegenie code=\"NNEONGGV\" description=\"Start with 255 health - Chin\" />\n      <gamegenie code=\"NNEOXKZK\" description=\"Start with 255 health - Ranzou\" />\n      <gamegenie code=\"GVEPXGGI\" description=\"More health - Billy and Jimmy\" />\n      <gamegenie code=\"GVEOXKZG\" description=\"More health - Ranzou\" />\n      <gamegenie code=\"ZXEPXGGS\" description=\"Less health - Billy and Jimmy\" />\n      <gamegenie code=\"IXEOXKZG\" description=\"Less health - Ranzou\" />\n      <gamegenie code=\"ZUEONGGT\" description=\"Less health - Chin\" />\n      <gamegenie code=\"OZVLGASX\" description=\"More powerful punch, weapon and high kick\" />\n      <gamegenie code=\"LVOPKGIA\" description=\"Start with 99 weapon use - Billy, Jimmy and Chin\" />\n      <gamegenie code=\"AAELIGPA\" description=\"Infinite special weapons - everyone (1 of 2)\" />\n      <gamegenie code=\"GZXUPUVS\" description=\"Infinite special weapons - everyone (2 of 2)\" />\n      <gamegenie code=\"AEULUKYA\" description=\"Start with Chin enabled\" />\n      <gamegenie code=\"AEKLVKAA\" description=\"Start with Ranzou enabled\" />\n      <gamegenie code=\"AEKNPPIA\" description=\"Start with Jimmy enabled\" />\n    </game>\n    <game code=\"CLV-H-LNPYO\" name=\"Double Dribble\" crc=\"D0E96F6B\">\n      <gamegenie code=\"KNEKPKEY\" description=\"CPU scores add to your score\" />\n      <gamegenie code=\"KNEKPKEN\" description=\"CPU never scores\" />\n    </game>\n    <game code=\"CLV-H-XIAEA\" name=\"Dr. Chaos\" crc=\"73620901\">\n      <gamegenie code=\"GXKIKIST\" description=\"Infinite life\" />\n      <gamegenie code=\"LTKKVPZL\" description=\"Start with 99 life\" />\n      <gamegenie code=\"PPKKVPZU\" description=\"Start with 25 life\" />\n      <gamegenie code=\"AEEGUZLE\" description=\"Mega-jump\" />\n      <gamegenie code=\"AKSSKIGP\" description=\"More invincibility time\" />\n      <gamegenie code=\"GESSKIGP\" description=\"Less invincibility time\" />\n      <gamegenie code=\"GZEYEEVK\" description=\"Infinite Gun ammo on pick-up\" />\n      <gamegenie code=\"OVKIKISV\" description=\"Take minimal damage (1 of 2)\" />\n      <gamegenie code=\"PEKISIGY\" description=\"Take minimal damage (2 of 2)\" />\n      <gamegenie code=\"TVOSSITG\" description=\"Take more damage and Shield Suit has no effect (1 of 2)\" />\n      <gamegenie code=\"AEOSKIYA\" description=\"Take more damage and Shield Suit has no effect (2 of 2)\" />\n      <gamegenie code=\"PASKSPAA\" description=\"Start with Shield Suit (1 of 2)\" />\n      <gamegenie code=\"ZISKNPLG\" description=\"Start with Shield Suit (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GXSFN\" name=\"Dr. Jekyll and Mr. Hyde\" crc=\"4D3FBA78\">\n      <gamegenie code=\"GZXVTKVK\" description=\"Infinite life (1 of 2)\" />\n      <gamegenie code=\"GZXTTSVK\" description=\"Infinite life (2 of 2)\" />\n      <gamegenie code=\"KENLKVSE\" description=\"Start with 16 coins\" />\n      <gamegenie code=\"GXNLKVSE\" description=\"Keep coins from previous games\" />\n      <gamegenie code=\"NXNSZEOO\" description=\"Instant game restart\" />\n      <gamegenie code=\"NKNGVYUK\" description=\"Multi-jump (1 of 6)\" />\n      <gamegenie code=\"PXNKENOK\" description=\"Multi-jump (2 of 6)\" />\n      <gamegenie code=\"PENKOYGA\" description=\"Multi-jump (3 of 6)\" />\n      <gamegenie code=\"ENNKXYEI\" description=\"Multi-jump (4 of 6)\" />\n      <gamegenie code=\"PENKSYAA\" description=\"Multi-jump (5 of 6)\" />\n      <gamegenie code=\"OUNKNYUK\" description=\"Multi-jump (6 of 6)\" />\n    </game>\n    <game code=\"CLV-H-BCRII\" name=\"Dragon Fighter\" crc=\"A166548F\">\n      <gamegenie code=\"EYEVAIEI\" description=\"Invincibility\" />\n      <gamegenie code=\"AESSILPA\" description=\"Invincible to spikes\" />\n      <gamegenie code=\"SZSVGISA\" description=\"Infinite health\" />\n      <gamegenie code=\"KAUIEGSZ\" description=\"Max Dragon energy\" />\n      <gamegenie code=\"YYXSYZAE\" description=\"Always shoot special\" />\n    </game>\n    <game code=\"CLV-H-ZAFSL\" name=\"Dragon Power\" crc=\"811F06D9\">\n      <gamegenie code=\"SZVOSZVG\" description=\"Infinite health (POW)\" />\n      <gamegenie code=\"EAXAILGT\" description=\"Start with 128 health (POW)\" />\n      <gamegenie code=\"KAOETLSA\" description=\"Start with 24 Wind Waves (turtle shells) (hold B then press A)\" />\n    </game>\n    <game code=\"CLV-H-ZIXHW\" name=\"Dragon Spirit: The New Legend\" crc=\"D7E29C03\">\n      <gamegenie code=\"EXAXEU\" description=\"Invincibility and three heads after one hit (blinking)\" />\n      <gamegenie code=\"OZVZOZVG\" description=\"Infinite health\" />\n      <gamegenie code=\"OXNLEIES\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"OXXLOIES\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"VEOIKAKA\" description=\"Always gold dragon mode\" />\n      <gamegenie code=\"KXOIKAKA\" description=\"Always blue dragon mode\" />\n    </game>\n    <game code=\"CLV-H-GMWYY\" name=\"Dragon Warrior\" crc=\"2545214C\">\n      <gamegenie code=\"SXOIVLSA\" description=\"Infinite Magic Power\" />\n      <gamegenie code=\"AEVGUIZA\" description=\"Take no damage in swamp\" />\n      <gamegenie code=\"VVOYYTSA\" description=\"Start with 256 gold coins\" />\n      <gamegenie code=\"VKOIVLSA\" description=\"All spells use only one magic point\" />\n      <gamegenie code=\"YAKKEVYA\" description=\"Barriers cause half usual damage\" />\n    </game>\n    <game code=\"CLV-H-IMGWJ\" name=\"Dragon Warrior II\" crc=\"8C5A784E\">\n      <gamegenie code=\"ASUZYTEP\" description=\"One hit kills\" />\n      <gamegenie code=\"ZUKLUSGP\" description=\"Prince of Midenhall - Start with 50 HP\" />\n      <gamegenie code=\"LVKLUSGP\" description=\"Prince of Midenhall - Start with 99 HP\" />\n      <gamegenie code=\"AXKLOIIE\" description=\"Prince of Midenhall - Start with 40 strength points\" />\n      <gamegenie code=\"ASKLOIIA\" description=\"Prince of Midenhall - Start with 80 strength points\" />\n      <gamegenie code=\"AXKLXIGE\" description=\"Prince of Midenhall - Start with 40 agility points\" />\n      <gamegenie code=\"ASKLXIGA\" description=\"Prince of Midenhall - Start with 80 agility points\" />\n      <gamegenie code=\"ZUKLNSYP\" description=\"Prince of Cannock - Start with 50 HP\" />\n      <gamegenie code=\"LVKLNSYP\" description=\"Prince of Cannock - Start with 99 HP\" />\n      <gamegenie code=\"AXKLSIGE\" description=\"Prince of Cannock - Start with 40 strength points\" />\n      <gamegenie code=\"GUKLSIGE\" description=\"Prince of Cannock - Start with 60 strength points\" />\n      <gamegenie code=\"TOKLVIGE\" description=\"Prince of Cannock - Start with 30 agility points\" />\n      <gamegenie code=\"GUKLVIGE\" description=\"Prince of Cannock - Start with 60 agility points\" />\n      <gamegenie code=\"AXKUEITE\" description=\"Prince of Cannock - Start with 40 magic points\" />\n      <gamegenie code=\"GUKUEITE\" description=\"Prince of Cannock - Start with 60 magic points\" />\n      <gamegenie code=\"ZUKUUIAZ\" description=\"Princess of Moonbrooke - Start with 50 HP\" />\n      <gamegenie code=\"LVKUUIAZ\" description=\"Princess of Moonbrooke - Start with 99 HP\" />\n      <gamegenie code=\"POKUOIZE\" description=\"Princess of Moonbrooke - Start with 25 strength points\" />\n      <gamegenie code=\"ZUKUOIZA\" description=\"Princess of Moonbrooke - Start with 50 strength points\" />\n      <gamegenie code=\"AXKUXITO\" description=\"Princess of Moonbrooke - Start with 40 agility points\" />\n      <gamegenie code=\"AXKUKSGO\" description=\"Princess of Moonbrooke - Start with 40 magic points\" />\n    </game>\n    <game code=\"CLV-H-WEOMQ\" name=\"Dragon Warrior III\" crc=\"A86A5318\">\n      <gamegenie code=\"NYUOYPZU\" description=\"King gives 255 gold\" />\n      <gamegenie code=\"PASPZPAA\" description=\"King gives mega-gold\" />\n      <gamegenie code=\"YTVUGZYE\" description=\"Player starts with increased strength and/or attack power\" />\n      <gamegenie code=\"VYVUGZYE\" description=\"Player starts with greatly increased strength and/or attack power\" />\n      <gamegenie code=\"LTNLPZIA\" description=\"Player starts with increased agility and/or defense\" />\n      <gamegenie code=\"NYNLPZIE\" description=\"Player starts with greatly increased agility and/or defense\" />\n      <gamegenie code=\"LTNLTZYA\" description=\"Player starts with increased vitality and/or HP\" />\n      <gamegenie code=\"NYNLTZYE\" description=\"Player starts with greatly increased vitality and/or HP\" />\n      <gamegenie code=\"LTNULZTA\" description=\"Player starts with increased magic, maximum magic points and/or intelligence\" />\n      <gamegenie code=\"NYNULZTE\" description=\"Player starts with greatly increased magic, maximum magic points and/or intelligence\" />\n      <gamegenie code=\"ZVELAZGA\" description=\"Player starts with increased luck\" />\n      <gamegenie code=\"VNELAZGE\" description=\"Player starts with greatly increased luck\" />\n      <gamegenie code=\"LTVUIZPA\" description=\"Wizard starts with increased strength and/or attack power\" />\n      <gamegenie code=\"VYVUIZPE\" description=\"Wizard starts with greatly increased strength and/or attack power\" />\n      <gamegenie code=\"ZTNLZZGA\" description=\"Wizard starts with increased agility and/or defense\" />\n      <gamegenie code=\"NYNLZZGE\" description=\"Wizard starts with greatly increased agility and/or defense\" />\n      <gamegenie code=\"ZTNLYZZA\" description=\"Wizard starts with increased vitality and/or maximum HP\" />\n      <gamegenie code=\"OPNLYZZE\" description=\"Wizard starts with greatly increased vitality and/or maximum HP\" />\n      <gamegenie code=\"LTNUGXPA\" description=\"Wizard starts with increased magic, intelligence and/or maximum magic\" />\n      <gamegenie code=\"LVELPZZA\" description=\"Wizard starts with increased luck\" />\n      <gamegenie code=\"VNELPZZE\" description=\"Wizard starts with greatly increased luck\" />\n      <gamegenie code=\"ZTVUTZLA\" description=\"Pilgrim starts with increased strength and/or attack power\" />\n      <gamegenie code=\"VYVUTZLE\" description=\"Pilgrim starts with greatly increased strength and/or attack power\" />\n      <gamegenie code=\"ZTNLLZGA\" description=\"Pilgrim starts with increased agility and/or defense\" />\n      <gamegenie code=\"LTNUAZLA\" description=\"Pilgrim starts with increased vitality and/or maximum HP\" />\n      <gamegenie code=\"VYNUAZLE\" description=\"Pilgrim starts with greatly increased vitality and/or maximum HP\" />\n      <gamegenie code=\"LTNUIXAA\" description=\"Pilgrim starts with increased magic and/or intelligence\" />\n      <gamegenie code=\"VYNUIXAE\" description=\"Pilgrim starts with greatly increased magic and/or intelligence\" />\n      <gamegenie code=\"ZVELZZLA\" description=\"Pilgrim starts with increased luck\" />\n      <gamegenie code=\"VNELZZLE\" description=\"Pilgrim starts with greatly increased luck\" />\n      <gamegenie code=\"LTNLAXPA\" description=\"Soldier starts with increased strength and/or attack power\" />\n      <gamegenie code=\"VYNLAXPE\" description=\"Soldier starts with greatly increased strength and/or attack power\" />\n      <gamegenie code=\"ZTNLIZZA\" description=\"Soldier starts with increased agility and/or defense\" />\n      <gamegenie code=\"LTNUZZYA\" description=\"Soldier starts with increased vitality and/or maximum HP\" />\n      <gamegenie code=\"IAOZENNY\" description=\"Start with 6 battle-axes\" />\n      <gamegenie code=\"TAOZENNY\" description=\"Start with 6 broadswords\" />\n      <gamegenie code=\"YAOZENNY\" description=\"Start with 6 wizard's wands\" />\n      <gamegenie code=\"YAOZENNN\" description=\"Start with 6 demon's axes\" />\n      <gamegenie code=\"GPOZENNY\" description=\"Start with 6 multi-edge swords\" />\n      <gamegenie code=\"IPOZENNY\" description=\"Start with 6 staffs of force\" />\n      <gamegenie code=\"TPOZENNY\" description=\"Start with 6 swords of illusion\" />\n      <gamegenie code=\"APOZENNN\" description=\"Start with 6 falcon swords\" />\n      <gamegenie code=\"AZOZENNN\" description=\"Start with 6 armor of radiance\" />\n    </game>\n    <game code=\"CLV-H-DALWM\" name=\"Dragon Warrior IV\" crc=\"506E259D\">\n      <gamegenie code=\"ATVATGSL\" description=\"No damage and lose no MP - all members. Don't combine any of the start with items codes\" />\n      <gamegenie code=\"POSOAPZU\" description=\"Chapter 1 - Start with 25 gold\" />\n      <gamegenie code=\"GVSOAPZL\" description=\"Chapter 1 - Start with 100 gold\" />\n      <gamegenie code=\"NNSOAPZU\" description=\"Chapter 1 - Start with 255 gold\" />\n      <gamegenie code=\"AIXOZAYS\" description=\"Chapter 1 - Start with lots 'o gold\" />\n      <gamegenie code=\"YEEXYXLO\" description=\"Chapter 1 - Start with 15 HP\" />\n      <gamegenie code=\"GVEXYXLP\" description=\"Chapter 1 - Start with 100 HP\" />\n      <gamegenie code=\"NNEXYXLO\" description=\"Chapter 1 - Start with 255 HP\" />\n      <gamegenie code=\"LNKPLONY\" description=\"Chapter 1 - Start with final key\" />\n      <gamegenie code=\"TEKPLONN\" description=\"Chapter 1 - Start with metal babble sword\" />\n      <gamegenie code=\"LOKPLONY\" description=\"Chapter 1 - Start with multi-edge sword\" />\n      <gamegenie code=\"PEKPLONN\" description=\"Chapter 1 - Start with thorn whip\" />\n      <gamegenie code=\"AKKPLONY\" description=\"Chapter 1 - Start with shield of strength\" />\n      <gamegenie code=\"LKKPLONY\" description=\"Chapter 1 - Start with dragon shield\" />\n      <gamegenie code=\"LNKPLONY\" description=\"Chapter 1 - Start with final key and chain sickle (1 of 2)\" />\n      <gamegenie code=\"GEKPGONY\" description=\"Chapter 1 - Start with final key and chain sickle (2 of 2)\" />\n      <gamegenie code=\"TEKPLONN\" description=\"Chapter 1 - Start with metal babble sword and boomerang (1 of 2)\" />\n      <gamegenie code=\"LEKPGONN\" description=\"Chapter 1 - Start with metal babble sword and boomerang (2 of 2)\" />\n      <gamegenie code=\"LOKPLONY\" description=\"Chapter 1 - Start with multi-edge sword and wizard's ring (1 of 2)\" />\n      <gamegenie code=\"PSKPGONN\" description=\"Chapter 1 - Start with multi-edge sword and wizard's ring (2 of 2)\" />\n      <gamegenie code=\"PEKPLONN\" description=\"Chapter 1 - Start with thorn whip and demon hammer (1 of 2)\" />\n      <gamegenie code=\"ZOKPGONY\" description=\"Chapter 1 - Start with thorn whip and demon hammer (2 of 2)\" />\n      <gamegenie code=\"AKKPLONY\" description=\"Chapter 1 - Start with shield of strength and meteorite armband (1 of 2)\" />\n      <gamegenie code=\"ASKPGONY\" description=\"Chapter 1 - Start with shield of strength and meteorite armband (2 of 2)\" />\n      <gamegenie code=\"LKKPLONY\" description=\"Chapter 1 - Start with dragon shield and iron fan (1 of 2)\" />\n      <gamegenie code=\"IEKPGONN\" description=\"Chapter 1 - Start with dragon shield and iron fan (2 of 2)\" />\n      <gamegenie code=\"ZUSOPPGT\" description=\"Chapter 2 - Start with 50 gold\" />\n      <gamegenie code=\"NNSOPPGV\" description=\"Chapter 2 - Start with 255 gold\" />\n      <gamegenie code=\"AIXOZAYS\" description=\"Chapter 2 - Start with lots of gold\" />\n      <gamegenie code=\"GVOZAZAP\" description=\"Chapter 2, Alena - Start with 100 HP\" />\n      <gamegenie code=\"NNOZAZAO\" description=\"Chapter 2, Alena - Start with 255 HP\" />\n      <gamegenie code=\"LNKOZONY\" description=\"Chapter 2, Alena - Start with final key\" />\n      <gamegenie code=\"ZOKOZONN\" description=\"Chapter 2, Alena - Start with fire claw\" />\n      <gamegenie code=\"LOKOZONY\" description=\"Chapter 2, Alena - Start with multi-edge sword\" />\n      <gamegenie code=\"PEKOZONN\" description=\"Chapter 2, Alena - Start with thorn whip\" />\n      <gamegenie code=\"LEKOLONN\" description=\"Chapter 2, Alena - Start with boomerang\" />\n      <gamegenie code=\"LNKOZONY\" description=\"Chapter 2, Alena - Start with final key and fire claw (1 of 2)\" />\n      <gamegenie code=\"ZOKOLONN\" description=\"Chapter 2, Alena - Start with final key and fire claw (2 of 2)\" />\n      <gamegenie code=\"LOKOZONY\" description=\"Chapter 2, Alena - Start with multi-edge sword and wizard's ring (1 of 2)\" />\n      <gamegenie code=\"PSKOLONN\" description=\"Chapter 2, Alena - Start with multi-edge sword and wizard's ring (2 of 2)\" />\n      <gamegenie code=\"PEKOZONN\" description=\"Chapter 2, Alena - Start with thorn whip and demon hammer (1 of 2)\" />\n      <gamegenie code=\"ZOKOLONY\" description=\"Chapter 2, Alena - Start with thorn whip and demon hammer (2 of 2)\" />\n      <gamegenie code=\"AKKOZONY\" description=\"Chapter 2, Alena - Start with shield of strength and meteorite arm band (1 of 2)\" />\n      <gamegenie code=\"ASKOLONY\" description=\"Chapter 2, Alena - Start with shield of strength and meteorite arm band (2 of 2)\" />\n      <gamegenie code=\"LKKOZONY\" description=\"Chapter 2, Alena - Start with dragon shield and iron fan (1 of 2)\" />\n      <gamegenie code=\"IEKOLONN\" description=\"Chapter 2, Alena - Start with dragon shield and iron fan (2 of 2)\" />\n      <gamegenie code=\"LNUPLONY\" description=\"Chapter 2, Brey - Start with final key\" />\n      <gamegenie code=\"TOUPLONN\" description=\"Chapter 2, Brey - Start with magma staff\" />\n      <gamegenie code=\"LOUPLONY\" description=\"Chapter 2, Brey - Start with multi-edge sword\" />\n      <gamegenie code=\"PEUPLONN\" description=\"Chapter 2, Brey - Start with thorn whip\" />\n      <gamegenie code=\"AKUPLONY\" description=\"Chapter 2, Brey - Start with shield of strength\" />\n      <gamegenie code=\"LKUPLONY\" description=\"Chapter 2, Brey - Start with dragon shield\" />\n      <gamegenie code=\"LEUPGONN\" description=\"Chapter 2, Brey - Start with boomerang\" />\n      <gamegenie code=\"LNUPLONY\" description=\"Chapter 2, Brey - Start with final key and magma staff (1 of 2)\" />\n      <gamegenie code=\"TOUPGONN\" description=\"Chapter 2, Brey - Start with final key and magma staff (2 of 2)\" />\n      <gamegenie code=\"LOUPLONY\" description=\"Chapter 2, Brey - Start with multi-edge sword and wizard's ring (1 of 2)\" />\n      <gamegenie code=\"PSUPGONN\" description=\"Chapter 2, Brey - Start with multi-edge sword and wizard's ring (2 of 2)\" />\n      <gamegenie code=\"PEUPLONN\" description=\"Chapter 2, Brey - Start with thorn whip and demon hammer (1 of 2)\" />\n      <gamegenie code=\"ZOUPGONY\" description=\"Chapter 2, Brey - Start with thorn whip and demon hammer (2 of 2)\" />\n      <gamegenie code=\"AKUPLONY\" description=\"Chapter 2, Brey - Start with shield of strength and meteorite arm band (1 of 2)\" />\n      <gamegenie code=\"ASUPGONY\" description=\"Chapter 2, Brey - Start with shield of strength and meteorite arm band (2 of 2)\" />\n      <gamegenie code=\"LKUPLONY\" description=\"Chapter 2, Brey - Start with dragon shield and iron fan (1 of 2)\" />\n      <gamegenie code=\"IEUPGONN\" description=\"Chapter 2, Brey - Start with dragon shield and iron fan (2 of 2)\" />\n      <gamegenie code=\"LNOOLONY\" description=\"Chapter 2, Cristo - Start with final key\" />\n      <gamegenie code=\"TEOOLONN\" description=\"Chapter 2, Cristo - Start with metal babble sword\" />\n      <gamegenie code=\"LOOOLONY\" description=\"Chapter 2, Cristo - Start with multi-edge sword\" />\n      <gamegenie code=\"PEOOLONN\" description=\"Chapter 2, Cristo - Start with thorn whip\" />\n      <gamegenie code=\"AKOOLONY\" description=\"Chapter 2, Cristo - Start with shield of strength\" />\n      <gamegenie code=\"LKOOLONY\" description=\"Chapter 2, Cristo - Start with dragon shield\" />\n      <gamegenie code=\"LNOOLONY\" description=\"Chapter 2, Cristo - Start with final key and chain sickle (1 of 2)\" />\n      <gamegenie code=\"GEOOGONY\" description=\"Chapter 2, Cristo - Start with final key and chain sickle (2 of 2)\" />\n      <gamegenie code=\"TEOOLONN\" description=\"Chapter 2, Cristo - Start with metal babble sword and boomerang (1 of 2)\" />\n      <gamegenie code=\"LEOOGONN\" description=\"Chapter 2, Cristo - Start with metal babble sword and boomerang (2 of 2)\" />\n      <gamegenie code=\"LOOOLONY\" description=\"Chapter 2, Cristo - Start with multi-edge sword and wizard's ring (1 of 2)\" />\n      <gamegenie code=\"PSOOGONN\" description=\"Chapter 2, Cristo - Start with multi-edge sword and wizard's ring (2 of 2)\" />\n      <gamegenie code=\"PEOOLONN\" description=\"Chapter 2, Cristo - Start with thorn whip and demon hammer (1 of 2)\" />\n      <gamegenie code=\"ZOOOGONY\" description=\"Chapter 2, Cristo - Start with thorn whip and demon hammer (2 of 2)\" />\n      <gamegenie code=\"AKOOLONY\" description=\"Chapter 2, Cristo - Start with shield of strength and meteorite arm band (1 of 2)\" />\n      <gamegenie code=\"ASOOGONY\" description=\"Chapter 2, Cristo - Start with shield of strength and meteorite arm band (2 of 2)\" />\n      <gamegenie code=\"LKOOLONY\" description=\"Chapter 2, Cristo - Start with dragon shield and iron fan (1 of 2)\" />\n      <gamegenie code=\"IEOOGONN\" description=\"Chapter 2, Cristo - Start with dragon shield and iron fan (2 of 2)\" />\n      <gamegenie code=\"AOEXTZGP\" description=\"Chapter 3 - Start with 16 HP\" />\n      <gamegenie code=\"GVEXTZGP\" description=\"Chapter 3 - Start with 100 HP\" />\n      <gamegenie code=\"NNEXTZGO\" description=\"Chapter 3 - Start with 255 HP\" />\n      <gamegenie code=\"GVSOZPAA\" description=\"Chapter 3 - Start with 100 gold\" />\n      <gamegenie code=\"NNSOZPAE\" description=\"Chapter 3 - Start with 255 gold\" />\n      <gamegenie code=\"UNUOLONY\" description=\"Chapter 3 - Start with final key\" />\n      <gamegenie code=\"LEUOLONN\" description=\"Chapter 3 - Start with metal babble sword\" />\n      <gamegenie code=\"TOUOLONY\" description=\"Chapter 3 - Start with multi-edge sword\" />\n      <gamegenie code=\"LEUOLONN\" description=\"Chapter 3 - Start with thorn whip\" />\n      <gamegenie code=\"PKUOLONY\" description=\"Chapter 3 - Start with shield of strength\" />\n      <gamegenie code=\"AKUOLONY\" description=\"Chapter 3 - Start with dragon shield\" />\n      <gamegenie code=\"LNUOLONY\" description=\"Chapter 3 - Start with final key and chain sickle (1 of 2)\" />\n      <gamegenie code=\"GEUOGONY\" description=\"Chapter 3 - Start with final key and chain sickle (2 of 2)\" />\n      <gamegenie code=\"TEUOLONN\" description=\"Chapter 3 - Start with metal babble sword and boomerang (1 of 2)\" />\n      <gamegenie code=\"LEUOGONN\" description=\"Chapter 3 - Start with metal babble sword and boomerang (2 of 2)\" />\n      <gamegenie code=\"LOUOLONY\" description=\"Chapter 3 - Start with multi-edge sword and wizard's ring (1 of 2)\" />\n      <gamegenie code=\"PSUOGONN\" description=\"Chapter 3 - Start with multi-edge sword and wizard's ring (2 of 2)\" />\n      <gamegenie code=\"PEUOLONN\" description=\"Chapter 3 - Start with thorn whip and demon hammer (1 of 2)\" />\n      <gamegenie code=\"ZOUOGONY\" description=\"Chapter 3 - Start with thorn whip and demon hammer (2 of 2)\" />\n      <gamegenie code=\"AKUOLONY\" description=\"Chapter 3 - Start with shield of strength and meteorite arm band (1 of 2)\" />\n      <gamegenie code=\"ASUOGONY\" description=\"Chapter 3 - Start with shield of strength and meteorite arm band (2 of 2)\" />\n      <gamegenie code=\"LKUOLONY\" description=\"Chapter 3 - Start with dragon shield and iron fan (1 of 2)\" />\n      <gamegenie code=\"IEUOGONN\" description=\"Chapter 3 - Start with dragon shield and iron fan (2 of 2)\" />\n      <gamegenie code=\"GVEXLZZP\" description=\"Chapter 4, Nara - Starts with 100 HP\" />\n      <gamegenie code=\"NNEXLZZO\" description=\"Chapter 4, Nara - Starts with 255 HP\" />\n      <gamegenie code=\"LNXPLONY\" description=\"Chapter 4, Nara - Start with final key\" />\n      <gamegenie code=\"TEXPLONN\" description=\"Chapter 4, Nara - Start with metal babble sword\" />\n      <gamegenie code=\"LOXPLONY\" description=\"Chapter 4, Nara - Start with multi-edge sword\" />\n      <gamegenie code=\"PEXPLONN\" description=\"Chapter 4, Nara - Start with thorn whip\" />\n      <gamegenie code=\"AKXPLONY\" description=\"Chapter 4, Nara - Start with shield of strength\" />\n      <gamegenie code=\"LKXPLONY\" description=\"Chapter 4, Nara - Start with dragon shield\" />\n      <gamegenie code=\"LNXPLONY\" description=\"Chapter 4, Nara - Start with final key and chain sickle (1 of 2)\" />\n      <gamegenie code=\"GEXPGONY\" description=\"Chapter 4, Nara - Start with final key and chain sickle (2 of 2)\" />\n      <gamegenie code=\"TEXPLONN\" description=\"Chapter 4, Nara - Start with metal babble sword and boomerang (1 of 2)\" />\n      <gamegenie code=\"LEXPGONN\" description=\"Chapter 4, Nara - Start with metal babble sword and boomerang (2 of 2)\" />\n      <gamegenie code=\"LOXPLONY\" description=\"Chapter 4, Nara - Start with multi-edge sword and wizard's ring (1 of 2)\" />\n      <gamegenie code=\"PSXPGONN\" description=\"Chapter 4, Nara - Start with multi-edge sword and wizard's ring (2 of 2)\" />\n      <gamegenie code=\"PEXPLONN\" description=\"Chapter 4, Nara - Start with thorn whip and demon hammer (1 of 2)\" />\n      <gamegenie code=\"ZOXPGONY\" description=\"Chapter 4, Nara - Start with thorn whip and demon hammer (2 of 2)\" />\n      <gamegenie code=\"AKXPLONY\" description=\"Chapter 4, Nara - Start with shield of strength and meteorite arm band (1 of 2)\" />\n      <gamegenie code=\"ASXPGONY\" description=\"Chapter 4, Nara - Start with shield of strength and meteorite arm band (2 of 2)\" />\n      <gamegenie code=\"LKXPLONY\" description=\"Chapter 4, Nara - Start with dragon shield and iron fan (1 of 2)\" />\n      <gamegenie code=\"IEXPGONN\" description=\"Chapter 4, Nara - Start with dragon shield and iron fan (2 of 2)\" />\n      <gamegenie code=\"GVEXGZAP\" description=\"Chapter 4, Mara - Starts with 100 HP\" />\n      <gamegenie code=\"NNEXGZAO\" description=\"Chapter 4, Mara - Starts with 255 HP\" />\n      <gamegenie code=\"LNXOPONY\" description=\"Chapter 4, Mara - Start with final key\" />\n      <gamegenie code=\"TOXOPONN\" description=\"Chapter 4, Mara - Start with magma staff\" />\n      <gamegenie code=\"LOXOPONY\" description=\"Chapter 4, Mara - Start with multi-edge sword\" />\n      <gamegenie code=\"PEXOPONN\" description=\"Chapter 4, Mara - Start with thorn whip\" />\n      <gamegenie code=\"AKXOPONY\" description=\"Chapter 4, Mara - Start with shield of strength\" />\n      <gamegenie code=\"LKXOPONY\" description=\"Chapter 4, Mara - Start with dragon shield\" />\n      <gamegenie code=\"LNXOPONY\" description=\"Chapter 4, Mara - Start with final key and chain sickle (1 of 2)\" />\n      <gamegenie code=\"GEXOZONY\" description=\"Chapter 4, Mara - Start with final key and chain sickle (2 of 2)\" />\n      <gamegenie code=\"TEXOPONN\" description=\"Chapter 4, Mara - Start with metal babble sword and boomerang (1 of 2)\" />\n      <gamegenie code=\"LEXOZONN\" description=\"Chapter 4, Mara - Start with metal babble sword and boomerang (2 of 2)\" />\n      <gamegenie code=\"LOXOPONY\" description=\"Chapter 4, Mara - Start with multi-edge sword and wizard's ring (1 of 2)\" />\n      <gamegenie code=\"PSXOZONN\" description=\"Chapter 4, Mara - Start with multi-edge sword and wizard's ring (2 of 2)\" />\n      <gamegenie code=\"PEXOPONN\" description=\"Chapter 4, Mara - Start with thorn whip and demon hammer (1 of 2)\" />\n      <gamegenie code=\"ZOXOZONY\" description=\"Chapter 4, Mara - Start with thorn whip and demon hammer (2 of 2)\" />\n      <gamegenie code=\"AKXOPONY\" description=\"Chapter 4, Mara - Start with shield of strength and meteorite arm band (1 of 2)\" />\n      <gamegenie code=\"ASXOZONY\" description=\"Chapter 4, Mara - Start with shield of strength and meteorite arm band (2 of 2)\" />\n      <gamegenie code=\"LKXOPONY\" description=\"Chapter 4, Mara - Start with dragon shield and iron fan (1 of 2)\" />\n      <gamegenie code=\"IEXOZONN\" description=\"Chapter 4, Mara - Start with dragon shield and iron fan (2 of 2)\" />\n      <gamegenie code=\"LNOPIONY\" description=\"Chapter 5 - Start with final key\" />\n      <gamegenie code=\"PXOPIONY\" description=\"Chapter 5 - Start with zenithian sword\" />\n      <gamegenie code=\"GKOPIONY\" description=\"Chapter 5 - Start with zenithian shield\" />\n      <gamegenie code=\"YUOPIONY\" description=\"Chapter 5 - Start with zenithian armor\" />\n      <gamegenie code=\"LKOPIONN\" description=\"Chapter 5 - Start with zenithian helmet\" />\n    </game>\n    <game code=\"CLV-H-UZACI\" name=\"Dragon's Lair\" crc=\"CA033B3A\">\n      <gamegenie code=\"AEXSGEKY\" description=\"Infinite E (health)\" />\n      <gamegenie code=\"AAXITVNY\" description=\"Infinite lives\" />\n      <gamegenie code=\"IAVNPYAP\" description=\"Less energy gained on pick-up\" />\n      <gamegenie code=\"YZVNPYAP\" description=\"More energy gained on pick-up\" />\n      <gamegenie code=\"SXKYUOVK\" description=\"Infinite Candle energy (1 of 2)\" />\n      <gamegenie code=\"SXVYXOVK\" description=\"Infinite Candle energy (2 of 2)\" />\n      <gamegenie code=\"NNXSGSUY\" description=\"Start with 1 extra life\" />\n      <gamegenie code=\"KNXSGSUN\" description=\"Start with 6 extra lives\" />\n      <gamegenie code=\"NNXSGSUN\" description=\"Start with 9 extra lives\" />\n      <gamegenie code=\"PEUIGIAA\" description=\"Start with Axe\" />\n      <gamegenie code=\"ZEUIGIAA\" description=\"Start with Fireball\" />\n      <gamegenie code=\"PANSZIAA\" description=\"Start on level 2\" />\n      <gamegenie code=\"ZANSZIAA\" description=\"Start on level 3\" />\n      <gamegenie code=\"LANSZIAA\" description=\"Start on level 4\" />\n    </game>\n    <game code=\"CLV-H-JLKBN\" name=\"DuckTales, Disney's\" crc=\"EFB09075\">\n      <gamegenie code=\"EISVZLEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"EIEEGAEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"ATVVXLEZ\" description=\"Infinite health\" />\n      <gamegenie code=\"AANVSLPA\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"SXUIEKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAESULZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAESULZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAESULZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"LAVTNLPA\" description=\"Lose half normal health (in easy game)\" />\n      <gamegenie code=\"OVUVAZSV\" description=\"Infinite time\" />\n      <gamegenie code=\"ZAXSKLIE\" description=\"Double usual time (1 of 3)\" />\n      <gamegenie code=\"SXNIUKOU\" description=\"Double usual time (2 of 3)\" />\n      <gamegenie code=\"SZNISESU\" description=\"Double usual time (3 of 3)\" />\n      <gamegenie code=\"EUOTYULU\" description=\"Multi-jump (1 of 5)\" />\n      <gamegenie code=\"UVXVALVT\" description=\"Multi-jump (2 of 5)\" />\n      <gamegenie code=\"AOUVILEY\" description=\"Multi-jump (3 of 5)\" />\n      <gamegenie code=\"NAETLKLL\" description=\"Multi-jump (4 of 5)\" />\n      <gamegenie code=\"GXOTPTEY\" description=\"Multi-jump (5 of 5)\" />\n      <gamegenie code=\"ZEOVYGPA\" description=\"Walk 2x faster\" />\n      <gamegenie code=\"GEOVYGPA\" description=\"Walk 4x faster\" />\n    </game>\n    <game code=\"CLV-H-ABZZG\" name=\"DuckTales 2, Disney's\" crc=\"73C7FCF4\">\n      <gamegenie code=\"ESOTVAEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SZONTZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"GZXGZGVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SGXGZGVG\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"ENVVIPNP\" description=\"Multi-jump (1 of 4)\" />\n      <gamegenie code=\"PXVVPOVP\" description=\"Multi-jump (2 of 4)\" />\n      <gamegenie code=\"XOVVTPXT\" description=\"Multi-jump (3 of 4)\" />\n      <gamegenie code=\"ZKVVGOGK\" description=\"Multi-jump (4 of 4)\" />\n      <gamegenie code=\"APONPXAA\" description=\"Take more damage\" />\n      <gamegenie code=\"GAONPXAA\" description=\"Take less damage\" />\n      <gamegenie code=\"ZAONPXAA\" description=\"Take very little damage\" />\n      <gamegenie code=\"PAXSPZAA\" description=\"Have lots of money\" />\n      <gamegenie code=\"IEKSPLPA\" description=\"$5,000 cash from small diamonds\" />\n      <gamegenie code=\"PEKSPLPE\" description=\"$9,000 cash from small diamonds\" />\n      <gamegenie code=\"ASNKPAAL\" description=\"Start with full energy\" />\n      <gamegenie code=\"AONKPAAL\" description=\"Start with a lot less energy\" />\n      <gamegenie code=\"AAEKAPZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAEKAPZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAEKAPZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-UGFAK\" name=\"Dudes with Attitude\" crc=\"BD29178A\">\n      <gamegenie code=\"SLUSSIVI\" description=\"Infinite energy\" />\n      <gamegenie code=\"SZUSIYVG\" description=\"Infinite time\" />\n    </game>\n    <game code=\"CLV-H-ZPUHA\" name=\"Dungeon Magic: Sword of the Elements\" crc=\"23C3FB2D\">\n      <gamegenie code=\"SXVLTLSA\" description=\"Take no damage except from scorpions\" />\n      <gamegenie code=\"GTKIITAA\" description=\"Start with 100 gold pieces\" />\n      <gamegenie code=\"OVVLGLSV\" description=\"Take less damage (1 of 2)\" />\n      <gamegenie code=\"ZEVLIUYL\" description=\"Take less damage (2 of 2)\" />\n      <gamegenie code=\"ZAKIITAA\" description=\"Start with 512 gold pieces (1 of 2)\" />\n      <gamegenie code=\"PGKSGTAG\" description=\"Start with 512 gold pieces (2 of 2)\" />\n      <gamegenie code=\"PXSTLZPG\" description=\"Stay at the Inn for free (1 of 2)\" />\n      <gamegenie code=\"AXSTYZAG\" description=\"Stay at the Inn for free (2 of 2)\" />\n      <gamegenie code=\"PXUVXTPG\" description=\"Items at Grocer's shop are free (1 of 2)\" />\n      <gamegenie code=\"AXUVVTAG\" description=\"Items at Grocer's shop are free (2 of 2)\" />\n      <gamegenie code=\"PXENPLPG\" description=\"Items at Armory are free (1 of 2)\" />\n      <gamegenie code=\"AXENILAG\" description=\"Items at Armory are free (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-HKEUW\" name=\"Dynowarz: The Destruction of Spondylus\" crc=\"BDE93999\">\n      <gamegenie code=\"ATSIOGSZ\" description=\"No harm from spikes\" />\n      <gamegenie code=\"AAVNVPLA\" description=\"No harm from any dinosaur\" />\n      <gamegenie code=\"AVNTNKXA\" description=\"Infinite shield\" />\n      <gamegenie code=\"TAXGLPPA\" description=\"Start on level 2\" />\n      <gamegenie code=\"ZAXGLPPE\" description=\"Start on level 3\" />\n      <gamegenie code=\"TAXGLPPE\" description=\"Start on level 4\" />\n      <gamegenie code=\"ZPXGLPPA\" description=\"Start on level 5\" />\n      <gamegenie code=\"YEXIYLLA\" description=\"Mega-jump power\" />\n      <gamegenie code=\"LANSIZPA\" description=\"Speed up left and right\" />\n      <gamegenie code=\"PANSAEPX\" description=\"Mostly invincible (1 of 2)\" />\n      <gamegenie code=\"GZNITAVG\" description=\"Mostly invincible (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FWWMI\" name=\"Elevator Action\" crc=\"2AC87283\">\n      <gamegenie code=\"GXEUOUVK\" description=\"Infinite lives - P1\" />\n      <gamegenie code=\"AAULNLZA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"IAULNLZA\" description=\"Start with 6 lives - P1\" />\n      <gamegenie code=\"AAULNLZE\" description=\"Start with 9 lives - P1\" />\n      <gamegenie code=\"IEVUULZA\" description=\"Start with 6 lives - P2\" />\n      <gamegenie code=\"AEVUULZE\" description=\"Starts with 9 lives - P2\" />\n      <gamegenie code=\"GASTLPTA\" description=\"Can only shoot one bullet\" />\n      <gamegenie code=\"PESIAYLA\" description=\"Slower man (1 of 2)\" />\n      <gamegenie code=\"NNUSZNSN\" description=\"Slower man (2 of 2)\" />\n      <gamegenie code=\"IESIAYLA\" description=\"Faster man (1 of 2)\" />\n      <gamegenie code=\"XNUSZNSN\" description=\"Faster man (2 of 2)\" />\n      <gamegenie code=\"ZAVTLOAE\" description=\"Faster bullets (1 of 2)\" />\n      <gamegenie code=\"VYVTYOEY\" description=\"Faster bullets (2 of 2)\" />\n      <gamegenie code=\"GAVTLOAA\" description=\"Slower bullets (1 of 2)\" />\n      <gamegenie code=\"KYVTYOEN\" description=\"Slower bullets (2 of 2)\" />\n      <gamegenie code=\"GEONGPZA\" description=\"Faster enemy (1 of 2)\" />\n      <gamegenie code=\"XNXNGOVN\" description=\"Faster enemy (2 of 2)\" />\n      <gamegenie code=\"PEONGPZA\" description=\"Slower enemy (1 of 2)\" />\n      <gamegenie code=\"NNXNGOVN\" description=\"Slower enemy (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-RCVQL\" name=\"Eliminator Boat Duel\" crc=\"059E0CDF\">\n      <gamegenie code=\"IZEEZZGA\" description=\"Start with 36 nitros\" />\n      <gamegenie code=\"AAEEZZGA\" description=\"Start with 0 nitros\" />\n      <gamegenie code=\"SZVSVNVS\" description=\"Almost infinite nitros - no on buoy stage\" />\n      <gamegenie code=\"IENEYPPA\" description=\"Boat starts with full turbo, steering, hull, max engine power\" />\n      <gamegenie code=\"SXUGOEVS\" description=\"Have full hull strength\" />\n      <gamegenie code=\"KAAISZ\" description=\"Computer boat goes crazy\" />\n    </game>\n    <game code=\"CLV-H-EXTQP\" name=\"Exodus: Journey to the Promised Land\" crc=\"0AB26DB6\">\n      <gamegenie code=\"SZUZKAVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXNSKIVG\" description=\"Infinite time\" />\n    </game>\n    <game code=\"CLV-H-AOQQL\" name=\"F-117a Stealth Fighter\" crc=\"0A7E62D4\">\n      <gamegenie code=\"SXXOATSA\" description=\"Invincibility\" />\n    </game>\n    <game code=\"CLV-H-QBITH\" name=\"Family Feud, The All New\" crc=\"51BEE3EA\">\n      <gamegenie code=\"ZESOGALE\" description=\"10 strikes allowed\" />\n      <gamegenie code=\"SXKKESVK\" description=\"Infinite time to answer a question\" />\n    </game>\n    <game code=\"CLV-H-JSLDB\" name=\"Fantastic Adventures of Dizzy, The\" crc=\"38FBCC85\">\n      <gamegenie code=\"SXVIAAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAOAZAZE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"AAVYPXAA\" description=\"Spiders, bats, ants and rats do no damage\" />\n      <gamegenie code=\"ZEKYVZGV\" description=\"Start with 10 stars instead of 100\" />\n      <gamegenie code=\"YYUZPSTE\" description=\"Play bubble sub-game only\" />\n      <gamegenie code=\"TYUZPSTE\" description=\"Play river sub-game only\" />\n      <gamegenie code=\"IYUZPSTE\" description=\"Play mine sub-game only\" />\n      <gamegenie code=\"ZYUZPSTE\" description=\"Play puzzle sub-game ony\" />\n    </game>\n    <game code=\"CLV-H-KCGXV\" name=\"Fantasy Zone\" crc=\"0FFDE258\">\n      <gamegenie code=\"OZEVYTVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAXVOPLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAXVOPLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAXVOPLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"OXETOAVK\" description=\"Keep bought weapon for a life\" />\n      <gamegenie code=\"AAOVKTPA\" description=\"Autofire on all weapons\" />\n      <gamegenie code=\"PASVYYAA\" description=\"Start on level 2\" />\n      <gamegenie code=\"ZASVYYAA\" description=\"Start on level 3\" />\n      <gamegenie code=\"LASVYYAA\" description=\"Start on level 4\" />\n      <gamegenie code=\"GASVYYAA\" description=\"Start on level 5\" />\n      <gamegenie code=\"IASVYYAA\" description=\"Start on level 6\" />\n      <gamegenie code=\"TASVYYAA\" description=\"Start on level 7\" />\n      <gamegenie code=\"OXETOAVK\" description=\"Keep bought weapon until next shop visit (1 of 2)\" />\n      <gamegenie code=\"OGOVATSE\" description=\"Keep bought weapon until next shop visit (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GDZGB\" name=\"Faria\" crc=\"45F03D2E\">\n      <gamegenie code=\"AAVZSPZA\" description=\"Get 250 arrows when buying any amount of arrows\" />\n      <gamegenie code=\"SZXGINVK\" description=\"Infinite batteries\" />\n      <gamegenie code=\"SXOLYOVK\" description=\"Infinite bombs\" />\n      <gamegenie code=\"GXSAASVK\" description=\"Infinite Sede magic\" />\n      <gamegenie code=\"GXNEZSVK\" description=\"Infinite Saba magic\" />\n      <gamegenie code=\"SAOEGPST\" description=\"Infinite HP (1 of 2)\" />\n      <gamegenie code=\"SEUUEAST\" description=\"Infinite HP (2 of 2)\" />\n      <gamegenie code=\"GZXXZUSE\" description=\"Don't get charged in shops for items you can afford (1 of 3)\" />\n      <gamegenie code=\"GZXXYUSE\" description=\"Don't get charged in shops for items you can afford (2 of 3)\" />\n      <gamegenie code=\"GZUZGUSE\" description=\"Don't get charged in shops for items you can afford (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-WLQFF\" name=\"Faxanadu\" crc=\"E71DB268\">\n      <gamegenie code=\"GXOGZESV\" description=\"Infinite P (health) (1 of 2)\" />\n      <gamegenie code=\"GXOKLESV\" description=\"Infinite P (health) (2 of 2)\" />\n      <gamegenie code=\"AEENEZZA\" description=\"Infinite M (magic)\" />\n      <gamegenie code=\"SXXNUOSE\" description=\"Infinite Gold (1 of 3)\" />\n      <gamegenie code=\"SXUYUOSE\" description=\"Infinite Gold (2 of 3)\" />\n      <gamegenie code=\"SXUNUOSE\" description=\"Infinite Gold (3 of 3)\" />\n      <gamegenie code=\"AXXSNTAP\" description=\"Start with double P (health)\" />\n      <gamegenie code=\"AUXSNTAP\" description=\"Start with triple P (health)\" />\n      <gamegenie code=\"IASEPSZA\" description=\"Start with half normal amount of Gold\" />\n      <gamegenie code=\"GPSEPSZA\" description=\"Start with double normal amount of Gold\" />\n      <gamegenie code=\"AVXVGPSZ\" description=\"Jump in direction you are facing\" />\n      <gamegenie code=\"AAUTAEOY\" description=\"Slow mode (1 of 3)\" />\n      <gamegenie code=\"AAKTPAKY\" description=\"Slow mode (2 of 3)\" />\n      <gamegenie code=\"AAUTZAPA\" description=\"Slow mode (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-YIKPM\" name=\"Felix the Cat\" crc=\"2CAAE01C\">\n      <gamegenie code=\"SUNNGNSO\" description=\"Infinite time\" />\n      <gamegenie code=\"AEUYKPPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"APUGAGZO\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"IPUGAGZP\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"APUGAGZP\" description=\"Start with 1 life\" />\n      <gamegenie code=\"AAEENAZA\" description=\"Hearts can't be replenished from bottles\" />\n      <gamegenie code=\"GAEENAZA\" description=\"Bottles replenish more hearts\" />\n      <gamegenie code=\"AAEENAZE\" description=\"Bottles replenish even more hearts\" />\n      <gamegenie code=\"ZAOSOZPA\" description=\"1 Felix icon gives 2 (1 of 2)\" />\n      <gamegenie code=\"APNSOXPO\" description=\"1 Felix icon gives 2 (2 of 2)\" />\n      <gamegenie code=\"ELEEATEP\" description=\"No sound effects\" />\n      <gamegenie code=\"AONEXTAL\" description=\"Weapon has longer reach\" />\n      <gamegenie code=\"AYOIPPEI\" description=\"Walk through walls (1 of 2)\" />\n      <gamegenie code=\"AYXSZPEI\" description=\"Walk through walls (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FXYSL\" name=\"Fester's Quest\" crc=\"B6BF5137\">\n      <gamegenie code=\"AYIPOG\" description=\"Invincibility\" />\n      <gamegenie code=\"XVEPUKVK\" description=\"Infinite health\" />\n      <gamegenie code=\"SZUSYOSE\" description=\"Infinite Money\" />\n      <gamegenie code=\"SZNIYOVK\" description=\"Infinite T.N.T on pick-up\" />\n      <gamegenie code=\"SXSITEVK\" description=\"Infinite Vice Grips on pick-up\" />\n      <gamegenie code=\"SZVVXUVK\" description=\"Infinite Missiles on pick-up\" />\n      <gamegenie code=\"SXVSLEVK\" description=\"Infinite Potions on pick-up\" />\n      <gamegenie code=\"SZEIYOVK\" description=\"Infinite Invisible Potions on pick-up\" />\n      <gamegenie code=\"SXUITEVK\" description=\"Infinite Nooses on pick-up\" />\n    </game>\n    <game code=\"CLV-H-GQSNF\" name=\"Fire'n Ice\" crc=\"D534C98E\">\n      <gamegenie code=\"AEENYKAA\" description=\"Automatically finish levels\" />\n    </game>\n    <game code=\"CLV-H-GRVZC\" name=\"Fire Hawk\" crc=\"1BC686A8\">\n      <gamegenie code=\"OZOXOTES\" description=\"Invincibility\" />\n      <gamegenie code=\"PAOEPALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAOEPALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAOEPALE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-VQPSF\" name=\"Fist of the North Star\" crc=\"06D72C83\">\n      <gamegenie code=\"SXXGAIAX\" description=\"Invincibility\" />\n      <gamegenie code=\"SZSGUGSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SXKKYPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZSVGTVG\" description=\"Infinite time\" />\n      <gamegenie code=\"OTSGOGSV\" description=\"One hit kills you\" />\n      <gamegenie code=\"TEELTPPA\" description=\"Sweep kick damages enemies more\" />\n      <gamegenie code=\"AEOLGPLE\" description=\"Straight kick damages enemies more\" />\n      <gamegenie code=\"AAUKVGGA\" description=\"Can't be knocked back by big thugs\" />\n      <gamegenie code=\"EISGUPEY\" description=\"Pogo stick\" />\n      <gamegenie code=\"OTSGOGSV\" description=\"Take minimum damage from all enemies (1 of 2)\" />\n      <gamegenie code=\"PASGXKOI\" description=\"Take minimum damage from all enemies (2 of 2)\" />\n      <gamegenie code=\"OVOUZPSV\" description=\"Any attack mega-damages enemies (1 of 2)\" />\n      <gamegenie code=\"ZEOULOOS\" description=\"Any attack mega-damages enemies (2 of 2)\" />\n      <gamegenie code=\"PEKKGALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEKKGALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEKKGALE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-IHJTI\" name=\"Flight of the Intruder\" crc=\"F92BE7F2\">\n      <gamegenie code=\"GZUOZYVG\" description=\"Infinite radar-guided missiles - bombing/strafing screen\" />\n      <gamegenie code=\"PAOALZTE\" description=\"Start with 9 radar-guided missiles - bombing/strafing screen\" />\n      <gamegenie code=\"GZUOLKVK\" description=\"Infinite missiles - cockpit screen\" />\n      <gamegenie code=\"GAKGKGAA\" description=\"Start on mission 3\" />\n      <gamegenie code=\"ZAKGKGAE\" description=\"Start on mission 6\" />\n      <gamegenie code=\"APKGKGAA\" description=\"Start on mission 9\" />\n      <gamegenie code=\"TPKGKGAA\" description=\"Start on mission 12\" />\n      <gamegenie code=\"OZKZTXOK\" description=\"Start each mission with 6 missiles (1 of 2)\" />\n      <gamegenie code=\"AAKXGZPA\" description=\"Start each mission with 6 missiles (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BJRYM\" name=\"Flintstones, The: The Rescue of Dino &amp; Hoppy\" crc=\"2FE20D79\">\n      <gamegenie code=\"AVOPZOVG\" description=\"Invincibility\" />\n      <gamegenie code=\"SXOAAEVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZNTZKVK\" description=\"Infinite energy (hearts) (1 of 2)\" />\n      <gamegenie code=\"SXOPZOVK\" description=\"Infinite energy (hearts) (2 of 2)\" />\n      <gamegenie code=\"AAVAYPZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAVAYPZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAVAYPZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"LTNELOZA\" description=\"Start with 99 coins\" />\n      <gamegenie code=\"PEEAAPAA\" description=\"Start with Slingshot\" />\n      <gamegenie code=\"ZEEAAPAA\" description=\"Start with Axe\" />\n      <gamegenie code=\"GEEAAPAA\" description=\"Start with Bomb\" />\n      <gamegenie code=\"YESTZZIE\" description=\"15 coins on pick-up\" />\n      <gamegenie code=\"ZESTZZIA\" description=\"2 coins on pick-up\" />\n      <gamegenie code=\"AAUAXTLA\" description=\"Slingshot doesn't use up coins\" />\n      <gamegenie code=\"AAUAUTLA\" description=\"Axe doesn't use up coins\" />\n      <gamegenie code=\"AAUAKVZA\" description=\"Bomb doesn't use up coins\" />\n      <gamegenie code=\"AETEKI\" description=\"Infinite Firepower\" />\n      <gamegenie code=\"LOKOEPPA\" description=\"Max power charge (1 of 4)\" />\n      <gamegenie code=\"LPEZLPPA\" description=\"Max power charge (2 of 4)\" />\n      <gamegenie code=\"LOEPLPPA\" description=\"Max power charge (3 of 4)\" />\n      <gamegenie code=\"LPUOLZPA\" description=\"Max power charge (4 of 4)\" />\n    </game>\n    <game code=\"CLV-H-PTRLQ\" name=\"Flintstones, The - The Surprise at Dinosaur Peak! (U) [p1][!]\" crc=\"0AC98EA5\">\n      <gamegenie code=\"AVEPKOSA\" description=\"Invincibility\" />\n      <gamegenie code=\"SXEETEVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AANONPPA\" description=\"Infinite energy\" />\n      <gamegenie code=\"SXEPKOSE\" description=\"Infinite energy (alt)\" />\n      <gamegenie code=\"AASALPZA\" description=\"Start with 1 life instead of 3\" />\n      <gamegenie code=\"GASALPZA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"AASALPZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"LANONPPA\" description=\"Enemies do more damage (3 hearts)\" />\n      <gamegenie code=\"SXXOUVSE\" description=\"Infinite stone hammers once obtained\" />\n      <gamegenie code=\"VTNEXOSE\" description=\"Start on level 2\" />\n      <gamegenie code=\"PANELPLA\" description=\"Start with 1 heart\" />\n      <gamegenie code=\"ZANELPLA\" description=\"Start with 2 hearts\" />\n      <gamegenie code=\"TANELPLA\" description=\"Start with 6 hearts\" />\n      <gamegenie code=\"PANELPLE\" description=\"Start with 9 hearts\" />\n      <gamegenie code=\"GOEATOGA\" description=\"Start with max power\" />\n      <gamegenie code=\"ZEEEUYPA\" description=\"Get bowling ball instead of stone hammer\" />\n      <gamegenie code=\"LEEEUYPA\" description=\"Get mystery item instead of stone hammer\" />\n      <gamegenie code=\"PAKAVPAA\" description=\"Continue on Level 2\" />\n      <gamegenie code=\"ZAKAVPAA\" description=\"Continue on Level 3\" />\n      <gamegenie code=\"LAKAVPAA\" description=\"Continue on Level 4\" />\n      <gamegenie code=\"GAKAVPAA\" description=\"Continue on Level 5\" />\n      <gamegenie code=\"IAKAVPAA\" description=\"Continue on Level 6\" />\n      <gamegenie code=\"TAKAVPAA\" description=\"Continue on Level 7\" />\n      <gamegenie code=\"YAKAVPAA\" description=\"Continue on Level 8\" />\n      <gamegenie code=\"AAKAVPAE\" description=\"Continue on Level 9\" />\n      <gamegenie code=\"PAKAVPAE\" description=\"Continue on Level 10\" />\n    </game>\n    <game code=\"CLV-H-UVKLX\" name=\"Flying Dragon: The Secret Scroll\" crc=\"F1FED9B8\">\n      <gamegenie code=\"VEKLTAKZ\" description=\"Start with infinite lives\" />\n      <gamegenie code=\"GXEEEPVG\" description=\"Start with infinite time\" />\n      <gamegenie code=\"PANATALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TANATALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PANATALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"TAOXULLA\" description=\"Start with double KO power\" />\n    </game>\n    <game code=\"CLV-H-UJOYX\" name=\"Flying Warriors\" crc=\"10180072\">\n      <gamegenie code=\"SXNKIKSE\" description=\"Infinite life\" />\n      <gamegenie code=\"SZVGKOVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXOZPKSE\" description=\"Infinite KO's (1 of 2)\" />\n      <gamegenie code=\"SZSKLXSE\" description=\"Infinite KO's (2 of 2)\" />\n      <gamegenie code=\"SZXEZZVG\" description=\"Infnite Credits\" />\n    </game>\n    <game code=\"CLV-H-QXTAS\" name=\"Formula One: Built to Win\" crc=\"5A8B4DA8\">\n      <gamegenie code=\"SXUIXEVK\" description=\"Infinite nitro\" />\n      <gamegenie code=\"ATKSXAAZ\" description=\"Better nitro\" />\n      <gamegenie code=\"AAVSOAZA\" description=\"Psycho speed\" />\n      <gamegenie code=\"ATNUVUSZ\" description=\"Items cost nothing\" />\n      <gamegenie code=\"ATNUVUSZ\" description=\"Items for free (1 of 2)\" />\n      <gamegenie code=\"ATVUKLST\" description=\"Items for free (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-JIBNO\" name=\"Frankenstein: The Monster Returns\" crc=\"E943EC4D\">\n      <gamegenie code=\"ZEVKLGAA\" description=\"Invincibility\" />\n      <gamegenie code=\"SZKEPASA\" description=\"Invincible after you die once (may get stuck in boss stages) (1 of 2)\" />\n      <gamegenie code=\"SZEGPASA\" description=\"Invincible after you die once (may get stuck in boss stages) (2 of 2)\" />\n      <gamegenie code=\"SXKELLSA\" description=\"Infinite health (1 of 5)\" />\n      <gamegenie code=\"SZNOYASA\" description=\"Infinite health (2 of 5)\" />\n      <gamegenie code=\"SXKEOLSA\" description=\"Infinite health (3 of 5)\" />\n      <gamegenie code=\"SXUOZASA\" description=\"Infinite health (4 of 5)\" />\n      <gamegenie code=\"SXUOGASA\" description=\"Infinite health (5 of 5)\" />\n      <gamegenie code=\"PEOGYPLA\" description=\"Start with 0 continue\" />\n      <gamegenie code=\"SZEEULSA\" description=\"Can't collect extra energy\" />\n      <gamegenie code=\"EEKAYLEL\" description=\"Die after one hit\" />\n    </game>\n    <game code=\"CLV-H-OTUTJ\" name=\"Freedom Force\" crc=\"3E58A87E\">\n      <gamegenie code=\"ZOOTYTGZ\" description=\"Start with half ammo\" />\n      <gamegenie code=\"AEUTLYZZ\" description=\"Infinite ammo\" />\n      <gamegenie code=\"LEOVAYTA\" description=\"Fewer errors allowed\" />\n      <gamegenie code=\"OXOTYNOK\" description=\"Infinite errors allowed\" />\n      <gamegenie code=\"ZAUTLTPA\" description=\"Start at level 2\" />\n      <gamegenie code=\"LAUTLTPA\" description=\"Start at level 3\" />\n      <gamegenie code=\"GAUTLTPA\" description=\"Start at level 4\" />\n      <gamegenie code=\"IAUTLTPA\" description=\"Start at level 5\" />\n      <gamegenie code=\"GAKVYVAO\" description=\"Start with half health\" />\n      <gamegenie code=\"GZVAYLSA\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-ZSUEJ\" name=\"Friday the 13th\" crc=\"BEB15855\">\n      <gamegenie code=\"SZEXSYAX\" description=\"Invincibility\" />\n      <gamegenie code=\"SZESKSSE\" description=\"Infinite health\" />\n      <gamegenie code=\"OTEIVISV\" description=\"Infinite health for active counselor\" />\n      <gamegenie code=\"ZZOUAGTE\" description=\"Vitamins heal active counselor better\" />\n      <gamegenie code=\"AZEVXLGE\" description=\"Vitamins heal others better\" />\n      <gamegenie code=\"INNLIZGY\" description=\"Autofire\" />\n      <gamegenie code=\"SZNUGYAX\" description=\"Infinite child save time\" />\n      <gamegenie code=\"GAEUZIAE\" description=\"Everyone can jump high\" />\n      <gamegenie code=\"SZSLUEVK\" description=\"Infinite children (1 of 2)\" />\n      <gamegenie code=\"IYKLSEAY\" description=\"Infinite children (2 of 2)\" />\n      <gamegenie code=\"AIKIUGEI\" description=\"Hit anywhere\" />\n      <gamegenie code=\"AEOSOGZP\" description=\"One hit kills\" />\n      <gamegenie code=\"AESGXZZZ\" description=\"Enemies die automatically\" />\n      <gamegenie code=\"AEKGKLZA\" description=\"No enemies (1 of 2)\" />\n      <gamegenie code=\"SXXISXVN\" description=\"No enemies (2 of 2)\" />\n      <gamegenie code=\"SZVLGXOU\" description=\"Turbo running (1 of 2)\" />\n      <gamegenie code=\"YPVLIXAV\" description=\"Turbo running (2 of 2)\" />\n      <gamegenie code=\"YEEGIZSZ\" description=\"Throw rocks straight\" />\n      <gamegenie code=\"IEVANTPA\" description=\"Start with 55 children (1 of 2)\" />\n      <gamegenie code=\"YUNESVYA\" description=\"Start with 55 children (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-NXQPY\" name=\"G.I. Joe\" crc=\"1D2D93FF\">\n      <gamegenie code=\"ESVOGGEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"XVNPAKAU\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXVXOVSE\" description=\"Infinite ammo\" />\n      <gamegenie code=\"SXNETUSE\" description=\"Infinite time\" />\n      <gamegenie code=\"AENATLPA\" description=\"Infinite time (alt)\" />\n      <gamegenie code=\"GOUTKSIA\" description=\"More health - Duke\" />\n      <gamegenie code=\"GOUTSSGA\" description=\"More health - Blizzard\" />\n      <gamegenie code=\"GOUTVSZA\" description=\"More health - Snake Eyes\" />\n      <gamegenie code=\"GOUTNSLA\" description=\"More health - Capt. Grid-Iron\" />\n      <gamegenie code=\"GOUVESPA\" description=\"More health - Rock and Roll\" />\n      <gamegenie code=\"TEUTKSIA\" description=\"Less health - Duke\" />\n      <gamegenie code=\"TEUTSSGA\" description=\"Less health - Blizzard\" />\n      <gamegenie code=\"IEUTVSZA\" description=\"Less health - Snake Eyes\" />\n      <gamegenie code=\"IEUTNSLA\" description=\"Less health - Capt. Grid-Iron\" />\n      <gamegenie code=\"GEUVESPA\" description=\"Less health - Rock and Roll\" />\n      <gamegenie code=\"ALNVIKAY\" description=\"Shorter immunity\" />\n      <gamegenie code=\"NYNVIKAN\" description=\"Longer immunity\" />\n      <gamegenie code=\"AAUEPPLA\" description=\"Max health on pick-up\" />\n      <gamegenie code=\"OLNTYKOO\" description=\"Infinite health\" />\n      <gamegenie code=\"AXNVKIYP\" description=\"Mega-jump - Duke\" />\n      <gamegenie code=\"AXNVSIZP\" description=\"Mega-jump - Blizzard\" />\n      <gamegenie code=\"AXNVVSGP\" description=\"Mega-jump - Snake Eyes\" />\n      <gamegenie code=\"AXNVNIGP\" description=\"Mega-jump - Capt. Grid-Iron\" />\n      <gamegenie code=\"AZETETAP\" description=\"Mega-jump - Rock and Roll\" />\n    </game>\n    <game code=\"CLV-H-SVXVM\" name=\"G.I. Joe: The Atlantis Factor\" crc=\"8C8DEDB6\">\n      <gamegenie code=\"EISPUZEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"XTSPNXAU\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"YUKETLPE\" description=\"Start with all characters\" />\n      <gamegenie code=\"IAEELGPA\" description=\"Start with 500 bullets\" />\n      <gamegenie code=\"PENVSYIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"OUSTLSOO\" description=\"Infinite health\" />\n      <gamegenie code=\"AESVPSAY\" description=\"Don't flash after getting hit\" />\n      <gamegenie code=\"PUSVPSAN\" description=\"Flash about half as long after getting hit\" />\n      <gamegenie code=\"AASEZIPA\" description=\"Infinite time\" />\n      <gamegenie code=\"SUOPEUVS\" description=\"Infinite Mines\" />\n      <gamegenie code=\"SXSTLSOP\" description=\"Infinite stamina (1 of 2)\" />\n      <gamegenie code=\"SUOAISSO\" description=\"Infinite stamina (2 of 2)\" />\n      <gamegenie code=\"GAXPPYPA\" description=\"Each Pow worth increases player level by one\" />\n      <gamegenie code=\"GXSUZVSE\" description=\"Infinite bullets after obtaining a power up shell (1 of 2)\" />\n      <gamegenie code=\"GXVLTVSE\" description=\"Infinite bullets after obtaining a power up shell (2 of 2)\" />\n      <gamegenie code=\"SXSUZVSE\" description=\"Infinite ammo (1 of 4)\" />\n      <gamegenie code=\"SXVLTVSE\" description=\"Infinite ammo (2 of 4)\" />\n      <gamegenie code=\"SXSLIVVK\" description=\"Infinite ammo (3 of 4)\" />\n      <gamegenie code=\"SXVUPVSE\" description=\"Infinite ammo (4 of 4)\" />\n    </game>\n    <game code=\"CLV-H-OKVPY\" name=\"Galaxy 5000: Racing in the 51st Century\" crc=\"1D20A5C6\">\n      <gamegenie code=\"SLKPAEVS\" description=\"Infinite time\" />\n      <gamegenie code=\"GXNXSVSN\" description=\"Reduce damage free of charge\" />\n      <gamegenie code=\"SXKZEPAX\" description=\"No damage from falling\" />\n      <gamegenie code=\"OXNNVPSX\" description=\"Take less damage (1 of 2)\" />\n      <gamegenie code=\"PENNNOZP\" description=\"Take less damage (2 of 2)\" />\n      <gamegenie code=\"SXUXSOSU\" description=\"More damage from falling (2 of 2)\" />\n      <gamegenie code=\"ALVUVYLZ\" description=\"More damage from falling (2 of 2)\" />\n      <gamegenie code=\"TEEOZGVV\" description=\"More damage from shots (1 of 2)\" />\n      <gamegenie code=\"NUEOLKVN\" description=\"More damage from shots (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-LGXDG\" name=\"Gargoyle's Quest II\" crc=\"F0E9971B\">\n      <gamegenie code=\"OXSELPSX\" description=\"Infinite fight\" />\n      <gamegenie code=\"OESAKAIE\" description=\"Invincibility (except Doppelganger when it mimics you)\" />\n      <gamegenie code=\"KVNVYLIA\" description=\"Invincible against spikes\" />\n      <gamegenie code=\"APOEGLEP\" description=\"Walk through walls\" />\n    </game>\n    <game code=\"CLV-H-ZKXZP\" name=\"Gauntlet\" crc=\"EC968C51\">\n      <gamegenie code=\"SLNAEYSP\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SLVPOASP\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"PAOXVLAE\" description=\"Infinite Keys (1 of 2)\" />\n      <gamegenie code=\"SAXZOLSZ\" description=\"Infinite Keys (2 of 2)\" />\n      <gamegenie code=\"XVOONAVK\" description=\"Infinite time in puzzle and treasure rooms\" />\n    </game>\n    <game code=\"CLV-H-DWHLX\" name=\"Gauntlet II\" crc=\"1B71CCDB\">\n      <gamegenie code=\"PAOVYAAA\" description=\"Infinite Keys (new game) (1 of 2)\" />\n      <gamegenie code=\"SZVTEUVS\" description=\"Infinite Keys (new game) (2 of 2)\" />\n      <gamegenie code=\"SLXSNNSO\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SLETYXSO\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"OTXSSYSV\" description=\"Take less damage (1 of 2)\" />\n      <gamegenie code=\"ZAXSVYAA\" description=\"Take less damage (2 of 2)\" />\n      <gamegenie code=\"XVOTGXSU\" description=\"Infinite time in treasure rooms\" />\n      <gamegenie code=\"ZLVVVIGT\" description=\"Weaker poison\" />\n      <gamegenie code=\"EGVVVIGV\" description=\"Stronger poison\" />\n      <gamegenie code=\"IAUTEUZA\" description=\"5 super shots on pick-up\" />\n      <gamegenie code=\"GPUTEUZA\" description=\"20 super shots on pick-up\" />\n      <gamegenie code=\"AYETVUGU\" description=\"Invincibility lasts longer\" />\n      <gamegenie code=\"LPETVUGU\" description=\"Invincibility doesn't last as long\" />\n      <gamegenie code=\"ANNTUXGU\" description=\"Repulsiveness lasts longer\" />\n      <gamegenie code=\"LONTUXGU\" description=\"Repulsiveness doesn't last as long\" />\n      <gamegenie code=\"AYOTKUGU\" description=\"Invisibility lasts longer\" />\n      <gamegenie code=\"LPOTKUGU\" description=\"Invisibility doesn't last as long\" />\n      <gamegenie code=\"APUVTIEP\" description=\"Walk through walls (1 of 2)\" />\n      <gamegenie code=\"ELSVGIEP\" description=\"Walk through walls (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-UHOPS\" name=\"George Foreman's KO Boxing\" crc=\"AF05F37E\">\n      <gamegenie code=\"AOONKZEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"OXNYSXPK\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"AAVTTNAA\" description=\"Can always use super punches\" />\n      <gamegenie code=\"OXVNSAOU\" description=\"Knock down opponent with 1 super punch (1 of 2)\" />\n      <gamegenie code=\"PKVNVEVZ\" description=\"Knock down opponent with 1 super punch (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-MFSAH\" name=\"Ghostbusters\" crc=\"6A154B68\">\n      <gamegenie code=\"AVVETNTI\" description=\"Start with $1,000,000\" />\n      <gamegenie code=\"SXKZAZVG\" description=\"Infinite fuel\" />\n      <gamegenie code=\"OXOXKPVK\" description=\"Immune to ghosts on Zuul stairway\" />\n      <gamegenie code=\"PAEEXKPX\" description=\"Permanent ghost alarm\" />\n      <gamegenie code=\"PASPLOPX\" description=\"Permanent ghost vacuum\" />\n      <gamegenie code=\"OXSESGSX\" description=\"Self-emptying traps\" />\n      <gamegenie code=\"AEEZOAPA\" description=\"Super sprinting up Zuul stairway\" />\n      <gamegenie code=\"SZXYVOVV\" description=\"Stay Puft does not climb building during Gozer fight\" />\n      <gamegenie code=\"SZVYAUSE\" description=\"Infinite energy during Gozer fight\" />\n      <gamegenie code=\"EIUYZLEY\" description=\"Gozer dies in one hit\" />\n      <gamegenie code=\"AAXXPTYP\" description=\"No walk up Zuul stairway\" />\n    </game>\n    <game code=\"CLV-H-OLDAK\" name=\"Ghostbusters II\" crc=\"2AE97660\">\n      <gamegenie code=\"EINPOYEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ESVOKIEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SUKYAUVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAXVGGLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAXVGGLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAXVGGLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZXPSXVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"TAEGTAZA\" description=\"Triple continues\" />\n      <gamegenie code=\"ZEEOOXYO\" description=\"Rapid-firing proton rifle\" />\n      <gamegenie code=\"KYSOKXVN\" description=\"All Ghostbusters can mega-jump\" />\n      <gamegenie code=\"NNXXAPAS\" description=\"Shield lasts longer - car scenes\" />\n      <gamegenie code=\"SZOXLNVK\" description=\"Infinite shield - car scenes\" />\n    </game>\n    <game code=\"CLV-H-SQBSY\" name=\"Ghoul School\" crc=\"2BC25D5A\">\n      <gamegenie code=\"SZKZOZAX\" description=\"Invincibility\" />\n      <gamegenie code=\"SXSXSUSE\" description=\"Infinite health\" />\n      <gamegenie code=\"SXEKYVVK\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-VJXZH\" name=\"Goal!\" crc=\"84148F73\">\n      <gamegenie code=\"OGOKLYEN\" description=\"CPU score adds to your score (1 of 2)\" />\n      <gamegenie code=\"OGOKYYEN\" description=\"CPU score adds to your score (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-TQCAC\" name=\"Goal! Two\" crc=\"90C773C1\">\n      <gamegenie code=\"AZKIANPA\" description=\"Start with more KP - Italy, P2\" />\n      <gamegenie code=\"AIKIANPA\" description=\"Start with a lot of KP - Italy, P2\" />\n      <gamegenie code=\"OPKIANPE\" description=\"Start with mega KP - Italy, P2\" />\n      <gamegenie code=\"AZKIPYYA\" description=\"Start with more TP - Italy, P2\" />\n      <gamegenie code=\"AIKIPYYA\" description=\"Start with a lot of TP - Italy, P2\" />\n      <gamegenie code=\"OPKIPYYE\" description=\"Start with mega TP - Italy, P2\" />\n      <gamegenie code=\"SZEYAPVG\" description=\"Infinite time - Italy, P2\" />\n      <gamegenie code=\"SXNELNSE\" description=\"P2 or computer can't score - Italy, P2\" />\n    </game>\n    <game code=\"CLV-H-WYIKA\" name=\"Capcom's Gold Medal Challenge '92\" crc=\"BE250388\">\n      <gamegenie code=\"OXSYZVON\" description=\"Massive run power (1 of 3)\" />\n      <gamegenie code=\"ASSYLTEY\" description=\"Massive run power (2 of 3)\" />\n      <gamegenie code=\"XVSYGTVN\" description=\"Massive run power (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-NGJDR\" name=\"Golf\" crc=\"E7D2C49D\">\n      <gamegenie code=\"AAVGIZLA\" description=\"Ball goes in from anywhere (1 of 3)\" />\n      <gamegenie code=\"APVIYLEY\" description=\"Ball goes in from anywhere (2 of 3)\" />\n      <gamegenie code=\"ILVSALPK\" description=\"Ball goes in from anywhere (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-YXARP\" name=\"Golf Grand Slam\" crc=\"CF5F8AF0\">\n      <gamegenie code=\"SXEZGYSA\" description=\"Strokes aren't recorded\" />\n      <gamegenie code=\"PEXTETIA\" description=\"Some shots can be done more accurately\" />\n      <gamegenie code=\"OZOIPGIX\" description=\"Wind always at 9 (1 of 3)\" />\n      <gamegenie code=\"PAOIZKAX\" description=\"Wind always at 9 (2 of 3)\" />\n      <gamegenie code=\"SXSZZYSA\" description=\"Wind always at 9 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-SQCNX\" name=\"Golgo 13: Top Secret Episode\" crc=\"F532F09A\">\n      <gamegenie code=\"SZOETGSA\" description=\"Infinite health (1 of 3)\" />\n      <gamegenie code=\"OXKVXAVK\" description=\"Infinite health (2 of 3)\" />\n      <gamegenie code=\"SXKNNPSA\" description=\"Infinite health (3 of 3)\" />\n      <gamegenie code=\"SXKVXAVG\" description=\"Health does not gradually decrease\" />\n      <gamegenie code=\"GXUVXTSA\" description=\"Infinite bullets in horizontal mode\" />\n      <gamegenie code=\"GXKNNPSA\" description=\"Infinite health in horizontal mode\" />\n      <gamegenie code=\"GZOEGGST\" description=\"Infinite health in pan/zoom mode\" />\n      <gamegenie code=\"GZKLZGST\" description=\"Infinite health in maze\" />\n      <gamegenie code=\"ZAVKIAAA\" description=\"Have a health and bullets boost\" />\n    </game>\n    <game code=\"CLV-H-URLKN\" name=\"Goonies II, The\" crc=\"999577B6\">\n      <gamegenie code=\"SESEZESX\" description=\"Invincibility\" />\n      <gamegenie code=\"SZSUNTSA\" description=\"Infinite health\" />\n      <gamegenie code=\"YEUAOPZA\" description=\"Super-jump\" />\n      <gamegenie code=\"SSOOUZVI\" description=\"Infinite time\" />\n      <gamegenie code=\"SZUGUYVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"LEUAOPZA\" description=\"Mega-jump\" />\n      <gamegenie code=\"IEUEKPGA\" description=\"Better Jumping Boots on pick-up\" />\n      <gamegenie code=\"ZESAPAPA\" description=\"Super-speed\" />\n      <gamegenie code=\"SXUASSVK\" description=\"Infinite Bombs on pick-up\" />\n      <gamegenie code=\"SZVAESVK\" description=\"Infinite Molotov Bombs on pick-up\" />\n      <gamegenie code=\"SZNEEVVK\" description=\"Infinite Sling Shots on pick-up\" />\n      <gamegenie code=\"AOSAYVOG\" description=\"Walk through walls (1 of 3)\" />\n      <gamegenie code=\"APSAZYEY\" description=\"Walk through walls (2 of 3)\" />\n      <gamegenie code=\"SZNAANSE\" description=\"Walk through walls (3 of 3)\" />\n      <gamegenie code=\"GAUIZGZA\" description=\"Start with 4 health cells (1 of 2)\" />\n      <gamegenie code=\"AGUIYGAZ\" description=\"Start with 4 health cells (2 of 2)\" />\n      <gamegenie code=\"AAUIZGZE\" description=\"Start with 8 health cells (1 of 2)\" />\n      <gamegenie code=\"EAUIYGAZ\" description=\"Start with 8 health cells (2 of 2)\" />\n      <gamegenie code=\"YPVIAGPE\" description=\"Start with all items\" />\n      <gamegenie code=\"IAVIAGPA\" description=\"Start with Boomerang\" />\n      <gamegenie code=\"PAXSZGLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAXSZGLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAXSZGLE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-VJENJ\" name=\"Gotcha! The Sport!\" crc=\"4E959173\">\n      <gamegenie code=\"AASUTIPA\" description=\"Infinite time\" />\n      <gamegenie code=\"ZAEOKAPA\" description=\"Start with double rations of ammo\" />\n      <gamegenie code=\"IAEPOAGA\" description=\"Increase timer to 59 seconds (1 of 2)\" />\n      <gamegenie code=\"PAEPVAIE\" description=\"Increase timer to 59 seconds (2 of 2)\" />\n      <gamegenie code=\"ZAEPOAGA\" description=\"Decrease timer to 25 seconds (1 of 2)\" />\n      <gamegenie code=\"IAEPVAIA\" description=\"Decrease timer to 25 seconds (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-CAVUH\" name=\"Great Waldo Search, The\" crc=\"2DFF7FDC\">\n      <gamegenie code=\"EKEIXTEA\" description=\"Only need to find Waldo to complete the level\" />\n      <gamegenie code=\"EKXSNTAG\" description=\"Only need to find the magic scroll\" />\n      <gamegenie code=\"ZEKKOTPA\" description=\"Faster timer\" />\n      <gamegenie code=\"GEKKOTPA\" description=\"Much faster timer\" />\n      <gamegenie code=\"OZSIEEOV\" description=\"Play the Super Waldo Challenge (1 of 2)\" />\n      <gamegenie code=\"GASIOALA\" description=\"Play the Super Waldo Challenge (2 of 2)\" />\n      <gamegenie code=\"SXSGKTVG\" description=\"Extra clocks last forever\" />\n      <gamegenie code=\"SZXINYVT\" description=\"Extra clocks worth nothing\" />\n    </game>\n    <game code=\"CLV-H-OCJKD\" name=\"Gremlins 2: The New Batch\" crc=\"0ED96F42\">\n      <gamegenie code=\"EYESUIEI\" description=\"Invincibility\" />\n      <gamegenie code=\"SXKEZPVG\" description=\"Infinite health\" />\n      <gamegenie code=\"GAEGEAAA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"PAEGEAAE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"LAEGSAPA\" description=\"Start with 3 balloons\" />\n      <gamegenie code=\"TAEGSAPA\" description=\"Start with 6 balloons\" />\n      <gamegenie code=\"SZNETEVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZXEUXVK\" description=\"Infinite Balloons\" />\n      <gamegenie code=\"ZAEKXATA\" description=\"Start with only 1 heart (1 of 2)\" />\n      <gamegenie code=\"ZEEELATA\" description=\"Start with only 1 heart (2 of 2)\" />\n      <gamegenie code=\"AAEKXATE\" description=\"Start with 4 hearts (1 of 2)\" />\n      <gamegenie code=\"AEEELATE\" description=\"Start with 4 hearts (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-XPPGA\" name=\"Guardian Legend, The\" crc=\"FA43146B\">\n      <gamegenie code=\"AVKSLZSZ\" description=\"Invincibility\" />\n      <gamegenie code=\"AAXTIUNY\" description=\"Infinite health\" />\n      <gamegenie code=\"AASIYUYT\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"EGSITLIZ\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"EISSALEY\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"PASSPLIE\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"OVOAKLSV\" description=\"Use up minimum shots (1 of 2)\" />\n      <gamegenie code=\"PEOASLAP\" description=\"Use up minimum shots (2 of 2)\" />\n      <gamegenie code=\"GXOAKLST\" description=\"Never use up shots (To finish the game, save before opening the entrance to corridor 6. Restart with no codes and enter the entrance. Save again, then restart.)\" />\n      <gamegenie code=\"AXVAIAAG\" description=\"Start with less health\" />\n      <gamegenie code=\"EEVAIAAG\" description=\"Start with more health\" />\n      <gamegenie code=\"PAKVELAA\" description=\"Start on area 01\" />\n      <gamegenie code=\"LAKVELAA\" description=\"Start on area 03\" />\n      <gamegenie code=\"IAKVELAA\" description=\"Start on area 05\" />\n      <gamegenie code=\"YAKVELAA\" description=\"Start on area 07\" />\n      <gamegenie code=\"PAKVELAE\" description=\"Start on area 09\" />\n    </game>\n    <game code=\"CLV-H-WUURQ\" name=\"Guerrilla War\" crc=\"6DECD886\">\n      <gamegenie code=\"EYSTGGEI\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"EIETUGEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SLTKOV\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"SZVKOVVS\" description=\"Infinite lives - both players (alt)\" />\n      <gamegenie code=\"SXUTEUSO\" description=\"Keep weapon after death\" />\n      <gamegenie code=\"PEXXAEAE\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"LASKYYPO\" description=\"Press Start to complete the level\" />\n      <gamegenie code=\"AELGVP\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"IELGVP\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"PELGVO\" description=\"Start with 9 lives - both players\" />\n    </game>\n    <game code=\"CLV-H-HOUTJ\" name=\"Gumshoe\" crc=\"BEB8AB01\">\n      <gamegenie code=\"PAUENALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAUENALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAUENALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"IZSEEAAI\" description=\"Start with 25 bullets\" />\n      <gamegenie code=\"PASEKAAA\" description=\"Start with 150 bullets\" />\n      <gamegenie code=\"ZASEKAAA\" description=\"Start with 250 bullets\" />\n      <gamegenie code=\"PASAUALA\" description=\"Gain 1 bullet on pick-up\" />\n      <gamegenie code=\"TASAUALA\" description=\"Gain 6 bullets on pick-up\" />\n      <gamegenie code=\"LAKEGYTA\" description=\"Timer set to 04:00\" />\n      <gamegenie code=\"PAKEGYTE\" description=\"Timer set to 10:00\" />\n      <gamegenie code=\"SAKAVEKE\" description=\"Different attack waves\" />\n    </game>\n    <game code=\"CLV-H-PFOVZ\" name=\"Gun Nac\" crc=\"D19DCB2B\">\n      <gamegenie code=\"AGEZPAAI\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"AGUXGPAI\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXVZTXSE\" description=\"Infinite special weapons\" />\n      <gamegenie code=\"SXOZYUSE\" description=\"Infinite lives\" />\n      <gamegenie code=\"EIEIYYEP\" description=\"One hit kills\" />\n    </game>\n    <game code=\"CLV-H-AXYOR\" name=\"Gun.Smoke\" crc=\"A8784932\">\n      <gamegenie code=\"PAXVTYLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PPXVTYLE\" description=\"Start with 25 lives\" />\n      <gamegenie code=\"SXUYTLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAUTTYAA\" description=\"Start with all weapons and lots of ammo\" />\n      <gamegenie code=\"GAUTTYAA\" description=\"Start with all weapons, lots of ammo, all 4 boots and all 4 rifle icons\" />\n      <gamegenie code=\"PEXNALAA\" description=\"Keep weapons after death\" />\n    </game>\n    <game code=\"CLV-H-WFYWJ\" name=\"Gyro\" crc=\"023A5A32\">\n      <gamegenie code=\"SZUZKTAX\" description=\"Invincible against enemies\" />\n      <gamegenie code=\"ATOXXOOZ\" description=\"Invincible against upward crushing\" />\n      <gamegenie code=\"AESZVZLA\" description=\"Climb up through flooring\" />\n      <gamegenie code=\"AEOZEZLA\" description=\"Climb down through flooring\" />\n      <gamegenie code=\"SUZAAI\" description=\"Infinite lives\" />\n      <gamegenie code=\"ZEAAUS\" description=\"Slow down timer\" />\n      <gamegenie code=\"PEUAGLIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZEUAGLIE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"GOUAGLIA\" description=\"Start with 20 lives\" />\n    </game>\n    <game code=\"CLV-H-QSLDA\" name=\"Gyruss\" crc=\"1D41CC8C\">\n      <gamegenie code=\"OXSXTASX\" description=\"Invincibility\" />\n      <gamegenie code=\"AEEOIEZA\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAXEGLGA\" description=\"Start with 1 ship\" />\n      <gamegenie code=\"ZAXEGLGE\" description=\"Start with 10 ships\" />\n      <gamegenie code=\"GAKEATPA\" description=\"Start with 4 phasers\" />\n      <gamegenie code=\"AAKEATPE\" description=\"Start with 8 phasers\" />\n      <gamegenie code=\"ZEEPYAPA\" description=\"Gain 2 phasers when you die with none\" />\n      <gamegenie code=\"GEEPYAPA\" description=\"Gain 4 phasers when you die with none\" />\n      <gamegenie code=\"OAKEATPA\" description=\"Start with twin shots + 1 phaser\" />\n      <gamegenie code=\"KAKEATPA\" description=\"Start with twin shots + 4 phasers\" />\n      <gamegenie code=\"EAKEATPE\" description=\"Start with twin shots + 8 phasers\" />\n      <gamegenie code=\"GEEPIAZA\" description=\"Never lose twin shots (1 of 2)\" />\n      <gamegenie code=\"OEEPYAPA\" description=\"Never lose twin shots (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BYCJO\" name=\"Harlem Globetrotters\" crc=\"2E6EE98D\">\n      <gamegenie code=\"IIUGSOIZ\" description=\"Slower timer\" />\n      <gamegenie code=\"GPUGSOIX\" description=\"Faster timer\" />\n      <gamegenie code=\"IIVGKOIZ\" description=\"Slower shot clock\" />\n      <gamegenie code=\"GPVGKOIX\" description=\"Faster shot clock\" />\n    </game>\n    <game code=\"CLV-H-YFSBO\" name=\"Heavy Barrel\" crc=\"34EAB034\">\n      <gamegenie code=\"AVVUEUPA\" description=\"Invincibility\" />\n      <gamegenie code=\"SZOTXTVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXVVVLVI\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"ENSTPVSN\" description=\"Autofire - P1\" />\n      <gamegenie code=\"EYNVINSN\" description=\"Autofire - P2\" />\n      <gamegenie code=\"AEKVXLII\" description=\"Hand weapons last 4x longer\" />\n      <gamegenie code=\"ZAOVEPAA\" description=\"Only 1 hand weapon\" />\n      <gamegenie code=\"ENVVKLEI\" description=\"Infinite hand weapons on pick-up - both players\" />\n      <gamegenie code=\"OXVVVLVS\" description=\"Infinite hand weapons and firearms on pick-up - both players\" />\n      <gamegenie code=\"XVKZVEXK\" description=\"Enemies don't fire handguns\" />\n      <gamegenie code=\"XTOVVEXK\" description=\"Invincibility and invisibility on second life\" />\n      <gamegenie code=\"SUKUZISP\" description=\"Infinite Keys\" />\n      <gamegenie code=\"OXNUTNPV\" description=\"Infinite Mace\" />\n    </game>\n    <game code=\"CLV-H-EABIR\" name=\"Heavy Shreddin'\" crc=\"EB15169E\">\n      <gamegenie code=\"AUEXNVAO\" description=\"Slow timer\" />\n      <gamegenie code=\"PEKAPLGA\" description=\"1 penalty\" />\n      <gamegenie code=\"AEKAPLGE\" description=\"8 penalties\" />\n      <gamegenie code=\"AOKAPLGA\" description=\"16 penalties\" />\n      <gamegenie code=\"NNUEYLAE\" description=\"Select any level\" />\n      <gamegenie code=\"ZESEKLPA\" description=\"Faster left and right movement (1 of 2)\" />\n      <gamegenie code=\"ZEVEKLPA\" description=\"Faster left and right movement (2 of 2)\" />\n      <gamegenie code=\"SXSOYIVG\" description=\"Infinite penalties (1 of 3)\" />\n      <gamegenie code=\"SXOPPLVG\" description=\"Infinite penalties (2 of 3)\" />\n      <gamegenie code=\"SXUOZLVG\" description=\"Infinite penalties (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-CKXJA\" name=\"Hogan's Alley\" crc=\"FF24D794\">\n      <gamegenie code=\"IAEKOIAP\" description=\"5 misses allowed - Game A\" />\n      <gamegenie code=\"AZEKOIAP\" description=\"20 misses allowed - Game A\" />\n      <gamegenie code=\"AAOSIASY\" description=\"Hit anywhere - Game B (1 of 2)\" />\n      <gamegenie code=\"AAXSPGEA\" description=\"Hit anywhere - Game B (2 of 2)\" />\n      <gamegenie code=\"AAOGETPA\" description=\"Infinite misses allowed - all games\" />\n      <gamegenie code=\"ZAOGETPA\" description=\"Each miss counts as 2 - all games\" />\n    </game>\n    <game code=\"CLV-H-CBYKI\" name=\"Home Alone 2: Lost in New York\" crc=\"2E0741B6\">\n      <gamegenie code=\"SZSVLVVK\" description=\"Become almost invincible after losing 1 life point (against most enemies, vacuum cleaner can still kill you)\" />\n      <gamegenie code=\"PEEPILLA\" description=\"Start with 1 life instead of 3\" />\n      <gamegenie code=\"IEEPILLA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"YEEPILLA\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"PEEPILLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"POEPILLE\" description=\"Start with 25 lives\" />\n      <gamegenie code=\"ZUEPILLA\" description=\"Start with 50 lives\" />\n      <gamegenie code=\"LKEPILLE\" description=\"Start with 75 lives\" />\n      <gamegenie code=\"LVEPILLA\" description=\"Start with 99 lives\" />\n      <gamegenie code=\"SZEYKVVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AENYVGGE\" description=\"Every 4 cookies count as 8\" />\n      <gamegenie code=\"GENYVGGE\" description=\"Every 4 cookies count as 12\" />\n      <gamegenie code=\"AONYVGGA\" description=\"Every 4 cookies count as 16\" />\n      <gamegenie code=\"GONYVGGA\" description=\"Every 4 cookies count as 20 (extra life point)\" />\n      <gamegenie code=\"IAOVUGTA\" description=\"Extra life with 5 pizza slices instead of 6\" />\n      <gamegenie code=\"GAOVUGTA\" description=\"Extra life with 4 pizza slices\" />\n      <gamegenie code=\"LAOVUGTA\" description=\"Extra life with 3 pizza slices\" />\n      <gamegenie code=\"ZAOVUGTA\" description=\"Extra life with 2 pizza slices\" />\n      <gamegenie code=\"PAOVUGTA\" description=\"Extra life with every pizza slice\" />\n      <gamegenie code=\"SZNYSSVK\" description=\"Infinite power units/life points\" />\n      <gamegenie code=\"SZOELKVK\" description=\"Infinite slides on pick-up\" />\n      <gamegenie code=\"SZVETKVK\" description=\"Infinite darts on pick-up\" />\n      <gamegenie code=\"SZSAAKVK\" description=\"Infinite flying fists on pick-up\" />\n    </game>\n    <game code=\"CLV-H-KINGA\" name=\"Hook\" crc=\"D8230D0E\">\n      <gamegenie code=\"AEXVNTZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEXVNTZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEXVNTZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZONIEVK\" description=\"Infinite lives - P1\" />\n      <gamegenie code=\"GZVIKIST\" description=\"Infinite health - P1\" />\n      <gamegenie code=\"GZNSNIST\" description=\"Infinite health - P2\" />\n      <gamegenie code=\"AENIOIIA\" description=\"Get max health from food - P1\" />\n      <gamegenie code=\"AAEINTIA\" description=\"Get max health from food - P2\" />\n      <gamegenie code=\"AVVIXSGZ\" description=\"No health from food\" />\n    </game>\n    <game code=\"CLV-H-BLNKO\" name=\"Hudson Hawk\" crc=\"5A4F156D\">\n      <gamegenie code=\"PEVGTTIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"LEVGTTIA\" description=\"Start with 3 lives\" />\n      <gamegenie code=\"PEVGTTIE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXETGYSA\" description=\"Infinite health\" />\n      <gamegenie code=\"PEVKZVNY\" description=\"Start with very little health - first life only\" />\n      <gamegenie code=\"AKVKZVNY\" description=\"Start with 1/4 health - first life only\" />\n      <gamegenie code=\"ANVKZVNY\" description=\"Start with 1/2 health - first life only\" />\n      <gamegenie code=\"EUVKZVNY\" description=\"Start with 3/4 health - first life only\" />\n      <gamegenie code=\"PESKPTLA\" description=\"Start with 1 continue\" />\n      <gamegenie code=\"IESKPTLA\" description=\"Start with 5 continues\" />\n      <gamegenie code=\"PESKPTLE\" description=\"Start with 9 continues\" />\n      <gamegenie code=\"OZKKEAAU\" description=\"Infinite continues (1 of 2)\" />\n      <gamegenie code=\"OZKGVAVK\" description=\"Infinite continues (2 of 2)\" />\n      <gamegenie code=\"OZSKYYUK\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"OZVGZYEN\" description=\"Infinite lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SLKOA\" name=\"Adventure Island\" crc=\"F8A713BE\">\n      <gamegenie code=\"ATSKZAKZ\" description=\"Invincibility\" />\n      <gamegenie code=\"SXKKIAVG\" description=\"Infinite health\" />\n      <gamegenie code=\"GXNGLAKA\" description=\"Immune to rocks\" />\n      <gamegenie code=\"GZXEAPSA\" description=\"Keep weapons\" />\n      <gamegenie code=\"EIUEOLEL\" description=\"Get fruits from anywhere\" />\n      <gamegenie code=\"AAKGTOKI\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"AAKKYPYA\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"OLSGZOOO\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"SPEEIIEG\" description=\"Can mega-jump while at rest\" />\n      <gamegenie code=\"SPEETSOZ\" description=\"Can mega-jump while running\" />\n      <gamegenie code=\"AAEAYIPA\" description=\"Multi-mega-maxi-moon jumps (1 of 2)\" />\n      <gamegenie code=\"AEVEZGPZ\" description=\"Multi-mega-maxi-moon jumps (2 of 2)\" />\n      <gamegenie code=\"AEKAPIPA\" description=\"Hudson can moonwalk (1 of 2)\" />\n      <gamegenie code=\"PEEEZIAA\" description=\"Hudson can moonwalk (2 of 2)\" />\n      <gamegenie code=\"GXVAGGEI\" description=\"Multi-jump (1 of 2)\" />\n      <gamegenie code=\"GXVEPGEI\" description=\"Multi-jump (2 of 2)\" />\n      <gamegenie code=\"ALSAIIEI\" description=\"Skateboard doesn't automatically move forward\" />\n      <gamegenie code=\"ATKAEUVI\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"PEEEPALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEEEPALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEEEPALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZOEGPVG\" description=\"Start with infinite lives\" />\n    </game>\n    <game code=\"CLV-H-UZAEH\" name=\"Hunt for Red October, The\" crc=\"4E77733A\">\n      <gamegenie code=\"SXEZXZVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXEUPUVK\" description=\"Infinite time\" />\n      <gamegenie code=\"SXUXYSVK\" description=\"Infinite horizontal torpedoes\" />\n      <gamegenie code=\"SZUZPVVK\" description=\"Infinite vertical torpedoes\" />\n      <gamegenie code=\"AAEUVGPA\" description=\"Maximum power horizontal torpedoes on pick-up (1 of 2)\" />\n      <gamegenie code=\"OZEUEKOK\" description=\"Maximum power horizontal torpedoes on pick-up (2 of 2)\" />\n      <gamegenie code=\"AASUSGPA\" description=\"Maximum power vertical torpedoes on pick-up (1 of 2)\" />\n      <gamegenie code=\"OZSLNKOK\" description=\"Maximum power vertical torpedoes on pick-up (2 of 2)\" />\n      <gamegenie code=\"ZANLVKPO\" description=\"Start with 10 horizontal torpedoes\" />\n      <gamegenie code=\"ZLNLVKPP\" description=\"Start with 50 horizontal torpedoes\" />\n      <gamegenie code=\"LTNLVKPP\" description=\"Start with 99 horizontal torpedoes\" />\n      <gamegenie code=\"IANUUKYA\" description=\"Start with 5 vertical torpedoes\" />\n      <gamegenie code=\"ZLNUUKYA\" description=\"Start with 50 vertical torpedoes\" />\n      <gamegenie code=\"LTNUUKYA\" description=\"Start with 99 vertical torpedoes\" />\n      <gamegenie code=\"IEELSKZA\" description=\"Start with 5 caterpillars\" />\n      <gamegenie code=\"ZUELSKZA\" description=\"Start with 50 caterpillars\" />\n      <gamegenie code=\"LVELSKZA\" description=\"Start with 99 caterpillars\" />\n      <gamegenie code=\"IEEUXKZA\" description=\"Start with 5 ECM's\" />\n      <gamegenie code=\"ZUEUXKZA\" description=\"Start with 50 ECM's\" />\n      <gamegenie code=\"LVEUXKZA\" description=\"Start with 99 ECM's\" />\n      <gamegenie code=\"PEVLYAIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZEVLYAIE\" description=\"Start with 10 lives\" />\n    </game>\n    <game code=\"CLV-H-PPUDR\" name=\"Hydlide\" crc=\"77BF8B23\">\n      <gamegenie code=\"AZKAAVZE\" description=\"Boost strength, life, magic\" />\n      <gamegenie code=\"GTKAAVZA\" description=\"Super boost strength, life, magic\" />\n      <gamegenie code=\"SXSGYYSA\" description=\"Don't take damage from most enemies\" />\n      <gamegenie code=\"AEUEKVIA\" description=\"Rapid healing\" />\n      <gamegenie code=\"AANOVZZA\" description=\"Rapid magic healing\" />\n    </game>\n    <game code=\"CLV-H-QPMEU\" name=\"Ikari Warriors\" crc=\"2D273AA4\">\n      <gamegenie code=\"SXVYAUGK\" description=\"Invincibility\" />\n      <gamegenie code=\"KAXTLAEA\" description=\"Invincibility (blinking)\" />\n      <gamegenie code=\"ESVLZYEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SXSNZTVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXXNVUVS\" description=\"Infinite Missiles for Tank\" />\n      <gamegenie code=\"SZONZSVS\" description=\"Infinite Bullets\" />\n      <gamegenie code=\"SXEYZSVS\" description=\"Infinite Grenades\" />\n      <gamegenie code=\"AAKLAYLY\" description=\"Enemies die automatically (1 of 4)\" />\n      <gamegenie code=\"AAOPYOGP\" description=\"Enemies die automatically (2 of 4)\" />\n      <gamegenie code=\"ASUUSPEL\" description=\"Enemies die automatically (3 of 4)\" />\n      <gamegenie code=\"GXOEATEP\" description=\"Enemies die automatically (4 of 4)\" />\n      <gamegenie code=\"AEXUOPPA\" description=\"Hit anywhere (except tanks and helicopters) (1 of 3)\" />\n      <gamegenie code=\"LUXUUPLO\" description=\"Hit anywhere (except tanks and helicopters) (2 of 3)\" />\n      <gamegenie code=\"OKXUEOPX\" description=\"Hit anywhere (except tanks and helicopters) (3 of 3)\" />\n      <gamegenie code=\"AAXTELZA\" description=\"Shoot and walk through walls\" />\n      <gamegenie code=\"PAUYPTLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAUYPTLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAUYPTLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"ZUNNLZLT\" description=\"Start with 50 Bullets\" />\n      <gamegenie code=\"LTEYALZL\" description=\"Start with 99 Grenades\" />\n      <gamegenie code=\"PPEYALZU\" description=\"Start with 25 Grenades\" />\n    </game>\n    <game code=\"CLV-H-KMPCU\" name=\"Ikari Warriors II: Victory Road\" crc=\"4F467410\">\n      <gamegenie code=\"OUOUIUOO\" description=\"Infinite health\" />\n      <gamegenie code=\"GXOLYLST\" description=\"Don't take damage from most enemies\" />\n      <gamegenie code=\"AUNYIYAT\" description=\"Start with half normal health\" />\n      <gamegenie code=\"OZUXVEPV\" description=\"Maximum weapon power on pick-up (1 of 2)\" />\n      <gamegenie code=\"GAUXNAPA\" description=\"Maximum weapon power on pick-up (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SDPGF\" name=\"Ikari Warriors III: The Rescue\" crc=\"567E1620\">\n      <gamegenie code=\"SZKLUZAX\" description=\"Invincibility\" />\n      <gamegenie code=\"SLSUNESO\" description=\"Infinite energy\" />\n      <gamegenie code=\"PEOKUALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEOKUALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEOKUALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PEXKZLLA\" description=\"1 life after continue\" />\n      <gamegenie code=\"TEXKZLLA\" description=\"6 lives after continue\" />\n      <gamegenie code=\"PEXKZLLE\" description=\"9 lives after continue\" />\n      <gamegenie code=\"AEUGNYPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"SUUKKNSO\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"YESKVGPA\" description=\"3-way firing, instead of punching\" />\n      <gamegenie code=\"PESKVGPE\" description=\"Always throw grenades instead of punches\" />\n      <gamegenie code=\"GZSUOAST\" description=\"Immune to most kicks and punches\" />\n    </game>\n    <game code=\"CLV-H-OPCMK\" name=\"Image Fight\" crc=\"058F23A2\">\n      <gamegenie code=\"ENKXYGEI\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ENOPLPEI\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXSZTPVG\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"PAVXLPLA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"TAVXLPLA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"PAVXLPLE\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"PAVZLPAA\" description=\"Start at Combat Simulation Stage 2\" />\n      <gamegenie code=\"ZAVZLPAA\" description=\"Start at Combat Simulation Stage 3\" />\n      <gamegenie code=\"LAVZLPAA\" description=\"Start at Combat Simulation Stage 4\" />\n      <gamegenie code=\"GAVZLPAA\" description=\"Start at Combat Simulation Stage 5\" />\n      <gamegenie code=\"IAVZLPAA\" description=\"Start at Real Combat - 1st Target\" />\n      <gamegenie code=\"TAVZLPAA\" description=\"Start at Real Combat - 2nd Target\" />\n      <gamegenie code=\"ATSLTKOZ\" description=\"Never lose Pods\" />\n      <gamegenie code=\"PAELGGAA\" description=\"Start with V Cannon\" />\n      <gamegenie code=\"ZAELGGAA\" description=\"Start with Reflecting Ball\" />\n      <gamegenie code=\"LAELGGAA\" description=\"Start with Drilling Laser\" />\n      <gamegenie code=\"GAELGGAA\" description=\"Start with Seeking Missile\" />\n      <gamegenie code=\"IAELGGAA\" description=\"Start with Seeking Laser\" />\n    </game>\n    <game code=\"CLV-H-CRBTA\" name=\"Immortal, Will Harvey Presents The\" crc=\"8889C564\">\n      <gamegenie code=\"GZOLIXVK\" description=\"Enemy's fatigue level doesn't go down\" />\n      <gamegenie code=\"GZOUIXVK\" description=\"Your fatigue level doesn't go down\" />\n      <gamegenie code=\"YLEUIXYN\" description=\"Your fatigue level goes down faster\" />\n      <gamegenie code=\"NYEUIXYN\" description=\"Your fatigue level goes down slower\" />\n      <gamegenie code=\"SZSLTXVK\" description=\"Don't lose energy from fighting\" />\n      <gamegenie code=\"SZNLPXVV\" description=\"Your fatigue level never rises\" />\n      <gamegenie code=\"ZAKSIYPA\" description=\"More damage from fireballs\" />\n    </game>\n    <game code=\"CLV-H-JKPCK\" name=\"Incredible Crash Dummies, The\" crc=\"A80A0F01\">\n      <gamegenie code=\"EIUXYYEY\" description=\"Invincibility\" />\n      <gamegenie code=\"KZVGGNKE\" description=\"Infinite health\" />\n      <gamegenie code=\"KZNKANKE\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-KSKUA\" name=\"Indiana Jones and The Last Crusade\" crc=\"8BCA5146\">\n      <gamegenie code=\"SAOOLOIE\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-NUWUY\" name=\"Indiana Jones and the Temple of Doom\" crc=\"A0C31A57\">\n      <gamegenie code=\"SZEXOKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZXZAEVK\" description=\"Infinite time\" />\n      <gamegenie code=\"AEKLULGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PEKLULGE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"TEKLULGE\" description=\"Start with 15 lives\" />\n      <gamegenie code=\"SZSZGUVK\" description=\"Always keep Sword\" />\n      <gamegenie code=\"SZUXZVVK\" description=\"Always keep Gun\" />\n      <gamegenie code=\"PPKLEKYA\" description=\"Start on level 2\" />\n      <gamegenie code=\"IPKLEKYA\" description=\"Start on level 4\" />\n      <gamegenie code=\"PPKLEKYE\" description=\"Start on level 6\" />\n      <gamegenie code=\"IPKLEKYE\" description=\"Start on level 8\" />\n      <gamegenie code=\"GLKUXGLV\" description=\"Start with less time (1 of 3)\" />\n      <gamegenie code=\"LVEXUUGL\" description=\"Start with less time (2 of 3)\" />\n      <gamegenie code=\"LTOXVKGL\" description=\"Start with less time (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-VZXDM\" name=\"Infiltrator\" crc=\"DF64963B\">\n      <gamegenie code=\"ZPSLPXZA\" description=\"Start with more Grenades\" />\n      <gamegenie code=\"IASLPXZA\" description=\"Start with fewer Grenades\" />\n      <gamegenie code=\"AASLPXZA\" description=\"Start with no Grenades\" />\n      <gamegenie code=\"LPKUIZTZ\" description=\"Start with less Spray\" />\n      <gamegenie code=\"AAKUIZTZ\" description=\"Start with no Spray\" />\n      <gamegenie code=\"SXKXXIVG\" description=\"Never lose Grenades outside buildings\" />\n      <gamegenie code=\"SZVKAIVG\" description=\"Never lose Grenades inside buildings\" />\n      <gamegenie code=\"SXUXKIVG\" description=\"Never lose Spray outside buildings\" />\n      <gamegenie code=\"SZUKYIVG\" description=\"Never lose Spray inside buildings\" />\n      <gamegenie code=\"SZKLIKVK\" description=\"Infinite time\" />\n      <gamegenie code=\"ILOULXPL\" description=\"Start with less time\" />\n    </game>\n    <game code=\"CLV-H-ECVPC\" name=\"Iron Tank: The Invasion of Normandy\" crc=\"B14EA4D2\">\n      <gamegenie code=\"SLUVKESO\" description=\"Infinite energy\" />\n      <gamegenie code=\"OIOGIIPA\" description=\"Start with X lives (1 of 2)\" />\n      <gamegenie code=\"SXUKTKVK\" description=\"Infinite lives (2 of 2)\" />\n      <gamegenie code=\"AAUKGGZA\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"IAUKGGZA\" description=\"Start with 6 lives (2 of 2)\" />\n      <gamegenie code=\"AAUKGGZE\" description=\"Start with 9 lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-UMCZU\" name=\"Isolated Warrior\" crc=\"6944A01A\">\n      <gamegenie code=\"OXOPKZAU\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"SEOPVZSZ\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"UVKTAYXZ\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"XTVSGGTX\" description=\"Infinite health\" />\n      <gamegenie code=\"PAXTIZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAXTIZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAXTIZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZUVPAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZXOXSVK\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"AASVTXPA\" description=\"Start with maximum health and Bombs\" />\n      <gamegenie code=\"TEOAAYZA\" description=\"More health restored on pick-up\" />\n      <gamegenie code=\"PEOAAYZA\" description=\"Less health restored on pick-up\" />\n      <gamegenie code=\"VANEYESE\" description=\"Start on Scene X (1 of 3)\" />\n      <gamegenie code=\"VEEAZESE\" description=\"Start on Scene X (2 of 3)\" />\n      <gamegenie code=\"PANEGAAA\" description=\"Start on Scene 2 (3 of 3)\" />\n      <gamegenie code=\"ZANEGAAA\" description=\"Start on Scene 3 (3 of 3)\" />\n      <gamegenie code=\"LANEGAAA\" description=\"Start on Scene 4 (3 of 3)\" />\n      <gamegenie code=\"GANEGAAA\" description=\"Start on Scene 5 (3 of 3)\" />\n      <gamegenie code=\"IANEGAAA\" description=\"Start on Scene 6 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-VTQGE\" name=\"Super Off Road, Ivan &quot;Ironman&quot; Stewart's\" crc=\"4B041B6B\">\n      <gamegenie code=\"AEKISPPA\" description=\"Infinite nitro boosts\" />\n      <gamegenie code=\"TEKTYGAA\" description=\"Lots of money and full equipment\" />\n      <gamegenie code=\"AAUEIEPP\" description=\"Computer starts with no nitro boosts\" />\n      <gamegenie code=\"ZLUEIEPP\" description=\"Computer starts with double nitro boosts\" />\n      <gamegenie code=\"ZLEVZSPP\" description=\"Start with double nitro boosts\" />\n      <gamegenie code=\"EINSUZEP\" description=\"Drive through walls (1 of 3)\" />\n      <gamegenie code=\"EIVINGEP\" description=\"Drive through walls (2 of 3)\" />\n      <gamegenie code=\"ESSISZEP\" description=\"Drive through walls (3 of 3)\" />\n      <gamegenie code=\"PENTYGLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"GGUTGGOU\" description=\"Infinite money (1 of 3)\" />\n      <gamegenie code=\"GGUTIGAV\" description=\"Infinite money (2 of 3)\" />\n      <gamegenie code=\"KTUTTKAL\" description=\"Infinite money (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-NXMCB\" name=\"Jackal\" crc=\"1D5B03A5\">\n      <gamegenie code=\"ASUVZIEI\" description=\"Invincibility - both players\" />\n      <gamegenie code=\"SZPTSI\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"PAPKXZ\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"PAPKXX\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"GXZTSG\" description=\"Keep weapons after death\" />\n      <gamegenie code=\"LEZTKG\" description=\"Full weapons after death\" />\n    </game>\n    <game code=\"CLV-H-QCNKW\" name=\"Jackie Chan's Action Kung Fu\" crc=\"45A41784\">\n      <gamegenie code=\"ESSINLEY\" description=\"Invincibility\" />\n      <gamegenie code=\"VXEGXXSE\" description=\"Infinite health\" />\n      <gamegenie code=\"PTYSEK\" description=\"Take less damage\" />\n      <gamegenie code=\"GKKEAZSK\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"OVKEPXPA\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"XEKEZZEP\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"AEOTTIGA\" description=\"Multi-jump\" />\n      <gamegenie code=\"PESIKYYE\" description=\"9 Tornado Attacks on pick-up\" />\n      <gamegenie code=\"PESIVYYE\" description=\"9 360o Spin Kicks on pick-up\" />\n      <gamegenie code=\"PESINYYE\" description=\"9 Sky Attacks on pick-up\" />\n      <gamegenie code=\"AESIKYYA\" description=\"0 Tornado Attacks on pick-up\" />\n      <gamegenie code=\"AESISNPA\" description=\"0 180o Spin Kicks on pick-up\" />\n      <gamegenie code=\"AESIVYYA\" description=\"0 360o Spin Kicks on pick-up\" />\n      <gamegenie code=\"AESINYYA\" description=\"0 Sky Attacks on pick-up\" />\n      <gamegenie code=\"SXSKEXVK\" description=\"Infinite special attacks\" />\n      <gamegenie code=\"TAVGXZZA\" description=\"Max health from Energy Bowl\" />\n      <gamegenie code=\"PAVGXZZA\" description=\"Less health from Energy Bowl\" />\n    </game>\n    <game code=\"CLV-H-ZAKXS\" name=\"James Bond Jr.\" crc=\"F6898A59\">\n      <gamegenie code=\"EINLYPEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"EYNUYPEI\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SZNYASSO\" description=\"Infinite health\" />\n      <gamegenie code=\"PANTTATA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"TANTTATE\" description=\"Start with 15 lives\" />\n      <gamegenie code=\"SXEKSOVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"XVOTAEXE\" description=\"Start with some weapons\" />\n      <gamegenie code=\"AANNSLPA\" description=\"Infinite weapons (Bombs, Flares, Nukes, Bullets)\" />\n      <gamegenie code=\"YUSOENYO\" description=\"Slow down rate of air loss (scuba mode)\" />\n      <gamegenie code=\"YESOENYO\" description=\"Speed up rate of air loss\" />\n      <gamegenie code=\"GZUYZIST\" description=\"Shield doesn't take damage from bullets\" />\n      <gamegenie code=\"GZVYPIST\" description=\"Immune to most damage\" />\n    </game>\n    <game code=\"CLV-H-MQECN\" name=\"Jaws\" crc=\"27D14A54\">\n      <gamegenie code=\"SZSATSVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZVEYNSE\" description=\"Infinite shells\" />\n      <gamegenie code=\"SZSELSTK\" description=\"Don't lose shells on dying\" />\n      <gamegenie code=\"SZSETSVK\" description=\"Don't lose power on dying\" />\n      <gamegenie code=\"AEKEPIGP\" description=\"Jaws has no health (1 of 3)\" />\n      <gamegenie code=\"AESEGZGP\" description=\"Jaws has no health (2 of 3)\" />\n      <gamegenie code=\"SZKEISSE\" description=\"Jaws has no health (3 of 3)\" />\n      <gamegenie code=\"AEEZITIA\" description=\"99 Shells on pick-up\" />\n      <gamegenie code=\"AAOOEPIP\" description=\"Hit anywhere\" />\n      <gamegenie code=\"AANZPTTZ\" description=\"Collect shells from anywhere\" />\n      <gamegenie code=\"AEVZTVZZ\" description=\"Collect Stars from anywhere\" />\n      <gamegenie code=\"AENXLSTP\" description=\"Collect Crabs from anywhere\" />\n      <gamegenie code=\"ASXILLEP\" description=\"Hit anywhere - bonus stages (1 of 3)\" />\n      <gamegenie code=\"GXKITLEL\" description=\"Hit anywhere - bonus stages (2 of 3)\" />\n      <gamegenie code=\"GXKIZLEI\" description=\"Hit anywhere - bonus stages (3 of 3)\" />\n      <gamegenie code=\"PEOAGZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEOAGZLA\" description=\"Start with double lives\" />\n    </game>\n    <game code=\"CLV-H-LQLSB\" name=\"Jetsons, The: Cogswell's Caper\" crc=\"2BF61C53\">\n      <gamegenie code=\"SZSLXVVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"IEEPPILA\" description=\"Better start (more lives and hearts)\" />\n      <gamegenie code=\"GXVLEVVK\" description=\"Don't lose extra hearts on dying\" />\n      <gamegenie code=\"ZEVEZLPA\" description=\"2 power packs on pick-up\" />\n      <gamegenie code=\"IEVEZLPA\" description=\"5 power packs on pick-up\" />\n      <gamegenie code=\"AUEOGIAP\" description=\"Start with 30 powerpacks\" />\n      <gamegenie code=\"ASEOGIAP\" description=\"Start with 50 powerpacks\" />\n      <gamegenie code=\"AAKAIGTA\" description=\"Small hearts gives full health\" />\n      <gamegenie code=\"SZEELUVK\" description=\"Infinite hearts\" />\n      <gamegenie code=\"GXUENESE\" description=\"Defenses don't use up powerpacks\" />\n      <gamegenie code=\"IAUAKAAZ\" description=\"Shield uses fewer powerpacks\" />\n      <gamegenie code=\"ZENEIYAP\" description=\"Flashlight uses fewer powerpacks\" />\n    </game>\n    <game code=\"CLV-H-GALYO\" name=\"Jimmy Connors Tennis\" crc=\"00E95D86\">\n      <gamegenie code=\"AEVTIPLA\" description=\"Only need 15 points to win game\" />\n      <gamegenie code=\"PEVTIPLA\" description=\"Only need 30 points to win game\" />\n      <gamegenie code=\"ZEVTIPLA\" description=\"Only need 40 points to win game\" />\n      <gamegenie code=\"AEEVAZTA\" description=\"Only need 1 game to win set instead of 6\" />\n      <gamegenie code=\"PEEVAZTA\" description=\"Only need 2 games to win set\" />\n      <gamegenie code=\"ZEEVAZTA\" description=\"Only need 3 games to win set\" />\n      <gamegenie code=\"GEEVAZTA\" description=\"Only need 4 games to win set\" />\n      <gamegenie code=\"IEEVAZTA\" description=\"Only need 5 games to win set\" />\n      <gamegenie code=\"EEVVIPEI\" description=\"Must get 2 points after 40 to win and no deuces (always shows advantage after 40)\" />\n      <gamegenie code=\"PEKVGPZA\" description=\"Don't need to win by 2 to win tiebreaker\" />\n      <gamegenie code=\"ZEUVIPYA\" description=\"2 points needed to win tiebreaker instead of 7\" />\n      <gamegenie code=\"LEUVIPYA\" description=\"3 points needed to win tiebreaker\" />\n      <gamegenie code=\"GEUVIPYA\" description=\"4 points needed to win tiebreaker\" />\n      <gamegenie code=\"IEUVIPYA\" description=\"5 points needed to win tiebreaker\" />\n      <gamegenie code=\"TEUVIPYA\" description=\"6 points needed to win tiebreaker\" />\n      <gamegenie code=\"ZEUVIPYE\" description=\"10 points needed to win tiebreaker\" />\n    </game>\n    <game code=\"CLV-H-UXIOX\" name=\"Joe &amp; Mac\" crc=\"26D3082C\">\n      <gamegenie code=\"ESXIZTEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ENXSGTEI\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SZKVOKVK\" description=\"Infinite health\" />\n      <gamegenie code=\"PEUXYALA\" description=\"Start with 1 life instead of 3 - P1\" />\n      <gamegenie code=\"IEUXYALA\" description=\"Start with 5 lives - P1\" />\n      <gamegenie code=\"YEUXYALA\" description=\"Start with 7 lives - P1\" />\n      <gamegenie code=\"PEUXYALE\" description=\"Start with 9 lives - P1\" />\n      <gamegenie code=\"SZNXTEVK\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"SZKVOKVK\" description=\"Protection from most enemy hits\" />\n      <gamegenie code=\"SXUVYVVK\" description=\"Protection from water\" />\n      <gamegenie code=\"AEXZGLAO\" description=\"Start with 1/2 health (die when bar is 1/2 empty)\" />\n      <gamegenie code=\"AAKUEAPE\" description=\"Stone axe and flint do more damage to bosses\" />\n      <gamegenie code=\"YAKUEAPE\" description=\"Stone axe and flint do a lot more damage to bosses\" />\n      <gamegenie code=\"AASLOAZE\" description=\"Stone wheel and boomerang do more damage to bosses\" />\n      <gamegenie code=\"APSLOAZA\" description=\"Stone wheel and boomerang do a lot more damage to bosses\" />\n      <gamegenie code=\"APSLVAGA\" description=\"Fire does more damage to bosses\" />\n      <gamegenie code=\"AZSLVAGA\" description=\"Fire does a lot more damage to bosses\" />\n      <gamegenie code=\"SZVTKUSE\" description=\"Apple and hamburger worth nothing\" />\n      <gamegenie code=\"AAVTULAO\" description=\"Apple and hamburger restore health to 1/2\" />\n      <gamegenie code=\"OVUXZAET\" description=\"Start with stone wheel instead of stone axe - P1\" />\n      <gamegenie code=\"XVUXZAET\" description=\"Start with flint instead of stone axe - P1\" />\n      <gamegenie code=\"UVUXZAET\" description=\"Start with fire instead of stone axe - P1\" />\n      <gamegenie code=\"KVUXZAET\" description=\"Start with boomerang instead of stone axe - P1\" />\n      <gamegenie code=\"ZEKZGAAA\" description=\"Start somewhere in level 2\" />\n    </game>\n    <game code=\"CLV-H-UONPO\" name=\"Journey to Silius\" crc=\"E2C4EDCE\">\n      <gamegenie code=\"OZSXEIEU\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"OZVTPYEU\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"SXETZNSO\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"SZNZESSO\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"AEEEIPGA\" description=\"Multi-jump (1 of 2)\" />\n      <gamegenie code=\"KXKEPOKK\" description=\"Multi-jump (1 of 2)\" />\n      <gamegenie code=\"SZXTSAAX\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SXUTKAAX\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SZOAPAVG\" description=\"Invincibility after first hit (blinking)\" />\n      <gamegenie code=\"SZUVUZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SZUAUTSA\" description=\"Infinite weapon power\" />\n      <gamegenie code=\"YOKSOGZE\" description=\"Start with all six weapons\" />\n      <gamegenie code=\"SXNGYLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAOSOTLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAOSOTLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAOSOTLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PEVIULLA\" description=\"1 life after continue\" />\n      <gamegenie code=\"TEVIULLA\" description=\"6 lives after continue\" />\n      <gamegenie code=\"PEVIULLE\" description=\"9 lives after continue\" />\n      <gamegenie code=\"PEKSOGZA\" description=\"Start with Machine Gun\" />\n      <gamegenie code=\"GEKSOGZA\" description=\"Start with Laser Gun\" />\n      <gamegenie code=\"AEKSOGZE\" description=\"Start with Homing Missiles\" />\n      <gamegenie code=\"AOKSOGZA\" description=\"Start with Grenade Launcher\" />\n      <gamegenie code=\"IEKSOGZA\" description=\"Start with Machine Gun and Laser Gun\" />\n      <gamegenie code=\"OTUVOZSV\" description=\"Protection against most aliens\" />\n      <gamegenie code=\"AAXTKAZE\" description=\"Some aliens are tougher\" />\n      <gamegenie code=\"PAXTKAZA\" description=\"Some aliens are weaker\" />\n      <gamegenie code=\"TOOETOLA\" description=\"Mega-jump\" />\n      <gamegenie code=\"AZVALPPA\" description=\"Speed jump (1 of 2)\" />\n      <gamegenie code=\"EVNEYENY\" description=\"Speed jump (2 of 2)\" />\n      <gamegenie code=\"KVNELEKN\" description=\"Super speed (1 of 2)\" />\n      <gamegenie code=\"LPSEYPGA\" description=\"Super speed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GHGWB\" name=\"Joust\" crc=\"BE387AF0\">\n      <gamegenie code=\"SXXKKZVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEOGLAIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZEOGLAIE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PASGKGAA\" description=\"Turbo flying\" />\n      <gamegenie code=\"GXVKOZSP\" description=\"Heavens above?\" />\n      <gamegenie code=\"GXSKTASA\" description=\"Start on last level reached (1 of 3)\" />\n      <gamegenie code=\"GXSKGASA\" description=\"Start on last level reached (2 of 3)\" />\n      <gamegenie code=\"GXVGGASA\" description=\"Start on last level reached (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-EFAZT\" name=\"Jungle Book, Disney's The\" crc=\"61179BFA\">\n      <gamegenie code=\"GZVEOSSE\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAVEEYPA\" description=\"Infinite time\" />\n      <gamegenie code=\"PENEEIAA\" description=\"Infinite weapons\" />\n      <gamegenie code=\"SXXNLKOU\" description=\"Need XX gems to finish levels 1, 3, 4, 7, 9 (1 of 2)\" />\n      <gamegenie code=\"ZEKKULAP\" description=\"Need 2 gems to finish levels 1, 3, 4, 7, 9 (2 of 2)\" />\n      <gamegenie code=\"GEKKULAP\" description=\"Need 4 gems to finish levels 1, 3, 4, 7, 9 (2 of 2)\" />\n      <gamegenie code=\"AEKKULAO\" description=\"Need 8 gems to finish levels 1, 3, 4, 7, 9 (2 of 2)\" />\n      <gamegenie code=\"PAEGVGTA\" description=\"Start practice level with 1 life\" />\n      <gamegenie code=\"LAEGVGTA\" description=\"Start practice level with 3 lives\" />\n      <gamegenie code=\"PAEGVGTE\" description=\"Start practice level with 9 lives\" />\n      <gamegenie code=\"PAEGNGIA\" description=\"Start normal level with 1 life\" />\n      <gamegenie code=\"LAEGNGIA\" description=\"Start normal level with 3 lives\" />\n      <gamegenie code=\"PAEGNGIE\" description=\"Start normal level with 9 lives\" />\n      <gamegenie code=\"IAVYZLAA\" description=\"Start with 5 of each weapon\" />\n      <gamegenie code=\"APVYZLAA\" description=\"Start with 10 of each weapon\" />\n      <gamegenie code=\"AZVYZLAA\" description=\"Start with 20 of each weapon\" />\n      <gamegenie code=\"ALVYZLAA\" description=\"Start with 30 of each weapon\" />\n      <gamegenie code=\"EPVYZLAA\" description=\"Start with 90 of each weapon\" />\n    </game>\n    <game code=\"CLV-H-FFOQP\" name=\"Jurassic Park\" crc=\"3B7F5B3B\">\n      <gamegenie code=\"EIUZUAEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SZVGZOSE\" description=\"Infinite health\" />\n      <gamegenie code=\"GZUXXKVS\" description=\"Infinite ammo on pick-up\" />\n      <gamegenie code=\"PAVPAGZE\" description=\"More bullets picked up from small dinosaurs\" />\n      <gamegenie code=\"PAVPAGZA\" description=\"Fewer bullets picked up from small dinosaurs\" />\n      <gamegenie code=\"GZEULOVK\" description=\"Infinite lives (first two levels only)\" />\n      <gamegenie code=\"ATVGZOSA\" description=\"Immune to most attacks\" />\n      <gamegenie code=\"VEXASASA\" description=\"3-ball bolas picked up (from small dinosaurs, instead of normal bullets) (1 of 2)\" />\n      <gamegenie code=\"VEUAXASA\" description=\"3-ball bolas picked up (from small dinosaurs, instead of normal bullets) (2 of 2)\" />\n      <gamegenie code=\"NEXASASA\" description=\"Explosive multi-shots (from small dinosaurs, instead of normal bullets) (1 of 2)\" />\n      <gamegenie code=\"NEUAXASA\" description=\"Explosive multi-shots (from small dinosaurs, instead of normal bullets) (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-AKBHR\" name=\"Kabuki: Quantum Fighter\" crc=\"7474AC92\">\n      <gamegenie code=\"AVUUZPSZ\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ESUZGAEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"VZNGNNSE\" description=\"Infinite health\" />\n      <gamegenie code=\"AAVGKYPA\" description=\"Don't lose a life from health loss\" />\n      <gamegenie code=\"AASSAAPA\" description=\"Don't lose a life from timer\" />\n      <gamegenie code=\"AENLSLZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IENLSLZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AENLSLZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZVGSNSE\" description=\"Infinite lives\" />\n      <gamegenie code=\"PENUXLZA\" description=\"1 continue\" />\n      <gamegenie code=\"IENUXLZA\" description=\"6 continues\" />\n      <gamegenie code=\"AENUXLZE\" description=\"9 continues\" />\n      <gamegenie code=\"SXEUAESU\" description=\"Infinite chip power\" />\n      <gamegenie code=\"NYXIZEYU\" description=\"Slower timer\" />\n      <gamegenie code=\"YZXIZEYU\" description=\"Faster timer\" />\n      <gamegenie code=\"SXEUAESU\" description=\"Special weapons use minimum chip power (1 of 2)\" />\n      <gamegenie code=\"AOEUPEYA\" description=\"Special weapons use minimum chip power (2 of 2)\" />\n      <gamegenie code=\"YENUNUZE\" description=\"Start with maximum health (1 of 2)\" />\n      <gamegenie code=\"YEXLLUZE\" description=\"Start with maximum health (2 of 2)\" />\n      <gamegenie code=\"IENUNUZA\" description=\"Start with less health (1 of 2)\" />\n      <gamegenie code=\"IEXLLUZA\" description=\"Start with less health (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FNKQR\" name=\"Karate Kid, The\" crc=\"983948A5\">\n      <gamegenie code=\"SZSUYZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SZOEKAVG\" description=\"Infinite chances (lives)\" />\n      <gamegenie code=\"AEOASANI\" description=\"Win tournaments automatically\" />\n      <gamegenie code=\"PENEZTLA\" description=\"Start with 1 chance\" />\n      <gamegenie code=\"TENEZTLA\" description=\"Start with 6 chances\" />\n      <gamegenie code=\"PENEZTLE\" description=\"Start with 9 chances\" />\n      <gamegenie code=\"SXEXLYVG\" description=\"Infinite Crane Kicks\" />\n      <gamegenie code=\"SZNXAYVG\" description=\"Infinite Drum Punches on pick-up\" />\n      <gamegenie code=\"ASVOKAEL\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"GXVOSALA\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AAKVUGGE\" description=\"Start with 8 Crane Kicks - 1P game\" />\n      <gamegenie code=\"AAKVKGGE\" description=\"Start with 8 Crane Kicks - 2P game\" />\n      <gamegenie code=\"IAKVSGAA\" description=\"Start with 5 Crane Kicks - P1, one on one game\" />\n      <gamegenie code=\"AAUXOGPA\" description=\"Prevent girl from moving in final stage\" />\n      <gamegenie code=\"ZAKVVGPA\" description=\"Start on stage 2 - 1P game\" />\n      <gamegenie code=\"ZAKVNGPA\" description=\"Start on stage 2 - 2P game\" />\n      <gamegenie code=\"LAKVVGPA\" description=\"Start on stage 3 - 1P game\" />\n      <gamegenie code=\"LAKVNGPA\" description=\"Start on stage 3 - 2P game\" />\n      <gamegenie code=\"GAKVVGPA\" description=\"Start on stage 4 - 1P game\" />\n      <gamegenie code=\"GAKVNGPA\" description=\"Start on stage 4 - 2P game\" />\n    </game>\n    <game code=\"CLV-H-SHBUA\" name=\"Karnov\" crc=\"548A2C3C\">\n      <gamegenie code=\"AESKUKPA\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"OXSGOGEU\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"SZKKNISP\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"ASENYZEI\" description=\"Invincibility after one hit (blinking)\" />\n      <gamegenie code=\"SZVKNLSA\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"SXEGXLSA\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"SZNGULSA\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"SXKISXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"ZXLNTS\" description=\"Jump higher\" />\n      <gamegenie code=\"GZVZNIVG\" description=\"Infinite time\" />\n      <gamegenie code=\"LEEGOYPA\" description=\"Gain 3 of most items\" />\n      <gamegenie code=\"NOEGOYPA\" description=\"Gain 97 of most items\" />\n      <gamegenie code=\"AEOKSYPA\" description=\"Never lose most items\" />\n      <gamegenie code=\"PAUSAAAA\" description=\"Start on stage 2\" />\n      <gamegenie code=\"ZAUSAAAA\" description=\"Start on stage 3\" />\n      <gamegenie code=\"LAUSAAAA\" description=\"Start on stage 4\" />\n      <gamegenie code=\"GAUSAAAA\" description=\"Start on stage 5\" />\n      <gamegenie code=\"IAUSAAAA\" description=\"Start on stage 6\" />\n      <gamegenie code=\"TAUSAAAA\" description=\"Start on stage 7\" />\n      <gamegenie code=\"YAUSAAAA\" description=\"Start on stage 8\" />\n      <gamegenie code=\"AAUSAAAE\" description=\"Start on stage 9\" />\n      <gamegenie code=\"AAOSIAZA\" description=\"Start with 1 life (1 of 2)\" />\n      <gamegenie code=\"AESIVTZA\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"IAOSIAZA\" description=\"Start with 6 lives (1 of 2)\" />\n      <gamegenie code=\"IESIVTZA\" description=\"Start with 6 lives (2 of 2)\" />\n      <gamegenie code=\"AAOSIAZE\" description=\"Start with 9 lives (1 of 2)\" />\n      <gamegenie code=\"AESIVTZE\" description=\"Start with 9 lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-IFOLW\" name=\"Kick Master\" crc=\"5104833E\">\n      <gamegenie code=\"APOSXTSA\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"SZOIOVSE\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"TAOSUTXI\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"SZOIOVSE\" description=\"Infinite health\" />\n      <gamegenie code=\"ESUXYPEP\" description=\"Hit anywhere\" />\n      <gamegenie code=\"AEVZYTLA\" description=\"Quick level up\" />\n      <gamegenie code=\"ITUSLLAT\" description=\"Start with more EXP and magic points\" />\n      <gamegenie code=\"PAXSGLLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAXSGLLA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"PAXSGLLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AXVYEIAG\" description=\"Start with half health\" />\n      <gamegenie code=\"EEVYEIAG\" description=\"Start with twice as much health\" />\n      <gamegenie code=\"LEVYEIAG\" description=\"Start with very little health\" />\n      <gamegenie code=\"OZVZOLEN\" description=\"Invincibility after one hit\" />\n      <gamegenie code=\"AAOSOVGL\" description=\"Don't flash at all after getting hit\" />\n      <gamegenie code=\"IAOSOVGL\" description=\"Barely flash at all after getting hit\" />\n      <gamegenie code=\"IPOSOVGL\" description=\"Don't flash as long after getting hit\" />\n      <gamegenie code=\"SUELOISP\" description=\"Infinite magic points\" />\n      <gamegenie code=\"SXULYUVK\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"OXUSZLEN\" description=\"Infinite lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-CNBFF\" name=\"Kickle Cubicle\" crc=\"CD10DCE2\">\n      <gamegenie code=\"SEEXPAOL\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SANXAPOL\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXEAATVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXNGSVVK\" description=\"Infinite time\" />\n      <gamegenie code=\"ANTKVT\" description=\"Infinite time (alt)\" />\n      <gamegenie code=\"YENKXVZA\" description=\"Faster timer\" />\n      <gamegenie code=\"YENKXVZE\" description=\"Slower timer\" />\n      <gamegenie code=\"ESSATLEY\" description=\"Win level now\" />\n      <gamegenie code=\"GZKATXSE\" description=\"Start on land X (1 of 3)\" />\n      <gamegenie code=\"GZUISOSE\" description=\"Start on land X (2 of 3)\" />\n      <gamegenie code=\"PAUIOPAA\" description=\"Start on land 2 (3 of 3)\" />\n      <gamegenie code=\"ZAUIOPAA\" description=\"Start on land 3 (3 of 3)\" />\n      <gamegenie code=\"LAUIOPAA\" description=\"Start on land 4 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-WDJDY\" name=\"Kid Klown in Night Mayor World\" crc=\"8EE7C43E\">\n      <gamegenie code=\"EYNZVYEI\" description=\"Invincibility\" />\n      <gamegenie code=\"AANAUAPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZKEOESE\" description=\"Infinite health\" />\n      <gamegenie code=\"AAEAUGLA\" description=\"Full health from hearts\" />\n      <gamegenie code=\"ZENANLIA\" description=\"Less health from hearts\" />\n      <gamegenie code=\"ZENANLIE\" description=\"More health from hearts\" />\n      <gamegenie code=\"GXEZYVVV\" description=\"Mega-jump (don't hold jump down too long or you might get stuck)\" />\n      <gamegenie code=\"GZSEIYVG\" description=\"Infinite chances in sub-game (press Start to re-enter the main game)\" />\n    </game>\n    <game code=\"CLV-H-BIIZW\" name=\"Kid Kool and the Quest for the Seven Wonder Herbs\" crc=\"AA6BB985\">\n      <gamegenie code=\"SEVILPSZ\" description=\"Invincibility\" />\n      <gamegenie code=\"SZKKXIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"VZOEOGVT\" description=\"Infinite time\" />\n      <gamegenie code=\"ELXKKESZ\" description=\"Hit anywhere - Throwing (1 of 2)\" />\n      <gamegenie code=\"TIXKSAYA\" description=\"Hit anywhere - Throwing (2 of 2)\" />\n      <gamegenie code=\"ESXPZZEY\" description=\"Multi-jump when falling (1 of 5)\" />\n      <gamegenie code=\"KOXPLZKS\" description=\"Multi-jump when falling (2 of 5)\" />\n      <gamegenie code=\"OKOOYZOX\" description=\"Multi-jump when falling (3 of 5)\" />\n      <gamegenie code=\"PEXPPXSG\" description=\"Multi-jump when falling (4 of 5)\" />\n      <gamegenie code=\"PXXPAZES\" description=\"Multi-jump when falling (5 of 5)\" />\n      <gamegenie code=\"GEXGUALU\" description=\"Press Start to complete the level (1 of 3)\" />\n      <gamegenie code=\"LEXGSALU\" description=\"Press Start to complete the level (2 of 3)\" />\n      <gamegenie code=\"OXXGXAIK\" description=\"Press Start to complete the level (3 of 3)\" />\n      <gamegenie code=\"PAVGIALA\" description=\"Start with one life\" />\n      <gamegenie code=\"TAVGIALA\" description=\"Start with double lives\" />\n      <gamegenie code=\"PAVGIALE\" description=\"Start with triple lives\" />\n      <gamegenie code=\"PASKOILA\" description=\"One life after continue\" />\n    </game>\n    <game code=\"CLV-H-SHVAE\" name=\"Kid Niki: Radical Ninja\" crc=\"A9415562\">\n      <gamegenie code=\"SZEESTSA\" description=\"Invincibility (glitchy) (1 of 2)\" />\n      <gamegenie code=\"SXVEUISA\" description=\"Invincibility (glitchy) (2 of 2)\" />\n      <gamegenie code=\"GXSOKIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"NYUEXOEV\" description=\"Higher jump\" />\n      <gamegenie code=\"PAOATZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAOATZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AESUEGPA\" description=\"Infinite time\" />\n      <gamegenie code=\"GAUELZTA\" description=\"Less time (1 of 2)\" />\n      <gamegenie code=\"GEEPOTTA\" description=\"Less time (2 of 2)\" />\n      <gamegenie code=\"AANOVZAP\" description=\"Multi-jump (01 of 16)\" />\n      <gamegenie code=\"AEEPKXZA\" description=\"Multi-jump (02 of 16)\" />\n      <gamegenie code=\"AEOOUXIZ\" description=\"Multi-jump (03 of 16)\" />\n      <gamegenie code=\"APEYXNNY\" description=\"Multi-jump (04 of 16)\" />\n      <gamegenie code=\"ATENUNNY\" description=\"Multi-jump (05 of 16)\" />\n      <gamegenie code=\"AZENENNY\" description=\"Multi-jump (06 of 16)\" />\n      <gamegenie code=\"GAEYUNNY\" description=\"Multi-jump (07 of 16)\" />\n      <gamegenie code=\"GZEYENNY\" description=\"Multi-jump (08 of 16)\" />\n      <gamegenie code=\"IZENONNN\" description=\"Multi-jump (09 of 16)\" />\n      <gamegenie code=\"KTEYSNNN\" description=\"Multi-jump (10 of 16)\" />\n      <gamegenie code=\"NNOOKXOE\" description=\"Multi-jump (11 of 16)\" />\n      <gamegenie code=\"OAENXNNN\" description=\"Multi-jump (12 of 16)\" />\n      <gamegenie code=\"OZEYKNNN\" description=\"Multi-jump (13 of 16)\" />\n      <gamegenie code=\"PPEYNNNN\" description=\"Multi-jump (14 of 16)\" />\n      <gamegenie code=\"SAEYVNNY\" description=\"Multi-jump (15 of 16)\" />\n      <gamegenie code=\"YIEYONNY\" description=\"Multi-jump (16 of 16)\" />\n      <gamegenie code=\"AOUAESXE\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"AVUAOSAG\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"ATOKTXSY\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"PEVAYPAA\" description=\"Start on round 2 (1 of 2)\" />\n      <gamegenie code=\"PEUETPAA\" description=\"Start on round 2 (2 of 2)\" />\n      <gamegenie code=\"ZEVAYPAA\" description=\"Start on round 3 (1 of 2)\" />\n      <gamegenie code=\"ZEUETPAA\" description=\"Start on round 3 (2 of 2)\" />\n      <gamegenie code=\"LEVAYPAA\" description=\"Start on round 4 (1 of 2)\" />\n      <gamegenie code=\"LEUETPAA\" description=\"Start on round 4 (2 of 2)\" />\n      <gamegenie code=\"GEVAYPAA\" description=\"Start on round 5 (1 of 2)\" />\n      <gamegenie code=\"GEUETPAA\" description=\"Start on round 5 (2 of 2)\" />\n      <gamegenie code=\"IEVAYPAA\" description=\"Start on round 6 (1 of 2)\" />\n      <gamegenie code=\"IEUETPAA\" description=\"Start on round 6 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-XDCLF\" name=\"King Neptune's Adventure (Unl) [!p]\" crc=\"6ED3BA25\">\n      <gamegenie code=\"AEUGLKEY\" description=\"Start with all treasures (removes all items from level)\" />\n      <gamegenie code=\"LVUKGGAA\" description=\"Start with 99 Bubble Bombs and Money\" />\n      <gamegenie code=\"LTUKSIAA\" description=\"Start with 99 Seahorses and Keys\" />\n      <gamegenie code=\"SZSKVVVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXUILKVK\" description=\"Infinite health (2 of 3)\" />\n      <gamegenie code=\"SZNIIVSE\" description=\"Infinite health (3 of 3)\" />\n      <gamegenie code=\"SXXSTVVK\" description=\"Infinite health (1 of 3)\" />\n      <gamegenie code=\"SXXYSPVG\" description=\"Infinite Bubble Bombs\" />\n    </game>\n    <game code=\"CLV-H-NSEPB\" name=\"King's Knight\" crc=\"01B4CA89\">\n      <gamegenie code=\"GZVXTPSA\" description=\"Infinite health\" />\n      <gamegenie code=\"AOSUAOGE\" description=\"Start with double usual health\" />\n      <gamegenie code=\"TESUAOGA\" description=\"Start with half usual health\" />\n      <gamegenie code=\"PESUTPAA\" description=\"Start with a better character\" />\n      <gamegenie code=\"ZESUTPAA\" description=\"Start with the best character normally possible\" />\n      <gamegenie code=\"IESUTPAA\" description=\"Start with a super character, better than normally Possible\" />\n      <gamegenie code=\"OTVXAPSV\" description=\"Only lose 1 HP when hit (1 of 2)\" />\n      <gamegenie code=\"PAVXPPAP\" description=\"Only lose 1 HP when hit (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-WIJEB\" name=\"Kiwi Kraze: A Bird-Brained Adventure!\" crc=\"563C2CC0\">\n      <gamegenie code=\"EIUKGIEY\" description=\"Invincibility\" />\n      <gamegenie code=\"XYKTISKN\" description=\"Super-jump\" />\n      <gamegenie code=\"SUSKLYVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZOZIAVG\" description=\"Infinite time\" />\n      <gamegenie code=\"SZKGATVG\" description=\"Infinite time underwater\" />\n      <gamegenie code=\"AANGLLZA\" description=\"Start with 1 life (and 1 continue)\" />\n      <gamegenie code=\"IANGLLZA\" description=\"Start with 6 lives (and 6 continues)\" />\n      <gamegenie code=\"AANGLLZE\" description=\"Start with 9 lives (and 9 continues)\" />\n      <gamegenie code=\"AAEGNPZA\" description=\"1 life after continue\" />\n      <gamegenie code=\"IAEGNPZA\" description=\"6 lives after continue\" />\n      <gamegenie code=\"AAEGNPZE\" description=\"9 lives after continue\" />\n      <gamegenie code=\"GZEKXPVS\" description=\"Infinite continues\" />\n      <gamegenie code=\"GZVKAUSE\" description=\"Start on level X (1 of 2)\" />\n      <gamegenie code=\"GAVGYLAA\" description=\"Start on level 2 (2 of 2)\" />\n      <gamegenie code=\"AAVGYLAE\" description=\"Start on level 3 (2 of 2)\" />\n      <gamegenie code=\"GAVGYLAE\" description=\"Start on level 4 (2 of 2)\" />\n      <gamegenie code=\"PPVGYLAA\" description=\"Start on level 5 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SEODR\" name=\"KlashBall\" crc=\"F4DFDB14\">\n      <gamegenie code=\"IAUUOOAZ\" description=\"Very little team stamina (select the middle team)\" />\n      <gamegenie code=\"AGUUOOAZ\" description=\"More team stamina (select the middle team)\" />\n      <gamegenie code=\"OPUUOOAX\" description=\"Mega team stamina (select the middle team)\" />\n      <gamegenie code=\"GAUUKPZA\" description=\"Power is doubled for the whole team (select the middle team)\" />\n      <gamegenie code=\"TAUUKPZA\" description=\"Power is tripled for the whole team (select the middle team)\" />\n      <gamegenie code=\"PAUUKPZE\" description=\"Mega power for the whole team (select the middle team)\" />\n      <gamegenie code=\"GXEZAVSO\" description=\"Never lose stamina (select the middle team)\" />\n      <gamegenie code=\"SZSEZGVT\" description=\"Computer can't score (select the middle team)\" />\n      <gamegenie code=\"GZSXTEAU\" description=\"Everyone including computer has 255 skill (select the middle team) (1 of 2)\" />\n      <gamegenie code=\"GZSXTESN\" description=\"Everyone including computer has 255 skill (select the middle team) (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-AGJNB\" name=\"Klax\" crc=\"93F3A490\">\n      <gamegenie code=\"PAVESGLA\" description=\"Start with 0 drops allowed\" />\n      <gamegenie code=\"IAVESGLA\" description=\"Start with 5 drops allowed\" />\n      <gamegenie code=\"PANENGGA\" description=\"When starting on level 6, 0 drops allowed\" />\n      <gamegenie code=\"IANENGGA\" description=\"When starting on level 6, 5 drops allowed\" />\n      <gamegenie code=\"PEOAXGIA\" description=\"When starting on level 11, 0 drops allowed\" />\n      <gamegenie code=\"LEOAXGIA\" description=\"When starting on level 11, 3 drops allowed\" />\n      <gamegenie code=\"SXXLUGVT\" description=\"Infinite drops\" />\n    </game>\n    <game code=\"CLV-H-ZMXRC\" name=\"Knight Rider\" crc=\"EBCFE7C5\">\n      <gamegenie code=\"SZXSYTSA\" description=\"Infinite shield\" />\n      <gamegenie code=\"SZEXUNVK\" description=\"Infinite missiles\" />\n      <gamegenie code=\"GXXZSVVK\" description=\"Infinite laser\" />\n      <gamegenie code=\"AEVALAZA\" description=\"Start with 1 life after continue\" />\n      <gamegenie code=\"IEVALAZA\" description=\"Start with 6 lives after continue\" />\n      <gamegenie code=\"AEVALAZE\" description=\"Start with 9 lives after continue\" />\n      <gamegenie code=\"SXXEGEVK\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"SXKEIEVK\" description=\"Infinite lives (2 of 2)\" />\n      <gamegenie code=\"AANKOAZA\" description=\"Start with 1 life (1 of 2)\" />\n      <gamegenie code=\"VTNKSESE\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"IANKOAZA\" description=\"Start with 6 lives (1 of 2)\" />\n      <gamegenie code=\"VTNKSESE\" description=\"Start with 6 lives (2 of 2)\" />\n      <gamegenie code=\"SZKZYOSU\" description=\"Start with 99 missiles (1 of 2)\" />\n      <gamegenie code=\"LYKXAOTT\" description=\"Start with 99 missiles (2 of 2)\" />\n      <gamegenie code=\"SZSZLOSU\" description=\"Start with 99 lasers (1 of 2)\" />\n      <gamegenie code=\"PYSZGPGN\" description=\"Start with 99 lasers (2 of 2)\" />\n      <gamegenie code=\"SZUZAOSU\" description=\"Start with full gasoline (1 of 2)\" />\n      <gamegenie code=\"ATUZPPTV\" description=\"Start with full gasoline (2 of 2)\" />\n      <gamegenie code=\"SZUXGOSU\" description=\"Start with full shield (1 of 2)\" />\n      <gamegenie code=\"ITUXIOZV\" description=\"Start with full shield (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-NCXCY\" name=\"Krion Conquest, The\" crc=\"03272E9B\">\n      <gamegenie code=\"AAKAAPZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAKAAPZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAKAAPZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXVLOIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEOKYTTP\" description=\"Float spell\" />\n      <gamegenie code=\"SXNIVLSA\" description=\"Infinite health\" />\n      <gamegenie code=\"PEVGOIGA\" description=\"Quicker supershot\" />\n      <gamegenie code=\"GEXYLEAA\" description=\"Less health used on fire spell (1 of 2)\" />\n      <gamegenie code=\"IEOYTEPA\" description=\"Less health used on fire spell (2 of 2)\" />\n      <gamegenie code=\"EZXEPOOZ\" description=\"Start on stage X (1 of 3)\" />\n      <gamegenie code=\"KAXEIPSA\" description=\"Start on stage X (2 of 3)\" />\n      <gamegenie code=\"PAXEZPAA\" description=\"Start on stage 2 (3 of 3)\" />\n      <gamegenie code=\"ZAXEZPAA\" description=\"Start on stage 3 (3 of 3)\" />\n      <gamegenie code=\"LAXEZPAA\" description=\"Start on stage 4 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-JMGYZ\" name=\"Krusty's Fun House\" crc=\"A0DF4B8F\">\n      <gamegenie code=\"PAKATALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAKATALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAKATALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AAUXAEZA\" description=\"Infinite health\" />\n      <gamegenie code=\"AEOXSLPA\" description=\"Pick-up Super Balls instead of Custard Pies\" />\n      <gamegenie code=\"TAKELEPA\" description=\"Start with 6 pies\" />\n      <gamegenie code=\"ZPKELEPA\" description=\"Start with 18 pies\" />\n      <gamegenie code=\"GXKZPKVK\" description=\"Infinite pies - first life only\" />\n    </game>\n    <game code=\"CLV-H-TIUSO\" name=\"Kung Fu\" crc=\"D5C64257\">\n      <gamegenie code=\"GXSLVYEI\" description=\"Invincibility against knives\" />\n      <gamegenie code=\"AUVZEGTA\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"VEVZOKSX\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"SZUAOAAX\" description=\"Infinite time\" />\n      <gamegenie code=\"SUAAXA\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"AASGYXOG\" description=\"Hit anywhere\" />\n      <gamegenie code=\"SEZEGG\" description=\"Give P2 an advantage\" />\n      <gamegenie code=\"AEVXLSPT\" description=\"Enemies easier to shrug off\" />\n      <gamegenie code=\"ZEVXPIGE\" description=\"Enemies harder to shrug off\" />\n      <gamegenie code=\"LEEXSYPA\" description=\"Normal enemies do more damage\" />\n      <gamegenie code=\"XYUXEUZK\" description=\"Knife thrower harder to beat\" />\n      <gamegenie code=\"GZVKIYSA\" description=\"Don't die when time runs out (1 of 2)\" />\n      <gamegenie code=\"ATVKYNGG\" description=\"Don't die when time runs out (2 of 2)\" />\n      <gamegenie code=\"AVOZLNGG\" description=\"Enemies die when trying to grab you (1 of 4)\" />\n      <gamegenie code=\"GXKZTIEI\" description=\"Enemies die when trying to grab you (2 of 4)\" />\n      <gamegenie code=\"KVKXPSIK\" description=\"Enemies die when trying to grab you (3 of 4)\" />\n      <gamegenie code=\"SXKXZIVZ\" description=\"Enemies die when trying to grab you (4 of 4)\" />\n      <gamegenie code=\"PEZELG\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"PEZELK\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"GZLATG\" description=\"Start at last level reached - P1\" />\n      <gamegenie code=\"GZLEPG\" description=\"Start at last level reached - P2\" />\n      <gamegenie code=\"VYNONUNN\" description=\"Walk 2X faster (1 of 2)\" />\n      <gamegenie code=\"ZANOVLPA\" description=\"Walk 2X faster (2 of 2)\" />\n      <gamegenie code=\"GANOVLPA\" description=\"Walk 4X faster (2 of 2)\" />\n      <gamegenie code=\"KYNONUNN\" description=\"Walk 4X faster (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-AWHRX\" name=\"Kung-Fu Heroes\" crc=\"AA74A4D8\">\n      <gamegenie code=\"AESLZLPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAXGYOZA\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SXNIALAX\" description=\"Hit anywhere (most enemies)\" />\n      <gamegenie code=\"AVUSPVSL\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"PASXSPIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PASXSPIE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AEVSPAPA\" description=\"Infinite Miracle Kicks\" />\n      <gamegenie code=\"GPVZXPAA\" description=\"Start with 20 Miracle Kicks\" />\n      <gamegenie code=\"PASZNPLA\" description=\"Use with warp to start with 1 life\" />\n      <gamegenie code=\"TASZNPLA\" description=\"Use with warp to start with 6 lives\" />\n      <gamegenie code=\"PASZNPLE\" description=\"Use with warp to start with 9 lives\" />\n      <gamegenie code=\"ZAXUEGIA\" description=\"2 E-balls for an extra life\" />\n      <gamegenie code=\"GAOKOGPA\" description=\"Mega-jumps left and right (1 of 2)\" />\n      <gamegenie code=\"KYXGOKNN\" description=\"Mega-jumps left and right (2 of 2)\" />\n      <gamegenie code=\"OZSZXPSX\" description=\"Start on Castle X (1 of 2)\" />\n      <gamegenie code=\"GASZUOSG\" description=\"Start on Castle 2 (2 of 2)\" />\n      <gamegenie code=\"AASZUOSK\" description=\"Start on Castle 3 (2 of 2)\" />\n      <gamegenie code=\"GASZUOSK\" description=\"Start on Castle 4 (2 of 2)\" />\n      <gamegenie code=\"APSZUOSG\" description=\"Start on Castle 5 (2 of 2)\" />\n      <gamegenie code=\"GPSZUOSG\" description=\"Start on Castle 6 (2 of 2)\" />\n      <gamegenie code=\"APSZUOSK\" description=\"Start on Castle 7 (2 of 2)\" />\n      <gamegenie code=\"GPSZUOSK\" description=\"Start on Castle 8 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-MKMTR\" name=\"Last Action Hero\" crc=\"E7DA8A04\">\n      <gamegenie code=\"SXOLSGTG\" description=\"Infinite health\" />\n      <gamegenie code=\"SXXLOGVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZEVZIVG\" description=\"Infinite continues\" />\n      <gamegenie code=\"ESXZLAEY\" description=\"One hit kills on bosses\" />\n      <gamegenie code=\"VZSAEYVT\" description=\"Red hearts worth nothing\" />\n      <gamegenie code=\"AAUVSTLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAUVSTLA\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"PAUVSTLE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"AASTAILA\" description=\"Continue with 1 life\" />\n      <gamegenie code=\"PASTAILA\" description=\"Continue with 2 lives\" />\n      <gamegenie code=\"ZASTAILA\" description=\"Continue with 3 lives\" />\n      <gamegenie code=\"AAKTOTZA\" description=\"Start with 0 continues\" />\n      <gamegenie code=\"IAKTOTZA\" description=\"Start with 5 continues\" />\n      <gamegenie code=\"PAKTOTZE\" description=\"Start with 9 continues\" />\n      <gamegenie code=\"ZENTAAAA\" description=\"Start on stage 2 - Hamlet\" />\n      <gamegenie code=\"GENTAAAA\" description=\"Start on stage 3 - The House\" />\n      <gamegenie code=\"IENTAAAA\" description=\"Start on stage 4 - The Freeway\" />\n      <gamegenie code=\"TENTAAAA\" description=\"Start on stage 5 - The Office block\" />\n      <gamegenie code=\"YENTAAAA\" description=\"Start on stage 6 - The Helicopter\" />\n      <gamegenie code=\"AENTAAAE\" description=\"Start on stage 7 - The Film Premiere\" />\n      <gamegenie code=\"PENTAAAE\" description=\"Start on Stage 8 - The Cinema\" />\n      <gamegenie code=\"ZENTAAAE\" description=\"Start on the end-of-level bad guy\" />\n    </game>\n    <game code=\"CLV-H-JSRPX\" name=\"Last Ninja, The\" crc=\"E353969F\">\n      <gamegenie code=\"SXSEEZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"EYETYIEI\" description=\"Press Select on controller 2 to skip to next level, A for next screen, B for previous screen\" />\n    </game>\n    <game code=\"CLV-H-LTFJZ\" name=\"Last Starfighter, The\" crc=\"6997F5E1\">\n      <gamegenie code=\"SZVPATVG\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"PANENLIA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"TANENLIA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"PANENLIE\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"KEEAVLSA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"GXUPLGSA\" description=\"Stop irritating shake\" />\n      <gamegenie code=\"GZVENLSA\" description=\"Start on level X - P1 (1 of 3)\" />\n      <gamegenie code=\"GZNAOLSA\" description=\"Start on level X - P1 (2 of 3)\" />\n      <gamegenie code=\"GAVEKLAA\" description=\"Start on level 5 - P1 (3 of 3)\" />\n      <gamegenie code=\"PAVEKLAE\" description=\"Start on level 10 - P1 (3 of 3)\" />\n      <gamegenie code=\"IAVEKLAE\" description=\"Start on level 14 - P1 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-XVMVQ\" name=\"Legacy of the Wizard\" crc=\"F181C021\">\n      <gamegenie code=\"GXSVLGVI\" description=\"Never lose items\" />\n      <gamegenie code=\"GXVTZYSA\" description=\"Infinite life\" />\n      <gamegenie code=\"GXNTYYVG\" description=\"Infinite magic\" />\n      <gamegenie code=\"GZKVUASA\" description=\"Shopkeeper forgets to charge\" />\n      <gamegenie code=\"OUOVNPOP\" description=\"No enemies\" />\n      <gamegenie code=\"AXXYNYZP\" description=\"Xemn's jumping improved\" />\n      <gamegenie code=\"PEXNEYLE\" description=\"Xemn's strength tripled\" />\n      <gamegenie code=\"AXXNUYGP\" description=\"Menya's jumping improved\" />\n      <gamegenie code=\"TEXNKYZA\" description=\"Menya's strength tripled\" />\n      <gamegenie code=\"ZXXNNYGO\" description=\"Roas' jumping improved\" />\n      <gamegenie code=\"LEUYEYPA\" description=\"Roas' strength tripled\" />\n      <gamegenie code=\"AUUYUNZP\" description=\"Lyll's jumping improved\" />\n      <gamegenie code=\"LEUYKYPA\" description=\"Lyll's strength tripled\" />\n      <gamegenie code=\"GKPSOS\" description=\"Walk through walls\" />\n    </game>\n    <game code=\"CLV-H-WXFSQ\" name=\"Legend of Kage, The\" crc=\"BBED6E6E\">\n      <gamegenie code=\"SZNPVLSA\" description=\"Invincibility\" />\n      <gamegenie code=\"SXVALZVG\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"KEOATAVA\" description=\"Start with 28 lives - both players\" />\n      <gamegenie code=\"GASAOLZA\" description=\"Super-ninja-power running ability\" />\n      <gamegenie code=\"YAKXYPGE\" description=\"Super-ninja-power jumping ability (1 of 3)\" />\n      <gamegenie code=\"YASZAPGE\" description=\"Super-ninja-power jumping ability (2 of 3)\" />\n      <gamegenie code=\"YASZPPGE\" description=\"Super-ninja-power jumping ability (3 of 3)\" />\n      <gamegenie code=\"AESXNKZA\" description=\"Hit anywhere with Shurikens (1 of 3)\" />\n      <gamegenie code=\"AESZUGTP\" description=\"Hit anywhere with Shurikens (2 of 3)\" />\n      <gamegenie code=\"AAEZVIGP\" description=\"Hit anywhere with Sword (1 of 3)\" />\n      <gamegenie code=\"AAOZXSAA\" description=\"Hit anywhere with Sword (2 of 3)\" />\n      <gamegenie code=\"AEXXNKLT\" description=\"Hit anywhere with x (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-SJAWT\" name=\"Legend of the Ghost Lion\" crc=\"04766130\">\n      <gamegenie code=\"SZUPNNSE\" description=\"Infinite Courage points\" />\n      <gamegenie code=\"SXSKLKSE\" description=\"Buying items for free in most shops (must have enough rubies to purchase the item)\" />\n      <gamegenie code=\"SXXKTSSE\" description=\"Infinite Dream points\" />\n    </game>\n    <game code=\"CLV-H-PJFCT\" name=\"Legendary Wings\" crc=\"A2194CAD\">\n      <gamegenie code=\"PEEALYLA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"TEEALYLA\" description=\"Start with 6 lives - P1\" />\n      <gamegenie code=\"PEEALYLE\" description=\"Start with 9 lives - P1\" />\n      <gamegenie code=\"PANEAYLA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"TANEAYLA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"PANEAYLE\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"AAEEGLPA\" description=\"Almost infinite health (1 of 2)\" />\n      <gamegenie code=\"AEEATIPA\" description=\"Almost infinite health (2 of 2)\" />\n      <gamegenie code=\"ZANAIZPA\" description=\"Gain double powers on pick-up (1 of 2)\" />\n      <gamegenie code=\"ZEVAPIPA\" description=\"Gain double powers on pick-up (2 of 2)\" />\n      <gamegenie code=\"LANAIZPA\" description=\"Gain triple powers on pick-up (1 of 2)\" />\n      <gamegenie code=\"ZEVAPZPA\" description=\"Gain triple powers on pick-up (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SORIO\" name=\"Legends of the Diamond: The Baseball Championship Game\" crc=\"05CE560C\">\n      <gamegenie code=\"OZUUZSPX\" description=\"Balls are considered strikes\" />\n      <gamegenie code=\"PEKLAIGA\" description=\"1 ball and you walk\" />\n      <gamegenie code=\"ZEKLAIGA\" description=\"2 balls and you walk\" />\n      <gamegenie code=\"TEKLAIGA\" description=\"6 balls to walk\" />\n      <gamegenie code=\"PASUGILA\" description=\"1 strike and you're out (fouls don't count as strikes)\" />\n      <gamegenie code=\"ZASUGILA\" description=\"2 strikes and you're out (fouls don't count as strikes)\" />\n      <gamegenie code=\"IASUGILA\" description=\"5 strikes and you're out (fouls don't count as strikes)\" />\n    </game>\n    <game code=\"CLV-H-OLIEN\" name=\"Lemmings\" crc=\"A69F29FA\">\n      <gamegenie code=\"SXUTLAVG\" description=\"Infinite time\" />\n      <gamegenie code=\"SZVVTPVG\" description=\"Infinite climbers\" />\n      <gamegenie code=\"SXOVAPVG\" description=\"Infinite floaters\" />\n      <gamegenie code=\"SXKTYPVG\" description=\"Infinite bombers\" />\n      <gamegenie code=\"SZOTPZVG\" description=\"Infinite blockers\" />\n      <gamegenie code=\"SZVTPZVG\" description=\"Infinite builders\" />\n      <gamegenie code=\"SXXVLZVG\" description=\"Infinite bashers\" />\n      <gamegenie code=\"SZETGLVG\" description=\"Infinite miners\" />\n      <gamegenie code=\"SZSTYLVG\" description=\"Infinite diggers\" />\n    </game>\n    <game code=\"CLV-H-ZFWTF\" name=\"Lethal Weapon\" crc=\"7077B075\">\n      <gamegenie code=\"OLSSGSOO\" description=\"Infinite ammo when shooting on the ground\" />\n      <gamegenie code=\"AKVIXAAP\" description=\"E restores health completely\" />\n      <gamegenie code=\"AEVIXAAP\" description=\"E worth nothing\" />\n      <gamegenie code=\"AKKSEAAP\" description=\"Extra ammo restores ammo completely\" />\n      <gamegenie code=\"AEKSEAAP\" description=\"Extra ammo worth nothing (if you run out of ammo you can't use gun till next stage)\" />\n      <gamegenie code=\"AEUYXAAZ\" description=\"No health lost when falling off screen\" />\n      <gamegenie code=\"AKUYXAAZ\" description=\"Falling off screen is fatal\" />\n      <gamegenie code=\"NNNISAAU\" description=\"Bullet proof vest lasts longer\" />\n      <gamegenie code=\"XVUKOOXK\" description=\"Bullet proof vest lasts until end of stage, except when you die from punches or falling off screen\" />\n      <gamegenie code=\"OUSSISOO\" description=\"Infinite ammo when shooting in the air (1 of 2)\" />\n      <gamegenie code=\"OUXIPSOO\" description=\"Infinite ammo when shooting in the air (2 of 2)\" />\n      <gamegenie code=\"XTUGTXXK\" description=\"Start on Level 2\" />\n      <gamegenie code=\"XZUGLXVL\" description=\"Start on Level 3 (1 of 3)\" />\n      <gamegenie code=\"LAUGGZNP\" description=\"Start on Level 3 (2 of 3)\" />\n      <gamegenie code=\"XTUGIZEK\" description=\"Start on Level 3 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-ARFFB\" name=\"Life Force\" crc=\"C4BC85A2\">\n      <gamegenie code=\"GZKGILVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"OXOSPXOV\" description=\"One hit kills most enemies\" />\n      <gamegenie code=\"GZSGLTSP\" description=\"Keep pods after death\" />\n      <gamegenie code=\"AAUIPXTP\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"AAUSTXIA\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"ATNILXOZ\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"EIKSZZEP\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"TKOYVIGX\" description=\"Press Start to finish the level (1 of 2)\" />\n      <gamegenie code=\"ZEOYKIPA\" description=\"Press Start to finish the level (2 of 2)\" />\n      <gamegenie code=\"PEKGPTAA\" description=\"Start with Speed\" />\n      <gamegenie code=\"ZEKGPTAA\" description=\"Start with Missile\" />\n      <gamegenie code=\"LEKGPTAA\" description=\"Start with Ripple\" />\n      <gamegenie code=\"GEKGPTAA\" description=\"Start with Laser\" />\n      <gamegenie code=\"IEKGPTAA\" description=\"Start with Option\" />\n      <gamegenie code=\"TEKGPTAA\" description=\"Start with Force Field\" />\n      <gamegenie code=\"PEUTSTAA\" description=\"Start at the volcanic stage\" />\n      <gamegenie code=\"ZEUTSTAA\" description=\"Start at the prominence stage\" />\n      <gamegenie code=\"LEUTSTAA\" description=\"Start at cell stage 2\" />\n      <gamegenie code=\"GEUTSTAA\" description=\"Start at the temple stage\" />\n      <gamegenie code=\"IEUTSTAA\" description=\"Start at the mechanical city stage\" />\n      <gamegenie code=\"PEKVNTLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEKVNTLA\" description=\"Start with 6 lives\" />\n    </game>\n    <game code=\"CLV-H-TDLCF\" name=\"Little League Baseball Championship Series\" crc=\"859C65E1\">\n      <gamegenie code=\"UPEUYLOG\" description=\"Always hit a homerun (press B while the ball is in play) (2 of 2)\" />\n      <gamegenie code=\"AGOLPUNI\" description=\"Always hit a homerun (press B while the ball is in play) (1 of 2)\" />\n      <gamegenie code=\"OZUITLEN\" description=\"Balls are considered strikes\" />\n    </game>\n    <game code=\"CLV-H-PNBGW\" name=\"Little Mermaid, Disney's The\" crc=\"3BE244EF\">\n      <gamegenie code=\"ESSGSPEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ESEELPEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXSGNPVG\" description=\"Invincibility after one hit\" />\n      <gamegenie code=\"AASGATZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IASGATZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AASGATZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZSSPLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"GZSILLSA\" description=\"Keep red pearls after dying\" />\n      <gamegenie code=\"GZSIILSA\" description=\"Keep green pearls after dying\" />\n      <gamegenie code=\"PAKKGTAA\" description=\"Start on stage 2\" />\n      <gamegenie code=\"ZAKKGTAA\" description=\"Start on stage 3\" />\n      <gamegenie code=\"LAKKGTAA\" description=\"Start on stage 4\" />\n      <gamegenie code=\"GAKKGTAA\" description=\"Start on stage 5\" />\n      <gamegenie code=\"IAKKGTAA\" description=\"Start on Ursula stage\" />\n      <gamegenie code=\"LASIZLAA\" description=\"Get all pearls after dying\" />\n      <gamegenie code=\"LAKKGTAA\" description=\"Start with all red pearls (1 of 2)\" />\n      <gamegenie code=\"ILKKTVOV\" description=\"Start with all red pearls (2 of 2)\" />\n      <gamegenie code=\"LAKKGTAA\" description=\"Start with all green pearls (1 of 2)\" />\n      <gamegenie code=\"TLKKTVOV\" description=\"Start with all green pearls (2 of 2)\" />\n      <gamegenie code=\"PASGGTLA\" description=\"Start with 1 heart (1 of 2)\" />\n      <gamegenie code=\"PAXGAYLA\" description=\"Start with 1 heart (2 of 2)\" />\n      <gamegenie code=\"IASGGTLA\" description=\"Start with 5 hearts (1 of 2)\" />\n      <gamegenie code=\"IAXGAYLA\" description=\"Start with 5 hearts (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SIOUE\" name=\"Little Nemo: The Dream Master\" crc=\"5B4B6056\">\n      <gamegenie code=\"SXKTGEVK\" description=\"Infinite life\" />\n      <gamegenie code=\"SZOKSLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEKKSZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEKKSZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEKKSZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"TOKZKNZA\" description=\"Mega-jump\" />\n      <gamegenie code=\"GESLYPPA\" description=\"Speed jumps (1 of 2)\" />\n      <gamegenie code=\"UYUUIOVN\" description=\"Speed jumps (2 of 2)\" />\n      <gamegenie code=\"ZEXLLPPA\" description=\"Super speed (1 of 2)\" />\n      <gamegenie code=\"SYEUPOVN\" description=\"Super speed (2 of 2)\" />\n      <gamegenie code=\"PEUKOZAA\" description=\"Start on stage 2\" />\n      <gamegenie code=\"ZEUKOZAA\" description=\"Start on stage 3\" />\n      <gamegenie code=\"LEUKOZAA\" description=\"Start on stage 4\" />\n      <gamegenie code=\"GEUKOZAA\" description=\"Start on stage 5\" />\n      <gamegenie code=\"IEUKOZAA\" description=\"Start on stage 6\" />\n      <gamegenie code=\"TEUKOZAA\" description=\"Start on stage 7\" />\n      <gamegenie code=\"YEUKOZAA\" description=\"Start on stage 8\" />\n    </game>\n    <game code=\"CLV-H-BJVZZ\" name=\"Little Ninja Brothers\" crc=\"BC7FEDB9\">\n      <gamegenie code=\"SXSZXNTS\" description=\"Invincibility to water\" />\n      <gamegenie code=\"AIULZPEI\" description=\"Invincibility\" />\n      <gamegenie code=\"OLKUAOOO\" description=\"Infinite Life\" />\n      <gamegenie code=\"AEEOKZPA\" description=\"Mighty Ball always available\" />\n      <gamegenie code=\"OZXONUPX\" description=\"All T-Stars\" />\n      <gamegenie code=\"ATUOSUSZ\" description=\"T-Star always available\" />\n      <gamegenie code=\"AEUUYKIA\" description=\"Infinite Dragon Kicks\" />\n      <gamegenie code=\"AAXIVOZP\" description=\"Quick level up\" />\n      <gamegenie code=\"AEOSKPZA\" description=\"Max money after fights\" />\n      <gamegenie code=\"AVSIOOSZ\" description=\"Infinite money\" />\n      <gamegenie code=\"NYUSKXZE\" description=\"Start with 255 Life\" />\n      <gamegenie code=\"ZLUSSZPA\" description=\"Start with 50 Attack\" />\n    </game>\n    <game code=\"CLV-H-KXAVY\" name=\"Little Samson\" crc=\"B5E392E2\">\n      <gamegenie code=\"APSELZEI\" description=\"Invincibility against enemies\" />\n      <gamegenie code=\"GZVEPXSN\" description=\"Infinite health\" />\n      <gamegenie code=\"GXOVAGVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"ALUAIGEL\" description=\"Hit anywhere\" />\n      <gamegenie code=\"AVKXSXVI\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"AOKTPSAE\" description=\"Increase Samson's health gauge\" />\n      <gamegenie code=\"AOKTZSAE\" description=\"Increase Kikira's health gauge\" />\n      <gamegenie code=\"AXKTLIAP\" description=\"Increase Gamm's health gauge\" />\n      <gamegenie code=\"AOKTGIGA\" description=\"Increase K.O.'s health gauge\" />\n      <gamegenie code=\"AOKTISAE\" description=\"Increase Samson's health\" />\n      <gamegenie code=\"AOKTTSAE\" description=\"Increase Kikira's health\" />\n      <gamegenie code=\"AXKTYIAP\" description=\"Increase Gamm's health\" />\n      <gamegenie code=\"AOKVAIGA\" description=\"Increase K.O.'s health\" />\n      <gamegenie code=\"AAUZEZGE\" description=\"Crystal ball adds 4 units to health gauge\" />\n      <gamegenie code=\"AESXVPZE\" description=\"Small hearts give 4 health units\" />\n    </game>\n    <game code=\"CLV-H-OGTUX\" name=\"Lode Runner\" crc=\"AF5676DE\">\n      <gamegenie code=\"GXOKIGEY\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"GXOGTGEY\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"GZNGLGEY\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"GZNGYIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PASKLTIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZASKLTIE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"APOIGPAL\" description=\"Moonwalk\" />\n      <gamegenie code=\"GAUGVGYA\" description=\"Heavy gravity (1 of 2)\" />\n      <gamegenie code=\"AAKGEGGA\" description=\"Heavy gravity (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-OGBIB\" name=\"Lone Ranger, The\" crc=\"23D17F5E\">\n      <gamegenie code=\"SXSZKPSA\" description=\"Walk anywhere - Overworld\" />\n      <gamegenie code=\"ATEXYIST\" description=\"Items are free\" />\n      <gamegenie code=\"NNKNTIGV\" description=\"Start with 255 dollars\" />\n      <gamegenie code=\"AASXUAPA\" description=\"Infinite regular and silver bullets\" />\n      <gamegenie code=\"IEUZTNZA\" description=\"Cheaper silver bullets\" />\n      <gamegenie code=\"ZEUZIYIA\" description=\"Cheaper standard bullets\" />\n      <gamegenie code=\"ZESYTIIE\" description=\"Start with 10 silver bullet rounds\" />\n      <gamegenie code=\"YESYTIIE\" description=\"Start with 15 silver bullet rounds\" />\n      <gamegenie code=\"YESYZSZE\" description=\"Start with 15 standard bullet rounds\" />\n      <gamegenie code=\"TOSYZSZE\" description=\"Start with 30 standard bullet rounds\" />\n      <gamegenie code=\"GZKKYPSA\" description=\"Infinite energy - side views only\" />\n      <gamegenie code=\"GZSZNATG\" description=\"Don't lose money when shooting bystanders (1 of 2)\" />\n      <gamegenie code=\"GZSXOATT\" description=\"Don't lose money when shooting bystanders (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FPLOV\" name=\"Low G Man: The Low Gravity Man\" crc=\"93991433\">\n      <gamegenie code=\"SZEENESE\" description=\"Infinite life (blinking)\" />\n      <gamegenie code=\"SXUEKUVS\" description=\"Infinite Ammo - Secondary Weapon\" />\n      <gamegenie code=\"AEXXZELP\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"SXVZLAAX\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"ATOXTPEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"AEOXLOZA\" description=\"Get items from anywhere\" />\n      <gamegenie code=\"YZSXTKZZ\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"PEXIZTLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEXIZTLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEXIZTLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PEOSKALA\" description=\"1 life after continue\" />\n      <gamegenie code=\"TEOSKALA\" description=\"6 lives after continue\" />\n      <gamegenie code=\"PEOSKALE\" description=\"9 lives after continue\" />\n      <gamegenie code=\"SZNIEEVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GZKINOVK\" description=\"Infinite time\" />\n      <gamegenie code=\"SZVSKOVK\" description=\"Infinite vehicle fuel\" />\n      <gamegenie code=\"AAEZATZE\" description=\"Full life gained from capsules\" />\n      <gamegenie code=\"PAEZATZA\" description=\"Less life gained from capsules\" />\n      <gamegenie code=\"LAVSKAPA\" description=\"Full EMDP on a new life\" />\n      <gamegenie code=\"ZAVIKAAA\" description=\"Full AGM on a new life\" />\n      <gamegenie code=\"ZEOZZTLE\" description=\"10 Boomerangs on pick-up\" />\n      <gamegenie code=\"ZAVXGTLE\" description=\"10 Fireballs on pick-up\" />\n      <gamegenie code=\"ZEUXATLE\" description=\"10 Bombs on pick-up\" />\n      <gamegenie code=\"ZESXTTLE\" description=\"10 Waves on pick-up\" />\n    </game>\n    <game code=\"CLV-H-LGWZW\" name=\"M.C. Kids\" crc=\"B0EBF3DB\">\n      <gamegenie code=\"GXKSUOSE\" description=\"Infinite lives\" />\n      <gamegenie code=\"EGETYTIA\" description=\"Infinite hearts\" />\n      <gamegenie code=\"GLXEIPEK\" description=\"Multi-jump (1 of 3)\" />\n      <gamegenie code=\"OZXEGOSX\" description=\"Multi-jump (2 of 3)\" />\n      <gamegenie code=\"XTXETPGE\" description=\"Multi-jump (3 of 3)\" />\n      <gamegenie code=\"EKNVYIIA\" description=\"Don't lose Golden Arches when hit\" />\n      <gamegenie code=\"AOVEGTGE\" description=\"Super-jump (1 of 2)\" />\n      <gamegenie code=\"AEVEPTLA\" description=\"Super-jump (2 of 2)\" />\n      <gamegenie code=\"AAVNIVGA\" description=\"Always find all cards in level (1 of 4)\" />\n      <gamegenie code=\"OZVNPVSX\" description=\"Always find all cards in level (2 of 4)\" />\n      <gamegenie code=\"PAVNZVPP\" description=\"Always find all cards in level (3 of 4)\" />\n      <gamegenie code=\"XTVNLTGE\" description=\"Always find all cards in level (4 of 4)\" />\n      <gamegenie code=\"AEXALGPA\" description=\"Access any level on map\" />\n      <gamegenie code=\"AAKSAYZA\" description=\"1 heart per life (1 of 2)\" />\n      <gamegenie code=\"AEKSNPZA\" description=\"1 heart per life (2 of 2)\" />\n      <gamegenie code=\"YAKSAYZA\" description=\"8 hearts per life (1 of 2)\" />\n      <gamegenie code=\"YEKSNPZA\" description=\"8 hearts per life (2 of 2)\" />\n      <gamegenie code=\"PAKILYLA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"TAKILYLA\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"PAKILYLE\" description=\"Start with 10 lives\" />\n    </game>\n    <game code=\"CLV-H-HDZRR\" name=\"M.U.L.E.\" crc=\"0939852F\">\n      <gamegenie code=\"GEKALTTA\" description=\"4 'months' for beginner game\" />\n      <gamegenie code=\"PEKALTTE\" description=\"9 'months' for beginner game\" />\n      <gamegenie code=\"TEXAIVGA\" description=\"6 'months' for standard game\" />\n      <gamegenie code=\"GOXAIVGA\" description=\"20 'months' for standard game\" />\n      <gamegenie code=\"EPOEPNAI\" description=\"Humanoids start with $400 (1 of 2)\" />\n      <gamegenie code=\"PAOETYZA\" description=\"Humanoids start with $400 (2 of 2)\" />\n      <gamegenie code=\"AZOEPNAI\" description=\"Humanoids start with $800 (1 of 2)\" />\n      <gamegenie code=\"LAOETYZA\" description=\"Humanoids start with $800 (2 of 2)\" />\n      <gamegenie code=\"GPUAAYAG\" description=\"Flappers start with $1300 (1 of 2)\" />\n      <gamegenie code=\"IAUAIYTA\" description=\"Flappers start with $1300 (2 of 2)\" />\n      <gamegenie code=\"EIUAAYAG\" description=\"Flappers start with $2000 (1 of 2)\" />\n      <gamegenie code=\"YAUAIYTA\" description=\"Flappers start with $2000 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-QMKSP\" name=\"M.U.S.C.L.E.: Tag Team Match\" crc=\"8FF31896\">\n      <gamegenie code=\"ZESELPLA\" description=\"Set bout length timer to 20\" />\n      <gamegenie code=\"TESELPLA\" description=\"Set bout length timer to 60\" />\n      <gamegenie code=\"PESELPLE\" description=\"Set bout length timer to 90\" />\n      <gamegenie code=\"ZEUOUPPA\" description=\"Computer controlled players jump faster\" />\n      <gamegenie code=\"ZASXAAPA\" description=\"Computer controlled players speed up\" />\n      <gamegenie code=\"OZUEPZSX\" description=\"Invincibility - P1 team (1 of 2)\" />\n      <gamegenie code=\"LTUEZXYG\" description=\"Invincibility - P1 team (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-UYOGD\" name=\"Mach Rider\" crc=\"59977A46\">\n      <gamegenie code=\"IVGUEY\" description=\"Never lose bike abilities (colors)\" />\n      <gamegenie code=\"VZISZL\" description=\"Infinite lives\" />\n      <gamegenie code=\"KKAZNG\" description=\"Infinite energy (1 of 2)\" />\n      <gamegenie code=\"UETUXY\" description=\"Infinite energy (2 of 2)\" />\n      <gamegenie code=\"KVGLXY\" description=\"Bike never explodes\" />\n      <gamegenie code=\"VLTGKZ\" description=\"Infinite shots\" />\n      <gamegenie code=\"SXZEIL\" description=\"Super speed (1 of 2)\" />\n      <gamegenie code=\"SXLALL\" description=\"Super speed (2 of 2)\" />\n      <gamegenie code=\"SZYGYV\" description=\"No winter\" />\n      <gamegenie code=\"SZTZSG\" description=\"Infinite time - solo and endurance courses\" />\n    </game>\n    <game code=\"CLV-H-JSSWM\" name=\"Mad Max\" crc=\"026E41C5\">\n      <gamegenie code=\"NYEYVYAX\" description=\"Start with full food and water\" />\n      <gamegenie code=\"AGOYUYEA\" description=\"Start with less ammo\" />\n      <gamegenie code=\"SXVAEVVK\" description=\"Infinite ammo\" />\n      <gamegenie code=\"AENEPYAP\" description=\"No damage done to car\" />\n      <gamegenie code=\"GENEPYAP\" description=\"Less damage done to car\" />\n      <gamegenie code=\"AXNEPYAP\" description=\"More damage done to car\" />\n      <gamegenie code=\"AAUAUEAA\" description=\"No damage done to you\" />\n      <gamegenie code=\"GAUAUEAA\" description=\"Less damage done to you\" />\n      <gamegenie code=\"APUAUEAA\" description=\"More damage done to you\" />\n      <gamegenie code=\"AVKVLPAZ\" description=\"A better tune-up\" />\n      <gamegenie code=\"AANEPZPA\" description=\"Dynamite is free\" />\n      <gamegenie code=\"AAVEGZPA\" description=\"Ammo is free\" />\n      <gamegenie code=\"GEEATZYA\" description=\"Cheaper arena pass (1 of 2)\" />\n      <gamegenie code=\"GLKELZYL\" description=\"Cheaper arena pass (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-UERWY\" name=\"Golgo 13: The Mafat Conspiracy\" crc=\"8A043CD6\">\n      <gamegenie code=\"GXOGZZVG\" description=\"Infinite bullets\" />\n      <gamegenie code=\"IASGUSZA\" description=\"Fewer bullets on pick-up\" />\n      <gamegenie code=\"GPSGUSZA\" description=\"More bullets on pick-up\" />\n      <gamegenie code=\"AZNIEXGL\" description=\"Faster timer\" />\n      <gamegenie code=\"GZNGOTOY\" description=\"Immune to physical damage\" />\n      <gamegenie code=\"GZOKSSON\" description=\"Immune to weapon damage\" />\n      <gamegenie code=\"GXNGPOSN\" description=\"Immune to damage in maze\" />\n      <gamegenie code=\"XTNIVXXK\" description=\"Infinite time\" />\n      <gamegenie code=\"AYNIEXGL\" description=\"Slower timer (1 of 2)\" />\n      <gamegenie code=\"AYVISXGL\" description=\"Slower timer (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BXCAX\" name=\"Magic of Scheherazade, The\" crc=\"92197173\">\n      <gamegenie code=\"OTSXLGSV\" description=\"Infinite HP\" />\n      <gamegenie code=\"SXEVPLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"TEXAXLLA\" description=\"Get Coins from anywhere\" />\n      <gamegenie code=\"OXUYZKPX\" description=\"Invincibility\" />\n      <gamegenie code=\"AEEYYGLA\" description=\"Hit anywhere (1 of 5)\" />\n      <gamegenie code=\"ALNNIGEP\" description=\"Hit anywhere (2 of 5)\" />\n      <gamegenie code=\"SZNNLGSG\" description=\"Hit anywhere (3 of 5)\" />\n      <gamegenie code=\"TZNNTKPA\" description=\"Hit anywhere (4 of 5)\" />\n      <gamegenie code=\"UGNNGKPE\" description=\"Hit anywhere (5 of 5)\" />\n      <gamegenie code=\"PAKTAZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAKTAZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAKTAZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"ZAUTAZIA\" description=\"Start with only 20 Gold Coins\" />\n      <gamegenie code=\"POKAOZZU\" description=\"Less energy gained from Bread\" />\n      <gamegenie code=\"ZAEEXGIA\" description=\"Less magic gained from Mashroobs\" />\n      <gamegenie code=\"SZEAEKVK\" description=\"Never lose Mashroobs\" />\n    </game>\n    <game code=\"CLV-H-DIDRN\" name=\"Magmax\" crc=\"81389607\">\n      <gamegenie code=\"SZVVYTVG\" description=\"Infinite lives - 1P game\" />\n      <gamegenie code=\"AEEVITPA\" description=\"Infinite lives - 2P game\" />\n      <gamegenie code=\"AEKGKLZA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"IEKGKLZA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"AEKGKLZE\" description=\"Start with 9 lives - both players\" />\n    </game>\n    <game code=\"CLV-H-XOGGJ\" name=\"Maniac Mansion\" crc=\"0D9F5BD1\">\n      <gamegenie code=\"SEXGKASZ\" description=\"All codes start out as 0000\" />\n    </game>\n    <game code=\"CLV-H-OHACF\" name=\"Mappy-Land\" crc=\"83FC38F8\">\n      <gamegenie code=\"SZKXITVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEXXTAZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEXXTAZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"TESXALLA\" description=\"Start with 6 toys\" />\n      <gamegenie code=\"PESXALLA\" description=\"Start with 1 toy\" />\n      <gamegenie code=\"LESZALAA\" description=\"Start with coins instead of toys\" />\n      <gamegenie code=\"PESZALAA\" description=\"Start with fish instead of toys\" />\n      <gamegenie code=\"ZESZALAA\" description=\"Start with pots instead of toys\" />\n    </game>\n    <game code=\"CLV-H-PDJQW\" name=\"Marble Madness\" crc=\"09874777\">\n      <gamegenie code=\"OXVXLZVS\" description=\"Infinite time\" />\n      <gamegenie code=\"GOOZPLAA\" description=\"Extra 20 seconds to complete beginner race\" />\n      <gamegenie code=\"AXOZPLAE\" description=\"Extra 40 seconds to complete beginner race\" />\n      <gamegenie code=\"GXEXTLEL\" description=\"Bonus time not added\" />\n      <gamegenie code=\"EYNGALEI\" description=\"Don't break from falling\" />\n      <gamegenie code=\"OZGGYO\" description=\"Cannot fall into bottomless pits (1 of 3)\" />\n      <gamegenie code=\"SZAEUA\" description=\"Cannot fall into bottomless pits (2 of 3)\" />\n      <gamegenie code=\"SZEGPXOX\" description=\"Cannot fall into bottomless pits (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-UTJSV\" name=\"Mario's Time Machine\" crc=\"55DB7E2A\">\n      <gamegenie code=\"ZEUUGYAA\" description=\"Get an item after killing one Koopa\" />\n    </game>\n    <game code=\"CLV-H-QWQUK\" name=\"Mechanized Attack\" crc=\"5EE6008E\">\n      <gamegenie code=\"SXUNPEVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZUNTOVK\" description=\"Infinite grenades\" />\n      <gamegenie code=\"SZEYIOVK\" description=\"Infinite bullets\" />\n      <gamegenie code=\"AEVOAPLA\" description=\"Reduce damage by half\" />\n      <gamegenie code=\"GPONAOAZ\" description=\"Magazine holds half normal amount of bullets after first magazine used (1 of 2)\" />\n      <gamegenie code=\"GPEYLEAZ\" description=\"Magazine holds half normal amount of bullets after first magazine used (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-EMYTG\" name=\"Mega Man\" crc=\"6EE4BB0A\">\n      <gamegenie code=\"AAOULKPZ\" description=\"Have all weapons (1 of 4)\" />\n      <gamegenie code=\"AEULTXVT\" description=\"Have all weapons (2 of 4)\" />\n      <gamegenie code=\"AEXLPPZI\" description=\"Have all weapons (3 of 4)\" />\n      <gamegenie code=\"OXXLPZEN\" description=\"Have all weapons (4 of 4)\" />\n      <gamegenie code=\"IESZXESN\" description=\"Infinite weapons on pick-up\" />\n      <gamegenie code=\"SUSZSASP\" description=\"Infinite weapons on pick-up (alt)\" />\n      <gamegenie code=\"AUZYGL\" description=\"One hit kills on bosses\" />\n      <gamegenie code=\"PENOAYAA\" description=\"Climb up ladders faster\" />\n      <gamegenie code=\"VYXOXENN\" description=\"Climb down ladders faster\" />\n      <gamegenie code=\"OZSKPZVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAOGSOLA\" description=\"One hit kills (1 of 2)\" />\n      <gamegenie code=\"ESSUNTEP\" description=\"One hit kills (2 of 2)\" />\n      <gamegenie code=\"SZKZGZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"AVVXLPSZ\" description=\"Invincibility (except against bosses)\" />\n      <gamegenie code=\"TAOOYTGA\" description=\"Mega-jump\" />\n      <gamegenie code=\"OXSLEEPV\" description=\"Maximum points for shooting bosses (1 of 2)\" />\n      <gamegenie code=\"AUSLOEAZ\" description=\"Maximum points for shooting bosses (2 of 2)\" />\n      <gamegenie code=\"GOUOTSAP\" description=\"Multi-jump (1 of 4)\" />\n      <gamegenie code=\"GXKPVGEL\" description=\"Multi-jump (2 of 4)\" />\n      <gamegenie code=\"SUEPLSPX\" description=\"Multi-jump (3 of 4)\" />\n      <gamegenie code=\"SOEPGIVP\" description=\"Multi-jump (4 of 4)\" />\n      <gamegenie code=\"SUULTVVN\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"XTXLONEK\" description=\"Enemies always drop X (1 of 2)\" />\n      <gamegenie code=\"PGOUONLL\" description=\"Enemies always drop extra lives (2 of 2)\" />\n      <gamegenie code=\"AGOUONLL\" description=\"Enemies always drop large health refill (2 of 2)\" />\n      <gamegenie code=\"YLOUONLU\" description=\"Enemies always drop large weapon refill (2 of 2)\" />\n      <gamegenie code=\"TAXOIOGO\" description=\"Start with half energy\" />\n      <gamegenie code=\"AASPLAZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IASPLAZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AASPLAZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-XGSJS\" name=\"Mega Man 2\" crc=\"0FCFC04D\">\n      <gamegenie code=\"EIUGVTEY\" description=\"Invincibility\" />\n      <gamegenie code=\"AIUGVTEY\" description=\"Invincibility (alt) (1 of 2)\" />\n      <gamegenie code=\"SAUGKTSZ\" description=\"Invincibility (alt) (2 of 2)\" />\n      <gamegenie code=\"SXXTPSSE\" description=\"Infinite health\" />\n      <gamegenie code=\"SXUGTPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"GXETTTEL\" description=\"One hit kills (1 of 2)\" />\n      <gamegenie code=\"GZUZGTEL\" description=\"One hit kills (2 of 2)\" />\n      <gamegenie code=\"LZVSSZYZ\" description=\"Burst-fire from normal weapon\" />\n      <gamegenie code=\"TANAOZGA\" description=\"Power-jumps\" />\n      <gamegenie code=\"AANAOZGE\" description=\"Super power-jumps\" />\n      <gamegenie code=\"APNAOZGA\" description=\"Mega power-jumps\" />\n      <gamegenie code=\"GZKEYLAL\" description=\"Maximum weapon energy on pick-up\" />\n      <gamegenie code=\"PGEAKOPX\" description=\"Moonwalking\" />\n      <gamegenie code=\"SXSSOISA\" description=\"Infinite Heat Man\" />\n      <gamegenie code=\"SXSSNZSA\" description=\"Infinite Air Man\" />\n      <gamegenie code=\"SZVIUYSA\" description=\"Infinite Wood Man\" />\n      <gamegenie code=\"SZUIKLVG\" description=\"Infinite Bubble Man\" />\n      <gamegenie code=\"SZVSNLVG\" description=\"Infinite Quick Man\" />\n      <gamegenie code=\"SXKSOLVG\" description=\"Infinite Metal Man\" />\n      <gamegenie code=\"SXESKLVG\" description=\"Infinite Clash Man\" />\n      <gamegenie code=\"SZNIVGVG\" description=\"Infinite 1\" />\n      <gamegenie code=\"SZXTGZVG\" description=\"Infinite 2\" />\n      <gamegenie code=\"SZKTALVG\" description=\"Infinite 3\" />\n      <gamegenie code=\"AXEAUUSZ\" description=\"Multi-jump (1 of 4)\" />\n      <gamegenie code=\"LXEEYIYZ\" description=\"Multi-jump (2 of 4)\" />\n      <gamegenie code=\"SEEASLGA\" description=\"Multi-jump (3 of 4)\" />\n      <gamegenie code=\"VEEAKLEX\" description=\"Multi-jump (4 of 4)\" />\n      <gamegenie code=\"SSNLNKVS\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"OUVVASOO\" description=\"Special items re-appear after being collected\" />\n      <gamegenie code=\"ASUNZZEP\" description=\"Enemies always drop x (1 of 2)\" />\n      <gamegenie code=\"SSUNLXKK\" description=\"Enemies always drop extra lives (2 of 2)\" />\n      <gamegenie code=\"OSUNLXKK\" description=\"Enemies always drop large health refill (2 of 2)\" />\n      <gamegenie code=\"SSUNLXKG\" description=\"Enemies always drop large weapon refill (2 of 2)\" />\n      <gamegenie code=\"AEVAZEKI\" description=\"Able to access already defeated boss stages\" />\n      <gamegenie code=\"TEKAIEGO\" description=\"Start with half health\" />\n      <gamegenie code=\"PANALALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TANALALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PANALALE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-PQEZF\" name=\"Mega Man 3\" crc=\"603AAA57\">\n      <gamegenie code=\"ENXETAEI\" description=\"Invincibility\" />\n      <gamegenie code=\"GXVAAASA\" description=\"Infinite health\" />\n      <gamegenie code=\"SXVAAASA\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"AEEGXLPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"OUNIVVOO\" description=\"Infinite weapons (except Top Man)\" />\n      <gamegenie code=\"SXOAZZSA\" description=\"Infinite Top Man\" />\n      <gamegenie code=\"AOSYXUAU\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"AVSYUUSL\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AEKEZPZA\" description=\"One hit kills\" />\n      <gamegenie code=\"YEUKOTGA\" description=\"Mega-jump\" />\n      <gamegenie code=\"ASXSTLGP\" description=\"Longer slides\" />\n      <gamegenie code=\"NNKIALEE\" description=\"Faster slides\" />\n      <gamegenie code=\"NYKGXSGK\" description=\"Move faster\" />\n      <gamegenie code=\"ZAKGNIPA\" description=\"Move mega-fast\" />\n      <gamegenie code=\"TUOKUIYA\" description=\"Multi-jump (1 of 3)\" />\n      <gamegenie code=\"VKUGOIES\" description=\"Multi-jump (2 of 3)\" />\n      <gamegenie code=\"GZUKOTEP\" description=\"Multi-jump (3 of 3)\" />\n      <gamegenie code=\"SIUUNVVS\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"AEXOXGKI\" description=\"Special items re-appear after being collected\" />\n      <gamegenie code=\"EZNLXYEP\" description=\"Enemies always drop x (1 of 3)\" />\n      <gamegenie code=\"TANLVNEY\" description=\"Enemies always drop x (2 of 3)\" />\n      <gamegenie code=\"IANLUNPA\" description=\"Enemies always drop extra lives (3 of 3)\" />\n      <gamegenie code=\"LANLUNPA\" description=\"Enemies always drop large health refill (3 of 3)\" />\n      <gamegenie code=\"PANLUNPA\" description=\"Enemies always drop large weapon refill (3 of 3)\" />\n      <gamegenie code=\"AAOOGLSI\" description=\"Able to access already defeated boss stages\" />\n      <gamegenie code=\"AENKKAZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IENKKAZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AENKKAZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PAOONPZA\" description=\"Start with 1 life after continue\" />\n      <gamegenie code=\"IAOONPZA\" description=\"Start with 6 lives after continue\" />\n      <gamegenie code=\"AAOONPZE\" description=\"Start with 9 lives after continue\" />\n    </game>\n    <game code=\"CLV-H-DYRDE\" name=\"Mega Man 4\" crc=\"18A2E74F\">\n      <gamegenie code=\"GXVEIPSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SXVEIPSA\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"SZUGUAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"OUENESOO\" description=\"Infinite weapons\" />\n      <gamegenie code=\"GXENESOO\" description=\"Infinite weapon power\" />\n      <gamegenie code=\"AEOAIEPA\" description=\"Instant full Mega Buster\" />\n      <gamegenie code=\"LXKESKAP\" description=\"Instant full Mega Buster (alt)\" />\n      <gamegenie code=\"APKYKXOU\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"ATKYSXAZ\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"VENOEASZ\" description=\"Always have 10 E-Tanks\" />\n      <gamegenie code=\"GXNPZTVG\" description=\"Infinite energy pods on pick-up\" />\n      <gamegenie code=\"AAKEYPIE\" description=\"Mega-jump\" />\n      <gamegenie code=\"ZOEAIOZP\" description=\"Shorter slides\" />\n      <gamegenie code=\"YXEAIOZO\" description=\"Longer slides\" />\n      <gamegenie code=\"GEOAGPZA\" description=\"Faster slides\" />\n      <gamegenie code=\"ZANKPTPA\" description=\"Faster running (1 of 2)\" />\n      <gamegenie code=\"ZEVALLPA\" description=\"Faster running (2 of 2)\" />\n      <gamegenie code=\"AUNELEEG\" description=\"Multi-jump (1 of 3)\" />\n      <gamegenie code=\"OAEEYPXA\" description=\"Multi-jump (2 of 3)\" />\n      <gamegenie code=\"GZUALPEP\" description=\"Multi-jump (3 of 3)\" />\n      <gamegenie code=\"AVSUEUVI\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"AAEAGOPY\" description=\"Special items re-appear after being collected\" />\n      <gamegenie code=\"AEOLNLTA\" description=\"Enemies always drop x (1 of 3)\" />\n      <gamegenie code=\"LEOUXUEY\" description=\"Enemies always drop x (2 of 3)\" />\n      <gamegenie code=\"IEOLELGA\" description=\"Enemies always drop large weapon refill (3 of 3)\" />\n      <gamegenie code=\"ZEOLELGA\" description=\"Enemies always drop large health refill (3 of 3)\" />\n      <gamegenie code=\"AAUKZIZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAUKZIZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAUKZIZE\" description=\"Start with 79 lives\" />\n    </game>\n    <game code=\"CLV-H-STLXR\" name=\"Mega Man 5\" crc=\"3EDCF7E8\">\n      <gamegenie code=\"OLKOYSOO\" description=\"Infinite weapons (1 of 3)\" />\n      <gamegenie code=\"OUNUZSOO\" description=\"Infinite weapons (2 of 3)\" />\n      <gamegenie code=\"SZSAGZSA\" description=\"Infinite weapons (3 of 3)\" />\n      <gamegenie code=\"OVNLZISV\" description=\"Infinite energy for most weapons (1 of 2)\" />\n      <gamegenie code=\"OTKPYISV\" description=\"Infinite energy for most weapons (2 of 2)\" />\n      <gamegenie code=\"GXSEYZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SAKEZAIA\" description=\"Invincible against spikes\" />\n      <gamegenie code=\"GXXAAIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"APOYYEOU\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"ATONAEAZ\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AEUAZOIZ\" description=\"One hit kills\" />\n      <gamegenie code=\"XAKSUTEA\" description=\"Start with at least 2 energy tanks\" />\n      <gamegenie code=\"VAKSUTEA\" description=\"Start with at least 6 energy tanks\" />\n      <gamegenie code=\"XASIOTEA\" description=\"Start with at least 2 mega-tanks\" />\n      <gamegenie code=\"VASIOTEA\" description=\"Start with at least 6 mega-tanks\" />\n      <gamegenie code=\"GXSEPZVG\" description=\"Infinite mega-tanks on pick-up\" />\n      <gamegenie code=\"GZSATPVG\" description=\"Infinite energy tanks on pick-up\" />\n      <gamegenie code=\"PEVLLPGA\" description=\"Starting weapons use less energy\" />\n      <gamegenie code=\"YEXETAIA\" description=\"Super-jump (1 of 2)\" />\n      <gamegenie code=\"ONUELEUN\" description=\"Super-jump (2 of 2)\" />\n      <gamegenie code=\"PEXETAIA\" description=\"Mega-jump (1 of 2)\" />\n      <gamegenie code=\"NNUELEUY\" description=\"Mega-jump (2 of 2)\" />\n      <gamegenie code=\"SAKATAIO\" description=\"Multi-jump (1 of 3)\" />\n      <gamegenie code=\"EAVEZAXA\" description=\"Multi-jump (2 of 3)\" />\n      <gamegenie code=\"GXOAAAEP\" description=\"Multi-jump (3 of 3)\" />\n      <gamegenie code=\"ATKXOVVI\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"AEUOVPSI\" description=\"Special items re-appear after being collected\" />\n      <gamegenie code=\"ASEZVTEP\" description=\"Enemies always drop large health refill (1 of 2)\" />\n      <gamegenie code=\"PEEZETGA\" description=\"Enemies always drop large health refill (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ADERW\" name=\"Mega Man 6\" crc=\"988798A8\">\n      <gamegenie code=\"ESXAKTEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SXEAVNSE\" description=\"Infinite health\" />\n      <gamegenie code=\"OUXPXVOO\" description=\"Infinite weapons\" />\n      <gamegenie code=\"SZVAIZVG\" description=\"Infinite Rush Jet\" />\n      <gamegenie code=\"AENAIOPP\" description=\"Enemies always drop items\" />\n      <gamegenie code=\"LEVVNGIA\" description=\"Hit anywhere and shoot to pick-up items\" />\n      <gamegenie code=\"AEVVUUZA\" description=\"One hit kills (1 of 2)\" />\n      <gamegenie code=\"OXVVXLOU\" description=\"One hit kills (2 of 2)\" />\n      <gamegenie code=\"SXEEXTVG\" description=\"Infinite lives (can sometimes die and go to another part of the game)\" />\n      <gamegenie code=\"GXEAKYST\" description=\"Infinite health (except fires, falling into pits and spikes)\" />\n      <gamegenie code=\"LOOEKGPP\" description=\"Normal shots do more damage\" />\n      <gamegenie code=\"TOKENGLP\" description=\"Mega shots do more damage\" />\n      <gamegenie code=\"AGEEYOYA\" description=\"Multi-jump (1 of 7)\" />\n      <gamegenie code=\"EAOAPOEG\" description=\"Multi-jump (2 of 7)\" />\n      <gamegenie code=\"EIOAZPIA\" description=\"Multi-jump (3 of 7)\" />\n      <gamegenie code=\"PZOAAOSX\" description=\"Multi-jump (4 of 7)\" />\n      <gamegenie code=\"SZEETPEI\" description=\"Multi-jump (5 of 7)\" />\n      <gamegenie code=\"XGOALPAU\" description=\"Multi-jump (6 of 7)\" />\n      <gamegenie code=\"XTOAGOZE\" description=\"Multi-jump (7 of 7)\" />\n      <gamegenie code=\"UKXOTXVI\" description=\"Collectable items never disappear\" />\n      <gamegenie code=\"AAUKVIZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"IAUKVIZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAUKVIZA\" description=\"Start with 1 life\" />\n    </game>\n    <game code=\"CLV-H-RUEYO\" name=\"Menace Beach (Unl) [!]\" crc=\"194942DB\">\n      <gamegenie code=\"ETVVPOAL\" description=\"Infinite health and one hit kills (1 of 5)\" />\n      <gamegenie code=\"EYVVLPPP\" description=\"Infinite health and one hit kills (2 of 5)\" />\n      <gamegenie code=\"TAVVGPEL\" description=\"Infinite health and one hit kills (3 of 5)\" />\n      <gamegenie code=\"XTVVIPZE\" description=\"Infinite health and one hit kills (4 of 5)\" />\n      <gamegenie code=\"AAVVZPST\" description=\"Infinite health and one hit kills (levels 1-9, 11, 12 only) (5 of 5)\" />\n      <gamegenie code=\"PAVVZPST\" description=\"Infinite health and one hit kills (level 10 only) (5 of 5)\" />\n      <gamegenie code=\"OZKYPGSX\" description=\"Multi-jump (1 of 2)\" />\n      <gamegenie code=\"XAKYZGZT\" description=\"Multi-jump (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-NTIBC\" name=\"Mendel Palace\" crc=\"12078AFD\">\n      <gamegenie code=\"SLSIXXVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAVZLPZA\" description=\"Start with - 1 life\" />\n      <gamegenie code=\"IAVZLPZA\" description=\"Start with - 5 lives\" />\n      <gamegenie code=\"AAVZLPZE\" description=\"Start with - 9 lives\" />\n      <gamegenie code=\"KEXLXKSE\" description=\"P1 has more lives\" />\n      <gamegenie code=\"KEXLSKSE\" description=\"P2 has more lives\" />\n      <gamegenie code=\"IEXIAIPA\" description=\"More stars on pick-up\" />\n      <gamegenie code=\"SZUIOOSU\" description=\"P1 gains P2's speed-ups (1 of 2)\" />\n      <gamegenie code=\"VTUSEOVN\" description=\"P1 gains P2's speed-ups (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-KRWGR\" name=\"Metal Gear\" crc=\"817431EC\">\n      <gamegenie code=\"SXVTXZVG\" description=\"Infinite life (1 of 2)\" />\n      <gamegenie code=\"SZUYPZVG\" description=\"Infinite life (2 of 2)\" />\n      <gamegenie code=\"SXELYGVG\" description=\"Invincible against Gas\" />\n      <gamegenie code=\"SZSUVZVG\" description=\"Invincible against Electric Floors\" />\n      <gamegenie code=\"SXXXETVG\" description=\"Infinite Rations\" />\n      <gamegenie code=\"SZSVVYVG\" description=\"Infinite Handgun ammo\" />\n      <gamegenie code=\"KXEVUTKA\" description=\"Infinite Mines\" />\n      <gamegenie code=\"VXXVETVA\" description=\"Infinite Explosives\" />\n      <gamegenie code=\"VXVVKTVA\" description=\"Infinite Missiles\" />\n      <gamegenie code=\"SZKVXYVG\" description=\"Infinite Machine Gun ammo\" />\n      <gamegenie code=\"KZEVXYKA\" description=\"Infinite Grenades\" />\n      <gamegenie code=\"VXKVNTVA\" description=\"Infinite Rockets\" />\n      <gamegenie code=\"AAETIUUT\" description=\"Hit anywhere - Punch (1 of 4)\" />\n      <gamegenie code=\"AAOTPUNI\" description=\"Hit anywhere - Punch (2 of 4)\" />\n      <gamegenie code=\"AAOVPLNI\" description=\"Hit anywhere - Punch (3 of 4)\" />\n      <gamegenie code=\"ASVVYZEP\" description=\"Hit anywhere - Punch (4 of 4)\" />\n      <gamegenie code=\"AISNYZEY\" description=\"Hit anywhere - Weapons except Grenade Launcher\" />\n      <gamegenie code=\"OZSXKGXX\" description=\"Have all weapons (1 of 3)\" />\n      <gamegenie code=\"NYSXSGAE\" description=\"Have all weapons (2 of 3)\" />\n      <gamegenie code=\"SASXVGSZ\" description=\"Have all weapons (3 of 3)\" />\n      <gamegenie code=\"ZASILYPA\" description=\"Start at mystery location 1\" />\n      <gamegenie code=\"GASILYPA\" description=\"Start at mystery location 2\" />\n      <gamegenie code=\"SLNIUGSP\" description=\"Enemies never attack or chase you\" />\n      <gamegenie code=\"XZVSAYVZ\" description=\"Start with a X boost (1 of 3)\" />\n      <gamegenie code=\"PAVSPNTT\" description=\"Start with a X boost (2 of 3)\" />\n      <gamegenie code=\"AEKSZYIE\" description=\"Start with a life boost (3 of 3)\" />\n      <gamegenie code=\"GEKSZYIE\" description=\"Start with a super life boost (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-FELTF\" name=\"Metal Mech: Man &amp; Machine\" crc=\"05378607\">\n      <gamegenie code=\"SZUAXYAX\" description=\"Invincibility\" />\n      <gamegenie code=\"SXNPYNSE\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SZVOEESE\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"SZEYAVVK\" description=\"Infinite lives for Tony\" />\n      <gamegenie code=\"PEKSILLA\" description=\"1 life and 1 Smart Bomb\" />\n      <gamegenie code=\"TEKSILLA\" description=\"6 lives and 6 Smart Bombs\" />\n      <gamegenie code=\"PEKSILLE\" description=\"9 lives and 9 Smart Bombs\" />\n      <gamegenie code=\"SZVYISVK\" description=\"Infinite Smart Bombs\" />\n      <gamegenie code=\"VNNXTENN\" description=\"Super-jumping Tony\" />\n      <gamegenie code=\"ZEEXGAIA\" description=\"Super-speeding Tony\" />\n      <gamegenie code=\"PEEXGAIA\" description=\"Mega-speeding Tony\" />\n      <gamegenie code=\"AESSAUNY\" description=\"Start on level 2\" />\n      <gamegenie code=\"PESSAUNY\" description=\"Start on level 3\" />\n      <gamegenie code=\"ZESSAUNY\" description=\"Start on level 4\" />\n      <gamegenie code=\"LESSAUNY\" description=\"Start on level 5\" />\n      <gamegenie code=\"GESSAUNY\" description=\"Start on level 6\" />\n    </game>\n    <game code=\"CLV-H-SRCLC\" name=\"Metal Storm\" crc=\"BCACBBF4\">\n      <gamegenie code=\"SXKNAIVG\" description=\"Infinite time\" />\n      <gamegenie code=\"SZNTGTSA\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SZOUIYSA\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"TEXUNLZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEXUNLZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AASOYYPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"NNNLOLAE\" description=\"Start with extra weapons\" />\n      <gamegenie code=\"AVKYPSGL\" description=\"Slower timer\" />\n      <gamegenie code=\"AXKYPSGL\" description=\"Faster timer\" />\n      <gamegenie code=\"AESTKXGA\" description=\"Permanent Fireball\" />\n      <gamegenie code=\"AESXXNGY\" description=\"Permanent Shield\" />\n    </game>\n    <game code=\"CLV-H-TWPAO\" name=\"Mickey Mousecapade\" crc=\"7C6A3D51\">\n      <gamegenie code=\"ESEPKZEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ESVPNZEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"OVOPPTSV\" description=\"Infinite health\" />\n      <gamegenie code=\"SZSOPZVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PESOIPGA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"IESOIPGA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AESOIPGE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GPSIEVGE\" description=\"Mickey and Minnie can shoot on any level (1 of 2)\" />\n      <gamegenie code=\"LAVSVTZA\" description=\"Mickey and Minnie can shoot on any level (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-DJRFZ\" name=\"Micro Machines\" crc=\"9235B57B\">\n      <gamegenie code=\"PEKNAYLE\" description=\"Play with 9 lives\" />\n      <gamegenie code=\"GXSZZVVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GEKYSZZA\" description=\"Qualify every race\" />\n      <gamegenie code=\"PEUYXZLA\" description=\"Ruff Trux after every race\" />\n      <gamegenie code=\"PASYNALA\" description=\"Kid out of game after every race\" />\n      <gamegenie code=\"GEKNIYAA\" description=\"Start on race 5\" />\n      <gamegenie code=\"PEKNIYAE\" description=\"Start on race 10\" />\n      <gamegenie code=\"TEKNIYAE\" description=\"Start on race 15\" />\n      <gamegenie code=\"LOKNIYAA\" description=\"Start on race 20\" />\n      <gamegenie code=\"AOKNIYAE\" description=\"Start on race 25 (Final Race)\" />\n      <gamegenie code=\"GESYOZPA\" description=\"Win Championship race\" />\n      <gamegenie code=\"AAOEIAIA\" description=\"Faster Boat acceleration\" />\n      <gamegenie code=\"AAOEGAIA\" description=\"Faster Sports Car acceleration\" />\n      <gamegenie code=\"AAOETAIA\" description=\"Faster Formula 1 acceleration\" />\n      <gamegenie code=\"AAOEYAIA\" description=\"Faster Turbo Wheels(tm) acceleration\" />\n      <gamegenie code=\"AAXAAAIA\" description=\"Faster 4x4 acceleration\" />\n      <gamegenie code=\"AAXAZAZA\" description=\"Faster Tank acceleration\" />\n      <gamegenie code=\"AAXALAIA\" description=\"Faster Chopper acceleration\" />\n      <gamegenie code=\"AAXATEPA\" description=\"Quicker Boat deceleration\" />\n      <gamegenie code=\"AAXAIEPA\" description=\"Quicker Sports Car deceleration\" />\n      <gamegenie code=\"AAXAYEPA\" description=\"Quicker Formula 1 deceleration\" />\n      <gamegenie code=\"AAXEAEPA\" description=\"Quicker Turbo Wheels deceleration\" />\n      <gamegenie code=\"AAXEPEPA\" description=\"Quicker 4x4 deceleration\" />\n      <gamegenie code=\"AAXELAZA\" description=\"Quicker Tank deceleration\" />\n      <gamegenie code=\"AAXEGEYA\" description=\"Quicker Chopper deceleration\" />\n      <gamegenie code=\"YAEAZAPA\" description=\"Higher bounce for Boats\" />\n      <gamegenie code=\"IAEAPAPA\" description=\"Higher bounce for Sports cars\" />\n      <gamegenie code=\"YAEALAPA\" description=\"Higher bounce for Formula 1's\" />\n      <gamegenie code=\"YAEAGAPA\" description=\"Higher bounce for Turbo Wheels\" />\n      <gamegenie code=\"YAEAIAPA\" description=\"Higher bounce for 4x4's\" />\n      <gamegenie code=\"YAEAYAPA\" description=\"Higher bounce for Tanks\" />\n      <gamegenie code=\"POLESS\" description=\"Drive through vehicles\" />\n    </game>\n    <game code=\"CLV-H-IOCUQ\" name=\"MIG-29 Soviet Fighter\" crc=\"E62E3382\">\n      <gamegenie code=\"AANGGPLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IANGGPLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AANGGPLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"VYNGGPLE\" description=\"Start with 255 lives\" />\n      <gamegenie code=\"SZSSOLVG\" description=\"Keep weapon after death\" />\n      <gamegenie code=\"LANKPPAA\" description=\"Start with best weapon\" />\n      <gamegenie code=\"NNEOZAAE\" description=\"More time to refuel\" />\n      <gamegenie code=\"LEEOZAAA\" description=\"Less time to refuel\" />\n      <gamegenie code=\"OZOOYPSX\" description=\"Start on mission X (1 of 3)\" />\n      <gamegenie code=\"XIXPZPPS\" description=\"Start on mission X (2 of 3)\" />\n      <gamegenie code=\"PAXPAPIP\" description=\"Start on mission 2 (3 of 3)\" />\n      <gamegenie code=\"ZAXPAPIP\" description=\"Start on mission 3 (3 of 3)\" />\n      <gamegenie code=\"LAXPAPIP\" description=\"Start on mission 4 (3 of 3)\" />\n      <gamegenie code=\"GAXPAPIP\" description=\"Start on mission 5 (3 of 3)\" />\n      <gamegenie code=\"IAXPAPIP\" description=\"Start on mission 6 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-ZIOCY\" name=\"Mighty Bomb Jack (U) [!]\" crc=\"08077383\">\n      <gamegenie code=\"OXOOYNPX\" description=\"Invincibility\" />\n      <gamegenie code=\"SXUPPNSE\" description=\"Invincibility (alt) (1 of 2)\" />\n      <gamegenie code=\"SZEOXUSE\" description=\"Invincibility (alt) (2 of 2)\" />\n      <gamegenie code=\"SXXALNVK\" description=\"Infinite time\" />\n      <gamegenie code=\"PAOEZZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAOEZZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAOEZZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"VZUEZNVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AKOEGYAT\" description=\"Less time in game\" />\n      <gamegenie code=\"EEOEGYAT\" description=\"More time in game\" />\n      <gamegenie code=\"SXOESEVK\" description=\"Enemies don't return from coin transformation\" />\n      <gamegenie code=\"SZEEXUVK\" description=\"Power coins are not used up\" />\n      <gamegenie code=\"OESPNTLA\" description=\"Disable torture room\" />\n      <gamegenie code=\"ZEUOUAPA\" description=\"Jump through walls\" />\n    </game>\n    <game code=\"CLV-H-CNCWB\" name=\"Mighty Final Fight\" crc=\"3F78037C\">\n      <gamegenie code=\"EAXKNYAA\" description=\"Invincibility\" />\n      <gamegenie code=\"PEVKTYIA\" description=\"Start with 2 lives (doesn't work on continues)\" />\n      <gamegenie code=\"LEVKTYIA\" description=\"Start with 4 lives (doesn't work on continues)\" />\n      <gamegenie code=\"YEVKTYIA\" description=\"Start with 8 lives (doesn't work on continues)\" />\n      <gamegenie code=\"PEVKTYIE\" description=\"Start with 10 lives (doesn't work on continues)\" />\n      <gamegenie code=\"SZKSNIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PENGZYLA\" description=\"Start with 1 credit\" />\n      <gamegenie code=\"IENGZYLA\" description=\"Start with 5 credits\" />\n      <gamegenie code=\"YENGZYLA\" description=\"Start with 7 credits\" />\n      <gamegenie code=\"PENGZYLE\" description=\"Start with 9 credits\" />\n      <gamegenie code=\"SZOOLGVG\" description=\"Infinite credits\" />\n      <gamegenie code=\"SZXNUPSA\" description=\"Protection from most hazards\" />\n      <gamegenie code=\"SZUEAVOU\" description=\"Cody is weaker\" />\n      <gamegenie code=\"SZSATVOU\" description=\"Guy is weaker\" />\n      <gamegenie code=\"SZNAGVOU\" description=\"Haggar is weaker\" />\n      <gamegenie code=\"OXKAXZSX\" description=\"Gain EXP faster (10 pts at a time) (may be displayed incorrectly) (1 of 2)\" />\n      <gamegenie code=\"AOKAUZIA\" description=\"Gain EXP faster (10 pts at a time) (may be displayed incorrectly) (2 of 2)\" />\n      <gamegenie code=\"OXKAXZSX\" description=\"Gain EXP much faster (20 pts at a time) (may be displayed incorrectly) (1 of 2)\" />\n      <gamegenie code=\"AXKAUZIA\" description=\"Gain EXP much faster (20 pts at a time) (may be displayed incorrectly) (2 of 2)\" />\n      <gamegenie code=\"ALKGOAAG\" description=\"Cody starts with 3/4 health (1st life only)\" />\n      <gamegenie code=\"AZKGOAAG\" description=\"Cody starts with 1/2 health (1st life only)\" />\n      <gamegenie code=\"APKGOAAG\" description=\"Cody starts with 1/4 health (1st life only)\" />\n      <gamegenie code=\"ALKSKTAG\" description=\"Cody starts with 3/4 health (after 1st life)\" />\n      <gamegenie code=\"AZKSKTAG\" description=\"Cody starts with 1/2 health (after 1st life)\" />\n      <gamegenie code=\"APKSKTAG\" description=\"Cody starts with 1/4 health (after 1st life)\" />\n      <gamegenie code=\"GZKGXAAL\" description=\"Guy starts with 3/4 health (1st life only)\" />\n      <gamegenie code=\"APKGXAAU\" description=\"Guy starts with 1/2 health (1st life only)\" />\n      <gamegenie code=\"GAKGXAAU\" description=\"Guy starts with 1/4 health (1st life only)\" />\n      <gamegenie code=\"GZSIXTAL\" description=\"Guy starts with 3/4 health (after 1st life)\" />\n      <gamegenie code=\"APSIXTAU\" description=\"Guy starts with 1/2 health (after 1st life)\" />\n      <gamegenie code=\"GASIXTAU\" description=\"Guy starts with 1/4 health (after 1st life)\" />\n      <gamegenie code=\"GLKGUAAS\" description=\"Haggar starts with 3/4 health (1st life only)\" />\n      <gamegenie code=\"AZKGUAAS\" description=\"Haggar starts with 1/2 health (1st life only)\" />\n      <gamegenie code=\"GPKGUAAI\" description=\"Haggar starts with 1/4 health (1st life only)\" />\n      <gamegenie code=\"GLSSETAS\" description=\"Haggar starts with 3/4 health (after 1st life)\" />\n      <gamegenie code=\"AZSSETAS\" description=\"Haggar starts with 1/2 health (after 1st life)\" />\n      <gamegenie code=\"GPSSETAI\" description=\"Haggar starts with 1/4 health (after 1st life)\" />\n      <gamegenie code=\"EXSEYIKZ\" description=\"Cody is stronger and has a super-powerful normal punch (1 of 3)\" />\n      <gamegenie code=\"IEVAASLT\" description=\"Cody is stronger and has a super-powerful normal punch (2 of 3)\" />\n      <gamegenie code=\"AKEASELA\" description=\"Cody is stronger and has a super-powerful normal punch (3 of 3)\" />\n      <gamegenie code=\"AGUAKPZA\" description=\"Guy is stronger and has a super-powerful normal punch (1 of 3)\" />\n      <gamegenie code=\"EZEAYTKZ\" description=\"Guy is stronger and has a super-powerful normal punch (2 of 3)\" />\n      <gamegenie code=\"IAEEAVLT\" description=\"Guy is stronger and has a super-powerful normal punch (3 of 3)\" />\n      <gamegenie code=\"EZXAYTKZ\" description=\"Haggar is stronger and has a super-powerful normal punch (1 of 3)\" />\n      <gamegenie code=\"LAXEAVLT\" description=\"Haggar is stronger and has a super-powerful normal punch (2 of 3)\" />\n      <gamegenie code=\"AKKEUOIA\" description=\"Haggar is stronger and has a super-powerful normal punch (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-EGOLK\" name=\"Mike Tyson's Punch-Out!!\" crc=\"2C818014\">\n      <gamegenie code=\"AEEAAAST\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"INUAIZSY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"ATEALIXZ\" description=\"Infinite health\" />\n      <gamegenie code=\"PAXEUPAE\" description=\"Infinite hearts\" />\n      <gamegenie code=\"GZKETGST\" description=\"Infinite hearts (alt)\" />\n      <gamegenie code=\"ALVAYPEY\" description=\"Start with and have infinite stars\" />\n      <gamegenie code=\"AAVEAOTP\" description=\"Infinite stars\" />\n      <gamegenie code=\"ALNEVPEY\" description=\"Infinite stars once obtained\" />\n      <gamegenie code=\"LASAEPAA\" description=\"Start each round with 3 stars\" />\n      <gamegenie code=\"XXXELNVA\" description=\"Infinite time (1 of 2)\" />\n      <gamegenie code=\"SUSETNSO\" description=\"Infinite time (2 of 2)\" />\n      <gamegenie code=\"SXOEYNVV\" description=\"Infinite time (alt)\" />\n      <gamegenie code=\"ATOEXESA\" description=\"No health for opponent (1 of 2)\" />\n      <gamegenie code=\"SXKAYKSE\" description=\"No health for opponent (2 of 2)\" />\n      <gamegenie code=\"SZSELPAX\" description=\"No health replenishment for opponent\" />\n      <gamegenie code=\"SZVAAOIV\" description=\"Take less damage\" />\n      <gamegenie code=\"SZVALPAX\" description=\"Take even less damage\" />\n      <gamegenie code=\"AAVETLGA\" description=\"Normal punches do more damage\" />\n      <gamegenie code=\"YZLOSS\" description=\"Instant win\" />\n      <gamegenie code=\"UZLOSS\" description=\"Instant loss\" />\n      <gamegenie code=\"AXIONS\" description=\"First knockdown will be a TKO\" />\n      <gamegenie code=\"INUAIZSY\" description=\"Opponent cannot block punches\" />\n      <gamegenie code=\"ENOZAZPE\" description=\"Skip intro\" />\n    </game>\n    <game code=\"CLV-H-YGTVH\" name=\"Millipede\" crc=\"AE52DECE\">\n      <gamegenie code=\"SUKGETVI\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"PAVKSPGA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"ZAVKSPGE\" description=\"Start with 10 lives - P1\" />\n      <gamegenie code=\"ASESIIEZ\" description=\"Increase territory to half screen\" />\n      <gamegenie code=\"AXESIIEZ\" description=\"Increase territory to full screen\" />\n      <gamegenie code=\"NKESIIEZ\" description=\"Shrink territory\" />\n      <gamegenie code=\"ZEUSXYTE\" description=\"Player's bullets move faster\" />\n      <gamegenie code=\"LEUSXYTA\" description=\"Player's bullets move slower\" />\n    </game>\n    <game code=\"CLV-H-NHYCK\" name=\"Milon's Secret Castle\" crc=\"586A3277\">\n      <gamegenie code=\"SZNSLZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"AEKGNXAA\" description=\"No health on pick-up\" />\n      <gamegenie code=\"AOKGNXAE\" description=\"More health on pick-up\" />\n      <gamegenie code=\"ASNPVZLA\" description=\"Floating Milon\" />\n      <gamegenie code=\"ASEZZYEI\" description=\"Max power bubbles\" />\n      <gamegenie code=\"ESUIGOOG\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"GXUIIOAA\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AGSEEZAZ\" description=\"Start with more health\" />\n      <gamegenie code=\"AISAOXAL\" description=\"Start with a bigger health bar\" />\n    </game>\n    <game code=\"CLV-H-CMHLQ\" name=\"Mission Cobra\" crc=\"5DA9CEC8\">\n      <gamegenie code=\"AAESVIGT\" description=\"Infinite health (1 of 3)\" />\n      <gamegenie code=\"AANNZPGT\" description=\"Infinite health (2 of 3)\" />\n      <gamegenie code=\"AAXIOLGT\" description=\"Infinite health (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-BRQJE\" name=\"Mission: Impossible\" crc=\"E3C5BB3D\">\n      <gamegenie code=\"TEOUNKGA\" description=\"Start with less health\" />\n      <gamegenie code=\"AOOUNKGA\" description=\"Start with more health\" />\n      <gamegenie code=\"SXUETVOU\" description=\"Take less damage\" />\n      <gamegenie code=\"ZENETTPA\" description=\"Take more damage\" />\n      <gamegenie code=\"ZEULXGIA\" description=\"2 Type B weapons for Nicholas\" />\n      <gamegenie code=\"PEULXGIE\" description=\"9 Type B weapons for Nicholas\" />\n      <gamegenie code=\"IEXUXKZA\" description=\"5 Type B weapons for Max and Grant\" />\n      <gamegenie code=\"YEXUXKZE\" description=\"15 Type B weapons for Max and Grant\" />\n      <gamegenie code=\"AAUPIZPA\" description=\"Infinite Type B weapons for all\" />\n      <gamegenie code=\"VKOAVOSX\" description=\"Longer disguise time (1 of 2)\" />\n      <gamegenie code=\"GAEOPLPA\" description=\"Longer disguise time (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-XYRBC\" name=\"Monopoly\" crc=\"9747AC09\">\n      <gamegenie code=\"YLSSOLPU\" description=\"Collect $300 as you pass Go\" />\n      <gamegenie code=\"IPSSOLPU\" description=\"Collect $100 as you pass Go\" />\n      <gamegenie code=\"AAVZKAYP\" description=\"Pay $0 to get out of jail\" />\n      <gamegenie code=\"IPVZKAYO\" description=\"Pay $100 to get out of jail\" />\n      <gamegenie code=\"LOOAVKZP\" description=\"Pay $30 for luxury tax\" />\n      <gamegenie code=\"IOOAVKZO\" description=\"Pay $100 for luxury tax\" />\n      <gamegenie code=\"PUOAVKZP\" description=\"Pay $200 for luxury tax\" />\n      <gamegenie code=\"AESAVGPL\" description=\"Pay $0 for income tax\" />\n      <gamegenie code=\"LOSAVGPL\" description=\"Pay $30 for income tax\" />\n      <gamegenie code=\"IOSAVGPU\" description=\"Pay $100 for income tax\" />\n      <gamegenie code=\"YUSAVGPU\" description=\"Pay $300 for income tax\" />\n      <gamegenie code=\"YLOSLKLK\" description=\"$300 to buy Boardwalk\" />\n      <gamegenie code=\"LIOSLKLG\" description=\"$600 to buy Boardwalk\" />\n      <gamegenie code=\"PLOIZGIG\" description=\"$200 to buy Park Place\" />\n      <gamegenie code=\"LGOIZGIK\" description=\"$400 to buy Park Place\" />\n      <gamegenie code=\"LIOIZGIG\" description=\"$600 to buy Park Place\" />\n      <gamegenie code=\"IPOSZGPU\" description=\"Houses on Park Place cost $100\" />\n      <gamegenie code=\"YLOSZGPU\" description=\"Houses on Park Place cost $300\" />\n      <gamegenie code=\"IPXILGPU\" description=\"Houses on Boardwalk cost $100\" />\n      <gamegenie code=\"YLXILGPU\" description=\"Houses on Boardwalk cost $300\" />\n      <gamegenie code=\"YAOAILLA\" description=\"Go Back 7 spaces instead of 3 on Chance\" />\n    </game>\n    <game code=\"CLV-H-ZGWRC\" name=\"Monster In My Pocket\" crc=\"E542E3CF\">\n      <gamegenie code=\"SUKEPSVS\" description=\"Invincibility after first hit (1 of 2)\" />\n      <gamegenie code=\"OOVAPTEP\" description=\"Invincibility after first hit (2 of 2)\" />\n      <gamegenie code=\"SUSEIVVS\" description=\"Infinite energy\" />\n      <gamegenie code=\"SLSAASVS\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-WMXRR\" name=\"Monster Party\" crc=\"02B9E7C2\">\n      <gamegenie code=\"AVOEZYSZ\" description=\"Invincibility\" />\n      <gamegenie code=\"SXXAYYVG\" description=\"Infinite life against normal enemies\" />\n      <gamegenie code=\"VVXAIYVG\" description=\"Infinite life against Guardians\" />\n      <gamegenie code=\"APUPZSGE\" description=\"Start with double life (1 of 2)\" />\n      <gamegenie code=\"AOKPTKGE\" description=\"Start with double life (2 of 2)\" />\n      <gamegenie code=\"GZUPZSGE\" description=\"Start with full life (1 of 2)\" />\n      <gamegenie code=\"GXKPTKGE\" description=\"Start with full life (2 of 2)\" />\n      <gamegenie code=\"EYEEIIEL\" description=\"One hit kills normal enemies\" />\n      <gamegenie code=\"AAUEUIZA\" description=\"One hit kills Guardians\" />\n      <gamegenie code=\"VNKETXNN\" description=\"Walk twice as fast (1 of 2)\" />\n      <gamegenie code=\"ZEUEAZPA\" description=\"Walk twice as fast (2 of 2)\" />\n      <gamegenie code=\"VNNAZKNN\" description=\"Jump twice as far (1 of 2)\" />\n      <gamegenie code=\"ZESEYGPA\" description=\"Jump twice as far (2 of 2)\" />\n      <gamegenie code=\"PAKOZIAA\" description=\"Start on level 2\" />\n      <gamegenie code=\"ZAKOZIAA\" description=\"Start on level 3\" />\n      <gamegenie code=\"LAKOZIAA\" description=\"Start on level 4\" />\n      <gamegenie code=\"GAKOZIAA\" description=\"Start on level 5\" />\n      <gamegenie code=\"IAKOZIAA\" description=\"Start on level 6\" />\n      <gamegenie code=\"TAKOZIAA\" description=\"Start on level 7\" />\n      <gamegenie code=\"YAKOZIAA\" description=\"Start on level 8\" />\n    </game>\n    <game code=\"CLV-H-VNVUS\" name=\"Moon Ranger\" crc=\"14A81635\">\n      <gamegenie code=\"SXUSGVVK\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-JBBQE\" name=\"Motor City Patrol\" crc=\"0A0926BD\">\n      <gamegenie code=\"ANOEIOGL\" description=\"Slow down timer\" />\n      <gamegenie code=\"YOOEIOGU\" description=\"Speed up timer\" />\n      <gamegenie code=\"IAOXILAA\" description=\"Start with 5 merits\" />\n      <gamegenie code=\"AEEXGTPA\" description=\"Don't take damage\" />\n      <gamegenie code=\"GXUESKVK\" description=\"Free equipment (1 of 2)\" />\n      <gamegenie code=\"APUAUGEI\" description=\"Free equipment (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-NAAXT\" name=\"Muppet Adventure: Chaos at the Carnival\" crc=\"7156CB4D\">\n      <gamegenie code=\"SZKANZVG\" description=\"Infinite power\" />\n    </game>\n    <game code=\"CLV-H-MYREK\" name=\"Mutant Virus, The: Crisis in a Computer World\" crc=\"7DCB4C18\">\n      <gamegenie code=\"AEOGTAIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZEOGTAIA\" description=\"Start with 3 lives\" />\n      <gamegenie code=\"SEOGTAIA\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"PEOGTAIE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"AEESZKNY\" description=\"Don't flash after getting hit\" />\n      <gamegenie code=\"LVESZKNY\" description=\"Flash 1/2 as long after getting hit\" />\n      <gamegenie code=\"SXEKXGVG\" description=\"Invincibility\" />\n      <gamegenie code=\"SZKGNUSE\" description=\"Infinite health\" />\n      <gamegenie code=\"XVEITKVE\" description=\"Infinite lives\" />\n      <gamegenie code=\"VXEITKVE\" description=\"Infinite time\" />\n    </game>\n    <game code=\"CLV-H-CNDNX\" name=\"Mystery Quest\" crc=\"B5D28EA2\">\n      <gamegenie code=\"GXNPYAVG\" description=\"Invincibility\" />\n      <gamegenie code=\"SXNPYAVG\" description=\"Infinite vitality\" />\n      <gamegenie code=\"AEXOGEEY\" description=\"Immune to monster attacks\" />\n      <gamegenie code=\"AEUOAENY\" description=\"Immune to shallow water\" />\n      <gamegenie code=\"ATSEUYAG\" description=\"Start with more vitality\" />\n      <gamegenie code=\"AZSEUYAG\" description=\"Start with less vitality\" />\n      <gamegenie code=\"PEUOKPAA\" description=\"Start with Raft and Key\" />\n      <gamegenie code=\"GXVOOYSA\" description=\"Never lose Key\" />\n      <gamegenie code=\"PENOPTAA\" description=\"Never lose Raft\" />\n    </game>\n    <game code=\"CLV-H-MJQSF\" name=\"NARC\" crc=\"0537322A\">\n      <gamegenie code=\"AENXPOTA\" description=\"Invincibility (blinking) - both players\" />\n      <gamegenie code=\"XVXVGLVN\" description=\"Infinite health - both players\" />\n      <gamegenie code=\"AAOSUPPA\" description=\"Infinite Bullets\" />\n      <gamegenie code=\"AEEILGPA\" description=\"Infinite Missiles\" />\n      <gamegenie code=\"SUKVTLVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"ASUSNYEY\" description=\"Enemies die automatically (1 of 2)\" />\n      <gamegenie code=\"PSKIEYUY\" description=\"Enemies die automatically (2 of 2)\" />\n      <gamegenie code=\"AASTAPLA\" description=\"Hit anywhere - P1 (1 of 3)\" />\n      <gamegenie code=\"ASKIOYKZ\" description=\"Hit anywhere - P1 (2 of 3)\" />\n      <gamegenie code=\"YKKIXYTS\" description=\"Hit anywhere - P1 (3 of 3)\" />\n      <gamegenie code=\"AAUAZPZA\" description=\"Start with - 1 life\" />\n      <gamegenie code=\"IAUAZPZA\" description=\"Start with - 6 lives\" />\n      <gamegenie code=\"AAUAZPZE\" description=\"Start with - 9 lives\" />\n      <gamegenie code=\"PUVAGAIU\" description=\"More Missiles\" />\n      <gamegenie code=\"PEUZPZIA\" description=\"1 Missile on pick-up\" />\n      <gamegenie code=\"PEUZPZIE\" description=\"9 Missiles on pick-up\" />\n      <gamegenie code=\"GASPTLZA\" description=\"45 Bullets on pick-up\" />\n    </game>\n    <game code=\"CLV-H-SUKOV\" name=\"NES Open Tournament Golf\" crc=\"F6B9799C\">\n      <gamegenie code=\"PEUAGVSP\" description=\"Always on first shot\" />\n      <gamegenie code=\"SZKINZSA\" description=\"No wind\" />\n    </game>\n    <game code=\"CLV-H-QHQZH\" name=\"NES Play Action Football\" crc=\"B9B4D9E0\">\n      <gamegenie code=\"TOKYLKYE\" description=\"30-minute quarters\" />\n      <gamegenie code=\"ZEKYLKYE\" description=\"10-minute quarters\" />\n      <gamegenie code=\"KEKLUNSE\" description=\"No timeouts - P2\" />\n      <gamegenie code=\"TEUUNYLA\" description=\"6 timeouts per half (ignore display)\" />\n      <gamegenie code=\"PEUUNYLA\" description=\"1 timeout per half\" />\n    </game>\n    <game code=\"CLV-H-NIXLX\" name=\"Nigel Mansell's World Championship Racing\" crc=\"4751A751\">\n      <gamegenie code=\"GZSULOVV\" description=\"No extra time in the pits\" />\n      <gamegenie code=\"GANKXZYA\" description=\"Only need 3 laps in South Africa instead of 6\" />\n      <gamegenie code=\"GANKUZYA\" description=\"Only need 3 laps in Mexico instead of 6\" />\n      <gamegenie code=\"GANKKZTA\" description=\"Only need 3 laps in Brazil instead of 5\" />\n      <gamegenie code=\"GANKSZIA\" description=\"Only need 3 laps in Spain instead of 4\" />\n      <gamegenie code=\"GANKVZYA\" description=\"Only need 3 laps in San Marino instead of 6\" />\n      <gamegenie code=\"GANKNZTA\" description=\"Only need 3 laps in Monaco instead of 5\" />\n      <gamegenie code=\"GEEGEZYA\" description=\"Only need 3 laps in Canada instead of 6\" />\n      <gamegenie code=\"GEEGOZIA\" description=\"Only need 3 laps in France instead of 4\" />\n      <gamegenie code=\"GEEGXZTA\" description=\"Only need 3 laps in Great Britian instead of 5\" />\n      <gamegenie code=\"GEEGUZTA\" description=\"Only need 3 laps in Germany instead of 5\" />\n      <gamegenie code=\"GEEGKZTA\" description=\"Only need 3 laps in Hungary instead of 5\" />\n      <gamegenie code=\"GEEGSZTA\" description=\"Only need 3 laps in Belgium instead of 5\" />\n      <gamegenie code=\"GEEGVZYA\" description=\"Only need 3 laps in Italy instead of 6\" />\n      <gamegenie code=\"GEEGNZIA\" description=\"Only need 3 laps in Portugal instead of 4\" />\n      <gamegenie code=\"GEEKEZTA\" description=\"Only need 3 laps in Japan instead of 5\" />\n      <gamegenie code=\"GEEKOZTA\" description=\"Only need 3 laps in Australia instead of 5\" />\n      <gamegenie code=\"AEEKXAAO\" description=\"Start with 1/2 normal tire tread\" />\n      <gamegenie code=\"SZSTLEVK\" description=\"Less tire wear\" />\n      <gamegenie code=\"PEOXOZAP\" description=\"Full season ends after South Africa\" />\n      <gamegenie code=\"ZEOXOZAP\" description=\"Full season ends after Mexico\" />\n      <gamegenie code=\"LEOXOZAP\" description=\"Full season ends after Brazil\" />\n      <gamegenie code=\"GEOXOZAP\" description=\"Full season ends after Spain\" />\n      <gamegenie code=\"IEOXOZAP\" description=\"Full season ends after San Marino\" />\n      <gamegenie code=\"TEOXOZAP\" description=\"Full season ends after Monaco\" />\n      <gamegenie code=\"YEOXOZAP\" description=\"Full season ends after Canada\" />\n      <gamegenie code=\"AEOXOZAO\" description=\"Full season ends after France\" />\n      <gamegenie code=\"PEOXOZAO\" description=\"Full season ends after Great Britian\" />\n      <gamegenie code=\"ZEOXOZAO\" description=\"Full season ends after Germany\" />\n      <gamegenie code=\"LEOXOZAO\" description=\"Full season ends after Hungary\" />\n      <gamegenie code=\"GEOXOZAO\" description=\"Full season ends after Belgium\" />\n      <gamegenie code=\"IEOXOZAO\" description=\"Full season ends after Italy\" />\n      <gamegenie code=\"TEOXOZAO\" description=\"Full season ends after Portugal\" />\n      <gamegenie code=\"YEOXOZAO\" description=\"Full season ends after Japan\" />\n      <gamegenie code=\"IVSNIOIN\" description=\"Accelerate faster\" />\n      <gamegenie code=\"IVSNIOIN\" description=\"Accelerate a lot faster (1 of 2)\" />\n      <gamegenie code=\"AAKNALGE\" description=\"Accelerate a lot faster (2 of 2)\" />\n      <gamegenie code=\"ZANKXZYA\" description=\"Only need 1 lap on all tracks (1 of 2)\" />\n      <gamegenie code=\"SXNKSESU\" description=\"Only need 1 lap on all tracks (2 of 2)\" />\n      <gamegenie code=\"SZSTLEVK\" description=\"Almost no tire wear (1 of 2)\" />\n      <gamegenie code=\"SZNNXEVK\" description=\"Almost no tire wear (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-OYPJG\" name=\"Nightmare on Elm Street, A\" crc=\"DA2CB59A\">\n      <gamegenie code=\"EIOLILEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SUUUKNVN\" description=\"Infinite health\" />\n      <gamegenie code=\"SUELSUVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZUPPEVS\" description=\"Infinite 'zzz'\" />\n      <gamegenie code=\"EIVKKYEY\" description=\"One hit kills\" />\n      <gamegenie code=\"AAOKENIA\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"APXGEYEY\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"ASNKKTEY\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"AEOXAPIA\" description=\"No enemies (1 of 3)\" />\n      <gamegenie code=\"OXOZYOSX\" description=\"No enemies (2 of 3)\" />\n      <gamegenie code=\"XVOXPPPE\" description=\"No enemies (3 of 3)\" />\n      <gamegenie code=\"AESSLAEA\" description=\"Don't lose 'zzz' when hit\" />\n      <gamegenie code=\"AAXOLAPA\" description=\"Don't lose 'zzz' when standing still\" />\n      <gamegenie code=\"ZAXOLAPA\" description=\"Lose 'zzz' quicker\" />\n      <gamegenie code=\"IEULIGLA\" description=\"Mega-jumping teenagers\" />\n      <gamegenie code=\"AUKUVPEY\" description=\"Always able to switch characters\" />\n      <gamegenie code=\"ESVLNPEY\" description=\"Have all characters (1 of 2)\" />\n      <gamegenie code=\"ENSUOPEI\" description=\"Have all characters (2 of 2)\" />\n      <gamegenie code=\"SXNTPEVK\" description=\"Freddy will not show up in Nightmare World\" />\n      <gamegenie code=\"PAUVEZLA\" description=\"Start with - 1 continue\" />\n      <gamegenie code=\"TAUVEZLA\" description=\"Start with - 6 continues\" />\n      <gamegenie code=\"PAUVEZLE\" description=\"Start with - 9 continues\" />\n    </game>\n    <game code=\"CLV-H-YWQXE\" name=\"Nightshade\" crc=\"A60CA3D6\">\n      <gamegenie code=\"TKISGT\" description=\"Invincible in fights\" />\n      <gamegenie code=\"TKISAI\" description=\"Invincible out of fights\" />\n    </game>\n    <game code=\"CLV-H-SEAKP\" name=\"Ninja Crusaders\" crc=\"3D1C4894\">\n      <gamegenie code=\"EYSKYAEI\" description=\"Invincibility\" />\n      <gamegenie code=\"GGNKNTEN\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"OSEGEVLP\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"VKEGOVOU\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"GZSXETEY\" description=\"Multi-jump\" />\n      <gamegenie code=\"GZOXLTEL\" description=\"Collect items from anywhere (1 of 2)\" />\n      <gamegenie code=\"GZXXTTEL\" description=\"Collect items from anywhere (2 of 2)\" />\n      <gamegenie code=\"PEOZEALA\" description=\"Start with - 1 life\" />\n      <gamegenie code=\"TEOZEALA\" description=\"Start with - 6 lives\" />\n      <gamegenie code=\"PEOZEALE\" description=\"Start with - 9 lives\" />\n      <gamegenie code=\"SLKKAOVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"IZNXNTZP\" description=\"Mega-jump\" />\n      <gamegenie code=\"SYXESUVN\" description=\"Super speed (1 of 2)\" />\n      <gamegenie code=\"ZAXEULPA\" description=\"Super speed (2 of 2)\" />\n      <gamegenie code=\"PAEPTGAA\" description=\"Start on stage 1-2\" />\n      <gamegenie code=\"ZAEPTGAA\" description=\"Start on stage 2-1\" />\n      <gamegenie code=\"LAEPTGAA\" description=\"Start on stage 2-2\" />\n      <gamegenie code=\"GAEPTGAA\" description=\"Start on stage 3-1\" />\n      <gamegenie code=\"IAEPTGAA\" description=\"Start on stage 3-2\" />\n      <gamegenie code=\"TAEPTGAA\" description=\"Start on stage 4-1\" />\n      <gamegenie code=\"YAEPTGAA\" description=\"Start on stage 4-2\" />\n      <gamegenie code=\"AAEPTGAE\" description=\"Start on stage 5-1\" />\n    </game>\n    <game code=\"CLV-H-UQAOY\" name=\"Ninja Gaiden II: The Dark Sword of Chaos\" crc=\"B780521C\">\n      <gamegenie code=\"SZUGKGAI\" description=\"Invincibility\" />\n      <gamegenie code=\"OPOKUXUG\" description=\"Invincibility (alt)\" />\n      <gamegenie code=\"EANGKGSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SZNGKGSA\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"SXVKLTVG\" description=\"Infinite time\" />\n      <gamegenie code=\"SXXGXAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEKGVTZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEKGVTZA\" description=\"Start with 6 lives (1 of 2)\" />\n      <gamegenie code=\"SEKKKTSP\" description=\"Start with 6 lives (2 of 2)\" />\n      <gamegenie code=\"AEKGVTZE\" description=\"Start with 9 lives (1 of 2)\" />\n      <gamegenie code=\"SEKKKTSP\" description=\"Start with 9 lives (2 of 2)\" />\n      <gamegenie code=\"YAOIYOPE\" description=\"Start every life with two shadow ninjas\" />\n      <gamegenie code=\"LEUOSATA\" description=\"Half-energy from medicine\" />\n      <gamegenie code=\"GEUOSATE\" description=\"Double energy from medicine\" />\n      <gamegenie code=\"GXKKUIVA\" description=\"Never lose Ninja power item\" />\n      <gamegenie code=\"ZEXGYAPA\" description=\"Fast running Ryu (1 of 2)\" />\n      <gamegenie code=\"SNEKYEVN\" description=\"Fast running Ryu (2 of 2)\" />\n      <gamegenie code=\"LEXGYAPA\" description=\"Mega-fast running Ryu (1 of 2)\" />\n      <gamegenie code=\"KNEKYEVN\" description=\"Mega-fast running Ryu (2 of 2)\" />\n      <gamegenie code=\"IAUONEZA\" description=\"Half-energy from Blue Ninja power (1 of 2)\" />\n      <gamegenie code=\"IAKOOEZA\" description=\"Half-energy from Blue Ninja power (2 of 2)\" />\n      <gamegenie code=\"GPUONEZA\" description=\"Double energy from Blue Ninja power (1 of 2)\" />\n      <gamegenie code=\"GPKOOEZA\" description=\"Double energy from Blue Ninja power (2 of 2)\" />\n      <gamegenie code=\"GOEPOEZA\" description=\"Double maximum Ninja power from scroll (1 of 2)\" />\n      <gamegenie code=\"ZEOOEAPA\" description=\"Double maximum Ninja power from scroll (2 of 2)\" />\n      <gamegenie code=\"SVOPXXSN\" description=\"All powers use up only 5 points (1 of 3)\" />\n      <gamegenie code=\"SVOOKXSN\" description=\"All powers use up only 5 points (2 of 3)\" />\n      <gamegenie code=\"SVXOXXSN\" description=\"All powers use up only 5 points (3 of 3)\" />\n      <gamegenie code=\"XXEOSZVZ\" description=\"Infinite Ninja power (1 of 3)\" />\n      <gamegenie code=\"LOEOVXIY\" description=\"Infinite Ninja power (2 of 3)\" />\n      <gamegenie code=\"PUOOSXLK\" description=\"Infinite Ninja power (3 of 3)\" />\n      <gamegenie code=\"AAZVYL\" description=\"Less enemies\" />\n      <gamegenie code=\"EASGAPAP\" description=\"Multi-jump (1 of 8)\" />\n      <gamegenie code=\"GZSGYPEI\" description=\"Multi-jump (2 of 8)\" />\n      <gamegenie code=\"LPKKTOYP\" description=\"Multi-jump (3 of 8)\" />\n      <gamegenie code=\"LPSGZPTE\" description=\"Multi-jump (4 of 8)\" />\n      <gamegenie code=\"SZESEOSE\" description=\"Multi-jump (5 of 8)\" />\n      <gamegenie code=\"SZKKIPEY\" description=\"Multi-jump (6 of 8)\" />\n      <gamegenie code=\"SZNSXOSE\" description=\"Multi-jump (7 of 8)\" />\n      <gamegenie code=\"VXSSIYVA\" description=\"Multi-jump (8 of 8)\" />\n      <gamegenie code=\"AAVKXZUI\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"AEEGOXKL\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"AEOGXXIA\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"ENOKKZEL\" description=\"Hit anywhere (4 of 4)\" />\n    </game>\n    <game code=\"CLV-H-INWGS\" name=\"Ninja Gaiden III: The Ancient Ship of Doom\" crc=\"902E3168\">\n      <gamegenie code=\"AEVPNYLA\" description=\"Invincibility\" />\n      <gamegenie code=\"SXEKVLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZEXILSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SZVZIIVG\" description=\"Infinite time (timer will still countdown)\" />\n      <gamegenie code=\"SXXGNLVG\" description=\"Infinite continues\" />\n      <gamegenie code=\"VPKGXKXY\" description=\"Less time\" />\n      <gamegenie code=\"AEKXTEYA\" description=\"One hit kills\" />\n      <gamegenie code=\"PAXGKGAA\" description=\"Start with upgraded sword (1 of 3)\" />\n      <gamegenie code=\"APXKEGAO\" description=\"Start with upgraded sword (2 of 3)\" />\n      <gamegenie code=\"APXKKGYA\" description=\"Start with upgraded sword (3 of 3)\" />\n      <gamegenie code=\"YYXKEGAO\" description=\"Sword hits several areas of the screen at once (sword upgrade negates the effect) (1 of 2)\" />\n      <gamegenie code=\"YYXKKGYE\" description=\"Sword hits several areas of the screen at once (sword upgrade negates the effect) (2 of 2)\" />\n      <gamegenie code=\"AESPKYPA\" description=\"No power required for Windmill Throwing Star (1 of 2)\" />\n      <gamegenie code=\"AEKOXNZA\" description=\"No power required for Windmill Throwing Star (2 of 2)\" />\n      <gamegenie code=\"AEKOUNAA\" description=\"No power required for Fire Wheel Art (1 of 2)\" />\n      <gamegenie code=\"AESPENAA\" description=\"No power required for Fire Wheel Art (2 of 2)\" />\n      <gamegenie code=\"AEKOVYGP\" description=\"No power required for Invincible Fire Wheel (1 of 2)\" />\n      <gamegenie code=\"AESOEYZA\" description=\"No power required for Invincible Fire Wheel (2 of 2)\" />\n      <gamegenie code=\"AEKOKNAA\" description=\"No power required for Fire Dragon Balls (1 of 2)\" />\n      <gamegenie code=\"AESPONAA\" description=\"No power required for Fire Dragon Balls (2 of 2)\" />\n      <gamegenie code=\"AEKOSNZA\" description=\"No power required for Vacuum Wave Art (1 of 2)\" />\n      <gamegenie code=\"AESPNYPA\" description=\"No power required for Vacuum Wave Art (2 of 2)\" />\n      <gamegenie code=\"AENXOAGP\" description=\"Multi-jump and infinite time (01 of 10)\" />\n      <gamegenie code=\"AZSXGIZL\" description=\"Multi-jump and infinite time (02 of 10)\" />\n      <gamegenie code=\"EPSXZSUA\" description=\"Multi-jump and infinite time (03 of 10)\" />\n      <gamegenie code=\"GXUPZLEL\" description=\"Multi-jump and infinite time (04 of 10)\" />\n      <gamegenie code=\"LASXLIEI\" description=\"Multi-jump and infinite time (05 of 10)\" />\n      <gamegenie code=\"LPSXASNL\" description=\"Multi-jump and infinite time (06 of 10)\" />\n      <gamegenie code=\"OZSXTSNK\" description=\"Multi-jump and infinite time (07 of 10)\" />\n      <gamegenie code=\"SZNXIIVG\" description=\"Multi-jump and infinite time (08 of 10)\" />\n      <gamegenie code=\"XISXIIVK\" description=\"Multi-jump and infinite time (09 of 10)\" />\n      <gamegenie code=\"ZASXPIIE\" description=\"Multi-jump and infinite time (10 of 10)\" />\n      <gamegenie code=\"GAEGVGZA\" description=\"Start with 5 lives\" />\n    </game>\n    <game code=\"CLV-H-HLACS\" name=\"Ninja Kid\" crc=\"02CC3973\">\n      <gamegenie code=\"AAVEZAZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAVEZAZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAVEZAZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZOZUPVG\" description=\"Infinite Feathers\" />\n      <gamegenie code=\"SZXXITVG\" description=\"Infinite Stars\" />\n      <gamegenie code=\"SXNOGGVG\" description=\"Infinite Boomerangs\" />\n      <gamegenie code=\"SXUZZYVG\" description=\"Infinite Fireflames\" />\n      <gamegenie code=\"PAXSXALA\" description=\"1 Feather on pick-up\" />\n      <gamegenie code=\"TAXSXALA\" description=\"6 Feathers on pick-up\" />\n      <gamegenie code=\"ZAXSUAGO\" description=\"10 Stars on pick-up\" />\n      <gamegenie code=\"AZXSUAGO\" description=\"40 Stars on pick-up\" />\n      <gamegenie code=\"ZAXSKAGA\" description=\"1 Boomerang on pick-up\" />\n      <gamegenie code=\"ZAXSSAGO\" description=\"10 Fireflames on pick-up\" />\n      <gamegenie code=\"AZXSSAGO\" description=\"40 Fireflames on pick-up\" />\n      <gamegenie code=\"YAEILNYA\" description=\"Less Invincibility time\" />\n      <gamegenie code=\"AZEILNYE\" description=\"More Invincibility time\" />\n    </game>\n    <game code=\"CLV-H-WVHCU\" name=\"Nintendo World Cup\" crc=\"A22657FA\">\n      <gamegenie code=\"AYXXNXAL\" description=\"More powerful 'normal' shots\" />\n      <gamegenie code=\"PEXLUIAA\" description=\"Faster players\" />\n      <gamegenie code=\"AAUVKZLA\" description=\"1 minute in tournament mode\" />\n      <gamegenie code=\"IAUVKZLA\" description=\"6 minutes in tournament mode\" />\n      <gamegenie code=\"AAUVKZLE\" description=\"9 minutes in tournament mode\" />\n      <gamegenie code=\"AAKTXXPA\" description=\"1 minutes in match mode\" />\n      <gamegenie code=\"ZAKTXXPA\" description=\"3 minutes in match mode\" />\n      <gamegenie code=\"IAKTXXPA\" description=\"6 minutes in match mode\" />\n    </game>\n    <game code=\"CLV-H-SWQSL\" name=\"North &amp; South\" crc=\"AE9F33D0\">\n      <gamegenie code=\"IEUATOPA\" description=\"Cannon has 5 shots\" />\n      <gamegenie code=\"YEUATOPE\" description=\"Cannon has 15 shots\" />\n      <gamegenie code=\"SZXPYUVS\" description=\"Cannon has infinite shots\" />\n      <gamegenie code=\"GXXATOSO\" description=\"No cannons allowed\" />\n      <gamegenie code=\"ZAUAGPGA\" description=\"Only 2 daggers in the fortress\" />\n      <gamegenie code=\"GXXPLKVS\" description=\"Infinite daggers in the fortress\" />\n      <gamegenie code=\"ZAUETOZA\" description=\"2 men in the fortress\" />\n      <gamegenie code=\"IAUETOZA\" description=\"5 men in the fortress\" />\n      <gamegenie code=\"ZASAGOZA\" description=\"2 men on the train\" />\n      <gamegenie code=\"IASAGOZA\" description=\"5 men on the train\" />\n    </game>\n    <game code=\"CLV-H-MFIIB\" name=\"Operation Secret Storm\" crc=\"EA113128\">\n      <gamegenie code=\"OLUVZUOO\" description=\"Infinite lives\" />\n      <gamegenie code=\"SLKVYSOO\" description=\"Infinite Gun ammo\" />\n    </game>\n    <game code=\"CLV-H-PFLCI\" name=\"Operation Wolf: Take no Prisoners\" crc=\"EDC3662B\">\n      <gamegenie code=\"IEVUNSPA\" description=\"Infinite continues\" />\n      <gamegenie code=\"AESSLZTL\" description=\"Never die\" />\n      <gamegenie code=\"PESZIGAA\" description=\"Start on mission 2\" />\n      <gamegenie code=\"ZESZIGAA\" description=\"Start on mission 3\" />\n      <gamegenie code=\"LESZIGAA\" description=\"Start on mission 4\" />\n      <gamegenie code=\"GESZIGAA\" description=\"Start on mission 5\" />\n      <gamegenie code=\"IESZIGAA\" description=\"Start on mission 6\" />\n      <gamegenie code=\"AAVSIIPA\" description=\"Infinite magazines\" />\n      <gamegenie code=\"AAEIATPA\" description=\"Infinite grenades\" />\n      <gamegenie code=\"GANIYIZA\" description=\"Double bullets in each magazine\" />\n      <gamegenie code=\"NNESZALE\" description=\"Heal completely between levels\" />\n      <gamegenie code=\"GANULZZA\" description=\"Grenades inflict double damage\" />\n      <gamegenie code=\"ZAELGPIE\" description=\"Super power drinks\" />\n      <gamegenie code=\"PEVKVYYE\" description=\"Increase magazines (1 of 2)\" />\n      <gamegenie code=\"PAVSIIIE\" description=\"Increase magazines (2 of 2)\" />\n      <gamegenie code=\"PENGXYIE\" description=\"Increase grenades (1 of 2)\" />\n      <gamegenie code=\"PAVSIILE\" description=\"Increase grenades (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BIAIV\" name=\"Overlord\" crc=\"2856111F\">\n      <gamegenie code=\"GPEAPOIE\" description=\"Food not decreased\" />\n      <gamegenie code=\"SXXUKVVK\" description=\"Hover tanks never decrease in battle\" />\n      <gamegenie code=\"SZKOPOVK\" description=\"Ballistic Missiles never decrease in battle\" />\n      <gamegenie code=\"SZSPGOVK\" description=\"Homing Missiles never decrease in battle\" />\n      <gamegenie code=\"NZVUKNNP\" description=\"Enemy starts with 0 Missiles\" />\n      <gamegenie code=\"ESKALPEL\" description=\"Constantly get 9999999 cash on all planets with 1% or higher tax\" />\n      <gamegenie code=\"YYXLIYAE\" description=\"View a planet's stats for high food (1 of 2)\" />\n      <gamegenie code=\"OPXUPNOU\" description=\"View a planet's stats for high food (2 of 2)\" />\n      <gamegenie code=\"YYOLEAAE\" description=\"View a planet's stats for high people (1 of 2)\" />\n      <gamegenie code=\"OPOLKEOU\" description=\"View a planet's stats for high people (2 of 2)\" />\n      <gamegenie code=\"YNKUYYAE\" description=\"View a planet's stats for high energy (1 of 2)\" />\n      <gamegenie code=\"OOSLLNOU\" description=\"View a planet's stats for high energy (2 of 2)\" />\n      <gamegenie code=\"YNEUTYAE\" description=\"View a planet's stats for high fuel (1 of 2)\" />\n      <gamegenie code=\"OOOLZNOU\" description=\"View a planet's stats for high fuel (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-KWZWC\" name=\"P.O.W.: Prisoners of War\" crc=\"75255F88\">\n      <gamegenie code=\"ATVUUZSA\" description=\"Invincibility\" />\n      <gamegenie code=\"OLEUSOSU\" description=\"One hit kills\" />\n      <gamegenie code=\"AENSLPPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"STOLOUON\" description=\"Take less damage when hit from behind\" />\n      <gamegenie code=\"AAVGOTPA\" description=\"Infinite bullets\" />\n      <gamegenie code=\"AESUNALZ\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"GKSUVAEU\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"OUVLEEEK\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"APKGPLAZ\" description=\"Start with half health (1 of 2)\" />\n      <gamegenie code=\"APESYZAZ\" description=\"Start with half health (2 of 2)\" />\n      <gamegenie code=\"GZUUNUSE\" description=\"Keep weapons after dying (1 of 2)\" />\n      <gamegenie code=\"GZSLOSSE\" description=\"Keep weapons after dying (2 of 2)\" />\n      <gamegenie code=\"AEUEIZZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEUEIZZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEUEIZZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"LVUEIZZA\" description=\"Start with 99 lives\" />\n    </game>\n    <game code=\"CLV-H-SDGSH\" name=\"Pac-Mania\" crc=\"E73E7260\">\n      <gamegenie code=\"SZKIOPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"ANTGUN\" description=\"Trapped ghosts\" />\n      <gamegenie code=\"SOLIVA\" description=\"Go through ghosts\" />\n      <gamegenie code=\"PEASNA\" description=\"Ghosts worth 3200 points\" />\n    </game>\n    <game code=\"CLV-H-MODJL\" name=\"Panic Restaurant\" crc=\"435AEEC6\">\n      <gamegenie code=\"ENUPPAEI\" description=\"Invincibility\" />\n      <gamegenie code=\"OZVKGZVK\" description=\"Infinite time\" />\n      <gamegenie code=\"SGVKGZVG\" description=\"Infinite time (alt)\" />\n      <gamegenie code=\"OXVPPAVK\" description=\"Infinite health - except when you fall on spikes\" />\n      <gamegenie code=\"SXVPPAVG\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"AEKPYXVL\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"AEVPGZOZ\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AAEGLUPZ\" description=\"Moon-jump\" />\n      <gamegenie code=\"GASYZGZA\" description=\"Start with 4 hearts\" />\n      <gamegenie code=\"PAOZNIZA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"IAOZNIZA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"SAOSAGVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZOSAGVG\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"TASYZGZA\" description=\"Start with 6 hearts (heart meter will be distorted)\" />\n      <gamegenie code=\"ZASYZGZE\" description=\"Start with 10 hearts (heart meter will be distorted)\" />\n      <gamegenie code=\"ZAOZNIZE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"YAOZNIZE\" description=\"Start with 15 lives\" />\n      <gamegenie code=\"AIVYGGLT\" description=\"Start with 80 on timer - 1st level only (1 of 2)\" />\n      <gamegenie code=\"AIVKXYLT\" description=\"Start with 80 on timer - 1st level only (2 of 2)\" />\n      <gamegenie code=\"TGVYGGLT\" description=\"Start with 70 on timer - 1st level only (1 of 2)\" />\n      <gamegenie code=\"TGVKXYLT\" description=\"Start with 70 on timer - 1st level only (2 of 2)\" />\n      <gamegenie code=\"GLVYGGLV\" description=\"Start with 60 on timer - 1st level only (1 of 2)\" />\n      <gamegenie code=\"GLVKXYLV\" description=\"Start with 60 on timer - 1st level only (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-IJKGU\" name=\"Paperboy\" crc=\"32086826\">\n      <gamegenie code=\"SXSEVZVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAUOEIGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAUOEIGA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"OZNOKAVK\" description=\"Infinite papers\" />\n      <gamegenie code=\"GOXAUOZA\" description=\"Start with 20 papers\" />\n      <gamegenie code=\"GPUONUZA\" description=\"Gain 20 papers on pick-up\" />\n      <gamegenie code=\"APNEOZEO\" description=\"Invincibility against moving objects (1 of 2)\" />\n      <gamegenie code=\"ATNEXZGA\" description=\"Invincibility against moving objects (2 of 2)\" />\n      <gamegenie code=\"SZXOUESE\" description=\"Infinite time in training course\" />\n      <gamegenie code=\"AAKPSGTA\" description=\"Invincibility against non-moving objects\" />\n      <gamegenie code=\"PAKPUPZA\" description=\"Broken windows count as deliveries\" />\n      <gamegenie code=\"ASSOOAEY\" description=\"Deliver from anywhere (must be within range of house) (1 of 2)\" />\n      <gamegenie code=\"YNSOXAAI\" description=\"Deliver from anywhere (must be within range of house) (1 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BTBWS\" name=\"Paperboy 2\" crc=\"3A0965B1\">\n      <gamegenie code=\"PEOUYGIA\" description=\"Start with 1 life - Paperboy only\" />\n      <gamegenie code=\"LEOUYGIA\" description=\"Start with 3 lives - Paperboy only\" />\n      <gamegenie code=\"ZEOUYGIE\" description=\"Start with 10 lives - Paperboy only\" />\n      <gamegenie code=\"AAKEZLPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"YAELGVZE\" description=\"Start with 15 papers\" />\n      <gamegenie code=\"GPELGVZA\" description=\"Start with 20 papers\" />\n      <gamegenie code=\"AEVPNLPA\" description=\"Infinite papers\" />\n      <gamegenie code=\"IEOAEOZA\" description=\"5 papers on pick-up\" />\n      <gamegenie code=\"YEOAEOZE\" description=\"15 papers on pick-up\" />\n      <gamegenie code=\"GOOAEOZA\" description=\"20 papers on pick-up\" />\n    </game>\n    <game code=\"CLV-H-LDAYK\" name=\"Pesterminator\" crc=\"6A483073\">\n      <gamegenie code=\"VXNIIEVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"VVOSPNVG\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-DNZGV\" name=\"Fox's Peter Pan &amp; The Pirates: The Revenge of Captain Hook\" crc=\"20353E63\">\n      <gamegenie code=\"SZOKYLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PENKLGLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TENKLGLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PENKLGLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GASSNZGE\" description=\"Slower flight meter\" />\n      <gamegenie code=\"ZASSNZGA\" description=\"Faster flight meter\" />\n      <gamegenie code=\"SZVSXXVK\" description=\"Infinite flight power\" />\n      <gamegenie code=\"TONGZKZE\" description=\"Start with 30 units of health (1 of 2)\" />\n      <gamegenie code=\"TPXKYUZE\" description=\"Start with 30 units of health (2 of 2)\" />\n      <gamegenie code=\"IENGZKZA\" description=\"Start with 5 units of health (1 of 2)\" />\n      <gamegenie code=\"IAXKYUZA\" description=\"Start with 5 units of health (2 of 2)\" />\n      <gamegenie code=\"ZAOIVAPA\" description=\"Faster flying left and right (1 of 2)\" />\n      <gamegenie code=\"ZAUIUZPA\" description=\"Faster flying left and right (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GMWMR\" name=\"Phantom Fighter\" crc=\"CC37094C\">\n      <gamegenie code=\"SXSZLUSE\" description=\"Infinite health\" />\n      <gamegenie code=\"VTVKEGSA\" description=\"Start with Sacred Sword/Bell/Tonten/Talisman (1 of 2)\" />\n      <gamegenie code=\"KAVKOGNA\" description=\"Start with Sacred Sword (2 of 2)\" />\n      <gamegenie code=\"SAVKOGNA\" description=\"Start with Bell (2 of 2)\" />\n      <gamegenie code=\"UAVKOGNA\" description=\"Start with Tonten (2 of 2)\" />\n      <gamegenie code=\"XAVKOGNA\" description=\"Start with Talisman (2 of 2)\" />\n      <gamegenie code=\"VAVKOGNA\" description=\"Start with X Scrolls (1 of 2)\" />\n      <gamegenie code=\"LASKNGAA\" description=\"Start with 3 Scrolls (2 of 2)\" />\n      <gamegenie code=\"TASKNGAA\" description=\"Start with 6 Scrolls (2 of 2)\" />\n      <gamegenie code=\"OVSZPLSV\" description=\"Take less damage when attacked (1 of 2)\" />\n      <gamegenie code=\"PESZZLAA\" description=\"Take less damage when attacked (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-JRJPZ\" name=\"Pin-Bot\" crc=\"D19ADDEB\">\n      <gamegenie code=\"PANTGZLA\" description=\"Start with only 1 ball\" />\n      <gamegenie code=\"TANTGZLA\" description=\"Start with 6 balls\" />\n      <gamegenie code=\"PANTGZLE\" description=\"Start with 9 balls\" />\n      <gamegenie code=\"OZVVYZVV\" description=\"Infinite balls\" />\n    </game>\n    <game code=\"CLV-H-ZHGHB\" name=\"Pinball\" crc=\"035DC2E9\">\n      <gamegenie code=\"PASGPALA\" description=\"Start with 1 ball\" />\n      <gamegenie code=\"TASGPALA\" description=\"Start with 6 balls\" />\n      <gamegenie code=\"PASGPALE\" description=\"Start with 9 balls\" />\n      <gamegenie code=\"YZSGPALE\" description=\"Start with lots of balls\" />\n      <gamegenie code=\"SUXKLEVS\" description=\"Infinite balls\" />\n    </game>\n    <game code=\"CLV-H-HHSYG\" name=\"Pipe Dream\" crc=\"BCE77871\">\n      <gamegenie code=\"PAOALPLA\" description=\"Start with 1 wrench\" />\n      <gamegenie code=\"TAOALPLA\" description=\"Start with 6 wrenches\" />\n      <gamegenie code=\"PAOALPLE\" description=\"Start with 9 wrenches\" />\n      <gamegenie code=\"SZKTPUVK\" description=\"Infinite wrenches\" />\n      <gamegenie code=\"AAOGZZIA\" description=\"One-way pipes from level 1\" />\n      <gamegenie code=\"IAOGAZLA\" description=\"One-way pipes from level 5\" />\n      <gamegenie code=\"ZAOKPZLE\" description=\"One-way pipes from level 10\" />\n      <gamegenie code=\"KEUAUVSE\" description=\"Tunnels galore\" />\n      <gamegenie code=\"GPKIEGZP\" description=\"Pumps instead of reservoirs\" />\n      <gamegenie code=\"GPKIEGZP\" description=\"Pumps before reservoirs (1 of 2)\" />\n      <gamegenie code=\"ZPKINGGP\" description=\"Pumps before reservoirs (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-WZPGV\" name=\"Platoon\" crc=\"695515A2\">\n      <gamegenie code=\"SXKOZPVG\" description=\"Stage 1 - Infinite grenades\" />\n      <gamegenie code=\"SZSPYAVG\" description=\"Stage 1 - Start with double capacity magazine\" />\n      <gamegenie code=\"AEKESYGE\" description=\"Stage 1 - Double hits\" />\n      <gamegenie code=\"SXKAUYVT\" description=\"Stage 1 - Don't take damage\" />\n      <gamegenie code=\"GAKEAPIA\" description=\"Start on stage 2\" />\n      <gamegenie code=\"SZVAXTVT\" description=\"Stage 2 - Don't take damage\" />\n      <gamegenie code=\"LAEGGATA\" description=\"Start on stage 3\" />\n      <gamegenie code=\"SXKEUZVG\" description=\"Stage 4 - Infinite time\" />\n      <gamegenie code=\"IEVEOPLA\" description=\"Stage 4 - Play with more time\" />\n      <gamegenie code=\"PAKOIPIE\" description=\"Stage 4 - Double hits\" />\n      <gamegenie code=\"ZAKOIPIA\" description=\"Stage 4 - Halve hits\" />\n      <gamegenie code=\"GEXEUPTE\" description=\"Stage 4 - Start with double ammo\" />\n    </game>\n    <game code=\"CLV-H-GIFWG\" name=\"Popeye\" crc=\"70860FCA\">\n      <gamegenie code=\"ATGIYP\" description=\"Invincibility against enemy\" />\n      <gamegenie code=\"ATISTL\" description=\"Invincibility against shots\" />\n      <gamegenie code=\"PAPKNA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAPKNA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAPKNE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-KHTOF\" name=\"Power Blade\" crc=\"5CF536F4\">\n      <gamegenie code=\"OTKESZSV\" description=\"Infinite health\" />\n      <gamegenie code=\"SZSIAAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZKAKXOU\" description=\"Take minimum damage\" />\n      <gamegenie code=\"AZXSAVAU\" description=\"Mega-jump\" />\n      <gamegenie code=\"GZUITAVG\" description=\"Don't lose boomerang strength when you die (1 of 2)\" />\n      <gamegenie code=\"GZVITASA\" description=\"Don't lose boomerang strength when you die (2 of 2)\" />\n      <gamegenie code=\"GZUSGAVG\" description=\"Don't lose multi-boomerangs when you die (1 of 2)\" />\n      <gamegenie code=\"GZVSZASA\" description=\"Don't lose multi-boomerangs when you die (2 of 2)\" />\n      <gamegenie code=\"AEOANGZZ\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"ENEEUGEP\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"AEEIPPPE\" description=\"Press Start to finish the level (don't use on Protect level) (1 of 3)\" />\n      <gamegenie code=\"AOEILOIK\" description=\"Press Start to finish the level (don't use on Protect level) (2 of 3)\" />\n      <gamegenie code=\"AVEIGOOZ\" description=\"Press Start to finish the level (don't use on Protect level) (3 of 3)\" />\n      <gamegenie code=\"YANNLTZA\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"AAXYZYZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAXYZYZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAXYZYZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-NSDHN\" name=\"Power Blade 2\" crc=\"D273B409\">\n      <gamegenie code=\"GZSILAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"OVSLZLSV\" description=\"Infinite health - except for spikes\" />\n      <gamegenie code=\"ATKKXZSZ\" description=\"Infinite time\" />\n      <gamegenie code=\"YPKGNXYU\" description=\"Speed up timer\" />\n      <gamegenie code=\"YYKGNXYU\" description=\"Slow down timer\" />\n      <gamegenie code=\"GXEVXTVG\" description=\"Infinite life tanks\" />\n      <gamegenie code=\"GZEIPLVG\" description=\"Infinite energy tanks\" />\n      <gamegenie code=\"SAKSZZSZ\" description=\"Throw meter doesn't decrease when boomerang is thrown\" />\n      <gamegenie code=\"OVSLZLSV\" description=\"Take minimal damage (1 of 2)\" />\n      <gamegenie code=\"PESLLLAA\" description=\"Take minimal damage (2 of 2)\" />\n      <gamegenie code=\"OZVULSOK\" description=\"Maximum throwing ability on pick-up (1 of 2)\" />\n      <gamegenie code=\"SANLZIVT\" description=\"Maximum throwing ability on pick-up (2 of 2)\" />\n      <gamegenie code=\"YAXTNTLA\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"AEKEPTZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEKEPTZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEKEPTZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-AAXIS\" name=\"Power Punch II\" crc=\"90226E40\">\n      <gamegenie code=\"SZEYXGSA\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-UHDSH\" name=\"Predator\" crc=\"A7DE65E4\">\n      <gamegenie code=\"VASAOASA\" description=\"Invincibility (normal mode) (1 of 2)\" />\n      <gamegenie code=\"OGKKNGVK\" description=\"Invincibility (normal mode) (2 of 2)\" />\n      <gamegenie code=\"VVVAXUVK\" description=\"Infinite health (big mode)\" />\n      <gamegenie code=\"SZNGGXVK\" description=\"Infinite lives in jungle mode\" />\n      <gamegenie code=\"SXXGZOVK\" description=\"Infinite lives in big mode\" />\n      <gamegenie code=\"AAVKGPGE\" description=\"Start with double lives\" />\n      <gamegenie code=\"AVUGVGSA\" description=\"Infinite health in jungle mode\" />\n      <gamegenie code=\"ATEVEISZ\" description=\"Hit anywhere (1 of 5)\" />\n      <gamegenie code=\"ATVTEISZ\" description=\"Hit anywhere (2 of 5)\" />\n      <gamegenie code=\"ATXTOISZ\" description=\"Hit anywhere (3 of 5)\" />\n      <gamegenie code=\"AVNTKGSZ\" description=\"Hit anywhere (4 of 5)\" />\n      <gamegenie code=\"AVOVSISZ\" description=\"Hit anywhere (5 of 5)\" />\n      <gamegenie code=\"AEOETOPE\" description=\"Mega-jumps in jungle mode\" />\n      <gamegenie code=\"NTEENEGE\" description=\"Don't die if you fall down holes (1 of 2)\" />\n      <gamegenie code=\"ATOAEEOZ\" description=\"Don't die if you fall down holes (2 of 2)\" />\n      <gamegenie code=\"LASEOELA\" description=\"Start each life with Laser Rifle (1 of 2)\" />\n      <gamegenie code=\"XLSEUEVX\" description=\"Start each life with Laser Rifle (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ZXVKK\" name=\"Prince of Persia\" crc=\"70CE3771\">\n      <gamegenie code=\"SLXAINSO\" description=\"Infinite health (except for deep sword hit or a long fall)\" />\n      <gamegenie code=\"SZKLIXSE\" description=\"Infinite time\" />\n    </game>\n    <game code=\"CLV-H-IRCFP\" name=\"Pro Sport Hockey\" crc=\"41F9E0AA\">\n      <gamegenie code=\"ZESUZYPA\" description=\"P1 goals worth 2\" />\n      <gamegenie code=\"LESUZYPA\" description=\"P1 goals worth 3\" />\n      <gamegenie code=\"GESUZYPA\" description=\"P1 goals worth 4\" />\n      <gamegenie code=\"IESUZYPA\" description=\"P1 goals worth 5\" />\n      <gamegenie code=\"TESUZYPA\" description=\"P1 goals worth 6\" />\n      <gamegenie code=\"YESUZYPA\" description=\"P1 goals worth 7\" />\n      <gamegenie code=\"AESUZYPE\" description=\"P1 goals worth 8\" />\n      <gamegenie code=\"ZENLZYPA\" description=\"P2 goals worth 2\" />\n      <gamegenie code=\"LENLZYPA\" description=\"P2 goals worth 3\" />\n      <gamegenie code=\"GENLZYPA\" description=\"P2 goals worth 4\" />\n      <gamegenie code=\"IENLZYPA\" description=\"P2 goals worth 5\" />\n      <gamegenie code=\"TENLZYPA\" description=\"P2 goals worth 6\" />\n      <gamegenie code=\"YENLZYPA\" description=\"P2 goals worth 7\" />\n      <gamegenie code=\"AENLZYPE\" description=\"P2 goals worth 8\" />\n      <gamegenie code=\"VVNPTOSE\" description=\"P1 starts with 1 point\" />\n      <gamegenie code=\"VVNOPOSE\" description=\"P2 starts with 1 point\" />\n      <gamegenie code=\"VVNOZPNT\" description=\"P1 starts with X points (1 of 2)\" />\n      <gamegenie code=\"ZENPIPAA\" description=\"P1 starts with 2 points (2 of 2)\" />\n      <gamegenie code=\"GENPIPAA\" description=\"P1 starts with 4 points (2 of 2)\" />\n      <gamegenie code=\"TENPIPAA\" description=\"P1 starts with 6 points (2 of 2)\" />\n      <gamegenie code=\"AENPIPAE\" description=\"P1 starts with 8 points (2 of 2)\" />\n      <gamegenie code=\"ZENPIPAE\" description=\"P1 starts with 10 points (2 of 2)\" />\n      <gamegenie code=\"NVNPYPVT\" description=\"P2 starts with X points (1 of 2)\" />\n      <gamegenie code=\"ZENPIPAA\" description=\"P2 starts with 2 points (2 of 2)\" />\n      <gamegenie code=\"GENPIPAA\" description=\"P2 starts with 4 points (2 of 2)\" />\n      <gamegenie code=\"TENPIPAA\" description=\"P2 starts with 6 points (2 of 2)\" />\n      <gamegenie code=\"AENPIPAE\" description=\"P2 starts with 8 points (2 of 2)\" />\n      <gamegenie code=\"ZENPIPAE\" description=\"P2 starts with 10 points (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-CGAIZ\" name=\"Pro Wrestling\" crc=\"64B710D2\">\n      <gamegenie code=\"NTSTIVLE\" description=\"Infinite health and time (1 of 4)\" />\n      <gamegenie code=\"OZSTGTVS\" description=\"Infinite health and time (2 of 4)\" />\n      <gamegenie code=\"SASTTTEY\" description=\"Infinite health and time (3 of 4)\" />\n      <gamegenie code=\"YTSTYVZA\" description=\"Infinite health and time (4 of 4)\" />\n      <gamegenie code=\"IEETTZGP\" description=\"Only have 5 seconds to get back into ring\" />\n      <gamegenie code=\"ZEETTZGO\" description=\"Only have 10 seconds to get back into ring\" />\n      <gamegenie code=\"TOETTZGO\" description=\"Have 30 seconds to get back into ring\" />\n      <gamegenie code=\"PEXIKYIA\" description=\"Rounds are only 1 minute\" />\n      <gamegenie code=\"LEXIKYIA\" description=\"Rounds are only 3 minutes\" />\n      <gamegenie code=\"AEXIKYIE\" description=\"Rounds are 8 minutes\" />\n      <gamegenie code=\"ZEXIKYIE\" description=\"Rounds are 10 minutes\" />\n      <gamegenie code=\"ZAVVTGLA\" description=\"2-second pin count\" />\n      <gamegenie code=\"IAVVTGLA\" description=\"5-second pin count\" />\n      <gamegenie code=\"YAVVTGLA\" description=\"7-second pin count\" />\n    </game>\n    <game code=\"CLV-H-SAMDP\" name=\"Punisher, The\" crc=\"27F8D0D2\">\n      <gamegenie code=\"ESKTGGEY\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"EVKTTKXK\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SZNZKOSE\" description=\"Infinite health (1 of 3)\" />\n      <gamegenie code=\"SZUZPVSE\" description=\"Infinite health (2 of 3)\" />\n      <gamegenie code=\"VZKZNOVE\" description=\"Infinite health (3 of 3)\" />\n      <gamegenie code=\"XTSVSNXK\" description=\"Infinite Grenades\" />\n      <gamegenie code=\"AESYAPPA\" description=\"Infinite bullets and Rockets\" />\n      <gamegenie code=\"AANZGXAZ\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"AAOXYXIA\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"AAXXAKPA\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"AAXXZPZL\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"XVOVGXXK\" description=\"Never lose a life against normal enemy\" />\n      <gamegenie code=\"XVOEXOXK\" description=\"Never lose a life against end of level enemy\" />\n      <gamegenie code=\"GEUUYIZA\" description=\"Faster Punisher\" />\n      <gamegenie code=\"PEUYNLAA\" description=\"150 Machine Gun bullets\" />\n      <gamegenie code=\"PEUNXLAA\" description=\"150 Assault Rifle bullets on pick-up\" />\n      <gamegenie code=\"AAEUUPAO\" description=\"Less health on pick-up\" />\n      <gamegenie code=\"APEUUPAO\" description=\"More health on pick-up\" />\n      <gamegenie code=\"PANVGGAA\" description=\"Stage scrolls 2x as fast\" />\n      <gamegenie code=\"ZANVGGAA\" description=\"Stage scrolls 3x as fast\" />\n      <gamegenie code=\"LANVGGAA\" description=\"Stage scrolls 4x as fast\" />\n      <gamegenie code=\"PEOTYTIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"ZEOTYTIE\" description=\"Start with 10 lives\" />\n    </game>\n    <game code=\"CLV-H-OTDHS\" name=\"Puss 'n Boots: Pero's Great Adventure\" crc=\"6E0EB43E\">\n      <gamegenie code=\"SZNGOISA\" description=\"Infinite health\" />\n      <gamegenie code=\"PEOGZALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEOGZALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEOGZALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZOKZZVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"GOSTNUAU\" description=\"Start with less health\" />\n      <gamegenie code=\"GAEGAIAA\" description=\"Start on stage 1\" />\n      <gamegenie code=\"PAEGAIAE\" description=\"Start on stage 2\" />\n      <gamegenie code=\"TAEGAIAE\" description=\"Start on stage 3\" />\n      <gamegenie code=\"AAXGNUPA\" description=\"Mega-jump\" />\n      <gamegenie code=\"AAOVNENY\" description=\"Auto-fire and auto-jump\" />\n    </game>\n    <game code=\"CLV-H-PLCEW\" name=\"Puzznic\" crc=\"EB61133B\">\n      <gamegenie code=\"AAUXITIA\" description=\"Press A to destroy blocks (1 of 2)\" />\n      <gamegenie code=\"AAUXPTKP\" description=\"Press A to destroy blocks (2 of 2)\" />\n      <gamegenie code=\"ITKIPXGL\" description=\"Slower timer\" />\n      <gamegenie code=\"TPKIPXGU\" description=\"Faster timer\" />\n      <gamegenie code=\"ZEUAIPAE\" description=\"Start on level 2-1\" />\n      <gamegenie code=\"GOUAIPAA\" description=\"Start on level 3-1\" />\n      <gamegenie code=\"TOUAIPAE\" description=\"Start on level 4-1\" />\n      <gamegenie code=\"AXUAIPAE\" description=\"Start on level 5-1\" />\n      <gamegenie code=\"ZUUAIPAA\" description=\"Start on level 6-1\" />\n      <gamegenie code=\"GUUAIPAE\" description=\"Start on level 7-1\" />\n      <gamegenie code=\"TKUAIPAA\" description=\"Start on level 8-1\" />\n      <gamegenie code=\"ASUAIPAA\" description=\"Start on level 9-1\" />\n    </game>\n    <game code=\"CLV-H-ANFQP\" name=\"Q*bert\" crc=\"C0B23520\">\n      <gamegenie code=\"OZKGZPSX\" description=\"Clear level automatically\" />\n      <gamegenie code=\"SXSZGPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AESPVGAE\" description=\"Start on level 3\" />\n      <gamegenie code=\"GOSPVGAA\" description=\"Start on level 6\" />\n      <gamegenie code=\"AXSPVGAA\" description=\"Start on level 9\" />\n      <gamegenie code=\"PEUOOGIA\" description=\"Start with 1 life (1 of 2)\" />\n      <gamegenie code=\"PAXZLLIA\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"ZAXZLLIE\" description=\"Start with 10 lives (1 of 2)\" />\n      <gamegenie code=\"ZEUOOGIE\" description=\"Start with 10 lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-AOJTG\" name=\"Qix\" crc=\"95E4E594\">\n      <gamegenie code=\"PEEAPZGA\" description=\"1 life - 1P\" />\n      <gamegenie code=\"PEEEAZGA\" description=\"1 life - 2P\" />\n      <gamegenie code=\"IANAZZPA\" description=\"Start on Level 5 - 1P game\" />\n      <gamegenie code=\"ZANAZZPE\" description=\"Start on Level 10 - 1P game\" />\n      <gamegenie code=\"GPNAZZPA\" description=\"Start on Level 20 - 1P game\" />\n      <gamegenie code=\"IEEEGZPA\" description=\"Start on Level 5 - 2P game\" />\n      <gamegenie code=\"ZEEEGZPE\" description=\"Start on Level 10 - 2P game\" />\n      <gamegenie code=\"GOEEGZPA\" description=\"Start on Level 20 - 2P game\" />\n    </game>\n    <game code=\"CLV-H-WUNCM\" name=\"Quattro Adventure (Unl) [!p]\" crc=\"6C040686\">\n      <gamegenie code=\"TAOGPTLA\" description=\"Boomerang Kid - Start with 6 lives\" />\n      <gamegenie code=\"SZOGXVVK\" description=\"Boomerang Kid - Infinite lives\" />\n      <gamegenie code=\"PEKGGLLE\" description=\"Linus Spacehead - Start with 9 lives\" />\n      <gamegenie code=\"AZKKPNAP\" description=\"Linus Spacehead - Increase oxygen\" />\n      <gamegenie code=\"AEULZIPA\" description=\"Linus Spacehead - Never lose oxygen\" />\n      <gamegenie code=\"SXEGLYVG\" description=\"Linus Spacehead - Never lose life in the water\" />\n      <gamegenie code=\"SZXIILVG\" description=\"Linus Spacehead - Never lose life in the land\" />\n      <gamegenie code=\"PAVGILLA\" description=\"Super Robin Hood - Start with 1 life\" />\n      <gamegenie code=\"TAVGILLA\" description=\"Super Robin Hood - Start with 6 lives\" />\n      <gamegenie code=\"PAVGILLE\" description=\"Super Robin Hood - Start with 9 lives\" />\n      <gamegenie code=\"SXNKZIVG\" description=\"Super Robin Hood - Infinite lives\" />\n      <gamegenie code=\"AVONISPG\" description=\"Super Robin Hood - Become invincible\" />\n      <gamegenie code=\"PAEGLTLE\" description=\"Super Robin Hood - 9 energy hearts, you may lose some hearts when you pick up new ones\" />\n      <gamegenie code=\"PEXSZYAA\" description=\"Treasure Island Dizzy - Invincible Dizzy (walk left to arrive at the original starting point)\" />\n      <gamegenie code=\"OZNTKASX\" description=\"Treasure Island Dizzy - Walk backwards\" />\n      <gamegenie code=\"PEUSYYAA\" description=\"Treasure Island Dizzy - Start with snorkel\" />\n      <gamegenie code=\"PEUSYYAA\" description=\"Treasure Island Dizzy - Start with axe (1 of 2)\" />\n      <gamegenie code=\"PEKNIZZP\" description=\"Treasure Island Dizzy - Start with axe (2 of 2)\" />\n      <gamegenie code=\"PEUSYYAA\" description=\"Treasure Island Dizzy - Start with dynamite (1 of 2)\" />\n      <gamegenie code=\"ZEKNIZZP\" description=\"Treasure Island Dizzy - Start with dynamite (2 of 2)\" />\n      <gamegenie code=\"PEUSYYAA\" description=\"Treasure Island Dizzy - Start with heavy weight (1 of 2)\" />\n      <gamegenie code=\"IEKNIZZP\" description=\"Treasure Island Dizzy - Start with heavy weight (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-DZMGO\" name=\"Quattro Arcade\" crc=\"792070A9\">\n      <gamegenie code=\"PAVGZILA\" description=\"Go! Dizzy Go! - Start with 1 life\" />\n      <gamegenie code=\"TAVGZILA\" description=\"Go! Dizzy Go! - Start with 6 lives\" />\n      <gamegenie code=\"PAVGZILE\" description=\"Go! Dizzy Go! - Start with 9 lives\" />\n      <gamegenie code=\"ZEEKGIPA\" description=\"Go! Dizzy Go! - Start on world 1, stage 3\" />\n      <gamegenie code=\"GEEKGIPA\" description=\"Go! Dizzy Go! - Start on world 1, stage 5\" />\n      <gamegenie code=\"TEEKGIPA\" description=\"Go! Dizzy Go! - Start on world 2, stage 2\" />\n      <gamegenie code=\"AEEKGIPE\" description=\"Go! Dizzy Go! - Start on world 2, stage 4\" />\n      <gamegenie code=\"AOEKGIPA\" description=\"Go! Dizzy Go! - Start on world 4, stage 2\" />\n      <gamegenie code=\"ZOEKGIPA\" description=\"Go! Dizzy Go! - Start on world 4, stage 4\" />\n      <gamegenie code=\"GOEKGIPA\" description=\"Go! Dizzy Go! - Start on world 5, stage 1\" />\n      <gamegenie code=\"TOEKGIPA\" description=\"Go! Dizzy Go! - Start on world 5, stage 3\" />\n      <gamegenie code=\"AOEKGIPE\" description=\"Go! Dizzy Go! - Start on world 5, stage 5\" />\n      <gamegenie code=\"XVTISU\" description=\"Go! Dizzy Go! - Always kill monsters (1 of 2)\" />\n      <gamegenie code=\"XVTIVU\" description=\"Go! Dizzy Go! - Always kill monsters (2 of 2)\" />\n      <gamegenie code=\"XVTILU\" description=\"Go! Dizzy Go! - Walk through walls\" />\n      <gamegenie code=\"PAKVXGLA\" description=\"Stunt Buggies - Start with 1 life\" />\n      <gamegenie code=\"TAKVXGLA\" description=\"Stunt Buggies - Start with 6 lives\" />\n      <gamegenie code=\"PAKVXGLE\" description=\"Stunt Buggies - Start with 9 lives\" />\n      <gamegenie code=\"SXOXZEVK\" description=\"Stunt Buggies - Infinite lives\" />\n      <gamegenie code=\"PEUGEALA\" description=\"F-16 Renegade - Start with 2 lives - 1P game\" />\n      <gamegenie code=\"TEUGEALA\" description=\"F-16 Renegade - Start with 7 lives - 1P game\" />\n      <gamegenie code=\"PEUGEALE\" description=\"F-16 Renegade - Start with 10 lives - 1P game\" />\n      <gamegenie code=\"LEUGSAPA\" description=\"F-16 Renegade - Start on level 3 (1 of 2)\" />\n      <gamegenie code=\"PEKGXAAA\" description=\"F-16 Renegade - Start on level 3 (2 of 2)\" />\n      <gamegenie code=\"IEUGSAPA\" description=\"F-16 Renegade - Start on level 5 (1 of 2)\" />\n      <gamegenie code=\"ZEKGXAAA\" description=\"F-16 Renegade - Start on level 5 (2 of 2)\" />\n      <gamegenie code=\"YEUGSAPA\" description=\"F-16 Renegade - Start on level 7 (1 of 2)\" />\n      <gamegenie code=\"LEKGXAAA\" description=\"F-16 Renegade - Start on level 7 (2 of 2)\" />\n      <gamegenie code=\"PEUGSAPE\" description=\"F-16 Renegade - Start on level 9 (1 of 2)\" />\n      <gamegenie code=\"GEKGXAAA\" description=\"F-16 Renegade - Start on level 9 (2 of 2)\" />\n      <gamegenie code=\"PASTSVPA\" description=\"C.J.'s Elephant Antics - Start with 1 life\" />\n      <gamegenie code=\"IASTSVPA\" description=\"C.J.'s Elephant Antics - Start with 5 lives\" />\n      <gamegenie code=\"YASTSVPE\" description=\"C.J.'s Elephant Antics - Start with 15 lives\" />\n      <gamegenie code=\"GPSTSVPA\" description=\"C.J.'s Elephant Antics - Start with 20 lives\" />\n      <gamegenie code=\"SUKTZUVS\" description=\"C.J.'s Elephant Antics - Infinite lives\" />\n      <gamegenie code=\"PAEYOAAA\" description=\"C.J.'s Elephant Antics - Start in Switzerland\" />\n      <gamegenie code=\"ZAEYOAAA\" description=\"C.J.'s Elephant Antics - Start in Egypt\" />\n      <gamegenie code=\"LAEYOAAA\" description=\"C.J.'s Elephant Antics - Start in Africa\" />\n      <gamegenie code=\"PAONILAA\" description=\"C.J.'s Elephant Antics - Always run fast after losing all lives\" />\n      <gamegenie code=\"YAONILAE\" description=\"C.J.'s Elephant Antics - Super C.J. after losing all lives\" />\n    </game>\n    <game code=\"CLV-H-GCYRD\" name=\"R.B.I. Baseball\" crc=\"3C5C81D4\">\n      <gamegenie code=\"AOVLSLEI\" description=\"All missed pitches are strikes - both players\" />\n      <gamegenie code=\"EYONXZAL\" description=\"Auto fielding (2 of 3)\" />\n      <gamegenie code=\"YAONUZLO\" description=\"Auto fielding (3 of 3)\" />\n      <gamegenie code=\"AESNXXPA\" description=\"Auto fielding (1 of 3)\" />\n    </game>\n    <game code=\"CLV-H-QYYYE\" name=\"R.C. Pro-Am\" crc=\"AAED295C\">\n      <gamegenie code=\"GEUGAPPA\" description=\"Max turbo on first pick-up\" />\n      <gamegenie code=\"GEKKGPPA\" description=\"Max tires on first pick-up\" />\n      <gamegenie code=\"GAVGIPPA\" description=\"Max speed on first pick-up\" />\n      <gamegenie code=\"ZEUGAPPA\" description=\"Double turbo on first pick-up\" />\n      <gamegenie code=\"ZEKKGPPA\" description=\"Double tires on first pick-up\" />\n      <gamegenie code=\"ZAVGIPPA\" description=\"Double speed on first pick-up\" />\n      <gamegenie code=\"SXVLGZAK\" description=\"Computer cars go crazy\" />\n      <gamegenie code=\"AAEIPPPA\" description=\"Infinite continues\" />\n    </game>\n    <game code=\"CLV-H-LCQKT\" name=\"R.C. Pro-Am II\" crc=\"9EDD2159\">\n      <gamegenie code=\"AESOLAZA\" description=\"Start with 1 credit instead of 3\" />\n      <gamegenie code=\"GESOLAZA\" description=\"Start with 5 credits\" />\n      <gamegenie code=\"TESOLAZA\" description=\"Start with 7 credits\" />\n      <gamegenie code=\"AESOLAZE\" description=\"Start with 9 credits\" />\n      <gamegenie code=\"SUEEGXVS\" description=\"Infinite credits\" />\n      <gamegenie code=\"ATUXYGSZ\" description=\"Items in the Model Shop are free if you have enough money\" />\n      <gamegenie code=\"PEETEOEG\" description=\"Buckshot costs 10 instead of 2,000\" />\n      <gamegenie code=\"AEEVUPYA\" description=\"Mega Pulse costs 2,080 instead of 20,000\" />\n      <gamegenie code=\"AANTSPIA\" description=\"Scoopers costs 2,200 instead of 15,000\" />\n      <gamegenie code=\"AANTUPLA\" description=\"Dynafit tires costs 2,320 instead of 10,000\" />\n      <gamegenie code=\"AAVVUPLP\" description=\"Mega Motor costs 1,360 instead of 50,000\" />\n      <gamegenie code=\"AAVVOOLA\" description=\"Hyper Motor costs 1,840 instead of 30,000\" />\n      <gamegenie code=\"AEEVOPIA\" description=\"Freeze costs 2,200 instead of 15,000\" />\n      <gamegenie code=\"AEETNPIA\" description=\"Lazer costs 1,200 instead of 14,000\" />\n      <gamegenie code=\"AEETSPGA\" description=\"Bombs costs 1,760 instead of 12,000\" />\n      <gamegenie code=\"AANTOPZA\" description=\"Nobbies costs 1,880 instead of 7,000\" />\n      <gamegenie code=\"AEETUPLA\" description=\"Missile costs 2,320 instead of 10,000\" />\n      <gamegenie code=\"PANVKPGT\" description=\"Nitro costs 10 instead of 1000\" />\n      <gamegenie code=\"PANVXPZL\" description=\"Oil slicks costs 10 instead of 500\" />\n      <gamegenie code=\"PAVVVOEG\" description=\"Skinny tires costs 10 instead of 2,000\" />\n      <gamegenie code=\"AAVTNPTA\" description=\"Gold Motor costs 10 instead of 16,000 (1 of 2)\" />\n      <gamegenie code=\"PAVTVPAG\" description=\"Gold Motor costs 10 instead of 16,000 (2 of 2)\" />\n      <gamegenie code=\"PEOGNTAA\" description=\"Start on Track 02\" />\n      <gamegenie code=\"ZEOGNTAA\" description=\"Start on Track 03\" />\n      <gamegenie code=\"LEOGNTAA\" description=\"Start on Track 04\" />\n      <gamegenie code=\"GEOGNTAA\" description=\"Start on Track 05\" />\n      <gamegenie code=\"IEOGNTAA\" description=\"Start on Track 06\" />\n      <gamegenie code=\"TEOGNTAA\" description=\"Start on Track 07\" />\n      <gamegenie code=\"YEOGNTAA\" description=\"Start on Track 08\" />\n      <gamegenie code=\"PEOGNTAE\" description=\"Start on Track 09\" />\n      <gamegenie code=\"ZEOGNTAE\" description=\"Start on Track 10\" />\n      <gamegenie code=\"LEOGNTAE\" description=\"Start on Track 11\" />\n      <gamegenie code=\"GEOGNTAE\" description=\"Start on Track 12\" />\n      <gamegenie code=\"IEOGNTAE\" description=\"Start on Track 13\" />\n      <gamegenie code=\"TEOGNTAE\" description=\"Start on Track 14\" />\n      <gamegenie code=\"YEOGNTAE\" description=\"Start on Track 15\" />\n      <gamegenie code=\"AOOGNTAA\" description=\"Start on Track 16\" />\n      <gamegenie code=\"ZOOGNTAA\" description=\"Start on Track 17\" />\n      <gamegenie code=\"LOOGNTAA\" description=\"Start on Track 18\" />\n      <gamegenie code=\"GOOGNTAA\" description=\"Start on Track 19\" />\n      <gamegenie code=\"IOOGNTAA\" description=\"Start on Track 20\" />\n      <gamegenie code=\"TOOGNTAA\" description=\"Start on Track 21\" />\n      <gamegenie code=\"YOOGNTAA\" description=\"Start on Track 22\" />\n      <gamegenie code=\"AOOGNTAE\" description=\"Start on Track 23\" />\n      <gamegenie code=\"POOGNTAE\" description=\"Start on Track 24\" />\n      <gamegenie code=\"LOOGNTAE\" description=\"Start on Track 25\" />\n      <gamegenie code=\"GOOGNTAE\" description=\"Start on Track 26\" />\n      <gamegenie code=\"IOOGNTAE\" description=\"Start on Track 27\" />\n      <gamegenie code=\"TOOGNTAE\" description=\"Start on Track 28\" />\n      <gamegenie code=\"YOOGNTAE\" description=\"Start on Track 29\" />\n      <gamegenie code=\"AEOGNTAE\" description=\"Start on first Tug-O-Truck Challenge\" />\n      <gamegenie code=\"POOGNTAA\" description=\"Start on Drag Race\" />\n      <gamegenie code=\"ZOOGNTAE\" description=\"Start on second Tug-O-Truck Challenge\" />\n      <gamegenie code=\"SXKVLVVS\" description=\"Infinite Lazers on purchase\" />\n      <gamegenie code=\"SXSTZKVS\" description=\"Infinite Bombs on purchase\" />\n      <gamegenie code=\"SXOVGVVS\" description=\"Infinite Freezes on purchase\" />\n      <gamegenie code=\"SZXVGSVS\" description=\"Infinite Buckshot on purchase\" />\n      <gamegenie code=\"SZSTTSVS\" description=\"Infinite Missiles on purchase\" />\n    </game>\n    <game code=\"CLV-H-OQEXV\" name=\"Race America, Alex DeMeo's\" crc=\"A8B0DA56\">\n      <gamegenie code=\"SGSUGLVI\" description=\"Can't down shift\" />\n      <gamegenie code=\"IAVUILYA\" description=\"Cars only have 4 gears (1 of 2)\" />\n      <gamegenie code=\"IAKXAIYA\" description=\"Cars only have 4 gears (2 of 2)\" />\n      <gamegenie code=\"OZNOAAEN\" description=\"Go super fast in 6th gear (1 of 3)\" />\n      <gamegenie code=\"NYNOPAIE\" description=\"Go super fast in 6th gear (2 of 3)\" />\n      <gamegenie code=\"SAXPGZVT\" description=\"Go super fast in 6th gear (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-YILIX\" name=\"Rad Racer\" crc=\"8B9D3E9C\">\n      <gamegenie code=\"AAKSYIPA\" description=\"Never crash from things outside of the road\" />\n      <gamegenie code=\"NYZINV\" description=\"Infinite time\" />\n      <gamegenie code=\"GZXIUVIZ\" description=\"Less time to finish each stage\" />\n      <gamegenie code=\"GLXIUVIX\" description=\"More time to finish each stage\" />\n      <gamegenie code=\"ALXGAIAA\" description=\"Turbo acceleration\" />\n      <gamegenie code=\"YYUKGIAU\" description=\"Super Turbo acceleration\" />\n      <gamegenie code=\"PEEGPIAA\" description=\"Ultra Turbo acceleration\" />\n      <gamegenie code=\"GXKGKTSA\" description=\"Start on stage XX (disable after loading stage) (1 of 2)\" />\n      <gamegenie code=\"PAXKPAAA\" description=\"Start on stage 2 (disable after loading stage) (2 of 2)\" />\n      <gamegenie code=\"ZAXKPAAA\" description=\"Start on stage 3 (disable after loading stage) (2 of 2)\" />\n      <gamegenie code=\"LAXKPAAA\" description=\"Start on stage 4 (disable after loading stage) (2 of 2)\" />\n      <gamegenie code=\"GAXKPAAA\" description=\"Start on stage 5 (disable after loading stage) (2 of 2)\" />\n      <gamegenie code=\"IAXKPAAA\" description=\"Start on stage 6 (disable after loading stage) (2 of 2)\" />\n      <gamegenie code=\"TAXKPAAA\" description=\"Start on stage 7 (disable after loading stage) (2 of 2)\" />\n      <gamegenie code=\"YAXKPAAA\" description=\"Start on stage 8 (disable after loading stage) (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SUPAU\" name=\"Raid 2020\" crc=\"61253D1C\">\n      <gamegenie code=\"SXSSESVK\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SZKSVSVK\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"SXVSIVVK\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-MNFTW\" name=\"Raid on Bungeling Bay\" crc=\"D308D52C\">\n      <gamegenie code=\"PENGZYIE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PENGZYIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"SXSIASVK\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"SXVVPIAX\" description=\"Infinite Damage\" />\n      <gamegenie code=\"LEVKTYPA\" description=\"Start on round 3\" />\n      <gamegenie code=\"TEVKTYPA\" description=\"Start on round 6\" />\n      <gamegenie code=\"PEVKTYPE\" description=\"Start on round 9\" />\n      <gamegenie code=\"AZOIIEGX\" description=\"Can only carry 5 bombs\" />\n    </game>\n    <game code=\"CLV-H-CNJWY\" name=\"Rally Bike\" crc=\"E1C41D7C\">\n      <gamegenie code=\"SIUKLUVV\" description=\"Infinite gas\" />\n      <gamegenie code=\"PAUIKTIA\" description=\"Start with 1 life - 1P game\" />\n      <gamegenie code=\"ZAUIKTIE\" description=\"Start with 10 lives - 1P game\" />\n      <gamegenie code=\"SZEITKVV\" description=\"Infinite lives - 1P game\" />\n      <gamegenie code=\"SZOSIKVN\" description=\"Infinite lives - 2P game, both players\" />\n      <gamegenie code=\"PAUIKITA\" description=\"Start with 1 life - 2P game, both players (1 of 2)\" />\n      <gamegenie code=\"ZAXSTGTA\" description=\"Start with 1 life - 2P game, both players (2 of 2)\" />\n      <gamegenie code=\"ZAUIKTIE\" description=\"Start with 10 lives - 2P game, both players (1 of 2)\" />\n      <gamegenie code=\"LAXSTGIE\" description=\"Start with 10 lives - 2P game, both players (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FNKVZ\" name=\"Rambo\" crc=\"4F9DBBE5\">\n      <gamegenie code=\"ATOSXISL\" description=\"Invincibility\" />\n      <gamegenie code=\"GOXTZXZA\" description=\"Gain double amount on pick-up\" />\n      <gamegenie code=\"GNXTZXZA\" description=\"Gain maximum amount on pick-up\" />\n      <gamegenie code=\"SXOVXKVS\" description=\"Infinite weapons\" />\n      <gamegenie code=\"AEVSNOZL\" description=\"Hit anywhere\" />\n      <gamegenie code=\"IPNEITPP\" description=\"Start with Hand Grenades (1 of 2)\" />\n      <gamegenie code=\"IOEALTPP\" description=\"Start with Hand Grenades (2 of 2)\" />\n      <gamegenie code=\"ZEEEITIA\" description=\"Start with 2 Medicine Bottles\" />\n      <gamegenie code=\"ZVEEITIA\" description=\"Start with 9 Medicine Bottles\" />\n    </game>\n    <game code=\"CLV-H-OLOVN\" name=\"Rampage\" crc=\"263AC8A0\">\n      <gamegenie code=\"NYSGLUYN\" description=\"More health - P1\" />\n      <gamegenie code=\"NYVKTUYN\" description=\"More health - P2\" />\n      <gamegenie code=\"YLSGLUYN\" description=\"Less health - P1\" />\n      <gamegenie code=\"YLVKTUYN\" description=\"Less health - P2\" />\n      <gamegenie code=\"NNNGKNYN\" description=\"More health after continue - both players\" />\n      <gamegenie code=\"YUNGKNYN\" description=\"Less health after continue - both players\" />\n      <gamegenie code=\"AEXLPGAP\" description=\"No harm from falling\" />\n      <gamegenie code=\"GXXLALOP\" description=\"No harm from attacks or bad food\" />\n      <gamegenie code=\"AXXLPGAP\" description=\"More damage done from falling\" />\n      <gamegenie code=\"GEULLLIA\" description=\"Double health from food\" />\n      <gamegenie code=\"AEULLLIA\" description=\"Half health from food (1 of 2)\" />\n      <gamegenie code=\"ZKULTUZE\" description=\"Half health from food (2 of 2)\" />\n      <gamegenie code=\"AAOUOPPA\" description=\"No harm from water (1 of 2)\" />\n      <gamegenie code=\"AASLSPPA\" description=\"No harm from water (2 of 2)\" />\n      <gamegenie code=\"EEKXYPIA\" description=\"One hit to destroy buildings\" />\n      <gamegenie code=\"ASSZGTEY\" description=\"Buildings collapse faster (1 of 2)\" />\n      <gamegenie code=\"IOOZUXIA\" description=\"Buildings collapse faster (2 of 2)\" />\n      <gamegenie code=\"ASUTPIEL\" description=\"Buildings collapse automatically\" />\n    </game>\n    <game code=\"CLV-H-NGIZS\" name=\"Ren &amp; Stimpy Show, The: Buckeroo$!\" crc=\"E98AB943\">\n      <gamegenie code=\"NYOYXLYE\" description=\"Infinite health\" />\n      <gamegenie code=\"NYUVOZTE\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEUAPZLA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"IEUAPZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"YEUAPZLA\" description=\"Start with 8 lives\" />\n      <gamegenie code=\"PEUAPZLE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"VNXELSSO\" description=\"Start with $11 instead of 0\" />\n      <gamegenie code=\"OUEAXXOO\" description=\"Infinite collectibles\" />\n      <gamegenie code=\"YPEYOUGU\" description=\"Shorter invincibility after getting hit\" />\n      <gamegenie code=\"ITEYOUGL\" description=\"Longer invincibility after getting hit\" />\n      <gamegenie code=\"ZAXNPZIA\" description=\"2 custard pies on pick-up\" />\n      <gamegenie code=\"PAXNPZIE\" description=\"9 custard pies on pick-up\" />\n      <gamegenie code=\"OZEEPYES\" description=\"Start on XX level (1 of 2)\" />\n      <gamegenie code=\"PAEEZYZZ\" description=\"Start on Rescue the Maiden/Out West levels (2 of 3)\" />\n      <gamegenie code=\"SAEELNVV\" description=\"Start on Out West/Robin Hoek levels (3 of 3)\" />\n      <gamegenie code=\"ZAEEZYZZ\" description=\"Start on Robin Hoek level (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-JORLR\" name=\"Renegade\" crc=\"A0568E1D\">\n      <gamegenie code=\"AVSTEXPT\" description=\"Infinite health (1 of 5)\" />\n      <gamegenie code=\"INKVNXAO\" description=\"Infinite health (2 of 5)\" />\n      <gamegenie code=\"LUKVSZPY\" description=\"Infinite health (3 of 5)\" />\n      <gamegenie code=\"OXKVKXSX\" description=\"Infinite health (4 of 5)\" />\n      <gamegenie code=\"SEKVVZGA\" description=\"Infinite health (5 of 5)\" />\n      <gamegenie code=\"SXUIOTVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEOSLYZA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"IEOSLYZA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"AEOSLYZE\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"AIUOZUAZ\" description=\"Start with a super energy boost\" />\n      <gamegenie code=\"PEXSYYAA\" description=\"Start on mission 2\" />\n      <gamegenie code=\"ZEXSYYAA\" description=\"Start on mission 3\" />\n      <gamegenie code=\"LEXSYYAA\" description=\"Start on mission 4\" />\n      <gamegenie code=\"TOSVOXTU\" description=\"Timer runs faster\" />\n      <gamegenie code=\"EXSVOXTL\" description=\"Timer runs slower\" />\n    </game>\n    <game code=\"CLV-H-KWJAL\" name=\"Ring King\" crc=\"5BB62688\">\n      <gamegenie code=\"GZEIPVVK\" description=\"Unlimited power points - 1P game\" />\n      <gamegenie code=\"GXKZXYOP\" description=\"Don't lose stamina from fighting\" />\n      <gamegenie code=\"LEOSLYTA\" description=\"Rounds are 30 seconds\" />\n      <gamegenie code=\"PEOSLYTE\" description=\"Rounds are 90 seconds\" />\n      <gamegenie code=\"GXOZOIOP\" description=\"Players can't hurt each other\" />\n    </game>\n    <game code=\"CLV-H-UXDJW\" name=\"River City Ransom\" crc=\"E9C387EC\">\n      <gamegenie code=\"SUNEUKSO\" description=\"Infinite lives\" />\n      <gamegenie code=\"LVSNAVYA\" description=\"Start with max stats\" />\n      <gamegenie code=\"SUKOOXSO\" description=\"Infinite money (1 of 3)\" />\n      <gamegenie code=\"SUSPEXSO\" description=\"Infinite money (2 of 3)\" />\n      <gamegenie code=\"SUSPNXSO\" description=\"Infinite money (3 of 3)\" />\n      <gamegenie code=\"LZXTXGLP\" description=\"Coins worth max amount of money\" />\n      <gamegenie code=\"TOSNAVYE\" description=\"Start with double every attribute\" />\n      <gamegenie code=\"YNSNAVYE\" description=\"127 of all stats\" />\n      <gamegenie code=\"LVNYIVYL\" description=\"99 Stamina\" />\n      <gamegenie code=\"YYVOIUYU\" description=\"Max Punch\" />\n      <gamegenie code=\"YYVOTUYU\" description=\"Max Kick\" />\n      <gamegenie code=\"YYVOYUYU\" description=\"Max Weapon\" />\n      <gamegenie code=\"YYNPAUYU\" description=\"Max Throw\" />\n      <gamegenie code=\"YYNPPUYU\" description=\"Max Agility\" />\n      <gamegenie code=\"YYNPZUYU\" description=\"Max Defense\" />\n      <gamegenie code=\"YYNPLUYU\" description=\"Max Strength\" />\n      <gamegenie code=\"YYNPGUYU\" description=\"Max Will Power\" />\n      <gamegenie code=\"NYNPTUYN\" description=\"Max Stamina\" />\n      <gamegenie code=\"OOELVUOU\" description=\"Infinite Stamina (1 of 2)\" />\n      <gamegenie code=\"OXVUVUOV\" description=\"Infinite Stamina (2 of 2)\" />\n      <gamegenie code=\"SLOXNNSO\" description=\"Infinite Will Power\" />\n      <gamegenie code=\"AGENAYAZ\" description=\"Start with double money - P1\" />\n      <gamegenie code=\"AGOYYYAZ\" description=\"Start with double money - P2\" />\n      <gamegenie code=\"PAENIYAA\" description=\"Start with $100 extra - P1\" />\n      <gamegenie code=\"PAONGYAA\" description=\"Start with $100 extra - P2\" />\n      <gamegenie code=\"ENVYZZEI\" description=\"View the credits\" />\n    </game>\n    <game code=\"CLV-H-NGDKH\" name=\"Road Runner\" crc=\"B19A55DD\">\n      <gamegenie code=\"SZOVUUVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAEVTGIA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"LAEVTGIE\" description=\"Start with 12 lives\" />\n      <gamegenie code=\"PPEVTGIA\" description=\"Start with 18 lives\" />\n      <gamegenie code=\"IAOTLGPA\" description=\"Start on level 5\" />\n      <gamegenie code=\"ZAOTLGPE\" description=\"Start on level 10\" />\n      <gamegenie code=\"YAOTLGPE\" description=\"Start on level 15\" />\n      <gamegenie code=\"GPOTLGPA\" description=\"Start on level 20\" />\n      <gamegenie code=\"PPOTLGPE\" description=\"Start on level 25\" />\n      <gamegenie code=\"TPOTLGPE\" description=\"Start on level 30\" />\n      <gamegenie code=\"XVUGAOEK\" description=\"Never lose seed (1 of 2)\" />\n      <gamegenie code=\"XVXTSUEK\" description=\"Never lose seed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-HGJIL\" name=\"RoadBlasters\" crc=\"8ADA3497\">\n      <gamegenie code=\"SZEIGEVK\" description=\"Infinite credits\" />\n      <gamegenie code=\"GAVLUTZA\" description=\"Double credits\" />\n      <gamegenie code=\"PEEAEIIE\" description=\"Extend lifetime of UZ Cannon\" />\n      <gamegenie code=\"NNSEOIEE\" description=\"Extend lifetime of Nitro Injector\" />\n      <gamegenie code=\"AKSEOIEA\" description=\"Reduce lifetime of Nitro Injector\" />\n      <gamegenie code=\"SXVEKSVK\" description=\"Infinite Cruise missiles (1 of 2)\" />\n      <gamegenie code=\"ETOENSTP\" description=\"Infinite Cruise missiles (2 of 2)\" />\n      <gamegenie code=\"ATNEEISZ\" description=\"Infinite UZ Cannon (1 of 2)\" />\n      <gamegenie code=\"LZOENSTO\" description=\"Infinite UZ Cannon (2 of 2)\" />\n      <gamegenie code=\"AVSEKSVG\" description=\"Infinite Nitro Injectors (1 of 3)\" />\n      <gamegenie code=\"SAOENSTO\" description=\"Infinite Nitro Injectors (2 of 3)\" />\n      <gamegenie code=\"GXKEOIEY\" description=\"Infinite Nitro Injectors (3 of 3)\" />\n      <gamegenie code=\"SZSEKVVK\" description=\"Infinite Electro Shield (1 of 3)\" />\n      <gamegenie code=\"PIOENSTP\" description=\"Infinite Electro Shield (2 of 3)\" />\n      <gamegenie code=\"VAXAESSE\" description=\"Infinite Electro Shield (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-HQWJX\" name=\"Robin Hood: Prince of Thieves\" crc=\"86B0D1CF\">\n      <gamegenie code=\"VAXEOLSA\" description=\"Infinite HP for Robin in main combat\" />\n      <gamegenie code=\"EYXAOPAL\" description=\"Infinite HP for Robin in dueling combat\" />\n      <gamegenie code=\"GOXLLNAA\" description=\"Bandages give more HP back\" />\n      <gamegenie code=\"AOULIUAE\" description=\"Food gives more HP back - Except the Leg of meat\" />\n      <gamegenie code=\"AASPIZPA\" description=\"Infinite Arrows\" />\n    </game>\n    <game code=\"CLV-H-PHCEK\" name=\"Robo Warrior\" crc=\"810B7AB9\">\n      <gamegenie code=\"GZUNYXTK\" description=\"No damage from bomb blast\" />\n      <gamegenie code=\"GZNNIXTK\" description=\"No damage from monsters and no power drain\" />\n      <gamegenie code=\"SUXSNIVI\" description=\"Infinite Mega Bomb after after pick-up\" />\n      <gamegenie code=\"XTXGKPVV\" description=\"Infinite Barrier after pick-up\" />\n      <gamegenie code=\"IAVTPSZA\" description=\"5 Super Bombs on pick-up\" />\n      <gamegenie code=\"GPVTPSZA\" description=\"20 Super Bombs on pick-up\" />\n      <gamegenie code=\"SZKTYPVG\" description=\"Infinite Super Bombs\" />\n      <gamegenie code=\"IEVKLPAA\" description=\"Start with 5 of everything\" />\n      <gamegenie code=\"ZEVKLPAE\" description=\"Start with 10 of everything\" />\n      <gamegenie code=\"IANGAPPA\" description=\"Set firing range to 5\" />\n      <gamegenie code=\"ZANGAPPE\" description=\"Set firing range to 10\" />\n      <gamegenie code=\"IEVGIPPA\" description=\"Start with defense level at 5\" />\n      <gamegenie code=\"AEVGIPPE\" description=\"Start with defense level at 8\" />\n      <gamegenie code=\"EONGELAP\" description=\"Walk through walls\" />\n    </game>\n    <game code=\"CLV-H-NRLUM\" name=\"RoboCop\" crc=\"192D546F\">\n      <gamegenie code=\"LLNTTZIU\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"SLXUYTAX\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXKXYIVT\" description=\"Infinite time\" />\n      <gamegenie code=\"SGOTKLIA\" description=\"Infinite ammunition\" />\n      <gamegenie code=\"SZKVOTSA\" description=\"No damage from touching enemies\" />\n      <gamegenie code=\"SZVVVYSA\" description=\"No damage from enemy bullets\" />\n      <gamegenie code=\"AEOXIXLL\" description=\"Bosses die automatically\" />\n      <gamegenie code=\"SOKZLNSU\" description=\"Can't harm civilian at the end of level 1\" />\n      <gamegenie code=\"PAOYNILE\" description=\"Triple normal power on power food pick-up\" />\n      <gamegenie code=\"PAXNEILE\" description=\"Triple normal time on battery pick-up\" />\n      <gamegenie code=\"TPXNEILA\" description=\"Max time on battery pick-up\" />\n      <gamegenie code=\"TPOYNILA\" description=\"Full power on power food pick-up\" />\n      <gamegenie code=\"YAXSAPPE\" description=\"Use with COP Code 2 to start with machine gun and Cobra gun\" />\n      <gamegenie code=\"YAXIGXTE\" description=\"Press Start to finish the level\" />\n      <gamegenie code=\"SAESLPSP\" description=\"Start on level X (1 of 3)\" />\n      <gamegenie code=\"TTESGPSA\" description=\"Start on level X (2 of 3)\" />\n      <gamegenie code=\"PAESZPAA\" description=\"Start on level 2 (3 of 3)\" />\n      <gamegenie code=\"ZAESZPAA\" description=\"Start on level 3 (3 of 3)\" />\n      <gamegenie code=\"LAESZPAA\" description=\"Start on level 4 (3 of 3)\" />\n      <gamegenie code=\"GAESZPAA\" description=\"Start on level 5 (3 of 3)\" />\n      <gamegenie code=\"IAESZPAA\" description=\"Start on level 6 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-WIZRE\" name=\"RoboCop 2\" crc=\"990985C0\">\n      <gamegenie code=\"ENVEUYEI\" description=\"Invincibility\" />\n      <gamegenie code=\"AVKTPNOP\" description=\"Infinite health\" />\n      <gamegenie code=\"SINKIPVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"SGETGYVG\" description=\"Infinite time (1 of 2)\" />\n      <gamegenie code=\"SKNVGTVG\" description=\"Infinite time (2 of 2)\" />\n      <gamegenie code=\"EINAXLEY\" description=\"No enemies\" />\n      <gamegenie code=\"AAEVKALA\" description=\"Each N (Nuke) is worth 10\" />\n    </game>\n    <game code=\"CLV-H-IAYMI\" name=\"RoboCop 3\" crc=\"96087988\">\n      <gamegenie code=\"OXONLPSV\" description=\"Infinite efficiency (1 of 2)\" />\n      <gamegenie code=\"POONGPXV\" description=\"Infinite efficiency (2 of 2)\" />\n      <gamegenie code=\"OUXYPOSO\" description=\"Infinite efficiency (alt)\" />\n      <gamegenie code=\"AEENAEUT\" description=\"Hit anywhere\" />\n      <gamegenie code=\"GNUNAEKN\" description=\"One hit kills\" />\n      <gamegenie code=\"VVKGLATE\" description=\"Lots of repair icons\" />\n      <gamegenie code=\"ZLVGIXPP\" description=\"Start with 2x health\" />\n      <gamegenie code=\"GAVGIXPO\" description=\"Start with 1/2 health\" />\n    </game>\n    <game code=\"CLV-H-HVSQY\" name=\"Rock'n' Ball\" crc=\"476E022B\">\n      <gamegenie code=\"SLNXYEVS\" description=\"Infinite balls\" />\n    </game>\n    <game code=\"CLV-H-AWYIZ\" name=\"Rocket Ranger\" crc=\"67F77118\">\n      <gamegenie code=\"ZEOGSYPA\" description=\"Double amount of Lunarium in storage\" />\n      <gamegenie code=\"LEOGSYPA\" description=\"Triple amount of Lunarium in storage\" />\n      <gamegenie code=\"LVOKXNGL\" description=\"Lunarium level in backpack at 99\" />\n      <gamegenie code=\"SZSGPUSE\" description=\"Never lose Lunarium in backpack\" />\n      <gamegenie code=\"AEOGSYPA\" description=\"Half amount of Lunarium in storage (1 of 2)\" />\n      <gamegenie code=\"ZUOKNYAA\" description=\"Half amount of Lunarium in storage (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GMBNC\" name=\"Rocketeer, The\" crc=\"1D6DECCC\">\n      <gamegenie code=\"GESLNKAA\" description=\"Start with 1/2 health\" />\n      <gamegenie code=\"AOSLNKAA\" description=\"Start with 2x health\" />\n      <gamegenie code=\"AOSLNKAE\" description=\"Start with 3x health\" />\n      <gamegenie code=\"GZSSINSV\" description=\"Infinite health\" />\n      <gamegenie code=\"IAOZZXZA\" description=\"1/2 normal bullets on pick-up\" />\n      <gamegenie code=\"GPOZZXZA\" description=\"2x normal bullets on pick-up\" />\n      <gamegenie code=\"TPOZZXZE\" description=\"3x normal bullets on pick-up\" />\n      <gamegenie code=\"ZAEZGZGO\" description=\"1/2 silver bullets on pick-up\" />\n      <gamegenie code=\"AZEZGZGO\" description=\"2x silver bullets on pick-up\" />\n      <gamegenie code=\"GLEZGZGO\" description=\"3x silver bullets on pick-up\" />\n      <gamegenie code=\"AAVLKIIA\" description=\"Have all weapons with infinite ammo\" />\n    </game>\n    <game code=\"CLV-H-UKNXK\" name=\"Rockin' Kats\" crc=\"8927FD4C\">\n      <gamegenie code=\"SXKVZVSE\" description=\"Infinite health\" />\n      <gamegenie code=\"AENTTTTP\" description=\"Hit anywhere\" />\n      <gamegenie code=\"AEOEYZOI\" description=\"Can select any item (you will not be able to see it)\" />\n      <gamegenie code=\"AEXEELAP\" description=\"Can always select channel 5\" />\n      <gamegenie code=\"OXEEOYSX\" description=\"Can always buy items\" />\n      <gamegenie code=\"SKOKOSVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"EIXVATEY\" description=\"Invincibility\" />\n    </game>\n    <game code=\"CLV-H-TMDJY\" name=\"Roger Clemens' MVP Baseball\" crc=\"018A8699\">\n      <gamegenie code=\"ZANEAPLA\" description=\"2 strikes and you're out (1 of 3)\" />\n      <gamegenie code=\"ZEOUYPLA\" description=\"2 strikes and you're out (2 of 3)\" />\n      <gamegenie code=\"ZEVKGPLA\" description=\"2 strikes and you're out (3 of 3)\" />\n      <gamegenie code=\"PANEAPLA\" description=\"1 strike and you're out (1 of 3)\" />\n      <gamegenie code=\"PEOUYPLA\" description=\"1 strike and you're out (2 of 3)\" />\n      <gamegenie code=\"PEVKGPLA\" description=\"1 strike and you're out (3 of 3)\" />\n      <gamegenie code=\"OOVSLLPA\" description=\"Strikes are not called when batter doesn't swing\" />\n      <gamegenie code=\"GANAAPZA\" description=\"Strikes are not called when batter swings\" />\n      <gamegenie code=\"PENKLPGA\" description=\"1 ball for a walk\" />\n      <gamegenie code=\"ZENKLPGA\" description=\"2 balls for a walk\" />\n      <gamegenie code=\"LENKLPGA\" description=\"3 balls for walk\" />\n      <gamegenie code=\"OONIALAA\" description=\"Infinite balls (balls are not called)\" />\n      <gamegenie code=\"SLNALPVY\" description=\"Infinite balls and strikes\" />\n    </game>\n    <game code=\"CLV-H-WXSIW\" name=\"Rollerball\" crc=\"69635A6E\">\n      <gamegenie code=\"PANGIPLA\" description=\"Start with only 1 ball - all players\" />\n      <gamegenie code=\"SZKGPXVS\" description=\"Infinite balls - all players\" />\n    </game>\n    <game code=\"CLV-H-TTYXV\" name=\"Rollerblade Racer\" crc=\"2370C0A9\">\n      <gamegenie code=\"PAUKUZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAUKUZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAUKUZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"OXVSAYVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEVIPYGA\" description=\"1 fall and you're dead\" />\n      <gamegenie code=\"TEVIPYGA\" description=\"6 falls and you're dead\" />\n      <gamegenie code=\"AEVIPYGE\" description=\"8 falls and you're dead\" />\n      <gamegenie code=\"ZAUKNZAA\" description=\"Start on the City Street\" />\n      <gamegenie code=\"GAUKNZAA\" description=\"Start on Hit the Beach\" />\n      <gamegenie code=\"TAUKNZAA\" description=\"Start on Panic Park\" />\n    </game>\n    <game code=\"CLV-H-RUHJU\" name=\"Rollergames\" crc=\"AA4997C1\">\n      <gamegenie code=\"SXENAYVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PASAZALE\" description=\"9 special moves\" />\n      <gamegenie code=\"TASAZALA\" description=\"6 special moves\" />\n      <gamegenie code=\"GXVPAZVG\" description=\"Infinite special moves\" />\n      <gamegenie code=\"TASATEGA\" description=\"Start with less energy\" />\n      <gamegenie code=\"APSATEGE\" description=\"Start with more energy\" />\n      <gamegenie code=\"PAKAAGAE\" description=\"Mega-jump\" />\n      <gamegenie code=\"GZOENISA\" description=\"Infinite time\" />\n      <gamegenie code=\"YPOAUSYU\" description=\"Faster timer\" />\n      <gamegenie code=\"YYOAUSYU\" description=\"Slower timer\" />\n    </game>\n    <game code=\"CLV-H-SBITI\" name=\"Rolling Thunder\" crc=\"F92BE3EC\">\n      <gamegenie code=\"SZSZGVSE\" description=\"Infinite health\" />\n      <gamegenie code=\"SZNTULVG\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"SZSTULVG\" description=\"Infinite lives (2 of 2)\" />\n      <gamegenie code=\"SZEVYZVG\" description=\"Infinite time\" />\n      <gamegenie code=\"AKSZANEL\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"ATUILYEI\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"OXSZPNEX\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"EKSTEAGV\" description=\"200 Machine Gun bullets on pick-up\" />\n      <gamegenie code=\"SUOZPXVS\" description=\"300 Machine Gun bullets and 300 bullets on pick-up\" />\n      <gamegenie code=\"GOKVNAZL\" description=\"Gain fewer bullets on pick-up\" />\n      <gamegenie code=\"ZLVITYPA\" description=\"Self-replenishing bullets\" />\n      <gamegenie code=\"EKXVZAZU\" description=\"Start with 200 bullets\" />\n      <gamegenie code=\"EGKVKLZU\" description=\"Start with 200 bullets on each new life\" />\n      <gamegenie code=\"LEXTZAAA\" description=\"Start with loads of ammunition (1 of 2)\" />\n      <gamegenie code=\"LAKTKLAA\" description=\"Start with loads of ammunition (2 of 2)\" />\n      <gamegenie code=\"PEOVLALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEOVLALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEOVLALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PASPYZLA\" description=\"Start with 1 life after continue\" />\n      <gamegenie code=\"TASPYZLA\" description=\"Start with 6 lives after continue\" />\n      <gamegenie code=\"PASPYZLE\" description=\"Start with 9 lives after continue\" />\n      <gamegenie code=\"AEEVSAZE\" description=\"Start with increased life meter\" />\n      <gamegenie code=\"ALVESYOL\" description=\"Start on story X area X (1 of 2)\" />\n      <gamegenie code=\"PAVEUYAA\" description=\"Start on story 1 area 02 (2 of 2)\" />\n      <gamegenie code=\"ZAVEUYAA\" description=\"Start on story 1 area 03 (2 of 2)\" />\n      <gamegenie code=\"LAVEUYAA\" description=\"Start on story 1 area 04 (2 of 2)\" />\n      <gamegenie code=\"GAVEUYAA\" description=\"Start on story 1 area 05 (2 of 2)\" />\n      <gamegenie code=\"IAVEUYAA\" description=\"Start on story 2 area 06 (2 of 2)\" />\n      <gamegenie code=\"TAVEUYAA\" description=\"Start on story 2 area 07 (2 of 2)\" />\n      <gamegenie code=\"YAVEUYAA\" description=\"Start on story 2 area 08 (2 of 2)\" />\n      <gamegenie code=\"AAVEUYAE\" description=\"Start on story 2 area 09 (2 of 2)\" />\n      <gamegenie code=\"PAVEUYAE\" description=\"Start on story 2 area 10 (2 of 2)\" />\n      <gamegenie code=\"PEKEXIAA\" description=\"Start on story 3 area 01\" />\n    </game>\n    <game code=\"CLV-H-LIAPS\" name=\"Rush'n Attack\" crc=\"DE25B90F\">\n      <gamegenie code=\"KAXAGYIA\" description=\"Invincibility (star effect) (1 of 2)\" />\n      <gamegenie code=\"KAXEYYIA\" description=\"Invincibility (star effect) (2 of 2)\" />\n      <gamegenie code=\"AIUAPPEI\" description=\"Invincibility (except vs bullets)\" />\n      <gamegenie code=\"AENASIPA\" description=\"Infinite POW\" />\n      <gamegenie code=\"ASKELZEL\" description=\"Hit anywhere (1 of 5)\" />\n      <gamegenie code=\"LUKEGXLV\" description=\"Hit anywhere (3 of 5)\" />\n      <gamegenie code=\"GGXAAIEU\" description=\"Hit anywhere (2 of 5)\" />\n      <gamegenie code=\"YLXAPSGI\" description=\"Hit anywhere (5 of 5)\" />\n      <gamegenie code=\"SAXAZSOL\" description=\"Hit anywhere (4 of 5)\" />\n      <gamegenie code=\"SAVSNNSX\" description=\"Always have 255 POW\" />\n      <gamegenie code=\"GZOEAYVG\" description=\"Infinite lives - P1\" />\n      <gamegenie code=\"GZOEIYVG\" description=\"Infinite lives - P2\" />\n      <gamegenie code=\"PAVSTPIA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"PANITPIA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"ZAVSTPIE\" description=\"Start with 10 lives - P1\" />\n      <gamegenie code=\"ZANITPIE\" description=\"Start with 10 lives - P2\" />\n      <gamegenie code=\"AAUZUNNN\" description=\"Multi-jump (01 of 15)\" />\n      <gamegenie code=\"ATUXKNNY\" description=\"Multi-jump (02 of 15)\" />\n      <gamegenie code=\"AUSALYOY\" description=\"Multi-jump (03 of 15)\" />\n      <gamegenie code=\"AZUXONNY\" description=\"Multi-jump (04 of 15)\" />\n      <gamegenie code=\"AZUZVNNY\" description=\"Multi-jump (05 of 15)\" />\n      <gamegenie code=\"EYUZKNNY\" description=\"Multi-jump (06 of 15)\" />\n      <gamegenie code=\"EYUZNNNN\" description=\"Multi-jump (07 of 15)\" />\n      <gamegenie code=\"GAUZONNY\" description=\"Multi-jump (08 of 15)\" />\n      <gamegenie code=\"LAUZSNNY\" description=\"Multi-jump (09 of 15)\" />\n      <gamegenie code=\"NXSAGNUE\" description=\"Multi-jump (10 of 15)\" />\n      <gamegenie code=\"OAUXENNN\" description=\"Multi-jump (11 of 15)\" />\n      <gamegenie code=\"OYUXXNNY\" description=\"Multi-jump (12 of 15)\" />\n      <gamegenie code=\"PZUZXNNN\" description=\"Multi-jump (13 of 15)\" />\n      <gamegenie code=\"SZUZENNY\" description=\"Multi-jump (14 of 15)\" />\n      <gamegenie code=\"UAUXUNNN\" description=\"Multi-jump (15 of 15)\" />\n    </game>\n    <game code=\"CLV-H-PMBEI\" name=\"Rygar\" crc=\"37C474D5\">\n      <gamegenie code=\"ATEZOTKA\" description=\"Invincibility\" />\n      <gamegenie code=\"APKXSIEY\" description=\"Multi-jump (01 of 10)\" />\n      <gamegenie code=\"ATOZTEOZ\" description=\"Multi-jump (02 of 10)\" />\n      <gamegenie code=\"AZKXXIGE\" description=\"Multi-jump (03 of 10)\" />\n      <gamegenie code=\"GASZOIIA\" description=\"Multi-jump (04 of 10)\" />\n      <gamegenie code=\"IZKXUSPZ\" description=\"Multi-jump (05 of 10)\" />\n      <gamegenie code=\"SAKXNSSX\" description=\"Multi-jump (06 of 10)\" />\n      <gamegenie code=\"SZKXOIXP\" description=\"Multi-jump (07 of 10)\" />\n      <gamegenie code=\"XGSZEIZL\" description=\"Multi-jump (08 of 10)\" />\n      <gamegenie code=\"XTKXESSX\" description=\"Multi-jump (09 of 10)\" />\n      <gamegenie code=\"ZZKXKIAX\" description=\"Multi-jump (10 of 10)\" />\n      <gamegenie code=\"SXUZXTSA\" description=\"Infinite health\" />\n      <gamegenie code=\"POXXVYSA\" description=\"One hit kills\" />\n      <gamegenie code=\"AVOXVTIA\" description=\"Don't be pushed after being hit\" />\n      <gamegenie code=\"AAZEZZ\" description=\"Infinite Mind points\" />\n      <gamegenie code=\"IEKZPLIZ\" description=\"Have first three items after pressing B once\" />\n      <gamegenie code=\"LAVOLTGA\" description=\"Jump higher\" />\n      <gamegenie code=\"ALOXKIEL\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"ALUZUIEL\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"ALXZXIEL\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"EYUXOIEL\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"AAOZLEAA\" description=\"Pits aren't fatal (side view)\" />\n      <gamegenie code=\"ASSOSGEI\" description=\"Walk on water (overhead view)\" />\n      <gamegenie code=\"SZUPOOVK\" description=\"Grappling Hook continues to search for land (1 of 2)\" />\n      <gamegenie code=\"SZXXGZSA\" description=\"Grappling Hook continues to search for land (2 of 2)\" />\n      <gamegenie code=\"AOUGPATE\" description=\"Start with 12 units of health (1 of 2)\" />\n      <gamegenie code=\"AOUGZATE\" description=\"Start with 12 units of health (2 of 2)\" />\n      <gamegenie code=\"EPSLYIEL\" description=\"Enemies always drop X (1 of 3)\" />\n      <gamegenie code=\"OZNUTSPX\" description=\"Enemies always drop X (2 of 3)\" />\n      <gamegenie code=\"LANUYIYA\" description=\"Enemies always drop a health potion (3 of 3)\" />\n      <gamegenie code=\"GANUYIYA\" description=\"Enemies always drop a Mind unit (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-QELFL\" name=\"S.C.A.T.: Special Cybernetic Attack Team\" crc=\"74189E12\">\n      <gamegenie code=\"AANSUGPA\" description=\"Infinite health\" />\n      <gamegenie code=\"ZUXGKTTA\" description=\"Start with more health\" />\n      <gamegenie code=\"ZANVNGLE\" description=\"More health on pick-up\" />\n      <gamegenie code=\"AEESVKAA\" description=\"Don't lose speed-ups when hit\" />\n      <gamegenie code=\"NNEIKGAK\" description=\"Longer immunity\" />\n      <gamegenie code=\"APKSEGAG\" description=\"Shorter immunity\" />\n      <gamegenie code=\"PAEIKTTE\" description=\"Faster maximum speed-up (1 of 2)\" />\n      <gamegenie code=\"NYEISVXY\" description=\"Faster maximum speed-up (2 of 2)\" />\n      <gamegenie code=\"TENIKIGA\" description=\"Faster normal speed-up (1 of 2)\" />\n      <gamegenie code=\"XNNISSKN\" description=\"Faster normal speed-up (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-THFRB\" name=\"Secret Scout in the Temple of Demise (Unl) [!p]\" crc=\"AC559FBD\">\n      <gamegenie code=\"OUXTYKOO\" description=\"Infinite lives\" />\n      <gamegenie code=\"ASVIYIAE\" description=\"View the ending\" />\n    </game>\n    <game code=\"CLV-H-GYQPU\" name=\"Section Z\" crc=\"0FEC90D2\">\n      <gamegenie code=\"SXOPUIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"ZAUNUZAE\" description=\"Energy tube gives full energy boost\" />\n      <gamegenie code=\"NNNOUTSY\" description=\"Autofiring capability\" />\n      <gamegenie code=\"NNNOUTSN\" description=\"Autofire without having to hold the button down\" />\n      <gamegenie code=\"LAEAZYPA\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"PEXSIZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEXSIZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEXSIZLE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-VJACK\" name=\"Seicross\" crc=\"27AA3933\">\n      <gamegenie code=\"SUTEEX\" description=\"Infinite lives\" />\n      <gamegenie code=\"PELAGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TELAGA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PELAGE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PEGEUG\" description=\"Slow motion\" />\n    </game>\n    <game code=\"CLV-H-XRHSN\" name=\"Shadow of the Ninja\" crc=\"DDD90C39\">\n      <gamegenie code=\"SZSNIIVG\" description=\"Infinite continues\" />\n      <gamegenie code=\"PEEVZAIE\" description=\"9 continues\" />\n      <gamegenie code=\"PEEVZAIA\" description=\"1 continue\" />\n      <gamegenie code=\"GZVXSKSO\" description=\"Don't lose energy from enemy attacks\" />\n      <gamegenie code=\"AAVPGIGA\" description=\"Don't lose energy from falling\" />\n      <gamegenie code=\"APOEOGGA\" description=\"Maximum energy gained from potion\" />\n      <gamegenie code=\"PAOEOGGA\" description=\"Less energy gained from potion\" />\n      <gamegenie code=\"AZUAOGGO\" description=\"40 Throwing Stars on pick-up\" />\n      <gamegenie code=\"GPKAVGIA\" description=\"20 Bombs on pick-up\" />\n      <gamegenie code=\"XVKPAVVN\" description=\"Mega-jump\" />\n      <gamegenie code=\"XTXXLOSO\" description=\"Some enemies can't move left or right\" />\n    </game>\n    <game code=\"CLV-H-KAOUH\" name=\"Shadowgate\" crc=\"6A1F628A\">\n      <gamegenie code=\"XVESZNVK\" description=\"Infinite torches\" />\n    </game>\n    <game code=\"CLV-H-PPHFS\" name=\"Shatterhand\" crc=\"AA20F73D\">\n      <gamegenie code=\"AIOEPIEL\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"GXNALGEL\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"GXNEYGEP\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"GXSELGEP\" description=\"Hit anywhere (4 of 4)\" />\n      <gamegenie code=\"AAKKSPPA\" description=\"Power-ups don't use up gold\" />\n      <gamegenie code=\"AXXAZZGO\" description=\"Big coins worth double\" />\n      <gamegenie code=\"ZEXAZZGO\" description=\"Big coins worth half\" />\n      <gamegenie code=\"YEEAYZIE\" description=\"Small coins worth triple\" />\n      <gamegenie code=\"AEVNAIZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEVNAIZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEVNAIZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GENNZSAA\" description=\"Start with less health\" />\n    </game>\n    <game code=\"CLV-H-QPIPQ\" name=\"Shinobi\" crc=\"EB0BDA7E\">\n      <gamegenie code=\"SZEOLXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AANOLAZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IANOLAZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AANOLAZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZNIPNVK\" description=\"Infinite life\" />\n      <gamegenie code=\"IEKONILA\" description=\"Turbo running\" />\n      <gamegenie code=\"GAXOTATE\" description=\"Start with double life (1 of 2)\" />\n      <gamegenie code=\"GENPGPTE\" description=\"Start with double life (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-YZCLX\" name=\"Shooting Range\" crc=\"851EB9BE\">\n      <gamegenie code=\"GTEPOAZL\" description=\"Double bonus time for hourglasses\" />\n      <gamegenie code=\"PPEPOAZU\" description=\"Half bonus time for hourglasses\" />\n      <gamegenie code=\"GEKAILLA\" description=\"More time for level 1 (1 of 2)\" />\n      <gamegenie code=\"GAEETTLA\" description=\"More time for level 1 (2 of 2)\" />\n      <gamegenie code=\"ZEKAILLA\" description=\"Less time for level 1 (1 of 2)\" />\n      <gamegenie code=\"ZAEETTLA\" description=\"Less time for level 1 (2 of 2)\" />\n      <gamegenie code=\"GAOAATZA\" description=\"More time for level 2 (1 of 2)\" />\n      <gamegenie code=\"AAOAPTZL\" description=\"More time for level 2 (2 of 2)\" />\n      <gamegenie code=\"PAOAATZA\" description=\"Less time for level 2 (1 of 2)\" />\n      <gamegenie code=\"ZLOAPTZL\" description=\"Less time for level 2 (2 of 2)\" />\n      <gamegenie code=\"GAOAZTZA\" description=\"More time for level 3 (1 of 2)\" />\n      <gamegenie code=\"ZLOALTAA\" description=\"More time for level 3 (2 of 2)\" />\n      <gamegenie code=\"PAOAZTZA\" description=\"Less time for level 3 (1 of 2)\" />\n      <gamegenie code=\"AAOALTAA\" description=\"Less time for level 3 (2 of 2)\" />\n      <gamegenie code=\"ASUAIVAZ\" description=\"XX usual shots per round (1 of 3)\" />\n      <gamegenie code=\"SXVONOOU\" description=\"Double usual shots per round (2 of 3)\" />\n      <gamegenie code=\"ASXOVXAZ\" description=\"Double usual shots per round (3 of 3)\" />\n      <gamegenie code=\"ANXOVXAX\" description=\"Triple usual shots per round (3 of 3)\" />\n      <gamegenie code=\"EXXOVXAZ\" description=\"Quadruple usual shots per round (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-QIZHO\" name=\"Side Pocket\" crc=\"DC4DA5D4\">\n      <gamegenie code=\"SXKXNLSA\" description=\"Infinite turns - P1\" />\n    </game>\n    <game code=\"CLV-H-GWMPK\" name=\"Silent Service\" crc=\"B843EB84\">\n      <gamegenie code=\"ZLEPOIAI\" description=\"Start with 50 deck gun shells\" />\n      <gamegenie code=\"LTEPOIAI\" description=\"Start with 99 deck gun shells\" />\n      <gamegenie code=\"SZXVOPVG\" description=\"Infinite deck gun shells\" />\n      <gamegenie code=\"SZSVUPVG\" description=\"Infinite bow torpedoes\" />\n      <gamegenie code=\"SXETUPVG\" description=\"Infinite aft torpedoes\" />\n    </game>\n    <game code=\"CLV-H-VZCRI\" name=\"Silkworm\" crc=\"E74A91BB\">\n      <gamegenie code=\"PAXGXALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAXGXALA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAXGXALE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXSVIZVG\" description=\"Infinite lives using helicopter\" />\n      <gamegenie code=\"SZVVGTVG\" description=\"Infinite lives using jeep\" />\n      <gamegenie code=\"PEEGSPLA\" description=\"1 life using helicopter after continue\" />\n      <gamegenie code=\"TEEGSPLA\" description=\"6 lives using helicopter after continue\" />\n      <gamegenie code=\"PEEGSPLE\" description=\"9 lives using helicopter after continue\" />\n      <gamegenie code=\"PEOKNPLA\" description=\"1 life using jeep after continue\" />\n      <gamegenie code=\"TEOKNPLA\" description=\"6 lives using jeep after continue\" />\n      <gamegenie code=\"PEOKNPLE\" description=\"9 lives using jeep after continue\" />\n      <gamegenie code=\"PAXKEAAA\" description=\"Start at stage 2\" />\n      <gamegenie code=\"ZAXKEAAA\" description=\"Start at stage 3\" />\n      <gamegenie code=\"LAXKEAAA\" description=\"Start at stage 4\" />\n      <gamegenie code=\"GAXKEAAA\" description=\"Start at stage 5\" />\n      <gamegenie code=\"IAXKEAAA\" description=\"Start at stage 6\" />\n      <gamegenie code=\"TAXKEAAA\" description=\"Start at stage 7\" />\n      <gamegenie code=\"SZETZLSA\" description=\"Keep firepower and speed-ups for helicopter\" />\n      <gamegenie code=\"SXOTPTSA\" description=\"Keep firepower and speed-ups for jeep\" />\n      <gamegenie code=\"EEOVYUEI\" description=\"Restrict movement area for helicopter\" />\n      <gamegenie code=\"EEOVGYEV\" description=\"Restrict movement area for jeep\" />\n    </game>\n    <game code=\"CLV-H-PUYXM\" name=\"Silver Surfer\" crc=\"BEE1C0D9\">\n      <gamegenie code=\"PAOILIIA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"PAKSGIIA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"IAXSGIPA\" description=\"Start with 5 Smart Bombs - P1\" />\n      <gamegenie code=\"IAVIIIPA\" description=\"Start with 5 Smart Bombs - P2\" />\n      <gamegenie code=\"SXEKSNVK\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"NYVTLVGO\" description=\"Infinite Smart Bombs - both players\" />\n      <gamegenie code=\"GXEITSSE\" description=\"Keep cosmic weapons after losing a life\" />\n      <gamegenie code=\"IEESIIPA\" description=\"Have 5 Smart Bombs on a new life\" />\n      <gamegenie code=\"GXEILSSE\" description=\"Keep Orbs after losing a life (1 of 2)\" />\n      <gamegenie code=\"GXKIOUSE\" description=\"Keep Orbs after losing a life (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BROCJ\" name=\"Simpsons, The: Bart vs. The Space Mutants\" crc=\"6F10097D\">\n      <gamegenie code=\"ESOINPEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SZOTESVK\" description=\"Infinite health\" />\n      <gamegenie code=\"XVONYXXK\" description=\"Infinite time\" />\n      <gamegenie code=\"ANENPXGU\" description=\"Slow down time\" />\n      <gamegenie code=\"AXENPXGL\" description=\"Speed up time\" />\n      <gamegenie code=\"PAONAYAA\" description=\"Gain 2 coins for every 1 collected\" />\n      <gamegenie code=\"PAONTNTE\" description=\"Only 10 coins needed to get an extra life\" />\n      <gamegenie code=\"GXXZZOVK\" description=\"Buy items for free (1 of 2)\" />\n      <gamegenie code=\"GXXULEVK\" description=\"Buy items for free (2 of 2)\" />\n      <gamegenie code=\"SPKTLESU\" description=\"Get all items by selecting them (be sure to get the Paint Can in level 1 and Gun in the Museum)\" />\n      <gamegenie code=\"IPKYXUGA\" description=\"Super-jump\" />\n    </game>\n    <game code=\"CLV-H-HJKBL\" name=\"Simpsons, The: Bart vs. The World\" crc=\"7416903F\">\n      <gamegenie code=\"ZOXVGLIE\" description=\"Invincibility\" />\n      <gamegenie code=\"SZONIPST\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZVVEKVK\" description=\"Infinite health\" />\n      <gamegenie code=\"EISVNGEY\" description=\"Lose lives more easily\" />\n      <gamegenie code=\"OLUNPPOP\" description=\"Infinite Firecracker Balls\" />\n      <gamegenie code=\"PAEZPAAE\" description=\"Start with 99 Firecracker Balls\" />\n      <gamegenie code=\"PAXXVGLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZNZPEVK\" description=\"Infinite tries for the card match game\" />\n      <gamegenie code=\"KLYUKA\" description=\"Bart flies\" />\n    </game>\n    <game code=\"CLV-H-SWKVD\" name=\"Simpsons, The: Bartman Meets Radioactive Man\" crc=\"5991B9D0\">\n      <gamegenie code=\"SXXNPLAX\" description=\"Invincibility\" />\n      <gamegenie code=\"AAUYPYGA\" description=\"Infinite health\" />\n      <gamegenie code=\"SZUYZNSE\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"SKNNVEVK\" description=\"Infinite Eyes on pick-up\" />\n      <gamegenie code=\"SXNNVEVK\" description=\"Infinite Eyes on pick-up (alt)\" />\n      <gamegenie code=\"AAKYKPPA\" description=\"Infinite Cold on pick-up\" />\n      <gamegenie code=\"PAVAYYLA\" description=\"Start with 2 lives and 2 credits\" />\n      <gamegenie code=\"IAVAYYLA\" description=\"Start with 6 lives and 6 credits\" />\n      <gamegenie code=\"YAVAYYLA\" description=\"Start with 8 lives and 8 credits\" />\n      <gamegenie code=\"PAVAYYLE\" description=\"Start with 10 lives and 10 credits\" />\n      <gamegenie code=\"OLVYAZOP\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZENNEVK\" description=\"Infinite credits\" />\n      <gamegenie code=\"ASVTOZAZ\" description=\"Eyes worth more on pick-up\" />\n      <gamegenie code=\"AXUVSZIA\" description=\"Cold worth more on pick-up\" />\n      <gamegenie code=\"ZAUZAYAA\" description=\"Start in chapter 1 level 2\" />\n      <gamegenie code=\"IAUZAYAA\" description=\"Start in chapter 1 level 3\" />\n    </game>\n    <game code=\"CLV-H-ENKSB\" name=\"Skate or Die 2: The Search for Double Trouble\" crc=\"06961BE4\">\n      <gamegenie code=\"SXUXZPVG\" description=\"Adventure game - Infinite health\" />\n      <gamegenie code=\"SXVPTVVK\" description=\"Adventure game - Infinite Paint Clips\" />\n      <gamegenie code=\"AANPZPPA\" description=\"Adventure game - Infinite Eggs (1 of 2)\" />\n      <gamegenie code=\"AAXOZLPA\" description=\"Adventure game - Infinite Eggs (2 of 2)\" />\n      <gamegenie code=\"AAVPTLPA\" description=\"Adventure game - Infinite M-80's (1 of 2)\" />\n      <gamegenie code=\"AEEOAPPA\" description=\"Adventure game - Infinite M-80's (2 of 2)\" />\n      <gamegenie code=\"AEESAAPG\" description=\"Adventure game - Skate at any speed (1 of 2)\" />\n      <gamegenie code=\"AAKATAPG\" description=\"Adventure game - Skate at any speed (2 of 2)\" />\n      <gamegenie code=\"PAUYLLLA\" description=\"Stunt Ramp - Only 1 skateboard\" />\n      <gamegenie code=\"TAUYLLLA\" description=\"Stunt Ramp - 6 skateboards\" />\n      <gamegenie code=\"PAUYLLLE\" description=\"Stunt Ramp - 9 skateboards\" />\n      <gamegenie code=\"TAONILLA\" description=\"Stunt Ramp - More time\" />\n      <gamegenie code=\"ZAONILLA\" description=\"Stunt Ramp - Less time\" />\n      <gamegenie code=\"SZUAKZVG\" description=\"Stunt Ramp - Infinite time\" />\n      <gamegenie code=\"TEKOKZIA\" description=\"Stunt Ramp - Super speed\" />\n      <gamegenie code=\"SXKPVYVG\" description=\"Stunt Ramp - Infinite skateboards (1 of 2)\" />\n      <gamegenie code=\"SXUZGAVG\" description=\"Stunt Ramp - Infinite skateboards (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-EUAFT\" name=\"Skate or Die!\" crc=\"423ADA8E\">\n      <gamegenie code=\"ZENXTTPA\" description=\"Snowball Blast - More snowballs picked up\" />\n      <gamegenie code=\"OOEPVAAV\" description=\"Snowball Blast - Start with more time\" />\n      <gamegenie code=\"AKEPVAAT\" description=\"Snowball Blast - Start with less time\" />\n      <gamegenie code=\"IOKXITAP\" description=\"Snowball Blast - More time gained\" />\n      <gamegenie code=\"IEKXITAP\" description=\"Snowball Blast - Less time gained\" />\n      <gamegenie code=\"GAUPVAZA\" description=\"Snowball Blast - Start with more ammo\" />\n      <gamegenie code=\"PAUPVAZA\" description=\"Snowball Blast - Start with less ammo\" />\n      <gamegenie code=\"IESTEYLA\" description=\"Acro Aerials - More jumps allowed (1 of 2)\" />\n      <gamegenie code=\"IAVVNILA\" description=\"Acro Aerials - More jumps allowed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-LMIDU\" name=\"Ski or Die\" crc=\"E9A6C211\">\n      <gamegenie code=\"PAUPVAZA\" description=\"Snowball Blast - Start with less ammo\" />\n      <gamegenie code=\"GAUPVAZA\" description=\"Snowball Blast - Start with more ammo\" />\n      <gamegenie code=\"AKEPVAAT\" description=\"Snowball Blast - Start with less time\" />\n      <gamegenie code=\"OOEPVAAV\" description=\"Snowball Blast - Start with more time\" />\n      <gamegenie code=\"IEKXITAP\" description=\"Snowball Blast - Less time gained\" />\n      <gamegenie code=\"IOKXITAP\" description=\"Snowball Blast - More time gained\" />\n      <gamegenie code=\"ZENXTTPA\" description=\"Snowball Blast - More snowballs picked up\" />\n      <gamegenie code=\"IAVVNILA\" description=\"Acro Aerials - More jumps allowed (1 of 2)\" />\n      <gamegenie code=\"IESTEYLA\" description=\"Acro Aerials - More jumps allowed (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ANZHW\" name=\"Skull &amp; Crossbones\" crc=\"B422A67A\">\n      <gamegenie code=\"SZNOTNVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"PEXPTYIA\" description=\"1 continue\" />\n      <gamegenie code=\"PEXPTYIE\" description=\"9 continues\" />\n      <gamegenie code=\"SUOEIVVS\" description=\"Infinite weapons\" />\n      <gamegenie code=\"SZONGXVK\" description=\"Infinite time\" />\n      <gamegenie code=\"AZONAXGL\" description=\"Faster timer\" />\n      <gamegenie code=\"AYONAXGL\" description=\"Slower timer\" />\n      <gamegenie code=\"POVPLYZU\" description=\"Half energy for Red Dog and One Eye (1 of 2)\" />\n      <gamegenie code=\"POEPZYZU\" description=\"Half energy for Red Dog and One Eye (2 of 2)\" />\n      <gamegenie code=\"LVVPLYZL\" description=\"Double energy for Red Dog and One Eye (1 of 2)\" />\n      <gamegenie code=\"POEPZYZU\" description=\"Double energy for Red Dog and One Eye (2 of 2)\" />\n      <gamegenie code=\"EUVEYNEK\" description=\"Better super-jump (1 of 2)\" />\n      <gamegenie code=\"EUVAGNEK\" description=\"Better super-jump (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-MNWPA\" name=\"Sky Kid (U) [!p]\" crc=\"8207A96C\">\n      <gamegenie code=\"SXEKGZVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"VANNVZSA\" description=\"P1 has more lives than P2\" />\n      <gamegenie code=\"AAOKIZPA\" description=\"Shoot more bullets\" />\n      <gamegenie code=\"PANYNZLA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"TANYNZLA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"PANYNZLE\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"IAVNNZPA\" description=\"Start on level 5 (1 of 2)\" />\n      <gamegenie code=\"GAVNUZAA\" description=\"Start on level 5 (2 of 2)\" />\n      <gamegenie code=\"ZAVNNZPE\" description=\"Start on level 10 (1 of 2)\" />\n      <gamegenie code=\"PAVNUZAE\" description=\"Start on level 10 (2 of 2)\" />\n      <gamegenie code=\"APVNNZPA\" description=\"Start on level 15 (1 of 2)\" />\n      <gamegenie code=\"YAVNUZAE\" description=\"Start on level 15 (2 of 2)\" />\n      <gamegenie code=\"GPVNNZPA\" description=\"Start on level 20 (1 of 2)\" />\n      <gamegenie code=\"LPVNUZAA\" description=\"Start on level 20 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ZSDQL\" name=\"Sky Shark\" crc=\"9FFE2F55\">\n      <gamegenie code=\"OZNEAAVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"GXUEALVI\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"GZNEIOVS\" description=\"Infinite credits\" />\n      <gamegenie code=\"GZXATEOZ\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"AAUALAGA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"AAUALAGE\" description=\"Start with 9 lives - P2\" />\n      <gamegenie code=\"AAEELOGI\" description=\"Autofire\" />\n      <gamegenie code=\"TAVPSTLA\" description=\"Double Bombs\" />\n      <gamegenie code=\"TAUAYALA\" description=\"Double credits\" />\n      <gamegenie code=\"AANEZPGA\" description=\"1 life after continue - both players\" />\n      <gamegenie code=\"AANEZPGE\" description=\"9 lives after continue - both players\" />\n      <gamegenie code=\"TAXEZAXZ\" description=\"Start with 9 lives - P1 (1 of 2)\" />\n      <gamegenie code=\"PZXELENY\" description=\"Start with 9 lives - P1 (2 of 2)\" />\n      <gamegenie code=\"EZXAPPKZ\" description=\"Start with maximum firepower (1 of 2)\" />\n      <gamegenie code=\"TAXAZOIL\" description=\"Start with maximum firepower (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-JUHSS\" name=\"Slalom\" crc=\"86670C93\">\n      <gamegenie code=\"PAOULZAA\" description=\"Ski super fast\" />\n      <gamegenie code=\"AAEPLIPA\" description=\"No track obstacles\" />\n      <gamegenie code=\"XZXPATVZ\" description=\"Timer at 5 minutes for all tracks (1 of 2)\" />\n      <gamegenie code=\"PAXPPVPN\" description=\"Timer at 5 minutes for all tracks (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SNFCG\" name=\"Smash T.V.\" crc=\"6EE94D32\">\n      <gamegenie code=\"UIVYGXVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"OPNXVTTE\" description=\"Get a lot more Grenades\" />\n      <gamegenie code=\"OXXUUYVS\" description=\"Infinite Grenades\" />\n      <gamegenie code=\"EAOZPZEY\" description=\"Touch and kill most enemies\" />\n    </game>\n    <game code=\"CLV-H-DWJYH\" name=\"Snake Rattle 'n Roll\" crc=\"FDF4569B\">\n      <gamegenie code=\"SXEYOZVG\" description=\"Infinite time\" />\n      <gamegenie code=\"AGNNVXTT\" description=\"Faster timer\" />\n      <gamegenie code=\"EPNNVXTT\" description=\"Slower timer\" />\n      <gamegenie code=\"AEXAYZZA\" description=\"1 life - both players\" />\n      <gamegenie code=\"IEXAYZZA\" description=\"6 lives - both players\" />\n      <gamegenie code=\"AEXAYZZE\" description=\"9 lives - both players\" />\n      <gamegenie code=\"AEUAETZA\" description=\"1 life - both players, after continue\" />\n      <gamegenie code=\"IEUAETZA\" description=\"6 lives - both players, after continue\" />\n      <gamegenie code=\"AEUAETZE\" description=\"9 lives - both players, after continue\" />\n      <gamegenie code=\"PEUEGXNY\" description=\"Start on level 2\" />\n      <gamegenie code=\"ZEUEGXNY\" description=\"Start on level 3\" />\n      <gamegenie code=\"LEUEGXNY\" description=\"Start on level 4\" />\n      <gamegenie code=\"GEUEGXNY\" description=\"Start on level 5\" />\n      <gamegenie code=\"IEUEGXNY\" description=\"Start on level 6\" />\n      <gamegenie code=\"TEUEGXNY\" description=\"Start on level 7\" />\n      <gamegenie code=\"SLOUSVVS\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"ZAXOSGPA\" description=\"Super-jump\" />\n      <gamegenie code=\"LAXOSGPA\" description=\"Mega-jump\" />\n    </game>\n    <game code=\"CLV-H-OERUW\" name=\"Snake's Revenge\" crc=\"48E904D0\">\n      <gamegenie code=\"SZEVEPSA\" description=\"Invincibility\" />\n      <gamegenie code=\"AXXVGYAG\" description=\"Start with half bullets for Beretta M92\" />\n      <gamegenie code=\"EEXVGYAG\" description=\"Start with double bullets for Beretta M92\" />\n      <gamegenie code=\"SZEEOUSE\" description=\"Infinite Beretta ammo\" />\n      <gamegenie code=\"SXOASKSE\" description=\"Infinite Shotgun ammo\" />\n      <gamegenie code=\"SZKAKKSE\" description=\"Infinite Grenades\" />\n      <gamegenie code=\"SXVEOKSE\" description=\"Infinite Missiles\" />\n      <gamegenie code=\"XTNTZVEE\" description=\"Infinite ammo for all weapons\" />\n      <gamegenie code=\"SXKVKASA\" description=\"Infinite health\" />\n      <gamegenie code=\"AEUVOAYA\" description=\"Reduce your injuries by up to 50%\" />\n      <gamegenie code=\"XVUYTUZE\" description=\"Play with less health (1 of 2)\" />\n      <gamegenie code=\"XTKZXKZE\" description=\"Play with less health (2 of 2)\" />\n      <gamegenie code=\"PPUGASTA\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"ZEOVAYPA\" description=\"Start with Machine Gun instead of Beretta (1 of 2)\" />\n      <gamegenie code=\"XKXVTYEG\" description=\"Start with Machine Gun instead of Beretta (2 of 2)\" />\n      <gamegenie code=\"GEOVAYPA\" description=\"Start with Shotgun instead of Beretta (1 of 2)\" />\n      <gamegenie code=\"KKXVTYEG\" description=\"Start with Shotgun instead of Beretta (2 of 2)\" />\n      <gamegenie code=\"AXOVAYPA\" description=\"Start with Grenades instead of Beretta (1 of 2)\" />\n      <gamegenie code=\"VKXVTYEG\" description=\"Start with Grenades instead of Beretta (2 of 2)\" />\n      <gamegenie code=\"EEOVAYPA\" description=\"Start with Missiles instead of Beretta (1 of 2)\" />\n      <gamegenie code=\"EKXVTYEK\" description=\"Start with Missiles instead of Beretta (2 of 2)\" />\n      <gamegenie code=\"SXSZTEVK\" description=\"Infinite time for Metal Gear battle\" />\n      <gamegenie code=\"ESXALLEY\" description=\"One hit defeats Metal Gear\" />\n    </game>\n    <game code=\"CLV-H-EYPRO\" name=\"Snow Bros. (U) [!p]\" crc=\"8965C590\">\n      <gamegenie code=\"SUUAVVVS\" description=\"Invincibility\" />\n      <gamegenie code=\"SXNEUYVI\" description=\"Infinite number of chances\" />\n      <gamegenie code=\"PAXXPLZE\" description=\"Start with 10 chances instead of 3 (count starts at 9 instead of 2)\" />\n      <gamegenie code=\"AAXXPLZA\" description=\"Start with 1 chance (count starts at 0)\" />\n      <gamegenie code=\"PAOAYLZE\" description=\"Always get 10 chances after a continue (count restarts at 9)\" />\n      <gamegenie code=\"AAOAYLZA\" description=\"Always get 1 chance after a continue (count restarts at 0)\" />\n      <gamegenie code=\"OUOOGEOO\" description=\"Don't lose super ability after you lose a chance\" />\n      <gamegenie code=\"YAEEYAAE\" description=\"Start with Speed Skates, Power Shots and super snow-throwing\" />\n      <gamegenie code=\"PAEEYAAA\" description=\"Start with Speed Skates (don't use with other &quot;start with&quot; codes)\" />\n      <gamegenie code=\"ZAEEYAAA\" description=\"Start with Power Shots (don't use with other &quot;start with&quot; codes)\" />\n      <gamegenie code=\"GAEEYAAA\" description=\"Start with super snow-throwing ability (don't use with other &quot;start with&quot; codes)\" />\n      <gamegenie code=\"GEVZTZAA\" description=\"Start on 5th floor\" />\n      <gamegenie code=\"PEVZTZAE\" description=\"Start on 10th floor\" />\n      <gamegenie code=\"LOVZTZAA\" description=\"Start on 20th floor\" />\n      <gamegenie code=\"IOVZTZAE\" description=\"Start on 30th floor\" />\n      <gamegenie code=\"YXVZTZAA\" description=\"Start on 40th floor\" />\n      <gamegenie code=\"PUVZTZAA\" description=\"Start on 50th floor\" />\n    </game>\n    <game code=\"CLV-H-PZISL\" name=\"Soccer\" crc=\"657F7875\">\n      <gamegenie code=\"APOOKZIP\" description=\"Each half lasts only 10 minutes\" />\n      <gamegenie code=\"AIOOKZIP\" description=\"Each half lasts for 50 minutes\" />\n      <gamegenie code=\"KASUOTSA\" description=\"Start X goal up (1 of 3)\" />\n      <gamegenie code=\"KASUUVSE\" description=\"Start X goal up (2 of 3)\" />\n      <gamegenie code=\"PASLVTAA\" description=\"Start 1 goal up (3 of 3)\" />\n      <gamegenie code=\"LASLVTAA (3 of 3)\" description=\"Start 3 goals up\" />\n    </game>\n    <game code=\"CLV-H-QKMRL\" name=\"Solar Jetman: Hunt for the Golden Warpship\" crc=\"8111BA08\">\n      <gamegenie code=\"PAKSZLGA\" description=\"Start with 1 ship and 1 life\" />\n      <gamegenie code=\"AAKSZLGE\" description=\"Start with 8 ships and 8 lives\" />\n      <gamegenie code=\"SZXONIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEXXAVNY\" description=\"Minimum damage taken from walls\" />\n      <gamegenie code=\"ZASSTLAA\" description=\"Start on level 3\" />\n      <gamegenie code=\"IASSTLAA\" description=\"Start on level 6\" />\n      <gamegenie code=\"AASSTLAE\" description=\"Start on level 9\" />\n      <gamegenie code=\"ZASSTLAE\" description=\"Start on level 11\" />\n      <gamegenie code=\"AASSZLPE\" description=\"Start with more money\" />\n      <gamegenie code=\"SVEKOVON\" description=\"Weapons use up no energy\" />\n      <gamegenie code=\"UNSPLSLE\" description=\"Reversed gravity for planet 1\" />\n      <gamegenie code=\"VTSOZVTO\" description=\"Reversed gravity for planet 2\" />\n      <gamegenie code=\"KVOPATGP\" description=\"Reversed gravity for planet 3\" />\n      <gamegenie code=\"XNVOTSZE\" description=\"Reversed gravity for planet 4\" />\n      <gamegenie code=\"ETXPGTAZ\" description=\"Reversed gravity for planet 5\" />\n      <gamegenie code=\"OTUOYVPX\" description=\"Reversed gravity for planet 6\" />\n      <gamegenie code=\"UTEOPTLZ\" description=\"Reversed gravity for planet 7\" />\n      <gamegenie code=\"AOXOLVEV\" description=\"Normal gravity for planet 8\" />\n      <gamegenie code=\"AEXZGVSY\" description=\"No damage taken from walls (1 of 2)\" />\n      <gamegenie code=\"AEXXAVNY\" description=\"No damage taken from walls (2 of 2)\" />\n      <gamegenie code=\"AEUIOXYA\" description=\"Items for free (1 of 2)\" />\n      <gamegenie code=\"GXKSOZSA\" description=\"Items for free (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-FGPIQ\" name=\"Solomon's Key\" crc=\"40684E95\">\n      <gamegenie code=\"SZVAIAAX\" description=\"Invincibility\" />\n      <gamegenie code=\"OUXZYPOP\" description=\"Infinite life\" />\n      <gamegenie code=\"XTKKKEXK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GZOXLAAX\" description=\"Indestructible fireball\" />\n      <gamegenie code=\"AAXZIALZ\" description=\"Continuous fairies\" />\n      <gamegenie code=\"KAXOOEVE\" description=\"Start with 40,000 life points\" />\n      <gamegenie code=\"GZUPTOSE\" description=\"Start on last level reached\" />\n      <gamegenie code=\"VTUPTOSE\" description=\"Start on next level\" />\n      <gamegenie code=\"SZUOPOSE\" description=\"Start on level XX (1 of 3)\" />\n      <gamegenie code=\"UPUOLPGA\" description=\"Start on level XX (2 of 3)\" />\n      <gamegenie code=\"PAUPIPAE\" description=\"Start on level 10 (1 of 3)\" />\n      <gamegenie code=\"LPUPIPAA\" description=\"Start on level 20 (3 of 3)\" />\n      <gamegenie code=\"IPUPIPAE\" description=\"Start on level 30 (3 of 3)\" />\n      <gamegenie code=\"YZUPIPAA\" description=\"Start on level 40 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-FLGAI\" name=\"Solstice: The Quest for the Staff of Demnos\" crc=\"EDCF1B71\">\n      <gamegenie code=\"SZSESXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SUSPIXVS\" description=\"Infinite Potions\" />\n      <gamegenie code=\"PAKAVIGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"AAKAVIGE\" description=\"Start with 8 lives\" />\n      <gamegenie code=\"PAXELPLA\" description=\"1 life after continue\" />\n      <gamegenie code=\"AAXELPLE\" description=\"8 lives after continue\" />\n      <gamegenie code=\"GAOEUIZA\" description=\"Start with full flasks of Potions\" />\n      <gamegenie code=\"AAOEUIZA\" description=\"Start with no Potions\" />\n      <gamegenie code=\"SXUXYGAX\" description=\"Multi-jump\" />\n    </game>\n    <game code=\"CLV-H-TWWAR\" name=\"Spelunker\" crc=\"99D15A91\">\n      <gamegenie code=\"ATKPAIAZ\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"TUEEYKNN\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"GXOAPKIX\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"AEXAYTAP\" description=\"Invisibility\" />\n      <gamegenie code=\"SNEAKEVN\" description=\"Jump higher (1 of 2)\" />\n      <gamegenie code=\"EANEEAAA\" description=\"Jump higher (2 of 2)\" />\n      <gamegenie code=\"IXOOPSVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AANATPZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IANATPZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AANATPZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-IXSMZ\" name=\"Spider-Man: Return of the Sinister Six\" crc=\"D679627A\">\n      <gamegenie code=\"SXNUIZAX\" description=\"Invincibility\" />\n      <gamegenie code=\"SXOKVVSE\" description=\"Infinite health\" />\n    </game>\n    <game code=\"CLV-H-FCJCJ\" name=\"Spiritual Warfare\" crc=\"14105C13\">\n      <gamegenie code=\"NYEUYIAE\" description=\"Start with all armors, 7 of each fruit, all items, 99 Keys, 255 God's Wrath, 99 Birds\" />\n      <gamegenie code=\"APKLZITE\" description=\"Start with max energy\" />\n      <gamegenie code=\"SXVGLGSA\" description=\"Infinite energy\" />\n      <gamegenie code=\"SXKGXIVG\" description=\"Infinite Vial Of God's Wrath\" />\n    </game>\n    <game code=\"CLV-H-VFJSN\" name=\"Spy Hunter\" crc=\"C7197FB1\">\n      <gamegenie code=\"SXVPEZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SXKAYOVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZEUSGVG\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"SZKUANVK\" description=\"Infinite missiles\" />\n      <gamegenie code=\"VXELTVSE\" description=\"Infinite smoke\" />\n      <gamegenie code=\"SXSOOZSA\" description=\"No enemies (1 of 2)\" />\n      <gamegenie code=\"SZUOVLSA\" description=\"No enemies (2 of 2)\" />\n      <gamegenie code=\"AAUEASTA\" description=\"Enemies die automatically (1 of 3)\" />\n      <gamegenie code=\"AESXEUYA\" description=\"Enemies die automatically (2 of 3)\" />\n      <gamegenie code=\"XVSZXLAV\" description=\"Enemies die automatically (3 of 3)\" />\n      <gamegenie code=\"AENOESTA\" description=\"Hit anywhere (1 of 5)\" />\n      <gamegenie code=\"AENOKIIP\" description=\"Hit anywhere (2 of 5)\" />\n      <gamegenie code=\"AESXEUYA\" description=\"Hit anywhere (3 of 5)\" />\n      <gamegenie code=\"AEVOSIGZ\" description=\"Hit anywhere (4 of 5)\" />\n      <gamegenie code=\"SXNONISA\" description=\"Hit anywhere (5 of 5)\" />\n      <gamegenie code=\"TEEXLILA\" description=\"Double missiles on pick-up\" />\n      <gamegenie code=\"YAEZNIYE\" description=\"Slow down timer\" />\n      <gamegenie code=\"GXSAKUSE\" description=\"Keep special weapons (1 of 2)\" />\n      <gamegenie code=\"GXSANUSE\" description=\"Keep special weapons (2 of 2)\" />\n      <gamegenie code=\"ZEEXKIAA\" description=\"Start with 2 extra lives\" />\n      <gamegenie code=\"TEEXKIAA\" description=\"Start with 6 extra lives\" />\n    </game>\n    <game code=\"CLV-H-SAJAA\" name=\"Spy vs. Spy\" crc=\"C4A02712\">\n      <gamegenie code=\"SZVAYUVK\" description=\"Stop black spy's clock\" />\n      <gamegenie code=\"SXUELUVK\" description=\"Stop white spy's clock\" />\n      <gamegenie code=\"PUEAPLIU\" description=\"Black spy has 100 seconds in a minute\" />\n      <gamegenie code=\"PUSAILIU\" description=\"White spy has 100 seconds in a minute\" />\n      <gamegenie code=\"ONVZYNUT\" description=\"Black spy has deadly punches\" />\n      <gamegenie code=\"IEVZLYIE\" description=\"White spy has deadly punches\" />\n    </game>\n    <game code=\"CLV-H-OVGUL\" name=\"Sqoon\" crc=\"44F34172\">\n      <gamegenie code=\"AEEAAIPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEUESLZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEUESLZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEUESLZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"LASEXLPA\" description=\"Start at phase 3\" />\n      <gamegenie code=\"IASEXLPA\" description=\"Start at phase 5\" />\n      <gamegenie code=\"AASEXLPE\" description=\"Start at phase 8\" />\n      <gamegenie code=\"SZEEOSVK\" description=\"Never lose your special weapon\" />\n      <gamegenie code=\"ZEOOEYPA\" description=\"Gain main weapon on rescuing 9 humans\" />\n      <gamegenie code=\"GXEAKKSE\" description=\"Never lose humans on dying (1 of 2)\" />\n      <gamegenie code=\"GXSUZXSE\" description=\"Never lose humans on dying (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-ARPHW\" name=\"Stanley: The Search for Dr. Livingston\" crc=\"62E2E7FC\">\n      <gamegenie code=\"XTSXXYVK\" description=\"Infinite time on continue screen\" />\n      <gamegenie code=\"SZEGYUSE\" description=\"Infinite health\" />\n      <gamegenie code=\"NNXGVZAE\" description=\"Start a new game with complete map\" />\n    </game>\n    <game code=\"CLV-H-CRCAQ\" name=\"Star Force\" crc=\"FCE408A4\">\n      <gamegenie code=\"SZKEVTVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEUAUIZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEUAUIZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEUAUIZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"VYVEGONN\" description=\"Turbo speed\" />\n    </game>\n    <game code=\"CLV-H-FWOQM\" name=\"Star Soldier\" crc=\"262B5A1D\">\n      <gamegenie code=\"SZOEAPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEOAPPAA\" description=\"Start with laser\" />\n      <gamegenie code=\"GXVPXTVG\" description=\"Infinite shield power\" />\n      <gamegenie code=\"ZAOOOYIE\" description=\"Double shield power (1 of 2)\" />\n      <gamegenie code=\"ZENOGLIE\" description=\"Double shield power (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-MWLJC\" name=\"Star Trek: 25th Anniversary\" crc=\"16EBA50A\">\n      <gamegenie code=\"LEOOVGYE\" description=\"Kirk has more energy\" />\n      <gamegenie code=\"GEOOVGYA\" description=\"Kirk has less energy\" />\n      <gamegenie code=\"LAUXYAYE\" description=\"McCoy has more energy\" />\n      <gamegenie code=\"GAUXYAYA\" description=\"McCoy has less energy\" />\n      <gamegenie code=\"LAUZTAYE\" description=\"Spock has more energy\" />\n      <gamegenie code=\"GAUZTAYA\" description=\"Spock has less energy\" />\n      <gamegenie code=\"LAVZLAYE\" description=\"Security has more energy\" />\n      <gamegenie code=\"LAKXAAYE\" description=\"Geologist has more energy\" />\n      <gamegenie code=\"GAKXAAYA\" description=\"Geologist has less energy\" />\n      <gamegenie code=\"LASXZAYE\" description=\"Biologist has more energy\" />\n      <gamegenie code=\"GASXZAYA\" description=\"Biologist has less energy\" />\n      <gamegenie code=\"LASZPAYE\" description=\"Historian has more energy\" />\n      <gamegenie code=\"GASZPAYA\" description=\"Historian has less energy\" />\n      <gamegenie code=\"YEKUYPGA\" description=\"McCoy gives full energy to injured party\" />\n    </game>\n    <game code=\"CLV-H-CNGOF\" name=\"Star Trek: The Next Generation\" crc=\"E575687C\">\n      <gamegenie code=\"OUXTPYOP\" description=\"All systems are immune to damage - shields down\" />\n      <gamegenie code=\"SXUVTNSE\" description=\"Shields are immune to damage - shields up\" />\n      <gamegenie code=\"AGKVTTEP\" description=\"Quicker damage repair\" />\n      <gamegenie code=\"APKVTTEP\" description=\"Very quick damage repair\" />\n      <gamegenie code=\"EGKVTTEP\" description=\"Slower damage repair\" />\n      <gamegenie code=\"ZKNVLEZE\" description=\"Enemy does less damage\" />\n      <gamegenie code=\"ATETISVT\" description=\"Stop game time ticking over\" />\n      <gamegenie code=\"AAUZPAGY\" description=\"Photon Torpedoes always work\" />\n      <gamegenie code=\"AAEXTPNY\" description=\"Phasers always work\" />\n      <gamegenie code=\"AAOXPOKT\" description=\"Phasers fire for longer\" />\n      <gamegenie code=\"AAVTZVIL\" description=\"Damage is repaired immediately\" />\n      <gamegenie code=\"SXVUSTVG\" description=\"Transporter power does not decrease most of the time\" />\n      <gamegenie code=\"IANUXTAZ\" description=\"Less transporter power required most of the time\" />\n      <gamegenie code=\"GVNZOZIT\" description=\"Stardate does not advance\" />\n    </game>\n    <game code=\"CLV-H-UVIIF\" name=\"Star Voyager\" crc=\"B1723338\">\n      <gamegenie code=\"GZSZSTVG\" description=\"Infinite life support pods\" />\n      <gamegenie code=\"GPKIASZA\" description=\"Start with double life support pods\" />\n      <gamegenie code=\"TPKIASZE\" description=\"Start with triple life support pods\" />\n      <gamegenie code=\"AASLSLLA\" description=\"Barrier won't take damage\" />\n      <gamegenie code=\"AOKLVLEI\" description=\"Radar won't take damage\" />\n      <gamegenie code=\"ENXLXLEI\" description=\"Cannon won't take damage\" />\n      <gamegenie code=\"AAXUXLLA\" description=\"Engine won't take damage\" />\n    </game>\n    <game code=\"CLV-H-VTQQG\" name=\"Star Wars\" crc=\"C1C3636B\">\n      <gamegenie code=\"AAXAGAZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAXAGAZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAXAGAZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZEAYXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"GZSYLSSO\" description=\"Immune to spikes, you can get stuck on them\" />\n      <gamegenie code=\"SLVUYNSO\" description=\"Immune to most bullets\" />\n      <gamegenie code=\"AAKLNGZA\" description=\"Full energy on big energy pick-ups\" />\n      <gamegenie code=\"AAKLUGAX\" description=\"Less energy on big energy pick-ups\" />\n      <gamegenie code=\"AGKLUGAZ\" description=\"More energy on big energy pick-ups\" />\n      <gamegenie code=\"ZEOKOIPA\" description=\"Always running (1 of 2)\" />\n      <gamegenie code=\"ZEKKXIPA\" description=\"Always running (2 of 2)\" />\n      <gamegenie code=\"GXNUZIST\" description=\"Immune to most collisions (1 of 2)\" />\n      <gamegenie code=\"SLKLYVSO\" description=\"Immune to most collisions (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-YJTZE\" name=\"Star Wars: The Empire Strikes Back\" crc=\"240DE736\">\n      <gamegenie code=\"TENLGIYE\" description=\"Start with 14 continues\" />\n      <gamegenie code=\"GZVZTNOO\" description=\"Don't take damage from most enemies\" />\n      <gamegenie code=\"PESZYPIE\" description=\"9 harpoons - scene 2\" />\n      <gamegenie code=\"PESZYPIA\" description=\"1 harpoons - scene 2\" />\n      <gamegenie code=\"GZVZVKVK\" description=\"Infinite harpoons - scene 2\" />\n      <gamegenie code=\"GXSLIISA\" description=\"Infinite energy for ship - scene 2\" />\n      <gamegenie code=\"AEXOETYL\" description=\"Always have Lightsaber\" />\n      <gamegenie code=\"PAEGXLAA\" description=\"Start on scene 2\" />\n      <gamegenie code=\"ZAEGXLAA\" description=\"Start on scene 3\" />\n      <gamegenie code=\"LAEGXLAA\" description=\"Start on scene 4\" />\n      <gamegenie code=\"GAEGXLAA\" description=\"Start on scene 5\" />\n      <gamegenie code=\"IAEGXLAA\" description=\"Start on scene 6\" />\n      <gamegenie code=\"TAEGXLAA\" description=\"Start on scene 7\" />\n    </game>\n    <game code=\"CLV-H-WWTGA\" name=\"Starship Hector\" crc=\"9F432594\">\n      <gamegenie code=\"SZKIOGVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AANSOGZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IANSOGZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AANSOGZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GEVVGIPA\" description=\"Extra health from capsules\" />\n      <gamegenie code=\"PENYGIAA\" description=\"Start at stage 2\" />\n      <gamegenie code=\"ZENYGIAA\" description=\"Start at stage 3\" />\n      <gamegenie code=\"LENYGIAA\" description=\"Start at stage 4\" />\n      <gamegenie code=\"GENYGIAA\" description=\"Start at stage 5\" />\n      <gamegenie code=\"OVUYEGSV\" description=\"Take minimum damage (1 of 2)\" />\n      <gamegenie code=\"PEUYOGTA\" description=\"Take minimum damage (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GHFNF\" name=\"Zoda's Revenge: StarTropics II\" crc=\"D054FFB0\">\n      <gamegenie code=\"PAVTTZLA\" description=\"Start with 1 life (Only effective in battle mode on first life)\" />\n      <gamegenie code=\"TAVTTZLA\" description=\"Start with 6 lives (Only effective in battle mode on first life)\" />\n      <gamegenie code=\"PAVTTZLE\" description=\"Start with 9 lives (Only effective in battle mode on first life)\" />\n      <gamegenie code=\"VZKZAOSV\" description=\"Invincibility\" />\n      <gamegenie code=\"SXKVPKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SLUZTSVS\" description=\"Infinite weapons\" />\n      <gamegenie code=\"GGEUIKOU\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"KLEUYGAY\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"UAEUTGKU\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"ZAUXKAPA\" description=\"Walk faster - battle mode\" />\n      <gamegenie code=\"PAUXKAAA\" description=\"Jump faster and further - battle mode\" />\n      <gamegenie code=\"AVKULAAG\" description=\"Throw Tink's axe further\" />\n      <gamegenie code=\"PASZPTIA\" description=\"1 star gives energy (1 of 2)\" />\n      <gamegenie code=\"PASZITIA\" description=\"1 star gives energy (2 of 2)\" />\n      <gamegenie code=\"OYUUAAPG\" description=\"Throw Tink's Axe faster (can't be combined with other Axe code)\" />\n      <gamegenie code=\"LGUUAAPG\" description=\"Tink's Axe splits into 3 little ones when thrown (can't be combined with other Axe code)\" />\n      <gamegenie code=\"UYUUAAOY\" description=\"Throw Tink's splitting-Axe faster (can't be combined with other Axe code)\" />\n    </game>\n    <game code=\"CLV-H-TXGZR\" name=\"Stinger\" crc=\"C5B0B1AB\">\n      <gamegenie code=\"GZNGNLSP\" description=\"Keep weapons after death\" />\n      <gamegenie code=\"PAXKPGLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAXKPGLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAXKPGLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"OZVKKLVS\" description=\"Infinite lives\" />\n      <gamegenie code=\"YGNGAKTL\" description=\"Start with XX (1 of 2)\" />\n      <gamegenie code=\"PAVKTGAP\" description=\"Start with Dual Cannons (2 of 2)\" />\n      <gamegenie code=\"ZAVKTGAP\" description=\"Start with Laser (2 of 2)\" />\n      <gamegenie code=\"GAVKTGAP\" description=\"Start with Shoot Right (2 of 2)\" />\n      <gamegenie code=\"AAVKTGAO\" description=\"Start with Shoot Left (2 of 2)\" />\n      <gamegenie code=\"APVKTGAP\" description=\"Start with Five Direction Firing (2 of 2)\" />\n      <gamegenie code=\"AZVKTGAP\" description=\"Start with Three Direction Firing (2 of 2)\" />\n      <gamegenie code=\"AGVKTGAP\" description=\"Start with Force field (2 of 2)\" />\n      <gamegenie code=\"GZOGIGSA\" description=\"Start at stage X (wait for demo game then press start) (1 of 2)\" />\n      <gamegenie code=\"PAEGPLPA\" description=\"Start at stage 2 (wait for demo game then press start) (2 of 2)\" />\n      <gamegenie code=\"ZAEGPLPA\" description=\"Start at stage 3 (wait for demo game then press start) (2 of 2)\" />\n      <gamegenie code=\"LAEGPLPA\" description=\"Start at stage 4 (wait for demo game then press start) (2 of 2)\" />\n      <gamegenie code=\"GAEGPLPA\" description=\"Start at stage 5 (wait for demo game then press start) (2 of 2)\" />\n      <gamegenie code=\"IAEGPLPA\" description=\"Start at stage 6 (wait for demo game then press start) (2 of 2)\" />\n      <gamegenie code=\"IESKLLAA\" description=\"Skip intro\" />\n    </game>\n    <game code=\"CLV-H-FROUF\" name=\"Street Cop\" crc=\"61D86167\">\n      <gamegenie code=\"TAOVTXPA\" description=\"Have less time\" />\n      <gamegenie code=\"ZPOVTXPA\" description=\"Have more time\" />\n      <gamegenie code=\"SZSNTAVG\" description=\"Infinite time\" />\n      <gamegenie code=\"GXESTZST\" description=\"Infinite health\" />\n      <gamegenie code=\"AONGNAAU\" description=\"Start with less health\" />\n      <gamegenie code=\"AVNGNAAL\" description=\"Start with more health\" />\n      <gamegenie code=\"PAXTPPAA\" description=\"Start at level 2\" />\n      <gamegenie code=\"ZAXTPPAA\" description=\"Start at level 3\" />\n      <gamegenie code=\"LAXTPPAA\" description=\"Start at level 4\" />\n      <gamegenie code=\"OVESTZSV\" description=\"Take minimum damage (1 of 2)\" />\n      <gamegenie code=\"PEESYZAP\" description=\"Take minimum damage (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-UACKE\" name=\"Street Fighter 2010: The Final Fight\" crc=\"8DA651D4\">\n      <gamegenie code=\"AZNSYIPP\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"EINSTIEL\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"SZNSLSOS\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"AAEETAGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PAEETAGE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZUATPVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEUIPGZA\" description=\"Infinite health\" />\n      <gamegenie code=\"EYSSLGEI\" description=\"Invincibility\" />\n      <gamegenie code=\"PEUIPGZA\" description=\"Take less damage\" />\n      <gamegenie code=\"LEUIPGZA\" description=\"Take more damage\" />\n      <gamegenie code=\"GZOAZPSA\" description=\"Keep power-ups after losing a life\" />\n      <gamegenie code=\"AEKIYGZA\" description=\"Keep power-ups when hit\" />\n      <gamegenie code=\"ZESESPPA\" description=\"Faster Ken\" />\n      <gamegenie code=\"SLUKAZSP\" description=\"Infinite time\" />\n      <gamegenie code=\"SXVTVUVK\" description=\"Portal always stays open\" />\n    </game>\n    <game code=\"CLV-H-IWRSU\" name=\"Strider\" crc=\"02EE3706\">\n      <gamegenie code=\"OXNAUKPX\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"PVNAVGIU\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"AANVSZTZ\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"AEEVXXPP\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"ZAUXEYPE\" description=\"More energy from small capsules (10)\" />\n      <gamegenie code=\"GPUXXNZA\" description=\"More energy from big capsules (20)\" />\n      <gamegenie code=\"ZAUXKYPE\" description=\"Health from small capsules (10)\" />\n      <gamegenie code=\"GPUXVNZA\" description=\"Health from big capsules (20)\" />\n      <gamegenie code=\"ZAEXVNAO\" description=\"Double health and energy from all capsules\" />\n    </game>\n    <game code=\"CLV-H-WVRYB\" name=\"Stunt Kids\" crc=\"3A990EE0\">\n      <gamegenie code=\"AESGNZZA\" description=\"Start with 1 life instead of 3\" />\n      <gamegenie code=\"IESGNZZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PESGNZZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZSZSKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEESPALA\" description=\"Start with 0 turbos instead of 3\" />\n      <gamegenie code=\"TEESPALA\" description=\"Start with 6 turbos\" />\n      <gamegenie code=\"PEESPALE\" description=\"Start with 9 turbos\" />\n      <gamegenie code=\"VANILVKE\" description=\"Always have 9 coins after a race\" />\n      <gamegenie code=\"SZKOEOVV\" description=\"Coins worth nothing on pick-up\" />\n      <gamegenie code=\"SLNOYXVS\" description=\"Infinite time - P1\" />\n      <gamegenie code=\"SLXOYUVS\" description=\"Infinite time - P2\" />\n    </game>\n    <game code=\"CLV-H-EISTB\" name=\"Sunday Funday: The Ride\" crc=\"5B16A3C8\">\n      <gamegenie code=\"ESNNUZEY\" description=\"Enable level skip (Press B then Select)\" />\n    </game>\n    <game code=\"CLV-H-WMPJX\" name=\"Super Mario Bros. 3\" crc=\"A0B0B742\">\n      <gamegenie code=\"KKKZSPIU\" description=\"Enable Debug Mode\" />\n      <gamegenie code=\"SLXPLOVS\" description=\"Infinite lives for Mario and Luigi\" />\n      <gamegenie code=\"YPXXLVGE\" description=\"Mario (not Luigi) can re-use items again and again\" />\n    </game>  \n    <game code=\"CLV-H-IYAOH\" name=\"Super Pitfall\" crc=\"979C5314\">\n      <gamegenie code=\"SZKSASVK\" description=\"Infinite lives - 1P game\" />\n      <gamegenie code=\"SXESTSVK\" description=\"Infinite lives - P1\" />\n      <gamegenie code=\"SXXSZSVK\" description=\"Infinite lives - P2\" />\n      <gamegenie code=\"PAVIPALA\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"TAVIPALA\" description=\"Start with 6 lives - both players\" />\n      <gamegenie code=\"PAVIPALE\" description=\"Start with 9 lives - both players\" />\n      <gamegenie code=\"LEXKNYZA\" description=\"Start with 30 bullets\" />\n      <gamegenie code=\"PEXKNYZA\" description=\"Start with 10 bullets\" />\n      <gamegenie code=\"AEOYILPA\" description=\"Infinite bullets\" />\n      <gamegenie code=\"LENLELZA\" description=\"30 bullets gained on pick-up\" />\n      <gamegenie code=\"PENLELZA\" description=\"10 bullets gained on pick-up\" />\n    </game>\n    <game code=\"CLV-H-LUKEO\" name=\"Super Sprint\" crc=\"5F2C3195\">\n      <gamegenie code=\"SZETVUVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"YASSPALA\" description=\"6 continues\" />\n      <gamegenie code=\"PASSPALA\" description=\"No continues\" />\n      <gamegenie code=\"GXSGUVSE\" description=\"XX obstacles on tracks (1 of 2)\" />\n      <gamegenie code=\"IEKKNTAA\" description=\"More obstacles on tracks (2 of 2)\" />\n      <gamegenie code=\"ZEKKNTAE\" description=\"Even more obstacles on tracks (2 of 2)\" />\n      <gamegenie code=\"YEKKNTAE\" description=\"Lots and lots of obstacles on tracks (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GWZKK\" name=\"Super Spy Hunter\" crc=\"AB41445E\">\n      <gamegenie code=\"SXVPEZSA\" description=\"Infinite health\" />\n      <gamegenie code=\"GEXUOIGE\" description=\"Start with max health gauge\" />\n    </game>\n    <game code=\"CLV-H-GJFLM\" name=\"Superman\" crc=\"1FA8C4A4\">\n      <gamegenie code=\"AAXSEIEA\" description=\"Never die when out of super power\" />\n      <gamegenie code=\"SXNSSKSE\" description=\"Never lose super power\" />\n      <gamegenie code=\"XVUVYZIA\" description=\"Start with lots of super power\" />\n      <gamegenie code=\"AVEOUIAL\" description=\"Double max power of all items at start\" />\n      <gamegenie code=\"AXUPYLAP\" description=\"Double usual item power on item power crystal pick-up\" />\n      <gamegenie code=\"EXUPYLAP\" description=\"Full item power on item power crystal pick-up\" />\n      <gamegenie code=\"EZVPKSOZ\" description=\"Start at mission X (1 of 3)\" />\n      <gamegenie code=\"KANPXSSE\" description=\"Start at mission X (2 of 3)\" />\n      <gamegenie code=\"PAVPSIAA\" description=\"Start at mission 2 (3 of 3)\" />\n      <gamegenie code=\"ZAVPSIAA\" description=\"Start at mission 3 (3 of 3)\" />\n      <gamegenie code=\"LAVPSIAA\" description=\"Start at mission 4 (3 of 3)\" />\n      <gamegenie code=\"GAVPSIAA\" description=\"Start at mission 5 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-TUFCR\" name=\"Swamp Thing\" crc=\"A1FF4E1D\">\n      <gamegenie code=\"PEVOTKPX\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"ESVOZGEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SZNVZVVK\" description=\"Infinite health\" />\n      <gamegenie code=\"SZNTIKVK\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-RYZSH\" name=\"Sword Master\" crc=\"465E5483\">\n      <gamegenie code=\"ALKZVZAP\" description=\"Invincibility\" />\n      <gamegenie code=\"SXSKNXSE\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SZSGNXSE\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"SZNTVUSE\" description=\"Infinite continues\" />\n      <gamegenie code=\"AAEGKGPZ\" description=\"Gain a level for every EXP point gained\" />\n    </game>\n    <game code=\"CLV-H-OKXVB\" name=\"Swords and Serpents\" crc=\"3417EC46\">\n      <gamegenie code=\"VANGKTVE\" description=\"All characters have Scale Armor\" />\n      <gamegenie code=\"UEEKSTOE\" description=\"Warriors start with a Great Sword\" />\n      <gamegenie code=\"KEEKSTOE\" description=\"Warriors start with a Great Axe\" />\n      <gamegenie code=\"SEEGETSE\" description=\"Magicians start with a Wizard's Wand\" />\n      <gamegenie code=\"YPKGSTLE\" description=\"Magicians start with more spells\" />\n      <gamegenie code=\"LAKKXTAA\" description=\"Magicians have greater spells\" />\n      <gamegenie code=\"GZKYLGOY\" description=\"Spells use up no magic points\" />\n      <gamegenie code=\"XEOGVTXE\" description=\"Thieves start with a Long Sword\" />\n      <gamegenie code=\"KEOGVTXA\" description=\"Thieves start with an Axe\" />\n      <gamegenie code=\"TPXGNVZE\" description=\"Start with 30 health points each (1 of 2)\" />\n      <gamegenie code=\"TPXKSVZE\" description=\"Start with 30 health points each (2 of 2)\" />\n      <gamegenie code=\"ZLXGNVZA\" description=\"Start with 50 health points each (1 of 2)\" />\n      <gamegenie code=\"ZLXKSVZA\" description=\"Start with 50 health points each (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-KDOCQ\" name=\"Tag Team Wrestling\" crc=\"BF250AF2\">\n      <gamegenie code=\"OOUSLZSO\" description=\"Infinite health (glitchy)\" />\n      <gamegenie code=\"SUNKXTVI\" description=\"Never give up\" />\n    </game>\n    <game code=\"CLV-H-GKKTU\" name=\"TaleSpin, Disney's\" crc=\"798EEB98\">\n      <gamegenie code=\"AYVKZYLY\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TYVKZYLY\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"PYVKZYLN\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"ANNGVLLY\" description=\"1 life after continue\" />\n      <gamegenie code=\"TNNGVLLY\" description=\"7 lives after continue\" />\n      <gamegenie code=\"PNNGVLLN\" description=\"10 lives after continue\" />\n      <gamegenie code=\"GZKGNKVK\" description=\"Infinite lives from getting trapped by obstacles\" />\n      <gamegenie code=\"AAXEGPTA\" description=\"Infinite health\" />\n      <gamegenie code=\"PYEGITLY\" description=\"1 continue\" />\n      <gamegenie code=\"TYEGITLY\" description=\"6 continues\" />\n      <gamegenie code=\"PYEGITLN\" description=\"9 continues\" />\n      <gamegenie code=\"SXNKXLVG\" description=\"Infinite continues\" />\n      <gamegenie code=\"PYVGUAAY\" description=\"Add $1,000,000 to end-of-level bonus\" />\n    </game>\n    <game code=\"CLV-H-AEDRX\" name=\"Target: Renegade\" crc=\"93B49582\">\n      <gamegenie code=\"SZEAOZVG\" description=\"Infinite time\" />\n      <gamegenie code=\"SXEATXSU\" description=\"Set timer to 5:00 for all levels\" />\n      <gamegenie code=\"AEKESZZA\" description=\"Hearts replenish health to maximum\" />\n      <gamegenie code=\"SXVZVTSA\" description=\"Don't take most damage\" />\n      <gamegenie code=\"TASPSPGP\" description=\"Take half damage from bosses\" />\n      <gamegenie code=\"PAOOYZAA\" description=\"Start on level 2\" />\n      <gamegenie code=\"ZAOOYZAA\" description=\"Start on level 3\" />\n      <gamegenie code=\"LAOOYZAA\" description=\"Start on level 4\" />\n      <gamegenie code=\"GAOOYZAA\" description=\"Start on level 5\" />\n      <gamegenie code=\"IAOOYZAA\" description=\"Start on level 6\" />\n      <gamegenie code=\"TAOOYZAA\" description=\"Start on level 7\" />\n      <gamegenie code=\"SXEATXSU\" description=\"Set timer to 3:00 for all levels (1 of 2)\" />\n      <gamegenie code=\"NKEEAZEE\" description=\"Set timer to 3:00 for all levels (1 of 2)\" />\n    </game>\n    <game code=\"CLV-H-PXOPP\" name=\"Tecmo NBA Basketball\" crc=\"2651F227\">\n      <gamegenie code=\"SLVUPUVS\" description=\"Infinite timeouts\" />\n      <gamegenie code=\"AEOLVPPA\" description=\"2-pt. shots worth 1, 3-pt. shots worth 2\" />\n      <gamegenie code=\"ZEOLVPPA\" description=\"2-pt. shots worth 3, 3-pt. shots worth 4\" />\n      <gamegenie code=\"LEOLVPPA\" description=\"2-pt. shots worth 4, 3-pt. shots worth 5\" />\n      <gamegenie code=\"GEOLVPPA\" description=\"2-pt. shots worth 5, 3-pt. shots worth 6\" />\n      <gamegenie code=\"IEOLVPPA\" description=\"2-pt. shots worth 6, 3-pt. shots worth 7\" />\n      <gamegenie code=\"AVNUVOVT\" description=\"3-pt. shots worth 2 pts.\" />\n      <gamegenie code=\"NYSENZYE\" description=\"5-second violations become 10-second violations\" />\n      <gamegenie code=\"NYOPTNZE\" description=\"No 10-second violations\" />\n      <gamegenie code=\"ASOLSEAO\" description=\"Longer shot clock after getting ball on rebound\" />\n      <gamegenie code=\"AEOLSEAO\" description=\"Shorter shot clock after getting ball on rebound\" />\n    </game>\n    <game code=\"CLV-H-NUTUN\" name=\"Tecmo Super Bowl\" crc=\"179A0D57\">\n      <gamegenie code=\"ZXTISS\" description=\"Almost every player has their skill level at 100\" />\n      <gamegenie code=\"APUXLZIA\" description=\"10 minutes per quarter instead of 5\" />\n      <gamegenie code=\"AZUXLZIA\" description=\"20 minutes per quarter\" />\n      <gamegenie code=\"ZAUXLZIA\" description=\"2 minutes per quarter\" />\n      <gamegenie code=\"SXNXPZVG\" description=\"Infinite time (continuous play)\" />\n      <gamegenie code=\"AAOATTTA\" description=\"Touchdown scores 0 instead of 6 - P1\" />\n      <gamegenie code=\"AEOEVITA\" description=\"Touchdown scores 0 - P2 or computer\" />\n      <gamegenie code=\"LAOATTTA\" description=\"Touchdown scores 3 - P1\" />\n      <gamegenie code=\"LEOEVITA\" description=\"Touchdown scores 3 - P2 or computer\" />\n      <gamegenie code=\"PAOATTTE\" description=\"Touchdown scores 9 - P1\" />\n      <gamegenie code=\"PEOEVITE\" description=\"Touchdown scores 9 - P2 or computer\" />\n      <gamegenie code=\"GAOATTTE\" description=\"Touchdown scores 12 - P1\" />\n      <gamegenie code=\"GEOEVITE\" description=\"Touchdown scores 12 - P2 or computer\" />\n      <gamegenie code=\"AAEALYPA\" description=\"Extra-point kick scores 0 instead of 1 - P1\" />\n      <gamegenie code=\"AEEEUTPA\" description=\"Extra-point kick scores 0 - P2 or computer\" />\n      <gamegenie code=\"ZAEALYPA\" description=\"Extra-point kick scores 2 - P1\" />\n      <gamegenie code=\"ZEEEUTPA\" description=\"Extra-point kick scores 2 - P2 or computer\" />\n      <gamegenie code=\"LAEALYPA\" description=\"Extra-point kick scores 3 - P1\" />\n      <gamegenie code=\"LEEEUTPA\" description=\"Extra-point kick scores 3 - P2 or computer\" />\n      <gamegenie code=\"TAEALYPA\" description=\"Extra-point kick scores 6 - P1\" />\n      <gamegenie code=\"TEEEUTPA\" description=\"Extra-point kick scores 6 - P2 or computer\" />\n      <gamegenie code=\"AEKAGGLA\" description=\"Field goal scores 0 instead of 3 - P1\" />\n      <gamegenie code=\"AAKEKGLA\" description=\"Field goal scores 0 - P2 or computer\" />\n      <gamegenie code=\"PEKAGGLA\" description=\"Field goal scores 1 - P1\" />\n      <gamegenie code=\"PAKEKGLA\" description=\"Field goal scores 1 - P2 or computer\" />\n      <gamegenie code=\"TEKAGGLA\" description=\"Field goal scores 6 - P1\" />\n      <gamegenie code=\"TAKEKGLA\" description=\"Field goal scores 6 - P2 or computer\" />\n      <gamegenie code=\"PEKAGGLE\" description=\"Field goal scores 9 - P1\" />\n      <gamegenie code=\"PAKEKGLE\" description=\"Field goal scores 9 - P2 or computer\" />\n      <gamegenie code=\"AASASIZA\" description=\"Safety scores 0 instead of 2 - P1\" />\n      <gamegenie code=\"AEKEIIZA\" description=\"Safety scores 0 - P2 or computer\" />\n      <gamegenie code=\"PASASIZA\" description=\"Safety scores 1 - P1\" />\n      <gamegenie code=\"PEKEIIZA\" description=\"Safety scores 1 - P2 or computer\" />\n      <gamegenie code=\"GASASIZA\" description=\"Safety scores 4 - P1\" />\n      <gamegenie code=\"GEKEIIZA\" description=\"Safety scores 4 - P2 or computer\" />\n      <gamegenie code=\"TASASIZA\" description=\"Safety scores 6 - P1\" />\n      <gamegenie code=\"TEKEIIZA\" description=\"Safety scores 6 - P2 or computer\" />\n    </game>\n    <game code=\"CLV-H-HKMYT\" name=\"Tecmo World Wrestling\" crc=\"7FF76219\">\n      <gamegenie code=\"SXKIIYSA\" description=\"Infinite health - P1\" />\n      <gamegenie code=\"IEUSTOZA\" description=\"Half training time allowed\" />\n      <gamegenie code=\"GOUSTOZA\" description=\"Double training time allowed\" />\n      <gamegenie code=\"OOPSYY\" description=\"Lose all energy after being on the receiving end of a move\" />\n    </game>\n    <game code=\"CLV-H-ACHAV\" name=\"Teenage Mutant Ninja Turtles\" crc=\"EE921D8E\">\n      <gamegenie code=\"SXOPPIAX\" description=\"Invincibility\" />\n      <gamegenie code=\"AOSOUAST\" description=\"Infinite health\" />\n      <gamegenie code=\"OUVPUEOO\" description=\"Infinite health (alt)\" />\n      <gamegenie code=\"GXSOUAST\" description=\"Infinite health (alt 2)\" />\n      <gamegenie code=\"SXVZGSOO\" description=\"Don't take damage from non-killing seaweed\" />\n      <gamegenie code=\"AEOOGTZA\" description=\"Full health boost from pizza slices\" />\n      <gamegenie code=\"ZENOATGO\" description=\"10 weapons on pick-up\" />\n      <gamegenie code=\"ZUNOATGP\" description=\"50 weapons on pick-up\" />\n      <gamegenie code=\"LVNOATGP\" description=\"99 weapons on pick-up\" />\n      <gamegenie code=\"GPUOLNZA\" description=\"20 missiles on pick-up\" />\n      <gamegenie code=\"YTUOLNZA\" description=\"99 missiles on pick-up\" />\n      <gamegenie code=\"TAKOPYLA\" description=\"Double rope on pick-up\" />\n      <gamegenie code=\"SXVXTLVG\" description=\"Never lose rope\" />\n      <gamegenie code=\"SXOZTVSE\" description=\"Reduce recovery time\" />\n      <gamegenie code=\"IIIPAP\" description=\"No sound\" />\n      <gamegenie code=\"IAXGPTZA\" description=\"Start a new game to view ending\" />\n    </game>\n    <game code=\"CLV-H-ZIPIV\" name=\"Teenage Mutant Ninja Turtles: Tournament Fighters\" crc=\"86964EDD\">\n      <gamegenie code=\"OZVVVTEO\" description=\"Infinite health (1 of 3)\" />\n      <gamegenie code=\"ELVVNVLP\" description=\"Infinite health (2 of 3)\" />\n      <gamegenie code=\"SANTOVSU\" description=\"Infinite health (3 of 3)\" />\n      <gamegenie code=\"GXKVKXVK\" description=\"Infinite time\" />\n      <gamegenie code=\"AUXAGAEL\" description=\"Start with 1/3 health - both players\" />\n      <gamegenie code=\"NYUEESPYE\" description=\"Select ultra strength (ignore strength meter and keep pushing to the right) - both players\" />\n      <gamegenie code=\"YAVAZLGA\" description=\"Select any character in story mode\" />\n      <gamegenie code=\"OKKEZTVG\" description=\"Infinite continues\" />\n      <gamegenie code=\"PEXAGAEL\" description=\"First hit wins round\" />\n      <gamegenie code=\"OZNEOXPV\" description=\"One round wins match (1 of 2)\" />\n      <gamegenie code=\"ZANEXZPA\" description=\"One round wins match (2 of 2)\" />\n      <gamegenie code=\"LEXYLGZE\" description=\"Start a new game to view ending\" />\n    </game>\n    <game code=\"CLV-H-EJLOC\" name=\"Teenage Mutant Ninja Turtles II: The Arcade Game\" crc=\"A9217EA2\">\n      <gamegenie code=\"ESUEPZEY\" description=\"Invincibility (except grabs from behind) - both players\" />\n      <gamegenie code=\"SUVASVSO\" description=\"Infinite health - both players (1 of 2)\" />\n      <gamegenie code=\"SLETOKSO\" description=\"Infinite health - both players (2 of 2)\" />\n      <gamegenie code=\"AAEAULPA\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"AOXVXZEI\" description=\"One hit kills - both players\" />\n      <gamegenie code=\"PEXTKZZE\" description=\"Stronger turtle weapon\" />\n      <gamegenie code=\"PEOVKZGE\" description=\"Stronger jump + attack\" />\n      <gamegenie code=\"ZEOVKZGA\" description=\"Stronger jump + attack\" />\n      <gamegenie code=\"PEXTEZLE\" description=\"Stronger kick\" />\n      <gamegenie code=\"PEXTEZLA\" description=\"Weaker kick\" />\n      <gamegenie code=\"OEVKNZAA\" description=\"Enable stage select and 10 lives code\" />\n      <gamegenie code=\"GESSGLPA\" description=\"Press Start to finish the level (1 of 2)\" />\n      <gamegenie code=\"GUSSTUIU\" description=\"Press Start to finish the level (2 of 2)\" />\n      <gamegenie code=\"PEOIAPZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEOIAPZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEOIAPZE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-ZUGWI\" name=\"Teenage Mutant Ninja Turtles III: The Manhattan Project\" crc=\"BB6D7949\">\n      <gamegenie code=\"ENSKKIEI\" description=\"Invincibility (except grabs from behind)\" />\n      <gamegenie code=\"SLXUTXVS\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SLKXPKSO\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"AENKLZPA\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXNSKKVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"AAESYXAA\" description=\"No health loss from using turbo attack\" />\n      <gamegenie code=\"ALUGVYAG\" description=\"High-jump\" />\n      <gamegenie code=\"AZUGVYAK\" description=\"Super-jump\" />\n      <gamegenie code=\"AZUGVYAG\" description=\"Mega-jump\" />\n      <gamegenie code=\"AAEZVETP\" description=\"Hit anywhere - both players (1 of 6)\" />\n      <gamegenie code=\"AANXNZNI\" description=\"Hit anywhere - both players (2 of 6)\" />\n      <gamegenie code=\"AAOZEAGP\" description=\"Hit anywhere - both players (3 of 6)\" />\n      <gamegenie code=\"APXZXEUX\" description=\"Hit anywhere - both players (4 of 6)\" />\n      <gamegenie code=\"XTXZEEOS\" description=\"Hit anywhere - both players (5 of 6)\" />\n      <gamegenie code=\"XTXZOEAN\" description=\"Hit anywhere - both players (6 of 6)\" />\n      <gamegenie code=\"PAUZOGLA\" description=\"1 continue\" />\n      <gamegenie code=\"PAUZOGLE\" description=\"9 continues\" />\n      <gamegenie code=\"AEOAALLA\" description=\"Start with 1 life instead of 4\" />\n      <gamegenie code=\"IEOAALLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEOAALLE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-XNTBC\" name=\"T2: Terminator 2: Judgment Day\" crc=\"EA27B477\">\n      <gamegenie code=\"SXOATOVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"PANXPLGA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PANXPLGE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GXVTXZAX\" description=\"Infinite health\" />\n      <gamegenie code=\"XNVOSOKN\" description=\"Super-jump\" />\n      <gamegenie code=\"OXNVKXPK\" description=\"Take minimal damage (1 of 2)\" />\n      <gamegenie code=\"VNNVSXNN\" description=\"Take minimal damage (2 of 2)\" />\n      <gamegenie code=\"PAOOVZZA\" description=\"Slower running (1 of 2)\" />\n      <gamegenie code=\"PAUOXZZA\" description=\"Slower running (2 of 2)\" />\n      <gamegenie code=\"LAOOVZZA\" description=\"Faster running (1 of 2)\" />\n      <gamegenie code=\"LAUOXZZA\" description=\"Faster running (2 of 2)\" />\n      <gamegenie code=\"LESPKGZA\" description=\"Faster and longer jumping (1 of 2)\" />\n      <gamegenie code=\"LEVPEGZA\" description=\"Faster and longer jumping (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-LWPRP\" name=\"Terminator, The\" crc=\"6272C549\">\n      <gamegenie code=\"SXNLNESE\" description=\"Infinite health\" />\n      <gamegenie code=\"SXVYIEVK\" description=\"Infinite Grenades\" />\n    </game>\n    <game code=\"CLV-H-TLNNA\" name=\"Terra Cresta\" crc=\"2A46B57F\">\n      <gamegenie code=\"KTKSLGAZ\" description=\"Invincibility\" />\n      <gamegenie code=\"SZKVPTVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAKSPGZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAKSPGZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAKSPGZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXSTULVG\" description=\"Infinite ship formation splits\" />\n      <gamegenie code=\"PEOTEALE\" description=\"9 ship formation splits (1 of 2)\" />\n      <gamegenie code=\"PEKGETLE\" description=\"9 ship formation splits (2 of 2)\" />\n      <gamegenie code=\"AEVKNYLA\" description=\"A secret mega-weapon\" />\n    </game>\n    <game code=\"CLV-H-MXPPB\" name=\"Tetris\" crc=\"1394F57E\">\n      <gamegenie code=\"AEOPKZYL\" description=\"Lines are cleared when a piece is dropped\" />\n      <gamegenie code=\"GAOPEILA\" description=\"Disable Game Over (press start) (1 of 4)\" />\n      <gamegenie code=\"GGOPSZEN\" description=\"Disable Game Over (press start) (2 of 4)\" />\n      <gamegenie code=\"XPOPNZSX\" description=\"Disable Game Over (press start) (3 of 4)\" />\n      <gamegenie code=\"YGOPVZAL\" description=\"Disable Game Over (press start) (4 of 4)\" />\n      <gamegenie code=\"AEEOUKAA\" description=\"999999 score with one piece dropped\" />\n      <gamegenie code=\"TOUZYLTO\" description=\"Puzzle area doesn't disappear on pause\" />\n      <gamegenie code=\"ENEALYNN\" description=\"2P interactive game\" />\n      <gamegenie code=\"APSEGYIZ\" description=\"Need only complete 10 lines in game B\" />\n      <gamegenie code=\"AISEGYIZ\" description=\"Must complete 50 lines in game B\" />\n      <gamegenie code=\"EASEGYIZ\" description=\"Must complete 80 lines in game B\" />\n      <gamegenie code=\"PASAUPPE\" description=\"Faster forced fall rate\" />\n    </game>\n    <game code=\"CLV-H-LCMKF\" name=\"Tetris 2\" crc=\"9C537919\">\n      <gamegenie code=\"AAUEUSSO\" description=\"(1P game) Speed doesn't increase\" />\n      <gamegenie code=\"VNUEUSSO\" description=\"(1P game) Speed increases much faster\" />\n      <gamegenie code=\"TEXAKYPA\" description=\"(1P game) Start and stay at speed of 25\" />\n      <gamegenie code=\"ZEKESSPP\" description=\"(1P game) Max speed is 2 (1 of 2)\" />\n      <gamegenie code=\"PESAOSAP\" description=\"(1P game) Max speed is 2 (2 of 2)\" />\n      <gamegenie code=\"ZEKESSPO\" description=\"(1P game) Max speed is 10 (1 of 2)\" />\n      <gamegenie code=\"PESAOSAO\" description=\"(1P game) Max speed is 10 (2 of 2)\" />\n      <gamegenie code=\"YEKESSPO\" description=\"(1P game) Max speed is 15 (1 of 2)\" />\n      <gamegenie code=\"TESAOSAO\" description=\"(1P game) Max speed is 15 (2 of 2)\" />\n      <gamegenie code=\"GOKESSPP\" description=\"(1P game) Max speed is 20 (1 of 2)\" />\n      <gamegenie code=\"LOSAOSAP\" description=\"(1P game) Max speed is 20 (2 of 2)\" />\n      <gamegenie code=\"OZNETPOU\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 4 fixed blocks (1 of 2)\" />\n      <gamegenie code=\"PANEYPAA\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 4 fixed blocks (2 of 2)\" />\n      <gamegenie code=\"OZNETPOU\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 10 fixed blocks (1 of 2)\" />\n      <gamegenie code=\"YANEYPAA\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 10 fixed blocks (2 of 2)\" />\n      <gamegenie code=\"OZNETPOU\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 15 fixed blocks (1 of 2)\" />\n      <gamegenie code=\"GANEYPAE\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 15 fixed blocks (2 of 2)\" />\n      <gamegenie code=\"OZNETPOU\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 20 fixed blocks (1 of 2)\" />\n      <gamegenie code=\"PPNEYPAA\" description=\"(1P vs 2P or 1P vs Com) Every round starts with 20 fixed blocks (2 of 2)\" />\n      <gamegenie code=\"AAVZVYEA\" description=\"(All game types) Cannot pause game\" />\n      <gamegenie code=\"AVEXOYXZ\" description=\"(All game types) Don't hide remaining pieces during pause\" />\n    </game>\n    <game code=\"CLV-H-WZZKY\" name=\"Thunder &amp; Lightning\" crc=\"D80B44BC\">\n      <gamegenie code=\"SINPPLVI\" description=\"Infinite lives - P1\" />\n    </game>\n    <game code=\"CLV-H-FWXCF\" name=\"Thunderbirds\" crc=\"2DDC2DC3\">\n      <gamegenie code=\"SXNTOVVK\" description=\"Don't lose life points when colliding with enemy\" />\n      <gamegenie code=\"SZUVUNVK\" description=\"Don't lose life points when hit\" />\n      <gamegenie code=\"SXNVVVVK\" description=\"Don't lose energy points when colliding with enemy\" />\n      <gamegenie code=\"SZKVENVK\" description=\"Don't lose energy points when hit\" />\n      <gamegenie code=\"PSEKIVGL\" description=\"81 Days to defeat Hood\" />\n      <gamegenie code=\"TOEKIVGU\" description=\"30 Days to defeat Hood\" />\n      <gamegenie code=\"ATXEANAA\" description=\"Limited forward movement (1 of 2)\" />\n      <gamegenie code=\"ATXEGNAA\" description=\"Limited forward movement (2 of 2)\" />\n      <gamegenie code=\"GEXETTZA\" description=\"Faster craft (1 of 2)\" />\n      <gamegenie code=\"GEXEZTZA\" description=\"Faster craft (2 of 2)\" />\n      <gamegenie code=\"EZUAETEG\" description=\"Full firepower on first pick-up (1 of 2)\" />\n      <gamegenie code=\"XTUAKVEK\" description=\"Full firepower on first pick-up (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-MUBAD\" name=\"Thundercade\" crc=\"AFB46DD6\">\n      <gamegenie code=\"GXVYPZVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAOYIILA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAOYIILA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAOYIILE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AAUNLIPP\" description=\"Infinite Missiles\" />\n      <gamegenie code=\"GZXYZTVI\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"TENNPZLA\" description=\"Start with double Bombs\" />\n      <gamegenie code=\"PENNPZLE\" description=\"Start with triple Bombs\" />\n      <gamegenie code=\"ZANYGSZA\" description=\"Autofire\" />\n    </game>\n    <game code=\"CLV-H-CZLJM\" name=\"Tiger-Heli\" crc=\"C3C7A568\">\n      <gamegenie code=\"SZSYAEGK\" description=\"Don't take damage\" />\n      <gamegenie code=\"SLXLGNVS\" description=\"Infinite lives - 1P game\" />\n      <gamegenie code=\"AEUUYTZA\" description=\"Start with 2 lives - 1P game\" />\n      <gamegenie code=\"AEUUYTZE\" description=\"Start with 9 lives - 1P game\" />\n      <gamegenie code=\"IASUYYZA\" description=\"Start with 6 lives - P1 in a 2P game\" />\n      <gamegenie code=\"AASUYYZE\" description=\"Start with 9 lives - P1 in a 2P game\" />\n      <gamegenie code=\"IANLZYZA\" description=\"Start with 6 lives - P2\" />\n      <gamegenie code=\"AANLZYZE\" description=\"Start with 9 lives - P2\" />\n      <gamegenie code=\"LASNVVZA\" description=\"Extra life every 5 bonus blocks\" />\n      <gamegenie code=\"XTVLUEZK\" description=\"Start with 2 little-helis after dying\" />\n      <gamegenie code=\"TEKNAXIA\" description=\"Autofire capability\" />\n      <gamegenie code=\"ZEKNAXIA\" description=\"Burstfire capability\" />\n      <gamegenie code=\"GXVNZLZP\" description=\"Turbo boost\" />\n      <gamegenie code=\"SUKLINVS\" description=\"Infinite lives - both players (1 of 2)\" />\n      <gamegenie code=\"SUVULNVS\" description=\"Infinite lives - both players (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-KBYPF\" name=\"Time Lord\" crc=\"13D5B1A4\">\n      <gamegenie code=\"SZVSLOSE\" description=\"Infinite health\" />\n      <gamegenie code=\"SZUKSKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEESPNAP\" description=\"Hit anywhere (1 of 2)\" />\n      <gamegenie code=\"EPEYSLEL\" description=\"Hit anywhere (2 of 2)\" />\n      <gamegenie code=\"PEEKYPLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEEKYPLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEEKYPLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AAXKXTPA\" description=\"Moonwalking (don't combine with super speed) (1 of 2)\" />\n      <gamegenie code=\"PAUGVTAA\" description=\"Moonwalking (don't combine with super speed) (2 of 2)\" />\n      <gamegenie code=\"PESKOTAA\" description=\"Super speed (don't combine with moonwalking) (1 of 2)\" />\n      <gamegenie code=\"PEOGSTAA\" description=\"Super speed (don't combine with moonwalking) (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-WQQZR\" name=\"Tiny Toon Adventures\" crc=\"99DDDB04\">\n      <gamegenie code=\"EYKEGPEI\" description=\"Invincibility\" />\n      <gamegenie code=\"SIKINXVS\" description=\"Infinite time\" />\n      <gamegenie code=\"SZOOSVVK\" description=\"Infinite health after collecting one heart\" />\n      <gamegenie code=\"SEOEYXKX\" description=\"Infinite health and one Carrot\" />\n      <gamegenie code=\"SZNOUNVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AASPPVPZ\" description=\"Multi-jump\" />\n      <gamegenie code=\"AEEPPYPA\" description=\"Pick-up more hearts\" />\n      <gamegenie code=\"PEVOIPZA\" description=\"Power decreases slower when using Dizzy Devil's spin attack\" />\n      <gamegenie code=\"YYXIXXLU\" description=\"Slow down timer\" />\n      <gamegenie code=\"YPXIXXLU\" description=\"Speed up timer\" />\n      <gamegenie code=\"AEXZNZZA\" description=\"1 life after continue\" />\n      <gamegenie code=\"IEXZNZZA\" description=\"6 lives after continue\" />\n      <gamegenie code=\"AEXZNZZE\" description=\"9 lives after continue\" />\n      <gamegenie code=\"AAXKUYZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAXKUYZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAXKUYZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"GENIVPPE\" description=\"Press start to finish the level (don't use on 6-3) (1 of 2)\" />\n      <gamegenie code=\"GKNSEOIK\" description=\"Press start to finish the level (don't use on 6-3) (1 of 2)\" />\n      <gamegenie code=\"AOOKSYAA\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"VASGOYSA\" description=\"Start on level X (1 of 3)\" />\n      <gamegenie code=\"XZXKNNOZ\" description=\"Start on level X (2 of 3)\" />\n      <gamegenie code=\"IAUGEYPA\" description=\"Start on level 2 (3 of 3)\" />\n      <gamegenie code=\"ZAUGEYPE\" description=\"Start on level 3 (3 of 3)\" />\n      <gamegenie code=\"YAUGEYPE\" description=\"Start on level 4 (3 of 3)\" />\n      <gamegenie code=\"GPUGEYPA\" description=\"Start on level 5 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-TLGBU\" name=\"Tiny Toon Adventures 2: Trouble in Wackyland\" crc=\"81A5EB65\">\n      <gamegenie code=\"SAOAZASZ\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"EIOAGAEY\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SZUYAZAX\" description=\"Infinite time\" />\n      <gamegenie code=\"SXUXVXVK\" description=\"Protection against hits on log ride\" />\n      <gamegenie code=\"SZSEASVK\" description=\"Protection against hits on train\" />\n      <gamegenie code=\"SZOOUXVK\" description=\"Protection against hits on bumper cars\" />\n      <gamegenie code=\"SXKAYUVK\" description=\"Protection against hits on roller coaster\" />\n      <gamegenie code=\"SZSALOVK\" description=\"Protection against hits in fun house\" />\n      <gamegenie code=\"AANPYPLA\" description=\"Log ride costs nothing instead of 3 tickets\" />\n      <gamegenie code=\"IANPYPLA\" description=\"Log ride costs 5 tickets\" />\n      <gamegenie code=\"AANPIPZA\" description=\"Train costs nothing instead of 2 tickets\" />\n      <gamegenie code=\"IANPIPZA\" description=\"Train costs 5 tickets\" />\n      <gamegenie code=\"AANPPPGA\" description=\"Roller coaster costs nothing instead of 4 tickets\" />\n      <gamegenie code=\"TANPPPGA\" description=\"Roller coaster costs 6 tickets\" />\n      <gamegenie code=\"AANPLPPA\" description=\"Bumper cars cost nothing instead of 1 ticket\" />\n      <gamegenie code=\"GANPLPPA\" description=\"Bumper cars cost 4 tickets\" />\n      <gamegenie code=\"AANOZPIA\" description=\"Fun house costs nothing instead of 50 normal tickets\" />\n      <gamegenie code=\"PANOZPIA\" description=\"Fun house costs 10 normal tickets\" />\n      <gamegenie code=\"PANOZPIE\" description=\"Fun house costs 90 normal tickets\" />\n      <gamegenie code=\"PAKYINAE\" description=\"Start a new game to view ending\" />\n      <gamegenie code=\"ZAEYPYPA\" description=\"Start with 20 tickets instead of 10\" />\n      <gamegenie code=\"IAEYPYPA\" description=\"Start with 50 tickets instead of 10\" />\n      <gamegenie code=\"PAEYPYPE\" description=\"Start with 90 tickets instead of 10\" />\n      <gamegenie code=\"VVVNAVSE\" description=\"Start with 110 tickets instead of 10\" />\n    </game>\n    <game code=\"CLV-H-FTGTY\" name=\"To The Earth\" crc=\"DE8FD935\">\n      <gamegenie code=\"AAEUXTGA\" description=\"Shots use up no energy\" />\n      <gamegenie code=\"ZAEUXTGA\" description=\"Shots use up less energy\" />\n      <gamegenie code=\"AAEUXTGE\" description=\"Shots use up more energy\" />\n      <gamegenie code=\"AEUVEYGP\" description=\"Enemy bombs do no damage\" />\n      <gamegenie code=\"AEUVEYGO\" description=\"Enemy bombs do half damage\" />\n      <gamegenie code=\"AXUVEYGO\" description=\"Enemy bombs do more damage\" />\n      <gamegenie code=\"GOEUEVZA\" description=\"Bonus energy for shooting enemy\" />\n      <gamegenie code=\"GEEUEVZA\" description=\"Less energy for shooting enemy\" />\n      <gamegenie code=\"AEEUEVZA\" description=\"No energy for shooting enemy\" />\n    </game>\n    <game code=\"CLV-H-FWSAP\" name=\"Toki\" crc=\"7FB74A43\">\n      <gamegenie code=\"EESEYEVG\" description=\"Infinite health\" />\n      <gamegenie code=\"SZNOGUVV\" description=\"Infinite weapons (1 of 3)\" />\n      <gamegenie code=\"SXEOLUVV\" description=\"Infinite weapons (2 of 3)\" />\n      <gamegenie code=\"SXOOZUSE\" description=\"Infinite weapons (3 of 3)\" />\n      <gamegenie code=\"AAKEVYPA\" description=\"Infinite time\" />\n      <gamegenie code=\"SXNYZSVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"XVEAPTAV\" description=\"Hit anywhere - normal enemies (1 of 2)\" />\n      <gamegenie code=\"SXSETVSO\" description=\"Hit anywhere - normal enemies (2 of 2)\" />\n      <gamegenie code=\"AEKYXYZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"PEKYXYZA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"GEKYXYZA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"AEKYXYZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"PAENPIZA\" description=\"Start with one heart - first life only\" />\n      <gamegenie code=\"AENYTIZA\" description=\"Start with one heart - after first life\" />\n      <gamegenie code=\"PEOPTLAA\" description=\"When weapon runs out of ammo it's replaced with the double weapon\" />\n      <gamegenie code=\"ZEOPTLAA\" description=\"When weapon runs out of ammo it's replaced with the wave weapon\" />\n      <gamegenie code=\"LEOPTLAA\" description=\"When weapon runs out of ammo it's replaced with the 3-way weapon\" />\n      <gamegenie code=\"GEOPTLAA\" description=\"When weapon runs out of ammo it's replaced with the flame weapon\" />\n      <gamegenie code=\"IEOPTLAA\" description=\"When weapon runs out of ammo it's replaced with the fireball weapon\" />\n      <gamegenie code=\"PAEIKALA\" description=\"Start with less time (1 of 2)\" />\n      <gamegenie code=\"PAKAGALA\" description=\"Start with less time (2 of 2)\" />\n      <gamegenie code=\"IAEIKALA\" description=\"Start with more time (1 of 2)\" />\n      <gamegenie code=\"IAKAGALA\" description=\"Start with more time (2 of 2)\" />\n      <gamegenie code=\"PAEIKALE\" description=\"Start with even more time (1 of 2)\" />\n      <gamegenie code=\"PAKAGALE\" description=\"Start with even more time (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-PZQSV\" name=\"Tom &amp; Jerry\" crc=\"D63B30F5\">\n      <gamegenie code=\"PASNVZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TASNVZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PASNVZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SXSNYEVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEXYPAPA\" description=\"Infinite health\" />\n      <gamegenie code=\"LEXYPAPA\" description=\"Minimum health (one touch kills)\" />\n      <gamegenie code=\"AEVYKPAE\" description=\"Start on world 2\" />\n      <gamegenie code=\"AOVYKPAA\" description=\"Start on world 3\" />\n      <gamegenie code=\"AOVYKPAE\" description=\"Start on world 4\" />\n      <gamegenie code=\"AXVYKPAA\" description=\"Start on world 5\" />\n    </game>\n    <game code=\"CLV-H-XTJZE\" name=\"Toobin'\" crc=\"5800BE2D\">\n      <gamegenie code=\"SXUTGIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAOTZTLA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"TAOTZTLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAOTZTLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZEZZIVG\" description=\"Infinite cans\" />\n      <gamegenie code=\"ZPOTTTTA\" description=\"Start with 18 cans\" />\n      <gamegenie code=\"GAOTTTTE\" description=\"Start with 12 cans\" />\n      <gamegenie code=\"PAOTTTTA\" description=\"Start with 1 can\" />\n      <gamegenie code=\"PAOZEAAA\" description=\"Start on level 2\" />\n      <gamegenie code=\"LAOZEAAA\" description=\"Start on level 4\" />\n      <gamegenie code=\"IAOZEAAA\" description=\"Start on level 6\" />\n      <gamegenie code=\"YAOZEAAA\" description=\"Start on level 8\" />\n      <gamegenie code=\"ALKXTAAZ\" description=\"Turbo left and right movement (1 of 2)\" />\n      <gamegenie code=\"ALVXLAAZ\" description=\"Turbo left and right movement (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GBHSQ\" name=\"Top Gun\" crc=\"CF6D0D7A\">\n      <gamegenie code=\"AEKSNLLA\" description=\"Immune to Bullets (not Missiles)\" />\n      <gamegenie code=\"GXKIKIVG\" description=\"Infinite Missiles\" />\n      <gamegenie code=\"ASEKTOAZ\" description=\"Take off with double Hound Missiles\" />\n      <gamegenie code=\"AXEKYPGO\" description=\"Take off with double Wolf Missiles\" />\n      <gamegenie code=\"GOOGAOZA\" description=\"Take off with double Tiger Missiles\" />\n      <gamegenie code=\"GXUSNGVG\" description=\"Infinite fuel\" />\n      <gamegenie code=\"IANKLOZA\" description=\"Start with half fuel\" />\n      <gamegenie code=\"ZAEGLPPA\" description=\"Start on Mission 2\" />\n      <gamegenie code=\"LAEGLPPA\" description=\"Start on Mission 3\" />\n      <gamegenie code=\"GAEGLPPA\" description=\"Start on Mission 4\" />\n    </game>\n    <game code=\"CLV-H-GRCNQ\" name=\"Top Gun: The Second Mission\" crc=\"6F8AF3E8\">\n      <gamegenie code=\"ASEAVLEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SZVYLIVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAKEUYPA\" description=\"Infinite missiles - 1P game\" />\n      <gamegenie code=\"AENAZIPA\" description=\"Infinite missiles - 2P game\" />\n      <gamegenie code=\"KUVZTIKO\" description=\"60 Phoenix missiles - 1P game\" />\n      <gamegenie code=\"KOVXTISA\" description=\"20 Phoenix missiles - 2P game\" />\n      <gamegenie code=\"PASYALLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TASYALLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PASYALLE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-ZDXEM\" name=\"Total Recall\" crc=\"248566A7\">\n      <gamegenie code=\"AVNVOAKZ\" description=\"Infinite health\" />\n      <gamegenie code=\"GXUIIXSO\" description=\"Most enemies easier to kill\" />\n      <gamegenie code=\"PENVKEGE\" description=\"Take less damage\" />\n      <gamegenie code=\"XYUVNUXT\" description=\"Gain maximum health from canisters\" />\n      <gamegenie code=\"OZNKEPSX\" description=\"Start with X health (1 of 2)\" />\n      <gamegenie code=\"ALNKOOLZ\" description=\"Start with less health (2 of 2)\" />\n      <gamegenie code=\"NYNKOOLX\" description=\"Start with more health (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-TEZFC\" name=\"Totally Rad\" crc=\"B629D555\">\n      <gamegenie code=\"SVVNTKON\" description=\"Infinite health\" />\n      <gamegenie code=\"GXXAPKSN\" description=\"Infinite magic\" />\n      <gamegenie code=\"SZVAYIVG\" description=\"Immune to fire and water\" />\n      <gamegenie code=\"SZSEYXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"AEUXSTZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEUXSTZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEUXSTZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AOOAYGAO\" description=\"Super-jump\" />\n      <gamegenie code=\"YOOAYGAO\" description=\"Mega-jump\" />\n      <gamegenie code=\"TEEONALA\" description=\"Half a life or half magic give full health or magic\" />\n    </game>\n    <game code=\"CLV-H-BTXGJ\" name=\"Track &amp; Field\" crc=\"9C9F3571\">\n      <gamegenie code=\"NTXKTNKT\" description=\"Almost always qualify in Skeet Shooting and Archery\" />\n      <gamegenie code=\"UKUKIGKG\" description=\"You don't have to score any points to qualify for Skeet Shooting, Triple Jump and Archery\" />\n    </game>\n    <game code=\"CLV-H-IIKYX\" name=\"Treasure Master\" crc=\"B918580C\">\n      <gamegenie code=\"KVNPUXEL\" description=\"Invincibility (1 of 2)\" />\n      <gamegenie code=\"LENPKZIA\" description=\"Invincibility (2 of 2)\" />\n      <gamegenie code=\"SXEETAVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SGKTSGVG\" description=\"Infinite health\" />\n      <gamegenie code=\"SKVXYOVK\" description=\"Infinite oxygen\" />\n    </game>\n    <game code=\"CLV-H-TXAVS\" name=\"Trog!\" crc=\"EE6892EB\">\n      <gamegenie code=\"XTXATOVS\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-WUHGF\" name=\"Trojan\" crc=\"FC3E5C86\">\n      <gamegenie code=\"NNUZGKYU\" description=\"Infinite health - both players (alt) (1 of 2)\" />\n      <gamegenie code=\"NYVNEKYU\" description=\"Infinite health - both players (alt) (2 of 2)\" />\n      <gamegenie code=\"SZVSZXVK\" description=\"Infinite health - both players\" />\n      <gamegenie code=\"GXEPGKVS\" description=\"Infinite time\" />\n      <gamegenie code=\"VTESLOSX\" description=\"One hit kills\" />\n      <gamegenie code=\"AAKENATI\" description=\"Hit anywhere (01 of 10)\" />\n      <gamegenie code=\"AANNIKLP\" description=\"Hit anywhere (02 of 10)\" />\n      <gamegenie code=\"AAOZLYIZ\" description=\"Hit anywhere (03 of 10)\" />\n      <gamegenie code=\"AAVAXALG\" description=\"Hit anywhere (04 of 10)\" />\n      <gamegenie code=\"AEENPKYA\" description=\"Hit anywhere (05 of 10)\" />\n      <gamegenie code=\"AENIEUAP\" description=\"Hit anywhere (06 of 10)\" />\n      <gamegenie code=\"AEUNIUUI\" description=\"Hit anywhere (07 of 10)\" />\n      <gamegenie code=\"AEUYPLNT\" description=\"Hit anywhere (08 of 10)\" />\n      <gamegenie code=\"AEVIULIZ\" description=\"Hit anywhere (09 of 10)\" />\n      <gamegenie code=\"GZOXYYEL\" description=\"Hit anywhere (10 of 10)\" />\n      <gamegenie code=\"AENIAUYP\" description=\"Always have High-jump Boots\" />\n      <gamegenie code=\"SXKVKXVK\" description=\"Keep High-jump Boots on pick-up\" />\n      <gamegenie code=\"AAUSAUGP\" description=\"Multi-jump - both players (1 of 3)\" />\n      <gamegenie code=\"AESIZUEI\" description=\"Multi-jump - both players (2 of 3)\" />\n      <gamegenie code=\"GXKIILEY\" description=\"Multi-jump - both players (3 of 3)\" />\n      <gamegenie code=\"YASGUUAE\" description=\"Start with a health boost\" />\n      <gamegenie code=\"TPSGUUAE\" description=\"Start with a super health boost\" />\n      <gamegenie code=\"GASGUUAA\" description=\"Start with half usual health\" />\n      <gamegenie code=\"PENKXPLA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"PAOKNZLA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"TENKXPLA\" description=\"Start with 6 lives - P1\" />\n      <gamegenie code=\"TAOKNZLA\" description=\"Start with 6 lives - P2\" />\n      <gamegenie code=\"PENKXPLE\" description=\"Start with 9 lives - P1\" />\n      <gamegenie code=\"PAOKNZLE\" description=\"Start with 9 lives - P2\" />\n      <gamegenie code=\"ENNKXPLA\" description=\"Start with 187 lives - P1\" />\n      <gamegenie code=\"EYOKNZLA\" description=\"Start with 196 lives - P2\" />\n      <gamegenie code=\"PASKELZA\" description=\"Start with 100 seconds\" />\n      <gamegenie code=\"PASKELZE\" description=\"Start with 900 seconds\" />\n    </game>\n    <game code=\"CLV-H-WKTLX\" name=\"Trolls on Treasure Island\" crc=\"C47EFC0E\">\n      <gamegenie code=\"SIOGUTVE\" description=\"Infinite time\" />\n      <gamegenie code=\"EYNINYEI\" description=\"Only one jewel needed to clear stage\" />\n    </game>\n    <game code=\"CLV-H-BZQSF\" name=\"Twin Cobra\" crc=\"0EF730E7\">\n      <gamegenie code=\"SZVSGXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZNYXOVK\" description=\"Infinite Bombs\" />\n      <gamegenie code=\"AEUGZIZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IEUGZIZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AEUGZIZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"AANKLTZA\" description=\"Start with 1 life after a continue\" />\n      <gamegenie code=\"IANKLTZA\" description=\"Start with 6 lives after a continue\" />\n      <gamegenie code=\"AANKLTZE\" description=\"Start with 9 lives after a continue\" />\n      <gamegenie code=\"AAKKYTPA\" description=\"Infinite continues\" />\n      <gamegenie code=\"PEOKIIIE\" description=\"Start with 9 continues\" />\n      <gamegenie code=\"ZAEGKILE\" description=\"Start with 9 Bombs\" />\n      <gamegenie code=\"GPEGKILA\" description=\"Start with 20 Bombs\" />\n      <gamegenie code=\"ZANIAZLE\" description=\"9 Bombs after dying\" />\n      <gamegenie code=\"GPNIAZLA\" description=\"20 Bombs after dying\" />\n      <gamegenie code=\"AAOYVOLP\" description=\"Autofire\" />\n      <gamegenie code=\"GZNITZSA\" description=\"Keep weapon type after death\" />\n      <gamegenie code=\"GZNSAZSA\" description=\"Keep super chargers after death\" />\n    </game>\n    <game code=\"CLV-H-ZWIAY\" name=\"Ultima: Exodus\" crc=\"A4062017\">\n      <gamegenie code=\"GZUKOGST\" description=\"Take no damage from most monsters\" />\n      <gamegenie code=\"EIXUUPEP\" description=\"One hit kills\" />\n      <gamegenie code=\"AKNSPAEE\" description=\"Never miss with the Fight command\" />\n      <gamegenie code=\"AESSGETP\" description=\"Can always attack with the Fight command\" />\n      <gamegenie code=\"AEOAKVAA\" description=\"No limit on stat points\" />\n      <gamegenie code=\"IEOPTPPA\" description=\"Start with 5 of each item\" />\n      <gamegenie code=\"ZEOPTPPE\" description=\"Start with 10 of each item\" />\n      <gamegenie code=\"ENOPTPPA\" description=\"Start with 40 of each item\" />\n      <gamegenie code=\"PUEPTPAL\" description=\"Start with X gold (1 of 2)\" />\n      <gamegenie code=\"XEEOAPGV\" description=\"Start with 35,328 gold (2 of 2)\" />\n      <gamegenie code=\"ZEEOAPGT\" description=\"Start with 512 gold (2 of 2)\" />\n      <gamegenie code=\"EKEOAPGV\" description=\"Start with 200 gold\" />\n      <gamegenie code=\"AAXIAPPA\" description=\"Never lose tools\" />\n      <gamegenie code=\"KPVSUZOP\" description=\"Never lose magic\" />\n      <gamegenie code=\"AAUEPYPA\" description=\"Rapid magic recovery (1 of 2)\" />\n      <gamegenie code=\"OLUAGYOI\" description=\"Rapid magic recovery (2 of 2)\" />\n      <gamegenie code=\"YKEAUVTZ\" description=\"Start with 75 stat points (1 of 3)\" />\n      <gamegenie code=\"LKUAVYZU\" description=\"Start with 75 stat points (2 of 3)\" />\n      <gamegenie code=\"LGSOPAZU\" description=\"Start with 75 stat points (3 of 3)\" />\n      <gamegenie code=\"LSEAUVTX\" description=\"Start with 95 stat points (1 of 3)\" />\n      <gamegenie code=\"YSUAVYZU\" description=\"Start with 95 stat points (2 of 3)\" />\n      <gamegenie code=\"YISOPAZU\" description=\"Start with 95 stat points (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-FUPCX\" name=\"Ultima: Quest of the Avatar\" crc=\"A25A750F\">\n      <gamegenie code=\"SZSTXPSA\" description=\"No random battles\" />\n      <gamegenie code=\"LTVPZIZL\" description=\"Start with perfect virtues (worthy of Avatarhood)\" />\n      <gamegenie code=\"SUOVNKVS\" description=\"Infinite Herbs\" />\n      <gamegenie code=\"SZNLKKVK\" description=\"Infinite Oil\" />\n      <gamegenie code=\"SUEUIXVS\" description=\"Infinite Torches\" />\n      <gamegenie code=\"SXVUGSVK\" description=\"Infinite Gems\" />\n      <gamegenie code=\"AZKPTIPA\" description=\"Start with 8336 Gold Pieces\" />\n      <gamegenie code=\"APKPTIPA\" description=\"Start with 4240 Gold Pieces\" />\n      <gamegenie code=\"AAKPTIPA\" description=\"Start with 144 Gold Pieces (for experts)\" />\n      <gamegenie code=\"OLUZZEOO\" description=\"Infinite MP\" />\n      <gamegenie code=\"ZEVPTIAA\" description=\"Mage starts with 712 HP\" />\n      <gamegenie code=\"PAOPTTAA\" description=\"Mage starts with 381 EXP\" />\n      <gamegenie code=\"AXNOIIAP\" description=\"Mage starts with Strength of 32\" />\n      <gamegenie code=\"GTXPIVAA\" description=\"Start with 100 Ash instead of 8\" />\n      <gamegenie code=\"GTXPTVAA\" description=\"Start with 100 Ginseng instead of 8\" />\n      <gamegenie code=\"GTXPYVPA\" description=\"Start with 100 Garlic instead of 9\" />\n      <gamegenie code=\"GTXOATYA\" description=\"Start with 100 Silkweb instead of 7\" />\n      <gamegenie code=\"GTXOPVAA\" description=\"Start with 100 Moss instead of 8\" />\n      <gamegenie code=\"GTXOZTGA\" description=\"Start with 100 Pearl instead of 4\" />\n      <gamegenie code=\"GTXOLTAA\" description=\"Start with 100 Fungus instead of none\" />\n      <gamegenie code=\"GTXOGTAA\" description=\"Start with 100 Manroot instead of none\" />\n      <gamegenie code=\"AEKITITG\" description=\"Heal costs nothing instead of 70\" />\n      <gamegenie code=\"AAVILSZA\" description=\"Cure poison costs nothing\" />\n      <gamegenie code=\"PAEENYOT\" description=\"Axe costs 1 instead of 225\" />\n      <gamegenie code=\"PAEEUYGP\" description=\"Staff costs 1 instead of 20\" />\n      <gamegenie code=\"AAOAXYPA\" description=\"Sword costs 144 instead of 400\" />\n      <gamegenie code=\"AAEAKYZA\" description=\"Bow costs 168 instead of 680\" />\n      <gamegenie code=\"PAXAONEG\" description=\"Leather costs 1 instead of 200\" />\n      <gamegenie code=\"AAXAKYZA\" description=\"Chain costs 88 instead of 600\" />\n      <gamegenie code=\"AAXEXNPA\" description=\"Plate costs 196 instead of 2500\" />\n      <gamegenie code=\"AUNOYSLP\" description=\"Fighter starts with Strength of 48\" />\n      <gamegenie code=\"NYOOPVSK\" description=\"Fighter starts with 255 EXP\" />\n      <gamegenie code=\"LEVOZIPA\" description=\"Fighter starts with 812 HP\" />\n      <gamegenie code=\"LKNPYIAE\" description=\"Fighter starts with 75 MP\" />\n    </game>\n    <game code=\"CLV-H-MXNPK\" name=\"Ultima: Warriors of Destiny\" crc=\"4823EEFE\">\n      <gamegenie code=\"SUSTXSVS\" description=\"Infinite consumable items such as food and torches - May not be able to discard some items\" />\n      <gamegenie code=\"AAEZIPZL\" description=\"A night at the Wayfarer Inn is free\" />\n      <gamegenie code=\"AEUZPAPA\" description=\"At Healer's Herbs - Sulfurous ash is free instead of 1 GP\" />\n      <gamegenie code=\"AEUZGAZA\" description=\"At Healer's Herbs - Ginseng is free instead of 2 GP\" />\n      <gamegenie code=\"AEUZYAZA\" description=\"At Healer's Herbs - Garlic is free instead of 2 GP\" />\n      <gamegenie code=\"AEUXIAGT\" description=\"At Healer's Herbs - An Tym Scroll is free instead of 100 GP\" />\n      <gamegenie code=\"AEKZAAVP\" description=\"At Healer's Herbs - Spellbook is free instead of 150 GP\" />\n      <gamegenie code=\"AEUXZAGA\" description=\"At Healer's Herbs - Spidersilk is free instead of 4 GP\" />\n      <gamegenie code=\"AEEXZAGA\" description=\"From Pendra - Spidersilk is free instead of 4 GP\" />\n      <gamegenie code=\"AEEZYALA\" description=\"From Pendra - Black Pearl is free instead of 3 GP\" />\n      <gamegenie code=\"AEEZGAZA\" description=\"From Pendra - Garlic is free instead of 2 GP\" />\n      <gamegenie code=\"AEEZPAZA\" description=\"From Pendra - Ginseng is free instead of 2 GP\" />\n      <gamegenie code=\"AEEXIELG\" description=\"From Pendra - Sant Talisman is free instead of 75 GP\" />\n      <gamegenie code=\"AAEXIELG\" description=\"At Iolo's Bows - Bow is free instead of 75 GP\" />\n      <gamegenie code=\"AAEXZEPP\" description=\"At Iolo's Bows - Wooden shield is free instead of 25 GP\" />\n      <gamegenie code=\"AAEZGALA\" description=\"At Iolo's Bows - Dagger is free instead of 3 GP\" />\n      <gamegenie code=\"AAEZYEAZ\" description=\"At Iolo's Bows - Short sword is free instead of 40 GP\" />\n      <gamegenie code=\"AAOZAAVP\" description=\"At Iolo's Bows - Crossbow is free instead of 150 GP\" />\n      <gamegenie code=\"AAOZTAPA\" description=\"At Iolo's Bows - Arrow is free instead of 1 GP\" />\n      <gamegenie code=\"AAOXPAZA\" description=\"At Iolo's Bows - Bolt is free instead of 2 GP\" />\n      <gamegenie code=\"PAOZAPAE\" description=\"At Iolo's Bows - Sell Dagger for 2,305 instead of 1 GP\" />\n      <gamegenie code=\"LAOZLPAG\" description=\"At Iolo's Bows - Sell Short sword for 2,848 instead of 20 GP\" />\n      <gamegenie code=\"YAOZTPAE\" description=\"At Iolo's Bows - Sell Wooden shield for 3,850 instead of 10 GP\" />\n      <gamegenie code=\"AAOZLAAZ\" description=\"At Iolo's Bows - Magic bow is free instead of 800 GP (1 of 2)\" />\n      <gamegenie code=\"AAOZGALA\" description=\"At Iolo's Bows - Magic bow is free instead of 800 GP (2 of 2)\" />\n      <gamegenie code=\"AESXEZGA\" description=\"Start new game with 201 instead of 1,225 GP\" />\n      <gamegenie code=\"AOSXEZGA\" description=\"Start new game with 4,297 instead of 1,225 GP\" />\n      <gamegenie code=\"YNSXEZGE\" description=\"Start new game with 32,713 instead of 1,225 GP\" />\n    </game>\n    <game code=\"CLV-H-PTDPA\" name=\"Ultimate Air Combat\" crc=\"E387C77F\">\n      <gamegenie code=\"SZOXIEVK\" description=\"Infinite Chaff\" />\n      <gamegenie code=\"SXVZZSVK\" description=\"Infinite Missiles (1 of 2)\" />\n      <gamegenie code=\"SZEXGVVK\" description=\"Infinite Missiles (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-LKFQK\" name=\"Ultimate Stuntman, The\" crc=\"892434DD\">\n      <gamegenie code=\"GXUAOKVK\" description=\"Don't lose a life on Ground Pursuit, Boat and Hang Glider stages\" />\n      <gamegenie code=\"AENVNGZA\" description=\"Start with 1 life (first credit only)\" />\n      <gamegenie code=\"IENVNGZA\" description=\"Start with 6 lives (first credit only)\" />\n      <gamegenie code=\"AENVNGZE\" description=\"Start with 9 lives (first credit only)\" />\n      <gamegenie code=\"SXNSYXVK\" description=\"Infinite time\" />\n      <gamegenie code=\"SXXSNUVK\" description=\"Infinite 'Crez' weapon until end of stage\" />\n      <gamegenie code=\"PEXXSATE\" description=\"9 seconds on clock pick-up\" />\n      <gamegenie code=\"AEOZXPZA\" description=\"Full energy on pick-up\" />\n      <gamegenie code=\"NYXXVVAN\" description=\"Shield lasts longer on Human Fly stages\" />\n      <gamegenie code=\"AGXXVVAY\" description=\"Shield lasts a shorter time on Human Fly stages\" />\n      <gamegenie code=\"SXNXKNVK\" description=\"Don't lose a life against end-of-stage bosses and on street combat stages\" />\n      <gamegenie code=\"SXXUXSVK\" description=\"Don't lose a life on Human Fly stages\" />\n      <gamegenie code=\"OVUZKPSV\" description=\"Minimum damage taken (1 of 2)\" />\n      <gamegenie code=\"PEUZSONY\" description=\"Minimum damage taken (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-CGFFW\" name=\"Uncanny X-Men, The\" crc=\"2D41EF92\">\n      <gamegenie code=\"SXEEXIST\" description=\"Infinite life\" />\n      <gamegenie code=\"GVUZPOEG\" description=\"Half life - Wolverine\" />\n      <gamegenie code=\"GVUZYOEG\" description=\"Half life - Cyclops\" />\n      <gamegenie code=\"PKUXIPXA\" description=\"Half life - Nightcrawler\" />\n      <gamegenie code=\"YSKZLOVU\" description=\"Half life - Iceman\" />\n      <gamegenie code=\"YNKXPONN\" description=\"Half life - Colossus\" />\n      <gamegenie code=\"ASKXYPEZ\" description=\"Half life - Storm\" />\n    </game>\n    <game code=\"CLV-H-OTSOM\" name=\"Untouchables, The\" crc=\"588A31FE\">\n      <gamegenie code=\"SLOEAGVI\" description=\"Infinite energy on scenes 1 and 4\" />\n      <gamegenie code=\"SXKAATVG\" description=\"Infinite energy on scene 2\" />\n      <gamegenie code=\"SXUAZGVG\" description=\"Infinite time on scenes 1 and 4\" />\n      <gamegenie code=\"GEXELPZA\" description=\"More time on scene 1\" />\n      <gamegenie code=\"PEXELPZA\" description=\"Less time on scene 1\" />\n      <gamegenie code=\"TAXELAGA\" description=\"More time on scene 2\" />\n      <gamegenie code=\"ZAXELAGA\" description=\"Less time on scene 2\" />\n      <gamegenie code=\"TAXEYAGA\" description=\"More time on scene 3\" />\n      <gamegenie code=\"ZAXEYAGA\" description=\"Less time on scene 3\" />\n      <gamegenie code=\"TAXAPAIA\" description=\"More time on scene 5\" />\n      <gamegenie code=\"LAXAPAIA\" description=\"Less time on scene 5\" />\n      <gamegenie code=\"ZAOEAAPA\" description=\"More time on scene 7\" />\n      <gamegenie code=\"AZNETGAP\" description=\"More ammo picked up on scene 2\" />\n      <gamegenie code=\"IANETGAP\" description=\"Less ammo picked up on scene 2\" />\n      <gamegenie code=\"PAOEGATE\" description=\"More ammo picked up on scene 7\" />\n      <gamegenie code=\"AAXKTEGA\" description=\"Start on scene 2\" />\n      <gamegenie code=\"ZAXKTEGA\" description=\"Start on scene 3\" />\n      <gamegenie code=\"GAXKTEGA\" description=\"Start on scene 4\" />\n      <gamegenie code=\"TAXKTEGA\" description=\"Start on scene 5\" />\n      <gamegenie code=\"ZAXKTEGE\" description=\"Start on scene 7\" />\n    </game>\n    <game code=\"CLV-H-FNMIK\" name=\"Urban Champion\" crc=\"656D4265\">\n      <gamegenie code=\"AEEIZGGE\" description=\"Powerful quick punches\" />\n      <gamegenie code=\"TOEIZGGA\" description=\"Super powerful quick punch\" />\n      <gamegenie code=\"GZOTZLVG\" description=\"Infinite time\" />\n      <gamegenie code=\"LENVTZTA\" description=\"Speed up the timer\" />\n      <gamegenie code=\"AAXSLLPA\" description=\"Become a stronger fighter\" />\n      <gamegenie code=\"LAXSLLPA\" description=\"Become a weaker fighter\" />\n    </game>\n    <game code=\"CLV-H-GNKGD\" name=\"Vice: Project Doom\" crc=\"753768A6\">\n      <gamegenie code=\"XVVKISZK\" description=\"Multi-jump\" />\n      <gamegenie code=\"AANSEIYP\" description=\"Invincibility\" />\n      <gamegenie code=\"AEEYXEET\" description=\"Hit anywhere\" />\n      <gamegenie code=\"SZSKIOVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZNNNSVK\" description=\"Infinite time\" />\n      <gamegenie code=\"SZVYXKVK\" description=\"Infinite grenades\" />\n      <gamegenie code=\"SZKNXKVK\" description=\"Infinite bullets\" />\n      <gamegenie code=\"SXVYVKSE\" description=\"Infinite power\" />\n      <gamegenie code=\"ZEOYNGGV\" description=\"10 coins for an extra life\" />\n      <gamegenie code=\"POOYNGGV\" description=\"25 coins for an extra life\" />\n      <gamegenie code=\"GOENELIA\" description=\"20 extra Grenades on pick-up\" />\n      <gamegenie code=\"POXYXUZE\" description=\"25 extra Bullets on pick-up\" />\n      <gamegenie code=\"LTNNXLIA\" description=\"Start with 99 grenades\" />\n      <gamegenie code=\"VPOEPKXY\" description=\"Start timer for round 1 at 150\" />\n      <gamegenie code=\"VPUAZKXY\" description=\"Start timer for round 2 at 150\" />\n    </game>\n    <game code=\"CLV-H-ZLUFZ\" name=\"Vindicators\" crc=\"A8F5C2AB\">\n      <gamegenie code=\"KLUAGTVI\" description=\"Infinite lives\" />\n      <gamegenie code=\"AAKKYTZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"IAKKYTZA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"AAKKYTZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"VYUKEIVI\" description=\"Automatic fuel replenishment\" />\n      <gamegenie code=\"GZOEVXON\" description=\"Never lose Stars\" />\n      <gamegenie code=\"VVVAAPSA\" description=\"Start with 10 Stars\" />\n      <gamegenie code=\"ZAUKYTZP\" description=\"Quicker shot re-load\" />\n      <gamegenie code=\"AZKGYVAA\" description=\"Start with increased shot range\" />\n      <gamegenie code=\"LPKKLVGE\" description=\"Turbo speed\" />\n      <gamegenie code=\"AAUKYTZO\" description=\"Start with XX shots (1 of 2)\" />\n      <gamegenie code=\"VIKGPTEI\" description=\"Start with 80 Shots (2 of 2)\" />\n      <gamegenie code=\"KIKGPTEI\" description=\"Start with 80 Bombs (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-DXBEH\" name=\"Volleyball\" crc=\"27777635\">\n      <gamegenie code=\"YEYIAV\" description=\"Computer doesn't get points for scoring\" />\n    </game>\n    <game code=\"CLV-H-VRWYL\" name=\"Wacky Races\" crc=\"401521F7\">\n      <gamegenie code=\"EINSUPEY\" description=\"Invincibility (1 of 3)\" />\n      <gamegenie code=\"ESUISPEY\" description=\"Invincibility (2 of 3)\" />\n      <gamegenie code=\"ESEKSIEY\" description=\"Invincibility (3 of 3)\" />\n      <gamegenie code=\"SKSGSVVK\" description=\"Infinite health (1 of 2)\" />\n      <gamegenie code=\"SKUKUSVK\" description=\"Infinite health (2 of 2)\" />\n      <gamegenie code=\"GXSGSVVK\" description=\"Infinite health (alt) (1 of 3)\" />\n      <gamegenie code=\"GZNKVVVK\" description=\"Infinite health (alt) (2 of 3)\" />\n      <gamegenie code=\"GXUKUSVK\" description=\"Infinite health (alt) (3 of 3)\" />\n      <gamegenie code=\"SASSZEVK\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"SEKIYEVK\" description=\"Infinite lives (2 of 2)\" />\n      <gamegenie code=\"APSIGESZ\" description=\"Infinite lives (alt) (1 of 2)\" />\n      <gamegenie code=\"AASIIEIS\" description=\"Infinite lives (alt) (2 of 2)\" />\n      <gamegenie code=\"SXOILNSE\" description=\"Infinite Bones after obtaining one\" />\n      <gamegenie code=\"AAKVEIZA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"GAKVEIZA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"TAKVEIZA\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"AAKVEIZE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"TASTOILA\" description=\"Start with 6 hearts\" />\n      <gamegenie code=\"AASTOILE\" description=\"Start with 8 hearts\" />\n      <gamegenie code=\"GXSGSVVK\" description=\"Don't take most damage\" />\n      <gamegenie code=\"EKUVKIKK\" description=\"Start at race 1, end of stage 1\" />\n      <gamegenie code=\"NKUVKIKK\" description=\"Start at race 1, end of stage 2\" />\n      <gamegenie code=\"KSUVKIKG\" description=\"Start at race 1, end of stage 3\" />\n      <gamegenie code=\"ESUVVIVS\" description=\"Start at race 2, end of stage 1\" />\n      <gamegenie code=\"KSUVVIVS\" description=\"Start at race 2, end of stage 2\" />\n      <gamegenie code=\"EVUVVIVI\" description=\"Start at race 2, end of stage 3\" />\n      <gamegenie code=\"KVKTEIXT\" description=\"Start at race 3, end of stage 1\" />\n      <gamegenie code=\"EVKTEIXV\" description=\"Start at race 3, end of stage 2\" />\n      <gamegenie code=\"KVKTEIXV\" description=\"Start at race 3, end of stage 3\" />\n      <gamegenie code=\"ENKTEIXT\" description=\"Start at race 3, end of stage 4\" />\n      <gamegenie code=\"XNUVKIKG\" description=\"Go straight to level boss\" />\n    </game>\n    <game code=\"CLV-H-AAIWG\" name=\"Wall Street Kid\" crc=\"B6661BDA\">\n      <gamegenie code=\"OUSNVLOP\" description=\"Infinite money\" />\n      <gamegenie code=\"NYEEPPAX\" description=\"Sart a new game with $16,777,215 (1 of 3)\" />\n      <gamegenie code=\"NYEEZPOX\" description=\"Sart a new game with $16,777,215 (2 of 3)\" />\n      <gamegenie code=\"NYEELPYE\" description=\"Sart a new game with $16,777,215 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-RSWNY\" name=\"Wally Bear and the No! Gang\" crc=\"81ECDA0D\">\n      <gamegenie code=\"AOUXYYEI\" description=\"Invincibility\" />\n      <gamegenie code=\"GZNXZISA\" description=\"Multi-jump\" />\n      <gamegenie code=\"AANLINGI\" description=\"Collect items from anywhere (1 of 2)\" />\n      <gamegenie code=\"AANULYTI\" description=\"Collect items from anywhere (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-BSFWJ\" name=\"Wario's Woods\" crc=\"F79A75D7\">\n      <gamegenie code=\"LTKPOLAA\" description=\"Clear round A data to complete round A and B (1 of 2)\" />\n      <gamegenie code=\"PGKPVLZG\" description=\"Clear round A data to complete round A and B (2 of 2)\" />\n      <gamegenie code=\"PAVOEXTP\" description=\"Each coin gives you a credit\" />\n      <gamegenie code=\"OZSUNAOU\" description=\"Always get blue monsters (1 of 2)\" />\n      <gamegenie code=\"EYVLEAUL\" description=\"Always get blue monsters (2 of 2)\" />\n      <gamegenie code=\"VTSLEESE\" description=\"Always get 1 line of monsters\" />\n      <gamegenie code=\"OXNATNSE\" description=\"Wario doesn't cause ceiling to fall, no enemies fall\" />\n      <gamegenie code=\"XTKXGXVK\" description=\"One bomb in Birdo time only\" />\n      <gamegenie code=\"XTNXLOVK\" description=\"Infinite time\" />\n      <gamegenie code=\"SXOIOASA\" description=\"Invisible Toad\" />\n      <gamegenie code=\"ENXPSPEI\" description=\"Invisible coins\" />\n      <gamegenie code=\"XVXPSESE\" description=\"Coins worth 5\" />\n      <gamegenie code=\"XVXOEEVK\" description=\"Infinite coins fall\" />\n      <gamegenie code=\"VXSOTNVK\" description=\"Only 1 coin falls\" />\n      <gamegenie code=\"EESOTNVG\" description=\"No Coins fall\" />\n      <gamegenie code=\"NYSZUSOO\" description=\"Diamonds don't form in lesson mode\" />\n    </game>\n    <game code=\"CLV-H-NESQU\" name=\"Wayne's World\" crc=\"B0CD000F\">\n      <gamegenie code=\"PANEYAGA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"YANEYAGA\" description=\"Start with 8 lives\" />\n      <gamegenie code=\"PANEYAGE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"VXKESXVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"EANEZAEL\" description=\"Start with less Worthiness\" />\n      <gamegenie code=\"AGNEZAEL\" description=\"Start with much less Worthiness\" />\n      <gamegenie code=\"SZSEXUSE\" description=\"Infinite Worthiness\" />\n      <gamegenie code=\"NNSLYYKU\" description=\"More time in level 1\" />\n      <gamegenie code=\"NNNLIYZU\" description=\"More time in Donut shop in level 1\" />\n      <gamegenie code=\"SXSALOVK\" description=\"Infinite time\" />\n      <gamegenie code=\"AANAKLZA\" description=\"Power-up restores all Worthiness\" />\n      <gamegenie code=\"SZNANUSE\" description=\"Power-up worth nothing\" />\n      <gamegenie code=\"SZOOSUVV\" description=\"Getting all donuts is worth no extra lives\" />\n      <gamegenie code=\"YOKEZOLU\" description=\"Faster timer\" />\n      <gamegenie code=\"AVKEZOLL\" description=\"Slower timer\" />\n      <gamegenie code=\"IAEZXAGP\" description=\"5 special moves on pick-up\" />\n      <gamegenie code=\"AZEZXAGO\" description=\"40 special moves on pick-up\" />\n    </game>\n    <game code=\"CLV-H-KMPZG\" name=\"WCW World Championship Wrestling\" crc=\"5EA7D410\">\n      <gamegenie code=\"EGOZINIP\" description=\"Always win - P1 (1 of 3)\" />\n      <gamegenie code=\"PAOZTNPA\" description=\"Always win - P1 (2 of 3)\" />\n      <gamegenie code=\"XTOZYYIE\" description=\"Always win - P1 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-MPGYN\" name=\"Werewolf: The Last Warrior\" crc=\"333C48A0\">\n      <gamegenie code=\"SZXTTLVG\" description=\"Infinite time\" />\n      <gamegenie code=\"PAENGTIA\" description=\"Only 1 anger point needed to become Super-Werewolf\" />\n      <gamegenie code=\"SZXNPVVK\" description=\"Blue W won't change you back to a man\" />\n      <gamegenie code=\"ESKNTIKI\" description=\"Gain maximum health from small hearts\" />\n      <gamegenie code=\"AAUNGVZA\" description=\"Don't lose health from blue W (1 of 2)\" />\n      <gamegenie code=\"AAUNPVAA\" description=\"Don't lose health from blue W (2 of 2)\" />\n      <gamegenie code=\"AAVGVYGT\" description=\"Hit anywhere (1 of 4)\" />\n      <gamegenie code=\"AAVKKNTI\" description=\"Hit anywhere (2 of 4)\" />\n      <gamegenie code=\"AEXGXNAZ\" description=\"Hit anywhere (3 of 4)\" />\n      <gamegenie code=\"AEXKEYZZ\" description=\"Hit anywhere (4 of 4)\" />\n    </game>\n    <game code=\"CLV-H-NTWKE\" name=\"Where's Waldo?\" crc=\"C3463A3D\">\n      <gamegenie code=\"AEETLZPA\" description=\"Infinite time\" />\n      <gamegenie code=\"VTSVYYTE\" description=\"Guesses cost nothing\" />\n    </game>\n    <game code=\"CLV-H-ZRUFN\" name=\"Who Framed Roger Rabbit\" crc=\"12B2C361\">\n      <gamegenie code=\"ATKTIPEI\" description=\"Invincibility (1 of 4)\" />\n      <gamegenie code=\"ATVIKLEI\" description=\"Invincibility (2 of 4)\" />\n      <gamegenie code=\"ATXGOPEI\" description=\"Invincibility (3 of 4)\" />\n      <gamegenie code=\"AVOVAIEI\" description=\"Invincibility (4 of 4)\" />\n      <gamegenie code=\"SXVOYIVG\" description=\"Never lose a life except in Punch lines\" />\n      <gamegenie code=\"SZSZXYVG\" description=\"Never lose a life in Punch lines\" />\n      <gamegenie code=\"SXKELNVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"PAUKXTGA\" description=\"Harder to build strength\" />\n      <gamegenie code=\"EPUKXTGA\" description=\"Strength to full instantly\" />\n      <gamegenie code=\"PESSSYLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TESSSYLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PESSSYLE\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-HHYHV\" name=\"Whomp 'Em\" crc=\"6FD5A271\">\n      <gamegenie code=\"ATSELPEY\" description=\"Invincibility\" />\n      <gamegenie code=\"SXEEZPVG\" description=\"Don't lose a life from health loss\" />\n      <gamegenie code=\"SXXOUPVG\" description=\"Creatures can't steal extra lives\" />\n      <gamegenie code=\"SZNATPSA\" description=\"Infinite health\" />\n      <gamegenie code=\"SZKEGPVG\" description=\"Keep Buffalo Headdress for present level\" />\n      <gamegenie code=\"ZAKELOAA\" description=\"Always have Buffalo Headdress\" />\n      <gamegenie code=\"AEKKGALA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"LAVKYAAA\" description=\"Start with 5 lives\" />\n      <gamegenie code=\"AAVKYAAE\" description=\"Start with 10 lives\" />\n    </game>\n    <game code=\"CLV-H-MTOLQ\" name=\"Widget\" crc=\"E7C981A2\">\n      <gamegenie code=\"ENNVEZEI\" description=\"Invincibility\" />\n      <gamegenie code=\"SXSLEKSE\" description=\"Infinite health (except against spikes)\" />\n      <gamegenie code=\"SXUVOEVK\" description=\"Infinite health (only against spikes)\" />\n      <gamegenie code=\"SXUAVXVK\" description=\"Infinite time (1 of 2)\" />\n      <gamegenie code=\"SXXANXVK\" description=\"Infinite time (2 of 2)\" />\n      <gamegenie code=\"SXXPPVSE\" description=\"Infinite MP\" />\n      <gamegenie code=\"SZUGSXVK\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-DJXNX\" name=\"Wild Gunman\" crc=\"5112DC21\">\n      <gamegenie code=\"GZOGVYVG\" description=\"Infinite lives in Gang Mode\" />\n      <gamegenie code=\"GZNIPAVG\" description=\"Infinite ammo in Gang Mode\" />\n      <gamegenie code=\"AXVIEOYA\" description=\"Start with double normal ammo\" />\n      <gamegenie code=\"AUVIEOYA\" description=\"Start with triple normal ammo\" />\n      <gamegenie code=\"AEVIEOYE\" description=\"Start with half normal ammo\" />\n      <gamegenie code=\"YEUISPLE\" description=\"Start with 1 life (1 of 2)\" />\n      <gamegenie code=\"PENGVALA\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"ZEUISPLE\" description=\"Start with 10 lives (1 of 2)\" />\n      <gamegenie code=\"ZENGVALE\" description=\"Start with 10 lives (2 of 2)\" />\n      <gamegenie code=\"YEUISPLE\" description=\"Start with 15 lives (1 of 2)\" />\n      <gamegenie code=\"YENGVALE\" description=\"Start with 15 lives (2 of 2)\" />\n      <gamegenie code=\"IENSUOZA\" description=\"Shoot 5 enemies to finish level (1 of 2)\" />\n      <gamegenie code=\"IEUSSUZA\" description=\"Shoot 5 enemies to finish level (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-HJHWZ\" name=\"Willow\" crc=\"103E7E7F\">\n      <gamegenie code=\"ZASEGOUI\" description=\"Infinite magic\" />\n      <gamegenie code=\"TGNILGSA\" description=\"Don't take any hits\" />\n      <gamegenie code=\"XZKYILKP\" description=\"Start with all items (1 of 2)\" />\n      <gamegenie code=\"AVUOXSOZ\" description=\"Start with all items (2 of 2)\" />\n      <gamegenie code=\"PNKINTSL\" description=\"Start at EXP Level X (1 of 2)\" />\n      <gamegenie code=\"GEKISVZA\" description=\"Start at EXP Level 5 (2 of 2)\" />\n      <gamegenie code=\"PEKISVZE\" description=\"Start at EXP Level 10 (2 of 2)\" />\n      <gamegenie code=\"TEKISVZE\" description=\"Start at EXP Level 15 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-GZNQZ\" name=\"Wizardry: Proving Grounds of the Mad Overlord\" crc=\"D9BB572C\">\n      <gamegenie code=\"AEVEIPAL\" description=\"Annointed Mace costs nothing instead of 30\" />\n      <gamegenie code=\"AAVEIPIZ\" description=\"Long Sword costs nothing instead of 25\" />\n      <gamegenie code=\"AEXEIPIP\" description=\"Short Sword costs nothing instead of 15\" />\n      <gamegenie code=\"AEVEIZAZ\" description=\"Small Shield costs nothing instead of 20\" />\n      <gamegenie code=\"AAVEIZAP\" description=\"Staff costs nothing instead of 10\" />\n      <gamegenie code=\"AEXEIZIA\" description=\"Dagger costs nothing instead of 15\" />\n      <gamegenie code=\"AAVEILIP\" description=\"Robes costs nothing instead of 15\" />\n      <gamegenie code=\"AEVEGYIA\" description=\"S of Pain costs nothing instead of 500\" />\n      <gamegenie code=\"AAXEKAIA\" description=\"S of Fire costs nothing instead of 500\" />\n      <gamegenie code=\"AEXEGYIP\" description=\"Body Armor costs nothing instead of 1500\" />\n      <gamegenie code=\"AAXEILAG\" description=\"Large Shield costs nothing instead of 40\" />\n      <gamegenie code=\"AEXEILAI\" description=\"Leather Armor costs nothing instead of 50\" />\n      <gamegenie code=\"AEVEILEP\" description=\"Chain Mail costs nothing instead of 90\" />\n      <gamegenie code=\"AAXEGGZA\" description=\"Breast Plate costs nothing instead of 200\" />\n      <gamegenie code=\"AEXEGGPA\" description=\"Helm costs nothing instead of 100\" />\n      <gamegenie code=\"AEVEGGIA\" description=\"S of Curing costs nothing instead of 500\" />\n      <gamegenie code=\"AAXEGTAL\" description=\"Rod of Iron costs nothing instead of 3000\" />\n      <gamegenie code=\"AEXEGTIP\" description=\"Padded Leather costs nothing instead of 1500\" />\n      <gamegenie code=\"AEVEGTIP\" description=\"Shiny Chain costs nothing instead of 1500\" />\n      <gamegenie code=\"AAXEGYIP\" description=\"Sturdy Plate costs nothing instead of 1500\" />\n      <gamegenie code=\"AAVEGYIP\" description=\"Iron Shield costs nothing instead of 1500\" />\n      <gamegenie code=\"AEVEKGAT\" description=\"Gloves of Copper costs nothing instead of 6000\" />\n      <gamegenie code=\"AAVEKLIP\" description=\"S of Glass costs nothing instead of 1500\" />\n      <gamegenie code=\"AAXEKPIZ\" description=\"Studly Staff costs nothing instead of 2500\" />\n      <gamegenie code=\"AAXEGILA\" description=\"S of Neutralizing costs nothing instead of 300\" />\n      <gamegenie code=\"AAVEGGYA\" description=\"Plate Mail costs nothing instead of 750 (1 of 2)\" />\n      <gamegenie code=\"AAVEIGAI\" description=\"Plate Mail costs nothing instead of 750 (2 of 2)\" />\n      <gamegenie code=\"AEXEGIAI\" description=\"Blade of Biting costs nothing instead of 15000 (1 of 2)\" />\n      <gamegenie code=\"AEXELIPA\" description=\"Blade of Biting costs nothing instead of 15000 (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-NDBSP\" name=\"Wizards &amp; Warriors\" crc=\"26535EF5\">\n      <gamegenie code=\"EINVTIEY\" description=\"Invincibility\" />\n      <gamegenie code=\"AUATPI\" description=\"Invincibility (flashes)\" />\n      <gamegenie code=\"GXVUZGVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SXVUZGVG\" description=\"Infinite lives (alt)\" />\n      <gamegenie code=\"GZNVILST\" description=\"Infinite health\" />\n      <gamegenie code=\"OXOVATES\" description=\"Infinite health (alt) (1 of 3)\" />\n      <gamegenie code=\"GEOVPVGU\" description=\"Infinite health (alt) (2 of 3)\" />\n      <gamegenie code=\"SEOVZTSZ\" description=\"Infinite health (alt) (3 of 3)\" />\n      <gamegenie code=\"NTEINNYK\" description=\"Potions last longer\" />\n      <gamegenie code=\"PEEVAGZA\" description=\"Meat gives half health\" />\n      <gamegenie code=\"GEEVAGZA\" description=\"Meat gives double health\" />\n      <gamegenie code=\"ALGYPL\" description=\"Enter doors without needing a key\" />\n      <gamegenie code=\"KYISTO\" description=\"Jump higher\" />\n      <gamegenie code=\"KGTITO\" description=\"Jump to the top of the scren\" />\n      <gamegenie code=\"IAUUKAZA\" description=\"Start with 6 lives (1 of 2)\" />\n      <gamegenie code=\"IAXGGAZA\" description=\"Start with 6 lives (2 of 2)\" />\n      <gamegenie code=\"AAUUKAZE\" description=\"Start with 9 lives (1 of 2)\" />\n      <gamegenie code=\"AAXGGAZE\" description=\"Start with 9 lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-CLXIQ\" name=\"IronSword: Wizards &amp; Warriors II\" crc=\"2328046E\">\n      <gamegenie code=\"OXXANAVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"OZUAXPVK\" description=\"Infinite continues\" />\n      <gamegenie code=\"GXXSNKVS\" description=\"Infinite magic\" />\n      <gamegenie code=\"ZEOSEGAA\" description=\"Infinite money\" />\n      <gamegenie code=\"SEOOTISZ\" description=\"Infinite keys once one is obtained\" />\n      <gamegenie code=\"AEEOEAZA\" description=\"Food gives full health\" />\n      <gamegenie code=\"AAOPNPZA\" description=\"Drink gives full health\" />\n      <gamegenie code=\"OTUIGLSV\" description=\"Super-jump (1 of 2)\" />\n      <gamegenie code=\"PAUIILVE\" description=\"Super-jump (2 of 2)\" />\n      <gamegenie code=\"LEVEXZAA\" description=\"Start with Axe and Helmet\" />\n      <gamegenie code=\"ZEVAVXNY\" description=\"Start with Shield\" />\n      <gamegenie code=\"AAOAGUGA\" description=\"Start with Ironsword\" />\n      <gamegenie code=\"AASIYPLA\" description=\"Fleet foot jumping\" />\n      <gamegenie code=\"OXKSYUPX\" description=\"Fleet foot running\" />\n      <gamegenie code=\"LEEEPZAE\" description=\"Start on wind level\" />\n      <gamegenie code=\"GOEEPZAA\" description=\"Start on tree level\" />\n      <gamegenie code=\"TOEEPZAA\" description=\"Start on water level\" />\n      <gamegenie code=\"IOEEPZAA\" description=\"Start on outer fire level\" />\n      <gamegenie code=\"LUEEPZAA\" description=\"Start on lower earth level\" />\n      <gamegenie code=\"PUEEPZAA\" description=\"Start on lower icefire mountain\" />\n      <gamegenie code=\"NYEAVLAE\" description=\"Start a new game with full magic\" />\n      <gamegenie code=\"PENAEZLA\" description=\"Start with 1 life (1 of 2)\" />\n      <gamegenie code=\"PESEXPLA\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"TENAEZLA\" description=\"Start with 6 lives (1 of 2)\" />\n      <gamegenie code=\"TESEXPLA\" description=\"Start with 6 lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-MZIAL\" name=\"Wizards &amp; Warriors III\" crc=\"D2562072\">\n      <gamegenie code=\"PAXXPYLA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"TAXXPYLA\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"PAXXPYLE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"SXNTPLVG\" description=\"Infinite lives (except boss stages)\" />\n      <gamegenie code=\"POSAGGZU\" description=\"Coins worth 25\" />\n      <gamegenie code=\"GVSAGGZL\" description=\"Coins worth 100\" />\n      <gamegenie code=\"NNSAGGZU\" description=\"Coins worth 255\" />\n      <gamegenie code=\"IESAZKZA\" description=\"Bags worth 5\" />\n      <gamegenie code=\"ZUSAZKZA\" description=\"Bags worth 50\" />\n      <gamegenie code=\"NNSAZKZE\" description=\"Bags worth 255\" />\n      <gamegenie code=\"AGKZGYEA\" description=\"Start with Less health\" />\n      <gamegenie code=\"ELKZGYEA\" description=\"Start with More health\" />\n      <gamegenie code=\"AGELLZEA\" description=\"Less health after death (except boss stages)\" />\n      <gamegenie code=\"ELELLZEA\" description=\"More health after death (except boss stages)\" />\n      <gamegenie code=\"PAKZGYEA\" description=\"Start with very little life force\" />\n      <gamegenie code=\"AGKZGYEA\" description=\"Start with about half life force\" />\n      <gamegenie code=\"SXVTGLVG\" description=\"Infinite lives\" />\n      <gamegenie code=\"SZNYZNSE\" description=\"Shopkeeper sometimes forgets to charge\" />\n      <gamegenie code=\"SXXNITVG\" description=\"Infinite keys\" />\n      <gamegenie code=\"EYYYYY\" description=\"Infinite gold\" />\n    </game>\n    <game code=\"CLV-H-NOZEU\" name=\"Wolverine\" crc=\"35476E87\">\n      <gamegenie code=\"ISISYU\" description=\"No enemies\" />\n      <gamegenie code=\"PEUSZALA\" description=\"Start with 1 life - P1\" />\n      <gamegenie code=\"TEUSZALA\" description=\"Start with 6 lives - P1\" />\n      <gamegenie code=\"PEUSZALE\" description=\"Start with 9 lives - P1\" />\n      <gamegenie code=\"PEVIYALA\" description=\"Start with 1 life - P2\" />\n      <gamegenie code=\"TEVIYALA\" description=\"Start with 6 lives - P2\" />\n      <gamegenie code=\"PEVIYALE\" description=\"Start with 9 lives - P2\" />\n      <gamegenie code=\"GZEXAOVK\" description=\"Infinite lives - both players\" />\n      <gamegenie code=\"PEXIZAAA\" description=\"Start on stage 2 - P1\" />\n      <gamegenie code=\"LEXIZAAA\" description=\"Start on stage 4 - P1\" />\n      <gamegenie code=\"IEXIZAAA\" description=\"Start on stage 6 - P1\" />\n      <gamegenie code=\"YEXIZAAA\" description=\"Start on stage 8 - P1\" />\n      <gamegenie code=\"PEKSYAAA\" description=\"Start on stage 2 - P2\" />\n      <gamegenie code=\"LEKSYAAA\" description=\"Start on stage 4 - P2\" />\n      <gamegenie code=\"IEKSYAAA\" description=\"Start on stage 6 - P2\" />\n      <gamegenie code=\"YEKSYAAA\" description=\"Start on stage 8 - P2\" />\n      <gamegenie code=\"AXXLNUIE\" description=\"Mega-jump\" />\n      <gamegenie code=\"AAXGYLPA\" description=\"Claws use up no health\" />\n      <gamegenie code=\"AGNIZAAA\" description=\"Start each new life as a berserker\" />\n      <gamegenie code=\"KYXUVUVN\" description=\"Super speed (1 of 2)\" />\n      <gamegenie code=\"GAUUELZA\" description=\"Super speed (2 of 2)\" />\n      <gamegenie code=\"ZAXLISAA\" description=\"Take less damage from bullets (1 of 2)\" />\n      <gamegenie code=\"ZAEKAKAA\" description=\"Take less damage from bullets (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-EIUMP\" name=\"Wrecking Crew\" crc=\"9B506A48\">\n      <gamegenie code=\"ATNKYZAZ\" description=\"Invincibility\" />\n      <gamegenie code=\"VVUXGPSA\" description=\"Start with Golden Hammer\" />\n      <gamegenie code=\"SZXILXSO\" description=\"Annoying guy doesn't bother you (1 of 2)\" />\n      <gamegenie code=\"SXKILOSO\" description=\"Annoying guy doesn't bother you (2 of 2)\" />\n      <gamegenie code=\"SXGXGL\" description=\"Infinite lives - P1\" />\n      <gamegenie code=\"SXIXZL\" description=\"Infinite lives - P2\" />\n      <gamegenie code=\"PELXYP\" description=\"Start with 1 life - both players\" />\n      <gamegenie code=\"PELXYO\" description=\"Start with 10 lives - both players\" />\n      <gamegenie code=\"YELXYO\" description=\"Start with 15 lives - both players\" />\n      <gamegenie code=\"ENLXYO\" description=\"Start with 250 lives\" />\n    </game>\n    <game code=\"CLV-H-QATOY\" name=\"WURM: Journey to the Center of the Earth\" crc=\"EB803610\">\n      <gamegenie code=\"SZSGYNSE\" description=\"Infinite fuel\" />\n      <gamegenie code=\"SXNGZTSA\" description=\"Infinite shields and life\" />\n      <gamegenie code=\"ZEXITGPA\" description=\"Start on Act 2 - Dyna Crystal\" />\n      <gamegenie code=\"LEXITGPA\" description=\"Start on Act 3 - Magma Falls\" />\n      <gamegenie code=\"GEXITGPA\" description=\"Start on Act 4 - Ziggy\" />\n      <gamegenie code=\"IEXITGPA\" description=\"Start on Act 5 - Dual Duel\" />\n    </game>\n    <game code=\"CLV-H-LTYFW\" name=\"WWF King of the Ring\" crc=\"7B4ED0BB\">\n      <gamegenie code=\"VZUUIVOO\" description=\"Infinite health - both players\" />\n    </game>\n    <game code=\"CLV-H-VVMPX\" name=\"WWF WrestleMania\" crc=\"37138039\">\n      <gamegenie code=\"ENOGVIEP\" description=\"One hit drains all health\" />\n      <gamegenie code=\"SXZTSO\" description=\"Opponent is idle after a body slam\" />\n      <gamegenie code=\"LAKTLLPA\" description=\"Countdown starts on 3\" />\n      <gamegenie code=\"PAXGXPLA\" description=\"1 minute tournament rounds\" />\n      <gamegenie code=\"TAXGXPLA\" description=\"6 minute tournament rounds\" />\n      <gamegenie code=\"PAXGXPLE\" description=\"9 minute tournament rounds\" />\n      <gamegenie code=\"OZXGNYEU\" description=\"Infinite health - P1 (1 of 3)\" />\n      <gamegenie code=\"XGXKEYZE\" description=\"Infinite health - P1 (2 of 3)\" />\n      <gamegenie code=\"SAXKOYVT\" description=\"Infinite health - P1 (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-JTQGS\" name=\"WWF WrestleMania: Steel Cage Challenge\" crc=\"D4611B79\">\n      <gamegenie code=\"VXSASUVK\" description=\"P1 cannot lose (constant 1 count)\" />\n      <gamegenie code=\"PAXGXPLA\" description=\"1 minute tournament rounds\" />\n      <gamegenie code=\"TAXGXPLA\" description=\"6 minute tournament rounds\" />\n      <gamegenie code=\"PAXGXPLE\" description=\"9 minute tournament rounds\" />\n      <gamegenie code=\"SUXIXNSO\" description=\"Infinite energy refills (press select when energy is low)\" />\n    </game>\n    <game code=\"CLV-H-FTXMO\" name=\"WWF WrestleMania Challenge\" crc=\"A0230D75\">\n      <gamegenie code=\"ZEELLGGE\" description=\"Pin count extended to 9 seconds\" />\n      <gamegenie code=\"TESGYOLA\" description=\"10-count reduced to 5 seconds\" />\n      <gamegenie code=\"IVNKGOGL\" description=\"All counts slower\" />\n      <gamegenie code=\"YONKGOGU\" description=\"All counts faster\" />\n    </game>\n    <game code=\"CLV-H-QDXDP\" name=\"Xenophobe\" crc=\"711896B8\">\n      <gamegenie code=\"AAKIYNUT\" description=\"Infinite health - both players\" />\n      <gamegenie code=\"LASIZOPA\" description=\"Increase starting health - both players\" />\n      <gamegenie code=\"AIVIIOGI\" description=\"More health - P1 (1 of 2)\" />\n      <gamegenie code=\"LAVILONY\" description=\"More health - P1 (2 of 2)\" />\n      <gamegenie code=\"SXNITVOO\" description=\"No health pick-ups allowed\" />\n      <gamegenie code=\"TAKSAPYA\" description=\"Start on level 2\" />\n      <gamegenie code=\"IAKSAPYA\" description=\"Start on level 3\" />\n      <gamegenie code=\"GAKSAPYA\" description=\"Start on level 4\" />\n      <gamegenie code=\"LAKSAPYA\" description=\"Start on level 5\" />\n    </game>\n    <game code=\"CLV-H-TPRYT\" name=\"Xevious: The Avenger\" crc=\"DFD70E27\">\n      <gamegenie code=\"SEKYKISZ\" description=\"Invincibility\" />\n      <gamegenie code=\"SZLNZY\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAZYOG\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAZYOG\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAZYOK\" description=\"Start with 9 lives\" />\n    </game>\n    <game code=\"CLV-H-QTLAE\" name=\"Xexyz\" crc=\"B1612FE6\">\n      <gamegenie code=\"OTNGGYSV\" description=\"Immune to enemy bullets\" />\n      <gamegenie code=\"OTNGGTSV\" description=\"Immune to monsters\" />\n      <gamegenie code=\"PAUZTZLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TAUZTZLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PAUZTZLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"SZEXTKVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"PAUXLILA\" description=\"1 life after continue\" />\n      <gamegenie code=\"VTOXAKSE\" description=\"Become a whirlwind on new life\" />\n      <gamegenie code=\"AAOLPNAA\" description=\"Start with and keep foot-wing\" />\n    </game>\n    <game code=\"CLV-H-KXKMT\" name=\"Yo! Noid\" crc=\"50D141FC\">\n      <gamegenie code=\"AVZUSZ\" description=\"Invincibility\" />\n      <gamegenie code=\"SZULPTAX\" description=\"Invincibility (alt)\" />\n      <gamegenie code=\"SXXLIGVG\" description=\"Infinite time\" />\n      <gamegenie code=\"IAKUVGPA\" description=\"More magic from small scrolls\" />\n      <gamegenie code=\"AEUGSKTZ\" description=\"Multi-mega-jumps\" />\n      <gamegenie code=\"PAXSNZLA\" description=\"1 continue\" />\n      <gamegenie code=\"TAXSNZLA\" description=\"6 continues\" />\n      <gamegenie code=\"ZEVSKPPA\" description=\"Start on stage 2\" />\n      <gamegenie code=\"GEVSKPPA\" description=\"Start on stage 4\" />\n      <gamegenie code=\"TEVSKPPA\" description=\"Start on stage 6\" />\n      <gamegenie code=\"AEVSKPPE\" description=\"Start on stage 8\" />\n      <gamegenie code=\"ZEVSKPPE\" description=\"Start on stage 10\" />\n      <gamegenie code=\"GEVSKPPE\" description=\"Start on stage 12\" />\n      <gamegenie code=\"AUUIVPZL\" description=\"Start with 1 life (1 of 2)\" />\n      <gamegenie code=\"AKUSOPZG\" description=\"Start with 1 life (2 of 2)\" />\n      <gamegenie code=\"IUUIVPZL\" description=\"Start with 6 lives (1 of 2)\" />\n      <gamegenie code=\"IKUSOPZG\" description=\"Start with 6 lives (2 of 2)\" />\n      <gamegenie code=\"PUUIVPZU\" description=\"Start with 9 lives (1 of 2)\" />\n      <gamegenie code=\"PKUSOPZK\" description=\"Start with 9 lives (2 of 2)\" />\n      <gamegenie code=\"SXKTTUVK\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"SXKVPUVK\" description=\"Infinite lives (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-HBQZS\" name=\"Yoshi\" crc=\"E7EAD93B\">\n      <gamegenie code=\"GOUYPEAZ\" description=\"Short wait for next characters\" />\n      <gamegenie code=\"ZEUYPEAZ\" description=\"Really short wait for next characters\" />\n      <gamegenie code=\"NNUYPEAX\" description=\"Really long wait for next characters\" />\n      <gamegenie code=\"AVSULYZA\" description=\"Freeze characters for a short time (press Down)\" />\n      <gamegenie code=\"PAVAAPLA\" description=\"Need only 1 Victory Egg to win (1 of 3)\" />\n      <gamegenie code=\"PESTAZLA\" description=\"Need only 1 Victory Egg to win (2 of 3)\" />\n      <gamegenie code=\"PEXTZLLA\" description=\"Need only 1 Victory Egg to win (3 of 3)\" />\n      <gamegenie code=\"ZAVAAPLA\" description=\"Need only 2 Victory Eggs to win (1 of 3)\" />\n      <gamegenie code=\"ZESTAZLA\" description=\"Need only 2 Victory Eggs to win (2 of 3)\" />\n      <gamegenie code=\"ZEXTZLLA\" description=\"Need only 2 Victory Eggs to win (3 of 3)\" />\n    </game>\n    <game code=\"CLV-H-ETXZC\" name=\"Young Indiana Jones Chronicles, The\" crc=\"35C6F574\">\n      <gamegenie code=\"XVSEGPSE\" description=\"Infinite health\" />\n      <gamegenie code=\"PEKSVGLA\" description=\"Start with 2 lives\" />\n      <gamegenie code=\"TEKSVGLA\" description=\"Start with 7 lives\" />\n      <gamegenie code=\"PEKSVGLE\" description=\"Start with 10 lives\" />\n      <gamegenie code=\"SZEOUGVG\" description=\"Infinite lives\" />\n    </game>\n    <game code=\"CLV-H-AGUTL\" name=\"Zanac\" crc=\"E292AA10\">\n      <gamegenie code=\"ALSEGZEU\" description=\"Invincibility + Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"ATSEIZPL\" description=\"Invincibility + Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"SZOELXOO\" description=\"Invincibility + Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"PEEKOLLA\" description=\"Start with 1 life\" />\n      <gamegenie code=\"TEEKOLLA\" description=\"Start with 6 lives\" />\n      <gamegenie code=\"PEEKOLLE\" description=\"Start with 9 lives\" />\n      <gamegenie code=\"OXEENYVK\" description=\"Infinite lives\" />\n      <gamegenie code=\"PEOPAGAA\" description=\"Start with Straight Crusher\" />\n      <gamegenie code=\"ZEOPAGAA\" description=\"Start with Field Shutter\" />\n      <gamegenie code=\"LEOPAGAA\" description=\"Start with the Circular\" />\n      <gamegenie code=\"GEOPAGAA\" description=\"Start with the Vibrator\" />\n      <gamegenie code=\"IEOPAGAA\" description=\"Start with the Rewinder\" />\n      <gamegenie code=\"TEOPAGAA\" description=\"Start with the Plasma Flash\" />\n      <gamegenie code=\"YEOPAGAA\" description=\"Start with rapid fire\" />\n    </game>\n    <game code=\"CLV-H-FJSHD\" name=\"Zen: Intergalactic Ninja\" crc=\"D8578BFD\">\n      <gamegenie code=\"AAKEOAPP\" description=\"Invincibility (blinking)\" />\n      <gamegenie code=\"AEELPXYZ\" description=\"Hit anywhere (1 of 3)\" />\n      <gamegenie code=\"AEOLYXPP\" description=\"Hit anywhere (2 of 3)\" />\n      <gamegenie code=\"OXXUGZEU\" description=\"Hit anywhere (3 of 3)\" />\n      <gamegenie code=\"AEKLYGZA\" description=\"One hit kills\" />\n      <gamegenie code=\"ZAELNGIE\" description=\"9 lives allowed in options menu\" />\n      <gamegenie code=\"GZNLYUSE\" description=\"Infinite health\" />\n      <gamegenie code=\"NYNXVTOE\" description=\"Slower timer\" />\n      <gamegenie code=\"YTNXVTOE\" description=\"Faster timer\" />\n      <gamegenie code=\"YINXVTOE\" description=\"Even faster timer\" />\n      <gamegenie code=\"AEUAOLGE\" description=\"Zen does increased damage - isometric stages\" />\n      <gamegenie code=\"GOUAOLGA\" description=\"Zen does mega damage - isometric stages\" />\n      <gamegenie code=\"AAKXUIGE\" description=\"Jab attack does more damage - horizontal stages\" />\n      <gamegenie code=\"GPKXUIGA\" description=\"Mega jab attack damage - horizontal stages\" />\n      <gamegenie code=\"SZSPGTVG\" description=\"Infinite lives (1 of 2)\" />\n      <gamegenie code=\"SZOZYTVG\" description=\"Infinite lives (2 of 2)\" />\n      <gamegenie code=\"PAEUGGLA\" description=\"Fewer hits in shield (1 of 2)\" />\n      <gamegenie code=\"PAXUNTLA\" description=\"Fewer hits in shield (2 of 2)\" />\n      <gamegenie code=\"TAEUGGLA\" description=\"Double hits in shield (1 of 2)\" />\n      <gamegenie code=\"TAXUNTLA\" description=\"Double hits in shield (2 of 2)\" />\n      <gamegenie code=\"PAEUGGLE\" description=\"Triple hits in shield (1 of 2)\" />\n      <gamegenie code=\"PAXUNTLE\" description=\"Triple hits in shield (2 of 2)\" />\n    </game>\n    <game code=\"CLV-H-SVDKL\" name=\"Zombie Nation\" crc=\"03FB57B6\">\n      <gamegenie code=\"AVXTEISZ\" description=\"Infinite health\" />\n    </game>\n    </database>";
    return XmlHolder;
}());


/***/ })
/******/ ]);