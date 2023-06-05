import defaultsDeep from 'lodash.defaultsdeep';
import find from 'lodash.find';
import get from 'lodash.get';

import {
  AccessReviewResourceAttributes,
  checkAccess,
  K8sKind,
  SelfSubjectAccessReviewKind,
} from '@openshift-console/dynamic-plugin-sdk';
import { ImpersonateKind } from '@openshift-console/dynamic-plugin-sdk/lib/app/redux-types';
import { isEmpty, size } from '@topology-utils/common-utils';
import { t } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { PodPhase } from '@topology-utils/types/topology-types';

import {
  AllPodStatus,
  ContainerStatus,
  DEPLOYMENT_PHASE,
  DEPLOYMENT_STRATEGY,
  DeploymentStrategy,
  ExtPodKind,
  PodControllerOverviewItem,
  PodKind,
  PodRCData,
  PodTemplate,
} from './types/podTypes';

const isContainerFailedFilter = (containerStatus) => {
  return containerStatus.state.terminated && containerStatus.state.terminated.exitCode !== 0;
};

export const isContainerLoopingFilter = (containerStatus) => {
  return (
    containerStatus.state.waiting && containerStatus.state.waiting.reason === 'CrashLoopBackOff'
  );
};

const podWarnings = (pod) => {
  const {
    status: { phase, containerStatuses },
  } = pod;
  if (phase === AllPodStatus.Running && containerStatuses) {
    return containerStatuses
      .map((containerStatus) => {
        if (!containerStatus.state) {
          return null;
        }

        if (isContainerFailedFilter(containerStatus)) {
          if (pod?.metadata?.deletionTimestamp) {
            return AllPodStatus.Failed;
          }
          return AllPodStatus.Warning;
        }
        if (isContainerLoopingFilter(containerStatus)) {
          return AllPodStatus.CrashLoopBackOff;
        }
        return null;
      })
      .filter((x) => x);
  }
  return null;
};

const numContainersReadyFilter = (pod) => {
  const {
    status: { containerStatuses },
  } = pod;
  let numReady = 0;
  containerStatuses.forEach((status) => {
    if (status.ready) {
      numReady++;
    }
  });
  return numReady;
};

const isReady = (pod) => {
  const {
    spec: { containers },
  } = pod;
  const numReady = numContainersReadyFilter(pod);
  const total = size(containers);

  return numReady === total;
};

export const getPodStatus = (pod) => {
  if (pod?.metadata?.deletionTimestamp) {
    return AllPodStatus.Terminating;
  }
  const warnings = podWarnings(pod);
  if (warnings !== null && warnings.length) {
    if (warnings.includes(AllPodStatus.CrashLoopBackOff)) {
      return AllPodStatus.CrashLoopBackOff;
    }
    if (warnings.includes(AllPodStatus.Failed)) {
      return AllPodStatus.Failed;
    }
    return AllPodStatus.Warning;
  }
  const phase = pod?.status?.phase || AllPodStatus.Unknown;
  if (phase === AllPodStatus.Running && !isReady(pod)) {
    return AllPodStatus.NotReady;
  }
  return phase;
};

export const calculateRadius = (elementSize: number) => {
  const radius = elementSize / 2;
  const podStatusStrokeWidth = (8 / 104) * elementSize;
  const podStatusInset = (5 / 104) * elementSize;
  const podStatusOuterRadius = radius - podStatusInset;
  const podStatusInnerRadius = podStatusOuterRadius - podStatusStrokeWidth;
  const decoratorRadius = radius * 0.25;

  return {
    radius,
    podStatusInnerRadius,
    podStatusOuterRadius,
    decoratorRadius,
    podStatusStrokeWidth,
    podStatusInset,
  };
};

/**
 * check if the deployment/deploymentconfig is idled.
 * @param deploymentConfig
 */
export const isIdled = (deploymentConfig: K8sResourceKind): boolean => {
  return !!(
    deploymentConfig?.metadata?.annotations?.['idling.alpha.openshift.io/idled-at'] || false
  );
};

export const podDataInProgress = (
  dc: K8sResourceKind,
  current: PodControllerOverviewItem,
  isRollingOut: boolean,
): boolean => {
  const strategy: DeploymentStrategy = dc?.spec?.strategy?.type;
  return (
    current?.phase !== DEPLOYMENT_PHASE.complete &&
    (strategy === DEPLOYMENT_STRATEGY.recreate || strategy === DEPLOYMENT_STRATEGY.rolling) &&
    isRollingOut
  );
};

const getScalingUp = (dc: K8sResourceKind): ExtPodKind => {
  const { metadata } = dc;
  return {
    ...{ metadata },
    status: {
      phase: AllPodStatus.ScalingUp,
    },
  };
};

