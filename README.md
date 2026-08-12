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
import "@mk01/react-currency-select/styles.css";

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

The stylesheet is never auto-injected — import it yourself so the package stays
SSR-safe.

## Flags on every OS (including Windows)

By default flags are derived from the country code at runtime by mapping each letter
to its Unicode **Regional Indicator Symbol** — no images, no sprite sheet, no flag
library:

```ts
import { toFlag } from "@mk01/react-currency-select";
toFlag("US"); // "🇺🇸"
```

That renders on macOS, iOS, Android and most Linux setups, but **Windows ships no
flag glyphs at all**, so browsers there draw the two letters (`US`) instead. No
amount of CSS fixes that — the glyphs simply do not exist on the machine.

So the package also ships real **SVG flags** behind a separate entry point:

```tsx
import { CurrencySelect } from "@mk01/react-currency-select";
import { svgFlag } from "@mk01/react-currency-select/flags";
import "@mk01/react-currency-select/styles.css";

<CurrencySelect renderFlag={svgFlag} />;
```

Identical flags on Windows, macOS, Linux, Android and iOS. Still **no runtime
dependency and no network request** — the artwork is vendored into the package at
build time and inlined as SVG markup.

Because it is a separate entry, you only pay for it when you import it:

| Import | gzip |
| --- | --- |
| `@mk01/react-currency-select` (emoji flags) | 4.7 kB |
| `+ @mk01/react-currency-select/flags` (SVG flags) | +23 kB |

`@mk01/react-currency-select/flags` also exports:

```tsx
import { FlagIcon, hasSvgFlag, FLAG_SVGS } from "@mk01/react-currency-select/flags";

<FlagIcon country="JP" />;      // standalone flag element
hasSvgFlag("JP");               // true — countries outside the set fall back to emoji
FLAG_SVGS.JP;                   // the raw inline SVG string
```

Prefer to fetch flags instead of bundling them? `renderFlag` takes anything:

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
own `currencies` with other countries, `svgFlag` falls back to the emoji flag for
those — regenerate with `npm run gen:flags` after extending the dataset if you are
working from a clone.

## Troubleshooting

**The control renders unstyled — huge flags, no dropdown box, text run together.**
The stylesheet is not loaded. It is never auto-injected (that would break SSR), so
import it once, anywhere in your app:

```tsx
import "@mk01/react-currency-select/styles.css";
```

Framework notes:

- **Vite / Remix / Astro** — import it in the component or your entry file.
- **Next.js App Router** — import it in `app/layout.tsx` (or any Server Component in
  the tree).
- **Next.js Pages Router** — CSS from `node_modules` may only be imported in
  `pages/_app.tsx`.
- **Anything else on webpack** — make sure you are on **0.1.1 or later**. `0.1.0`
  declared `sideEffects: ["*.css"]`, which webpack does not match against
  `dist/styles.css`, so production builds tree-shook the stylesheet away.

If you would rather not ship the CSS at all, every class is documented under
[Theming](#theming) — style `.rcs-*` yourself and skip the import.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled currency code, e.g. `"USD"`. |
| `defaultValue` | `string` | — | Uncontrolled initial code. Ignored when `value` is set. |
| `onChange` | `(currency: Currency) => void` | — | Fires with the **full** `Currency` object. |
| `currencies` | `Currency[]` | built-in list | Override or subset the dataset. |
| `placeholder` | `string` | `"Select currency"` | Shown when nothing is selected. |
| `searchable` | `boolean` | `false` | Renders a filter input at the top of the popup. |
| `searchPlaceholder` | `string` | `"Search currencies…"` | Placeholder for that input. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `className` | `string` | — | Appended to `.rcs-root`. |
| `id` | `string` | auto | Id of the trigger; ARIA ids derive from it. |
| `name` | `string` | — | Renders a hidden input so the value submits in plain forms. |
| `aria-label` | `string` | `placeholder` | Accessible name for the control. |
| `renderFlag` | `(country: string) => ReactNode` | emoji flag | Replace the emoji with your own node. |

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

| File | Minified | Gzipped |
| --- | --- | --- |
| `dist/index.js` (ESM) | 13.8 kB | 4.7 kB |
| `dist/index.cjs` (CJS) | 14.7 kB | 5.0 kB |
| `dist/styles.css` | 4.5 kB | 1.4 kB |
| `dist/flags.js` (opt-in SVG flags) | 82.3 kB | 23.1 kB |

Roughly 10 kB of the core is the currency dataset itself. Pass a smaller `currencies`
array if you only need a handful — the dataset is a plain export, so bundlers can
drop it when you never import it. The SVG flags live in their own entry point and are
never pulled in unless you import `@mk01/react-currency-select/flags`.

## Development

```sh
npm install
npm run dev:demo    # landing page + live playground (Vite, lib aliased to src)
npm run build       # dist/ via tsup + copied stylesheet
npm run typecheck
npm run gen:flags   # re-vendor src/flags.data.ts from country-flag-icons
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
