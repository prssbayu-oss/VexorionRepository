import { startWhenReady } from "./loaders/loader.js";

startWhenReady();

export {
    TIMING,
    APP_INFO,
    ID_PREFIX,
    CLASS_PREFIX,
    ELEMENT_IDS,
    ELEMENT_CLASSES,
    PREFIX,
    LIMITS,
    API_URLS,
    ASSETS
} from "./core/constants.js";

export { Theme, AppStatus, LogLevel, AnimationType } from "./core/enums.js";
export { CONFIG } from "./core/config.js";
export { state } from "./data/state.js";
export * as logger    from "./helpers/logger.js";
export * as dom       from "./helpers/dom.js";
export * as formatter from "./helpers/formatter.js";
export * as timing    from "./helpers/timing.js";
export * as validator from "./helpers/validator.js";
export * as storage   from "./helpers/storage.js";
export * as api       from "./helpers/api.js";
export * as svg       from "./helpers/svg.js";
export {
    setupTitleClick,
    setupHoverEffect,
    setupLoadDataButton
} from "./handlers/events.js";
