import React, { FC } from 'react';

import { RouteKind } from '@topology-utils/types/knativeTypes';

import RouteLinkAndCopy from './components/RouteLinkAndCopy';
import { getRouteLabel, isWebRoute } from './utils/utils';

export type RouteHostnameProps = {
  obj: RouteKind;
};

const RouteLocation: FC<RouteHostnameProps> = ({ obj }) => (
  <div className="co-break-word">
    {isWebRoute(obj) ? (
      <RouteLinkAndCopy route={obj} additionalClassName="co-external-link--block" />
    ) : (
      getRouteLabel(obj)
    )}
  </div>
);

export default RouteLocation;
