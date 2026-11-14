"use server";

import { updateTag } from "next/cache";
import { getCurrentUser } from "./auth";
import { supabase } from "./supabase";
import { PRIORITIES, type Priority } from "./format";

export type FormState = { error?: string; ok?: boolean };

// The service client bypasses Row Level Security, so every query below must
// filter by the signed-in user's id itself.
const tag = (name: "classes" | "assignments" | "tasks", userId: string) =>
  `${name}:${userId}`;

async function ownsClass(userId: string, classId: number) {
  const { data } = await supabase
    .from("classes")
    .select("class_id")
    .eq("class_id", classId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

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

  const user = await getCurrentUser();
  const { error } = await supabase.from("classes").insert({
    user_id: user.id,
    class_name: className,
    class_code: classCode,
    instructor: optional(formData.get("instructor")),
    semester: optional(formData.get("semester")),
  });
  if (error) return { error: error.message };

  updateTag(tag("classes", user.id));
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

  const user = await getCurrentUser();
  if (!(await ownsClass(user.id, parsed.values.class_id))) {
    return { error: "Pick one of your classes." };
  }

  const { data, error } = await supabase
    .from("assignments")
    .insert({ ...parsed.values, user_id: user.id })
    .select("assignment_id")
    .single();
  if (error) return { error: error.message };

  // Steps are rows in "tasks" linked to the assignment (see lib/data.ts).
  // They share its due date so they stay in the order they were typed.
  if (steps.length > 0) {
    const { error: stepError } = await supabase.from("tasks").insert(
      steps.map((title) => ({
        title,
        user_id: user.id,
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
        .eq("assignment_id", data.assignment_id)
        .eq("user_id", user.id);
      return { error: stepError.message };
    }
    updateTag(tag("tasks", user.id));
  }

  updateTag(tag("assignments", user.id));
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

  const user = await getCurrentUser();
  if (!(await ownsClass(user.id, parsed.values.class_id))) {
    return { error: "Pick one of your classes." };
  }

  const { data, error } = await supabase
    .from("assignments")
    .update(parsed.values)
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .select("assignment_id");
  if (error) return { error: error.message };
  if (data.length === 0) {
    return { error: "This assignment no longer exists. Try refreshing." };
  }

  // Steps carry their own class_id; keep them with the assignment's class.
  const { error: stepError } = await supabase
    .from("tasks")
    .update({ class_id: parsed.values.class_id })
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id);

  updateTag(tag("assignments", user.id));
  if (stepError) return { error: stepError.message };
  return { ok: true };
}

export async function deleteAssignment(assignmentId: number): Promise<FormState> {
  if (!isId(assignmentId)) return { error: "Missing assignment." };
  const user = await getCurrentUser();

  // Steps reference the assignment, so they go first.
  const { data: steps, error: stepError } = await supabase
    .from("tasks")
    .delete()
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .select("user_id, assignment_id, class_id, title, description, due_date, priority, is_completed");
  if (stepError) return { error: stepError.message };

  const { data, error } = await supabase
    .from("assignments")
    .delete()
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id)
    .select("assignment_id");
  if (error || data.length === 0) {
    // Put the steps back so a failed delete doesn't lose them.
    if (steps.length > 0) await supabase.from("tasks").insert(steps);
    updateTag(tag("tasks", user.id));
    return {
      error: error?.message ?? "This assignment no longer exists. Try refreshing.",
    };
  }

  updateTag(tag("tasks", user.id));
  updateTag(tag("assignments", user.id));
  return { ok: true };
}

export async function setAssignmentCompleted(
  assignmentId: number,
  completed: boolean,
): Promise<FormState> {
  if (!isId(assignmentId)) return { error: "Missing assignment." };
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("assignments")
    .update({ is_completed: completed === true })
    .eq("assignment_id", assignmentId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  updateTag(tag("assignments", user.id));
  return { ok: true };
}

export async function setStepCompleted(
  taskId: number,
  completed: boolean
): Promise<FormState> {
  if (!isId(taskId)) return { error: "Missing step." };
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("tasks")
    .update({ is_completed: completed === true })
    .eq("task_id", taskId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  updateTag(tag("tasks", user.id));
  updateTag(tag("assignments", user.id));

  return { ok: true };
}
