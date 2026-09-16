import { type ReactElement, type ReactNode, useRef, useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from 'components/base/shadcn/tooltip';

function ClickableTooltip({ label, children }: { label: ReactNode; children: ReactElement }) {
  const [open, setOpen] = useState(false);
  const dismissed = useRef(false);
  return (
    <Tooltip
      open={open}
      onOpenChange={next => {
        if (next && dismissed.current) return;
        setOpen(next);
      }}
    >
      <TooltipTrigger
        asChild
        onClick={() => {
          dismissed.current = true;
          setOpen(false);
        }}
        onPointerLeave={() => {
          dismissed.current = false;
        }}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export default ClickableTooltip;
