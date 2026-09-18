import type { CaseEntity, CaseExam, CasePatientClinicalInformation, CaseSequencingExperiment } from '@/api/api';

import { FETUS, PROBAND } from '../base/constants';

// patient_id and fetus_id are mutually exclusive on a case member (a fetus has no patient_id) —
// use whichever is set as a stable React key / tab value instead of assuming patient_id exists.
export function getMemberKey(member: CasePatientClinicalInformation): string {
  return member.patient_id !== undefined ? `patient-${member.patient_id}` : `fetus-${member.fetus_id}`;
}

// A prenatal case has no mother member of its own: the proband IS the mother bearing the fetus, so
// her entry is qualified wherever the relationship is shown.
export function isPrenatalMother(
  member: CasePatientClinicalInformation,
  members: CasePatientClinicalInformation[],
): boolean {
  return member.relationship_to_proband === PROBAND && members.some(other => other.relationship_to_proband === FETUS);
}

const OTHER_EXAM_CODE = 'other';

export type GroupedExam = {
  code: string;
  name: string;
  interpretationCode?: string;
  values: string[];
};

// The API sends one row per exam value, so an abnormal exam with several coded findings arrives
// split across rows. A value that merely repeats the interpretation carries nothing, and « other »
// is a catch-all that reads better last.
export function groupExams(exams?: CaseExam[]): GroupedExam[] {
  const grouped = new Map<string, GroupedExam>();

  for (const exam of exams ?? []) {
    const entry = grouped.get(exam.exam_code) ?? {
      code: exam.exam_code,
      name: exam.name || exam.exam_code,
      interpretationCode: exam.interpretation_code,
      values: [],
    };
    const value = exam.value_name || exam.value;

    if (value && value !== exam.interpretation_code) {
      entry.values.push(value);
    }

    grouped.set(exam.exam_code, entry);
  }

  return [...grouped.values()].sort((a, b) => {
    if (a.code === OTHER_EXAM_CODE || b.code === OTHER_EXAM_CODE) {
      return a.code === OTHER_EXAM_CODE ? 1 : -1;
    }

    return a.name.localeCompare(b.name);
  });
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
