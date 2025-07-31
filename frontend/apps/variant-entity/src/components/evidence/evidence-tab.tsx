import { tabContentClassName } from '@/style';
import ClinVarCard from './clinVar-card';
import ConditionPhenotypeCard from './condition-phenotype-card';

function EvidenceTab() {
  return (
    <div className={tabContentClassName}>
      <ClinVarCard />
      <ConditionPhenotypeCard />
    </div>
  );
}

export default EvidenceTab;
