import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import { usePatientIdFromParam } from '@/utils/helper';

import {
  fetchPatientCancerPredispositions,
  fetchPatientDemographics,
  fetchPatientInitialDiagnosis,
  fetchPatientTumourAndMetastasis,
  type PatientCancerPredispositions,
  type PatientDemographics,
  type PatientInitialDiagnosis,
  type PatientTumourAndMetastasis,
} from '../../api/patient';
import { PatientEntityTabs } from '../patient-entity-tabs';

import CancerPredispositionsCard from './cancer-predispositions-card';
import DemographicsCard from './demographics-card';
import InitialDiagnosisCard from './initial-diagnosis-card';
import TumourAndMetastasisCard from './tumour-and-metastasis';

function OverviewTab() {
  const patientId = usePatientIdFromParam();
  const [, setSearchParams] = useSearchParams();

  const { data: initialDiagnosis } = useSWR<PatientInitialDiagnosis>(['patient-initial-diagnosis', patientId], () =>
    fetchPatientInitialDiagnosis(patientId),
  );
  const { data: tumourAndMetastasis } = useSWR<PatientTumourAndMetastasis>(
    ['patient-tumour-and-metastasis', patientId],
    () => fetchPatientTumourAndMetastasis(patientId),
  );
  const { data: demographics } = useSWR<PatientDemographics>(['patient-demographics', patientId], () =>
    fetchPatientDemographics(patientId),
  );
  const { data: cancerPredispositions } = useSWR<PatientCancerPredispositions>(
    ['patient-cancer-predispositions', patientId],
    () => fetchPatientCancerPredispositions(patientId),
  );

  return (
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-[minmax(0,1fr)_minmax(auto,26rem)]">
      <div className="flex flex-col gap-4">
        <InitialDiagnosisCard
          cns_diagnosis_category={initialDiagnosis?.cns_diagnosis_category}
          cns_integrated_diagnosis={initialDiagnosis?.cns_integrated_diagnosis}
          event_date={initialDiagnosis?.event_date}
          source_of_event_diagnosis={initialDiagnosis?.source_of_event_diagnosis}
          date_of_initial_diagnosis_mri={initialDiagnosis?.date_of_initial_diagnosis_mri}
          event_count={initialDiagnosis?.event_count}
          onViewTimeline={() => setSearchParams({ tab: PatientEntityTabs.Timeline })}
        />
        <TumourAndMetastasisCard
          tumor_locations={tumourAndMetastasis?.tumor_locations}
          tumor_location_other={tumourAndMetastasis?.tumor_location_other}
          laterality={tumourAndMetastasis?.laterality}
          metastasis={tumourAndMetastasis?.metastasis}
          m_stage={tumourAndMetastasis?.m_stage}
          metastasis_location={tumourAndMetastasis?.metastasis_location}
          metastasis_location_other={tumourAndMetastasis?.metastasis_location_other}
          symptoms_at_event={tumourAndMetastasis?.symptoms_at_event}
          event_type={tumourAndMetastasis?.event_type}
          event_day={tumourAndMetastasis?.event_day}
        />
      </div>
      <div className="flex flex-col gap-4">
        <DemographicsCard
          mrn={demographics?.mrn}
          birth_year={demographics?.birth_year}
          gender={demographics?.gender}
          race={demographics?.race}
          ethnicity={demographics?.ethnicity}
          address_postal_code={demographics?.address_postal_code}
          organization_name={demographics?.organization_name}
        />
        <CancerPredispositionsCard cancer_predisposition={cancerPredispositions?.cancer_predisposition} />
      </div>
    </div>
  );
}

export default OverviewTab;
