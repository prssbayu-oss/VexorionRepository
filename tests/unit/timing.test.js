import {
    reset, test, testAsync, assert, assertEqual,
    summary, banner
} from "./_assert.js";

import {
    delay, debounce, throttle, format
} from "../../scripts/helpers/timing.js";

export async function run() {
    reset();
    banner("timing.test.js");

    await testAsync("delay(50) should resolve in ~50ms", async () => {
        const start = Date.now();
        await delay(50);
        const elapsed = Date.now() - start;
        assert(elapsed >= 45, `Elapsed ${elapsed}ms should be >= 45`);
        assert(elapsed < 100, `Elapsed ${elapsed}ms should be < 100`);
    });

    await testAsync("delay(0) should still resolve", async () => {
        await delay(0);
        assert(true, "Resolved successfully");
    });

    test("debounce should return a function", () => {
        const fn = debounce(() => {}, 100);
        assertEqual(typeof fn, "function");
    });

    await testAsync("debounce should call only once", async () => {
        let callCount = 0;
        const fn = debounce(() => callCount++, 50);
        fn(); fn(); fn(); fn(); fn();
        await delay(80);
        assertEqual(callCount, 1, "Should be called exactly once");
    });

    test("throttle should return a function", () => {
        const fn = throttle(() => {}, 100);
        assertEqual(typeof fn, "function");
    });

    await testAsync("throttle should limit call frequency", async () => {
        let callCount = 0;
        const fn = throttle(() => callCount++, 100);
        fn(); fn(); fn();
        await delay(50);
        assertEqual(callCount, 1, "Should be called once within window");
    });

    test("format(500) should return '500ms'", () => {
        assertEqual(format(500), "500ms");
    });

    test("format(1500) should return '1.50s'", () => {
        assertEqual(format(1500), "1.50s");
    });

    test("format(2000) should return '2.00s'", () => {
        assertEqual(format(2000), "2.00s");
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
