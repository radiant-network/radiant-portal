import { createColumnHelper } from '@tanstack/react-table';

import { Term, VepImpact } from '@/api/api';
import InterpretationCell from '@/apps/case-entity/src/components/variants/occurrence-table/cells/interpretation-cell';
import CaseActionsMenuCell from '@/apps/case-exploration/src/feature/cells/case-actions-menu-cell';
import { AssayStatus } from '@/components/base/badges/assay-status-badge';
import AffectedStatusCell from '@/components/base/data-table/cells/affected-status-cell';
import AnalysisTypeCodeCell, {
  AnalysisTypeCodeCellTooltip,
} from '@/components/base/data-table/cells/analysis-type-code-cell';
import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import AssayStatusCell from '@/components/base/data-table/cells/assay-status-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import BadgeListCell from '@/components/base/data-table/cells/badge-list-cell';
import ClassificationCell from '@/components/base/data-table/cells/classification-cell';
import ConditionCell from '@/components/base/data-table/cells/condition-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import DialogListCell from '@/components/base/data-table/cells/dialog-list-cell';
import DocumentSizeCell from '@/components/base/data-table/cells/document-size-cell';
import GeneCell from '@/components/base/data-table/cells/gene-cell';
import GnomadCell from '@/components/base/data-table/cells/gnomad-cell';
import ManeCell from '@/components/base/data-table/cells/mane-cell';
import MostDeleteriousConsequenceCell from '@/components/base/data-table/cells/most-deleterious-consequence-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import OmimCell from '@/components/base/data-table/cells/omim-cell';
import ParticipantFrequencyCell from '@/components/base/data-table/cells/participant-frequency-cell';
import PhenotypeConditionLinkCell from '@/components/base/data-table/cells/phenotype-condition-link-cell';
import PinRowCell from '@/components/base/data-table/cells/pin-row-cell';
import PriorityIndicatorCell from '@/components/base/data-table/cells/priority-indicator-cell';
import RatingCell from '@/components/base/data-table/cells/rating-cell';
import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import RowSelectionCell from '@/components/base/data-table/cells/row-selection-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import ZygosityCell from '@/components/base/data-table/cells/zygosity-cell';
import { createColumnSettings } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import AnchorLink from '@/components/base/navigation/anchor-link';

const observed_phenotypes = [
  {
    id: 'HP:0001680',
    name: 'Coarctation of aorta',
  },
  {
    id: 'HP:0000028',
    name: 'Cryptorchidism',
  },
  {
    id: 'HP:0001998',
    name: 'Neonatal hypoglycemia',
  },
  {
    id: 'HP:0002197',
    name: 'Generalized-onset seizure',
  },
  {
    id: 'HP:0010519',
    name: 'Increased fetal movement',
  },
  {
    id: 'HP:0001631',
    name: 'Atrial septal defect',
  },
  {
    id: 'HP:0002575',
    name: 'Tracheoesophageal fistula',
  },
  {
    id: 'HP:0001787',
    name: 'Abnormal delivery',
  },
  {
    id: 'HP:0000062',
    name: 'Ambiguous genitalia',
  },
  {
    id: 'HP:0001518',
    name: 'Small for gestational age',
  },
  {
    id: 'HP:0001562',
    name: 'Oligohydramnios',
  },
  {
    id: 'HP:0030244',
    name: 'Maternal fever in pregnancy',
  },
  {
    id: 'HP:0001558',
    name: 'Decreased fetal movement',
  },
  {
    id: 'HP:0000953',
    name: 'Hyperpigmentation of the skin',
  },
  {
    id: 'HP:0003517',
    name: 'Birth length greater than 97th percentile',
  },
];

// Settings
export const defaultColumnSettings = createColumnSettings([]);

/**
 * Base cell
 */
