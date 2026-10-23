import "server-only";
import { cacheTag } from "next/cache";
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
