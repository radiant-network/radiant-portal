import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { Badge } from '@/components/base/shadcn/badge';

type AgentsCellProps = {
  agents: string[];
};

function AgentsCell({ agents }: AgentsCellProps) {
  if (!agents.length) return <EmptyCell />;
  return (
    <div className="flex flex-wrap gap-1">
      {agents.map(agent => (
        <Badge key={agent} variant="outline">
          {agent}
        </Badge>
      ))}
    </div>
  );
}

export default AgentsCell;
