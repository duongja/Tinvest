import React from "react";
import { createRoot } from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TradingApp } from "./App";
import { Landing } from "./Landing";
import { readJsonResponse, responseError } from "./http";
import "./styles.css";

type AppConfig = {
  manifestUrl: string;
  defaultSlippage: string;
  error?: string;
};

async function bootstrap() {
  if (!window.location.pathname.startsWith("/app")) {
    createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <Landing />
      </React.StrictMode>
    );
    return;
  }

  const config = await loadAppConfig();
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <TonConnectUIProvider manifestUrl={config.manifestUrl}>
        <TradingApp defaultSlippage={config.defaultSlippage} />
      </TonConnectUIProvider>
    </React.StrictMode>
  );
}

async function loadAppConfig(): Promise<AppConfig> {
  const fallback = {
    manifestUrl: new URL("/tonconnect-manifest.json", window.location.origin).toString(),
    defaultSlippage: "0.01"
  };

  try {
    const response = await fetch("/api/config");
    const config = await readJsonResponse<AppConfig>(response);
    if (!response.ok) {
      throw new Error(responseError(config, "Could not load Mini App configuration."));
    }
    if (!config.manifestUrl || !config.defaultSlippage) {
      throw new Error("Mini App configuration is incomplete.");
    }
    return config;
  } catch (error) {
    console.warn("Using fallback Mini App configuration", error);
    return fallback;
  }
}

bootstrap().catch((error) => {
  document.body.textContent = error instanceof Error ? error.message : "Failed to load app";
});
