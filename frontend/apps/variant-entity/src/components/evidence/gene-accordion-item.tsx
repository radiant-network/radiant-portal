import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import ImpactIcon from '@/components/feature/variant/impact-icon';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';
import { conditionPhenotypeDefaultSettings, getConditionPhenotypeColumns } from './table-settings';
import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useState } from 'react';
import { PaginationState } from '@tanstack/table-core';
import Empty from '@/components/base/empty';

interface GeneAccordionItemProps {
  value: string;
  data: any; // Replace 'any' with the actual type of data
}

function GeneAccordionItem({ value, data }: GeneAccordionItemProps) {
  const { t } = useI18n();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <AccordionItem value={value} className="border rounded">
      <AccordionTrigger asChild className="py-4 px-5 hover:cursor-pointer">
        <div className="flex flex-1 ml-4 items-center gap-3">
          <span className="font-semibold text-base">
            {data.symbol ? (
              <a
                href={getOmimOrgUrl({ symbol: data.symbol })}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                onClick={e => e.stopPropagation()}
              >
                {data.symbol}
              </a>
            ) : (
              '-'
            )}
          </span>
          <ImpactIcon value={data.vep_impact} size={16} />
        </div>
      </AccordionTrigger>
      <AccordionContent className="py-4 pt-2 px-5 space-y-4">
        {data.conditions?.length === 0 ? (
          <Empty
            bordered
            iconType="chartRow"
            title={t('variantEntity.evidence.gene.table.empty.title')}
            description={t('variantEntity.evidence.gene.table.empty.description')}
          />
        ) : (
          <DataTable
            id={`${data.symbol}-condition-phenotype-table`}
            columns={getConditionPhenotypeColumns(t)}
            data={data.conditions || []}
            defaultColumnSettings={conditionPhenotypeDefaultSettings}
            defaultServerSorting={[]}
            loadingStates={{
              total: false,
              list: false,
            }}
            total={data.conditions?.length || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            onServerSortingChange={() => {}}
            tableIndexResultPosition="bottom"
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default GeneAccordionItem;
