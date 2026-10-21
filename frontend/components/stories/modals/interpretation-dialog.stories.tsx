import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { HttpResponse } from 'msw';
import { mocked, spyOn } from 'storybook/test';

import type { CaseEntity } from '@/api/api';
import { CaseEntityContext } from '@/apps/case/src/entity/case-entity-context';
import GermlineInterpretationDialog from '@/apps/case/src/entity/variants/germline-occurrence/interpretation/germline-interpretation-dialog';
import SomaticInterpretationDialog from '@/apps/case/src/entity/variants/somatic-occurrence/interpretation/somatic-interpretation-dialog';
import { Button } from '@/components/base/shadcn/button';
import { TenantContext } from '@/components/hooks/use-tenant';
import { caseApi, interpretationApi, mondoApi, occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import { httpCaseGermlineEntityApi } from '../api/api-case';
import { httpInterpretationGermlineOccurrenceResponse } from '../api/api-interpretations';
import { httpGermlineOccurrenceExpandResponse, httpSomaticOccurrenceExpandResponse } from '../api/api-occurrence';

const TENANT = 'radiant';
const DIAGNOSIS_LAB = 'CHUSJ';

const pubmed = [
  {
    citation_id: '25741868',
    citation:
      'Richards S, Aziz N, Bale S, et al. Standards and guidelines for the interpretation of sequence variants. Genet Med. 2015;17(5):405-424.',
  },
];

const json = async (response: Promise<HttpResponse<any>> | HttpResponse<any>) => (await response).json();

async function germlineInterpretation() {
  const base = await json(httpInterpretationGermlineOccurrenceResponse());
  return {
    ...base,
    condition: 'MONDO:0007157',
    condition_name: 'epilepsy, familial adult myoclonic',
    classification: 'LA26332-9',
    classification_criterias: ['PVS1', 'PS1', 'PM1', 'PS2'],
    transmission_modes: ['autosomal_dominant_de_novo'],
    interpretation: '<p>Short description. Edited 3</p>',
    pubmed,
    updated_by_name: 'test test',
    updated_at: '2026-05-14T08:58:00Z',
  };
}

function somaticInterpretation() {
  return {
    id: '2cae8ebf-e480-4a3f-a6fc-5ba4864192e9',
    tumoral_type: 'MONDO:0005575',
    tumoral_name: 'colorectal cancer',
    oncogenicity: 'LA26332-9',
    oncogenicity_classification_criterias: ['OVS1', 'OS1'],
    clinical_utility: 'category_ia',
    interpretation: '<p>Short description.</p>',
    pubmed,
    updated_by_name: 'test test',
    updated_at: '2026-05-14T08:58:00Z',
  };
}

// Mocks the API clients directly so the stories do not depend on a service worker.
async function mockApis(kind: 'germline' | 'somatic') {
  const caseEntity = await json(httpCaseGermlineEntityApi());
  spyOn(caseApi, 'caseEntity').mockResolvedValue({ data: caseEntity } as any);
  spyOn(mondoApi, 'mondoTermAutoComplete').mockResolvedValue({ data: [] } as any);
  if (kind === 'germline') {
    const expanded = await json(httpGermlineOccurrenceExpandResponse());
    spyOn(occurrencesApi, 'getExpandedGermlineSNVOccurrence').mockResolvedValue({ data: expanded } as any);
    spyOn(interpretationApi, 'getInterpretationGermline').mockResolvedValue({
      data: await germlineInterpretation(),
    } as any);
  } else {
    const expanded = await json(httpSomaticOccurrenceExpandResponse());
    spyOn(occurrencesApi, 'getExpandedSomaticSNVOccurrence').mockResolvedValue({ data: expanded } as any);
    spyOn(interpretationApi, 'getInterpretationSomatic').mockResolvedValue({ data: somaticInterpretation() } as any);
  }
}

const meta = {
  title: 'Features/Modals/Interpretation Dialog',
  component: GermlineInterpretationDialog,
  beforeEach: async () => {
    mocked(useCaseIdFromParam).mockReturnValue(1);
    mocked(useSeqIdFromSearchParam).mockReturnValue(1);
  },
  args: {
    locusId: '-8318226658347712512',
    taskId: 1,
    transcriptId: 'ENST00000295910',
    patientId: 3,
    startInViewMode: true,
    renderTrigger: handleOpen => <Button onClick={handleOpen}>Open interpretation</Button>,
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <TenantContext.Provider
          value={{
            tenant: TENANT,
            tenants: [{ code: TENANT, orgs_by_action: { can_interpret_variant: [DIAGNOSIS_LAB] } }],
            setTenant: async () => {},
            refreshPermissions: async () => {},
          }}
        >
          <CaseEntityContext.Provider value={{ diagnosis_lab_code: DIAGNOSIS_LAB } as CaseEntity}>
            <Story />
          </CaseEntityContext.Provider>
        </TenantContext.Provider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof GermlineInterpretationDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GermlineView: Story = {
  beforeEach: () => mockApis('germline'),
};

export const GermlineEdit: Story = {
  beforeEach: () => mockApis('germline'),
  args: { startInViewMode: false },
};

export const SomaticView: Story = {
  beforeEach: () => mockApis('somatic'),
  render: args => <SomaticInterpretationDialog {...args} />,
};
