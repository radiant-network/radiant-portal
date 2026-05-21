import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { mocked } from 'storybook/test';

import { SomaticOccurrenceSheetContent } from '@/apps/case/src/entity/variants/somatic-occurrence/sliders/slider-somatic-occurrence-sheet';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';
import SliderSheet from '@/components/base/slider/slider-sheet';
import { http } from 'msw';
import { caseEntityApi, httpCaseSomaticEntityApi } from '../api/api-case';
import { httpSomaticOccurrenceExpandResponse, occurrenceSomaticExpandApi } from '../api/api-occurrence';
import { SomaticSNVOccurrence } from '@/api/api';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    saved_filter_type: 'germline_snv_occurrence',
    aggregations: {},
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
    saved_filter_type: 'germline_cnv_occurrence',
    aggregations: {},
  },
  somatic_snv_to_occurrence: {
    app_id: ApplicationId.somatic_snv_to_occurrence,
    saved_filter_type: 'somatic_snv_occurrence',
    aggregations: {},
  },
  somatic_snv_tn_occurrence: {
    app_id: ApplicationId.somatic_snv_tn_occurrence,
    saved_filter_type: 'somatic_snv_occurrence',
    aggregations: {},
  },
  somatic_cnv_to_occurrence: {
    app_id: ApplicationId.somatic_cnv_to_occurrence,
    saved_filter_type: 'somatic_cnv_occurrence',
    aggregations: {},
  },
  admin: {
    admin_code: 'admin',
    app_id: ApplicationId.admin,
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const occurrenceMock = {
  locus_id: '-8932383132192079872',
  seq_id: 1011,
  task_id: 1018,
  has_interpretation: false,
  has_note: false,
  hgvsg: 'chr1:g.10276319A>G',
  symbol: 'KIF1B',
  aa_change: '',
  variant_class: 'SNV',
  vep_impact: 'HIGH',
  picked_consequences: ['splice_acceptor_variant'],
  is_mane_select: false,
  is_mane_plus: false,
  is_canonical: true,
  rsnumber: '',
  omim_inheritance_code: ['AD', 'Smu'],
  hotspot: true,
  clinvar: [],
  gnomad_v3_af: 0,
  germline_pf_wgs: 6,
  germline_pc_wgs: 10,
  somatic_pf_tn_wgs: 7,
  somatic_pc_tn_wgs: 11,
} as SomaticSNVOccurrence;

const meta = {
  title: 'Sliders/Occurrences/Somatic',
  component: SomaticOccurrenceSheetContent,
  beforeEach: async () => {
    mocked(useCaseIdFromParam).mockReturnValue(1);
    mocked(useSeqIdFromSearchParam).mockReturnValue(1);
  },
  args: {
    occurrence: occurrenceMock,
    onPrevious: () => {
      console.warn('onPrevious');
    },
    onNext: () => {
      console.warn('onNext');
    },
    hasPrevious: false,
    hasNext: false,
    patientSelected: {
      seq_id: 1,
      patient_id: 1,
      relationship_to_proband: 'proband',
      sample_id: 1,
      sample_submitter_id: 'S11111',
      sample_type_code: 'dna',
      affected_status_code: 'affected',
      histology_code: 'normal',
      experimental_strategy_code: 'wgs',
      status_code: 'completed',
      updated_on: '2021-10-12T13:08:00Z',
      has_variants: true,
    },
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <Story />
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof SomaticOccurrenceSheetContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(occurrenceSomaticExpandApi, httpSomaticOccurrenceExpandResponse),
        http.get(caseEntityApi, httpCaseSomaticEntityApi),
      ],
    },
  },
  args: {},
  render: args => (
    <SliderSheet open>
      <SomaticOccurrenceSheetContent {...args} />
    </SliderSheet>
  ),
};
