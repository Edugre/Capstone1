"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ClassInfo = {
  name: string;
  courseNumber: string;
  courseSection: string;
  professorName: string;
};

export default function ClassesPage() {
  const [className, setClassName] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [courseSection, setCourseSection] = useState("");
  const [professorName, setProfessorName] = useState("");

  const [classes, setClasses] = useState<ClassInfo[]>([]);

  function addClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = className.trim();

    if (
      !name ||
      !courseNumber.trim() ||
      !courseSection.trim() ||
      !professorName.trim()
    ) {
      return;
    }

    setClasses([
      ...classes,
      {
        name,
        courseNumber: courseNumber.trim(),
        courseSection: courseSection.trim(),
        professorName: professorName.trim(),
      },
    ]);

    setClassName("");
    setCourseNumber("");
    setCourseSection("");
    setProfessorName("");
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="max-w-xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Student Class Tracker
        </h1>

        <form onSubmit={addClass} className="mb-6 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter class name"
            value={className}
            onChange={(event) => setClassName(event.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
            required
          />

          <input
            type="text"
            placeholder="Enter course number"
            value={courseNumber}
            onChange={(event) => setCourseNumber(event.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
            required
          />

          <input
            type="text"
            placeholder="Enter course section"
            value={courseSection}
            onChange={(event) => setCourseSection(event.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
            required
          />

          <input
            type="text"
            placeholder="Enter professor name"
            value={professorName}
            onChange={(event) => setProfessorName(event.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
            required
          />

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add Class
          </button>
        </form>

        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Classes
        </h2>

        <ul className="space-y-2">
          {classes.map((course, index) => (
            <li
              key={index}
              className="rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <p><strong>Class:</strong> {course.name}</p>
              <p><strong>Course Number:</strong> {course.courseNumber}</p>
              <p><strong>Section:</strong> {course.courseSection}</p>
              <p><strong>Professor:</strong> {course.professorName}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
