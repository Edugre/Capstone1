import type { FormState } from "@/lib/actions";

export const fieldClass =
  "min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-[15px] font-normal text-ink placeholder:text-faint";

export function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 text-[13px] font-semibold text-ink-2 ${className}`}
    >
      <span>
        {label} {hint && <span className="font-normal text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 cursor-pointer rounded-lg bg-accent px-4 text-[15px] font-semibold text-on-accent hover:bg-accent-hover disabled:cursor-default disabled:opacity-70"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function FormMessage({
  state,
  success,
}: {
  state: FormState;
  success: string;
}) {
  if (state.error) {
    return (
      <p role="alert" className="text-sm font-medium text-late">
        {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p role="status" className="text-sm font-medium text-muted">
        {success}
      </p>
    );
  }
  return null;
}
