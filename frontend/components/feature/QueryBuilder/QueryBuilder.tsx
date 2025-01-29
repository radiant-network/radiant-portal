import { Button } from "@/base/ui/button";
import {
  QueryBuilderProps,
  useQueryBuilder,
} from "../../model/query-builder-core";

const QueryBuilder = (props: QueryBuilderProps) => {
  const queryBuilder = useQueryBuilder(props);

  console.log(queryBuilder.getQueries());

  return (
    <div>
      QueryBuilder
      <Button
        onClick={() => {
          queryBuilder.duplicateQuery("1");
        }}
      >
        Duplicate
      </Button>
    </div>
  );
};

export default QueryBuilder;
