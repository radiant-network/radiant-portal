import { useState } from 'react';
import { Biohazard, ExternalLink, Sparkles, Users } from 'lucide-react';

import type { CaseEntity } from '@/api/api';
import PriorityIndicator, { type PriorityIndicatorCode } from '@/components/base/indicators/priority-indicator';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import StatusBadge, { type Status } from 'components/base/badges/status-badge';

// POC : URL de l'instance LibreChat. À terme, exposer via la config portail ou LIBRECHAT_HOST.
const LIBRECHAT_HOST = 'http://localhost:3080';
// Agent LibreChat pré-configuré (modèle + outils MCP radiant + instructions) —
// garantit que chaque conversation part avec les bons outils, peu importe l'état de l'UI.
const LIBRECHAT_AGENT_ID = 'agent_aGiiW9fwwps-SDeE19maA';

export default function Header({ data, isLoading }: { data?: CaseEntity | null; isLoading: boolean }) {
  const { t, language } = useI18n();
  const { tenant } = useTenant();
  const [aiOpen, setAiOpen] = useState(false);

  // LibreChat résout sa langue d'interface via le cookie `lang` (prioritaire sur ses réglages) ;
  // les cookies étant partagés entre ports d'un même hôte (et entre sous-domaines en production
  // avec Domain parent), poser le cookie ici synchronise la langue des deux applications.
  const syncLibrechatLanguage = () => {
    document.cookie = `lang=${language === 'fr' ? 'fr-FR' : 'en-US'}; path=/; SameSite=Lax`;
  };

  const prompt =
    `Contexte : case ${data?.case_id} (tenant ${tenant}). ` +
    `Charge le contexte de ce case et présente un bref résumé clinique (structure familiale, phénotypes HPO). ` +
    `Ensuite, attends les questions de l'utilisateur.`;
  const librechatUrl = `${LIBRECHAT_HOST}/c/new?agent_id=${LIBRECHAT_AGENT_ID}&prompt=${encodeURIComponent(prompt)}&submit=true`;

  return (
    <>
      <HeaderNavigation
        isLoading={isLoading}
        title={`${t('case_entity.header.case')} ${data?.case_id}`}
        buttons={[
          {
            variant: 'outline',
            disabled: !data,
            onClick: () => {
              syncLibrechatLanguage();
              setAiOpen(true);
            },
            children: (
              <>
                <Sparkles />
                {t('case_entity.header.ai_assistant')}
              </>
            ),
          },
        ]}
        badges={[
          {
            variant: 'secondary',
            className: 'h-5',
            children: (
              <>
                {data?.case_type === 'somatic' ? <Biohazard /> : <Users />}
                {t(`case_entity.header.${data?.case_type ?? 'unknown'}`)}
              </>
            ),
          },
          {
            variant: 'outline',
            className: 'h-5',
            children: data?.analysis_catalog_code,
            tooltipText: data?.analysis_catalog_name,
          },
        ]}
        statuses={[
          <Tooltip key="priority">
            <TooltipTrigger>
              <Badge variant="outline" className="px-3 py-2">
                <PriorityIndicator code={(data?.priority_code as PriorityIndicatorCode) || 'routine'} />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{t(`case_entity.header.priority_tooltip`)}</TooltipContent>
          </Tooltip>,
          <Tooltip key="status">
            <TooltipTrigger>
              <StatusBadge className="px-3 py-2" status={(data?.status_code as Status) || 'unknown'} />
            </TooltipTrigger>
            <TooltipContent>{t(`case_entity.header.status_tooltip`)}</TooltipContent>
          </Tooltip>,
        ]}
      />
      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="max-w-none w-[90vw] h-[88vh] flex flex-col p-4">
          <DialogHeader icon={<Sparkles />}>
            <DialogTitle className="flex items-center gap-2">
              {`${t('case_entity.header.ai_assistant')} — ${t('case_entity.header.case')} ${data?.case_id}`}
              {/* Secours : le login Keycloak (SSO) refuse de s'afficher en iframe — premier login dans un onglet */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  syncLibrechatLanguage();
                  window.open(librechatUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <ExternalLink />
                {t('case_entity.header.ai_assistant_open_tab')}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {/* L'iframe n'est montée qu'à l'ouverture, sinon le prompt partirait au chargement de la page */}
          {aiOpen && (
            <iframe
              src={librechatUrl}
              title="LibreChat"
              className="flex-1 w-full rounded-md border-0"
              allow="clipboard-write"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
