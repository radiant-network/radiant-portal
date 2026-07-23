import { Button } from '@/components/base/shadcn/button';

import { AssistantPanel } from './assistant-panel';
import { AssistantProvider, useAssistant } from './assistant-provider';

function Demo() {
  const { toggle } = useAssistant();
  return (
    <main className="flex h-screen items-center justify-center bg-muted">
      <Button onClick={toggle}>Open assistant</Button>
      <AssistantPanel />
    </main>
  );
}

export default function App() {
  return (
    <AssistantProvider>
      <Demo />
    </AssistantProvider>
  );
}
