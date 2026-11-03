"use client";

import { startTransition, useOptimistic } from "react";
import { setAssignmentCompleted } from "@/lib/actions";
import type { AssignmentItem } from "@/lib/data";
import { formatDue } from "@/lib/format";
import { CheckIcon, StepsIcon } from "./icons";
import PriorityBadge from "./priority-badge";

export default function AssignmentRow({
  assignment: a,
  today,
  showDescription = false,
}: {
  assignment: AssignmentItem;
  today: string;
  showDescription?: boolean;
}) {
  // Flip the checkbox right away; it settles to the saved value once the
  // server responds (or snaps back if the update failed).
  const [completed, setCompleted] = useOptimistic(a.is_completed);

  function toggle() {
    startTransition(async () => {
      setCompleted(!completed);
      const result = await setAssignmentCompleted(a.assignment_id, !completed);
      if (result.error) console.error(result.error);
    });
  }

  const late = !completed && a.due_date < today;
  const dueColor = completed
    ? "text-faint"
    : late
      ? "text-late"
      : a.due_date === today
        ? "text-accent"
        : "text-ink-2";

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg px-3 py-2.5">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={completed}
        aria-label={`Mark ${a.title} ${completed ? "not complete" : "complete"}`}
        className="-my-2 -mr-2 -ml-2.5 flex size-11 flex-none cursor-pointer items-center justify-center rounded-full"
      >
        {completed ? (
          <span className="flex size-5.5 items-center justify-center rounded-full bg-accent text-on-accent">
            <CheckIcon className="size-3.5 stroke-3" />
          </span>
        ) : (
          <span className="size-5.5 rounded-full border-2 border-idle" />
        )}
      </button>

      <div className="flex min-w-0 flex-[1_1_16rem] flex-col gap-0.5">
        <span
          className={`font-semibold ${completed ? "text-faint line-through" : ""}`}
        >
          {a.title}
        </span>
        {showDescription && a.description && (
          <span className="text-[13px] text-muted">{a.description}</span>
        )}
        {!showDescription && <Meta assignment={a} />}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {showDescription && <Meta assignment={a} />}
        <PriorityBadge priority={a.priority} />
        <span
          className={`min-w-24 text-right text-[13px] font-semibold ${dueColor}`}
        >
          {formatDue(a.due_date, today, completed)}
        </span>
      </div>
    </li>
  );
}

function Meta({ assignment: a }: { assignment: AssignmentItem }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
      <span className="flex min-w-22 items-center gap-1.5 font-medium text-ink-2">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: a.color }}
        />
        {a.class_code}
      </span>
      {a.stepsTotal > 0 && (
        <span className="flex items-center gap-1">
          <StepsIcon className="size-3.5" />
          {a.stepsDone} of {a.stepsTotal} steps
        </span>
      )}
    </span>
  );
}
