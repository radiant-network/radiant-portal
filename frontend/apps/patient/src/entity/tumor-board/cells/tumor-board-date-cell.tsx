import DateCell from '@/components/base/data-table/cells/date-cell';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type TumorBoardDateCellProps = {
  date?: string;
};

function TumorBoardDateCell({ date }: TumorBoardDateCellProps) {
  const { t } = useI18n();

  if (!date) return <DateCell date={date} asDate />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <DateCell date={date} asDate />
          <span className="sr-only">{t('patient_entity.tumor_board.date_tooltip')}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>{t('patient_entity.tumor_board.date_tooltip')}</TooltipContent>
    </Tooltip>
  );
}

export default TumorBoardDateCell;
