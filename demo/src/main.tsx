import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// No stylesheet import — the component injects its own styles.
import "./landing.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
