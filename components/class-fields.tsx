import { Field, fieldClass } from "./form-fields";

export const MEETING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type ClassDefaults = {
  class_name?: string;
  class_code?: string;
  instructor?: string | null;
  semester?: string | null;
  meeting_days?: string[] | null;
  start_time?: string | null;
  end_time?: string | null;
};

// The database returns times as HH:MM:SS; the time inputs want HH:MM.
const hhmm = (time?: string | null) => time?.slice(0, 5);

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

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Meeting days (Optional)</legend>
        <div className="flex flex-wrap gap-2">
          {MEETING_DAYS.map((day) => (
            <label
              key={day}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                name="meetingDays"
                value={day}
                defaultChecked={defaults.meeting_days?.includes(day)}
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
            defaultValue={hhmm(defaults.start_time)}
            className={fieldClass}
          />
        </Field>
        <Field label="End time">
          <input
            name="endTime"
            type="time"
            defaultValue={hhmm(defaults.end_time)}
            className={fieldClass}
          />
        </Field>
      </div>

      <p className="text-xs text-gray-500">
        Leave meeting days and times blank for online or asynchronous classes.
      </p>
    </>
  );
}
