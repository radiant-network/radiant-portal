import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { mocked } from 'storybook/test';

import type { CaseEntity } from '@/api/api';
import { CaseEntityContext } from '@/apps/case/src/entity/case-entity-context';
import GermlineInterpretationDialog from '@/apps/case/src/entity/variants/germline-occurrence/interpretation/germline-interpretation-dialog';
import SomaticInterpretationDialog from '@/apps/case/src/entity/variants/somatic-occurrence/interpretation/somatic-interpretation-dialog';
import { Button } from '@/components/base/shadcn/button';
import { TenantContext } from '@/components/hooks/use-tenant';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import { caseEntityApi, httpCaseGermlineEntityApi, httpCaseSomaticEntityApi } from '../api/api-case';
import {
  httpInterpretationGermlineOccurrenceResponse,
  httpInterpretationSomaticOccurrenceResponse,
  interpretationsGermlineApi,
  interpretationsSomaticApi,
} from '../api/api-interpretations';
import {
  httpGermlineOccurrenceExpandResponse,
  httpSomaticOccurrenceExpandResponse,
  occurrenceGermlineExpandApi,
  occurrenceSomaticExpandApi,
} from '../api/api-occurrence';

const STORYBOOK_TENANT = 'radiant';
const STORYBOOK_DIAGNOSIS_LAB = 'CQGC';
const OPEN_LABEL = 'Open interpretation';

const germlineHandlers = [
  http.get(caseEntityApi, httpCaseGermlineEntityApi),
  http.get(occurrenceGermlineExpandApi, httpGermlineOccurrenceExpandResponse),
  http.get(interpretationsGermlineApi, httpInterpretationGermlineOccurrenceResponse),
  http.post(interpretationsGermlineApi, () => HttpResponse.json({})),
];

const somaticHandlers = [
  http.get(caseEntityApi, httpCaseSomaticEntityApi),
  http.get(occurrenceSomaticExpandApi, httpSomaticOccurrenceExpandResponse),
  http.get(interpretationsSomaticApi, httpInterpretationSomaticOccurrenceResponse),
  http.post(interpretationsSomaticApi, () => HttpResponse.json({})),
];

const dialogProps = {
  locusId: '219406',
  taskId: 1,
  transcriptId: 'ENST00000412585',
  patientId: 1,
  renderTrigger: (handleOpen: () => void) => <Button onClick={handleOpen}>{OPEN_LABEL}</Button>,
};

const meta = {
  title: 'Features/Modals/Interpretation Dialog',
  beforeEach: async () => {
    mocked(useCaseIdFromParam).mockReturnValue(1);
    mocked(useSeqIdFromSearchParam).mockReturnValue(1);
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: OPEN_LABEL }));
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <TenantContext.Provider
          value={{
            tenant: STORYBOOK_TENANT,
            tenants: [
              {
                code: STORYBOOK_TENANT,
                orgs_by_action: { can_interpret_variant: [STORYBOOK_DIAGNOSIS_LAB] },
              },
            ],
            setTenant: async () => {},
            refreshPermissions: async () => {},
          }}
        >
          <CaseEntityContext.Provider value={{ diagnosis_lab_code: STORYBOOK_DIAGNOSIS_LAB } as CaseEntity}>
            <Story />
          </CaseEntityContext.Provider>
        </TenantContext.Provider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GermlineReadOnly: Story = {
  parameters: {
    msw: { handlers: germlineHandlers },
  },
  render: () => <GermlineInterpretationDialog {...dialogProps} mode="view" />,
};

export const GermlineEdit: Story = {
  parameters: {
    msw: { handlers: germlineHandlers },
  },
  render: () => <GermlineInterpretationDialog {...dialogProps} mode="edit" />,
};

export const SomaticReadOnly: Story = {
  parameters: {
    msw: { handlers: somaticHandlers },
  },
  render: () => <SomaticInterpretationDialog {...dialogProps} mode="view" />,
};
