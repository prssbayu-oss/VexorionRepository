import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

import {
    isString, isEmpty, isLengthValid,
    isNumber, isPositive, isInRange,
    isObject, isEmptyObject,
    isArray, isNonEmptyArray
} from "../../scripts/helpers/validator.js";

export function run() {
    reset();
    banner("validator.test.js");

    test("isString('abc') should return true", () => {
        assert(isString("abc"));
    });

    test("isString(123) should return false", () => {
        assert(!isString(123));
    });

    test("isEmpty('') should return true", () => {
        assert(isEmpty(""));
    });

    test("isEmpty('   ') should return true", () => {
        assert(isEmpty("   "));
    });

    test("isEmpty('abc') should return false", () => {
        assert(!isEmpty("abc"));
    });

    test("isLengthValid('abc', 1, 5) should return true", () => {
        assert(isLengthValid("abc", 1, 5));
    });

    test("isLengthValid('abcdef', 1, 5) should return false", () => {
        assert(!isLengthValid("abcdef", 1, 5));
    });

    test("isNumber(42) should return true", () => {
        assert(isNumber(42));
    });

    test("isNumber('42') should return false", () => {
        assert(!isNumber("42"));
    });

    test("isNumber(NaN) should return false", () => {
        assert(!isNumber(NaN));
    });

    test("isPositive(5) should return true", () => {
        assert(isPositive(5));
    });

    test("isPositive(-5) should return false", () => {
        assert(!isPositive(-5));
    });

    test("isPositive(0) should return false", () => {
        assert(!isPositive(0));
    });

    test("isInRange(5, 1, 10) should return true", () => {
        assert(isInRange(5, 1, 10));
    });

    test("isInRange(11, 1, 10) should return false", () => {
        assert(!isInRange(11, 1, 10));
    });

    test("isObject({}) should return true", () => {
        assert(isObject({}));
    });

    test("isObject(null) should return false", () => {
        assert(!isObject(null));
    });

    test("isEmptyObject({}) should return true", () => {
        assert(isEmptyObject({}));
    });

    test("isEmptyObject({a:1}) should return false", () => {
        assert(!isEmptyObject({ a: 1 }));
    });

    test("isArray([]) should return true", () => {
        assert(isArray([]));
    });

    test("isNonEmptyArray([1,2]) should return true", () => {
        assert(isNonEmptyArray([1, 2]));
    });

    test("isNonEmptyArray([]) should return false", () => {
        assert(!isNonEmptyArray([]));
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
