// src/reactive/signal.js
// Signal — single-value reactive container.
// Depends on: src/reactive/reactive.js, src/utils/is.js, src/utils/log.js

import { reactive, isReactive, toRaw } from "./reactive.js";
import { isFunction } from "../utils/is.js";
import { scoped } from "../utils/log.js";

const log = scoped("signal");

// ─── Internal helpers ───────────────────────────────────────

// Reserved key that holds the actual value inside the box
const VALUE_KEY = "value";

// Validate that a signal object is well-formed
function _isSignalObject(sig) {
    return sig !== null &&
           typeof sig === "object" &&
           isFunction(sig.get) &&
           isFunction(sig.set);
}

// ─── Public API ─────────────────────────────────────────────

// Create a signal with an initial value.
// Returns { get, set, update, peek, subscribe }.
function signal(initialValue) {
    // Box is a reactive object with one key: value
    const box = reactive({ [VALUE_KEY]: initialValue });

    // Read the current value (tracks dependencies)
    function get() {
        return box[VALUE_KEY];
    }

    // Write a new value (triggers subscribers)
    function set(next) {
        if (isReactive(next)) {
            next = toRaw(next);
        }
        box[VALUE_KEY] = next;
        return next;
    }

    // Update using a function: update(prev => prev + 1)
    function update(updater) {
        if (!isFunction(updater)) {
            log.warn("update() expects a function");
            return get();
        }
        const next = updater(get());
        set(next);
        return next;
    }

    // Read without tracking (useful inside other effects)
    function peek() {
        return toRaw(box)[VALUE_KEY];
    }

    // Manual subscribe (returns unsubscribe function).
    // NOTE: this bypasses the effect system for one-off listeners.
    const listeners = new Set();
    function subscribe(listener) {
        if (!isFunction(listener)) {
            log.warn("subscribe() expects a function");
            return function () {};
        }
        listeners.add(listener);
        return function () {
            listeners.delete(listener);
        };
    }

    const sig = {
        get,
        set,
        update,
        peek,
        subscribe,
        __isSignal: true
    };

    // Notify listeners when value changes.
    // We wrap get in an effect-free notification by observing raw writes.
    // (Simplest approach: attach a permanent effect that reacts to box.value)
    // Use a microtask to avoid stacking synchronous notifications.
    let lastValue = initialValue;
    // Use a hidden effect via queueMicrotask to compare and notify.
    // Keep it simple: re-check on next microtask after each set.
    function notifyIfChanged() {
        const current = peek();
        if (current !== lastValue) {
            lastValue = current;
            listeners.forEach(function (listener) {
                try {
                    listener(current);
                } catch (err) {
                    log.error(`listener error: ${err.message}`);
                }
            });
        }
    }

    // Patch set/update to notify after change
    const originalSet = set;
    sig.set = function (next) {
        const result = originalSet(next);
        queueMicrotask(notifyIfChanged);
        return result;
    };

    return sig;
}

// Check if a value is a Vexorion signal
function isSignal(value) {
    return value !== null &&
           typeof value === "object" &&
           value.__isSignal === true;
}

// Read a signal (or return plain value if not a signal)
function read(value) {
    return isSignal(value) ? value.get() : value;
}

// Write to a signal (or no-op if not a signal)
function write(value, next) {
    if (isSignal(value)) {
        value.set(next);
        return true;
    }
    return false;
}

export {
    signal,
    isSignal,
    read,
    write
};
