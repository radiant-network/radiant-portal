import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/ui/tabs';
import { Input } from '@/components/base/ui/input';
import { Search, SearchIcon } from 'lucide-react';
import { Accordion } from '@/components/base/ui/accordion';
import GeneAccordionItem from './gene-accordion-item';
import { variantsApi } from '@/utils/api';
import {
  ApiError,
  GenePanelCondition,
  GenePanelConditions,
  GetGermlineVariantConditionsPanelTypeEnum,
} from '@/api/api';
import useSWR from 'swr';
import { useParams } from 'react-router';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/base/ui/skeleton';
import Empty from '@/components/base/empty';

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
        <CardTitle className="text-xl font-semibold">{t('variantEntity.evidence.gene.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Tabs
            value={panelType}
            onValueChange={value => setPanelType(value as GetGermlineVariantConditionsPanelTypeEnum)}
          >
            <TabsList>
              <TabsTrigger value={GetGermlineVariantConditionsPanelTypeEnum.Omim}>
                {t('variantEntity.evidence.gene.filters.omim', {
                  count: 20,
                })}
              </TabsTrigger>
              <TabsTrigger value={GetGermlineVariantConditionsPanelTypeEnum.Orphanet}>
                {t('variantEntity.evidence.gene.filters.orphanet', {
                  count: 10,
                })}
              </TabsTrigger>
              <TabsTrigger value={GetGermlineVariantConditionsPanelTypeEnum.Hpo}>
                {' '}
                {t('variantEntity.evidence.gene.filters.hpo', {
                  count: 54,
                })}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            startIcon={Search}
            placeholder={t('variantEntity.evidence.gene.filters.searchPlaceholder')}
            wrapperClassName="max-w-[320px] w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <Skeleton className="h-[150px] w-full" />
        ) : isEmpty ? (
          <Card className="shadow-none">
            <Empty
              title={t('common.table.no_result')}
              description={t('common.table.no_result_description')}
              iconType="custom"
              icon={SearchIcon}
            />
          </Card>
        ) : (
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
