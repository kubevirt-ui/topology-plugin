import { getAPIVersionForModel, k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Node } from '@patternfly/react-topology';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { serviceBindingModal } from '../../components/modals/ServiceBindingModal';
import { ServiceBindingModel } from '../../models/ServiceBindingModel';
import { TYPE_OPERATOR_BACKED_SERVICE } from '../components/const';

export const createServiceBinding = (
  source: K8sResourceKind,
  target: K8sResourceKind,
  serviceBindingName: string,
): Promise<K8sResourceKind> => {
  if (!source || !target || source === target) {
    return Promise.reject();
  }

  const targetName = target.metadata.name;
  const { namespace, name: sourceName } = source.metadata;
  const sourceGroup = source.apiVersion?.split('/');
  const targetGroup = target.apiVersion?.split('/');

  const serviceBinding = {
    apiVersion: getAPIVersionForModel(ServiceBindingModel),
    kind: ServiceBindingModel.kind,
    metadata: {
      name: serviceBindingName,
      namespace,
    },
    spec: {
      application: {
        name: sourceName,
        group: sourceGroup[0],
        version: sourceGroup[1],
        resource: getK8sModel(source).plural,
      },
      services: [
        {
          group: targetGroup[0],
          version: targetGroup[1],
          kind: target.kind,
          name: targetName,
        },
      ],
      detectBindingResources: true,
    },
  };

  return k8sCreate({ model: ServiceBindingModel, data: serviceBinding });
};

const createServiceBindingConnection = (source: Node, target: Node) => {
  const sourceResource = source.getData().resource || source.getData().resources?.obj;
  const targetResource = target.getData().resource || target.getData().resources?.obj;
  return serviceBindingModal({
    model: getK8sModel(sourceResource),
    source: sourceResource,
    target: targetResource,
  }).then(() => null);
};

export const getCreateConnector = (createHints: string[], source: Node, target: Node) => {
  if (
    createHints &&
    createHints.includes('createServiceBinding') &&
    target.getType() === TYPE_OPERATOR_BACKED_SERVICE
  ) {
    return createServiceBindingConnection;
  }
  return null;
};
