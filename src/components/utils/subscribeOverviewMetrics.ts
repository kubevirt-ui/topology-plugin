import { isEmpty } from '@topology-utils/common-utils';
import { PROMETHEUS_TENANCY_BASE_PATH } from '@topology-utils/hooks/usePrometheusRulesPoll/utils/const';
import { fetchOverviewMetrics } from '@topology-utils/metrics-utils';
import { OverviewMetrics } from '@topology-utils/types/metric-types';

import { METRICS_FAILURE_CODES, METRICS_POLL_INTERVAL } from '../../const';

type UnsubscribeCallback = () => void;

export const subscribeOverviewMetrics = (
  namespace: string,
  metrics: OverviewMetrics,
  updateMetrics: (metrics: OverviewMetrics) => void,
  interval: number = METRICS_POLL_INTERVAL,
): UnsubscribeCallback => {
  let metricsInterval = null;

  const fetchMetrics = () => {
    if (!PROMETHEUS_TENANCY_BASE_PATH) {
      return;
    }
    fetchOverviewMetrics(namespace)
      .then((updatedMetrics) => {
        updateMetrics(updatedMetrics);
      })
      .catch((res) => {
        const status = res?.response?.status;
        // eslint-disable-next-line no-console
        console.error('Could not fetch metrics, status:', status);
        // Don't retry on some status codes unless a previous request succeeded.
        if (METRICS_FAILURE_CODES?.includes(status) && isEmpty(metrics)) {
          throw new Error(`Could not fetch metrics, status: ${status}`);
        }
      })
      .then(() => {
        metricsInterval = setTimeout(fetchMetrics, interval);
      })
      .catch((e) => {
        console.error('Failed to fetch metrics', e); // eslint-disable-line no-console
      });
  };

  fetchMetrics();

  return () => {
    clearTimeout(metricsInterval);
  };
};
