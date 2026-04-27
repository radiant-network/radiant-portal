import ClassificationBadge from '@/components/base/badges/classification-badge';
import { useI18n } from '@/components/hooks/i18n';

import DetailSection, { DetailItem } from './detail-section';

export type ClassificationSectionProps = {
  clinvar?: string[];
};

export default function ClassificationSection({ clinvar }: ClassificationSectionProps) {
  const { t } = useI18n();

  const badges = clinvar?.map(c => (
    <ClassificationBadge key={c} abbreviated value={c}>
      {c}
    </ClassificationBadge>
  ));

  return (
    <DetailSection title={t('occurrence_expand.classifications.title')}>
      <DetailItem
        title={t('occurrence_expand.classifications.clinvar')}
        value={badges?.length ? <div className="flex items-center gap-1">{badges}</div> : '-'}
      />
    </DetailSection>
  );
}
