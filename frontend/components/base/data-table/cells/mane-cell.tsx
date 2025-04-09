import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/ui/tooltip';

type ManeCellProps = {
  canonical?: boolean;
  mane_select?: boolean;
  mane_plus?: boolean;
};

type ManePillProps = {
  children: any;
};

function ManePill({ children }: ManePillProps) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 me-1 text-xs text-primary-foreground bg-primary rounded-full">
      {children}
    </span>
  );
}

function ManeCell({ canonical, mane_select, mane_plus }: ManeCellProps) {
  if (!canonical && !mane_select && !mane_plus) return <EmptyCell />;

  const pills = [
    { condition: canonical, label: 'C', tooltip: 'Canonical' },
    { condition: mane_select, label: 'M', tooltip: 'Mane Select' },
    { condition: mane_plus, label: 'M', tooltip: 'Mane Plus' },
  ];

  return (
    <>
      {pills
        .filter(({ condition }) => condition)
        .map(({ label, tooltip }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger>
              <ManePill>{label}</ManePill>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ))}
    </>
  );
}

export default ManeCell;
