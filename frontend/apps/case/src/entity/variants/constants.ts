export const SELECTED_VARIANT_PARAM = 'selectedVariant';

/** Sub-tabs of the variants tab of a somatic case. */
export enum SomaticVariantInterface {
  SNV_TN = 'SNV_TN',
  SNV_TO = 'SNV_TO',
  CNV_TO = 'CNV_TO',
}

/** The two SNV cohorts sharing the somatic occurrence table. */
export type SomaticSNVCohort = SomaticVariantInterface.SNV_TN | SomaticVariantInterface.SNV_TO;
