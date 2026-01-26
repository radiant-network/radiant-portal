import { useContext } from 'react';
import { useSearchParams } from 'react-router';
import { ClipboardList } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import InterpretationDialog from '@/components/base/interpretation/interpretation-dialog';
import { useOccurrenceListContext } from '@/components/base/occurrence/hooks/use-occurrences-list';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { SELECTED_VARIANT_PARAM } from '@/entity/variants/constants';
import { SeqIDContext } from '@/entity/variants/variants-tab';

type InterpretationCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function InterpretationCell({ occurrence }: InterpretationCellProps) {
  const { t } = useI18n();
  const { mutate, loading } = useOccurrenceListContext();
  const seqId = useContext(SeqIDContext);

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
        seqId={seqId}
        locusId={occurrence.locus_id}
        transcriptId={occurrence.transcript_id}
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
        isCreation
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
