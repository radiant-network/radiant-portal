import { Card, CardContent, CardFooter } from '@/components/base/ui/card';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import AnalysisCard from './analysis-card';
import PatientInformationCard from './patient-information-card';
import { CaseEntity } from '@/api/api';
import ClinicalCard from './clinical-card';
import AssayInformationsCard from './assay-informations-card';

type DetailsTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function DetailsTab({ data, isLoading }: DetailsTabProps) {
  if (isLoading || !data) {
    return <CaseEntityDetailsSkeleton />;
  }

  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
      <AnalysisCard className="lg:col-span-2" data={data} />
      <PatientInformationCard className="lg:col-span-1" data={data} />
      <ClinicalCard className="lg:col-span-3" data={data} />
      <AssayInformationsCard className="lg:col-span-3" data={data} />
    </div>
  );
}

const CaseEntityDetailsSkeleton = () => {
  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
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
      <Card className="shadow-none lg:col-span-2">
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
      <Card className="shadow-none col-span-1 md:col-span-2">
        <CardContent>
          <Skeleton className="h-12" />
          <Separator className="my-6" />
          <Skeleton className="h-12" />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsTab;
