"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addAssignment, type FormState } from "@/lib/actions";
import type { ClassItem } from "@/lib/data";
import { PRIORITIES } from "@/lib/format";
import {
  Field,
  FormMessage,
  PillChoice,
  SubmitButton,
  fieldClass,
} from "./form-fields";

export default function AddAssignmentForm({
  classes,
}: {
  classes: Pick<ClassItem, "class_id" | "class_code" | "bg" | "fg">[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addAssignment,
    {},
  );

  if (classes.length === 0) {
    return (
      <p className="text-ink-2">
        Add a class on the{" "}
        <Link href="/classes" className="font-extrabold text-link">
          Classes page
        </Link>{" "}
        first.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="What is it?">
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. Problem Set 9"
          className={fieldClass}
        />
      </Field>
      <PillChoice
        legend="For which class?"
        name="classId"
        defaultValue={String(classes[0].class_id)}
        options={classes.map((c) => ({
          value: String(c.class_id),
          label: c.class_code,
          bg: c.bg,
          fg: c.fg,
        }))}
      />
      <div className="flex flex-wrap gap-3">
        <Field label="Due date" className="flex-[1_1_9rem]">
          <input name="dueDate" type="date" required className={fieldClass} />
        </Field>
        <PillChoice
          legend="How important?"
          name="priority"
          defaultValue="Medium"
          options={PRIORITIES.map((p) => ({ value: p, label: p }))}
          className="flex-[1_1_12rem]"
        />
      </div>
      <Field label="Notes" hint="Optional — chapters, links, reminders">
        <textarea
          name="description"
          rows={3}
          className={`${fieldClass} resize-y py-3`}
        />
      </Field>
      <SubmitButton pending={pending} label="Add to my list" pendingLabel="Adding…" />
      <FormMessage state={state} success="Added! You'll find it in your list." />
    </form>
  );
}
