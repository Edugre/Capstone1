import Link from "next/link";
import { Suspense } from "react";
import AssignmentRow from "@/components/assignment-row";
import { PlusIcon } from "@/components/icons";
import { getTracker, type ClassItem } from "@/lib/data";
import { formatDate, formatDue } from "@/lib/format";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-7 px-4 py-8 sm:px-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </main>
  );
}

async function Dashboard() {
  const { today, weekEnd, classes, assignments } = await getTracker();

  const open = assignments.filter((a) => !a.is_completed);
  const overdue = open.filter((a) => a.due_date < today);
  const dueToday = open.filter((a) => a.due_date === today);
  const laterThisWeek = open.filter(
    (a) => a.due_date > today && a.due_date <= weekEnd,
  );
  const done = assignments.length - open.length;
  const donePct = assignments.length
    ? Math.round((done / assignments.length) * 100)
    : 0;

  const groups = [
    { label: "Overdue", tone: "text-late", items: overdue },
    { label: "Today", tone: "text-accent", items: dueToday },
    { label: "This week", tone: "text-muted", items: laterThisWeek },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted">
            {formatDate(today, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-display text-[34px] leading-tight font-extrabold tracking-tight">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/classes"
            className="flex min-h-11 items-center rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-ink hover:bg-sunken"
          >
            Add class
          </Link>
          <Link
            href="/assignments"
            className="flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4.5 text-sm font-semibold text-on-accent hover:bg-accent-hover"
          >
            <PlusIcon className="size-4 stroke-[2.4]" />
            Add assignment
          </Link>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <p className="font-semibold">No classes yet</p>
          <p className="mt-1 text-muted">
            Add your first class on the{" "}
            <Link href="/classes" className="font-semibold text-accent">
              Classes page
            </Link>{" "}
            and it will show up here.
          </p>
        </div>
      ) : (
        <>
          <section aria-label="Summary" className="flex flex-wrap gap-4">
            <Stat
              label="Open assignments"
              value={open.length}
              note={`Across ${classes.length} ${classes.length === 1 ? "class" : "classes"}`}
            />
            <Stat
              label="Due this week"
              value={dueToday.length + laterThisWeek.length}
              note={`${formatDate(today, { month: "short", day: "numeric" })} – ${formatDate(weekEnd, { month: "short", day: "numeric" })}`}
            />
            {overdue.length > 0 ? (
              <div className="flex flex-[1_1_12rem] flex-col gap-1 rounded-2xl border border-late-line bg-late-soft px-5 py-4.5 text-late">
                <span className="text-[13px] font-semibold">Overdue</span>
                <span className="font-display text-[32px] leading-tight font-extrabold">
                  {overdue.length}
                </span>
                <span className="text-[13px]">Catch up on these first</span>
              </div>
            ) : (
              <Stat label="Overdue" value={0} note="You're all caught up" />
            )}
            <div className="flex flex-[1_1_12rem] flex-col gap-2 rounded-2xl border border-line bg-surface px-5 py-4.5">
              <span className="text-[13px] font-medium text-muted">Completed</span>
              <span className="font-display text-[32px] leading-tight font-extrabold">
                {done}{" "}
                <span className="text-base font-semibold text-muted">
                  of {assignments.length}
                </span>
              </span>
              <div
                role="progressbar"
                aria-label="Assignments completed"
                aria-valuenow={donePct}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-1.5 overflow-hidden rounded-full bg-sunken"
              >
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${donePct}%` }}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-start gap-6">
            <section
              aria-labelledby="up-next"
              className="min-w-0 flex-[999_1_35rem] overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-5 pb-3">
                <h2 id="up-next" className="font-display text-xl font-extrabold">
                  Up next
                </h2>
                <Link
                  href="/assignments"
                  className="text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  View all assignments
                </Link>
              </div>
              {groups.length === 0 ? (
                <p className="border-t border-divider px-6 py-6 text-muted">
                  Nothing due in the next 7 days.
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center gap-2 border-t border-divider px-6 pt-2.5 pb-1.5">
                      <h3
                        className={`text-xs font-bold tracking-wider uppercase ${group.tone}`}
                      >
                        {group.label}
                      </h3>
                      <span className="text-xs font-semibold text-muted">
                        {group.items.length}
                      </span>
                    </div>
                    <ul className="px-3 pb-2">
                      {group.items.map((a) => (
                        <AssignmentRow
                          key={a.assignment_id}
                          assignment={a}
                          today={today}
                        />
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </section>

            <aside
              aria-labelledby="your-classes"
              className="min-w-0 flex-[1_1_20rem] rounded-2xl border border-line bg-surface px-5 pt-5 pb-3"
            >
              <div className="flex items-center justify-between gap-2 px-1 pb-2">
                <h2 id="your-classes" className="font-display text-xl font-extrabold">
                  Your classes
                </h2>
                <Link
                  href="/classes"
                  className="text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  Manage
                </Link>
              </div>
              <ul>
                {classes.map((c) => (
                  <ClassSummary key={c.class_id} c={c} today={today} />
                ))}
              </ul>
            </aside>
          </div>
        </>
      )}
    </>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className="flex flex-[1_1_12rem] flex-col gap-1 rounded-2xl border border-line bg-surface px-5 py-4.5">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <span className="font-display text-[32px] leading-tight font-extrabold">
        {value}
      </span>
      <span className="text-[13px] text-muted">{note}</span>
    </div>
  );
}

function ClassSummary({ c, today }: { c: ClassItem; today: string }) {
  const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;

  return (
    <li className="flex flex-col gap-2 border-t border-divider px-1 py-3.5">
      <div className="flex items-start gap-2.5">
        <span
          className="mt-1.5 size-2.5 flex-none rounded-[3px]"
          style={{ backgroundColor: c.color }}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold">{c.class_name}</span>
          <span className="text-[13px] text-muted">
            {c.class_code}
            {c.instructor && ` · ${c.instructor}`}
          </span>
        </div>
        <span className="text-[13px] font-semibold whitespace-nowrap text-ink-2">
          {c.open} open
        </span>
      </div>
      <div className="flex items-center gap-2.5 pl-5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: c.color }}
          />
        </div>
        <span className="text-xs whitespace-nowrap text-muted">
          Next:{" "}
          <span className="font-semibold text-ink">
            {c.nextDueDate ? formatDue(c.nextDueDate, today) : "Nothing due"}
          </span>
        </span>
      </div>
    </li>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="flex flex-col gap-7">
      <div className="h-16 w-64 animate-pulse rounded-lg bg-sunken" />
      <div className="flex flex-wrap gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 flex-[1_1_12rem] animate-pulse rounded-2xl bg-sunken" />
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="h-96 flex-[999_1_35rem] animate-pulse rounded-2xl bg-sunken" />
        <div className="h-96 flex-[1_1_20rem] animate-pulse rounded-2xl bg-sunken" />
      </div>
    </div>
  );
}
