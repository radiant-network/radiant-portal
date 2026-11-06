import { describe, expect, it } from 'vitest';

import { buildNewChatUrl } from './librechat-url';

const BASE = 'https://chat.example.org';

function params(url: string) {
  return Object.fromEntries(new URL(url).searchParams);
}

describe('buildNewChatUrl', () => {
  it('opens the case agent from a case', () => {
    const url = buildNewChatUrl(BASE, { kind: 'case', caseId: 1131 }, 'case 1131');

    expect(url.startsWith(`${BASE}/c/new?`)).toBe(true);
    expect(params(url)).toEqual({ spec: 'radiant-case', prompt: 'case 1131', submit: 'true' });
  });

  it('opens the patient agent from a patient page', () => {
    const url = buildNewChatUrl(BASE, { kind: 'patient', patientKey: '0f8fad5b-d9cb-469f-a165-70867728950e' }, 'p');

    expect(params(url).spec).toBe('radiant-patient');
  });

  it('opens the cohort agent from the patient list', () => {
    expect(params(buildNewChatUrl(BASE, { kind: 'cohort' }, 'cohort')).spec).toBe('radiant-cohort');
  });

  it('keeps a base path and does not double its slash', () => {
    expect(buildNewChatUrl(`${BASE}/librechat/`, { kind: 'cohort' }, '')).toBe(
      `${BASE}/librechat/c/new?spec=radiant-cohort`,
    );
    expect(buildNewChatUrl(`${BASE}/librechat`, { kind: 'cohort' }, '')).toBe(
      `${BASE}/librechat/c/new?spec=radiant-cohort`,
    );
  });

  it('only submits when there is a prompt', () => {
    expect(params(buildNewChatUrl(BASE, { kind: 'cohort' }, ''))).toEqual({ spec: 'radiant-cohort' });
  });
});
