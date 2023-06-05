import get from 'lodash.get';
import head from 'lodash.head';

import { podPhase } from '@topology-utils/pod-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { PodKind } from '@topology-utils/types/podTypes';

const errorPhases = [
  'ContainerCannotRun',
  'CrashLoopBackOff',
  'Critical',
  'Error',
  'Failed',
  'InstallCheckFailed',
  'Cancelled',
  'Expired',
  'Not Ready',
  'Terminating',
];

export const isComplete = (build: K8sResourceKind) => build.status?.completionTimestamp;

export const isDeploymentGeneratedByWebConsole = (obj: K8sResourceKind) =>
  obj.kind === 'Deployment' &&
  obj.metadata?.annotations?.['openshift.io/generated-by'] === 'OpenShiftWebConsole';

export const isPodWithoutImageId = (pod: PodKind) =>
  pod.status?.phase === 'Pending' &&
  pod.status?.containerStatuses?.some((containerStatus) => !containerStatus.imageID);

export const isPodError = (pod: PodKind) => errorPhases?.includes(podPhase(pod));

export const isEvicted = (pod: PodKind) => podPhase(pod) === 'Evicted';

export const podCompare = (pod1: PodKind, pod2: PodKind): number => {
  const error1 = isPodError(pod1);
  const error2 = isPodError(pod2);

  if (error1 !== error2) {
    return error1 ? -1 : 1;
  }

  const evicted1 = isEvicted(pod1);
  const evicted2 = isEvicted(pod2);

  if (evicted1 !== evicted2) {
    return evicted1 ? 1 : -1;
  }

  const runtime1 = podUpdateTime(pod1);
  const runtime2 = podUpdateTime(pod2);

  if (runtime1 < runtime2) {
    return 1;
  }
  if (runtime1 > runtime2) {
    return -1;
  }

  return pod1.metadata.name.localeCompare(pod2.metadata.name);
};

const podUpdateTime = (pod: PodKind) => {
  const allStatuses = [
    ...get(pod, 'status.containerStatuses', []),
    ...get(pod, 'status.initContainerStatuses', []),
  ];
  const updateTimes = allStatuses?.reduce((times, nextStatus) => {
    if (nextStatus.state.running) {
      return [...times, get(nextStatus, 'state.running.startedAt')];
    }
    if (nextStatus.state.terminated) {
      return [...times, get(nextStatus, 'state.terminated.finishedAt')];
    }
    if (nextStatus.lastState.running) {
      return [...times, get(nextStatus, 'lastState.running.startedAt')];
    }
    if (nextStatus.lastState.terminated) {
      return [...times, get(nextStatus, 'lastState.terminated.finishedAt')];
    }
    return [...times, get(nextStatus, get(pod, 'startTime'))];
  }, []);

  return head(updateTimes.sort().reverse);
};
