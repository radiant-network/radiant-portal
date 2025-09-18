import { cn } from '@/components/lib/utils';
import { tabContentClassName } from '@/style';

import ClinVarCard from './clinVar-card';
import ConditionPhenotypeCard from './condition-phenotype-card';

function EvidenceTab() {
  return (
    <div className={cn('flex flex-col', tabContentClassName)}>
      <ClinVarCard />
      <ConditionPhenotypeCard />
    </div>
  );
}

export default EvidenceTab;
