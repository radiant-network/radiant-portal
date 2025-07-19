import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { Accordion } from '@/components/base/ui/accordion';
import { useI18n } from '@/components/hooks/i18n';
import ConsequenceAccordionItem from './consequence-accordion-item';
import { variantsApi } from '@/utils/api';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { VariantConsequence } from '@/api/api';
import { Skeleton } from '@/components/base/ui/skeleton';

type VariantTranscriptsInput = {
  key: string;
  locusId: string;
};

async function fetchVariantConsequences(input: VariantTranscriptsInput) {
  const response = await variantsApi.getGermlineVariantConsequences(input.locusId);
  return response.data;
}

function TranscriptsTab() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();

  const { data, isLoading } = useSWR<VariantConsequence[], any, VariantTranscriptsInput>(
    {
      key: 'variant-transcripts',
      locusId: params.locusId!,
    },
    fetchVariantConsequences,
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading || !data) {
    return <VariantTranscriptsSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('variantEntity.transcripts.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={data.map((_, idx) => idx.toString())} className="space-y-2">
          {data.map((item, index) => (
            <ConsequenceAccordionItem key={`transcripts-cons-${index}`} value={`${index}`} data={item} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

const VariantTranscriptsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptsTab;
