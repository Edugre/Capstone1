export default function ProgressRing({
  done,
  total,
  size,
  stroke = 7,
  color,
  children,
}: {
  done: number;
  total: number;
  size: number;
  stroke?: number;
  color: string;
  children?: React.ReactNode;
}) {
  const radius = 30 - stroke / 2 - 1;
  const length = 2 * Math.PI * radius;
  const offset = total ? length * (1 - done / total) : length;

  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 60 60"
        width={size}
        height={size}
        role="img"
        aria-label={`${done} of ${total} done`}
      >
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={stroke}
        />
        <circle
          className="ring-draw"
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={offset}
          transform="rotate(-90 30 30)"
          style={{ "--ring-length": length } as React.CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {children}
      </div>
    </div>
  );
}
