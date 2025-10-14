import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';
import { toExponentialNotationAtThreshold } from '@/components/lib/number-format';

import DetailSection, { DetailItem } from './detail-section';

interface GeneSectionProps {
  data: ExpandedGermlineSNVOccurrence;
}

export default function GeneSection({ data }: GeneSectionProps) {
  const { t } = useI18n();
  return (
    <DetailSection title={t('occurrence_expand.gene.title')}>
      <DetailItem
        title={t('occurrence_expand.gene.pli')}
        value={
          data.gnomad_pli ? (
            <AnchorLink
              href={`https://gnomad.broadinstitute.org/gene/${data.transcript_id}?dataset=gnomad_r2_1`}
              target="_blank"
              size="sm"
            >
              {toExponentialNotationAtThreshold(data.gnomad_pli)}
            </AnchorLink>
          ) : (
            '-'
          )
        }
      />
      <DetailItem
        title={t('occurrence_expand.gene.loeuf')}
        value={
          data.gnomad_loeuf ? (
            <AnchorLink
              href={`https://gnomad.broadinstitute.org/gene/${data.transcript_id}?dataset=gnomad_r2_1`}
              target="_blank"
              size="sm"
            >
              {toExponentialNotationAtThreshold(data.gnomad_loeuf)}
            </AnchorLink>
          ) : (
            '-'
          )
        }
      />
      <DetailItem title={t('occurrence_expand.gene.revel')} value={data.revel_score ?? '-'} />
      <DetailItem
        title={t('occurrence_expand.gene.splice_ai')}
        value={
          data.spliceai_type ? (
            <AnchorLink
              href={`https://spliceailookup.broadinstitute.org/#variant=${data.hgvsg}&hg=38`}
              target="_blank"
              size="sm"
            >
              <span className="text-xs text-muted-foreground">
                {data.spliceai_ds}{' '}
                {data.spliceai_type.map(v => (
                  <Badge key={v}>{v}</Badge>
                ))}
              </span>
            </AnchorLink>
          ) : (
            '-'
          )
        }
      />
    </DetailSection>
  );
}
