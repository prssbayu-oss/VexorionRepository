// src/reactive/stack.js
// Effect stack — tracks which effect is currently running.
// Lowest-level module in reactive/. Depends on nothing.

// ─── Internal state ─────────────────────────────────────────

// The stack of currently-executing effects.
// Top of stack = the effect that is running right now.
const effectStack = [];

// ─── Public API ─────────────────────────────────────────────

// Push an effect onto the stack (called when effect starts)
function pushEffect(effect) {
    effectStack.push(effect);
}

// Pop the top effect from the stack (called when effect ends)
function popEffect() {
    return effectStack.pop();
}

// Peek: get the currently active effect without removing it
function getActiveEffect() {
    return effectStack[effectStack.length - 1];
}

// Get the full stack (read-only copy, for debugging)
function getStackSnapshot() {
    return effectStack.slice();
}

// Get current depth (useful for nested effect detection)
function getStackDepth() {
    return effectStack.length;
}

// Check if we're inside an effect currently
function isInsideEffect() {
    return effectStack.length > 0;
}

// Clear the entire stack (emergency reset, mostly for tests)
function clearStack() {
    effectStack.length = 0;
}

export {
    pushEffect,
    popEffect,
    getActiveEffect,
    getStackSnapshot,
    getStackDepth,
    isInsideEffect,
    clearStack
};
