import { Building2Icon, ShieldIcon, UsersIcon } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';
import { TENANT_ACTIONS, useTenantActions } from '@/components/hooks/use-tenant';

export const ADMIN_SECTIONS = [
  { value: 'users', icon: UsersIcon, action: TENANT_ACTIONS.manageUser },
  { value: 'organizations', icon: Building2Icon, action: TENANT_ACTIONS.manageOrg },
  { value: 'roles', icon: ShieldIcon, action: TENANT_ACTIONS.manageRole },
];

/** Sections the caller may reach in the currently selected tenant, in declaration order. */
export function useAdminSections() {
  const tenantActions = useTenantActions();
  return ADMIN_SECTIONS.filter(({ action }) => tenantActions.includes(action));
}

type AdminSectionNavMobileProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function AdminSectionNavMobile({ value, onValueChange }: AdminSectionNavMobileProps) {
  const { t } = useI18n();
  const sections = useAdminSections();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={t('admin.sections.group_label')} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sections.map(({ value: section, icon: Icon }) => (
          <SelectItem key={section} value={section}>
            <span className="flex items-center gap-2">
              <Icon className="size-4" />
              {t(`admin.sections.${section}`)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AdminSectionNavDesktop() {
  const { t } = useI18n();
  const sections = useAdminSections();

  return (
    <nav className="hidden w-64 shrink-0 overflow-auto bg-sidebar-background p-2 text-sidebar-foreground md:block">
      <p className="flex h-8 items-center px-2 text-xs font-medium text-sidebar-foreground/70">
        {t('admin.sections.group_label')}
      </p>
      <TabsList className="w-full gap-1 bg-transparent p-0">
        {sections.map(({ value: section, icon: Icon }) => (
          <TabsTrigger
            key={section}
            value={section}
            className="h-8 flex-none gap-2 overflow-hidden p-2 font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=active]:bg-sidebar-accent data-[state=active]:font-medium data-[state=active]:text-sidebar-accent-foreground data-[state=active]:shadow-none"
          >
            <Icon />
            {t(`admin.sections.${section}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </nav>
  );
}
