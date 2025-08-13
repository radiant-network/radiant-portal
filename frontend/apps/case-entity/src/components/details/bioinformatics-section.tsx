import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { CaseTask } from '@/api/api';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import BadgeListCell from '@/components/base/data-table/cells/badge-list-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import { TableColumnDef } from '@/components/base/data-table/data-table';
import DisplayTable from '@/components/base/data-table/display-table';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/base/ui/alert-dialog';
import { Button } from '@/components/base/ui/button';
import { useI18n } from '@/components/hooks/i18n';

const MAX_TASKS = 4;

const columnHelper = createColumnHelper<CaseTask>();

function getColumns(t: TFunction<string, undefined>, tasks: CaseTask[], hasViewAll: boolean) {
  const columns = [
    columnHelper.accessor('id', {
      cell: info => info.getValue(),
      header: t('case_entity.details.task_id'),
      maxSize: 80,
    }),
    columnHelper.accessor('type_code', {
      cell: info => (
        <BadgeCell variant="secondary" tooltip={info.row.original.type_name}>
          {info.getValue()}
        </BadgeCell>
      ),
      header: t('case_entity.details.type'),
      maxSize: 80,
    }),
    columnHelper.accessor('patients', {
      cell: info => <BadgeListCell variant="outline" badges={info.getValue()} />,
      header: t('case_entity.details.patient'),
      minSize: 164,
    }),
    columnHelper.accessor('created_on', {
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipsHeader tooltips={t('case_entity.details.date_format_tooltips')}>
          {t('case_entity.details.created_on')}
        </TooltipsHeader>
      ),
      size: 80,
    }),
  ] as TableColumnDef<CaseTask, any>[];

  if (hasViewAll) {
    columns.push(
      columnHelper.display({
        id: 'action',
        header: () => <AlertDialogBioinformaticsSection tasks={tasks} />,
        size: 64,
      }) as TableColumnDef<CaseTask, any>,
    );
  }

  return columns;
}

type BioinformaticsSectionProps = {
  tasks: CaseTask[];
};

function BioinformaticsSection({ tasks }: BioinformaticsSectionProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{t('case_entity.details.bioinformatics')}</span>
      </div>
      <DisplayTable
        variant="borderless"
        data={tasks.slice(0, MAX_TASKS)}
        columns={getColumns(t, tasks, tasks.length > MAX_TASKS)}
      />
    </div>
  );
}

function AlertDialogBioinformaticsSection({ tasks }: BioinformaticsSectionProps) {
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

export default BioinformaticsSection;
