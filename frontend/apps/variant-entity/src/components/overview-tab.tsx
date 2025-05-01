import { Card, CardContent, CardFooter, CardHeader } from '@/components/base/ui/card';
import { BrainCircuit, ExternalLink, Hospital } from 'lucide-react';
import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import { Button } from '@/components/base/ui/button';
import { variantsApi } from '@/utils/api';
import { Link, useParams } from 'react-router';
import useSWR from 'swr';
import { VariantOverview } from '@/api/api';
import { VariantEntityTabs } from '@/types';
import { Badge } from '@/components/base/ui/badge';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import NumberBadge from '@/components/base/number-badge';
import { useI18n } from '@/components/hooks/i18n';
import ImpactIcon from '@/components/feature/variant/impact-icon';
import ClinvarBadge from '@/components/feature/variant/clinvar-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

type VariantOverviewInput = {
  key: string;
  locusId: string;
};

async function fetchVariantOverview(input: VariantOverviewInput) {
  const response = await variantsApi.getVariantOverview(input.locusId);
  return response.data;
}

function OverviewTab() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  const { data, isLoading } = useSWR<VariantOverview, any, VariantOverviewInput>(
    {
      key: 'variant-overview',
      locusId: params.locusId!,
    },
    fetchVariantOverview,
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading) {
    return <VariantOverviewSkeleton />;
  }

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hospital className="text-accent-foreground opacity-50" />
                <span className="font-semibold">{t('variantEntity.overview.myOrganization')}</span>
              </div>
              <Link to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`}>
                <Button variant="outline" size="xs">
                  {t('variantEntity.overview.details')}
                </Button>
              </Link>
            </div>
            <div className="ml-6">
              <div className="ml-3 flex items-center gap-3">
                <NumberBadge count={12}>
                  <Badge variant="orange">LP</Badge>
                </NumberBadge>
                <NumberBadge count={3}>
                  <Badge variant="red">P</Badge>
                </NumberBadge>
                <NumberBadge count={3}>
                  <Badge variant="yellow">VUS</Badge>
                </NumberBadge>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-accent-foreground opacity-50" />
              <span className="font-semibold">{t('variantEntity.overview.radiant')}</span>
            </div>
            <div className="ml-6 text-sm">
              <div className="ml-3 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="min-w-20 text-muted-foreground">Exomiser</span> <Badge variant="red">P</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-20 text-muted-foreground">Phenovar</span> <Badge variant="orange">LP</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-20 text-muted-foreground">Franklin</span> <Badge variant="red">P</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col shadow-none col-span-1 md:col-span-2">
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
                      {t(`consequences.${data?.picked_consequences?.[0]}`, {
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
                  <Link
                    to={`/variants/entity/${params.locusId}#${VariantEntityTabs.Cases}`}
                    className="hover:underline"
                  >
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
                  <div>{data?.transcript_id}</div>
                </a>
                {data.canonical && (
                  <Tooltip>
                    <TooltipTrigger>
                      <TranscriptCanonicalIcon size={16} className="text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>{t('variantEntity.overview.canonicalTranscript')}</TooltipContent>
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
      <Card>
        <CardHeader className="flex flex-row justify-between pb-0">
          <div className="font-semibold">{t('variantEntity.overview.predictionScores')}</div>
          <Button variant="outline" size="xs">
            {t('variantEntity.overview.viewAll')}
          </Button>
        </CardHeader>
        <CardContent className="p-6 text-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('variantEntity.overview.sift')}</span>
            {data?.sift_pred && data.sift_score ? (
              <span>
                {data?.sift_pred} ({data?.sift_score})
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('variantEntity.overview.revel')}</span>
            <span>{data?.revel_score ? data.revel_score : '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('variantEntity.overview.loeuf')}</span>
            <span>{data?.gnomad_loeuf ? data.gnomad_loeuf : '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('variantEntity.overview.spliceAI')}</span>
            <div className="flex items-center gap-2">
              <span>{data?.spliceai_ds ? data.spliceai_ds : '-'}</span>
              {data?.spliceai_type?.length && (
                <div className="space-x-1">
                  {data.spliceai_type.map(type => (
                    <Badge variant="outline">{type}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between pb-0">
          <div className="font-semibold">{t('variantEntity.overview.associatedConditionsOmim')}</div>
        </CardHeader>
        <CardContent className="p-6 text-sm space-y-3">
          {data?.omim_conditions?.map(condition => (
            <div key={`${condition.name}${condition.omim_id}`} className="flex items-center justify-between">
              <span className="text-muted-foreground">{condition.name}</span>
              <div className="flex items-center gap-1">
                {condition.inheritance_code?.map(code => (
                  <Badge key={`${condition.name}${condition.omim_id}${code}`} variant="outline">
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between pb-0">
          <div className="font-semibold">{t('variantEntity.overview.externalReferences')}</div>
        </CardHeader>
        <CardContent className="p-6 text-sm space-y-3">
          <a
            href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${data?.clinvar_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {t('variantEntity.overview.clinVar')} <ExternalLink size={12} />
          </a>
          <a
            href={`https://gnomad.broadinstitute.org/variant/${data?.locus}?dataset=gnomad_r3`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {t('variantEntity.overview.gnomAD')} <ExternalLink size={12} />
          </a>
          <a
            href={`https://www.ncbi.nlm.nih.gov/snp/${data?.rsnumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {t('variantEntity.overview.dbSNP')} <ExternalLink size={12} />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

const VariantOverviewSkeleton = () => {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6" />
          <Separator className="my-6" />
          <div className="space-y-4">
            <Skeleton className="h-6" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none col-span-1 md:col-span-2">
        <CardContent className="p-6">
          <Skeleton className="h-12" />
          <Separator className="my-6" />
          <Skeleton className="h-12" />
        </CardContent>
        <Separator />
        <CardFooter className="px-6 py-4">
          <Skeleton className="h-6 w-full" />
        </CardFooter>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6" />
          <Separator className="my-6" />
          <div className="space-y-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6" />
          <Separator className="my-6" />
          <div className="space-y-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6" />
          <Separator className="my-6" />
          <div className="space-y-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
