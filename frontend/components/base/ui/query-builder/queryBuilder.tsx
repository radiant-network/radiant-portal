import { QueryBuilderProps } from "../../../base/query-builder-core/core/query-builder";
import { useQueryBuilder } from "../../../base/query-builder-core/useQueryBuilder";
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
