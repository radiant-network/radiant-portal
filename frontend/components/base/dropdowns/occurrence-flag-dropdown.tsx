import { useState } from 'react';
import { Flag, LucideIcon, Pin, Star } from 'lucide-react';
import useSWRMutation from 'swr/mutation';

import { OccurrenceFlagType } from '@/api/api';
import { Button, ButtonProps } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';
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

async function saveOccurrenceFlag(_url: string, { arg }: { arg: UpsertOccurrenceFlagInput }) {
  const response = await occurrenceFlagApi.upsertOccurrenceFlag(
    arg.caseId,
    arg.seqId,
    arg.taskId,
    arg.occurrenceId,
    arg.flag,
  );
  return response.data;
}

async function deleteOccurrenceFlag(_url: string, { arg }: { arg: DeleteOccurrenceFlagInput }) {
  const response = await occurrenceFlagApi.deleteOccurrenceFlag(arg.caseId, arg.seqId, arg.taskId, arg.occurrenceId);
  return response.data;
}

function OccurrenceFlagDropdown({
  caseId,
  taskId,
  seqId,
  occurrenceId,
  flag,
  variant,
  ...props
}: OccurrenceFlagDropdownProps) {
  const { t } = useI18n();
  const { list } = useDataTable();
  const saveFlag = useSWRMutation(
    `upsert-occurrence-flag-${caseId}-${taskId}-${seqId}-${occurrenceId}`,
    saveOccurrenceFlag,
  );
  const deleteFlag = useSWRMutation(
    `delete-occurrence-flag-${caseId}-${taskId}-${seqId}-${occurrenceId}`,
    deleteOccurrenceFlag,
  );
  const [selectedFlag, setSelectedFlag] = useState<OccurrenceFlagType | null>(flag ?? null);
  const selectedFlagConfig = selectedFlag ? FLAGS[selectedFlag] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props} variant={variant} iconOnly>
          {selectedFlagConfig ? (
            <selectedFlagConfig.Icon size={16} className={selectedFlagConfig.className} />
          ) : (
            <Flag size={16} className={cn({ 'text-muted-foreground/40': variant === 'ghost' })} />
          )}
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
                      list?.mutate();
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
