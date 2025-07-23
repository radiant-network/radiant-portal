import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

interface PerformerLabTableCellProps {
  performerLabCode: string | undefined;
  performerLabName: string | undefined;
}

function PerformerLabTableCell({ performerLabCode, performerLabName }: PerformerLabTableCellProps) {
  if (!performerLabCode || !performerLabName) {
    return <EmptyCell />;
  }

  return (
    <div className="text-muted-foreground">
      <Tooltip>
        <TooltipTrigger>{performerLabCode}</TooltipTrigger>
        <TooltipContent>{performerLabName}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default PerformerLabTableCell;
