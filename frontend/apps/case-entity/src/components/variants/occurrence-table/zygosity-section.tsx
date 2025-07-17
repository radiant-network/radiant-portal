import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';

type ZygositySectionProps = {
  data: ExpandedOccurrence;
};

export default function ZygositySection({ data }: ZygositySectionProps) {
  const { t } = useI18n();

  const zygosity = data.zygosity ? data.zygosity : '-';
  const inheritance = data.transmission ? data.transmission : '-';
  const parentalOrigin = data.parental_origin ? data.parental_origin : '-';

  return (
    <DetailSection title={t('occurrenceExpand.zygosity.title')}>
      <DetailItem title={t('occurrenceExpand.zygosity.zygosity')} value={zygosity} />
      <DetailItem title={t('occurrenceExpand.zygosity.inheritance')} value={inheritance} />
      <DetailItem title={t('occurrenceExpand.zygosity.parentalOrigin')} value={parentalOrigin} />
    </DetailSection>
  );
}
