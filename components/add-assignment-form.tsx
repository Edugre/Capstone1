"use client";

import Link from "next/link";
import { startTransition, useActionState, useRef, useState } from "react";
import { addAssignment, type FormState } from "@/lib/actions";
import type { ClassOption } from "@/lib/data";
import AssignmentFields from "./assignment-fields";
import { FormMessage, SubmitButton, fieldClass } from "./form-fields";
import { CloseIcon, PlusIcon } from "./icons";

type DraftStep = { id: number; title: string };

export default function AddAssignmentForm({
  classes,
}: {
  classes: ClassOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const nextId = useRef(0);
  const [steps, setSteps] = useState<DraftStep[]>([]);
  const [stepText, setStepText] = useState("");

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await addAssignment(prev, formData);
      if (result.ok) {
        formRef.current?.reset();
        setSteps([]);
        setStepText("");
      }
      return result;
    },
    {},
  );

  function addStep() {
    const title = stepText.trim();
    if (!title) return;
    setSteps((previous) => [...previous, { id: nextId.current++, title }]);
    setStepText("");
  }

  if (classes.length === 0) {
    return (
      <p className="text-ink-2">
        Add a class on the{" "}
        <Link href="/classes" className="font-extrabold text-link">
          Classes page
        </Link>{" "}
        first.
      </p>
    );
  }

  return (
    // Submitted by hand so React doesn't clear the fields when a save fails;
    // the form is reset only after a successful add.
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // A step typed but not added yet still counts.
        if (stepText.trim()) formData.append("steps", stepText.trim());
        startTransition(() => formAction(formData));
      }}
      className="flex flex-col gap-4"
    >
      <AssignmentFields classes={classes} />

      <fieldset className="flex flex-col gap-1.5">
        <legend className="pb-1.5 text-sm font-extrabold text-ink-2">
          Steps{" "}
          <span className="font-semibold text-muted">
            Optional — break it into smaller pieces
          </span>
        </legend>
        <div className="flex gap-2">
          <input
            type="text"
            value={stepText}
            onChange={(e) => setStepText(e.target.value)}
            onKeyDown={(e) => {
              // Enter adds the step instead of submitting the whole form.
              if (e.key === "Enter") {
                e.preventDefault();
                addStep();
              }
            }}
            placeholder="e.g. Outline"
            aria-label="New step"
            className={`${fieldClass} min-w-0 flex-1`}
          />
          <button
            type="button"
            onClick={addStep}
            className="lift flex min-h-12 flex-none cursor-pointer items-center gap-1.5 rounded-full bg-warm-2 px-4 text-sm font-extrabold text-ink-2"
          >
            <PlusIcon className="size-4 stroke-[2.6]" />
            Add step
          </button>
        </div>
        {steps.length > 0 && (
          <ol className="flex flex-col gap-1.5 pt-1">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className="flex animate-fade items-center gap-2.5 rounded-[14px] bg-soft py-1 pr-1 pl-3.5 text-sm font-bold ring-1 ring-line ring-inset"
              >
                <span className="text-muted">{index + 1}.</span>
                <span className="min-w-0 flex-1 break-words">{step.title}</span>
                <input type="hidden" name="steps" value={step.title} />
                <button
                  type="button"
                  onClick={() =>
                    setSteps((previous) => previous.filter((s) => s.id !== step.id))
                  }
                  aria-label={`Remove step ${step.title}`}
                  className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-warm-2 hover:text-late"
                >
                  <CloseIcon className="size-4 stroke-[2.4]" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </fieldset>

      <SubmitButton pending={pending} label="Add to my list" pendingLabel="Adding…" />
      <FormMessage state={state} success="Added! You'll find it in your list." />
    </form>
  );
}
