// Timing values in milliseconds
const TIMING = {
    ANIMATION_DURATION: 800,
    FADE_IN_DELAY: 300,
    CLICK_FEEDBACK_DURATION: 1000,
    PULSE_INTERVAL: 2000,
    API_TIMEOUT: 5000
};

// Application identity
const APP_INFO = {
    NAME: "Vexorion",
    VERSION: "1.0.0",
    AUTHOR: "Your Name",
    TAGLINE: "Script runs after HTML is fully loaded!"
};

// Prefix conventions for DOM elements
const ID_PREFIX = "vexorion-id-";
const CLASS_PREFIX = "vexorion-class-";

// DOM element IDs
const ELEMENT_IDS = {
    TITLE: "vexorion-id-title",
    OUTPUT: "vexorion-id-output",
    LOAD_BTN: "vexorion-id-load-data",
    USER_LIST: "vexorion-id-user-list",
    EMPTY_STATE: "vexorion-id-empty-state"
};

// DOM element classes
const ELEMENT_CLASSES = {
    CONTAINER: "vexorion-class-container",
    LOGO: "vexorion-class-logo",
    ICON: "vexorion-class-icon",
    EMPTY: "vexorion-class-empty",
    HIDDEN: "vexorion-class-hidden"
};

// Display prefixes and icons
const PREFIX = {
    ACTIVE: "⚡",
    SPARKLE: "✨",
    CHECK: "✅"
};

// Application limits
const LIMITS = {
    MAX_TITLE_LENGTH: 50,
    MIN_TITLE_LENGTH: 1,
    MAX_RETRIES: 3,
    MAX_USERS: 10
};

// External API endpoints
const API_URLS = {
    USERS: "https://jsonplaceholder.typicode.com/users",
    POSTS: "https://jsonplaceholder.typicode.com/posts"
};

// SVG asset paths
const ASSETS = {
    LOGO: "assets/logo/logo.svg",
    ICON_BOLT: "assets/icons/bolt.svg",
    ICON_SPARKLE: "assets/icons/sparkle.svg",
    ICON_CHECK: "assets/icons/check.svg",
    ICON_LOADING: "assets/icons/loading.svg",
    ICON_ERROR: "assets/icons/error.svg",
    EMPTY_STATE: "assets/illustrations/empty-state.svg",
    HERO: "assets/illustrations/hero.svg"
};

export {
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
};
