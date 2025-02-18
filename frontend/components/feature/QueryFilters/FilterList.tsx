import { MultiSelect } from "@/components/feature/QueryFilters/MultiSelect";

import useSWR from "swr";
import React from "react";

import { type Aggregation, SqonOpEnum, type AggregationBody } from "@/api/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/ui/accordion";
import { occurrencesApi } from "@/utils/api";
import { SearchIcon } from "lucide-react";

type OccurrenceAggregationInput = {
  seqId: string;
  aggregationBody: AggregationBody;
};

const fetcher = (input: OccurrenceAggregationInput): Promise<Aggregation[]> => {
  return occurrencesApi
    .aggregateOccurrences(input.seqId, input.aggregationBody)
    .then((response) => response.data);
};

function useAggregationBuilder(
  field: string,
  size: number = 30,
  shouldFetch: boolean = false
) {
  return useSWR<Aggregation[], any, OccurrenceAggregationInput | null>(
    shouldFetch
      ? {
          seqId: "5011",
          aggregationBody: {
            field: field,
            size: size,
            sqon: {
              content: {
                field: "impact_score",
                value: [4],
              },
              op: SqonOpEnum.In,
            },
          },
        }
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
}

function FilterBuilder({ field }: { field: string }) {
  const [collapsed, setCollapsed] = React.useState(true);
  const [searchVisible, setSearchVisible] = React.useState(false);
  let { data } = useAggregationBuilder(field, undefined, !collapsed);

  data?.sort((a, b) => b.count! - a.count!);
  console.log("data in FilterBuilder:", data, " -- ", field);

  function handleSearch(e: React.MouseEvent<SVGElement, MouseEvent>): void {
    e.stopPropagation();
    setSearchVisible(!searchVisible);
  }

  return (
    <Accordion
      type="single"
      collapsible
      onValueChange={() => setCollapsed(!collapsed)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="AccordionTrigger">
          <div className="flex items-center justify-between w-full">
            <span>{field}</span>
            {!collapsed && (
              <SearchIcon
                size={18}
                className="z-40"
                aria-hidden
                onClick={handleSearch}
              />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {!data ? (
            <div>Loading...</div>
          ) : (
            <MultiSelect searchVisible={searchVisible} data={data} />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
export function FilterList({ fields }: { fields: string[] }) {
  return (
    <ul>
      {fields.map((field) => (
        <li key={field}>
          <FilterBuilder field={field} />
        </li>
      ))}
    </ul>
  );
}
