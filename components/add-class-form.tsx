"use client";

import { useActionState } from "react";
import { addClass, type FormState } from "@/lib/actions";
import { Field, FormMessage, SubmitButton, fieldClass } from "./form-fields";

export default function AddClassForm({
  defaultSemester,
}: {
  defaultSemester?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addClass,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Class name">
        <input
          name="className"
          type="text"
          required
          placeholder="e.g. Linear Algebra"
          className={fieldClass}
        />
      </Field>
      <Field label="Class code">
        <input
          name="classCode"
          type="text"
          required
          placeholder="e.g. MAS 3105"
          className={fieldClass}
        />
      </Field>
      <Field label="Instructor" hint="Optional">
        <input
          name="instructor"
          type="text"
          placeholder="e.g. Dr. Jordan Lee"
          className={fieldClass}
        />
      </Field>
      <Field label="Semester" hint="Optional">
        <input
          name="semester"
          type="text"
          defaultValue={defaultSemester}
          placeholder="e.g. Fall 2026"
          className={fieldClass}
        />
      </Field>
      <SubmitButton pending={pending} label="Add class" pendingLabel="Adding…" />
      <FormMessage state={state} success="Class added! It gets its own color." />
    </form>
  );
}
