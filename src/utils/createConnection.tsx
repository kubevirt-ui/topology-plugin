import { Node } from '@patternfly/react-topology';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { createTopologyResourceConnection, getResource } from './topology-utils';

export const createConnection = (
  sourceNode: Node,
  targetNode: Node,
  replaceTargetNode: Node = null,
): Promise<K8sResourceKind[] | K8sResourceKind> => {
  return createTopologyResourceConnection(
    getResource(sourceNode),
    getResource(targetNode),
    replaceTargetNode ? getResource(replaceTargetNode) : null,
  );
};
