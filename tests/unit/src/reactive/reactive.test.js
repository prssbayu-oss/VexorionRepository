import {
    reset, test, assert, assertEqual, assertDeepEqual,
    summary, banner
} from "../../_assert.js";

import {
    pushEffect,
    popEffect,
    clearStack
} from "../../../../src/reactive/stack.js";

import {
    reactive,
    isReactive,
    toRaw
} from "../../../../src/reactive/reactive.js";

export function run() {
    reset();
    banner("src/reactive/reactive.test.js");

    clearStack();

    test("reactive wraps plain object into a proxy", () => {
        const original = { count: 0, text: "hello" };
        const state = reactive(original);

        assert(isReactive(state));
        assert(!isReactive(original));
        assertEqual(state.count, 0);
        assertEqual(state.text, "hello");
    });

    test("reactive returns cached proxy if called twice on same object", () => {
        const obj = { a: 1 };
        const p1 = reactive(obj);
        const p2 = reactive(obj);

        assertEqual(p1, p2);
    });

    test("reactive returns as-is if called on already reactive proxy", () => {
        const state = reactive({ x: 10 });
        const again = reactive(state);

        assertEqual(state, again);
    });

    test("reactive returns non-object untouched", () => {
        assertEqual(reactive(42), 42);
        assertEqual(reactive("string"), "string");
        assertEqual(reactive(null), null);
    });

    test("toRaw unwraps proxy back to original target object", () => {
        const original = { name: "Vexorion" };
        const state = reactive(original);

        assertEqual(toRaw(state), original);
        assertEqual(toRaw(original), original);
    });

    test("lazy reactive wrapping on nested objects", () => {
        const state = reactive({
            user: {
                profile: {
                    theme: "dark"
                }
            }
        });

        assert(isReactive(state.user));
        assert(isReactive(state.user.profile));
        assertEqual(state.user.profile.theme, "dark");
    });

    test("get triggers tracking and set triggers subscriber re-run", () => {
        const state = reactive({ count: 0 });
        let effectRuns = 0;
        let observedCount = 0;

        const effect = {
            run() {
                effectRuns++;
                observedCount = state.count;
            }
        };

        // First run: tracks state.count
        pushEffect(effect);
        effect.run();
        popEffect();

        assertEqual(effectRuns, 1);
        assertEqual(observedCount, 0);

        // Mutating property should trigger effect.run()
        state.count = 5;
        assertEqual(effectRuns, 2);
        assertEqual(observedCount, 5);

        // Setting same value should NOT trigger effect
        state.count = 5;
        assertEqual(effectRuns, 2);
    });

    test("deleteProperty triggers subscriber re-run", () => {
        const state = reactive({ title: "Main" });
        let runs = 0;

        const effect = {
            run() {
                runs++;
                // Track title
                const _ = state.title;
            }
        };

        pushEffect(effect);
        effect.run();
        popEffect();

        assertEqual(runs, 1);

        delete state.title;
        assertEqual(runs, 2);
    });

    test("has operator tracks dependency", () => {
        const state = reactive({ visible: true });
        let runs = 0;
        let hasProp = false;

        const effect = {
            run() {
                runs++;
                hasProp = "visible" in state;
            }
        };

        pushEffect(effect);
        effect.run();
        popEffect();

        assertEqual(runs, 1);
        assertEqual(hasProp, true);

        delete state.visible;
        assertEqual(runs, 2);
    });

    test("setting reserved keys is rejected", () => {
        const state = reactive({ a: 1 });
        let threw = false;
        try {
            state.__isReactive = false;
        } catch {
            threw = true;
        }
        assert(threw);
        assertEqual(state.__isReactive, true);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
