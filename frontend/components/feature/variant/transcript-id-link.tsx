import { cn } from '@/components/lib/utils';
import AnchorLink from '@/components/base/navigation/anchor-link';
import CanonicalBadge from './canonical-badge';
import ManeSelectBadge from './mane-select-badge';
import ManePlusBadge from './mane-plus-badge';
import { getEnsemblTranscriptUrl } from './utils';

interface TranscriptIdLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  transcriptId: string;
  isCanonical: boolean | undefined;
  isManeSelect: boolean | undefined;
  isManePlus: boolean | undefined;
  iconSize?: number;
  linkClassName?: string;
}

function TranscriptIdLink({
  transcriptId,
  isCanonical,
  isManePlus,
  isManeSelect,
  iconSize = 16,
  linkClassName,
  className,
  ...props
}: TranscriptIdLinkProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      <AnchorLink
        size="sm"
        href={getEnsemblTranscriptUrl(transcriptId)}
        className={cn('hover:underline font-mono', linkClassName)}
        target="_blank"
        rel="noreferrer"
      >
        {transcriptId}
      </AnchorLink>
      {isCanonical && <CanonicalBadge size={16} />}
      {isManeSelect && <ManeSelectBadge size={16} />}
      {isManePlus && <ManePlusBadge size={16} />}
    </div>
  );
}

export default TranscriptIdLink;
