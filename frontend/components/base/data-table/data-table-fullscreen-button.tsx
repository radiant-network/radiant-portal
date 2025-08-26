import { Maximize, Minimize } from 'lucide-react';

import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { Skeleton } from '../ui/skeleton';

type DataTableFullscreenButtonProps = {
  active: boolean;
  handleClick: (value: boolean) => void;
  loading?: boolean;
};

function DataTableFullscreenButton({ active, loading = true, handleClick }: DataTableFullscreenButtonProps) {
  const { t } = useI18n();

  if (loading) return <Skeleton className="w-[24px] h-[24px]" />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="sm" variant="ghost" iconOnly onClick={() => handleClick(!active)}>
          {active ? <Minimize /> : <Maximize />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {active ? t('common.table.fullscreen.minimize') : t('common.table.fullscreen.maximize')}
      </TooltipContent>
    </Tooltip>
  );
}

export default DataTableFullscreenButton;
