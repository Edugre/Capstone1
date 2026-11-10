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
  if (className.length > 100) {
  return { error: "Class name must be 100 characters or fewer." };
  }
  if (classCode.length > 100) {
    return { error: "Class code must be 100 characters or fewer." };
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

function isId(value: number) {
  return Number.isInteger(value) && value > 0;
}

// Shared by add and edit so both forms follow the same rules.
function readAssignment(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const classId = Number(formData.get("classId"));
  const dueDate = String(formData.get("dueDate") ?? "");
  const priority = String(formData.get("priority") ?? "Medium");
  if (!title || !isId(classId) || !dueDate) {
    return { error: "Title, class, and due date are required." } as const;
  }
  if (title.length > 150) {
  return { error: "Assignment title must be 150 characters or fewer." } as const;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return { error: "Due date must be a valid date." } as const;
  }
  if (!PRIORITIES.includes(priority as Priority)) {
    return { error: "Priority must be Low, Medium, or High." } as const;
  }
  return {
    values: {
      title,
      class_id: classId,
      due_date: dueDate,
      priority,
      description: optional(formData.get("description")),
    },
  } as const;
}

export async function addAssignment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = readAssignment(formData);
  if ("error" in parsed) return { error: parsed.error };

  const steps = formData
    .getAll("steps")
    .map((step) => String(step).trim())
    .filter(Boolean);
  if (steps.length > 30) return { error: "That's a lot of steps — keep it to 30." };

  const { data, error } = await supabase
    .from("assignments")
    .insert(parsed.values)
    .select("assignment_id")
    .single();
  if (error) return { error: error.message };

  // Steps are rows in "tasks" linked to the assignment (see lib/data.ts).
  // They share its due date so they stay in the order they were typed.
  if (steps.length > 0) {
    const { error: stepError } = await supabase.from("tasks").insert(
      steps.map((title) => ({
        title,
        assignment_id: data.assignment_id,
        class_id: parsed.values.class_id,
        due_date: parsed.values.due_date,
      })),
    );
    if (stepError) {
      // Don't leave an assignment behind that's missing its steps.
      await supabase
        .from("assignments")
        .delete()
        .eq("assignment_id", data.assignment_id);
      return { error: stepError.message };
    }
    updateTag("tasks");
  }

  updateTag("assignments");
  return { ok: true };
}

export async function updateAssignment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const assignmentId = Number(formData.get("assignmentId"));
  if (!isId(assignmentId)) return { error: "Missing assignment." };

  const parsed = readAssignment(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { data, error } = await supabase
    .from("assignments")
    .update(parsed.values)
    .eq("assignment_id", assignmentId)
    .select("assignment_id");
  if (error) return { error: error.message };
  if (data.length === 0) {
    return { error: "This assignment no longer exists. Try refreshing." };
  }

  // Steps carry their own class_id; keep them with the assignment's class.
  const { error: stepError } = await supabase
    .from("tasks")
    .update({ class_id: parsed.values.class_id })
    .eq("assignment_id", assignmentId);

  updateTag("assignments");
  if (stepError) return { error: stepError.message };
  return { ok: true };
}

export async function deleteAssignment(assignmentId: number): Promise<FormState> {
  if (!isId(assignmentId)) return { error: "Missing assignment." };

  // Steps reference the assignment, so they go first.
  const { data: steps, error: stepError } = await supabase
    .from("tasks")
    .delete()
    .eq("assignment_id", assignmentId)
    .select("assignment_id, class_id, title, description, due_date, priority, is_completed");
  if (stepError) return { error: stepError.message };

  const { data, error } = await supabase
    .from("assignments")
    .delete()
    .eq("assignment_id", assignmentId)
    .select("assignment_id");
  if (error || data.length === 0) {
    // Put the steps back so a failed delete doesn't lose them.
    if (steps.length > 0) await supabase.from("tasks").insert(steps);
    updateTag("tasks");
    return {
      error: error?.message ?? "This assignment no longer exists. Try refreshing.",
    };
  }

  updateTag("tasks");
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
