import { useMemo } from 'react';

import { isEmpty } from '@topology-utils/common-utils';
import usePodsWatcher from '@topology-utils/hooks/usePodsWatcher/usePodsWatcher';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { getPodMetricStats, MetricStats } from './metricStats';
import { useOverviewMetrics } from './useOverviewMetrics';

export const useMetricStats = (resource: K8sResourceKind): MetricStats => {
  const metrics = useOverviewMetrics();
  const { podData, loaded } = usePodsWatcher(resource, resource.kind, resource.metadata.namespace);
  const memoryStats = useMemo(() => {
    if (isEmpty(metrics) || !loaded) {
      return null;
    }
    return getPodMetricStats(metrics, podData);
  }, [loaded, metrics, podData]);

  return memoryStats;
};
