import { PREFIX } from "../core/constants.js";

// Convert to uppercase
function upper(text) {
    return String(text).toUpperCase();
}

// Convert to lowercase
function lower(text) {
    return String(text).toLowerCase();
}

// Capitalize first letter
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Capitalize each word
function titleCase(text) {
    return text.split(" ").map(capitalize).join(" ");
}

// Prepend a prefix
function withPrefix(prefix, text) {
    return `${prefix} ${text}`;
}

// Format the output status message
function outputMessage(appName, tagline) {
    return `${PREFIX.ACTIVE} ${appName} is active — ${tagline}`;
}

// Truncate long text
function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
}

// Format number with fixed decimals
function number(num, decimals = 0) {
    return Number(num).toFixed(decimals);
}

// Format bytes into human-readable size
function bytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Format user info as a label
function userLabel(user) {
    return `${user.name} — ${user.email}`;
}

export {
    upper, lower, capitalize, titleCase,
    withPrefix, outputMessage, truncate,
    number, bytes, userLabel
};
