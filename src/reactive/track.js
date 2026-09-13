// src/reactive/track.js
// Dependency tracking — registers active effect as subscriber.
// Depends on: src/reactive/stack.js, src/utils/log.js

import { getActiveEffect } from "./stack.js";
import { scoped } from "../utils/log.js";

const log = scoped("track");

// ─── Internal state ─────────────────────────────────────────

// Global registry: target object → Map<key, Set<effect>>
// WeakMap so targets can be garbage-collected when no longer used.
const targetMap = new WeakMap();

// ─── Internal helpers ───────────────────────────────────────

// Ensure a Map<key, Set> exists for the given target
function _ensureDepsMap(target) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    return depsMap;
}

// Ensure a Set<effect> exists for the given target[key]
function _ensureDepSet(depsMap, key) {
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    return dep;
}

// ─── Public API ─────────────────────────────────────────────

// Register the currently-running effect as a subscriber of target[key].
// Called from inside the reactive Proxy's `get` trap.
function track(target, key) {
    const effect = getActiveEffect();

    // No effect running → nothing to track
    if (!effect) return;

    const depsMap = _ensureDepsMap(target);
    const dep = _ensureDepSet(depsMap, key);

    // Avoid double-registration (same effect already subscribed)
    if (dep.has(effect)) return;

    dep.add(effect);
    log.debug(`tracked ${String(key)} (subscribers: ${dep.size})`);
}

// Get the Set of effects subscribed to target[key], or null
function getSubscribers(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return null;
    return depsMap.get(key) || null;
}

// Check if target[key] has any subscribers
function hasSubscribers(target, key) {
    const dep = getSubscribers(target, key);
    return dep !== null && dep.size > 0;
}

// Count subscribers of target[key]
function subscriberCount(target, key) {
    const dep = getSubscribers(target, key);
    return dep ? dep.size : 0;
}

// Remove a specific effect from target[key]'s subscriber list
function removeSubscriber(target, key, effect) {
    const dep = getSubscribers(target, key);
    if (!dep) return false;
    return dep.delete(effect);
}

// Remove all subscribers of target[key]
function clearSubscribers(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    depsMap.delete(key);
}

// Check if a target is being tracked at all
function isTracked(target) {
    return targetMap.has(target);
}

// Get the internal targetMap (exposed for trigger.js and tests)
function getTargetMap() {
    return targetMap;
}

export {
    track,
    getSubscribers,
    hasSubscribers,
    subscriberCount,
    removeSubscriber,
    clearSubscribers,
    isTracked,
    getTargetMap
};
