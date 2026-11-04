"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-7 pb-18 sm:px-6">
      <div className="rounded-3xl bg-late-card p-7">
        <h1 className="text-xl font-black text-late">
          Something went wrong loading this page.
        </h1>
        <p className="mt-1 text-ink-2">
          Check your connection and try again.
        </p>
        <button
          onClick={() => retry()}
          className="lift mt-4 min-h-12 cursor-pointer rounded-full bg-accent px-5.5 font-extrabold text-on-accent"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
