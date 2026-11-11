import { cn } from '@/lib/utils';

export type GaugeProps = {
  percent: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function Gauge({ percent, size = 24, strokeWidth, className }: GaugeProps) {
  const center = size / 2;
  const outerLimit = center - 0.5;
  const sw = strokeWidth ?? outerLimit * 0.2;
  const radius = outerLimit - sw / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = percent == null ? 0 : Math.min(Math.max(percent, 0), 100);
  const targetVisual = (circumference * clamped) / 100;
  const arcLength = Math.max(0, targetVisual - sw);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="shrink-0" style={{ width: size, height: size }} aria-hidden>
      <circle cx={center} cy={center} r={radius} className="fill-none stroke-muted" strokeWidth={sw} />
      {percent != null && arcLength > 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={cn('fill-none', className)}
          strokeWidth={sw}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </svg>
  );
}

export default Gauge;
