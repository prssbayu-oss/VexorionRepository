import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

import {
    upper, lower, capitalize, titleCase,
    withPrefix, outputMessage, truncate,
    number, bytes, userLabel
} from "../../scripts/helpers/formatter.js";

export function run() {
    reset();
    banner("formatter.test.js");

    test("upper('hello') should return 'HELLO'", () => {
        assertEqual(upper("hello"), "HELLO");
    });

    test("lower('HELLO') should return 'hello'", () => {
        assertEqual(lower("HELLO"), "hello");
    });

    test("upper should handle numbers", () => {
        assertEqual(upper(123), "123");
    });

    test("capitalize('hello') should return 'Hello'", () => {
        assertEqual(capitalize("hello"), "Hello");
    });

    test("capitalize('HELLO') should return 'Hello'", () => {
        assertEqual(capitalize("HELLO"), "Hello");
    });

    test("titleCase('hello world') should return 'Hello World'", () => {
        assertEqual(titleCase("hello world"), "Hello World");
    });

    test("titleCase should handle multiple words", () => {
        assertEqual(titleCase("foo bar baz"), "Foo Bar Baz");
    });

    test("withPrefix('⚡', 'Vexorion') should combine values", () => {
        assertEqual(withPrefix("⚡", "Vexorion"), "⚡ Vexorion");
    });

    test("outputMessage should be formatted correctly", () => {
        const msg = outputMessage("Vexorion", "Test tagline");
        assert(msg.includes("Vexorion"), "Should include app name");
        assert(msg.includes("⚡"), "Should include ⚡ prefix");
        assert(msg.includes("Test tagline"), "Should include tagline");
    });

    test("truncate should not modify short text", () => {
        assertEqual(truncate("Hello", 10), "Hello");
    });

    test("truncate should shorten long text", () => {
        const result = truncate("Hello World Foo Bar", 10);
        assertEqual(result, "Hello W...");
        assertEqual(result.length, 10);
    });

    test("number(3.14159, 2) should return '3.14'", () => {
        assertEqual(number(3.14159, 2), "3.14");
    });

    test("bytes(512) should return '512 B'", () => {
        assertEqual(bytes(512), "512 B");
    });

    test("bytes(2048) should return '2.0 KB'", () => {
        assertEqual(bytes(2048), "2.0 KB");
    });

    test("bytes(1048576) should return '1.0 MB'", () => {
        assertEqual(bytes(1048576), "1.0 MB");
    });

    test("userLabel should format name and email", () => {
        const user = { name: "Alice", email: "alice@test.com" };
        assertEqual(userLabel(user), "Alice — alice@test.com");
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
