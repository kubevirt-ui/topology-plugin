import { useMemo } from 'react';

import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import useServicesWatcher from '@topology-utils/hooks/useServicesWatcher';
import { getRoutesForServices } from '@topology-utils/resource-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { RouteKind } from '@topology-utils/types/knativeTypes';

type UseRoutesWatcher = (resource: K8sResourceKind) => {
  loaded: boolean;
  loadError: string;
  routes: RouteKind[];
};

const useRoutesWatcher: UseRoutesWatcher = (resource) => {
  const { namespace } = resource.metadata;
  const watchedServices = useServicesWatcher(resource);
  const [allRoutes, loaded, loadError] = useK8sWatchResource<RouteKind[]>({
    isList: true,
    kind: 'Route',
    namespace,
  });

  const servicesNames = useMemo(
    () =>
      !watchedServices.loadError && watchedServices.loaded
        ? watchedServices.services.map((s) => s.metadata.name)
        : [],
    [watchedServices.loadError, watchedServices.loaded, watchedServices.services],
  );

  const routes = useMemo(
    () => getRoutesForServices(servicesNames, allRoutes),
    [servicesNames, allRoutes],
  );

  return {
    loaded: loaded && watchedServices.loaded,
    loadError: loadError || watchedServices.loadError,
    routes,
  };
};

export default useRoutesWatcher;
