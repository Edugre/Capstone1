"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { flushSync } from "react-dom";
import { deleteAssignment, updateAssignment, type FormState } from "@/lib/actions";
import type { AssignmentItem, ClassOption } from "@/lib/data";
import { plural } from "@/lib/format";
import AssignmentFields from "./assignment-fields";
import { FormMessage, SubmitButton } from "./form-fields";
import { CloseIcon, PencilIcon, TrashIcon } from "./icons";
import { useToast } from "./toast";

const secondaryButton =
  "lift min-h-13 flex-[1_1_8rem] cursor-pointer rounded-full bg-surface px-5 text-base font-extrabold text-ink ring-1 ring-line-strong ring-inset disabled:cursor-default disabled:opacity-70";

// Mounted only while editing; opens as a native modal so focus, Esc, and the
// backdrop are handled by the browser. Delete lives here too, behind a
// confirmation step, so it's hard to hit by accident.
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
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const keepButtonRef = useRef<HTMLButtonElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();
  const [deleting, startDelete] = useTransition();

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

  // Move focus with the view so keyboard users land on the safe choice.
  function askToDelete() {
    flushSync(() => setConfirming(true));
    keepButtonRef.current?.focus();
  }
  function keepIt() {
    flushSync(() => {
      setConfirming(false);
      setDeleteError(undefined);
    });
    deleteButtonRef.current?.focus();
  }
  function confirmDelete() {
    startDelete(async () => {
      const result = await deleteAssignment(a.assignment_id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      close();
      toast(`Deleted ${a.title}.`);
    });
  }

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
          <span
            className={`flex size-10 flex-none items-center justify-center rounded-xl ${
              confirming ? "bg-late-soft text-late" : "bg-accent-soft text-link-hover"
            }`}
          >
            {confirming ? (
              <TrashIcon className="size-5 stroke-[2.2]" />
            ) : (
              <PencilIcon className="size-5 stroke-[2.2]" />
            )}
          </span>
          <h2 id={`edit-${a.assignment_id}`} className="flex-1 text-[22px] font-black">
            {confirming ? "Delete assignment?" : "Edit assignment"}
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
            reset the fields — a failed save keeps what you typed. It stays
            mounted (just hidden) while confirming a delete, so "Keep it"
            brings back any edits. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(() => formAction(formData));
          }}
          className={`${confirming ? "hidden" : "flex"} flex-col gap-4`}
        >
          <input type="hidden" name="assignmentId" value={a.assignment_id} />
          <AssignmentFields classes={classes} defaults={a} />
          <FormMessage state={state} success="Saved!" />
          <div className="flex flex-wrap-reverse gap-2.5">
            <button
              type="button"
              onClick={close}
              className={secondaryButton}
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
          <div className="border-t border-line pt-2">
            <button
              ref={deleteButtonRef}
              type="button"
              onClick={askToDelete}
              className="-ml-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-extrabold text-late transition-colors hover:bg-late-soft"
            >
              <TrashIcon className="size-4.5 stroke-[2.2]" />
              Delete assignment
            </button>
          </div>
        </form>

        {confirming && (
          <div className="flex animate-fade flex-col gap-4">
            <p className="text-[17px] text-ink-2">
              <span className="font-extrabold text-ink">{a.title}</span>
              {a.steps.length > 0 && ` and its ${plural(a.steps.length, "step")}`} will
              be removed for good. This can&apos;t be undone.
            </p>
            {deleteError && (
              <p role="alert" className="text-sm font-bold text-late">
                {deleteError}
              </p>
            )}
            <div className="flex flex-wrap-reverse gap-2.5">
              <button
                ref={keepButtonRef}
                type="button"
                onClick={keepIt}
                disabled={deleting}
                className={secondaryButton}
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="lift min-h-13 flex-[2_1_10rem] cursor-pointer rounded-full bg-late px-5 text-base font-black text-canvas disabled:cursor-default disabled:opacity-70"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
