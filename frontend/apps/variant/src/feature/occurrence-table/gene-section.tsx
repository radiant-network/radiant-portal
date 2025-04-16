import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';

interface GeneSectionProps {
  data: ExpendedOccurrence;
}

export default function GeneSection({ data }: GeneSectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.gene.title')}>
      <DetailItem
        title={t('occurrenceExpend.gene.pli')}
        value={data.gnomad_pli ? (data.gnomad_pli < 0.001 ? data.gnomad_pli.toExponential(2) : data.gnomad_pli) : '-'}
      />
      <DetailItem
        title={t('occurrenceExpend.gene.loeuf')}
        value={
          data.gnomad_loeuf
            ? data.gnomad_loeuf < 0.001
              ? data.gnomad_loeuf?.toExponential(2)
              : data.gnomad_loeuf
            : '-'
        }
      />
      <DetailItem title={t('occurrenceExpend.gene.spliceAi')} value="-" />
    </DetailSection>
  );
}
