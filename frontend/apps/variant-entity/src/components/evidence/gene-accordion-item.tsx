import { GenePanelCondition, GetGermlineVariantConditionsPanelTypeEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import Empty from '@/components/base/empty';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';

import { conditionPhenotypeDefaultSettings, getConditionPhenotypeColumns } from './table-settings';

export interface GeneAccordionItemProps {
  symbol: string;
  panelType: GetGermlineVariantConditionsPanelTypeEnum;
  conditions: GenePanelCondition[];
}

function GeneAccordionItem({ symbol, panelType, conditions }: GeneAccordionItemProps) {
  const { t } = useI18n();

  return (
    <AccordionItem value={symbol} className="border rounded">
      <AccordionTrigger asChild className="py-4 px-5 hover:cursor-pointer">
        <div className="flex flex-1 ml-4 items-center gap-3">
          <span className="font-semibold text-base">
            {symbol ? (
              <a
                href={getOmimOrgUrl({ symbol })}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                onClick={e => e.stopPropagation()}
              >
                {symbol}
              </a>
            ) : (
              '-'
            )}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="py-4 pt-2 px-5 space-y-4">
        {conditions?.length === 0 ? (
          <Empty
            bordered
            showIcon={false}
            size="mini"
            description={t('variant_entity.evidence.gene.table.empty.description')}
          />
        ) : (
          <DataTable
            id={`${symbol}-condition-phenotype-table`}
            columns={getConditionPhenotypeColumns(t, panelType)}
            data={conditions || []}
            defaultColumnSettings={conditionPhenotypeDefaultSettings}
            defaultServerSorting={[]}
            loadingStates={{
              total: false,
              list: false,
            }}
            paginationHidden
            onServerSortingChange={() => {}}
            tableIndexResultPosition="bottom"
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default GeneAccordionItem;
