"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./icons";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function isNight() {
  return document.documentElement.dataset.theme === "dark";
}

export default function ThemeToggle() {
  const night = useSyncExternalStore(subscribe, isNight, () => false);

  function toggle() {
    const next = night ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked; the choice just isn't remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={night}
      aria-label="Night mode"
      title={night ? "Switch to day mode" : "Switch to night mode"}
      className="lift flex size-12 flex-none cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-2 hover:text-ink"
    >
      {/* CSS picks the icon so it's right before hydration. */}
      <MoonIcon className="size-5.5 dark:hidden" />
      <SunIcon className="hidden size-5.5 animate-pop dark:block" />
    </button>
  );
}
