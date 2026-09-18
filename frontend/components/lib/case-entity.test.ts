import { describe, expect, it } from 'vitest';

import type { CasePatientClinicalInformation } from '@/api/api';

import { groupExams, isPrenatalMother } from './case-entity';

function member(relationship: string): CasePatientClinicalInformation {
  return { relationship_to_proband: relationship } as CasePatientClinicalInformation;
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
