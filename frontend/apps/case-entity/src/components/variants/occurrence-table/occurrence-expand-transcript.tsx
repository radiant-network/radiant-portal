import { ExpandedOccurrence, Occurrence } from '@/api/api';
import { Separator } from '@/components/base/ui/separator';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';
import AnchorLink from '@/components/base/navigation/anchor-link';
import {
  getDbSnpUrl,
  getEnsemblGeneUrl,
  getOmimOrgUrl,
} from '@/components/feature/variant/utils';
import TranscriptIdLink from '@/components/feature/variant/transcript-id-link';

type OccurrenceExpandTranscriptProps = {
  occurrence: Occurrence;
  expandedOccurrence: ExpandedOccurrence;
};

export default function OccurrenceExpandTranscript({
  occurrence,
  expandedOccurrence,
}: OccurrenceExpandTranscriptProps) {
  return (
    <div className="flex items-center gap-3">
      {expandedOccurrence.symbol && (
        <div className="flex items-center gap-2">
          {expandedOccurrence.symbol && (
            <AnchorLink
              size="sm"
              variant="primary"
              href={getOmimOrgUrl({ symbol: expandedOccurrence.symbol })}
              target="_blank"
            >
              {expandedOccurrence.symbol}
            </AnchorLink>
          )}
          <div>
            {'('}
            <AnchorLink size="xs" variant="primary" href={getEnsemblGeneUrl(expandedOccurrence.symbol)} target="_blank">
              {'Ensembl'}
            </AnchorLink>
            {')'}
          </div>
          <Separator orientation="vertical" className="h-5" />
        </div>
      )}
      {occurrence?.transcript_id && (
        <>
          <TranscriptIdLink
            transcriptId={occurrence.transcript_id}
            isCanonical={occurrence.is_canonical}
            isManeSelect={occurrence.is_mane_select}
            isManePlus={occurrence.is_mane_plus}
            linkClassName="text-sm text-primary"
          />
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {expandedOccurrence.exon_rank && expandedOccurrence.exon_total && (
        <>
          <div>
            Exon: {expandedOccurrence.exon_rank} / {expandedOccurrence.exon_total}
          </div>
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {expandedOccurrence.dna_change && (
        <>
          {expandedOccurrence.dna_change}
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {occurrence.picked_consequences && occurrence.vep_impact && (
        <div className="flex items-center gap-2">
          <ConsequenceLabel
            vepImpact={occurrence.vep_impact}
            consequence={occurrence.picked_consequences[0]}
            size="sm"
          />{' '}
          {occurrence.aa_change && ` - ${occurrence.aa_change}`}
        </div>
      )}
      {occurrence.rsnumber && (
        <>
          <Separator orientation="vertical" className="h-5" />
          <a target="_blank" href={getDbSnpUrl(occurrence.rsnumber)}>
            {occurrence.rsnumber}
          </a>
        </>
      )}
    </div>
  );
}
