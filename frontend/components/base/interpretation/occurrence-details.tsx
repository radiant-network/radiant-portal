import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import ClassificationSection from '@/components/base/occurrence/classification-section';
import ClinicalAssociationSection from '@/components/base/occurrence/clinical-association-section';
import FrequencySection from '@/components/base/occurrence/frequency-section';
import GeneSection from '@/components/base/occurrence/gene-section';
import PredictionSection from '@/components/base/occurrence/prediction-section';
import ZygositySection from '@/components/base/occurrence/zygosity-section';

interface OccurrenceDetailsProps {
  occurrence?: ExpandedGermlineSNVOccurrence;
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
