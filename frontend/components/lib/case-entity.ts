import { CaseEntity, CasePatientClinicalInformation, CaseSequencingExperiment } from '@/api/api';
import { PROBAND } from '../base/constants';

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
