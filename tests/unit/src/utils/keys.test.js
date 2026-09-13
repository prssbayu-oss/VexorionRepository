import {
    reset, test, assert, assertEqual, assertDeepEqual,
    summary, banner
} from "../../_assert.js";

import {
    normalizeKey,
    isSameKey,
    getVNodeKey,
    extractKeys,
    buildKeyMap,
    diffKeys,
    ownKeys,
    unionKeys,
    intersectKeys,
    diffObjectKeys
} from "../../../../src/utils/keys.js";

export function run() {
    reset();
    banner("src/utils/keys.test.js");

    // Key normalization
    test("normalizeKey with string, number, boolean, nil", () => {
        assertEqual(normalizeKey("item-1"), "item-1");
        assertEqual(normalizeKey(123), "123");
        assertEqual(normalizeKey(0), "0");
        assertEqual(normalizeKey(true), "true");
        assertEqual(normalizeKey(false), "false");
        assertEqual(normalizeKey(null), null);
        assertEqual(normalizeKey(undefined), null);
        assertEqual(normalizeKey({}), null);
        assertEqual(normalizeKey([]), null);
    });

    test("isSameKey comparison", () => {
        assert(isSameKey("123", 123));
        assert(isSameKey("true", true));
        assert(isSameKey("abc", "abc"));
        assert(!isSameKey("abc", "def"));
        assert(!isSameKey("1", 2));
        assert(isSameKey(null, undefined));
    });

    // List key extraction
    test("getVNodeKey from vnode.key, vnode.props.key, or fallback index", () => {
        assertEqual(getVNodeKey({ key: "k1" }, 0), "k1");
        assertEqual(getVNodeKey({ key: 42 }, 0), "42");
        assertEqual(getVNodeKey({ props: { key: "pk" } }, 0), "pk");
        assertEqual(getVNodeKey({ type: "div" }, 2), "2");
        assertEqual(getVNodeKey({ type: "div" }), null);
        assertEqual(getVNodeKey(null, 0), null);
        assertEqual(getVNodeKey("not a vnode", 0), null);
    });

    test("extractKeys from array of vnodes", () => {
        const vnodes = [
            { key: "a" },
            { props: { key: "b" } },
            { type: "span" }
        ];
        assertDeepEqual(extractKeys(vnodes), ["a", "b", "2"]);
        assertDeepEqual(extractKeys(null), []);
        assertDeepEqual(extractKeys("invalid"), []);
    });

    // Keyed list diffing
    test("buildKeyMap creates Map with key to vnode", () => {
        const v1 = { key: "k1", type: "div" };
        const v2 = { key: "k2", type: "span" };
        const map = buildKeyMap([v1, v2]);

        assertEqual(map.size, 2);
        assertEqual(map.get("k1"), v1);
        assertEqual(map.get("k2"), v2);
        assertEqual(buildKeyMap(null).size, 0);
    });

    test("diffKeys detects added, removed, kept, and moved keys", () => {
        const oldKeys = ["a", "b", "c", "d"];
        const newKeys = ["b", "c", "a", "e"];

        const diff = diffKeys(oldKeys, newKeys);

        assertDeepEqual(diff.added, ["e"]);
        assertDeepEqual(diff.removed, ["d"]);
        assertDeepEqual(diff.kept, ["b", "c", "a"]);

        // "b" moved from 1 to 0, "c" moved from 2 to 1, "a" moved from 0 to 2
        assertEqual(diff.moved.length, 3);
        assertDeepEqual(diff.moved[0], { key: "b", from: 1, to: 0 });
        assertDeepEqual(diff.moved[1], { key: "c", from: 2, to: 1 });
        assertDeepEqual(diff.moved[2], { key: "a", from: 0, to: 2 });
    });

    test("diffKeys handles empty or non-array inputs", () => {
        const diff = diffKeys(null, ["a", "b"]);
        assertDeepEqual(diff.added, ["a", "b"]);
        assertDeepEqual(diff.removed, []);
        assertDeepEqual(diff.kept, []);
        assertDeepEqual(diff.moved, []);
    });

    // Object key utilities
    test("ownKeys returns own enumerable keys", () => {
        assertDeepEqual(ownKeys({ a: 1, b: 2 }), ["a", "b"]);
        assertDeepEqual(ownKeys(null), []);
        assertDeepEqual(ownKeys(123), []);
    });

    test("unionKeys aggregates unique keys across multiple objects", () => {
        const res = unionKeys({ a: 1, b: 2 }, { b: 3, c: 4 }, null, { d: 5 });
        assertDeepEqual(res.sort(), ["a", "b", "c", "d"]);
    });

    test("intersectKeys returns shared keys between two objects", () => {
        const res = intersectKeys({ a: 1, b: 2, c: 3 }, { b: 10, c: 20, d: 30 });
        assertDeepEqual(res, ["b", "c"]);
        assertDeepEqual(intersectKeys(null, { a: 1 }), []);
        assertDeepEqual(intersectKeys({ a: 1 }, null), []);
    });

    test("diffObjectKeys returns keys present in a but not in b", () => {
        const res = diffObjectKeys({ a: 1, b: 2, c: 3 }, { b: 10, d: 40 });
        assertDeepEqual(res, ["a", "c"]);
        assertDeepEqual(diffObjectKeys(null, { a: 1 }), []);
        assertDeepEqual(diffObjectKeys({ a: 1, b: 2 }, null), ["a", "b"]);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
