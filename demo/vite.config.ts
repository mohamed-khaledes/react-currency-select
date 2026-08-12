import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: here,
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "react-currency-select/styles.css": resolve(here, "../src/styles.css"),
      "react-currency-select/flags": resolve(here, "../src/flags.ts"),
      "react-currency-select": resolve(here, "../src/index.ts"),
    },
  },
  build: {
    outDir: resolve(here, "dist-demo"),
    emptyOutDir: true,
  },
});
