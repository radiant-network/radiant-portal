import { ExpandedGermlineSNVOccurrence } from '@/api/api';

import ClassificationSection from './classification-section';
import ClinicalAssociationSection from './clinical-association-section';
import FamilySection from './family-section';
import FrequencySection from './frequency-section';
import FunctionalScoreSection from './functional-score-section';
import GeneSection from './gene-section';
import MetricSection from './metric-section';
import PredictionSection from './prediction-section';
import ZygositySection from './zygosity-section';

type ExpandedOccurrenceDetailsProps = {
  data: ExpandedGermlineSNVOccurrence;
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
