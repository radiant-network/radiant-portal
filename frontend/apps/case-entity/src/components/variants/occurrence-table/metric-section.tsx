import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';
import { Triangle } from 'lucide-react';
import ShapeTriangleUpIcon from '@/components/base/icons/shape-triangle-up-icon';

type MetricSectionProps = {
  data: ExpendedOccurrence;
};

export default function MetricSection({ data }: MetricSectionProps) {
  const { t } = useI18n();

  const genotypeQualityValue = (
    <span className='inline-flex gap-1 items-center'>
      { data?.genotype_quality >= 20 ? (
        <Triangle strokeWidth={1.5} className={`w-[13px] h-[13px] text-opacity-50`} />
      ) : (
        <ShapeTriangleUpIcon className='w-[13px] h-[13px] text-destructive' />      
      )}
      {data?.genotype_quality ? data?.genotype_quality : '-'}
    </span>
  )

  return (
    <DetailSection title={t('occurrenceExpend.metrics.title')}>
      <DetailItem title={t('occurrenceExpend.metrics.qualityDepth')} value="-" />
      <DetailItem title={t('occurrenceExpend.metrics.alleleDepthAlt')} value={data?.ad_alt ? data.ad_alt : '-'} />
      <DetailItem title={t('occurrenceExpend.metrics.totalDepthAltRef')} value={data?.ad_total || '-'} />
      <DetailItem title={t('occurrenceExpend.metrics.genotypeQuality')} value={genotypeQualityValue} />
      <DetailItem title={t('occurrenceExpend.metrics.filter')} value={data?.filter ? data?.filter : '-'} />
    </DetailSection>
  );
}
