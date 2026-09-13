import { AppStatus } from "../core/enums.js";

// Runtime application state
const state = {
    // Current content
    currentTitle: "",
    currentOutput: "",
    status: AppStatus.LOADING,

    // Interaction counters
    clickCount: 0,
    loadCount: 0,
    dataLoadCount: 0,

    // Timestamps
    startTime: Date.now(),
    lastClickTime: null,
    lastFetchTime: null,

    // Data cache
    users: [],

    // Flags
    isAnimating: false,
    isLoading: false,
    hasError: false
};

export { state };
