import PhenotypeConditionLink, {
  PhenotypeConditionLinkProps,
} from '../../navigation/phenotypes/phenotype-condition-link';

import EmptyCell from './empty-cell';

function PhenotypeConditionLinkCell({ ...props }: PhenotypeConditionLinkProps) {
  if (!props.name || !props.code) return <EmptyCell />;

  return <PhenotypeConditionLink {...props} />;
}

export default PhenotypeConditionLinkCell;
