"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { updateAssignment, type FormState } from "@/lib/actions";
import type { AssignmentItem, ClassOption } from "@/lib/data";
import AssignmentFields from "./assignment-fields";
import { FormMessage, SubmitButton } from "./form-fields";
import { CloseIcon, PencilIcon } from "./icons";
import { useToast } from "./toast";

// Mounted only while editing; opens as a native modal so focus, Esc, and the
// backdrop are handled by the browser.
export default function EditAssignmentDialog({
  assignment: a,
  classes,
  onClose,
}: {
  assignment: AssignmentItem;
  classes: ClassOption[];
  onClose: () => void;
}) {
  const toast = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);

  // close() hands focus back to the Edit button; unmounting right away (not
  // on the async "close" event) means a quick re-open always gets a fresh
  // dialog. Esc is routed here via "cancel"; "close" remains as a fallback.
  function close() {
    dialogRef.current?.close();
    onClose();
  }

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await updateAssignment(prev, formData);
      if (result.ok) {
        close();
        toast(`Saved changes to ${formData.get("title")}.`);
      }
      return result;
    },
    {},
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input[name="title"]')?.focus();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`edit-${a.assignment_id}`}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClose={onClose}
      // The dialog element itself (not its content) is the backdrop. Require
      // the press to start there too, so dragging a text selection out of a
      // field doesn't close the form.
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100%-2rem))] animate-rise overflow-y-auto rounded-3xl border border-line bg-surface p-0 text-ink shadow-[0_24px_60px_rgb(60_35_15/0.25)] backdrop:animate-fade backdrop:bg-[rgb(35_22_14/0.45)] backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-accent-soft text-link-hover">
            <PencilIcon className="size-5 stroke-[2.2]" />
          </span>
          <h2 id={`edit-${a.assignment_id}`} className="flex-1 text-[22px] font-black">
            Edit assignment
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-warm-2 hover:text-ink"
          >
            <CloseIcon className="size-5 stroke-[2.4]" />
          </button>
        </div>

        {/* Submitted by hand rather than via the action prop so React doesn't
            reset the fields — a failed save keeps what you typed. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(() => formAction(formData));
          }}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="assignmentId" value={a.assignment_id} />
          <AssignmentFields classes={classes} defaults={a} />
          <FormMessage state={state} success="Saved!" />
          <div className="flex flex-wrap-reverse gap-2.5">
            <button
              type="button"
              onClick={close}
              className="lift min-h-13 flex-[1_1_8rem] cursor-pointer rounded-full bg-surface px-5 text-base font-extrabold text-ink ring-1 ring-line-strong ring-inset"
            >
              Cancel
            </button>
            <SubmitButton
              pending={pending}
              label="Save changes"
              pendingLabel="Saving…"
              className="flex-[2_1_10rem]"
            />
          </div>
        </form>
      </div>
    </dialog>
  );
}
