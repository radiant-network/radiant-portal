import { Building2, LucideIcon, Shield, Users } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

export type AdminSectionId = 'users' | 'organizations' | 'roles';

type AdminSection = {
  id: AdminSectionId;
  labelKey: string;
  icon: LucideIcon;
  /** Sections beyond Users are placeholders until their increments — shown but not navigable. */
  enabled: boolean;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  { id: 'users', labelKey: 'admin.nav.users', icon: Users, enabled: true },
  { id: 'organizations', labelKey: 'admin.nav.organizations', icon: Building2, enabled: false },
  { id: 'roles', labelKey: 'admin.nav.roles', icon: Shield, enabled: false },
];

type AdminSidebarProps = {
  activeSection: AdminSectionId;
  onSectionChange: (section: AdminSectionId) => void;
};

/** Desktop section nav (the "Sidebar" component from Figma). */
export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { t } = useI18n();
  return (
    <nav className="flex flex-col gap-1" aria-label={t('admin.title')}>
      <div className="px-2 pb-1 text-xs font-medium text-sidebar-foreground/70">{t('admin.nav.group')}</div>
      {ADMIN_SECTIONS.map(section => {
        const Icon = section.icon;
        const isActive = section.id === activeSection;
        return (
          <button
            key={section.id}
            type="button"
            disabled={!section.enabled}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => section.enabled && onSectionChange(section.id)}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-sidebar-foreground [&_svg]:size-4',
              isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
              !isActive && section.enabled && 'hover:cursor-pointer hover:bg-sidebar-accent/50',
              !section.enabled && 'cursor-default',
            )}
          >
            <Icon />
            <span>{t(section.labelKey)}</span>
          </button>
        );
      })}
    </nav>
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
