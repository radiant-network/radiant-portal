/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

// Read-only checks: set the page up once and share it between tests.
describe('VariantEntity - Overview - ExternalReferences - Information displayed', { testIsolation: false }, () => {
  before(() => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  });

  it('ClinVar', () => {
    VariantEntity_Overview.externalReferences.validations.shouldShowField('clinvar', data.variantGermline);
  });

  it('gnomAD', () => {
    VariantEntity_Overview.externalReferences.validations.shouldShowField('gnomad', data.variantGermline);
  });

  it('dbSNP', () => {
    VariantEntity_Overview.externalReferences.validations.shouldShowField('dbsnp', data.variantGermline);
  });
});
