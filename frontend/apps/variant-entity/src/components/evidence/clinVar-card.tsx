import { Button } from '@/components/base/ui/button';
import { Card, CardContent, CardDescription, CardAction, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/base/ui/input';
import DataTable from '@/components/base/data-table/data-table';
import { getPathogenicEvidenceColumns, pathogenicEvidenceDefaultSettings } from './table-settings';
import { PaginationState } from '@tanstack/table-core';
import { useState } from 'react';

function ClinVarCard() {
  const { t } = useI18n();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fakeData = [
    {
      evaluated: '2025-05-30T15:26:46.139Z',
      condition: 'Example Condition',
      classification: 'Pathogenic',
      status: 'Reviewed',
      origin: 'Germline',
      action: 'RCV003328158',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('variantEntity.evidence.clinVar.title')}</CardTitle>
        <CardDescription>{t('variantEntity.evidence.clinVar.description')}</CardDescription>
        <CardAction>
          <Button variant="outline">
            ClinVar <ExternalLink />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          startIcon={Search}
          placeholder={t('variantEntity.evidence.clinVar.filters.searchPlaceholder')}
          wrapperClassName="max-w-[320px]"
        />
        <DataTable
          id="pathogenic-evidence"
          columns={getPathogenicEvidenceColumns(t)}
          data={fakeData}
          defaultColumnSettings={pathogenicEvidenceDefaultSettings}
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
      </CardContent>
    </Card>
  );
}

export default ClinVarCard;
