import { Card, CardContent, CardHeader, CardProps } from '@/components/base/ui/card';
import { Button } from '@/components/base/ui/button';
import { VariantOverview } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';
import { TFunction } from 'i18next';
import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/base/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

const getPredictionList = (data: VariantOverview, t: TFunction<string, undefined>) => {
  return [
    <div key="psl-sift" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.sift')}</span>
      {data?.sift_pred && data.sift_score !== undefined ? (
        <span>
          {data?.sift_pred} ({data?.sift_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
    <div key="psl-revel" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.revel')}</span>
      <span>{data?.revel_score ?? '-'}</span>
    </div>,
    <div key="psl-loeuf" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.loeuf')}</span>
      <span>{data?.gnomad_loeuf ?? '-'}</span>
    </div>,
    <div key="psl-spliceai" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.spliceAI')}</span>
      <div className="flex items-center gap-2">
        <span>{data?.spliceai_ds ? data.spliceai_ds : '-'}</span>
        {data?.spliceai_type?.length && (
          <div className="space-x-1">
            {data.spliceai_type.map(type => (
              <Tooltip key={type}>
                <TooltipTrigger>
                  <Badge variant="outline">{type}</Badge>
                </TooltipTrigger>
                <TooltipContent>{t(`variant.spliceAi.${type}`)}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </div>,
    <div key="psl-fathmm" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.fathmm')}</span>
      {data?.fathmm_pred && data.fathmm_score !== undefined ? (
        <span>
          {data?.fathmm_pred} ({data?.fathmm_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
    <div key="psl-caddraw" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.caddRaw')}</span>
      <span>{data?.cadd_score ?? '-'}</span>
    </div>,
    <div key="psl-caddphred" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.caddPhred')}</span>
      <span>{data?.cadd_phred ?? '-'}</span>
    </div>,
    <div key="psl-dann" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.dann')}</span>
      <span>{data?.dann_score ?? '-'}</span>
    </div>,
    <div key="psl-lrt" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.lrt')}</span>
      {data?.lrt_pred && data.lrt_score !== undefined ? (
        <span>
          {data?.lrt_pred} ({data?.lrt_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
    <div key="psl-polyphen2hvar" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.polyphen2hvar')}</span>
      {data?.polyphen2_hvar_pred && data.polyphen2_hvar_score !== undefined ? (
        <span>
          {data?.polyphen2_hvar_pred} ({data?.polyphen2_hvar_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
    <div key="psl-phylop17way" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.phylop17way')}</span>
      <span>{data?.phyloP17way_primate ?? '-'}</span>
    </div>,
    <div key="psl-pli" className="flex items-center justify-between">
      <span className="text-muted-foreground">{t('variant.predictions.pli')}</span>
      <span>{data?.gnomad_pli?.toExponential(2) ?? '-'}</span>
    </div>,
  ];
};

function PredictionScoresCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();
  const predictionScoreList = useMemo(() => getPredictionList(data, t), [data, t]);

  return (
    <>
      <Card {...props}>
        <CardHeader className="flex flex-row justify-between pb-0">
          <div className="font-semibold">{t('variantEntity.overview.predictionScores')}</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                {t('variantEntity.overview.viewAll')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('variantEntity.overview.predictionScores')}</DialogTitle>
              </DialogHeader>
              <div className="text-sm space-y-3">{predictionScoreList}</div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6 text-sm space-y-3">{predictionScoreList.slice(0, 4)}</CardContent>
      </Card>
    </>
  );
}

export default PredictionScoresCard;
