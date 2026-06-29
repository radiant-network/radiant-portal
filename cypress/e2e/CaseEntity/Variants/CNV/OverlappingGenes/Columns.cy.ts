/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';
import { OverlappingGenesModal } from 'pom/pages/OverlappingGenesModal';

describe('Case Entity - Variants - CNV - Overlapping Genes - Columns', () => {
  const setupTest = () => {
    cy.login();
    cy.resetTablePreferences();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV', data.cnvGermline.sqon);
    CaseEntity_Variants_CNV_Table.actions.clickTableCellLink(data.cnvGermline, 'nb_genes');
    OverlappingGenesModal.validations.shouldModalOpen();
  };

  it('Default display', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldMatchDefaultColumnVisibility();
  });

  it('Order', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowAllColumns();
  });

  it('Pin', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowPinnableColumns();
  });

  it('Default pin state', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldMatchDefaultPinnedColumns();
  });

  it('Sort', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowSortableColumns();
  });

  it('Tooltip', () => {
    setupTest();
    OverlappingGenesModal.validations.shouldShowColumnTooltips();
  });
});
