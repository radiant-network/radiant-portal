import { useId, useState } from 'react';
import { isValid, parse } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Calendar } from '@/components/base/shadcn/calendar';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/base/shadcn/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { useI18n } from '@/components/hooks/i18n';
import { formatLocalizedDate, getDateFnsLocale } from '@/components/lib/date';
import { cn } from '@/lib/utils';

export type DatePickerVariant = 'icon-left' | 'icon-right' | 'input' | 'icon';

type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  variant?: DatePickerVariant;
  captionLayout?: React.ComponentProps<typeof Calendar>['captionLayout'];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

function DatePicker({
  value,
  onChange,
  variant = 'icon-left',
  captionLayout,
  placeholder,
  disabled,
  className,
  id,
}: DatePickerProps) {
  const { t, language } = useI18n();
  const valueId = useId();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(value);

  const dateFormat = t('common.date.month_day_year');
  const formattedValue = value ? formatLocalizedDate(value, dateFormat, language) : '';
  // Text being typed in the `input` variant, null when not editing
  const [draft, setDraft] = useState<string | null>(null);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
    const date = parse(event.target.value, dateFormat, new Date(), { locale: getDateFnsLocale(language) });
    if (isValid(date)) {
      onChange(date);
      setMonth(date);
    }
  };

  const renderCalendar = (align: 'start' | 'end' = 'start') => (
    <PopoverContent className="w-auto overflow-hidden p-0" align={align}>
      <Calendar
        mode="single"
        selected={value}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        captionLayout={captionLayout}
        autoFocus
      />
    </PopoverContent>
  );

  if (variant === 'input') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <InputGroup data-disabled={disabled} className={className}>
          <InputGroupInput
            id={id}
            value={draft ?? formattedValue}
            placeholder={placeholder ?? t('common.date_picker.placeholder')}
            disabled={disabled}
            onChange={handleInputChange}
            onBlur={() => setDraft(null)}
            onKeyDown={event => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setOpen(true);
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <PopoverTrigger asChild>
              <InputGroupButton size="icon-xs" disabled={disabled} aria-label={t('a11y.date_picker.open_calendar')}>
                <CalendarIcon />
              </InputGroupButton>
            </PopoverTrigger>
          </InputGroupAddon>
        </InputGroup>
        {renderCalendar('end')}
      </Popover>
    );
  }

  if (variant === 'icon') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="ghost"
            iconOnly
            disabled={disabled}
            className={className}
            aria-label={t('a11y.date_picker.open_calendar')}
          >
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        {renderCalendar()}
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          data-empty={!value}
          // A <label htmlFor> overrides the button text, so expose the value as a description
          aria-describedby={id ? valueId : undefined}
          className={cn(
            'w-full font-normal data-[empty=true]:text-muted-foreground',
            variant === 'icon-right' ? 'justify-between' : 'justify-start',
            className,
          )}
        >
          {variant === 'icon-left' && <CalendarIcon />}
          <span id={valueId}>{formattedValue || placeholder || t('common.date_picker.placeholder')}</span>
          {variant === 'icon-right' && <ChevronDownIcon />}
        </Button>
      </PopoverTrigger>
      {renderCalendar()}
    </Popover>
  );
}

export default DatePicker;
