import { http } from 'msw';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';

import { SavedFilterType } from '@/api/api';
import { ApplicationId, type PortalConfig } from '@/components/cores/applications-config';
import {
  httpCaseAutocompleteResponse,
  httpCaseFiltersApiResponse,
  httpCaseSearchApiResponse,
} from '@/components/stories/api/api-case';
import { renderWithProviders, TEST_TENANT } from '@/components/tests/render-with-providers';
import { worker } from '@/components/tests/setup-browser';

import { PROTECTED_LAYOUT_ROUTE_ID } from '../../components/case-assignment';

import TableFilters from './case-exploration-table-filters';

const config: PortalConfig = {
  variant_entity: { app_id: ApplicationId.variant_entity },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.GERMLINE_CNV_OCCURRENCE,
  },
  somatic_snv_to_occurrence: {
    app_id: ApplicationId.somatic_snv_to_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.SOMATIC_SNV_OCCURRENCE,
  },
  somatic_snv_tn_occurrence: {
    app_id: ApplicationId.somatic_snv_tn_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.SOMATIC_SNV_OCCURRENCE,
  },
  somatic_cnv_to_occurrence: {
    app_id: ApplicationId.somatic_cnv_to_occurrence,
    aggregations: [] as any,
    saved_filter_type: SavedFilterType.SOMATIC_CNV_OCCURRENCE,
  },
  admin: { admin_code: 'admin', app_id: ApplicationId.admin },
  portal: { name: '', default_language: 'en', navigation: {} },
};

describe('CaseExplorationTableFilters', () => {
  it('requests the autocomplete with the typed prefix', async () => {
    const autocompleteRequests: URL[] = [];
    worker.use(
      http.post('*/api/:tenant/cases/search', httpCaseSearchApiResponse),
      http.post('*/api/:tenant/cases/filters', httpCaseFiltersApiResponse),
      http.get('*/api/:tenant/cases/autocomplete', ({ request }) => {
        autocompleteRequests.push(new URL(request.url));
        return httpCaseAutocompleteResponse();
      }),
    );

    const screen = await renderWithProviders(<TableFilters loading={false} setSearchCriteria={() => {}} />, {
      config,
      routeId: PROTECTED_LAYOUT_ROUTE_ID,
      loaderData: { sub: 'test-user' },
    });
    await userEvent.type(screen.getByPlaceholder('Case, patient, MRN, sample or run'), '283');

    await expect.poll(() => autocompleteRequests.at(-1)?.searchParams.get('prefix')).toBe('283');
    const request = autocompleteRequests.at(-1)!;
    expect(request.pathname).toMatch(new RegExp(`/${TEST_TENANT}/cases/autocomplete$`));
    expect(request.searchParams.get('limit')).toBe('10');
  });
});
