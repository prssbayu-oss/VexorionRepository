import {
    reset, testAsync, assert, assertEqual,
    summary, banner
} from "./_assert.js";

// Mock fetch for controlled testing
globalThis.fetch = async (url, options = {}) => {
    if (url.includes("error")) {
        return {
            ok: false,
            status: 500,
            statusText: "Server Error",
            headers: { get: () => "application/json" }
        };
    }
    if (url.includes("text")) {
        return {
            ok: true,
            status: 200,
            headers: { get: () => "text/plain" },
            text: async () => "plain text response"
        };
    }
    return {
        ok: true,
        status: 200,
        headers: { get: () => "application/json" },
        json: async () => [{ id: 1, name: "Alice" }]
    };
};

// Mock localStorage for logger dependency
const store = {};
globalThis.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};

const { request, get, post, put, del, getUsers } =
    await import("../../scripts/helpers/api.js");

export async function run() {
    reset();
    banner("api.test.js");

    await testAsync("request() GET should succeed", async () => {
        const result = await request("http://test/api");
        assert(Array.isArray(result), "Should return an array");
        assertEqual(result[0].name, "Alice");
    });

    await testAsync("request() should throw on 500 error", async () => {
        let threw = false;
        try {
            await request("http://test/error");
        } catch (err) {
            threw = true;
            assert(err.message.includes("500"), "Error should mention HTTP 500");
        }
        assert(threw, "Should throw an error");
    });

    await testAsync("get() should be a shorthand for GET", async () => {
        const result = await get("http://test/api");
        assert(Array.isArray(result));
    });

    await testAsync("post() should send body", async () => {
        const result = await post("http://test/api", { name: "Bob" });
        assert(Array.isArray(result), "Should return response");
    });

    await testAsync("put() should send body", async () => {
        const result = await put("http://test/api", { name: "Bob" });
        assert(Array.isArray(result));
    });

    await testAsync("del() should work without body", async () => {
        const result = await del("http://test/api");
        assert(Array.isArray(result));
    });

    await testAsync("getUsers() should return array", async () => {
        const users = await getUsers("http://test/api");
        assert(Array.isArray(users));
        assertEqual(users.length, 1);
    });

    await testAsync("getUsers() should return empty array on error", async () => {
        const users = await getUsers("http://test/error");
        assert(Array.isArray(users), "Should return an array");
        assertEqual(users.length, 0, "Should be empty");
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
