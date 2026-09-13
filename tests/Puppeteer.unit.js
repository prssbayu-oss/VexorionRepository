import {
    launchBrowser,
    openPage,
    getText,
    getCount,
    click,
    waitFor,
    waitForFunction,
    evaluate,
    closeBrowser,
    assert,
    assertEqual,
    assertIncludes,
    assertGreater
} from "./Puppeteer.js";

let passed = 0;
let failed = 0;

// Run a single test case
async function runTest(name, fn) {
    console.log(`\n🧪 TEST: ${name}`);
    try {
        await fn();
        passed++;
    } catch (err) {
        console.error(`  💥 FAILED: ${err.message}`);
        failed++;
    }
}

// Main test runner
async function main() {
    console.log("🚀 Starting Puppeteer Unit Tests...\n");
    const browser = await launchBrowser();

    try {
        const page = await openPage(browser, "/");

        await runTest("Page title is Vexorion", async () => {
            const title = await page.title();
            assertEqual(title, "Vexorion", "Page title should be 'Vexorion'");
        });

        await runTest("H1 title is rendered", async () => {
            const text = await getText(page, "#vexorion-id-title");
            assertEqual(text, "VEXORION", "H1 should display 'VEXORION'");
        });

        await runTest("Output paragraph is filled", async () => {
            const text = await getText(page, "#vexorion-id-output");
            assertIncludes(text, "Vexorion", "Output should mention 'Vexorion'");
            assertIncludes(text, "⚡", "Output should contain ⚡ prefix");
        });

        await runTest("Logo SVG is loaded", async () => {
            const src = await evaluate(page, () => {
                const img = document.querySelector(".vexorion-class-logo");
                return img ? img.src : "";
            });
            assertIncludes(src, "logo.svg", "Logo should reference SVG file");
        });

        await runTest("Load Data button exists", async () => {
            const exists = await evaluate(page, () => {
                return document.getElementById("vexorion-id-load-data") !== null;
            });
            assert(exists, "Button #vexorion-id-load-data should exist");
        });

        await runTest("Title click triggers sparkle", async () => {
            await click(page, "#vexorion-id-title");
            await new Promise(r => setTimeout(r, 150));
            const text = await getText(page, "#vexorion-id-title");
            assertIncludes(text, "✨", "Title should display ✨ after click");
        });

        await runTest("State.clickCount increments", async () => {
            const count = await evaluate(page, () => {
                return window.__vexorion_state?.clickCount || 0;
            });
            assertGreater(count, 0, `clickCount should be greater than 0, got ${count}`);
        });

        await runTest("LocalStorage has lastTitle", async () => {
            const value = await evaluate(page, () => {
                return localStorage.getItem("vexorion_lastTitle");
            });
            assert(value !== null, "Storage should have 'vexorion_lastTitle'");
        });

        await runTest("Empty state is visible at start", async () => {
            const hidden = await evaluate(page, () => {
                const el = document.getElementById("vexorion-id-empty-state");
                return el && el.classList.contains("vexorion-class-hidden");
            });
            assert(!hidden, "Empty state should be visible initially");
        });

    } finally {
        await closeBrowser(browser);
    }

    console.log(`\n${"─".repeat(50)}`);
    console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
    console.log(`${"─".repeat(50)}\n`);

    process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
    console.error("💥 Fatal error:", err);
    process.exit(1);
});
