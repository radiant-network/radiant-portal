import { useState } from 'react';
import { Link } from 'react-router';
import { LineChart, Search } from 'lucide-react';
import useSWR from 'swr';

import type { SearchCriterion } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { Input } from '@/components/base/shadcn/input';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/shadcn/table';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalPath } from '@/components/hooks/use-local-path';

import { fetchPatientsList, type Patient, type PatientsSearchResponse } from '../api/patient';

import PatientExplorationChat from './patient-exploration-chat';
import PatientExplorationTableFilters from './patient-exploration-table-filters';

const COLUMN_KEYS = [
  'patient',
  'mrn',
  'birth_year',
  'sex',
  'site',
  'cns_integrated_diagnosis',
  'vital_status',
  'survival',
] as const;

const SKELETON_ROW_COUNT = 10;

function formatSurvival(days: number | null): string {
  if (days == null) return '—';
  return `${days.toLocaleString()} d`;
}

function PatientExploration() {
  const { t } = useI18n();
  const localPath = useLocalPath();
  // TODO: pass searchCriteria to fetchPatientsList once the backend endpoint lands
  const [, setSearchCriteria] = useState<SearchCriterion[]>([]);
  const { data, isLoading } = useSWR<PatientsSearchResponse>('patient-exploration', fetchPatientsList, {
    revalidateOnFocus: false,
  });

  const rows = data?.list ?? [];
  const total = data?.count ?? 0;

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
          <CardContent>
            <PatientExplorationChat />
          </CardContent>
        </Card>
        <Card className="h-auto size-max w-full">
          <CardContent>
            <div className="flex flex-col gap-3 py-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder={t('patient_exploration.search_placeholder')} />
              </div>
              <PatientExplorationTableFilters loading={isLoading} setSearchCriteria={setSearchCriteria} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  {COLUMN_KEYS.map(key => (
                    <TableHead key={key}>{t(`patient_exploration.columns.${key}`)}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {COLUMN_KEYS.map(key => (
                          <TableCell key={key}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : rows.map(patient => (
                      <PatientRow key={patient.patient_id} patient={patient} localPath={localPath} />
                    ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between pt-4">
              <span className="text-muted-foreground text-sm">
                {isLoading
                  ? t('patient_exploration.footer.awaiting_data')
                  : t('patient_exploration.footer.total', { count: total })}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  {t('patient_exploration.pagination.previous')}
                </Button>
                <Button variant="outline" size="sm" disabled>
                  {t('patient_exploration.pagination.next')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function PatientRow({ patient, localPath }: { patient: Patient; localPath: (path: string) => string }) {
  const overviewPath = localPath(`/patient/entity/${patient.patient_id}`);
  return (
    <TableRow>
      <TableCell>
        <AnchorLink component={Link} to={overviewPath} size="sm" className="font-medium">
          {patient.name}
        </AnchorLink>
        <div className="text-muted-foreground text-xs">{patient.patient_id}</div>
      </TableCell>
      <TableCell className="font-mono text-xs">{patient.mrn}</TableCell>
      <TableCell className="font-mono text-xs">{patient.birth_year}</TableCell>
      <TableCell>{patient.sex}</TableCell>
      <TableCell>
        <Badge variant="secondary">{patient.site}</Badge>
      </TableCell>
      <TableCell>{patient.cns_integrated_diagnosis}</TableCell>
      <TableCell>
        <Badge variant={patient.vital_status === 'alive' ? 'green' : 'neutral'} className="capitalize">
          {patient.vital_status}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-mono text-xs tabular-nums">
        {formatSurvival(patient.survival_days)}
      </TableCell>
    </TableRow>
  );
}

export default PatientExploration;
