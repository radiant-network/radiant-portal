import { useEffect, useState } from 'react';
import { Flag, type LucideIcon, Pin, Star } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';

import type { OccurrenceFlagType } from '@/api/api';
import { Button, type ButtonProps } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { cn } from '@/components/lib/utils';
import { occurrenceFlagApi } from '@/utils/api';

import { useDataTable } from '../data-table/hooks/use-data-table';

type DeleteOccurrenceFlagInput = {
  caseId: number;
  occurrenceId: string;
  taskId: number;
  seqId: number;
};

type UpsertOccurrenceFlagInput = DeleteOccurrenceFlagInput & {
  flag: OccurrenceFlagType;
};

export type OccurrenceFlagDropdownProps = ButtonProps & {
  occurrenceId: string;
  caseId?: number;
  taskId: number;
  seqId: number;
  flag?: OccurrenceFlagType;
  canFlag?: boolean;
};

type OccurrenceFlagConfig = Record<
  OccurrenceFlagType,
  {
    Icon: LucideIcon;
    className: string;
    label: string;
  }
>;

export const FLAGS = {
  flag: {
    Icon: Flag,
    className: 'text-indicator-red fill-indicator-red',
    label: 'flag',
  },
  pin: {
    Icon: Pin,
    className: 'text-indicator-amber fill-indicator-amber',
    label: 'pin',
  },
  star: {
    Icon: Star,
    className: 'text-indicator-blue fill-indicator-blue',
    label: 'star',
  },
} as OccurrenceFlagConfig;

async function saveOccurrenceFlag(_url: string, { arg }: { arg: UpsertOccurrenceFlagInput }, tenant: string) {
  const response = await occurrenceFlagApi.upsertOccurrenceFlag(
    tenant,
    arg.caseId,
    arg.seqId,
    arg.taskId,
    arg.occurrenceId,
    arg.flag,
  );
  return response.data;
}

async function deleteOccurrenceFlag(_url: string, { arg }: { arg: DeleteOccurrenceFlagInput }, tenant: string) {
  const response = await occurrenceFlagApi.deleteOccurrenceFlag(
    tenant,
    arg.caseId,
    arg.seqId,
    arg.taskId,
    arg.occurrenceId,
  );
  return response.data;
}

function OccurrenceFlagDropdown({
  caseId,
  taskId,
  seqId,
  occurrenceId,
  flag,
  variant,
  canFlag = true,
  ...props
}: OccurrenceFlagDropdownProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const { list, count } = useDataTable();
  const saveFlag = useSWRMutation(
    `upsert-occurrence-flag-${caseId}-${taskId}-${seqId}-${occurrenceId}`,
    (key: string, opts: { arg: UpsertOccurrenceFlagInput }) => saveOccurrenceFlag(key, opts, tenant),
  );
  const deleteFlag = useSWRMutation(
    `delete-occurrence-flag-${caseId}-${taskId}-${seqId}-${occurrenceId}`,
    (key: string, opts: { arg: DeleteOccurrenceFlagInput }) => deleteOccurrenceFlag(key, opts, tenant),
  );
  const [selectedFlag, setSelectedFlag] = useState<OccurrenceFlagType | null>(flag ?? null);
  const selectedFlagConfig = selectedFlag ? FLAGS[selectedFlag] : null;

  // Prevent data-table cache to reset to previous value
  useEffect(() => {
    setSelectedFlag(flag ?? null);
  }, [flag, caseId, taskId, seqId, occurrenceId]);

  const flagIcon = selectedFlagConfig ? (
    <selectedFlagConfig.Icon size={16} className={selectedFlagConfig.className} />
  ) : (
    <Flag size={16} className={cn({ 'text-muted-foreground/40': variant === 'ghost' })} />
  );

  if (!canFlag) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            variant={variant}
            iconOnly
            aria-disabled
            className={cn('cursor-default hover:bg-transparent', props.className)}
          >
            {flagIcon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {selectedFlag ? t('occurrence_flag.tooltip.flagged') : t('occurrence_flag.tooltip.unflagged')}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props} variant={variant} iconOnly>
          {flagIcon}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {Object.keys(FLAGS).map(key => {
          const flagConfig = FLAGS[key as keyof OccurrenceFlagConfig];
          return (
            <DropdownMenuCheckboxItem
              key={key}
              checked={selectedFlag === key}
              onSelect={() => {
                if (!caseId) return;

                if (selectedFlag === key) {
                  setSelectedFlag(null);
                  deleteFlag
                    .trigger({
                      caseId,
                      taskId,
                      seqId,
                      occurrenceId,
                    })
                    .then(() => {
                      count?.mutate();
                      list?.mutate();
                    })
                    .catch(() => {
                      setSelectedFlag(flag ?? null);
                      toast.error(t('occurrence_flag.error'));
                    });
                  return;
                }

                saveFlag
                  .trigger({
                    caseId,
                    taskId,
                    seqId,
                    occurrenceId,
                    flag: key as OccurrenceFlagType,
                  })
                  .then(() => {
                    list?.mutate();
                    count?.mutate();
                  })
                  .catch(() => {
                    setSelectedFlag(flag ?? null);
                    toast.error(t('occurrence_flag.error'));
                  });
                setSelectedFlag(key as OccurrenceFlagType);
              }}
            >
              <span className="flex items-center gap-2">
                <flagConfig.Icon className={flagConfig.className} size={14} />
                <span>{t(`occurrence_flag.${flagConfig.label}`)}</span>
              </span>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default OccurrenceFlagDropdown;
