'use strict';

var webpack = require('webpack');
var fs = require('fs');
var baseWebpackConfig = require('@vue/cli-service/webpack.config');
require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var webpack__default = /*#__PURE__*/_interopDefaultLegacy(webpack);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var baseWebpackConfig__default = /*#__PURE__*/_interopDefaultLegacy(baseWebpackConfig);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/* jshint node: true */

var REGEXP_PARTS = /(\*|\?)/g;
/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  ## Alternative Implementations

  - <https://github.com/isaacs/node-glob>

    Great for full file-based wildcard matching.

  - <https://github.com/sindresorhus/matcher>

     A well cared for and loved JS wildcard matcher.
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = text.indexOf('*') >= 0;
  this.separator = separator;
  this.parts = text.split(separator).map(this.classifyPart.bind(this));
}

WildcardMatcher.prototype.match = function (input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);

      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*') {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] instanceof RegExp ? parts[ii].test(testParts[ii]) : parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      } // If matches, then return the component parts


      matches = matches && testParts;
    }
  } else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--;) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  } else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

WildcardMatcher.prototype.classifyPart = function (part) {
  // in the event that we have been provided a part that is not just a wildcard
  // then turn this into a regular expression for matching purposes
  if (part === '*') {
    return part;
  } else if (part.indexOf('*') >= 0 || part.indexOf('?') >= 0) {
    return new RegExp(part.replace(REGEXP_PARTS, '\.$1'));
  }

  return part;
};

var wildcard = function (text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);

  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

var mergeWith_1 = createCommonjsModule(function (module, exports) {

  var __read = commonjsGlobal && commonjsGlobal.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;

    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = {
        error: error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }

    return ar;
  };

  exports.__esModule = true;

  function mergeWith(objects, customizer) {
    var _a = __read(objects),
        first = _a[0],
        rest = _a.slice(1);

    var ret = first;
    rest.forEach(function (a) {
      ret = mergeTo(ret, a, customizer);
    });
    return ret;
  }

  function mergeTo(a, b, customizer) {
    var ret = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
      var v = customizer(a[k], b[k], k);
      ret[k] = typeof v === "undefined" ? a[k] : v;
    });
    return ret;
  }

  exports["default"] = mergeWith;
});

var toString = Object.prototype.toString;

var kindOf = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';
  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';

  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol':
      return 'symbol';

    case 'Promise':
      return 'promise';
    // Set, Map, WeakSet, WeakMap

    case 'WeakMap':
      return 'weakmap';

    case 'WeakSet':
      return 'weakset';

    case 'Map':
      return 'map';

    case 'Set':
      return 'set';
    // 8-bit typed arrays

    case 'Int8Array':
      return 'int8array';

    case 'Uint8Array':
      return 'uint8array';

    case 'Uint8ClampedArray':
      return 'uint8clampedarray';
    // 16-bit typed arrays

    case 'Int16Array':
      return 'int16array';

    case 'Uint16Array':
      return 'uint16array';
    // 32-bit typed arrays

    case 'Int32Array':
      return 'int32array';

    case 'Uint32Array':
      return 'uint32array';

    case 'Float32Array':
      return 'float32array';

    case 'Float64Array':
      return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  } // Non-plain objects


  type = toString.call(val);

  switch (type) {
    case '[object Object]':
      return 'object';
    // iterators

    case '[object Map Iterator]':
      return 'mapiterator';

    case '[object Set Iterator]':
      return 'setiterator';

    case '[object String Iterator]':
      return 'stringiterator';

    case '[object Array Iterator]':
      return 'arrayiterator';
  } // other


  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string' && typeof val.ignoreCase === 'boolean' && typeof val.multiline === 'boolean' && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function' && typeof val.return === 'function' && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }

  return false;
}
/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */


function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }

  return false;
}

/*!
 * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */

const valueOf = Symbol.prototype.valueOf;

