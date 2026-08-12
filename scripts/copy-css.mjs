import { copyFileSync } from "node:fs";

copyFileSync("src/styles.css", "dist/styles.css");
console.log("copied styles.css -> dist/styles.css");
