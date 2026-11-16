"use client";

import Link from "next/link";
import { useState } from "react";
import type { AssignmentItem, ClassOption } from "@/lib/data";
import { addDays, formatDate, plural } from "@/lib/format";
import AssignmentRow from "./assignment-row";
import { LeafIcon } from "./icons";

export default function WeekPlanner({
  assignments,
  classes,
  today,
  children,
}: {
  /** Open assignments that are overdue or due within the next 7 days. */
  assignments: AssignmentItem[];
  classes: ClassOption[];
  today: string;
  children: React.ReactNode;
}) {
  const [day, setDay] = useState<string | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const dueOnDay = assignments.filter((a) => a.due_date === day);

  const groups = day
    ? [
        {
          label: day === today ? "Today" : "Due",
          hint: plural(dueOnDay.length, "thing"),
          items: dueOnDay,
        },
      ]
    : [
        {
          label: "Catch up",
          hint: "A little behind, no stress",
          items: assignments.filter((a) => a.due_date < today),
        },
        {
          label: "Today",
          hint: "Due before midnight",
          items: assignments.filter((a) => a.due_date === today),
        },
        {
          label: "Coming up",
          hint: "Later this week",
          items: assignments.filter((a) => a.due_date > today),
        },
      ];
  const visible = groups.filter((g) => g.items.length > 0);

  return (
    <>
      <section
        aria-labelledby="your-week"
        className="animate-rise rounded-3xl border border-line bg-surface px-4 py-5.5 sm:px-6 [animation-delay:120ms]"
      >
        <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="your-week" className="text-[22px] font-black">
            Your week
          </h2>
          <span className="text-sm text-muted">Tap a day to see what&apos;s due</span>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2.5">
          {days.map((date) => {
            const due = assignments.filter((a) => a.due_date === date);
            const selected = day === date;
            const isToday = date === today;
            const weekday = formatDate(date, { weekday: "short" });
            return (
              <button
                key={date}
                type="button"
                aria-pressed={selected}
                aria-label={`${isToday ? "Today" : formatDate(date, { weekday: "long", month: "long", day: "numeric" })}, ${due.length ? `${due.length} due` : "nothing due"}`}
                onClick={() => setDay(selected ? null : date)}
                className={`flex min-h-24 cursor-pointer flex-col items-center gap-1 rounded-[18px] px-0.5 py-3 transition-[background-color,transform,box-shadow] duration-250 hover:-translate-y-0.5 ${
                  selected
                    ? "bg-ink text-canvas shadow-selected"
                    : isToday
                      ? "bg-accent-soft"
                      : "bg-canvas"
                }`}
              >
                <span className="text-xs font-extrabold opacity-85 sm:text-[13px]">
                  {/* Phones are too narrow for "Today"; the tint and the label say it. */}
                  {isToday ? (
                    <>
                      <span className="sm:hidden">{weekday}</span>
                      <span className="hidden sm:inline">Today</span>
                    </>
                  ) : (
                    weekday
                  )}
                </span>
                <span className="text-xl leading-tight font-black sm:text-[26px]">
                  {Number(date.slice(8))}
                </span>
                <span className="flex min-h-2.5 items-center gap-1">
                  {due.slice(0, 3).map((a) => (
                    <span
                      key={a.assignment_id}
                      className="size-2 rounded-full"
                      style={{ backgroundColor: a.fg }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section
          aria-labelledby="up-next"
          className="min-w-0 flex-[999_1_35rem] animate-rise pt-1.5 [animation-delay:220ms]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1.5">
            <h2 id="up-next" className="text-[22px] font-black">
              {day
                ? formatDate(day, { weekday: "long", month: "long", day: "numeric" })
                : "Up next"}
            </h2>
            {day ? (
              <button
                type="button"
                onClick={() => setDay(null)}
                className="min-h-11 cursor-pointer rounded-full bg-warm-2 px-3.5 text-sm font-extrabold text-link-hover"
              >
                Show whole week
              </button>
            ) : (
              <Link
                href="/assignments"
                className="text-[15px] font-extrabold text-link hover:text-link-hover"
              >
                See all
              </Link>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="m-2 flex animate-fade flex-col items-center gap-1.5 rounded-[18px] bg-done-card px-5 py-8 text-center">
              <LeafIcon className="size-10 stroke-[1.8] text-done" />
              <p className="text-[17px] font-extrabold">Nothing due. Enjoy it</p>
              <p className="text-[15px] text-ink-2">
                {day
                  ? "A free day is a good day to get ahead or rest."
                  : "Nothing due in the next 7 days."}
              </p>
            </div>
          ) : (
            visible.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 px-2 pt-3 pb-1.5">
                  <h3 className="text-[15px] font-black">
                    {group.label}
                  </h3>
                  <span className="text-[13px] font-bold text-muted">{group.hint}</span>
                </div>
                <ul className="flex flex-col gap-2">
                  {group.items.map((a, i) => (
                    <AssignmentRow
                      key={a.assignment_id}
                      assignment={a}
                      classes={classes}
                      today={today}
                      index={i}
                      showDetails
                    />
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
        {children}
      </div>
    </>
  );
}
