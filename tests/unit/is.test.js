import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

// Setup mocks for DOM and Event in Node.js environment
class MockNode {}
class MockElement extends MockNode {}
class MockSVGElement extends MockElement {}
class MockEvent {}

globalThis.Node = MockNode;
globalThis.HTMLElement = MockElement;
globalThis.SVGElement = MockSVGElement;
globalThis.Event = MockEvent;

import {
    isUndefined, isNull, isNil, isDefined,
    isString, isNumber, isBoolean, isSymbol, isBigInt,
    isFunction, isPrimitive, isTruthy, isFalsy,
    isInteger, isFloat, isPositive, isNegative, isNaN, isFinite,
    isObject, isPlainObject, isArray,
    isNonEmptyArray, isEmptyArray,
    isEmpty, isEmptyString, isEmptyObject,
    isElement, isNode, isSVG,
    isVNode,
    isEvent, isPromise,
    isEqual, isEqualShallow
} from "../../src/utils/is.js";

export function run() {
    reset();
    banner("is.test.js");

    // Undefined / null
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

    test("isDefined", () => {
        assert(isDefined(0));
        assert(isDefined(""));
        assert(isDefined(false));
        assert(!isDefined(null));
        assert(!isDefined(undefined));
    });

    // Primitives
    test("isString", () => {
        assert(isString("hello"));
        assert(isString(""));
        assert(!isString(123));
        assert(!isString(null));
    });

    test("isNumber", () => {
        assert(isNumber(123));
        assert(isNumber(0));
        assert(isNumber(-4.5));
        assert(!isNumber(NaN));
        assert(!isNumber("123"));
    });

    test("isBoolean", () => {
        assert(isBoolean(true));
        assert(isBoolean(false));
        assert(!isBoolean(1));
        assert(!isBoolean("true"));
    });

    test("isSymbol", () => {
        assert(isSymbol(Symbol("test")));
        assert(!isSymbol("symbol"));
    });

    test("isBigInt", () => {
        assert(isBigInt(10n));
        assert(!isBigInt(10));
    });

    test("isFunction", () => {
        assert(isFunction(() => {}));
        assert(isFunction(function() {}));
        assert(!isFunction({}));
    });

    test("isPrimitive", () => {
        assert(isPrimitive("str"));
        assert(isPrimitive(123));
        assert(isPrimitive(true));
        assert(isPrimitive(null));
        assert(isPrimitive(undefined));
        assert(isPrimitive(Symbol("s")));
        assert(isPrimitive(10n));
        assert(!isPrimitive({}));
        assert(!isPrimitive([]));
        assert(!isPrimitive(() => {}));
    });

    test("isTruthy and isFalsy", () => {
        assert(isTruthy(1));
        assert(isTruthy("yes"));
        assert(isTruthy({}));
        assert(isFalsy(0));
        assert(isFalsy(""));
        assert(isFalsy(null));
        assert(isFalsy(undefined));
        assert(isFalsy(false));
    });

    // Numbers
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

    test("isPositive and isNegative", () => {
        assert(isPositive(5));
        assert(!isPositive(0));
        assert(!isPositive(-5));
        assert(isNegative(-5));
        assert(!isNegative(0));
        assert(!isNegative(5));
    });

    test("isNaN and isFinite", () => {
        assert(isNaN(NaN));
        assert(!isNaN(123));
        assert(isFinite(100));
        assert(!isFinite(Infinity));
        assert(!isFinite(-Infinity));
    });

    // Objects / arrays
    test("isObject", () => {
        assert(isObject({}));
        assert(isObject({ a: 1 }));
        assert(!isObject([]));
        assert(!isObject(null));
        assert(!isObject("obj"));
    });

    test("isPlainObject", () => {
        assert(isPlainObject({}));
        assert(isPlainObject({ a: 1 }));
        assert(isPlainObject(Object.create(null)));
        assert(!isPlainObject([]));
        assert(!isPlainObject(new Date()));
    });

    test("isArray, isNonEmptyArray, isEmptyArray", () => {
        assert(isArray([1, 2]));
        assert(isNonEmptyArray([1]));
        assert(!isNonEmptyArray([]));
        assert(isEmptyArray([]));
        assert(!isEmptyArray([1]));
    });

    // Empty checks
    test("isEmpty", () => {
        assert(isEmpty(null));
        assert(isEmpty(undefined));
        assert(isEmpty(""));
        assert(!isEmpty("hello"));
        assert(isEmpty([]));
        assert(!isEmpty([1]));
        assert(isEmpty({}));
        assert(!isEmpty({ a: 1 }));
        assert(!isEmpty(123));
    });

    test("isEmptyString", () => {
        assert(isEmptyString(""));
        assert(isEmptyString("   "));
        assert(!isEmptyString("abc"));
        assert(!isEmptyString(null));
    });

    test("isEmptyObject", () => {
        assert(isEmptyObject({}));
        assert(!isEmptyObject({ a: 1 }));
        assert(!isEmptyObject([]));
    });

    // DOM / Node / SVG
    test("isElement, isNode, isSVG", () => {
        const el = new MockElement();
        const node = new MockNode();
        const svg = new MockSVGElement();

        assert(isElement(el));
        assert(isElement(svg));
        assert(!isElement(node));
        assert(isNode(node));
        assert(isNode(el));
        assert(isSVG(svg));
        assert(!isSVG(el));
    });

    // Vexorion vnode
    test("isVNode", () => {
        const vnode = { type: "div", children: [] };
        assert(isVNode(vnode));
        assert(!isVNode({ type: 123, children: [] }));
        assert(!isVNode({ type: "div", children: null }));
        assert(!isVNode(null));
    });

    // Event and Promise
    test("isEvent and isPromise", () => {
        assert(isEvent(new MockEvent()));
        assert(!isEvent({}));

        const promise = { then: () => {}, catch: () => {} };
        assert(isPromise(promise));
        assert(isPromise(Promise.resolve()));
        assert(!isPromise({}));
    });

    // Comparators
    test("isEqual deep comparison", () => {
        assert(isEqual(1, 1));
        assert(isEqual("a", "a"));
        assert(isEqual([1, [2, 3]], [1, [2, 3]]));
        assert(!isEqual([1, 2], [1, 3]));
        assert(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));
        assert(!isEqual({ a: 1 }, { a: 2 }));
    });

    test("isEqualShallow comparison", () => {
        assert(isEqualShallow(1, 1));
        assert(isEqualShallow({ a: 1, b: 2 }, { a: 1, b: 2 }));
        const inner = { c: 3 };
        assert(isEqualShallow({ a: inner }, { a: inner }));
        assert(!isEqualShallow({ a: { c: 3 } }, { a: { c: 3 } }));
        assert(!isEqualShallow({ a: 1 }, { a: 1, b: 2 }));
        assert(!isEqualShallow({ a: 1 }, "not an object"));
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
