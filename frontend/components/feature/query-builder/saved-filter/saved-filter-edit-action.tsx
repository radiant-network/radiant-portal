import { useState } from "react";
import SavedFiltersEditDialog from "./saved-filter-edit-dialog";
import { IconButton } from "@/components/base/Buttons";
import { PencilLineIcon } from "lucide-react";
import { useQueryBuilderContext } from "../query-builder-context";

function SavedFiltersEditAction() {
  const { queryBuilder } = useQueryBuilderContext();

  const [open, setOpen] = useState(false);

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  return (
    <>
      <IconButton
        icon={PencilLineIcon}
        onClick={function () {
          setOpen(true);
        }}
      />
      <SavedFiltersEditDialog
        open={open}
        onOpenChange={setOpen}
        savedFilter={selectedSavedFilter}
      />
    </>
  );
}

export default SavedFiltersEditAction;
