import QueryPillContainer from "./QueryPill.Container";
import QueryPillValuesContainer from "./QueryPill.ValuesContainer";
import { useQueryBarContext } from "../QueryBar/QueryBar.Context";
import { IValueQuery } from "@/components/model/sqon";
import { IconButton } from "@/components/base/Buttons";
import { PencilLineIcon } from "lucide-react";
import { useState } from "react";
import { ISavedFilter } from "@/components/model/saved-filter";
import QueryPillCustomEditDialog from "./QueryPill.CustomEditDialog";

export type QueryPillCustomProps = {
  valueQuery: IValueQuery;
};

function QueryPillCustom({ valueQuery }: QueryPillCustomProps) {
  const { query } = useQueryBarContext();

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const { title, ...rest } = valueQuery;
  const queryPill: ISavedFilter = {
    id: valueQuery.id,
    title: valueQuery.title,
    queries: [rest],
    favorite: false,
  };

  return (
    <>
      <QueryPillContainer
        onRemovePill={() => query.removePillById(valueQuery.id)}
      >
        <QueryPillValuesContainer className="pr-1 space-x-1">
          <span>{valueQuery.title}</span>
          <IconButton
            icon={PencilLineIcon}
            size="xs"
            className="size-auto p-[2px]"
            onClick={() => setEditModalOpen(true)}
          />
        </QueryPillValuesContainer>
      </QueryPillContainer>
      {editModalOpen && (
        <QueryPillCustomEditDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          queryPill={queryPill}
        />
      )}
    </>
  );
}

export default QueryPillCustom;
