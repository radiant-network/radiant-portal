import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Badge } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type OmimCellProps = {
  codes?: string[];
};

/**
 * Show inheritance Tags associated with the Picked consequence.
 */
function OmimCell({ codes = [] }: OmimCellProps) {
  const { t } = useI18n();
  if (codes.length === 0) return <EmptyCell />;

  return (
    <>
      {codes.map(code => (
        <Tooltip key={code}>
          <TooltipTrigger>
            <Badge key={code} variant="outline" className={cn('me-2')}>
              {code}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{t(`variant.omim.${code}`)}</TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

export default OmimCell;
