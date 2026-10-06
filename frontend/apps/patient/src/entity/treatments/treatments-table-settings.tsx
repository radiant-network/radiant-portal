import { Fragment } from 'react';
import type { TFunction } from 'i18next';

import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { createAppColumnHelper, type TableColumnDef } from '@/components/base/data-table/data-table';
import { Badge } from '@/components/base/shadcn/badge';

import { DOSE_KEYS, type TreatmentRow } from './treatment-rows';

const columnHelper = createAppColumnHelper<TreatmentRow>();

function getTreatmentsColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor('day', {
      cell: info => {
        const day = info.getValue();
        return day == null ? <EmptyCell /> : t('patient_entity.treatments.day_value', { day });
      },
      header: t('patient_entity.treatments.columns.day'),
      size: 112,
    }),
    columnHelper.accessor('type', {
      cell: info => (
        <BadgeCell variant="secondary">{t(`patient_entity.treatments.types.${info.getValue()}`)}</BadgeCell>
      ),
      header: t('patient_entity.treatments.columns.type'),
      size: 160,
    }),
    columnHelper.accessor('description', {
      cell: info => {
        const description = info.getValue();
        if (!Array.isArray(description)) return description || <EmptyCell />;
        if (description.length === 0) return <EmptyCell />;
        return (
          <div className="flex flex-wrap gap-1">
            {description.map(agent => (
              <Badge key={agent} variant="outline">
                {agent}
              </Badge>
            ))}
          </div>
        );
      },
      header: t('patient_entity.treatments.columns.description'),
    }),
    columnHelper.accessor('doses', {
      cell: info => {
        const doses = info.getValue();
        if (!doses) return <EmptyCell />;
        return (
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
            {DOSE_KEYS.map(key => (
              <Fragment key={key}>
                <dt className="text-muted-foreground">{t(`patient_entity.treatments.doses.${key}`)}</dt>
                <dd>{doses[key] ?? <EmptyCell />}</dd>
              </Fragment>
            ))}
          </dl>
        );
      },
      header: t('patient_entity.treatments.columns.dose'),
      size: 200,
    }),
  ] as TableColumnDef<TreatmentRow, any>[];
}

export { getTreatmentsColumns };
