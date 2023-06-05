import merge from 'lodash.merge';

import { TopologyDataResources } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { EdgeModel, Model } from '@patternfly/react-topology/dist/esm/types';
import { WORKLOAD_TYPES } from '@topology-utils';
import isOperatorBackedKnResource from '@topology-utils/hooks/isOperatorBackedResource/isOperatorBackedKnResource';
import { getReferenceForResource } from '@topology-utils/k8s-utils';
import LabelSelector from '@topology-utils/label-selector';
import {
  getOperatorBackedServiceKindMap,
  isOperatorBackedService,
} from '@topology-utils/operator-utils';
import { ClusterServiceVersionKind, K8sResourceKind } from '@topology-utils/types/k8s-types';

import { TYPE_SERVICE_BINDING } from '../const';
import { getTopologyEdgeItems } from '../data-transforms/transform-utils';

export const edgesFromServiceBinding = (
  source: K8sResourceKind,
  sbrs: K8sResourceKind[],
): K8sResourceKind[] => {
  const sourceBindings = [];
  if (!sbrs) {
    return sourceBindings;
  }
  sbrs.forEach((sbr) => {
    let edgeExists = false;
    const reference = getReferenceForResource(source);
    if (reference && sbr?.spec?.application?.resource === getK8sModel(reference)?.plural) {
      if (sbr?.spec?.application?.name === source.metadata.name) {
        edgeExists = true;
      } else {
        const matchLabels = sbr?.spec?.application?.labelSelector?.matchLabels;
        if (matchLabels) {
          const sbrSelector = new LabelSelector(sbr.spec.application.labelSelector);
          if (sbrSelector.matches(source)) {
            edgeExists = true;
          }
        }
      }
    }
    edgeExists && sourceBindings.push(sbr);
  });
  return sourceBindings;
};

export const getServiceBindingEdges = (
  dc: K8sResourceKind,
  obsGroups: K8sResourceKind[],
  sbrs: K8sResourceKind[],
  installedOperators: K8sResourceKind[],
): EdgeModel[] => {
  const edges = [];
  if (!sbrs?.length || !installedOperators?.length) {
    return edges;
  }

  edgesFromServiceBinding(dc, sbrs)?.forEach((sbr) => {
    sbr.spec.services?.forEach((bss) => {
      if (bss) {
        const targetGroup = obsGroups.find(
          (group) => group.kind === bss.kind && group.metadata.name === bss.name,
        );
        const target = targetGroup?.metadata.uid;
        const source = dc.metadata.uid;
        if (source && target) {
          edges.push({
            id: `${source}_${target}`,
            type: TYPE_SERVICE_BINDING,
            source,
            target,
            resource: sbr,
            data: { sbr },
          });
        }
      }
    });
  });

  return edges;
};

export const getOperatorGroupResource = (
  resource: K8sResourceKind,
  resources?: TopologyDataResources,
): { operatorGroupItem: K8sResourceKind; csvName: string } => {
  const installedOperators = resources?.clusterServiceVersions?.data as ClusterServiceVersionKind[];
  const operatorBackedServiceKindMap = getOperatorBackedServiceKindMap(installedOperators);
  // added this as needs to hide operator backed if belong to source
  if (resources && isOperatorBackedKnResource(resource, resources)) {
    return null;
  }

  if (isOperatorBackedService(resource, installedOperators)) {
    const ownerReference = resource?.metadata?.ownerReferences?.[0];
    const ownerUid = ownerReference?.uid;
    const nodeResourceKind = ownerReference?.kind;
    const operatorBackedServiceKind = operatorBackedServiceKindMap?.[nodeResourceKind];
    const appGroup = resource?.metadata?.labels?.['app.kubernetes.io/part-of'];
    const operator: K8sResourceKind =
      (installedOperators.find((op) => op.metadata.uid === ownerUid) as K8sResourceKind) ||
      operatorBackedServiceKind;
    const csvName = operator.metadata.name;
    const operatorName =
      ownerReference?.name ?? appGroup
        ? `${appGroup}:${operator.metadata.name}`
        : operator.metadata.name;

    const groupUid = ownerReference?.uid ?? `${operatorName}:${operator.metadata.uid}`;
    const operatorGroupItem = merge({}, operator, {
      apiVersion: ownerReference?.apiVersion ?? '',
      kind: ownerReference?.kind ?? 'Operator',
      metadata: {
        name: ownerReference?.name ?? operator.metadata.name,
        uid: groupUid,
      },
    });
    return { operatorGroupItem, csvName };
  }
  return null;
};

export const getOperatorGroupResources = (resources: TopologyDataResources) => {
  const obsGroups = [];
  WORKLOAD_TYPES.forEach((key) => {
    if (resources[key]?.data && resources[key].data.length) {
      resources[key].data.forEach((resource) => {
        const groupResource = getOperatorGroupResource(resource, resources);
        if (!groupResource?.operatorGroupItem) {
          return;
        }
        obsGroups.push(groupResource.operatorGroupItem);
      });
    }
  });
  return obsGroups;
};

export const getOperatorTopologyDataModel = (
  namespace: string,
  resources: TopologyDataResources,
  workloads: K8sResourceKind[],
): Promise<Model> => {
  const operatorsDataModel: Model = {
    nodes: [],
    edges: [],
  };
  const obsGroups = getOperatorGroupResources(resources);
  const serviceBindingRequests = resources?.serviceBindingRequests?.data;
  const installedOperators = resources?.clusterServiceVersions?.data as ClusterServiceVersionKind[];
  if (installedOperators?.length) {
    workloads.forEach((dc) => {
      operatorsDataModel.edges.push(
        ...[
          ...getServiceBindingEdges(dc, obsGroups, serviceBindingRequests, installedOperators),
          ...getTopologyEdgeItems(dc, obsGroups),
        ],
      );
    });
  }

  return Promise.resolve(operatorsDataModel);
};
