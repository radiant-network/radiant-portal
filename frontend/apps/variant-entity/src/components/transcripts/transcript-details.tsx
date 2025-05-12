import { Transcript } from '@/api/api';
import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import ExpandableList from '@/components/base/list/expandable-list';
import { TFunction } from 'i18next';

interface TranscriptDetailsProps {
  data: Transcript;
}

function TranscriptDetails({ data }: TranscriptDetailsProps) {
  const { t } = useI18n();

  return (
    <div className="flex [&>div]:p-2 [&>div]:flex-1">
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <a
            href={`https://www.ensembl.org/id/${data?.transcript_id}`}
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {data?.transcript_id}
          </a>
          {data.is_canonical && (
            <Tooltip>
              <TooltipTrigger>
                <TranscriptCanonicalIcon size={16} className="text-primary" />
              </TooltipTrigger>
              <TooltipContent>{t('variant.canonicalTranscript')}</TooltipContent>
            </Tooltip>
          )}
        </div>
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
          {/**
           * TODO when api ready: ref: https://d3b.atlassian.net/browse/SJRA-146
           * <ImpactIcon value="HIGH" size={12} />
          <span className="text-sm">Stop Gained</span>
           */}
          -
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
  return [
    <div key="psl-sift" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.sift')}:</span>
      {data?.sift_pred && data.sift_score !== undefined ? (
        <span>
          {t(`common.filters.labels.sift_pred_value.${data.sift_pred}`)} ({data?.sift_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
    <div key="psl-fathmm" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.fathmm')}:</span>
      {data?.fathmm_pred && data.fathmm_score !== undefined ? (
        <span>
          {t(`common.filters.labels.fathmm_pred_value.${data.fathmm_pred}`)} ({data?.fathmm_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
    <div key="psl-caddraw" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.caddRaw')}:</span>
      <span>{data?.cadd_score ?? '-'}</span>
    </div>,
    <div key="psl-caddphred" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.caddPhred')}:</span>
      <span>{data?.cadd_phred ?? '-'}</span>
    </div>,
    <div key="psl-dann" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.dann')}:</span>
      <span>{data?.dann_score ?? '-'}</span>
    </div>,
    <div key="psl-lrt" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.lrt')}:</span>
      {data?.lrt_pred && data.lrt_score !== undefined ? (
        <span>
          {t(`common.filters.labels.lrt_pred_value.${data.lrt_pred}`)} ({data?.lrt_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
    <div key="psl-revel" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.revel')}:</span>
      <span>{data?.revel_score ?? '-'}</span>
    </div>,
    <div key="psl-polyphen2hvar" className="flex gap-2 items-center">
      <span className="text-muted-foreground">{t('variant.predictions.polyphen2hvar')}:</span>
      {data?.polyphen2_hvar_pred && data.polyphen2_hvar_score !== undefined ? (
        <span>
          {t(`common.filters.labels.polyphen2_hvar_pred_value.${data.polyphen2_hvar_pred}`)} (
          {data?.polyphen2_hvar_score})
        </span>
      ) : (
        '-'
      )}
    </div>,
  ];
};

export default TranscriptDetails;
