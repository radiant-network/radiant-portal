import { DotIcon, FlaskConical } from 'lucide-react';

import { CaseAssay } from '@/api/api';
import AffectedStatusBadge, { AffectedStatusProps } from '@/components/base/badges/affected-status-badge';
import ToggleButtonGroup from '@/components/base/toggle-button-group/toggle-button-group';
import { Badge } from '@/components/base/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { VariantInterface } from '../variants-tab';

function AssayVariantFiltersSelectValue({ relationship_to_proband, request_id }: CaseAssay) {
  const { t } = useI18n();

  return (
    <div className="inline-flex gap-1">
      <span className="font-bold capitalize">
        {relationship_to_proband ?? t('case_entity.variants.filters.proband')}
      </span>
      <span>{request_id}</span>
    </div>
  );
}

function AssayVariantFiltersSelectItem(assay: CaseAssay) {
  const { t } = useI18n();
  return (
    <div>
      <AssayVariantFiltersSelectValue {...assay} />
      <div className="flex items-center color-muted text-xs">
        {t('case_entity.variants.filters.sample_id')} {assay.sample_id}
        {assay.affected_status_code && (
          <>
            <DotIcon />
            <span className={cn({ 'text-red': assay.affected_status_code === 'affected' })}>
              {t(`case_entity.variants.filters.affected_status_code.${assay.affected_status_code}`)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

type AssayVariantFiltersProps = {
  assays?: CaseAssay[];
  value?: string;
  handleChange: (value: string) => void;
  isLoading: boolean;
  activeInterface: VariantInterface;
  onActiveInterfaceChange: (value: VariantInterface) => void;
};

/**
 * Api return the assay by the following order.
 * 1. Proband first
 * 2. Every relation that has affected_status_code to affected
 * 3. Every relation that has other affected_status_code
 *
 * But the order can change if the proband doesn't have variants.
 */
function AssayVariantFilters({
  assays = [],
  value,
  activeInterface,
  onActiveInterfaceChange,
  handleChange,
  isLoading,
}: AssayVariantFiltersProps) {
  const { t } = useI18n();

  const selectedAssay = assays.find(assay => assay.seq_id.toString() === value);

  if (isLoading || assays.length === 0) {
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
      <span>{t('case_entity.variants.filters.assay')}</span>
      <Select
        value={value}
        onValueChange={value => {
          handleChange(value);
        }}
      >
        <SelectTrigger className="min-w-[125px] max-w-[200px] h-8">
          <SelectValue>{selectedAssay && <AssayVariantFiltersSelectValue {...selectedAssay} />}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {assays.map(assay => (
            <SelectItem key={`case-relation-${assay.seq_id}`} value={assay.seq_id.toString()}>
              <AssayVariantFiltersSelectItem {...assay} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedAssay?.affected_status_code && (
        <AffectedStatusBadge status={selectedAssay.affected_status_code as AffectedStatusProps} />
      )}
      <Badge variant="outline">
        <FlaskConical />
        {selectedAssay?.sample_id}
      </Badge>
      <Separator className="h-6" orientation="vertical" />

      <ToggleButtonGroup
        onValueChange={onActiveInterfaceChange}
        defaultValue={activeInterface}
        size="xxs"
        items={[
          {
            label: t('case_entity.variants.filters.snv'),
            value: VariantInterface.SNV,
          },
          {
            label: t('case_entity.variants.filters.cnv'),
            value: VariantInterface.CNV,
          },
        ]}
      />
    </div>
  );
}

export default AssayVariantFilters;
