import type { ReactNode } from 'react';
import { InfoIcon } from 'lucide-react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/base/shadcn/hover-card';

type InterpretationViewFieldProps = {
  label: ReactNode;
  infoCardContent?: ReactNode;
  children: ReactNode;
};

function InterpretationViewField({ label, infoCardContent, children }: InterpretationViewFieldProps) {
  return (
    <div className="space-y-2.5">
      <dt className="flex items-center gap-1 text-sm font-medium leading-none">
        {label}
        {infoCardContent && (
          <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
              <InfoIcon size={14} />
            </HoverCardTrigger>
            <HoverCardContent>{infoCardContent}</HoverCardContent>
          </HoverCard>
        )}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default InterpretationViewField;
