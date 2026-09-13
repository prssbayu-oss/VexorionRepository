import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

// Minimal DOM mock for Node.js
class MockElement {
    constructor(tag = "div") {
        this.tagName = tag.toUpperCase();
        this.children = [];
        this.attributes = {};
        this.className = "";
        this.textContent = "";
        this.innerHTML = "";
        this.id = "";
        this.classList = {
            _set: new Set(),
            add(c) { this._set.add(c); },
            remove(c) { this._set.delete(c); },
            contains(c) { return this._set.has(c); },
            toggle(c) {
                if (this._set.has(c)) this._set.delete(c);
                else this._set.add(c);
            }
        };
    }
    appendChild(child) {
        this.children.push(child);
        return child;
    }
    setAttribute(k, v) {
        this.attributes[k] = v;
    }
    remove() {}
}

globalThis.HTMLElement = MockElement;

const elements = {};
globalThis.document = {
    getElementById(id) { return elements[id] || null; },
    createElement(tag) { return new MockElement(tag); },
    querySelectorAll() { return []; }
};

const {
    get, setText, setAttrs,
    addClass, removeClass, toggleClass,
    show, hide, create, append, clear, remove
} = await import("../../scripts/helpers/dom.js");

export function run() {
    reset();
    banner("dom.test.js");

    test("create() should build a new element", () => {
        const el = create("div", { text: "hello" });
        assertEqual(el.tagName, "DIV");
        assertEqual(el.textContent, "hello");
    });

    test("create() should support className", () => {
        const el = create("span", { className: "vexorion-class-test" });
        assertEqual(el.className, "vexorion-class-test");
    });

    test("create() should support id", () => {
        const el = create("p", { id: "vexorion-id-test" });
        assertEqual(el.id, "vexorion-id-test");
    });

    test("create() should support attributes", () => {
        const el = create("a", { attrs: { href: "https://test.com" } });
        assertEqual(el.attributes.href, "https://test.com");
    });

    test("setText() should change textContent", () => {
        const el = new MockElement();
        setText(el, "new text");
        assertEqual(el.textContent, "new text");
    });

    test("setText(null) should not throw", () => {
        setText(null, "test");
        assert(true, "Should handle null gracefully");
    });

    test("setAttrs() should set multiple attributes", () => {
        const el = new MockElement();
        setAttrs(el, { a: "1", b: "2" });
        assertEqual(el.attributes.a, "1");
        assertEqual(el.attributes.b, "2");
    });

    test("addClass() should add a class", () => {
        const el = new MockElement();
        addClass(el, "vexorion-class-active");
        assert(el.classList.contains("vexorion-class-active"));
    });

    test("removeClass() should remove a class", () => {
        const el = new MockElement();
        addClass(el, "vexorion-class-active");
        removeClass(el, "vexorion-class-active");
        assert(!el.classList.contains("vexorion-class-active"));
    });

    test("toggleClass() should toggle a class", () => {
        const el = new MockElement();
        toggleClass(el, "vexorion-class-active");
        assert(el.classList.contains("vexorion-class-active"));
        toggleClass(el, "vexorion-class-active");
        assert(!el.classList.contains("vexorion-class-active"));
    });

    test("hide() should add 'vexorion-class-hidden'", () => {
        const el = new MockElement();
        hide(el);
        assert(el.classList.contains("vexorion-class-hidden"));
    });

    test("show() should remove 'vexorion-class-hidden'", () => {
        const el = new MockElement();
        el.classList.add("vexorion-class-hidden");
        show(el);
        assert(!el.classList.contains("vexorion-class-hidden"));
    });

    test("append() should add child to parent", () => {
        const parent = new MockElement();
        const child = new MockElement();
        append(parent, child);
        assertEqual(parent.children.length, 1);
    });

    test("clear() should empty innerHTML", () => {
        const el = new MockElement();
        el.innerHTML = "<p>test</p>";
        clear(el);
        assertEqual(el.innerHTML, "");
    });

    test("get() should return null for missing element", () => {
        const el = get("vexorion-id-nonexistent");
        assertEqual(el, null);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
