import type { ReactNode } from "react";

export interface Currency {
  /** ISO 4217 code, e.g. "USD". */
  code: string;
  /** Human readable name, e.g. "US Dollar". */
  name: string;
  /** Currency symbol, e.g. "$". */
  symbol: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "US" — used to derive the flag. */
  country: string;
}

export interface CurrencySelectProps {
  /** Controlled selected currency code, e.g. "USD". */
  value?: string;
  /** Uncontrolled initial code. Ignored if `value` is set. */
  defaultValue?: string;
  /** Fires with the FULL Currency object (not just the code). */
  onChange?: (currency: Currency) => void;

  /** Override / subset the list. Defaults to the built-in dataset. */
  currencies?: Currency[];

  /** Text shown when nothing is selected. Default: "Select currency". */
  placeholder?: string;

  /**
   * Colour scheme. Default: `"light"` — the control never follows the OS unless
   * you ask it to, so it cannot go dark inside a light app.
   * Pass `"system"` to opt into `prefers-color-scheme`.
   */
  theme?: "light" | "dark" | "system";

  /**
   * Which flags to draw. Default: `"svg"` — real SVG flags bundled in the
   * package, identical on every OS including Windows. `"emoji"` uses Unicode
   * flag glyphs instead (smaller, but Windows renders them as letters).
   */
  flag?: "svg" | "emoji";

  /** Show a filter input at the top of the dropdown. Default: false. */
  searchable?: boolean;
  /** Placeholder for the filter input. Default: "Search currencies…". */
  searchPlaceholder?: string;

  disabled?: boolean;
  className?: string;
  id?: string;
  /** Sets a hidden input so the value submits in plain HTML forms. */
  name?: string;
  "aria-label"?: string;

  /**
   * Draw your own flag instead of the built-in ones (e.g. your own SVG sprite
   * or an <img>). Takes precedence over `flag`.
   */
  renderFlag?: (country: string) => ReactNode;

  /**
   * Auto-injects the component stylesheet into <head> on first render.
   * Default: true. Set false only if you import `styles.css` yourself or ship a
   * strict CSP that forbids inline styles.
   */
  injectStyles?: boolean;
}
