import EmptyField from '@/components/base/information/empty-field';
import { Badge } from '@/components/base/shadcn/badge';
import { getPhenotypeConditionUrl } from '@/components/lib/external-links';

import AnchorLink from '../anchor-link';

export type PhenotypeConditionLinkProps = React.ComponentProps<'span'> & {
  name?: string;
  code?: string;
  onsetCode?: string;
  showCode?: boolean;
};
function PhenotypeConditionLink({ name, code, onsetCode, showCode = true, ...props }: PhenotypeConditionLinkProps) {
  if (!code) {
    return <EmptyField />;
  }

  return (
    <span className="text-sm flex gap-1 text-foreground truncate" {...props}>
      <AnchorLink className="text-sm truncate" size="sm" href={getPhenotypeConditionUrl(code)} target="_blank">
        {name || code} {showCode && name && `(${code})`}
      </AnchorLink>
      {onsetCode && <Badge variant="outline">{onsetCode}</Badge>}
    </span>
  );
}
export default PhenotypeConditionLink;
