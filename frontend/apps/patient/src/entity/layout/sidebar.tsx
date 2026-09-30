import useSWR from 'swr';

import { fetchPatientSidebarInfo, type PatientSidebarInfo } from '../../api/patient';
import ExternalRecordsCard from '../sidebar/external-records-card';
import KeyDatesCard from '../sidebar/key-dates-card';

type SidebarProps = {
  patientId: string;
};

function Sidebar({ patientId }: SidebarProps) {
  const { data, isLoading } = useSWR<PatientSidebarInfo>(['patient-sidebar', patientId], () =>
    fetchPatientSidebarInfo(patientId),
  );

  return (
    <aside className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:flex lg:sticky lg:top-4">
      <KeyDatesCard
        initialDiagnosis={data?.initial_diagnosis}
        latestEncounter={data?.latest_encounter}
        isLoading={isLoading}
      />
      <ExternalRecordsCard externalRecords={data?.external_records} isLoading={isLoading} />
    </aside>
  );
}

export default Sidebar;
