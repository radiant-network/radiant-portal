import type { PatientEntity } from '@/api/api';

import ClinicalNoteExtractionCard from '../sidebar/clinical-note-extraction-card';
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
      <ExternalRecordsCard />
      {patient?.has_processing_report && <ClinicalNoteExtractionCard patientKey={patient.patient_key} />}
    </aside>
  );
}

export default Sidebar;
