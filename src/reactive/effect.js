// src/reactive/effect.js
// Effect runner — re-executes a function when its dependencies change.
// Depends on: src/reactive/stack.js, src/utils/log.js

import { pushEffect, popEffect, getStackDepth } from "./stack.js";
import { scoped } from "../utils/log.js";

const log = scoped("effect");

// ─── Internal state ─────────────────────────────────────────

// All active effects (for global cleanup and devtools)
const activeEffects = new Set();

// Unique id counter (for debugging)
let effectIdCounter = 0;

// ─── Internal helpers ───────────────────────────────────────

// Wrap the user function so dependencies are tracked while it runs.
function _makeRunner(fn, id) {
    function runner() {
        return fn();
    }
    runner.__effectId = id;
    return runner;
}

// Execute the effect function while pushing it onto the stack.
function _execute(wrapped, fn) {
    try {
        pushEffect(wrapped);
        const result = fn();
        return result;
    } finally {
        popEffect();
    }
}

// ─── Public API ─────────────────────────────────────────────

// Create an effect.
//   fn         — function to run
//   options    — { scheduler, lazy, name }
//
// Returns a runner object with:
//   .run()       — re-run the effect manually
//   .stop()      — unregister the effect
//   .id          — unique id
//   .name        — optional label
//   .active      — true while not stopped
function effect(fn, options) {
    options = options || {};

    if (typeof fn !== "function") {
        log.warn("effect() expects a function");
        return null;
    }

    const id = ++effectIdCounter;
    const name = options.name || `effect#${id}`;
    const scheduler = options.scheduler || null;

    // The wrapped function that will be pushed onto the stack.
    // Also serves as the "effect" identifier inside track.js.
    const wrapped = _makeRunner(fn, id);
    wrapped.scheduler = scheduler;
    try {
        Object.defineProperty(wrapped, "name", { value: name, configurable: true });
    } catch {
        wrapped.effectName = name;
    }

    // Create the public runner object
    const runner = {
        id,
        name,
        active: true,
        scheduler,
        run: function () {
            if (!runner.active) {
                log.warn(`${name} is stopped, skip run`);
                return undefined;
            }
            log.debug(`${name} running (depth ${getStackDepth()})`);
            return _execute(wrapped, fn);
        },
        stop: function () {
            if (!runner.active) return;
            runner.active = false;
            activeEffects.delete(runner);
            log.debug(`${name} stopped`);
        }
    };

    // Keep the link between wrapped and runner so scheduler can call run()
    wrapped.run = runner.run;
    wrapped.stop = runner.stop;

    activeEffects.add(runner);

    // Run immediately unless lazy
    if (!options.lazy) {
        runner.run();
    }

    log.debug(`${name} created`);
    return runner;
}

// Stop and clear all active effects (usually in tests)
function stopAllEffects() {
    activeEffects.forEach(function (runner) {
        runner.active = false;
    });
    activeEffects.clear();
    log.debug("all effects stopped");
}

// Get a snapshot of active effects (read-only)
function getActiveEffects() {
    return Array.from(activeEffects);
}

// Count active effects
function activeEffectCount() {
    return activeEffects.size;
}

export {
    effect,
    stopAllEffects,
    getActiveEffects,
    activeEffectCount
};
