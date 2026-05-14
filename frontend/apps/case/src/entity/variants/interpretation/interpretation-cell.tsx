import { ComponentType, ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { ClipboardList } from 'lucide-react';

import { useDataTable } from '@/components/base/data-table/hooks/use-data-table';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { SELECTED_VARIANT_PARAM } from '../constants';

type InterpretationDialogProps = {
  locusId: string;
  transcriptId?: string;
  patientId?: number;
  handleSaveCallback?: () => void;
  renderTrigger: (handleOpen: () => void) => ReactNode;
  isCreation?: boolean;
};

type InterpretationCellProps = {
  locusId: string;
  transcriptId?: string;
  hasInterpretation: boolean;
  patientId?: number;
  InterpretationDialog: ComponentType<InterpretationDialogProps>;
};

function InterpretationCell({
  locusId,
  transcriptId,
  hasInterpretation,
  patientId,
  InterpretationDialog,
}: InterpretationCellProps) {
  const { t } = useI18n();
  const [_, setSearchParams] = useSearchParams();
  const { list } = useDataTable();

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_VARIANT_PARAM, locusId);
      return prev;
    });
  };

  if (!hasInterpretation) {
    return (
      <InterpretationDialog
        isCreation
        locusId={locusId}
        transcriptId={transcriptId}
        patientId={patientId}
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

export default InterpretationCell;
