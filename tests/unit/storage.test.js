import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

// Mock localStorage for Node.js environment
const store = {};
globalThis.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] ?? null
};

const { set, get, remove, clear, has } =
    await import("../../scripts/helpers/storage.js");

export function run() {
    reset();
    banner("storage.test.js");

    test("set + get should return stored value", () => {
        set("test1", { a: 1 });
        const result = get("test1");
        assertEqual(result.a, 1);
    });

    test("should store string values", () => {
        set("str", "hello");
        assertEqual(get("str"), "hello");
    });

    test("should store number values", () => {
        set("num", 42);
        assertEqual(get("num"), 42);
    });

    test("get should return default for missing key", () => {
        assertEqual(get("nope", "default"), "default");
    });

    test("get should return null by default for missing key", () => {
        assertEqual(get("nope2"), null);
    });

    test("has() should detect existing key", () => {
        set("exists", 1);
        assert(has("exists"), "Key should exist");
    });

    test("has() should return false for missing key", () => {
        assert(!has("nonexistent"), "Key should not exist");
    });

    test("remove() should delete key", () => {
        set("toremove", "x");
        remove("toremove");
        assert(!has("toremove"), "Key should be removed");
    });

    test("clear() should remove all prefixed keys", () => {
        set("a", 1);
        set("b", 2);
        clear();
        assert(!has("a"), "Key 'a' should be removed");
        assert(!has("b"), "Key 'b' should be removed");
    });

    test("storage should use 'vexorion_' prefix", () => {
        set("key", "value");
        assert(store["vexorion_key"] !== undefined, "Should use correct prefix");
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
