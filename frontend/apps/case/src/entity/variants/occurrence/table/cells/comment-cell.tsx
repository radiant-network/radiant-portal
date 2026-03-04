import { useSearchParams } from 'react-router';
import { MessageSquare } from 'lucide-react';

import { GermlineSNVOccurrence } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { OPEN_COMMENTS_PARAM, SELECTED_VARIANT_PARAM } from '@/entity/variants/constants';

type CommentCellProps = {
  occurrence: GermlineSNVOccurrence;
};

function CommentCell({ occurrence }: CommentCellProps) {
  const { t } = useI18n();
  const [_, setSearchParams] = useSearchParams();

  const hasComments = (occurrence as any).has_comments === true;

  const handleClick = () => {
    setSearchParams(prev => {
      prev.set(SELECTED_VARIANT_PARAM, occurrence.locus_id);
      prev.set(OPEN_COMMENTS_PARAM, '1');
      return prev;
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="size-6" iconOnly variant="ghost" onClick={handleClick}>
          <MessageSquare
            className={hasComments ? 'text-primary fill-primary/30' : 'text-muted-foreground/40'}
            size={16}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {hasComments ? t('variant.comments.tooltip.view') : t('variant.comments.tooltip.add')}
      </TooltipContent>
    </Tooltip>
  );
}

export default CommentCell;
