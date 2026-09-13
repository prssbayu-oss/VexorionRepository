import { debug, error as logError, warn } from "./logger.js";
import { TIMING } from "../core/constants.js";

// Default headers for all requests
const DEFAULT_HEADERS = {
    "Content-Type": "application/json"
};

// Core fetch wrapper
async function request(url, options = {}) {
    const config = {
        method: options.method || "GET",
        headers: { ...DEFAULT_HEADERS, ...options.headers }
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    try {
        debug(`Fetch: ${config.method} ${url}`);
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return await response.text();
    } catch (err) {
        logError(`Fetch failed: ${err.message}`);
        throw err;
    }
}

// Wrap a promise with a timeout
function withTimeout(promise, ms = TIMING.API_TIMEOUT) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), ms)
    );
    return Promise.race([promise, timeout]);
}

// HTTP method shortcuts
async function get(url) {
    return withTimeout(request(url, { method: "GET" }));
}

async function post(url, body) {
    return withTimeout(request(url, { method: "POST", body }));
}

async function put(url, body) {
    return withTimeout(request(url, { method: "PUT", body }));
}

async function del(url) {
    return withTimeout(request(url, { method: "DELETE" }));
}

// Fetch users with graceful error handling
async function getUsers(url) {
    try {
        const users = await get(url);
        debug(`Fetched ${users.length} users`);
        return users;
    } catch (err) {
        warn(`Failed to fetch users: ${err.message}`);
        return [];
    }
}

export { request, get, post, put, del, withTimeout, getUsers };
