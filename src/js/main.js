(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\base64-js\\lib\\b64.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\base64-js\\lib")
},{"XJF/FV":4,"buffer":2}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
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
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\buffer\\index.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\buffer")
},{"XJF/FV":4,"base64-js":1,"buffer":2,"ieee754":3}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
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
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

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
  var eLen = (nBytes * 8) - mLen - 1
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
      m = ((value * c) - 1) * Math.pow(2, mLen)
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

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\ieee754\\index.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\ieee754")
},{"XJF/FV":4,"buffer":2}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\..\\node_modules\\gulp-browserify\\node_modules\\process\\browser.js","/..\\..\\node_modules\\gulp-browserify\\node_modules\\process")
},{"XJF/FV":4,"buffer":2}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const GameObject = require("./GameObject");

class Block extends GameObject {
    constructor(x, y, width, height) {
        super();
        this.name = "Block";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#2f0";
        this.opacity = 1;
        this.zIndex = 2;
        this.text = "";
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.text) {
            ctx.font = "20px Arial";
            ctx.fillText(this.text, this.x, this.y);
        }
        ctx.restore();
    }
}

module.exports = Block;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Block.js","/System")
},{"./GameObject":8,"XJF/FV":4,"buffer":2}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const Block = require("./Block");

class Enemy extends Block {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height);
        this.name = "Enemy";
        this.color = "#f00";
        this.opacity = 1;
        this.zIndex = 0;
        this.speed = speed;
        this.health = 100;
    }
    update() {
        this.text = this.health;
        if (this.health <= 0) this.delete();
    }
    run() {
        this.x += this.speed;
    }
    createEnemy(x, y) {
        return new Enemy(x, y, this.width, this.height);
    }
    getEnemy(x = this.x, y = this.y) {
        return this.createEnemy(x, y);
    }
}

module.exports = Enemy;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Enemy.js","/System")
},{"./Block":5,"XJF/FV":4,"buffer":2}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const GameObject = require("./GameObject");

const MainScene = require("./MenuScene");

class Game {
    constructor() {
        this.scene = new MainScene("MainScene");
    }

    initialization() {
        while (GameObject.notInitialized.length > 0) {
            GameObject.notInitialized[0].__init();
        }
    }

    update(deltaTime) {
        //onsole.log(this.Tower);
        while (GameObject.notInitialized.length > 0) {
            GameObject.notInitialized[0].__init();
        }
        while (GameObject.deleteList.length > 0) {
            GameObject.deleteList[0].__delete();
        }
        // Обновление логики всех объектов
        for (let item in GameObject.zIndexDict) {
            GameObject.zIndexDict[item].forEach((object) => {
                if (object.__isEnabled && object.__isInit)
                    object.__update(deltaTime);
            });
        }
    }
    draw(ctx) {
        // Отрисовка всех объектов в зависимости от индекса
        for (let item in GameObject.zIndexDict) {
            GameObject.zIndexDict[item].forEach((object) => {
                if (object.__isEnabled && object.__isInit) object.__draw(ctx);
            });
        }
    }
}

module.exports = Game;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Game.js","/System")
},{"./GameObject":8,"./MenuScene":14,"XJF/FV":4,"buffer":2}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Глвный объект игры
 * @function initialization() - иницифализация объекта
 * @function onEnable() - вызывается при включении объекта
 * @function onDisable() - вызывается при выключении объекта
 * @function update(deltatime) - обновление объекта логики
 * @function draw(ctx) - отрисовка объекта
 * @function addChild() - добавление дочернего объекта
 * @functiom addChildren(array) - добавление массива дочерних объектов
 */
class GameObject {
    constructor() {
        GameObject.objects.push(this);
        GameObject.notInitialized.unshift(this);
        GameObject.num++;

        this.__isInit = false;
        this.__isEnabled = true;

        this.__children = [];
        this.__father = null;

        this.__zIndex = 0;
        this.__changeZIndex(this.__zIndex);
    }

    /**
     * Вызывает функцию initialization()
     * @private
     */
    __init() {
        console.log("init");
        this.initialization();
        this.__isInit = true;
        GameObject.notInitialized.splice(
            GameObject.notInitialized.indexOf(this),
            1
        );
    }
    /**
     * Метод активации объекта и его детей
     * @private
     */
    __enable() {
        this.onEnable();
        this.__isEnabled = true;
        this.__children.forEach((child) => {
            child.enable();
        });
    }
    /**
     * Метод деактивации объекта и его детей
     * @private
     */
    __disable() {
        this.onDisable();
        this.__isEnabled = false;
        this.__children.forEach((child) => {
            child.disable();
        });
    }
    /**
     * Метод обновления логики объекта
     * @private
     * @param {*} deltaTime временная дельта
     *
     */
    __update(deltaTime) {
        this.update(deltaTime);
    }
    /**
     * Метод отрисовки объекта вызывается после update
     * @private
     * @param {*} ctx контекст отрисовки
     */
    __draw(ctx) {
        this.draw(ctx);
    }
    /**
     * Поменять zIndex
     * @private
     * @param {*} z zIndex
     */
    __changeZIndex(z) {
        /**
         * Добавить в список
         */
        if (GameObject.zIndexDict["" + z] === undefined) {
            GameObject.zIndexDict["" + z] = [this];
        } else if (GameObject.zIndexDict["" + z].indexOf(this) === -1) {
            GameObject.zIndexDict["" + z].push(this);
        }

        // Удаляем объект из старого zIndexDict
        if (
            this.__zIndex != z &&
            GameObject.zIndexDict["" + this.__zIndex].indexOf(this) !== -1
        ) {
            GameObject.zIndexDict["" + this.__zIndex].splice(
                GameObject.zIndexDict["" + this.__zIndex].indexOf(this),
                1
            );
        }
        this.__zIndex = z;
    }

    initialization() {}
    onEnable() {}
    onDisable() {}
    update(deltaTime) {}
    draw(ctx) {}

    /**
     * Вернуть zIndex
     */
    get zIndex() {
        return this.__zIndex;
    }
    /**
     * Установить zIndex
     */
    set zIndex(z) {
        this.__changeZIndex(z);
    }

    /**
     * Добавить ребенка в контейнер
     * @param {*} child ребенок
     */
    addChild(child) {
        child.__father = this;
        this.__children.push(child);
    }

    /**
     * Метод добавления детей в список объектов
     * @param {*} __children список детей
     * @memberof GameObject
     */
    addChildren(__children) {
        __children.forEach((child) => {
            child.__father = this;
            this.__children.push(child);
        });
    }
    clone() {
        let clone = Object.assign(this, this.x, this.y);
        console.log(clone === this);
        return clone;
    }
    delete() {
        GameObject.deleteList.push(this);
    }
    __delete() {
        GameObject.deleteList.splice(GameObject.deleteList.indexOf(this), 1);
        if (this.__father != null) {
            this.__father.__children.splice(
                this.__father.__children.indexOf(this),
                1
            );
        }
        GameObject.objects.splice(GameObject.objects.indexOf(this), 1);
        GameObject.zIndexDict["" + this.__zIndex].splice(
            GameObject.zIndexDict["" + this.__zIndex].indexOf(this),
            1
        );
        GameObject.num--;
    }
}

GameObject.objects = [];
GameObject.zIndexDict = {};
GameObject.num = 0;
GameObject.notInitialized = [];
GameObject.deleteList = [];
GameObject.deepClone = (obj) => {
    const clObj = {};
    for (const i in obj) {
        if (obj[i] instanceof Object) {
            clObj[i] = GameObject.deepClone(obj[i]);
            continue;
        }
        clObj[i] = obj[i];
    }
    return clObj;
};

module.exports = GameObject;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\GameObject.js","/System")
},{"XJF/FV":4,"buffer":2}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const GameObject = require("../GameObject");
const MouseHandler = require("../InputHandlers/MouseHandler");
class Cell extends GameObject {
    constructor(x, y, width, height) {
        super();
        this.name = "Cell";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#000";
        this.opacity = 0.5;
        this.zIndex = 1;
        this.isDrawing = true;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (this.isDrawing) {
            ctx.font = "20px Arial";
            ctx.fillText(this.x + " " + this.y, this.x, this.y);
        }
        ctx.restore();
    }
    getPosition() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    /**
     * Коллизия объекта с точкой
     * @param {{x,y}} position точка с координатами x и y
     * @param {Cell} cell объект cell с x, y, width, height
     * @returns
     */
    static collision(position, cell) {
        return (
            position.x >= cell.x &&
            position.x <= cell.x + cell.width &&
            position.y >= cell.y &&
            position.y <= cell.y + cell.height
        );
    }
}

module.exports = Cell;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Grid\\Cell.js","/System\\Grid")
},{"../GameObject":8,"../InputHandlers/MouseHandler":13,"XJF/FV":4,"buffer":2}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const GameObject = require("../GameObject");
const MouseHandler = require("../InputHandlers/MouseHandler");
const Cell = require("./Cell");

class Grid extends GameObject {
    constructor(
        x,
        y,
        offsetX,
        offsetY,
        wCount,
        hCount,
        cellWidth,
        cellHeight,
        isDrawing = false
    ) {
        super();
        this.name = "Grid";
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.wCount = wCount;
        this.hCount = hCount;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.color = "#000";
        this.opacity = 1;
        this.zIndex = 1;
        this.cells = [];
        this.isDrawing = isDrawing;
    }
    initialization() {
        console.log("Grid initialization");
        for (let i = 0; i < this.wCount; i++) {
            for (let j = 0; j < this.hCount; j++) {
                const cell = new Cell(
                    this.x + i * (this.cellWidth + this.offsetX),
                    this.y + j * (this.cellHeight + this.offsetY),
                    this.cellWidth,
                    this.cellHeight
                );
                cell.isDrawing = this.isDrawing;
                Cell.zIndex = 5;
                this.cells.push(cell);
            }
        }
        this.addChildren(this.cells);
    }
    /**
     * Вернет позицию на экране
     * @param {*} position позиция на экране
     * @returns {{x: number, y: number}} вернет позицию в гриде
     */
    getGridPosition(pos) {
        let size = {
            x: this.cellWidth + this.offsetX,
            y: this.cellHeight + this.offsetY,
        };
        let position = {
            x: pos.x - this.x,
            y: pos.y - this.y,
        };
        let o = {
            x: (position.x - (position.x % size.x)) / size.x,
            y: (position.y - (position.y % size.y)) / size.y,
        };

        return o;
    }
    /**
     * Вернет ячейку по индексу
     * @param {*} index индекс
     * @returns {Cell} вернет ячейку
     */
    getCellByIndex(index) {
        return index < this.cells.length ? this.cells[index] : null;
    }
    /**
     * Вернет ячейку по позиции в гриде
     * @param {{x:number,y:number}} gridPosition
     * @returns {{Cell}} вернет ячейку
     */
    getCellByGridPosition(gridPosition) {
        let n = gridPosition.x * this.hCount + gridPosition.y;
        return gridPosition.x >= 0 &&
            gridPosition.x < this.wCount &&
            gridPosition.y >= 0 &&
            gridPosition.y < this.hCount
            ? this.getCellByIndex(n)
            : null;
    }

    /**
     * Вернут ячейку по позиции на экране
     * @param {{x:number,y:number}} position позиция на экране
     * @returns {{Cell}} вернет ячейку
     *
     */
    getCellByPosition(position) {
        let o = this.getGridPosition(position);

        return this.getCellByGridPosition(o);
    }
}

module.exports = Grid;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Grid\\Grid.js","/System\\Grid")
},{"../GameObject":8,"../InputHandlers/MouseHandler":13,"./Cell":9,"XJF/FV":4,"buffer":2}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Менеджер ассетов
 */
class ImageManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = {};
        this.downloadQueue = [];
    }
    /**
     * Добавляет изображение в очередь загрузки
     * @param {*} path путь к файлу
     */
    queueDownload(name, path) {
        this.downloadQueue.push({ name: name, path: path });
    }
    /**
     *  Проверяет, все ли файлы загружены
     * @returns {boolean} true если все изображения загружены
     */
    isDone() {
        return this.downloadQueue.length == this.successCount + this.errorCount;
    }
    /**
     *  Загружает все изображения из очереди
     * @param {*} downloadCallback функция, которая вызывается после загрузки каждого изображения
     */
    downloadAll(downloadCallback) {
        for (var i = 0; i < this.downloadQueue.length; i++) {
            let img = new Image();
            let that = this;
            let path = this.downloadQueue[i].path;
            let name = this.downloadQueue[i].name;
            img.addEventListener("load", function () {
                //console.log("load", name);
                that.successCount++;
                if (that.isDone()) downloadCallback();
            });
            img.addEventListener("error", function () {
                console.log("error", name);
                that.errorCount++;
                if (that.isDone()) downloadCallback();
            });
            img.src = path;
            this.cache[name] = img;
        }
    }
    /**
     * Возвращает изображение по пути
     * @param {*} name путь к файлу
     * @returns
     */
    getAsset(name) {
        // if name is error that throw error
        if (name === undefined)
            throw new Error(`AssetManager.getAsset: name:${name} is undefined`);
        if (this.cache[name] === undefined)
            throw new Error(`AssetManager.getAsset: name:${name} is not found`);

        return this.cache[name];
    }
}

module.exports = ImageManager;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\ImageManager.js","/System")
},{"XJF/FV":4,"buffer":2}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
class KeyboardHandler {
    constructor() {
        this.canvas = window.canvas;

        canvas.onkeydown = (e) => {
            KeyboardHandler.onkeydownCallbacks.forEach((callback) => {
                callback(e);
            });
        };

        canvas.onkeyup = (e) => {
            KeyboardHandler.onkeyupCallbacks.forEach((callback) => {
                callback(e);
            });
        };

        canvas.onkeypress = (e) => {
            KeyboardHandler.onkeypressCallbacks.forEach((callback) => {
                callback(e);
            });
        };
    }
}

/**
 * * keydown - срабатывает при нажатии клавиши
 * * keyup - срабатывает при отпускании клавиши
 * * keypress - срабатывает между нажатии и отпускании клавиши
 */
KeyboardHandler.onkeydownCallbacks = [];
KeyboardHandler.onkeyupCallbacks = [];
KeyboardHandler.onkeypressCallbacks = [];

module.exports = KeyboardHandler;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\InputHandlers\\KeyboardHandler.js","/System\\InputHandlers")
},{"XJF/FV":4,"buffer":2}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
class MouseHandler {
    constructor() {
        this.canvas = window.canvas;

        canvas.onmousemove = (e) => {
            MouseHandler.onmousemoveCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmousedown = (e) => {
            MouseHandler.onmousedownCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmouseup = (e) => {
            MouseHandler.onmouseupCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onclick = (e) => {
            MouseHandler.onclickCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.ondblclick = (e) => {
            MouseHandler.ondblclickCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmouseover = (e) => {
            MouseHandler.onmouseoverCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmouseout = (e) => {
            MouseHandler.onmouseoutCallbacks.forEach((callback) => {
                callback(e);
            });
        };
    }

    static geMousePositionInCanvas(e) {
        const cvs = window.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - cvs.left) * (window.canvas.width / cvs.width),
            y: (e.clientY - cvs.top) * (window.canvas.height / cvs.height),
        };
    }

    static addOnClickEvent(callback) {
        MouseHandler.onclickCallbacks.push(callback);
    }
    static addOnMouseMoveEvent(callback) {
        MouseHandler.onmousemoveCallbacks.push(callback);
    }
    static addOnMouseDownEvent(callback) {
        MouseHandler.onmousedownCallbacks.push(callback);
    }
    static addOnMouseUpEvent(callback) {
        MouseHandler.onmouseupCallbacks.push(callback);
    }
    static addOnMouseOverEvent(callback) {
        MouseHandler.onmouseoverCallbacks.push(callback);
    }
    static addOnMouseOutEvent(callback) {
        MouseHandler.onmouseoutCallbacks.push(callback);
    }
    static addOnDblClickEvent(callback) {
        MouseHandler.ondblclickCallbacks.push(callback);
    }
}
/**
 * * onmousedown - когда нажата кнопка мыши и еще не отпущена
 * * onmouseup - когда отпускаем кнопку мыши
 * * onclick - комбинация onmousedown и onmouseup
 * * ondblclick - двойной кик
 * * onmousemove когда двигаем мышь
 * * onmouseover когда мышь наводится на элемент
 * * onmouseout когда мышь уходит с элемента
 */
MouseHandler.onmousedownCallbacks = [];
MouseHandler.onmouseupCallbacks = [];
MouseHandler.onclickCallbacks = [];
MouseHandler.ondblclickCallbacks = [];
MouseHandler.onmousemoveCallbacks = [];
MouseHandler.onmouseoverCallbacks = [];
MouseHandler.onmouseoutCallbacks = [];

module.exports = MouseHandler;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\InputHandlers\\MouseHandler.js","/System\\InputHandlers")
},{"XJF/FV":4,"buffer":2}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const Scene = require("./Scene");
const Grid = require("./Grid/Grid");
const Cell = require("./Grid/Cell");
const Tower = require("./Tower");
const TowerB = require("./towerB");
const MouseHandler = require("./InputHandlers/MouseHandler");
const GameObject = require("./GameObject");
const Enemy = require("./Enemy");
const Projectile = require("./Projectile");

class MenuScene extends Scene {
    constructor() {
        super();
        this.x = 0;
        this.y = 64 * 2;
        // grids
        this.grid = new Grid(this.x, this.y, 0, 16, 15, 6, 64, 64, false);
        this.gridMenu = new Grid(32, 32, 20, 0, 2, 1, 64, 64);
        //towers
        this.menuTowers = [new Tower(0, 0, 64, 64), new TowerB(0, 0, 64, 64)];
        this.towers = [];
        this.ghostTower = null;

        this.enemies = [];
        this.projectiles = [];

        this.tower = -1;
        this.pressTowerMenu = false;
        this.oldSelectedCell = null;
        this.selectedCell = null;

        this.timer = 0;
        this.timerShot = 0;
    }

    initialization() {
        let that = this;

        // * В меню добавить башни
        for (let i = 0; i < this.menuTowers.length; i++) {
            let cell = this.gridMenu.cells[i];
            this.menuTowers[i].x = cell.x;
            this.menuTowers[i].y = cell.y;
        }

        MouseHandler.addOnClickEvent((e) => {
            // * Позиция мыши на канвасе
            const mpos = MouseHandler.geMousePositionInCanvas(e);
            // * Работа с главной сеткой
            this.grid.cells.forEach((cell) => {
                if (Cell.collision(mpos, cell) && this.tower !== -1) {
                    // * Если мышка нажата на клетку и выбранна башня то бащню нужно поставить в клетку
                    let { x, y } = cell.getPosition();
                    // * Берем башню из призрака и ставим ее в клетку

                    if (
                        that.towers.findIndex(
                            (tower) => tower.x === x && tower.y === y
                        ) === -1
                    ) {
                        let tower = that.ghostTower;
                        tower.x = x;
                        tower.y = y;
                        that.tower = -1;
                        that.towers.push(tower);
                        cell.addChild(tower);
                    }

                    console.log(that.towers);
                }
            });

            // * Работа с сеткой меню
            this.gridMenu.cells.forEach((cell, index) => {
                if (Cell.collision(mpos, cell)) {
                    let { x, y } = cell.getPosition();
                    that.tower = index;
                    this.pressTowerMenu = true;
                }
            });
        });

        MouseHandler.addOnMouseMoveEvent((e) => {
            if (this.ghostTower !== null) {
                const mpos = MouseHandler.geMousePositionInCanvas(e);
                this.ghostTower.x = mpos.x - this.ghostTower.width / 2;
                this.ghostTower.y = mpos.y - this.ghostTower.height / 2;
                //let gPos = this.grid.getGridPosition(mpos);
                let cell = this.grid.getCellByPosition(mpos);
                if (cell) {
                    cell.isDrawing = !cell.isDrawing;
                }
            }
        });
    }

    update(deltaTime) {
        this.timer += deltaTime;
        this.timerShot += deltaTime;
        // * Логика для работы с призраком башни
        if (this.tower !== -1 && this.ghostTower === null) {
            // * Если выбранна вышка и нету призрака то создать призрака и добавить его в сцену
            this.ghostTower = this.menuTowers[this.tower].getTower();
            this.pressTowerMenu = false;
        } else if (this.tower !== -1 && this.pressTowerMenu) {
            // * Если вышка выбранна и кнопка нажата на меню то нужно поменять призрка
            // * Старый призрак удаляем и создаем новый
            this.ghostTower.delete();
            this.ghostTower = this.menuTowers[this.tower].getTower();
            this.pressTowerMenu = false;
        } else if (this.tower === -1) {
            // * Если вышка не выбранна то призрак удаляем
            this.ghostTower = null;
        }

        if (this.timer > 2000) {
            let r = Math.floor(Math.random() * 6);
            console.log(this.x + 76 * r);
            this.enemies.push(
                new Enemy(64 * 16, this.y + (64 + 16) * r, 64, 64, -0.5)
            );
            this.timer = 0;
        }
        this.enemies.forEach((enemy) => {
            let { x, y } = this.grid.getGridPosition(enemy);
            x = this.x + x * 64;
            y = this.y + y * (64 + 16);
            let tower = this.towers.find(
                (tower) => tower.x === x && tower.y === y
            );
            if (!tower) {
                enemy.run();
            }
            if (this.timerShot > 1000) {
                console.log(this.timerShot);
                let towers = this.towers.filter(
                    (tower) => tower.y === y && tower.x <= x
                );
                if (towers.length > 0) {
                    towers.forEach((tower) => {
                        this.projectiles.push(
                            new Projectile(tower.x, tower.y, 32, 32, 0.5)
                        );
                    });
                }
            }

            let i = 0;
            while (this.projectiles.length > i && this.projectiles.length > 0) {
                if (
                    this.projectiles[i].y === enemy.y &&
                    this.projectiles[i].x >= enemy.x
                ) {
                    enemy.health -= this.projectiles[i].damage;

                    this.projectiles[i].delete();
                    this.projectiles.splice(
                        this.projectiles.indexOf(this.projectiles[i]),
                        1
                    );
                    i--;
                }
                i++;
            }
            // console.log("s", tower);
        });
        let i = 0;
        while (this.enemies.length > i && this.enemies.length > 0) {
            if (this.enemies[i].health <= 0) {
                this.enemies.splice(this.enemies.indexOf(this.enemies[i]), 1);
                i--;
            }
            i++;
        }
        if (this.timerShot > 1000) {
            this.timerShot = 0;
        }
        console.log(this.projectiles);
        this.projectiles.forEach((projectile) => {
            if (projectile) projectile.run();
        });
    }
}

module.exports = MenuScene;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\MenuScene.js","/System")
},{"./Enemy":6,"./GameObject":8,"./Grid/Cell":9,"./Grid/Grid":10,"./InputHandlers/MouseHandler":13,"./Projectile":15,"./Scene":16,"./Tower":17,"./towerB":18,"XJF/FV":4,"buffer":2}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const Block = require("./Block");

class Projectile extends Block {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height);
        this.name = "Projectile";
        this.color = "#60bf30";
        this.opacity = 1;
        this.zIndex = 15;
        this.speed = speed;
        this.makerDelete = false;
        this.damage = 25;
    }
    update() {
        if (this.makerDelete) this.delete();
    }
    run() {
        this.x += this.speed;
    }
    createProjectile(x, y) {
        return new Projectile(x, y, this.width, this.height);
    }
    getProjectile(x = this.x, y = this.y) {
        return this.createProjectile(x, y);
    }
}

