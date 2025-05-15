import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';

type ZygositySectionProps = {
  data: ExpendedOccurrence;
};

export default function ZygositySection({ data }: ZygositySectionProps) {
  const { t } = useI18n();

  const zygosity = data.zygosity ? data.zygosity : '-';
  const compoundHetLocus = data.locus_id ? data.locus_id : '-';
  const inheritance = data.transmission ? data.transmission : '-';
  const parentalOrigin = data.parental_origin ? data.parental_origin : '-';

  return (
    <DetailSection title={t('occurrenceExpend.zygosity.title')}>
      <DetailItem title={t('occurrenceExpend.zygosity.zygosity')} value={zygosity} />
      <DetailItem title={t('occurrenceExpend.zygosity.compoundHet')} value={compoundHetLocus} />
      <DetailItem title={t('occurrenceExpend.zygosity.potentialCompoundHet')} value="-" />
      <DetailItem title={t('occurrenceExpend.zygosity.inheritance')} value={inheritance} />
      <DetailItem title={t('occurrenceExpend.zygosity.parentalOrigin')} value={parentalOrigin} />
    </DetailSection>
  );
}
