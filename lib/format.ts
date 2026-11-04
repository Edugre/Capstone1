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

function daysBetween(from: string, to: string): number {
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

export function formatDue(dueDate: string, today: string, completed = false) {
  const diff = daysBetween(today, dueDate);
  if (!completed && diff < 0) {
    return `${-diff} ${diff === -1 ? "day" : "days"} late`;
  }
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return formatDate(dueDate);
}

// Colors are CSS variables (app/globals.css) so they switch with night mode.
const TINT_COUNT = 6;

export function classTint(index: number) {
  const n = index % TINT_COUNT;
  return { bg: `var(--tint-${n}-bg)`, fg: `var(--tint-${n}-fg)` };
}

export function greeting(hour: number) {
  if (hour < 12) return "Good morning!";
  if (hour < 18) return "Good afternoon!";
  return "Good evening!";
}

export function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}
