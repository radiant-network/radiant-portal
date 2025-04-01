import { Alert, AlertDescription } from '@/components/base/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Interpretation } from './types';
import { format } from 'date-fns';

type InterpretationLastUpdatedBannerProps = {
  interpretation: Interpretation | undefined;
};

function InterpretationLastUpdatedBanner({ interpretation }: InterpretationLastUpdatedBannerProps) {
  if (!interpretation?.updated_by_name || !interpretation.updated_at) return null;

  return (
    <Alert className="flex gap-2 items-center">
      <div>
        <InfoIcon size={16} />
      </div>
      <AlertDescription className="text-foreground">
        Last update: <strong>{interpretation.updated_by_name}</strong> (
        {format(new Date(interpretation.updated_at), "MMMM d, yyyy, H'h'mm")})
      </AlertDescription>
    </Alert>
  );
}

export default InterpretationLastUpdatedBanner;
