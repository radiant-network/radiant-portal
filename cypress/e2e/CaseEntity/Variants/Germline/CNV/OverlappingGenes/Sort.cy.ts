/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { OverlappingGenesModal } from 'pom/pages/OverlappingGenesModal';

describe('Case Entity - Variants - Germline - CNV - Overlapping Genes - Sort', () => {
  const setupTest = (dataCNV: { cnv_variant: string; sqon: string } = data.cnvGermline) => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', dataCNV.sqon);
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(dataCNV, 'nb_genes');
    OverlappingGenesModal.validations.shouldModalOpen();
  };

  it('Number', () => {
    setupTest(data.cnvDistinctExons);
    OverlappingGenesModal.validations.shouldSortColumn('nb_exons', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Kilobases', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldSortColumn('length', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Percentage', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldSortColumn('overlapping_cnv_percent', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Multiple', () => {
    setupTest();
    OverlappingGenesModal.actions.sortColumn('nb_exons');
    OverlappingGenesModal.actions.sortColumn('length');
    OverlappingGenesModal.actions.sortColumn('length');
    OverlappingGenesModal.validations.shouldHaveFirstRowValue('57.4 kb', 'length');
  });
});
