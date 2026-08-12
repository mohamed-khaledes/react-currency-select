import * as React from "react";
import { currencies as builtInCurrencies } from "./currencies";
import { toFlag } from "./flag";
import { useClickOutside } from "./useClickOutside";
import type { Currency, CurrencySelectProps } from "./types";

/** React 18 `useId` when available, tiny counter fallback for React 17. */
let counter = 0;
const useStableId: () => string =
  (React as { useId?: () => string }).useId ??
  function useFallbackId() {
    const ref = React.useRef<string>("");
    if (!ref.current) ref.current = `rcs-${++counter}`;
    return ref.current;
  };

const TYPEAHEAD_RESET_MS = 600;

export function CurrencySelect({
  value,
  defaultValue,
  onChange,
  currencies = builtInCurrencies,
  placeholder = "Select currency",
  searchable = false,
  searchPlaceholder = "Search currencies…",
  disabled = false,
  className,
  id,
  name,
  "aria-label": ariaLabel,
  renderFlag,
}: CurrencySelectProps) {
  const autoId = useStableId();
  const baseId = id ?? `rcs-${autoId}`;
  const listId = `${baseId}-listbox`;
  const optionId = (code: string) => `${baseId}-opt-${code}`;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const [innerCode, setInnerCode] = React.useState<string | undefined>(defaultValue);
  const currentCode = isControlled ? value : innerCode;
  const selected = React.useMemo(
    () => currencies.find((c) => c.code === currentCode),
    [currencies, currentCode],
  );

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!searchable || !q) return currencies;
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    );
  }, [currencies, query, searchable]);

  const activeOption = filtered[active];

  const openList = React.useCallback(() => {
    const index = Math.max(
      0,
      currencies.findIndex((c) => c.code === currentCode),
    );
    setQuery("");
    setActive(index);
    setOpen(true);
  }, [currencies, currentCode]);

  const closeList = React.useCallback((focusTrigger: boolean) => {
    setOpen(false);
    setQuery("");
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const handleClose = React.useCallback(() => closeList(false), [closeList]);
  useClickOutside(rootRef, handleClose, open);

  const select = React.useCallback(
    (currency: Currency | undefined) => {
      if (!currency) return;
      if (!isControlled) setInnerCode(currency.code);
      onChange?.(currency);
      closeList(true);
    },
    [closeList, isControlled, onChange],
  );

  // Keep the active option visible while navigating.
  React.useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, filtered]);

  // Move focus into the popup: the filter input in searchable mode, otherwise the
  // listbox itself — the element that carries `aria-activedescendant`.
  React.useEffect(() => {
    if (!open) return;
    if (searchable) searchRef.current?.focus();
    else listRef.current?.focus();
  }, [open, searchable]);

  // Type-ahead buffer (used when there is no search input).
  const bufferRef = React.useRef("");
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const typeahead = React.useCallback(
    (char: string, from: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      bufferRef.current += char.toLowerCase();
      timerRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, TYPEAHEAD_RESET_MS);

      const buffer = bufferRef.current;
      const total = filtered.length;
      // Repeating one letter cycles through the options starting with it;
      // anything else matches the whole buffer as a prefix.
      const repeated = buffer.length > 1 && buffer.split("").every((c) => c === char.toLowerCase());
      const needle = repeated ? char.toLowerCase() : buffer;
      const start = needle.length === 1 ? from + 1 : from;
      for (let i = 0; i < total; i++) {
        const index = (start + i + total) % total;
        const option = filtered[index];
        if (!option) continue;
        if (
          option.code.toLowerCase().startsWith(needle) ||
          option.name.toLowerCase().startsWith(needle)
        ) {
          return index;
        }
      }
      return -1;
    },
    [filtered],
  );

  const move = (delta: number) => {
    const total = filtered.length;
    if (!total) return;
    setActive((prev) => (prev + delta + total) % total);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const { key, altKey, ctrlKey, metaKey } = event;
    const inSearch = searchable && event.target === searchRef.current;
    const printable = key.length === 1 && !ctrlKey && !metaKey && !altKey;

    if (!open) {
      if (key === "Enter" || key === " " || key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        openList();
      } else if (printable && !searchable && key !== " ") {
        event.preventDefault();
        const from = Math.max(
          0,
          currencies.findIndex((c) => c.code === currentCode),
        );
        openList();
        const next = typeahead(key, from);
        if (next >= 0) setActive(next);
      }
      return;
    }

    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        return;
      case "Home":
        event.preventDefault();
        setActive(0);
        return;
      case "End":
        event.preventDefault();
        setActive(Math.max(0, filtered.length - 1));
        return;
      case "Enter":
        event.preventDefault();
        select(activeOption);
        return;
      case "Escape":
        event.preventDefault();
        closeList(true);
        return;
      case "Tab":
        closeList(false);
        return;
      case " ":
        if (!inSearch) {
          event.preventDefault();
          select(activeOption);
        }
        return;
      default:
        if (printable && !searchable) {
          event.preventDefault();
          const next = typeahead(key, active);
          if (next >= 0) setActive(next);
        }
    }
  };

  const flagFor = (country: string) =>
    renderFlag ? renderFlag(country) : toFlag(country);

  const activeDescendant = open && activeOption ? optionId(activeOption.code) : undefined;

  return (
    <div
      ref={rootRef}
      className={className ? `rcs-root ${className}` : "rcs-root"}
      onKeyDown={onKeyDown}
      data-open={open ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        id={baseId}
        className="rcs-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel ?? placeholder}
        onClick={() => (open ? closeList(false) : openList())}
      >
        {selected ? (
          <span className="rcs-value">
            <span className="rcs-flag" aria-hidden="true">
              {flagFor(selected.country)}
            </span>
            <span className="rcs-code">{selected.code}</span>
            <span className="rcs-name">{selected.name}</span>
            <span className="rcs-symbol">({selected.symbol})</span>
          </span>
        ) : (
          <span className="rcs-placeholder">{placeholder}</span>
        )}
        <span className="rcs-caret" aria-hidden="true" />
      </button>

      {name ? <input type="hidden" name={name} value={currentCode ?? ""} /> : null}

      {open ? (
        <div className="rcs-popup">
          {searchable ? (
            <div className="rcs-search-wrap">
              <input
                ref={searchRef}
                type="text"
                className="rcs-search"
                value={query}
                placeholder={searchPlaceholder}
                autoComplete="off"
                spellCheck={false}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activeDescendant}
                aria-label={searchPlaceholder}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
              />
            </div>
          ) : null}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="rcs-list"
            tabIndex={-1}
            aria-label={ariaLabel ?? placeholder}
            aria-activedescendant={activeDescendant}
          >
            {filtered.map((currency, index) => {
              const isActive = index === active;
              return (
                <li
                  key={currency.code}
                  id={optionId(currency.code)}
                  role="option"
                  aria-selected={currency.code === currentCode}
                  data-active={isActive ? "true" : undefined}
                  className={
                    isActive ? "rcs-option rcs-option--active" : "rcs-option"
                  }
                  onMouseEnter={() => setActive(index)}
                  onClick={() => select(currency)}
                >
                  <span className="rcs-flag" aria-hidden="true">
                    {flagFor(currency.country)}
                  </span>
                  <span className="rcs-code">{currency.code}</span>
                  <span className="rcs-name">{currency.name}</span>
                  <span className="rcs-symbol">{currency.symbol}</span>
                </li>
              );
            })}
            {filtered.length === 0 ? (
              <li className="rcs-empty" role="presentation">
                No currencies found
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
