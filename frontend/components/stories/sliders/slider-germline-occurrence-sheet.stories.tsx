import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { http } from 'msw';
import { mocked } from 'storybook/test';

import GermlineOccurrenceSheet from '@/apps/case/src/entity/variants/germline-occurrence/sliders/slider-germline-occurrence-sheet';
import { FetchOccurrencesListContext } from '@/components/base/occurrence/hooks/use-occurrences-list';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import { caseEntityApi, httpCaseGermlineEntityApi } from '../api/api-case';
import { httpGermlineOccurrenceExpandResponse, occurrenceGermlineExpandApi } from '../api/api-occurrence';
import { GermlineSNVOccurrence } from '@/api/api';
import { httpInterpretationGermlineOccurrenceResponse, interpretationsGermlineApi } from '../api/api-interpretations';

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

const occurrenceMock = {
  seq_id: 1,
  task_id: 63,
  chromosome: '5',
  start: 141178734,
  locus_id: '-7744322778257424381',
  locus: '5-141178734-GTC-G',
  genotype_quality: 45,
  zygosity: 'HOM',
  germline_pf_wgs: 0.35714285714285715,
  gnomad_v3_af: 0.104119,
  hgvsg: 'chr5:g.141178735_141178736del',
  ad_ratio: 1,
  variant_class: 'deletion',
  vep_impact: 'HIGH',
  symbol: 'PCDHB8',
  is_mane_select: false,
  is_mane_plus: false,
  is_canonical: true,
  aa_change: 'p.Val234GlyfsTer4',
  rsnumber: 'rs782180361',
  picked_consequences: ['frameshift_variant'],
  transcript_id: 'ENST00000239444',
  max_impact_score: 4,
  has_interpretation: false,
  has_note: true,
  exomiser_moi: 'AR',
  exomiser_acmg_classification: 'uncertain_significance',
  exomiser_acmg_evidence: ['PM2_Supporting'],
  exomiser_variant_score: 1,
  exomiser_gene_combined_score: 0.5,
} as GermlineSNVOccurrence;

const meta = {
  title: 'Sliders/Occurrences/Germline',
  component: GermlineOccurrenceSheet,
  beforeEach: async () => {
    mocked(useCaseIdFromParam).mockReturnValue(1);
    mocked(useSeqIdFromSearchParam).mockReturnValue(1);
  },
  args: {
    occurrence: occurrenceMock,
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
      patient_id: 3,
      relationship_to_proband: 'proband',
      sample_id: 1,
      sample_submitter_id: 'S13224',
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
        http.get(occurrenceGermlineExpandApi, httpGermlineOccurrenceExpandResponse),
        http.get(caseEntityApi, httpCaseGermlineEntityApi),
      ],
    },
  },
  args: {},
  render: args => <GermlineOccurrenceSheet {...args} />,
};

export const Interpretation: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(occurrenceGermlineExpandApi, httpGermlineOccurrenceExpandResponse),
        http.get(caseEntityApi, httpCaseGermlineEntityApi),
        http.get(interpretationsGermlineApi, httpInterpretationGermlineOccurrenceResponse),
      ],
    },
  },
  args: {
    occurrence: { ...occurrenceMock, has_interpretation: true },
  },
  render: args => <GermlineOccurrenceSheet {...args} />,
};

export const RelationshipToProband: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(occurrenceGermlineExpandApi, httpGermlineOccurrenceExpandResponse),
        http.get(caseEntityApi, httpCaseGermlineEntityApi),
      ],
    },
  },
  args: {
    patientSelected: {
      seq_id: 1,
      patient_id: 1,
      relationship_to_proband: 'mother',
      affected_status_code: 'affected',
      sample_id: 1,
      sample_submitter_id: 'S13224',
      sample_type_code: 'dna',
      histology_code: 'normal',
      experimental_strategy_code: 'wgs',
      status_code: 'completed',
      updated_on: '2021-10-12T13:08:00Z',
      has_variants: true,
    },
  },
  render: args => <GermlineOccurrenceSheet {...args} />,
};
