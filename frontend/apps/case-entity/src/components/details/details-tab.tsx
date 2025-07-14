import { Card, CardContent, CardFooter } from '@/components/base/ui/card';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import AnalysisCard from './analysis-card';
import PatientInformationCard  from './patient-information-card';
import { CaseEntity } from '@/api/api';
import ClinicalCard from './clinical-card';

function DetailsTab({ data }: { data: CaseEntity }) {
  const isLoading = false;

  if (isLoading || !data) {
    return <CaseEntityDetailsSkeleton />;
  }

  return (
    <div className="gap-6 grid grid-cols-3">
      <AnalysisCard className="col-span-2" data={data} />
      <PatientInformationCard className="col-span-1" data={data} />
      <ClinicalCard className="col-span-3" data={data} />
    </div>
  );
}

const CaseEntityDetailsSkeleton = () => {
  return (
    <div className="gap-6 grid grid-cols-2">
      <Card>
        <CardContent>
          <Skeleton className="h-6" />
          <Separator className="my-6" />
          <div className="space-y-4">
            <Skeleton className="h-6" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none col-span-1 md:col-span-2">
        <CardContent>
          <Skeleton className="h-12" />
          <Separator className="my-6" />
          <Skeleton className="h-12" />
        </CardContent>
        <Separator />
        <CardFooter className="px-6 py-4">
          <Skeleton className="h-6 w-full" />
        </CardFooter>
      </Card>
      <Card>
        <CardContent>
          <Skeleton className="h-6" />
          <Separator className="my-6" />
          <div className="space-y-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsTab;
