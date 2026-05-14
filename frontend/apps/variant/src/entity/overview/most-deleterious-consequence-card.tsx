import { Link, useParams } from 'react-router';
import { InfoIcon } from 'lucide-react';

import { VariantOverview } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
import ConditionalField from '@/components/base/information/conditional-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Card, CardContent, CardProps } from '@/components/base/shadcn/card';
import { Separator } from '@/components/base/shadcn/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import TranscriptIdLink from '@/components/base/variant/transcript-id-link';
import { getOmimOrgUrl } from '@/components/base/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import { VariantEntityTabs } from '@/types';

function MostDeleteriousConsequenceCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  const pickedConsequence = data?.picked_consequences?.[0];

  return (
    <Card data-cy="most-deleterious-consequence-card" {...props}>
      <CardContent className="px-4 md:px-6 py-0 2xl:py-12 grow">
        <div className="flex items-start flex-wrap md:flex-nowrap md:[&>div]:w-40 md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold">
              {data.symbol && (
                <a
                  data-cy="gene"
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
              {!data.symbol && t('common.no_gene')}
            </div>
            <div className="text-xs font-mono">
              <ConditionalField condition={!!data.aa_change}>
                <span data-cy="aa-change">{data.aa_change}</span>
              </ConditionalField>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variant_entity.overview.consequence')}</div>
            <div className="flex items-center gap-2">
              <ConditionalField condition={!!pickedConsequence && !!data.vep_impact}>
                <span data-cy="consequence">
                  <ConsequenceIndicator vepImpact={data.vep_impact!} consequence={pickedConsequence} />
                </span>
              </ConditionalField>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variant_entity.overview.clin_var')}</div>
            <div className="flex flex-wrap items-start gap-1">
              <ConditionalField condition={data?.clinvar ? data?.clinvar?.length > 0 : false}>
                <span data-cy="clinvar-classifications" className="flex flex-wrap items-start gap-1">
                  {(data?.clinvar ?? []).map(clinvar => (
                    <Link
                      key={clinvar}
                      data-cy={clinvar.replace(/_/g, '-')}
                      to={`/variants/entity/${params.locusId}?tab=${VariantEntityTabs.EvidenceAndConditions}`}
                    >
                      <ClassificationBadge key={clinvar} value={clinvar} />
                    </Link>
                  ))}
                </span>
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
              <ConditionalField condition={!!data?.germline_pc_wgs}>
                <Link
                  data-cy="patients"
                  to={`/variants/entity/${params.locusId}?tab=${VariantEntityTabs.Cases}`}
                  className="hover:underline"
                >
                  {`${data.germline_pc_wgs} (${data.germline_pf_wgs.toExponential(2)})`}
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
                  data-cy="gnomad"
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
            <span data-cy="transcript-id">
              <TranscriptIdLink
                transcriptId={data.transcript_id}
                isManeSelect={data.is_mane_select}
                isManePlus={false}
                isCanonical={data.is_canonical}
                linkClassName="text-foreground"
              />
            </span>
          )}
          {data?.exon_rank && data?.exon_total && (
            <div data-cy="exon" className="font-mono">
              {t('variant_entity.overview.exon')}: {data?.exon_rank} / {data?.exon_total}
            </div>
          )}
          {data?.dna_change && (
            <div data-cy="dna-change" className="font-mono">
              {data?.dna_change}
            </div>
          )}
          {data?.rsnumber && (
            <AnchorLink
              data-cy="dbsnp"
              size="sm"
              href={`https://www.ncbi.nlm.nih.gov/snp/${data.rsnumber}`}
              className={'hover:underline font-mono'}
              target="_blank"
              rel="noreferrer"
            >
              {data.rsnumber}
            </AnchorLink>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MostDeleteriousConsequenceCard;
