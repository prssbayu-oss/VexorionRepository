// Promise-based delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Debounce: delay execution until calls stop
function debounce(fn, wait = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
    };
}

// Throttle: limit execution frequency
function throttle(fn, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Format duration for display
function format(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

export { delay, debounce, throttle, format };
