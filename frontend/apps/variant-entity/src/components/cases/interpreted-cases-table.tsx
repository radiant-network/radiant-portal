import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useState } from 'react';
import { getInterpretedCasesColumns, interpretedCasesDefaultSettings } from './table-settings';
import { PaginationState } from '@tanstack/table-core';
import InterpretedCasesExpend from './interpreted-cases-expend';

function InterpretedCasesTable() {
  const { t } = useI18n();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fakeData: any[] = [
    {
      case: '123456',
      date: '2025-05-30T15:26:46.139Z',
      mondo: 'Kidney angiomyolipoma',
      classification: 'likely_pathogenic',
      zygosity: 'Het',
      inheritance: 'De novo',
      institution: 'CHUSJ',
      test: 'RGDI',
      status: 'Active',
    },
    {
      case: '123457',
      date: '2025-05-30T15:26:46.139Z',
      mondo: 'Retard de développement neurologique',
      classification: 'Pathogenic',
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
        {t('variantEntity.cases.interpreted-table.title', {
          count: 0,
        })}
      </h1>
      <DataTable
        id="interpreted-cases"
        columns={getInterpretedCasesColumns(t)}
        data={fakeData}
        defaultColumnSettings={interpretedCasesDefaultSettings}
        defaultServerSorting={[]}
        loadingStates={{
          total: false,
          list: false,
        }}
        total={fakeData.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        onServerSortingChange={() => {}}
        subComponent={data => <InterpretedCasesExpend data={data} />}
        tableIndexResultPosition="bottom"
      />
    </div>
  );
}

export default InterpretedCasesTable;
