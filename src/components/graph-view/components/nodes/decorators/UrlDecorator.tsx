import React, { FC } from 'react';

import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Node } from '@patternfly/react-topology';
import { getResource } from '@topology-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { useRoutesURL } from '../../../../../data-transforms/useRoutesURL';

import Decorator from './Decorator';

interface DefaultDecoratorProps {
  element: Node;
  radius: number;
  x: number;
  y: number;
}

const UrlDecorator: FC<DefaultDecoratorProps> = ({ element, radius, x, y }) => {
  const { t } = useTopologyTranslation();
  const resourceObj = getResource(element);
  const url = useRoutesURL(resourceObj);
  if (!url) {
    return null;
  }
  const label = t('Open URL');
  return (
    <Tooltip key="route" content={label} position={TooltipPosition.right}>
      <Decorator x={x} y={y} radius={radius} href={url} external ariaLabel={label}>
        <g transform={`translate(-${radius / 2}, -${radius / 2})`}>
          <ExternalLinkAltIcon style={{ fontSize: radius }} title={label} />
        </g>
      </Decorator>
    </Tooltip>
  );
};

export default UrlDecorator;
