import ClassificationBadge from '@/components/base/badges/classification-badge';
import { getClassificationCriteriaColor } from '@/components/base/classifications/interpretation';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import DetailSection, { DetailItem } from './detail-section';

export type PredictionSectionProps = {
  exomiser_acmg_classification?: string;
  exomiser_acmg_evidence?: string[];
};

export default function PredictionSection({
  exomiser_acmg_classification,
  exomiser_acmg_evidence,
}: PredictionSectionProps) {
  const { t } = useI18n();

  const exomiser =
    exomiser_acmg_classification || exomiser_acmg_evidence ? (
      <div className="flex items-center gap-1">
        {exomiser_acmg_classification && (
          <ClassificationBadge abbreviated value={exomiser_acmg_classification.replace(' ', '_')}>
            {exomiser_acmg_classification}
          </ClassificationBadge>
        )}
        {exomiser_acmg_evidence &&
          exomiser_acmg_evidence.map(e => (
            <Badge key={e} variant={getClassificationCriteriaColor(e)}>
              {e}
            </Badge>
          ))}
      </div>
    ) : (
      '-'
    );

  return (
    <DetailSection title={t('occurrence_expand.predictions.title')}>
      <DetailItem
        title={t('occurrence_expand.predictions.exomiser')}
        value={exomiser_acmg_classification ? <div>{exomiser}</div> : '-'}
      />
    </DetailSection>
  );
}
