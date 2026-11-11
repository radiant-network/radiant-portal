import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { useI18n } from '@/components/hooks/i18n';

import AnalysisNewsletterCard from './cards/analysis-newsletter-card';
import SetOperationsCard from './cards/set-operations-card';

function AnalysisExploration() {
  const { t } = useI18n();

  return (
    <>
      <HeaderNavigation
        title={t('analysis.title')}
        description={t('analysis.subtitle')}
        variant="info"
        isLoading={false}
      />
      <main className="bg-muted min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex gap-6">
            <SetOperationsCard />
            <AnalysisNewsletterCard />
          </div>
        </div>
      </main>
    </>
  );
}

export default AnalysisExploration;
