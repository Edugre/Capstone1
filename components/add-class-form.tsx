"use client";

import { useActionState } from "react";
import { addClass, type FormState } from "@/lib/actions";
import ClassFields from "./class-fields";
import { FormMessage, SubmitButton } from "./form-fields";

export default function AddClassForm({
  defaultSemester,
}: {
  defaultSemester?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addClass,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <ClassFields defaults={{ semester: defaultSemester }} />
      <SubmitButton pending={pending} label="Add class" pendingLabel="Adding…" />
      <FormMessage state={state} success="Class added! It gets its own color." />
    </form>
  );
}
