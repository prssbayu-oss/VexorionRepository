// src/utils/log.js
// Internal logger for src/ modules.
// Re-exports scripts/helpers/logger.js AND adds src-scoped logging.

// ─── Re-exports from scripts/ ──────────────────────────────
export {
    log,
    info,
    warn,
    error,
    debug,
    success,
    group
} from "../../scripts/helpers/logger.js";

// Also import for internal usage
import {
    debug as scriptDebug,
    warn as scriptWarn,
    error as scriptError
} from "../../scripts/helpers/logger.js";

// ─── Internal prefix for src/ ──────────────────────────────

const SRC_PREFIX = "[src]";

// Debug log specifically for src/ — automatically prefixed with [src]
function srcDebug(message) {
    scriptDebug(`${SRC_PREFIX} ${message}`);
}

// Warning log specifically for src/ — automatically prefixed with [src]
function srcWarn(message) {
    scriptWarn(`${SRC_PREFIX} ${message}`);
}

// Error log specifically for src/ — automatically prefixed with [src]
function srcError(message) {
    scriptError(`${SRC_PREFIX} ${message}`);
}

// Log with module tag — e.g. "reactive", "renderer", "component"
function tagged(tag, message) {
    scriptDebug(`${SRC_PREFIX}[${tag}] ${message}`);
}

// Create module-scoped logger — call once, reuse across module
function scoped(tag) {
    return {
        debug: function (msg) { scriptDebug(`${SRC_PREFIX}[${tag}] ${msg}`); },
        warn:  function (msg) { scriptWarn(`${SRC_PREFIX}[${tag}] ${msg}`); },
        error: function (msg) { scriptError(`${SRC_PREFIX}[${tag}] ${msg}`); }
    };
}

export {
    srcDebug,
    srcWarn,
    srcError,
    tagged,
    scoped
};
