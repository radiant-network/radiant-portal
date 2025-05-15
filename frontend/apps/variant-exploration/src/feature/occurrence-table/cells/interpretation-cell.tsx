import { Occurrence } from '@/api/api';
import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import InterpretationDialog from '@/feature/interpretation/interpretation-dialog';
import { ZapIcon } from 'lucide-react';

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
            <Button iconOnly className="text-muted-foreground size-6" variant="ghost" onClick={handleOpen}>
              <ZapIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('variant.interpretation.tooltips')}</TooltipContent>
        </Tooltip>
      )}
    />
  );
}

export default InterpretationCell;
