import {
    APP_INFO,
    PREFIX,
    TIMING,
    ELEMENT_IDS,
    API_URLS,
    LIMITS
} from "../core/constants.js";
import { CONFIG } from "../core/config.js";
import { state } from "../data/state.js";
import { debug, success, error as logError } from "../helpers/logger.js";
import {
    get, create, append, clear, show, hide
} from "../helpers/dom.js";
import { upper, userLabel } from "../helpers/formatter.js";
import { delay, debounce } from "../helpers/timing.js";
import { getUsers } from "../helpers/api.js";

// Title click handler with sparkle feedback
function setupTitleClick(titleElement) {
    if (!CONFIG.features.clickEffect) return;

    titleElement.addEventListener(
        "click",
        debounce(async () => {
            if (state.isAnimating) return;

            state.isAnimating = true;
            state.clickCount++;
            state.lastClickTime = Date.now();

            titleElement.textContent =
                `${PREFIX.SPARKLE} ${APP_INFO.NAME} ${PREFIX.SPARKLE}`;

            debug(`Title clicked (${state.clickCount}x)`);

            await delay(TIMING.CLICK_FEEDBACK_DURATION);
            titleElement.textContent = upper(APP_INFO.NAME);

            state.isAnimating = false;
        }, 200)
    );
}

// Title hover effect
function setupHoverEffect(titleElement) {
    titleElement.addEventListener("mouseenter", () => {
        titleElement.dataset.state = "hover";
    });

    titleElement.addEventListener("mouseleave", () => {
        titleElement.dataset.state = "default";
    });
}

// Render user list into DOM
function renderUserList(users) {
    const listEl = get(ELEMENT_IDS.USER_LIST);
    if (!listEl) return;

    clear(listEl);

    users.slice(0, LIMITS.MAX_USERS).forEach(user => {
        const li = create("li", { text: userLabel(user) });
        append(listEl, li);
    });

    debug(`Rendered ${users.length} users`);
}

// Show or hide the empty state illustration
function toggleEmptyState(visible) {
    const emptyEl = get(ELEMENT_IDS.EMPTY_STATE);
    if (!emptyEl) return;

    if (visible) {
        show(emptyEl);
    } else {
        hide(emptyEl);
    }
}

// Handle load data button click
async function handleLoadData() {
    if (!CONFIG.features.fetchData) return;
    if (state.isLoading) {
        debug("Already loading, skip");
        return;
    }

    try {
        state.isLoading = true;
        state.dataLoadCount++;
        debug("Loading users...");

        toggleEmptyState(false);

        const users = await getUsers(API_URLS.USERS);

        state.users = users;
        state.lastFetchTime = Date.now();

        renderUserList(users);

        if (users.length === 0) {
            toggleEmptyState(true);
        }

        success(`Loaded ${users.length} users`);
    } catch (err) {
        logError(`Load data failed: ${err.message}`);
        state.hasError = true;
        toggleEmptyState(true);
    } finally {
        state.isLoading = false;
    }
}

// Attach load data button handler
function setupLoadDataButton(buttonElement) {
    if (!buttonElement) return;

    buttonElement.addEventListener("click", debounce(handleLoadData, 300));
}

export {
    setupTitleClick,
    setupHoverEffect,
    setupLoadDataButton,
    renderUserList,
    toggleEmptyState,
    handleLoadData
};
