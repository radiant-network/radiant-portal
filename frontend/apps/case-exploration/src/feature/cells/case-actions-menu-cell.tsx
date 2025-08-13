import { Button } from '@/components/base/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';
import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, ExternalLink } from 'lucide-react';
import { CaseResult } from '@/api/api';

function CaseActionsMenuCell({ row }: CellContext<CaseResult, any>) {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button iconOnly variant="outline" onClick={row.getToggleExpandedHandler()} className="size-6">
            {<EllipsisVertical />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              navigate(`/case/entity/${row.original.case_id}`);
            }}
          >
            <ExternalLink />
            {t('case_exploration.case.actions.view_case')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!row.original.has_variants}
            onClick={() => {
              navigate(`/case/entity/${row.original.case_id}?tab=variants`);
            }}
          >
            <ExternalLink />
            {t('case_exploration.case.actions.view_variant')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default CaseActionsMenuCell;
