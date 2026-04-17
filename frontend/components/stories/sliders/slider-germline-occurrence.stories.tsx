import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { http } from 'msw';
import { mocked } from 'storybook/test';

import GermlineOccurrenceSheet from '@/apps/case/src/entity/variants/germline-occurrence/sliders/slider-germline-occurrence-sheet';
import { FetchOccurrencesListContext } from '@/components/base/occurrence/hooks/use-occurrences-list';
import { Button } from '@/components/base/shadcn/button';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import { caseEntityApi, httpCaseEntityApi } from '../api/api-case';
import { httpOccurrenceExpandResponse, occurrenceExpandApi } from '../api/api-occurrence';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  admin: {
    admin_code: 'admin',
    app_id: ApplicationId.admin,
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
    saved_filter_type: 'somatic_snv_occurrence',
    aggregations: {},
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const meta = {
  title: 'Sliders/Occurrences/Germline',
  component: GermlineOccurrenceSheet,
  beforeEach: async () => {
    mocked(useCaseIdFromParam).mockReturnValue(1);
    mocked(useSeqIdFromSearchParam).mockReturnValue(1);
  },
  args: {
    occurrence: {
      seq_id: 1,
      task_id: 1,
      chromosome: '1',
      start: 192392792,
      locus_id: '-1111111111111111111',
      locus: '1-192392792-C-G',
      genotype_quality: 99,
      zygosity: 'HET',
      germline_pf_wgs: 0.07142857142857142,
      gnomad_v3_af: 0.00813917,
      hgvsg: 'chr1:g.192392792C>G',
      ad_ratio: 0.5714286,
      variant_class: 'SNV',
      vep_impact: 'HIGH',
      is_mane_select: false,
      is_mane_plus: false,
      is_canonical: false,
      rsnumber: 'rs72732972',
      picked_consequences: ['splice_donor_variant', 'non_coding_transcript_variant'],
      transcript_id: 'ENST00000643151',
      max_impact_score: 4,
      has_interpretation: false,
      has_note: false,
      exomiser_moi: '',
      exomiser_acmg_classification: '',
      exomiser_acmg_evidence: [],
      exomiser_variant_score: 0,
      exomiser_gene_combined_score: 0,
    },
    open: true,
    setOpen: () => {
      console.warn('setOpen');
    },
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
    onInterpretationSaved: () => {
      console.warn('onInterpretationSaved');
    },
    children: <Button>Open</Button>,
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <FetchOccurrencesListContext
            value={{
              mutate: () => {
                console.warn('mutate');
              },
              loading: false,
            }}
          >
            <Story />
          </FetchOccurrencesListContext>
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof GermlineOccurrenceSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(occurrenceExpandApi, httpOccurrenceExpandResponse),
        http.get(caseEntityApi, httpCaseEntityApi),
      ],
    },
  },
  args: {},
  render: args => <GermlineOccurrenceSheet {...args} />,
};
