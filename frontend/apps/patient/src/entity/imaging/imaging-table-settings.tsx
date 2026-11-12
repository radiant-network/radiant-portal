import type { TFunction } from 'i18next';

import type { PatientImagingSession } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import {
  createAppColumnHelper,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';

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
      size: 64,
    }),
    columnHelper.accessor('imaging_modality', {
      cell: info => info.getValue() || <EmptyCell />,
      header: t('patient_entity.imaging.columns.modality'),
      size: 48,
    }),
    columnHelper.accessor('anatomical_site', {
      cell: info => info.getValue() || <EmptyCell />,
      header: () => (
        <TooltipHeader tooltip={t('patient_entity.imaging.columns.body_part_tooltip')}>
          {t('patient_entity.imaging.columns.body_part')}
        </TooltipHeader>
      ),
      size: 48,
    }),
    columnHelper.display({
      id: 'viewer',
      cell: ({ row }) => (
        <ImagingViewerCell
          sessionName={row.original.session_name}
          flywheelUrl={row.original.flywheel_url}
          clinicalReportUrl={row.original.clinical_report_url}
        />
      ),
      header: t('patient_entity.imaging.columns.viewer'),
      size: 200,
    }),
  ] as TableColumnDef<PatientImagingSession, any>[];
}

const defaultImagingSettings = createColumnSettings([
  { id: 'day', visible: true, label: 'patient_entity.imaging.columns.date' },
  { id: 'imaging_modality', visible: true, label: 'patient_entity.imaging.columns.modality' },
  { id: 'anatomical_site', visible: true, label: 'patient_entity.imaging.columns.body_part' },
  { id: 'viewer', visible: true, label: 'patient_entity.imaging.columns.viewer' },
]);

export { defaultImagingSettings, getImagingColumns };
