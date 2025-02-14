import { useQueryBuilderContext } from "../QueryBuilder.Context";

const QueryBarCount = () => {
  const { queryCountIcon: QueryCountIcon } = useQueryBuilderContext();

  return (
    <div className="flex items-center gap-1">
      {QueryCountIcon && <QueryCountIcon size={14} />}
      <span className="font-medium">12</span>
    </div>
  );
};

export default QueryBarCount;
