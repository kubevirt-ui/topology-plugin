import get from 'lodash.get';

import { getRouteWebURL } from '@topology-utils';
import { t } from '@topology-utils/hooks/useTopologyTranslation';
import { RouteIngress } from '@topology-utils/types/commonTypes';
import { RouteKind } from '@topology-utils/types/knativeTypes';

const getRouteHost = (route: RouteKind, onlyAdmitted: boolean): string => {
  let oldestAdmittedIngress: RouteIngress;
  let oldestTransitionTime: string;
  route.status.ingress?.forEach((ingress) => {
    const admittedCondition = ingress.conditions?.find(
      (cond) => cond?.type === 'Admitted' && cond?.status === 'True',
    );
    if (
      admittedCondition &&
      (!oldestTransitionTime || oldestTransitionTime > admittedCondition.lastTransitionTime)
    ) {
      oldestAdmittedIngress = ingress;
      oldestTransitionTime = admittedCondition.lastTransitionTime;
    }
  });

  if (oldestAdmittedIngress) {
    return oldestAdmittedIngress.host;
  }

  return onlyAdmitted ? null : route.spec.host;
};

export const isWebRoute = (route: RouteKind): boolean => {
  return !!getRouteHost(route, true) && get(route, 'spec.wildcardPolicy') !== 'Subdomain';
};

const getSubdomain = (route: RouteKind): string => {
  const hostname = get(route, 'spec.host', '');
  return hostname.replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, '');
};

export const getRouteLabel = (route: RouteKind): string => {
  if (isWebRoute(route)) {
    return getRouteWebURL(route);
  }

  let label = getRouteHost(route, false);
  if (!label) {
    return t('unknown host');
  }

  if (get(route, 'spec.wildcardPolicy') === 'Subdomain') {
    label = `*.${getSubdomain(route)}`;
  }

  if (route.spec.path) {
    label += route.spec.path;
  }
  return label;
};
