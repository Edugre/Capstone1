import type { FormState } from "@/lib/actions";

export const fieldClass =
  "min-h-12 w-full rounded-[14px] border-[1.5px] border-line-strong bg-soft px-3.5 text-base font-semibold text-ink placeholder:font-normal placeholder:text-muted focus:outline-3 focus:outline-offset-1 focus:outline-focus";

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
      className={`flex flex-col gap-1.5 text-sm font-extrabold text-ink-2 ${className}`}
    >
      <span>
        {label} {hint && <span className="font-semibold text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

// Real radio inputs styled as pills, so the choice submits with the form.
export function PillChoice({
  legend,
  name,
  options,
  defaultValue,
  className = "",
}: {
  legend: string;
  name: string;
  options: { value: string; label: string; bg?: string; fg?: string }[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="pb-2 text-sm font-extrabold text-ink-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-extrabold whitespace-nowrap transition-[background-color,color,transform] hover:scale-105 has-focus-visible:outline-3 has-focus-visible:outline-focus ${
              o.bg
                ? "bg-(--pill-bg) text-(--pill-fg) has-checked:bg-(--pill-fg) has-checked:text-canvas"
                : "bg-warm-2 text-ink-2 has-checked:bg-ink has-checked:text-canvas"
            }`}
            style={
              o.bg
                ? ({ "--pill-bg": o.bg, "--pill-fg": o.fg } as React.CSSProperties)
                : undefined
            }
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={o.value === defaultValue}
              required
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel,
  className = "",
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`lift min-h-13 cursor-pointer rounded-full bg-accent px-5 text-base font-black text-on-accent disabled:cursor-default disabled:opacity-70 ${className}`}
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
      <p role="alert" className="text-sm font-bold text-late">
        {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p role="status" className="animate-fade text-sm font-bold text-done">
        {success}
      </p>
    );
  }
  return null;
}
