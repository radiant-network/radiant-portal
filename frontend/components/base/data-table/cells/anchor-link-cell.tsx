import AnchorLink, { AnchorLinkProps } from '../../navigation/anchor-link';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import EmptyCell from './empty-cell';


type AnchorLinkCell = AnchorLinkProps<any> & {
  tooltip?: React.ReactElement;
}


function AnchorLinkCell({ children, variant = "primary", tooltip, ...props }: AnchorLinkProps<any>) {
  if (!children && !props.href) return <EmptyCell />;

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <AnchorLink size='sm' variant={variant} {...props}>
            {children}
          </AnchorLink>
        </TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <AnchorLink size="sm" variant={variant} {...props}>
      {children}
    </AnchorLink>
  );
}

export default AnchorLinkCell;
