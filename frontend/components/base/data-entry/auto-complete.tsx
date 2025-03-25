import { CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from '@/components/base/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { useState, useRef, useCallback, type KeyboardEvent, ReactNode, useEffect } from 'react';
import { Skeleton } from '@/components/base/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, XIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export type Option = {
  label: ReactNode;
  value: string;
  [name: string]: any;
};

type AutoCompleteProps<T extends Option> = {
  defaultOptions?: T[];
  emptyIndicator?: ReactNode;
  value?: string;
  onChange?: (value: string | undefined) => void;
  onSearch?: (value: string) => Promise<T[]>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
  optionLabelProp?: keyof T;
  optionFilterProp?: keyof T;
};

export function getSelectedOptionByValue<T extends Option>(value: string | undefined, options: T[]): T | undefined {
  return options.find(option => value === option.value);
}

export const AutoComplete = <T extends Option>({
  defaultOptions = [],
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
}: AutoCompleteProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(getSelectedOptionByValue(value, defaultOptions));
  const [options, setOptions] = useState<T[]>(defaultOptions);
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
        const optionToSelect = options.find(option => option[optionFilterProp] === input.value);
        if (optionToSelect) {
          setSelected(optionToSelect);
          onChange?.(optionToSelect.value);
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [isOpen, options, onChange],
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
    if (value && defaultOptions.length > 0) {
      const selectedOption = getSelectedOptionByValue(value, defaultOptions);
      setSelected(selectedOption);
      setInputValue(selectedOption?.[optionLabelProp] || '');
    }
  }, [value, defaultOptions]);

  useEffect(() => {
    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(res || []);
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;

      if (debouncedSearchTerm) {
        await doSearch();
      }
    };

    void exec();
  }, [debouncedSearchTerm, open]);

  const filteredOptions = options.filter(option =>
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
      <div className="relative outline-none focus-within:ring-2 focus-within:ring-ring rounded-md">
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={
            isLoading
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
          rightAddon={
            <button
              type="button"
              onClick={() => {
                setSelected(undefined);
                setInputValue('');
                onChange?.(undefined);
              }}
              className={cn('h-[26px] p-0', {
                hidden: !selected || disabled,
              })}
            >
              <XIcon size={18} className="" />
            </button>
          }
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-popover outline-none shadow-md',
            isOpen ? 'block' : 'hidden',
          )}
        >
          <CommandList className="rounded-lg border">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {filteredOptions.length > 0 && !isLoading ? (
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
            {!isLoading && (
              <CommandEmpty>{emptyIndicator || <div className="text-center text-sm">No data</div>}</CommandEmpty>
            )}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
