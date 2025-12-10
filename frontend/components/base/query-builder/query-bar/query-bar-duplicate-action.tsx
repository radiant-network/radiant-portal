import { CopyIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';

import { useQueryBarContext } from './query-bar-context';

function QueryBarDuplicateAction() {
  const { query } = useQueryBarContext();

  return (
    <Button iconOnly variant="ghost" size="sm" onClick={() => query.duplicate()}>
      <CopyIcon />
    </Button>
  );
}

export default QueryBarDuplicateAction;
