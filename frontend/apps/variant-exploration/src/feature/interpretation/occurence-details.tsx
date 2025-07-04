import { ExpendedOccurrence } from '@/api/api';
import ClassificationSection from '@/feature/occurrence-table/classification-section';
import PredictionSection from '@/feature/occurrence-table/prediction-section';
import FrequencySection from '@/feature/occurrence-table/frequency-section';
import ZygositySection from '@/feature/occurrence-table/zygosity-section';
import GeneSection from '@/feature/occurrence-table/gene-section';
import ClinicalAssociationSection from '@/feature/occurrence-table/clinical-association-section';

interface OccurrenceDetailsProps {
  occurrence?: ExpendedOccurrence;
}

function OccurrenceDetails({ occurrence }: OccurrenceDetailsProps) {
  if (!occurrence) return null;
  return (
    <div className="space-y-4">
      <ClassificationSection data={occurrence} />
      <PredictionSection data={occurrence} />
      <FrequencySection data={occurrence} />
      <ZygositySection data={occurrence} />
      <GeneSection data={occurrence} />
      <ClinicalAssociationSection data={occurrence} />
    </div>
  );
}

export default OccurrenceDetails;
