import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function FamilySection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.family.title')}>
      <DetailItem title={t('occurrenceExpend.family.fatherGenotype')} value="-" />
      <DetailItem title={t('occurrenceExpend.family.motherGenotype')} value="-" />
    </DetailSection>
  );
}
