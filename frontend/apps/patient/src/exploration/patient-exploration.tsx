import { Link } from 'react-router';
import { LineChart, Search } from 'lucide-react';
import useSWR from 'swr';

import AnchorLink from '@/components/base/navigation/anchor-link';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { Input } from '@/components/base/shadcn/input';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/shadcn/table';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalPath } from '@/components/hooks/use-local-path';

import { fetchPatientsList, type Patient, type PatientsSearchResponse } from '../api/patient';

const COLUMN_KEYS = [
  'patient',
  'mrn',
  'birth_year',
  'sex',
  'site',
  'cns_diagnosis',
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
  const { data, isLoading } = useSWR<PatientsSearchResponse>('patient-exploration', fetchPatientsList, {
    revalidateOnFocus: false,
  });

  const rows = data?.list ?? [];
  const total = data?.count ?? 0;

  return (
    <>
      <HeaderNavigation
        isLoading={false}
        title={t('patient_exploration.title')}
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
      <main className="bg-muted h-screen overflow-auto p-3">
        <Card className="h-auto size-max w-full">
          <CardContent>
            <div className="flex items-center gap-2 py-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder={t('patient_exploration.search_placeholder')} disabled />
              </div>
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
      <TableCell>{patient.birth_year}</TableCell>
      <TableCell>{patient.sex}</TableCell>
      <TableCell>{patient.site}</TableCell>
      <TableCell>{patient.cns_diagnosis}</TableCell>
      <TableCell className="capitalize">{patient.vital_status}</TableCell>
      <TableCell className="text-right tabular-nums">{formatSurvival(patient.survival_days)}</TableCell>
    </TableRow>
  );
}

export default PatientExploration;
