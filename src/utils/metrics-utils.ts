import assign from 'lodash.assign';
import map from 'lodash.map';

import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';
import { PROMETHEUS_TENANCY_BASE_PATH } from '@topology-utils/hooks/usePrometheusRulesPoll/utils/const';
import { MetricValuesByPod, OverviewMetrics } from '@topology-utils/types/metric-types';

export const fetchOverviewMetrics = (
  namespace: string,
): Promise<{ [key: string]: MetricValuesByPod }> => {
  if (!PROMETHEUS_TENANCY_BASE_PATH) {
    return Promise.resolve(null);
  }

  const queries = {
    memory: `sum(container_memory_working_set_bytes{namespace='${namespace}',container='',pod!=''}) BY (pod, namespace)`,
    cpu: `pod:container_cpu_usage:sum{namespace="${namespace}"}`,
  };

  const promises = map(queries, (query, name) => {
    const url = `${PROMETHEUS_TENANCY_BASE_PATH}/api/v1/query?namespace=${namespace}&query=${encodeURIComponent(
      query,
    )}`;
    return consoleFetchJSON(url).then(({ data: { result } }) => {
      const byPod: MetricValuesByPod = result.reduce((acc, { metric, value }) => {
        acc[metric.pod] = Number(value[1]);
        return acc;
      }, {});
      return { [name]: byPod };
    });
  });

  return Promise.all(promises).then((data) => {
    return data.reduce((acc: OverviewMetrics, metric): OverviewMetrics => assign(acc, metric), {});
  });
};
