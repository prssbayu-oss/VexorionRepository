import { debug, error as logError, info } from "./logger.js";

// Storage key prefix to avoid collisions
const prefix = "vexorion_";

// Save value to localStorage
function set(key, value) {
    try {
        localStorage.setItem(prefix + key, JSON.stringify(value));
        debug(`Storage saved: ${key}`);
        return true;
    } catch (err) {
        logError(`Storage set failed: ${err.message}`);
        return false;
    }
}

// Retrieve value from localStorage
function get(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(prefix + key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
        logError(`Storage get failed: ${err.message}`);
        return defaultValue;
    }
}

// Remove a single key
function remove(key) {
    localStorage.removeItem(prefix + key);
    debug(`Storage removed: ${key}`);
}

// Clear all app storage keys
function clear() {
    Object.keys(localStorage)
        .filter(k => k.startsWith(prefix))
        .forEach(k => localStorage.removeItem(k));
    info("All app storage cleared");
}

// Check if key exists
function has(key) {
    return localStorage.getItem(prefix + key) !== null;
}

export { set, get, remove, clear, has };
