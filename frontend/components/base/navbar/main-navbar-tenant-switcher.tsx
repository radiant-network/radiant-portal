import { Check, ChevronsUpDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { cn } from '@/components/lib/utils';

interface MainNavbarTenantSwitcherProps {
  /** When true, render nothing for single-tenant users (mobile omits the label). */
  hideSingleTenantLabel?: boolean;
}

function MainNavbarTenantSwitcher({ hideSingleTenantLabel = false }: MainNavbarTenantSwitcherProps) {
  const { t } = useI18n();
  const { tenant, tenants, setTenant } = useTenant();

  // Single-tenant user: non-interactive label (no dropdown) — omitted entirely on mobile.
  if (tenants.length <= 1) {
    if (hideSingleTenantLabel) {
      return null;
    }
    return (
      <span data-cy="tenant-label" className="text-sm font-semibold text-primary">
        {tenant}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-cy="tenant-switcher"
        className="flex items-center gap-1 text-sm font-semibold text-primary outline-none"
      >
        {tenant}
        <ChevronsUpDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>
          {t('main_navbar.tenant_switcher.title', { defaultValue: 'Switch Tenant' })}
        </DropdownMenuLabel>
        {tenants.map(membership => (
          <DropdownMenuItem
            key={membership.code}
            className="flex items-center justify-between gap-3"
            onClick={() => {
              if (membership.code && membership.code !== tenant) {
                setTenant(membership.code);
              }
            }}
          >
            <div className="flex flex-col">
              <span className="text-sm font-normal text-foreground">{membership.code}</span>
              <span className="text-xs font-normal text-muted-foreground">{membership.name}</span>
            </div>
            <Check className={cn('size-4', membership.code === tenant ? 'opacity-100' : 'opacity-0')} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MainNavbarTenantSwitcher;
