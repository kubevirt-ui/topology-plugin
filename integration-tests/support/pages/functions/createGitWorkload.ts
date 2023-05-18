import { addOptions } from '../../constants/add';
import { devNavigationMenu } from '../../constants/global';
import { formPO } from '../../page-objects/devNavigationPO';
import { topologyPO } from '../../page-objects/topology-po';
import { addPage } from '../add-flow/add-page';
import { gitPage } from '../add-flow/git-page';
import { createForm, navigateTo } from '../app';
import { topologyPage } from '../topology/topology-page';

export const createGitWorkload = (
  gitUrl = 'https://github.com/sclorg/nodejs-ex.git',
  componentName = 'nodejs-ex-git',
  resourceType = 'Deployment',
  appName = 'nodejs-ex-git-app',
  isPipelineSelected = false,
) => {
  addPage.selectCardFromOptions(addOptions.ImportFromGit);
  gitPage.enterGitUrl(gitUrl);
  gitPage.verifyValidatedMessage(gitUrl);
  gitPage.enterComponentName(componentName);
  gitPage.selectResource(resourceType);
  gitPage.enterAppName(appName);
  if (isPipelineSelected === true) {
    gitPage.selectAddPipeline();
  }
  createForm.clickCreate().then(() => {
    cy.get('.co-m-loader').should('not.exist');
    cy.get('body').then(($body) => {
      if ($body.find(formPO.errorAlert).length !== 0) {
        cy.get(formPO.errorAlert)
          .find('.co-pre-line')
          .then(($ele) => {
            cy.log($ele.text());
          });
      } else {
        cy.log(`Workload : "${componentName}" is created`);
      }
    });
  });
};

export const createGitWorkloadIfNotExistsOnTopologyPage = (
  gitUrl = 'https://github.com/sclorg/nodejs-ex.git',
  componentName = 'nodejs-ex-git',
  resourceType = 'Deployment',
  appName?: string,
  isPipelineSelected = false,
) => {
  navigateTo(devNavigationMenu.Topology);
  topologyPage.waitForLoad();
  cy.get('body').then(($body) => {
    if ($body.find(topologyPO.emptyStateIcon).length) {
      cy.log(`Topology doesn't have workload "${componentName}", lets create it`);
      navigateTo(devNavigationMenu.Add);
      createGitWorkload(gitUrl, componentName, resourceType, appName);
      topologyPage.verifyWorkloadInTopologyPage(componentName);
    } else {
      topologyPage.search(componentName);
      cy.get('body').then(($node) => {
        if ($node.find(topologyPO.highlightNode).length) {
          cy.log(`knative service: ${componentName} is already created`);
        } else {
          navigateTo(devNavigationMenu.Add);
          createGitWorkload(gitUrl, componentName, resourceType, appName, isPipelineSelected);
          topologyPage.verifyWorkloadInTopologyPage(componentName);
        }
      });
    }
  });
};

export const createGitWorkloadWithResourceLimit = (
  gitUrl = 'https://github.com/sclorg/nodejs-ex.git',
  componentName = 'nodejs-ex-git',
  resourceType = 'Deployment',
  appName = 'nodejs-ex-git-app',
  limitCPU = '100',
  limitMemory = '100',
  isPipelineSelected = false,
) => {
  addPage.selectCardFromOptions(addOptions.ImportFromGit);
  gitPage.enterGitUrl(gitUrl);
  gitPage.verifyValidatedMessage(gitUrl);
  gitPage.enterComponentName(componentName);
  gitPage.selectResource(resourceType);
  gitPage.enterAppName(appName);
  cy.byLegacyTestID('import-git-form').contains('Resource limits').click();
  cy.get(topologyPO.resourceLimits.limitCPU).clear().type(limitCPU);
  cy.get(topologyPO.resourceLimits.limitMemory).clear().type(limitMemory);
  if (isPipelineSelected === true) {
    gitPage.selectAddPipeline();
  }
  createForm.clickCreate().then(() => {
    cy.get('.co-m-loader').should('not.exist');
    cy.get('body').then(($body) => {
      if ($body.find(formPO.errorAlert).length !== 0) {
        cy.get(formPO.errorAlert)
          .find('.co-pre-line')
          .then(($ele) => {
            cy.log($ele.text());
          });
      } else {
        cy.log(`Workload : "${componentName}" is created`);
      }
    });
  });
};

export const createGitWorkloadWithBuilderImage = (
  gitUrl = 'https://github.com/sclorg/nodejs-ex.git',
  componentName = 'nodejs-ex-git',
  resourceType = 'Deployment',
  builderImage = 'nodejs',
  appName = 'nodejs-ex-git-app',
  isPipelineSelected = false,
) => {
  addPage.selectCardFromOptions(addOptions.ImportFromGit);
  gitPage.enterGitUrl(gitUrl);
  gitPage.verifyValidatedMessage(gitUrl);
  cy.get('.odc-import-strategy-section__edit-strategy-button').click();
  cy.byTestID('import-strategy Builder Image').click();
  cy.byTestID(`card ${builderImage}`).click();
  gitPage.enterComponentName(componentName);
  gitPage.selectResource(resourceType);
  gitPage.enterAppName(appName);
  if (isPipelineSelected === true) {
    gitPage.selectAddPipeline();
  }
  createForm.clickCreate().then(() => {
    cy.get('.co-m-loader').should('not.exist');
    cy.get('body').then(($body) => {
      if ($body.find(formPO.errorAlert).length !== 0) {
        cy.get(formPO.errorAlert)
          .find('.co-pre-line')
          .then(($ele) => {
            cy.log($ele.text());
          });
      } else {
        cy.log(`Workload : "${componentName}" is created`);
      }
    });
  });
};
