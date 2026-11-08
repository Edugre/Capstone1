import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "@/components/icons";
import ProgressRing from "@/components/progress-ring";
import WeekPlanner from "@/components/week-planner";
import { getTracker, type ClassItem } from "@/lib/data";
import { formatDate, formatDue, greeting, plural } from "@/lib/format";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pt-7 pb-18 sm:px-6">
      <Suspense fallback={<HomeSkeleton />}>
        <Home />
      </Suspense>
    </main>
  );
}

async function Home() {
  const { today, weekEnd, hour, classes, assignments } = await getTracker();

  const open = assignments.filter((a) => !a.is_completed);
  const late = open.filter((a) => a.due_date < today).length;
  const dueToday = open.filter((a) => a.due_date === today).length;
  const upcoming = open.filter((a) => a.due_date <= weekEnd);
  const done = assignments.length - open.length;

  let summary = "Nothing urgent today. A good moment to get ahead.";
  if (dueToday && late) {
    summary = `You have ${plural(dueToday, "thing")} due today and ${late} to catch up on.`;
  } else if (dueToday) {
    summary = `You have ${plural(dueToday, "thing")} due today.`;
  } else if (late) {
    summary = `Nothing due today, and ${late} to catch up on when you're ready.`;
  }

  return (
    <>
      <section
        aria-label="Today"
        className="flex animate-rise flex-wrap items-center justify-between gap-7 rounded-[28px] bg-warm px-6 py-7 sm:px-9 sm:py-8"
      >
        <div className="flex flex-[1_1_26rem] flex-col gap-2.5">
          <p className="text-[15px] font-bold text-link-hover">
            {formatDate(today, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-[28px] leading-tight font-black tracking-tight sm:text-[42px]">
            {greeting(hour)} Let&apos;s take it one step at a time.
          </h1>
          <p className="max-w-xl text-[17px] text-ink-2">{summary}</p>
          <div className="flex items-center gap-3 sm:hidden">
            <ProgressRing done={done} total={assignments.length} size={64} color="var(--check)">
              <span className="text-sm font-black">
                {done}/{assignments.length}
              </span>
            </ProgressRing>
            <span className="text-[15px] font-bold text-ink-2">
              {done} of {assignments.length} assignments done
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2.5">
            <Link
              href="/assignments"
              className="lift flex min-h-12 items-center gap-2 rounded-full bg-accent px-5.5 text-[15px] font-extrabold text-on-accent"
            >
              <PlusIcon className="size-4.5 stroke-[2.6]" />
              Add assignment
            </Link>
            <Link
              href="/classes"
              className="lift flex min-h-12 items-center rounded-full bg-surface px-5.5 text-[15px] font-extrabold text-ink ring-1 ring-line-strong ring-inset"
            >
              Add class
            </Link>
          </div>
        </div>

        <div className="hidden flex-none items-center gap-7 sm:flex">
          <ProgressRing done={done} total={assignments.length} size={150} stroke={10} color="var(--check)">
            <span className="text-[34px] font-black">
              {done}
              <span className="text-lg text-muted">/{assignments.length}</span>
            </span>
            <span className="mt-1 text-[13px] font-bold text-ink-2">done</span>
          </ProgressRing>
          <Mug />
        </div>
      </section>

      {classes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <p className="font-extrabold">No classes yet</p>
          <p className="mt-1 text-ink-2">
            Add your first class on the{" "}
            <Link href="/classes" className="font-extrabold text-link">
              Classes page
            </Link>{" "}
            and it will show up here.
          </p>
        </div>
      ) : (
        <WeekPlanner assignments={upcoming} classes={classes} today={today}>
          <aside
            aria-labelledby="your-classes"
            className="flex min-w-0 flex-[1_1_20rem] animate-rise flex-col gap-3 [animation-delay:320ms]"
          >
            <div className="flex items-center justify-between gap-2 px-1 pt-1.5">
              <h2 id="your-classes" className="text-[22px] font-black">
                Your classes
              </h2>
              <Link
                href="/classes"
                className="text-[15px] font-extrabold text-link hover:text-link-hover"
              >
                Manage
              </Link>
            </div>
            {classes.map((c) => (
              <ClassTile key={c.class_id} c={c} today={today} />
            ))}
          </aside>
        </WeekPlanner>
      )}
    </>
  );
}

function ClassTile({ c, today }: { c: ClassItem; today: string }) {
  const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;

  return (
    <Link
      href="/classes"
      className="lift flex flex-col gap-2.5 rounded-[20px] px-4.5 py-4"
      style={{ backgroundColor: c.bg }}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex flex-col">
          <span className="text-[13px] font-extrabold" style={{ color: c.fg }}>
            {c.class_code}
          </span>
          <span className="text-[17px] leading-snug font-extrabold">{c.class_name}</span>
        </div>
        <span
          className="flex-none rounded-full bg-surface px-2.5 py-1 text-[13px] font-extrabold"
          style={{ color: c.fg }}
        >
          {c.open} open
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface/75">
        <div
          className="h-full animate-grow rounded-full"
          style={{ width: `${pct}%`, backgroundColor: c.fg, transformOrigin: "left" }}
        />
      </div>
      <span className="text-[13px] font-bold text-ink-2">
        Next: {c.nextDueDate ? formatDue(c.nextDueDate, today) : "nothing due"}
      </span>
    </Link>
  );
}

function Mug() {
  return (
    <svg width="120" height="130" viewBox="0 0 120 130" aria-hidden="true">
      <g className="hidden dark:block">
        <path d="M104 6a10 10 0 1 0 10 14 8 8 0 0 1-10-14z" fill="var(--today)" />
        {[
          [14, 14],
          [32, 4],
          [94, 34],
        ].map(([x, y], i) => (
          <path
            key={x}
            className="animate-twinkle"
            style={{ animationDelay: `${i * 0.8}s`, transformBox: "fill-box", transformOrigin: "center" }}
            d={`M${x} ${y - 4}l1.2 2.8 2.8 1.2-2.8 1.2L${x} ${y + 4}l-1.2-2.8-2.8-1.2 2.8-1.2z`}
            fill="var(--link-hover)"
          />
        ))}
      </g>
      {[46, 62, 78].map((x, i) => (
        <path
          key={x}
          className="animate-steam"
          style={{ animationDelay: `${i}s` }}
          d={`M${x} 34c-6-8 6-12 0-22`}
          fill="none"
          stroke="var(--steam)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <path d="M24 46h76v34a30 30 0 0 1-30 30H54a30 30 0 0 1-30-30z" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />
      <path d="M100 56h4a12 12 0 0 1 0 24h-6" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M36 70c8 6 26 6 36 0" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="62" cy="120" rx="44" ry="5" fill="var(--saucer)" />
    </svg>
  );
}

function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your home page" className="flex flex-col gap-6">
      <div className="h-64 animate-pulse rounded-[28px] bg-warm" />
      <div className="h-40 animate-pulse rounded-3xl bg-warm-2" />
      <div className="flex flex-wrap gap-6">
        <div className="h-96 flex-[999_1_35rem] animate-pulse rounded-3xl bg-warm-2" />
        <div className="h-96 flex-[1_1_20rem] animate-pulse rounded-3xl bg-warm-2" />
      </div>
    </div>
  );
}
