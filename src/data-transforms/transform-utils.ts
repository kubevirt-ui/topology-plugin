import i18next from 'i18next';
import get from 'lodash.get';

import { HorizontalPodAutoscalerModel } from '@kubevirt-ui/kubevirt-api/console';
import { K8sResourceKindReference, WatchK8sResources } from '@openshift-console/dynamic-plugin-sdk';
import {
  OverviewItem,
  TopologyDataResources,
} from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { EdgeModel, Model, NodeModel, NodeShape } from '@patternfly/react-topology';
import { ConnectsToData, edgesFromAnnotations } from '@topology-utils';
import { WORKLOAD_TYPES } from '@topology-utils';
import { getImageForIconClass } from '@topology-utils/logos';
import { isKnativeServing } from '@topology-utils/resource-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import {
  GROUP_HEIGHT,
  GROUP_PADDING,
  GROUP_WIDTH,
  NODE_HEIGHT,
  NODE_PADDING,
  NODE_WIDTH,
  TYPE_APPLICATION_GROUP,
  TYPE_CONNECTS_TO,
} from '../const';
import {
  apiVersionForReference,
  getReferenceForResource,
  isGroupVersionKind,
  kindForReference,
} from '../utils/k8s-utils';
import {
  TYPE_EVENT_SOURCE,
  TYPE_EVENT_SOURCE_KAFKA,
  TYPE_KNATIVE_REVISION,
} from '../utils/knative/knative-const';
import {
  OdcNodeModel,
  TopologyDataModelDepicted,
  TopologyDataObject,
  // TopologyDataResources,
} from '../utils/types/topology-types';

export const dataObjectFromModel = (node: OdcNodeModel): TopologyDataObject => {
  return {
    id: node.id,
    name: node.label,
    type: node.type,
    resource: node.resource,
    resources: null,
    data: null,
  };
};

/**
 * create all data that need to be shown on a topology data
 */
export const createTopologyNodeData = (
  resource: K8sResourceKind,
  overviewItem: OverviewItem,
  type: string,
  defaultIcon: string,
  operatorBackedService = false,
): TopologyDataObject => {
  const { monitoringAlerts = [] } = overviewItem;
  const dcUID = get(resource, 'metadata.uid');
  const deploymentsLabels = get(resource, 'metadata.labels', {});
  const deploymentsAnnotations = get(resource, 'metadata.annotations', {});

  const builderImageIcon =
    getImageForIconClass(`icon-${deploymentsLabels['app.openshift.io/runtime']}`) ||
    getImageForIconClass(`icon-${deploymentsLabels['app.kubernetes.io/name']}`);
  return {
    id: dcUID,
    name: resource?.metadata.name || deploymentsLabels['app.kubernetes.io/instance'],
    type,
    resource,
    resources: { ...overviewItem, isOperatorBackedService: operatorBackedService },
    data: {
      monitoringAlerts,
      kind: getReferenceForResource(resource),
      editURL: deploymentsAnnotations['app.openshift.io/edit-url'],
      vcsURI: deploymentsAnnotations['app.openshift.io/vcs-uri'],
      vcsRef: deploymentsAnnotations['app.openshift.io/vcs-ref'],
      builderImage: builderImageIcon || defaultIcon,
      isKnativeResource:
        type &&
        (type === TYPE_EVENT_SOURCE ||
          type === TYPE_KNATIVE_REVISION ||
          type === TYPE_EVENT_SOURCE_KAFKA)
          ? true
          : isKnativeServing(resource, 'metadata.labels'),
    },
  };
};

/**
 * create node data for graphs
 */
export const getTopologyNodeItem = (
  resource: K8sResourceKind,
  type: string,
  data: any,
  nodeProps?: Omit<OdcNodeModel, 'type' | 'data' | 'children' | 'id' | 'label'>,
  children?: string[],
  resourceKind?: K8sResourceKindReference,
  shape?: NodeShape,
): OdcNodeModel => {
  const uid = resource?.metadata.uid;
  const name = resource?.metadata.name;
  const label = resource?.metadata.labels?.['app.openshift.io/instance'];
  const kind = resourceKind || getReferenceForResource(resource);
  return {
    id: uid,
    type,
    label: label || name,
    shape,
    resource,
    resourceKind: kind,
    data,
    ...(children && children.length && { children }),
    ...(nodeProps || {}),
  };
};

export const WorkloadModelProps = {
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  group: false,
  visible: true,
  style: {
    padding: NODE_PADDING,
  },
};

/**
 * create edge data for graph
 */
export const getTopologyEdgeItems = (
  dc: K8sResourceKind,
  resources: K8sResourceKind[],
): EdgeModel[] => {
  const annotations = get(dc, 'metadata.annotations');
  const edges = [];

  edgesFromAnnotations(annotations)?.forEach((edge: string | ConnectsToData) => {
    // handles multiple edges
    const targetNode = get(
      resources?.find((deployment) => {
        let name;
        if (typeof edge === 'string') {
          name =
            deployment.metadata?.labels?.['app.kubernetes.io/instance'] ??
            deployment.metadata?.name;
          return name === edge;
        }
        name = deployment.metadata?.name;
        const { apiVersion: edgeApiVersion, kind: edgeKind, name: edgeName } = edge;
        const { kind, apiVersion } = deployment;
        let edgeExists = name === edgeName && kind === edgeKind;
        if (apiVersion) {
          edgeExists = edgeExists && apiVersion === edgeApiVersion;
        }
        return edgeExists;
      }),
      ['metadata', 'uid'],
    );
    const uid = get(dc, ['metadata', 'uid']);
    if (targetNode) {
      edges.push({
        id: `${uid}_${targetNode}`,
        type: TYPE_CONNECTS_TO,
        label: i18next.t('plugin__topology-plugin~Visual connector'),
        source: uid,
        target: targetNode,
      });
    }
  });

  return edges;
};

