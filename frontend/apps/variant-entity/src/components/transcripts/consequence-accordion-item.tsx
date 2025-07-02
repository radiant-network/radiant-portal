import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { Badge } from '@/components/base/ui/badge';
import { Separator } from '@/components/base/ui/separator';
import { Fragment, RefAttributes } from 'react';
import TranscriptDetails from './transcript-details';
import { useI18n } from '@/components/hooks/i18n';
import { VariantConsequence } from '@/api/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { getOmimOrgUrl } from '@/components/feature/variant/utils';

interface ConsequenceAccordionItemProps {
  value: string;
  data: VariantConsequence;
}

function ConsequenceAccordionItem({ value, data }: ConsequenceAccordionItemProps) {
  const { t } = useI18n();

  return (
    <AccordionItem value={value} className="border rounded">
      <AccordionTrigger asChild className="py-4 px-5 hover:cursor-pointer">
        <div className="flex flex-1 ml-4 items-center gap-3">
          <span className="font-semibold text-base">
            {data.symbol ? (
              <a
                href={getOmimOrgUrl({ symbol: data.symbol })}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                onClick={e => e.stopPropagation()}
              >
                {data.symbol}
              </a>
            ) : (
              '-'
            )}
          </span>
          {/* 
            ref: https://d3b.atlassian.net/browse/SJRA-146
          TODO when vep_impact is added to the api if data.is_picked == true
            <ImpactIcon value="HIGH" size={16} />
          */}
        </div>
        <div className="flex flex-1">
          <Badge variant="slate" className="capitalize">
            {t(`variant.biotype`, {
              defaultValue: data.biotype?.replace(/_/g, ' ') || '-',
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
            <span className="text-muted-foreground">{t('variant.predictions.spliceAI')}:</span>
            <div className="flex items-center gap-2">
              <span>{data?.spliceai_ds ? data.spliceai_ds : '-'}</span>
              {data?.spliceai_type?.length && (
                <div className="space-x-1">
                  {data.spliceai_type.map(type => (
                    <Tooltip key={type}>
                      <TooltipTrigger>
                        <Badge variant="outline">{type}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>{t(`variant.spliceAi.${type}`)}</TooltipContent>
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
