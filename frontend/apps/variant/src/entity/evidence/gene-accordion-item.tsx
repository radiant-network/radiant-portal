import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

import type { GenePanelCondition, GetGermlineVariantConditionsPanelTypeEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import Empty from '@/components/base/empties/empty';
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
  const columns = useMemo(() => getConditionPhenotypeColumns(t, panelType), [t, panelType]);

  return (
    <AccordionItem value={symbol} className="border rounded">
      {/* The trigger stretches over the whole row; the link sits above it with z-10 */}
      <div className="relative flex items-center gap-2 py-4 px-5">
        <AccordionTrigger className="w-auto py-0 after:absolute after:inset-0">
          <span className="ml-4 font-semibold text-base">{symbol || t('common.components.empty_cell')}</span>
        </AccordionTrigger>
        {symbol && (
          <Button asChild iconOnly size="xs" variant="ghost" className="relative z-10">
            <Link
              to={getOmimOrgUrl({ symbol })}
              target="_blank"
              rel="noreferrer"
              aria-label={t('a11y.omim_link.open', { symbol })}
            >
              <ArrowUpRight className="size-4!" />
            </Link>
          </Button>
        )}
      </div>
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
            columns={columns}
            data={conditions || []}
            defaultColumnSettings={conditionPhenotypeDefaultSettings}
            loadingStates={{
              total: false,
              list: false,
            }}
            pagination={{ type: 'hidden' }}
            tableIndexResultPosition="bottom"
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default GeneAccordionItem;
