import { VariantExpendedInterpretedCase, VariantInterpretedCase } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { variantsApi } from '@/utils/api';
import { Copy, Mars, Stethoscope, User, Venus } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

interface InterpretedCasesExpendProps {
  locusId: string;
  data: VariantInterpretedCase;
}

type VariantExpendedInterpretedCaseInput = {
  locusId: string;
  seqId: string;
  transcriptId: string;
};

async function fetchOccurrenceExpend(input: VariantExpendedInterpretedCaseInput) {
  const response = await variantsApi.getExpendedGermlineVariantInterpretedCase(
    input.locusId,
    input.seqId,
    input.transcriptId,
  );
  return response.data;
}

function InterpretedCasesExpend({ locusId, data }: InterpretedCasesExpendProps) {
  const { data: expendedData, isLoading } = useSWR<
    VariantExpendedInterpretedCase,
    any,
    VariantExpendedInterpretedCaseInput
  >(
    {
      locusId: locusId.toString(),
      seqId: data.seq_id.toString(),
      transcriptId: data.transcript_id,
    },
    fetchOccurrenceExpend,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const handleCopy = useCallback(() => {
    // TODO - Implement the actual copy logic
    toast.success('Copied to clipboard');
  }, []);

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="flex justify-between gap-8">
          <div className="flex-1 space-y-6">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Separator className="mt-6 mb-4" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 w-full">
        <div className="space-y-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-muted-foreground">
            <div className="flex gap-1 items-center">
              <User size={16} /> <span className="text-sm">{expendedData?.patient_id || '-'}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Stethoscope size={16} />
              <span className="text-sm">{expendedData?.interpreter_name || '-'}</span>
            </div>
          </div>
          <div className="text-sm whitespace-break-spaces">{expendedData?.interpretation || '-'}</div>
        </div>
        <div className="flex-shrink-0">
          <Button variant="outline" size="xs" onClick={handleCopy}>
            <Copy /> Copy
          </Button>
        </div>
      </div>
      <Separator className="mt-6 mb-4" />
      <div className="flex flex-wrap items-center gap-4 sm:gap-10">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{expendedData?.gene_symbol || '-'}</div>
          <div className="text-xs underline hover:cursor-pointer">NM_21360026</div>
        </div>
        {expendedData?.classification_criterias && expendedData?.classification_criterias.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {expendedData?.classification_criterias.map(criteria => (
                <Badge variant="outline" key={criteria}>
                  {criteria}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="outline">AD</Badge>
          <Badge variant="outline">XLD</Badge>
        </div>
        {expendedData?.patient_sex_code && (
          <div className="flex items-center gap-2">
            <div className="p-1 border rounded">
              expendedData?.patient_sex_code === 'male' ? (
              <Mars size={14.4} />
              ) : (
              <Venus size={14.4} />)
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs">
          <span>PMID:</span>
          {expendedData?.pubmed_ids && expendedData?.pubmed_ids.length > 0 ? (
            <div className="underline hover:cursor-pointer space-x-2">
              {expendedData?.pubmed_ids.map(pubmed => (
                <div key={pubmed}>{pubmed}</div>
              ))}
            </div>
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  );
}

export default InterpretedCasesExpend;
