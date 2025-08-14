import { Fragment } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

import { VariantConsequence } from '@/api/api';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import { replaceUnderscore } from '@/components/lib/string-format';

import TranscriptDetails from './transcript-details';

interface ConsequenceAccordionItemProps {
  value: string;
  data: VariantConsequence;
}

function ConsequenceAccordionItem({ value, data }: ConsequenceAccordionItemProps) {
  const { t } = useI18n();

  return (
    <AccordionItem value={value} className="border rounded-lg bg-background">
      <AccordionTrigger asChild className="py-4 px-5 hover:cursor-pointer">
        <div className="flex flex-1 ml-4 items-center gap-2">
          <span className="font-semibold text-base">{data.symbol || '-'}</span>
          {/* 
            ref: https://d3b.atlassian.net/browse/SJRA-146
          TODO when vep_impact is added to the api if data.is_picked == true
            <ImpactIndicator value="HIGH" size={16} />
          */}
          {data.symbol && (
            <Link to={getOmimOrgUrl({ symbol: data.symbol })} target="_blank" rel="noreferrer">
              <Button iconOnly size="xs" variant="ghost">
                {<ArrowUpRight className="size-4!" />}
              </Button>
            </Link>
          )}
        </div>
        <div className="flex flex-1">
          <Badge variant="neutral" className="capitalize">
            {t(`variant.biotype`, {
              defaultValue: data.biotype ? replaceUnderscore(data.biotype) : '-',
            })}
          </Badge>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('variant.predictions.pli')}:</span>
            <span>{data?.gnomad_pli?.toExponential(2) ?? '-'}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('variant.predictions.loeuf')}:</span>
            <span>{data.gnomad_loeuf || '-'}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('variant.predictions.splice_ai')}:</span>
            <div className="flex items-center gap-2">
              <span>{data?.spliceai_ds ? data.spliceai_ds : '-'}</span>
              {data?.spliceai_type?.length && (
                <div className="space-x-1">
                  {data.spliceai_type.map(type => (
                    <Tooltip key={type}>
                      <TooltipTrigger>
                        <Badge variant="outline">{type}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>{t(`variant.splice_ai.${type}`)}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="py-4 pt-2 px-5 space-y-4">
        <div className="border rounded-sm bg-muted/30">
          {data.transcripts?.map((transcript, index) => (
            <Fragment key={transcript.transcript_id}>
              <TranscriptDetails data={transcript} />
              {index !== (data.transcripts?.length || 0) - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default ConsequenceAccordionItem;
