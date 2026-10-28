import type { PatientEntity } from '@/api/api';

import CbcCard from './cbc-card';
import CsfCard from './csf-card';
import PerformanceStatusCard from './performance-status-card';

type LaboratoryTabProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function LaboratoryTab({ patient, isLoading }: LaboratoryTabProps) {
  const canReadPhi = patient?.can_read_phi ?? false;

  return (
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-2">
      <CbcCard cbc={patient?.cbc} canReadPhi={canReadPhi} isLoading={isLoading} />
      <PerformanceStatusCard
        performanceStatus={patient?.performance_status}
        canReadPhi={canReadPhi}
        isLoading={isLoading}
      />
      <div className="lg:col-span-2">
        <CsfCard csf={patient?.csf} canReadPhi={canReadPhi} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default LaboratoryTab;
