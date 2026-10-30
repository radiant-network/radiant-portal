import type { CaseEntity, CaseExam, CasePatientClinicalInformation, CaseSequencingExperiment } from '@/api/api';

import { FETUS, PROBAND } from '../base/constants';

// patient_id and fetus_id are mutually exclusive on a case member (a fetus has no patient_id) —
// use whichever is set as a stable React key / tab value instead of assuming patient_id exists.
export function getMemberKey(member: CasePatientClinicalInformation): string {
  return member.patient_id !== undefined ? `patient-${member.patient_id}` : `fetus-${member.fetus_id}`;
}

// Members and sequencing experiments both carry a relationship and, for a fetal one, a fetus id —
// the helpers below serve either, so the case lists the same subjects in the same order everywhere.
type CaseSubject = { relationship_to_proband?: string; fetus_id?: number };

// A prenatal case has no mother member of its own: the proband IS the mother bearing the fetus, so
// her entry is qualified wherever the relationship is shown.
export function isPrenatalMother(subject: CaseSubject, all: CaseSubject[]): boolean {
  return subject.relationship_to_proband === PROBAND && all.some(other => other.relationship_to_proband === FETUS);
}

// Fetuses lead: they are the clinical subjects of a prenatal case. Relies on a stable sort to leave
// everyone else in the order the API sent them.
export function bySubjectFirst(a: CaseSubject, b: CaseSubject): number {
  const aFetus = a.relationship_to_proband === FETUS;
  const bFetus = b.relationship_to_proband === FETUS;

  if (aFetus !== bFetus) {
    return aFetus ? -1 : 1;
  }

  return aFetus ? (a.fetus_id ?? 0) - (b.fetus_id ?? 0) : 0;
}

// The patient tabs lead with the proband — the case's identity anchor — where the clinical card
// leads with the fetuses. They still follow in id order, so the numbering matches across screens.
export function byProbandFirst(a: CaseSubject, b: CaseSubject): number {
  const aProband = a.relationship_to_proband === PROBAND;
  const bProband = b.relationship_to_proband === PROBAND;

  if (aProband !== bProband) {
    return aProband ? -1 : 1;
  }

  return bySubjectFirst(a, b);
}

// A fetus has no name, so its rank among the case's fetuses is what tells it apart. Undefined when
// there is nothing to tell apart — a lone fetus is just « the fetus ».
export function getFetusRank(subject: CaseSubject, all: CaseSubject[]): number | undefined {
  if (subject.relationship_to_proband !== FETUS || subject.fetus_id === undefined) {
    return undefined;
  }

  const ids = [...new Set(all.map(other => other.fetus_id).filter(id => id !== undefined))].sort((a, b) => a - b);

  return ids.length > 1 ? ids.indexOf(subject.fetus_id) + 1 : undefined;
}

export type CaseSubjects = {
  subjects: CasePatientClinicalInformation[];
  relatives: CasePatientClinicalInformation[];
};

// On a prenatal case the clinical subject is the fetus, yet the proband relationship is carried by
// the mother — so the fetuses become the subjects and she joins the relatives. They are ordered by
// id because the API leaves members of equal relationship and affected status unordered.
export function getCaseSubjects(members: CasePatientClinicalInformation[]): CaseSubjects {
  const fetuses = members.filter(member => member.relationship_to_proband === FETUS);

  if (fetuses.length > 0) {
    return {
      subjects: [...fetuses].sort((a, b) => (a.fetus_id ?? 0) - (b.fetus_id ?? 0)),
      relatives: members.filter(member => member.relationship_to_proband && member.relationship_to_proband !== FETUS),
    };
  }

  return {
    subjects: members.filter(member => member.relationship_to_proband === PROBAND),
    relatives: members.filter(member => member.relationship_to_proband && member.relationship_to_proband !== PROBAND),
  };
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
