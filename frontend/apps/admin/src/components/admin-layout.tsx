import { ReactNode } from 'react';

import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { useI18n } from '@/components/hooks/i18n';

import { AdminSectionId, AdminSectionSelect, AdminSidebar } from './admin-sidebar';

type AdminLayoutProps = {
  /** Tenant display name (shown uppercase), e.g. "CBTN". */
  tenantName: string;
  activeSection: AdminSectionId;
  onSectionChange: (section: AdminSectionId) => void;
  children: ReactNode;
};

/**
 * Admin shell: page header ("{tenant} — Administration") + section nav + content area.
 * On desktop the nav is a left sidebar; on mobile it collapses to a dropdown select.
 * The global portal navbar (tenant switcher, Cases/Files/Admin) is the portal shell and is not
 * part of this screen — it's rendered by the portal once these routes are wired.
 */
export default function AdminLayout({ tenantName, activeSection, onSectionChange, children }: AdminLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="flex h-full min-h-screen flex-col bg-muted">
      <HeaderNavigation isLoading={false} variant="info" title={`${tenantName} — ${t('admin.title')}`} />

      {/* Mobile: section nav as a dropdown */}
      <div className="p-3 md:hidden">
        <AdminSectionSelect activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: section nav sidebar (width + background come from the shared Sidebar component) */}
        <aside className="hidden shrink-0 md:block">
          <AdminSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
        </aside>
        <main className="min-w-0 flex-1 overflow-auto p-3">{children}</main>
      </div>
    </div>
  );
}
