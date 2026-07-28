import type { CaseEntity, CasePatientClinicalInformation, CaseSequencingExperiment } from '@/api/api';

import { PROBAND } from '../base/constants';

// patient_id and fetus_id are mutually exclusive on a case member (a fetus has no patient_id) —
// use whichever is set as a stable React key / tab value instead of assuming patient_id exists.
export function getMemberKey(member: CasePatientClinicalInformation): string {
  return member.patient_id !== undefined ? `patient-${member.patient_id}` : `fetus-${member.fetus_id}`;
}

export function getPatientClinicalInformation(caseEntity?: CaseEntity, patient?: CaseSequencingExperiment) {
  let information: CasePatientClinicalInformation | undefined;
  if (patient) {
    information = caseEntity?.members.find(member => member.patient_id === patient.patient_id);
  } else {
    information = caseEntity?.members.find(member => member.relationship_to_proband === PROBAND);
  }
  return information;
}

export function getCaseSequencingExperimentByPatient(caseEntity?: CaseEntity, patient?: CaseSequencingExperiment) {
  return caseEntity?.sequencing_experiments.find(seqExp => seqExp.patient_id === patient?.patient_id);
}
