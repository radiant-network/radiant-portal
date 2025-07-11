import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import stylesheet from './app.css?url';
import type { Route } from './+types/root';
import { AlertDialogProvider } from '@/components/base/dialog/alert-dialog-provider';
import { TooltipProvider } from '@/components/base/ui/tooltip';
import ThemeProvider from '@/components/feature/theme-toggle/theme-provider';
import { ConfigProvider, type PortalConfig } from '@/components/model/applications-config';
import { BetaFeatureProvider } from '@/components/hooks/beta-feature-provider';
import { I18nProvider } from '@/components/hooks/I18nProvider';
import { Toaster } from '@/components/base/ui/sonner';
import { detectLanguageFromRequest } from '@/components/hooks/i18n.server';
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
        <Meta />
        <Links />
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
              <Toaster />
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
