import sortBy from 'lodash.sortby';

import {
  Alert,
  AlertSeverity,
  AlertStates,
  consoleFetchJSON,
  PrometheusEndpoint,
  Rule,
} from '@openshift-console/dynamic-plugin-sdk';
import { PROMETHEUS_TENANCY_BASE_PATH } from '@topology-utils/hooks/usePrometheusRulesPoll/utils/const';
import { getPrometheusURL } from '@topology-utils/hooks/usePrometheusRulesPoll/utils/utils';
import { getAlertsAndRules } from '@topology-utils/prometheus-utils';

type ListOrder = (number | string)[];

// Severity sort order is "critical" > "warning" > (anything else in A-Z order) > "none"
export const alertSeverityOrder = (alert: Alert | Rule): ListOrder => {
  const { severity } = alert.labels;
  const order: number =
    {
      [AlertSeverity.Critical]: 1,
      [AlertSeverity.Warning]: 2,
      [AlertSeverity.None]: 4,
    }[severity] ?? 3;
  return [order, severity];
};

export const sortMonitoringAlerts = (alerts: Alert[]): Alert[] =>
  sortBy(alerts, alertSeverityOrder) as Alert[];

export const getSeverityAlertType = (alerts: Alert[]): AlertSeverity => {
  const sortedAlerts = sortMonitoringAlerts(alerts);
  return (sortedAlerts[0]?.labels?.severity as AlertSeverity) ?? AlertSeverity.None;
};

export const getFiringAlerts = (alerts: Alert[]): Alert[] =>
  alerts.filter((alert) => alert.state === AlertStates.Firing);

export const shouldHideMonitoringAlertDecorator = (severityAlertType: AlertSeverity): boolean =>
  severityAlertType === AlertSeverity.None || severityAlertType === AlertSeverity.Info;

export const fetchMonitoringAlerts = (namespace: string): Promise<Alert[]> => {
  if (!PROMETHEUS_TENANCY_BASE_PATH) {
    return Promise.resolve(null);
  }
  const url = getPrometheusURL({
    endpoint: PrometheusEndpoint.RULES,
    namespace,
  });
  return consoleFetchJSON(url).then(({ data }) => {
    const { alerts } = getAlertsAndRules(data);
    return alerts;
  });
};
