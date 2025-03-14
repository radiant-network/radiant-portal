import useSWR from 'swr';
import React from 'react';

import { useConfig } from '@/components/model/applications-config';
import { MultiSelectFilter } from '@/components/feature/query-filters/multiselect-filter';
import { LoadingOverlay } from '@/components/base/overlays/loading-overlay';
import { SqonContent, SqonOpEnum, type Aggregation, type AggregationBody } from '@/api/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { occurrencesApi } from '@/utils/api';
import { SearchIcon } from 'lucide-react';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';

type OccurrenceAggregationInput = {
  seqId: string;
  aggregationBody: AggregationBody;
};

const fetcher = (input: OccurrenceAggregationInput): Promise<Aggregation[]> => {
  return occurrencesApi.aggregateOccurrences(input.seqId, input.aggregationBody).then(response => response.data);
};

function useAggregationBuilder(field: string, size: number = 30, shouldFetch: boolean = false, appId: string) {
  let data: OccurrenceAggregationInput | null;

  if (!shouldFetch) {
    data = null;
  } else {
    data = {
      seqId: '5011',
      aggregationBody: {
        field: field,
        size: size,
      },
    };
  }

  const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);

  if (activeQuery && data) {
    data.aggregationBody.sqon = {
      content: activeQuery.content as SqonContent,
      op: activeQuery.op as SqonOpEnum,
    };
  }

  return useSWR<Aggregation[], any, OccurrenceAggregationInput | null>(data, fetcher, {
    revalidateOnFocus: false,
  });
}
export function FilterContainer({ field }: { field: AggregationConfig }) {
  const [collapsed, setCollapsed] = React.useState(true);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const config = useConfig();

  let { data, isLoading } = useAggregationBuilder(field.key, undefined, !collapsed, config.variant_entity.app_id);

  function handleSearch(e: React.MouseEvent<SVGElement, MouseEvent>): void {
    e.stopPropagation();
    setSearchVisible(!searchVisible);
  }

  return (
    <Accordion type="single" collapsible onValueChange={() => setCollapsed(!collapsed)}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="AccordionTrigger">
          <div className="flex items-center justify-between w-full text-base">
            <span className="capitalize">{field.key.replace('_', ' ')}</span>
            {!collapsed && <SearchIcon size={18} className="z-40" aria-hidden onClick={handleSearch} />}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <LoadingOverlay loading={isLoading}>
            {field.type === 'multiple' ? (
              <MultiSelectFilter field={field} searchVisible={searchVisible} data={data} />
            ) : (
              <div>Not implemented</div>
            )}
          </LoadingOverlay>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
