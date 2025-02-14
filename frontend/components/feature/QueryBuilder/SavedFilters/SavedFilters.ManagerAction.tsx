import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/base/dialog";
import { Button } from "@/components/base/Buttons";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersManageAction = () => {
  const [open, setOpen] = useState(false);
  const { queryBuilder } = useQueryBuilderContext();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full pl-1">
          Manage filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage filters</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedFiltersManageAction;
