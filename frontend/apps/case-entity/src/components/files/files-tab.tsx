import { useState } from 'react';
import { PaginationState } from '@tanstack/react-table';

import { CaseEntity, SortBody, SortBodyOrderEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardContent } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';

import { defaultSettings, getCaseEnityFilesColumns } from './files-table/table-settings';

const DEFAULT_SORTING = [
  {
    field: 'exomiser_gene_combined_score',
    order: SortBodyOrderEnum.Desc,
  },
];

type FilesTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function FilesTab({ isLoading, caseEntity }: FilesTabProps) {
  const { t } = useI18n();
  const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  return (
    <Card>
      <CardContent>
        <div className="pt-4">
          <DataTable
            id="case-entity-files"
            columns={getCaseEnityFilesColumns(t)}
            defaultServerSorting={DEFAULT_SORTING}
            data={[]}
            defaultColumnSettings={defaultSettings}
            loadingStates={{
              total: false,
              list: false,
            }}
            pagination={pagination}
            onPaginationChange={setPagination}
            onServerSortingChange={setSorting}
            total={0}
            enableColumnOrdering
            enableFullscreen
            tableIndexResultPosition="bottom"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default FilesTab;
