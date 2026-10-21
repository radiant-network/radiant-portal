import type { ReactNode } from 'react';

import { Label } from '@/components/base/shadcn/label';
import { cn } from '@/components/lib/utils';

type InterpretationViewFieldProps = {
  label: string;
  children: ReactNode;
  // Rows match the height of their form control so that switching to edit mode does not shift the layout.
  // Pass false for content that should hug its height (interpretation text).
  matchControlHeight?: boolean;
  // Multi-selects grow by 2px once they hold badges; pass 'min-h-[38px]' for those rows.
  className?: string;
};

function InterpretationViewField({
  label,
  children,
  matchControlHeight = true,
  className,
}: InterpretationViewFieldProps) {
  return (
    <div className="space-y-2.5">
      <Label className="flex items-center gap-1">{label}</Label>
      <div className={cn('flex flex-wrap items-center gap-1 text-sm', { 'min-h-9': matchControlHeight }, className)}>
        {children}
      </div>
    </div>
  );
}

export default InterpretationViewField;
