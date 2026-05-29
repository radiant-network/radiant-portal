import { useState } from 'react';
import { LucideIcon, PlusCircle, Search } from 'lucide-react';

import CheckboxFilter from '@/components/base/checkboxes/checkbox-filter';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/base/shadcn/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

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
  showKey?: boolean;
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
  showKey?: boolean; // display the option key in front of the label ("key - label")
  withTooltip?: boolean; // wrap each item in a hover tooltip
};

const CustomCommandItem = ({
  option,
  handleSelect,
  closeOnSelect,
  setOpen,
  actionMode,
  selected,
  showKey,
  withTooltip,
}: {
  option: IFilterButtonItem;
  handleSelect: (value: string) => void;
  closeOnSelect: boolean;
  setOpen: (open: boolean) => void;
  actionMode: boolean;
  selected: string[];
  showKey: boolean;
  withTooltip: boolean;
}) => {
  const IconComponent = option.icon;
  const isSelected = selected.includes(option.key || '');
  const labelText = typeof option.label === 'string' ? option.label : '';

  // showKey renders the single-line "key - label" display (truncated, muted label).
  const keyLabelContent = (
    <>
      {option.key}
      <span className="text-muted-foreground"> - {labelText}</span>
    </>
  );

  // withTooltip anchors the tooltip on the label itself: the trigger is an inline-block so it
  // sizes to the text (tooltip centered on the label, not the whole row), with max-w-full +
  // truncate for long values. Selection is driven solely by CommandItem.onSelect (keyboard +
  // click bubbling), so onCheckedChange is omitted; onMouseDown preventDefault keeps the
  // search input focused.
  let label: React.ReactNode;
  if (withTooltip) {
    label = (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block max-w-full truncate align-middle">
              {showKey ? keyLabelContent : option.label}
            </span>
          </TooltipTrigger>
          <TooltipContent>{option.tooltip || option.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (showKey) {
    label = <span className="block truncate">{keyLabelContent}</span>;
  } else {
    label = option.label;
  }

  const checkboxFilter = (
    <CheckboxFilter
      fluid
      size="sm"
      className="mx-2 my-1.5"
      checked={isSelected}
      label={label}
      icon={IconComponent ? <IconComponent /> : undefined}
      count={option.count}
      onMouseDown={e => e.preventDefault()}
    />
  );

  let content: React.ReactNode;
  if (actionMode) {
    content = (
      <Button variant="ghost" className="mx-2 my-1.5 p-0 h-full w-full items-center justify-start font-normal">
        {option.label}
      </Button>
    );
  } else {
    content = checkboxFilter;
  }

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
      {content}
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
  showKey = false, // defaults to false
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
            placeholder={placeholder || label || t('common.filters.select_placeholder')}
            leftAddon={<Search size={16} className="text-muted-foreground mr-1" />}
            wrapperClassName="shrink-0 h-10 border-t-0 border-l-0 border-b-1 border-r-0 border-color-border rounded-none"
          />
          <CommandList>
            <CommandEmpty>{t('common.table.no_result')}</CommandEmpty>
            <CommandGroup>
              {optionSnapshot.selectedOptions.map(option => (
                <CustomCommandItem
                  key={option.key}
                  option={option}
                  handleSelect={handleSelect}
                  closeOnSelect={closeOnSelect}
                  setOpen={setOpen}
                  actionMode={actionMode}
                  selected={selected}
                  showKey={showKey}
                  withTooltip={withTooltip}
                />
              ))}
            </CommandGroup>
            {optionSnapshot.selectedOptions.length > 0 && <CommandSeparator />}
            <CommandGroup>
              {optionSnapshot.unselectedOptions.map(option => (
                <CustomCommandItem
                  key={option.key}
                  option={option}
                  handleSelect={handleSelect}
                  closeOnSelect={closeOnSelect}
                  setOpen={setOpen}
                  actionMode={actionMode}
                  selected={selected}
                  showKey={showKey}
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
