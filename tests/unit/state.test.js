import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

import { state } from "../../scripts/data/state.js";
import { AppStatus } from "../../scripts/core/enums.js";

export function run() {
    reset();
    banner("state.test.js");

    test("Initial status should be LOADING", () => {
        assertEqual(state.status, AppStatus.LOADING);
    });

    test("Initial clickCount should be 0", () => {
        assertEqual(state.clickCount, 0);
    });

    test("Initial loadCount should be 0", () => {
        assertEqual(state.loadCount, 0);
    });

    test("Initial dataLoadCount should be 0", () => {
        assertEqual(state.dataLoadCount, 0);
    });

    test("Initial users should be empty array", () => {
        assert(Array.isArray(state.users), "users should be an array");
        assertEqual(state.users.length, 0);
    });

    test("startTime should be a valid timestamp", () => {
        assert(typeof state.startTime === "number", "startTime should be a number");
        assert(state.startTime > 0, "startTime should be greater than 0");
    });

    test("State flags should be booleans", () => {
        assertEqual(typeof state.isAnimating, "boolean");
        assertEqual(typeof state.isLoading, "boolean");
        assertEqual(typeof state.hasError, "boolean");
    });

    test("State should be mutable", () => {
        state.clickCount = 42;
        assertEqual(state.clickCount, 42);
        state.clickCount = 0;
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
