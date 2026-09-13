// src/utils/is.js
// Re-export + extend validator from scripts/.
// Do NOT duplicate what already exists.

// ─── Re-exports from scripts/ ──────────────────────────────
export {
    isString,
    isEmpty,
    isLengthValid,
    isNumber,
    isPositive,
    isInRange,
    isElement,
    elementExists,
    isObject,
    isEmptyObject,
    isArray,
    isNonEmptyArray
} from "../../scripts/helpers/validator.js";

// ─── Additional utilities not in scripts/ ──────────────────

// Nil checks
export const isUndefined = (v) => v === undefined;
export const isNull      = (v) => v === null;
export const isNil       = (v) => v === null || v === undefined;

// Other primitives
export const isBoolean = (v) => typeof v === "boolean";
export const isFunction = (v) => typeof v === "function";
export const isSymbol   = (v) => typeof v === "symbol";

// Extended number checks
export const isInteger = (v) => Number.isInteger(v);
export const isFloat   = (v) => typeof v === "number" && !Number.isInteger(v);
export const isNaN     = (v) => Number.isNaN(v);
export const isFinite  = (v) => Number.isFinite(v);

// Extended object & array checks
export const isPlainObject = (v) => {
    if (Object.prototype.toString.call(v) !== "[object Object]") return false;
    const proto = Object.getPrototypeOf(v);
    return proto === null || proto === Object.prototype;
};
export const isEmptyArray = (v) => Array.isArray(v) && v.length === 0;

// Vexorion VNode
export const isVNode = (v) =>
    v !== null && typeof v === "object" &&
    typeof v.type === "string" && Array.isArray(v.children);

// Promise / async
export const isPromise = (v) =>
    v !== null && typeof v === "object" &&
    typeof v.then === "function" && typeof v.catch === "function";

// Deep equality comparator
export const isEqual = (a, b) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
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
