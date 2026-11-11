import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

type ProtocolCellProps = {
  name: string;
  arm?: string;
  isInitialTreatment?: boolean;
};

function ProtocolCell({ name, arm, isInitialTreatment }: ProtocolCellProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="flex items-center gap-2">
        <span className="font-medium">{name}</span>
        {isInitialTreatment && <Badge variant="secondary">{t('patient_entity.clinical_trials.initial_badge')}</Badge>}
      </div>
      {arm && <span className="text-muted-foreground text-sm">{arm}</span>}
    </div>
  );
}

export default ProtocolCell;
