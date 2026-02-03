import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';

import { AlertDialogProvider } from '@/components/base/dialog/alert-dialog-provider';
import { Toaster } from '@/components/base/shadcn/sonner';
import { TooltipProvider } from '@/components/base/shadcn/tooltip';
import ThemeProvider from '@/components/base/theme-toggle/theme-provider';
import { ConfigProvider, type PortalConfig } from '@/components/cores/applications-config';
import { BetaFeatureProvider } from '@/components/hooks/beta-feature-provider';
import { detectLanguageFromRequest } from '@/components/hooks/i18n.server';
import { I18nProvider } from '@/components/hooks/I18nProvider';

import type { Route } from './+types/root';
import stylesheet from './app.css?url';
declare const __PROJECT__: PortalConfig;

export async function loader({ request }: Route.LoaderArgs) {
  // Just detect and return the language for consistent server/client behavior
  return {
    language: detectLanguageFromRequest(request),
  };
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<{ language: string }>();
  return (
    <html lang={loaderData?.language || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={__PROJECT__.portal.name} />
        <meta property="og:description" content="" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="application-name" content={__PROJECT__.portal.name} />
        <Meta />
        <Links />
        <link rel="icon" type="image/x-icon" href={`/${__PROJECT__.portal.name.toLowerCase()}/favicon.ico`} />
        <link
          rel="icon"
          type="image/png"
          href={`/${__PROJECT__.portal.name.toLowerCase()}/favicon-16x16.png`}
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href={`/${__PROJECT__.portal.name.toLowerCase()}/favicon-32x32.png`}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href={`/${__PROJECT__.portal.name.toLowerCase()}/favicon-96x96.png`}
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href={`/${__PROJECT__.portal.name.toLowerCase()}/favicon-128x128.png`}
          sizes="128x128"
        />
        <link
          rel="icon"
          type="image/png"
          href={`/${__PROJECT__.portal.name.toLowerCase()}/favicon-196x196.png`}
          sizes="196x196"
        />
        <link rel="manifest" href={`/${__PROJECT__.portal.name.toLowerCase()}/site.webmanifest`} />
        <script src="https://cdn.jsdelivr.net/npm/igv@3.7.0/dist/igv.min.js"></script>
      </head>
      <body>
        <I18nProvider initialLanguage={loaderData?.language}>
          <ConfigProvider config={__PROJECT__}>
            <ThemeProvider>
              <TooltipProvider delayDuration={0}>
                <AlertDialogProvider>
                  <BetaFeatureProvider>{children}</BetaFeatureProvider>
                </AlertDialogProvider>
              </TooltipProvider>
              <Toaster position="top-right" />
            </ThemeProvider>
          </ConfigProvider>
        </I18nProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
