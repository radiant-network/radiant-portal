import { Skeleton } from "../../ui/skeleton";
import AnchorLink from "../anchor-link";

const MONDO_URL = 'http://purl.obolibrary.org/obo/MONDO';
const HPO_URL = '';

export enum PhenotypeType { MONDO = "mondo", HPO = "HPO" }

function getBaseUrl(type: PhenotypeType, code: string) {
  var id = code.split(":")[1]
  switch (type) {
    case PhenotypeType.MONDO:
      return `${MONDO_URL}_${id}`;
    case PhenotypeType.HPO:
      return `${HPO_URL}_${id}`;
  }
}

export type PhenotypeConditionLinkProps = {
  type: PhenotypeType,
  name?: string;
  code?: string;
};
function PhenotypeConditionLink({ type, name, code }: PhenotypeConditionLinkProps) {

  if (!name || !code) {
    return <Skeleton />;
  }

  return (
    <span>
      {name}{' '}
      (<AnchorLink
        className="inline-flex"
        size="sm"
        variant="secondary"
        href={getBaseUrl(type, code)}
        target="_blank">
        {code}
      </AnchorLink>)
    </span>
  );
};
export default PhenotypeConditionLink;
