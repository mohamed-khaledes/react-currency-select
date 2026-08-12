import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mk01/react-currency-select/styles.css";
import "./landing.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
