import { error as logError } from "./logger.js";
import { ELEMENT_CLASSES } from "../core/constants.js";

// Retrieve element by ID with error logging
function get(id) {
    const el = document.getElementById(id);
    if (!el) logError(`Element #${id} not found!`);
    return el;
}

// Retrieve all elements matching selector
function getAll(selector) {
    return document.querySelectorAll(selector);
}

// Set text content safely
function setText(element, text) {
    if (!element) return;
    element.textContent = text;
}

// Set multiple attributes
function setAttrs(element, attrs) {
    if (!element) return;
    Object.entries(attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}

// Class management
function addClass(element, className) {
    element?.classList.add(className);
}

function removeClass(element, className) {
    element?.classList.remove(className);
}

function toggleClass(element, className) {
    element?.classList.toggle(className);
}

// Visibility helpers
function show(element) {
    element?.classList.remove(ELEMENT_CLASSES.HIDDEN);
}

function hide(element) {
    element?.classList.add(ELEMENT_CLASSES.HIDDEN);
}

// Create new element with options
function create(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    if (options.className) el.className = options.className;
    if (options.id) el.id = options.id;
    if (options.attrs) setAttrs(el, options.attrs);
    return el;
}

// Append child to parent
function append(parent, child) {
    parent?.appendChild(child);
}

// Clear all children
function clear(parent) {
    if (!parent) return;
    parent.innerHTML = "";
}

// Remove element from DOM
function remove(element) {
    element?.remove();
}

export {
    get, getAll,
    setText, setAttrs,
    addClass, removeClass, toggleClass,
    show, hide,
    create, append, clear, remove
};
