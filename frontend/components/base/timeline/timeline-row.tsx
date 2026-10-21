import { cn } from '@/components/lib/utils';

type TimelineRowProps = {
  badge: React.ReactNode;
  marker?: React.ReactNode;
  children: React.ReactNode;
  showLine?: boolean;
  className?: string;
};

function TimelineRow({ badge, marker, children, showLine = true, className }: TimelineRowProps) {
  return (
    <div className={cn('flex items-start gap-3 rounded-md px-3', className)}>
      <div className="flex flex-col items-center gap-2 self-stretch py-2">
        {badge}
        {showLine && <div className="-mb-1 flex-1 border-l border-dashed border-primary/30" />}
      </div>
      <div className="flex min-w-px flex-1 flex-col items-start py-2">{children}</div>
      {marker && <div className="shrink-0 py-2">{marker}</div>}
    </div>
  );
}

export default TimelineRow;
