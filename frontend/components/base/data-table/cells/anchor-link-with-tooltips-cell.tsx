
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import AnchorLink, { AnchorLinkProps } from '../../navigation/anchor-link';

function AnchorLinkTooltipsCell({ children, ...props }: AnchorLinkProps<any>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AnchorLink size='sm' variant='secondary' {...props}>
          {children}
        </AnchorLink>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

export default AnchorLinkTooltipsCell;
