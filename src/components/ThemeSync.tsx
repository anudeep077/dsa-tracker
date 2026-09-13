"use client";

import { useEffect } from "react";
import { applyTheme } from "@/lib/theme";
import { useTracker } from "@/lib/useTracker";

/** Keeps the theme in step with the OS preference while "system" is selected. */
export function ThemeSync() {
  const { settings } = useTracker();
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [settings.theme]);
  return null;
}
