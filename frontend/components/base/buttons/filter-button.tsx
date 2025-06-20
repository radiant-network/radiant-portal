import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/base/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/ui/popover';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '@/components/base/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Aggregation } from '@/api/api';

type FilterButtonProps = {
  label: string;
  options: Aggregation[];
  selected: string[];
  onSelect: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
};

export default function FilterButton({
  label,
  options,
  selected,
  onSelect,
  className,
  placeholder = 'Search...',
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('h-8 py-6px border-dashed', className)}>
          <PlusCircle className="mr-2" /> {label}
          {selectedCount > 0 && <Badge className="ml-2">{selectedCount}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} className="radius-none" wrapperClassName="border-t-0 border-l-0 border-b-1 border-r-0 rounded-none" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.key}
                  onSelect={() => {
                    handleSelect(option.key || '');
                  }}
                >
                  <Checkbox
                    className="mr-2"
                    checked={selected.includes(option.key || '')}
                    onCheckedChange={() => {
                      handleSelect(option.key || '');
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {selectedCount !== 0 &&
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleClear}
              disabled={selectedCount === 0}
            >
              Clear
            </Button>
          </div>}
      </PopoverContent>
    </Popover>
  );
}