function clone(val, deep) {
  switch (kindOf(val)) {
    case 'array':
      return val.slice();

    case 'object':
      return Object.assign({}, val);

    case 'date':
      return new val.constructor(Number(val));

    case 'map':
      return new Map(val);

    case 'set':
      return new Set(val);

    case 'buffer':
      return cloneBuffer(val);

    case 'symbol':
      return cloneSymbol(val);

    case 'arraybuffer':
      return cloneArrayBuffer(val);

    case 'float32array':
    case 'float64array':
    case 'int16array':
    case 'int32array':
    case 'int8array':
    case 'uint16array':
    case 'uint32array':
    case 'uint8clampedarray':
    case 'uint8array':
      return cloneTypedArray(val);

    case 'regexp':
      return cloneRegExp(val);

    case 'error':
      return Object.create(val);

    default:
      {
        return val;
      }
  }
}

function cloneRegExp(val) {
  const flags = val.flags !== void 0 ? val.flags : /\w+$/.exec(val) || void 0;
  const re = new val.constructor(val.source, flags);
  re.lastIndex = val.lastIndex;
  return re;
}

function cloneArrayBuffer(val) {
  const res = new val.constructor(val.byteLength);
  new Uint8Array(res).set(new Uint8Array(val));
  return res;
}

function cloneTypedArray(val, deep) {
  return new val.constructor(val.buffer, val.byteOffset, val.length);
}

function cloneBuffer(val) {
  const len = val.length;
  const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
  val.copy(buf);
  return buf;
}

function cloneSymbol(val) {
  return valueOf ? Object(valueOf.call(val)) : {};
}
/**
 * Expose `clone`
 */


var shallowClone = clone;

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isobject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor, prot;
  if (isObjectObject(o) === false) return false; // If has modified constructor

  ctor = o.constructor;
  if (typeof ctor !== 'function') return false; // If has modified prototype

  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false; // If constructor does not have an Object-specific method

  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  } // Most likely a plain Object


  return true;
};

/**
 * Module dependenices
 */


function cloneDeep(val, instanceClone) {
  switch (kindOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);

    case 'array':
      return cloneArrayDeep(val, instanceClone);

    default:
      {
        return shallowClone(val);
      }
  }
}

function cloneObjectDeep(val, instanceClone) {
  if (typeof instanceClone === 'function') {
    return instanceClone(val);
  }

  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();

    for (let key in val) {
      res[key] = cloneDeep(val[key], instanceClone);
    }

    return res;
  }

  return val;
}

function cloneArrayDeep(val, instanceClone) {
  const res = new val.constructor(val.length);

  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone);
  }

  return res;
}
/**
 * Expose `cloneDeep`
 */


var cloneDeep_1 = cloneDeep;

var utils = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;
  exports.isUndefined = exports.isPlainObject = exports.isFunction = exports.isRegex = void 0;

  function isRegex(o) {
    return o instanceof RegExp;
  }

  exports.isRegex = isRegex; // https://stackoverflow.com/a/7356528/228885

  function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
  }

  exports.isFunction = isFunction;

  function isPlainObject(a) {
    if (a === null || Array.isArray(a)) {
      return false;
    }

    return typeof a === "object";
  }

  exports.isPlainObject = isPlainObject;

  function isUndefined(a) {
    return typeof a === "undefined";
  }

  exports.isUndefined = isUndefined;
});

var joinArrays_1 = createCommonjsModule(function (module, exports) {

  var __read = commonjsGlobal && commonjsGlobal.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;

    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = {
        error: error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }

    return ar;
  };

  var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

    return to;
  };

  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };

  exports.__esModule = true;

  var clone_deep_1 = __importDefault(cloneDeep_1);

  var merge_with_1 = __importDefault(mergeWith_1);

  var isArray = Array.isArray;

  function joinArrays(_a) {
    var _b = _a === void 0 ? {} : _a,
        customizeArray = _b.customizeArray,
        customizeObject = _b.customizeObject,
        key = _b.key;

    return function _joinArrays(a, b, k) {
      var newKey = key ? key + "." + k : k;

      if (utils.isFunction(a) && utils.isFunction(b)) {
        return function () {
          var args = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }

          return _joinArrays(a.apply(void 0, __spreadArray([], __read(args))), b.apply(void 0, __spreadArray([], __read(args))), k);
        };
      }

      if (isArray(a) && isArray(b)) {
        var customResult = customizeArray && customizeArray(a, b, newKey);
        return customResult || __spreadArray(__spreadArray([], __read(a)), __read(b));
      }

      if (utils.isRegex(b)) {
        return b;
      }

      if (utils.isPlainObject(a) && utils.isPlainObject(b)) {
        var customResult = customizeObject && customizeObject(a, b, newKey);
        return customResult || merge_with_1["default"]([a, b], joinArrays({
          customizeArray: customizeArray,
          customizeObject: customizeObject,
          key: newKey
        }));
      }

      if (utils.isPlainObject(b)) {
        return clone_deep_1["default"](b);
      }

      if (isArray(b)) {
        return __spreadArray([], __read(b));
      }

      return b;
    };
  }

  exports["default"] = joinArrays;
});

