import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function FamilySection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.family.title')}>
      <DetailItem title={t('occurrenceDetailSections.family.fatherGenotype')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.family.motherGenotype')} value="-" />
    </DetailSection>
  );
}
