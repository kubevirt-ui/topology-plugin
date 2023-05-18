import React, { FC, useMemo } from 'react';

import { modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import {
  Node,
  observer,
  useDndDrop,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { getTopologyResourceObject } from '@topology-utils';
import { getRelationshipProvider } from '@topology-utils/relationship-provider-utils';

import * as openshiftImg from '../../../../../images/logos/openshift.svg';
import { WithCreateConnectorProps } from '../../../../behavior';

import BaseNode from './BaseNode';

type BindableNodeProps = {
  element: Node;
  tooltipLabel?: string;
} & WithSelectionProps &
  WithDragNodeProps &
  WithContextMenuProps &
  WithCreateConnectorProps;

const BindableNode: FC<BindableNodeProps> = ({
  element,
  selected,
  onSelect,
  tooltipLabel,
  ...rest
}) => {
  const spec = useMemo(() => getRelationshipProvider(), []);
  const { width, height } = element.getBounds();
  const iconRadius = Math.min(width, height) * 0.25;
  const [dndDropProps, dndDropRef] = useDndDrop(spec, { element, ...rest });
  const resourceObj = getTopologyResourceObject(element.getData());
  const resourceModel = getK8sModel(resourceObj);
  const iconData = element.getData()?.data?.icon || openshiftImg;
  const kind = resourceModel && modelToRef(resourceModel);

  return (
    <BaseNode
      className="bindable-node"
      tooltipLabel={tooltipLabel}
      onSelect={onSelect}
      icon={iconData}
      kind={kind}
      innerRadius={iconRadius}
      selected={selected}
      element={element}
      {...rest}
      dndDropRef={dndDropRef}
      {...dndDropProps}
    />
  );
};

export default observer(BindableNode);
