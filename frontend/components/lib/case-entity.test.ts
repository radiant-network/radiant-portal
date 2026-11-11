import { describe, expect, it } from 'vitest';

import type { CasePatientClinicalInformation } from '@/api/api';

import { byProbandFirst, getCaseSubjects, getFetusRank, groupExams, isPrenatalMother } from './case-entity';

function member(relationship: string): CasePatientClinicalInformation {
  return { relationship_to_proband: relationship } as CasePatientClinicalInformation;
}

function fetus(fetusId: number): CasePatientClinicalInformation {
  return { relationship_to_proband: 'fetus', fetus_id: fetusId } as CasePatientClinicalInformation;
}

describe('isPrenatalMother', () => {
  it('qualifies the proband of a prenatal case', () => {
    const members = [member('proband'), member('fetus')];

    expect(isPrenatalMother(members[0], members)).toBe(true);
  });

  it('qualifies her on a twin pregnancy too', () => {
    const members = [member('proband'), member('fetus'), member('fetus')];

    expect(isPrenatalMother(members[0], members)).toBe(true);
  });

  it('leaves the proband of a postnatal case alone', () => {
    const members = [member('proband'), member('mother')];

    expect(isPrenatalMother(members[0], members)).toBe(false);
  });

  it('never qualifies a member other than the proband', () => {
    const members = [member('proband'), member('father'), member('fetus')];

    expect(isPrenatalMother(members[1], members)).toBe(false);
  });
});

describe('groupExams', () => {
  it('regroups the rows an exam was split into, one per coded value', () => {
    const grouped = groupExams([
      { exam_code: 'emg', name: 'Electromyography', interpretation_code: 'abnormal', value_name: 'EMG abnormality' },
      { exam_code: 'emg', name: 'Electromyography', interpretation_code: 'abnormal', value_name: 'Neurogenic changes' },
    ]);

    expect(grouped).toEqual([
      {
        code: 'emg',
        name: 'Electromyography',
        interpretationCode: 'abnormal',
        values: ['EMG abnormality', 'Neurogenic changes'],
      },
    ]);
  });

  it('drops a value that only repeats the interpretation', () => {
    const grouped = groupExams([
      { exam_code: 'ecar', name: 'Echocardiography', interpretation_code: 'normal', value: 'normal' },
    ]);

    expect(grouped[0].values).toEqual([]);
  });

  it('falls back to the raw value when the code is not resolved to a label', () => {
    const grouped = groupExams([
      { exam_code: 'irmc', name: 'MRI', interpretation_code: 'abnormal', value: 'Ventriculomégalie' },
    ]);

    expect(grouped[0].values).toEqual(['Ventriculomégalie']);
  });

  it('sorts on the label and keeps the catch-all exam last', () => {
    const grouped = groupExams([
      { exam_code: 'other', name: 'Other' },
      { exam_code: 'irmc', name: 'MRI' },
      { exam_code: 'ecar', name: 'Echocardiography' },
    ]);

    expect(grouped.map(exam => exam.code)).toEqual(['ecar', 'irmc', 'other']);
  });
});

describe('getCaseSubjects', () => {
  it('makes the fetus the subject and sends the mother to the relatives', () => {
    const [mother, unborn] = [member('proband'), fetus(5)];

    const { subjects, relatives } = getCaseSubjects([mother, unborn]);

    expect(subjects).toEqual([unborn]);
    expect(relatives).toEqual([mother]);
  });

  // The API leaves members of equal relationship and affected status unordered.
  it('orders the fetuses by id, whatever order they arrive in', () => {
    const [third, first, second] = [fetus(9), fetus(2), fetus(4)];

    const { subjects } = getCaseSubjects([member('proband'), third, first, second]);

    expect(subjects.map(subject => subject.fetus_id)).toEqual([2, 4, 9]);
  });

  it('leaves a postnatal case on its proband', () => {
    const [proband, father] = [member('proband'), member('father')];

    const { subjects, relatives } = getCaseSubjects([proband, father]);

    expect(subjects).toEqual([proband]);
    expect(relatives).toEqual([father]);
  });

  it('drops a member carrying no relationship', () => {
    const orphan = { patient_id: 1 } as CasePatientClinicalInformation;

    const { subjects, relatives } = getCaseSubjects([member('proband'), orphan]);

    expect(subjects).toHaveLength(1);
    expect(relatives).toEqual([]);
  });
});

describe('byProbandFirst', () => {
  it('leads with the proband, then the fetuses in id order', () => {
    const members = [fetus(9), member('father'), member('proband'), fetus(2)];

    const ordered = [...members].sort(byProbandFirst);

    expect(ordered.map(m => m.relationship_to_proband)).toEqual(['proband', 'fetus', 'fetus', 'father']);
    expect(ordered.map(m => m.fetus_id)).toEqual([undefined, 2, 9, undefined]);
  });
});

describe('getFetusRank', () => {
  // The rank must not depend on the order the caller happens to hold the members in.
  it('ranks by fetus id whatever the list order', () => {
    const [first, second] = [fetus(2), fetus(9)];
    const members = [member('proband'), second, first];

    expect(getFetusRank(first, members)).toBe(1);
    expect(getFetusRank(second, members)).toBe(2);
  });

  it('leaves a lone fetus unranked', () => {
    const only = fetus(5);

    expect(getFetusRank(only, [member('proband'), only])).toBeUndefined();
  });

  it('never ranks a member who is not a fetus', () => {
    const members = [member('proband'), fetus(2), fetus(9)];

    expect(getFetusRank(members[0], members)).toBeUndefined();
  });
});
