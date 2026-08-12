import { COUNTRY_CURRENCY } from "./countries.data";
import { currencies as builtInCurrencies } from "./currencies";
import type { Currency } from "./types";

export { COUNTRY_CURRENCY };

/**
 * ISO 3166-1 alpha-2 country code -> the ISO 4217 code used there.
 *   currencyCodeForCountry("DE") -> "EUR"
 *   currencyCodeForCountry("ZZ") -> undefined
 */
export function currencyCodeForCountry(country: string): string | undefined {
  return COUNTRY_CURRENCY[country.trim().toUpperCase()];
}

/**
 * The full Currency a country uses, looked up in `list` (the built-in dataset
 * by default) so a custom `currencies` array still resolves correctly.
 */
export function currencyForCountry(
  country: string,
  list: Currency[] = builtInCurrencies,
): Currency | undefined {
  const code = currencyCodeForCountry(country);
  return code ? list.find((c) => c.code === code) : undefined;
}
