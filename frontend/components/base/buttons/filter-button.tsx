import { useState } from 'react';
import { LucideIcon, PlusCircle, Search } from 'lucide-react';

import { Badge } from '@/components/base/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/base/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

export type PopoverSize = 'sm' | 'lg' | 'md' | 'xs';

// Extended Aggregation type to include optional icon
export interface IFilterButtonItem {
  count?: number;
  key?: string;
  icon?: LucideIcon;
  tooltip?: string | React.ReactNode;
  label?: string | React.ReactNode;
}

export interface IFilterButton {
  key: string;
  label: string;
  isVisible: boolean;
  isOpen: boolean;
  selectedItems: string[];
  popoverSize?: PopoverSize;
  options: IFilterButtonItem[];
  icon?: any;
  count?: number;
  optionRenderer?: (option: IFilterButtonItem) => React.ReactNode;
  withTooltip?: boolean;
}

type FilterButtonProps = {
  label: string;
  options: IFilterButtonItem[];
  selected: string[];
  onSelect: (selected: string[]) => void;
  popoverSize?: PopoverSize;
  className?: string;
  placeholder?: string;
  actionMode?: boolean; // display as link actions instead of checkbox
  icon?: React.ReactNode;
  isOpen?: boolean;
  closeOnSelect?: boolean;
  optionRenderer?: (option: IFilterButtonItem) => React.ReactNode;
  withTooltip?: boolean; // new prop for tooltip functionality
};

