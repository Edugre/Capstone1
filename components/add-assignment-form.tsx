"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addAssignment, type FormState } from "@/lib/actions";
import type { ClassItem } from "@/lib/data";
import { PRIORITIES } from "@/lib/format";
import { Field, FormMessage, SubmitButton, fieldClass } from "./form-fields";

export default function AddAssignmentForm({
  classes,
}: {
  classes: Pick<ClassItem, "class_id" | "class_name" | "class_code">[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addAssignment,
    {},
  );

  if (classes.length === 0) {
    return (
      <p className="text-sm text-muted">
        Add a class on the{" "}
        <Link href="/classes" className="font-semibold text-accent">
          Classes page
        </Link>{" "}
        first.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      <Field label="Title">
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. Problem Set 9"
          className={fieldClass}
        />
      </Field>
      <Field label="Class">
        <select name="classId" required className={fieldClass}>
          {classes.map((c) => (
            <option key={c.class_id} value={c.class_id}>
              {c.class_name} — {c.class_code}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex flex-wrap gap-3">
        <Field label="Due date" className="flex-[1_1_8rem]">
          <input name="dueDate" type="date" required className={fieldClass} />
        </Field>
        <Field label="Priority" className="flex-[1_1_7rem]">
          <select name="priority" defaultValue="Medium" className={fieldClass}>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Notes" hint="(optional)">
        <textarea
          name="description"
          rows={3}
          placeholder="Chapters, page numbers, links…"
          className={`${fieldClass} resize-y py-2.5`}
        />
      </Field>
      <SubmitButton
        pending={pending}
        label="Add assignment"
        pendingLabel="Adding…"
      />
      <FormMessage state={state} success="Assignment added." />
    </form>
  );
}
