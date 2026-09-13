import {
    launchBrowser,
    openPage,
    getText,
    getCount,
    click,
    waitFor,
    waitForFunction,
    evaluate,
    screenshot,
    closeBrowser,
    assert,
    assertEqual,
    assertIncludes,
    assertGreater
} from "./Puppeteer.js";

// Element selectors
const ID = {
    TITLE: "#vexorion-id-title",
    OUTPUT: "#vexorion-id-output",
    LOAD_BTN: "#vexorion-id-load-data",
    USER_LIST: "#vexorion-id-user-list",
    EMPTY_STATE: "#vexorion-id-empty-state"
};

const CLS = {
    LOGO: ".vexorion-class-logo",
    EMPTY: ".vexorion-class-empty",
    HIDDEN: "vexorion-class-hidden"
};

let passed = 0;
let failed = 0;
const results = [];

// Execute a single test step
async function step(name, fn) {
    console.log(`\n  ▶️  ${name}`);
    try {
        await fn();
        passed++;
        results.push({ name, status: "PASS" });
    } catch (err) {
        console.error(`     💥 ${err.message}`);
        failed++;
        results.push({ name, status: "FAIL", error: err.message });
        throw err;
    }
}

// Execute a test scenario
async function scenario(name, fn) {
    console.log(`\n${"═".repeat(55)}`);
    console.log(`🎬 SCENARIO: ${name}`);
    console.log(`${"═".repeat(55)}`);

    try {
        await fn();
    } catch (err) {
        console.error(`\n❌ Scenario failed: ${err.message}`);
    }
}

