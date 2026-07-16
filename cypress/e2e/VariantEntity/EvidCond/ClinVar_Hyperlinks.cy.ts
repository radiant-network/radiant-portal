/// <reference types="cypress"/>
import 'support/commands';
import { data } from 'pom/shared/Data';
import { VariantEntity_EvidCond } from 'pom/pages/VariantEntity_EvidCond';

describe('VariantEntity - EvidCond - ClinVar - Hyperlinks', () => {
  const setupTest = () => {
    cy.login();
    cy.visitVariantEvidCondPage(data.variantGermline.locus_id);
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('condition');
    VariantEntity_EvidCond.clinvarCard.actions.sortColumn('condition');
  };

  it('RCV Link', () => {
    setupTest();
    VariantEntity_EvidCond.clinvarCard.validations.shouldHaveTableCellLink(data.variantGermline.clinvar_evidence, 'rcv_link');
  });
});
