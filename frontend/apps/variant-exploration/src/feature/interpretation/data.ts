import { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';

/**
 * Temporary until we have a proper translation system in place
 */
const trans = {
  modal: {
    variant: {
      interpretation: {
        title: 'Clinical Interpretation',
        cancelText: 'Cancel',
        okText: 'Save',
        lastUpdate: "Last update: <span style='font-weight:500;'>{name}</span> ({date, date, long}, {updatedAtTime})",
        header: {
          germline: 'Germline',
          somatic: 'Somatic',
        },
        generic: {
          interpretation: 'Interpretation',
          pubMedPublication: 'PubMed Publication',
          pubMedIdNotFound: 'Invalid or unknown PMID',
          'citation-placeholder': 'Citation',
          addCitation: 'Add a publication',
        },
        germline: {
          condition: 'MONDO condition',
          'condition-placeholder': 'Find a condition',
          classification: 'Classification',
          'classification-options': {
            pathogenic: 'Pathogenic',
            likelyPathogenic: 'Likely Pathogenic',
            'likelyPathogenic-tooltip': 'Probably pathogenic',
            vus: 'VUS',
            'vus-tooltip': 'Variant of Uncertain Significance',
            likelyBenign: 'Likely Benign',
            'likelyBenign-tooltip': 'Probably benign',
            benign: 'Benign',
          },
          classificationCriteria: 'Classification criteria e.g. PM1, PS2',
          'classificationCriteria-placeholder': 'Classification criteria',
          modeOfTransmission: 'Mode of inheritance',
          'modeOfTransmission-placeholder': 'Select',
          'modeOfTransmission-options': {
            autosomal_dominant_de_novo: 'Autosomal Dominant De Novo',
            autosomal_dominant: 'Autosomal Dominant',
            autosomal_recessive: 'Autosomal Recessive',
            x_linked_dominant_de_novo: 'X Linked Dominant De Novo',
            x_linked_recessive_de_novo: 'X Linked Recessive De Novo',
            x_linked_dominant: 'X Linked Dominant',
            x_linked_recessive: 'X Linked Recessive',
            non_carrier_proband: 'Non Carrier Proband',
            unknown_parents_genotype: 'Unknown Parents Genotype',
            unknown_father_genotype: 'Unknown Father Genotype',
            unknown_mother_genotype: 'Unknown Mother Genotype',
            unknown_proband_genotype: 'Unknown Proband Genotype',
          },
        },
        somatic: {
          tumoralType: 'Tumor type',
          'tumoralType-placeholder': 'Select',
          oncogenicity: 'Oncogenicity',
          'oncogenicity-options': {
            oncogenic: 'Oncogenic',
            likelyOncogenic: 'Likely Oncogenic',
            'likelyOncogenic-tooltip': 'Probably oncogenic',
            vus: 'VUS',
            'vus-tooltip': 'Variant of Uncertain Significance',
            likelyBenign: 'Likely Benign',
            'likelyBenign-tooltip': 'Probably benign',
            benign: 'Benign',
          },
          classificationCriteria: 'Classification criteria e.g. PM1, PS2',
          'classificationCriteria-placeholder': 'Classification criteria',
          clinicalUtility: 'Clinical utility',
          'clinicalUtility-placeholder': 'Select',
          'clinicalUtility-options': {
            tier_ia: 'Tier IA',
            tier_ib: 'Tier IB',
            tier_iic: 'Tier IIC',
            tier_iid: 'Tier IID',
            tier_iii: 'Tier III',
          },
          sections: {
            cancer: {
              title: 'Cancer Hotspot',
              hotspot: 'Hotspot',
            },
            annotationsVariant: {
              title: 'Variant annotations',
            },
            annotationsGene: {
              title: 'Gene annotations',
            },
          },
        },
      },
    },
  },
};

const getNestedValue = (path: string): any => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), trans as any);
};

export const getTransmissionModes = (): (MultiSelectorOption & {
  color?: string;
})[] => [
  {
    label: getNestedValue(
      'modal.variant.interpretation.germline.modeOfTransmission-options.autosomal_dominant_de_novo',
    ),
    value: 'autosomal_dominant_de_novo',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.autosomal_dominant'),
    value: 'autosomal_dominant',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.autosomal_recessive'),
    value: 'autosomal_recessive',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.x_linked_dominant_de_novo'),
    value: 'x_linked_dominant_de_novo',
    title: '',
  },
  {
    label: getNestedValue(
      'modal.variant.interpretation.germline.modeOfTransmission-options.x_linked_recessive_de_novo',
    ),
    value: 'x_linked_recessive_de_novo',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.x_linked_dominant'),
    value: 'x_linked_dominant',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.x_linked_recessive'),
    value: 'x_linked_recessive',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.non_carrier_proband'),
    value: 'non_carrier_proband',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.unknown_parents_genotype'),
    value: 'unknown_parents_genotype',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.unknown_father_genotype'),
    value: 'unknown_father_genotype',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.unknown_mother_genotype'),
    value: 'unknown_mother_genotype',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.germline.modeOfTransmission-options.unknown_proband_genotype'),
    value: 'unknown_proband_genotype',
    title: '',
  },
];

