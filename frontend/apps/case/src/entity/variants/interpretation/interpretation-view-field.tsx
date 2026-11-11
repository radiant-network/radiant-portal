import type { ReactNode } from 'react';

type InterpretationViewFieldProps = {
  label: ReactNode;
  children: ReactNode;
};

function InterpretationViewField({ label, children }: InterpretationViewFieldProps) {
  return (
    <div className="space-y-2.5">
      <dt className="text-sm font-medium leading-none">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default InterpretationViewField;
