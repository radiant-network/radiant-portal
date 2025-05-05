import { Occurrence } from '@/api/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import InterpretationDialogButton from '@/feature/interpretation/interpretation-dialog-button';
import { ZapIcon } from 'lucide-react';

type InterpretationCellProps = {
  occurrence: Occurrence;
};

function InterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();
  return (
    <Tooltip>
      <TooltipTrigger>
        <InterpretationDialogButton
          iconOnly
          variant="ghost"
          className="text-muted-foreground size-5"
          occurrence={occurrence}
        >
          <ZapIcon size={16} />
        </InterpretationDialogButton>
      </TooltipTrigger>
      <TooltipContent>{t('variant.interpretation.tooltips')}</TooltipContent>
    </Tooltip>
  );
}

export default InterpretationCell;
