import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { initSentry, Sentry } from "./config/sentry";
import "./index.css";

initSentry();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Ocurrió un error inesperado.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
