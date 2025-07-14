import { useI18n } from "@/components/hooks/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { Badge } from "@/components/base/ui/badge";
import { Separator } from "@/components/base/ui/separator";
import { DotIcon, FlaskConical } from "lucide-react";
import { CaseAssay } from "@/api/api";
import { useEffect, useState } from "react";
import { cn } from "@/components/lib/utils";
import { Skeleton } from "@/components/base/ui/skeleton";
import { getBadgeAffectedCodeColor } from "@/components/utils";


function AssayVariantFiltersSelectValue({ relationship_to_proband, request_id }: CaseAssay) {
  const { t } = useI18n();

  return (
    <div className="inline-flex gap-1">
      <span className="font-bold capitalize">{relationship_to_proband ?? t('caseEntity.variants.filters.proband')}</span>
      <span>{request_id}</span>
    </div>
  )
}

function AssayVariantFiltersSelectItem(assay: CaseAssay) {
  const { t } = useI18n();
  return (
    <div>
      <AssayVariantFiltersSelectValue  {...assay} />
      <div className="flex items-center color-muted text-xs">
        {t('caseEntity.variants.filters.sample_id')} {assay.sample_id}
        {assay.affected_status_code && (
          <>
            <DotIcon />
            <span className={cn({ "text-red": assay.affected_status_code === "affected" })}>
              {t(`caseEntity.variants.filters.affected_status_code.${assay.affected_status_code}`)}
            </span>
          </>
        )}
      </div>
    </div>
  )
}


type AssayVariantFiltersProps = {
  assays?: CaseAssay[];
  handleChange: (value: string) => void;
  isLoading: boolean;
}

/**
  * Api return the assay by the following order
  * 1. Proband first
  * 2. Every relation that has affected_status_code to affected
  * 3. Every relation that has other affected_status_code
  */
function AssayVariantFilters({ assays = [], handleChange, isLoading }: AssayVariantFiltersProps) {
  const { t } = useI18n();

  const [selectedAssay, setSelectedAssay] = useState<CaseAssay>();

  useEffect(() => {
    if (isLoading || assays.length === 0) return;
    setSelectedAssay(assays[0]);
  }, [isLoading, assays])

  if ((isLoading || assays.length === 0 || !selectedAssay)) {
    return (
      <div className="inline-flex gap-4 items-center px-6 py-4">
        <Skeleton className='w-[100px] h-[32px]' />
        <Skeleton className='w-[200px] h-[32px]' />
        <Skeleton className='w-[60px] h-[32px]' />
        <Separator className="h-6" orientation="vertical" />
        <Skeleton className='w-[50px] h-[32px]' />
      </div>
    )
  }

  return (
    <div className="inline-flex gap-4 items-center px-6 py-4">
      <span>{t('caseEntity.variants.filters.assay')}</span>
      <Select
        value={selectedAssay?.seq_id.toString()}
        onValueChange={value => {
          const newAssay = assays.find(assay => assay.seq_id === Number(value));
          setSelectedAssay(newAssay);
          handleChange(value);
        }}
      >
        <SelectTrigger className="min-w-[125px] max-w-[200px] h-8">
          <SelectValue>
            {selectedAssay && <AssayVariantFiltersSelectValue {...selectedAssay} />}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {assays.map((assay) => (
            <SelectItem key={`case-relation-${assay.seq_id}`} value={assay.seq_id.toString()}>
              <AssayVariantFiltersSelectItem {...assay} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedAssay?.affected_status_code && (
        <Badge variant={getBadgeAffectedCodeColor(selectedAssay.affected_status_code)}>
          {t(`caseEntity.variants.filters.affected_status_code.${selectedAssay?.affected_status_code}`)}
        </Badge>
      )}
      <Badge variant="outline"><FlaskConical />{selectedAssay?.sample_id}</Badge>
      <Separator className="h-6" orientation="vertical" />
      <Badge>{t('caseEntity.variants.filters.snv')}</Badge>
    </div>

  )
}

export default AssayVariantFilters; 
