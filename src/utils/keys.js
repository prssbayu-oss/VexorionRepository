// src/utils/keys.js
// Key utilities for vnode diffing and object comparison.
// Depends on: src/utils/is.js (isObject, isArray, isString, isNil)

import { isObject, isArray, isString, isNil } from "./is.js";

// ─── Key normalization ──────────────────────────────────────

// Normalize a key value to string form (or null if absent)
function normalizeKey(key) {
    if (isNil(key)) return null;
    if (isString(key)) return key;
    if (typeof key === "number") return String(key);
    if (typeof key === "boolean") return String(key);
    return null;
}

// Check if two keys are equal (after normalization)
function isSameKey(a, b) {
    return normalizeKey(a) === normalizeKey(b);
}

// ─── List key extraction ────────────────────────────────────

// Extract the "key" prop from a vnode (or return index fallback)
function getVNodeKey(vnode, index) {
    if (!isObject(vnode)) return null;
    if (!isNil(vnode.key)) return normalizeKey(vnode.key);
    if (isObject(vnode.props) && !isNil(vnode.props.key)) {
        return normalizeKey(vnode.props.key);
    }
    return index !== undefined ? String(index) : null;
}

// Extract keys from an array of vnodes
function extractKeys(vnodes) {
    if (!isArray(vnodes)) return [];
    return vnodes.map(function (vnode, i) {
        return getVNodeKey(vnode, i);
    });
}

// ─── Keyed list diffing ─────────────────────────────────────

// Build a map: key → vnode (for keyed reconciliation)
function buildKeyMap(vnodes) {
    if (!isArray(vnodes)) return new Map();

    const map = new Map();
    vnodes.forEach(function (vnode, i) {
        const key = getVNodeKey(vnode, i);
        if (key !== null) {
            map.set(key, vnode);
        }
    });
    return map;
}

// Compare old and new key lists.
// Returns { added, removed, kept, moved } arrays of keys.
function diffKeys(oldKeys, newKeys) {
    const oldArr = isArray(oldKeys) ? oldKeys : [];
    const newArr = isArray(newKeys) ? newKeys : [];

    const oldSet = new Set(oldArr);
    const newSet = new Set(newArr);

    const added = newArr.filter(function (k) {
        return !oldSet.has(k);
    });

    const removed = oldArr.filter(function (k) {
        return !newSet.has(k);
    });

    const kept = newArr.filter(function (k) {
        return oldSet.has(k);
    });

    // Detect moves: keys that exist in both but changed position
    const moved = [];
    for (let i = 0; i < newArr.length; i++) {
        const key = newArr[i];
        if (!oldSet.has(key)) continue;
        const oldIndex = oldArr.indexOf(key);
        if (oldIndex !== i) {
            moved.push({ key, from: oldIndex, to: i });
        }
    }

    return { added, removed, kept, moved };
}

// ─── Object key utilities ───────────────────────────────────

// Get own enumerable keys of an object (safe for null)
function ownKeys(obj) {
    if (!isObject(obj)) return [];
    return Object.keys(obj);
}

// Get union of keys from multiple objects
function unionKeys() {
    const set = new Set();
    for (let i = 0; i < arguments.length; i++) {
        const obj = arguments[i];
        if (!isObject(obj)) continue;
        Object.keys(obj).forEach(function (k) { set.add(k); });
    }
    return Array.from(set);
}

// Get intersection of keys between two objects
function intersectKeys(a, b) {
    if (!isObject(a) || !isObject(b)) return [];
    const keysB = new Set(Object.keys(b));
    return Object.keys(a).filter(function (k) {
        return keysB.has(k);
    });
}

// Get difference of keys (in a, not in b)
function diffObjectKeys(a, b) {
    if (!isObject(a)) return [];
    const keysB = isObject(b) ? new Set(Object.keys(b)) : new Set();
    return Object.keys(a).filter(function (k) {
        return !keysB.has(k);
    });
}

export {
    normalizeKey,
    isSameKey,
    getVNodeKey,
    extractKeys,
    buildKeyMap,
    diffKeys,
    ownKeys,
    unionKeys,
    intersectKeys,
    diffObjectKeys
};
