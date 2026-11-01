"use client";

import { useEffect, useState, type FormEvent } from "react";

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
  const [classes, setClasses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedClasses = JSON.parse(
        localStorage.getItem("classes") || "[]"
      );
      const savedAssignments = JSON.parse(
        localStorage.getItem("assignments") || "[]"
      );

      if (Array.isArray(savedClasses)) {
        setClasses(savedClasses);
      }
      if (Array.isArray(savedAssignments)) {
        setAssignments(savedAssignments);
      }
    } catch {
      setClasses([]);
      setAssignments([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "assignments",
        JSON.stringify(assignments)
      );
    }
  }, [assignments, loaded]);

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

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-3xl font-bold">
          Student Assignment Tracker
        </h1>

        <form onSubmit={addAssignment} className="mb-10 flex flex-col gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded border p-4"
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
            <p className="text-sm text-gray-600">
              No classes saved. Add a class on the Classes page first.
            </p>
          )}

          <input
            type="text"
            placeholder="Enter assignment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border p-4"
            required
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded border p-4"
            required
          />

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-3 text-white"
          >
            Add Assignment
          </button>
        </form>

        <h2 className="mb-4 text-xl font-semibold">
          My Assignments
        </h2>

        <ul className="space-y-3">
          {assignments.map((assignment, index) => (
            <li key={index} className="rounded bg-white p-4 shadow">
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
