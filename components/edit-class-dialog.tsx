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
import { deleteClass, updateClass, type FormState } from "@/lib/actions";
import type { ClassItem } from "@/lib/data";
import { plural } from "@/lib/format";
import ClassFields from "./class-fields";
import { FormMessage, SubmitButton } from "./form-fields";
import { CloseIcon, PencilIcon, TrashIcon } from "./icons";
import { useToast } from "./toast";

const secondaryButton =
  "lift min-h-13 flex-[1_1_8rem] cursor-pointer rounded-full bg-surface px-5 text-base font-extrabold text-ink ring-1 ring-line-strong ring-inset disabled:cursor-default disabled:opacity-70";

type EditableClass = Pick<
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

// Same shape as EditAssignmentDialog: a native modal, mounted only while
// editing, with delete behind a confirmation step.
export default function EditClassDialog({
  classItem: c,
  onClose,
}: {
  classItem: EditableClass;
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

  function close() {
    dialogRef.current?.close();
    onClose();
  }

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await updateClass(prev, formData);
      if (result.ok) {
        close();
        toast(`Saved changes to ${formData.get("className")}.`);
      }
      return result;
    },
    {},
  );

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
      const result = await deleteClass(c.class_id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      close();
      toast(`Deleted ${c.class_name}.`);
    });
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input[name="className"]')?.focus();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`edit-class-${c.class_id}`}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClose={onClose}
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100%-2rem))] animate-rise overflow-y-auto rounded-3xl border border-line bg-surface p-0 text-ink shadow-dialog backdrop:animate-fade backdrop:bg-backdrop backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2.5">
          {confirming ? (
            <TrashIcon className="size-5.5 flex-none stroke-[2.2] text-late" />
          ) : (
            <PencilIcon className="size-5.5 flex-none stroke-[2.2] text-link-hover" />
          )}
          <h2 id={`edit-class-${c.class_id}`} className="flex-1 text-[22px] font-black">
            {confirming ? "Delete class?" : "Edit class"}
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

        {/* Submitted by hand so a failed save keeps what you typed. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(() => formAction(formData));
          }}
          className={`${confirming ? "hidden" : "flex"} flex-col gap-4`}
        >
          <input type="hidden" name="classId" value={c.class_id} />
          <ClassFields defaults={c} />
          <FormMessage state={state} success="Saved!" />
          <div className="flex flex-wrap-reverse gap-2.5">
            <button type="button" onClick={close} className={secondaryButton}>
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
              Delete class
            </button>
          </div>
        </form>

        {confirming && (
          <div className="flex animate-fade flex-col gap-4">
            <p className="text-[17px] text-ink-2">
              <span className="font-extrabold text-ink">{c.class_name}</span>
              {c.total > 0 &&
                ` and its ${plural(c.total, "assignment")} (with their steps)`}{" "}
              will be removed for good. This can&apos;t be undone.
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
