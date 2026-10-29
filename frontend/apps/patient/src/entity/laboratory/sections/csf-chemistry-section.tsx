import { useId } from 'react';

import type { PatientCsf, PatientCsfResult } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';

import LabDate from '../dates/lab-date';
import LabTile from '../tiles/lab-tile';
import LabUnit, { labUnitLabel } from '../units/lab-unit';

type CsfAnalyteKey = 'protein' | 'glucose' | 'wbc' | 'rbc';

const CSF_ANALYTES: ReadonlyArray<{ key: CsfAnalyteKey; labelKey: string }> = [
  { key: 'protein', labelKey: 'patient_entity.laboratory.csf.analytes.protein' },
  { key: 'glucose', labelKey: 'patient_entity.laboratory.csf.analytes.glucose' },
  { key: 'wbc', labelKey: 'patient_entity.laboratory.csf.analytes.nucleated_cells' },
  { key: 'rbc', labelKey: 'patient_entity.laboratory.csf.analytes.rbc' },
];

type CsfResultDisplay = {
  shown: string;
  unit: string;
  tooltip: string | null;
};

export function csfResultDisplay(result: PatientCsfResult | undefined): CsfResultDisplay | null {
  if (!result) return null;
  if (result.value == null && !result.display) return null;
  if (result.value != null) {
    return {
      shown: `${result.comparator ?? ''}${result.value}`,
      unit: result.unit ?? '',
      tooltip: result.display ?? null,
    };
  }
  return { shown: result.display ?? '', unit: '', tooltip: result.display ?? null };
}

type CsfChemistrySectionProps = {
  csf: PatientCsf;
};

function CsfChemistrySection({ csf }: CsfChemistrySectionProps) {
  const { t } = useI18n();
  const titleId = useId();

  return (
    <section className="flex flex-col gap-2" aria-labelledby={titleId}>
      <h3 id={titleId} className="text-sm font-semibold">
        {t('patient_entity.laboratory.csf.chemistry.title')}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CSF_ANALYTES.map(({ key, labelKey }) => {
          const result = csf[key];
          const display = csfResultDisplay(result);
          const label = t(labelKey);
          if (!display) return <LabTile key={key} label={label} />;
          return (
            <LabTile
              key={key}
              label={label}
              value={display.shown}
              unit={<LabUnit unit={display.unit} />}
              unitLabel={labUnitLabel(display.unit)}
              tooltip={display.tooltip ?? undefined}
              meta={<LabDate day={result?.day} date={result?.date} showBoth />}
            />
          );
        })}
      </div>
    </section>
  );
}

export default CsfChemistrySection;
