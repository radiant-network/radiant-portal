import { Alert, AlertDescription } from '@/components/base/ui/alert';
import { InfoIcon } from 'lucide-react';

function InterpretationLastUpdatedBanner() {
  return (
    <Alert variant="info" className="flex gap-2 items-center">
      <div>
        <InfoIcon size={16} />
      </div>
      <AlertDescription className="text-foreground">
        Last update: <strong>René Allard</strong> (March 4, 2025, 8h53)
      </AlertDescription>
    </Alert>
  );
}

export default InterpretationLastUpdatedBanner;
