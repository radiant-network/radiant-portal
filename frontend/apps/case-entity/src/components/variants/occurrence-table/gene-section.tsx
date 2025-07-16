import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { toExponentialNotationAtThreshold } from '@/components/lib/number-format';

interface GeneSectionProps {
  data: ExpandedOccurrence;
}


export default function GeneSection({ data }: GeneSectionProps) {
  const { t } = useI18n();
  return (
    <DetailSection title={t('occurrenceExpand.gene.title')}>
      <DetailItem
        title={t('occurrenceExpand.gene.pli')}
        value={
          data.gnomad_pli ?
            <AnchorLink href={`https://gnomad.broadinstitute.org/gene/${data.transcript_id}?dataset=gnomad_r2_1`} target='_blank' size="sm">
              {toExponentialNotationAtThreshold(data.gnomad_pli)}
            </AnchorLink>
            : '-'
        }
      />
      <DetailItem
        title={t('occurrenceExpand.gene.loeuf')}
        value={
          data.gnomad_loeuf ?
            <AnchorLink href={`https://gnomad.broadinstitute.org/gene/${data.transcript_id}?dataset=gnomad_r2_1`} target='_blank' size="sm">
              {toExponentialNotationAtThreshold(data.gnomad_loeuf)}
            </AnchorLink>
            : '-'
        }
      />
      <DetailItem
        title={t('occurrenceExpand.gene.revel')}
        value={data.revel_score ?? '-'}
      />
      <DetailItem
        title={t('occurrenceExpand.gene.spliceAi')}
        value={
          data.spliceai_type ?
            <AnchorLink href={`https://spliceailookup.broadinstitute.org/#variant=${data.locus_id}&hg=38`} target='_blank' size="sm">
              <span className="text-xs text-muted-foreground">
                {data.spliceai_ds} {data.spliceai_type.map((v) => <Badge>{v}</Badge>)}
              </span>
            </AnchorLink>
            : '-'
        }
      />
    </DetailSection>
  );
}
