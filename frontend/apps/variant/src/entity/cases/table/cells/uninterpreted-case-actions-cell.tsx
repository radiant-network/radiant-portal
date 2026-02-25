import { useNavigate } from 'react-router-dom';
import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, ExternalLink } from 'lucide-react';

import { VariantUninterpretedCase } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';

function UninterpretedCaseActionsCell({ row }: CellContext<VariantUninterpretedCase, any>) {
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
            {t('variant_entity.cases.other_table.view_case')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigate(`/case/entity/${row.original.case_id}?tab=variants&seq_id=${row.original.seq_id}`);
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
