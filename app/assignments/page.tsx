
"use client";

import { useState } from "react";

export default function AssignmentsPage() {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignments, setAssignments] = useState<
    { name: string; dueDate: string }[]
  >([]);

  function addAssignment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !dueDate) return;

    setAssignments([...assignments, { name: name.trim(), dueDate }]);
    setName("");
    setDueDate("");
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Student Assignment Tracker
        </h1>

        <form onSubmit={addAssignment} className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Enter assignment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
          />

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add Assignment
          </button>
        </form>

        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Assignments
        </h2>

        <ul className="space-y-3">
          {assignments.map((assignment, index) => (
            <li key={index} className="rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
              {assignment.name} - Due: {assignment.dueDate}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
