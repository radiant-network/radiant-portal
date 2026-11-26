/// <reference types="cypress"/>
import 'support/commands';
import { setupOnce } from 'support/setupOnce';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { OverlappingGenesModal } from 'pom/pages/OverlappingGenesModal';

// The tests share one page: each one restores what it changes.
describe('Case Entity - Variants - Germline - CNV - Overlapping Genes - Columns', { testIsolation: false }, () => {
  setupOnce(() => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'nb_genes');
    OverlappingGenesModal.validations.shouldModalOpen();
  });

  it('Default display', () => {
    OverlappingGenesModal.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    OverlappingGenesModal.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    OverlappingGenesModal.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    OverlappingGenesModal.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    OverlappingGenesModal.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    OverlappingGenesModal.validations.shouldShowColumnTooltips();
  });
});
