import {
    reset, test, assert, assertEqual,
    summary, banner
} from "../../_assert.js";

// Setup mocks for DOM and Event in Node.js environment
class MockElement {
    constructor() {
        this.nodeType = 1;
    }
}

globalThis.HTMLElement = MockElement;
globalThis.Element = MockElement;
globalThis.document = {
    getElementById(id) {
        return id === "existing-id" ? new MockElement() : null;
    }
};

import {
    // Re-exports from validator.js
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
    isNonEmptyArray,

    // Additions
    isUndefined,
    isNull,
    isNil,
    isBoolean,
    isFunction,
    isSymbol,
    isInteger,
    isFloat,
    isNaN,
    isFinite,
    isPlainObject,
    isEmptyArray,
    isVNode,
    isPromise,
    isEqual
} from "../../../../src/utils/is.js";

export function run() {
    reset();
    banner("src/utils/is.test.js");

    // Re-exports from validator.js
    test("isString", () => {
        assert(isString("hello"));
        assert(isString(""));
        assert(!isString(123));
        assert(!isString(null));
    });

    test("isEmpty", () => {
        assert(isEmpty(""));
        assert(isEmpty("   "));
        assert(isEmpty(null));
        assert(isEmpty(undefined));
        assert(!isEmpty("content"));
    });

    test("isLengthValid", () => {
        assert(isLengthValid("test", 1, 10));
        assert(!isLengthValid("test", 5, 10));
        assert(!isLengthValid("", 1, 10));
    });

    test("isNumber", () => {
        assert(isNumber(123));
        assert(isNumber(0));
        assert(isNumber(-4.5));
        assert(!isNumber(NaN));
        assert(!isNumber("123"));
    });

    test("isPositive", () => {
        assert(isPositive(5));
        assert(!isPositive(0));
        assert(!isPositive(-5));
    });

    test("isInRange", () => {
        assert(isInRange(5, 1, 10));
        assert(isInRange(1, 1, 10));
        assert(isInRange(10, 1, 10));
        assert(!isInRange(0, 1, 10));
        assert(!isInRange(15, 1, 10));
    });

    test("isElement", () => {
        const el = new MockElement();
        assert(isElement(el));
        assert(!isElement({}));
        assert(!isElement(null));
    });

    test("elementExists", () => {
        assert(elementExists("existing-id"));
        assert(!elementExists("non-existing-id"));
    });

    test("isObject", () => {
        assert(isObject({}));
        assert(isObject({ a: 1 }));
        assert(!isObject(null));
        assert(!isObject("str"));
    });

    test("isEmptyObject", () => {
        assert(isEmptyObject({}));
        assert(!isEmptyObject({ a: 1 }));
        assert(!isEmptyObject(null));
    });

    test("isArray and isNonEmptyArray", () => {
        assert(isArray([1, 2]));
        assert(isArray([]));
        assert(!isArray({}));
        assert(isNonEmptyArray([1]));
        assert(!isNonEmptyArray([]));
    });

    // Nil checks
    test("isUndefined", () => {
        assert(isUndefined(undefined));
        assert(!isUndefined(null));
        assert(!isUndefined(0));
        assert(!isUndefined(""));
    });

    test("isNull", () => {
        assert(isNull(null));
        assert(!isNull(undefined));
        assert(!isNull(0));
    });

    test("isNil", () => {
        assert(isNil(null));
        assert(isNil(undefined));
        assert(!isNil(0));
        assert(!isNil(false));
    });

    // Other primitives
    test("isBoolean", () => {
        assert(isBoolean(true));
        assert(isBoolean(false));
        assert(!isBoolean(1));
        assert(!isBoolean("true"));
    });

    test("isFunction", () => {
        assert(isFunction(() => {}));
        assert(isFunction(function() {}));
        assert(!isFunction({}));
    });

    test("isSymbol", () => {
        assert(isSymbol(Symbol("test")));
        assert(!isSymbol("symbol"));
    });

    // Extended number checks
    test("isInteger", () => {
        assert(isInteger(42));
        assert(isInteger(-10));
        assert(!isInteger(3.14));
        assert(!isInteger("42"));
    });

    test("isFloat", () => {
        assert(isFloat(3.14));
        assert(isFloat(-0.01));
        assert(!isFloat(42));
        assert(!isFloat("3.14"));
    });

    test("isNaN and isFinite", () => {
        assert(isNaN(NaN));
        assert(!isNaN(123));
        assert(isFinite(100));
        assert(!isFinite(Infinity));
        assert(!isFinite(-Infinity));
    });

    // Extended object & array checks
    test("isPlainObject", () => {
        assert(isPlainObject({}));
        assert(isPlainObject({ a: 1 }));
        assert(isPlainObject(Object.create(null)));
        assert(!isPlainObject([]));
        assert(!isPlainObject(new Date()));
    });

    test("isEmptyArray", () => {
        assert(isEmptyArray([]));
        assert(!isEmptyArray([1]));
        assert(!isEmptyArray({}));
        assert(!isEmptyArray(""));
    });

    // Vexorion VNode
    test("isVNode", () => {
        const vnode = { type: "div", children: [] };
        assert(isVNode(vnode));
        assert(!isVNode({ type: 123, children: [] }));
        assert(!isVNode({ type: "div", children: null }));
        assert(!isVNode(null));
    });

    // Promise / async
    test("isPromise", () => {
        const promiseObj = { then: () => {}, catch: () => {} };
        assert(isPromise(promiseObj));
        assert(isPromise(Promise.resolve()));
        assert(!isPromise({}));
        assert(!isPromise(null));
    });

    // Deep equality comparator
    test("isEqual deep comparison", () => {
        assert(isEqual(1, 1));
        assert(isEqual("a", "a"));
        assert(isEqual([1, [2, 3]], [1, [2, 3]]));
        assert(!isEqual([1, 2], [1, 3]));
        assert(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));
        assert(!isEqual({ a: 1 }, { a: 2 }));
        assert(!isEqual(1, "1"));
        assert(!isEqual(null, undefined));
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
