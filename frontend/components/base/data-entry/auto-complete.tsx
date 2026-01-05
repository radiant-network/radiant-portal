import { type KeyboardEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, XIcon } from 'lucide-react';

import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/base/shadcn/command';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

export type Option = {
  label: ReactNode;
  value: string;
  [name: string]: any;
};

export type AutoCompleteProps<T extends Option> = {
  options?: T[];
  emptyIndicator?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
  optionLabelProp?: keyof T;
  optionFilterProp?: keyof T;
  loading?: boolean;
  leftAddon?: ReactNode;
};

export function getSelectedOptionByValue<T extends Option>(value: string | undefined, options: T[]): T | undefined {
  return options.find(option => value === option.value);
}

export const AutoComplete = <T extends Option>({
  options: arrayOptions = [],
  placeholder,
  emptyIndicator,
  value,
  onChange,
  disabled,
  debounceDelay = 500,
  onSearch,
  optionFilterProp = 'label',
  optionLabelProp = 'label',
  className,
  loading,
  leftAddon,
}: AutoCompleteProps<T>) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(getSelectedOptionByValue(value, arrayOptions));
  const [inputValue, setInputValue] = useState<string>('');
  const [inputValueSearch, setInputValueSearch] = useState<string>('');
  const debouncedSearchTerm = useDebounce(inputValueSearch, debounceDelay);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && inputValue !== '') {
        const optionToSelect = arrayOptions.find(option => option[optionFilterProp] === inputValue);
        if (optionToSelect) {
          setSelected(optionToSelect);
          onChange?.(optionToSelect.value);
        }
      }

      if (event.key === 'Escape') {
        setOpen(false);
      }
    },
    [isOpen, arrayOptions, onChange, optionFilterProp, inputValue],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    // If optionLabelProp points to a ReactNode, use the 'label' property as fallback
    const labelValue = selected?.[optionLabelProp];
    const fallbackLabel = selected?.label;
    let displayValue = '';
    if (typeof labelValue === 'string') {
      displayValue = labelValue;
    } else if (typeof fallbackLabel === 'string') {
      displayValue = fallbackLabel;
    }
    setInputValue(displayValue);
  }, [selected, optionLabelProp]);

  const handleSelectOption = useCallback(
    (selectedOption: T) => {
      // If optionLabelProp points to a ReactNode, use the 'label' property as fallback for the input
      const labelValue = selectedOption[optionLabelProp];
      const fallbackLabel = selectedOption.label;
      let displayValue = '';
      if (typeof labelValue === 'string') {
        displayValue = labelValue;
      } else if (typeof fallbackLabel === 'string') {
        displayValue = fallbackLabel;
      }
      setInputValue(displayValue);
      setSelected(selectedOption);

      onChange?.(selectedOption.value);

      // Close the dropdown after selection
      setOpen(false);
    },
    [onChange, optionLabelProp],
  );

  useEffect(() => {
    if (value && arrayOptions.length > 0) {
      const selectedOption = getSelectedOptionByValue(value, arrayOptions);

      if (selectedOption) {
        setSelected(selectedOption);
        // If optionLabelProp points to a ReactNode, use the 'label' property as fallback
        const labelValue = selectedOption[optionLabelProp];
        const fallbackLabel = selectedOption.label;
        let displayValue = '';
        if (typeof labelValue === 'string') {
          displayValue = labelValue;
        } else if (typeof fallbackLabel === 'string') {
          displayValue = fallbackLabel;
        }
        setInputValue(displayValue);
      }
    }
  }, [value, arrayOptions, optionLabelProp]);

  useEffect(() => {
    if (!onSearch || !isOpen) return;

    if (debouncedSearchTerm) {
      onSearch?.(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, isOpen]);

  const filteredOptions = arrayOptions.filter(option =>
    option[optionFilterProp].toLowerCase().trim().includes(inputValueSearch.toLowerCase().trim()),
  );

  return (
    <CommandPrimitive
      onKeyDown={handleKeyDown}
      className={className}
      // purposely not using the filter prop here
      // because we want to control the visibility of the options
      // based on the custom optionFilterProp
      shouldFilter={false}
    >
      <div className="w-full relative shadow-xs outline-none focus-within:ring-1 focus-within:ring-ring rounded-md">
        <CommandInput
          value={inputValue}
          onValueChange={
            loading
              ? undefined
              : value => {
                  setInputValue(value);
                  setInputValueSearch(value);
                }
          }
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('text-sm', {
            'opacity-0': selected && typeof selected[optionLabelProp] !== 'string',
          })}
          leftAddon={leftAddon}
          rightAddon={
            <button
              type="button"
              onClick={() => {
                setSelected(undefined);
                setInputValue('');
                onChange?.('');
              }}
              className={cn('h-[26px] p-0', {
                hidden: !selected || disabled,
              })}
            >
              <XIcon size={16} className="" />
            </button>
          }
        />
        {/* Display badge overlay on input when an option with display is selected */}
        {selected && typeof selected[optionLabelProp] !== 'string' && (
          <div className="absolute inset-0 flex items-center px-3 pointer-events-none">{selected[optionLabelProp]}</div>
        )}
      </div>
      <div className="relative">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-popover outline-none shadow-md',
            isOpen ? 'block mt-1' : 'hidden',
          )}
        >
          <CommandList className="rounded-lg border">
            {loading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {filteredOptions.length > 0 && !loading ? (
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option[optionFilterProp]}
                    onMouseDown={event => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => handleSelectOption(option)}
                    className="cursor-pointer"
                  >
                    <span className="flex-1">{option.label}</span>
                    {option.value === value ? <Check className="w-4" /> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {!loading && (
              <CommandEmpty>{emptyIndicator || <div className="text-center text-sm">No data</div>}</CommandEmpty>
            )}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