async function main() {
    console.log("\n🚀 Starting E2E Tests...\n");
    const browser = await launchBrowser();

    try {
        await scenario("First Visit", async () => {
            const page = await openPage(browser, "/");

            await step("Page title is 'Vexorion'", async () => {
                const title = await page.title();
                assertEqual(title, "Vexorion", "Page title should be 'Vexorion'");
            });

            await step("H1 displays 'VEXORION'", async () => {
                const text = await getText(page, ID.TITLE);
                assertEqual(text, "VEXORION", "H1 should display 'VEXORION'");
            });

            await step("Logo is loaded", async () => {
                const loaded = await evaluate(page, () => {
                    const img = document.querySelector(".vexorion-class-logo");
                    return img && img.complete && img.naturalWidth > 0;
                });
                assert(loaded, "Logo SVG should load successfully");
            });

            await step("Empty state is visible", async () => {
                const visible = await evaluate(page, () => {
                    const el = document.getElementById("vexorion-id-empty-state");
                    return el && !el.classList.contains("vexorion-class-hidden");
                });
                assert(visible, "Empty state should be visible initially");
            });

            await step("Take screenshot", async () => {
                await screenshot(page, "01-first-visit.png");
            });

            await page.close();
        });

        await scenario("Title Interaction", async () => {
            const page = await openPage(browser, "/");

            await step("Click title shows sparkle", async () => {
                await click(page, ID.TITLE);
                await new Promise(r => setTimeout(r, 150));
                const text = await getText(page, ID.TITLE);
                assertIncludes(text, "✨", "Title should show ✨ after click");
            });

            await step("clickCount increments", async () => {
                const count = await evaluate(page, () => {
                    return window.__vexorion_state?.clickCount || 0;
                });
                assertGreater(count, 0, `clickCount should be > 0, got ${count}`);
            });

            await step("Title returns to normal", async () => {
                await waitForFunction(page, () => {
                    const el = document.getElementById("vexorion-id-title");
                    return el && el.textContent === "VEXORION";
                }, 3000);
                const text = await getText(page, ID.TITLE);
                assertEqual(text, "VEXORION", "Title should return to 'VEXORION'");
            });

            await page.close();
        });

        await scenario("Fetch Data", async () => {
            const page = await openPage(browser, "/");

            await step("Click Load Data button", async () => {
                await click(page, ID.LOAD_BTN);
                await waitForFunction(page, () => {
                    return window.__vexorion_state?.users?.length > 0;
                }, 10000);
                assert(true, "Fetch operation completed");
            });

            await step("Users are rendered in DOM", async () => {
                await waitFor(page, `${ID.USER_LIST} li`, 5000);
                const count = await getCount(page, `${ID.USER_LIST} li`);
                assertGreater(count, 0, `Should render > 0 list items, got ${count}`);
            });

            await step("Empty state is hidden", async () => {
                const hidden = await evaluate(page, () => {
                    const el = document.getElementById("vexorion-id-empty-state");
                    return el && el.classList.contains("vexorion-class-hidden");
                });
                assert(hidden, "Empty state should be hidden after load");
            });

            await step("Take screenshot", async () => {
                await screenshot(page, "02-users-loaded.png");
            });

            await page.close();
        });

        await scenario("Persistence", async () => {
            const page = await openPage(browser, "/");

            await step("LocalStorage has lastTitle", async () => {
                const value = await evaluate(page, () => {
                    return localStorage.getItem("vexorion_lastTitle");
                });
                assert(value !== null, "Storage should contain 'lastTitle'");
            });

            await step("LocalStorage has lastVisit", async () => {
                const value = await evaluate(page, () => {
                    return localStorage.getItem("vexorion_lastVisit");
                });
                assert(value !== null, "Storage should contain 'lastVisit'");
            });

            await page.close();
        });

        await scenario("Logging", async () => {
            const page = await openPage(browser, "/");

            await step("Log contains 'Starting Vexorion'", async () => {
                const logs = await evaluate(page, () => {
                    return window.__vexorion_logs || [];
                });
                const found = logs.some(l => l.includes("Starting Vexorion"));
                assert(found, "Log should contain 'Starting Vexorion'");
            });

            await step("Log contains 'ready'", async () => {
                const logs = await evaluate(page, () => {
                    return window.__vexorion_logs || [];
                });
                const found = logs.some(l => l.includes("ready"));
                assert(found, "Log should contain 'ready'");
            });

            await page.close();
        });

        await scenario("Full User Journey", async () => {
            const page = await openPage(browser, "/");

            await step("1. Page loads successfully", async () => {
                const text = await getText(page, ID.TITLE);
                assertEqual(text, "VEXORION", "H1 should display 'VEXORION'");
            });

            await step("2. User clicks title twice", async () => {
                await click(page, ID.TITLE);
                await new Promise(r => setTimeout(r, 250));
                await click(page, ID.TITLE);
                await new Promise(r => setTimeout(r, 250));
                const count = await evaluate(page, () => {
                    return window.__vexorion_state?.clickCount || 0;
                });
                assertGreater(count, 0, `clickCount should be > 0, got ${count}`);
            });

            await step("3. User clicks Load Data button", async () => {
                await click(page, ID.LOAD_BTN);
                await waitForFunction(page, () => {
                    return window.__vexorion_state?.users?.length > 0;
                }, 10000);
                assert(true, "Data fetch completed");
            });

            await step("4. Data is rendered", async () => {
                await waitFor(page, `${ID.USER_LIST} li`, 5000);
                const count = await getCount(page, `${ID.USER_LIST} li`);
                assertGreater(count, 0, `List should have > 0 items, got ${count}`);
            });

            await step("5. Take final screenshot", async () => {
                await screenshot(page, "03-full-journey.png");
            });

            await page.close();
        });

    } finally {
        await closeBrowser(browser);
    }

    console.log(`\n${"═".repeat(55)}`);
    console.log(`📊 E2E RESULTS`);
    console.log(`${"═".repeat(55)}`);

    results.forEach((r, i) => {
        const icon = r.status === "PASS" ? "✅" : "❌";
        console.log(`${icon} ${String(i + 1).padStart(2)}. ${r.name}`);
    });

    console.log(`${"─".repeat(55)}`);
    console.log(`Total: ${passed} passed, ${failed} failed`);
    console.log(`${"═".repeat(55)}\n`);

    process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
    console.error("\n💥 Fatal error:", err);
    process.exit(1);
});
