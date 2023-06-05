import React, { FC, useMemo } from 'react';
import classNames from 'classnames';

import { useAccessReview, useFlag } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import {
  CREATE_CONNECTOR_DROP_TYPE,
  DropTargetSpec,
  GraphElement,
  isEdge,
  Node,
  observer,
  useDndDrop,
  WithContextMenuProps,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { getResource } from '@topology-utils';

import {
  canDropEdgeOnNode,
  highlightNode,
  NodeComponentProps,
  nodesEdgeIsDragging,
} from '../../components/graph-view';
import { getKindStringAndAbbreviation } from '../../components/graph-view/components/nodes/nodeUtils';
import { ALLOW_SERVICE_BINDING_FLAG } from '../../const';

import OperatorBackedServiceGroup from './OperatorBackedServiceGroup';
import OperatorBackedServiceNode from './OperatorBackedServiceNode';

import './OperatorBackedService.scss';

export const obsDropTargetSpec = (
  serviceBinding: boolean,
): DropTargetSpec<
  GraphElement,
  any,
  { canDrop: boolean; dropTarget: boolean; edgeDragging: boolean },
  NodeComponentProps
> => ({
  accept: [CREATE_CONNECTOR_DROP_TYPE],
  canDrop: (item, monitor, props) => {
    if (!serviceBinding) {
      return false;
    }

    if (isEdge(item)) {
      return canDropEdgeOnNode(monitor.getOperation()?.type, item, props.element);
    }
    if (!props.element || item === props.element) {
      return false;
    }
    return !props.element.getTargetEdges().find((e) => e.getSource() === item);
  },
  collect: (monitor, props) => {
    return {
      canDrop: serviceBinding && highlightNode(monitor, props.element),
      dropTarget: monitor.isOver({ shallow: true }),
      edgeDragging: nodesEdgeIsDragging(monitor, props),
    };
  },
  dropHint: 'createServiceBinding',
});

type OperatorBackedServiceProps = {
  element: Node;
} & WithSelectionProps &
  WithDndDropProps &
  WithDragNodeProps &
  WithContextMenuProps;

const OperatorBackedService: FC<OperatorBackedServiceProps> = ({ element, ...rest }) => {
  const serviceBindingAllowed = useFlag(ALLOW_SERVICE_BINDING_FLAG);
  const spec = useMemo(() => obsDropTargetSpec(serviceBindingAllowed), [serviceBindingAllowed]);
  const [dndDropProps, dndDropRef] = useDndDrop(spec, { element, ...rest });
  const resourceObj = getResource(element);
  const resourceModel = resourceObj ? getK8sModel(resourceObj) : null;
  const [canEdit] = useAccessReview({
    group: resourceModel?.apiGroup,
    verb: 'patch',
    resource: resourceModel?.plural,
    name: resourceObj?.metadata.name,
    namespace: resourceObj?.metadata.namespace,
  });
  const { data } = element.getData();
  const ownerReferenceKind = referenceFor({ kind: data.operatorKind, apiVersion: data.apiVersion });
  const { kindAbbr, kindStr, kindColor } = getKindStringAndAbbreviation(ownerReferenceKind);
  const badgeClassName = classNames('odc-resource-icon', {
    [`odc-resource-icon-${kindStr.toLowerCase()}`]: !kindColor,
  });

  if (element.isCollapsed()) {
    return (
      <OperatorBackedServiceNode
        {...rest}
        element={element}
        dndDropRef={dndDropRef}
        editAccess={canEdit}
        badge={kindAbbr}
        badgeColor={kindColor}
        badgeClassName={badgeClassName}
        {...dndDropProps}
      />
    );
  }

  return (
    <OperatorBackedServiceGroup
      {...rest}
      element={element}
      dndDropRef={dndDropRef}
      editAccess={canEdit}
      badge={kindAbbr}
      badgeColor={kindColor}
      badgeClassName={badgeClassName}
      {...dndDropProps}
    />
  );
};

export default observer(OperatorBackedService);
