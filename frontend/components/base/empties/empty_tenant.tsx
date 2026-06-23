import { useI18n } from '@/components/hooks/i18n';

/** Full-screen message shown by TenantProvider when the user belongs to no tenant. */
function EmptyTenant() {
  const { t } = useI18n();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-lg font-semibold">
        {t('main_navbar.tenant_switcher.empty_title', { defaultValue: 'No tenant available' })}
      </h1>
      <p className="text-muted-foreground">
        {t('main_navbar.tenant_switcher.empty_description', {
          defaultValue: 'You do not have access to any tenant. Please contact your administrator.',
        })}
      </p>
    </div>
  );
}

export default EmptyTenant;
