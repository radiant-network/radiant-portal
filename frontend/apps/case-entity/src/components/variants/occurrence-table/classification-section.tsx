import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import { useI18n } from '@/components/hooks/i18n';

import DetailSection, { DetailItem } from './detail-section';

type ClassificationSectionProps = {
  data: ExpandedGermlineSNVOccurrence;
};

export default function ClassificationSection({ data }: ClassificationSectionProps) {
  const { t } = useI18n();

  const clinvar = data.clinvar?.map(clinvar => (
    <ClassificationBadge key={clinvar} abbreviated value={clinvar}>
      {clinvar}
    </ClassificationBadge>
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
