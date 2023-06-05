import React, { FC } from 'react';

import { getRouteWebURL } from '@topology-utils';
import { RouteKind } from '@topology-utils/types/knativeTypes';

import ExternalLinkWithCopy from './ExternalLinkAndCopy';

export type RouteLinkAndCopyProps = {
  route: RouteKind;
  additionalClassName?: string;
};

const RouteLinkAndCopy: FC<RouteLinkAndCopyProps> = ({ route, additionalClassName }) => {
  const link = getRouteWebURL(route);
  return (
    <ExternalLinkWithCopy
      additionalClassName={additionalClassName}
      link={link}
      text={link}
      dataTestID="route-link"
    />
  );
};

export default RouteLinkAndCopy;
