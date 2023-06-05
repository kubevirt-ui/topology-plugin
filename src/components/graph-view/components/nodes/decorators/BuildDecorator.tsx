import React, { FC } from 'react';

import { BuildModel } from '@kubevirt-ui/kubevirt-api/console';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { Node } from '@patternfly/react-topology';
import { getResource, resourcePathFromModel } from '@topology-utils';
import { useBuildConfigsWatcher } from '@topology-utils/hooks/useBuildsConfigWatcher/useBuildsConfigWatcher';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import BuildDecoratorBubble from './BuildDecoratorBubble';

interface BuildDecoratorProps {
  element: Node;
  radius: number;
  x: number;
  y: number;
}

const BuildDecorator: FC<BuildDecoratorProps> = ({ element, radius, x, y }) => {
  const { t } = useTopologyTranslation();
  const resource = getResource(element);
  const { buildConfigs } = useBuildConfigsWatcher(resource);
  const build = buildConfigs?.[0]?.builds?.[0];

  if (!build) {
    return null;
  }

  const label = t('Build {{status}}', { status: build.status?.phase });

  const link = `${resourcePathFromModel(
    BuildModel,
    build.metadata.name,
    build.metadata.namespace,
  )}/logs`;

  return (
    <Tooltip content={label} position={TooltipPosition.left}>
      <BuildDecoratorBubble x={x} y={y} radius={radius} ariaLabel={label} href={link}>
        <Status status={build.status.phase} iconOnly noTooltip />
      </BuildDecoratorBubble>
    </Tooltip>
  );
};

export default BuildDecorator;
