
import type { ClassItem } from "@/lib/data";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const HOUR_HEIGHT = 76;

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatHour(hour: number) {
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12} ${period}`;
}

export default function WeeklyClassCalendar({
  classes,
}: {
  classes: ClassItem[];
}) {
  const scheduledClasses = classes.filter(
    (c) =>
      c.meeting_days?.length &&
      c.start_time &&
      c.end_time,
  );

  const firstHour = Math.min(
    8,
    ...scheduledClasses.map((c) =>
      Math.floor(toMinutes(c.start_time!) / 60),
    ),
  );

  const lastHour = Math.max(
    18,
    ...scheduledClasses.map((c) =>
      Math.ceil(toMinutes(c.end_time!) / 60),
    ),
  );

  const hours = Array.from(
    { length: lastHour - firstHour },
    (_, index) => firstHour + index,
  );

  const calendarHeight = hours.length * HOUR_HEIGHT;

  return (
    <section className="rounded-2xl border border-gray-200 p-5">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          Weekly Class Schedule
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View your recurring class meeting times.
        </p>
      </div>

      {scheduledClasses.length === 0 && (
        <p className="mb-4 rounded-xl bg-gray-100 p-3 text-sm text-gray-600">
          No class meeting times yet. Add a class with meeting
          days and times to see it on your weekly calendar.
        </p>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          <div className="grid grid-cols-[65px_repeat(5,minmax(0,1fr))]">
            <div />

            {DAYS.map((day) => (
              <div
                key={day}
                className="border-b border-gray-200 py-3 text-center text-sm font-semibold"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[65px_repeat(5,minmax(0,1fr))]">
            <div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="pr-3 pt-1 text-right text-xs text-gray-500"
                  style={{ height: HOUR_HEIGHT }}
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {DAYS.map((day) => (
              <div
                key={day}
                className="relative border-l border-gray-200"
                style={{ height: calendarHeight }}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-b border-gray-200"
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}

                {scheduledClasses
                  .filter((c) => c.meeting_days?.includes(day))
                  .map((c) => {
                    const start = toMinutes(c.start_time!);
                    const end = toMinutes(c.end_time!);

                    const top =
                      ((start - firstHour * 60) / 60) *
                      HOUR_HEIGHT;

                    const height =
                      ((end - start) / 60) * HOUR_HEIGHT;

                    return (
                      <div
                        key={c.class_id}
                        title={`${c.class_name}: ${formatTime(c.start_time!)} - ${formatTime(c.end_time!)}`}
                        className="absolute left-1 right-1 overflow-hidden rounded-lg p-2 shadow-sm"
                        style={{
                          top,
                          height,
                          backgroundColor: c.bg,
                          color: c.fg,
                        }}
                      >
                        <p className="text-xs font-bold">
                          {c.class_code}
                        </p>

                        <p className="truncate text-xs font-medium">
                          {c.class_name}
                        </p>

                        <p className="mt-1 text-[10px]">
                          {formatTime(c.start_time!)} –{" "}
                          {formatTime(c.end_time!)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
