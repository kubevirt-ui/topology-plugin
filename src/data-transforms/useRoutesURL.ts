import { useMemo } from 'react';

import { getRoutesURL } from '@topology-utils';
import useRoutesWatcher from '@topology-utils/hooks/useRoutesWatcher';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { ROUTE_DISABLED_ANNOTATION, ROUTE_URL_ANNOTATION } from '../const';

export const useRoutesURL = (resource: K8sResourceKind): string => {
  const disabled = resource?.metadata?.annotations?.[ROUTE_DISABLED_ANNOTATION] === 'true';
  const annotationURL = resource?.metadata?.annotations?.[ROUTE_URL_ANNOTATION];

  const routeResources = useRoutesWatcher(resource);
  const routes = useMemo(
    () => (routeResources.loaded && !routeResources.loadError ? routeResources.routes : []),
    [routeResources],
  );
  const watchedURL = useMemo(() => getRoutesURL(resource, routes), [resource, routes]);

  const url = annotationURL || watchedURL;
  if (disabled || !url || !(url.startsWith('http://') || url.startsWith('https://'))) {
    return null;
  }
  return url;
};
