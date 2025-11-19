/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { FilesTable } from 'pom/pages/FilesTable';
import { CaseEntity_Details } from 'pom/pages/CaseEntity_Details';

describe('Files - Hyperlinks [SJRA-853]', () => {
  const setupTest = () => {
    cy.login();
    cy.visitFilesPage(data.file.search_criteria);
    FilesTable.actions.showAllColumns();
  };

  it('Case', () => {
    setupTest();
    FilesTable.actions.clickTableCellLink(data.file, 'case');
    CaseEntity_Details.validations.shouldHaveTitle(data.file);
    CaseEntity_Details.validations.shouldHaveActiveTab();
  });
});
