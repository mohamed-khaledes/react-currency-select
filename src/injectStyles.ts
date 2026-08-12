import { STYLES } from "./styles.gen";

const MARKER = "data-rcs-styles";

/**
 * Injects the component stylesheet once per document. SSR-safe (no-op without a
 * DOM) and idempotent across multiple copies of the package.
 *
 * The <style> tag is *prepended* to <head> so anything the consumer ships wins
 * on equal specificity — their overrides keep working without `!important`.
 */
export function injectStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`style[${MARKER}]`)) return;
  const el = document.createElement("style");
  el.setAttribute(MARKER, "");
  el.textContent = STYLES;
  document.head.prepend(el);
}