export type BaseCellMockData = {
  baseText?: string;
  link?: string;
  assay_status_code?: AssayStatus;
  badge?: string;
  badge_list?: string[];
  date?: string;
  phenotype_condition?: string;
  phenotype_condition_name?: string;
  text?: string;
  tooltips?: string;
  number_value?: number;
  clinvar?: string[];
  rsnumber?: string;
  symbol?: string;
  gnomad_v3_af?: number;
  is_canonical?: boolean;
  is_mane_plus?: boolean;
  is_mane_select?: boolean;
  vep_impact?: VepImpact;
  aa_change?: string;
  picked_consequences?: string[];
  omim_inheritance_code?: string[];
  pf_wgs?: number;
  locus_id?: string;
  zygosity?: string;
  priority_code?: 'asap' | 'routine' | 'stat' | 'urgent' | undefined;
  case_type?: 'somatic' | 'germline' | 'germline_family';
  sample_id: number;
  relationship_to_proband?: string;
  review_status_stars?: number;
  review_status?: string;
  affected_status: 'affected' | 'non_affected' | 'unknown' | undefined;
  condition_id?: string;
  condition_name?: string;
  observed_phenotypes?: {
    id: string;
    name: string;
  }[];
  size?: number;
};

const baseCellColumnHelper = createColumnHelper<BaseCellMockData>();

/*
 * First set of cell components
 *   - PinRowCell
 *   - RowExpandCell
 *   - RowSelectionCell
 *   - TextCell
 *   - AnchorLinkCell
 *   - AssayStatusCell
 *   - BadgeCell
 *   - BadgeListCell
 *   - PhenotypeConditionLinkCell
 *   - TextTooltipCell
 *   - NumberCell
 *   - DateCell
 */
export const firstSetCellColumns = [
  {
    id: 'pinRow',
    cell: PinRowCell,
    header: 'PinRowCell',
    size: 52,
    enableResizing: false,
    enablePinning: false,
  },
  {
    id: 'expand',
    cell: RowExpandCell,
    header: 'RowExpandCell',
    size: 52,
    enableResizing: false,
    enablePinning: false,
  },
  {
    id: 'selection',
    cell: RowSelectionCell,
    header: 'RowSelectionCell',
    size: 52,
    enableResizing: false,
    enablePinning: false,
  },
  baseCellColumnHelper.accessor(row => row.baseText, {
    id: 'baseText',
    cell: info => <TextCell>{info.getValue()}</TextCell>,
    header: 'TextCell',
  }),
  baseCellColumnHelper.accessor(row => row.link, {
    id: 'link',
    cell: info => <AnchorLinkCell>{info.getValue()}</AnchorLinkCell>,
    header: 'AnchorLinkCell',
  }),
  baseCellColumnHelper.accessor(row => row.assay_status_code, {
    id: 'assay_status_code',
    cell: info => <AssayStatusCell status={info.getValue()} />,
    header: 'AssayStatusCell',
  }),
  baseCellColumnHelper.accessor(row => row.badge, {
    id: 'badge',
    cell: info => (
      <BadgeCell variant="secondary" tooltip="A tooltips for badge cell">
        {info.getValue()}
      </BadgeCell>
    ),
    header: 'BadgeCell',
  }),
  baseCellColumnHelper.accessor(row => row.badge_list, {
    id: 'badge_list',
    cell: info => <BadgeListCell variant="secondary" badges={info.getValue()} />,
    header: 'BadgeListCell',
  }),
  baseCellColumnHelper.accessor(row => row.phenotype_condition, {
    id: 'phenotype_condition',
    cell: info => (
      <PhenotypeConditionLinkCell code={info.getValue()} name={info.row.original.phenotype_condition_name} />
    ),
    header: 'PhenotypeConditionLinkCell',
    size: 200,
  }),
  baseCellColumnHelper.accessor(row => row.text, {
    id: 'text',
    cell: info => <TextTooltipCell tooltipText={info.row.original.tooltips}>{info.getValue()}</TextTooltipCell>,
    header: 'TextTooltipCell',
  }),
  baseCellColumnHelper.accessor(row => row.number_value, {
    id: 'number_value',
    cell: info => <NumberCell value={info.getValue()} fractionDigits={4} />,
    header: 'NumberCell',
    minSize: 100,
  }),
  baseCellColumnHelper.accessor(row => row.date, {
    id: 'date',
    cell: info => <DateCell date={info.getValue()} />,
    header: 'DateCell',
  }),
];

