import {
    reset, test, assert, assertEqual,
    summary, banner
} from "../../_assert.js";

import {
    pushEffect,
    popEffect,
    clearStack
} from "../../../../src/reactive/stack.js";

import {
    track
} from "../../../../src/reactive/track.js";

import {
    trigger,
    triggerAll,
    triggerWith
} from "../../../../src/reactive/trigger.js";

export function run() {
    reset();
    banner("src/reactive/trigger.test.js");

    clearStack();

    test("trigger returns 0 when there are no subscribers", () => {
        const target = { count: 0 };
        const count = trigger(target, "count");
        assertEqual(count, 0);
    });

    test("trigger invokes effect.run() when subscribed", () => {
        const target = { count: 10 };
        let runs = 0;
        const effect = {
            run() {
                runs++;
            }
        };

        pushEffect(effect);
        track(target, "count");
        popEffect();

        const count = trigger(target, "count");
        assertEqual(count, 1);
        assertEqual(runs, 1);
    });

    test("trigger prefers effect.scheduler() over effect.run()", () => {
        const target = { name: "initial" };
        let runCount = 0;
        let schedulerCount = 0;

        const effect = {
            run() {
                runCount++;
            },
            scheduler() {
                schedulerCount++;
            }
        };

        pushEffect(effect);
        track(target, "name");
        popEffect();

        trigger(target, "name");

        assertEqual(schedulerCount, 1);
        assertEqual(runCount, 0);
    });

    test("trigger safely executes multiple subscribers", () => {
        const target = { score: 100 };
        const executed = [];

        const e1 = { run: () => executed.push("e1") };
        const e2 = { run: () => executed.push("e2") };

        pushEffect(e1);
        track(target, "score");
        popEffect();

        pushEffect(e2);
        track(target, "score");
        popEffect();

        const count = trigger(target, "score");
        assertEqual(count, 2);
        assertEqual(executed.length, 2);
        assert(executed.includes("e1"));
        assert(executed.includes("e2"));
    });

    test("triggerAll triggers effects across all registered keys on target", () => {
        const target = { a: 1, b: 2 };
        let countA = 0;
        let countB = 0;

        const eA = { run: () => countA++ };
        const eB = { run: () => countB++ };

        pushEffect(eA);
        track(target, "a");
        popEffect();

        pushEffect(eB);
        track(target, "b");
        popEffect();

        const total = triggerAll(target);
        assertEqual(total, 2);
        assertEqual(countA, 1);
        assertEqual(countB, 1);
    });

    test("triggerWith allows custom scheduler override", () => {
        const target = { state: "idle" };
        const effect = {
            run: () => {
                throw new Error("Should not be called");
            }
        };

        pushEffect(effect);
        track(target, "state");
        popEffect();

        let customCalled = false;
        const total = triggerWith(target, "state", (eff) => {
            assertEqual(eff, effect);
            customCalled = true;
        });

        assertEqual(total, 1);
        assertEqual(customCalled, true);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
