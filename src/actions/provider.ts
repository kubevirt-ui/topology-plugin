import { useMemo } from 'react';

import { getGroupVersionKindForResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  getK8sModel,
  useK8sModel,
} from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Edge, GraphElement } from '@patternfly/react-topology';

import { TYPE_CONNECTS_TO, TYPE_WORKLOAD } from '../const';
import { getResource } from '../utils';

import { DeleteConnectorAction, MoveConnectorAction } from './edgeActions';
import { getModifyApplicationAction } from './modify-application';

export const useTopologyWorkloadActionProvider = (element: GraphElement) => {
  const resource = getResource(element);
  const actions = useMemo(() => {
    if (element.getType() !== TYPE_WORKLOAD) return undefined;
    if (!resource) {
      return [];
    }
    const k8sKind = getK8sModel(resource);
    return [getModifyApplicationAction(k8sKind, resource)];
  }, [element, resource]);

  return useMemo(() => {
    if (!actions) return [[], true, undefined];
    return [actions, true, undefined];
  }, [actions]);
};

export const useTopologyVisualConnectorActionProvider = (element: Edge) => {
  const resource = getResource(element.getSource?.());
  const [kindObj, inFlight] = useK8sModel(getGroupVersionKindForResource(resource));
  const actions = useMemo(() => {
    if (!kindObj || element.getType() !== TYPE_CONNECTS_TO) return undefined;
    return [MoveConnectorAction(kindObj, element), DeleteConnectorAction(kindObj, element)];
  }, [element, kindObj]);

  return useMemo(() => {
    if (!actions) return [[], true, undefined];
    return [actions, !inFlight, undefined];
  }, [actions, inFlight]);
};
