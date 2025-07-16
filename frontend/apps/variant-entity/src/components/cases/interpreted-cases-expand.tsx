import { VariantExpandedInterpretedCase, VariantInterpretedCase } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { variantsApi } from '@/utils/api';
import { sanitizeHtml, decodeHtmlEntities } from '@/utils/helper';
import { Copy, Mars, Stethoscope, User, Venus } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

interface InterpretedCasesExpandProps {
  locusId: string;
  data: VariantInterpretedCase;
}

type VariantExpandedInterpretedCaseInput = {
  locusId: string;
  seqId: string;
  transcriptId: string;
};

async function fetchOccurrenceExpand(input: VariantExpandedInterpretedCaseInput) {
  const response = await variantsApi.getExpandedGermlineVariantInterpretedCase(
    input.locusId,
    input.seqId,
    input.transcriptId,
  );
  return response.data;
}

function InterpretedCasesExpand({ locusId, data }: InterpretedCasesExpandProps) {
  const { data: expandedData, isLoading } = useSWR<
    VariantExpandedInterpretedCase,
    any,
    VariantExpandedInterpretedCaseInput
  >(
    {
      locusId: locusId.toString(),
      seqId: data.seq_id.toString(),
      transcriptId: data.transcript_id,
    },
    fetchOccurrenceExpand,
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
              <User size={16} /> <span className="text-sm">{expandedData?.patient_id || '-'}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Stethoscope size={16} />
              <span className="text-sm">{expandedData?.interpreter_name || '-'}</span>
            </div>
          </div>
          <div
            className="text-sm whitespace-break-spaces"
            dangerouslySetInnerHTML={{
              __html: expandedData?.interpretation
                ? sanitizeHtml(decodeHtmlEntities(expandedData.interpretation))
                : '-',
            }}
          />
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
          <div className="text-sm font-medium">{expandedData?.gene_symbol || '-'}</div>
          <div className="text-xs underline hover:cursor-pointer">NM_21360026</div>
        </div>
        {expandedData?.classification_criterias && expandedData?.classification_criterias.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {expandedData?.classification_criterias.map(criteria => (
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
        {expandedData?.patient_sex_code && (
          <div className="flex items-center gap-2">
            <div className="p-1 border rounded">
              {expandedData?.patient_sex_code === 'male' ? <Mars size={14.4} /> : <Venus size={14.4} />}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs">
          <span>PMID:</span>
          {expandedData?.pubmed_ids && expandedData?.pubmed_ids.length > 0 ? (
            <div className="underline hover:cursor-pointer space-x-2">
              {expandedData?.pubmed_ids.map(pubmed => (
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

export default InterpretedCasesExpand;
