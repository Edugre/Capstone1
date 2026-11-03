import { Suspense } from "react";
import AddAssignmentForm from "@/components/add-assignment-form";
import AssignmentList from "@/components/assignment-list";
import { getTracker } from "@/lib/data";

export default function AssignmentsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Suspense fallback={<AssignmentsSkeleton />}>
        <Assignments />
      </Suspense>
    </main>
  );
}

async function Assignments() {
  const { today, weekEnd, classes, assignments } = await getTracker();

  const open = assignments.filter((a) => !a.is_completed);
  const overdue = open.filter((a) => a.due_date < today).length;
  const done = assignments.length - open.length;

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted">
          {open.length} open · {overdue} overdue · {done} completed
        </p>
        <h1 className="font-display text-[34px] leading-tight font-extrabold tracking-tight">
          Assignments
        </h1>
      </div>

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
          className="min-w-0 flex-[1_1_20rem] rounded-2xl border border-line bg-surface p-5.5"
        >
          <h2
            id="add-assignment"
            className="mb-4 font-display text-xl font-extrabold"
          >
            Add assignment
          </h2>
          <AddAssignmentForm classes={classes} />
        </aside>
      </div>
    </>
  );
}

function AssignmentsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading assignments" className="flex flex-col gap-6">
      <div className="h-16 w-72 animate-pulse rounded-lg bg-sunken" />
      <div className="flex flex-wrap gap-6">
        <div className="h-[32rem] flex-[999_1_37rem] animate-pulse rounded-2xl bg-sunken" />
        <div className="h-[32rem] flex-[1_1_20rem] animate-pulse rounded-2xl bg-sunken" />
      </div>
    </div>
  );
}
