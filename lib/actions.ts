"use server";

import { updateTag } from "next/cache";
import { supabase } from "./supabase";
import { PRIORITIES, type Priority } from "./format";

export type FormState = { error?: string; ok?: boolean };

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export async function addClass(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const className = String(formData.get("className") ?? "").trim();
  const classCode = String(formData.get("classCode") ?? "").trim();
  if (!className || !classCode) {
    return { error: "Class name and class code are required." };
  }

  const { error } = await supabase.from("classes").insert({
    class_name: className,
    class_code: classCode,
    instructor: optional(formData.get("instructor")),
    semester: optional(formData.get("semester")),
  });
  if (error) return { error: error.message };

  updateTag("classes");
  return { ok: true };
}

export async function addAssignment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const classId = Number(formData.get("classId"));
  const dueDate = String(formData.get("dueDate") ?? "");
  const priority = String(formData.get("priority") ?? "Medium");
  if (!title || !classId || !dueDate) {
    return { error: "Title, class, and due date are required." };
  }
  if (!PRIORITIES.includes(priority as Priority)) {
    return { error: "Priority must be Low, Medium, or High." };
  }

  const { error } = await supabase.from("assignments").insert({
    title,
    class_id: classId,
    due_date: dueDate,
    priority,
    description: optional(formData.get("description")),
  });
  if (error) return { error: error.message };

  updateTag("assignments");
  return { ok: true };
}

export async function setAssignmentCompleted(
  assignmentId: number,
  completed: boolean,
): Promise<FormState> {
  const { error } = await supabase
    .from("assignments")
    .update({ is_completed: completed })
    .eq("assignment_id", assignmentId);
  if (error) return { error: error.message };

  updateTag("assignments");
  return { ok: true };
}

export async function setStepCompleted(
  taskId: number,
  completed: boolean
): Promise<FormState> {
  const { error } = await supabase
    .from("tasks")
    .update({ is_completed: completed })
    .eq("task_id", taskId);

  if (error) return { error: error.message };

  updateTag("tasks");
  updateTag("assignments");

  return { ok: true };
}
