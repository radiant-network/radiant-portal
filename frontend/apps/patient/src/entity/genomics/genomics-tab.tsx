import { usePatientIdFromParam } from '@/utils/helper';

import GenomicCasesCard from './genomic-cases/genomic-cases-card';
import VariantInterpretationsCard from './variant-interpretations/variant-interpretations-card';

function GenomicsTab() {
  const patientId = usePatientIdFromParam();

  return (
    <div className="flex flex-col gap-3">
      <VariantInterpretationsCard patientId={patientId} />
      <GenomicCasesCard patientId={patientId} />
    </div>
  );
}

export default GenomicsTab;
