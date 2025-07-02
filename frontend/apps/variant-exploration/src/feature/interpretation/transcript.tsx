import { Occurrence } from '@/api/api';
import { Separator } from '@/components/base/ui/separator';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';

type InterpretationTranscriptProps = {
  occurrence: Occurrence;
};

function InterpretationTranscript({ occurrence }: InterpretationTranscriptProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center rounded-sm gap-4 border p-3">
      <span className="font-semibold text-base">
        {occurrence.symbol ? (
          <a
            href={getOmimOrgUrl({ symbol: occurrence.symbol })}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {occurrence.symbol}
          </a>
        ) : (
          '-'
        )}
      </span>
      {occurrence?.picked_consequences?.[0] && occurrence.vep_impact ? (
        <div className="flex items-center gap-1.5 text-sm">
          <ConsequenceLabel
            vepImpact={occurrence.vep_impact}
            consequence={occurrence.picked_consequences[0]}
            size="sm"
          />{' '}
          {occurrence.aa_change && ` - ${occurrence.aa_change}`}
        </div>
      ) : (
        '-'
      )}
      <Separator className="h-5" orientation="vertical" />
      {occurrence?.transcript_id && (
        <TranscriptIdLink
          transcriptId={occurrence.transcript_id}
          isCanonical={occurrence.is_canonical}
          linkClassName="text-sm text-primary"
        />
      )}
      <Separator className="h-5" orientation="vertical" />
      <div className="text-sm">
        <span className="text-muted-foreground">{t('variant.interpretationForm.transcript.exon')}:</span> <span>-</span>
      </div>
      {occurrence.rsnumber && (
        <>
          <Separator className="h-5" orientation="vertical" />
          <a
            href={`https://www.ncbi.nlm.nih.gov/snp/${occurrence.rsnumber}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm hover:underline"
          >
            {occurrence.rsnumber}
          </a>
        </>
      )}
    </div>
  );
}

export default InterpretationTranscript;
