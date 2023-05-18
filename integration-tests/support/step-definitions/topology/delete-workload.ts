import { When } from 'cypress-cucumber-preprocessor/steps';

import { topologyPO } from '../../page-objects/topology-po';
import { app } from '../../pages/app';
import { topologyActions, topologySidePane } from '../../pages/topology';

When('user clicks on Action menu', () => {
  topologySidePane.clickActionsDropDown();
});

When('user clicks {string} from action menu', (actionItem: string) => {
  app.waitForLoad();
  topologyActions.selectAction(actionItem);
});

When('user clicks on Delete button from modal', () => {
  cy.get(topologyPO.graph.deleteWorkload).click();
});
