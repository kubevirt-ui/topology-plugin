import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { devNavigationMenu } from '../../constants/global';
import { topologyPO } from '../../page-objects/topology-po';
import { navigateTo } from '../../pages/app';
import { topologyPage } from '../../pages/topology';

When('user clicks on List view button', () => {
  navigateTo(devNavigationMenu.Topology);
  if (cy.get(topologyPO.graph.emptyGraph)) {
    cy.get(topologyPO.switcher).click();
  } else {
    cy.log('You are already on List View');
  }
});

Then('user will see workloads are segregated by applications groupings', () => {
  cy.get(topologyPO.graph.applicationGroupingTitle).should('be.visible');
});

Then('user will see resource quota alert in {string} list node', (nodeName: string) => {
  topologyPage.verifyListNodeAlert(nodeName);
});