const CustomCommandItem = ({
  option,
  handleSelect,
  closeOnSelect,
  setOpen,
  actionMode,
  selected,
  withTooltip,
}: {
  option: IFilterButtonItem;
  handleSelect: (value: string) => void;
  closeOnSelect: boolean;
  setOpen: (open: boolean) => void;
  actionMode: boolean;
  selected: string[];
  withTooltip: boolean;
}) => {
  const IconComponent = option.icon;
  return (
    <CommandItem
      key={option.key}
      onSelect={() => {
        handleSelect(option.key || '');
        if (closeOnSelect) {
          setOpen(false);
        }
      }}
      className="p-0 overflow-hidden hover:bg-accent hover:text-accent-foreground focus:bg-transparent focus:text-foreground"
    >
      {actionMode ? (
        <Button variant="ghost" className="mx-2 my-1.5 p-0 h-full w-full items-center justify-start font-normal">
          {option.label}
        </Button>
      ) : (
        <div className="flex row mx-2 my-1.5 p-0 w-full gap-2 items-center overflow-hidden">
          <Checkbox
            className="mr-0"
            checked={selected.includes(option.key || '')}
            onCheckedChange={() => {
              handleSelect(option.key || '');
            }}
            onMouseDown={e => {
              e.preventDefault();
            }}
          />
          <div className="flex w-full items-center gap-1 overflow-hidden min-w-0">
            {IconComponent && <IconComponent size={20} />}
            {withTooltip ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">
                      <span className="flex-1 min-w-0">{option.key}</span>
                      <span className="text-muted-foreground"> - {option.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{option.tooltip || option.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span className="truncate flex-1 min-w-0">{option.label}</span>
            )}
          </div>
          {option.count !== undefined && (
            <span className="text-muted-foreground text-sm shrink-0 ml-2">{option.count}</span>
          )}
        </div>
      )}
    </CommandItem>
  );
};

function getSelectedOptions(options: IFilterButtonItem[], selected: string[]) {
  return options.filter(option => selected.includes(option.key || ''));
}

function getUnselectedOptions(options: IFilterButtonItem[], selected: string[]) {
  return options.filter(option => !selected.includes(option.key || ''));
}

export default function FilterButton({
  label,
  options,
  selected,
  onSelect,
  className,
  popoverSize = 'sm',
  placeholder,
  actionMode = false, // if true, there will be now count and no checkboxes
  icon,
  isOpen: openOnAppear = false,
  closeOnSelect = false,
  withTooltip = false, // defaults to false
}: FilterButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(openOnAppear);
  const [firstOpen, setFirstOpen] = useState(true);
  const selectedCount = selected.length;

  // Store a snapshot of selected/unselected options when popover opens
  const [optionSnapshot, setOptionSnapshot] = useState<{
    selectedOptions: IFilterButtonItem[];
    unselectedOptions: IFilterButtonItem[];
  }>({
    selectedOptions: getSelectedOptions(options, selected),
    unselectedOptions: getUnselectedOptions(options, selected),
  });

  // When popover opens, update the snapshot
  const handleOpenChange = (newOpen: boolean) => {
    if (firstOpen && openOnAppear) {
      setFirstOpen(false);
      setOpen(openOnAppear);
    } else {
      setOpen(newOpen);
      if (newOpen) {
        setOptionSnapshot({
          selectedOptions: getSelectedOptions(options, selected).sort((a, b) => {
            const labelA = typeof a.label === 'string' ? a.label : '';
            const labelB = typeof b.label === 'string' ? b.label : '';
            return labelA.localeCompare(labelB);
          }),
          unselectedOptions: getUnselectedOptions(options, selected),
        });
      }
    }
  };

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
    onSelect(newSelected);
  };

  const handleClear = () => {
    onSelect([]);
  };

  const variant = actionMode ? 'ghost' : 'outline';

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant={variant} size="sm" className={cn('border-dashed', className)}>
          {icon ? icon : <PlusCircle className="" />}
          <span>{label}</span>
          {!actionMode && selectedCount > 0 && (
            <Badge className="size-5 items-center justify-center">{selectedCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn('p-0 flex flex-col', {
          'w-48 max-h-96': popoverSize === 'xs',
          'w-56 max-h-96': popoverSize === 'sm',
          'w-72 max-h-96': popoverSize === 'md',
          'w-120 max-h-96': popoverSize === 'lg',
        })}
        align="start"
        onMouseLeave={() => setOpen(false)}
      >
        {/* value prevent the default selection/hover style of the first element in the command list */}
        <Command className="flex flex-col border-border border-0 border-b-none rounded-b-none" value="">
          <CommandInput
            placeholder={placeholder || label || 'Search...'}
            leftAddon={<Search size={16} className="text-muted-foreground mr-1" />}
            wrapperClassName="shrink-0 h-10 border-t-0 border-l-0 border-b-1 border-r-0 border-color-border rounded-none"
          />
          <CommandList>
            <CommandEmpty>{t('common.table.no_result')}</CommandEmpty>
            <CommandGroup>
              {optionSnapshot.selectedOptions
                .filter(option => option.count !== 0)
                .map(option => (
                  <CustomCommandItem
                    key={option.key}
                    option={option}
                    handleSelect={handleSelect}
                    closeOnSelect={closeOnSelect}
                    setOpen={setOpen}
                    actionMode={actionMode}
                    selected={selected}
                    withTooltip={withTooltip}
                  />
                ))}
            </CommandGroup>
            {optionSnapshot.selectedOptions.length > 0 && <CommandSeparator />}
            <CommandGroup>
              {optionSnapshot.unselectedOptions
                .filter(option => option.count !== 0)
                .map(option => (
                  <CustomCommandItem
                    key={option.key}
                    option={option}
                    handleSelect={handleSelect}
                    closeOnSelect={closeOnSelect}
                    setOpen={setOpen}
                    actionMode={actionMode}
                    selected={selected}
                    withTooltip={withTooltip}
                  />
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {selectedCount !== 0 && !actionMode && (
          <div className="size-full border-t-1 rounded-none border-border p-1">
            <Button
              variant="ghost"
              size="sm"
              className="size-full"
              onClick={handleClear}
              disabled={selectedCount === 0}
            >
              {t('common.actions.clear')}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
