/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { CaseEntity_Variants_CNV_Table } from 'pom/pages/CaseEntity_Variants_CNV_Table';

describe('Case Entity - Variants - CNV - Table - Sort', () => {
  const setupTest = () => {
    cy.login();
    cy.visitCaseVariantsPage(data.case.case, 'CNV');
  };

  it('Alphanumeric [SJRA-1168]', () => {
    setupTest();
    CaseEntity_Variants_CNV_Table.validations.shouldSortColumn('cnv_variant', false /*hasUniqueValues*/, false /*isReverseSorting*/);
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
    CaseEntity_Variants_CNV_Table.validations.shouldHaveFirstRowValue('1008.0 kb', 'length');
  });
});
