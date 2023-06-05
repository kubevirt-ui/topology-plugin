import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { switchPerspective } from '../../constants/global';
import { perspective } from '../../pages/app';
import { topologyPage } from '../../pages/topology';

When('user applies cronjob YAML', () => {
  cy.exec(`oc apply -f testData/yamls/create-cronjob.yaml`);
});

Then('user will see cron job with name {string} on topology page', (name: string) => {
  perspective.switchTo(switchPerspective.Developer);
  topologyPage.verifyWorkloadInTopologyPage(`${name}`);
});

When('user applies job YAML', () => {
  cy.exec(`oc apply -f testData/yamls/create-job.yaml`);
});

Then('user will see job with name {string} on topology page', (name: string) => {
  perspective.switchTo(switchPerspective.Developer);
  topologyPage.verifyWorkloadInTopologyPage(`${name}`);
});

When('user applies pod YAML', () => {
  cy.exec(`oc apply -f testData/yamls/create-pod.yaml`);
});

Then('user will see pod with name {string} on topology page', (name: string) => {
  perspective.switchTo(switchPerspective.Developer);
  topologyPage.verifyWorkloadInTopologyPage(`${name}`);
});
