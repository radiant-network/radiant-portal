import { Badge } from "../../ui/badge";
import { Skeleton } from "../../ui/skeleton";
import AnchorLink from "../anchor-link";

const MONDO_URL = 'http://purl.obolibrary.org/obo/MONDO';
const HPO_URL = 'http://purl.obolibrary.org/obo/HP';

enum PhenotypeType { MONDO = "MONDO", HPO = "HP" }

function getBaseUrl(code: string) {
  var type = code.split(":")[0] as PhenotypeType;
  var id = code.split(":")[1]
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
};
function PhenotypeConditionLink({ name, code, onsetCode, ...props }: PhenotypeConditionLinkProps) {

  if (!name || !code) {
    return <Skeleton />;
  }

  return (
    <span className="text-sm inline-flex gap-1" {...props}>
      {name}
      <span>
        (<AnchorLink className="inline-flex text-sm" size="sm" href={getBaseUrl(code)} target="_blank">
          {code}
        </AnchorLink>)
      </span>
      {onsetCode && <Badge variant="outline">{onsetCode}</Badge>}
    </span>
  );
};
export default PhenotypeConditionLink;
