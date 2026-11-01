"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function parseList<T>(raw: string | null): T[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// A JSON array kept in localStorage. Renders as empty on the server, then
// picks up the saved value after hydration.
export function useStoredList<T>(key: string) {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key),
    () => null
  );
  const items = useMemo(() => parseList<T>(raw), [raw]);

  const update = useCallback(
    (updater: (previous: T[]) => T[]) => {
      const next = updater(parseList<T>(localStorage.getItem(key)));
      localStorage.setItem(key, JSON.stringify(next));
      listeners.forEach((listener) => listener());
    },
    [key]
  );

  return [items, update] as const;
}
