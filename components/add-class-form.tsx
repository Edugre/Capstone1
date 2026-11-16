
"use client";

import { useActionState } from "react";
import { addClass, type FormState } from "@/lib/actions";
import { Field, FormMessage, SubmitButton, fieldClass } from "./form-fields";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

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
          maxLength={100}
          placeholder="e.g. Linear Algebra"
          className={fieldClass}
        />
      </Field>

      <Field label="Class code">
        <input
          name="classCode"
          type="text"
          required
          maxLength={100}
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

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">
          Meeting days (Optional)
        </legend>

        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <label
              key={day}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                name="meetingDays"
                value={day}
                className="accent-indigo-600"
              />
              {day}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Start time">
          <input
            name="startTime"
            type="time"
            className={fieldClass}
          />
        </Field>

        <Field label="End time">
          <input
            name="endTime"
            type="time"
            className={fieldClass}
          />
        </Field>
      </div>

      <p className="text-xs text-gray-500">
        Leave meeting days and times blank for online or asynchronous classes.
      </p>

      <SubmitButton
        pending={pending}
        label="Add class"
        pendingLabel="Adding…"
      />

      <FormMessage
        state={state}
        success="Class added! It gets its own color."
      />
    </form>
  );
}
