import { cn } from '@/components/lib/utils';

type TimelineLabelProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

function TimelineLabel({ label, value, className }: TimelineLabelProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs', className)}>
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
    </span>
  );
}

export default TimelineLabel;
