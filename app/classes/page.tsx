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
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold">
          Student Class Tracker
        </h1>

        <form onSubmit={addClass} className="mb-6 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter class name"
            value={className}
            onChange={(event) => setClassName(event.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="Enter course number"
            value={courseNumber}
            onChange={(event) => setCourseNumber(event.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="Enter course section"
            value={courseSection}
            onChange={(event) => setCourseSection(event.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <input
            type="text"
            placeholder="Enter professor name"
            value={professorName}
            onChange={(event) => setProfessorName(event.target.value)}
            className="w-full rounded border p-3"
            required
          />

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add Class
          </button>
        </form>

        <h2 className="mb-3 text-xl font-semibold">
          My Classes
        </h2>

        <ul className="space-y-2">
          {classes.map((course, index) => (
            <li
              key={index}
              className="rounded bg-white p-3 shadow"
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
