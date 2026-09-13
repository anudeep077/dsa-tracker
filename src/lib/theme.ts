import type { Theme } from "./types";

/** Toggles the `dark` class on <html> for the given preference. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Runs inline in <head> before first paint so the page never flashes the wrong
 * theme. Kept as a string because it must execute before React hydrates.
 * Reads the same `dsa.settings` key as storage.ts.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=(JSON.parse(localStorage.getItem("dsa.settings")||"{}").theme)||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;
