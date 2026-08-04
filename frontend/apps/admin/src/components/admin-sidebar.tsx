import type { CSSProperties } from 'react';
import { Building2, LucideIcon, Shield, Users } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/base/shadcn/sidebar';
import { useI18n } from '@/components/hooks/i18n';

export type AdminSectionId = 'users' | 'organizations' | 'roles';

type AdminSection = {
  id: AdminSectionId;
  labelKey: string;
  icon: LucideIcon;
  /** A section not yet built shows in the nav but isn't navigable (disabled). */
  enabled: boolean;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  { id: 'users', labelKey: 'admin.nav.users', icon: Users, enabled: true },
  { id: 'organizations', labelKey: 'admin.nav.organizations', icon: Building2, enabled: true },
  { id: 'roles', labelKey: 'admin.nav.roles', icon: Shield, enabled: true },
];

type AdminSidebarProps = {
  activeSection: AdminSectionId;
  onSectionChange: (section: AdminSectionId) => void;
};

/** Desktop section nav — composes the shared `Sidebar` component (Figma "Sidebar" / Layout/Sidebar). */
export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { t } = useI18n();
  return (
    // Standalone, bounded use of the shared Sidebar (mirrors the Layout/Sidebar story): the provider
    // normally spans the whole app (min-h-svh) — neutralized here with min-h-0 + the sidebar width.
    <SidebarProvider
      className="h-full min-h-0 w-(--sidebar-width)"
      // Override the DS default (12rem) to keep the admin section nav at its designed 256px width.
      style={{ '--sidebar-width': '16rem' } as CSSProperties}
    >
      <Sidebar collapsible="none" className="h-full" role="navigation" aria-label={t('admin.title')}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('admin.nav.group')}</SidebarGroupLabel>
            <SidebarMenu>
              {ADMIN_SECTIONS.map(section => {
                const Icon = section.icon;
                const isActive = section.id === activeSection;
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      disabled={!section.enabled}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => section.enabled && onSectionChange(section.id)}
                    >
                      <Icon />
                      <span>{t(section.labelKey)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

/** Mobile section nav: the sidebar collapses into a dropdown. */
export function AdminSectionSelect({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { t } = useI18n();
  return (
    <Select value={activeSection} onValueChange={value => onSectionChange(value as AdminSectionId)}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ADMIN_SECTIONS.map(section => {
          const Icon = section.icon;
          return (
            <SelectItem key={section.id} value={section.id} disabled={!section.enabled}>
              <span className="flex items-center gap-2 [&_svg]:size-4">
                <Icon />
                {t(section.labelKey)}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
