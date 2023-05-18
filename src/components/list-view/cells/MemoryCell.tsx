import React, { FC, memo } from 'react';

import { DataListCell } from '@patternfly/react-core';
import { Node } from '@patternfly/react-topology';
import { getTopologyResourceObject } from '@topology-utils';
import { useMetricStats } from '@topology-utils';
import { formatBytesAsMiB } from '@topology-utils/humanize';

import MetricsTooltip from './MetricsTooltip';

import './MemoryCell.scss';

type MemoryCellProps = {
  item: Node;
};

type MemoryCellComponentProps = {
  totalBytes: number;
  memoryByPod: any;
};

const MemoryCellComponent: FC<MemoryCellComponentProps> = memo(({ totalBytes, memoryByPod }) => (
  <div className="odc-topology-list-view__metrics-cell__detail--memory">
    <MetricsTooltip metricLabel="Memory" byPod={memoryByPod}>
      <span>
        <span className="odc-topology-list-view__metrics-cell__metric-value">
          {formatBytesAsMiB(totalBytes)}
        </span>
        &nbsp;
        <span className="odc-topology-list-view__metrics-cell__metric-unit">MiB</span>
      </span>
    </MetricsTooltip>
  </div>
));

const MemoryCell: FC<MemoryCellProps> = ({ item }) => {
  const resource = getTopologyResourceObject(item.getData());
  const memoryStats = useMetricStats(resource);

  return (
    <DataListCell id={`${item.getId()}_memory`}>
      {!memoryStats || !memoryStats.totalBytes || !memoryStats.totalCores ? null : (
        <MemoryCellComponent
          totalBytes={memoryStats.totalBytes}
          memoryByPod={memoryStats.memoryByPod}
        />
      )}
    </DataListCell>
  );
};

export { MemoryCell, MemoryCellComponent };
