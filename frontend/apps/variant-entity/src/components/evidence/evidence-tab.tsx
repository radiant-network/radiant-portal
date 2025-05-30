import ClinVarCard from './clinVar-card';
import ConditionPhenotypeCard from './condition-phenotype-card';

function EvidenceTab() {
  return (
    <div className="space-y-6">
      <ClinVarCard />
      <ConditionPhenotypeCard />
    </div>
  );
}

export default EvidenceTab;
