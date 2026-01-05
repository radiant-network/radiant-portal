import { KeyboardEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, XIcon } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/base/shadcn/command';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

import { MultipleSelectorProps, MultiSelectorGroupOption, MultiSelectorOption } from './multi-selector.types';
import { getSelectedOptionByValue, isOptionsExist, transToGroupOption } from './multi-selector.utils';

function MultiSelector({
  value,
  onChange,
  placeholder,
  defaultOptions: arrayDefaultOptions = [],
  options: arrayOptions,
  debounceDelay = 500,
  onSearch,
  onSearchSync,
  emptyIndicator,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  hidePlaceholderWhenSelected,
  disabled,
  groupBy,
  className,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  hideClearAllButton = false,
  renderBadge,
  ref,
}: MultipleSelectorProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [onScrollbar, setOnScrollbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Added this

  const [selected, setSelected] = useState<MultiSelectorOption[]>(
    getSelectedOptionByValue(value || [], arrayDefaultOptions),
  );
  const [options, setOptions] = useState<MultiSelectorGroupOption>(transToGroupOption(arrayDefaultOptions, groupBy));
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, debounceDelay);

  useImperativeHandle(
    ref,
    () => ({
      selectedValue: [...selected],
      input: inputRef.current as HTMLInputElement,
      focus: () => inputRef?.current?.focus(),
      reset: () => setSelected([]),
    }),
    [selected],
  );

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };

  const handleUnselect = useCallback(
    (option: MultiSelectorOption) => {
      const newOptions = selected.filter(s => s.value !== option.value);
      setSelected(newOptions);
      onChange?.(newOptions.map(o => o.value));
    },
    [onChange, selected],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '' && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1];
            // If last item is fixed, we should not remove it.
            if (!lastSelectOption.fixed) {
              handleUnselect(selected[selected.length - 1]);
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [handleUnselect, selected],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchend', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (value && arrayDefaultOptions.length > 0) {
      setSelected(getSelectedOptionByValue(value, arrayDefaultOptions));
    }
  }, [value, arrayDefaultOptions]);

  useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) {
      return;
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy);
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption);
    }
  }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

  useEffect(() => {
    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
    };

    const exec = async () => {
      if (!onSearchSync || !open) return;

      if (triggerSearchOnFocus) {
        doSearchSync();
      }

      if (debouncedSearchTerm) {
        doSearchSync();
      }
    };

    void exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  useEffect(() => {
    /** async search */

    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      const groupedOptions = transToGroupOption(res || [], groupBy);
      setOptions(groupedOptions);
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;

      if (triggerSearchOnFocus) {
        await doSearch();
      }

      if (debouncedSearchTerm) {
        await doSearch();
      }
    };

    void exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  const CreatableItem = () => {
    if (!creatable) return undefined;
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selected.find(s => s.value === inputValue)
    ) {
      return undefined;
    }

    const Item = (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onSelect={(value: string) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length);
            return;
          }
          setInputValue('');
          // Clear search results by reverting to default options
          setOptions(transToGroupOption(arrayDefaultOptions, groupBy));
          // Close the dropdown
          setOpen(false);
          const newOptions = [...selected, { value, label: value }];
          setSelected(newOptions);
          onChange?.(newOptions.map(o => o.value));
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    );

    // For normal creatable
    if (!onSearch && inputValue.length > 0) {
      return Item;
    }

    // For async search creatable. avoid showing creatable item before loading at first.
    if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
      return Item;
    }

    return undefined;
  };

  const EmptyItem = useCallback(() => {
    // For async search that showing emptyIndicator
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return <div className="p-2 py-4 text-center text-sm">{t('common.filters.no_values_found')}</div>;
    }

    return (
      <CommandEmpty>
        {emptyIndicator || <div className="text-center text-sm">{t('common.filters.no_values_found')}</div>}
      </CommandEmpty>
    );
  }, [creatable, emptyIndicator, onSearch, options]);

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter;
    }

    if (creatable) {
      return (value: string, search: string) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1);
    }
    // Using default filter in `cmdk`. We don't have to provide it.
    return undefined;
  }, [creatable, commandProps?.filter]);

  return (
    <Command
      {...commandProps}
      onKeyDown={e => {
        handleKeyDown(e);
        commandProps?.onKeyDown?.(e);
      }}
      className={cn('h-auto overflow-visible bg-background', commandProps?.className)}
      shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch} // When onSearch is provided, we don't want to filter the options. You can still override it.
      filter={commandFilter()}
    >
      <div
        ref={dropdownRef}
        className={cn(
          'flex min-h-9 shadow-xs rounded-md border border-input text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring',
          {
            'px-3 py-2': selected.length !== 0,
            'cursor-text': !disabled && selected.length !== 0,
          },
          className,
        )}
        onClick={() => {
          if (disabled) return;
          inputRef?.current?.focus();
        }}
      >
        <div className="relative flex flex-1 flex-wrap gap-1">
          {selected.map(option => {
            if (renderBadge) {
              return renderBadge({
                option,
                onRemove: () => handleUnselect(option),
              });
            }

            return (
              <Badge key={option.value} data-disabled={disabled || undefined} onClose={() => handleUnselect(option)}>
                {option.badgeLabel || (typeof option.label === 'string' ? option.label : option.value)}
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputValue}
            disabled={disabled}
            onValueChange={value => {
              setInputValue(value);
              // Open dropdown when user starts typing (at least one character)
              if (value.length > 0) {
                setOpen(true);
              } else {
                setOpen(false);
              }
              inputProps?.onValueChange?.(value);
            }}
            onBlur={event => {
              if (!onScrollbar) {
                setOpen(false);
              }
              inputProps?.onBlur?.(event);
            }}
            onFocus={event => {
              // Only open dropdown if there's at least one character in input
              if (inputValue.length > 0) {
                setOpen(true);
              }
              inputProps?.onFocus?.(event);
            }}
            placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
              {
                'w-full': hidePlaceholderWhenSelected,
                'px-3 py-2': selected.length === 0,
                'ml-1': selected.length !== 0,
              },
              inputProps?.className,
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setSelected(selected.filter(s => s.fixed));
            onChange?.(selected.filter(s => s.fixed).map(o => o.value));
          }}
          className={cn(
            (hideClearAllButton ||
              disabled ||
              selected.length < 1 ||
              selected.filter(s => s.fixed).length === selected.length) &&
              'hidden',
          )}
        >
          <XIcon size={18} className="" />
        </button>
      </div>
      <div className={cn('relative', open ? 'block' : 'hidden')} ref={dropdownRef}>
        <CommandList
          className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95"
          onMouseLeave={() => {
            setOnScrollbar(false);
          }}
          onMouseEnter={() => {
            setOnScrollbar(true);
          }}
        >
          {isLoading ? (
            <div className="p-1">
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              {EmptyItem()}
              {CreatableItem()}
              {!selectFirstItem && <CommandItem value="-" className="hidden" />}
              {Object.entries(options).map(([key, dropdowns]) => (
                <CommandGroup key={key} heading={key} className="h-full overflow-auto">
                  <>
                    {dropdowns.map(option => {
                      const isSelected = selected.map(s => s.value)?.includes(option.value);

                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disable}
                          onSelect={() => {
                            if (selected.length >= maxSelected) {
                              onMaxSelected?.(selected.length);
                              return;
                            }
                            setInputValue('');
                            // Clear search results by reverting to default options
                            setOptions(transToGroupOption(arrayDefaultOptions, groupBy));
                            // Close the dropdown
                            setOpen(false);

                            let newOptions: MultiSelectorOption[] = [];

                            if (selected.find(s => s.value === option.value)) {
                              newOptions = selected.filter(s => s.value !== option.value);
                            } else {
                              newOptions = [...selected, option];
                            }

                            setSelected(newOptions);
                            onChange?.(newOptions.map(o => o.value));
                          }}
                          className={cn('cursor-pointer', option.disable && 'cursor-default text-muted-foreground')}
                        >
                          <span className="flex-1">{option.label}</span>
                          {isSelected ? <Check className="w-4" /> : null}
                        </CommandItem>
                      );
                    })}
                  </>
                </CommandGroup>
              ))}
            </>
          )}
        </CommandList>
      </div>
    </Command>
  );
}

MultiSelector.displayName = 'MultipleSelector';

export default MultiSelector;
