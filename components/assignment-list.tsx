"use client";

import { useState } from "react";
import type { AssignmentItem, ClassItem } from "@/lib/data";
import { addDays, formatDate } from "@/lib/format";
import AssignmentRow from "./assignment-row";
import { LeafIcon } from "./icons";

type Status = "todo" | "late" | "done" | "all";

const statusTabs: { value: Status; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "late", label: "Catch up" },
  { value: "done", label: "Done" },
  { value: "all", label: "Everything" },
];

export default function AssignmentList({
  assignments,
  classes,
  today,
  weekEnd,
}: {
  assignments: AssignmentItem[];
  classes: Pick<ClassItem, "class_id" | "class_code" | "bg" | "fg">[];
  today: string;
  weekEnd: string;
}) {
  const [status, setStatus] = useState<Status>("todo");
  const [classId, setClassId] = useState<number | null>(null);

  const inClass = assignments.filter(
    (a) => classId === null || a.class_id === classId,
  );
  const isLate = (a: AssignmentItem) => !a.is_completed && a.due_date < today;
  const counts: Record<Status, number> = {
    todo: inClass.filter((a) => !a.is_completed).length,
    late: inClass.filter(isLate).length,
    done: inClass.filter((a) => a.is_completed).length,
    all: inClass.length,
  };
  const shown = inClass.filter((a) =>
    status === "todo"
      ? !a.is_completed
      : status === "late"
        ? isLate(a)
        : status === "done"
          ? a.is_completed
          : true,
  );

  const nextWeekEnd = addDays(weekEnd, 7);
  const short = { month: "short", day: "numeric" } as const;
  const open = shown.filter((a) => !a.is_completed);
  const groups = [
    {
      label: "Catch up",
      hint: "A little behind — start with these",
      chip: "bg-late-soft text-late",
      items: open.filter(isLate),
    },
    {
      label: "This week",
      hint: `Today through ${formatDate(weekEnd)}`,
      chip: "bg-today-soft text-today",
      items: open.filter((a) => a.due_date >= today && a.due_date <= weekEnd),
    },
    {
      label: "Next week",
      hint: `${formatDate(addDays(weekEnd, 1), short)} – ${formatDate(nextWeekEnd, short)}`,
      chip: "bg-(--tint-0-bg) text-(--tint-0-fg)",
      items: open.filter((a) => a.due_date > weekEnd && a.due_date <= nextWeekEnd),
    },
    {
      label: "Later this term",
      hint: "Plenty of time",
      chip: "bg-(--tint-3-bg) text-(--tint-3-fg)",
      items: open.filter((a) => a.due_date > nextWeekEnd),
    },
    {
      label: "Done",
      hint: "Look at you go",
      chip: "bg-(--tint-1-bg) text-(--tint-1-fg)",
      items: shown.filter((a) => a.is_completed).reverse(),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex animate-rise flex-col gap-3 [animation-delay:80ms]">
        <div
          aria-label="Show"
          className="flex flex-wrap gap-1.5 self-start rounded-full border border-line bg-surface p-1.5"
        >
          {statusTabs.map((tab) => {
            const selected = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setStatus(tab.value)}
                className={`min-h-11 cursor-pointer rounded-full px-4.5 text-[15px] font-extrabold transition-colors ${
                  selected ? "bg-ink text-canvas" : "text-ink-2 hover:bg-warm-2"
                }`}
              >
                {tab.label}{" "}
                <span className="font-bold opacity-70">{counts[tab.value]}</span>
              </button>
            );
          })}
        </div>

        <div aria-label="Filter by class" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={classId === null}
            onClick={() => setClassId(null)}
            className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-extrabold transition-colors ${
              classId === null
                ? "bg-ink text-canvas"
                : "bg-surface text-ink-2 ring-[1.5px] ring-line-strong ring-inset"
            }`}
          >
            All classes
          </button>
          {classes.map((c) => {
            const selected = classId === c.class_id;
            return (
              <button
                key={c.class_id}
                type="button"
                aria-pressed={selected}
                onClick={() => setClassId(c.class_id)}
                className="min-h-10 cursor-pointer rounded-full px-4 text-sm font-extrabold transition-[background-color,color,transform] hover:scale-105"
                style={
                  selected
                    ? { backgroundColor: c.fg, color: "var(--canvas)" }
                    : { backgroundColor: c.bg, color: c.fg }
                }
              >
                {c.class_code}
              </button>
            );
          })}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="flex animate-rise flex-col items-center gap-1.5 rounded-3xl bg-done-card px-6 py-10 text-center">
          <LeafIcon className="size-11 stroke-[1.8] text-done" />
          <p className="text-lg font-black">All clear here</p>
          <p className="text-ink-2">Nothing matches these filters. Nice.</p>
        </div>
      ) : (
        groups.map((group, i) => (
          <section
            key={group.label}
            aria-label={group.label}
            className="animate-rise rounded-3xl border border-line bg-surface px-3.5 pt-4.5 pb-3"
            style={{ animationDelay: `${120 + i * 80}ms` }}
          >
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 px-2 pb-2.5">
              <h2 className={`rounded-full px-3.5 py-0.5 text-sm font-black ${group.chip}`}>
                {group.label}
              </h2>
              <span className="text-sm font-bold text-muted">{group.hint}</span>
            </div>
            <ul className="flex flex-col gap-2">
              {group.items.map((a, index) => (
                <AssignmentRow
                  key={a.assignment_id}
                  assignment={a}
                  today={today}
                  index={index}
                  showDetails
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
