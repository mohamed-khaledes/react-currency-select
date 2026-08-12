import { createElement, type ReactNode } from "react";
import { FLAG_SVGS } from "./flags.data";
import { toFlag } from "./flag";

export { FLAG_SVGS };

/** True when a vendored SVG exists for this ISO 3166-1 alpha-2 code. */
export function hasSvgFlag(country: string): boolean {
  return Object.prototype.hasOwnProperty.call(FLAG_SVGS, country.trim().toUpperCase());
}

/**
 * A flag that renders identically on every OS — including Windows, which ships
 * no emoji flag glyphs. Pass it straight to `renderFlag`:
 *
 *   <CurrencySelect renderFlag={svgFlag} />
 *
 * Falls back to the emoji flag for countries outside the bundled set.
 */
export function svgFlag(country: string): ReactNode {
  const cc = country.trim().toUpperCase();
  const svg = FLAG_SVGS[cc];
  if (!svg) return toFlag(cc);
  return createElement("span", {
    className: "rcs-flag-svg",
    role: "img",
    "aria-hidden": true,
    // Static, build-time vendored markup — never user input.
    dangerouslySetInnerHTML: { __html: svg },
  });
}

/** Standalone flag element, handy outside the select. */
export function FlagIcon({ country, className }: { country: string; className?: string }) {
  return createElement(
    "span",
    { className: className ? `rcs-flag ${className}` : "rcs-flag" },
    svgFlag(country),
  );
}
