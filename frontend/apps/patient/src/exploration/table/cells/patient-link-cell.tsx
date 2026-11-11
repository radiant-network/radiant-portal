import { Link } from 'react-router';
import { Lock } from 'lucide-react';

import type { PatientListItem } from '@/api/api';
import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalPath } from '@/components/hooks/use-local-path';

type PatientLinkCellProps = {
  patient: PatientListItem;
};

function PatientLinkCell({ patient }: PatientLinkCellProps) {
  const { t } = useI18n();
  const localPath = useLocalPath();
  const overviewPath = localPath(`/patient/entity/${patient.patient_key}`);
  const label = patient.can_read_phi
    ? `${patient.given_name} ${patient.family_name}`
    : t('patient_exploration.cells.patient.research_id', { id: patient.patient_id });
  return (
    <div className="flex items-center gap-1.5">
      <AnchorLinkCell component={Link} to={overviewPath} className="font-medium">
        {label}
      </AnchorLinkCell>
      {!patient.can_read_phi && (
        <Lock
          size={12}
          className="text-muted-foreground"
          aria-label={t('patient_exploration.cells.patient.masked_aria')}
        />
      )}
    </div>
  );
}

export default PatientLinkCell;
