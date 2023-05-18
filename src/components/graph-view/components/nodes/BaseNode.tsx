import React, { FC, ReactNode, useEffect, useState } from 'react';
import classNames from 'classnames';

import { K8sVerb, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import {
  BadgeLocation,
  DEFAULT_LAYER,
  DefaultNode,
  Layer,
  Node,
  NodeStatus,
  observer,
  ScaleDetailsLevel,
  StatusModifier,
  TOP_LAYER,
  useCombineRefs,
  WithContextMenuProps,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { getTopologyResourceObject } from '@topology-utils';

import { WithCreateConnectorProps } from '../../../../behavior';
import useHover from '../../../../behavior/useHover';
import { RESOURCE_NAME_TRUNCATE_LENGTH } from '../../../../const';
import { useSearchFilter } from '../../../../filters';
import { useShowLabel } from '../../../../filters/useShowLabel';

import { getKindStringAndAbbreviation } from './nodeUtils';

import '../../../svg/SvgResourceIcon.scss';
import './BaseNode.scss';

type BaseNodeProps = {
  className?: string;
  innerRadius?: number;
  icon?: string;
  kind?: string;
  labelIconClass?: string; // Icon to show in label
  labelIcon?: ReactNode;
  labelIconPadding?: number;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeClassName?: string;
  badgeLocation?: BadgeLocation;
  children?: ReactNode;
  attachments?: ReactNode;
  element: Node;
  hoverRef?: (node: Element) => () => void;
  dragging?: boolean;
  dropTarget?: boolean;
  canDrop?: boolean;
  createConnectorAccessVerb?: K8sVerb;
  nodeStatus?: NodeStatus;
  showStatusBackground?: boolean;
  alertVariant?: NodeStatus;
} & Partial<WithSelectionProps> &
  Partial<WithDragNodeProps> &
  Partial<WithDndDropProps> &
  Partial<WithContextMenuProps> &
  Partial<WithCreateConnectorProps>;

const BaseNode: FC<BaseNodeProps> = ({
  className,
  innerRadius,
  icon,
  kind,
  element,
  hoverRef,
  children,
  onShowCreateConnector,
  onContextMenu,
  contextMenuOpen,
  createConnectorAccessVerb = 'patch',
  createConnectorDrag,
  alertVariant,
  ...rest
}) => {
  const [hoverChange, setHoverChange] = useState<boolean>(false);
  const [hover, internalHoverRef] = useHover(200, 200, [hoverChange]);
  const nodeHoverRefs = useCombineRefs(internalHoverRef, hoverRef);
  const { width, height } = element.getDimensions();
  const cx = width / 2;
  const cy = height / 2;
  const resourceObj = getTopologyResourceObject(element.getData());
  const resourceModel = getK8sModel(resourceObj);
  const iconRadius = innerRadius * 0.9;
  const editAccess = useAccessReview({
    group: resourceModel?.apiGroup,
    verb: createConnectorAccessVerb,
    resource: resourceModel?.plural,
    name: resourceObj.metadata.name,
    namespace: resourceObj.metadata.namespace,
  });
  const [filtered] = useSearchFilter(element.getLabel(), resourceObj?.metadata?.labels);
  const showLabel = useShowLabel(hover || contextMenuOpen);
  const kindData = kind && getKindStringAndAbbreviation(kind);

  const detailsLevel = element.getController().getGraph().getDetailsLevel();
  const showDetails = hover || contextMenuOpen || detailsLevel !== ScaleDetailsLevel.low;
  const badgeClassName = kindData
    ? classNames('odc-resource-icon', {
        [`odc-resource-icon-${kindData.kindStr.toLowerCase()}`]: !kindData.kindColor,
      })
    : '';
  useEffect(() => {
    if (!createConnectorDrag) {
      setHoverChange((prev) => !prev);
    }
  }, [createConnectorDrag]);
  return (
    <Layer id={hover || contextMenuOpen ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={nodeHoverRefs} data-test-id={element.getLabel()}>
        <DefaultNode
          className={classNames(
            'odc-base-node',
            className,
            alertVariant && StatusModifier[alertVariant],
            {
              'is-filtered': filtered,
            },
          )}
          truncateLength={RESOURCE_NAME_TRUNCATE_LENGTH}
          element={element}
          showLabel={showLabel}
          scaleNode={(hover || contextMenuOpen) && detailsLevel !== ScaleDetailsLevel.high}
          onShowCreateConnector={
            editAccess && detailsLevel !== ScaleDetailsLevel.low && onShowCreateConnector
          }
          onContextMenu={onContextMenu}
          contextMenuOpen={contextMenuOpen}
          badge={kindData?.kindAbbr}
          badgeColor={kindData?.kindColor}
          badgeClassName={badgeClassName}
          showStatusBackground={!showDetails}
          {...rest}
        >
          <g data-test-id="base-node-handler">
            {icon && showDetails && (
              <>
                <circle
                  fill="var(--pf-global--palette--white)"
                  cx={cx}
                  cy={cy}
                  r={innerRadius + 6}
                />
                <image
                  x={cx - iconRadius}
                  y={cy - iconRadius}
                  width={iconRadius * 2}
                  height={iconRadius * 2}
                  xlinkHref={icon}
                />
              </>
            )}
            {showDetails && children}
          </g>
        </DefaultNode>
      </g>
    </Layer>
  );
};

export default observer(BaseNode);
