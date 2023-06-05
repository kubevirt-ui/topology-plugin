import React, { FC, memo } from 'react';

import { DataListCell } from '@patternfly/react-core';
import { Node } from '@patternfly/react-topology';
import { getTopologyResourceObject } from '@topology-utils';
import { useMetricStats } from '@topology-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { formatCores } from '@topology-utils/humanize';

import MetricsTooltip from './MetricsTooltip';

import './MetricsCell.scss';

type CpuCellComponentProps = {
  cpuByPod: any;
  totalCores: number;
};

const CpuCellComponent: FC<CpuCellComponentProps> = memo(({ cpuByPod, totalCores }) => {
  const { t } = useTopologyTranslation();
  return (
    <div className="odc-topology-list-view__metrics-cell__detail--cpu">
      <MetricsTooltip metricLabel={t('CPU')} byPod={cpuByPod}>
        <span>
          <span className="odc-topology-list-view__metrics-cell__metric-value">
            {formatCores(totalCores)}
          </span>
          &nbsp;
          <span className="odc-topology-list-view__metrics-cell__metric-unit">cores</span>
        </span>
      </MetricsTooltip>
    </div>
  );
});

type CpuCellProps = {
  item: Node;
};

const CpuCell: FC<CpuCellProps> = ({ item }) => {
  const resource = getTopologyResourceObject(item.getData());
  const memoryStats = useMetricStats(resource);

  return (
    <DataListCell id={`${item.getId()}_metrics`}>
      {!memoryStats || !memoryStats.totalBytes || !memoryStats.totalCores ? null : (
        <CpuCellComponent cpuByPod={memoryStats.cpuByPod} totalCores={memoryStats.totalCores} />
      )}
    </DataListCell>
  );
};

export { CpuCell, CpuCellComponent };