var unique = createCommonjsModule(function (module, exports) {

  var __read = commonjsGlobal && commonjsGlobal.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;

    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = {
        error: error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }

    return ar;
  };

  var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

    return to;
  };

  exports.__esModule = true;

  function mergeUnique(key, uniques, getter) {
    var uniquesSet = new Set(uniques);
    return function (a, b, k) {
      return k === key && Array.from(__spreadArray(__spreadArray([], __read(a)), __read(b)).map(function (it) {
        return {
          key: getter(it),
          value: it
        };
      }).map(function (_a) {
        var key = _a.key,
            value = _a.value;
        return {
          key: uniquesSet.has(key) ? key : value,
          value: value
        };
      }).reduce(function (m, _a) {
        var key = _a.key,
            value = _a.value;
        m["delete"](key); // This is required to preserve backward compatible order of elements after a merge.

        return m.set(key, value);
      }, new Map()).values());
    };
  }

  exports["default"] = mergeUnique;
});

var types = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;
  exports.CustomizeRule = void 0;

  (function (CustomizeRule) {
    CustomizeRule["Match"] = "match";
    CustomizeRule["Merge"] = "merge";
    CustomizeRule["Append"] = "append";
    CustomizeRule["Prepend"] = "prepend";
    CustomizeRule["Replace"] = "replace";
  })(exports.CustomizeRule || (exports.CustomizeRule = {}));
});

