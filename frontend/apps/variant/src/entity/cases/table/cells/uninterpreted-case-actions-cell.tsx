import { EllipsisVertical, ExternalLink } from 'lucide-react';

import type { VariantUninterpretedCase } from '@/api/api';
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

function UninterpretedCaseActionsCell({ row }: CellContext<AppFeatures, VariantUninterpretedCase, any>) {
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
            {t('variant_entity.cases.other_table.view_case')}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-cy="menu-item-variants"
            onClick={() => {
              navigate(
                `/case/entity/${row.original.case_id}?tab=${CaseEntityTabs.Variants}&seq_id=${row.original.seq_id}`,
              );
            }}
          >
            <ExternalLink />
            {t('variant_entity.cases.other_table.view_variants')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UninterpretedCaseActionsCell;
