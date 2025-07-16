import { ExpandedOccurrence, Occurrence } from '@/api/api';
import TranscriptManeSelectIcon from '@/components/base/icons/transcript-mane-select-icon';
import { Separator } from '@/components/base/ui/separator';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';

type OccurrenceExpandTranscriptProps = {
  occurrence: Occurrence;
  expandedOccurrence: ExpandedOccurrence;
};

export default function OccurrenceExpandTranscript({ occurrence, expandedOccurrence }: OccurrenceExpandTranscriptProps) {
  const arn = occurrence.hgvsg.split(':')[1];

  return (
    <div className="flex items-center gap-3">
      {occurrence.is_mane_select && (
        <>
          <div>{occurrence.is_mane_select && <TranscriptManeSelectIcon size={18} className="text-primary" />}</div>
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {expandedOccurrence.exon_rank && expandedOccurrence.exon_total && (
        <>
          <div>Exon: {expandedOccurrence.exon_rank} / {expandedOccurrence.exon_total}</div>
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {occurrence.picked_consequences.length > 0 && (
        <>
          {arn}
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
          <a target="_blank" href={`https://www.ncbi.nlm.nih.gov/snp/${occurrence.rsnumber}`}>
            {occurrence.rsnumber}
          </a>
        </>
      )}
    </div>
  );
}
