import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

// Capture console output for testing
const logs = [];
const originalLog = console.log;
const originalGroup = console.group;
const originalGroupEnd = console.groupEnd;

console.log = (...args) => logs.push(args.join(" "));
console.group = () => {};
console.groupEnd = () => {};

const { log, info, warn, error, debug, success, group } =
    await import("../../scripts/helpers/logger.js");

export function run() {
    reset();
    banner("logger.test.js");

    test("info() should write to console", () => {
        logs.length = 0;
        info("test message");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("test message"));
    });

    test("info() should include INFO level", () => {
        logs.length = 0;
        info("hello");
        assert(logs[0].includes("INFO"), "Should include INFO level");
    });

    test("error() should include ERROR level", () => {
        logs.length = 0;
        error("oops");
        assert(logs[0].includes("ERROR"));
    });

    test("warn() should include WARN level", () => {
        logs.length = 0;
        warn("warning");
        assert(logs[0].includes("WARN"));
    });

    test("success() should include SUCCESS level", () => {
        logs.length = 0;
        success("done");
        assert(logs[0].includes("SUCCESS"));
    });

    test("debug() should include DEBUG level", () => {
        logs.length = 0;
        debug("debugging");
        assert(logs[0].includes("DEBUG"));
    });

    test("log() should work with custom level", () => {
        logs.length = 0;
        log("custom", "INFO");
        assert(logs[0].includes("custom"));
    });

    test("info() should use ℹ️ emoji", () => {
        logs.length = 0;
        info("test");
        assert(logs[0].includes("ℹ️"));
    });

    test("success() should use ✅ emoji", () => {
        logs.length = 0;
        success("test");
        assert(logs[0].includes("✅"));
    });

    test("error() should use ❌ emoji", () => {
        logs.length = 0;
        error("test");
        assert(logs[0].includes("❌"));
    });

    const result = summary();

    // Restore console
    console.log = originalLog;
    console.group = originalGroup;
    console.groupEnd = originalGroupEnd;

    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
