import "server-only";
import { cacheTag } from "next/cache";
import { connection } from "next/server";
import { supabase } from "./supabase";

export type Class = {
  class_id: number;
  class_name: string;
  class_code: string;
};

export type Assignment = {
  assignment_id: number;
  title: string;
  due_date: string;
  classes: { class_name: string; class_code: string } | null;
};

export async function getClasses(): Promise<Class[]> {
  "use cache";
  cacheTag("classes");

  const { data, error } = await supabase
    .from("classes")
    .select("class_id, class_name, class_code")
    .order("class_id");

  if (error) throw new Error(`Failed to load classes: ${error.message}`);
  return data;
}

export async function getAssignments(): Promise<Assignment[]> {
  "use cache";
  cacheTag("assignments");

  const { data, error } = await supabase
    .from("assignments")
    .select("assignment_id, title, due_date, classes(class_name, class_code)")
    .order("due_date")
    .returns<Assignment[]>();

  if (error) throw new Error(`Failed to load assignments: ${error.message}`);
  return data;
}

export type ClassSummary = Class & {
  openCount: number;
  /** Earliest due date (YYYY-MM-DD) among open assignments due today or later. */
  nextDueDate: string | null;
};

async function getOpenAssignments(): Promise<
  { class_id: number; due_date: string }[]
> {
  "use cache";
  cacheTag("assignments");

  const { data, error } = await supabase
    .from("assignments")
    .select("class_id, due_date")
    .eq("is_completed", false);

  if (error) throw new Error(`Failed to load assignments: ${error.message}`);
  return data;
}

function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export async function getClassSummaries(): Promise<ClassSummary[]> {
  const [classes, open] = await Promise.all([
    getClasses(),
    getOpenAssignments(),
  ]);

  // "Today" must be read per request, not frozen into a cached result.
  await connection();
  const today = todayISO();

  return classes.map((c) => {
    const mine = open.filter((a) => a.class_id === c.class_id);
    const upcoming = mine
      .map((a) => a.due_date)
      .filter((d) => d >= today)
      .sort();
    return { ...c, openCount: mine.length, nextDueDate: upcoming[0] ?? null };
  });
}
