// Theme options
const Theme = Object.freeze({
    DARK: "dark",
    LIGHT: "light",
    AUTO: "auto"
});

// Application status states
const AppStatus = Object.freeze({
    LOADING: "loading",
    READY: "ready",
    ERROR: "error",
    IDLE: "idle"
});

// Logging levels
const LogLevel = Object.freeze({
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
    DEBUG: "DEBUG",
    SUCCESS: "SUCCESS"
});

// Animation types
const AnimationType = Object.freeze({
    FADE_IN: "fadeIn",
    SLIDE_UP: "slideUp",
    PULSE: "pulse",
    NONE: "none"
});

export { Theme, AppStatus, LogLevel, AnimationType };
