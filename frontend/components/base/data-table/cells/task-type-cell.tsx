import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import EmptyCell from './empty-cell';

type TaskTypeCellProps = {
  name?: string;
};

function TaskTypeCell({ name }: TaskTypeCellProps) {
  if (!name) return <EmptyCell />;

  return (
    <Tooltip>
      <TooltipTrigger className="flex max-w-full">
        <Badge variant="secondary" className="max-w-full">
          <span className="truncate">{name}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}

export default TaskTypeCell;
