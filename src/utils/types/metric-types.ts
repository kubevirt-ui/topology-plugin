type MetricValuesByName = {
  [name: string]: number;
};

export type NamespaceMetrics = {
  cpu: MetricValuesByName;
  memory: MetricValuesByName;
};

export type MetricValuesByPod = {
  [podName: string]: number;
};

export type OverviewMetrics = {
  cpu?: MetricValuesByPod;
  memory?: MetricValuesByPod;
};
