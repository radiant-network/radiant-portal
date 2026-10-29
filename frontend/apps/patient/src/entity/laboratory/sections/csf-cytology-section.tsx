import { useId } from 'react';
import { TriangleAlert } from 'lucide-react';

import type { PatientCsfCytology } from '@/api/api';
import InformationField from '@/components/base/information/information-field';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import LabDate from '../dates/lab-date';

type CytologyBadge = {
  variant: 'red' | 'amber' | 'neutral' | 'outline';
  textKey: string;
};

const CYTOLOGY_MAP: Record<string, CytologyBadge> = {
  positive: { variant: 'red', textKey: 'patient_entity.laboratory.csf.cytology.badge.positive' },
  suspicious: { variant: 'amber', textKey: 'patient_entity.laboratory.csf.cytology.badge.suspicious' },
  negative: { variant: 'neutral', textKey: 'patient_entity.laboratory.csf.cytology.badge.negative' },
  non_diagnostic: { variant: 'amber', textKey: 'patient_entity.laboratory.csf.cytology.badge.non_diagnostic' },
  no_malignancy_statement: {
    variant: 'outline',
    textKey: 'patient_entity.laboratory.csf.cytology.badge.no_malignancy_statement',
  },
};

const CYTOLOGY_UNKNOWN: CytologyBadge = {
  variant: 'amber',
  textKey: 'patient_entity.laboratory.csf.cytology.badge.unknown',
};

export function cytologyMapping(malignantCells: string | undefined): CytologyBadge | null {
  if (!malignantCells) return null;
  return CYTOLOGY_MAP[malignantCells.toLowerCase()] ?? CYTOLOGY_UNKNOWN;
}

export function cytologyConfidenceWeak(
  evidenceTier: string | undefined,
  multiSpecimenReport: boolean | undefined,
): boolean {
  return evidenceTier === 'same_day_only' || multiSpecimenReport === true;
}

export function evidenceTierNoteKey(evidenceTier: string | undefined): string | null {
  if (evidenceTier === 'text_confirmed') return 'patient_entity.laboratory.csf.cytology.tier_note.text_confirmed';
  if (evidenceTier === 'same_day_only') return 'patient_entity.laboratory.csf.cytology.tier_note.same_day_only';
  return null;
}

type CsfCytologySectionProps = {
  cytology: PatientCsfCytology;
};

function CsfCytologySection({ cytology }: CsfCytologySectionProps) {
  const { t } = useI18n();
  const titleId = useId();
  const mapping = cytologyMapping(cytology.malignant_cells);
  const weak = cytologyConfidenceWeak(cytology.evidence_tier, cytology.multi_specimen_report);
  const effectiveVariant = mapping && weak ? 'outline' : mapping?.variant;

  const tierNoteKey = evidenceTierNoteKey(cytology.evidence_tier);
  const warnings = [
    tierNoteKey ? t(tierNoteKey) : null,
    cytology.multi_specimen_report === true ? t('patient_entity.laboratory.csf.cytology.multi_specimen_warning') : null,
  ].filter((w): w is string => w !== null);

  let multiSpecimenValue: string | undefined;
  if (cytology.multi_specimen_report === true) {
    multiSpecimenValue = t('patient_entity.laboratory.csf.cytology.multi_specimen.yes');
  } else if (cytology.multi_specimen_report === false) {
    multiSpecimenValue = t('patient_entity.laboratory.csf.cytology.multi_specimen.no');
  }

  return (
    <section className="flex flex-col gap-2" aria-labelledby={titleId}>
      <h3 id={titleId} className="text-sm font-semibold">
        {t('patient_entity.laboratory.csf.cytology.title')}
      </h3>
      <div className="flex flex-col gap-3 rounded-md border p-3">
        <div>
          {mapping ? (
            <Badge variant={effectiveVariant}>{t(mapping.textKey)}</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">
              {t('patient_entity.laboratory.csf.cytology.badge.empty')}
            </span>
          )}
        </div>
        {warnings.map(warning => (
          <div key={warning} className="inline-flex items-start gap-1 text-xs text-amber-foreground">
            <TriangleAlert className="mt-0.5 size-3 shrink-0" aria-hidden />
            <span>{warning}</span>
          </div>
        ))}
        <div className="flex flex-col gap-1 text-sm">
          <InformationField label={t('patient_entity.laboratory.csf.cytology.fields.test_name')}>
            {cytology.test_name}
          </InformationField>
          <InformationField label={t('patient_entity.laboratory.csf.cytology.fields.multi_specimen')}>
            {multiSpecimenValue}
          </InformationField>
          <InformationField label={t('patient_entity.laboratory.csf.cytology.fields.result_date')}>
            <LabDate day={cytology.day} date={cytology.date} showBoth />
          </InformationField>
        </div>
      </div>
    </section>
  );
}

export default CsfCytologySection;
