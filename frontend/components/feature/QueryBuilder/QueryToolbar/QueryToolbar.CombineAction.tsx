import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";
import { ActionButton } from "@/components/base/Buttons";
import { BooleanOperators } from "@/components/model/sqon";
import capitalize from "lodash/capitalize";

const QueryToolbarCombineAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder, enableCombine } = useQueryBuilderContext();

  if (queryBuilder.canCombine() && enableCombine) {
    return (
      <ActionButton
        actions={[
          {
            label: capitalize(dict.queryPill.operator.and),
            onClick: () =>
              queryBuilder.combineSelectedQueries(BooleanOperators.and),
          },
          {
            label: capitalize(dict.queryPill.operator.or),
            onClick: () =>
              queryBuilder.combineSelectedQueries(BooleanOperators.or),
          },
        ]}
        onDefaultAction={() =>
          queryBuilder.combineSelectedQueries(BooleanOperators.and)
        }
        size="xs"
        variant="primary"
      >
        {dict.toolbar.combine}
      </ActionButton>
    );
  }

  return null;
};

export default QueryToolbarCombineAction;
