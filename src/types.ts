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

  /** Optional: replace the emoji flag with your own node (e.g. an SVG). */
  renderFlag?: (country: string) => ReactNode;
}
