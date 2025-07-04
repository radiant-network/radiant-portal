import { useQueryBarContext } from './query-bar-context';
import { TrashIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/ui/popover';
import { Button } from '@/components/base/ui/button';
import { PopoverClose } from '@radix-ui/react-popover';
import { useQueryBuilderDictContext } from '../query-builder-context';

function QueryBarDeleteAction() {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button iconOnly variant="ghost" size="sm">
          <TrashIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-[200px] space-y-3">
        <div className="text-sm">{dict.queryBar.deletePopover.title}</div>
        <div className="flex gap-1 justify-end">
          <PopoverClose asChild>
            <Button size="xs" variant="outline">
              {dict.queryBar.deletePopover.cancel}
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button size="xs" variant="destructive" onClick={() => query.delete()}>
              {dict.queryBar.deletePopover.ok}
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default QueryBarDeleteAction;
