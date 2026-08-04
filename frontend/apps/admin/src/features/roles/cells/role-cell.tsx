import { Lock } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { roleDescription, roleName } from '../../../mock/data';
import type { Role } from '../../../mock/types';

/**
 * Role identity cell: the role name (a button — custom roles open the edit sheet, default roles open
 * the read-only permissions dialog) over its full muted description. Default roles carry a lock icon
 * with a tooltip; custom roles show nothing extra.
 */
export default function RoleCell({ role, onOpen }: { role: Role; onOpen?: () => void }) {
  const { t } = useI18n();
  const description = roleDescription(role, t);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        {onOpen ? (
          <button type="button" onClick={onOpen} className="w-fit cursor-pointer text-left font-medium text-foreground">
            {roleName(role, t)}
          </button>
        ) : (
          <span className="font-medium text-foreground">{roleName(role, t)}</span>
        )}
        {role.isDefault && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* 12px icon in a 20×20 hover target; focusable so the tooltip fires on keyboard
                    focus too (no autofocus issue outside a modal). */}
                <span tabIndex={0} className="inline-flex size-5 items-center justify-center opacity-50">
                  <Lock className="size-3" />
                </span>
              </TooltipTrigger>
              <TooltipContent>{t('admin.roles_page.lock_tooltip')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {/* Full wrap — the table is the only place to read a role's complete summary. The shared
          DataTable cell forces `truncate text-nowrap`, so re-enable wrapping locally; the row grows. */}
      {description && (
        <span className="whitespace-normal break-words text-sm text-muted-foreground">{description}</span>
      )}
    </div>
  );
}
