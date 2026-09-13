import {
    reset, test, assert, assertEqual,
    summary, banner
} from "./_assert.js";

import { CONFIG } from "../../scripts/core/config.js";
import { Theme, AnimationType } from "../../scripts/core/enums.js";

export function run() {
    reset();
    banner("config.test.js");

    test("CONFIG.app.name should match APP_INFO", () => {
        assertEqual(CONFIG.app.name, "Vexorion");
    });

    test("CONFIG.app.version should be defined", () => {
        assert(CONFIG.app.version, "version should be defined");
    });

    test("CONFIG.behavior.theme should be valid", () => {
        assert(
            Object.values(Theme).includes(CONFIG.behavior.theme),
            "theme should be a valid Theme enum value"
        );
    });

    test("CONFIG.behavior.animation should be valid", () => {
        assert(
            Object.values(AnimationType).includes(CONFIG.behavior.animation),
            "animation should be a valid AnimationType enum value"
        );
    });

    test("CONFIG.timing values should be positive numbers", () => {
        Object.entries(CONFIG.timing).forEach(([key, val]) => {
            assert(typeof val === "number", `${key} should be a number`);
            assert(val > 0, `${key} should be greater than 0`);
        });
    });

    test("CONFIG.features should be all booleans", () => {
        Object.entries(CONFIG.features).forEach(([key, val]) => {
            assert(typeof val === "boolean", `${key} should be a boolean`);
        });
    });

    test("CONFIG.features.fetchData should be true", () => {
        assertEqual(CONFIG.features.fetchData, true);
    });

    test("CONFIG.features.svgIcons should be true", () => {
        assertEqual(CONFIG.features.svgIcons, true);
    });

    const result = summary();
    console.log(`\n  📊 ${result.passed} passed, ${result.failed} failed`);
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run();
}
