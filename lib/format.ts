// Date and display helpers shared by server and client components.
// Due dates are plain YYYY-MM-DD strings, so all math is done on those.

export const PRIORITIES = ["Low", "Medium", "High"] as const;
export type Priority = (typeof PRIORITIES)[number];

export function toPriority(value: string | null | undefined): Priority {
  return PRIORITIES.includes(value as Priority) ? (value as Priority) : "Medium";
}

// Build dates in local time so a YYYY-MM-DD value doesn't shift a day
// when parsed as UTC.
function parse(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toISO(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const date = parse(isoDate);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);
}

export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  },
) {
  return parse(isoDate).toLocaleDateString("en-US", options);
}

/** "Today", "3 days late", or "Thu, Nov 5". */
export function formatDue(dueDate: string, today: string, completed = false) {
  const diff = daysBetween(today, dueDate);
  if (!completed && diff < 0) {
    return `${-diff} ${diff === -1 ? "day" : "days"} late`;
  }
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return formatDate(dueDate);
}

// One color per class, assigned in class order. Each differs in lightness
// as well as hue so neighbors stay distinguishable.
const CLASS_COLORS = [
  "#4F46E5",
  "#0F766E",
  "#C2410C",
  "#7E22CE",
  "#0369A1",
  "#A16207",
  "#BE185D",
  "#4D7C0F",
];

export function classColor(index: number) {
  return CLASS_COLORS[index % CLASS_COLORS.length];
}
