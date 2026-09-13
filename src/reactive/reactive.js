// src/reactive/reactive.js
// Reactive Proxy — intercepts get/set/delete on plain objects.
// Depends on: src/reactive/track.js, src/reactive/trigger.js,
//             src/utils/is.js, src/utils/log.js

import { track } from "./track.js";
import { trigger } from "./trigger.js";
import { isObject, isArray } from "../utils/is.js";
import { scoped } from "../utils/log.js";

const log = scoped("reactive");

// ─── Internal state ─────────────────────────────────────────

// WeakMap: original object → its Proxy.
// So calling reactive(obj) twice returns the same Proxy.
const proxyCache = new WeakMap();

// ─── Internal helpers ───────────────────────────────────────

// Check if a value is already a Vexorion reactive Proxy
function _isReactive(value) {
    return isObject(value) && value.__isReactive === true;
}

// Should we wrap this value in a nested reactive?
function _shouldWrap(value) {
    return isObject(value) && !_isReactive(value) && !isArray(value);
}

// Wrap a nested object in reactive (lazy, on first access)
function _wrapNested(value) {
    if (_shouldWrap(value)) {
        return reactive(value);
    }
    return value;
}

// ─── Public API ─────────────────────────────────────────────

// Check if a value is a Vexorion reactive Proxy (public version)
function isReactive(value) {
    return _isReactive(value);
}

// Unwrap a Proxy to get the original target object
function toRaw(value) {
    if (!_isReactive(value)) return value;
    return value.__raw || proxyCache.get(value) || value;
}

// Create a reactive Proxy around a plain object.
// Returns the same Proxy if called twice with the same object.
function reactive(target) {
    // Already a Proxy → return as-is
    if (_isReactive(target)) {
        return target;
    }

    // Not an object → warn and return untouched
    if (!isObject(target)) {
        log.warn(`reactive() expects an object, got ${typeof target}`);
        return target;
    }

    // Cached → return existing Proxy
    if (proxyCache.has(target)) {
        return proxyCache.get(target);
    }

    const proxy = new Proxy(target, {
        get(obj, key, receiver) {
            // Special marker so we can detect our own Proxies
            if (key === "__isReactive") return true;
            if (key === "__raw") return obj;

            const value = Reflect.get(obj, key, receiver);
            track(obj, key);
            return _wrapNested(value);
        },

        set(obj, key, value, receiver) {
            // Don't allow overwriting our marker
            if (key === "__isReactive" || key === "__raw") {
                log.warn(`cannot set reserved key "${String(key)}"`);
                return false;
            }

            const oldValue = obj[key];
            const rawValue = _isReactive(value) ? toRaw(value) : value;

            const result = Reflect.set(obj, key, rawValue, receiver);

            // Only trigger if the value actually changed
            if (oldValue !== rawValue) {
                trigger(obj, key);
            }

            return result;
        },

        deleteProperty(obj, key) {
            const had = key in obj;
            const result = Reflect.deleteProperty(obj, key);

            if (had) {
                trigger(obj, key);
            }

            return result;
        },

        has(obj, key) {
            // Track `in` operator too
            track(obj, key);
            return Reflect.has(obj, key);
        },

        ownKeys(obj) {
            // Track iteration
            track(obj, "__iterate__");
            return Reflect.ownKeys(obj);
        }
    });

    proxyCache.set(target, proxy);
    log.debug("proxy created");
    return proxy;
}

export {
    reactive,
    isReactive,
    toRaw
};
