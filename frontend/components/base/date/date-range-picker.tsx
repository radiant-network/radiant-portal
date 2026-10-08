import { useId } from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Calendar } from '@/components/base/shadcn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { useI18n } from '@/components/hooks/i18n';
import { formatLocalizedDate } from '@/components/lib/date';
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
  const valueId = useId();

  const dateFormat = t('common.date.month_day_year');
  const formatDate = (date: Date) => formatLocalizedDate(date, dateFormat, language);

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
          // A <label htmlFor> overrides the button text, so expose the value as a description
          aria-describedby={id ? valueId : undefined}
          className={cn('justify-start font-normal data-[empty=true]:text-muted-foreground', className)}
        >
          <CalendarIcon />
          <span id={valueId}>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from}
          numberOfMonths={numberOfMonths}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;
