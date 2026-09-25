import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';

import type { Route } from './+types/charmx';

import { authenticateRequest, requireAuth } from '~/utils/auth.server';

// Mount point of the proxy route (see ~/api/charmx-proxy and routes.ts). Kept as
// a literal rather than imported: that module pulls in auth.server, which must
// not reach the client bundle.
const CHARMX_PROXY_BASE = '/charmx-proxy';

/**
 * POC page comparing the two ways of embedding CharmX.
 *
 * Both tabs render the same CharmX instance; only the way it gets a token
 * differs. The "Call downstream" page inside CharmX reports the `azp` claim,
 * which is what tells the two apart at a glance.
 *
 * Deliberately NOT nested in protected-layout: that layout's TenantProvider
 * calls /api/auth/me and renders a 403 when the user has no tenant membership,
 * which would make this POC depend on the whole backend stack (API + Postgres +
 * a provisioned user). All this page needs is a portal session, so it does its
 * own auth check and skips the navbar.
 */

export async function loader({ request }: Route.LoaderArgs) {
  // Same gate protected-layout uses: redirects to Keycloak when signed out.
  if (await requireAuth(request)) {
    await authenticateRequest(request);
  }

  return {
    // Server-side env, handed to the browser because the solution-2 iframe is
    // loaded directly by the browser from CharmX's own origin.
    charmxPublicUrl: process.env.CHARMX_PUBLIC_URL || 'http://localhost:8091',
  };
}

type FrameProps = {
  src: string;
  title: string;
  description: string;
};

function CharmxFrame({ src, title, description }: FrameProps) {
  return (
    <div className="flex flex-col gap-2 pt-4">
      <div className="text-muted-foreground flex items-baseline justify-between gap-4 text-sm">
        <p>{description}</p>
        <a className="text-primary shrink-0 underline" href={src} target="_blank" rel="noreferrer">
          Open outside the iframe
        </a>
      </div>
      <iframe src={src} title={title} className="h-[70vh] w-full rounded-md border" />
    </div>
  );
}

export default function CharmxPocPage({ loaderData }: Route.ComponentProps) {
  const charmxPublicUrl = loaderData?.charmxPublicUrl ?? '';

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">CharmX integration POC</h1>
        <p className="text-muted-foreground text-sm">
          Two ways to embed an external app that needs our Keycloak JWT. Click through the links and the form in each
          frame, then open “Call downstream” and compare the <code>azp</code> claim.
        </p>
        <p className="text-muted-foreground text-xs">
          Standalone page — no navbar, and no tenant/API dependency.{' '}
          <a className="underline" href="/auth/logout">
            Sign out
          </a>
        </p>
      </div>

      <Tabs defaultValue="proxy">
        <TabsList>
          <TabsTrigger value="proxy">1 — Server proxy</TabsTrigger>
          <TabsTrigger value="sso">2 — Direct SSO</TabsTrigger>
        </TabsList>

        <TabsContent value="proxy">
          <CharmxFrame
            src={`${CHARMX_PROXY_BASE}/`}
            title="CharmX via the portal proxy"
            description="Same-origin. The portal server injects the access token from its httpOnly cookie on every request."
          />
        </TabsContent>

        <TabsContent value="sso">
          <CharmxFrame
            src={charmxPublicUrl}
            title="CharmX via its own Keycloak session"
            description="Cross-origin. CharmX runs its own authorization-code flow with prompt=none against the existing Keycloak session."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
