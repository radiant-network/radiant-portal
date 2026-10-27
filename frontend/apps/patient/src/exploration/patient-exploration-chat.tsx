import { type CSSProperties, useCallback, useEffect, useId, useState } from 'react';
import { flushSync } from 'react-dom';
import { Sparkles, X } from 'lucide-react';
import { UDIChat } from 'udi-yac';

import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import {
  Tabs as ChatTabs,
  TabsContent as ChatTabsContent,
  TabsList as ChatTabsList,
  TabsTrigger as ChatTabsTrigger,
} from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

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

type PatientExplorationChatProps = {
  // The page makes everything behind the modal inert.
  onExpandedChange: (expanded: boolean) => void;
};

function PatientExplorationChat({ onExpandedChange }: PatientExplorationChatProps) {
  const { t } = useI18n();
  const chatTitleId = useId();

  // UDIChat renders only in a browser, so it mounts after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Inline, the dashboard is read-only; expanded, the chat is open. The card grows into a modal in
  // place, rather than through a portal-based Dialog, so the chat inside it is never remounted and
  // loses nothing.
  const [expanded, setExpanded] = useState(false);
  const [chatTab, setChatTab] = useState('yac');
  const setChatExpanded = useCallback(
    (value: boolean) => {
      const update = () => {
        setExpanded(value);
        onExpandedChange(value);
        // Both ways: inline there is no tab strip, so any tab but YAC would leave the card empty.
        setChatTab('yac');
      };
      // A view transition morphs the card between its inline spot and the modal. flushSync, so the
      // new state is in the DOM when the browser snapshots it.
      if (!('startViewTransition' in document) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        update();
        return;
      }
      document.startViewTransition(() => flushSync(update));
    },
    [onExpandedChange],
  );
  useEffect(() => {
    if (!expanded) return;
    // A popup inside the chat stops its own Escape, so this only sees the ones meant for the modal.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) setChatExpanded(false);
    };
    document.addEventListener('keydown', onKeyDown);
    // The page scrolls in <main> below, and may in the document too if the header pushes it past
    // the viewport. Lock both so the wheel over the backdrop moves nothing.
    const { documentElement } = document;
    const overflow = documentElement.style.overflow;
    documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      documentElement.style.overflow = overflow;
    };
  }, [expanded, setChatExpanded]);

  return (
    <>
      {/* m-0 on the fixed boxes: a space-y parent's margins would shrink them. The backdrop
          click is a pointer shortcut; keyboards close with Esc or the X button. */}
      {expanded && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 m-0 bg-black/50 [view-transition-name:yac-backdrop]"
          onClick={() => setChatExpanded(false)}
        />
      )}
      {/* Every element from here down to the chat renders in both modes, so React keeps it mounted. */}
      <Card
        role={expanded ? 'dialog' : undefined}
        aria-modal={expanded || undefined}
        aria-labelledby={expanded ? chatTitleId : undefined}
        className={cn(
          'w-full gap-0 pb-0 overflow-hidden [view-transition-name:yac-chat]',
          expanded && 'fixed inset-x-6 top-14 bottom-6 z-50 m-0 w-auto pt-0 shadow-lg',
        )}
      >
        <ChatTabs value={chatTab} onValueChange={setChatTab} className="min-h-0 flex-1 gap-0">
          {expanded && (
            <ChatTabsList className="m-2 mb-0">
              <ChatTabsTrigger value="yac">{t('patient_exploration.chat.tabs.yac')}</ChatTabsTrigger>
              <ChatTabsTrigger value="david">{t('patient_exploration.chat.tabs.david')}</ChatTabsTrigger>
              <ChatTabsTrigger value="other">{t('patient_exploration.chat.tabs.other')}</ChatTabsTrigger>
            </ChatTabsList>
          )}
          <CardHeader className={cn('border-b', expanded && 'pt-4')}>
            <div className="flex flex-col gap-0.5">
              <CardTitle id={chatTitleId}>{t('patient_exploration.chat.title')}</CardTitle>
              <p className="text-muted-foreground text-xs">{t('patient_exploration.chat.description')}</p>
            </div>
            <CardAction>
              {expanded ? (
                <Button variant="ghost" iconOnly aria-label={t('common.close')} onClick={() => setChatExpanded(false)}>
                  <X />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setChatExpanded(true)}>
                    <Sparkles />
                    {t('patient_exploration.chat.explore')}
                  </Button>
                  <Badge variant="secondary" className="gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {t('patient_exploration.chat.source')}
                  </Badge>
                </div>
              )}
            </CardAction>
          </CardHeader>
          {/* Mounted while another tab shows, only hidden, so switching tabs keeps the chat too. */}
          <ChatTabsContent value="yac" forceMount className="flex min-h-0 flex-col data-[state=inactive]:hidden">
            {/* The same UDIChat stays mounted in both modes, so charts, filters and the conversation
                carry over. Only the container's size changes. */}
            <div className={expanded ? 'min-h-0 flex-1' : 'h-[800px]'}>
              {mounted && (
                <UDIChat
                  apiBaseUrl="/api/yac"
                  remotePackage={REMOTE_PACKAGE}
                  model={OPENAI_MODEL}
                  initialSession={demoSession}
                  // Locked inline: the card header has the way out, so the chat's own Explore Data is dropped.
                  readOnly={expanded ? false : 'locked'}
                  // Keep the session's column count in both modes.
                  refitOnReadOnlyChange={false}
                  style={PORTAL_THEME}
                />
              )}
            </div>
          </ChatTabsContent>
          {expanded && (
            <>
              <ChatTabsContent value="david" className="text-muted-foreground p-6 text-sm">
                {t('patient_exploration.chat.tabs.placeholder')}
              </ChatTabsContent>
              <ChatTabsContent value="other" className="text-muted-foreground p-6 text-sm">
                {t('patient_exploration.chat.tabs.placeholder')}
              </ChatTabsContent>
            </>
          )}
        </ChatTabs>
      </Card>
    </>
  );
}

export default PatientExplorationChat;
