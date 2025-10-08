import { ExpandedGermlineSNVOccurrence } from '@/api/api';

import ClassificationSection from '../occurence/classification-section';
import ClinicalAssociationSection from '../occurence/clinical-association-section';
import FrequencySection from '../occurence/frequency-section';
import GeneSection from '../occurence/gene-section';
import PredictionSection from '../occurence/prediction-section';
import ZygositySection from '../occurence/zygosity-section';

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
