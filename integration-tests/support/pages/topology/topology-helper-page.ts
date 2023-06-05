import { topologyPO } from '../../page-objects/topology-po';
import { app } from '../app';

export const topologyHelper = {
  search: (name: string) => cy.get(topologyPO.search).clear().type(name),
  verifyWorkloadInTopologyPage: (appName: string, options?: { timeout: number }) => {
    topologyHelper.search(appName);
    cy.get('body').then(($body) => {
      if (
        $body.find('[data-test-id="topology-switcher-view"][aria-label="Graph view"]').length !== 0
      ) {
        cy.get(topologyPO.list.switcher).click();
        cy.log('user is switching to graph view in topology page');
      } else {
        cy.log('You are on Topology page - Graph view');
      }
    });
    cy.get(topologyPO.graph.reset).click();
    cy.get(topologyPO.graph.fitToScreen).click();
    cy.get(topologyPO.highlightNode, options).should('be.visible');
    app.waitForDocumentLoad();
  },
  verifyWorkloadDeleted: (workloadName: string, options?: { timeout: number }) => {
    topologyHelper.search(workloadName);
    cy.get(topologyPO.highlightNode, options).should('not.exist');
  },
};
