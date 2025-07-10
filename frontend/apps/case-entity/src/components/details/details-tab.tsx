import { Card, CardContent, CardFooter } from '@/components/base/ui/card';
import { useParams } from 'react-router';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import AnalysisCard from './analysis-card';
import PatientInformationCard  from './patient-information-card';

function DetailsTab() {
  const params = useParams<{ caseId: string }>();
  const data = {};
  const isLoading = false;

  if (isLoading || !data) {
    return <CaseEntityDetailsSkeleton />;
  }

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
      <AnalysisCard data={data} />
      <PatientInformationCard data={data} />
    </div>
  );
}

const CaseEntityDetailsSkeleton = () => {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
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
