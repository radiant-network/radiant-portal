import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useState } from 'react';
import { getOtherCasesColumns, otherCasesDefaultSettings } from './table-settings';
import { PaginationState } from '@tanstack/table-core';

function OtherCasesTable() {
  const { t } = useI18n();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fakeData: any[] = [
    {
      case: '123456',
      date: '2025-05-30T15:26:46.139Z',
      hpo: 'Kidney angiomyolipoma',
      zygosity: 'Het',
      inheritance: 'De novo',
      institution: 'CHUSJ',
      test: 'RGDI',
      status: 'Active',
    },
    {
      case: '123457',
      date: '2025-05-30T15:26:46.139Z',
      hpo: 'Retard de développement neurologique',
      zygosity: 'Hom',
      inheritance: 'Maternal',
      institution: 'CHUSJ',
      test: 'RGDI',
      status: 'Completed',
    },
  ]; // Placeholder for actual data

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        {t('variantEntity.cases.other-table.title', {
          count: 0,
        })}
      </h1>
      <DataTable
        id="other-cases"
        columns={getOtherCasesColumns(t)}
        data={fakeData}
        defaultColumnSettings={otherCasesDefaultSettings}
        defaultServerSorting={[]}
        loadingStates={{
          total: false,
          list: false,
        }}
        total={fakeData.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        onServerSortingChange={() => {}}
        tableIndexResultPosition="bottom"
      />
    </div>
  );
}

export default OtherCasesTable;
