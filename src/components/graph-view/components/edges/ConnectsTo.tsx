import React, { FC } from 'react';

import {
  Edge,
  EdgeTerminalType,
  observer,
  WithContextMenuProps,
  WithSourceDragProps,
  WithTargetDragProps,
} from '@patternfly/react-topology';

import BaseEdge from './BaseEdge';

import './ConnectsTo.scss';

type ConnectsToProps = {
  element: Edge;
  dragging?: boolean;
} & WithSourceDragProps &
  WithTargetDragProps &
  WithContextMenuProps;
const ConnectsTo: FC<ConnectsToProps> = (props) => (
  <BaseEdge
    className="odc-connects-to"
    endTerminalType={EdgeTerminalType.directionalAlt}
    {...props}
  />
);

export default observer(ConnectsTo);
