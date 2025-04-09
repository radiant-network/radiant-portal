import { useI18n } from '@/components/hooks/i18n';
import DetailSection from './detail-section';

export default function ClinicalAssociationSection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.clinicalAssociation.title')}>
      <div className="text-muted-foreground">{t('common.noDataAvailable')}</div>
    </DetailSection>
  );
}
