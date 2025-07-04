import { Transcript } from '@/api/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import ExpandableList from '@/components/base/list/expandable-list';
import { TFunction } from 'i18next';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';

interface TranscriptDetailsProps {
  data: Transcript;
}

function TranscriptDetails({ data }: TranscriptDetailsProps) {
  const { t } = useI18n();
  return (
    <div className="flex [&>div]:p-2 [&>div]:flex-1">
      <div className="space-y-2">
        {data.transcript_id && (
          <TranscriptIdLink
            transcriptId={data.transcript_id}
            isCanonical={data.is_canonical}
            isManePlus={data.is_mane_plus}
            isManeSelect={data.is_mane_select}
          />
        )}
        <div className="flex flex-col gap-2 text-muted-foreground text-xs">
          <span>Exon: {data.exon_rank && data.exon_total ? `${data.exon_rank} / ${data.exon_total}` : '-'}</span>
          {data.dna_change && <span>{data.dna_change}</span>}
          <div>
            <Tooltip>
              <TooltipTrigger>{data.aa_change && <span>{data.aa_change}</span>}</TooltipTrigger>
              <TooltipContent>{t('variantEntity.transcripts.aminoAcidSubstitution')}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <div className="">
            <ConsequenceLabel vepImpact={data.vep_impact!} consequence={data.consequences?.[0] || ''} size="sm" />
            <span className="text-sm">{data.aa_change && ` - ${data.aa_change}`}</span>
          </div>
        </div>
      </div>
      <div>
        <ExpandableList items={getPredictionList(data, t)} visibleCount={2} renderItem={item => item} />
      </div>
      <div className="text-sm">
        {data.phyloP17way_primate ? (
          <>
            <span className="text-muted-foreground">{t('variant.predictions.phylop17way')}:</span>{' '}
            {data.phyloP17way_primate}
          </>
        ) : (
          '-'
        )}
      </div>
    </div>
  );
}

const getPredictionList = (data: Transcript, t: TFunction<string, undefined>) => {
  const predictions: { key: string; label: string; value: string }[] = [];
  const empties: { key: string; label: string }[] = [];

  // sift
  if (data.sift_pred && data.sift_score !== undefined) {
    const siftPref = t(`common.filters.labels.sift_pred_value.${data.sift_pred}`);
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

  // fathmm
  if (data.fathmm_pred && data.fathmm_score !== undefined) {
    const fatmmPref = t(`common.filters.labels.fathmm_pred_value.${data.fathmm_pred}`);
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
      label: t('variant.predictions.caddRaw'),
      value: `${data.cadd_score}`,
    });
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
      value: `${data.cadd_phred}`,
    });
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
    const lrtPred = t(`common.filters.labels.lrt_pred_value.${data.lrt_pred}`);
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

  // polyphen2_hvar
  if (data.polyphen2_hvar_pred && data.polyphen2_hvar_score !== undefined) {
    const hvarPred = t(`common.filters.labels.polyphen2_hvar_pred_value.${data.polyphen2_hvar_pred}`);
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

  return [
    ...predictions.map(({ key, label, value }) => (
      <div key={`psl-${key}`} className="flex gap-2 items-center">
        <span className="text-muted-foreground">{label}:</span>
        <span>{value}</span>
      </div>
    )),
    ...empties.map(({ key, label }) => (
      <div key={`psl-${key}`} className="flex gap-2 items-center">
        <span className="text-muted-foreground">{label}:</span>-
      </div>
    )),
  ];
};

export default TranscriptDetails;
