
"use client";

import { useState } from "react";

export default function ClassesPage() {
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState<string[]>([]);

  function addClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = className.trim();
    if (!name) return;

    setClasses([...classes, name]);
    setClassName("");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold">
          Student Class Tracker
        </h1>

        <form onSubmit={addClass} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter class name"
            value={className}
            onChange={(event) => setClassName(event.target.value)}
            className="flex-1 rounded border p-3"
          />

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add Class
          </button>
        </form>

        <h2 className="mb-3 text-xl font-semibold">My Classes</h2>

        <ul className="space-y-2">
          {classes.map((name, index) => (
            <li key={index} className="rounded bg-white p-3 shadow">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
