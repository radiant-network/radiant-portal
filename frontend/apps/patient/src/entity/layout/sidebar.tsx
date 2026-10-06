import type { PatientEntity } from '@/api/api';

import { PATIENT_EXTERNAL_RECORDS_MOCK } from '../../api/patient';
import ExternalRecordsCard from '../sidebar/external-records-card';
import KeyDatesCard from '../sidebar/key-dates-card';

type SidebarProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function Sidebar({ patient, isLoading }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:flex lg:sticky lg:top-4">
      <KeyDatesCard
        initialDiagnosis={patient?.key_dates.initial_diagnosis}
        latestEncounter={patient?.key_dates.latest_encounter}
        isLoading={isLoading}
      />
      <ExternalRecordsCard externalRecords={PATIENT_EXTERNAL_RECORDS_MOCK} isLoading={isLoading} />
    </aside>
  );
}

export default Sidebar;
