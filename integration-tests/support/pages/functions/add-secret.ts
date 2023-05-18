import { hpaPO } from '../../page-objects/hpa-po';
import { topologyPO } from '../../page-objects/topology-po';
import { app } from '../app';
import { topologySidePane } from '../topology';
import { editDeployment } from '../topology/topology-edit-deployment';

export const addSecret = (
  secretName = 'newSecret 1',
  serverUrl = 'https://quay.io/repository/kubernetes-ingress-controller/nginx-ingress-controller?tag=latest&tab=tags',
  username = 'test1',
  password = 'test',
  email = 'test1@redhat.com',
) => {
  editDeployment.verifyModalTitle();
  editDeployment.addSecretName(secretName);
  editDeployment.addServerAddress(serverUrl);
  editDeployment.enterUsername(username);
  editDeployment.enterPassword(password);
  editDeployment.enterEmail(email);
  editDeployment.saveSecret();
};

export const checkPodsText = (tries = 5) => {
  if (tries < 1) {
    return;
  }
  cy.get('body').then(($body) => {
    if (!$body.find(topologyPO.sidePane.podText).text().includes('1Pod')) {
      cy.reload();
      app.waitForDocumentLoad();
      topologySidePane.selectTab('Details');
      cy.wait(35000);
      checkPodsText(tries - 1);
    } else {
      cy.get(topologyPO.sidePane.podText, { timeout: 120000 }).should('have.text', '1Pod');
    }
  });
};

export const checkPodsCount = (tries = 5) => {
  if (tries < 1) {
    return;
  }
  cy.get('body').then(($body) => {
    if ($body.find(hpaPO.nodeList).length === 0) {
      cy.reload();
      app.waitForDocumentLoad();
      cy.wait(35000);
      checkPodsCount(tries - 1);
    } else {
      cy.log('Found');
    }
  });
};
