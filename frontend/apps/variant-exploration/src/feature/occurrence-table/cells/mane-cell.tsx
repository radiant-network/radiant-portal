import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import TranscriptManeSelectIcon from '@/components/base/icons/transcript-mane-select-icon';
import TranscriptManePlusIcon from '@/components/base/icons/transcript-mane-plus-icon';

type ManeCellProps = {
  isCanonical?: boolean;
  isManeSelect?: boolean;
  isManePlus?: boolean;
};

function ManeCell({ isCanonical: isCanonical, isManeSelect, isManePlus }: ManeCellProps) {
  if (!isCanonical && !isManeSelect && !isManePlus) return <EmptyCell />;

  const pills = [
    {
      condition: isCanonical,
      icon: <TranscriptCanonicalIcon className="text-primary" size={18} />,
      tooltip: 'Canonical',
    },
    {
      condition: isManeSelect,
      icon: <TranscriptManeSelectIcon className="text-primary" size={18} />,
      tooltip: 'Mane Select',
    },
    {
      condition: isManePlus,
      icon: <TranscriptManePlusIcon className="text-primary" size={18} />,
      tooltip: 'Mane Plus',
    },
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
