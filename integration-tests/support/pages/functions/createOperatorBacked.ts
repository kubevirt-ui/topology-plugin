import { detailsPage } from '../../../views/details-page';
import { addOptions } from '../../constants/add';
import { pageTitle } from '../../constants/pageTitle';
import { formPO } from '../../page-objects/devNavigationPO';
import { addPage } from '../add-flow/add-page';
import { catalogPage } from '../add-flow/catalog-page';

export const createOperatorBacked = (operatorName = 'nodejs-ex-git', name = 'test123') => {
  addPage.selectCardFromOptions(addOptions.OperatorBacked);
  detailsPage.titleShouldContain(pageTitle.OperatorBacked);
  catalogPage.isCardsDisplayed();
  catalogPage.search(operatorName);
  catalogPage.verifySelectOperatorBackedCard(operatorName);
  catalogPage.verifyDialog();
  catalogPage.clickButtonOnCatalogPageSidePane();
  catalogPage.verifyCreateOperatorBackedPage(operatorName);
  catalogPage.enterOperatorBackedName(name);
  cy.get('[data-test="create-dynamic-form"]')
    .click()
    .then(() => {
      cy.get('.co-m-loader').should('not.exist');
      cy.get('body').then(($body) => {
        if ($body.find(formPO.errorAlert).length !== 0) {
          cy.get(formPO.errorAlert)
            .find('.co-pre-line')
            .then(($ele) => {
              cy.log($ele.text());
            });
        } else {
          cy.log(`Operator Backed Worload : "${name}" is created`);
        }
      });
    });
};
