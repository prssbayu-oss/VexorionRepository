import {
    reset, test, assert, assertEqual, assertIncludes,
    summary, banner
} from "./_assert.js";

import {
    TIMING,
    APP_INFO,
    ID_PREFIX,
    CLASS_PREFIX,
    ELEMENT_IDS,
    ELEMENT_CLASSES,
    PREFIX,
    LIMITS,
    API_URLS,
    ASSETS
} from "../../scripts/core/constants.js";

export function run() {
    reset();
    banner("constants.test.js");

    test("APP_INFO.NAME should equal 'Vexorion'", () => {
        assertEqual(APP_INFO.NAME, "Vexorion");
    });

    test("APP_INFO should have all required fields", () => {
        assert(APP_INFO.VERSION, "VERSION should be defined");
        assert(APP_INFO.TAGLINE, "TAGLINE should be defined");
        assert(APP_INFO.AUTHOR, "AUTHOR should be defined");
    });

    test("ID_PREFIX should equal 'vexorion-id-'", () => {
        assertEqual(ID_PREFIX, "vexorion-id-");
    });

    test("CLASS_PREFIX should equal 'vexorion-class-'", () => {
        assertEqual(CLASS_PREFIX, "vexorion-class-");
    });

    test("All ELEMENT_IDS should use ID prefix", () => {
        Object.entries(ELEMENT_IDS).forEach(([key, val]) => {
            assert(
                val.startsWith("vexorion-id-"),
                `${key} = ${val} should use prefix`
            );
        });
    });

    test("All ELEMENT_CLASSES should use class prefix", () => {
        Object.entries(ELEMENT_CLASSES).forEach(([key, val]) => {
            assert(
                val.startsWith("vexorion-class-"),
                `${key} = ${val} should use prefix`
            );
        });
    });

    test("ELEMENT_IDS.TITLE should be correct", () => {
        assertEqual(ELEMENT_IDS.TITLE, "vexorion-id-title");
    });

    test("ELEMENT_IDS.OUTPUT should be correct", () => {
        assertEqual(ELEMENT_IDS.OUTPUT, "vexorion-id-output");
    });

    test("ELEMENT_IDS.LOAD_BTN should be correct", () => {
        assertEqual(ELEMENT_IDS.LOAD_BTN, "vexorion-id-load-data");
    });

    test("ELEMENT_IDS.USER_LIST should be correct", () => {
        assertEqual(ELEMENT_IDS.USER_LIST, "vexorion-id-user-list");
    });

    test("ELEMENT_IDS.EMPTY_STATE should be correct", () => {
        assertEqual(ELEMENT_IDS.EMPTY_STATE, "vexorion-id-empty-state");
    });

    test("ELEMENT_CLASSES.HIDDEN should be correct", () => {
        assertEqual(ELEMENT_CLASSES.HIDDEN, "vexorion-class-hidden");
    });

    test("ELEMENT_CLASSES.LOGO should be correct", () => {
        assertEqual(ELEMENT_CLASSES.LOGO, "vexorion-class-logo");
    });

    test("TIMING values should be positive numbers", () => {
        Object.entries(TIMING).forEach(([key, val]) => {
            assert(typeof val === "number", `${key} should be a number`);
            assert(val > 0, `${key} should be greater than 0`);
        });
    });

    test("PREFIX values should be emojis", () => {
        assertEqual(PREFIX.ACTIVE, "⚡");
        assertEqual(PREFIX.SPARKLE, "✨");
        assertEqual(PREFIX.CHECK, "✅");
    });

    test("LIMITS.MAX_USERS should be reasonable", () => {
        assert(LIMITS.MAX_USERS > 0, "MAX_USERS should be > 0");
        assert(LIMITS.MAX_USERS <= 100, "MAX_USERS should be <= 100");
    });

    test("API_URLS should use HTTPS", () => {
        Object.values(API_URLS).forEach(url => {
            assert(url.startsWith("https://"), `${url} should use HTTPS`);
        });
    });

    test("ASSETS should reference SVG files", () => {
        Object.values(ASSETS).forEach(path => {
            assertIncludes(path, ".svg", `${path} should be .svg`);
        });
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