export const firstSetCellData = [
  {
    link: 'AnchorLinkCell 1',
    assay_status_code: 'unknown',
    badge: 'loremp',
    badge_list: ['loremp', 'ipsum'],
    date: '2022-02-12T13:08:00Z',
    phenotype_condition: 'code',
    phenotype_condition_name: 'Condition Name',
    baseText: 'text 1',
    text: 'no tooltips',
    tooltips: undefined,
    number_value: 101,
  },
  {
    link: 'AnchorLinkCell 2',
    assay_status_code: 'draft',
    badge: 'loremp',
    badge_list: ['loremp', 'ipsum'],
    date: '2022-02-12T13:08:00Z',
    phenotype_condition: 'code',
    phenotype_condition_name: 'Condition Name',
    baseText: 'text 2',
    text: 'no tooltips',
    tooltips: undefined,
    number_value: 100,
  },
  {
    link: 'AnchorLinkCell 3',
    assay_status_code: 'submitted',
    badge: 'ipsum',
    badge_list: ['loremp'],
    date: '2021-01-10T13:08:00Z',
    phenotype_condition: 'code',
    phenotype_condition_name: 'Condition Name',
    text: 'Tooltips',
    tooltips: 'This is a tooltips',
    number_value: 1,
  },
  {
    link: 'AnchorLinkCell 4',
    assay_status_code: 'in_progress',
    badge: 'amet',
    baseText: 'text 3',
    badge_list: ['sit', 'amet', 'consectetur'],
    date: '2001-05-12T13:08:00Z',
    phenotype_condition: 'code',
    phenotype_condition_name: 'Condition Name',
    text: 'Tooltips',
    tooltips: 'This is a tooltips',
    number_value: 0.1,
  },
  {
    link: 'AnchorLinkCell 5',
    baseText: 'text 4',
    assay_status_code: 'revoke',
    badge: 'consectetur',
    badge_list: ['ipsum', 'sit', 'ipsum', 'volutpat'],
    date: '2025-05-22T13:08:00Z',
    phenotype_condition: 'code',
    phenotype_condition_name: 'Condition Name',
    text: 'Tooltips',
    tooltips: 'This is a tooltips',
    number_value: 0.5,
  },
  {
    link: 'AnchorLinkCell 6',
    assay_status_code: 'completed',
    badge: 'loremp ipsum',
    badge_list: ['ipsum', 'sit', 'volutpat'],
    date: '2021-12-16T13:08:00Z',
    phenotype_condition: 'code',
    phenotype_condition_name: 'Condition Name',
    text: 'Tooltips',
    tooltips: 'This is a tooltips',
    number_value: 0.95,
  },
  {
    link: 'AnchorLinkCell 7',
    assay_status_code: 'incomplete',
    badge: 'consectetur',
    badge_list: ['loremp'],
    date: '2023-09-12T13:08:00Z',
    phenotype_condition: 'code',
    phenotype_condition_name: 'Condition Name',
    text: 'Tooltips',
    tooltips: 'This is a tooltips',
    number_value: 0.005,
  },
  {
    link: undefined,
    assay_status_code: undefined,
    baseText: undefined,
    badge: undefined,
    badge_list: undefined,
    date: undefined,
    phenotype_condition: undefined,
    phenotype_condition_name: undefined,
    text: undefined,
    tooltips: undefined,
    number_value: undefined,
  },
];

/*
 * Second set of cell components
 *   - ClassificationCell
 *   - AnchorLinkCell (rsnumber example)
 *   - GeneCell
 *   - GnomadCell
 *   - ManeCell
 *   - MostDeleteriousConsequenceCell
 *   - OmimCell
 *   - ParticipantFrequencyCell
 *   - ZygosityCell
 */
