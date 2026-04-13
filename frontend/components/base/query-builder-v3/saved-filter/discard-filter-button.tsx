import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';

import { useSavedFiltersContext } from './hooks/use-saved-filter';

function DiscardFilterButton() {
  const { t } = useI18n();
  const dispatchQB = useQBDispatch();
  const { selectedSavedFilter, isUnsaved } = useSavedFiltersContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          iconOnly
          variant="ghost"
          size="sm"
          disabled={!selectedSavedFilter || !isUnsaved}
          onClick={e => {
            e.stopPropagation();
            dispatchQB({
              type: QBActionType.LOAD_QUERIES,
              payload: selectedSavedFilter?.queries,
            });
          }}
        >
          <RotateCcw />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t('common.saved_filter.discard_tooltip')}</TooltipContent>
    </Tooltip>
  );
}

export default DiscardFilterButton;
