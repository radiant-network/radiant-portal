import { SavedFilterType } from '../../../../api';
import { RangeOperators } from '../../../../components/base/query-builder/type';
import { ApplicationId, FilterTypes, type PortalConfig } from '../../../../components/cores/applications-config';

const panelAggregation = {
  items: [{ key: 'tenant_gene_panel', translation_key: 'tenant_gene_panel', type: FilterTypes.MULTIPLE }],
};

export const kfConfig = {
  admin: {
    app_id: ApplicationId.admin,
    admin_code: 'admin',
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    saved_filter_type: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
    aggregations: {
      organization: {
        items: [],
      },
      variant: {
        items: [
          { key: 'variant_class', translation_key: 'variant_class', type: FilterTypes.MULTIPLE },
          { key: 'consequence', translation_key: 'consequence', type: FilterTypes.MULTIPLE },
          { key: 'chromosome', translation_key: 'chromosome', type: FilterTypes.MULTIPLE },
          { key: 'zygosity', translation_key: 'zygosity', type: FilterTypes.MULTIPLE },
        ],
      },
      gene: {
        items: [
          { key: 'symbol', translation_key: 'symbol', type: FilterTypes.MULTIPLE },
          {
            key: 'gnomad_pli',
            translation_key: 'gnomad_pli',
            type: FilterTypes.NUMERICAL,
            defaults: { min: 0, max: 100, defaultOperator: RangeOperators.GreaterThan },
          },
          {
            key: 'gnomad_loeuf',
            translation_key: 'gnomad_loeuf',
            type: FilterTypes.NUMERICAL,
            defaults: { min: 0, max: 100, defaultOperator: RangeOperators.LessThan },
          },
        ],
      },
      pathogenicity: {
        items: [
          { key: 'clinvar', translation_key: 'clinvar', type: FilterTypes.MULTIPLE },
          { key: 'vep_impact', translation_key: 'vep_impact', type: FilterTypes.MULTIPLE },
          {
            key: 'cadd_score',
            translation_key: 'cadd_score',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'cadd_phred',
            translation_key: 'cadd_phred',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'dann_score',
            translation_key: 'dann_score',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          { key: 'fathmm_pred', translation_key: 'fathmm_pred', type: FilterTypes.MULTIPLE },
          { key: 'lrt_pred', translation_key: 'lrt_pred', type: FilterTypes.MULTIPLE },
          { key: 'polyphen2_hvar_pred', translation_key: 'polyphen2_hvar_pred', type: FilterTypes.MULTIPLE },
          {
            key: 'revel_score',
            translation_key: 'revel_score',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'spliceai_ds',
            translation_key: 'spliceai_ds',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          { key: 'sift_pred', translation_key: 'sift_pred', type: FilterTypes.MULTIPLE },
        ],
      },
      frequency: {
        items: [
          {
            key: 'germline_pf_wgs',
            translation_key: 'germline_pf_wgs',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'gnomad_v3_af',
            translation_key: 'gnomad_v3_af',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
        ],
      },
      occurrence: {
        items: [],
      },
    },
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
    saved_filter_type: SavedFilterType.GERMLINE_CNV_OCCURRENCE,
    aggregations: {
      panel: panelAggregation,
      variant: {
        items: [
          { key: 'type', translation_key: 'type', type: FilterTypes.MULTIPLE, withDictionary: true },
          {
            key: 'cn',
            translation_key: 'cn',
            type: FilterTypes.NUMERICAL,
            defaults: { min: 0, max: 100, defaultOperator: RangeOperators.GreaterThan },
          },
          {
            key: 'length',
            translation_key: 'cnv_length',
            type: FilterTypes.NUMERICAL,
            defaults: { min: 0, max: 100, defaultOperator: RangeOperators.GreaterThan },
          },
          { key: 'chromosome', translation_key: 'chromosome', type: FilterTypes.MULTIPLE, withDictionary: true },
          {
            key: 'start',
            translation_key: 'cnv_start',
            type: FilterTypes.NUMERICAL,
            defaults: { min: 0, max: 100, defaultOperator: RangeOperators.Between },
          },
          {
            key: 'end',
            translation_key: 'cnv_end',
            type: FilterTypes.NUMERICAL,
            defaults: { min: 0, max: 100, defaultOperator: RangeOperators.LessThan },
          },
          {
            key: 'nb_snv',
            translation_key: 'nb_snv',
            type: FilterTypes.NUMERICAL,
            defaults: { min: 0, max: 100, defaultOperator: RangeOperators.GreaterThan },
          },
        ],
      },
      gene: {
        items: [
          { key: 'search_by_symbol', translation_key: 'search_by_symbol', type: FilterTypes.SEARCH_BY },
          { key: 'upload_list_symbol', translation_key: 'upload_list_symbol', type: FilterTypes.UPLOAD_LIST },
          { key: 'cytoband', translation_key: 'cytoband', type: FilterTypes.MULTIPLE },
          { key: 'gene_divider', translation_key: 'gene_divider', type: FilterTypes.DIVIDER },
          { key: 'hpo_gene_panel', translation_key: 'hpo_gene_panel', type: FilterTypes.MULTIPLE },
          { key: 'orphanet_gene_panel', translation_key: 'orphanet_gene_panel', type: FilterTypes.MULTIPLE },
          { key: 'omim_gene_panel', translation_key: 'omim_gene_panel', type: FilterTypes.MULTIPLE },
          { key: 'ddd_gene_panel', translation_key: 'ddd_gene_panel', type: FilterTypes.MULTIPLE },
          { key: 'cosmic_gene_panel', translation_key: 'cosmic_gene_panel', type: FilterTypes.MULTIPLE },
        ],
      },
      frequency: {
        items: [
          {
            key: 'frequency_divider_pulic_cohorts',
            translation_key: 'frequency_divider_pulic_cohorts',
            type: FilterTypes.DIVIDER,
          },
          {
            key: 'gnomad_sf',
            translation_key: 'gnomad_sf',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'gnomad_sc',
            translation_key: 'gnomad_sc',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
        ],
      },
      metric_qc: {
        items: [
          { key: 'filter', translation_key: 'filter', type: FilterTypes.MULTIPLE },
          {
            key: 'quality',
            translation_key: 'cnv_quality',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.GreaterThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'pe',
            translation_key: 'pe',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
          {
            key: 'sm',
            translation_key: 'sm',
            type: FilterTypes.NUMERICAL,
            defaults: {
              min: 0,
              max: 100,
              defaultOperator: RangeOperators.LessThan,
              defaultMin: 0,
              defaultMax: 100,
            },
          },
        ],
      },
    },
  },
  somatic_snv_to_occurrence: {
    app_id: ApplicationId.somatic_snv_to_occurrence,
    saved_filter_type: SavedFilterType.SOMATIC_SNV_OCCURRENCE,
    aggregations: {},
  },
  somatic_snv_tn_occurrence: {
    app_id: ApplicationId.somatic_snv_tn_occurrence,
    aggregations: {},
    saved_filter_type: SavedFilterType.SOMATIC_SNV_OCCURRENCE,
  },
  somatic_cnv_to_occurrence: {
    app_id: ApplicationId.somatic_cnv_to_occurrence,
    aggregations: {},
    saved_filter_type: SavedFilterType.SOMATIC_CNV_OCCURRENCE,
  },
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  portal: {
    name: 'Kids First',
    navigation: {
      dashboard: true,
      variant: true,
      profile: true,
      settings: true,
      logout: true,
    },
  },
} satisfies PortalConfig;
