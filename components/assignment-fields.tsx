import type { ClassOption } from "@/lib/data";
import { PRIORITIES, type Priority } from "@/lib/format";
import { Field, PillChoice, fieldClass } from "./form-fields";

// The inputs shared by the add and edit assignment forms.
export default function AssignmentFields({
  classes,
  defaults,
}: {
  classes: ClassOption[];
  defaults?: {
    title: string;
    class_id: number;
    due_date: string;
    priority: Priority;
    description: string | null;
  };
}) {
  return (
    <>
      <Field label="What is it?">
        <input
          name="title"
          type="text"
          required
          maxLength={150}
          placeholder="e.g. Problem Set 9"
          defaultValue={defaults?.title}
          className={fieldClass}
        />
      </Field>
      <PillChoice
        legend="For which class?"
        name="classId"
        defaultValue={String(defaults?.class_id ?? classes[0]?.class_id)}
        options={classes.map((c) => ({
          value: String(c.class_id),
          label: c.class_code,
          bg: c.bg,
          fg: c.fg,
        }))}
      />
      <div className="flex flex-wrap gap-3">
        <Field label="Due date" className="flex-[1_1_9rem]">
          <input
            name="dueDate"
            type="date"
            required
            defaultValue={defaults?.due_date}
            className={fieldClass}
          />
        </Field>
        <PillChoice
          legend="How important?"
          name="priority"
          defaultValue={defaults?.priority ?? "Medium"}
          options={PRIORITIES.map((p) => ({ value: p, label: p }))}
          className="flex-[1_1_12rem]"
        />
      </div>
      <Field label="Notes" hint="Optional: chapters, links, reminders">
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ""}
          className={`${fieldClass} resize-y py-3`}
        />
      </Field>
    </>
  );
}
