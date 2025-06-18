import { formatDate } from 'date-fns';

type DateCellProps = {
  date: string;
};

function DateCell({ date }: DateCellProps) {
  return <div className="text-muted-foreground">{formatDate(date, 'yyyy-MM-dd')}</div>;
}

export default DateCell;
