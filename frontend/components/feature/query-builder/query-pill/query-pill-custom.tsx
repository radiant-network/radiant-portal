import QueryPillContainer from './query-pill-container';
import QueryPillValuesContainer from './query-pill-values-container';
import { useQueryBarContext } from '../query-bar/query-bar-context';
import { IValueQuery } from '@/components/model/sqon';
import { PencilLineIcon } from 'lucide-react';
import { useState } from 'react';
import { ISavedFilter } from '@/components/model/saved-filter';
import QueryPillCustomEditDialog from './query-pill-custom-edit-dialog';
import { Button } from '@/components/base/ui/button';

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
      <QueryPillContainer onRemovePill={() => query.removePillById(valueQuery.id)}>
        <QueryPillValuesContainer className="pr-1" classNameContent="space-x-1">
          <span>{valueQuery.title}</span>
          <Button
            iconOnly
            size="xs"
            variant="ghost"
            className="size-auto p-[2px]"
            onClick={() => setEditModalOpen(true)}
          >
            <PencilLineIcon />
          </Button>
        </QueryPillValuesContainer>
      </QueryPillContainer>
      {editModalOpen && (
        <QueryPillCustomEditDialog open={editModalOpen} onOpenChange={setEditModalOpen} queryPill={queryPill} />
      )}
    </>
  );
}

export default QueryPillCustom;
