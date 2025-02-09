import { Button } from "@/base/ui/button";
import {
  QueryBuilderProps,
  useQueryBuilder,
} from "../../model/query-builder-core";
import { queryBuilderRemote } from "@/model/query-builder-core/query-builder-remote";
import { v4 } from "uuid";

const QueryBuilder = (props: QueryBuilderProps) => {
  const queryBuilder = useQueryBuilder(props);

  console.log(queryBuilder.getState());

  return (
    <div>
      QueryBuilder
      <Button
        onClick={async () => {
          queryBuilderRemote.addQuery("variant", {
            id: v4(),
            op: "and",
            content: [],
          });
        }}
      >
        Add Query
      </Button>
    </div>
  );
};

export default QueryBuilder;
