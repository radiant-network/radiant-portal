import AnchorLink, { AnchorLinkProps } from '../../navigation/anchor-link';

function AnchorLinkCell({ children, ...props }: AnchorLinkProps<any>) {
  return (
    <AnchorLink size="sm" variant='secondary' {...props}>
      {children}
    </AnchorLink>
  );
}

export default AnchorLinkCell;
