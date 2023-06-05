import {
  getGroupVersionKindForModel,
  K8sGroupVersionKind,
  K8sKind,
} from '@openshift-console/dynamic-plugin-sdk';

import { eventSourceData } from './knative-topology-utils';

export const isDynamicEventResourceKind = (resourceRef: K8sGroupVersionKind): boolean => {
  const index = eventSourceData.eventSourceModels.findIndex(
    (model: K8sKind) => getGroupVersionKindForModel(model) === resourceRef,
  );
  return index !== -1;
};
