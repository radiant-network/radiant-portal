import { SaveIcon } from 'lucide-react';

import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { SavedFilterTypeEnum } from '@/components/model/saved-filter';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';
import { toast } from 'sonner';

function SavedFiltersSaveAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();
  const isDisabled =
    selectedSavedFilter && !selectedSavedFilter.isNew() ? !selectedSavedFilter.isDirty() : queryBuilder.isEmpty();

  const handleSave = () => {
    if (selectedSavedFilter && !selectedSavedFilter.isNew()) {
      selectedSavedFilter.save(SavedFilterTypeEnum.Filter);
    } else {
      queryBuilder
        .saveNewFilter(selectedSavedFilter?.raw())
        .then(() => {
          toast.success(dict.savedFilter.notifications.created);
        })
        .catch((error: any) => {
          if (error.response.data.detail.includes('unique_saved_filter')) {
            toast.error(dict.savedFilter.notifications.errors.duplicated);
            return;
          }
          toast.error(dict.savedFilter.notifications.errors.created);
        });
    }
  };

  const getTooptipContent = () => {
    if (queryBuilder.isEmpty()) {
      return dict.savedFilter.saveTooltip.whenEmpty;
    }

    if (selectedSavedFilter?.isDirty()) {
      return dict.savedFilter.saveTooltip.whenDirty;
    }

    return dict.savedFilter.saveTooltip.default;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            className={selectedSavedFilter?.isDirty() ? 'text-yellow-500' : ''}
            onClick={handleSave}
          >
            <SaveIcon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{getTooptipContent()}</TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersSaveAction;
