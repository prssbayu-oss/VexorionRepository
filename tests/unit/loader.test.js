import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

// Full DOM mock for loader testing
class MockElement {
    constructor(tag = "div") {
        this.tagName = tag.toUpperCase();
        this.children = [];
        this.attributes = {};
        this.className = "";
        this.textContent = "";
        this.innerHTML = "";
        this.id = "";
        this.dataset = {};
        this.classList = {
            _set: new Set(),
            add(c) { this._set.add(c); },
            remove(c) { this._set.delete(c); },
            contains(c) { return this._set.has(c); }
        };
        this._listeners = {};
    }
    appendChild(c) { this.children.push(c); return c; }
    setAttribute(k, v) { this.attributes[k] = v; }
    addEventListener(evt, fn) {
        this._listeners[evt] = this._listeners[evt] || [];
        this._listeners[evt].push(fn);
    }
}

const elements = {
    "vexorion-id-title": new MockElement("h1"),
    "vexorion-id-output": new MockElement("p"),
    "vexorion-id-load-data": new MockElement("button"),
    "vexorion-id-user-list": new MockElement("ul"),
    "vexorion-id-empty-state": new MockElement("div")
};

globalThis.HTMLElement = MockElement;
globalThis.window = {};
globalThis.document = {
    getElementById(id) { return elements[id] || null; },
    createElement(tag) { return new MockElement(tag); },
    createElementNS(ns, tag) { return new MockElement(tag); },
    addEventListener() {},
    readyState: "complete"
};

const store = {};
globalThis.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};

const {
    loadApp,
    validateRequiredElements,
    renderContent,
    syncState,
    persistState,
    bindEvents
} = await import("../../scripts/loaders/loader.js");

export function run() {
    reset();
    banner("loader.test.js");

    test("validateRequiredElements() should return true", () => {
        const ok = validateRequiredElements();
        assert(ok, "All required elements should exist");
    });

    test("renderContent() should fill title element", () => {
        renderContent(
            elements["vexorion-id-title"],
            elements["vexorion-id-output"]
        );
        assertEqual(elements["vexorion-id-title"].textContent, "VEXORION");
    });

    test("renderContent() should fill output element", () => {
        renderContent(
            elements["vexorion-id-title"],
            elements["vexorion-id-output"]
        );
        assert(
            elements["vexorion-id-output"].textContent.includes("Vexorion"),
            "Output should contain app name"
        );
    });

    test("bindEvents() should attach listeners", () => {
        bindEvents(
            elements["vexorion-id-title"],
            elements["vexorion-id-load-data"]
        );
        assert(
            elements["vexorion-id-title"]._listeners.click?.length > 0,
            "Title should have a click listener"
        );
        assert(
            elements["vexorion-id-load-data"]._listeners.click?.length > 0,
            "Button should have a click listener"
        );
    });

    test("loadApp() should not throw", () => {
        loadApp();
        assert(true, "loadApp completed without errors");
    });

    test("window.__vexorion_state should exist after loadApp()", () => {
        loadApp();
        assert(globalThis.window.__vexorion_state, "State should be exposed");
    });

    test("window.__vexorion_logs should exist after loadApp()", () => {
        loadApp();
        assert(Array.isArray(globalThis.window.__vexorion_logs));
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
