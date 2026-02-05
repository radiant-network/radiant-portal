import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import ClassificationSection from '@/components/base/occurrence//classification-section';
import ClinicalAssociationSection from '@/components/base/occurrence//clinical-association-section';
import FamilySection from '@/components/base/occurrence//family-section';
import FrequencySection from '@/components/base/occurrence//frequency-section';
import FunctionalScoreSection from '@/components/base/occurrence//functional-score-section';
import GeneSection from '@/components/base/occurrence//gene-section';
import PredictionSection from '@/components/base/occurrence//prediction-section';
import ZygositySection from '@/components/base/occurrence//zygosity-section';
import MetricSection from '@/components/base/occurrence/metric-section';

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
