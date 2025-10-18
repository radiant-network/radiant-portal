import { cn } from '@/components/lib/utils';

function DescriptionSection({
  title,
  children,
  fullWidth = true,
}: {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-1 items-start', { 'w-full': fullWidth })}>
      <h4 className="font-semibold text-sm">{title}</h4>
      <div className={cn('flex gap-3 items-center', { 'w-full': fullWidth })}>
        <div className={cn('flex flex-col gap-2 items-start', { 'w-full': fullWidth })}>{children}</div>
      </div>
    </div>
  );
}

function DescriptionRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="flex items-center justify-end text-sm">{children}</div>
    </div>
  );
}

export { DescriptionRow, DescriptionSection };
