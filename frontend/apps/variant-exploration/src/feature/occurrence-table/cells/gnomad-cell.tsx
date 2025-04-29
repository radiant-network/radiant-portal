import EmptyCell from '@/feature/occurrence-table/cells/empty-cell';
import { toExponentialNotation } from '@/components/lib/number-format';
import ShapeCircleIcon from '@/components/base/icons/shape-circle-icon';

const GNOMAD_THRESHOLD = 0.01;

type NumberCellProps = {
  value?: number;
};

/**
 * Put the value in scientific writing 2 digits after the decimal point
 * Indicator: Red circle when values are < 1%
 */
function GnomadCell({ value }: NumberCellProps) {
  if (value === undefined) return <EmptyCell />;
  const scientificNotation = toExponentialNotation(value);

  return (
    <span className="flex gap-2 items-center">
      {value < GNOMAD_THRESHOLD && <ShapeCircleIcon className="text-red-500" size={10} />}
      {scientificNotation ? scientificNotation : value}
    </span>
  );
}

export default GnomadCell;
