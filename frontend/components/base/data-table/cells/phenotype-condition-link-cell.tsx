const MONDO_URL = 'http://purl.obolibrary.org/obo/MONDO';
const HPO_URL = '';

export enum PhenotypeType { MONDO = "mondo", HPO = "HPO" }

type PhenotypeConditionLinkCellProps = {
  type: PhenotypeType,
  name: string;
  code: string;
};

function getBaseUrl(type: PhenotypeType, code: string) {
  var id = code.split(":")[1]
  switch (type) {
    case PhenotypeType.MONDO:
      return `${MONDO_URL}_${id}`;
    case PhenotypeType.HPO:
      return `${HPO_URL}_${id}`;
  }
}

function PhenotypeConditionLinkCell({ type, code, name }: PhenotypeConditionLinkCellProps) {
  return (
    <span>
      {name}{' '}
      (<a className="underline" href={getBaseUrl(type, code)} target="_blank">{code}</a>)
    </span>
  );
}

export default PhenotypeConditionLinkCell;
