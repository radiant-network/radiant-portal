import { useSearchParams } from 'react-router';
import { ClipboardList } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { SELECTED_VARIANT_PARAM } from '@/entity/variants/constants';

import InterpretationDialog from '../../../interpretation/interpretation-dialog';
import { useOccurrenceListContext } from '../../hooks/use-occurrences-list';

type InterpretationCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function InterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();
  const { mutate, loading } = useOccurrenceListContext();

  const [_, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_VARIANT_PARAM, occurrence.locus_id);
      return prev;
    });
  };

  if (!occurrence.has_interpretation) {
    return (
      <InterpretationDialog
        occurrence={occurrence}
        handleSaveCallback={mutate}
        renderTrigger={handleOpen => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button loading={loading} className="size-6" iconOnly variant="ghost" onClick={handleOpen}>
                <ClipboardList className="text-muted-foreground/40" size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('variant.interpretation.tooltip.add')}</TooltipContent>
          </Tooltip>
        )}
      />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="size-6" iconOnly variant="ghost" onClick={handleClick}>
          <ClipboardList className="text-primary fill-primary/30" size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t('variant.interpretation.tooltip.view')}</TooltipContent>
    </Tooltip>
  );
}

export default InterpretationCell;
