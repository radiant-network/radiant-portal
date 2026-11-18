import { useState } from 'react';

import { FacetContainer } from '@/components/base/query-builder/facets/facet-container';
import { Accordion } from '@/components/base/shadcn/accordion';
import type { Aggregation } from '@/components/cores/applications-config';
import { cn } from '@/components/lib/utils';

import { FavoritesPanelProvider, useFavoritesPanel } from './hooks/use-favorites-panel';

type FavoritesFacetListProps = {
  fields: Aggregation[];
};

function FavoriteRemovableRow({ field, isOpen }: { field: Aggregation; isOpen: boolean }) {
  const { removing } = useFavoritesPanel();
  const isRemoving = removing.has(field.key);

  return (
    <div
      className={cn(
        'grid motion-safe:transition-[grid-template-rows,opacity,transform] motion-safe:duration-200 motion-safe:ease-in-out',
        isRemoving ? 'grid-rows-[0fr] opacity-0 motion-safe:-translate-x-4' : 'grid-rows-[1fr] opacity-100',
      )}
    >
      <div className="overflow-hidden">
        <FacetContainer field={field} isOpen={isOpen} />
      </div>
    </div>
  );
}

function FavoritesFacetListInner({ fields }: FavoritesFacetListProps) {
  const [expandedFacets, setExpandedFacets] = useState<string[]>([]);

  return (
    <Accordion className="flex flex-col gap-1" type="multiple" value={expandedFacets} onValueChange={setExpandedFacets}>
      {fields.map((field, index) => (
        <FavoriteRemovableRow key={`${field.key}-${index}`} field={field} isOpen={expandedFacets.includes(field.key)} />
      ))}
    </Accordion>
  );
}

function FavoritesFacetList({ fields }: FavoritesFacetListProps) {
  return (
    <FavoritesPanelProvider>
      <FavoritesFacetListInner fields={fields} />
    </FavoritesPanelProvider>
  );
}

export default FavoritesFacetList;
