import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router';
import { Sparkles, X } from 'lucide-react';
import useSWR from 'swr';

import type { ListBodyWithCriteria, PatientsSearchResponse, SearchCriterion, SortBody } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import {
  Tabs as ChatTabs,
  TabsContent as ChatTabsContent,
  TabsList as ChatTabsList,
  TabsTrigger as ChatTabsTrigger,
} from '@/components/base/shadcn/tabs';
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

  // The chat card grows into a modal in place, rather than through a portal-based Dialog, so the
  // chat inside it is never remounted and loses nothing.
  const [expanded, setExpanded] = useState(false);
  const [chatTab, setChatTab] = useState('yac');
  const chatTitleId = useId();
  const setChatExpanded = useCallback((value: boolean) => {
    const update = () => {
      setExpanded(value);
      // Both ways: inline there is no tab strip, so any tab but YAC would leave the card empty.
      setChatTab('yac');
    };
    // A view transition morphs the card between its inline spot and the modal. flushSync, so the
    // new state is in the DOM when the browser snapshots it.
    if (!('startViewTransition' in document) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }
    document.startViewTransition(() => flushSync(update));
  }, []);
  useEffect(() => {
    if (!expanded) return;
    // A popup inside the chat stops its own Escape, so this only sees the ones meant for the modal.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) setChatExpanded(false);
    };
    document.addEventListener('keydown', onKeyDown);
    // The page scrolls in <main> below, and may in the document too if the header pushes it past
    // the viewport. Lock both so the wheel over the backdrop moves nothing.
    const { documentElement } = document;
    const overflow = documentElement.style.overflow;
    documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      documentElement.style.overflow = overflow;
    };
  }, [expanded, setChatExpanded]);

  return (
    <>
      <div inert={expanded} className="contents">
        <HeaderNavigation
          isLoading={isLoading}
          title={t('patient_exploration.title', { total: data?.count ?? 0 })}
          description={t('patient_exploration.description')}
        />
      </div>
      <main className={cn('bg-muted h-screen', expanded ? 'overflow-hidden' : 'overflow-auto')}>
        <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
          <TabsList inert={expanded} className="pt-4 px-3 bg-background" contentClassName="mx-auto">
            {TAB_ORDER.map(({ value, i18nKey }) => (
              <TabsListItem key={value} value={value}>
                {t(i18nKey)}
              </TabsListItem>
            ))}
          </TabsList>
          <div className="p-3 space-y-3">
            <TabsContent value={PatientExplorationTabs.CohortAnalytics}>
              {/* m-0 on the fixed boxes: a space-y parent's margins would shrink them. The backdrop
                  click is a pointer shortcut; keyboards close with Esc or the X button. */}
              {expanded && (
                <div
                  aria-hidden="true"
                  className="fixed inset-0 z-40 m-0 bg-black/50 [view-transition-name:yac-backdrop]"
                  onClick={() => setChatExpanded(false)}
                />
              )}
              {/* Every element from here down to the chat renders in both modes, so React keeps it mounted. */}
              <Card
                role={expanded ? 'dialog' : undefined}
                aria-modal={expanded || undefined}
                aria-labelledby={expanded ? chatTitleId : undefined}
                className={cn(
                  'w-full gap-0 pb-0 overflow-hidden [view-transition-name:yac-chat]',
                  expanded && 'fixed inset-x-6 top-14 bottom-6 z-50 m-0 w-auto pt-0 shadow-lg',
                )}
              >
                <ChatTabs value={chatTab} onValueChange={setChatTab} className="min-h-0 flex-1 gap-0">
                  {expanded && (
                    <ChatTabsList className="m-2 mb-0">
                      <ChatTabsTrigger value="yac">{t('patient_exploration.chat.tabs.yac')}</ChatTabsTrigger>
                      <ChatTabsTrigger value="david">{t('patient_exploration.chat.tabs.david')}</ChatTabsTrigger>
                      <ChatTabsTrigger value="other">{t('patient_exploration.chat.tabs.other')}</ChatTabsTrigger>
                    </ChatTabsList>
                  )}
                  <CardHeader className={cn('border-b', expanded && 'pt-4')}>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle id={chatTitleId}>{t('patient_exploration.chat.title')}</CardTitle>
                      <p className="text-muted-foreground text-xs">{t('patient_exploration.chat.description')}</p>
                    </div>
                    <CardAction>
                      {expanded ? (
                        <Button
                          variant="ghost"
                          iconOnly
                          aria-label={t('common.close')}
                          onClick={() => setChatExpanded(false)}
                        >
                          <X />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => setChatExpanded(true)}>
                            <Sparkles />
                            {t('patient_exploration.chat.explore')}
                          </Button>
                          <Badge variant="secondary" className="gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {t('patient_exploration.chat.source')}
                          </Badge>
                        </div>
                      )}
                    </CardAction>
                  </CardHeader>
                  {/* Mounted while another tab shows, only hidden, so switching tabs keeps the chat too. */}
                  <ChatTabsContent
                    value="yac"
                    forceMount
                    className="flex min-h-0 flex-col data-[state=inactive]:hidden"
                  >
                    <PatientExplorationChat expanded={expanded} />
                  </ChatTabsContent>
                  {expanded && (
                    <>
                      <ChatTabsContent value="david" className="text-muted-foreground p-6 text-sm">
                        {t('patient_exploration.chat.tabs.placeholder')}
                      </ChatTabsContent>
                      <ChatTabsContent value="other" className="text-muted-foreground p-6 text-sm">
                        {t('patient_exploration.chat.tabs.placeholder')}
                      </ChatTabsContent>
                    </>
                  )}
                </ChatTabs>
              </Card>
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
