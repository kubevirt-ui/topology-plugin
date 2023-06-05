import omit from 'lodash.omit';

import { WatchK8sResources } from '@openshift-console/dynamic-plugin-sdk';
import { getBindableServiceResources } from '@topology-utils/dev-console-resources';
import { getOperatorBackedServiceKindMap } from '@topology-utils/operator-utils';
import { ClusterServiceVersionKind } from '@topology-utils/types/k8s-types';

export type OwnedResourceType = {
  displayName: string;
  kind: string;
  name: string;
  version: string;
};

export type ClusterServiceVersionDataType = {
  data: ClusterServiceVersionKind[];
  loaded: boolean;
  loadError: string;
};

export const getGroupVersionKindFromOperatorBackedServiceKindMap = (
  obj: ClusterServiceVersionKind,
  obsResourceKind: string,
): { group: string; version: string; kind: string } => {
  const ownedResource: OwnedResourceType = obj.spec?.customresourcedefinitions?.owned?.find(
    (o) => o.kind === obsResourceKind,
  );
  const apiGroup = ownedResource.name.substring(
    ownedResource.name.indexOf('.') + 1,
    ownedResource.name.length,
  );
  return { group: apiGroup, version: ownedResource.version, kind: ownedResource.kind };
};

export const getOperatorBackedServiceResources = (
  namespace: string,
  csvs: ClusterServiceVersionDataType,
) => {
  const operatorBackedServiceKindMap = getOperatorBackedServiceKindMap(csvs?.data);
  const obsResources = Object.keys(operatorBackedServiceKindMap).map((obs: string) => {
    const groupVersionKind = getGroupVersionKindFromOperatorBackedServiceKindMap(
      operatorBackedServiceKindMap[obs],
      obs,
    );
    return (
      groupVersionKind?.kind !== 'ServiceBinding' && {
        isList: true,
        groupVersionKind,
        namespace,
        optional: true,
        prop: obs,
      }
    );
  });
  return obsResources;
};

export const getBindableResources = (namespace: string, csvs: ClusterServiceVersionDataType) => {
  const bindableRes = omit(
    {
      ...getBindableServiceResources(namespace),
      ...getOperatorBackedServiceResources(namespace, csvs),
    },
    'serviceBindingRequests',
  );

  const res = Object.keys(bindableRes).map((key) => bindableRes[key]);
  return res as WatchK8sResources<any>[];
};
