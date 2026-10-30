import type { PatientEntity } from '@/api/api';

import GenomicCasesCard from './genomic-cases/genomic-cases-card';
import VariantInterpretationsCard from './variant-interpretations/variant-interpretations-card';

type GenomicsTabProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function GenomicsTab({ patient, isLoading }: GenomicsTabProps) {
  return (
    <div className="flex flex-col gap-3">
      <VariantInterpretationsCard interpretations={patient?.interpretations ?? []} isLoading={isLoading} />
      <GenomicCasesCard cases={patient?.cases ?? []} isLoading={isLoading} />
    </div>
  );
}

export default GenomicsTab;
