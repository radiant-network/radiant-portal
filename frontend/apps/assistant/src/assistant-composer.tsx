import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Textarea } from '@/components/base/shadcn/textarea';

import { useAssistant } from './assistant-provider';

/** Message input row. Enter sends, Shift+Enter inserts a newline. */
export function AssistantComposer() {
  const { send, isResponding } = useAssistant();
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim() || isResponding) {
      return;
    }
    send(value);
    setValue('');
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Textarea
        value={value}
        rows={1}
        onChange={event => setValue(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Ask about variants, patients, cases…"
        className="max-h-32 flex-1 resize-none"
      />
      <Button size="sm" iconOnly disabled={!value.trim() || isResponding} onClick={submit} aria-label="Send message">
        <SendHorizontal />
      </Button>
    </div>
  );
}