var dist = createCommonjsModule(function (module, exports) {

  var __assign = commonjsGlobal && commonjsGlobal.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }

      return t;
    };

    return __assign.apply(this, arguments);
  };

  var __read = commonjsGlobal && commonjsGlobal.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;

    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = {
        error: error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }

    return ar;
  };

  var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

    return to;
  };

  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };

  exports.__esModule = true;
  exports.unique = exports.mergeWithRules = exports.mergeWithCustomize = exports["default"] = exports.merge = exports.CustomizeRule = exports.customizeObject = exports.customizeArray = void 0;

  var wildcard_1 = __importDefault(wildcard);

  var merge_with_1 = __importDefault(mergeWith_1);

  var join_arrays_1 = __importDefault(joinArrays_1);

  var unique_1 = __importDefault(unique);

  exports.unique = unique_1["default"];
  exports.CustomizeRule = types.CustomizeRule;

  function merge(firstConfiguration) {
    var configurations = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      configurations[_i - 1] = arguments[_i];
    }

    return mergeWithCustomize({}).apply(void 0, __spreadArray([firstConfiguration], __read(configurations)));
  }

  exports.merge = merge;
  exports["default"] = merge;

  function mergeWithCustomize(options) {
    return function mergeWithOptions(firstConfiguration) {
      var configurations = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        configurations[_i - 1] = arguments[_i];
      }

      if (utils.isUndefined(firstConfiguration) || configurations.some(utils.isUndefined)) {
        throw new TypeError("Merging undefined is not supported");
      } // @ts-ignore


      if (firstConfiguration.then) {
        throw new TypeError("Promises are not supported");
      } // No configuration at all


      if (!firstConfiguration) {
        return {};
      }

      if (configurations.length === 0) {
        if (Array.isArray(firstConfiguration)) {
          // Empty array
          if (firstConfiguration.length === 0) {
            return {};
          }

          if (firstConfiguration.some(utils.isUndefined)) {
            throw new TypeError("Merging undefined is not supported");
          } // @ts-ignore


          if (firstConfiguration[0].then) {
            throw new TypeError("Promises are not supported");
          }

          return merge_with_1["default"](firstConfiguration, join_arrays_1["default"](options));
        }

        return firstConfiguration;
      }

      return merge_with_1["default"]([firstConfiguration].concat(configurations), join_arrays_1["default"](options));
    };
  }

  exports.mergeWithCustomize = mergeWithCustomize;

  function customizeArray(rules) {
    return function (a, b, key) {
      var matchedRule = Object.keys(rules).find(function (rule) {
        return wildcard_1["default"](rule, key);
      }) || "";

      if (matchedRule) {
        switch (rules[matchedRule]) {
          case types.CustomizeRule.Prepend:
            return __spreadArray(__spreadArray([], __read(b)), __read(a));

          case types.CustomizeRule.Replace:
            return b;

          case types.CustomizeRule.Append:
          default:
            return __spreadArray(__spreadArray([], __read(a)), __read(b));
        }
      }
    };
  }

  exports.customizeArray = customizeArray;

  function mergeWithRules(rules) {
    return mergeWithCustomize({
      customizeArray: function (a, b, key) {
        var currentRule = rules;
        key.split(".").forEach(function (k) {
          if (!currentRule) {
            return;
          }

          currentRule = currentRule[k];
        });

        if (utils.isPlainObject(currentRule)) {
          return mergeWithRule({
            currentRule: currentRule,
            a: a,
            b: b
          });
        }

        if (typeof currentRule === "string") {
          return mergeIndividualRule({
            currentRule: currentRule,
            a: a,
            b: b
          });
        }

        return undefined;
      }
    });
  }

  exports.mergeWithRules = mergeWithRules;
  var isArray = Array.isArray;

  function mergeWithRule(_a) {
    var currentRule = _a.currentRule,
        a = _a.a,
        b = _a.b;

    if (!isArray(a)) {
      return a;
    }

    var bAllMatches = [];
    var ret = a.map(function (ao) {
      if (!utils.isPlainObject(currentRule)) {
        return ao;
      }

      var ret = {};
      var rulesToMatch = [];
      var operations = {};
      Object.entries(currentRule).forEach(function (_a) {
        var _b = __read(_a, 2),
            k = _b[0],
            v = _b[1];

        if (v === types.CustomizeRule.Match) {
          rulesToMatch.push(k);
        } else {
          operations[k] = v;
        }
      });
      var bMatches = b.filter(function (o) {
        var matches = rulesToMatch.every(function (rule) {
          var _a, _b;

          return ((_a = ao[rule]) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = o[rule]) === null || _b === void 0 ? void 0 : _b.toString());
        });

        if (matches) {
          bAllMatches.push(o);
        }

        return matches;
      });

      if (!utils.isPlainObject(ao)) {
        return ao;
      }

      Object.entries(ao).forEach(function (_a) {
        var _b = __read(_a, 2),
            k = _b[0],
            v = _b[1];

        var rule = currentRule;

        switch (currentRule[k]) {
          case types.CustomizeRule.Match:
            ret[k] = v;
            Object.entries(rule).forEach(function (_a) {
              var _b = __read(_a, 2),
                  k = _b[0],
                  v = _b[1];

              if (v === types.CustomizeRule.Replace && bMatches.length > 0) {
                var val = last(bMatches)[k];

                if (typeof val !== "undefined") {
                  ret[k] = val;
                }
              }
            });
            break;

          case types.CustomizeRule.Append:
            if (!bMatches.length) {
              ret[k] = v;
              break;
            }

            var appendValue = last(bMatches)[k];

            if (!isArray(v) || !isArray(appendValue)) {
              throw new TypeError("Trying to append non-arrays");
            }

            ret[k] = v.concat(appendValue);
            break;

          case types.CustomizeRule.Merge:
            if (!bMatches.length) {
              ret[k] = v;
              break;
            }

            var lastValue = last(bMatches)[k];

            if (!utils.isPlainObject(v) || !utils.isPlainObject(lastValue)) {
              throw new TypeError("Trying to merge non-objects");
            } // @ts-ignore: These should be objects now


            ret[k] = __assign(__assign({}, v), lastValue);
            break;

          case types.CustomizeRule.Prepend:
            if (!bMatches.length) {
              ret[k] = v;
              break;
            }

            var prependValue = last(bMatches)[k];

            if (!isArray(v) || !isArray(prependValue)) {
              throw new TypeError("Trying to prepend non-arrays");
            }

            ret[k] = prependValue.concat(v);
            break;

          case types.CustomizeRule.Replace:
            ret[k] = bMatches.length > 0 ? last(bMatches)[k] : v;
            break;

          default:
            var currentRule_1 = operations[k]; // Use .flat(); starting from Node 12

            var b_1 = bMatches.map(function (o) {
              return o[k];
            }).reduce(function (acc, val) {
              return isArray(acc) && isArray(val) ? __spreadArray(__spreadArray([], __read(acc)), __read(val)) : acc;
            }, []);
            ret[k] = mergeWithRule({
              currentRule: currentRule_1,
              a: v,
              b: b_1
            });
            break;
        }
      });
      return ret;
    });
    return ret.concat(b.filter(function (o) {
      return !bAllMatches.includes(o);
    }));
  }

  function mergeIndividualRule(_a) {
    var currentRule = _a.currentRule,
        a = _a.a,
        b = _a.b; // What if there's no match?

    switch (currentRule) {
      case types.CustomizeRule.Append:
        return a.concat(b);

      case types.CustomizeRule.Prepend:
        return b.concat(a);

      case types.CustomizeRule.Replace:
        return b;
    }

    return a;
  }

  function last(arr) {
    return arr[arr.length - 1];
  }

  function customizeObject(rules) {
    return function (a, b, key) {
      switch (rules[key]) {
        case types.CustomizeRule.Prepend:
          return merge_with_1["default"]([b, a], join_arrays_1["default"]());

        case types.CustomizeRule.Replace:
          return b;

        case types.CustomizeRule.Append:
          return merge_with_1["default"]([a, b], join_arrays_1["default"]());
      }
    };
  }

  exports.customizeObject = customizeObject;
});

