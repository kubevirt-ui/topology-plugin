import { useEffect } from 'react';
import get from 'lodash.get';

import {
  K8sKind,
  SelfSubjectAccessReviewKind,
  useSafetyFirst,
} from '@openshift-console/dynamic-plugin-sdk';
import { ImpersonateKind } from '@openshift-console/dynamic-plugin-sdk/lib/app/redux-types';
import { checkPodEditAccess } from '@topology-utils/pod-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { ExtPodKind } from '@topology-utils/types/podTypes';

const usePodScalingAccessStatus = (
  obj: K8sResourceKind,
  resourceKind: K8sKind,
  pods: ExtPodKind[],
  enableScaling?: boolean,
  impersonate?: ImpersonateKind,
) => {
  const isKnativeRevision = obj.kind === 'Revision';
  const isPod = obj.kind === 'Pod';
  const isScalingAllowed = !isKnativeRevision && !isPod && enableScaling;
  const [editable, setEditable] = useSafetyFirst(false);

  useEffect(() => {
    if (isScalingAllowed) {
      checkPodEditAccess(obj, resourceKind, impersonate, 'scale')
        .then((resp: SelfSubjectAccessReviewKind) =>
          setEditable(get(resp, 'status.allowed', false)),
        )
        .catch((error) => {
          // console.log is used here instead of throw error
          // throw error will break the thread and likely end-up in a white screen
          // eslint-disable-next-line
          console.log('Checking pod edit access failed:', error);
          setEditable(false);
        });
    }
  }, [pods, obj, resourceKind, impersonate, setEditable, isScalingAllowed]);

  return editable;
};

export default usePodScalingAccessStatus;
