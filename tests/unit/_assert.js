let passed = 0;
let failed = 0;
const results = [];

// Reset all counters
function reset() {
    passed = 0;
    failed = 0;
    results.length = 0;
}

// Run a synchronous test case
function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ PASS: ${name}`);
        passed++;
        results.push({ name, status: "PASS" });
    } catch (err) {
        console.error(`  ❌ FAIL: ${name}`);
        console.error(`     ${err.message}`);
        failed++;
        results.push({ name, status: "FAIL", error: err.message });
    }
}

// Run an asynchronous test case
async function testAsync(name, fn) {
    try {
        await fn();
        console.log(`  ✅ PASS: ${name}`);
        passed++;
        results.push({ name, status: "PASS" });
    } catch (err) {
        console.error(`  ❌ FAIL: ${name}`);
        console.error(`     ${err.message}`);
        failed++;
        results.push({ name, status: "FAIL", error: err.message });
    }
}

// Assert condition is truthy
function assert(cond, msg) {
    if (!cond) throw new Error(msg || "Assertion failed");
}

// Assert values are equal
function assertEqual(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(
            `${msg || "Values not equal"}\n     Expected: ${JSON.stringify(expected)}\n     Actual:   ${JSON.stringify(actual)}`
        );
    }
}

// Assert deep equality via JSON
function assertDeepEqual(actual, expected, msg) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
        throw new Error(
            `${msg || "Values not deep equal"}\n     Expected: ${b}\n     Actual:   ${a}`
        );
    }
}

// Assert haystack includes needle
function assertIncludes(haystack, needle, msg) {
    if (!haystack.includes(needle)) {
        throw new Error(
            `${msg || "Does not include expected value"}\n     Expected to include: ${needle}\n     Actual: ${haystack}`
        );
    }
}

// Assert function throws an error
function assertThrows(fn, msg) {
    let threw = false;
    try { fn(); } catch { threw = true; }
    if (!threw) throw new Error(msg || "Function should have thrown");
}

// Get summary of current test run
function summary() {
    return { passed, failed, results };
}

// Print a banner for a test file
function banner(title) {
    console.log(`\n${"─".repeat(55)}`);
    console.log(`🧪 ${title}`);
    console.log(`${"─".repeat(55)}`);
}

export {
    reset, test, testAsync,
    assert, assertEqual, assertDeepEqual,
    assertIncludes, assertThrows,
    summary, banner
};
