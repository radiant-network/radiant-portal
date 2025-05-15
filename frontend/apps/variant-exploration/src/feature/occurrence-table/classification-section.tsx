import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';

type ClassificationSectionProps = {
  data: ExpendedOccurrence;
};

export default function ClassificationSection({ data }: ClassificationSectionProps) {
  const { t } = useI18n();

  const clinvar = data.clinvar?.map(clinvar => (
    <ClinVarBadge abbreviated value={clinvar}>
      {clinvar}
    </ClinVarBadge>
  ));

  return (
    <DetailSection title={t('occurrenceExpend.classifications.title')}>
      <DetailItem
        title={t('occurrenceExpend.classifications.clinvar')}
        value={clinvar?.length ? <div className="space-x-1">{clinvar}</div> : '-'}
      />
    </DetailSection>
  );
}
