import DateCell from '@/components/base/data-table/cells/date-cell';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type InterpretationDateCellProps = {
  date?: string;
};

function InterpretationDateCell({ date }: InterpretationDateCellProps) {
  const { t } = useI18n();

  if (!date) return <DateCell date={date} />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <DateCell date={date} />
        </div>
      </TooltipTrigger>
      <TooltipContent>{t('patient_entity.genomics.interpretations.date_tooltip')}</TooltipContent>
    </Tooltip>
  );
}

export default InterpretationDateCell;
