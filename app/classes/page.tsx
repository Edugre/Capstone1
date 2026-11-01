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

export default function ClassesPage() {
  const [className, setClassName] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [courseSection, setCourseSection] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [meetingDaysTimes, setMeetingDaysTimes] = useState("");
  const [classes, setClasses] = useStoredList<Course>("classes");

  function addClass(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!className.trim()) return;

    const newClass: Course = {
      name: className.trim(),
      courseNumber: courseNumber.trim(),
      courseSection: courseSection.trim(),
      professorName: professorName.trim(),
      meetingDaysTimes: meetingDaysTimes.trim(),
    };

    setClasses((previous) => [...previous, newClass]);
    setClassName("");
    setCourseNumber("");
    setCourseSection("");
    setProfessorName("");
    setMeetingDaysTimes("");
  }

  const fields = [
    { placeholder: "Enter class name", required: true, value: className, setter: setClassName },
    { placeholder: "Enter course number", required: true, value: courseNumber, setter: setCourseNumber },
    { placeholder: "Enter course section", required: true, value: courseSection, setter: setCourseSection },
    { placeholder: "Enter professor name", required: true, value: professorName, setter: setProfessorName },
    { placeholder: "Enter meeting days/times (e.g. Mon/Wed 10:00 AM)", required: false, value: meetingDaysTimes, setter: setMeetingDaysTimes },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="max-w-xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Student Class Tracker
        </h1>

        <form onSubmit={addClass} className="mb-6 flex flex-col gap-3">
          {fields.map((field) => (
            <input
              key={field.placeholder}
              type="text"
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]"
              required={field.required}
            />
          ))}

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
              <p><strong>Meeting Days/Times:</strong> {course.meetingDaysTimes}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
