import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import type { ListBodyWithCriteria, PatientsSearchResponse, SearchCriterion, SortBody } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import LibreChatDavid from '@/components/base/librechat-david/librechat-david';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { cn } from '@/components/lib/utils';

import { fetchPatientsList } from '../api/patient';

import TableFilters from './table/patient-exploration-table-filters';
import { defaultSettings, getPatientExplorationColumns } from './table/patient-exploration-table-settings';
import PatientExplorationChat from './patient-exploration-chat';
import { PatientExplorationTabs } from './patient-exploration-tabs';

type PatientListInput = {
  key: string;
  tenant: string;
  listBodyWithCriteria: ListBodyWithCriteria;
};

const TAB_ORDER: { value: PatientExplorationTabs; i18nKey: string }[] = [
  { value: PatientExplorationTabs.CohortAnalytics, i18nKey: 'patient_exploration.tabs.cohort_analytics' },
  { value: PatientExplorationTabs.PatientList, i18nKey: 'patient_exploration.tabs.patient_list' },
];

const PATIENTS_DEFAULT_SORTING: SortBody[] = [
  { field: 'can_read_phi', order: 'desc' },
  { field: 'organization_code', order: 'asc' },
  { field: 'patient_id', order: 'asc' },
];

async function fetchPatients(input: PatientListInput) {
  return fetchPatientsList(input.tenant, input.listBodyWithCriteria);
}

function PatientExploration() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<PatientExplorationTabs>(
    (searchParams.get('tab') as PatientExplorationTabs) ?? PatientExplorationTabs.CohortAnalytics,
  );
  const [sorting, setSorting] = useState<SortBody[]>(PATIENTS_DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);
  const [chatExpanded, setChatExpanded] = useState(false);

  const { data, isLoading, isValidating } = useSWR<PatientsSearchResponse, any, PatientListInput>(
    {
      key: 'patients-search',
      tenant,
      listBodyWithCriteria: {
        additional_fields: additionalFields,
        search_criteria: searchCriteria,
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
        sort: sorting,
      },
    },
    fetchPatients,
    {
      revalidateOnFocus: false,
    },
  );

  const columns = useMemo(() => getPatientExplorationColumns(t), [t]);

  const handleOnTabChange = useCallback(
    (value: PatientExplorationTabs) => {
      setSearchParams({ tab: value });
      setActiveTab(value);
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (searchParams.get('tab') != null) {
      setActiveTab(searchParams.get('tab') as PatientExplorationTabs);
      return;
    }
    setActiveTab(PatientExplorationTabs.CohortAnalytics);
    setSearchParams({ tab: PatientExplorationTabs.CohortAnalytics });
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') != null) {
      setActiveTab(searchParams.get('tab') as PatientExplorationTabs);
    }
  }, [searchParams.get('tab')]);

  return (
    <>
      <div inert={chatExpanded} className="contents">
        <HeaderNavigation
          isLoading={isLoading}
          title={t('patient_exploration.title', { total: data?.count ?? 0 })}
          description={t('patient_exploration.description')}
          statuses={[<LibreChatDavid key="librechat-david" />]}
        />
      </div>
      <main className={cn('bg-muted h-screen', chatExpanded ? 'overflow-hidden' : 'overflow-auto')}>
        <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
          <TabsList inert={chatExpanded} className="pt-4 px-3 bg-background" contentClassName="mx-auto">
            {TAB_ORDER.map(({ value, i18nKey }) => (
              <TabsListItem key={value} value={value}>
                {t(i18nKey)}
              </TabsListItem>
            ))}
          </TabsList>
          <div className="p-3 space-y-3">
            <TabsContent value={PatientExplorationTabs.CohortAnalytics}>
              <PatientExplorationChat onExpandedChange={setChatExpanded} />
            </TabsContent>
            <TabsContent value={PatientExplorationTabs.PatientList}>
              <Card className="h-auto size-max w-full">
                <CardContent>
                  <div className="bg-background">
                    <DataTable
                      id="patient-exploration"
                      columns={columns}
                      TableFilters={
                        <TableFilters loading={isLoading && !isValidating} setSearchCriteria={setSearchCriteria} />
                      }
                      data={data?.list ?? []}
                      defaultColumnSettings={defaultSettings}
                      loadingStates={{
                        total: isLoading,
                        list: isLoading,
                      }}
                      pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
                      total={data?.count ?? 0}
                      enableColumnOrdering
                      enableFullscreen
                      tableIndexResultPosition="bottom"
                      serverOptions={{
                        setAdditionalFields,
                        defaultSorting: PATIENTS_DEFAULT_SORTING,
                        onSortingChange: setSorting,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </TabsNav>
      </main>
    </>
  );
}

export default PatientExploration;
