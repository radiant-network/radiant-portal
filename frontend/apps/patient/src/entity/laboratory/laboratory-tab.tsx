import { usePatientLaboratory } from '../use-patient-tab';

import CbcCard from './cbc-card';
import CsfCard from './csf-card';
import PerformanceStatusCard from './performance-status-card';

function LaboratoryTab() {
  const { data: laboratory, isLoading } = usePatientLaboratory();

  return (
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-10">
      <div className="lg:col-span-7">
        <CbcCard cbc={laboratory?.cbc} isLoading={isLoading} />
      </div>
      <div className="lg:col-span-3">
        <PerformanceStatusCard performanceStatus={laboratory?.performance_status} isLoading={isLoading} />{' '}
      </div>
      <div className="lg:col-span-10">
        <CsfCard csf={laboratory?.csf} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default LaboratoryTab;
