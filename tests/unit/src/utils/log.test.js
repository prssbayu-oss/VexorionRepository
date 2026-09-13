import {
    reset, test, assert, assertEqual,
    summary, banner
} from "../../_assert.js";

// Capture console output for testing
const logs = [];
const originalLog = console.log;
const originalGroup = console.group;
const originalGroupEnd = console.groupEnd;

console.log = (...args) => logs.push(args.join(" "));
console.group = () => {};
console.groupEnd = () => {};

const {
    log,
    info,
    warn,
    error,
    debug,
    success,
    group,
    srcDebug,
    srcWarn,
    srcError,
    tagged,
    scoped
} = await import("../../../../src/utils/log.js");

export function run() {
    reset();
    banner("src/utils/log.test.js");

    // Re-exports from scripts/helpers/logger.js
    test("re-exported logger functions should be defined", () => {
        assertEqual(typeof log, "function");
        assertEqual(typeof info, "function");
        assertEqual(typeof warn, "function");
        assertEqual(typeof error, "function");
        assertEqual(typeof debug, "function");
        assertEqual(typeof success, "function");
        assertEqual(typeof group, "function");
    });

    test("srcDebug should output with [src] prefix and [DEBUG] level", () => {
        logs.length = 0;
        srcDebug("debugging src component");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("[DEBUG]"));
        assert(logs[0].includes("[src] debugging src component"));
    });

    test("srcWarn should output with [src] prefix and [WARN] level", () => {
        logs.length = 0;
        srcWarn("warning in src component");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("[WARN]"));
        assert(logs[0].includes("[src] warning in src component"));
    });

    test("srcError should output with [src] prefix and [ERROR] level", () => {
        logs.length = 0;
        srcError("error in src component");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("[ERROR]"));
        assert(logs[0].includes("[src] error in src component"));
    });

    test("tagged should output with [src][tag] format", () => {
        logs.length = 0;
        tagged("reactive", "dependency triggered");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("[DEBUG]"));
        assert(logs[0].includes("[src][reactive] dependency triggered"));
    });

    test("scoped should create an object with module-tagged logger methods", () => {
        const logger = scoped("renderer");
        assertEqual(typeof logger.debug, "function");
        assertEqual(typeof logger.warn, "function");
        assertEqual(typeof logger.error, "function");

        logs.length = 0;
        logger.debug("render pass started");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("[src][renderer] render pass started"));

        logs.length = 0;
        logger.warn("unkeyed node detected");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("[src][renderer] unkeyed node detected"));

        logs.length = 0;
        logger.error("patching failed");
        assertEqual(logs.length, 1);
        assert(logs[0].includes("[src][renderer] patching failed"));
    });

    // Restore console methods after running tests
    console.log = originalLog;
    console.group = originalGroup;
    console.groupEnd = originalGroupEnd;

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
