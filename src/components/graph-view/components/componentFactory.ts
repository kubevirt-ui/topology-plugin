import {
  ComponentFactory,
  DragObjectWithType,
  ModelKind,
  withDndDrop,
  withDragNode,
  withPanZoom,
  withSelection,
  withTargetDrag,
} from '@patternfly/react-topology';
import { createConnection } from '@topology-utils';
import { withEditReviewAccess } from '@topology-utils';

import { contextMenuActions, graphActionContext, groupActionContext } from '../../../actions';
import { withCreateConnector } from '../../../behavior';
import {
  TYPE_AGGREGATE_EDGE,
  TYPE_APPLICATION_GROUP,
  TYPE_CONNECTS_TO,
  TYPE_TRAFFIC_CONNECTOR,
  TYPE_WORKLOAD,
} from '../../../const';

import {
  applicationGroupDropTargetSpec,
  createConnectorCallback,
  edgeDragSourceSpec,
  graphDropTargetSpec,
  MOVE_CONNECTOR_DROP_TYPE,
  NodeComponentProps,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  withContextMenu,
} from './componentUtils';
import { AggregateEdge, ConnectsTo, CreateConnector, TrafficConnector } from './edges';
import GraphComponent from './GraphComponent';
import { Application } from './groups';
import { WorkloadNode } from './nodes';

import './ContextMenu.scss';

export const componentFactory: ComponentFactory = (kind, type) => {
  switch (type) {
    case TYPE_APPLICATION_GROUP:
      return withDndDrop(applicationGroupDropTargetSpec)(
        withDragNode(nodeDragSourceSpec(type, false, false))(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          withSelection({ controlled: true })(withContextMenu(groupActionContext)(Application)),
        ),
      );
    case TYPE_WORKLOAD:
      return withCreateConnector(
        createConnectorCallback(),
        CreateConnector,
      )(
        withDndDrop<
          any,
          any,
          { droppable?: boolean; hover?: boolean; canDrop?: boolean },
          NodeComponentProps
        >(nodeDropTargetSpec)(
          withEditReviewAccess('patch')(
            withDragNode(nodeDragSourceSpec(type))(
              withSelection({ controlled: true })(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                withContextMenu(contextMenuActions)(WorkloadNode),
              ),
            ),
          ),
        ),
      );
    case TYPE_CONNECTS_TO:
      return withTargetDrag<DragObjectWithType>(
        edgeDragSourceSpec(MOVE_CONNECTOR_DROP_TYPE, createConnection),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      )(withContextMenu(contextMenuActions)(ConnectsTo));
    case TYPE_AGGREGATE_EDGE:
      return AggregateEdge;
    case TYPE_TRAFFIC_CONNECTOR:
      return TrafficConnector;
    default:
      switch (kind) {
        case ModelKind.graph:
          return withDndDrop(graphDropTargetSpec)(
            withPanZoom()(
              withSelection({ controlled: true })(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                withContextMenu(graphActionContext)(GraphComponent),
              ),
            ),
          );
        default:
          return undefined;
      }
  }
};
