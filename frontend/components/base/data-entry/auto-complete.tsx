import { CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from '@/components/base/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { useState, useRef, useCallback, type KeyboardEvent, ReactNode, useEffect } from 'react';
import { Skeleton } from '@/components/base/ui/skeleton';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

type AutoCompleteProps = {
  defaultOptions?: Option[];
  emptyIndicator?: ReactNode;
  value?: string;
  onChange?: (value: string | undefined) => void;
  onSearch?: (value: string) => Promise<Option[]>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
};

export function getSelectedOptionByValue(value: string | undefined, options: Option[]): Option | undefined {
  return options.find(option => value === option.value);
}

export const AutoComplete = ({
  defaultOptions = [],
  placeholder,
  emptyIndicator,
  value,
  onChange,
  disabled,
  debounceDelay = 500,
  onSearch,
  className,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(getSelectedOptionByValue(value, defaultOptions));
  const [options, setOptions] = useState<Option[]>(defaultOptions);
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
        const optionToSelect = options.find(option => option.label === input.value);
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
    setInputValue(selected?.label || '');
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);
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
      setInputValue(selectedOption?.label || '');
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

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} className={className} shouldFilter={!onSearch}>
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
            {options.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onMouseDown={event => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => handleSelectOption(option)}
                    className="cursor-pointer"
                  >
                    {option.label}
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
