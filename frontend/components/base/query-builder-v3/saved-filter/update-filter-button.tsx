import { useState } from 'react';
import { PencilLineIcon } from 'lucide-react';

import { Button } from '../../shadcn/button';

import { useSavedFiltersContext } from './hooks/use-saved-filter';
import UpdateFilterDialog from './update-filter-dialog';

function UpdateFilterButton() {
  const { selectedSavedFilter } = useSavedFiltersContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        iconOnly
        variant="ghost"
        size="sm"
        onClick={event => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <PencilLineIcon />
      </Button>
      {open && (
        <UpdateFilterDialog
          open={open}
          onOpenChange={setOpen}
          savedFilter={selectedSavedFilter}
          isSelectedEdition={true}
        />
      )}
    </>
  );
}

export default UpdateFilterButton;
