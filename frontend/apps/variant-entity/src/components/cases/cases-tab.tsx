import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/ui/card';
import { Separator } from '@/components/base/ui/separator';
import { useI18n } from '@/components/hooks/i18n';
import CasesFilters, { CasesCreatedAtSort, CasesFiltersState } from './cases-filters';
import { useState } from 'react';
import InterpretedCasesTable from './interpreted-cases-table';
import OtherCasesTable from './other-cases-table';

function CasesTab() {
  const { t } = useI18n();
  const [initialFilters, setInitialFilters] = useState<CasesFiltersState>({
    createdAtSort: CasesCreatedAtSort.mostRecent,
    institution: '', // todo
    test: '', // todo
    classification: '', // todo
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('variantEntity.cases.title')}</CardTitle>
        <CardDescription>{t('variantEntity.cases.description')}</CardDescription>
      </CardHeader>
      <Separator className="m-6" />
      <CardContent className="space-y-6">
        <CasesFilters filters={initialFilters} onFiltersChange={setInitialFilters} />
        <InterpretedCasesTable />
        <OtherCasesTable />
      </CardContent>
    </Card>
  );
}

export default CasesTab;
