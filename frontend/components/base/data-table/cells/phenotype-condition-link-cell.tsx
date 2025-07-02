const MONDO_URL = 'http://purl.obolibrary.org/obo/MONDO';
const HPO_URL = '';

export enum PhenotypeType { MONDO = "mondo", HPO = "HPO" }

type PhenotypeConditionLinkCellProps = {
  type: PhenotypeType,
  name: string;
  code: string;
};

function getBaseUrl(type: PhenotypeType, code: string) {
  switch (type) {
    case PhenotypeType.MONDO:
      return `${MONDO_URL}_${code}`;
    case PhenotypeType.HPO:
      return `${HPO_URL}_${code}`;
  }
}

function PhenotypeConditionLinkCell({ type, code, name }: PhenotypeConditionLinkCellProps) {
  return (
    <span>{name}(<a href={getBaseUrl(type, code)}>{code}</a>)</span>
  );
}

export default PhenotypeConditionLinkCell;
