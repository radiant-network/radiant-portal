import { Link } from 'react-router';
import EmptyCell from '@/feature/occurrence-table/cells/empty-cell';
import { toExponentialNotation } from '@/components/lib/number-format';

type NumberCellProps = {
  value?: number;
};

/**
 * @todo hyperlink on the # participant_number redirect to the Data Explore and
 *       add the participant’s IDs to the query using studies.participant_ids.
 */
function ParticipantFrequencyCell({ value }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;
  const scientificNotation = toExponentialNotation(value);

  return (
    <Link to="/data-exploration" className="overflow-hidden text-ellipsis underline hover:no-underline">
      {scientificNotation ? scientificNotation : value}
    </Link>
  );
}

export default ParticipantFrequencyCell;
