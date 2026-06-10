import { formatDate } from 'date-fns';
import { DotIcon } from 'lucide-react';

import { CaseSequencingExperiment, TaskOccurrenceType } from '@/api/api';
import AffectedStatusBadge, { AffectedStatusProps } from '@/components/base/badges/affected-status-badge';
import { Badge } from '@/components/base/shadcn/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/base/shadcn/select';
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
  tasks?: TaskOccurrenceType[];
  selectedTaskId?: number;
  onTaskChange?: (value: number) => void;
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
  tasks = [],
  selectedTaskId,
  onTaskChange,
}: SequencingVariantFiltersProps) {
  const { t } = useI18n();

  const selectedSequencingExperiment = sequencingExperiments.find(seqExp => seqExp.seq_id === selectedSeqId);
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const latestTaskId = tasks[0]?.id; // the API returns tasks ordered by created_on DESC

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
      <Tabs id="sequencing-experiment-variant-type" value={activeInterface}>
        <TabsList className="w-full h-7">
          {options.map(({ tooltip, value }: SequencingVariantFiltersOption) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
              data-cy={`tabs-trigger-${value}`}
              onClick={() => {
                onActiveInterfaceChange(value);
              }}
            >
              {tooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{t(`case_entity.variants.filters.${value.toLowerCase()}`)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <>{tooltip}</>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <>{t(`case_entity.variants.filters.${value.toLowerCase()}`)}</>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Separator className="h-7" orientation="vertical" />
      <div id="sequencing-experiment-seq-id">
        <Select
          value={`${selectedSeqId}`}
          onValueChange={value => {
            handleChange(Number(value));
          }}
        >
          <SelectTrigger className="min-w-[125px] max-w-[200px] " size="xs">
            <SelectValue>
              {selectedSequencingExperiment && (
                <SequencingVariantFiltersSelectValue {...selectedSequencingExperiment} />
              )}
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
      </div>
      {/* Task select — shown only when multiple tasks are available */}
      {tasks.length > 1 && (
        <div id="sequencing-experiment-tasks">
          <Select
            value={selectedTaskId ? `${selectedTaskId}` : undefined}
            onValueChange={value => onTaskChange?.(Number(value))}
          >
            <SelectTrigger className="min-w-[125px] max-w-[150px]" size="xs">
              <SelectValue>
                {selectedTask && formatDate(selectedTask.created_on, t('common.date.year_month_day'))}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-w-[200px]">
              <SelectGroup>
                <SelectLabel className="text-muted-foreground text-xs font-medium">
                  {t('case_entity.variants.filters.select_task_label')}
                </SelectLabel>
                <SelectSeparator />
                {tasks.map(task => (
                  <SelectItem key={`task-${task.id}`} value={`${task.id}`}>
                    <span className="inline-flex items-center gap-2">
                      {formatDate(task.created_on, t('common.date.year_month_day'))}
                      {task.id === latestTaskId && (
                        <Badge variant="outline">{t('case_entity.variants.filters.latest')}</Badge>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
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
