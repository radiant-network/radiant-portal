import { DotIcon, FlaskConical } from 'lucide-react';

import { CaseSequencingExperiment } from '@/api/api';
import AffectedStatusBadge, { AffectedStatusProps } from '@/components/base/badges/affected-status-badge';
import { Badge } from '@/components/base/shadcn/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { VariantInterface } from '../variants-tab';

function SequencingVariantFiltersSelectValue({ relationship_to_proband }: CaseSequencingExperiment) {
  const { t } = useI18n();

  return (
    <div className="inline-flex gap-1">
      <span className="font-bold capitalize">
        {relationship_to_proband ?? t('case_entity.variants.filters.proband')}
      </span>
    </div>
  );
}

function SequencingVariantFiltersSelectItem(caseSeqExp: CaseSequencingExperiment) {
  const { t } = useI18n();
  return (
    <div>
      <SequencingVariantFiltersSelectValue {...caseSeqExp} />
      <div className="flex items-center color-muted text-xs">
        {t('case_entity.variants.filters.sample_id')} {caseSeqExp.sample_id}
        {caseSeqExp.affected_status_code && (
          <>
            <DotIcon />
            <span className={cn({ 'text-red': caseSeqExp.affected_status_code === 'affected' })}>
              {t(`case_entity.variants.filters.affected_status_code.${caseSeqExp.affected_status_code}`)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

type SequencingVariantFiltersProps = {
  sequencingExperiments?: CaseSequencingExperiment[];
  value?: number;
  handleChange: (value: number) => void;
  isLoading: boolean;
  activeInterface: VariantInterface;
  onActiveInterfaceChange: (value: VariantInterface) => void;
};

/**
 * Api return the sequencing experiments by the following order.
 * 1. Proband first
 * 2. Every relation that has affected_status_code to affected
 * 3. Every relation that has other affected_status_code
 *
 * But the order can change if the proband doesn't have variants.
 */
function SequencingVariantFilters({
  sequencingExperiments = [],
  value,
  activeInterface,
  onActiveInterfaceChange,
  handleChange,
  isLoading,
}: SequencingVariantFiltersProps) {
  const { t } = useI18n();

  const selectedSequencingExperiment = sequencingExperiments.find(seqExp => seqExp.seq_id === value);

  if (isLoading || sequencingExperiments.length === 0) {
    return (
      <div className="inline-flex gap-4 items-center border-b px-2 py-4">
        <Skeleton className="w-[100px] h-[32px]" />
        <Skeleton className="w-[200px] h-[32px]" />
        <Skeleton className="w-[60px] h-[32px]" />
        <Separator className="h-6" orientation="vertical" />
        <Skeleton className="w-[50px] h-[32px]" />
        <Skeleton className="w-[50px] h-[32px]" />
      </div>
    );
  }

  return (
    <div className="inline-flex gap-4 items-center border-b px-3 py-4">
      <span>{t('case_entity.variants.filters.sequencing')}</span>
      <Select
        value={`${value}`}
        onValueChange={value => {
          handleChange(Number(value));
        }}
      >
        <SelectTrigger className="min-w-[125px] max-w-[200px] h-8">
          <SelectValue>
            {selectedSequencingExperiment && <SequencingVariantFiltersSelectValue {...selectedSequencingExperiment} />}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sequencingExperiments.map(seqExp => (
            <SelectItem key={`case-relation-${seqExp.seq_id}`} value={`${seqExp.seq_id}`}>
              <SequencingVariantFiltersSelectItem {...seqExp} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedSequencingExperiment?.affected_status_code && (
        <AffectedStatusBadge status={selectedSequencingExperiment.affected_status_code as AffectedStatusProps} />
      )}
      <Badge variant="outline">
        <FlaskConical />
        {selectedSequencingExperiment?.sample_id}
      </Badge>
      <Separator className="h-6" orientation="vertical" />

      <Tabs value={activeInterface}>
        <TabsList className="w-full">
          {Object.values(VariantInterface).map(variant => (
            <TabsTrigger
              key={variant}
              value={variant}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              onClick={() => onActiveInterfaceChange(variant)}
            >
              {t(`case_entity.variants.filters.${variant.toLowerCase()}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default SequencingVariantFilters;
