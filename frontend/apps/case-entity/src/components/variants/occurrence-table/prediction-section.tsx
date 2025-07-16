import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';
import NumberBadge from '@/components/base/number-badge';

type PredictionSectionProps = {
  data: ExpandedOccurrence;
};

export default function PredictionSection({ data }: PredictionSectionProps) {
  const { t } = useI18n();

  const exomiserCounts = data.exomiser_acmg_classification_counts ?? {};

  const exomiser = Object.keys(exomiserCounts).map(classification => (
    <NumberBadge count={exomiserCounts[classification]} variant="ghost">
      <ClinVarBadge id={classification} abbreviated value={classification}>
        {classification}
      </ClinVarBadge>
    </NumberBadge>
    ));

  return (
    <DetailSection title={t('occurrenceExpand.predictions.title')}>
      <DetailItem title={t('occurrenceExpand.predictions.exomiser')} value={exomiser.length ? <div className="flex items-center gap-2">{exomiser}</div> : '-'} />
    </DetailSection>
  );
}
