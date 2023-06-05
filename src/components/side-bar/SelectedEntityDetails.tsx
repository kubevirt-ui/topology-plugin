import React, { FC } from 'react';

import { BaseEdge, GraphElement, isEdge, isNode } from '@patternfly/react-topology';

import { TYPE_CONNECTS_TO, TYPE_SERVICE_BINDING } from '../../const';
import {
  TYPE_EVENT_PUB_SUB_LINK,
  TYPE_EVENT_SINK_LINK,
  TYPE_EVENT_SOURCE_LINK,
  TYPE_KAFKA_CONNECTION_LINK,
  TYPE_REVISION_TRAFFIC,
} from '../../utils/knative/knative-const';

import ConnectedTopologyEdgePanel from './TopologyEdgePanel';
import TopologySideBarContent from './TopologySideBarContent';

export const isSidebarRenderable = (selectedEntity: GraphElement): boolean => {
  if (isNode(selectedEntity) || isEdge(selectedEntity)) {
    return true;
  }
  return false;
};

export const SelectedEntityDetails: FC<{ selectedEntity: GraphElement }> = ({ selectedEntity }) => {
  if (!selectedEntity) {
    return null;
  }

  if (isNode(selectedEntity)) {
    return <TopologySideBarContent element={selectedEntity} />;
  }

  if (isEdge(selectedEntity)) {
    if (
      [
        TYPE_REVISION_TRAFFIC,
        TYPE_EVENT_SOURCE_LINK,
        TYPE_EVENT_SINK_LINK,
        TYPE_KAFKA_CONNECTION_LINK,
        TYPE_SERVICE_BINDING,
        TYPE_EVENT_PUB_SUB_LINK,
        TYPE_CONNECTS_TO,
      ].includes(selectedEntity.getType())
    ) {
      return <TopologySideBarContent element={selectedEntity} />;
    }

    return <ConnectedTopologyEdgePanel edge={selectedEntity as BaseEdge} />;
  }
  return null;
};
