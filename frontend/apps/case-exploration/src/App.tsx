import PageHeader from '@/components/base/page/page-header';
import { Card, CardContent } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';

import CasesTab from './components/cases/cases-tab';

export default function App() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader isLoading={false} title={t('case_exploration.case.title')} variant="info" />
      <main className={`bg-muted h-screen overflow-auto p-3`}>
        <Card className="h-auto size-max w-full ">
          <CardContent>
            <CasesTab />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
