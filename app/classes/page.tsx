import Link from "next/link";
import { Suspense } from "react";
import AddClassForm from "@/components/add-class-form";
import { AlertIcon } from "@/components/icons";
import { getTracker, type ClassItem } from "@/lib/data";
import { formatDue } from "@/lib/format";

export default function ClassesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Suspense fallback={<ClassesSkeleton />}>
        <Classes />
      </Suspense>
    </main>
  );
}

async function Classes() {
  const { today, classes } = await getTracker();

  const semesters = [
    ...new Set(classes.map((c) => c.semester).filter((s): s is string => !!s)),
  ];
  const count = `${classes.length} ${classes.length === 1 ? "class" : "classes"}`;

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted">
          {semesters.length > 0 ? `${semesters.join(", ")} · ${count}` : count}
        </p>
        <h1 className="font-display text-[34px] leading-tight font-extrabold tracking-tight">
          Classes
        </h1>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-label="Your classes" className="min-w-0 flex-[999_1_37rem]">
          {classes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
              <p className="font-semibold">No classes yet</p>
              <p className="mt-1 text-muted">
                Add your first class with the form.
              </p>
            </div>
          ) : (
            <ul className="flex flex-wrap gap-4">
              {classes.map((c) => (
                <ClassCard key={c.class_id} c={c} today={today} />
              ))}
            </ul>
          )}
        </section>

        <aside
          aria-labelledby="add-class"
          className="min-w-0 flex-[1_1_20rem] rounded-2xl border border-line bg-surface p-5.5"
        >
          <h2 id="add-class" className="mb-4 font-display text-xl font-extrabold">
            Add a class
          </h2>
          <AddClassForm defaultSemester={semesters.at(-1)} />
        </aside>
      </div>
    </>
  );
}

function ClassCard({ c, today }: { c: ClassItem; today: string }) {
  const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;

  return (
    <li className="flex min-w-0 flex-[1_1_21rem] flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="h-1.5" style={{ backgroundColor: c.color }} />
      <div className="flex flex-1 flex-col gap-3.5 px-5 pt-4.5 pb-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-muted">{c.class_code}</span>
          <h2 className="font-display text-[19px] leading-snug font-extrabold">
            {c.class_name}
          </h2>
          {c.instructor && <span className="text-sm text-ink-2">{c.instructor}</span>}
        </div>

        <dl className="flex gap-2">
          <div className="flex flex-1 flex-col rounded-lg bg-canvas px-3 py-2.5">
            <dt className="text-xs font-medium text-muted">Open</dt>
            <dd className="font-display text-xl font-extrabold">{c.open}</dd>
          </div>
          <div className="flex flex-1 flex-col rounded-lg bg-canvas px-3 py-2.5">
            <dt className="text-xs font-medium text-muted">Done</dt>
            <dd className="font-display text-xl font-extrabold">{c.done}</dd>
          </div>
          <div className="flex flex-[1.4] flex-col rounded-lg bg-canvas px-3 py-2.5">
            <dt className="text-xs font-medium text-muted">Next due</dt>
            <dd
              className={`text-[15px] leading-[1.9] font-bold ${c.nextDueDate === today ? "text-accent" : ""}`}
            >
              {c.nextDueDate ? formatDue(c.nextDueDate, today) : "Nothing due"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-muted">
            <span>Progress</span>
            <span className="font-semibold text-ink-2">
              {c.done} of {c.total}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-sunken">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: c.color }}
            />
          </div>
        </div>

        {c.overdue > 0 && (
          <p className="flex items-center gap-2 rounded-lg bg-late-soft px-3 py-2 text-[13px] font-semibold text-late">
            <AlertIcon className="size-4" />
            {c.overdue} overdue
          </p>
        )}

        <Link
          href="/assignments"
          className="mt-auto flex min-h-11 items-center justify-center rounded-lg border border-line-strong text-sm font-semibold text-ink hover:bg-sunken"
        >
          View assignments
        </Link>
      </div>
    </li>
  );
}

function ClassesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading classes" className="flex flex-col gap-6">
      <div className="h-16 w-56 animate-pulse rounded-lg bg-sunken" />
      <div className="flex flex-wrap gap-6">
        <div className="h-[28rem] flex-[999_1_37rem] animate-pulse rounded-2xl bg-sunken" />
        <div className="h-[28rem] flex-[1_1_20rem] animate-pulse rounded-2xl bg-sunken" />
      </div>
    </div>
  );
}
