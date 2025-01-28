import { QueryBuilderProps } from "./core/query-builder";
import { useQueryBuilder } from "./core/useQueryBuilder";
import { Button } from "../button";

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
