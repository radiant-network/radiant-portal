import { Separator } from '@/components/base/ui/separator';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';
import { getDbSnpUrl, getOmimOrgUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';
import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';

type InterpretationTranscriptProps = {
  occurrence?: ExpandedGermlineSNVOccurrence;
};

function InterpretationTranscript({ occurrence }: InterpretationTranscriptProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center rounded-sm gap-4 border p-3">
      <span className="font-semibold text-base">
        {occurrence?.symbol ? (
          <AnchorLink
            href={getOmimOrgUrl({ symbol: occurrence.symbol })}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            size="sm"
          >
            {occurrence.symbol}
          </AnchorLink>
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
          isManeSelect={occurrence.is_mane_select}
          isManePlus={occurrence.is_mane_plus}
          linkClassName="text-sm text-primary"
        />
      )}
      <Separator className="h-5" orientation="vertical" />
      <div className="text-sm">
        <span className="text-muted-foreground">
          {t('variant.interpretationForm.transcript.exon')}:{' '}
          {occurrence?.exon_rank && occurrence?.exon_total
            ? `${occurrence?.exon_rank} / ${occurrence?.exon_total}`
            : '-'}
        </span>
      </div>
      {occurrence?.dna_change && (
        <>
          <Separator className="h-5" orientation="vertical" />
          {occurrence.dna_change}
        </>
      )}
      {occurrence?.rsnumber && (
        <>
          <Separator className="h-5" orientation="vertical" />
          <AnchorLink
            href={getDbSnpUrl(occurrence.rsnumber)}
            target="_blank"
            rel="noreferrer"
            size="sm"
          >
            {occurrence.rsnumber}
          </AnchorLink>
        </>
      )}
    </div>
  );
}

export default InterpretationTranscript;
