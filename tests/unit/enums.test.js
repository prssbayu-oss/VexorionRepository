import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

import {
    Theme, AppStatus, LogLevel, AnimationType
} from "../../scripts/core/enums.js";

export function run() {
    reset();
    banner("enums.test.js");

    test("Theme should have DARK, LIGHT, AUTO", () => {
        assertEqual(Theme.DARK, "dark");
        assertEqual(Theme.LIGHT, "light");
        assertEqual(Theme.AUTO, "auto");
    });

    test("AppStatus should have correct values", () => {
        assertEqual(AppStatus.LOADING, "loading");
        assertEqual(AppStatus.READY, "ready");
        assertEqual(AppStatus.ERROR, "error");
        assertEqual(AppStatus.IDLE, "idle");
    });

    test("LogLevel values should be uppercase", () => {
        Object.values(LogLevel).forEach(v => {
            assertEqual(v, v.toUpperCase(), `${v} should be uppercase`);
        });
    });

    test("AnimationType should have FADE_IN", () => {
        assertEqual(AnimationType.FADE_IN, "fadeIn");
    });

    test("All enums should be frozen (immutable)", () => {
        assert(Object.isFrozen(Theme), "Theme should be frozen");
        assert(Object.isFrozen(AppStatus), "AppStatus should be frozen");
        assert(Object.isFrozen(LogLevel), "LogLevel should be frozen");
        assert(Object.isFrozen(AnimationType), "AnimationType should be frozen");
    });

    test("Enums should not be modifiable", () => {
        try {
            Theme.DARK = "modified";
        } catch (err) {
            // Silent fail in strict mode
        }
        assertEqual(Theme.DARK, "dark", "Theme should remain unchanged");
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
