import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/base/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/ui/popover';
import { PlusCircle, LucideIcon, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '@/components/base/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Aggregation } from '@/api/api';

// Extended Aggregation type to include optional icon
export interface AggregationWithIcon extends Aggregation {
  icon?: LucideIcon;
}

type FilterButtonProps = {
  label: string;
  options: AggregationWithIcon[];
  selected: string[];
  onSelect: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
  actionMode?: boolean;
  icon?: React.ReactNode;
  keyValueLabel?: boolean;
};

export default function FilterButton({
  label,
  options,
  selected,
  onSelect,
  className,
  placeholder,
  actionMode = false, // if true, there will be now count and no checkboxes
  icon,
  keyValueLabel = false,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const selectedCount = selected.length;

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onSelect(newSelected);
  };

  const handleClear = () => {
    onSelect([]);
  };

  const variant = actionMode ? 'ghost' : 'outline';
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} className={cn('h-8 py-2 px-3 border-dashed text-sm text-foreground', className)}>
          {icon ? icon : <PlusCircle className="" />}
          <span>{label}</span>
          {!actionMode && selectedCount > 0 && <Badge className="w-[20px] h-[20px] items-center justify-center">{selectedCount}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[229px] max-h-[240px] p-0 flex flex-col" align="start">
        <Command className="flex flex-col">
          <CommandInput
            placeholder={placeholder || label || 'Search...'}
            leftAddon={<Search size={16} className="text-muted-foreground mr-1" />}
            className="rounded-none"
            wrapperClassName="shrink-0 h-[40px] border-t-0 border-l-0 border-b-1 border-r-0 border-color-border rounded-none"
          />
          <CommandList className="overflow-y-auto p-0 flex-1 grow-1 basis-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="p-0">
              {options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <CommandItem
                    key={option.key}
                    onSelect={() => {
                      handleSelect(option.key || '');
                    }}
                    className="h-[32px] px-0 py-0 overflow-hidden"
                  >
                    {actionMode ? (
                      <Button
                        variant="ghost"
                        className="mx-2 my-1.5 p-0 h-full w-full items-center justify-start"
                      >
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
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                        />
                        <div className="flex w-full items-center gap-1 p-0 overflow-hidden min-w-0">
                          {IconComponent && <IconComponent size={20} />}
                          {keyValueLabel
                            ? (<div className="truncate"><span className="flex-1 min-w-0">
                              {option.key}
                            </span>
                              <span className="text-muted-foreground"> - {option.label}</span>
                            </div>)
                            : (
                              <span className="truncate flex-1 min-w-0">
                                {option.label}
                              </span>
                            )}
                        </div>
                      </div>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {selectedCount !== 0 && (
          <div className="h-[40px] flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full h-full"
              onClick={handleClear}
              disabled={selectedCount === 0}
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}