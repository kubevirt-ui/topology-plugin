import { K8sKind, k8sPatch, k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

export const togglePaused = (model: K8sKind, obj: K8sResourceKind) => {
  // a MachineConfigPool can be created without a spec, despite the API saying it is required
  if (!obj.spec) {
    const newObj = {
      ...obj,
      spec: {
        ...(obj.spec || {}),
        paused: true,
      },
    };

    return k8sUpdate({ model, data: newObj });
  }

  const patch = [
    {
      path: '/spec/paused',
      op: 'add',
      value: !obj.spec.paused,
    },
  ];

  return k8sPatch({ model, resource: obj, data: patch });
};
