import { useState } from 'react';
import { PencilLineIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { ISavedFilter } from '@/components/cores/saved-filter';
import { IValueQuery } from '@/components/cores/sqon';

import { useQueryBarContext } from '../query-bar/query-bar-context';

import QueryPillContainer from './query-pill-container';
import QueryPillCustomEditDialog from './query-pill-custom-edit-dialog';
import QueryPillValuesContainer from './query-pill-values-container';

export type QueryPillCustomProps = {
  valueQuery: IValueQuery;
};

function QueryPillCustom({ valueQuery }: QueryPillCustomProps) {
  const { query } = useQueryBarContext();

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const { name, ...rest } = valueQuery;
  const queryPill: ISavedFilter = {
    id: valueQuery.id,
    name: name,
    queries: [rest],
    favorite: false,
  };

  return (
    <>
      <QueryPillContainer onRemovePill={() => query.removePillById(valueQuery.id)}>
        <QueryPillValuesContainer className="pr-1" classNameContent="space-x-1">
          <span>{valueQuery.name}</span>
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
