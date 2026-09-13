import { APP_INFO, ELEMENT_IDS } from "../core/constants.js";
import { AppStatus } from "../core/enums.js";
import { state } from "../data/state.js";
import * as logger from "../helpers/logger.js";
import * as dom from "../helpers/dom.js";
import * as formatter from "../helpers/formatter.js";
import * as validator from "../helpers/validator.js";
import * as storage from "../helpers/storage.js";
import {
    setupTitleClick,
    setupHoverEffect,
    setupLoadDataButton,
    toggleEmptyState
} from "../handlers/events.js";

// Check if all required DOM elements exist
function validateRequiredElements() {
    const required = [
        ELEMENT_IDS.TITLE,
        ELEMENT_IDS.OUTPUT,
        ELEMENT_IDS.LOAD_BTN,
        ELEMENT_IDS.USER_LIST
    ];
    return required.every(id => validator.elementExists(id));
}

// Render main content into DOM
function renderContent(titleEl, outputEl) {
    dom.setText(titleEl, formatter.upper(APP_INFO.NAME));
    dom.setText(
        outputEl,
        formatter.outputMessage(APP_INFO.NAME, APP_INFO.TAGLINE)
    );
}

// Synchronize state with rendered DOM
function syncState(titleEl, outputEl) {
    state.currentTitle = titleEl.textContent;
    state.currentOutput = outputEl.textContent;
    state.status = AppStatus.READY;
    state.loadCount++;
}

// Persist key state values to storage
function persistState() {
    storage.set("lastTitle", state.currentTitle);
    storage.set("lastVisit", Date.now());
}

// Attach all event listeners
function bindEvents(titleEl, loadBtn) {
    setupTitleClick(titleEl);
    setupHoverEffect(titleEl);
    setupLoadDataButton(loadBtn);
}

// Expose state and console logs for testing
function exposeForTesting() {
    window.__vexorion_state = state;
    window.__vexorion_logs = [];

    const originalLog = console.log;
    console.log = (...args) => {
        const text = args.join(" ");
        window.__vexorion_logs.push(text);
        originalLog(...args);
    };
}

// Main application loader
function loadApp() {
    logger.group("Initialization", () => {
        logger.info(`Starting ${APP_INFO.NAME} v${APP_INFO.VERSION}...`);

        if (!validateRequiredElements()) {
            logger.error("Required elements missing!");
            state.status = AppStatus.ERROR;
            state.hasError = true;
            return;
        }

        const titleEl = dom.get(ELEMENT_IDS.TITLE);
        const outputEl = dom.get(ELEMENT_IDS.OUTPUT);
        const loadBtn = dom.get(ELEMENT_IDS.LOAD_BTN);

        renderContent(titleEl, outputEl);
        syncState(titleEl, outputEl);
        persistState();
        bindEvents(titleEl, loadBtn);
        toggleEmptyState(true);
        exposeForTesting();

        logger.success(`${APP_INFO.NAME} ready!`);
    });
}

// Start app when DOM is ready
function startWhenReady() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadApp);
    } else {
        loadApp();
    }
}

export {
    loadApp,
    startWhenReady,
    validateRequiredElements,
    renderContent,
    syncState,
    persistState,
    bindEvents
};
