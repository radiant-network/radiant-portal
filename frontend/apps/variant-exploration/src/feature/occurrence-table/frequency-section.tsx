import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';

type FrequencySectionProps = {
  data: ExpendedOccurrence;
};

export default function FrequencySection({ data }: FrequencySectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.frequencies.title')}>
      <DetailItem title={t('occurrenceExpend.frequencies.myOrganization')} value="-" />
      <DetailItem title={t('occurrenceExpend.frequencies.myOrganization')} value="-" />
      <DetailItem title={t('occurrenceExpend.frequencies.gnomad')} value="-" />
    </DetailSection>
  );
}