export const classificationCriterias: (MultiSelectorOption & {
  color?: string;
})[] = [
  {
    label: 'PVS1',
    value: 'PVS1',
    color: 'red',
    title: '',
  },
  {
    label: 'PS1',
    value: 'PS1',
    color: 'volcano',
    title: '',
  },
  {
    label: 'PS2',
    value: 'PS2',
    color: 'volcano',
    title: '',
  },
  {
    label: 'PS3',
    value: 'PS3',
    color: 'volcano',
    title: '',
  },
  {
    label: 'PS4',
    value: 'PS4',
    color: 'volcano',
    title: '',
  },
  {
    label: 'PM1',
    value: 'PM1',
    color: 'gold',
    title: '',
  },
  {
    label: 'PM2',
    value: 'PM2',
    color: 'gold',
    title: '',
  },
  {
    label: 'PM3',
    value: 'PM3',
    color: 'gold',
    title: '',
  },
  {
    label: 'PM4',
    value: 'PM4',
    color: 'gold',
    title: '',
  },
  {
    label: 'PM5',
    value: 'PM5',
    color: 'gold',
    title: '',
  },
  {
    label: 'PM6',
    value: 'PM6',
    color: 'gold',
    title: '',
  },
  {
    label: 'PP1',
    value: 'PP1',
    color: 'green',
    title: '',
  },
  {
    label: 'PP2',
    value: 'PP2',
    color: 'green',
    title: '',
  },
  {
    label: 'PP3',
    value: 'PP3',
    color: 'green',
    title: '',
  },
  {
    label: 'PP4',
    value: 'PP4',
    color: 'green',
    title: '',
  },
  {
    label: 'PP5',
    value: 'PP5',
    color: 'green',
    title: '',
  },
  {
    label: 'BA1',
    value: 'BA1',
    color: 'geekblue',
    title: '',
  },
  {
    label: 'BS1',
    value: 'BS1',
    color: 'purple',
    title: '',
  },
  {
    label: 'BS2',
    value: 'BS2',
    color: 'purple',
    title: '',
  },
  {
    label: 'BS3',
    value: 'BS3',
    color: 'purple',
    title: '',
  },
  {
    label: 'BS4',
    value: 'BS4',
    color: 'purple',
    title: '',
  },
  {
    label: 'BP1',
    value: 'BP1',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP2',
    value: 'BP2',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP3',
    value: 'BP3',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP4',
    value: 'BP4',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP5',
    value: 'BP5',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP6',
    value: 'BP6',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP7',
    value: 'BP7',
    color: 'blue',
    title: '',
  },
];

export const getClassificationCriteriaColor = (value: string) =>
  classificationCriterias.find(criteria => criteria.value === value)?.color || undefined;

export const oncogenicityClassificationCriterias: (MultiSelectorOption & {
  color?: string;
})[] = [
  {
    label: 'OVS1',
    value: 'OVS1',
    color: 'red',
    title: '',
  },
  {
    label: 'OS1',
    value: 'OS1',
    color: 'volcano',
    title: '',
  },
  {
    label: 'OS2',
    value: 'OS2',
    color: 'volcano',
    title: '',
  },
  {
    label: 'OS3',
    value: 'OS3',
    color: 'volcano',
    title: '',
  },
  {
    label: 'OM1',
    value: 'OM1',
    color: 'blue',
    title: '',
  },
  {
    label: 'OM2',
    value: 'OM2',
    color: 'blue',
    title: '',
  },
  {
    label: 'OM3',
    value: 'OM3',
    color: 'blue',
    title: '',
  },
  {
    label: 'OM4',
    value: 'OM4',
    color: 'blue',
    title: '',
  },
  {
    label: 'OP1',
    value: 'OP1',
    color: 'green',
    title: '',
  },
  {
    label: 'OP2',
    value: 'OP2',
    color: 'green',
    title: '',
  },
  {
    label: 'OP3',
    value: 'OP3',
    color: 'green',
    title: '',
  },
  {
    label: 'OP4',
    value: 'OP4',
    color: 'green',
    title: '',
  },
  {
    label: 'SBVS1',
    value: 'SBVS1',
    color: 'purple',
    title: '',
  },
  {
    label: 'SBS1',
    value: 'SBS1',
    color: 'purple',
    title: '',
  },
  {
    label: 'SBS2',
    value: 'SBS2',
    color: 'purple',
    title: '',
  },
  {
    label: 'SBP1',
    value: 'SBP1',
    color: 'geekblue',
    title: '',
  },
  {
    label: 'SBP2',
    value: 'SBP2',
    color: 'geekblue',
    title: '',
  },
];
export const getOncogenicityClassificationCriteriaColor = (value: string) =>
  oncogenicityClassificationCriterias.find(criteria => criteria.value === value)?.color || undefined;

export const getClinicalUtilitys = (): (MultiSelectorOption & {
  color?: string;
})[] => [
  {
    label: getNestedValue('modal.variant.interpretation.somatic.clinicalUtility-options.tier_ia'),
    value: 'category_ia',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.somatic.clinicalUtility-options.tier_ib'),
    value: 'category_ib',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.somatic.clinicalUtility-options.tier_iic'),
    value: 'category_iic',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.somatic.clinicalUtility-options.tier_iid'),
    value: 'category_iid',
    title: '',
  },
  {
    label: getNestedValue('modal.variant.interpretation.somatic.clinicalUtility-options.tier_iii'),
    value: 'category_iii',
    title: '',
  },
];
