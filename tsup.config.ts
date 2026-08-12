import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/flags.ts"],
  format: ["esm", "cjs"],
  dts: true,
  minify: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
});
