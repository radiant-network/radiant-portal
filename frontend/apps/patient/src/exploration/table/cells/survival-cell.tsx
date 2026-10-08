import EmptyCell from '@/components/base/data-table/cells/empty-cell';

type SurvivalCellProps = {
  days: number | null;
};

function SurvivalCell({ days }: SurvivalCellProps) {
  if (days == null) return <EmptyCell />;
  return <span className="font-mono text-xs tabular-nums">{days.toLocaleString()} d</span>;
}

export default SurvivalCell;
