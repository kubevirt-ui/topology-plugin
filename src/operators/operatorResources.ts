import ClusterServiceVersionModel from '@kubevirt-ui/kubevirt-api/console/models/ClusterServiceVersionModel';
import {
  getGroupVersionKindForModel,
  WatchK8sResources,
} from '@openshift-console/dynamic-plugin-sdk';

import { ServiceBindingModel } from '../models/ServiceBindingModel';

export const getOperatorWatchedResources = (namespace: string): WatchK8sResources<any> => {
  return {
    clusterServiceVersions: {
      isList: true,
      groupVersionKind: getGroupVersionKindForModel(ClusterServiceVersionModel),
      namespace,
      optional: true,
    },
  };
};

export const getServiceBindingWatchedResources = (namespace: string): WatchK8sResources<any> => {
  return {
    serviceBindingRequests: {
      isList: true,
      groupVersionKind: getGroupVersionKindForModel(ServiceBindingModel),
      namespace,
      optional: true,
    },
  };
};
