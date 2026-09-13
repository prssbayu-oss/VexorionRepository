import { LogLevel } from "../core/enums.js";
import { CONFIG } from "../core/config.js";

// Icon mapping for each log level
const icons = {
    [LogLevel.INFO]: "ℹ️",
    [LogLevel.WARN]: "⚠️",
    [LogLevel.ERROR]: "❌",
    [LogLevel.DEBUG]: "🐛",
    [LogLevel.SUCCESS]: "✅"
};

// Core log function
function log(message, level = LogLevel.INFO) {
    if (!CONFIG.features.consoleLog) return;
    const icon = icons[level] || "•";
    console.log(`${icon} [${level}] ${message}`);
}

// Level-specific shortcuts
function info(msg)    { log(msg, LogLevel.INFO); }
function warn(msg)    { log(msg, LogLevel.WARN); }
function error(msg)   { log(msg, LogLevel.ERROR); }
function debug(msg)   { log(msg, LogLevel.DEBUG); }
function success(msg) { log(msg, LogLevel.SUCCESS); }

// Grouped logging
function group(title, fn) {
    if (!CONFIG.features.consoleLog) {
        fn();
        return;
    }
    console.group(`📦 ${title}`);
    fn();
    console.groupEnd();
}

export { log, info, warn, error, debug, success, group };
