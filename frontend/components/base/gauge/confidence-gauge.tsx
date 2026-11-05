import Gauge from './gauge';

export type ConfidenceRange = 'high' | 'mid' | 'low' | 'none';

export function parseConfidenceToPercent(confidence?: string): number | null {
  if (!confidence) return null;
  const n = Number.parseFloat(confidence);
  if (Number.isNaN(n)) return null;
  const pct = n <= 1 ? n * 100 : n;
  return Math.round(pct);
}

export function rangeFor(percent: number | null): ConfidenceRange {
  if (percent == null) return 'none';
  if (percent > 90) return 'high';
  if (percent >= 75) return 'mid';
  return 'low';
}

const RANGE_STROKE: Record<ConfidenceRange, string> = {
  high: 'stroke-emerald',
  mid: 'stroke-amber',
  low: 'stroke-red',
  none: 'stroke-muted',
};

export type ConfidenceGaugeProps = {
  percent: number | null;
  size?: number;
  strokeWidth?: number;
};

function ConfidenceGauge({ percent, size, strokeWidth }: ConfidenceGaugeProps) {
  return <Gauge percent={percent} size={size} strokeWidth={strokeWidth} className={RANGE_STROKE[rangeFor(percent)]} />;
}

export default ConfidenceGauge;
