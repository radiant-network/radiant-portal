import type { TFunction } from 'i18next';

import type { PatientImagingSession } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { createAppColumnHelper, type TableColumnDef } from '@/components/base/data-table/data-table';

import ImagingViewerCell from './cells/imaging-viewer-cell';

const DAYS_PER_YEAR = 365.25;

const columnHelper = createAppColumnHelper<PatientImagingSession>();

function getImagingColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor('day', {
      cell: info => {
        const day = info.getValue();
        if (day == null) return <EmptyCell />;
        return t('patient_entity.imaging.day_age', { day, age: (day / DAYS_PER_YEAR).toFixed(1) });
      },
      header: t('patient_entity.imaging.columns.date'),
      size: 180,
    }),
    columnHelper.accessor('imaging_modality', {
      cell: info => info.getValue() || <EmptyCell />,
      header: t('patient_entity.imaging.columns.modality'),
    }),
    columnHelper.display({
      id: 'viewer',
      cell: ({ row }) => (
        <ImagingViewerCell sessionName={row.original.session_name} flywheelUrl={row.original.flywheel_url} />
      ),
      header: t('patient_entity.imaging.columns.viewer'),
    }),
  ] as TableColumnDef<PatientImagingSession, any>[];
}

export { getImagingColumns };
