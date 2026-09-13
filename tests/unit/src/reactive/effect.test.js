import {
    reset, test, assert, assertEqual,
    summary, banner
} from "../../_assert.js";

import { clearStack } from "../../../../src/reactive/stack.js";
import { reactive } from "../../../../src/reactive/reactive.js";
import {
    effect,
    stopAllEffects,
    getActiveEffects,
    activeEffectCount
} from "../../../../src/reactive/effect.js";

export function run() {
    reset();
    banner("src/reactive/effect.test.js");

    clearStack();
    stopAllEffects();

    test("effect returns null for invalid non-function input", () => {
        assertEqual(effect(null), null);
        assertEqual(effect(123), null);
    });

    test("effect runs immediately by default", () => {
        let count = 0;
        const runner = effect(() => {
            count++;
        });

        assertEqual(count, 1);
        assertEqual(runner.active, true);
        runner.stop();
    });

    test("effect with { lazy: true } does not run until run() is called", () => {
        let count = 0;
        const runner = effect(() => {
            count++;
        }, { lazy: true });

        assertEqual(count, 0);
        runner.run();
        assertEqual(count, 1);
        runner.stop();
    });

    test("effect re-runs when tracked reactive property changes", () => {
        const state = reactive({ count: 0 });
        let observed = null;
        let runs = 0;

        const runner = effect(() => {
            runs++;
            observed = state.count;
        });

        assertEqual(runs, 1);
        assertEqual(observed, 0);

        state.count = 42;
        assertEqual(runs, 2);
        assertEqual(observed, 42);

        runner.stop();
    });

    test("custom scheduler is called instead of direct run when triggered", () => {
        const state = reactive({ message: "hello" });
        let runCount = 0;
        let schedulerCount = 0;
        let runnerRef = null;

        const runner = effect(() => {
            runCount++;
            const _ = state.message;
        }, {
            scheduler() {
                schedulerCount++;
                // Manually trigger run in scheduler
                runnerRef.run();
            }
        });
        runnerRef = runner;

        assertEqual(runCount, 1);
        assertEqual(schedulerCount, 0);

        state.message = "world";
        assertEqual(schedulerCount, 1);
        assertEqual(runCount, 2);

        runner.stop();
    });

    test("runner.stop() prevents future runs", () => {
        const state = reactive({ count: 1 });
        let runs = 0;

        const runner = effect(() => {
            runs++;
            const _ = state.count;
        });

        assertEqual(runs, 1);

        runner.stop();
        assertEqual(runner.active, false);

        state.count = 2;
        assertEqual(runs, 1);

        // Manual run on stopped runner should do nothing
        const res = runner.run();
        assertEqual(res, undefined);
        assertEqual(runs, 1);
    });

    test("stopAllEffects clears all active effects", () => {
        stopAllEffects();
        assertEqual(activeEffectCount(), 0);

        const e1 = effect(() => 1, { lazy: true });
        const e2 = effect(() => 2, { lazy: true });

        assertEqual(activeEffectCount(), 2);
        assertEqual(getActiveEffects().length, 2);

        stopAllEffects();
        assertEqual(activeEffectCount(), 0);
        assertEqual(e1.active, false);
        assertEqual(e2.active, false);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
