import type {
  ListBodyWithCriteria,
  PatientFilters,
  PatientGenomics,
  PatientImaging,
  PatientLaboratory,
  PatientsSearchResponse,
  PatientTreatments,
} from '@/api/api';
import { patientsApi } from '@/utils/api';

export async function fetchPatientsList(
  tenant: string,
  body: ListBodyWithCriteria = {},
): Promise<PatientsSearchResponse> {
  const response = await patientsApi.searchPatients(tenant, body);
  return response.data;
}

export async function fetchPatientFilters(tenant: string): Promise<PatientFilters> {
  const response = await patientsApi.patientsFilters(tenant);
  return response.data;
}

export async function fetchPatientTreatments(tenant: string, patientKey: string): Promise<PatientTreatments> {
  const response = await patientsApi.patientTreatments(tenant, patientKey);
  return response.data;
}

export async function fetchPatientLaboratory(tenant: string, patientKey: string): Promise<PatientLaboratory> {
  const response = await patientsApi.patientLaboratory(tenant, patientKey);
  return response.data;
}

export async function fetchPatientImaging(tenant: string, patientKey: string): Promise<PatientImaging> {
  const response = await patientsApi.patientImaging(tenant, patientKey);
  return response.data;
}

export async function fetchPatientGenomics(tenant: string, patientKey: string): Promise<PatientGenomics> {
  const response = await patientsApi.patientGenomics(tenant, patientKey);
  return response.data;
}

const MOCK_LATENCY_MS = 300;

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
