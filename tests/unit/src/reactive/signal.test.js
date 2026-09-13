import {
    reset, test, assert, assertEqual,
    summary, banner
} from "../../_assert.js";

import { clearStack } from "../../../../src/reactive/stack.js";
import { effect, stopAllEffects } from "../../../../src/reactive/effect.js";
import {
    signal,
    isSignal,
    read,
    write
} from "../../../../src/reactive/signal.js";

export async function run() {
    reset();
    banner("src/reactive/signal.test.js");

    clearStack();
    stopAllEffects();

    test("signal initialization and isSignal predicate", () => {
        const count = signal(10);
        assertEqual(isSignal(count), true);
        assertEqual(isSignal(null), false);
        assertEqual(isSignal(42), false);
        assertEqual(isSignal({}), false);
        assertEqual(count.get(), 10);
    });

    test("signal.set updates value and returns new value", () => {
        const count = signal(0);
        const result = count.set(5);
        assertEqual(result, 5);
        assertEqual(count.get(), 5);
    });

    test("signal.update updates using updater function", () => {
        const count = signal(2);
        const res = count.update(prev => prev * 3);
        assertEqual(res, 6);
        assertEqual(count.get(), 6);

        // Invalid updater returns current value
        const resInvalid = count.update("not a function");
        assertEqual(resInvalid, 6);
    });

    test("signal.peek reads value without tracking", () => {
        const count = signal(100);
        let runs = 0;

        const runner = effect(() => {
            runs++;
            const _ = count.peek();
        });

        assertEqual(runs, 1);

        count.set(200);
        assertEqual(runs, 1); // Should NOT re-run

        runner.stop();
    });

    test("signal triggers effect when get() is called inside effect", () => {
        const count = signal(1);
        let runs = 0;
        let value = null;

        const runner = effect(() => {
            runs++;
            value = count.get();
        });

        assertEqual(runs, 1);
        assertEqual(value, 1);

        count.set(2);
        assertEqual(runs, 2);
        assertEqual(value, 2);

        runner.stop();
    });

    test("signal.subscribe notifies listener on change via microtask", async () => {
        const text = signal("initial");
        let lastReceived = null;

        const unsub = text.subscribe(val => {
            lastReceived = val;
        });

        text.set("updated");

        // Wait for microtask queue
        await new Promise(resolve => queueMicrotask(resolve));

        assertEqual(lastReceived, "updated");

        unsub();
        text.set("again");
        await new Promise(resolve => queueMicrotask(resolve));

        assertEqual(lastReceived, "updated"); // Unsubscribed, should remain "updated"
    });

    test("read and write helper functions", () => {
        const sig = signal("hello");
        assertEqual(read(sig), "hello");
        assertEqual(read("static"), "static");

        const written = write(sig, "world");
        assertEqual(written, true);
        assertEqual(read(sig), "world");

        const nonSigWritten = write("static", "new");
        assertEqual(nonSigWritten, false);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    await run();
}
