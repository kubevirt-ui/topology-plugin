import { PodKind } from '@topology-utils/types/podTypes';

export const isWindowsPod = (pod: PodKind): boolean => {
  return pod?.spec?.tolerations?.some((t) => t.key === 'os' && t.value === 'Windows');
};

export const isContainerCrashLoopBackOff = (pod: PodKind, containerName: string): boolean => {
  const containerStatus = pod?.status?.containerStatuses?.find((c) => c.name === containerName);
  const waitingReason = containerStatus?.state?.waiting?.reason;
  return waitingReason === 'CrashLoopBackOff';
};
