import { useSearchParams } from 'react-router';

import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Tabs, TabsContent } from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';

import OrganizationsSection from './organizations/organizations-section';
import RolesSection from './roles/roles-section';
import UsersSection from './users/users-section';
import {
  ADMIN_SECTIONS,
  AdminSectionNavDesktop,
  AdminSectionNavMobile,
  DEFAULT_ADMIN_SECTION,
} from './admin-section-nav';

const SECTION_PARAM = 'section';

export default function AdminExploration() {
  const { t } = useI18n();
  const { tenant, tenants } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedSection = searchParams.get(SECTION_PARAM);
  const section = ADMIN_SECTIONS.find(({ value }) => value === requestedSection)?.value ?? DEFAULT_ADMIN_SECTION;

  const selectedTenant = tenants.find(t => t.code === tenant);

  const handleSectionChange = (value: string) => {
    setSearchParams(params => {
      params.set(SECTION_PARAM, value);
      return params;
    });
  };

  return (
    <>
      <HeaderNavigation
        isLoading={false}
        title={t('admin.title', { tenant: selectedTenant?.name || tenant })}
        variant="info"
      />
      <Tabs value={section} onValueChange={handleSectionChange} orientation="vertical" className="contents">
        <div className="bg-muted p-3 md:hidden">
          <AdminSectionNavMobile value={section} onValueChange={handleSectionChange} />
        </div>
        <div className="flex min-h-0 flex-1 overflow-hidden bg-muted">
          <AdminSectionNavDesktop />
          <main className="min-w-0 flex-1 overflow-auto p-3">
            <TabsContent value="users">
              <UsersSection />
            </TabsContent>
            <TabsContent value="organizations">
              <OrganizationsSection />
            </TabsContent>
            <TabsContent value="roles">
              <RolesSection />
            </TabsContent>
          </main>
        </div>
      </Tabs>
    </>
  );
}
