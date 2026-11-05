import { cn } from '@/lib/utils';

export type GaugeProps = {
  percent: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function Gauge({ percent, size = 24, strokeWidth = 3, className }: GaugeProps) {
  const center = size / 2;
  const radius = center - strokeWidth / 2 - 0.5;
  const circumference = 2 * Math.PI * radius;
  const clamped = percent == null ? 0 : Math.min(Math.max(percent, 0), 100);
  const offset = circumference * (1 - clamped / 100);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="shrink-0" style={{ width: size, height: size }} aria-hidden>
      <circle cx={center} cy={center} r={radius} className="fill-none stroke-muted" strokeWidth={strokeWidth} />
      {percent != null && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={cn('fill-none', className)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </svg>
  );
}

export default Gauge;
