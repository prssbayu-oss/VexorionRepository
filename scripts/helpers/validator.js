// Check if value is a string
function isString(value) {
    return typeof value === "string";
}

// Check if text is empty or whitespace
function isEmpty(text) {
    return !text || text.trim().length === 0;
}

// Check if text length is within range
function isLengthValid(text, min, max) {
    return text.length >= min && text.length <= max;
}

// Check if value is a valid number
function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
}

// Check if number is positive
function isPositive(num) {
    return isNumber(num) && num > 0;
}

// Check if number is within range
function isInRange(num, min, max) {
    return num >= min && num <= max;
}

// Check if value is a DOM element
function isElement(value) {
    return value instanceof HTMLElement;
}

// Check if element with ID exists
function elementExists(id) {
    return document.getElementById(id) !== null;
}

// Check if value is an object
function isObject(value) {
    return value !== null && typeof value === "object";
}

// Check if object has no keys
function isEmptyObject(obj) {
    return isObject(obj) && Object.keys(obj).length === 0;
}

// Check if value is an array
function isArray(value) {
    return Array.isArray(value);
}

// Check if value is a non-empty array
function isNonEmptyArray(value) {
    return isArray(value) && value.length > 0;
}

export {
    isString, isEmpty, isLengthValid,
    isNumber, isPositive, isInRange,
    isElement, elementExists,
    isObject, isEmptyObject,
    isArray, isNonEmptyArray
};
