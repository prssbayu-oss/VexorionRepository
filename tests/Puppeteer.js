import puppeteer from "puppeteer";

// Test configuration
const CONFIG = {
    headless: process.env.HEADLESS !== "false",
    slowMo: 0,
    baseUrl: "http://localhost:8000",
    timeout: 15000,
    viewport: { width: 1280, height: 720 }
};

// Launch a new browser instance
async function launchBrowser(options = {}) {
    const config = { ...CONFIG, ...options };
    const browser = await puppeteer.launch({
        headless: config.headless,
        slowMo: config.slowMo,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    return browser;
}

// Open a page and navigate to a path
async function openPage(browser, path = "/") {
    const page = await browser.newPage();
    await page.setViewport(CONFIG.viewport);
    page.setDefaultTimeout(CONFIG.timeout);

    page.on("console", msg => {
        if (msg.type() === "error") {
            console.error(`[BROWSER ERROR] ${msg.text()}`);
        }
    });

    page.on("pageerror", err => {
        console.error(`[PAGE ERROR] ${err.message}`);
    });

    const url = `${CONFIG.baseUrl}${path}`;
    await page.goto(url, { waitUntil: "networkidle0" });
    return page;
}

// Get text content of an element
async function getText(page, selector) {
    return page.$eval(selector, el => el.textContent.trim());
}

// Get inner HTML of an element
async function getInnerHTML(page, selector) {
    return page.$eval(selector, el => el.innerHTML);
}

// Count matching elements
async function getCount(page, selector) {
    return page.$$eval(selector, els => els.length);
}

// Click an element
async function click(page, selector) {
    await page.waitForSelector(selector);
    await page.click(selector);
}

// Wait for an element to appear
async function waitFor(page, selector, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
}

// Wait for a function to return truthy
async function waitForFunction(page, fn, timeout = 5000) {
    await page.waitForFunction(fn, { timeout });
}

// Evaluate a function in the browser context
async function evaluate(page, fn, ...args) {
    return page.evaluate(fn, ...args);
}

// Type text into an input
async function type(page, selector, text) {
    await page.waitForSelector(selector);
    await page.type(selector, text);
}

// Take a screenshot
async function screenshot(page, filename) {
    const path = `tests/screenshots/${filename}`;
    await page.screenshot({ path, fullPage: true });
    return path;
}

// Close the browser
async function closeBrowser(browser) {
    if (browser) await browser.close();
}

// Assertion: condition must be truthy
function assert(condition, message) {
    if (!condition) {
        throw new Error(`ASSERT FAILED: ${message}`);
    }
    console.log(`  ✅ PASS: ${message}`);
}

// Assertion: values must be equal
function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(
            `ASSERT FAILED: ${message}\n    Expected: ${expected}\n    Actual:   ${actual}`
        );
    }
    console.log(`  ✅ PASS: ${message}`);
}

// Assertion: haystack must include needle
function assertIncludes(haystack, needle, message) {
    if (!haystack.includes(needle)) {
        throw new Error(
            `ASSERT FAILED: ${message}\n    Expected to include: ${needle}\n    Actual: ${haystack}`
        );
    }
    console.log(`  ✅ PASS: ${message}`);
}

// Assertion: actual must be greater than minimum
function assertGreater(actual, min, message) {
    if (!(actual > min)) {
        throw new Error(
            `ASSERT FAILED: ${message}\n    Expected > ${min}, got ${actual}`
        );
    }
    console.log(`  ✅ PASS: ${message}`);
}

export {
    CONFIG,
    launchBrowser,
    openPage,
    getText,
    getInnerHTML,
    getCount,
    click,
    waitFor,
    waitForFunction,
    evaluate,
    type,
    screenshot,
    closeBrowser,
    assert,
    assertEqual,
    assertIncludes,
    assertGreater
};
