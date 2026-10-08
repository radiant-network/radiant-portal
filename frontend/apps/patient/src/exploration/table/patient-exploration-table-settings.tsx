import type { TFunction } from 'i18next';

import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import { createAppColumnHelper } from '@/components/base/data-table/data-table';
import { createColumnSettings, type TableColumnDef } from '@/components/base/data-table/data-table';

import type { Patient } from '../../api/patient';

import PatientLinkCell from './cells/patient-link-cell';
import SurvivalCell from './cells/survival-cell';
import VitalStatusCell from './cells/vital-status-cell';

const columnHelper = createAppColumnHelper<Patient>();

function getPatientExplorationColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor(row => row.name, {
      id: 'patient',
      cell: info => <PatientLinkCell patient={info.row.original} />,
      header: t('patient_exploration.columns.patient'),
      size: 180,
      minSize: 120,
    }),
    columnHelper.accessor(row => row.mrn, {
      id: 'mrn',
      cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
      header: t('patient_exploration.columns.mrn'),
      size: 140,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.birth_year, {
      id: 'birth_year',
      cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
      header: t('patient_exploration.columns.birth_year'),
      size: 96,
      minSize: 60,
    }),
    columnHelper.accessor(row => row.sex, {
      id: 'sex',
      cell: info => info.getValue(),
      header: t('patient_exploration.columns.sex'),
      size: 80,
      minSize: 60,
    }),
    columnHelper.accessor(row => row.site, {
      id: 'site',
      cell: info => <BadgeCell variant="secondary">{info.getValue()}</BadgeCell>,
      header: t('patient_exploration.columns.site'),
      size: 100,
      minSize: 60,
    }),
    columnHelper.accessor(row => row.cns_integrated_diagnosis, {
      id: 'cns_integrated_diagnosis',
      cell: info => info.getValue(),
      header: t('patient_exploration.columns.cns_integrated_diagnosis'),
      size: 180,
      minSize: 100,
    }),
    columnHelper.accessor(row => row.vital_status, {
      id: 'vital_status',
      cell: info => <VitalStatusCell value={info.getValue()} />,
      header: t('patient_exploration.columns.vital_status'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.survival_days, {
      id: 'survival',
      cell: info => <SurvivalCell days={info.getValue()} />,
      header: t('patient_exploration.columns.survival'),
      size: 112,
      minSize: 80,
    }),
  ] as TableColumnDef<Patient, any>[];
}

const defaultSettings = createColumnSettings([
  { id: 'patient', visible: true, label: 'patient_exploration.columns.patient' },
  { id: 'mrn', visible: true, label: 'patient_exploration.columns.mrn' },
  { id: 'birth_year', visible: true, label: 'patient_exploration.columns.birth_year' },
  { id: 'sex', visible: true, label: 'patient_exploration.columns.sex' },
  { id: 'site', visible: true, label: 'patient_exploration.columns.site' },
  {
    id: 'cns_integrated_diagnosis',
    visible: true,
    label: 'patient_exploration.columns.cns_integrated_diagnosis',
  },
  { id: 'vital_status', visible: true, label: 'patient_exploration.columns.vital_status' },
  { id: 'survival', visible: true, label: 'patient_exploration.columns.survival' },
]);

export { getPatientExplorationColumns, defaultSettings };
