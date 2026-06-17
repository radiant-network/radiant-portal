import { useMemo, useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import PageHeader from '@/components/base/page/page-header';
import { FacetList } from '@/components/base/query-builder/facets/facet-list';
import { FacetConfigContext } from '@/components/base/query-builder/facets/hooks/use-facet-config';
import { getDefaultQBContext, QBProvider } from '@/components/base/query-builder/hooks/use-query-builder';
import { getVisibleAggregations } from '@/components/base/query-builder/libs/aggregations';
import { Button } from '@/components/base/shadcn/button';
import { ApplicationId, useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

import { studyBuilderFetcher, studyFetcher, studyStatisticFetcher } from './mocks/study-fetcher-mock';
import StudyDataTable from './study-data-table';
import StudySearch from './study-search';
import { defaultStudyColumnSettings, getStudyColumns } from './study-table-settings';

export default function StudyExploration() {
  const { t } = useI18n();
  const [facetsOpen, setFacetsOpen] = useState(true);
  const config = useConfig();
  const aggregations = config.study?.aggregations ?? {};
  const visibleAggregations = useMemo(() => getVisibleAggregations(aggregations), [aggregations]);
  const columns = useMemo(() => getStudyColumns(t), [t]);

  return (
    <QBProvider {...getDefaultQBContext()} aggregations={aggregations} fetcher={studyFetcher}>
      <FacetConfigContext
        value={{
          appId: ApplicationId.study,
          builderFetcher: studyBuilderFetcher,
          statisticFetcher: studyStatisticFetcher,
          searchAutoFocus: false,
        }}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <PageHeader title={t('study.title')} variant="info" isLoading={false} />
          <div className="bg-muted flex min-h-0 flex-1 overflow-hidden">
            {facetsOpen ? (
              <aside className="bg-muted w-[300px] shrink-0 overflow-auto border-r p-3">
                <div className="flex justify-start">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconOnly
                    onClick={() => setFacetsOpen(false)}
                    aria-label={t('study.facets.collapse')}
                  >
                    <PanelLeftClose />
                  </Button>
                </div>
                <FacetList groupKey="study" aggregations={visibleAggregations} defaultExpanded={true} />
              </aside>
            ) : (
              <div className="bg-muted shrink-0 border-r p-3">
                <Button
                  variant="ghost"
                  size="xs"
                  iconOnly
                  onClick={() => setFacetsOpen(true)}
                  aria-label={t('study.facets.expand')}
                >
                  <PanelLeftOpen />
                </Button>
              </div>
            )}
            <main className="min-w-0 flex-1 space-y-4 overflow-auto p-4">
              <StudySearch />
              <StudyDataTable
                id={ApplicationId.study}
                columns={columns}
                defaultColumnSettings={defaultStudyColumnSettings}
                enableColumnOrdering
                tableIndexResultPosition="top"
              />
            </main>
          </div>
        </div>
      </FacetConfigContext>
    </QBProvider>
  );
}
