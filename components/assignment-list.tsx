"use client";

import { useState } from "react";
import type { AssignmentItem, ClassItem } from "@/lib/data";
import { addDays } from "@/lib/format";
import AssignmentRow from "./assignment-row";

type Status = "all" | "open" | "overdue" | "done";

const statusTabs: { value: Status; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "overdue", label: "Overdue" },
  { value: "done", label: "Completed" },
];

export default function AssignmentList({
  assignments,
  classes,
  today,
  weekEnd,
}: {
  assignments: AssignmentItem[];
  classes: Pick<ClassItem, "class_id" | "class_code" | "color">[];
  today: string;
  weekEnd: string;
}) {
  const [status, setStatus] = useState<Status>("all");
  const [classId, setClassId] = useState<number | null>(null);

  const inClass = assignments.filter(
    (a) => classId === null || a.class_id === classId,
  );
  const isOverdue = (a: AssignmentItem) => !a.is_completed && a.due_date < today;
  const counts: Record<Status, number> = {
    all: inClass.length,
    open: inClass.filter((a) => !a.is_completed).length,
    overdue: inClass.filter(isOverdue).length,
    done: inClass.filter((a) => a.is_completed).length,
  };
  const shown = inClass.filter((a) =>
    status === "open"
      ? !a.is_completed
      : status === "overdue"
        ? isOverdue(a)
        : status === "done"
          ? a.is_completed
          : true,
  );

  const nextWeekEnd = addDays(weekEnd, 7);
  const open = shown.filter((a) => !a.is_completed);
  const groups = [
    { label: "Overdue", tone: "text-late", items: open.filter(isOverdue) },
    {
      label: "This week",
      tone: "text-accent",
      items: open.filter((a) => a.due_date >= today && a.due_date <= weekEnd),
    },
    {
      label: "Next week",
      tone: "text-muted",
      items: open.filter((a) => a.due_date > weekEnd && a.due_date <= nextWeekEnd),
    },
    {
      label: "Later this term",
      tone: "text-muted",
      items: open.filter((a) => a.due_date > nextWeekEnd),
    },
    {
      label: "Completed",
      tone: "text-muted",
      items: shown.filter((a) => a.is_completed).reverse(),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          aria-label="Filter by status"
          className="flex flex-wrap gap-1 rounded-xl bg-sunken p-1"
        >
          {statusTabs.map((tab) => {
            const selected = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setStatus(tab.value)}
                className={`min-h-10 cursor-pointer rounded-lg px-3.5 text-sm font-semibold ${
                  selected ? "bg-surface text-ink shadow-sm" : "text-ink-2"
                }`}
              >
                {tab.label}{" "}
                <span className="font-medium opacity-75">{counts[tab.value]}</span>
              </button>
            );
          })}
        </div>

        <div aria-label="Filter by class" className="flex flex-wrap gap-1.5">
          <ClassChip
            label="All classes"
            selected={classId === null}
            onClick={() => setClassId(null)}
          />
          {classes.map((c) => (
            <ClassChip
              key={c.class_id}
              label={c.class_code}
              color={c.color}
              selected={classId === c.class_id}
              onClick={() => setClassId(c.class_id)}
            />
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
          <p className="font-semibold">Nothing here</p>
          <p className="mt-1 text-sm text-muted">
            No assignments match these filters.
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section
            key={group.label}
            aria-label={group.label}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <div className="flex items-center gap-2 border-b border-divider px-5 py-3.5">
              <h2
                className={`text-xs font-bold tracking-wider uppercase ${group.tone}`}
              >
                {group.label}
              </h2>
              <span className="text-xs font-semibold text-muted">
                {group.items.length}
              </span>
            </div>
            <ul className="px-2 py-1">
              {group.items.map((a) => (
                <AssignmentRow
                  key={a.assignment_id}
                  assignment={a}
                  today={today}
                  showDescription
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function ClassChip({
  label,
  color,
  selected,
  onClick,
}: {
  label: string;
  color?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold ${
        selected
          ? "border-ink bg-ink text-surface"
          : "border-line-strong bg-surface text-ink-2"
      }`}
    >
      {color && (
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      )}
      {label}
    </button>
  );
}
