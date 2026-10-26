import { type PatientEntity, type PatientEvent, PatientEventEventTypeEnum } from '@/api/api';

import { derivePatientMrn } from '../patient-mrn';

import DemographicsCard from './demographics-card';
import InitialDiagnosisCard from './initial-diagnosis-card';
import TumourAndMetastasisCard from './tumour-and-metastasis';

type OverviewTabProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function OverviewTab({ patient, isLoading }: OverviewTabProps) {
  const events = patient?.events ?? [];
  const initialEvent = events.find(e => e.event_type === PatientEventEventTypeEnum.InitialCnsTumor);
  const latestEvent = events.reduce<PatientEvent | undefined>(
    (acc, e) => ((acc?.day ?? -Infinity) < (e.day ?? -Infinity) ? e : acc),
    undefined,
  );

  const mrn = derivePatientMrn(patient);

  return (
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-[minmax(0,1fr)_minmax(auto,26rem)]">
      <div className="flex flex-col gap-4">
        <InitialDiagnosisCard
          cns_diagnosis_category={initialEvent?.cns_diagnosis_category}
          cns_integrated_diagnosis={initialEvent?.cns_integrated_diagnosis}
          event_day={initialEvent?.day}
          isLoading={isLoading}
        />
        <TumourAndMetastasisCard
          tumor_locations={latestEvent?.tumor_locations}
          tumor_location_other={latestEvent?.tumor_location_other}
          metastasis={latestEvent?.metastasis}
          metastasis_locations={latestEvent?.metastasis_locations}
          metastasis_location_other={latestEvent?.metastasis_location_other}
          isLoading={isLoading}
        />
      </div>
      <div className="flex flex-col gap-4">
        <DemographicsCard
          mrn={mrn}
          birth_year={patient?.birth_year}
          gender={patient?.gender}
          race={patient?.race}
          ethnicity={patient?.ethnicity}
          postal_code={patient?.postal_code}
          organization_name={patient?.organization_name}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default OverviewTab;
