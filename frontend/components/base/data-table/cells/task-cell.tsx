import BadgeCell from './badge-cell';

type TaskCellProps = {
  taskId: number;
  typeName?: string;
};

function TaskCell({ taskId, typeName }: TaskCellProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{taskId}</span>
      {typeName && <BadgeCell variant="secondary">{typeName}</BadgeCell>}
    </div>
  );
}

export default TaskCell;
