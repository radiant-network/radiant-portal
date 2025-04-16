import ClassificationSection from './classification-section';
import PredictionSection from './prediction-section';
import GeneSection from './gene-section';
import FrequencySection from './frequency-section';
import FunctionalScoreSection from './functional-score-section';
import ZygositySection from './zygosity-section';
import FamilySection from './family-section';
import ClinicalAssociationSection from './clinical-association-section';
import MetricSection from './metric-section';
import { ExpendedOccurrence } from '@/api/api';

type ExpendedOccurrenceDetailsProps = {
  data: ExpendedOccurrence;
};

export default function OccurrenceExpendDetails({ data }: ExpendedOccurrenceDetailsProps) {
  return (
    <>
      <div className="space-y-2.5">
        <ClassificationSection />
        <PredictionSection />
        <GeneSection data={data} />
      </div>
      <div className="space-y-2.5">
        <FrequencySection />
        <FunctionalScoreSection data={data} />
      </div>
      <div className="space-y-2.5">
        <ZygositySection />
        <ClinicalAssociationSection />
      </div>
      <div className="space-y-2.5">
        <FamilySection />
        <MetricSection />
      </div>
    </>
  );
}