module.exports = Projectile;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Projectile.js","/System")
},{"./Block":5,"XJF/FV":4,"buffer":2}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const GameObject = require("./GameObject");

class Scene extends GameObject {
    //static scenes = [];
    /**
     * Класс сцены
     * @param  {string} name - имя сцены
     */
    constructor(name) {
        super();
        this.name = name;
        console.log("Scene constructor");
    }
    initialization() {
        console.log("Scene initialization");
    }
}

module.exports = Scene;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Scene.js","/System")
},{"./GameObject":8,"XJF/FV":4,"buffer":2}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const GameObject = require("./GameObject");
const MouseHandler = require("./InputHandlers/MouseHandler");
const Cell = require("./Grid/Cell");
const Grid = require("./Grid/Grid");
const Block = require("./Block");

class Tower extends Block {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.name = "Tower";
        this.color = "#2f0";
        this.opacity = 1;
        this.zIndex = 1;
        this.timer = 0;
        this.interval = 1000;
        this.health = 100;
    }
    update(deltaTime) {
        this.timer += deltaTime;
        if (this.health <= 0) {
            this.delete();
        }
    }
    createTower(x, y) {
        return new Tower(x, y, this.width, this.height);
    }
    getTower(x = this.x, y = this.y) {
        return this.createTower(x, y);
    }
}

module.exports = Tower;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\Tower.js","/System")
},{"./Block":5,"./GameObject":8,"./Grid/Cell":9,"./Grid/Grid":10,"./InputHandlers/MouseHandler":13,"XJF/FV":4,"buffer":2}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const Tower = require("./Tower");

class TowerB extends Tower {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.name = "TowerB";
        this.color = "#00B";
        this.opacity = 1;
        this.zIndex = 1;
    }

    getTower(x, y) {
        return new TowerB(x, y, this.width, this.height);
    }
}

module.exports = TowerB;

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/System\\towerB.js","/System")
},{"./Tower":17,"XJF/FV":4,"buffer":2}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
const GameObject = require("./System/GameObject");
const Game = require("./System/Game");

const ImageManager = require("./System/ImageManager");
const MouseHandler = require("./System/InputHandlers/MouseHandler");
const KeyboardHandler = require("./System/InputHandlers/KeyboardHandler");

/**
 * * Функция выполнится при загрузке страницы
 */
function loadGame() {
    const canvas = document.querySelector("#canvas");
    window.canvas = canvas;

    const ctx = canvas.getContext("2d");

    canvas.width = 128 * 8;
    canvas.height = 128 * 5;

    let isLoaded = false;
    const assets = [
        { name: "button", src: "./src/assets/button.png" },
        { name: "tower_01", src: "./src/assets/Towers/tower_blue.png" },
        { name: "turret_01_1", src: "./src/assets/Turrets/turret_01_mk1.png" },
        { name: "turret_01_2", src: "./src/assets/Turrets/turret_01_mk2.png" },
        { name: "turret_01_3", src: "./src/assets/Turrets/turret_01_mk3.png" },
        { name: "turret_01_4", src: "./src/assets/Turrets/turret_01_mk4.png" },
        { name: "turret_02_1", src: "./src/assets/Turrets/turret_02_mk1.png" },
        { name: "turret_02_2", src: "./src/assets/Turrets/turret_02_mk2.png" },
        { name: "turret_02_3", src: "./src/assets/Turrets/turret_02_mk3.png" },
        { name: "turret_02_4", src: "./src/assets/Turrets/turret_02_mk4.png" },
        { name: "terrain", src: "./src/assets/Terrains/terrain.png" },
        { name: "tank_01", src: "./src/assets/body_tracks.png" },
        { name: "halftrack", src: "./src/assets/body_halftrack.png" },
    ];

    const game = new Game();
    const mh = new MouseHandler();
    const kh = new KeyboardHandler();

    GameObject.game = game;

    /**
     * * РАБОЧАЯ ЗОНА
     */

    let imgManager = loadImages(assets, () => {
        game.initialization();
        isLoaded = true;
    });

    window.windowToCanvas = (x, y) => {
        const bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height),
        };
    };

    var lastTime = 0;
    let interval = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        interval += deltaTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (isLoaded) {
            if (interval >= 0) {
                interval = 0;
                //console.log("tick");
                //console.log(canvas.width);
                game.update(deltaTime);
                //  window.Animation.deltaTime = deltaTime;
                game.draw(ctx);
            }
        }
        requestAnimationFrame(animate);
    }

    animate(0);
}

/**
 * * Позволяет загрузить все картинки
 * @param {Array} assets Массив с объектами картинок
 * @param {Function} callback Функция которая выполнится после загрузки всех картинок
 */
function loadImages(assets, callback) {
    console.log("Loading images...");
    const imgManager = new ImageManager();
    assets.forEach((asset) => {
        imgManager.queueDownload(asset.name, asset.src);
    });
    // Загружаем ресурсы по окончанию вызываем функцию load
    imgManager.downloadAll(() => {
        console.log(
            "Images loaded!",
            "success count:",
            imgManager.successCount,
            "error count",
            imgManager.errorCount
        );
        console.log("Assets cache", imgManager.cache);
        callback();
    });

    return imgManager;
}

window.addEventListener("load", loadGame);

