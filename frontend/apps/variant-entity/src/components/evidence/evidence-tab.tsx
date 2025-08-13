import { tabContentClassName } from '@/style';
import ClinVarCard from './clinVar-card';
import ConditionPhenotypeCard from './condition-phenotype-card';
import { cn } from '@/components/lib/utils';

function EvidenceTab() {
  return (
    <div className={cn('flex flex-col', tabContentClassName)}>
      <ClinVarCard />
      <ConditionPhenotypeCard />
    </div>
  );
}

export default EvidenceTab;
