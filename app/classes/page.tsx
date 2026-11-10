import Link from "next/link";
import { Suspense } from "react";
import AddClassForm from "@/components/add-class-form";
import { AlertIcon, ArrowIcon, BookIcon, PlusIcon } from "@/components/icons";
import ScrollToHash from "@/components/scroll-to-hash";
import ProgressRing from "@/components/progress-ring";
import { getTracker, type ClassItem } from "@/lib/data";
import { formatDue, plural } from "@/lib/format";

export default function ClassesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5.5 px-4 pt-7 pb-18 sm:px-6">
      <Suspense fallback={<ClassesSkeleton />}>
        <Classes />
      </Suspense>
    </main>
  );
}

async function Classes() {
  const { today, classes, assignments } = await getTracker();

  const semesters = [
    ...new Set(classes.map((c) => c.semester).filter((s): s is string => !!s)),
  ];
  const done = assignments.filter((a) => a.is_completed).length;
  const summary = [
    ...semesters,
    plural(classes.length, "class", "classes"),
    `${done} of ${assignments.length} assignments done so far`,
  ].join(" · ");

  return (
    <>
      <div className="flex animate-rise flex-col gap-1.5">
        <h1 className="text-[40px] leading-tight font-black tracking-tight">
          Your classes
        </h1>
        <p className="text-[17px] text-ink-2">{summary}</p>
        {/* On phones the form sits below every class card; give a shortcut. */}
        <a
          href="#add-class"
          className="mt-2 flex min-h-11 items-center gap-2 self-start rounded-full bg-accent px-5 text-[15px] font-extrabold text-on-accent sm:hidden"
        >
          <PlusIcon className="size-4.5 stroke-[2.6]" />
          Add class
        </a>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-label="Classes" className="min-w-0 flex-[999_1_37rem]">
          {classes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line-strong bg-surface p-8 text-center">
              <p className="font-extrabold">No classes yet</p>
              <p className="mt-1 text-ink-2">Add your first class with the form.</p>
            </div>
          ) : (
            <ul className="flex flex-wrap gap-4.5">
              {classes.map((c, i) => (
                <ClassCard key={c.class_id} c={c} today={today} index={i} />
              ))}
            </ul>
          )}
        </section>

        <aside
          aria-labelledby="add-class"
          className="min-w-0 flex-[1_1_20rem] animate-rise rounded-[26px] border border-line bg-surface p-6 [animation-delay:200ms]"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-link-hover">
              <BookIcon className="size-5" />
            </span>
            <h2 id="add-class" className="scroll-mt-6 text-[22px] font-black">
              Add a class
            </h2>
          </div>
          <ScrollToHash id="add-class" />
          <AddClassForm defaultSemester={semesters.at(-1)} />
        </aside>
      </div>
    </>
  );
}

function ClassCard({
  c,
  today,
  index,
}: {
  c: ClassItem;
  today: string;
  index: number;
}) {
  return (
    <li
      className="lift flex min-w-0 flex-[1_1_20rem] animate-rise flex-col gap-4 rounded-[26px] px-5.5 pt-5.5 pb-5"
      style={{ backgroundColor: c.bg, animationDelay: `${80 + index * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-3.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span
            className="self-start rounded-full bg-surface px-3 py-0.5 text-[13px] font-black"
            style={{ color: c.fg }}
          >
            {c.class_code}
          </span>
          <h2 className="mt-2 text-[22px] leading-tight font-black">{c.class_name}</h2>
          {c.instructor && (
            <span className="text-[15px] font-bold text-ink-2">{c.instructor}</span>
          )}
        </div>
        <ProgressRing done={c.done} total={c.total} size={72} color={c.fg}>
          <span className="text-[15px] font-black">
            {c.done}/{c.total}
          </span>
        </ProgressRing>
      </div>

      <dl className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col rounded-2xl bg-surface/80 px-3.5 py-2.5">
          <dt className="text-[13px] font-bold text-ink-2">Still to do</dt>
          <dd className="text-2xl leading-tight font-black">{c.open}</dd>
        </div>
        <div className="flex flex-col rounded-2xl bg-surface/80 px-3.5 py-2.5">
          <dt className="text-[13px] font-bold text-ink-2">Next up</dt>
          <dd className="text-[17px] leading-relaxed font-black">
            {c.nextDueDate ? formatDue(c.nextDueDate, today) : "Nothing due"}
          </dd>
        </div>
      </dl>

      {c.overdue > 0 && (
        <p className="flex items-center gap-2 rounded-2xl bg-surface px-3.5 py-2.5 text-sm font-extrabold text-late">
          <AlertIcon className="size-4 stroke-[2.4]" />
          {plural(c.overdue, "assignment")} to catch up on
        </p>
      )}

      <Link
        href="/assignments"
        className="mt-auto flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-surface text-[15px] font-extrabold text-ink"
      >
        See assignments
        <ArrowIcon className="size-4 stroke-[2.6]" />
      </Link>
    </li>
  );
}

function ClassesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading classes" className="flex flex-col gap-6">
      <div className="h-20 w-full max-w-80 animate-pulse rounded-2xl bg-warm-2" />
      <div className="flex flex-wrap gap-6">
        <div className="h-[28rem] flex-[999_1_37rem] animate-pulse rounded-3xl bg-warm-2" />
        <div className="h-[28rem] flex-[1_1_20rem] animate-pulse rounded-3xl bg-warm-2" />
      </div>
    </div>
  );
}
