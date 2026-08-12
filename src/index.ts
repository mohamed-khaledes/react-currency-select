export { CurrencySelect } from "./CurrencySelect";
export { currencies } from "./currencies";
export { toFlag } from "./flag";
// The SVG flags ship with the component now, so they are available from the
// main entry — no subpath import needed. `./flags` still works for anyone who
// only wants the artwork.
export { svgFlag, FlagIcon, hasSvgFlag, FLAG_SVGS } from "./flags";
export { injectStyles } from "./injectStyles";
export type { Currency, CurrencySelectProps } from "./types";
