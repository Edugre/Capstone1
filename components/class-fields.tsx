import { Field, fieldClass } from "./form-fields";

type ClassDefaults = {
  class_name?: string;
  class_code?: string;
  instructor?: string | null;
  semester?: string | null;
};

// Shared by the add form and the edit dialog so both ask for the same things.
export default function ClassFields({ defaults = {} }: { defaults?: ClassDefaults }) {
  return (
    <>
      <Field label="Class name">
        <input
          name="className"
          type="text"
          required
          maxLength={100}
          defaultValue={defaults.class_name}
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
          defaultValue={defaults.class_code}
          placeholder="e.g. MAS 3105"
          className={fieldClass}
        />
      </Field>
      <Field label="Instructor" hint="Optional">
        <input
          name="instructor"
          type="text"
          defaultValue={defaults.instructor ?? undefined}
          placeholder="e.g. Dr. Jordan Lee"
          className={fieldClass}
        />
      </Field>
      <Field label="Semester" hint="Optional">
        <input
          name="semester"
          type="text"
          defaultValue={defaults.semester ?? undefined}
          placeholder="e.g. Fall 2026"
          className={fieldClass}
        />
      </Field>
    </>
  );
}
