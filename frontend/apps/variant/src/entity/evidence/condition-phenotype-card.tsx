import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Search, SearchIcon } from 'lucide-react';
import useSWR from 'swr';

import {
  ApiError,
  GenePanelCondition,
  GenePanelConditions,
  GetGermlineVariantConditionsPanelTypeEnum,
} from '@/api/api';
import Empty from '@/components/base/empty';
import { Accordion } from '@/components/base/shadcn/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Input } from '@/components/base/shadcn/input';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';
import { variantsApi } from '@/utils/api';

import GeneAccordionItem from './gene-accordion-item';

type ConditionByPanelTypeInput = {
  key: string;
  locus_id: string;
  panel_type: GetGermlineVariantConditionsPanelTypeEnum;
};

async function fetchConditionByPanelType(input: ConditionByPanelTypeInput) {
  const response = await variantsApi.getGermlineVariantConditions(input.locus_id, input.panel_type);
  return response.data;
}

function ConditionPhenotypeCard() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();
  const [panelType, setPanelType] = useState<GetGermlineVariantConditionsPanelTypeEnum>(
    GetGermlineVariantConditionsPanelTypeEnum.Omim,
  );
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useSWR<GenePanelConditions, ApiError, ConditionByPanelTypeInput>(
    {
      key: 'condition-by-panel-type',
      locus_id: params.locusId!,
      panel_type: panelType,
    },
    fetchConditionByPanelType,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  // Filter conditions based on search term
  const filteredData = useMemo(() => {
    if (!data?.conditions || !searchTerm.trim()) {
      return data?.conditions || {};
    }

    const filtered: Record<string, GenePanelCondition[]> = {};
    const searchLower = searchTerm.toLowerCase();

    Object.entries(data.conditions).forEach(([symbol, conditions]) => {
      const filteredConditions = conditions.filter(condition =>
        condition.panel_name.toLowerCase().includes(searchLower),
      );

      filtered[symbol] = filteredConditions;
    });

    return filtered;
  }, [data?.conditions, searchTerm]);

  const isEmpty = Object.keys(filteredData || {}).length === 0;

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle className="text-xl font-semibold">{t('variant_entity.evidence.gene.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Tabs
            value={panelType}
            onValueChange={value => setPanelType(value as GetGermlineVariantConditionsPanelTypeEnum)}
          >
            <TabsList>
              <TabsTrigger data-cy="omim-tab" value={GetGermlineVariantConditionsPanelTypeEnum.Omim}>
                {t('variant_entity.evidence.gene.filters.omim', {
                  count: +thousandNumberFormat(data?.count_omim ?? 0),
                })}
              </TabsTrigger>
              <TabsTrigger data-cy="orphanet-tab" value={GetGermlineVariantConditionsPanelTypeEnum.Orphanet}>
                {t('variant_entity.evidence.gene.filters.orphanet', {
                  count: +thousandNumberFormat(data?.count_orphanet ?? 0),
                })}
              </TabsTrigger>
              <TabsTrigger data-cy="hpo-tab" value={GetGermlineVariantConditionsPanelTypeEnum.Hpo}>
                {t('variant_entity.evidence.gene.filters.hpo', {
                  count: +thousandNumberFormat(data?.count_hpo ?? 0),
                })}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            startIcon={Search}
            placeholder={t('variant_entity.evidence.gene.filters.search_placeholder')}
            wrapperClassName="max-w-[320px] w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading && <Skeleton className="h-[150px] w-full" />}

        {!isLoading && isEmpty && (
          <Card className="shadow-none">
            <Empty
              title={t('common.table.no_result')}
              description={t('common.table.no_result_description')}
              iconType="custom"
              icon={SearchIcon}
            />
          </Card>
        )}

        {!isLoading && !isEmpty && (
          <Accordion type="multiple" defaultValue={Object.keys(filteredData || {})} className="space-y-2">
            {Object.entries(filteredData || {}).map(([symbol, conditions], index) => (
              <GeneAccordionItem
                key={`cond-phe-gene-${index}`}
                symbol={symbol}
                panelType={panelType}
                conditions={conditions}
              />
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

export default ConditionPhenotypeCard;
