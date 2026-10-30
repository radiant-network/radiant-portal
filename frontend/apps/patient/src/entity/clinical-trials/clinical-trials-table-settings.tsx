import type { TFunction } from 'i18next';

import type { PatientTrialEnrollment } from '@/api/api';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { createAppColumnHelper, type TableColumnDef } from '@/components/base/data-table/data-table';

import AgentsCell from './cells/agents-cell';
import ProtocolCell from './cells/protocol-cell';

const columnHelper = createAppColumnHelper<PatientTrialEnrollment>();

function renderDay(day: number | undefined, t: TFunction<string, undefined>) {
  if (day == null) return <EmptyCell />;
  return t('patient_entity.clinical_trials.day_value', { day });
}

function getClinicalTrialsColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor('protocol_name', {
      cell: info => (
        <ProtocolCell
          name={info.getValue()}
          arm={info.row.original.protocol_arm}
          isInitialTreatment={info.row.original.is_initial_treatment}
        />
      ),
      header: t('patient_entity.clinical_trials.columns.protocol'),
      size: 280,
    }),
    columnHelper.accessor(row => row.start.day, {
      id: 'start',
      cell: info => renderDay(info.getValue(), t),
      header: t('patient_entity.clinical_trials.columns.start'),
      size: 128,
    }),
    columnHelper.accessor(row => row.stop.day, {
      id: 'stop',
      cell: info => renderDay(info.getValue(), t),
      header: t('patient_entity.clinical_trials.columns.stop'),
      size: 128,
    }),
    columnHelper.accessor('chemotherapy_agents', {
      cell: info => <AgentsCell agents={info.getValue()} />,
      header: t('patient_entity.clinical_trials.columns.agents'),
    }),
  ] as TableColumnDef<PatientTrialEnrollment, any>[];
}

export { getClinicalTrialsColumns };
