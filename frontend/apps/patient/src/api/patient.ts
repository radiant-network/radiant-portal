import type { FiltersValue, ListBodyWithCriteria, PatientsSearchResponse } from '@/api/api';
import { patientsApi } from '@/utils/api';

export async function fetchPatientsList(
  tenant: string,
  body: ListBodyWithCriteria = {},
): Promise<PatientsSearchResponse> {
  const response = await patientsApi.searchPatients(tenant, body);
  return response.data;
}

// TODO: swap for the generated PatientFilters once the backend exposes these buckets
export type PatientFilters = {
  vital_status: FiltersValue[];
  organization_code: FiltersValue[];
  cns_integrated_diagnosis: FiltersValue[];
  protocol: FiltersValue[];
  molecular_subtype: FiltersValue[];
  age_at_initial_dx_days: FiltersValue[];
  had_initial_methotrexate: FiltersValue[];
  had_initial_radiation: FiltersValue[];
  diagnosis_type_cohort: FiltersValue[];
};

// TODO: remove once the backend exposes these buckets
const PATIENT_FILTERS_MOCK: PatientFilters = {
  vital_status: [
    { key: 'alive', label: 'Alive' },
    { key: 'deceased', label: 'Deceased' },
  ],
  organization_code: [
    { key: 'CHOP', label: 'CHOP' },
    { key: 'Seattle', label: "Seattle Children's" },
    { key: 'UCSF', label: 'UCSF' },
  ],
  cns_integrated_diagnosis: [
    { key: 'ATRT-SHH', label: 'ATRT-SHH' },
    { key: 'ATRT-MYC', label: 'ATRT-MYC' },
    { key: 'ATRT, NOS or NEC', label: 'ATRT, NOS or NEC' },
    { key: 'Not Reported', label: 'Not Reported' },
  ],
  protocol: [
    { key: 'seattle_radiant', label: 'Seattle-RADIANT' },
    { key: 'all_radiant', label: 'All RADIANT' },
    { key: 'cumulus', label: "Cumulus (incl. Boston Children's)" },
  ],
  molecular_subtype: [
    { key: 'group_3', label: 'Group 3' },
    { key: 'shh', label: 'SHH' },
    { key: 'etmr', label: 'ETMR' },
    { key: 'pineoblastoma', label: 'Pineoblastoma' },
  ],
  age_at_initial_dx_days: [
    { key: 'lt_36_months', label: '< 36 months' },
    { key: 'gte_36_months', label: '≥ 36 months' },
  ],
  had_initial_methotrexate: [
    { key: 'with_methotrexate', label: '+ Methotrexate' },
    { key: 'without_methotrexate', label: '− Methotrexate' },
  ],
  had_initial_radiation: [
    { key: 'with_radiation', label: 'Yes' },
    { key: 'without_radiation', label: 'No' },
  ],
  diagnosis_type_cohort: [
    { key: 'atrt', label: 'ATRT' },
    { key: 'medulloblastoma', label: 'Medulloblastoma' },
  ],
};

const MOCK_LATENCY_MS = 300;

// TODO: call patientsApi.patientsFilters once the backend exposes the buckets
export async function fetchPatientFilters(): Promise<PatientFilters> {
  await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));
  return PATIENT_FILTERS_MOCK;
}

// TODO: replace with generated type from frontend/api/ once backend endpoint exists
export type PatientExternalRecords = {
  organization: string;
  linked: boolean;
  connected: boolean;
};

// Same placeholder for every patient, lifted from the v6.2 wireframe (Kai Ellery).
// TODO: replace once the backend provides external records
export const PATIENT_EXTERNAL_RECORDS_MOCK: PatientExternalRecords = {
  organization: "The Children's Hospital of Philadelphia",
  linked: true,
  connected: true,
};

// TODO: replace with generated type from frontend/api/ once backend endpoint exists.
// Not in the SJRA-1998 PatientEntity contract — lower priority for November (Build readiness)
// and cancer-specific per the Generalising section of the Patient View analysis.
// Wireframe enum: Rhabdoid tumour (SMARCB1) · Li-Fraumeni (TP53) · NF1 / NF2 · MMR · CMMRD · Lynch syndrome.
export type PatientCancerPredispositions = {
  cancer_predisposition?: string[];
};

// Placeholder lifted from the v6.2 wireframe (Kai Ellery, ATRT-SHH).
const PATIENT_CANCER_PREDISPOSITIONS_MOCK: PatientCancerPredispositions = {
  cancer_predisposition: ['SMARCB1 rhabdoid'],
};

// TODO: replace with a call to the generated patient API client once the backend endpoint lands
export async function fetchPatientCancerPredispositions(_patientId: string): Promise<PatientCancerPredispositions> {
  await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));
  return PATIENT_CANCER_PREDISPOSITIONS_MOCK;
}
