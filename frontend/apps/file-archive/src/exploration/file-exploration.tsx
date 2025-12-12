import PageHeader from '@/components/base/page/page-header';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import FilesArchiveList from './archive/files-archive-list';

export default function App() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader isLoading={false} title={t('file_entity.title')} variant="info" />
      <main className={`bg-muted h-screen overflow-auto p-3`}>
        <Card className="h-auto size-max w-full ">
          <CardContent>
            <FilesArchiveList />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
