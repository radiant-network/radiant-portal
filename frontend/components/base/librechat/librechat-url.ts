/** Portal context the D.A.V.I.D button is opened from. */
export type LibrechatContext =
  | { kind: 'case'; caseId: string | number }
  | { kind: 'patient'; patientKey: string }
  | { kind: 'cohort' };

// LibreChat model specs (librechat.yaml in qlin-qa-infra), one D.A.V.I.D agent per portal context
export const LIBRECHAT_MODEL_SPECS: Record<LibrechatContext['kind'], string> = {
  case: 'radiant-case',
  patient: 'radiant-patient',
  cohort: 'radiant-cohort',
};

/**
 * URL that opens a new LibreChat conversation on the context's agent and sends `prompt` right away.
 * LibreChat reads the query params on /c/new only: its root redirects there and drops them.
 */
export function buildNewChatUrl(librechatUrl: string, context: LibrechatContext, prompt: string): string {
  const url = new URL('c/new', librechatUrl.replace(/\/?$/, '/'));
  url.searchParams.set('spec', LIBRECHAT_MODEL_SPECS[context.kind]);
  if (prompt) {
    url.searchParams.set('prompt', prompt);
    url.searchParams.set('submit', 'true');
  }
  return url.toString();
}
