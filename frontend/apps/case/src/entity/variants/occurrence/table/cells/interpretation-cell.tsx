import { useState } from 'react';
import { ClipboardList } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import InterpretationDialog from '../../../interpretation/interpretation-dialog';

type InterpretationCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function InterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();
  const [hasInterpretation, setHasInterpretation] = useState<boolean>(occurrence.has_interpretation);
  const handleSaveCallback = () => {
    if (!occurrence.has_interpretation) {
      setHasInterpretation(true);
    }
  };

  return (
    <InterpretationDialog
      occurrence={occurrence}
      handleSaveCallback={handleSaveCallback}
      renderTrigger={handleOpen => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className={cn('size-6')} iconOnly variant="ghost" onClick={handleOpen}>
              {hasInterpretation ? (
                <ClipboardList className="text-primary fill-primary/30" size={16} />
              ) : (
                <ClipboardList className="text-muted-foreground/40" size={16} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('variant.interpretation.tooltip')}</TooltipContent>
        </Tooltip>
      )}
    />
  );
}

export default InterpretationCell;
