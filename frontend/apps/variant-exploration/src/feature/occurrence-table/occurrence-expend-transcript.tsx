import { ExpendedOccurrence, Occurrence } from '@/api/api';
import TranscriptManeSelectIcon from '@/components/base/icons/transcript-mane-select-icon';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import ImpactIcon from '@/components/feature/variant/impact-icon';
import ConsequenceLabel from '@/components/feature/variant/consequence-label';

type OccurrenceExpendTranscriptProps = {
  occurrence: ExpendedOccurrence;
};

export default function OccurrenceExpendTranscript({ occurrence }: OccurrenceExpendTranscriptProps) {
  const { t } = useI18n();

  const arn = occurrence.hgvsg.split(':')[1];

  return (
    <div className="flex items-center gap-3">
      { occurrence.ensembl_gene_id && (
        <>
          <div className="italic"><a href={`https://www.ensembl.org/Homo_sapiens/Transcript/Summary?g=${occurrence.ensembl_gene_id}`} target="_blank">{occurrence.ensembl_gene_id}</a></div>
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {occurrence.is_mane_select && (
        <>
          <div>{occurrence.is_mane_select && <TranscriptManeSelectIcon size={18} className="text-primary" />}</div>
          <Separator orientation="vertical" className="h-5" />
        </>
      )}
      {occurrence.exon_rank && occurrence.exon_total && (
        <>
          <div>Exon: {occurrence.exon_rank} / {occurrence.exon_total}</div>
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
