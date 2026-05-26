import { DotIcon } from 'lucide-react';

import { CaseSequencingExperiment } from '@/api/api';
import AffectedStatusBadge, { AffectedStatusProps } from '@/components/base/badges/affected-status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

function SequencingVariantFiltersSelectValue({ relationship_to_proband, seq_id }: CaseSequencingExperiment) {
  const { t } = useI18n();

  return (
    <div className="inline-flex gap-1">
      <span className="font-bold capitalize">
        {relationship_to_proband ?? t('case_entity.variants.filters.proband')}
      </span>
      <span>
        ({t('case_entity.variants.filters.sequencing_id')} {seq_id})
      </span>
    </div>
  );
}

function SequencingVariantFiltersSelectItem(caseSeqExp: CaseSequencingExperiment) {
  const { t } = useI18n();
  return (
    <div>
      <SequencingVariantFiltersSelectValue {...caseSeqExp} />
      <div className="flex items-center text-muted-foreground color-muted text-xs">
        {t('case_entity.variants.filters.sample_submitter_id')} {caseSeqExp.sample_submitter_id}
        {caseSeqExp.affected_status_code && (
          <>
            <DotIcon />
            <AffectedStatusBadge status={caseSeqExp.affected_status_code as AffectedStatusProps} />
          </>
        )}
      </div>
    </div>
  );
}

type SequencingVariantFiltersOption = {
  value: string;
  tooltip?: string;
};
type SequencingVariantFiltersProps = {
  sequencingExperiments?: CaseSequencingExperiment[];
  selectedSeqId?: number;
  handleChange: (value: number) => void;
  options: SequencingVariantFiltersOption[];
  isLoading: boolean;
  activeInterface: string;
  onActiveInterfaceChange: (value: string) => void;
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
  options,
  selectedSeqId,
  activeInterface,
  onActiveInterfaceChange,
  handleChange,
  isLoading,
}: SequencingVariantFiltersProps) {
  const { t } = useI18n();

  const selectedSequencingExperiment = sequencingExperiments.find(seqExp => seqExp.seq_id === selectedSeqId);

  if (isLoading || sequencingExperiments.length === 0) {
    return (
      <div className="inline-flex gap-4 items-center border-b px-2 py-4">
        <Skeleton className="w-[100px] h-[28px]" />
        <Skeleton className="w-[200px] h-[28px]" />
        <Skeleton className="w-[60px] h-[28px]" />
        <Separator className="h-7" orientation="vertical" />
        <Skeleton className="w-[50px] h-[28px]" />
        <Skeleton className="w-[50px] h-[28px]" />
      </div>
    );
  }

  return (
    <div className="inline-flex gap-4 items-center border-b px-6 py-2.5">
      <Tabs value={activeInterface}>
        <TabsList className="w-full h-7">
          {options.map(({ tooltip, value }: SequencingVariantFiltersOption) => {
            const trigger = (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                data-cy={`tabs-trigger-${value}`}
                onClick={() => {
                  onActiveInterfaceChange(value);
                }}
              >
                {t(`case_entity.variants.filters.${value.toLowerCase()}`)}
              </TabsTrigger>
            );

            return tooltip ? (
              <Tooltip key={value}>
                <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ) : (
              trigger
            );
          })}
        </TabsList>
      </Tabs>
      <Separator className="h-7" orientation="vertical" />
      <Select
        value={`${selectedSeqId}`}
        onValueChange={value => {
          handleChange(Number(value));
        }}
      >
        <SelectTrigger className="min-w-[125px] max-w-[200px] " size="xs">
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
      {selectedSequencingExperiment && selectedSequencingExperiment.relationship_to_proband !== 'proband' && (
        <AffectedStatusBadge status={selectedSequencingExperiment.affected_status_code as AffectedStatusProps} />
      )}
      {selectedSequencingExperiment?.sample_submitter_id && (
        <span className="text-xs">
          {t('case_entity.variants.filters.sample_id')}
          <span className="font-mono font-semibold"> {selectedSequencingExperiment.sample_submitter_id}</span>
        </span>
      )}
    </div>
  );
}

export default SequencingVariantFilters;
