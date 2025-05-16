import DataTable from '@/components/base/data-table/data-table';
import { useI18n } from '@/components/hooks/i18n';
import { useState } from 'react';
import { getInterpretedCasesColumns, interpretedCasesDefaultSettings } from './table-settings';
import { PaginationState } from '@tanstack/table-core';

function InterpretedCasesTable() {
  const { t } = useI18n();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
        data={[]}
        defaultColumnSettings={interpretedCasesDefaultSettings}
        defaultServerSorting={[]}
        loadingStates={{
          total: false,
          list: false,
        }}
        total={0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onServerSortingChange={() => {}}
        subComponent={data => <></>}
        tableIndexResultPosition="bottom"
      />
    </div>
  );
}

export default InterpretedCasesTable;
