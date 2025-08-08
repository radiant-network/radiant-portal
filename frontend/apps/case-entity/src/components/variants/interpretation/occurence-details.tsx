import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import ClassificationSection from '../occurrence-table/classification-section';
import PredictionSection from '../occurrence-table/prediction-section';
import FrequencySection from '../occurrence-table/frequency-section';
import ZygositySection from '../occurrence-table/zygosity-section';
import GeneSection from '../occurrence-table/gene-section';
import ClinicalAssociationSection from '../occurrence-table/clinical-association-section';

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