export const getPodData = (
  podRCData: PodRCData,
): { inProgressDeploymentData: ExtPodKind[] | null; completedDeploymentData: ExtPodKind[] } => {
  const strategy: DeploymentStrategy = podRCData.obj?.spec?.strategy?.type || null;
  const currentDeploymentphase = podRCData.current && podRCData.current.phase;
  const currentPods = podRCData.current && podRCData.current.pods;
  const previousPods = podRCData.previous && podRCData.previous.pods;
  // DaemonSets and StatefulSets
  if (!strategy) return { inProgressDeploymentData: null, completedDeploymentData: podRCData.pods };

  // Scaling no. of pods
  if (currentDeploymentphase === DEPLOYMENT_PHASE.complete) {
    return { inProgressDeploymentData: null, completedDeploymentData: currentPods };
  }

  // Deploy - Rolling - Recreate
  if (
    (strategy === DEPLOYMENT_STRATEGY.recreate ||
      strategy === DEPLOYMENT_STRATEGY.rolling ||
      strategy === DEPLOYMENT_STRATEGY.rollingUpdate) &&
    podRCData.isRollingOut
  ) {
    return {
      inProgressDeploymentData: currentPods,
      completedDeploymentData: previousPods,
    };
  }
  // if build is not finished show `Scaling Up` on pod phase
  if (!podRCData.current && !podRCData.previous) {
    return {
      inProgressDeploymentData: null,
      completedDeploymentData: [getScalingUp(podRCData.obj)],
    };
  }
  return { inProgressDeploymentData: null, completedDeploymentData: podRCData.pods };
};

export const checkPodEditAccess = (
  resource: K8sResourceKind,
  resourceKind: K8sKind,
  impersonate: ImpersonateKind,
  subresource?: string,
): Promise<SelfSubjectAccessReviewKind> => {
  if (isEmpty(resource) || !resourceKind) {
    return Promise.resolve(null);
  }
  const { name, namespace } = resource.metadata;
  const resourceAttributes: AccessReviewResourceAttributes = {
    group: resourceKind.apiGroup,
    resource: resourceKind.plural,
    subresource,
    verb: 'patch',
    name,
    namespace,
  };
  return checkAccess(resourceAttributes, impersonate);
};

const getRestartPolicy = (pod: PodKind) =>
  find(
    {
      Always: {
        // A unique id to identify the type, used as the value when communicating with the API.
        id: 'Always',
        // What is shown in the UI.
        label: t('Always restart'),
        // Description in the UI.
        description: t(
          'If the container restarts for any reason, restart it. Useful for stateless services that may fail from time to time.',
        ),
        // Default selection for new pods.
        default: true,
      },
      OnFailure: {
        id: 'OnFailure',
        label: t('Restart on failure'),
        description: t('If the container exits with a non-zero status code, restart it.'),
      },
      Never: {
        id: 'Never',
        label: t('Never restart'),
        description: t(
          'Never restart the container. Useful for containers that exit when they have completed a specific job, like a data import daemon.',
        ),
      },
    },
    { id: get<any, string>(pod, 'spec.restartPolicy') },
  );

export const getRestartPolicyLabel = (pod: PodKind) => get(getRestartPolicy(pod), 'label', '');

// This logic is replicated from k8s (at this writing, Kubernetes 1.17)
// (See https://github.com/kubernetes/kubernetes/blob/release-1.17/pkg/printers/internalversion/printers.go)
export const podPhase = (pod: PodKind): PodPhase => {
  if (!pod || !pod.status) {
    return '';
  }

  if (pod.metadata.deletionTimestamp) {
    return 'Terminating';
  }

  if (pod.status.reason === 'NodeLost') {
    return 'Unknown';
  }

  if (pod.status.reason === 'Evicted') {
    return 'Evicted';
  }

  let initializing = false;
  let phase = pod.status.phase || pod.status.reason;

  pod.status.initContainerStatuses?.forEach((container: ContainerStatus, i: number) => {
    const { terminated, waiting } = container.state;
    if (terminated && terminated.exitCode === 0) {
      return true;
    }

    initializing = true;
    if (terminated && terminated.reason) {
      phase = `Init:${terminated.reason}`;
    } else if (terminated && !terminated.reason) {
      phase = terminated.signal
        ? `Init:Signal:${terminated.signal}`
        : `Init:ExitCode:${terminated.exitCode}`;
    } else if (waiting && waiting.reason && waiting.reason !== 'PodInitializing') {
      phase = `Init:${waiting.reason}`;
    } else {
      phase = `Init:${i}/${pod.status.initContainerStatuses.length}`;
    }
    return false;
  });

  if (!initializing) {
    let hasRunning = false;
    const containerStatuses = pod.status.containerStatuses || [];
    for (let i = containerStatuses.length - 1; i >= 0; i--) {
      const {
        state: { running, terminated, waiting },
        ready,
      } = containerStatuses[i];
      if (terminated && terminated.reason) {
        phase = terminated.reason;
      } else if (waiting && waiting.reason) {
        phase = waiting.reason;
      } else if (waiting && !waiting.reason) {
        phase = terminated.signal
          ? `Signal:${terminated.signal}`
          : `ExitCode:${terminated.exitCode}`;
      } else if (running && ready) {
        hasRunning = true;
      }
    }

    // Change pod status back to "Running" if there is at least one container
    // still reporting as "Running" status.
    if (phase === 'Completed' && hasRunning) {
      phase = 'Running';
    }
  }

  return phase;
};

export const getPodTemplate = (resource: K8sResourceKind): PodTemplate => {
  switch (resource.kind) {
    case 'Pod':
      return resource as PodKind;
    case 'DeploymentConfig':
      // Include labels automatically added to deployment config pods since a service
      // might select them.
      return defaultsDeep(
        {
          metadata: {
            labels: {
              deploymentconfig: resource.metadata.name,
            },
          },
        },
        resource.spec?.template,
      );
    default:
      return resource.spec?.template;
  }
};
