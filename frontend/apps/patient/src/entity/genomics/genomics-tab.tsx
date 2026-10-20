import type { PatientEntity } from '@/api/api';
import { usePatientIdFromParam } from '@/utils/helper';

import GenomicCasesCard from './genomic-cases/genomic-cases-card';
import VariantInterpretationsCard from './variant-interpretations/variant-interpretations-card';

type GenomicsTabProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function GenomicsTab({ patient, isLoading }: GenomicsTabProps) {
  const patientId = usePatientIdFromParam();

  return (
    <div className="flex flex-col gap-3">
      <VariantInterpretationsCard patientId={patientId} />
      <GenomicCasesCard cases={patient?.cases ?? []} isLoading={isLoading} />
    </div>
  );
}

export default GenomicsTab;
