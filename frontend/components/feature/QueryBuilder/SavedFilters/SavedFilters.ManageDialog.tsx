import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/ui/dialog";
import { Button } from "@/components/base/ui/button";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";
import List from "@/components/base/List/List";
import ListItemAction from "@/components/base/List/ListItemWithAction";
import SavedFiltersDeleteDialog from "./SavedFilters.DeleteDialog";
import { SavedFilterInstance } from "@/components/model/query-builder-core";
import SavedFiltersEditDialog from "./SavedFilters.EditDialog";

const SavedFiltersManageDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const savedFilters = queryBuilder.getSavedFilters();

  useEffect(() => {
    if (savedFilters.length === 0) {
      onOpenChange(false);
    }
  }, [savedFilters]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{dict.savedFilter.manageDialog.title}</DialogTitle>
          </DialogHeader>
          <List bordered className="max-h-[250px]">
            {savedFilters.map((savedFilter) => (
              <SavedFilterListItem
                key={savedFilter.id}
                savedFilter={savedFilter}
              />
            ))}
          </List>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="primary">
                {dict.savedFilter.manageDialog.close}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SavedFilterListItem = ({
  savedFilter,
}: {
  savedFilter: SavedFilterInstance;
}) => {
  const dict = useQueryBuilderDictContext();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <ListItemAction
        key={savedFilter.id}
        title={savedFilter.raw().title}
        description={`${dict.savedFilter.manageDialog.lastSaveAt}: TODO`}
        className="border-b last:border-b-0 relative px-3 py-2 group"
        onEdit={() => setOpenEdit(true)}
        onDelete={() => setOpenDelete(true)}
      />
      <SavedFiltersDeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        savedFilter={savedFilter}
      />
      <SavedFiltersEditDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        savedFilter={savedFilter}
      />
    </>
  );
};

export default SavedFiltersManageDialog;
