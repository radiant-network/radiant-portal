import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';

import DetailSection, { DetailItem } from './detail-section';

interface FunctionalScoreSectionProps {
  data: ExpandedGermlineSNVOccurrence;
}

export default function FunctionalScoreSection({ data }: FunctionalScoreSectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrence_expand.functional_scores.title')}>
      <DetailItem
        title={t('occurrence_expand.functional_scores.sift')}
        value={data.sift_pred ? `${data.sift_pred} (${data.sift_score})` : '-'}
      />
      <DetailItem
        title={t('occurrence_expand.functional_scores.revel')}
        value={data.revel_score ? data.revel_score.toExponential(2) : '-'}
      />
      {/* TODO: Following sections should be visible only for Germline */}
      <DetailItem
        title={t('occurrence_expand.functional_scores.fathmm')}
        value={data.fathmm_pred ? `${data.fathmm_pred} (${data.fathmm_score})` : '-'}
      />
      <DetailItem
        title={t('occurrence_expand.functional_scores.cadd_raw')}
        value={data.cadd_score ? data.cadd_score.toExponential(2) : '-'}
      />
      <DetailItem
        title={t('occurrence_expand.functional_scores.cadd_phred')}
        value={data.cadd_phred ? data.cadd_phred.toExponential(2) : '-'}
      />
    </DetailSection>
  );
}
