import type { ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type LabTileProps = {
  label: string;
  value?: ReactNode;
  unit?: ReactNode;
  unitLabel?: string;
  reported?: string;
  flagText?: string;
  meta?: ReactNode;
  tooltip?: string;
};

function LabTile({ label, value, unit, unitLabel, reported, flagText, meta, tooltip }: LabTileProps) {
  const { t } = useI18n();
  const isEmpty = value == null || value === '';
  const ariaValue = isEmpty
    ? t('patient_entity.laboratory.lab_tile.aria_empty', { label })
    : t('patient_entity.laboratory.lab_tile.aria_value', {
        label,
        value: String(value),
        unit: unitLabel ?? '',
      });

  const body = (
    <div
      role="group"
      aria-label={ariaValue}
      className={cn(
        'flex flex-col gap-1 rounded-md border bg-card p-3 text-left',
        isEmpty && 'bg-muted/30',
        tooltip && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- tooltip trigger made focusable so keyboard users can open it
      tabIndex={tooltip ? 0 : undefined}
    >
      <div className="flex items-baseline gap-1 text-2xl font-semibold leading-none">
        <span>{isEmpty ? '—' : value}</span>
        {!isEmpty && unit ? <span className="text-sm font-normal text-muted-foreground">{unit}</span> : null}
      </div>
      <div className="text-sm font-medium">{label}</div>
      {reported ? (
        <div className="text-xs text-muted-foreground">
          {t('patient_entity.laboratory.lab_tile.reported', { reported })}
        </div>
      ) : null}
      {flagText ? (
        <div className="inline-flex items-center gap-1 text-xs text-amber-foreground">
          <TriangleAlert className="size-3" aria-hidden />
          {flagText}
        </div>
      ) : null}
      <div className="text-xs text-muted-foreground">
        {isEmpty ? t('patient_entity.laboratory.lab_tile.no_result') : meta}
      </div>
    </div>
  );

  if (!tooltip) return body;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{body}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export default LabTile;
