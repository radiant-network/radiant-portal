/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, data.case.seq.seq_id, 'CNV');
  };

  it('Alphanumeric', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldSortColumn('type', false /*hasUniqueValues*/, true /*isReverseSorting*/);
  });

  it('Number', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldSortColumn('nb_snv', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Scientific number', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldSortColumn('gnomad', false /*hasUniqueValues*/, false /*isReverseSorting*/);
  });

  it('Multiple', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.actions.sortColumn('type');
    CaseEntity_Variants_CNV_Table.actions.sortColumn('length');
    CaseEntity_Variants_CNV_Table.actions.sortColumn('length');
    CaseEntity_Variants_CNV_Table.validations.shouldHaveFirstRowValue('1.0 kb', 'length');
  });
});