export const secondSetCellColumns = [
  baseCellColumnHelper.accessor(row => row.clinvar, {
    id: 'clinvar',
    cell: info => <ClassificationCell codes={info.getValue()} />,
    header: 'ClassificationCell',
  }),
  baseCellColumnHelper.accessor(row => row.rsnumber, {
    id: 'rsnumber',
    cell: info => (
      <AnchorLinkCell
        href={info.getValue() ? `https://www.ncbi.nlm.nih.gov/snp/${info.getValue()}` : undefined}
        target="_blank"
        external
      />
    ),
    header: 'AnchorLinkCell(rsnumber)',
  }),
  baseCellColumnHelper.accessor(row => row.symbol, {
    id: 'symbol',
    cell: info => <GeneCell symbol={info.getValue()} />,
    header: 'GeneCell',
  }),
  baseCellColumnHelper.accessor(row => row.gnomad_v3_af, {
    id: 'gnomad_v3_af',
    cell: info => <GnomadCell value={info.getValue()} />,
    header: 'GnomadCell',
  }),
  baseCellColumnHelper.accessor(row => row, {
    id: 'mane-cell',
    cell: info => (
      <ManeCell
        isManePlus={info.getValue().is_mane_plus}
        isManeSelect={info.getValue().is_mane_select}
        isCanonical={info.getValue().is_canonical}
      />
    ),
    header: 'ManeCell',
  }),
  baseCellColumnHelper.accessor(row => row, {
    id: 'picked_consequences',
    cell: info => (
      <MostDeleteriousConsequenceCell
        vepImpact={info.getValue().vep_impact}
        consequences={info.getValue().picked_consequences}
        aaChange={info.getValue().aa_change}
      />
    ),
    header: 'MostDeleteriousConsequenceCell',
    size: 225,
    minSize: 160,
  }),
  baseCellColumnHelper.accessor(row => row.omim_inheritance_code, {
    id: 'omim_inheritance_code',
    cell: info => <OmimCell codes={info.getValue()} />,
    header: 'OmimCell',
    minSize: 120,
    enableSorting: false,
  }),
  baseCellColumnHelper.accessor(row => row.pf_wgs, {
    id: 'pf_wgs',
    cell: info => <ParticipantFrequencyCell locusId={info.row.original.locus_id} value={info.getValue()} />,
    header: 'ParticipantFrequencyCell',
    minSize: 120,
  }),
  baseCellColumnHelper.accessor(row => row.zygosity, {
    id: 'zygosity',
    cell: info => <ZygosityCell value={info.getValue()} />,
    header: 'ZygosityCell',
    minSize: 120,
    enableSorting: false,
  }),
];

export const secondSetCellData = [
  {
    clinvar: ['other', 'association_not_found', 'uncertain_significance'],
    rsnumber: '123',
    symbol: 'PCDHB8',
    gnomad_v3_af: 100,
    is_mane_plus: true,
    aa_change: 'p.Val234GlyfsTer4',
    picked_consequences: ['frameshift_variant'],
    vep_impact: 'HIGH',
    omim_inheritance_code: ['AD', 'AR', 'DD', 'DR'],
    pf_wgs: 0.5,
    locus_id: '-7485572602358923261',
    zygosity: 'HEM',
  },
  {
    clinvar: ['likely_benign', 'likely_pathogenic', '_low_penetrance', 'low_penetrance'],
    rsnumber: '12312312',
    symbol: 'HLA-B',
    gnomad_v3_af: 1,
    is_canonical: true,
    aa_change: 'p.Val234GlyfsTer4',
    picked_consequences: ['frameshift_variant'],
    vep_impact: 'MODERATE',
    omim_inheritance_code: ['IC', 'Mi', 'Mu', 'NA'],
    pf_wgs: 0.1,
    locus_id: '-7485572602358923261',
    zygosity: 'HET',
  },
  {
    clinvar: ['risk_factor', 'association', 'uncertain_risk_allele', 'pathogenic'],
    rsnumber: '89978213',
    symbol: 'PLXNA1',
    gnomad_v3_af: 0.2,
    is_mane_select: true,
    aa_change: 'p.Val234GlyfsTer4',
    picked_consequences: ['frameshift_variant'],
    vep_impact: 'LOW',
    omim_inheritance_code: ['NRT', 'SMo', 'Smu', 'XL'],
    pf_wgs: 100,
    locus_id: '-7485572602358923261',
    zygosity: 'HET',
  },
  {
    clinvar: [
      'pathogenic',
      'protective',
      'conflicting_classifications_of_pathogenicity',
      'conflicting_interpretations_of_pathogenicity',
    ],
    rsnumber: '123123129',
    symbol: 'USF1',
    gnomad_v3_af: 0.1,
    is_mane_plus: true,
    is_canonical: true,
    is_mane_select: true,
    aa_change: undefined,
    picked_consequences: ['intron_variant'],
    vep_impact: 'MODIFIER',
    omim_inheritance_code: ['XLD', 'XLR', 'YL'],
    pf_wgs: 0.0001,
    locus_id: '-7485572602358923261',
    zygosity: 'HEM',
  },
  {
    clinvar: [
      'conflicting_interpretations_of_pathogenicity',
      'not_provided',
      'established_risk_allele',
      'likely_risk_allele',
    ],
    rsnumber: '2',
    symbol: 'NEGR1',
    gnomad_v3_af: 0.01,
    is_mane_plus: true,
    is_mane_select: true,
    aa_change: 'p.Val234GlyfsTer4',
    picked_consequences: ['frameshift_variant'],
    vep_impact: 'MODIFIER',
    omim_inheritance_code: ['NRT', 'SMo'],
    pf_wgs: 0.01,
    locus_id: '-7485572602358923261',
    zygosity: 'HEM',
  },
  {
    clinvar: ['likely_risk_allele', 'drug_response', 'benign', 'confers_sensitivity', ''],
    rsnumber: '1',
    symbol: 'DCAF15',
    gnomad_v3_af: 0.001,
    is_mane_plus: true,
    is_canonical: true,
    aa_change: 'p.Leu119ProfsTer19',
    picked_consequences: ['uncertain_significance'],
    vep_impact: 'HIGH',
    omim_inheritance_code: ['null'],
    pf_wgs: 0.1,
    locus_id: '-7485572602358923261',
    zygosity: 'HEM',
  },
  {
    clinvar: ['', null],
    rsnumber: '1',
    symbol: 'DCAF15',
    gnomad_v3_af: 0.001,
    is_mane_plus: true,
    is_canonical: true,
    aa_change: 'p.Leu119ProfsTer19',
    picked_consequences: ['uncertain_significance'],
    vep_impact: 'HIGH',
    omim_inheritance_code: ['null'],
    pf_wgs: 0.1,
    locus_id: '-7485572602358923261',
    zygosity: 'HEM',
  },
  {
    clinvar: undefined,
    rsnumber: undefined,
    symbol: undefined,
    gnomad_v3_af: undefined,
    is_mane_plus: undefined,
    is_canonical: undefined,
    is_mane_select: undefined,
    aa_change: undefined,
    picked_consequences: undefined,
    vep_impact: undefined,
    omim_inheritance_code: undefined,
    pf_wgs: undefined,
    locus_id: undefined,
    zygosity: undefined,
  },
];

