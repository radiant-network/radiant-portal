import PhenotypeConditionLink, { PhenotypeConditionLinkProps } from "../../navigation/phenotypes/phenotype-condition-link";


function PhenotypeConditionLinkCell({ ...props }: PhenotypeConditionLinkProps) {
  return (
    <PhenotypeConditionLink {...props} />
  );
}

export default PhenotypeConditionLinkCell;
