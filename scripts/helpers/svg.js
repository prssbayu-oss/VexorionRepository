import { debug, error as logError } from "./logger.js";

// SVG namespace
const NS = "http://www.w3.org/2000/svg";

// Create SVG element with attributes
function createEl(tag, attrs = {}) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => {
        el.setAttribute(k, v);
    });
    return el;
}

// Load SVG file content as text
async function load(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        debug(`SVG loaded: ${url}`);
        return text;
    } catch (err) {
        logError(`SVG load failed: ${err.message}`);
        return "";
    }
}

// Inject SVG into container
async function inject(url, container) {
    const text = await load(url);
    if (container && text) {
        container.innerHTML = text;
    }
    return text;
}

// Create SVG icon referencing external file
function createIcon(name, options = {}) {
    const svg = createEl("svg", {
        viewBox: options.viewBox || "0 0 24 24",
        width: options.size || 24,
        height: options.size || 24,
        class: options.className || "vexorion-class-icon"
    });

    const use = createEl("use", {
        href: `assets/icons/${name}.svg#icon`
    });

    svg.appendChild(use);
    return svg;
}

// Create image element for SVG
function createImg(src, options = {}) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = options.alt || "";
    if (options.className) img.className = options.className;
    if (options.width) img.width = options.width;
    if (options.height) img.height = options.height;
    return img;
}

export { NS, createEl, load, inject, createIcon, createImg };
