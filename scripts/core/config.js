import { APP_INFO, TIMING } from "./constants.js";
import { Theme, AnimationType } from "./enums.js";

// Application configuration
const CONFIG = {
    // Application metadata
    app: {
        name: APP_INFO.NAME,
        version: APP_INFO.VERSION,
        tagline: APP_INFO.TAGLINE
    },

    // Behavior settings
    behavior: {
        theme: Theme.DARK,
        animation: AnimationType.FADE_IN,
        debugMode: true
    },

    // Timing configuration
    timing: {
        animationDuration: TIMING.ANIMATION_DURATION,
        fadeInDelay: TIMING.FADE_IN_DELAY,
        clickFeedback: TIMING.CLICK_FEEDBACK_DURATION,
        apiTimeout: TIMING.API_TIMEOUT
    },

    // Feature toggles
    features: {
        clickEffect: true,
        glowEffect: true,
        consoleLog: true,
        analytics: false,
        fetchData: true,
        svgIcons: true
    }
};

export { CONFIG };
