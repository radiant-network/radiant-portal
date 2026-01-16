import { useMemo } from 'react';
import { TFunction } from 'i18next';

import { VariantOverview } from '@/api/api';
import Empty from '@/components/base/empty';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, CardProps } from '@/components/base/shadcn/card';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/shadcn/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

// eslint-disable-next-line complexity
const getPredictionList = (data: VariantOverview, t: TFunction<string, undefined>) => {
  const predictions: { key: string; label: string; value: string | React.ReactElement }[] = [];
  const empties: { key: string; label: string }[] = [];

  // revel
  if (data.revel_score) {
    predictions.push({
      key: 'revel',
      label: t('variant.predictions.revel'),
      value: `${data.revel_score}`,
    });
  } else {
    empties.push({
      key: 'revel',
      label: t('variant.predictions.revel'),
    });
  }

  // sift
  if (data.sift_pred && data.sift_score !== undefined) {
    const siftPref = t(`common.filters.values.sift_pred.${data.sift_pred}`);
    predictions.push({
      key: 'sift',
      label: t('variant.predictions.sift'),
      value: `${siftPref} (${data?.sift_score})`,
    });
  } else {
    empties.push({
      key: 'sift',
      label: t('variant.predictions.sift'),
    });
  }

  // loeuf
  if (data.gnomad_loeuf) {
    predictions.push({
      key: 'loeuf',
      label: t('variant.predictions.loeuf'),
      value: `${data.gnomad_loeuf}`,
    });
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
      label: t('variant.predictions.splice_ai'),
      value: (
        <div className="space-x-1">
          {data.spliceai_type?.map(type => (
            <Tooltip key={type}>
              <TooltipTrigger>
                <Badge variant="outline">{type}</Badge>
              </TooltipTrigger>
              <TooltipContent>{t(`variant.splice_ai.${type}`)}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      ),
    });
  } else {
    empties.push({
      key: 'spliceai',
      label: t('variant.predictions.splice_ai'),
    });
  }

  // fathmm
  if (data.fathmm_pred && data.fathmm_score !== undefined) {
    const fatmmPref = t(`common.filters.values.fathmm_pred.${data.fathmm_pred}`);
    predictions.push({
      key: 'fathmm',
      label: t('variant.predictions.fathmm'),
      value: `${fatmmPref} (${data?.fathmm_score})`,
    });
  } else {
    empties.push({
      key: 'fathmm',
      label: t('variant.predictions.fathmm'),
    });
  }

  // caddraw
  if (data.cadd_score) {
    predictions.push({
      key: 'caddraw',
      label: t('variant.predictions.cadd_raw'),
      value: `${data.cadd_score}`,
    });
  } else {
    empties.push({
      key: 'caddraw',
      label: t('variant.predictions.cadd_raw'),
    });
  }

  // caddphred
  if (data.cadd_phred) {
    predictions.push({
      key: 'caddphred',
      label: t('variant.predictions.cadd_phred'),
      value: `${data.cadd_phred}`,
    });
  } else {
    empties.push({
      key: 'caddphred',
      label: t('variant.predictions.cadd_phred'),
    });
  }

  // dann
  if (data.dann_score) {
    predictions.push({
      key: 'dann',
      label: t('variant.predictions.dann'),
      value: `${data.dann_score}`,
    });
  } else {
    empties.push({
      key: 'dann',
      label: t('variant.predictions.dann'),
    });
  }

  // lrt
  if (data?.lrt_pred && data.lrt_score !== undefined) {
    const lrtPred = t(`common.filters.values.lrt_pred.${data.lrt_pred}`);
    predictions.push({
      key: 'lrt',
      label: t('variant.predictions.lrt'),
      value: `${lrtPred} (${data?.lrt_score})`,
    });
  } else {
    empties.push({
      key: 'lrt',
      label: t('variant.predictions.lrt'),
    });
  }

  // polyphen2_hvar
  if (data.polyphen2_hvar_pred && data.polyphen2_hvar_score !== undefined) {
    const hvarPred = t(`common.filters.values.polyphen2_hvar_pred.${data.polyphen2_hvar_pred}`);
    predictions.push({
      key: 'polyphen2_hvar',
      label: t('variant.predictions.polyphen2hvar'),
      value: `${hvarPred} ${data.polyphen2_hvar_score}`,
    });
  } else {
    empties.push({
      key: 'polyphen2_hvar',
      label: t('variant.predictions.polyphen2hvar'),
    });
  }

  // phylop17way
  if (data.phyloP17way_primate) {
    predictions.push({
      key: 'phylop17way',
      label: t('variant.predictions.phylop17way'),
      value: `${data.phyloP17way_primate}`,
    });
  } else {
    empties.push({
      key: 'phylop17way',
      label: t('variant.predictions.phylop17way'),
    });
  }

  // pli
  if (data.gnomad_pli) {
    predictions.push({
      key: 'pli',
      label: t('variant.predictions.pli'),
      value: `${data?.gnomad_pli?.toExponential(2)}`,
    });
  } else {
    empties.push({
      key: 'pli',
      label: t('variant.predictions.pli'),
    });
  }

  return [
    ...predictions.map(({ key, label, value }) => (
      <div key={`psl-${key}`} className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}:</span>
        <span>{value}</span>
      </div>
    )),
    ...empties.map(({ key, label }) => (
      <div key={`psl-${key}`} className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}:</span>-
      </div>
    )),
  ];
};

function PredictionScoresCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();
  const predictionScoreList = useMemo(() => getPredictionList(data, t), [data, t]);

  // Check if all prediction scores are empty
  const hasAnyPredictionScores = useMemo(
    // eslint-disable-next-line complexity
    () =>
      !!(
        data.revel_score ||
        (data.sift_pred && data.sift_score !== undefined) ||
        data.gnomad_loeuf ||
        (data.spliceai_ds && data.spliceai_type?.length) ||
        (data.fathmm_pred && data.fathmm_score !== undefined) ||
        data.cadd_score ||
        data.cadd_phred ||
        data.dann_score ||
        (data?.lrt_pred && data.lrt_score !== undefined) ||
        (data.polyphen2_hvar_pred && data.polyphen2_hvar_score !== undefined) ||
        data.phyloP17way_primate ||
        data.gnomad_pli
      ),
    [data],
  );

  return (
    <>
      <Card data-cy="prediction-scores-card" {...props}>
        <CardHeader className="flex flex-row justify-between pb-0">
          <div className="font-semibold">{t('variant_entity.overview.prediction_scores')}</div>
          {hasAnyPredictionScores && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                  {t('common.view_all')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('variant_entity.overview.prediction_scores')}</DialogTitle>
                </DialogHeader>
                <DialogBody className="text-sm space-y-2">{predictionScoreList}</DialogBody>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent className="text-sm space-y-2 h-full">
          {hasAnyPredictionScores ? (
            predictionScoreList.slice(0, 4)
          ) : (
            <Empty bordered showIcon={false} description={t('variant.no_data_for_variant')} className="py-6 h-full" />
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default PredictionScoresCard;
