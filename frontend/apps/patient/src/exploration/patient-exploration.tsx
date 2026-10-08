import { useMemo, useState } from 'react';
import { LineChart, Search } from 'lucide-react';
import useSWR from 'swr';

import type { ListBodyWithCriteria, SearchCriterion, SortBody } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Badge } from '@/components/base/shadcn/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

import { fetchPatientsList, type PatientsSearchResponse } from '../api/patient';

import TableFilters from './table/patient-exploration-table-filters';
import { defaultSettings, getPatientExplorationColumns } from './table/patient-exploration-table-settings';
import PatientExplorationChat from './patient-exploration-chat';

type PatientListInput = {
  listBodyWithCriteria: ListBodyWithCriteria;
};

async function fetchPatients(input: PatientListInput) {
  return fetchPatientsList(input.listBodyWithCriteria);
}

function PatientExploration() {
  const { t } = useI18n();
  const [sorting, setSorting] = useState<SortBody[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  // TODO: pass searchCriteria to fetchPatientsList once the backend endpoint lands
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([]);
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const { data, isLoading, isValidating } = useSWR<PatientsSearchResponse, any, PatientListInput>(
    {
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

  return (
    <>
      <HeaderNavigation
        isLoading={false}
        title={t('patient_exploration.title', { total: data?.count ?? 0 })}
        description={t('patient_exploration.description')}
        variant="info"
        buttons={[
          {
            variant: 'outline',
            size: 'sm',
            disabled: true,
            children: (
              <>
                <LineChart />
                {t('patient_exploration.actions.visualize_survival')}
              </>
            ),
          },
        ]}
      />
      <main className="bg-muted h-screen overflow-auto p-3 space-y-3">
        <Card className="w-full">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-0.5">
              <CardTitle>{t('patient_exploration.chat.title')}</CardTitle>
              <p className="text-muted-foreground text-xs">{t('patient_exploration.chat.description')}</p>
            </div>
            <CardAction>
              <Badge variant="secondary" className="gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {t('patient_exploration.chat.source')}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <PatientExplorationChat />
          </CardContent>
        </Card>
        <Card className="h-auto size-max w-full">
          <CardContent>
            <div className="relative w-full max-w-sm py-4">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder={t('patient_exploration.search_placeholder')} />
            </div>
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
                  onSortingChange: setSorting,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default PatientExploration;
