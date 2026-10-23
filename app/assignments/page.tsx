
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
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-black">
          Student Assignment Tracker
        </h1>

        <form onSubmit={addAssignment} className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Enter assignment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-4 text-black"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded border p-4 text-black"
          />

          <button
            type="submit"
            className="rounded bg-blue-600 px-6 py-3 text-white"
          >
            Add Assignment
          </button>
        </form>

        <h2 className="mb-4 text-2xl font-bold text-black">
          My Assignments
        </h2>

        <ul className="space-y-3">
          {assignments.map((assignment, index) => (
            <li key={index} className="rounded bg-white p-4 text-black shadow">
              {assignment.name} - Due: {assignment.dueDate}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
