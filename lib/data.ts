import "server-only";
import { cacheTag } from "next/cache";
import { connection } from "next/server";
import { getCurrentUser } from "./auth";
import { supabase } from "./supabase";
import {
  addDays,
  classTint,
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

type StepRow = {
  task_id: number;
  assignment_id: number;
  title: string;
  is_completed: boolean;
};

// Each cached read takes the user id, so it is part of the cache key and
// one user's rows never come back for another.
async function getClassRows(userId: string): Promise<ClassRow[]> {
  "use cache";
  cacheTag(`classes:${userId}`);

  const { data, error } = await supabase
    .from("classes")
    .select("class_id, class_name, class_code, instructor, semester")
    .eq("user_id", userId)
    .order("class_id");

  if (error) throw new Error(`Failed to load classes: ${error.message}`);
  return data;
}

async function getAssignmentRows(userId: string): Promise<AssignmentRow[]> {
  "use cache";
  cacheTag(`assignments:${userId}`);

  const { data, error } = await supabase
    .from("assignments")
    .select(
      "assignment_id, class_id, title, description, due_date, priority, is_completed",
    )
    .eq("user_id", userId)
    .order("due_date")
    .order("assignment_id");

  if (error) throw new Error(`Failed to load assignments: ${error.message}`);
  return data;
}

// Tasks that belong to an assignment are shown as its steps.
async function getStepRows(userId: string): Promise<StepRow[]> {
  "use cache";
  cacheTag(`tasks:${userId}`);

  const { data, error } = await supabase
    .from("tasks")
    .select("task_id, assignment_id, title, is_completed")
    .eq("user_id", userId)
    .not("assignment_id", "is", null)
    .order("due_date")
    .order("task_id");

  if (error) throw new Error(`Failed to load tasks: ${error.message}`);
  return data;
}

export type Step = { task_id: number; title: string; is_completed: boolean };

export type ClassItem = ClassRow & {
  bg: string;
  fg: string;
  total: number;
  done: number;
  open: number;
  overdue: number;
  /** Earliest due date (YYYY-MM-DD) among open assignments due today or later. */
  nextDueDate: string | null;
};

/** What a form needs to offer a class as a choice. */
export type ClassOption = Pick<ClassItem, "class_id" | "class_code" | "bg" | "fg">;

export type AssignmentItem = Omit<AssignmentRow, "priority"> & {
  priority: Priority;
  class_name: string;
  class_code: string;
  bg: string;
  fg: string;
  steps: Step[];
};

export type Tracker = {
  today: string;
  /** Last day of the 7-day "this week" window that starts today. */
  weekEnd: string;
  hour: number;
  classes: ClassItem[];
  assignments: AssignmentItem[];
};

export async function getTracker(): Promise<Tracker> {
  const user = await getCurrentUser();
  const [classRows, assignmentRows, stepRows] = await Promise.all([
    getClassRows(user.id),
    getAssignmentRows(user.id),
    getStepRows(user.id),
  ]);

  // "Today" must be read per request, not frozen into a cached result.
  await connection();
  const today = todayISO();
  const hour = new Date().getHours();

  const classById = new Map(
    classRows.map((c, index) => [c.class_id, { ...c, ...classTint(index) }]),
  );

  const steps = new Map<number, Step[]>();
  for (const { assignment_id, ...step } of stepRows) {
    steps.set(assignment_id, [...(steps.get(assignment_id) ?? []), step]);
  }

  const assignments: AssignmentItem[] = assignmentRows.flatMap((a) => {
    const c = classById.get(a.class_id);
    if (!c) return [];
    return {
      ...a,
      priority: toPriority(a.priority),
      class_name: c.class_name,
      class_code: c.class_code,
      bg: c.bg,
      fg: c.fg,
      steps: steps.get(a.assignment_id) ?? [],
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

  return { today, weekEnd: addDays(today, 6), hour, classes, assignments };
}
