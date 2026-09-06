import pkg from "../../../package.json" with { type: "json" };

export const APP_CONFIG = {
  name: "YahiaRoute",
  description: "Next-Gen Multi-Model AI Orchestrator & Gateway",
  version: pkg.version,
};

export const THEME_CONFIG = {
  storageKey: "theme",
  defaultTheme: "dark",
};
