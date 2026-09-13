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
    track,
    getSubscribers,
    hasSubscribers,
    subscriberCount,
    removeSubscriber,
    clearSubscribers,
    isTracked,
    getTargetMap
} from "../../../../src/reactive/track.js";

export function run() {
    reset();
    banner("src/reactive/track.test.js");

    clearStack();

    // No effect active
    test("track does nothing when there is no active effect", () => {
        const target = { count: 0 };
        track(target, "count");

        assertEqual(isTracked(target), false);
        assertEqual(getSubscribers(target, "count"), null);
        assertEqual(hasSubscribers(target, "count"), false);
        assertEqual(subscriberCount(target, "count"), 0);
    });

    // Tracking active effect
    test("track registers active effect for target property", () => {
        const target = { name: "Alice" };
        const effect1 = () => "render";

        pushEffect(effect1);
        track(target, "name");
        popEffect();

        assertEqual(isTracked(target), true);
        assertEqual(hasSubscribers(target, "name"), true);
        assertEqual(subscriberCount(target, "name"), 1);

        const subs = getSubscribers(target, "name");
        assert(subs instanceof Set);
        assert(subs.has(effect1));
    });

    // Avoid double-registration
    test("track avoids registering the same effect multiple times", () => {
        const target = { age: 30 };
        const effect = () => "ageWatcher";

        pushEffect(effect);
        track(target, "age");
        track(target, "age");
        popEffect();

        assertEqual(subscriberCount(target, "age"), 1);
    });

    // Multiple subscribers on same key
    test("track supports multiple distinct effects on same key", () => {
        const target = { score: 100 };
        const effectA = () => "scoreA";
        const effectB = () => "scoreB";

        pushEffect(effectA);
        track(target, "score");
        popEffect();

        pushEffect(effectB);
        track(target, "score");
        popEffect();

        assertEqual(subscriberCount(target, "score"), 2);
        const subs = getSubscribers(target, "score");
        assert(subs.has(effectA));
        assert(subs.has(effectB));
    });

    // removeSubscriber
    test("removeSubscriber removes specific effect and returns boolean", () => {
        const target = { status: "active" };
        const effect = () => "statusWatcher";

        pushEffect(effect);
        track(target, "status");
        popEffect();

        assertEqual(hasSubscribers(target, "status"), true);

        const removed = removeSubscriber(target, "status", effect);
        assertEqual(removed, true);
        assertEqual(hasSubscribers(target, "status"), false);
        assertEqual(subscriberCount(target, "status"), 0);

        const removedAgain = removeSubscriber(target, "status", effect);
        assertEqual(removedAgain, false);
    });

    // clearSubscribers
    test("clearSubscribers removes all subscribers for key", () => {
        const target = { val: 1 };
        const e1 = () => 1;
        const e2 = () => 2;

        pushEffect(e1);
        track(target, "val");
        popEffect();

        pushEffect(e2);
        track(target, "val");
        popEffect();

        assertEqual(subscriberCount(target, "val"), 2);

        clearSubscribers(target, "val");
        assertEqual(hasSubscribers(target, "val"), false);
        assertEqual(getSubscribers(target, "val"), null);
    });

    // getTargetMap returns WeakMap
    test("getTargetMap returns internal WeakMap instance", () => {
        const map = getTargetMap();
        assert(map instanceof WeakMap);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
