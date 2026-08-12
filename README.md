# @mk01/react-currency-select

[![npm](https://img.shields.io/badge/npm-0.1.0-blue)](https://www.npmjs.com/package/@mk01/react-currency-select)
[![bundle](https://img.shields.io/badge/gzip-4.7%20kB-brightgreen)](#size)
[![deps](https://img.shields.io/badge/dependencies-0-brightgreen)](#zero-dependencies)
[![license](https://img.shields.io/badge/license-MIT-black)](./LICENSE)

**A tiny, zero-runtime-dependency React currency selector with flags.** Every option
shows the country flag, the ISO 4217 code and the currency name; the closed control
shows flag + code + name + symbol. 141 world currencies built in, with emoji flags by
default and [bundled SVG flags](#flags-on-every-os-including-windows) that render on
every OS — Windows included.

```
🇯🇵  JPY  Japanese Yen  (¥)
```

**[Live demo & playground →](https://mohamed-khaledes.github.io/react-currency-select/)**

## Install

```sh
npm i @mk01/react-currency-select
```

React 17+ is a peer dependency. Nothing else is installed.

## Quick start

```tsx
import { useState } from "react";
import { CurrencySelect, type Currency } from "@mk01/react-currency-select";

export function Example() {
  const [selected, setSelected] = useState<Currency>();
  return (
    <>
      <CurrencySelect defaultValue="USD" searchable onChange={setSelected} />
      {selected && (
        <p>
          You picked {selected.name} ({selected.code}) {selected.symbol}
        </p>
      )}
    </>
  );
}
```

That is the whole setup: **no stylesheet import, no flag import.** The component
injects its own CSS on first render (SSR-safe — nothing runs without a DOM) and draws
real SVG flags out of the box.

## Flags — `flag`

Real SVG flags are bundled and used by default, so the picker looks identical on
Windows, macOS, Linux, Android and iOS with no configuration:

```tsx
<CurrencySelect />                 // bundled SVG flags (default)
<CurrencySelect flag="emoji" />    // Unicode flag glyphs — smaller, but see below
```

`flag="emoji"` maps each country code to its **Regional Indicator Symbols**. Those
render on macOS, iOS, Android and most Linux setups, but **Windows ships no flag
glyphs at all**, so browsers there draw the two letters (`US`) instead — which is
exactly why SVG is the default.

There is **no runtime dependency and no network request** either way: the artwork is
vendored into the package at build time and inlined as SVG markup.

Helpers, all from the main entry:

```tsx
import { toFlag, svgFlag, FlagIcon, hasSvgFlag, FLAG_SVGS } from "@mk01/react-currency-select";

toFlag("JP");                   // "🇯🇵" — the emoji glyph
<FlagIcon country="JP" />;      // standalone SVG flag element
hasSvgFlag("JP");               // true — countries outside the set fall back to emoji
FLAG_SVGS.JP;                   // the raw inline SVG string
```

Prefer your own artwork, or to fetch flags instead of bundling them? `renderFlag`
takes anything and wins over `flag`:

```tsx
<CurrencySelect
  renderFlag={(country) => (
    <img
      src={`https://flagcdn.com/24x18/${country.toLowerCase()}.png`}
      alt=""
      width={24}
      height={18}
    />
  )}
/>
```

The 141 bundled flags cover every country in the built-in dataset. If you supply your
own `currencies` with other countries, those fall back to the emoji flag —
regenerate with `npm run gen:flags` after extending the dataset if you are working
from a clone.

## Country → currency

You often know the visitor's **country** and want their **currency**. Pass it:

```tsx
<CurrencySelect country="DE" />   // selects EUR
<CurrencySelect country="EC" />   // selects USD — Ecuador uses the dollar
```

234 countries are mapped, so this works for the ~90 countries that share a currency
with someone else, not just the 141 the dataset names directly.

**Precedence:** `value` > `defaultValue` (initial render only) > `country`.

`country` is live: change it and the selection follows, which makes this work
naturally next to a country field in a form.

```tsx
<CountryPicker value={country} onChange={setCountry} />
<CurrencySelect country={country} onChange={setCurrency} />
```

The user is never locked out — they can pick any currency, and their choice stands
until `country` changes to something new. Prop-driven changes **do not fire
`onChange`**, exactly like `value` and `defaultValue`. If you need the currency for a
country without rendering anything:

```tsx
import { currencyForCountry, currencyCodeForCountry } from "@mk01/react-currency-select";

currencyForCountry("DE");      // { code: "EUR", name: "Euro", symbol: "€", country: "EU" }
currencyCodeForCountry("DE");  // "EUR"
currencyCodeForCountry("ZZ");  // undefined
```

### Searching by country

With `searchable`, a two-letter query is also read as a country code, so people can
find a currency by the place they associate it with:

| Type | Finds | Why |
| --- | --- | --- |
| `DE` | EUR | Germany uses the euro |
| `EC` | USD | Ecuador uses the US dollar |
| `JP` | JPY | its own country |
| `yen` | JPY | name search, unchanged |
| `EG` | EGP | code and country agree |

Longer queries keep matching code, name and the currency's own country as before.

## Light & dark — `theme`

The colour scheme comes from a prop, **never from the visitor's operating system**:

```tsx
<CurrencySelect />                  // light (default)
<CurrencySelect theme="dark" />     // dark
<CurrencySelect theme="system" />   // follow prefers-color-scheme
```

Wire it to whatever your app already uses:

```tsx
<CurrencySelect theme={appTheme === "dark" ? "dark" : "light"} />
```

Before 0.2.0 the component followed `prefers-color-scheme` on its own, so it could
render dark inside a light app. It no longer does that unless you pass
`theme="system"`.

## Styles

The stylesheet injects itself into `<head>` on first render — one `<style
data-rcs-styles>` tag per document, no matter how many pickers you render. It is
*prepended*, so any CSS your app ships overrides it at equal specificity without
`!important`.

Two ways to opt out:

```tsx
// per instance
<CurrencySelect injectStyles={false} />
```

```tsx
// then load the file yourself (e.g. under a strict style-src CSP)
import "@mk01/react-currency-select/styles.css";
```

## Troubleshooting

**The control renders unstyled — huge flags, no dropdown box, text run together.**
On **0.2.0+** this should not happen: styles inject themselves. If it does, you either
passed `injectStyles={false}`, or a strict `style-src` CSP is blocking the inline
`<style>` — in that case import `@mk01/react-currency-select/styles.css` instead.

On **0.1.0** this was a packaging bug: `sideEffects: ["*.css"]` does not match
`dist/styles.css` under webpack's glob rules, so production builds tree-shook the
stylesheet away. Fixed in 0.1.1; upgrade.

**The picker is dark while my app is light.** Before 0.2.0 the component followed
`prefers-color-scheme`. Upgrade — `theme` now defaults to `"light"` and only follows
the OS when you pass `theme="system"`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled currency code, e.g. `"USD"`. |
| `defaultValue` | `string` | — | Uncontrolled initial code. Ignored when `value` is set. |
| `country` | `string` | — | ISO 3166-1 alpha-2 code — selects the currency used there. See [Country → currency](#country--currency). |
| `onChange` | `(currency: Currency) => void` | — | Fires with the **full** `Currency` object. |
| `currencies` | `Currency[]` | built-in list | Override or subset the dataset. |
| `placeholder` | `string` | `"Select currency"` | Shown when nothing is selected. |
| `theme` | `"light" \| "dark" \| "system"` | `"light"` | Colour scheme. Only `"system"` consults the OS. |
| `flag` | `"svg" \| "emoji"` | `"svg"` | Bundled SVG flags, or Unicode emoji glyphs. |
| `injectStyles` | `boolean` | `true` | Auto-inject the stylesheet into `<head>`. |
| `searchable` | `boolean` | `false` | Renders a filter input at the top of the popup. |
| `searchPlaceholder` | `string` | `"Search currencies…"` | Placeholder for that input. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `className` | `string` | — | Appended to `.rcs-root`. |
| `id` | `string` | auto | Id of the trigger; ARIA ids derive from it. |
| `name` | `string` | — | Renders a hidden input so the value submits in plain forms. |
| `aria-label` | `string` | `placeholder` | Accessible name for the control. |
| `renderFlag` | `(country: string) => ReactNode` | — | Draw your own flag. Takes precedence over `flag`. |

```ts
interface Currency {
  code: string; // ISO 4217, "USD"
  name: string; // "US Dollar"
  symbol: string; // "$"
  country: string; // ISO 3166-1 alpha-2, "US"
}
```

Controlled and uncontrolled usage both work:

```tsx
// controlled
<CurrencySelect value={code} onChange={(c) => setCode(c.code)} />

// uncontrolled + form submit
<form action="/checkout">
  <CurrencySelect name="currency" defaultValue="EUR" />
</form>
```

## Keyboard & accessibility

Implements the WAI-ARIA combobox/listbox pattern.

| Key | Behaviour |
| --- | --- |
| `Enter` / `Space` / `ArrowDown` / `ArrowUp` (closed) | Open, focusing the selected option |
| `ArrowDown` / `ArrowUp` | Move the active option (wraps) |
| `Home` / `End` | First / last option |
| `Enter` / `Space` | Select the active option, close, return focus to the trigger |
| `Escape` | Close without changing, return focus to the trigger |
| `Tab` | Close and move on |
| letters (when not `searchable`) | Type-ahead — jumps to the next option whose code or name starts with the buffer; the buffer clears after 600 ms, and repeating one letter cycles through its matches |

The trigger exposes `aria-haspopup="listbox"`, `aria-expanded` and `aria-controls`;
the popup is a `role="listbox"` of `role="option"` items with `aria-selected`, and the
focused element carries `aria-activedescendant` pointing at the active option. Clicking
outside closes the popup.

## Theming

Everything is a CSS variable on `.rcs-root`, so you can restyle with zero JS:

```css
.rcs-root {
  --rcs-bg: #fff;
  --rcs-fg: #111827;
  --rcs-muted: #6b7280;
  --rcs-border: #e5e7eb;
  --rcs-accent: #4f46e5;
  --rcs-accent-fg: #fff;
  --rcs-radius: 10px;
  --rcs-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  --rcs-font: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
```

```css
/* your app */
.my-picker {
  --rcs-accent: #10b981;
  --rcs-radius: 6px;
}
```

Dark mode follows `prefers-color-scheme` automatically, and you can force it per
instance:

```tsx
<div data-theme="dark">
  <CurrencySelect />
</div>
```

…or override the variables under your own `[data-theme="dark"]` selector — the
component reads whatever `.rcs-root` inherits.

Class hooks: `.rcs-root`, `.rcs-trigger`, `.rcs-value`, `.rcs-placeholder`,
`.rcs-caret`, `.rcs-popup`, `.rcs-search`, `.rcs-list`, `.rcs-option`,
`.rcs-option--active`, `.rcs-empty`, `.rcs-flag`, `.rcs-code`, `.rcs-name`,
`.rcs-symbol`.

## Custom dataset

```tsx
import { CurrencySelect, currencies } from "@mk01/react-currency-select";

const majors = currencies.filter((c) =>
  ["USD", "EUR", "GBP", "JPY", "CHF"].includes(c.code),
);

<CurrencySelect currencies={majors} defaultValue="EUR" />;
```

## Zero dependencies

`dependencies` is empty. React and React DOM are peers, everything else is a build
tool. The package ships ESM + CJS + `.d.ts`, minified, tree-shakeable, with source
maps.

## Size

| What | Minified | Gzipped |
| --- | --- | --- |
| ESM, everything (component + 141 currencies + 141 SVG flags + CSS) | 103.6 kB | **29.2 kB** |
| …of which the component, dataset and CSS alone | 18.3 kB | 6.2 kB |
| …of which the SVG flag artwork | 85.3 kB | 23.0 kB |

The flags are the bulk of it, and since 0.2.0 they ship in the main entry so that
`flag="svg"` works with no extra import. `flag="emoji"` does **not** shrink the
bundle — the artwork is statically imported, so a bundler cannot drop it. That is a
deliberate trade: a working default beats a smaller default.

If 23 kB matters more to you than Windows support, pin `0.1.x`, or use `renderFlag`
with your own `<img>` and the flags never load.

## Development

```sh
npm install
npm run dev:demo    # landing page + live playground (Vite, lib aliased to src)
npm run build       # dist/ via tsup + copied stylesheet
npm run typecheck
npm run gen:flags      # re-vendor src/flags.data.ts from country-flag-icons
npm run gen:countries  # re-vendor src/countries.data.ts from country-to-currency
npm run build:demo  # static landing page -> demo/dist-demo
```

The landing page deploys to GitHub Pages on every push to `main` via
[.github/workflows/deploy-demo.yml](.github/workflows/deploy-demo.yml). Set
**Settings → Pages → Source** to **GitHub Actions** once, and the workflow handles the
rest. The demo builds with `base: "./"`, so it works at a project subpath without
extra configuration.

`src/flags.data.ts` is generated and committed, so building the package never needs
the flag source at all.

## License

MIT.

Bundled flag artwork is vendored from
[country-flag-icons](https://github.com/catamphetamine/country-flag-icons) (MIT); the
flag designs themselves are in the public domain. `country-flag-icons` is a
build-time devDependency and is never installed by consumers.