/**
 * Third set of cell components
 *   - PriorityIndicatorCell
 *   - AnalysisTypeCodeCell (AnalysisTypeCodeCellTooltip)
 *   - RelationshipToProbandCell
 *   - RatingCell
 *   - DocumentSizeCell
 */
export const thirdSetCellColumns = [
  baseCellColumnHelper.accessor(row => row.priority_code, {
    id: 'priority_code',
    cell: info => <PriorityIndicatorCell code={info.getValue()} />,
    header: 'PriorityIndicatorCell',
    size: 124,
    minSize: 124,
  }),
  baseCellColumnHelper.accessor(row => row.case_type, {
    id: 'case_type',
    cell: info => <AnalysisTypeCodeCell code={info.getValue()} />,
    header: () => <TooltipHeader tooltip={<AnalysisTypeCodeCellTooltip />}>AnalysisTypeCodeCell</TooltipHeader>,
    size: 120,
    minSize: 120,
    enableSorting: false,
  }),
  baseCellColumnHelper.accessor(row => row.sample_id, {
    id: 'sample_id',
    cell: info => (
      <RelationshipToProbandCell relationship={info.row.original.relationship_to_proband}>
        <>{info.getValue()}</>
      </RelationshipToProbandCell>
    ),
    header: () => (
      <TooltipHeader tooltip={"In this case, sample_id is used as children. It's optional"}>
        RelationshipProbandCell
      </TooltipHeader>
    ),
  }),
  baseCellColumnHelper.accessor(row => row.review_status_stars, {
    id: 'review_status_stars',
    cell: info => <RatingCell rating={info.getValue()} tooltip={info.row.original.review_status} />,
    header: 'RatingCell',
    minSize: 60,
    maxSize: 150,
    size: 120,
  }),
  baseCellColumnHelper.accessor(row => row.affected_status, {
    id: 'affected_status',
    cell: info => <AffectedStatusCell status={info.getValue()} />,
    header: 'AffectedStatusCell',
    minSize: 60,
    maxSize: 150,
    size: 120,
  }),
  baseCellColumnHelper.accessor(row => row.condition_name, {
    id: 'condition_name',
    cell: info => <ConditionCell conditionId={info.row.original.condition_id} conditionName={info.getValue()} />,
    header: 'ConditionCell',
    minSize: 60,
    maxSize: 150,
    size: 120,
  }),
  baseCellColumnHelper.accessor(row => row.observed_phenotypes, {
    id: 'observed_phenotypes',
    cell: info => {
      const items = ((info.getValue() as Term[]) ?? []).sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
      });

      return (
        <DialogListCell
          header={'test'}
          items={items}
          renderItem={item => (
            <AnchorLink
              href={`https://purl.obolibrary.org/obo/${item.id?.replace(':', '_')}`}
              size="xs"
              variant="secondary"
              target="_blank"
            >
              {item.name} <span className="font-mono text-xs text-muted-foreground">({item.id})</span>
            </AnchorLink>
          )}
          visibleCount={2}
        />
      );
    },
    header: 'DialogListCell',
    minSize: 60,
    maxSize: 150,
    size: 120,
  }),
  baseCellColumnHelper.accessor(row => row.size, {
    id: 'size',
    cell: info => <DocumentSizeCell value={info.getValue()} />,
    header: 'DocumentSizeCell',
    size: 124,
    minSize: 124,
  }),
];

