import type { Priority } from "@/lib/format";

const styles: Record<Priority, string> = {
  High: "bg-ink text-surface",
  Medium: "bg-sunken text-ink-2",
  Low: "text-muted ring-1 ring-line ring-inset",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
