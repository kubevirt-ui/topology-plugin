import { useMemo } from 'react';

import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { getServicesForResource } from '@topology-utils/resource-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

const useServicesWatcher = (
  resource: K8sResourceKind,
): { loaded: boolean; loadError: string; services: K8sResourceKind[] } => {
  const { namespace } = resource.metadata;
  const [allServices, loaded, loadError] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    kind: 'Service',
    namespace,
  });

  const services = useMemo(
    () => (!loadError && loaded ? getServicesForResource(resource, allServices) : []),
    [allServices, loadError, loaded, resource],
  );

  return { loaded, loadError, services };
};

export default useServicesWatcher;
