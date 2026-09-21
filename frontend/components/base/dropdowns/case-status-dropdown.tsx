import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';

import StatusBadge, { type Status, statusColors } from '@/components/base/badges/status-badge';
import { type BadgeProps, badgeVariants } from '@/components/base/shadcn/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { cn } from '@/components/lib/utils';
import { caseApi } from '@/utils/api';

export const SYSTEM_APPLIED_STATUSES: Status[] = ['draft', 'submitted', 'processing'];

const MENU_ENTRIES: { status: Status; submenu?: Status[] }[] = [
  { status: 'in_progress' },
  { status: 'in_review' },
  { status: 'completed', submenu: ['completed', 'resolved', 'unresolved', 'inconclusive'] },
  { status: 'revoked' },
  { status: 'reopened' },
];

type PatchStatusInput = {
  caseId: number;
  status: Status;
};

async function patchCaseStatus(_url: string, { arg }: { arg: PatchStatusInput }, tenant: string) {
  const response = await caseApi.patchCase(tenant, arg.caseId, { status_code: arg.status });
  return response.data;
}

export type CaseStatusDropdownProps = {
  caseId: number;
  status: Status;
  /** False renders the read-only badge. Wired to `can_edit_case` in SJRA-1917. */
  canEdit?: boolean;
  readOnlyTooltip?: ReactNode;
  size?: BadgeProps['size'];
  className?: string;
  onSaved?: () => void;
};

function CaseStatusDropdown({
  caseId,
  status,
  canEdit = true,
  readOnlyTooltip,
  size,
  className,
  onSaved,
}: CaseStatusDropdownProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const { trigger } = useSWRMutation(`patch-case-status-${caseId}`, (key: string, opts: { arg: PatchStatusInput }) =>
    patchCaseStatus(key, opts, tenant),
  );
  const [currentStatus, setCurrentStatus] = useState<Status>(status);
  const closedWithPointerRef = useRef(false);

  // Table cells are recycled across rows: resync when the row underneath changes.
  useEffect(() => {
    setCurrentStatus(status);
  }, [status, caseId]);

  const label = (code: Status) => t(`case_exploration.status.${code}`, code);

  function selectStatus(next: Status) {
    if (next === currentStatus) return;

    const previous = currentStatus;
    setCurrentStatus(next);
    trigger({ caseId, status: next })
      .then(() => onSaved?.())
      .catch(() => {
        setCurrentStatus(previous);
        toast.error(t('case_status.error'));
      });
  }

  if (!canEdit || SYSTEM_APPLIED_STATUSES.includes(currentStatus)) {
    const badge = <StatusBadge status={currentStatus} size={size} withIcon={false} className={className} />;
    if (!readOnlyTooltip) return badge;

    return (
      <Tooltip>
        <TooltipTrigger>{badge}</TooltipTrigger>
        <TooltipContent>{readOnlyTooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            badgeVariants({ variant: statusColors[currentStatus] ?? 'neutral', clickable: true, size }).base(),
            className,
          )}
        >
          {label(currentStatus)}
          <ChevronDown />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        onPointerUp={() => {
          closedWithPointerRef.current = true;
        }}
        onCloseAutoFocus={event => {
          // Radix hands focus back to the trigger, which the browser then paints as keyboard focus.
          if (closedWithPointerRef.current) event.preventDefault();
          closedWithPointerRef.current = false;
        }}
      >
        {MENU_ENTRIES.map(entry =>
          entry.submenu ? (
            <DropdownMenuSub key={entry.status}>
              <DropdownMenuSubTrigger>{label(entry.status)}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {entry.submenu.map(code => (
                    <DropdownMenuItem key={code} onSelect={() => selectStatus(code)}>
                      {label(code)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={entry.status} onSelect={() => selectStatus(entry.status)}>
              {label(entry.status)}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CaseStatusDropdown;
