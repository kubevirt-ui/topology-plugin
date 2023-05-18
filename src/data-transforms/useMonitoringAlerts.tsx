import { useMemo } from 'react';

import { Alert } from '@openshift-console/dynamic-plugin-sdk';
import { useDeepCompareMemoize } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useDeepCompareMemoize';
import usePrometheusRulesPoll from '@topology-utils/hooks/usePrometheusRulesPoll/usePrometheusRulesPoll';
import { getAlertsAndRules } from '@topology-utils/prometheus-utils';

const useMonitoringAlerts = (
  namespace: string,
): {
  data: Alert[];
  loaded: boolean;
  loadError: string;
} => {
  const [alertsResponse, alertsError, alertsLoading] = usePrometheusRulesPoll({ namespace });
  const response = useMemo(() => {
    let alertData;
    if (!alertsLoading && !alertsError) {
      alertData = getAlertsAndRules(alertsResponse?.data).alerts;

      // Don't update due to time changes
      alertData.forEach((alert) => {
        delete alert.activeAt;
        if (alert.rule) {
          delete alert.rule.evaluationTime;
          delete alert.rule.lastEvaluation;
          alert.rule.alerts &&
            alert.rule.alerts.forEach((ruleAlert) => {
              delete ruleAlert.activeAt;
            });
        }
      });
    }
    return { data: alertData, loaded: !alertsLoading, loadError: alertsError };
  }, [alertsError, alertsLoading, alertsResponse]);

  return useDeepCompareMemoize(response);
};

export default useMonitoringAlerts;
