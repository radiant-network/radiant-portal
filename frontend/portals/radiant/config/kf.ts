import { SavedFilterType } from '../../../api';
import { RangeOperators } from '../../../components/base/query-builder/type';
import { ApplicationId, FilterTypes, type PortalConfig } from '../../../components/cores/applications-config';

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
    aggregations: {},
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
    name: 'Radiant',
    navigation: {
      dashboard: true,
      variant: true,
      profile: true,
      settings: true,
      logout: true,
    },
  },
} satisfies PortalConfig;
