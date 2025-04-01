import { CopyIcon } from 'lucide-react';
import { useQueryBarContext } from './query-bar-context';
import { Button } from '@/components/base/ui/button';

function QueryBarDuplicateAction() {
  const { query } = useQueryBarContext();

  return (
    <Button iconOnly variant="ghost" size="sm" onClick={() => query.duplicate()}>
      <CopyIcon />
    </Button>
  );
}

export default QueryBarDuplicateAction;
