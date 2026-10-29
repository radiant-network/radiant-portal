import type { PatientEntity } from '@/api/api';

import CbcCard from './cbc-card';
import CsfCard from './csf-card';
import PerformanceStatusCard from './performance-status-card';

type LaboratoryTabProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function LaboratoryTab({ patient, isLoading }: LaboratoryTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-10">
      <div className="lg:col-span-7">
        <CbcCard cbc={patient?.cbc} isLoading={isLoading} />
      </div>
      <div className="lg:col-span-3">
        <PerformanceStatusCard performanceStatus={patient?.performance_status} isLoading={isLoading} />{' '}
      </div>
      <div className="lg:col-span-10">
        <CsfCard csf={patient?.csf} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default LaboratoryTab;
