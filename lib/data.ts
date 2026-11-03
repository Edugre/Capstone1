import "server-only";
import { cacheTag } from "next/cache";
import { connection } from "next/server";
import { supabase } from "./supabase";
import {
  addDays,
  classColor,
  todayISO,
  toPriority,
  type Priority,
} from "./format";

type ClassRow = {
  class_id: number;
  class_name: string;
  class_code: string;
  instructor: string | null;
  semester: string | null;
};

type AssignmentRow = {
  assignment_id: number;
  class_id: number;
  title: string;
  description: string | null;
  due_date: string;
  priority: string | null;
  is_completed: boolean;
};

type StepRow = { assignment_id: number; is_completed: boolean };

async function getClassRows(): Promise<ClassRow[]> {
  "use cache";
  cacheTag("classes");

  const { data, error } = await supabase
    .from("classes")
    .select("class_id, class_name, class_code, instructor, semester")
    .order("class_id");

  if (error) throw new Error(`Failed to load classes: ${error.message}`);
  return data;
}

async function getAssignmentRows(): Promise<AssignmentRow[]> {
  "use cache";
  cacheTag("assignments");

  const { data, error } = await supabase
    .from("assignments")
    .select(
      "assignment_id, class_id, title, description, due_date, priority, is_completed",
    )
    .order("due_date")
    .order("assignment_id");

  if (error) throw new Error(`Failed to load assignments: ${error.message}`);
  return data;
}

// Tasks that belong to an assignment are shown as its steps.
async function getStepRows(): Promise<StepRow[]> {
  "use cache";
  cacheTag("tasks");

  const { data, error } = await supabase
    .from("tasks")
    .select("assignment_id, is_completed")
    .not("assignment_id", "is", null);

  if (error) throw new Error(`Failed to load tasks: ${error.message}`);
  return data;
}

export type ClassItem = ClassRow & {
  color: string;
  total: number;
  done: number;
  open: number;
  overdue: number;
  /** Earliest due date (YYYY-MM-DD) among open assignments due today or later. */
  nextDueDate: string | null;
};

export type AssignmentItem = Omit<AssignmentRow, "priority"> & {
  priority: Priority;
  class_name: string;
  class_code: string;
  color: string;
  stepsDone: number;
  stepsTotal: number;
};

export type Tracker = {
  today: string;
  /** Last day of the 7-day "this week" window that starts today. */
  weekEnd: string;
  classes: ClassItem[];
  assignments: AssignmentItem[];
};

export async function getTracker(): Promise<Tracker> {
  const [classRows, assignmentRows, stepRows] = await Promise.all([
    getClassRows(),
    getAssignmentRows(),
    getStepRows(),
  ]);

  // "Today" must be read per request, not frozen into a cached result.
  await connection();
  const today = todayISO();

  const classById = new Map(
    classRows.map((c, index) => [c.class_id, { ...c, color: classColor(index) }]),
  );

  const steps = new Map<number, { done: number; total: number }>();
  for (const step of stepRows) {
    const count = steps.get(step.assignment_id) ?? { done: 0, total: 0 };
    count.total += 1;
    if (step.is_completed) count.done += 1;
    steps.set(step.assignment_id, count);
  }

  const assignments: AssignmentItem[] = assignmentRows.flatMap((a) => {
    const c = classById.get(a.class_id);
    if (!c) return [];
    const s = steps.get(a.assignment_id);
    return {
      ...a,
      priority: toPriority(a.priority),
      class_name: c.class_name,
      class_code: c.class_code,
      color: c.color,
      stepsDone: s?.done ?? 0,
      stepsTotal: s?.total ?? 0,
    };
  });

  const classes: ClassItem[] = [...classById.values()].map((c) => {
    const mine = assignments.filter((a) => a.class_id === c.class_id);
    const open = mine.filter((a) => !a.is_completed);
    return {
      ...c,
      total: mine.length,
      done: mine.length - open.length,
      open: open.length,
      overdue: open.filter((a) => a.due_date < today).length,
      nextDueDate: open.find((a) => a.due_date >= today)?.due_date ?? null,
    };
  });

  return { today, weekEnd: addDays(today, 6), classes, assignments };
}
