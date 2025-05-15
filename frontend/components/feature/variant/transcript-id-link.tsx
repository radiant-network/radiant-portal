import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

interface TranscriptIdLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  transcriptId: string;
  isCanonical: boolean | undefined;
  iconSize?: number;
  linkClassName?: string;
}

function TranscriptIdLink({
  transcriptId,
  isCanonical,
  iconSize = 16,
  linkClassName,
  className,
  ...props
}: TranscriptIdLinkProps) {
  const { t } = useI18n();

  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      <a
        href={`https://www.ensembl.org/id/${transcriptId}`}
        className={cn('hover:underline', linkClassName)}
        target="_blank"
        rel="noreferrer"
      >
        {transcriptId}
      </a>
      {isCanonical && (
        <Tooltip>
          <TooltipTrigger>
            <TranscriptCanonicalIcon size={iconSize} className="text-primary" />
          </TooltipTrigger>
          <TooltipContent>
            {t('variant.canonicalTranscript', {
              defaultValue: 'Canonical transcript',
            })}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export default TranscriptIdLink;