/**
 * * Пайплайн игры
 * * 1. Загрузка картинок
 */

}).call(this,require("XJF/FV"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_9352e60.js","/")
},{"./System/Game":7,"./System/GameObject":8,"./System/ImageManager":11,"./System/InputHandlers/KeyboardHandler":12,"./System/InputHandlers/MouseHandler":13,"XJF/FV":4,"buffer":2}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcb2Rpblxcc291cmNlXFxnaXRodWJcXHRkLWdhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9vZGluL3NvdXJjZS9naXRodWIvdGQtZ2FtZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIkM6L1VzZXJzL29kaW4vc291cmNlL2dpdGh1Yi90ZC1nYW1lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIkM6L1VzZXJzL29kaW4vc291cmNlL2dpdGh1Yi90ZC1nYW1lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJDOi9Vc2Vycy9vZGluL3NvdXJjZS9naXRodWIvdGQtZ2FtZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJDOi9Vc2Vycy9vZGluL3NvdXJjZS9naXRodWIvdGQtZ2FtZS9zcmMvanMvU3lzdGVtL0Jsb2NrLmpzIiwiQzovVXNlcnMvb2Rpbi9zb3VyY2UvZ2l0aHViL3RkLWdhbWUvc3JjL2pzL1N5c3RlbS9FbmVteS5qcyIsIkM6L1VzZXJzL29kaW4vc291cmNlL2dpdGh1Yi90ZC1nYW1lL3NyYy9qcy9TeXN0ZW0vR2FtZS5qcyIsIkM6L1VzZXJzL29kaW4vc291cmNlL2dpdGh1Yi90ZC1nYW1lL3NyYy9qcy9TeXN0ZW0vR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL29kaW4vc291cmNlL2dpdGh1Yi90ZC1nYW1lL3NyYy9qcy9TeXN0ZW0vR3JpZC9DZWxsLmpzIiwiQzovVXNlcnMvb2Rpbi9zb3VyY2UvZ2l0aHViL3RkLWdhbWUvc3JjL2pzL1N5c3RlbS9HcmlkL0dyaWQuanMiLCJDOi9Vc2Vycy9vZGluL3NvdXJjZS9naXRodWIvdGQtZ2FtZS9zcmMvanMvU3lzdGVtL0ltYWdlTWFuYWdlci5qcyIsIkM6L1VzZXJzL29kaW4vc291cmNlL2dpdGh1Yi90ZC1nYW1lL3NyYy9qcy9TeXN0ZW0vSW5wdXRIYW5kbGVycy9LZXlib2FyZEhhbmRsZXIuanMiLCJDOi9Vc2Vycy9vZGluL3NvdXJjZS9naXRodWIvdGQtZ2FtZS9zcmMvanMvU3lzdGVtL0lucHV0SGFuZGxlcnMvTW91c2VIYW5kbGVyLmpzIiwiQzovVXNlcnMvb2Rpbi9zb3VyY2UvZ2l0aHViL3RkLWdhbWUvc3JjL2pzL1N5c3RlbS9NZW51U2NlbmUuanMiLCJDOi9Vc2Vycy9vZGluL3NvdXJjZS9naXRodWIvdGQtZ2FtZS9zcmMvanMvU3lzdGVtL1Byb2plY3RpbGUuanMiLCJDOi9Vc2Vycy9vZGluL3NvdXJjZS9naXRodWIvdGQtZ2FtZS9zcmMvanMvU3lzdGVtL1NjZW5lLmpzIiwiQzovVXNlcnMvb2Rpbi9zb3VyY2UvZ2l0aHViL3RkLWdhbWUvc3JjL2pzL1N5c3RlbS9Ub3dlci5qcyIsIkM6L1VzZXJzL29kaW4vc291cmNlL2dpdGh1Yi90ZC1nYW1lL3NyYy9qcy9TeXN0ZW0vdG93ZXJCLmpzIiwiQzovVXNlcnMvb2Rpbi9zb3VyY2UvZ2l0aHViL3RkLWdhbWUvc3JjL2pzL2Zha2VfOTM1MmU2MC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWEpGL0ZWXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYmFzZTY0LWpzXFxcXGxpYlxcXFxiNjQuanNcIixcIi8uLlxcXFwuLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFwuLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxidWZmZXJcXFxcaW5kZXguanNcIixcIi8uLlxcXFwuLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxidWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWEpGL0ZWXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcaWVlZTc1NFxcXFxpbmRleC5qc1wiLFwiLy4uXFxcXC4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGllZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFwuLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxwcm9jZXNzXFxcXGJyb3dzZXIuanNcIixcIi8uLlxcXFwuLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxwcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcblxyXG5jbGFzcyBCbG9jayBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gXCJCbG9ja1wiO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiIzJmMFwiO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAyO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5vcGFjaXR5O1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGlmICh0aGlzLnRleHQpIHtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBcIjIwcHggQXJpYWxcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMudGV4dCwgdGhpcy54LCB0aGlzLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWEpGL0ZWXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvU3lzdGVtXFxcXEJsb2NrLmpzXCIsXCIvU3lzdGVtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcclxuXHJcbmNsYXNzIEVuZW15IGV4dGVuZHMgQmxvY2sge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3BlZWQpIHtcclxuICAgICAgICBzdXBlcih4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBcIkVuZW15XCI7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiI2YwMFwiO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuICAgICAgICB0aGlzLmhlYWx0aCA9IDEwMDtcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmhlYWx0aDtcclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkgdGhpcy5kZWxldGUoKTtcclxuICAgIH1cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB0aGlzLnggKz0gdGhpcy5zcGVlZDtcclxuICAgIH1cclxuICAgIGNyZWF0ZUVuZW15KHgsIHkpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEVuZW15KHgsIHksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIGdldEVuZW15KHggPSB0aGlzLngsIHkgPSB0aGlzLnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFbmVteSh4LCB5KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmVteTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlhKRi9GVlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL1N5c3RlbVxcXFxFbmVteS5qc1wiLFwiL1N5c3RlbVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmNvbnN0IEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xyXG5cclxuY29uc3QgTWFpblNjZW5lID0gcmVxdWlyZShcIi4vTWVudVNjZW5lXCIpO1xyXG5cclxuY2xhc3MgR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IE1haW5TY2VuZShcIk1haW5TY2VuZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXphdGlvbigpIHtcclxuICAgICAgICB3aGlsZSAoR2FtZU9iamVjdC5ub3RJbml0aWFsaXplZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIEdhbWVPYmplY3Qubm90SW5pdGlhbGl6ZWRbMF0uX19pbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YVRpbWUpIHtcclxuICAgICAgICAvL29uc29sZS5sb2codGhpcy5Ub3dlcik7XHJcbiAgICAgICAgd2hpbGUgKEdhbWVPYmplY3Qubm90SW5pdGlhbGl6ZWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBHYW1lT2JqZWN0Lm5vdEluaXRpYWxpemVkWzBdLl9faW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoR2FtZU9iamVjdC5kZWxldGVMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgR2FtZU9iamVjdC5kZWxldGVMaXN0WzBdLl9fZGVsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINCe0LHQvdC+0LLQu9C10L3QuNC1INC70L7Qs9C40LrQuCDQstGB0LXRhSDQvtCx0YrQtdC60YLQvtCyXHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBpbiBHYW1lT2JqZWN0LnpJbmRleERpY3QpIHtcclxuICAgICAgICAgICAgR2FtZU9iamVjdC56SW5kZXhEaWN0W2l0ZW1dLmZvckVhY2goKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5fX2lzRW5hYmxlZCAmJiBvYmplY3QuX19pc0luaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Ll9fdXBkYXRlKGRlbHRhVGltZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgLy8g0J7RgtGA0LjRgdC+0LLQutCwINCy0YHQtdGFINC+0LHRitC10LrRgtC+0LIg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC40L3QtNC10LrRgdCwXHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBpbiBHYW1lT2JqZWN0LnpJbmRleERpY3QpIHtcclxuICAgICAgICAgICAgR2FtZU9iamVjdC56SW5kZXhEaWN0W2l0ZW1dLmZvckVhY2goKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5fX2lzRW5hYmxlZCAmJiBvYmplY3QuX19pc0luaXQpIG9iamVjdC5fX2RyYXcoY3R4KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9TeXN0ZW1cXFxcR2FtZS5qc1wiLFwiL1N5c3RlbVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDQk9C70LLQvdGL0Lkg0L7QsdGK0LXQutGCINC40LPRgNGLXHJcbiAqIEBmdW5jdGlvbiBpbml0aWFsaXphdGlvbigpIC0g0LjQvdC40YbQuNGE0LDQu9C40LfQsNGG0LjRjyDQvtCx0YrQtdC60YLQsFxyXG4gKiBAZnVuY3Rpb24gb25FbmFibGUoKSAtINCy0YvQt9GL0LLQsNC10YLRgdGPINC/0YDQuCDQstC60LvRjtGH0LXQvdC40Lgg0L7QsdGK0LXQutGC0LBcclxuICogQGZ1bmN0aW9uIG9uRGlzYWJsZSgpIC0g0LLRi9C30YvQstCw0LXRgtGB0Y8g0L/RgNC4INCy0YvQutC70Y7Rh9C10L3QuNC4INC+0LHRitC10LrRgtCwXHJcbiAqIEBmdW5jdGlvbiB1cGRhdGUoZGVsdGF0aW1lKSAtINC+0LHQvdC+0LLQu9C10L3QuNC1INC+0LHRitC10LrRgtCwINC70L7Qs9C40LrQuFxyXG4gKiBAZnVuY3Rpb24gZHJhdyhjdHgpIC0g0L7RgtGA0LjRgdC+0LLQutCwINC+0LHRitC10LrRgtCwXHJcbiAqIEBmdW5jdGlvbiBhZGRDaGlsZCgpIC0g0LTQvtCx0LDQstC70LXQvdC40LUg0LTQvtGH0LXRgNC90LXQs9C+INC+0LHRitC10LrRgtCwXHJcbiAqIEBmdW5jdGlvbSBhZGRDaGlsZHJlbihhcnJheSkgLSDQtNC+0LHQsNCy0LvQtdC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC+0YfQtdGA0L3QuNGFINC+0LHRitC10LrRgtC+0LJcclxuICovXHJcbmNsYXNzIEdhbWVPYmplY3Qge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgR2FtZU9iamVjdC5vYmplY3RzLnB1c2godGhpcyk7XHJcbiAgICAgICAgR2FtZU9iamVjdC5ub3RJbml0aWFsaXplZC51bnNoaWZ0KHRoaXMpO1xyXG4gICAgICAgIEdhbWVPYmplY3QubnVtKys7XHJcblxyXG4gICAgICAgIHRoaXMuX19pc0luaXQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9faXNFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5fX2NoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5fX2ZhdGhlciA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX196SW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuX19jaGFuZ2VaSW5kZXgodGhpcy5fX3pJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0LfRi9Cy0LDQtdGCINGE0YPQvdC60YbQuNGOIGluaXRpYWxpemF0aW9uKClcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9faW5pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluaXRcIik7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXphdGlvbigpO1xyXG4gICAgICAgIHRoaXMuX19pc0luaXQgPSB0cnVlO1xyXG4gICAgICAgIEdhbWVPYmplY3Qubm90SW5pdGlhbGl6ZWQuc3BsaWNlKFxyXG4gICAgICAgICAgICBHYW1lT2JqZWN0Lm5vdEluaXRpYWxpemVkLmluZGV4T2YodGhpcyksXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INCw0LrRgtC40LLQsNGG0LjQuCDQvtCx0YrQtdC60YLQsCDQuCDQtdCz0L4g0LTQtdGC0LXQuVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX19lbmFibGUoKSB7XHJcbiAgICAgICAgdGhpcy5vbkVuYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuX19pc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX19jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xyXG4gICAgICAgICAgICBjaGlsZC5lbmFibGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQtNC10LDQutGC0LjQstCw0YbQuNC4INC+0LHRitC10LrRgtCwINC4INC10LPQviDQtNC10YLQtdC5XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfX2Rpc2FibGUoKSB7XHJcbiAgICAgICAgdGhpcy5vbkRpc2FibGUoKTtcclxuICAgICAgICB0aGlzLl9faXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fX2NoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XHJcbiAgICAgICAgICAgIGNoaWxkLmRpc2FibGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQvtCx0L3QvtCy0LvQtdC90LjRjyDQu9C+0LPQuNC60Lgg0L7QsdGK0LXQutGC0LBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0geyp9IGRlbHRhVGltZSDQstGA0LXQvNC10L3QvdCw0Y8g0LTQtdC70YzRgtCwXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBfX3VwZGF0ZShkZWx0YVRpbWUpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZShkZWx0YVRpbWUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC+0YLRgNC40YHQvtCy0LrQuCDQvtCx0YrQtdC60YLQsCDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQv9C+0YHQu9C1IHVwZGF0ZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7Kn0gY3R4INC60L7QvdGC0LXQutGB0YIg0L7RgtGA0LjRgdC+0LLQutC4XHJcbiAgICAgKi9cclxuICAgIF9fZHJhdyhjdHgpIHtcclxuICAgICAgICB0aGlzLmRyYXcoY3R4KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC80LXQvdGP0YLRjCB6SW5kZXhcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0geyp9IHogekluZGV4XHJcbiAgICAgKi9cclxuICAgIF9fY2hhbmdlWkluZGV4KHopIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQlNC+0LHQsNCy0LjRgtGMINCyINGB0L/QuNGB0L7QulxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChHYW1lT2JqZWN0LnpJbmRleERpY3RbXCJcIiArIHpdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgR2FtZU9iamVjdC56SW5kZXhEaWN0W1wiXCIgKyB6XSA9IFt0aGlzXTtcclxuICAgICAgICB9IGVsc2UgaWYgKEdhbWVPYmplY3QuekluZGV4RGljdFtcIlwiICsgel0uaW5kZXhPZih0aGlzKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgR2FtZU9iamVjdC56SW5kZXhEaWN0W1wiXCIgKyB6XS5wdXNoKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0KPQtNCw0LvRj9C10Lwg0L7QsdGK0LXQutGCINC40Lcg0YHRgtCw0YDQvtCz0L4gekluZGV4RGljdFxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5fX3pJbmRleCAhPSB6ICYmXHJcbiAgICAgICAgICAgIEdhbWVPYmplY3QuekluZGV4RGljdFtcIlwiICsgdGhpcy5fX3pJbmRleF0uaW5kZXhPZih0aGlzKSAhPT0gLTFcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgR2FtZU9iamVjdC56SW5kZXhEaWN0W1wiXCIgKyB0aGlzLl9fekluZGV4XS5zcGxpY2UoXHJcbiAgICAgICAgICAgICAgICBHYW1lT2JqZWN0LnpJbmRleERpY3RbXCJcIiArIHRoaXMuX196SW5kZXhdLmluZGV4T2YodGhpcyksXHJcbiAgICAgICAgICAgICAgICAxXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX196SW5kZXggPSB6O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRpYWxpemF0aW9uKCkge31cclxuICAgIG9uRW5hYmxlKCkge31cclxuICAgIG9uRGlzYWJsZSgpIHt9XHJcbiAgICB1cGRhdGUoZGVsdGFUaW1lKSB7fVxyXG4gICAgZHJhdyhjdHgpIHt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC10YDQvdGD0YLRjCB6SW5kZXhcclxuICAgICAqL1xyXG4gICAgZ2V0IHpJbmRleCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fX3pJbmRleDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0KPRgdGC0LDQvdC+0LLQuNGC0YwgekluZGV4XHJcbiAgICAgKi9cclxuICAgIHNldCB6SW5kZXgoeikge1xyXG4gICAgICAgIHRoaXMuX19jaGFuZ2VaSW5kZXgoeik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC+0LHQsNCy0LjRgtGMINGA0LXQsdC10L3QutCwINCyINC60L7QvdGC0LXQudC90LXRgFxyXG4gICAgICogQHBhcmFtIHsqfSBjaGlsZCDRgNC10LHQtdC90L7QulxyXG4gICAgICovXHJcbiAgICBhZGRDaGlsZChjaGlsZCkge1xyXG4gICAgICAgIGNoaWxkLl9fZmF0aGVyID0gdGhpcztcclxuICAgICAgICB0aGlzLl9fY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC00L7QsdCw0LLQu9C10L3QuNGPINC00LXRgtC10Lkg0LIg0YHQv9C40YHQvtC6INC+0LHRitC10LrRgtC+0LJcclxuICAgICAqIEBwYXJhbSB7Kn0gX19jaGlsZHJlbiDRgdC/0LjRgdC+0Log0LTQtdGC0LXQuVxyXG4gICAgICogQG1lbWJlcm9mIEdhbWVPYmplY3RcclxuICAgICAqL1xyXG4gICAgYWRkQ2hpbGRyZW4oX19jaGlsZHJlbikge1xyXG4gICAgICAgIF9fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcclxuICAgICAgICAgICAgY2hpbGQuX19mYXRoZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLl9fY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjbG9uZSgpIHtcclxuICAgICAgICBsZXQgY2xvbmUgPSBPYmplY3QuYXNzaWduKHRoaXMsIHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjbG9uZSA9PT0gdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCkge1xyXG4gICAgICAgIEdhbWVPYmplY3QuZGVsZXRlTGlzdC5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgX19kZWxldGUoKSB7XHJcbiAgICAgICAgR2FtZU9iamVjdC5kZWxldGVMaXN0LnNwbGljZShHYW1lT2JqZWN0LmRlbGV0ZUxpc3QuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX19mYXRoZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9fZmF0aGVyLl9fY2hpbGRyZW4uc3BsaWNlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fX2ZhdGhlci5fX2NoaWxkcmVuLmluZGV4T2YodGhpcyksXHJcbiAgICAgICAgICAgICAgICAxXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEdhbWVPYmplY3Qub2JqZWN0cy5zcGxpY2UoR2FtZU9iamVjdC5vYmplY3RzLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIEdhbWVPYmplY3QuekluZGV4RGljdFtcIlwiICsgdGhpcy5fX3pJbmRleF0uc3BsaWNlKFxyXG4gICAgICAgICAgICBHYW1lT2JqZWN0LnpJbmRleERpY3RbXCJcIiArIHRoaXMuX196SW5kZXhdLmluZGV4T2YodGhpcyksXHJcbiAgICAgICAgICAgIDFcclxuICAgICAgICApO1xyXG4gICAgICAgIEdhbWVPYmplY3QubnVtLS07XHJcbiAgICB9XHJcbn1cclxuXHJcbkdhbWVPYmplY3Qub2JqZWN0cyA9IFtdO1xyXG5HYW1lT2JqZWN0LnpJbmRleERpY3QgPSB7fTtcclxuR2FtZU9iamVjdC5udW0gPSAwO1xyXG5HYW1lT2JqZWN0Lm5vdEluaXRpYWxpemVkID0gW107XHJcbkdhbWVPYmplY3QuZGVsZXRlTGlzdCA9IFtdO1xyXG5HYW1lT2JqZWN0LmRlZXBDbG9uZSA9IChvYmopID0+IHtcclxuICAgIGNvbnN0IGNsT2JqID0ge307XHJcbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKG9ialtpXSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICBjbE9ialtpXSA9IEdhbWVPYmplY3QuZGVlcENsb25lKG9ialtpXSk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbE9ialtpXSA9IG9ialtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjbE9iajtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZU9iamVjdDtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlhKRi9GVlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL1N5c3RlbVxcXFxHYW1lT2JqZWN0LmpzXCIsXCIvU3lzdGVtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuLi9HYW1lT2JqZWN0XCIpO1xyXG5jb25zdCBNb3VzZUhhbmRsZXIgPSByZXF1aXJlKFwiLi4vSW5wdXRIYW5kbGVycy9Nb3VzZUhhbmRsZXJcIik7XHJcbmNsYXNzIENlbGwgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiQ2VsbFwiO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiIzAwMFwiO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuNTtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IDE7XHJcbiAgICAgICAgdGhpcy5pc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IHRoaXMub3BhY2l0eTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEcmF3aW5nKSB7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gXCIyMHB4IEFyaWFsXCI7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnggKyBcIiBcIiArIHRoaXMueSwgdGhpcy54LCB0aGlzLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogdGhpcy54LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7Qu9C70LjQt9C40Y8g0L7QsdGK0LXQutGC0LAg0YEg0YLQvtGH0LrQvtC5XHJcbiAgICAgKiBAcGFyYW0ge3t4LHl9fSBwb3NpdGlvbiDRgtC+0YfQutCwINGBINC60L7QvtGA0LTQuNC90LDRgtCw0LzQuCB4INC4IHlcclxuICAgICAqIEBwYXJhbSB7Q2VsbH0gY2VsbCDQvtCx0YrQtdC60YIgY2VsbCDRgSB4LCB5LCB3aWR0aCwgaGVpZ2h0XHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29sbGlzaW9uKHBvc2l0aW9uLCBjZWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgcG9zaXRpb24ueCA+PSBjZWxsLnggJiZcclxuICAgICAgICAgICAgcG9zaXRpb24ueCA8PSBjZWxsLnggKyBjZWxsLndpZHRoICYmXHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgPj0gY2VsbC55ICYmXHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgPD0gY2VsbC55ICsgY2VsbC5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGw7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9TeXN0ZW1cXFxcR3JpZFxcXFxDZWxsLmpzXCIsXCIvU3lzdGVtXFxcXEdyaWRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5jb25zdCBHYW1lT2JqZWN0ID0gcmVxdWlyZShcIi4uL0dhbWVPYmplY3RcIik7XHJcbmNvbnN0IE1vdXNlSGFuZGxlciA9IHJlcXVpcmUoXCIuLi9JbnB1dEhhbmRsZXJzL01vdXNlSGFuZGxlclwiKTtcclxuY29uc3QgQ2VsbCA9IHJlcXVpcmUoXCIuL0NlbGxcIik7XHJcblxyXG5jbGFzcyBHcmlkIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICB4LFxyXG4gICAgICAgIHksXHJcbiAgICAgICAgb2Zmc2V0WCxcclxuICAgICAgICBvZmZzZXRZLFxyXG4gICAgICAgIHdDb3VudCxcclxuICAgICAgICBoQ291bnQsXHJcbiAgICAgICAgY2VsbFdpZHRoLFxyXG4gICAgICAgIGNlbGxIZWlnaHQsXHJcbiAgICAgICAgaXNEcmF3aW5nID0gZmFsc2VcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gXCJHcmlkXCI7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMub2Zmc2V0WCA9IG9mZnNldFg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXRZID0gb2Zmc2V0WTtcclxuICAgICAgICB0aGlzLndDb3VudCA9IHdDb3VudDtcclxuICAgICAgICB0aGlzLmhDb3VudCA9IGhDb3VudDtcclxuICAgICAgICB0aGlzLmNlbGxXaWR0aCA9IGNlbGxXaWR0aDtcclxuICAgICAgICB0aGlzLmNlbGxIZWlnaHQgPSBjZWxsSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcIiMwMDBcIjtcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gMTtcclxuICAgICAgICB0aGlzLmNlbGxzID0gW107XHJcbiAgICAgICAgdGhpcy5pc0RyYXdpbmcgPSBpc0RyYXdpbmc7XHJcbiAgICB9XHJcbiAgICBpbml0aWFsaXphdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdyaWQgaW5pdGlhbGl6YXRpb25cIik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5oQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IG5ldyBDZWxsKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueCArIGkgKiAodGhpcy5jZWxsV2lkdGggKyB0aGlzLm9mZnNldFgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueSArIGogKiAodGhpcy5jZWxsSGVpZ2h0ICsgdGhpcy5vZmZzZXRZKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbGxXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbGxIZWlnaHRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmlzRHJhd2luZyA9IHRoaXMuaXNEcmF3aW5nO1xyXG4gICAgICAgICAgICAgICAgQ2VsbC56SW5kZXggPSA1O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZWxscy5wdXNoKGNlbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jZWxscyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCS0LXRgNC90LXRgiDQv9C+0LfQuNGG0LjRjiDQvdCwINGN0LrRgNCw0L3QtVxyXG4gICAgICogQHBhcmFtIHsqfSBwb3NpdGlvbiDQv9C+0LfQuNGG0LjRjyDQvdCwINGN0LrRgNCw0L3QtVxyXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19INCy0LXRgNC90LXRgiDQv9C+0LfQuNGG0LjRjiDQsiDQs9GA0LjQtNC1XHJcbiAgICAgKi9cclxuICAgIGdldEdyaWRQb3NpdGlvbihwb3MpIHtcclxuICAgICAgICBsZXQgc2l6ZSA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy5jZWxsV2lkdGggKyB0aGlzLm9mZnNldFgsXHJcbiAgICAgICAgICAgIHk6IHRoaXMuY2VsbEhlaWdodCArIHRoaXMub2Zmc2V0WSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgeDogcG9zLnggLSB0aGlzLngsXHJcbiAgICAgICAgICAgIHk6IHBvcy55IC0gdGhpcy55LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IG8gPSB7XHJcbiAgICAgICAgICAgIHg6IChwb3NpdGlvbi54IC0gKHBvc2l0aW9uLnggJSBzaXplLngpKSAvIHNpemUueCxcclxuICAgICAgICAgICAgeTogKHBvc2l0aW9uLnkgLSAocG9zaXRpb24ueSAlIHNpemUueSkpIC8gc2l6ZS55LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBvO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC10YDQvdC10YIg0Y/Rh9C10LnQutGDINC/0L4g0LjQvdC00LXQutGB0YNcclxuICAgICAqIEBwYXJhbSB7Kn0gaW5kZXgg0LjQvdC00LXQutGBXHJcbiAgICAgKiBAcmV0dXJucyB7Q2VsbH0g0LLQtdGA0L3QtdGCINGP0YfQtdC50LrRg1xyXG4gICAgICovXHJcbiAgICBnZXRDZWxsQnlJbmRleChpbmRleCkge1xyXG4gICAgICAgIHJldHVybiBpbmRleCA8IHRoaXMuY2VsbHMubGVuZ3RoID8gdGhpcy5jZWxsc1tpbmRleF0gOiBudWxsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC10YDQvdC10YIg0Y/Rh9C10LnQutGDINC/0L4g0L/QvtC30LjRhtC40Lgg0LIg0LPRgNC40LTQtVxyXG4gICAgICogQHBhcmFtIHt7eDpudW1iZXIseTpudW1iZXJ9fSBncmlkUG9zaXRpb25cclxuICAgICAqIEByZXR1cm5zIHt7Q2VsbH19INCy0LXRgNC90LXRgiDRj9GH0LXQudC60YNcclxuICAgICAqL1xyXG4gICAgZ2V0Q2VsbEJ5R3JpZFBvc2l0aW9uKGdyaWRQb3NpdGlvbikge1xyXG4gICAgICAgIGxldCBuID0gZ3JpZFBvc2l0aW9uLnggKiB0aGlzLmhDb3VudCArIGdyaWRQb3NpdGlvbi55O1xyXG4gICAgICAgIHJldHVybiBncmlkUG9zaXRpb24ueCA+PSAwICYmXHJcbiAgICAgICAgICAgIGdyaWRQb3NpdGlvbi54IDwgdGhpcy53Q291bnQgJiZcclxuICAgICAgICAgICAgZ3JpZFBvc2l0aW9uLnkgPj0gMCAmJlxyXG4gICAgICAgICAgICBncmlkUG9zaXRpb24ueSA8IHRoaXMuaENvdW50XHJcbiAgICAgICAgICAgID8gdGhpcy5nZXRDZWxsQnlJbmRleChuKVxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC10YDQvdGD0YIg0Y/Rh9C10LnQutGDINC/0L4g0L/QvtC30LjRhtC40Lgg0L3QsCDRjdC60YDQsNC90LVcclxuICAgICAqIEBwYXJhbSB7e3g6bnVtYmVyLHk6bnVtYmVyfX0gcG9zaXRpb24g0L/QvtC30LjRhtC40Y8g0L3QsCDRjdC60YDQsNC90LVcclxuICAgICAqIEByZXR1cm5zIHt7Q2VsbH19INCy0LXRgNC90LXRgiDRj9GH0LXQudC60YNcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGdldENlbGxCeVBvc2l0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgbGV0IG8gPSB0aGlzLmdldEdyaWRQb3NpdGlvbihwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENlbGxCeUdyaWRQb3NpdGlvbihvKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHcmlkO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWEpGL0ZWXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvU3lzdGVtXFxcXEdyaWRcXFxcR3JpZC5qc1wiLFwiL1N5c3RlbVxcXFxHcmlkXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqINCc0LXQvdC10LTQttC10YAg0LDRgdGB0LXRgtC+0LJcclxuICovXHJcbmNsYXNzIEltYWdlTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnN1Y2Nlc3NDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5lcnJvckNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmNhY2hlID0ge307XHJcbiAgICAgICAgdGhpcy5kb3dubG9hZFF1ZXVlID0gW107XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCU0L7QsdCw0LLQu9GP0LXRgiDQuNC30L7QsdGA0LDQttC10L3QuNC1INCyINC+0YfQtdGA0LXQtNGMINC30LDQs9GA0YPQt9C60LhcclxuICAgICAqIEBwYXJhbSB7Kn0gcGF0aCDQv9GD0YLRjCDQuiDRhNCw0LnQu9GDXHJcbiAgICAgKi9cclxuICAgIHF1ZXVlRG93bmxvYWQobmFtZSwgcGF0aCkge1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRRdWV1ZS5wdXNoKHsgbmFtZTogbmFtZSwgcGF0aDogcGF0aCB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogINCf0YDQvtCy0LXRgNGP0LXRgiwg0LLRgdC1INC70Lgg0YTQsNC50LvRiyDQt9Cw0LPRgNGD0LbQtdC90YtcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlINC10YHQu9C4INCy0YHQtSDQuNC30L7QsdGA0LDQttC10L3QuNGPINC30LDQs9GA0YPQttC10L3Ri1xyXG4gICAgICovXHJcbiAgICBpc0RvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG93bmxvYWRRdWV1ZS5sZW5ndGggPT0gdGhpcy5zdWNjZXNzQ291bnQgKyB0aGlzLmVycm9yQ291bnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqICDQl9Cw0LPRgNGD0LbQsNC10YIg0LLRgdC1INC40LfQvtCx0YDQsNC20LXQvdC40Y8g0LjQtyDQvtGH0LXRgNC10LTQuFxyXG4gICAgICogQHBhcmFtIHsqfSBkb3dubG9hZENhbGxiYWNrINGE0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQstGL0LfRi9Cy0LDQtdGC0YHRjyDQv9C+0YHQu9C1INC30LDQs9GA0YPQt9C60Lgg0LrQsNC20LTQvtCz0L4g0LjQt9C+0LHRgNCw0LbQtdC90LjRj1xyXG4gICAgICovXHJcbiAgICBkb3dubG9hZEFsbChkb3dubG9hZENhbGxiYWNrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRvd25sb2FkUXVldWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGxldCBwYXRoID0gdGhpcy5kb3dubG9hZFF1ZXVlW2ldLnBhdGg7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGhpcy5kb3dubG9hZFF1ZXVlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibG9hZFwiLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuc3VjY2Vzc0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5pc0RvbmUoKSkgZG93bmxvYWRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5lcnJvckNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5pc0RvbmUoKSkgZG93bmxvYWRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaW1nLnNyYyA9IHBhdGg7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVbbmFtZV0gPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC30L7QsdGA0LDQttC10L3QuNC1INC/0L4g0L/Rg9GC0LhcclxuICAgICAqIEBwYXJhbSB7Kn0gbmFtZSDQv9GD0YLRjCDQuiDRhNCw0LnQu9GDXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBnZXRBc3NldChuYW1lKSB7XHJcbiAgICAgICAgLy8gaWYgbmFtZSBpcyBlcnJvciB0aGF0IHRocm93IGVycm9yXHJcbiAgICAgICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NldE1hbmFnZXIuZ2V0QXNzZXQ6IG5hbWU6JHtuYW1lfSBpcyB1bmRlZmluZWRgKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZVtuYW1lXSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0TWFuYWdlci5nZXRBc3NldDogbmFtZToke25hbWV9IGlzIG5vdCBmb3VuZGApO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVtuYW1lXTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZU1hbmFnZXI7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9TeXN0ZW1cXFxcSW1hZ2VNYW5hZ2VyLmpzXCIsXCIvU3lzdGVtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY2xhc3MgS2V5Ym9hcmRIYW5kbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gd2luZG93LmNhbnZhcztcclxuXHJcbiAgICAgICAgY2FudmFzLm9ua2V5ZG93biA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIEtleWJvYXJkSGFuZGxlci5vbmtleWRvd25DYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYW52YXMub25rZXl1cCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIEtleWJvYXJkSGFuZGxlci5vbmtleXVwQ2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2FudmFzLm9ua2V5cHJlc3MgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBLZXlib2FyZEhhbmRsZXIub25rZXlwcmVzc0NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAqIGtleWRvd24gLSDRgdGA0LDQsdCw0YLRi9Cy0LDQtdGCINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQutC70LDQstC40YjQuFxyXG4gKiAqIGtleXVwIC0g0YHRgNCw0LHQsNGC0YvQstCw0LXRgiDQv9GA0Lgg0L7RgtC/0YPRgdC60LDQvdC40Lgg0LrQu9Cw0LLQuNGI0LhcclxuICogKiBrZXlwcmVzcyAtINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0LzQtdC20LTRgyDQvdCw0LbQsNGC0LjQuCDQuCDQvtGC0L/Rg9GB0LrQsNC90LjQuCDQutC70LDQstC40YjQuFxyXG4gKi9cclxuS2V5Ym9hcmRIYW5kbGVyLm9ua2V5ZG93bkNhbGxiYWNrcyA9IFtdO1xyXG5LZXlib2FyZEhhbmRsZXIub25rZXl1cENhbGxiYWNrcyA9IFtdO1xyXG5LZXlib2FyZEhhbmRsZXIub25rZXlwcmVzc0NhbGxiYWNrcyA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZEhhbmRsZXI7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9TeXN0ZW1cXFxcSW5wdXRIYW5kbGVyc1xcXFxLZXlib2FyZEhhbmRsZXIuanNcIixcIi9TeXN0ZW1cXFxcSW5wdXRIYW5kbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmNsYXNzIE1vdXNlSGFuZGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHdpbmRvdy5jYW52YXM7XHJcblxyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIE1vdXNlSGFuZGxlci5vbm1vdXNlbW92ZUNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gKGUpID0+IHtcclxuICAgICAgICAgICAgTW91c2VIYW5kbGVyLm9ubW91c2Vkb3duQ2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjYW52YXMub25tb3VzZXVwID0gKGUpID0+IHtcclxuICAgICAgICAgICAgTW91c2VIYW5kbGVyLm9ubW91c2V1cENhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2FudmFzLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBNb3VzZUhhbmRsZXIub25jbGlja0NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2FudmFzLm9uZGJsY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBNb3VzZUhhbmRsZXIub25kYmxjbGlja0NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2VvdmVyID0gKGUpID0+IHtcclxuICAgICAgICAgICAgTW91c2VIYW5kbGVyLm9ubW91c2VvdmVyQ2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjYW52YXMub25tb3VzZW91dCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIE1vdXNlSGFuZGxlci5vbm1vdXNlb3V0Q2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2VNb3VzZVBvc2l0aW9uSW5DYW52YXMoZSkge1xyXG4gICAgICAgIGNvbnN0IGN2cyA9IHdpbmRvdy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogKGUuY2xpZW50WCAtIGN2cy5sZWZ0KSAqICh3aW5kb3cuY2FudmFzLndpZHRoIC8gY3ZzLndpZHRoKSxcclxuICAgICAgICAgICAgeTogKGUuY2xpZW50WSAtIGN2cy50b3ApICogKHdpbmRvdy5jYW52YXMuaGVpZ2h0IC8gY3ZzLmhlaWdodCksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWRkT25DbGlja0V2ZW50KGNhbGxiYWNrKSB7XHJcbiAgICAgICAgTW91c2VIYW5kbGVyLm9uY2xpY2tDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYWRkT25Nb3VzZU1vdmVFdmVudChjYWxsYmFjaykge1xyXG4gICAgICAgIE1vdXNlSGFuZGxlci5vbm1vdXNlbW92ZUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhZGRPbk1vdXNlRG93bkV2ZW50KGNhbGxiYWNrKSB7XHJcbiAgICAgICAgTW91c2VIYW5kbGVyLm9ubW91c2Vkb3duQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFkZE9uTW91c2VVcEV2ZW50KGNhbGxiYWNrKSB7XHJcbiAgICAgICAgTW91c2VIYW5kbGVyLm9ubW91c2V1cENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhZGRPbk1vdXNlT3ZlckV2ZW50KGNhbGxiYWNrKSB7XHJcbiAgICAgICAgTW91c2VIYW5kbGVyLm9ubW91c2VvdmVyQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFkZE9uTW91c2VPdXRFdmVudChjYWxsYmFjaykge1xyXG4gICAgICAgIE1vdXNlSGFuZGxlci5vbm1vdXNlb3V0Q2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFkZE9uRGJsQ2xpY2tFdmVudChjYWxsYmFjaykge1xyXG4gICAgICAgIE1vdXNlSGFuZGxlci5vbmRibGNsaWNrQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiAqIG9ubW91c2Vkb3duIC0g0LrQvtCz0LTQsCDQvdCw0LbQsNGC0LAg0LrQvdC+0L/QutCwINC80YvRiNC4INC4INC10YnQtSDQvdC1INC+0YLQv9GD0YnQtdC90LBcclxuICogKiBvbm1vdXNldXAgLSDQutC+0LPQtNCwINC+0YLQv9GD0YHQutCw0LXQvCDQutC90L7Qv9C60YMg0LzRi9GI0LhcclxuICogKiBvbmNsaWNrIC0g0LrQvtC80LHQuNC90LDRhtC40Y8gb25tb3VzZWRvd24g0Lggb25tb3VzZXVwXHJcbiAqICogb25kYmxjbGljayAtINC00LLQvtC50L3QvtC5INC60LjQulxyXG4gKiAqIG9ubW91c2Vtb3ZlINC60L7Qs9C00LAg0LTQstC40LPQsNC10Lwg0LzRi9GI0YxcclxuICogKiBvbm1vdXNlb3ZlciDQutC+0LPQtNCwINC80YvRiNGMINC90LDQstC+0LTQuNGC0YHRjyDQvdCwINGN0LvQtdC80LXQvdGCXHJcbiAqICogb25tb3VzZW91dCDQutC+0LPQtNCwINC80YvRiNGMINGD0YXQvtC00LjRgiDRgSDRjdC70LXQvNC10L3RgtCwXHJcbiAqL1xyXG5Nb3VzZUhhbmRsZXIub25tb3VzZWRvd25DYWxsYmFja3MgPSBbXTtcclxuTW91c2VIYW5kbGVyLm9ubW91c2V1cENhbGxiYWNrcyA9IFtdO1xyXG5Nb3VzZUhhbmRsZXIub25jbGlja0NhbGxiYWNrcyA9IFtdO1xyXG5Nb3VzZUhhbmRsZXIub25kYmxjbGlja0NhbGxiYWNrcyA9IFtdO1xyXG5Nb3VzZUhhbmRsZXIub25tb3VzZW1vdmVDYWxsYmFja3MgPSBbXTtcclxuTW91c2VIYW5kbGVyLm9ubW91c2VvdmVyQ2FsbGJhY2tzID0gW107XHJcbk1vdXNlSGFuZGxlci5vbm1vdXNlb3V0Q2FsbGJhY2tzID0gW107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vdXNlSGFuZGxlcjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlhKRi9GVlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL1N5c3RlbVxcXFxJbnB1dEhhbmRsZXJzXFxcXE1vdXNlSGFuZGxlci5qc1wiLFwiL1N5c3RlbVxcXFxJbnB1dEhhbmRsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgU2NlbmUgPSByZXF1aXJlKFwiLi9TY2VuZVwiKTtcclxuY29uc3QgR3JpZCA9IHJlcXVpcmUoXCIuL0dyaWQvR3JpZFwiKTtcclxuY29uc3QgQ2VsbCA9IHJlcXVpcmUoXCIuL0dyaWQvQ2VsbFwiKTtcclxuY29uc3QgVG93ZXIgPSByZXF1aXJlKFwiLi9Ub3dlclwiKTtcclxuY29uc3QgVG93ZXJCID0gcmVxdWlyZShcIi4vdG93ZXJCXCIpO1xyXG5jb25zdCBNb3VzZUhhbmRsZXIgPSByZXF1aXJlKFwiLi9JbnB1dEhhbmRsZXJzL01vdXNlSGFuZGxlclwiKTtcclxuY29uc3QgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcbmNvbnN0IEVuZW15ID0gcmVxdWlyZShcIi4vRW5lbXlcIik7XHJcbmNvbnN0IFByb2plY3RpbGUgPSByZXF1aXJlKFwiLi9Qcm9qZWN0aWxlXCIpO1xyXG5cclxuY2xhc3MgTWVudVNjZW5lIGV4dGVuZHMgU2NlbmUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgIHRoaXMueSA9IDY0ICogMjtcclxuICAgICAgICAvLyBncmlkc1xyXG4gICAgICAgIHRoaXMuZ3JpZCA9IG5ldyBHcmlkKHRoaXMueCwgdGhpcy55LCAwLCAxNiwgMTUsIDYsIDY0LCA2NCwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZ3JpZE1lbnUgPSBuZXcgR3JpZCgzMiwgMzIsIDIwLCAwLCAyLCAxLCA2NCwgNjQpO1xyXG4gICAgICAgIC8vdG93ZXJzXHJcbiAgICAgICAgdGhpcy5tZW51VG93ZXJzID0gW25ldyBUb3dlcigwLCAwLCA2NCwgNjQpLCBuZXcgVG93ZXJCKDAsIDAsIDY0LCA2NCldO1xyXG4gICAgICAgIHRoaXMudG93ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5naG9zdFRvd2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5lbmVtaWVzID0gW107XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0aWxlcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnRvd2VyID0gLTE7XHJcbiAgICAgICAgdGhpcy5wcmVzc1Rvd2VyTWVudSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub2xkU2VsZWN0ZWRDZWxsID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkQ2VsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xyXG4gICAgICAgIHRoaXMudGltZXJTaG90ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXphdGlvbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vICog0JIg0LzQtdC90Y4g0LTQvtCx0LDQstC40YLRjCDQsdCw0YjQvdC4XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1lbnVUb3dlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGNlbGwgPSB0aGlzLmdyaWRNZW51LmNlbGxzW2ldO1xyXG4gICAgICAgICAgICB0aGlzLm1lbnVUb3dlcnNbaV0ueCA9IGNlbGwueDtcclxuICAgICAgICAgICAgdGhpcy5tZW51VG93ZXJzW2ldLnkgPSBjZWxsLnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBNb3VzZUhhbmRsZXIuYWRkT25DbGlja0V2ZW50KChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vICog0J/QvtC30LjRhtC40Y8g0LzRi9GI0Lgg0L3QsCDQutCw0L3QstCw0YHQtVxyXG4gICAgICAgICAgICBjb25zdCBtcG9zID0gTW91c2VIYW5kbGVyLmdlTW91c2VQb3NpdGlvbkluQ2FudmFzKGUpO1xyXG4gICAgICAgICAgICAvLyAqINCg0LDQsdC+0YLQsCDRgSDQs9C70LDQstC90L7QuSDRgdC10YLQutC+0LlcclxuICAgICAgICAgICAgdGhpcy5ncmlkLmNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChDZWxsLmNvbGxpc2lvbihtcG9zLCBjZWxsKSAmJiB0aGlzLnRvd2VyICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICog0JXRgdC70Lgg0LzRi9GI0LrQsCDQvdCw0LbQsNGC0LAg0L3QsCDQutC70LXRgtC60YMg0Lgg0LLRi9Cx0YDQsNC90L3QsCDQsdCw0YjQvdGPINGC0L4g0LHQsNGJ0L3RjiDQvdGD0LbQvdC+INC/0L7RgdGC0LDQstC40YLRjCDQsiDQutC70LXRgtC60YNcclxuICAgICAgICAgICAgICAgICAgICBsZXQgeyB4LCB5IH0gPSBjZWxsLmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gKiDQkdC10YDQtdC8INCx0LDRiNC90Y4g0LjQtyDQv9GA0LjQt9GA0LDQutCwINC4INGB0YLQsNCy0LjQvCDQtdC1INCyINC60LvQtdGC0LrRg1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudG93ZXJzLmZpbmRJbmRleChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3dlcikgPT4gdG93ZXIueCA9PT0geCAmJiB0b3dlci55ID09PSB5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgPT09IC0xXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0b3dlciA9IHRoYXQuZ2hvc3RUb3dlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG93ZXIueCA9IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvd2VyLnkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRvd2VyID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudG93ZXJzLnB1c2godG93ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFkZENoaWxkKHRvd2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoYXQudG93ZXJzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAqINCg0LDQsdC+0YLQsCDRgSDRgdC10YLQutC+0Lkg0LzQtdC90Y5cclxuICAgICAgICAgICAgdGhpcy5ncmlkTWVudS5jZWxscy5mb3JFYWNoKChjZWxsLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKENlbGwuY29sbGlzaW9uKG1wb3MsIGNlbGwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHsgeCwgeSB9ID0gY2VsbC5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudG93ZXIgPSBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXNzVG93ZXJNZW51ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE1vdXNlSGFuZGxlci5hZGRPbk1vdXNlTW92ZUV2ZW50KChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0VG93ZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1wb3MgPSBNb3VzZUhhbmRsZXIuZ2VNb3VzZVBvc2l0aW9uSW5DYW52YXMoZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdob3N0VG93ZXIueCA9IG1wb3MueCAtIHRoaXMuZ2hvc3RUb3dlci53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdob3N0VG93ZXIueSA9IG1wb3MueSAtIHRoaXMuZ2hvc3RUb3dlci5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICAgICAgLy9sZXQgZ1BvcyA9IHRoaXMuZ3JpZC5nZXRHcmlkUG9zaXRpb24obXBvcyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHRoaXMuZ3JpZC5nZXRDZWxsQnlQb3NpdGlvbihtcG9zKTtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5pc0RyYXdpbmcgPSAhY2VsbC5pc0RyYXdpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGFUaW1lKSB7XHJcbiAgICAgICAgdGhpcy50aW1lciArPSBkZWx0YVRpbWU7XHJcbiAgICAgICAgdGhpcy50aW1lclNob3QgKz0gZGVsdGFUaW1lO1xyXG4gICAgICAgIC8vICog0JvQvtCz0LjQutCwINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEg0L/RgNC40LfRgNCw0LrQvtC8INCx0LDRiNC90LhcclxuICAgICAgICBpZiAodGhpcy50b3dlciAhPT0gLTEgJiYgdGhpcy5naG9zdFRvd2VyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vICog0JXRgdC70Lgg0LLRi9Cx0YDQsNC90L3QsCDQstGL0YjQutCwINC4INC90LXRgtGDINC/0YDQuNC30YDQsNC60LAg0YLQviDRgdC+0LfQtNCw0YLRjCDQv9GA0LjQt9GA0LDQutCwINC4INC00L7QsdCw0LLQuNGC0Ywg0LXQs9C+INCyINGB0YbQtdC90YNcclxuICAgICAgICAgICAgdGhpcy5naG9zdFRvd2VyID0gdGhpcy5tZW51VG93ZXJzW3RoaXMudG93ZXJdLmdldFRvd2VyKCk7XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NUb3dlck1lbnUgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudG93ZXIgIT09IC0xICYmIHRoaXMucHJlc3NUb3dlck1lbnUpIHtcclxuICAgICAgICAgICAgLy8gKiDQldGB0LvQuCDQstGL0YjQutCwINCy0YvQsdGA0LDQvdC90LAg0Lgg0LrQvdC+0L/QutCwINC90LDQttCw0YLQsCDQvdCwINC80LXQvdGOINGC0L4g0L3Rg9C20L3QviDQv9C+0LzQtdC90Y/RgtGMINC/0YDQuNC30YDQutCwXHJcbiAgICAgICAgICAgIC8vICog0KHRgtCw0YDRi9C5INC/0YDQuNC30YDQsNC6INGD0LTQsNC70Y/QtdC8INC4INGB0L7Qt9C00LDQtdC8INC90L7QstGL0LlcclxuICAgICAgICAgICAgdGhpcy5naG9zdFRvd2VyLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdob3N0VG93ZXIgPSB0aGlzLm1lbnVUb3dlcnNbdGhpcy50b3dlcl0uZ2V0VG93ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc1Rvd2VyTWVudSA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy50b3dlciA9PT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gKiDQldGB0LvQuCDQstGL0YjQutCwINC90LUg0LLRi9Cx0YDQsNC90L3QsCDRgtC+INC/0YDQuNC30YDQsNC6INGD0LTQsNC70Y/QtdC8XHJcbiAgICAgICAgICAgIHRoaXMuZ2hvc3RUb3dlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aW1lciA+IDIwMDApIHtcclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy54ICsgNzYgKiByKTtcclxuICAgICAgICAgICAgdGhpcy5lbmVtaWVzLnB1c2goXHJcbiAgICAgICAgICAgICAgICBuZXcgRW5lbXkoNjQgKiAxNiwgdGhpcy55ICsgKDY0ICsgMTYpICogciwgNjQsIDY0LCAtMC41KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbmVtaWVzLmZvckVhY2goKGVuZW15KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB7IHgsIHkgfSA9IHRoaXMuZ3JpZC5nZXRHcmlkUG9zaXRpb24oZW5lbXkpO1xyXG4gICAgICAgICAgICB4ID0gdGhpcy54ICsgeCAqIDY0O1xyXG4gICAgICAgICAgICB5ID0gdGhpcy55ICsgeSAqICg2NCArIDE2KTtcclxuICAgICAgICAgICAgbGV0IHRvd2VyID0gdGhpcy50b3dlcnMuZmluZChcclxuICAgICAgICAgICAgICAgICh0b3dlcikgPT4gdG93ZXIueCA9PT0geCAmJiB0b3dlci55ID09PSB5XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmICghdG93ZXIpIHtcclxuICAgICAgICAgICAgICAgIGVuZW15LnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVyU2hvdCA+IDEwMDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMudGltZXJTaG90KTtcclxuICAgICAgICAgICAgICAgIGxldCB0b3dlcnMgPSB0aGlzLnRvd2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgKHRvd2VyKSA9PiB0b3dlci55ID09PSB5ICYmIHRvd2VyLnggPD0geFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b3dlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvd2Vycy5mb3JFYWNoKCh0b3dlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RpbGVzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUHJvamVjdGlsZSh0b3dlci54LCB0b3dlci55LCAzMiwgMzIsIDAuNSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5wcm9qZWN0aWxlcy5sZW5ndGggPiBpICYmIHRoaXMucHJvamVjdGlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGlsZXNbaV0ueSA9PT0gZW5lbXkueSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGlsZXNbaV0ueCA+PSBlbmVteS54XHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteS5oZWFsdGggLT0gdGhpcy5wcm9qZWN0aWxlc1tpXS5kYW1hZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGlsZXNbaV0uZGVsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0aWxlcy5zcGxpY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGlsZXMuaW5kZXhPZih0aGlzLnByb2plY3RpbGVzW2ldKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic1wiLCB0b3dlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmVuZW1pZXMubGVuZ3RoID4gaSAmJiB0aGlzLmVuZW1pZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbmVtaWVzW2ldLmhlYWx0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuc3BsaWNlKHRoaXMuZW5lbWllcy5pbmRleE9mKHRoaXMuZW5lbWllc1tpXSksIDEpO1xyXG4gICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudGltZXJTaG90ID4gMTAwMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVyU2hvdCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvamVjdGlsZXMpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdGlsZXMuZm9yRWFjaCgocHJvamVjdGlsZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocHJvamVjdGlsZSkgcHJvamVjdGlsZS5ydW4oKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51U2NlbmU7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9TeXN0ZW1cXFxcTWVudVNjZW5lLmpzXCIsXCIvU3lzdGVtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcclxuXHJcbmNsYXNzIFByb2plY3RpbGUgZXh0ZW5kcyBCbG9jayB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzcGVlZCkge1xyXG4gICAgICAgIHN1cGVyKHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiUHJvamVjdGlsZVwiO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBcIiM2MGJmMzBcIjtcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gMTU7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xyXG4gICAgICAgIHRoaXMubWFrZXJEZWxldGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRhbWFnZSA9IDI1O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1ha2VyRGVsZXRlKSB0aGlzLmRlbGV0ZSgpO1xyXG4gICAgfVxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnNwZWVkO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlUHJvamVjdGlsZSh4LCB5KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9qZWN0aWxlKHgsIHksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIGdldFByb2plY3RpbGUoeCA9IHRoaXMueCwgeSA9IHRoaXMueSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVByb2plY3RpbGUoeCwgeSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdGlsZTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlhKRi9GVlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL1N5c3RlbVxcXFxQcm9qZWN0aWxlLmpzXCIsXCIvU3lzdGVtXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuY29uc3QgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcblxyXG5jbGFzcyBTY2VuZSBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG4gICAgLy9zdGF0aWMgc2NlbmVzID0gW107XHJcbiAgICAvKipcclxuICAgICAqINCa0LvQsNGB0YEg0YHRhtC10L3Ri1xyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIC0g0LjQvNGPINGB0YbQtdC90YtcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNjZW5lIGNvbnN0cnVjdG9yXCIpO1xyXG4gICAgfVxyXG4gICAgaW5pdGlhbGl6YXRpb24oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2VuZSBpbml0aWFsaXphdGlvblwiKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlhKRi9GVlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL1N5c3RlbVxcXFxTY2VuZS5qc1wiLFwiL1N5c3RlbVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmNvbnN0IEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xyXG5jb25zdCBNb3VzZUhhbmRsZXIgPSByZXF1aXJlKFwiLi9JbnB1dEhhbmRsZXJzL01vdXNlSGFuZGxlclwiKTtcclxuY29uc3QgQ2VsbCA9IHJlcXVpcmUoXCIuL0dyaWQvQ2VsbFwiKTtcclxuY29uc3QgR3JpZCA9IHJlcXVpcmUoXCIuL0dyaWQvR3JpZFwiKTtcclxuY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcclxuXHJcbmNsYXNzIFRvd2VyIGV4dGVuZHMgQmxvY2sge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHN1cGVyKHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiVG93ZXJcIjtcclxuICAgICAgICB0aGlzLmNvbG9yID0gXCIjMmYwXCI7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMTtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IDE7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IDEwMDA7XHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSAxMDA7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoZGVsdGFUaW1lKSB7XHJcbiAgICAgICAgdGhpcy50aW1lciArPSBkZWx0YVRpbWU7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjcmVhdGVUb3dlcih4LCB5KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUb3dlcih4LCB5LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBnZXRUb3dlcih4ID0gdGhpcy54LCB5ID0gdGhpcy55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVG93ZXIoeCwgeSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG93ZXI7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJYSkYvRlZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9TeXN0ZW1cXFxcVG93ZXIuanNcIixcIi9TeXN0ZW1cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5jb25zdCBUb3dlciA9IHJlcXVpcmUoXCIuL1Rvd2VyXCIpO1xyXG5cclxuY2xhc3MgVG93ZXJCIGV4dGVuZHMgVG93ZXIge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHN1cGVyKHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IFwiVG93ZXJCXCI7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IFwiIzAwQlwiO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRvd2VyKHgsIHkpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRvd2VyQih4LCB5LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG93ZXJCO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWEpGL0ZWXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvU3lzdGVtXFxcXHRvd2VyQi5qc1wiLFwiL1N5c3RlbVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmNvbnN0IEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9TeXN0ZW0vR2FtZU9iamVjdFwiKTtcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoXCIuL1N5c3RlbS9HYW1lXCIpO1xyXG5cclxuY29uc3QgSW1hZ2VNYW5hZ2VyID0gcmVxdWlyZShcIi4vU3lzdGVtL0ltYWdlTWFuYWdlclwiKTtcclxuY29uc3QgTW91c2VIYW5kbGVyID0gcmVxdWlyZShcIi4vU3lzdGVtL0lucHV0SGFuZGxlcnMvTW91c2VIYW5kbGVyXCIpO1xyXG5jb25zdCBLZXlib2FyZEhhbmRsZXIgPSByZXF1aXJlKFwiLi9TeXN0ZW0vSW5wdXRIYW5kbGVycy9LZXlib2FyZEhhbmRsZXJcIik7XHJcblxyXG4vKipcclxuICogKiDQpNGD0L3QutGG0LjRjyDQstGL0L/QvtC70L3QuNGC0YHRjyDQv9GA0Lgg0LfQsNCz0YDRg9C30LrQtSDRgdGC0YDQsNC90LjRhtGLXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2FkR2FtZSgpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FudmFzXCIpO1xyXG4gICAgd2luZG93LmNhbnZhcyA9IGNhbnZhcztcclxuXHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIGNhbnZhcy53aWR0aCA9IDEyOCAqIDg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gMTI4ICogNTtcclxuXHJcbiAgICBsZXQgaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0IGFzc2V0cyA9IFtcclxuICAgICAgICB7IG5hbWU6IFwiYnV0dG9uXCIsIHNyYzogXCIuL3NyYy9hc3NldHMvYnV0dG9uLnBuZ1wiIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInRvd2VyXzAxXCIsIHNyYzogXCIuL3NyYy9hc3NldHMvVG93ZXJzL3Rvd2VyX2JsdWUucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAxXzFcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMV9tazEucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAxXzJcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMV9tazIucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAxXzNcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMV9tazMucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAxXzRcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMV9tazQucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAyXzFcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMl9tazEucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAyXzJcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMl9tazIucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAyXzNcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMl9tazMucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidHVycmV0XzAyXzRcIiwgc3JjOiBcIi4vc3JjL2Fzc2V0cy9UdXJyZXRzL3R1cnJldF8wMl9tazQucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidGVycmFpblwiLCBzcmM6IFwiLi9zcmMvYXNzZXRzL1RlcnJhaW5zL3RlcnJhaW4ucG5nXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwidGFua18wMVwiLCBzcmM6IFwiLi9zcmMvYXNzZXRzL2JvZHlfdHJhY2tzLnBuZ1wiIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImhhbGZ0cmFja1wiLCBzcmM6IFwiLi9zcmMvYXNzZXRzL2JvZHlfaGFsZnRyYWNrLnBuZ1wiIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG4gICAgY29uc3QgbWggPSBuZXcgTW91c2VIYW5kbGVyKCk7XHJcbiAgICBjb25zdCBraCA9IG5ldyBLZXlib2FyZEhhbmRsZXIoKTtcclxuXHJcbiAgICBHYW1lT2JqZWN0LmdhbWUgPSBnYW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogKiDQoNCQ0JHQntCn0JDQryDQl9Ce0J3QkFxyXG4gICAgICovXHJcblxyXG4gICAgbGV0IGltZ01hbmFnZXIgPSBsb2FkSW1hZ2VzKGFzc2V0cywgKCkgPT4ge1xyXG4gICAgICAgIGdhbWUuaW5pdGlhbGl6YXRpb24oKTtcclxuICAgICAgICBpc0xvYWRlZCA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cud2luZG93VG9DYW52YXMgPSAoeCwgeSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGJib3ggPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCAtIGJib3gubGVmdCAqIChjYW52YXMud2lkdGggLyBiYm94LndpZHRoKSxcclxuICAgICAgICAgICAgeTogeSAtIGJib3gudG9wICogKGNhbnZhcy5oZWlnaHQgLyBiYm94LmhlaWdodCksXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxhc3RUaW1lID0gMDtcclxuICAgIGxldCBpbnRlcnZhbCA9IDA7XHJcbiAgICBmdW5jdGlvbiBhbmltYXRlKHRpbWVTdGFtcCkge1xyXG4gICAgICAgIGNvbnN0IGRlbHRhVGltZSA9IHRpbWVTdGFtcCAtIGxhc3RUaW1lO1xyXG4gICAgICAgIGxhc3RUaW1lID0gdGltZVN0YW1wO1xyXG4gICAgICAgIGludGVydmFsICs9IGRlbHRhVGltZTtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgaWYgKGlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwidGlja1wiKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY2FudmFzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGdhbWUudXBkYXRlKGRlbHRhVGltZSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgd2luZG93LkFuaW1hdGlvbi5kZWx0YVRpbWUgPSBkZWx0YVRpbWU7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmRyYXcoY3R4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYW5pbWF0ZSgwKTtcclxufVxyXG5cclxuLyoqXHJcbiAqICog0J/QvtC30LLQvtC70Y/QtdGCINC30LDQs9GA0YPQt9C40YLRjCDQstGB0LUg0LrQsNGA0YLQuNC90LrQuFxyXG4gKiBAcGFyYW0ge0FycmF5fSBhc3NldHMg0JzQsNGB0YHQuNCyINGBINC+0LHRitC10LrRgtCw0LzQuCDQutCw0YDRgtC40L3QvtC6XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrINCk0YPQvdC60YbQuNGPINC60L7RgtC+0YDQsNGPINCy0YvQv9C+0LvQvdC40YLRgdGPINC/0L7RgdC70LUg0LfQsNCz0YDRg9C30LrQuCDQstGB0LXRhSDQutCw0YDRgtC40L3QvtC6XHJcbiAqL1xyXG5mdW5jdGlvbiBsb2FkSW1hZ2VzKGFzc2V0cywgY2FsbGJhY2spIHtcclxuICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBpbWFnZXMuLi5cIik7XHJcbiAgICBjb25zdCBpbWdNYW5hZ2VyID0gbmV3IEltYWdlTWFuYWdlcigpO1xyXG4gICAgYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XHJcbiAgICAgICAgaW1nTWFuYWdlci5xdWV1ZURvd25sb2FkKGFzc2V0Lm5hbWUsIGFzc2V0LnNyYyk7XHJcbiAgICB9KTtcclxuICAgIC8vINCX0LDQs9GA0YPQttCw0LXQvCDRgNC10YHRg9GA0YHRiyDQv9C+INC+0LrQvtC90YfQsNC90LjRjiDQstGL0LfRi9Cy0LDQtdC8INGE0YPQvdC60YbQuNGOIGxvYWRcclxuICAgIGltZ01hbmFnZXIuZG93bmxvYWRBbGwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICBcIkltYWdlcyBsb2FkZWQhXCIsXHJcbiAgICAgICAgICAgIFwic3VjY2VzcyBjb3VudDpcIixcclxuICAgICAgICAgICAgaW1nTWFuYWdlci5zdWNjZXNzQ291bnQsXHJcbiAgICAgICAgICAgIFwiZXJyb3IgY291bnRcIixcclxuICAgICAgICAgICAgaW1nTWFuYWdlci5lcnJvckNvdW50XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkFzc2V0cyBjYWNoZVwiLCBpbWdNYW5hZ2VyLmNhY2hlKTtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGltZ01hbmFnZXI7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBsb2FkR2FtZSk7XHJcblxyXG4vKipcclxuICogKiDQn9Cw0LnQv9C70LDQudC9INC40LPRgNGLXHJcbiAqICogMS4g0JfQsNCz0YDRg9C30LrQsCDQutCw0YDRgtC40L3QvtC6XHJcbiAqL1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWEpGL0ZWXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV85MzUyZTYwLmpzXCIsXCIvXCIpIl19
