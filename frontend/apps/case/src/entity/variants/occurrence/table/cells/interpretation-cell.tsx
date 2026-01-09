import { ClipboardList } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import InterpretationDialog from '../../../interpretation/interpretation-dialog';
import { useOccurrenceListContext } from '../../hooks/use-occurrences-list';

type InterpretationCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function InterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();
  const { mutate, loading } = useOccurrenceListContext();

  return (
    <InterpretationDialog
      occurrence={occurrence}
      handleSaveCallback={mutate}
      renderTrigger={handleOpen => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button loading={loading} className={cn('size-6')} iconOnly variant="ghost" onClick={handleOpen}>
              {occurrence.has_interpretation ? (
                <ClipboardList className="text-primary fill-primary/30" size={16} />
              ) : (
                <ClipboardList className="text-muted-foreground/40" size={16} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {occurrence.has_interpretation
              ? t('variant.interpretation.tooltip.edit')
              : t('variant.interpretation.tooltip.add')}
          </TooltipContent>
        </Tooltip>
      )}
    />
  );
}

export default InterpretationCell;
