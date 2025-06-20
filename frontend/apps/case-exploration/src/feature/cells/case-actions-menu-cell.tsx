import { Button } from '@/components/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';
import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, ExternalLink } from 'lucide-react';

function CaseActionsMenuCell({ row }: CellContext<any, any>) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            iconOnly
            variant="ghost"
            onClick={row.getToggleExpandedHandler()}
            className="text-muted-foreground size-6"
          >
            {<EllipsisVertical />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <ExternalLink />
            {t('caseExploration.case.actions.view_case')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ExternalLink />
            {t('caseExploration.case.actions.view_variant')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default CaseActionsMenuCell;
