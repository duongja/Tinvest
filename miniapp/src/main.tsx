import React from "react";
import { createRoot } from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TradingApp } from "./App";
import { Landing } from "./Landing";
import "./styles.css";

async function bootstrap() {
  if (!window.location.pathname.startsWith("/app")) {
    createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <Landing />
      </React.StrictMode>
    );
    return;
  }

  const config = await fetch("/api/config").then((res) => res.json());
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <TonConnectUIProvider manifestUrl={config.manifestUrl}>
        <TradingApp defaultSlippage={config.defaultSlippage} />
      </TonConnectUIProvider>
    </React.StrictMode>
  );
}

bootstrap().catch((error) => {
  document.body.textContent = error instanceof Error ? error.message : "Failed to load app";
});
