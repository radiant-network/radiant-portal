import { type PatientEntity, PatientEntityPatientIdTypeEnum } from '@/api/api';

export const MASKED_MRN = '***';

export function derivePatientMrn(patient: PatientEntity | undefined): string | undefined {
  if (patient?.patient_id_type !== PatientEntityPatientIdTypeEnum.Mrn) {
    return undefined;
  }
  return patient.can_read_phi ? patient.patient_id : MASKED_MRN;
}
