import { useMemo } from 'react';

import type { ComphetGene } from '@/api/api';
import DialogListCell from '@/components/base/data-table/cells/dialog-list-cell';
import { useI18n } from '@/components/hooks/i18n';

type ComphetGenesCellProps = {
  genes?: ComphetGene[];
};

function ComphetGenesCell({ genes = [] }: ComphetGenesCellProps) {
  const { t } = useI18n();

  const sortedGenes = useMemo(
    () => [...genes].sort((a, b) => b.nb - a.nb || a.symbol.localeCompare(b.symbol)),
    [genes],
  );

  return (
    <DialogListCell
      header={t('common.facets.labels.has_comphet')}
      items={sortedGenes}
      renderItem={(gene: ComphetGene) => (
        <span key={gene.symbol}>
          {gene.symbol} ({gene.nb})
        </span>
      )}
      visibleCount={1}
    />
  );
}

export default ComphetGenesCell;
