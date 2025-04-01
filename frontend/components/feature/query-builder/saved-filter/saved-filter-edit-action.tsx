import { useState } from 'react';
import SavedFiltersEditDialog from './saved-filter-edit-dialog';
import { PencilLineIcon } from 'lucide-react';
import { useQueryBuilderContext } from '../query-builder-context';
import { Button } from '@/components/base/ui/button';

function SavedFiltersEditAction() {
  const { queryBuilder } = useQueryBuilderContext();

  const [open, setOpen] = useState(false);

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  return (
    <>
      <Button iconOnly variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <PencilLineIcon />
      </Button>
      <SavedFiltersEditDialog open={open} onOpenChange={setOpen} savedFilter={selectedSavedFilter} />
    </>
  );
}

export default SavedFiltersEditAction;
