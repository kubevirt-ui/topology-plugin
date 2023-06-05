import React, { FC, Fragment } from 'react';
import orderBy from 'lodash.orderby';

import { Tooltip } from '@patternfly/react-core';
import { isEmpty } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { truncateMiddle } from '../../../utils/truncate-utils';
import useIsMobile from '../../page/TopologyPageToolbar/hooks/useIsMobile/useIsMobile';

type MetricsTooltipProps = {
  metricLabel: string;
  byPod: {
    formattedValue: string;
    name: string;
    value: number;
  }[];
};

const MetricsTooltip: FC<MetricsTooltipProps> = ({ metricLabel, byPod, children }) => {
  const { t } = useTopologyTranslation();
  const isMobile = useIsMobile();

  // Disable the tooltip on mobile since a touch also opens the sidebar, which
  // immediately covers the tooltip content.
  if (isMobile) {
    return <>{children}</>;
  }

  const sortedMetrics = orderBy(byPod, ['value', 'name'], ['desc', 'asc']);
  const content: any[] = isEmpty(sortedMetrics)
    ? [
        <Fragment key="no-metrics">
          {t('No {{metricLabel}} metrics available.', { metricLabel })}
        </Fragment>,
      ]
    : [
        <div className="odc-topology-list-view__metrics-cell__tooltip-title" key="#title">
          {t('{{metricLabel}} usage by Pod', { metricLabel })}
        </div>,
      ].concat(
        sortedMetrics.map(({ name, formattedValue }) => (
          <div key={name} className="odc-topology-list-view__metrics-cell__metric-tooltip">
            <div className="odc-topology-list-view__metrics-cell__tooltip-name">
              <span className="no-wrap">{truncateMiddle(name)}</span>
            </div>
            <div className="odc-topology-list-view__metrics-cell__metric-tooltip-value">
              {formattedValue}
            </div>
          </div>
        )),
      );

  const keepLines = 6;
  // Don't remove a single line to show a "1 other" message since there's space to show the last pod in that case.
  // Make sure we always remove at least 2 lines if we truncate.
  if (content.length > keepLines + 1) {
    const numRemoved = content.length - keepLines;
    content.splice(
      keepLines,
      numRemoved,
      <div key="#removed-pods">and {numRemoved} other pods</div>,
    );
  }

  return (
    <Tooltip content={content} distance={15}>
      <>{children}</>
    </Tooltip>
  );
};

export default MetricsTooltip;
