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

function DetailsTab({ caseEntity, isLoading }: DetailsTabProps) {
  if (isLoading || !caseEntity) {
    return (
      <div className="max-w-8xl mx-auto w-full">
        <CaseEntityDetailsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto w-full">
      <div className="gap-y-2 md:gap-6 grid grid-cols-1 lg:grid-cols-3 lg:grid-cols-[1fr_minmax(auto,480px)] justify-center">
        <AnalysisCard
          className="lg:col-span-2 min-w-0 border-0 rounded-none md:border md:rounded-xl"
          data={caseEntity}
        />
        <PatientInformationCard
          className="col-span-1 h-auto size-max w-full lg:w-[480px] justify-self-end border-0 rounded-none md:border md:rounded-xl"
          data={caseEntity}
        />
        <ClinicalCard className="lg:col-span-3 border-0 rounded-none md:border md:rounded-xl" data={caseEntity} />
        <AssayInformationsCard
          className="lg:col-span-3 border-0 rounded-none md:border md:rounded-xl"
          data={caseEntity}
        />
      </div>
    </div>
  );
}

const CaseEntityDetailsSkeleton = () => {
  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2">
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
      <Card className="shadow-none lg:col-span-3">
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
      <Card className="lg:col-span-3">
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
      <Card className="shadow-none lg:col-span-3">
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
