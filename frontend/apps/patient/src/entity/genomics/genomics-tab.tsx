import { usePatientGenomics } from '../hooks/use-patient-entity';

import GenomicCasesCard from './genomic-cases/genomic-cases-card';
import VariantInterpretationsCard from './variant-interpretations/variant-interpretations-card';

function GenomicsTab() {
  const { data: genomics, isLoading } = usePatientGenomics();

  return (
    <div className="flex flex-col gap-3">
      <VariantInterpretationsCard interpretations={genomics?.interpretations ?? []} isLoading={isLoading} />
      <GenomicCasesCard cases={genomics?.cases ?? []} isLoading={isLoading} />
    </div>
  );
}

export default GenomicsTab;
