import { useState } from "react";
import SavedFiltersEditDialog from "./SavedFilters.EditDialog";
import { IconButton } from "@/components/base/Buttons";
import { PencilLineIcon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersEditAction = () => {
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton icon={PencilLineIcon} onClick={() => setOpen(true)} />
      <SavedFiltersEditDialog
        open={open}
        onOpenChange={setOpen}
        savedFilter={selectedSavedFilter}
      />
    </>
  );
};

export default SavedFiltersEditAction;
