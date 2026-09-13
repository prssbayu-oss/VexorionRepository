import {
    reset, test, testAsync, assert, assertEqual,
    summary, banner
} from "./_assert.js";

// Mock fetch for SVG content
globalThis.fetch = async (url) => {
    if (url.includes("error")) {
        return { ok: false, status: 404 };
    }
    return {
        ok: true,
        status: 200,
        text: async () => '<svg xmlns="http://www.w3.org/2000/svg"><circle/></svg>'
    };
};

// Minimal DOM mock
class MockElement {
    constructor(tag = "div") {
        this.tagName = tag.toUpperCase();
        this.attributes = {};
        this.children = [];
        this.innerHTML = "";
        this.className = "";
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    appendChild(c) { this.children.push(c); return c; }
}

globalThis.document = {
    createElement: (tag) => new MockElement(tag),
    createElementNS: (ns, tag) => new MockElement(tag)
};

const { NS, createEl, load, inject, createIcon, createImg } =
    await import("../../scripts/helpers/svg.js");

export async function run() {
    reset();
    banner("svg.test.js");

    test("NS should equal SVG namespace", () => {
        assertEqual(NS, "http://www.w3.org/2000/svg");
    });

    test("createEl() should build SVG element", () => {
        const el = createEl("circle", { cx: "50", cy: "50" });
        assertEqual(el.tagName, "CIRCLE");
        assertEqual(el.attributes.cx, "50");
    });

    test("createEl() should set multiple attributes", () => {
        const el = createEl("rect", { x: "0", y: "0", width: "100" });
        assertEqual(el.attributes.x, "0");
        assertEqual(el.attributes.width, "100");
    });

    await testAsync("load() should return SVG text", async () => {
        const text = await load("assets/logo.svg");
        assert(text.includes("<svg"), "Should include <svg> tag");
    });

    await testAsync("load() should return empty string on error", async () => {
        const text = await load("assets/error.svg");
        assertEqual(text, "");
    });

    await testAsync("inject() should fill container with SVG", async () => {
        const container = new MockElement();
        await inject("assets/logo.svg", container);
        assert(container.innerHTML.includes("<svg"), "Container should be filled");
    });

    await testAsync("inject() should handle null container", async () => {
        await inject("assets/logo.svg", null);
        assert(true, "Should not crash");
    });

    test("createIcon() should build SVG with use element", () => {
        const icon = createIcon("bolt", { size: 32 });
        assertEqual(icon.tagName, "SVG");
        assertEqual(icon.attributes.width, 32);
        assertEqual(icon.attributes.height, 32);
        assertEqual(icon.children.length, 1, "Should have one use element");
    });

    test("createIcon() should default size to 24", () => {
        const icon = createIcon("bolt");
        assertEqual(icon.attributes.width, 24);
    });

    test("createIcon() should support custom className", () => {
        const icon = createIcon("bolt", { className: "vexorion-class-icon" });
        assertEqual(icon.attributes.class, "vexorion-class-icon");
    });

    test("createImg() should build <img> with src", () => {
        const img = createImg("assets/logo.svg", { alt: "Logo" });
        assertEqual(img.tagName, "IMG");
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
