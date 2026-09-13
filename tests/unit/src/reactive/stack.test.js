import {
    reset, test, assert, assertEqual, assertDeepEqual,
    summary, banner
} from "../../_assert.js";

import {
    pushEffect,
    popEffect,
    getActiveEffect,
    getStackSnapshot,
    getStackDepth,
    isInsideEffect,
    clearStack
} from "../../../../src/reactive/stack.js";

export function run() {
    reset();
    banner("src/reactive/stack.test.js");

    // Clean stack before each run
    clearStack();

    // Initial state
    test("initial state is empty", () => {
        assertEqual(getStackDepth(), 0);
        assertEqual(getActiveEffect(), undefined);
        assertEqual(isInsideEffect(), false);
        assertDeepEqual(getStackSnapshot(), []);
    });

    // Push and peek
    test("pushEffect adds effect and getActiveEffect returns top", () => {
        const effect1 = () => "effect1";
        pushEffect(effect1);

        assertEqual(getStackDepth(), 1);
        assertEqual(getActiveEffect(), effect1);
        assertEqual(isInsideEffect(), true);

        const effect2 = () => "effect2";
        pushEffect(effect2);

        assertEqual(getStackDepth(), 2);
        assertEqual(getActiveEffect(), effect2);

        // Clean up
        popEffect();
        popEffect();
    });

    // Pop effect
    test("popEffect removes and returns top effect", () => {
        const e1 = { id: 1 };
        const e2 = { id: 2 };

        pushEffect(e1);
        pushEffect(e2);

        const popped = popEffect();
        assertEqual(popped, e2);
        assertEqual(getActiveEffect(), e1);
        assertEqual(getStackDepth(), 1);

        const poppedFirst = popEffect();
        assertEqual(poppedFirst, e1);
        assertEqual(getStackDepth(), 0);
        assertEqual(isInsideEffect(), false);
    });

    // Snapshot isolation
    test("getStackSnapshot returns isolated shallow copy", () => {
        const e1 = { name: "A" };
        pushEffect(e1);

        const snapshot = getStackSnapshot();
        assertEqual(snapshot.length, 1);
        assertEqual(snapshot[0], e1);

        // Mutating returned snapshot array shouldn't affect internal stack
        snapshot.push({ name: "B" });
        assertEqual(getStackDepth(), 1);

        clearStack();
    });

    // Clear stack
    test("clearStack resets all elements", () => {
        pushEffect(() => {});
        pushEffect(() => {});
        pushEffect(() => {});
        assertEqual(getStackDepth(), 3);

        clearStack();
        assertEqual(getStackDepth(), 0);
        assertEqual(getActiveEffect(), undefined);
        assertEqual(isInsideEffect(), false);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
