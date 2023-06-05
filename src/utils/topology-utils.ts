import GitUrlParse, { GitUrl } from 'git-url-parse';
import i18next from 'i18next';
import get from 'lodash.get';

import { K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Edge, GraphElement, Node } from '@patternfly/react-topology';
import { getName, isEmpty, size } from '@topology-utils/common-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import OdcBaseNode from '../elements/OdcBaseNode';
import { TYPE_OPERATOR_BACKED_SERVICE } from '../operators/components/const';

import { RouteIngress } from './types/commonTypes';
import { RouteKind } from './types/knativeTypes';
import { TopologyDataObject } from './types/topology-types';
import { updateResourceApplication } from './application-utils';
import { createResourceConnection, removeResourceConnection } from './connector-utils';
import { getReferenceForResource } from './k8s-utils';

export const WORKLOAD_TYPES = [
  'deployments',
  'deploymentConfigs',
  'daemonSets',
  'statefulSets',
  'jobs',
  'cronJobs',
  'pods',
];

export type CheDecoratorData = {
  cheURL?: string;
  cheIconURL?: string;
};

export const getCheDecoratorData = (consoleLinks: K8sResourceKind[]): CheDecoratorData => {
  const cheConsoleLink = consoleLinks?.find((link) => getName(link) === 'che');
  return {
    cheURL: cheConsoleLink?.spec?.href,
    cheIconURL: cheConsoleLink?.spec?.applicationMenu?.imageURL,
  };
};

const getFullGitURL = (gitUrl: GitUrl, branch?: string) => {
  const baseUrl = `https://${gitUrl.resource}/${gitUrl.owner}/${gitUrl.name}`;
  if (!branch) {
    return baseUrl;
  }
  if (gitUrl.resource.includes('github')) {
    return `${baseUrl}/tree/${branch}`;
  }
  if (gitUrl.resource.includes('gitlab')) {
    return `${baseUrl}/-/tree/${branch}`;
  }
  // Branch names containing '/' do not work with bitbucket src URLs
  // https://jira.atlassian.com/browse/BCLOUD-9969
  if (gitUrl.resource.includes('bitbucket') && !branch.includes('/')) {
    return `${baseUrl}/src/${branch}`;
  }
  return baseUrl;
};

export const getEditURL = (vcsURI?: string, gitBranch?: string, cheURL?: string) => {
  if (!vcsURI) {
    return null;
  }
  const fullGitURL = getFullGitURL(GitUrlParse(vcsURI), gitBranch);
  return cheURL ? `${cheURL}/f?url=${fullGitURL}&policies.create=peruser` : fullGitURL;
};

export const getNamespaceDashboardKialiLink = (
  consoleLinks: K8sResourceKind[],
  namespace: string,
): string => {
  const kialiLink = consoleLinks?.find((link) => getName(link) === `kiali-namespace-${namespace}`)
    ?.spec?.href;
  return kialiLink || '';
};

/**
 * filter data based on the active application
 */
export const filterBasedOnActiveApplication = (
  data: K8sResourceKind[],
  application: string,
): K8sResourceKind[] => {
  const PART_OF = 'app.kubernetes.io/part-of';
  if (!application) {
    return data;
  }
  return data.filter((dc) => {
    return get(dc, ['metadata', 'labels', PART_OF]) === application;
  });
};

const getRouteHost = (route: RouteKind, onlyAdmitted: boolean): string => {
  let oldestAdmittedIngress: RouteIngress;
  let oldestTransitionTime: string;
  route.status.ingress?.forEach((ingress) => {
    const admittedCondition = ingress.conditions?.find(
      (condition) => condition?.type === 'Admitted' && condition?.status === 'True',
    );
    if (
      admittedCondition &&
      (!oldestTransitionTime || oldestTransitionTime > admittedCondition.lastTransitionTime)
    ) {
      oldestAdmittedIngress = ingress;
      oldestTransitionTime = admittedCondition.lastTransitionTime;
    }
  });

  if (oldestAdmittedIngress) {
    return oldestAdmittedIngress.host;
  }

  return onlyAdmitted ? null : route.spec.host;
};

export const getRouteWebURL = (route: RouteKind): string => {
  const scheme = get(route, 'spec.tls.termination') ? 'https' : 'http';
  let url = `${scheme}://${getRouteHost(route, false)}`;
  if (route.spec.path) {
    url += route.spec.path;
  }
  return url;
};

/**
 * get routes url
 */
export const getRoutesURL = (resource: K8sResourceKind, routes: RouteKind[]): string => {
  if (routes.length > 0 && !isEmpty(routes[0].spec)) {
    return getRouteWebURL(routes[0]);
  }
  return null;
};

export const getTopologyResourceObject = (topologyObject: TopologyDataObject): K8sResourceKind => {
  if (!topologyObject) {
    return null;
  }
  return topologyObject.resource || topologyObject.resources?.obj;
};

export const getResource = <T = K8sResourceKind>(node: GraphElement): T => {
  const resource = (node as OdcBaseNode)?.getResource();
  return (resource as T) || (getTopologyResourceObject(node?.getData()) as T);
};

export const getResourceKind = (node: Node): K8sResourceKindReference => {
  return node instanceof OdcBaseNode
    ? (node as OdcBaseNode).getResourceKind()
    : getReferenceForResource(getTopologyResourceObject(node?.getData()));
};

export const updateTopologyResourceApplication = (
  item: Node,
  application: string,
): Promise<any> => {
  const itemData = item?.getData();
  const resource = getResource(item);
  if (!item || !resource || !size(itemData.resources)) {
    return Promise.reject();
  }

  const resources: K8sResourceKind[] = [];
  const updates: Promise<any>[] = [];

  resources.push(resource);

  if (item.getType() === TYPE_OPERATOR_BACKED_SERVICE) {
    itemData.groupResources?.forEach((groupResource) => {
      resources.push(groupResource.resource);
    });
  }

  for (const nextResource of resources) {
    const resourceKind = getK8sModel(nextResource);
    if (!resourceKind) {
      return Promise.reject(
        new Error(
          i18next.t(
            'plugin__topology-plugin~Unable to update application, invalid resource type: {{kind}}',
            {
              kind: nextResource.kind,
            },
          ),
        ),
      );
    }
    updates.push(updateResourceApplication(resourceKind, nextResource, application));
  }

  return Promise.all(updates);
};

export const createTopologyResourceConnection = (
  source: K8sResourceKind,
  target: K8sResourceKind,
  replaceTarget: K8sResourceKind = null,
): Promise<K8sResourceKind[] | K8sResourceKind> => {
  if (!source || !target || source === target) {
    return Promise.reject(
      new Error(
        i18next.t('plugin__topology-plugin~Can not create a connection from a node to itself.'),
      ),
    );
  }

  return createResourceConnection(source, target, replaceTarget);
};

export const removeTopologyResourceConnection = (edge: Edge): Promise<any> => {
  const source = getResource(edge.getSource());
  const target = getResource(edge.getTarget());

  if (!source || !target) {
    return Promise.reject();
  }

  return removeResourceConnection(source, target);
};

export const isOperatorBackedNode = (element: Node | GraphElement): boolean => {
  if (element?.getData()?.resources?.isOperatorBackedService) {
    return true;
  }
  return element?.hasParent() ? isOperatorBackedNode(element.getParent()) : false;
};
