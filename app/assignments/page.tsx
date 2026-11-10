import { Suspense } from "react";
import AddAssignmentForm from "@/components/add-assignment-form";
import AssignmentList from "@/components/assignment-list";
import ScrollToHash from "@/components/scroll-to-hash";
import { PlusIcon } from "@/components/icons";
import { getTracker } from "@/lib/data";

export default function AssignmentsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5.5 px-4 pt-7 pb-18 sm:px-6">
      <div className="flex animate-rise flex-col gap-1.5">
        <h1 className="text-[40px] leading-tight font-black tracking-tight">
          Assignments
        </h1>
        <Suspense fallback={<p className="h-7" />}>
          <Summary />
        </Suspense>
        {/* On phones the form sits below the whole list; give a shortcut. */}
        <a
          href="#add-assignment"
          className="mt-2 flex min-h-11 items-center gap-2 self-start rounded-full bg-accent px-5 text-[15px] font-extrabold text-on-accent sm:hidden"
        >
          <PlusIcon className="size-4.5 stroke-[2.6]" />
          Add assignment
        </a>
      </div>
      <Suspense fallback={<AssignmentsSkeleton />}>
        <Assignments />
      </Suspense>
    </main>
  );
}

async function Summary() {
  const { today, assignments } = await getTracker();

  const open = assignments.filter((a) => !a.is_completed);
  const late = open.filter((a) => a.due_date < today).length;
  const done = assignments.length - open.length;

  return (
    <p className="text-[17px] text-ink-2">
      {open.length} to do, {late} to catch up on, {done} done. You&apos;ve got this.
    </p>
  );
}

async function Assignments() {
  const { today, weekEnd, classes, assignments } = await getTracker();

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="min-w-0 flex-[999_1_37rem]">
        <AssignmentList
          assignments={assignments}
          classes={classes}
          today={today}
          weekEnd={weekEnd}
        />
      </div>

      <aside
        aria-labelledby="add-assignment"
        className="min-w-0 flex-[1_1_20rem] animate-rise rounded-3xl border border-line bg-surface p-6 [animation-delay:160ms]"
      >
        <h2 id="add-assignment" className="mb-4 scroll-mt-6 text-[22px] font-black">
          Add something new
        </h2>
        <ScrollToHash id="add-assignment" />
        <AddAssignmentForm classes={classes} />
      </aside>
    </div>
  );
}

function AssignmentsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading assignments" className="flex flex-wrap gap-6">
      <div className="h-[32rem] flex-[999_1_37rem] animate-pulse rounded-3xl bg-warm-2" />
      <div className="h-[32rem] flex-[1_1_20rem] animate-pulse rounded-3xl bg-warm-2" />
    </div>
  );
}
