import { Card, CardContent, CardProps } from '@/components/base/ui/card';
import { Link, useParams } from 'react-router';
import { VariantOverview } from '@/api/api';
import { VariantEntityTabs } from '@/types';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import ClinvarBadge from '@/components/feature/variant/clinvar-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { getDbSnpUrl, getOmimOrgUrl } from '@/components/feature/variant/utils';
import { InfoIcon } from 'lucide-react';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';

function MostDeleteriousConsequenceCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  return (
    <Card {...props}>
      <CardContent className="px-4 md:px-6 py-0 2xl:py-12 grow">
        <div className="flex items-start flex-wrap md:flex-nowrap md:[&>div]:w-40 md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold uppercase">
              {data.symbol ? (
                <a
                  href={getOmimOrgUrl({
                    symbol: data.symbol,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {data.symbol}
                </a>
              ) : (
                '-'
              )}
            </div>
            <div className="text-xs font-mono">{'-'}</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variantEntity.overview.consequence')}</div>
            <div className="flex items-center gap-2">
              {data?.picked_consequences?.[0] && data.vep_impact ? (
                <ConsequenceLabel vepImpact={data.vep_impact} consequence={data?.picked_consequences?.[0]} />
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variantEntity.overview.clinVar')}</div>
            <div className="flex flex-wrap items-start gap-1">
              {data?.clinvar?.length
                ? data?.clinvar.map(clinvar => (
                    <Link
                      key={clinvar}
                      to={`/variants/entity/${params.locusId}#${VariantEntityTabs.EvidenceAndConditions}`}
                    >
                      <ClinvarBadge key={clinvar} value={clinvar} />
                    </Link>
                  ))
                : '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {t('variantEntity.overview.patients')}{' '}
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={16} />
                </TooltipTrigger>
                <TooltipContent>{t('variantEntity.overview.patients_tooltips')}</TooltipContent>
              </Tooltip>
            </div>
            <div className="font-semibold font-mono">
              {data?.pc_wgs ? (
                <Link to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`} className="hover:underline">
                  {`${data.pc_wgs} (${data.pf_wgs.toExponential(2)})`}
                </Link>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {t('variantEntity.overview.gnomAD')}
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={16} />
                </TooltipTrigger>
                <TooltipContent>{t('variantEntity.overview.gnomADInfoTooltip')}</TooltipContent>
              </Tooltip>
            </div>
            <div className="font-semibold font-mono">
              {data?.gnomad_v3_af ? (
                <a
                  href={`https://gnomad.broadinstitute.org/variant/${data.locus}?dataset=gnomad_r3`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {data.gnomad_v3_af.toExponential(2)}
                </a>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex items-center gap-6 text-muted-foreground text-sm">
          {data?.transcript_id && (
            <TranscriptIdLink
              transcriptId={data.transcript_id}
              isManeSelect={data.is_mane_select}
              isManePlus={false}
              isCanonical={data.is_canonical}
              linkClassName="text-muted-foreground"
            />
          )}
          {data?.exon_rank && data?.exon_total && (
            <div className="font-mono">
              {t('variantEntity.overview.exon')}: {data?.exon_rank} / {data?.exon_total}
            </div>
          )}
          {data?.dna_change && <div className="font-mono">{data?.dna_change}</div>}
          {data?.rsnumber && (
            <a href={getDbSnpUrl(data.rsnumber)} className="hover:underline font-mono" target="_blank" rel="noreferrer">
              <div>{data?.rsnumber}</div>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MostDeleteriousConsequenceCard;
