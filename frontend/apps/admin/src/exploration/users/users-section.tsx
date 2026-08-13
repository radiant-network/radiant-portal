import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

export default function UsersSection() {
  const { t } = useI18n();

  return (
    <Card className="min-h-64">
      <CardContent>{t('admin.sections.users')}</CardContent>
    </Card>
  );
}
