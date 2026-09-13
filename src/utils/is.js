// src/utils/is.js
// Type check utilities.
// Private helpers at top, public API at bottom.

// ─── Private helpers ────────────────────────────────────────

// Get internal [[Class]] tag: [object Xxx] → Xxx
const _typeTag = (value) =>
    Object.prototype.toString.call(value).slice(8, -1);

// Check if value has a callable constructor (for class detection)
const _hasConstructor = (value) =>
    typeof value === "object" && value !== null && typeof value.constructor === "function";

// Check if value is a primitive (string, number, boolean, symbol, bigint)
const _isPrimitive = (value) => {
    if (value === null) return true;
    const t = typeof value;
    return t === "string" || t === "number" || t === "boolean" ||
           t === "symbol" || t === "bigint" || t === "undefined";
};

// Check if value is non-null and non-undefined
const _isDefined = (value) => value !== null && value !== undefined;

// ─── Public API ─────────────────────────────────────────────

// Undefined / null
const isUndefined = (v) => v === undefined;
const isNull      = (v) => v === null;
const isNil       = (v) => v === null || v === undefined;

// Primitives
const isString  = (v) => typeof v === "string";
const isNumber  = (v) => typeof v === "number" && !Number.isNaN(v);
const isBoolean = (v) => typeof v === "boolean";
const isSymbol  = (v) => typeof v === "symbol";
const isBigInt  = (v) => typeof v === "bigint";
const isFunction = (v) => typeof v === "function";
const isPrimitive = _isPrimitive;

// Numbers
const isInteger  = (v) => Number.isInteger(v);
const isFloat    = (v) => isNumber(v) && !Number.isInteger(v);
const isPositive = (v) => isNumber(v) && v > 0;
const isNegative = (v) => isNumber(v) && v < 0;
const isNaN      = (v) => Number.isNaN(v);
const isFinite   = (v) => Number.isFinite(v);

// Objects / arrays
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isPlainObject = (v) => {
    if (_typeTag(v) !== "Object") return false;
    const proto = Object.getPrototypeOf(v);
    return proto === null || proto === Object.prototype;
};
const isArray = Array.isArray;
const isNonEmptyArray = (v) => isArray(v) && v.length > 0;
const isEmptyArray = (v) => isArray(v) && v.length === 0;

// Empty checks
const isEmptyString  = (v) => isString(v) && v.trim().length === 0;
const isEmptyObject  = (v) => isObject(v) && Object.keys(v).length === 0;
const isEmpty = (v) => {
    if (v === null || v === undefined) return true;
    if (isString(v) || isArray(v)) return v.length === 0;
    if (isObject(v)) return Object.keys(v).length === 0;
    return false;
};

// DOM
const isElement  = (v) => v instanceof HTMLElement;
const isNode     = (v) => v instanceof Node;
const isSVG      = (v) => v instanceof SVGElement;

// Vexorion vnode
const isVNode = (v) =>
    isObject(v) && isString(v.type) && isArray(v.children);

// Event
const isEvent = (v) => v instanceof Event;

// Promise / async
const isPromise = (v) =>
    isObject(v) && isFunction(v.then) && isFunction(v.catch);

// Reference type helpers
const isDefined  = _isDefined;
const isTruthy   = (v) => Boolean(v);
const isFalsy    = (v) => !v;

// Comparators
const isEqual = (a, b) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return false;
    if (isArray(a) && isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, i) => isEqual(item, b[i]));
    }
    if (isPlainObject(a) && isPlainObject(b)) {
        const ka = Object.keys(a);
        const kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        return ka.every(k => isEqual(a[k], b[k]));
    }
    return false;
};

const isEqualShallow = (a, b) => {
    if (a === b) return true;
    if (!isObject(a) || !isObject(b)) return false;
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every(k => a[k] === b[k]);
};

// Export public API
export {
    // Nullish
    isUndefined, isNull, isNil, isDefined,
    // Primitives
    isString, isNumber, isBoolean, isSymbol, isBigInt,
    isFunction, isPrimitive, isTruthy, isFalsy,
    // Numbers
    isInteger, isFloat, isPositive, isNegative, isNaN, isFinite,
    // Objects / arrays
    isObject, isPlainObject, isArray,
    isNonEmptyArray, isEmptyArray,
    // Empty checks
    isEmpty, isEmptyString, isEmptyObject,
    // DOM
    isElement, isNode, isSVG,
    // Vexorion
    isVNode,
    // Event / promise
    isEvent, isPromise,
    // Comparators
    isEqual, isEqualShallow
};