/**
 * create groups data for graph
 */
export const getTopologyGroupItems = (dc: K8sResourceKind): NodeModel => {
  const groupName = get(dc, ['metadata', 'labels', 'app.kubernetes.io/part-of']);
  if (!groupName) {
    return null;
  }

  return {
    id: `group:${groupName}`,
    type: TYPE_APPLICATION_GROUP,
    group: true,
    label: groupName,
    children: [get(dc, ['metadata', 'uid'])],
    width: GROUP_WIDTH,
    height: GROUP_HEIGHT,
    data: {},
    visible: true,
    collapsed: false,
    style: {
      padding: GROUP_PADDING,
    },
  };
};

const mergeGroupData = (newGroup: NodeModel, existingGroup: NodeModel): void => {
  if (!existingGroup.data?.groupResources && !newGroup.data?.groupResources) {
    return;
  }

  if (!existingGroup.data?.groupResources) {
    existingGroup.data.groupResources = [];
  }
  if (newGroup?.data?.groupResources) {
    newGroup.data.groupResources.forEach((obj) => {
      if (!existingGroup.data.groupResources.includes(obj)) {
        existingGroup.data.groupResources.push(obj);
      }
    });
  }
};

export const mergeGroup = (newGroup: NodeModel, existingGroups: NodeModel[]): void => {
  if (!newGroup) {
    return;
  }

  // Remove any children from the new group that already belong to another group
  newGroup.children = newGroup.children?.filter(
    (c) => !existingGroups?.find((g) => g.children?.includes(c)),
  );

  // find and add the groups
  const existingGroup = existingGroups.find((g) => g.group && g.id === newGroup.id);
  if (!existingGroup) {
    existingGroups.push(newGroup);
  } else {
    newGroup.children.forEach((id) => {
      if (!existingGroup.children.includes(id)) {
        existingGroup.children.push(id);
      }
      mergeGroupData(newGroup, existingGroup);
    });
  }
};

export const mergeGroups = (newGroups: NodeModel[], existingGroups: NodeModel[]): void => {
  if (!newGroups || !newGroups.length) {
    return;
  }
  newGroups.forEach((newGroup) => {
    mergeGroup(newGroup, existingGroups);
  });
};

export const addToTopologyDataModel = (
  newModel: Model,
  graphModel: Model,
  dataModelDepicters: TopologyDataModelDepicted[] = [],
) => {
  if (newModel?.edges) {
    graphModel.edges.push(...newModel.edges);
  }
  if (newModel?.nodes) {
    graphModel.nodes.push(
      ...newModel.nodes.filter(
        (n) =>
          !n.group &&
          !graphModel.nodes.find((existing) => {
            if (n.id === existing.id) {
              return true;
            }
            const { resource } = n as OdcNodeModel;
            return (
              !resource || !!dataModelDepicters.find((depicter) => depicter(resource, graphModel))
            );
          }),
      ),
    );
    mergeGroups(
      newModel.nodes.filter((n) => n.group),
      graphModel.nodes,
    );
  }
};

/**
 * Mapping of TopologyResourcesObject key to k8s resource kind
 */
export interface KindsMap {
  [key: string]: string;
}

export const getWorkloadResources = (
  resources: TopologyDataResources,
  kindsMap: KindsMap,
  workloadTypes: string[] = WORKLOAD_TYPES,
) => {
  return workloadTypes
    .map((resourceKind) => {
      return resources[resourceKind]
        ? resources[resourceKind].data.map((res) => {
            const resKind = res.kind || kindsMap[resourceKind];
            let kind = resKind;
            let apiVersion;
            if (resKind && isGroupVersionKind(resKind)) {
              kind = kindForReference(resKind);
              apiVersion = apiVersionForReference(resKind);
            }
            return {
              kind,
              apiVersion,
              ...res,
            };
          })
        : [];
    })
    ?.flat();
};

export const getBaseWatchedResources = (namespace: string): WatchK8sResources<any> => {
  return {
    deploymentConfigs: {
      isList: true,
      kind: 'DeploymentConfig',
      namespace,
      optional: true,
    },
    deployments: {
      isList: true,
      kind: 'Deployment',
      namespace,
      optional: true,
    },
    daemonSets: {
      isList: true,
      kind: 'DaemonSet',
      namespace,
      optional: true,
    },
    pods: {
      isList: true,
      kind: 'Pod',
      namespace,
      optional: true,
    },
    jobs: {
      isList: true,
      kind: 'Job',
      namespace,
      optional: true,
    },
    cronJobs: {
      isList: true,
      kind: 'CronJob',
      namespace,
      optional: true,
    },
    statefulSets: {
      isList: true,
      kind: 'StatefulSet',
      namespace,
      optional: true,
    },
    services: {
      isList: true,
      kind: 'Service',
      namespace,
      optional: true,
    },
    hpas: {
      isList: true,
      kind: HorizontalPodAutoscalerModel.kind,
      namespace,
      optional: true,
    },
  };
};
