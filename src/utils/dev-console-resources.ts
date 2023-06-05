import { modelToGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console';
import { WatchK8sResources } from '@openshift-console/dynamic-plugin-sdk';

import { ServiceBindingModel } from '../models/ServiceBindingModel';

export type BindableServiceGVK = {
  group: string;
  version: string;
  kind: string;
};

type BindableServicesData = {
  bindableServices: BindableServiceGVK[];
  loaded: boolean;
};

export const getBindableServicesList = () => {
  return bindableServicesData.bindableServices;
};

const bindableServicesData: BindableServicesData = {
  bindableServices: [],
  loaded: false,
};

export const getBindableServiceResources = (namespace: string): WatchK8sResources<any> => {
  const resources = {
    serviceBindingRequests: {
      namespace,
      groupVersionKind: modelToGroupVersionKind(ServiceBindingModel),
      isList: true,
      optional: true,
      prop: 'serviceBindingRequests',
    },
    ...getBindableServicesList().reduce(
      (acc, groupVersionKind) => ({
        [groupVersionKind.kind]: {
          namespace,
          groupVersionKind: groupVersionKind,
          isList: true,
          optional: true,
          prop: groupVersionKind.kind,
        },
        ...acc,
      }),
      {},
    ),
  };
  return resources;
};
