import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { Button } from '@/components/base/ui/button';
import { VariantOverview } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';
import { TFunction } from 'i18next';
import { ComponentProps, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/base/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

const getPredictionList = (data: VariantOverview, t: TFunction<string, undefined>) => {
  const predictions: { key: string; label: string, value: string | React.ReactElement }[] = [];
  const empties: { key: string; label: string }[] = [];

  // revel
  if (data.revel_score) {
    predictions.push({
      key: 'revel',
      label: t('variant.predictions.revel'),
      value: `${data.revel_score}`
    })
  } else {
    empties.push({
      key: 'revel',
      label: t('variant.predictions.revel'),
    })
  }

  // sift
  if (data.sift_pred && data.sift_score !== undefined) {
    const siftPref = t(`common.filters.labels.sift_pred_value.${data.sift_pred}`);
    predictions.push({
      key: 'sift',
      label: t('variant.predictions.sift'),
      value: `${siftPref} (${data?.sift_score})`,
    })
  } else {
    empties.push({
      key: 'sift',
      label: t('variant.predictions.sift'),
    })
  }

  // loeuf
  if (data.gnomad_loeuf) {
    predictions.push({
      key: 'loeuf',
      label: t('variant.predictions.loeuf'),
      value: `${data.gnomad_loeuf}`,
    })
  } else {
    empties.push({
      key: 'loeuf',
      label: t('variant.predictions.loeuf'),
    });
  }

  // spliceai
  if (data.spliceai_ds && data.spliceai_type?.length) {
    predictions.push({
      key: 'spliceai',
      label: t('variant.predictions.spliceAI'),
      value: (
        <div className="space-x-1">
          {data.spliceai_type?.map(type => (
            <Tooltip key={type}>
              <TooltipTrigger>
                <Badge variant="outline">{type}</Badge>
              </TooltipTrigger>
              <TooltipContent>{t(`variant.spliceAi.${type}`)}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )
    })
  } else {
    empties.push({
      key: 'spliceai',
      label: t('variant.predictions.spliceAI'),
    });
  }

  // fathmm
  if (data.fathmm_pred && data.fathmm_score !== undefined) {
    const fatmmPref = t(`common.filters.labels.fathmm_pred_value.${data.fathmm_pred}`)
    predictions.push({
      key: 'fathmm',
      label: t('variant.predictions.fathmm'),
      value: `${fatmmPref} (${data?.fathmm_score})`,
    })
  } else {
    empties.push({
      key: 'fathmm',
      label: t('variant.predictions.fathmm'),
    })
  }

  // caddraw
  if (data.cadd_score) {
    predictions.push({
      key: 'caddraw',
      label: t('variant.predictions.caddRaw'),
      value: `${data.cadd_score}`
    })
  } else {
    empties.push({
      key: 'caddraw',
      label: t('variant.predictions.caddRaw'),
    });
  }

  // caddphred
  if (data.cadd_phred) {
    predictions.push({
      key: 'caddphred',
      label: t('variant.predictions.caddPhred'),
      value: `${data.cadd_phred}`
    })
  } else {
    empties.push({
      key: 'caddphred',
      label: t('variant.predictions.caddPhred'),
    });
  }

  // dann
  if (data.dann_score) {
    predictions.push({
      key: 'dann',
      label: t('variant.predictions.dann'),
      value: `${data.dann_score}`
    })
  } else {
    empties.push({
      key: 'dann',
      label: t('variant.predictions.dann'),
    });
  }

  // lrt
  if (data?.lrt_pred && data.lrt_score !== undefined) {
    const lrtPred = t(`common.filters.labels.lrt_pred_value.${data.lrt_pred}`)
    predictions.push({
      key: 'lrt',
      label: t('variant.predictions.lrt'),
      value: `${lrtPred} (${data?.lrt_score})`,
    })
  } else {
    empties.push({
      key: 'lrt',
      label: t('variant.predictions.lrt'),
    })
  }

  // polyphen2_hvar
  if (data.polyphen2_hvar_pred && data.polyphen2_hvar_score !== undefined) {
    const hvarPred = t(`common.filters.labels.polyphen2_hvar_pred_value.${data.polyphen2_hvar_pred}`);
    predictions.push({
      key: 'polyphen2_hvar',
      label: t('variant.predictions.polyphen2hvar'),
      value: `${hvarPred} ${data.polyphen2_hvar_score}`
    })
  } else {
    empties.push({
      key: 'polyphen2_hvar',
      label: t('variant.predictions.polyphen2hvar'),
    })
  }

  // phylop17way
  if (data.phyloP17way_primate) {
    predictions.push({
      key: 'phylop17way',
      label: t('variant.predictions.phylop17way'),
      value: `${data.phyloP17way_primate}`
    })
  } else {
    empties.push({
      key: 'phylop17way',
      label: t('variant.predictions.phylop17way'),
    })
  }

  // pli
  if (data.gnomad_pli) {
    predictions.push({
      key: 'pli',
      label: t('variant.predictions.pli'),
      value: `${data?.gnomad_pli?.toExponential(2)}`
    })
  } else {
    empties.push({
      key: 'pli',
      label: t('variant.predictions.pli'),
    })
  }

  return [
    ...predictions.map(({ key, label, value }) => (
      <div key={`psl-${key}`} className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}:</span>
        <span>
          {value}
        </span>
      </div>
    )),
    ...empties.map(({ key, label }) => (
      <div key={`psl-${key}`} className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}:</span>
        -
      </div>
    ))
  ];
};

function PredictionScoresCard({ data, ...props }: { data: VariantOverview } & ComponentProps<'div'>) {
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
        <CardContent className="text-sm space-y-3">{predictionScoreList.slice(0, 4)}</CardContent>
      </Card>
    </>
  );
}

export default PredictionScoresCard;
