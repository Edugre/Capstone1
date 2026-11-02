"use client";

import { useState, type FormEvent } from "react";
import { useStoredList } from "@/lib/use-stored-list";

type Course = {
  name: string;
  courseNumber: string;
  courseSection: string;
  professorName: string;
  meetingDaysTimes: string;
};

type Assignment = {
  name: string;
  dueDate: string;
  className: string;
};

export default function AssignmentsPage() {
  const [classes] = useStoredList<Course>("classes");
  const [assignments, setAssignments] = useStoredList<Assignment>("assignments");
  const [selectedClass, setSelectedClass] = useState("");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  function addAssignment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedClass || !name.trim() || !dueDate) return;

    const newAssignment: Assignment = {
      className: selectedClass,
      name: name.trim(),
      dueDate,
    };

    setAssignments((previous) => [...previous, newAssignment]);
    setName("");
    setDueDate("");
  }
  const sortedAssignments = [...assignments].sort((a, b) =>
  a.dueDate.localeCompare(b.dueDate)
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Student Assignment Tracker
        </h1>

        <form onSubmit={addAssignment} className="mb-10 flex flex-col gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
            required
          >
            <option value="">Select a class</option>

            {classes.map((course, index) => (
              <option
                key={index}
                value={`${course.name} (${course.courseNumber} - ${course.courseSection})`}
              >
                {course.name} - {course.courseNumber} ({course.courseSection})
              </option>
            ))}
          </select>

          {classes.length === 0 && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No classes saved. Add a class on the Classes page first.
            </p>
          )}

          <input
            type="text"
            placeholder="Enter assignment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
            required
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
            required
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
          {sortedAssignments.map((assignment, index) => (
            <li key={index} className="rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
              <p><strong>Class:</strong> {assignment.className}</p>
              <p><strong>Assignment:</strong> {assignment.name}</p>
              <p><strong>Due Date:</strong> {assignment.dueDate}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
