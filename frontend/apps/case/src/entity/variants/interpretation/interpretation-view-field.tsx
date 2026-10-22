import type { ReactNode } from 'react';

import { Label } from '@/components/base/shadcn/label';

type InterpretationViewFieldProps = {
  label: string;
  children: ReactNode;
};

function InterpretationViewField({ label, children }: InterpretationViewFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">{label}</Label>
      <div className="flex flex-wrap items-center gap-1 text-sm">{children}</div>
    </div>
  );
}

export default InterpretationViewField;
