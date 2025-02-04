import { Button } from "@/base/ui/button";
import {
  QueryBuilderProps,
  useQueryBuilder,
} from "../../model/query-builder-core";

const QueryBuilder = (props: QueryBuilderProps) => {
  const queryBuilder = useQueryBuilder(props);

  console.log(queryBuilder.getState());
  console.log("selected", queryBuilder.getSelectedSavedFilter());

  return (
    <div>
      QueryBuilder
      <Button
        onClick={async () => {
          queryBuilder.createSavedFilter();
        }}
      >
        Add Query
      </Button>
    </div>
  );
};

export default QueryBuilder;
