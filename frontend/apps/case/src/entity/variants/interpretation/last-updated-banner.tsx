import { format, formatDate } from 'date-fns';
import { InfoIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/base/shadcn/alert';
import { useI18n } from '@/components/hooks/i18n';
import DateTime from '@/components/base/date/datetime';

type InterpretationLastUpdatedBannerProps = {
  updated_by_name?: string;
  updated_at?: string;
};

function InterpretationLastUpdatedBanner({ updated_by_name, updated_at }: InterpretationLastUpdatedBannerProps) {
  const { t } = useI18n();
  if (!updated_by_name || !updated_at) return null;

  return (
    <Alert className="flex gap-2 items-center">
      <div>
        <InfoIcon size={16} />
      </div>
      <AlertDescription className="text-foreground">
        <span className="flex gap-1">
          {t('variant.interpretation_form.last_update')}
          <strong>{updated_by_name}</strong>({format(new Date(updated_at), t('common.date.year_month_day_hour'))})
        </span>
      </AlertDescription>
    </Alert>
  );
}

export default InterpretationLastUpdatedBanner;
