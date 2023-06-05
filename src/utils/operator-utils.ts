import get from 'lodash.get';

import { isEmpty } from '@topology-utils/common-utils';
import { ClusterServiceVersionKind, K8sResourceKind } from '@topology-utils/types/k8s-types';

export type OperatorBackedServiceKindMap = {
  [name: string]: ClusterServiceVersionKind;
};

export const getOperatorBackedServiceKindMap = (
  installedOperators: ClusterServiceVersionKind[],
): OperatorBackedServiceKindMap =>
  installedOperators
    ? installedOperators.reduce((kindMap, csv) => {
        (csv?.spec?.customresourcedefinitions?.owned || []).forEach((crd) => {
          if (!(crd.kind in kindMap)) {
            kindMap[crd.kind] = csv;
          }
        });
        return kindMap;
      }, {})
    : {};

export const isOperatorBackedService = (
  obj: K8sResourceKind,
  installedOperators: ClusterServiceVersionKind[],
): boolean => {
  const kind = get(obj, 'metadata.ownerReferences[0].kind', null);
  const ownerUid = get(obj, 'metadata.ownerReferences[0].uid');
  const operatorBackedServiceKindMap = getOperatorBackedServiceKindMap(installedOperators);
  const operatorResource: K8sResourceKind = installedOperators?.find(
    (operator) => operator?.metadata?.uid === ownerUid,
  ) as K8sResourceKind;
  return !!(
    kind &&
    operatorBackedServiceKindMap &&
    (!isEmpty(operatorResource) || kind in operatorBackedServiceKindMap)
  );
};
