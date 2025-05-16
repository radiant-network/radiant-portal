import { Separator } from '@/components/base/ui/separator';
import { PropsWithChildren, ReactNode } from 'react';

interface DetailSectionProps {
  title: ReactNode;
}

interface DetailItemProps {
  title: ReactNode;
  value: ReactNode;
}

export default function DetailSection({ title, children }: PropsWithChildren<DetailSectionProps>) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-xs font-semibold text-primary">{title}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export function DetailItem({ title, value }: DetailItemProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{title}:</div>
        <div className="text-sm">{value}</div>
      </div>
      <Separator className="mt-1" />
    </div>
  );
}
