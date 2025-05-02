import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import TranscriptManeSelectIcon from '@/components/base/icons/transcript-mane-select-icon';
import TranscriptManePlusIcon from '@/components/base/icons/transcript-mane-plus-icon';

type ManeCellProps = {
  canonical?: boolean;
  mane_select?: boolean;
  mane_plus?: boolean;
};

function ManeCell({ canonical, mane_select, mane_plus }: ManeCellProps) {
  if (!canonical && !mane_select && !mane_plus) return <EmptyCell />;

  const pills = [
    {
      condition: canonical,
      icon: <TranscriptCanonicalIcon className="text-primary" size={18} />,
      tooltip: 'Canonical',
    },
    {
      condition: mane_select,
      icon: <TranscriptManeSelectIcon className="text-primary" size={18} />,
      tooltip: 'Mane Select',
    },
    { condition: mane_plus, icon: <TranscriptManePlusIcon className="text-primary" size={18} />, tooltip: 'Mane Plus' },
  ];

  return (
    <>
      {pills
        .filter(({ condition }) => condition)
        .map(({ icon, tooltip }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger className="flex">
              <div className="inline-flex items-center">{icon}</div>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ))}
    </>
  );
}

export default ManeCell;
