import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';
import { toExponentialNotation } from '@/components/lib/number-format';

import EmptyField from '../information/empty-field';

import DetailSection, { DetailItem } from './detail-section';

export interface GeneSectionProps {
  gnomad_pli?: number;
  gnomad_loeuf?: number;
  revel_score?: number;
  spliceai_type?: string[];
  spliceai_ds?: number;
  hgvsg?: string;
  transcript_id?: string;
}

export default function GeneSection({
  gnomad_pli,
  gnomad_loeuf,
  revel_score,
  spliceai_type,
  spliceai_ds,
  hgvsg,
  transcript_id,
}: GeneSectionProps) {
  const { t } = useI18n();
  return (
    <DetailSection title={t('occurrence_expand.gene.title')}>
      <DetailItem
        title={t('occurrence_expand.gene.pli')}
        value={
          gnomad_pli ? (
            <AnchorLink
              href={`https://gnomad.broadinstitute.org/gene/${transcript_id}?dataset=gnomad_r2_1`}
              target="_blank"
              size="sm"
            >
              {toExponentialNotation(gnomad_pli)}
            </AnchorLink>
          ) : (
            <EmptyField />
          )
        }
      />
      <DetailItem
        title={t('occurrence_expand.gene.loeuf')}
        value={
          gnomad_loeuf ? (
            <AnchorLink
              href={`https://gnomad.broadinstitute.org/gene/${transcript_id}?dataset=gnomad_r2_1`}
              target="_blank"
              size="sm"
            >
              {toExponentialNotation(gnomad_loeuf)}
            </AnchorLink>
          ) : (
            <EmptyField />
          )
        }
      />
      <DetailItem title={t('occurrence_expand.gene.revel')} value={revel_score ?? <EmptyField />} />
      <DetailItem
        title={t('occurrence_expand.gene.splice_ai')}
        value={
          spliceai_type ? (
            <div className="flex gap-1">
              <AnchorLink
                href={`https://spliceailookup.broadinstitute.org/#variant=${hgvsg}&hg=38`}
                target="_blank"
                size="sm"
              >
                {spliceai_ds}
              </AnchorLink>

              {spliceai_type.map(v => (
                <Badge key={v}>{v}</Badge>
              ))}
            </div>
          ) : (
            <EmptyField />
          )
        }
      />
    </DetailSection>
  );
}
