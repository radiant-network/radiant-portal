import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { enCA } from 'date-fns/locale/en-CA';
import { frCA } from 'date-fns/locale/fr-CA';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Calendar } from '@/components/base/shadcn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

type DateRangePickerProps = {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  numberOfMonths?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

function DateRangePicker({
  value,
  onChange,
  numberOfMonths = 2,
  placeholder,
  disabled,
  className,
  id,
}: DateRangePickerProps) {
  const { t, language } = useI18n();

  const locale = language === 'fr' ? frCA : enCA;
  const dateFormat = t('common.date.month_day_year');
  const formatDate = (date: Date) => format(date, dateFormat, { locale });

  let label = placeholder ?? t('common.date_picker.placeholder');
  if (value?.from) {
    label = value.to ? `${formatDate(value.from)} – ${formatDate(value.to)}` : formatDate(value.from);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          data-empty={!value?.from}
          className={cn('justify-start font-normal data-[empty=true]:text-muted-foreground', className)}
        >
          <CalendarIcon />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from}
          numberOfMonths={numberOfMonths}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;
