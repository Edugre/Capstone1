"use client";

import { startTransition, useOptimistic } from "react";
import { setAssignmentCompleted } from "@/lib/actions";
import type { AssignmentItem } from "@/lib/data";
import { formatDue } from "@/lib/format";
import { CheckIcon, ChevronIcon } from "./icons";
import { useToast } from "./toast";

export default function AssignmentRow({
  assignment: a,
  today,
  showDetails = false,
  index = 0,
}: {
  assignment: AssignmentItem;
  today: string;
  showDetails?: boolean;
  index?: number;
}) {
  const toast = useToast();
  const [completed, setCompleted] = useOptimistic(a.is_completed);

  function toggle() {
    const next = !completed;
    startTransition(async () => {
      setCompleted(next);
      const result = await setAssignmentCompleted(a.assignment_id, next);
      if (result.error) {
        console.error(result.error);
      } else if (next) {
        toast(`Nice work! ${a.title} is done.`, () =>
          startTransition(async () => {
            await setAssignmentCompleted(a.assignment_id, false);
          }),
        );
      }
    });
  }

  const late = !completed && a.due_date < today;
  const dueToday = !completed && a.due_date === today;
  const card = completed
    ? "bg-done-card"
    : late
      ? "bg-late-card"
      : dueToday
        ? "bg-today-card"
        : "bg-soft ring-1 ring-line ring-inset";
  const dueColor = completed
    ? "text-done"
    : late
      ? "text-late"
      : dueToday
        ? "text-today"
        : "text-ink-2";
  const stepsDone = a.steps.filter((s) => s.is_completed).length;
  const hasDetails = showDetails && (a.description || a.steps.length > 0);

  return (
    <li
      className={`lift animate-rise rounded-[18px] py-2.5 pr-4 pl-2 ${card}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={completed}
          aria-label={`Mark ${a.title} ${completed ? "not done" : "done"}`}
          className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full"
        >
          {completed ? (
            <span className="flex size-7 animate-pop items-center justify-center rounded-full bg-check text-white">
              <CheckIcon className="size-4 stroke-[3.2]" />
            </span>
          ) : (
            <span className="size-7 rounded-full border-[2.5px] border-idle bg-surface transition-colors hover:border-accent" />
          )}
        </button>

        <div className="flex min-w-0 flex-[1_1_10rem] flex-col gap-1">
          <span
            className={`font-extrabold ${completed ? "text-muted line-through" : ""}`}
          >
            {a.title}
          </span>
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] font-bold text-ink-2">
            <span
              className="rounded-full px-2.5 py-px font-extrabold"
              style={{ backgroundColor: a.bg, color: a.fg }}
            >
              {a.class_code}
            </span>
            <span>{a.priority} priority</span>
            {a.steps.length > 0 && (
              <span>
                {stepsDone} of {a.steps.length} steps
              </span>
            )}
          </span>
        </div>

        <span className={`text-sm font-extrabold whitespace-nowrap ${dueColor}`}>
          {formatDue(a.due_date, today, completed)}
        </span>
      </div>

      {hasDetails && (
        <details className="group mt-0.5 ml-[3.25rem]">
          <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-1 text-[13px] font-extrabold text-link-hover [&::-webkit-details-marker]:hidden">
            <ChevronIcon className="size-3.5 stroke-[2.6] transition-transform group-open:rotate-90" />
            Details
          </summary>
          <div className="flex animate-fade flex-col gap-2 pt-1 pb-1.5">
            {a.description && <p className="text-[15px] text-ink-2">{a.description}</p>}
            {a.steps.length > 0 && (
              <ul className="flex flex-col gap-1">
                {a.steps.map((step) => (
                  <li
                    key={step.task_id}
                    className={`flex items-center gap-2 text-sm font-bold ${step.is_completed ? "text-muted" : ""}`}
                  >
                    {step.is_completed ? (
                      <span className="flex size-4 items-center justify-center rounded-md bg-check text-white">
                        <CheckIcon className="size-3 stroke-[3.5]" />
                      </span>
                    ) : (
                      <span className="size-4 rounded-md border-2 border-idle bg-surface" />
                    )}
                    {step.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      )}
    </li>
  );
}
