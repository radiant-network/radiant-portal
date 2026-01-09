import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

import { GenePanelCondition, GetGermlineVariantConditionsPanelTypeEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import Empty from '@/components/base/empty';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Button } from '@/components/base/shadcn/button';
import { getOmimOrgUrl } from '@/components/base/variant/utils';
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
        <div className="flex flex-1 ml-4 items-center gap-2">
          <span className="font-semibold text-base">{symbol || t('common.components.empty_cell')}</span>
          {symbol && (
            <Link to={getOmimOrgUrl({ symbol })} target="_blank" rel="noreferrer">
              <Button iconOnly size="xs" variant="ghost">
                {<ArrowUpRight className="size-4!" />}
              </Button>
            </Link>
          )}
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
            loadingStates={{
              total: false,
              list: false,
            }}
            pagination={{ type: 'hidden' }}
            tableIndexResultPosition="bottom"
            serverOptions={{
              onSortingChange: () => {},
            }}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default GeneAccordionItem;
