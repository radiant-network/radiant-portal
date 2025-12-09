import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import { getClassificationCriteriaColor } from '../interpretation/data';

import DetailSection, { DetailItem } from './detail-section';

type PredictionSectionProps = {
  data: ExpandedGermlineSNVOccurrence;
};

export default function PredictionSection({ data }: PredictionSectionProps) {
  const { t } = useI18n();

  const exomiser =
    data.exomiser_acmg_classification || data.exomiser_acmg_evidence ? (
      <div className="flex items-center gap-1">
        {data.exomiser_acmg_classification && (
          <ClassificationBadge abbreviated value={data.exomiser_acmg_classification.replace(' ', '_')}>
            {data.exomiser_acmg_classification}
          </ClassificationBadge>
        )}
        {data.exomiser_acmg_evidence &&
          data.exomiser_acmg_evidence.map(e => (
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
        value={data.exomiser_acmg_classification ? <div>{exomiser}</div> : '-'}
      />
    </DetailSection>
  );
}
