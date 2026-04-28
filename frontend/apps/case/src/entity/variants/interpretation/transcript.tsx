import { VepImpact } from '@/api/api';
import ConsequenceIndicator from '@/components/base/indicators/consequence-indicator';
import EmptyField from '@/components/base/information/empty-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Separator } from '@/components/base/shadcn/separator';
import { useI18n } from '@/components/hooks/i18n';
import TranscriptIdLink from 'components/base/variant/transcript-id-link';
import { getDbSnpUrl, getOmimOrgUrl } from 'components/base/variant/utils';

type InterpretationTranscriptProps = {
  symbol?: string;
  picked_consequences?: Array<string>;
  vep_impact?: VepImpact;
  aa_change?: string;
  transcript_id?: string;
  is_canonical?: boolean;
  is_mane_select?: boolean;
  is_mane_plus?: boolean;
  exon_rank?: number;
  exon_total?: number;
  dna_change?: string;
  rsnumber?: string;
};

function InterpretationTranscript({
  symbol,
  picked_consequences,
  vep_impact,
  aa_change,
  transcript_id,
  is_canonical,
  is_mane_select,
  is_mane_plus,
  exon_rank,
  exon_total,
  dna_change,
  rsnumber,
}: InterpretationTranscriptProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center rounded-sm gap-4 border p-3">
      <span className="font-semibold text-base">
        {symbol ? (
          <AnchorLink
            href={getOmimOrgUrl({ symbol })}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            size="sm"
          >
            {symbol}
          </AnchorLink>
        ) : (
          <EmptyField />
        )}
      </span>
      {picked_consequences?.[0] && vep_impact ? (
        <div className="flex items-center gap-1.5 text-sm">
          <ConsequenceIndicator vepImpact={vep_impact} consequence={picked_consequences[0]} size="sm" />{' '}
          {aa_change && ` - ${aa_change}`}
        </div>
      ) : (
        <EmptyField />
      )}
      <Separator className="h-5" orientation="vertical" />
      {transcript_id && (
        <TranscriptIdLink
          transcriptId={transcript_id}
          isCanonical={is_canonical}
          isManeSelect={is_mane_select}
          isManePlus={is_mane_plus}
          linkClassName="text-sm text-primary"
        />
      )}
      <Separator className="h-5" orientation="vertical" />
      <div className="text-sm">
        <span className="text-muted-foreground">
          {t('variant.interpretation_form.transcript.exon')}:{' '}
          {exon_rank && exon_total ? `${exon_rank} / ${exon_total}` : <EmptyField />}
        </span>
      </div>
      {dna_change && (
        <>
          <Separator className="h-5" orientation="vertical" />
          {dna_change}
        </>
      )}
      {rsnumber && (
        <>
          <Separator className="h-5" orientation="vertical" />
          <AnchorLink href={getDbSnpUrl(rsnumber)} target="_blank" rel="noreferrer" size="sm">
            {rsnumber}
          </AnchorLink>
        </>
      )}
    </div>
  );
}

export default InterpretationTranscript;
