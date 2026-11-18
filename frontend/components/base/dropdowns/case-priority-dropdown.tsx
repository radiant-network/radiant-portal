import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';

import { PatchCasePriorityCodeEnum } from '@/api/api';
import PriorityIndicator from '@/components/base/indicators/priority-indicator';
import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { cn } from '@/components/lib/utils';
import { caseApi } from '@/utils/api';

const PRIORITIES: readonly string[] = Object.values(PatchCasePriorityCodeEnum);

export function isCasePriority(code: string | undefined): code is PatchCasePriorityCodeEnum {
  return !!code && PRIORITIES.includes(code);
}

type PatchPriorityInput = {
  caseId: number;
  priority: PatchCasePriorityCodeEnum;
};

async function patchCasePriority(_url: string, { arg }: { arg: PatchPriorityInput }, tenant: string) {
  const response = await caseApi.patchCase(tenant, arg.caseId, { priority_code: arg.priority });
  return response.data;
}

type CasePriorityDropdownProps = {
  caseId: number;
  priority: PatchCasePriorityCodeEnum;
  size?: '3xs' | 'sm';
  className?: string;
  onSaved?: () => void;
};

function CasePriorityDropdown({ caseId, priority, size = '3xs', className, onSaved }: CasePriorityDropdownProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const { trigger } = useSWRMutation(
    `patch-case-priority-${caseId}`,
    (key: string, opts: { arg: PatchPriorityInput }) => patchCasePriority(key, opts, tenant),
  );
  const [currentPriority, setCurrentPriority] = useState(priority);
  const closedWithPointerRef = useRef(false);

  // Table cells are recycled across rows: resync when the row underneath changes.
  useEffect(() => {
    setCurrentPriority(priority);
  }, [priority, caseId]);

  function selectPriority(next: PatchCasePriorityCodeEnum) {
    if (next === currentPriority) return;

    const previous = currentPriority;
    setCurrentPriority(next);
    trigger({ caseId, priority: next })
      .then(() => onSaved?.())
      .catch(() => {
        setCurrentPriority(previous);
        toast.error(t('case_priority.error'));
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size} className={className}>
          <PriorityIndicator code={currentPriority} size="sm" className={cn({ 'gap-1': size === '3xs' })} />
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-50"
        onPointerUp={() => {
          closedWithPointerRef.current = true;
        }}
        onCloseAutoFocus={event => {
          if (closedWithPointerRef.current) event.preventDefault();
          closedWithPointerRef.current = false;
        }}
      >
        {Object.values(PatchCasePriorityCodeEnum).map(code => {
          const isCurrent = code === currentPriority;
          return (
            <DropdownMenuItem
              key={code}
              role="menuitemradio"
              aria-checked={isCurrent}
              className={cn({ 'bg-accent': isCurrent })}
              onSelect={() => selectPriority(code)}
            >
              <PriorityIndicator code={code} size="sm" />
              {isCurrent && <Check className="ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CasePriorityDropdown;
