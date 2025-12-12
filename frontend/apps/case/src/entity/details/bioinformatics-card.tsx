import { ComponentProps } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { CaseTask } from '@/api/api';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import BadgeListCell from '@/components/base/data-table/cells/badge-list-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import { TableColumnDef } from '@/components/base/data-table/data-table';
import DisplayTable from '@/components/base/data-table/display-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/base/shadcn/alert-dialog';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

const columnHelper = createColumnHelper<CaseTask>();

function getColumns(t: TFunction<string, undefined>, tasks: CaseTask[], hasViewAll: boolean) {
  const columns = [
    columnHelper.accessor('id', {
      cell: info => info.getValue(),
      header: t('case_entity.details.task_id'),
      maxSize: 80,
    }),
    columnHelper.accessor('type_name', {
      cell: info => <BadgeCell variant="secondary">{info.getValue()}</BadgeCell>,
      header: t('case_entity.details.type'),
      maxSize: 200,
    }),
    columnHelper.accessor('patients', {
      cell: info => <BadgeListCell variant="outline" badges={info.getValue()} />,
      header: t('case_entity.details.patient'),
      minSize: 164,
    }),
    columnHelper.accessor('created_on', {
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('case_entity.details.date_format_tooltip')}>
          {t('case_entity.details.created_on')}
        </TooltipHeader>
      ),
      size: 80,
    }),
  ] as TableColumnDef<CaseTask, any>[];

  if (hasViewAll) {
    columns.push(
      columnHelper.display({
        id: 'action',
        header: () => <AlertDialogBioinformaticsCard tasks={tasks} />,
        size: 64,
      }) as TableColumnDef<CaseTask, any>,
    );
  }

  return columns;
}

type BioinformaticsCardProps = ComponentProps<'div'> & {
  tasks: CaseTask[];
};

function BioinformaticsCard({ tasks, ...props }: BioinformaticsCardProps) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle size="xl">{t('case_entity.details.bioinformatics')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DisplayTable variant="borderless" data={tasks} columns={getColumns(t, tasks, false)} />
      </CardContent>
    </Card>
  );
}

function AlertDialogBioinformaticsCard({ tasks }: BioinformaticsCardProps) {
  const { t } = useI18n();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size="sm" variant="outline">
          {t('common.view_all')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-auto md:min-w-[800px]">
        <AlertDialogHeader>{t('case_entity.details.bioinformatics')}</AlertDialogHeader>
        <AlertDialogDescription>
          <DisplayTable variant="borderless" data={tasks} columns={getColumns(t, tasks, false)} />
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.close')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BioinformaticsCard;
