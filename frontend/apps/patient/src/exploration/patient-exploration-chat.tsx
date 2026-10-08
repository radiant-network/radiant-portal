import { type CSSProperties, useEffect, useState } from 'react';
import { UDIChat } from 'udi-yac';

import demoSession from './patient-exploration-demo-session.json';

import 'udi-yac/style.css';

// Data package served by the YAC agent (backend/compose/yac/backends.json): the cbtn PCX views,
// queried as the logged-in user.
const REMOTE_PACKAGE = 'cbtn';

// Sent only with a key the user entered in the chat. Without one, the agent's own model applies.
const OPENAI_MODEL = 'gpt-5.4';

// udi-yac sets its own values for these theme tokens on its root element. Inheriting them instead
// applies the portal theme, dark mode included. Inline, so no stylesheet order can undo it.
const THEME_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'radius',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
];
const PORTAL_THEME = {
  fontFamily: 'inherit',
  ...Object.fromEntries(THEME_TOKENS.map(token => [`--${token}`, 'inherit'])),
} as CSSProperties;

function PatientExplorationChat() {
  // UDIChat renders only in a browser, so it mounts after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="h-[800px]">
      {mounted && (
        <UDIChat
          apiBaseUrl="/api/yac"
          remotePackage={REMOTE_PACKAGE}
          model={OPENAI_MODEL}
          // udi-yac's pcx demo session (sample-data/pcx/demo-session.json), rebuilt for the cbtn views.
          initialSession={demoSession}
          readOnly
          style={PORTAL_THEME}
        />
      )}
    </div>
  );
}

export default PatientExplorationChat;
