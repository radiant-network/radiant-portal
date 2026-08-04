import { Lock } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { roleDescription, roleName } from '../../../mock/data';
import type { Role } from '../../../mock/types';

/**
 * Role identity cell: the role name (a button opening the sheet — Edit for custom, read-only View
 * for defaults) over its muted description, truncated to two lines. Default roles carry a lock icon
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
                {/* Focusable span so the tooltip fires on keyboard focus, not just hover. */}
                <span tabIndex={0} className="inline-flex text-muted-foreground">
                  <Lock className="size-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>{t('admin.roles_page.lock_tooltip')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {description && <span className="line-clamp-2 text-sm text-muted-foreground">{description}</span>}
    </div>
  );
}
