import { useEffect, useState, type CSSProperties } from "react";
import {
  CurrencySelect,
  toFlag,
  svgFlag,
  currencies,
  type Currency,
} from "@mk01/react-currency-select";

const INSTALL = "npm i @mk01/react-currency-select";
const GZIP_SIZE = "29 kB";
const EMOJI_GZIP = "6.2 kB";

const ACCENTS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#e11d48" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Sky", value: "#0284c7" },
];

type Theme = "light" | "dark";

export function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [picked, setPicked] = useState<Currency>();
  const [copied, setCopied] = useState(false);

  // Playground state
  const [searchable, setSearchable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [svg, setSvg] = useState(true);
  const [accent, setAccent] = useState(ACCENTS[0]!.value);
  const [playgroundValue, setPlaygroundValue] = useState<Currency>();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const snippet = [
    `<CurrencySelect`,
    `  defaultValue="${playgroundValue?.code ?? "USD"}"`,
    searchable ? `  searchable` : null,
    disabled ? `  disabled` : null,
    svg ? null : `  flag="emoji"`,
    theme === "dark" ? `  theme="dark"` : null,
    `  onChange={(c) => console.log(c)}`,
    `/>`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="page" data-theme={theme}>
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            💱
          </span>
          <span className="brand-name">@mk01/react-currency-select</span>
        </a>
        <nav className="nav-links">
          <a href="https://github.com/mohamed-khaledes/react-currency-select">
            Docs
          </a>
          <a href="https://github.com/mohamed-khaledes/react-currency-select">
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@mk01/react-currency-select">
            npm
          </a>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">
            Zero runtime dependencies · flags &amp; styles included · {GZIP_SIZE}{" "}
            gzipped
          </p>
          <h1>
            The currency picker that
            <br />
            <span className="grad">ships nothing extra.</span>
          </h1>
          <p className="sub">
            One import, one component. Real flags on every OS, styles that
            inject themselves, full ARIA keyboard support — and CSS variables
            when you want to restyle it.
          </p>

          <button type="button" className="install" onClick={copyInstall}>
            <code>{INSTALL}</code>
            <span className="copy-hint">{copied ? "copied ✓" : "copy"}</span>
          </button>

          <div className="hero-demo">
            <label className="field-label" htmlFor="hero-select">
              Pick a currency
            </label>
            <CurrencySelect
              id="hero-select"
              searchable
              defaultValue="EGP"
              flag={svg ? "svg" : "emoji"}
              theme={theme}
              onChange={setPicked}
            />

            <div className="result" aria-live="polite">
              {picked ? (
                <>
                  <span className="result-flag">
                    {svg ? svgFlag(picked.country) : toFlag(picked.country)}
                  </span>
                  <div className="result-body">
                    <div className="result-top">
                      <strong>{picked.code}</strong>
                      <span className="result-symbol">{picked.symbol}</span>
                    </div>
                    <div className="result-name">{picked.name}</div>
                  </div>
                </>
              ) : (
                <span className="result-empty">
                  Select a currency — the full object comes back on change.
                </span>
              )}
            </div>
          </div>

          <p className="fineprint">
            {currencies.length} currencies built in ·{" "}
            {svg
              ? "SVG flags — identical on Windows, macOS, Linux, Android"
              : "Unicode emoji flags — Windows shows letters instead"}
          </p>
        </section>

        <section className="features" id="features">
          <div className="grid">
            <article className="card">
              <h3>Zero dependencies</h3>
              <p>
                <code>dependencies: {"{}"}</code>. React and React&nbsp;DOM are
                peers. Nothing else lands in your lockfile.
              </p>
            </article>
            <article className="card">
              <h3>Flags on every OS</h3>
              <p>
                Windows ships no emoji flags, so real SVG flags are bundled and
                used by default — offline, no CDN, no config.
              </p>
            </article>
            <article className="card">
              <h3>Small bundle</h3>
              <p>
                <strong>{GZIP_SIZE} gzipped</strong> with 141 currencies and 141
                SVG flags inside — {EMOJI_GZIP} of that is the component itself.
              </p>
            </article>
            <article className="card">
              <h3>Accessible</h3>
              <p>
                ARIA combobox/listbox pattern: arrows, Home/End, Enter, Escape,
                type-ahead, and <code>aria-activedescendant</code>.
              </p>
            </article>
            <article className="card">
              <h3>Themeable</h3>
              <p>
                Every color, radius and shadow is a CSS variable on{" "}
                <code>.rcs-root</code>. Dark mode built in.
              </p>
            </article>
            <article className="card">
              <h3>TypeScript first</h3>
              <p>
                Types ship in the package. <code>onChange</code> hands you the
                whole <code>Currency</code> object.
              </p>
            </article>
            <article className="card">
              <h3>Searchable &amp; controllable</h3>
              <p>
                Optional filter input, controlled or uncontrolled value, and a
                hidden input for plain HTML forms.
              </p>
            </article>
          </div>
        </section>

        <section className="playground" id="playground">
          <div className="section-head">
            <h2>Live playground</h2>
            <p>
              Flip the props and watch the component — and the snippet — follow.
            </p>
          </div>

          <div className="play-grid">
            <div className="controls">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={searchable}
                  onChange={(e) => setSearchable(e.target.checked)}
                />
                <span>searchable</span>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                />
                <span>disabled</span>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={svg}
                  onChange={(e) => setSvg(e.target.checked)}
                />
                <span>
                  SVG flags <em>(works on Windows)</em>
                </span>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={theme === "dark"}
                  onChange={(e) =>
                    setTheme(e.target.checked ? "dark" : "light")
                  }
                />
                <span>dark theme</span>
              </label>

              <div className="accents">
                <span className="accents-label">accent</span>
                <div className="swatches">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      className={a.value === accent ? "swatch is-on" : "swatch"}
                      style={{ background: a.value }}
                      aria-label={a.name}
                      aria-pressed={a.value === accent}
                      onClick={() => setAccent(a.value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className="stage"
              style={{ "--rcs-accent": accent } as CSSProperties}
            >
              <CurrencySelect
                searchable={searchable}
                disabled={disabled}
                defaultValue="EUR"
                name="currency"
                flag={svg ? "svg" : "emoji"}
                theme={theme}
                onChange={setPlaygroundValue}
              />
              <p className="stage-note">
                {playgroundValue
                  ? `onChange → ${playgroundValue.code} · ${playgroundValue.name} · ${playgroundValue.symbol}`
                  : "onChange fires with the full Currency object."}
              </p>
            </div>

            <pre className="snippet">
              <code>{snippet}</code>
            </pre>
          </div>
        </section>

        <section className="usage" id="docs">
          <div className="section-head">
            <h2>Usage</h2>
            <p>Install, import the stylesheet once, render.</p>
          </div>
          <div className="usage-grid">
            <pre className="snippet">
              <code>{INSTALL}</code>
            </pre>
            <pre className="snippet">
              <code>{`import { useState } from "react";
import { CurrencySelect, type Currency } from "@mk01/react-currency-select";
// No stylesheet import, no flag import — both are built in.

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
}`}</code>
            </pre>
          </div>
          <p className="note">
            <strong>Nothing else to import.</strong> Real SVG flags are the
            default, so the picker looks the same on Windows, macOS, Linux and
            Android, and the stylesheet injects itself on first render. Want the
            smaller Unicode glyphs instead? <code>flag="emoji"</code>. Want your
            own artwork? <code>renderFlag={"{(country) => …}"}</code>. Light and
            dark come from <code>theme</code>, never from the visitor's OS —{" "}
            <code>theme="system"</code> opts into that explicitly.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>MIT © {new Date().getFullYear()}</span>
        <span className="footer-links">
          <a href="https://github.com/mohamed-khaledes/react-currency-select">
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@mk01/react-currency-select">
            npm
          </a>
        </span>
      </footer>
    </div>
  );
}
