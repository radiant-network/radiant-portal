/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_Overview } from 'pom/pages/VariantEntity_Overview';

describe('VariantEntity - Overview - ExternalReferences - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantOverviewPage(data.variantGermline.locus_id);
  };

  it('ClinVar', () => {
    setupTest();
    VariantEntity_Overview.externalReferences.validations.shouldHaveLink('clinvar', data.variantGermline);
  });

  it('gnomAD', () => {
    setupTest();
    VariantEntity_Overview.externalReferences.validations.shouldHaveLink('gnomad', data.variantGermline);
  });

  it('dbSNP', () => {
    setupTest();
    VariantEntity_Overview.externalReferences.validations.shouldHaveLink('dbsnp', data.variantGermline);
  });
});