function removeDir(path) {
  try {
    fs__default['default'].accessSync(path);
    var files = fs__default['default'].readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;

      if (fs__default['default'].statSync(curPath).isDirectory()) {
        // recurse
        removeDir(curPath);
      } else {
        // delete file
        fs__default['default'].unlinkSync(curPath, function (err) {
          if (err) throw err;
        });
      }
    });
    fs__default['default'].rmdirSync(path);
  } catch (error) {
    console.log(error);
  }
}

var util = {
  removeDir: removeDir
};

var logFilePath = '/codeScannerLog/log.js';
var logFileDirPath = '/codeScannerLog';

function createDir(basePath) {
  //检查某个目录是否存在
  try {
    fs__default['default'].accessSync(basePath + logFileDirPath);
    console.log('目录已存在');
  } catch (error) {
    fs__default['default'].mkdirSync(basePath + logFileDirPath);
    console.log('创建目录成功');
  }
}

function objWriteToJsFile(log, basePath, filename) {
  try {
    // 处理log序列化时，TypeError: Converting circular structure to JSON
    var stringifyCircularHandler = function stringifyCircularHandler(key, value) {
      if (_typeof(value) === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        } // Store value in our collection


        cache.push(value);
      }

      return value;
    };

    var cache = [];
    var txt = JSON.stringify(log, stringifyCircularHandler);

    if (!filename) {
      fs__default['default'].writeFileSync(basePath + logFilePath, 'var obj = ' + txt);
    } else {
      fs__default['default'].writeFileSync("".concat(basePath).concat(logFileDirPath, "/").concat(filename), 'var obj = ' + txt);
    }
  } catch (err) {
    console.error(err);
  }
}

function stringWriteToJsFile(str, basePath, filename) {
  try {
    if (!filename) {
      fs__default['default'].writeFileSync(basePath + logFilePath, 'var obj = ' + str);
    } else {
      fs__default['default'].writeFileSync("".concat(basePath).concat(logFileDirPath, "/").concat(filename), 'var obj = ' + str);
    }
  } catch (err) {
    console.error(err);
  }
}

var createLog = {
  createDir: createDir,
  objWriteToJsFile: objWriteToJsFile,
  stringWriteToJsFile: stringWriteToJsFile
};