export const thirdSetCellData = [
  {
    relationship_to_proband: 'proband',
    priority_code: 'asap',
    case_type: 'somatic',
    review_status_stars: 1,
    review_status: 'review status 1 stars',
    affected_status: 'affected',
    condition_id: 'HP:12345',
    condition_name: 'Abnormal Delivery',
    observed_phenotypes,
    size: 8,
  },
  {
    priority_code: 'routine',
    case_type: 'germline',
    sample_id: 2,
    relationship_to_proband: 'mother',
    review_status_stars: 2,
    review_status: 'review status 2 stars',
    affected_status: 'affected',
    condition_id: 'HP:32345',
    condition_name: 'Abnormal Delivery',
    observed_phenotypes: observed_phenotypes.slice(0, 5),
    size: 12345,
  },
  {
    priority_code: 'stat',
    case_type: 'germline_family',
    sample_id: 3,
    relationship_to_proband: 'father',
    review_status_stars: 3,
    review_status: 'review status 3 stars',
    affected_status: 'non_affected',
    condition_id: 'HP:32345',
    condition_name: 'Abnormal Delivery',
    observed_phenotypes: observed_phenotypes.slice(0, 2),
    size: 25000000,
  },
  {
    priority_code: 'urgent',
    case_type: 'germline_family',
    sample_id: 4,
    relationship_to_proband: 'sister',
    review_status_stars: 4,
    review_status: 'review status 4 stars',
    affected_status: 'unknown',
    condition_id: 'HP:32345',
    condition_name: 'Abnormal Delivery',
    observed_phenotypes: observed_phenotypes.slice(0, 1),
    size: 5678000000,
  },
  {
    priority_code: 'urgent',
    case_type: 'germline_family',
    sample_id: undefined,
    relationship_to_proband: 'brother',
    review_status_stars: 4,
    review_status: 'review status 4 stars',
    affected_status: 'unknown',
    condition_id: 'HP:32345',
    condition_name: 'Abnormal Delivery',
    observed_phenotypes: observed_phenotypes.slice(0, 1),
    size: 9000000000000,
  },
  {
    priority_code: 'stat',
    case_type: 'germline_family',
    sample_id: undefined,
    relationship_to_proband: 'sibling',
    review_status_stars: 4,
    review_status: 'review status 4 stars',
    affected_status: 'unknown',
    condition_id: 'HP:32345',
    condition_name: 'Abnormal Delivery',
    observed_phenotypes: observed_phenotypes.slice(0, 1),
    size: 90000000000000,
  },
  {
    priority_code: undefined,
    case_type: undefined,
    sample_id: undefined,
    relationship_to_proband: undefined,
    review_status_stars: undefined,
    review_status: undefined,
    condition_id: undefined,
    condition_name: undefined,
    observed_phenotypes: undefined,
    size: undefined,
  },
];

/**
 * First set of application cell components
 *   - InterpretationCell (Variant-Entity)
 *   - CaseActionsMenuCell (Case-Exploration)
 */
export const applicationFirstSetCellColumns = [
  baseCellColumnHelper.accessor(row => row, {
    id: 'clinical_interpretation',
    cell: info => <InterpretationCell occurrence={info.getValue()} />,
    header: 'InterpretationCell (Variant-Entity)',
    size: 40,
    enablePinning: false,
    enableResizing: false,
    enableSorting: false,
  }),
  {
    id: 'actions_menu',
    cell: CaseActionsMenuCell,
    header: 'CaseActionsMenuCell (Case-Exploration)',
    size: 64,
    maxSize: 64,
    enableResizing: false,
    enablePinning: false,
  },
];
