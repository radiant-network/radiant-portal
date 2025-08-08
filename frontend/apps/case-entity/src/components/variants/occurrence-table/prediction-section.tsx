import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';
import { Badge } from '@/components/base/ui/badge';
import { getClassificationCriteriaColor } from '../interpretation/data';

type PredictionSectionProps = {
  data: ExpandedGermlineSNVOccurrence;
};

export default function PredictionSection({ data }: PredictionSectionProps) {
  const { t } = useI18n();

  const exomiser = data.exomiser_acmg_classification || data.exomiser_acmg_evidence ? (
    <div className="flex items-center gap-1">
      {data.exomiser_acmg_classification && (
        <ClinVarBadge abbreviated value={data.exomiser_acmg_classification.replace(' ', '_')}>
          {data.exomiser_acmg_classification}
        </ClinVarBadge>
      )}
      {data.exomiser_acmg_evidence && data.exomiser_acmg_evidence.map(e => (
        <Badge key={e} variant={getClassificationCriteriaColor(e)}>
          {e}
        </Badge>
      ))}
    </div>
  ) : (
    '-'
  );

  return (
    <DetailSection title={t('occurrenceExpand.predictions.title')}>
      <DetailItem
        title={t('occurrenceExpand.predictions.exomiser')}
        value={data.exomiser_acmg_classification ? <div>{exomiser}</div> : '-'}
      />
    </DetailSection>
  );
}
