import ClassificationSection from './classification-section';
import PredictionSection from './prediction-section';
import GeneSection from './gene-section';
import FrequencySection from './frequency-section';
import FunctionalScoreSection from './functional-score-section';
import ZygositySection from './zygosity-section';
import FamilySection from './family-section';
import ClinicalAssociationSection from './clinical-association-section';
import MetricSection from './metric-section';
import { ExpandedOccurrence } from '@/api/api';

type ExpandedOccurrenceDetailsProps = {
  data: ExpandedOccurrence;
};

export default function OccurrenceExpandDetails({ data }: ExpandedOccurrenceDetailsProps) {
  return (
    <>
      <div className="space-y-2.5">
        <ClassificationSection data={data} />
        <PredictionSection data={data} />
        <GeneSection data={data} />
      </div>
      <div className="space-y-2.5">
        <FrequencySection data={data} />
        <FunctionalScoreSection data={data} />
      </div>
      <div className="space-y-2.5">
        <ZygositySection data={data} />
        <ClinicalAssociationSection data={data} />
      </div>
      <div className="space-y-2.5">
        <FamilySection data={data} />
        <MetricSection data={data} />
      </div>
    </>
  );
}
