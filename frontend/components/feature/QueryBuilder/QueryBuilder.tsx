import { Button } from "@/base/ui/button";
import {
  QueryBuilderProps,
  useQueryBuilder,
} from "../../model/query-builder-core";

const QueryBuilder = (props: QueryBuilderProps) => {
  const queryBuilder = useQueryBuilder(props);

  return (
    <div>
      QueryBuilder
      <Button onClick={() => queryBuilder.deleteQuery("1")}>Add Query</Button>
    </div>
  );
};

export default QueryBuilder;
