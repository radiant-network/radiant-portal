import { Badge } from '@/components/base/shadcn/badge';
import { Skeleton } from '@/components/base/shadcn/skeleton';

import AnchorLink from '../anchor-link';

const MONDO_URL = 'http://purl.obolibrary.org/obo/MONDO';
const HPO_URL = 'http://purl.obolibrary.org/obo/HP';

enum PhenotypeType {
  MONDO = 'MONDO',
  HPO = 'HP',
}

function getBaseUrl(code: string) {
  const type = code.split(':')[0] as PhenotypeType;
  const id = code.split(':')[1];
  switch (type) {
    case PhenotypeType.MONDO:
      return `${MONDO_URL}_${id}`;
    case PhenotypeType.HPO:
      return `${HPO_URL}_${id}`;
  }
}

export type PhenotypeConditionLinkProps = React.ComponentProps<'span'> & {
  name?: string;
  code?: string;
  onsetCode?: string;
  showCode?: boolean;
};
function PhenotypeConditionLink({ name, code, onsetCode, showCode = true, ...props }: PhenotypeConditionLinkProps) {
  if (!name || !code) {
    return <Skeleton />;
  }

  return (
    <span className="text-sm flex gap-1 text-foreground truncate" {...props}>
      <AnchorLink className="text-sm truncate" size="sm" href={getBaseUrl(code)} target="_blank">
        {name} {showCode && `(${code})`}
      </AnchorLink>
      {onsetCode && <Badge variant="outline">{onsetCode}</Badge>}
    </span>
  );
}
export default PhenotypeConditionLink;
