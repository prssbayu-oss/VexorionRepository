// src/reactive/trigger.js
// Change notification — re-runs all subscribed effects.
// Depends on: src/reactive/track.js, src/utils/log.js

import { getSubscribers, getTargetMap } from "./track.js";
import { scoped } from "../utils/log.js";

const log = scoped("trigger");

// ─── Internal helpers ───────────────────────────────────────

// Run a single effect.
// If it has a scheduler, defer to scheduler; otherwise run immediately.
function _runEffect(effect) {
    if (!effect) return;

    if (typeof effect.scheduler === "function") {
        effect.scheduler();
    } else if (typeof effect.run === "function") {
        effect.run();
    }
}

// Copy a Set<effect> to an array so iteration is safe while running.
// (Effects can subscribe/unsubscribe during re-run.)
function _snapshot(dep) {
    return Array.from(dep);
}

// Accessor for depsMap on target
function _getDepsMap(target) {
    const targetMap = getTargetMap();
    return targetMap.get(target) || null;
}

// ─── Public API ─────────────────────────────────────────────

// Re-run all effects subscribed to target[key].
// Called from inside the reactive Proxy's `set` and `deleteProperty` traps.
function trigger(target, key) {
    const dep = getSubscribers(target, key);

    if (!dep || dep.size === 0) {
        log.debug(`no subscribers for ${String(key)}`);
        return 0;
    }

    const effects = _snapshot(dep);

    effects.forEach(function (effect) {
        _runEffect(effect);
    });

    log.debug(`triggered ${String(key)} (${effects.length} effects)`);
    return effects.length;
}

// Re-run all effects subscribed to any key of target.
// Useful when the whole object is replaced.
function triggerAll(target) {
    const depsMap = _getDepsMap(target);
    if (!depsMap) return 0;

    let total = 0;
    depsMap.forEach(function (dep, key) {
        total += trigger(target, key);
    });
    return total;
}

// Re-run effects subscribed to target[key] with a custom scheduler.
// Forces scheduler path even if effect doesn't have one.
function triggerWith(target, key, scheduler) {
    const dep = getSubscribers(target, key);
    if (!dep || dep.size === 0) return 0;

    const effects = _snapshot(dep);

    effects.forEach(function (effect) {
        if (typeof scheduler === "function") {
            scheduler(effect);
        } else {
            _runEffect(effect);
        }
    });

    return effects.length;
}

export {
    trigger,
    triggerAll,
    triggerWith
};
