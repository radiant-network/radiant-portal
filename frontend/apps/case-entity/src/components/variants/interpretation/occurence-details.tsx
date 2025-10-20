import { ExpandedGermlineSNVOccurrence } from '@/api/api';

import ClassificationSection from '../occurrence/classification-section';
import ClinicalAssociationSection from '../occurrence/clinical-association-section';
import FrequencySection from '../occurrence/frequency-section';
import GeneSection from '../occurrence/gene-section';
import PredictionSection from '../occurrence/prediction-section';
import ZygositySection from '../occurrence/zygosity-section';

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
