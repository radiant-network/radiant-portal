import { useState } from 'react';
import { PencilLineIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';

import { useQueryBuilderContext } from '../query-builder-context';

import SavedFiltersEditDialog from './saved-filter-edit-dialog';

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
