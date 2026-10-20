import { useState } from 'react';
import { PencilLineIcon } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';

import { Button } from '../../shadcn/button';

import { useSavedFiltersContext } from './hooks/use-saved-filter';
import UpdateFilterDialog from './update-filter-dialog';

function UpdateFilterButton() {
  const { t } = useI18n();
  const { selectedSavedFilter } = useSavedFiltersContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        iconOnly
        variant="ghost"
        size="sm"
        aria-label={t('a11y.saved_filter.edit')}
        onClick={event => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <PencilLineIcon />
      </Button>
      {open && (
        <UpdateFilterDialog open={open} onOpenChange={setOpen} savedFilter={selectedSavedFilter} isFromManage={false} />
      )}
    </>
  );
}

export default UpdateFilterButton;
