import { Card, CardContent, CardFooter, CardProps } from '@/components/base/ui/card';
import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import { Button } from '@/components/base/ui/button';
import { Link, useParams } from 'react-router';
import { VariantOverview } from '@/api/api';
import { VariantEntityTabs } from '@/types';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import ImpactIcon from '@/components/feature/variant/impact-icon';
import ClinvarBadge from '@/components/feature/variant/clinvar-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

function MostDeleteriousConsequenceCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  return (
    <Card {...props}>
      <CardContent className="px-6 py-8 flex-grow">
        <div className="flex items-start [&>div]:w-40 justify-between gap-6 mt-6">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold uppercase">{data?.symbol || '-'}</div>
            <div className="text-sm">{'-'}</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variantEntity.overview.consequence')}</div>
            <div className="flex items-center gap-2">
              {data?.picked_consequences?.[0] && data.vep_impact ? (
                <>
                  <ImpactIcon value={data.vep_impact} /> {/* TODO */}
                  <span className="font-semibold">
                    {t(`variant.consequences.${data?.picked_consequences?.[0]}`, {
                      defaultValue: '-',
                    })}
                  </span>
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variantEntity.overview.clinVar')}</div>
            <div className="flex flex-col items-start gap-1">
              {data?.clinvar?.length
                ? data?.clinvar.map(clinvar => (
                    <Link key={clinvar} to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Evidence}`}>
                      <ClinvarBadge key={clinvar} value={clinvar} />
                    </Link>
                  ))
                : '-'}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variantEntity.overview.participants')}</div>
            <div className="font-semibold">
              {data?.pc ? (
                <Link to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`} className="hover:underline">
                  {`${data.pc} (${data.pf.toExponential(2)})`}
                </Link>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">{t('variantEntity.overview.gnomAD')}</div>
            <div className="font-semibold">
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
            <div className="flex items-center gap-1">
              <a
                href={`https://www.ensembl.org/id/${data?.transcript_id}`}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {data?.transcript_id}
              </a>
              {data.canonical && (
                <Tooltip>
                  <TooltipTrigger>
                    <TranscriptCanonicalIcon size={16} className="text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>{t('variant.canonicalTranscript')}</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
          {data?.refseq_mrna_id && (
            <>
              <Separator orientation="vertical" className="mx-4 h-5" />
              <div>
                <a href={`https://www.ncbi.nlm.nih.gov/nuccore/${data?.refseq_mrna_id}?report=graph`}>
                  {data?.refseq_mrna_id}
                </a>
              </div>
            </>
          )}
          {data?.exon_rank && data?.exon_total && (
            <>
              <Separator orientation="vertical" className="mx-4 h-5" />
              <div>
                {t('variantEntity.overview.exon')}: {data?.exon_rank} / {data?.exon_total}
              </div>
            </>
          )}
          {data?.coding_dna_change && (
            <>
              <Separator orientation="vertical" className="mx-4 h-5" />
              <div>{data?.coding_dna_change}</div>
            </>
          )}
          {data?.rsnumber && (
            <>
              <Separator orientation="vertical" className="mx-4 h-5" />
              <a
                href={`https://www.ncbi.nlm.nih.gov/snp/${data?.rsnumber}`}
                className="hover:underline"
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
