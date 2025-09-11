import { Link, useParams } from 'react-router';
import { InfoIcon } from 'lucide-react';

import { VariantOverview } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
import ConditionalField from '@/components/base/information/conditional-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Card, CardContent, CardProps } from '@/components/base/ui/card';
import { Separator } from '@/components/base/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';
import { getDbSnpUrl, getOmimOrgUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import { VariantEntityTabs } from '@/types';

function MostDeleteriousConsequenceCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  const pickedConsequence = data?.picked_consequences?.[0];

  return (
    <Card {...props}>
      <CardContent className="px-4 md:px-6 py-0 2xl:py-12 grow">
        <div className="flex items-start flex-wrap md:flex-nowrap md:[&>div]:w-40 md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold">
              {data.symbol && (
                <a
                  href={getOmimOrgUrl({
                    symbol: data.symbol,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline uppercase"
                >
                  {data.symbol}
                </a>
              )}
              {!data.symbol &&
                (['intergenic', 'intergenic_variant'].includes(pickedConsequence) ? t('common.no_gene') : '-')}
            </div>
            <div className="text-xs font-mono">
              <ConditionalField condition={!!data.aa_change}>{data.aa_change}</ConditionalField>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variant_entity.overview.consequence')}</div>
            <div className="flex items-center gap-2">
              <ConditionalField condition={!!pickedConsequence && !!data.vep_impact}>
                <ConsequenceIndicator vepImpact={data.vep_impact!} consequence={pickedConsequence} />
              </ConditionalField>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variant_entity.overview.clin_var')}</div>
            <div className="flex flex-wrap items-start gap-1">
              <ConditionalField condition={data?.clinvar?.length > 0}>
                <>
                  {(data?.clinvar ?? []).map(clinvar => (
                    <Link
                      key={clinvar}
                      to={`/variants/entity/${params.locusId}#${VariantEntityTabs.EvidenceAndConditions}`}
                    >
                      <ClassificationBadge key={clinvar} value={clinvar} />
                    </Link>
                  ))}
                </>
              </ConditionalField>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {t('variant_entity.overview.patients')}{' '}
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={16} />
                </TooltipTrigger>
                <TooltipContent>{t('variant_entity.overview.patients_tooltip')}</TooltipContent>
              </Tooltip>
            </div>
            <div className="font-semibold font-mono">
              <ConditionalField condition={!!data?.pc_wgs}>
                <Link to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`} className="hover:underline">
                  {`${data.pc_wgs} (${data.pf_wgs.toExponential(2)})`}
                </Link>
              </ConditionalField>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {t('variant_entity.overview.gnom_ad')}
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={16} />
                </TooltipTrigger>
                <TooltipContent>{t('variant_entity.overview.gnom_ad_info_tooltip')}</TooltipContent>
              </Tooltip>
            </div>
            <div className="font-semibold font-mono">
              <ConditionalField condition={!!data?.gnomad_v3_af}>
                <a
                  href={`https://gnomad.broadinstitute.org/variant/${data.locus}?dataset=gnomad_r3`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {data.gnomad_v3_af.toExponential(2)}
                </a>
              </ConditionalField>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex items-center gap-6 text-sm">
          {data?.transcript_id && (
            <TranscriptIdLink
              transcriptId={data.transcript_id}
              isManeSelect={data.is_mane_select}
              isManePlus={false}
              isCanonical={data.is_canonical}
              linkClassName="text-foreground"
            />
          )}
          {data?.exon_rank && data?.exon_total && (
            <div className="font-mono">
              {t('variant_entity.overview.exon')}: {data?.exon_rank} / {data?.exon_total}
            </div>
          )}
          {data?.dna_change && <div className="font-mono">{data?.dna_change}</div>}
          {data?.rsnumber && (
            <AnchorLink href={getDbSnpUrl(data.rsnumber)} mono size="sm" target="_blank" rel="noreferrer">
              {data?.rsnumber}
            </AnchorLink>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MostDeleteriousConsequenceCard;
