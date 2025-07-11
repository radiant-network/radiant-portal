import { Occurrence } from '@/api/api';
import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';
import { ZapIcon } from 'lucide-react';
import InterpretationDialog from '../../interpretation/interpretation-dialog';

type InterpretationCellProps = {
  occurrence: Occurrence;
};

function InterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();

  return (
    <InterpretationDialog
      occurrence={occurrence}
      renderTrigger={handleOpen => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button iconOnly className={cn("size-6", occurrence.has_interpretation ? 'text-primary' : 'text-muted-foreground')} variant="ghost" onClick={handleOpen}>
              <ZapIcon className={cn(occurrence.has_interpretation && 'fill-primary')} size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('variant.interpretation.tooltips')}</TooltipContent>
        </Tooltip>
      )}
    />
  );
}

export default InterpretationCell;
