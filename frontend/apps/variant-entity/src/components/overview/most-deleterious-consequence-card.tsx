import { Card, CardContent, CardFooter } from '@/components/base/ui/card';
import { Button } from '@/components/base/ui/button';
import { Link, useParams } from 'react-router';
import { VariantOverview } from '@/api/api';
import { VariantEntityTabs } from '@/types';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import ClinvarBadge from '@/components/feature/variant/clinvar-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';
import { InfoIcon } from 'lucide-react';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';
import { ComponentProps } from 'react';

function MostDeleteriousConsequenceCard({ data, ...props }: { data: VariantOverview } & ComponentProps<'div'>) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  return (
    <Card {...props}>
      <CardContent className="px-6 grow">
        <div className="flex items-start [&>div]:w-40 justify-between gap-6 mt-6">
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
              {t('variantEntity.overview.patient')}{' '}
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={16} />
                </TooltipTrigger>
                <TooltipContent>{t('variantEntity.overview.patientInfoTooltip')}</TooltipContent>
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
        <div className="flex items-center text-muted-foreground text-sm">
          {data?.transcript_id && (
            <TranscriptIdLink
              transcriptId={data.transcript_id}
              isManeSelect={data.is_mane_select}
              isManePlus={false}
              isCanonical={data.is_canonical}
            />
          )}
          {data?.exon_rank && data?.exon_total && (
            <>
              <Separator orientation="vertical" className="mx-4 h-5" />
              <div className="font-mono">
                {t('variantEntity.overview.exon')}: {data?.exon_rank} / {data?.exon_total}
              </div>
            </>
          )}
          {data?.dna_change && (
            <>
              <Separator orientation="vertical" className="mx-4 h-5" />
              <div className="font-mono">{data?.dna_change}</div>
            </>
          )}
          {data?.rsnumber && (
            <>
              <Separator orientation="vertical" className="mx-4 h-5" />
              <a
                href={`https://www.ncbi.nlm.nih.gov/snp/${data?.rsnumber}`}
                className="hover:underline font-mono"
                target="_blank"
                rel="noreferrer"
              >
                <div>{data?.rsnumber}</div>
              </a>
            </>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="px-6 py-4">
        <div className="text-xs text-muted-foreground">
          {t('variantEntity.overview.mostDeleteriousConsequenceNotice')}
        </div>
        <Link to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Transcripts}`} className="ml-auto">
          <Button variant="outline" size="xs">
            {t('variantEntity.overview.viewAllTranscripts')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default MostDeleteriousConsequenceCard;
