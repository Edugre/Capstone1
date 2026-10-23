"use server";

import { updateTag } from "next/cache";
import { supabase } from "./supabase";

export type FormState = { error?: string };

export async function addClass(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const className = String(formData.get("className") ?? "").trim();
  const classCode = String(formData.get("classCode") ?? "").trim();
  if (!className || !classCode) {
    return { error: "Class name and class code are required." };
  }

  const { error } = await supabase
    .from("classes")
    .insert({ class_name: className, class_code: classCode });
  if (error) return { error: error.message };

  updateTag("classes");
  return {};
}

export async function addAssignment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const classId = Number(formData.get("classId"));
  const dueDate = String(formData.get("dueDate") ?? "");
  if (!title || !classId || !dueDate) {
    return { error: "Title, class, and due date are required." };
  }

  const { error } = await supabase
    .from("assignments")
    .insert({ title, class_id: classId, due_date: dueDate });
  if (error) return { error: error.message };

  updateTag("assignments");
  return {};
}
