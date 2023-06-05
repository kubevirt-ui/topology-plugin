import { useMemo } from 'react';

import { useK8sWatchResources } from '@openshift-console/dynamic-plugin-sdk';
import { getReplicationControllersForResource } from '@topology-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { PodControllerOverviewItem } from '@topology-utils/types/podTypes';

const useReplicationControllersWatcher = (
  resource: K8sResourceKind,
): {
  loaded: boolean;
  loadError: string;
  mostRecentRC: K8sResourceKind;
  visibleReplicationControllers: PodControllerOverviewItem[];
} => {
  const { namespace } = resource.metadata;
  const watchedResources = useMemo(
    () => ({
      replicationControllers: {
        isList: true,
        kind: 'ReplicationController',
        namespace,
      },
      pods: {
        isList: true,
        kind: 'Pod',
        namespace,
      },
    }),
    [namespace],
  );
  const resources = useK8sWatchResources(watchedResources);

  const { loaded, loadError, mostRecentRC, visibleReplicationControllers } = useMemo(() => {
    const resourcesLoaded =
      Object.keys(resources).length > 0 &&
      Object.keys(resources).every((key) => resources[key].loaded);
    const resourceWithLoadError = Object.values(resources).find((r) => r.loadError);
    if (!resourcesLoaded || resourceWithLoadError) {
      return {
        loaded: resourcesLoaded,
        loadError: resourceWithLoadError ? resourceWithLoadError.loadError : null,
        mostRecentRC: null,
        visibleReplicationControllers: [],
      };
    }

    return {
      loaded: true,
      loadError: null,
      ...getReplicationControllersForResource(resource, resources),
    };
  }, [resources, resource]);

  return { loaded, loadError, mostRecentRC, visibleReplicationControllers };
};

export default useReplicationControllersWatcher;
