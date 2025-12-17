import { useState } from 'react';
import { SaveIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import { useQueryBuilderDictContext } from '../query-builder-context';

import { useQueryBarContext } from './query-bar-context';
import QueryBarSaveDialog from './query-bar-save-dialog';

/**
 * Will be display only if customPillConfig is enabled
 * - Will displayed beside the query (not the saved filter at the top)
 *
 * @TODO: What are custom pill? In witch context to we need them?
 */
function QueryBarSaveAction() {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button iconOnly variant="ghost" size="sm" onClick={() => setOpen(true)} disabled={query.hasCustomPill()}>
            <SaveIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px]">
          {query.hasCustomPill()
            ? dict.queryBar.customPill.cannotSaveAsCustomPill
            : dict.queryBar.customPill.createTooltip}
        </TooltipContent>
      </Tooltip>
      <QueryBarSaveDialog open={open} onOpenChange={setOpen} query={query} />
    </>
  );
}

export default QueryBarSaveAction;
