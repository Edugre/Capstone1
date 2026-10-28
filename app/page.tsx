import Link from "next/link";
import { Suspense } from "react";
import { getClassSummaries, type ClassSummary } from "@/lib/data";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Open work for each of your classes.
      </p>

      <Suspense fallback={<ClassCardsSkeleton />}>
        <ClassCards />
      </Suspense>
    </main>
  );
}

async function ClassCards() {
  const classes = await getClassSummaries();

  if (classes.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">
          No classes yet
        </p>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Add your first class on the{" "}
          <Link
            href="/classes"
            className="font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
          >
            Classes page
          </Link>{" "}
          and it will show up here.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((c) => (
        <li key={c.class_id}>
          <ClassCard summary={c} />
        </li>
      ))}
    </ul>
  );
}

function ClassCard({ summary }: { summary: ClassSummary }) {
  const { class_name, class_code, openCount, nextDueDate } = summary;

  return (
    <article className="h-full rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {class_name}
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{class_code}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600 dark:text-zinc-400">Open assignments</dt>
          <dd className="font-semibold text-zinc-900 dark:text-zinc-50">
            {openCount}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600 dark:text-zinc-400">Next due</dt>
          <dd className="font-semibold text-zinc-900 dark:text-zinc-50">
            {nextDueDate ? formatDueDate(nextDueDate) : "No upcoming work"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function ClassCardsSkeleton() {
  return (
    <ul
      className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading classes"
    >
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="h-36 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </ul>
  );
}

// due_date is a plain YYYY-MM-DD date; build it in local time so it
// doesn't shift a day when parsed as UTC.
function formatDueDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
