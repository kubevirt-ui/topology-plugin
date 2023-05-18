import get from 'lodash.get';
import { murmur3 } from 'murmurhash-js';

import { Alert, PrometheusRule, Rule } from '@openshift-console/dynamic-plugin-sdk';
import { PrometheusRulesResponse } from '@topology-utils/types/prometheus-types';

export const getAlertsAndRules = (
  data: PrometheusRulesResponse['data'],
): { alerts: Alert[]; rules: Rule[] } => {
  // Flatten the rules data to make it easier to work with, discard non-alerting rules since those
  // are the only ones we will be using and add a unique ID to each rule.
  const groups = get(data, 'groups') as PrometheusRulesResponse['data']['groups'];
  const rules = groups?.flatMap((g) => {
    const addID = (r: PrometheusRule): Rule => {
      const key = [
        g.file,
        g.name,
        r.name,
        r.duration,
        r.query,
        ...Object.entries(r.labels)?.map((k, v) => `${k}=${v}`),
      ].join(',');
      return { ...r, id: String(murmur3(key, 'monitoring-salt')) };
    };

    return g.rules?.filter((rule) => rule?.type === 'alerting').map(addID);
  });

  // Add `rule` object to each alert
  const alerts = rules?.flatMap((rule) => rule.alerts.map((a) => ({ rule, ...a })));

  return { alerts, rules };
};
