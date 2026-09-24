import { EllipsisVertical, ExternalLink } from 'lucide-react';

import type { CaseResult } from '@/api/api';
import type { AppFeatures, CellContext } from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { CaseEntityTabs } from '@/components/cores/types/case-tabs';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalNavigation } from '@/components/hooks/use-local-path';

function CaseActionsMenuCell({ row }: CellContext<AppFeatures, CaseResult, any>) {
  const { t } = useI18n();
  const navigate = useLocalNavigation();

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
            data-cy="menu-item-case"
            onClick={() => {
              navigate(`/case/entity/${row.original.case_id}`);
            }}
          >
            <ExternalLink />
            {t('case_exploration.case.actions.view_case')}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-cy="menu-item-variants"
            disabled={!row.original.has_variants}
            onClick={() => {
              navigate(`/case/entity/${row.original.case_id}?tab=${CaseEntityTabs.Variants}`);
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
