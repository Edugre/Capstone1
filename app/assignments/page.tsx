
"use client";

import { useEffect, useState, type FormEvent } from "react";

type Course = {
  name: string;
  courseNumber: string;
  courseSection: string;
  professorName: string;
  meetingDaysTimes: string;
};

type Step = {
  id: string;
  text: string;
  completed: boolean;
};

type Assignment = {
  id: string;
  className: string;
  name: string;
  dueDate: string;
  steps: Step[];
};

export default function AssignmentsPage() {
  const [classes, setClasses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [stepText, setStepText] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved classes and assignments
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
        const updatedAssignments: Assignment[] =
          savedAssignments.map((assignment) => ({
            ...assignment,
            id: assignment.id || crypto.randomUUID(),
            steps: Array.isArray(assignment.steps)
              ? assignment.steps.map((step: Step) => ({
                  ...step,
                  id: step.id || crypto.randomUUID(),
                  completed: Boolean(step.completed),
                }))
              : [],
          }));

        setAssignments(updatedAssignments);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }

    setLoaded(true);
  }, []);

  // Save assignments when they change
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "assignments",
      JSON.stringify(assignments)
    );
  }, [assignments, loaded]);

  // Sprint B #1299: Add a step
  function addStep() {
    if (!stepText.trim()) return;

    const newStep: Step = {
      id: crypto.randomUUID(),
      text: stepText.trim(),
      completed: false,
    };

    setSteps((previous) => [...previous, newStep]);
    setStepText("");
  }

  // Remove a step before creating the assignment
  function removeStep(stepId: string) {
    setSteps((previous) =>
      previous.filter((step) => step.id !== stepId)
    );
  }

  // Create an assignment
  function addAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClass || !name.trim() || !dueDate) {
      return;
    }

    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      className: selectedClass,
      name: name.trim(),
      dueDate,
      steps: [...steps],
    };

    setAssignments((previous) => [...previous, newAssignment]);

    setName("");
    setDueDate("");
    setStepText("");
    setSteps([]);
  }

  // Sprint B #1296: Check or uncheck a step
  function toggleStep(assignmentId: string, stepId: string) {
    setAssignments((previous) =>
      previous.map((assignment) => {
        if (assignment.id !== assignmentId) {
          return assignment;
        }

        return {
          ...assignment,
          steps: assignment.steps.map((step) =>
            step.id === stepId
              ? {
                  ...step,
                  completed: !step.completed,
                }
              : step
          ),
        };
      })
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-3xl font-bold">
          Student Assignment Tracker
        </h1>

        <form
          onSubmit={addAssignment}
          className="mb-10 flex flex-col gap-4"
        >
          {/* Class dropdown */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded border p-4"
            required
          >
            <option value="">Select a class</option>

            {classes.map((course, index) => (
              <option
                key={`${course.courseNumber}-${course.courseSection}-${index}`}
                value={`${course.name} (${course.courseNumber} - ${course.courseSection})`}
              >
                {course.name} - {course.courseNumber} (
                {course.courseSection})
              </option>
            ))}
          </select>

          {classes.length === 0 && (
            <p className="text-sm text-gray-600">
              No classes saved. Add a class on the Classes page first.
            </p>
          )}

          {/* Assignment name */}
          <input
            type="text"
            placeholder="Enter assignment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border p-4"
            required
          />

          {/* Due date */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded border p-4"
            required
          />

          {/* Sprint B #1299 */}
          <div className="rounded border bg-white p-4">
            <h2 className="mb-3 text-lg font-semibold">
              Assignment Steps
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a step"
                value={stepText}
                onChange={(e) => setStepText(e.target.value)}
                className="min-w-0 flex-1 rounded border p-3"
              />

              <button
                type="button"
                onClick={addStep}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Add Step
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {steps.map((step, index) => (
                <li
                  key={`${step.id}-${index}`}
                  className="flex items-center justify-between"
                >
                  <span>{step.text}</span>

                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Add assignment */}
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

        <ul className="space-y-4">
          {assignments.map((assignment, assignmentIndex) => {
            const completed = assignment.steps.filter(
              (step) => step.completed
            ).length;

            return (
              <li
                key={`${assignment.id}-${assignmentIndex}`}
                className="rounded bg-white p-4 shadow"
              >
                <p>
                  <strong>Class:</strong> {assignment.className}
                </p>

                <p>
                  <strong>Assignment:</strong> {assignment.name}
                </p>

                <p>
                  <strong>Due Date:</strong> {assignment.dueDate}
                </p>

                {/* Sprint B #1296 */}
                <h3 className="mb-2 mt-4 font-semibold">
                  Assignment Steps
                </h3>

                {assignment.steps.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No steps added.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {assignment.steps.map((step, stepIndex) => (
                      <li
                        key={`${assignment.id}-${step.id}-${stepIndex}`}
                      >
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={step.completed}
                            onChange={() =>
                              toggleStep(assignment.id, step.id)
                            }
                          />

                          <span
                            className={
                              step.completed
                                ? "line-through text-gray-500"
                                : ""
                            }
                          >
                            {step.text}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-3 text-sm text-gray-600">
                  {completed} of {assignment.steps.length} steps
                  completed
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
