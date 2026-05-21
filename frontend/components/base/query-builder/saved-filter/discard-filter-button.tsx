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

  const getTooltipContent = () => {
    if (!selectedSavedFilter || !isUnsaved) {
      return t('common.saved_filter.no_discard_tooltip');
    }
    return t('common.saved_filter.discard_tooltip');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            disabled={!selectedSavedFilter || !isUnsaved}
            onClick={() => {
              dispatchQB({
                type: QBActionType.LOAD_QUERIES,
                payload: selectedSavedFilter?.queries,
              });
            }}
          >
            <RotateCcw />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{getTooltipContent()}</TooltipContent>
    </Tooltip>
  );
}

export default DiscardFilterButton;
