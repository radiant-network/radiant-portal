import { type KeyboardEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, XIcon } from 'lucide-react';

import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/base/ui/command';
import { Skeleton } from '@/components/base/ui/skeleton';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(getSelectedOptionByValue(value, arrayOptions));
  const [inputValue, setInputValue] = useState<string>('');
  const [inputValueSearch, setInputValueSearch] = useState<string>('');
  const debouncedSearchTerm = useDebounce(inputValueSearch, debounceDelay);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = arrayOptions.find(option => option[optionFilterProp] === input.value);
        if (optionToSelect) {
          setSelected(optionToSelect);
          onChange?.(optionToSelect.value);
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [isOpen, arrayOptions, onChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(selected?.[optionLabelProp] || '');
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: T) => {
      setInputValue(selectedOption[optionLabelProp]);
      setSelected(selectedOption);

      onChange?.(selectedOption.value);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onChange],
  );

  useEffect(() => {
    if (value && arrayOptions.length > 0) {
      const selectedOption = getSelectedOptionByValue(value, arrayOptions);

      if (selectedOption) {
        setSelected(selectedOption);
        setInputValue(selectedOption[optionLabelProp]);
      }
    }
  }, [value, arrayOptions]);

  useEffect(() => {
    if (!onSearch || !open) return;

    if (debouncedSearchTerm) {
      onSearch?.(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, open]);

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
          ref={inputRef}
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
          className="text-sm"
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
