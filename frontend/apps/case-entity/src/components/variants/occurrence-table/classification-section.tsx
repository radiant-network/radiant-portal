import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';

type ClassificationSectionProps = {
  data: ExpandedOccurrence;
};

export default function ClassificationSection({ data }: ClassificationSectionProps) {
  const { t } = useI18n();

  const clinvar = data.clinvar?.map(clinvar => (
    <ClinVarBadge abbreviated value={clinvar}>
      {clinvar}
    </ClinVarBadge>
  ));

  return (
    <DetailSection title={t('occurrenceExpand.classifications.title')}>
      <DetailItem
        title={t('occurrenceExpand.classifications.clinvar')}
        value={clinvar?.length ? <div className="flex items-center gap-1">{clinvar}</div> : '-'}
      />
    </DetailSection>
  );
}
