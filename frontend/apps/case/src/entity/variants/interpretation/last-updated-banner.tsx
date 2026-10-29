import { Trans } from 'react-i18next';
import { History } from 'lucide-react';

import DateTime from '@/components/base/date/datetime';
import { Alert, AlertDescription } from '@/components/base/shadcn/alert';

type InterpretationLastUpdatedBannerProps = {
  updated_by_name?: string;
  updated_at?: string;
};

function InterpretationLastUpdatedBanner({ updated_by_name, updated_at }: InterpretationLastUpdatedBannerProps) {
  if (!updated_by_name || !updated_at) return null;

  return (
    <Alert variant="info" className="items-center gap-2">
      <History size={20} />
      <AlertDescription>
        <Trans
          i18nKey="variant.interpretation_form.last_update"
          values={{ name: updated_by_name }}
          components={{ strong: <strong />, date: <DateTime date={updated_at} /> }}
        />
      </AlertDescription>
    </Alert>
  );
}

export default InterpretationLastUpdatedBanner;
