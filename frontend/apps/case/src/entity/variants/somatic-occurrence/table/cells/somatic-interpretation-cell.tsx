import { useSearchParams } from 'react-router';
import { ClipboardList } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { useDataTable } from '@/components/base/data-table/hooks/use-data-table';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { SELECTED_VARIANT_PARAM } from '@/entity/variants/constants';

import SomaticInterpretationDialog from '../../interpretation/somatic-interpretation-dialog';

type InterpretationCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function SomaticInterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();
  const [_, setSearchParams] = useSearchParams();
  const { list } = useDataTable();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_VARIANT_PARAM, occurrence.locus_id);
      return prev;
    });
  };

  if (!occurrence.has_interpretation) {
    return (
      <SomaticInterpretationDialog
        locusId={occurrence.locus_id}
        transcriptId={occurrence.transcript_id}
        handleSaveCallback={list?.mutate}
        renderTrigger={handleOpen => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                loading={list?.isLoading ?? false}
                className="size-6"
                iconOnly
                variant="ghost"
                onClick={handleOpen}
              >
                <ClipboardList className="text-muted-foreground/40" size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('variant.interpretation.tooltip.add')}</TooltipContent>
          </Tooltip>
        )}
        isCreation
      />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="size-6" iconOnly variant="ghost" onClick={handleClick}>
          <ClipboardList className="text-primary fill-primary/20" size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t('variant.interpretation.tooltip.view')}</TooltipContent>
    </Tooltip>
  );
}

export default SomaticInterpretationCell;
