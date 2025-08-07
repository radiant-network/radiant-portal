import { GermlineSNVOccurrence } from '@/api/api';
import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';
import { ZapIcon } from 'lucide-react';
import InterpretationDialog from '../../interpretation/interpretation-dialog';
import { useState } from 'react';

type InterpretationCellProps = {
  occurrence: GermlineSNVOccurrence;
};


/**
  * If an interpretation is updated, we update the icon localy to prevent 
  * unecessary call to api
  */
function InterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();
  const [hasInterpretation, setHasInterpretation] = useState<boolean>(occurrence.has_interpretation);
  const handleSaveCallback = function() {
    if (!occurrence.has_interpretation) {
      setHasInterpretation(true);
    }
  }

  return (
    <InterpretationDialog
      occurrence={occurrence}
      handleSaveCallback={handleSaveCallback}
      renderTrigger={handleOpen => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn("size-6", {
                'text-primary': hasInterpretation,
                'text-muted-foreground': !hasInterpretation,
              })}
              iconOnly
              variant="ghost"
              onClick={handleOpen}
            >
              <ZapIcon className={cn({ 'fill-primary': hasInterpretation })} size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('variant.interpretation.tooltips')}</TooltipContent>
        </Tooltip>
      )}
    />
  );
}

export default InterpretationCell;
