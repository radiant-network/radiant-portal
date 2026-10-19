import { useMemo, useState } from 'react';
import { LineChart } from 'lucide-react';
import useSWR from 'swr';

import type { ListBodyWithCriteria, PatientsSearchResponse, SearchCriterion, SortBody } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Badge } from '@/components/base/shadcn/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';

import { fetchPatientsList } from '../api/patient';

import TableFilters from './table/patient-exploration-table-filters';
import { defaultSettings, getPatientExplorationColumns } from './table/patient-exploration-table-settings';
import PatientExplorationChat from './patient-exploration-chat';

type PatientListInput = {
  key: string;
  tenant: string;
  listBodyWithCriteria: ListBodyWithCriteria;
};

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
        <Card className="w-full gap-0 pb-0 overflow-hidden">
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
          <PatientExplorationChat />
        </Card>
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
      </main>
    </>
  );
}

export default PatientExploration;
