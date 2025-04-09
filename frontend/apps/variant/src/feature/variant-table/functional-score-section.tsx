import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';

interface FunctionalScoreSectionProps {
  data: ExpendedOccurrence;
}

export default function FunctionalScoreSection({ data }: FunctionalScoreSectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.functionalScores.title')}>
      <DetailItem
        title={t('occurrenceDetailSections.functionalScores.sift')}
        value={data.sift_pred ? `${data.sift_pred} (${data.sift_score})` : '-'}
      />
      <DetailItem
        title={t('occurrenceDetailSections.functionalScores.revel')}
        value={data.revel_score ? data.revel_score.toExponential(2) : '-'}
      />
      {/* TODO: Following sections should be visible only for Germline */}
      <DetailItem
        title={t('occurrenceDetailSections.functionalScores.fathmm')}
        value={data.fathmm_pred ? `${data.fathmm_pred} (${data.fathmm_score})` : '-'}
      />
      <DetailItem
        title={t('occurrenceDetailSections.functionalScores.caddRaw')}
        value={data.cadd_score ? data.cadd_score.toExponential(2) : '-'}
      />
      <DetailItem
        title={t('occurrenceDetailSections.functionalScores.caddPhred')}
        value={data.cadd_phred ? data.cadd_phred.toExponential(2) : '-'}
      />
    </DetailSection>
  );
}
