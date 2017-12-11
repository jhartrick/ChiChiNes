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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = __webpack_require__(27);
var isObject_1 = __webpack_require__(28);
var isFunction_1 = __webpack_require__(5);
var tryCatch_1 = __webpack_require__(29);
var errorObject_1 = __webpack_require__(6);
var UnsubscriptionError_1 = __webpack_require__(30);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = __webpack_require__(1);
var Symbol = root_1.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

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
var isFunction_1 = __webpack_require__(5);
var Subscription_1 = __webpack_require__(2);
var Observer_1 = __webpack_require__(7);
var rxSubscriber_1 = __webpack_require__(3);
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var worker_interop_1 = __webpack_require__(9);
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiMachine_1 = __webpack_require__(10);
var ChiChiState_1 = __webpack_require__(20);
var CCMessage = __webpack_require__(21);
var StateBuffer_1 = __webpack_require__(22);
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
    CommandHandler.bind = function (command, handler) {
        return new CommandHandler(command, handler);
    };
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
        this.commands = [
            CommandHandler.bind(CCMessage.CMD_CREATE, function (val) {
                return _this.createMachine(val);
            }),
            CommandHandler.bind(CCMessage.CMD_LOADROM, function (val) {
                return _this.loadCart(val);
            }),
            CommandHandler.bind(CCMessage.CMD_CHEAT, function (val) {
                return _this.cheat(val);
            }),
            CommandHandler.bind(CCMessage.CMD_AUDIOSETTINGS, function (val) {
                _this.applyAudioSettings(val);
            }),
            CommandHandler.bind(CCMessage.CMD_RUNSTATUS, function (val) {
                _this.changeRunStatus(val);
            }),
            CommandHandler.bind(CCMessage.CMD_DEBUGSTEP, function (val) {
                _this.Debugging = true;
                switch (val.stepType) {
                    case ChiChiTypes_1.DebugStepTypes.Frame:
                        _this.debugRunFrame();
                        break;
                    case ChiChiTypes_1.DebugStepTypes.Instruction:
                        _this.debugRunStep();
                        break;
                }
            }),
            CommandHandler.bind(CCMessage.CMD_RESET, function (val) {
                _this.machine.Reset();
            })
        ];
        this.buffers = {
            vbuffer: [],
            abuffer: []
        };
        // attach require.js "require" fn here in bootstrapper
        this.require = {};
        this.machine = new ChiChiMachine_1.ChiChiMachine();
        this.interop = new worker_interop_1.WorkerInterop(new Int32Array((new SharedArrayBuffer(16 * Int32Array.BYTES_PER_ELEMENT))));
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
            info.stateBuffer = this.stateBuffer.data;
            // info.Cpu = {
            //     // Rams: this.machine.Cpu.memoryMap.Rams,
            //     // spriteRAM: this.machine.Cpu.ppu.spriteRAM
            // }
            // info.Cart = {
            //     //buffers
            //     chrRom: (<any>this.machine.Cart).chrRom,
            //     prgRomBank6: (<any>this.machine.Cart).prgRomBank6,
            //     ppuBankStarts: (<any>this.machine.Cart).ppuBankStarts,
            //     bankStartCache: (<any>this.machine.Cart).bankStartCache,
            // }
            info.sound = {
                waveForms_controlBuffer: this.machine.WaveForms.controlBuffer
            };
        }
        postMessage(info);
    };
    tendoWrapper.prototype.updateState = function () {
        var machine = this.machine;
        if (this.stateBuffer) {
            this.stateBuffer.updateBuffer();
        }
        var info = new NesInfo();
        if (this.machine) {
            info.machine = {
                runStatus: this.runStatus
            };
            if (machine.SoundBopper && machine.SoundBopper.audioSettings) {
                info.sound = {
                    soundEnabled: machine.EnableSound,
                    settings: machine.SoundBopper.audioSettings
                };
            }
            if (this.machine.Cpu.Debugging) {
                info.debug = {
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
        clearInterval(this.interval);
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
                break;
            case ChiChiTypes_1.RunningStatuses.Unloaded:
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
            _this.machine.Cpu.setupMemoryMap(cart);
            _this.stateBuffer = new StateBuffer_1.StateBuffer();
            _this.machine.Cpu.memoryMap.setupStateBuffer(_this.stateBuffer);
            _this.machine.Cpu.setupStateBuffer(_this.stateBuffer);
            _this.machine.ppu.setupStateBuffer(_this.stateBuffer);
            cart.setupStateBuffer(_this.stateBuffer);
            _this.stateBuffer.build();
            cart.installCart(_this.machine.ppu, _this.machine.Cpu);
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
    };
    return tendoWrapper;
}());
exports.tendoWrapper = tendoWrapper;


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiAudio_1 = __webpack_require__(11);
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiPPU_1 = __webpack_require__(16);
var CommonAudio_1 = __webpack_require__(17);
var ChiChiCPU_1 = __webpack_require__(18);
//machine wrapper
var ChiChiMachine = /** @class */ (function () {
    function ChiChiMachine(cpu) {
        var _this = this;
        this.frameJustEnded = true;
        this.frameOn = false;
        this.totalCPUClocks = 0;
        this._enableSound = false;
        this.evenFrame = true;
        var wavSharer = new CommonAudio_1.ChiChiWavSharer();
        this.SoundBopper = new ChiChiAudio_1.ChiChiAPU(wavSharer);
        this.WaveForms = wavSharer;
        this.ppu = new ChiChiPPU_1.ChiChiPPU();
        this.Cpu = cpu ? cpu : new ChiChiCPU_1.ChiChiCPPU(this.SoundBopper, this.ppu);
        this.ppu.cpu = this.Cpu;
        this.ppu.NMIHandler = function () { _this.Cpu.nmiHandler(); };
        this.ppu.frameFinished = function () { _this.frameFinished(); };
    }
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DMCChannel_1 = __webpack_require__(12);
var SquareChannel_1 = __webpack_require__(13);
var TriangleChannel_1 = __webpack_require__(14);
var NoiseChannel_1 = __webpack_require__(15);
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
    Object.defineProperty(ChiChiAPU.prototype, "state", {
        get: function () {
            return {
                audioSettings: this.audioSettings,
                sampleRate: this.sampleRate,
                interruptRaised: this._interruptRaised,
                enableSquare0: this.square0.playing,
                enableSquare1: this.square1.playing,
                enableTriangle: this.triangle.playing,
                enableNoise: this.noise.playing
            };
        },
        set: function (value) {
            this.audioSettings = value.audioSettings;
            this.sampleRate = value.sampleRate;
            this._interruptRaised = value.interruptRaised;
            this.square0.playing = value.enableSquare0;
            this.square1.playing = value.enableSquare1;
            this.triangle.playing = value.enableTriangle;
            this.noise.playing = value.enableNoise;
        },
        enumerable: true,
        configurable: true
    });
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
/* 12 */
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
        this.directLoad = false;
        this.amplitude = 0;
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
        this.delta = 0;
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TriangleChannel = /** @class */ (function () {
    function TriangleChannel(chan, onWriteAudio) {
        this.onWriteAudio = onWriteAudio;
        this.playing = true;
        this.output = 0;
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
/* 15 */
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
/* 16 */
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
        this.initSprites();
    }
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
    ChiChiPPU.prototype.Initialize = function () {
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
            this.cpu._handleNMI = true;
        }
    };
    ChiChiPPU.prototype.SetByte = function (Clock, address, data) {
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
                    this.UpdatePixelInfo();
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
    ChiChiPPU.prototype.GetByte = function (Clock, address) {
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
        patternEntry = this.memoryMap.getPPUByte(this.LastcpuClock, dataAddress);
        patternEntryBit2 = this.memoryMap.getPPUByte(this.LastcpuClock, dataAddress + 8);
        return (sprite.v.FlipX ? ((patternEntry >> x) & 1) | (((patternEntryBit2 >> x) << 1) & 2) : ((patternEntry >> 7 - x) & 1) | (((patternEntryBit2 >> 7 - x) << 1) & 2));
    };
    ChiChiPPU.prototype.preloadSprites = function (scanline) {
        this.spritesOnThisScanline = 0;
        this.sprite0scanline = -1;
        var yLine = this.currentYPosition - 1;
        for (var spriteNum = 0; spriteNum < 256; spriteNum += 4) {
            var spriteID = ((spriteNum + this.spriteAddress) & 0xff) >> 2;
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
                    this.vbufLocation = 0;
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
                        var tileIndex = this.memoryMap.getPPUByte(this.LastcpuClock + ticks, tileNametablePosition);
                        var patternTableYOffset = this.yPosition & 7;
                        var patternID = this.backgroundPatternTableIndex + (tileIndex * 16) + patternTableYOffset;
                        this.patternEntry = this.memoryMap.getPPUByte(this.LastcpuClock + ticks, patternID);
                        this.patternEntryByte2 = this.memoryMap.getPPUByte(this.LastcpuClock + ticks, patternID + 8);
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
                    this.byteOutBuffer[this.vbufLocation * 4] = this.palette[(this.isForegroundPixel || (tilePixel === 0 && spritePixel !== 0)) ? spritePixel : tilePixel];
                    this.byteOutBuffer[(this.vbufLocation * 4) + 1] = this.emphasisBits;
                    this.vbufLocation++;
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
    ChiChiPPU.pal = new Uint32Array([7961465, 10626572, 11407400, 10554206, 7733552, 2753820, 725017, 271983, 278855, 284436, 744967, 3035906, 7161605, 0, 131586, 131586, 12566719, 14641430, 15614283, 14821245, 12196292, 6496468, 2176980, 875189, 293472, 465210, 1597716, 5906953, 11090185, 2961197, 197379, 197379, 16316149, 16298569, 16588080, 16415170, 15560682, 12219892, 7115511, 4563694, 2277591, 2151458, 4513360, 1957181, 14604331, 6579811, 263172, 263172, 16447992, 16441012, 16634316, 16500447, 16236786, 14926838, 12831991, 11393781, 2287340, 5500370, 11858360, 14283440, 15921318, 13158344, 328965, 328965, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return ChiChiPPU;
}());
exports.ChiChiPPU = ChiChiPPU;


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
var ChiChiWavSharer = /** @class */ (function (_super) {
    __extends(ChiChiWavSharer, _super);
    function ChiChiWavSharer() {
        var _this = _super.call(this) || this;
        _this.blip_new(44100 / 5);
        return _this;
    }
    ChiChiWavSharer.prototype.blip_new = function (size) {
        this.blipBuffer = new BlipBuffer(size + ChiChiWavSharer.buf_extra);
        this.blipBuffer.size = size;
        this.blipBuffer.factor = 0;
        this.blip_clear();
    };
    ChiChiWavSharer.prototype.blip_set_rates = function (clock_rate, sample_rate) {
        this.blipBuffer.factor = ChiChiWavSharer.time_unit / clock_rate * sample_rate + (0.9999847412109375);
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
        this.blipBuffer.avail += off >> ChiChiWavSharer.time_bits;
        this.blipBuffer.offset = off & (ChiChiWavSharer.time_unit - 1);
    };
    ChiChiWavSharer.prototype.remove_samples = function (count) {
        var remain = this.blipBuffer.avail + ChiChiWavSharer.buf_extra - count;
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
                var st = sum >> ChiChiWavSharer.delta_bits;
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
        var outPtr = (this.blipBuffer.avail + (fixedTime >> ChiChiWavSharer.time_bits));
        var phase_shift = 16;
        //const phase = System.Int64.clip32(fixedTime.shr(phase_shift).and(System.Int64((ChiChiWavSharer.phase_count - 1))));
        var phase = (fixedTime >> phase_shift & (ChiChiWavSharer.phase_count - 1)) >>> 0;
        var inStep = phase; // bl_step[phase];
        var rev = ChiChiWavSharer.phase_count - phase; // bl_step[phase_count - phase];
        var interp_bits = 15;
        var interp = (fixedTime >> (phase_shift - interp_bits) & ((1 << interp_bits) - 1));
        var delta2 = (delta * interp) >> interp_bits;
        delta -= delta2;
        for (var i = 0; i < 8; ++i) {
            this.blipBuffer.samples[outPtr + i] += (ChiChiWavSharer.bl_step[inStep][i] * delta) + (ChiChiWavSharer.bl_step[inStep][i] * delta2);
            this.blipBuffer.samples[outPtr + (15 - i)] += (ChiChiWavSharer.bl_step[rev][i] * delta) + (ChiChiWavSharer.bl_step[rev - 1][i] * delta2);
        }
    };
    // blipper     
    ChiChiWavSharer.time_unit = 2097152;
    ChiChiWavSharer.buf_extra = 18;
    ChiChiWavSharer.phase_count = 32;
    ChiChiWavSharer.time_bits = 21;
    ChiChiWavSharer.delta_bits = 15;
    //sinc values
    ChiChiWavSharer.bl_step = [
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


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChiChiTypes_1 = __webpack_require__(0);
var ChiChiControl_1 = __webpack_require__(19);
var PRG_CTR = 0;
var PRG_ADR = 1;
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
        this.borrowedCycles = 0;
        this._ticks = 0;
        // CPU Status
        this.cpuStatus16 = new Uint16Array(2);
        this.programCounter = 0;
        this.addressBus = 0;
        this._handleNMI = false;
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
            this.memoryMap.advanceClock(value);
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
        this.statusRegister = (value ? (this.statusRegister | Flag) : (this.statusRegister & ~Flag));
        this.statusRegister |= 32; // (int)CPUStatusMasks.ExpansionMask;
    };
    ChiChiCPPU.prototype.GetFlag = function (flag) {
        return ((this.statusRegister & flag) === flag);
    };
    ChiChiCPPU.prototype.interruptRequest = function () {
        if (!this.GetFlag(this.SRMasks_InterruptDisableMask)) {
            this.advanceClock(7);
            this.setFlag(this.SRMasks_InterruptDisableMask, true);
            var newStatusReg1 = this.statusRegister & ~0x10 | 0x20;
            this.pushStack(this.programCounter >> 8);
            this.pushStack(this.programCounter);
            this.pushStack(this.statusRegister);
            this.programCounter = this.GetByte(0xFFFE) + (this.GetByte(0xFFFF) << 8);
        }
    };
    ChiChiCPPU.prototype.nonMaskableInterrupt = function () {
        //When an IRQ or NMI occurs, the current status with bit 4 clear and bit 5 
        //  set is pushed on the stack, then the I flag is set. 
        var newStatusReg = this.statusRegister & ~0x10 | 0x20;
        this.setFlag(this.SRMasks_InterruptDisableMask, true);
        // push pc onto stack (high byte first)
        this.pushStack(this.programCounter >> 8);
        this.pushStack(this.programCounter & 0xFF);
        //c7ab
        // push sr onto stack
        this.pushStack(newStatusReg);
        // point pc to interrupt service routine
        var lowByte = this.GetByte(0xFFFA);
        var highByte = this.GetByte(0xFFFB);
        var jumpTo = lowByte | (highByte << 8);
        this.programCounter = jumpTo;
        //nonOpCodeticks = 7;
    };
    ChiChiCPPU.prototype.step = function () {
        this._currentInstruction_ExtraTiming = 0;
        if (this._handleNMI) {
            this.advanceClock(7);
            this._handleNMI = false;
            this.nonMaskableInterrupt();
        }
        else if (this.memoryMap.irqRaised) {
            this.interruptRequest();
        }
        //FetchNextInstruction();
        this._currentInstruction_Address = this.programCounter;
        this._currentInstruction_OpCode = this.GetByte(this.programCounter);
        this.programCounter = (this.programCounter + 1) & 0xffff;
        this._currentInstruction_AddressingMode = ChiChiCPPU.addressModes[this._currentInstruction_OpCode];
        this.fetchInstructionParameters();
        this.execute();
        this.advanceClock(ChiChiCPPU.cpuTiming[this._currentInstruction_OpCode]);
        this.advanceClock(this._currentInstruction_ExtraTiming);
        if (this.borrowedCycles) {
            this.advanceClock(this.borrowedCycles);
            this.borrowedCycles = 0;
        }
        if (this._debugging) {
            this.writeInstructionHistory();
            this._operationCounter++;
        }
    };
    ChiChiCPPU.prototype.fetchInstructionParameters = function () {
        switch (this._currentInstruction_AddressingMode) {
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Absolute:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.AbsoluteY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Indirect:
                // case AddressingModes.IndirectAbsoluteX:
                this._currentInstruction_Parameters0 = this.GetByte((this.programCounter++) & 0xFFFF);
                this._currentInstruction_Parameters1 = this.GetByte((this.programCounter++) & 0xFFFF);
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageX:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.ZeroPageY:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectIndexed:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndirectZeroPage:
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Immediate:
                this._currentInstruction_Parameters0 = this.GetByte((this.programCounter++) & 0xFFFF);
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
        this.programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
        this.advanceClock(4);
        this.genieCodes = [];
    };
    ChiChiCPPU.prototype.PowerOn = function () {
        // powers up with this state
        this.statusRegister = 52;
        this.stackPointer = 253;
        this._operationCounter = 0;
        this.advanceClock(4);
        this.programCounter = this.GetByte(0xFFFC) | (this.GetByte(0xFFFD) << 8);
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
                var indirectAddr = (this.GetByte(indAddr));
                lowByte = (((lowByte + 1) | 0)) & 0xFF;
                indAddr = (highByte | lowByte) & 65535;
                indirectAddr = indirectAddr | (this.GetByte(indAddr) << 8);
                result = indirectAddr;
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.IndexedIndirect:
                var addr = (((this._currentInstruction_Parameters0 + this.indexRegisterX) | 0)) & 0xFF;
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
                result = (addr + this.indexRegisterY) | 0;
                if ((result & 0xFF) > this.indexRegisterY) {
                    this._currentInstruction_ExtraTiming = 1;
                }
                break;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Relative:
                result = (((this.programCounter + this._currentInstruction_Parameters0) | 0));
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
                this.dataBus = this._currentInstruction_Parameters0;
                return this._currentInstruction_Parameters0;
            case ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator:
                return this.accumulator;
            default:
                this.dataBus = this.GetByte(this.decodeAddress());
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
                this.setFlag(this.SRMasks_CarryMask, result > 255);
                // overflow flag
                this.setFlag(this.SRMasks_OverflowMask, ((this.accumulator ^ data) & 128) !== 128 && ((this.accumulator ^ result) & 128) === 128);
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
                this.setFlag(this.SRMasks_CarryMask, ((data & 128) === 128));
                data = (data << 1) & 254;
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                }
                else {
                    this.SetByte(this.decodeAddress(), data);
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
                this.setFlag(this.SRMasks_OverflowMask, (data & 64) === 64);
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
                lowByte = this.GetByte(this.addressBus);
                this.addressBus = 65535;
                highByte = this.GetByte(this.addressBus);
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
                this.setFlag(this.SRMasks_CarryMask, false);
                break;
            case 216:
                // CLD();
                this.setFlag(this.SRMasks_DecimalModeMask, false);
                break;
            case 88:
                // CLI();
                this.setFlag(this.SRMasks_InterruptDisableMask, false);
                break;
            case 184:
                // CLV();
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
                this.SetByte(this.decodeAddress(), data);
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
                this.SetByte(this.decodeAddress(), data);
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
                this.setFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                //target.SetFlag(CPUStatusBits.Carry, (rst & 1) == 1);
                data = data >> 1 & 0xFF;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
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
                this.setFlag(this.SRMasks_CarryMask, (data & 128) === 128);
                data = ((data << 1) | oldbit) & 0xFF;
                //data = data & 0xFF;
                //data = data | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
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
                oldbit = (this.statusRegister & 1) === 1 ? 128 : 0;
                // original bit 0 shifted to carry
                this.setFlag(this.SRMasks_CarryMask, (data & 1) === 1);
                data = (data >> 1) | oldbit;
                this.setZNFlags(data);
                if (this._currentInstruction_AddressingMode === ChiChiTypes_1.ChiChiCPPU_AddressingModes.Accumulator) {
                    this.accumulator = data;
                }
                else {
                    this.SetByte(this.decodeAddress(), data);
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
                this.setFlag(this.SRMasks_OverflowMask, ((this.accumulator ^ result) & 128) === 128 && ((this.accumulator ^ data) & 128) === 128);
                this.setFlag(this.SRMasks_CarryMask, (result < 256));
                this.accumulator = (result) & 0xFF;
                this.setZNFlags(this.accumulator);
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
                this.SetByte(this.decodeAddress(), this.accumulator);
                break;
            case 134:
            case 150:
            case 142:
                //STX();
                this.SetByte(this.decodeAddress(), this.indexRegisterX);
                break;
            case 132:
            case 148:
            case 140:
                //STY();
                this.SetByte(this.decodeAddress(), this.indexRegisterY);
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
                this.setFlag(this.SRMasks_CarryMask, (this.accumulator & 128) === 128);
                this.setZNFlags(this.accumulator);
                break;
            case 75:
                //AND byte with accumulator, then shift right one bit in accumu-lator.
                //Status flags: N,Z,C
                this.accumulator = this.decodeOperand() & this.accumulator;
                this.setFlag(this.SRMasks_CarryMask, (this.accumulator & 1) === 1);
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
                this.setFlag(this.SRMasks_CarryMask, (this.accumulator & 1) === 1);
                switch (this.accumulator & 48) {
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
        this.setFlag(this.SRMasks_CarryMask, data > 255);
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
        this._handleNMI = true;
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
    ChiChiCPPU.prototype.setupMemoryMap = function (cart) {
        this.memoryMap = cart.createMemoryMap(this);
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
    ChiChiCPPU.prototype.HandleNextEvent = function () {
        // this.ppu.HandleEvent(this.clock);
        // this.FindNextEvent();
    };
    ChiChiCPPU.prototype.ResetInstructionHistory = function () {
        //_instructionHistory = new Instruction[0x100];
        this.instructionHistoryPointer = 0xFF;
    };
    ChiChiCPPU.prototype.writeInstructionHistory = function () {
        var inst = new ChiChiTypes_1.ChiChiInstruction();
        inst.time = this.systemClock;
        inst.A = this.accumulator;
        inst.X = this.indexRegisterX;
        inst.Y = this.indexRegisterY;
        inst.SR = this.statusRegister;
        inst.SP = this.stackPointer;
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
            PC: this.programCounter,
            A: this.accumulator,
            X: this.indexRegisterX,
            Y: this.indexRegisterY,
            SP: this.stackPointer,
            SR: this.statusRegister
        };
    };
    ChiChiCPPU.prototype.setupStateBuffer = function (sb) {
        var _this = this;
        sb.onRestore.subscribe(function (buffer) {
            _this.attachStateBuffer(buffer);
        });
        sb.onUpdateBuffer.subscribe(function (buffer) {
            _this.updateStateBuffer(buffer);
        });
        sb.pushSegment(2 * Uint16Array.BYTES_PER_ELEMENT, 'cpu_status_16')
            .pushSegment(8, 'cpu_status');
        return sb;
    };
    ChiChiCPPU.prototype.attachStateBuffer = function (sb) {
        this.cpuStatus = sb.getUint8Array('cpu_status');
        this.cpuStatus16 = sb.getUint16Array('cpu_status_16');
    };
    ChiChiCPPU.prototype.updateStateBuffer = function (sb) {
        this.cpuStatus16[PRG_CTR] = this.programCounter;
        this.cpuStatus16[PRG_ADR] = this.addressBus;
        this.cpuStatus[0] = this.statusRegister;
        this.cpuStatus[1] = this.accumulator;
        this.cpuStatus[2] = this.indexRegisterX;
        this.cpuStatus[3] = this.indexRegisterY;
        this.cpuStatus[4] = this.dataBus;
        this.cpuStatus[5] = this.stackPointer;
    };
    // statics
    ChiChiCPPU.cpuTiming = [7, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 6, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 3, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 6, 6, 0, 0, 3, 2, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 2, 5, 0, 0, 0, 3, 6, 0, 2, 4, 2, 0, 6, 4, 6, 0, 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 5, 4, 6, 0, 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 3, 6, 3, 0, 3, 3, 3, 0, 2, 3, 2, 0, 4, 4, 4, 0, 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 2, 6, 3, 0, 3, 2, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0, 2, 6, 3, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 2, 5, 0, 0, 3, 4, 6, 0, 2, 4, 2, 0, 6, 4, 7, 0];
    ChiChiCPPU.addressModes = [1, 12, 1, 0, 0, 4, 4, 0, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 4, 5, 5, 1, 1, 10, 1, 1, 8, 9, 9, 1, 8, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 9, 9, 9, 1, 1, 12, 1, 1, 1, 4, 4, 1, 1, 3, 2, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 1, 12, 1, 1, 4, 4, 4, 1, 1, 3, 2, 3, 11, 8, 8, 1, 7, 13, 14, 1, 5, 5, 5, 1, 1, 10, 1, 1, 15, 9, 9, 1, 7, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 1, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 8, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 5, 5, 6, 1, 1, 10, 1, 1, 9, 9, 10, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1, 3, 12, 3, 1, 4, 4, 4, 1, 1, 3, 1, 3, 8, 8, 8, 1, 7, 13, 14, 1, 1, 5, 5, 1, 1, 10, 1, 1, 1, 9, 9, 1];
    return ChiChiCPPU;
}());
exports.ChiChiCPPU = ChiChiCPPU;


/***/ }),
/* 19 */
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
/* 20 */
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
        // state.ppu = machine.ppu.state;
        // state.cpu = machine.Cpu.state;
        return state;
    };
    ChiChiStateManager.prototype.write = function (machine, value) {
        if (value.ppu) {
            // machine.ppu.state = value.ppu;
        }
        if (value.apu) {
            machine.SoundBopper.state = value.apu;
        }
        if (value.cpu) {
            // machine.Cpu.state = value.cpu;
        }
    };
    return ChiChiStateManager;
}());
exports.ChiChiStateManager = ChiChiStateManager;


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
        _this.command = exports.CMD_AUDIOSETTINGS;
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


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = __webpack_require__(23);
var StateBufferConfig = /** @class */ (function () {
    function StateBufferConfig() {
        this.segments = new Array();
    }
    return StateBufferConfig;
}());
exports.StateBufferConfig = StateBufferConfig;
var BufferSegment = /** @class */ (function () {
    function BufferSegment() {
    }
    return BufferSegment;
}());
exports.BufferSegment = BufferSegment;
var StateBuffer = /** @class */ (function () {
    function StateBuffer() {
        this.data = new StateBufferConfig();
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
        this.data.buffer = new SharedArrayBuffer(this.bufferSize);
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
var Observable_1 = __webpack_require__(24);
var Subscriber_1 = __webpack_require__(4);
var Subscription_1 = __webpack_require__(2);
var ObjectUnsubscribedError_1 = __webpack_require__(34);
var SubjectSubscription_1 = __webpack_require__(35);
var rxSubscriber_1 = __webpack_require__(3);
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = __webpack_require__(1);
var toSubscriber_1 = __webpack_require__(26);
var observable_1 = __webpack_require__(31);
var pipe_1 = __webpack_require__(32);
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
/* 25 */
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(4);
var rxSubscriber_1 = __webpack_require__(3);
var Observer_1 = __webpack_require__(7);
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var errorObject_1 = __webpack_require__(6);
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = __webpack_require__(1);
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var noop_1 = __webpack_require__(33);
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-empty */
function noop() { }
exports.noop = noop;
//# sourceMappingURL=noop.js.map

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
/* 35 */
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
var Subscription_1 = __webpack_require__(2);
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

/***/ })
/******/ ]);
});