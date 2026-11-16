"use client";

import { useState } from "react";
import type { ClassItem } from "@/lib/data";
import EditClassDialog from "./edit-class-dialog";
import { PencilIcon } from "./icons";

// The class card is a server component; this is its one interactive bit.
export default function EditClassButton({
  classItem,
}: {
  classItem: Pick<
    ClassItem,
    | "class_id"
    | "class_name"
    | "class_code"
    | "instructor"
    | "semester"
    | "meeting_days"
    | "start_time"
    | "end_time"
    | "total"
  >;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit ${classItem.class_name}`}
        title="Edit or delete"
        className="flex size-12 flex-none cursor-pointer items-center justify-center rounded-full bg-surface text-ink-2 transition-colors hover:text-ink focus-visible:outline-3 focus-visible:outline-focus"
      >
        <PencilIcon className="size-4.5 stroke-[2.2]" />
      </button>
      {editing && (
        <EditClassDialog classItem={classItem} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
