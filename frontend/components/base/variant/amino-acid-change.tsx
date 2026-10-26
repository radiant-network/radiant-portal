import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { cn } from '@/components/lib/utils';

type AminoAcidChangeProps = {
  value: string;
  description?: string;
  className?: string;
};

function AminoAcidChange({ value, description, className }: AminoAcidChangeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn('font-mono truncate w-fit max-w-full', className)}>{value}</div>
      </TooltipTrigger>
      <TooltipContent>
        {description && <div>{description}</div>}
        <div className="font-mono break-all">{value}</div>
      </TooltipContent>
    </Tooltip>
  );
}

export default AminoAcidChange;
