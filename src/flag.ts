/**
 * Convert an ISO 3166-1 alpha-2 country code to its emoji flag by mapping
 * each letter to its Regional Indicator Symbol. No data stored, no deps.
 *   toFlag("US") -> "🇺🇸"
 */
export function toFlag(countryCode: string): string {
  const cc = countryCode.trim().toUpperCase();
  if (cc.length !== 2 || !/^[A-Z]{2}$/.test(cc)) return "";
  const A = 0x1f1e6; // Regional Indicator "A"
  return String.fromCodePoint(
    A + (cc.charCodeAt(0) - 65),
    A + (cc.charCodeAt(1) - 65),
  );
}
