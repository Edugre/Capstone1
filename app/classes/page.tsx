"use client";

import { useEffect, useState, type FormEvent } from "react";

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
  const [classes, setClasses] = useState<Course[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("classes") || "[]");
      if (Array.isArray(saved)) setClasses(saved);
    } catch {
      setClasses([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("classes", JSON.stringify(classes));
    }
  }, [classes, loaded]);

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
    { placeholder: "Enter class name", value: className, setter: setClassName },
    { placeholder: "Enter course number", value: courseNumber, setter: setCourseNumber },
    { placeholder: "Enter course section", value: courseSection, setter: setCourseSection },
    { placeholder: "Enter professor name", value: professorName, setter: setProfessorName },
    { placeholder: "Enter meeting days/times (e.g. Mon/Wed 10:00 AM)", value: meetingDaysTimes, setter: setMeetingDaysTimes },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold">
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
              className="rounded border p-3"
            />
          ))}

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add Class
          </button>
        </form>

        <h2 className="mb-3 text-xl font-semibold">My Classes</h2>

        <ul className="space-y-2">
          {classes.map((course, index) => (
            <li key={index} className="rounded bg-white p-3 shadow">
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
