import type { PatientLabResult } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';

import LabDate from '../dates/lab-date';
import LabUnit, { labUnitLabel } from '../units/lab-unit';

import LabTile from './lab-tile';

const COUNT_UNITS: Record<string, number> = {
  '10*3/ul': 1,
  '10^3/ul': 1,
  'k/ul': 1,
  'x10e3/ul': 1,
  'x10e9/l': 1,
  '10^9/l': 1,
  '10*9/l': 1,
  '/ul': 0.001,
  'cells/ul': 0.001,
};

const CANON_COUNT = '×10⁹/L';

type CountNormalisation =
  | { kind: 'canonical'; value: number; unit: string; reported: string | null }
  | { kind: 'unverified'; value: number; unit: string };

export function normaliseCount(value: number, unit: string | undefined): CountNormalisation {
  const factor =
    COUNT_UNITS[
      String(unit ?? '')
        .toLowerCase()
        .trim()
    ];
  if (factor == null) return { kind: 'unverified', value, unit: labUnitLabel(unit) };
  const normalisedValue = +(value * factor).toPrecision(4);
  const reported = factor !== 1 ? `${value} ${labUnitLabel(unit)}` : null;
  return { kind: 'canonical', value: normalisedValue, unit: CANON_COUNT, reported };
}

type CbcTileProps = {
  result: PatientLabResult | undefined;
  day?: number;
  date?: string;
  label: string;
  normaliseAsCount: boolean;
};

function CbcTile({ result, day, date, label, normaliseAsCount }: CbcTileProps) {
  const { t } = useI18n();

  if (!result || result.value == null) {
    return <LabTile label={label} />;
  }

  const meta = <LabDate day={day} date={date} />;

  if (!normaliseAsCount) {
    return (
      <LabTile
        label={label}
        value={result.value}
        unit={<LabUnit unit={result.unit} />}
        unitLabel={labUnitLabel(result.unit)}
        meta={meta}
      />
    );
  }

  const n = normaliseCount(result.value, result.unit);
  if (n.kind === 'unverified') {
    return (
      <LabTile
        label={label}
        value={n.value}
        unit={n.unit}
        unitLabel={n.unit}
        flagText={t('patient_entity.laboratory.lab_tile.unverified')}
        meta={meta}
      />
    );
  }

  return (
    <LabTile
      label={label}
      value={n.value}
      unit={n.unit}
      unitLabel={n.unit}
      reported={n.reported ?? undefined}
      meta={meta}
    />
  );
}

export default CbcTile;