var customPlugin = function customPlugin(babel) {
  console.log('********************：babel插件开始执行*******************');
  var logs = '[';
  var t = babel.types;
  return {
    name: 'custom-babel-plugin',
    visitor: {
      CallExpression: function CallExpression(path, state) {
        var obj = path.node.callee.object;
        var prop = path.node.callee.property; // const arguments = path.node.arguments

        if (t.isIdentifier(obj) && t.isIdentifier(prop) && obj.name === 'console' && prop.name === 'log') {
          var location = "---trace: line ".concat(path.node.loc.start.line, ", column ").concat(path.node.loc.start.column, ", ").concat(state.filename, "---"); // arguments.push(t.stringLiteral(location))

          console.log(location);
          console.log('********************写入日志文件*******************');
          logs = logs + '\n' + JSON.stringify({
            line: path.node.loc.start.line,
            column: path.node.loc.start.column,
            state: state.filename
          }) + ',';
          createLog.stringWriteToJsFile(logs + '\n]', commonjsGlobal.basePath);
        }
      }
    }
  };
};

var merge_webpack_config = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [customPlugin],
          cacheDirectory: false,
          cacheCompression: false
        }
      }
    }]
  }
};

var pluginName = 'webpackRunDonePlugin';

var WebpackRunDonePlugin = /*#__PURE__*/function () {
  function WebpackRunDonePlugin(_ref) {
    var basePath = _ref.basePath;

    _classCallCheck(this, WebpackRunDonePlugin);

    // 传入的参数挂载在这个类的实例上.
    this.basePath = basePath;
  }

  _createClass(WebpackRunDonePlugin, [{
    key: "apply",
    value: function apply(compiler) {
      compiler.hooks.run.tap(pluginName, function (compilation) {
        console.log('********************myTestWebpackPlugins 构建过程开始！********************');
      });
      compiler.hooks.done.tap(pluginName, function (stats) {
        console.log('********************myTestWebpackPlugins 构建结束！********************');
      });
    }
  }]);

  return WebpackRunDonePlugin;
}();

var webpackRunDonePlugin = WebpackRunDonePlugin;

var ChunkSizePlugin = /*#__PURE__*/function () {
  function ChunkSizePlugin(_ref) {
    var filename = _ref.filename,
        basePath = _ref.basePath;

    _classCallCheck(this, ChunkSizePlugin);

    // 传入的参数挂载在这个类的实例上.
    this.filename = filename;
    this.basePath = basePath;
  }

  _createClass(ChunkSizePlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.emit.tap('chunkSizePlugin', function (compilation) {
        // compilation 是webpack 工作流中抛出来的内容，很多东西在这里，要修改工作流就修改这个即可
        var assets = compilation.assets;
        var content = []; // 遍历打包之后的文件列表

        Object.entries(assets).forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              filename = _ref3[0],
              stateObj = _ref3[1];

          content.push({
            filename: filename,
            size: stateObj.size()
          });
        });
        createLog.objWriteToJsFile(content, _this.basePath, _this.filename); // 每个文件都有 source (该文件内容) 和 size 该文件大小
        // assets[this.filename] = {
        //     source(){
        //       return `var chunksSize = ${JSON.stringify(content)}`
        //     },
        //     size(){
        //       return content.length
        //     }
        // }
      });
    }
  }]);

  return ChunkSizePlugin;
}();

var chunkSizePlugin = ChunkSizePlugin;

var merge = dist.merge;
var webpackConfig = merge(baseWebpackConfig__default['default'], merge_webpack_config);

var CodeScanner = /*#__PURE__*/function () {
  function CodeScanner() {
    _classCallCheck(this, CodeScanner);
  }

  _createClass(CodeScanner, [{
    key: "run",
    value: function run(basePath) {
      commonjsGlobal.basePath = basePath; // 删除babel缓存

      util.removeDir("".concat(basePath, "/node_modules/.cache/babel-loader")); // 创建扫描日志目录

      createLog.createDir(basePath);
      var compiler = webpack__default['default'](webpackConfig);
      new webpackRunDonePlugin({
        basePath: basePath
      }).apply(compiler);
      new chunkSizePlugin({
        filename: "chunkSize.js",
        basePath: basePath
      }).apply(compiler);
      compiler.run(function (err, stats) {
        // [Stats Object](#stats-object)
        if (err) {
          console.error(err.stack || err);

          if (err.details) {
            console.error(err.details);
          }

          return;
        }

        var info = stats.toJson();

        if (stats.hasErrors()) {
          console.error(info.errors);
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
        }

        console.log(stats.toString({
          chunks: false,
          // 使构建过程更静默无输出
          colors: true // 在控制台展示颜色

        }));
      });
    }
  }]);

  return CodeScanner;
}();

var src = new CodeScanner();

module.exports = src;
