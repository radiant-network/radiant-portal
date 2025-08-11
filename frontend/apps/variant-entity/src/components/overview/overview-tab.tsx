import { Card, CardContent, CardFooter } from '@/components/base/ui/card';
import { variantsApi } from '@/utils/api';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { VariantOverview } from '@/api/api';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import PredictionScoresCard from './prediction-scores-card';
import AssociatedConditionsCard from './associated-conditions-card';
import MostDeleteriousConsequenceCard from './most-deleterious-consequence-card';
import ExternalReferencesCard from './external-references-card';
import InterpretationCard from './interpretation-card';
import ClassificationCard from './classification-card';
import { tabContentClassName } from '@/style';

type VariantOverviewInput = {
  key: string;
  locusId: string;
};

async function fetchVariantOverview(input: VariantOverviewInput) {
  const response = await variantsApi.getGermlineVariantOverview(input.locusId);
  return response.data;
}

function OverviewTab() {
  const params = useParams<{ locusId: string }>();

  const { data, isLoading } = useSWR<VariantOverview, any, VariantOverviewInput>(
    {
      key: 'variant-overview',
      locusId: params.locusId!,
    },
    fetchVariantOverview,
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading || !data) {
    return <VariantOverviewSkeleton />;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 ${tabContentClassName}`}>
      <MostDeleteriousConsequenceCard data={data} className="col-span-1 md:col-span-12 2xl:col-span-8" />
      <InterpretationCard data={data} className="col-span-1 md:col-span-6 2xl:col-span-2" />
      <ClassificationCard data={data} className="col-span-1 md:col-span-6 2xl:col-span-2" />
      <PredictionScoresCard data={data} className="col-span-1 md:col-span-6 2xl:col-span-4" />
      <AssociatedConditionsCard data={data} className="col-span-1 md:col-span-6 2xl:col-span-4" />
      <ExternalReferencesCard data={data} className="mb-4 sm:mb-0 col-span-1 md:col-span-6 2xl:col-span-4" />
    </div>
  );
}

const VariantOverviewSkeleton = () => {
  return (
    <div className="gap-3 grid grid-cols-1 md:grid-cols-3">
      <Card>
        <CardContent>
          <Skeleton className="h-6" />
          <Separator className="my-3" />
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
          <Separator className="my-3" />
          <Skeleton className="h-12" />
        </CardContent>
        <Separator />
        <CardFooter className="px-3 py-4">
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
      <Card>
        <CardContent>
          <Skeleton className="h-6" />
          <Separator className="my-3" />
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

export default OverviewTab;
