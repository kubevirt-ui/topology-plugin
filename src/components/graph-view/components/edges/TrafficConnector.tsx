import React, { FC } from 'react';

import { Edge, EdgeTerminalType } from '@patternfly/react-topology';

import BaseEdge from './BaseEdge';

import './TrafficConnector.scss';

type TrafficConnectorProps = {
  element: Edge;
};

const TrafficConnector: FC<TrafficConnectorProps> = (props) => (
  <BaseEdge
    className="odc-traffic-connector"
    endTerminalType={EdgeTerminalType.directionalAlt}
    {...props}
  />
);

export default TrafficConnector;
