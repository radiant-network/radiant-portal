import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { toExponentialNotation } from '@/components/lib/number-format';

type NumberCellProps = {
  value?: number;
  locusId?: string;
};

/**
 * @todo hyperlink on the # participant_number redirect to the Data Explore and
 *       add the participant’s IDs to the query using studies.participant_ids.
 */
function ParticipantFrequencyCell({ value, locusId }: NumberCellProps) {
  if (value === undefined || locusId === undefined) return <EmptyCell />;
  const scientificNotation = toExponentialNotation(value);

  return (
    <AnchorLink size="sm" href={`/variants/entity/${locusId}?tab=patients`} target="_blank">
      {scientificNotation ? scientificNotation : value}
    </AnchorLink>
  );
}

export default ParticipantFrequencyCell;
