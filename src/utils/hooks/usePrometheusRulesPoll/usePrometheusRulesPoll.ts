import { PrometheusEndpoint } from '@openshift-console/dynamic-plugin-sdk';
import { useURLPoll } from '@openshift-console/dynamic-plugin-sdk-internal';
import { getPrometheusURL } from '@topology-utils/hooks/usePrometheusRulesPoll/utils/utils';
import { PrometheusRulesResponse } from '@topology-utils/types/prometheus-types';

type PrometheusPollProps = {
  delay?: number;
  namespace?: string;
};

type UsePrometheusRulesPoll = (
  props: PrometheusPollProps,
) => [PrometheusRulesResponse, any, boolean];

const usePrometheusRulesPoll: UsePrometheusRulesPoll = ({ delay, namespace }) => {
  const url = getPrometheusURL({
    endpoint: PrometheusEndpoint.RULES,
    namespace,
  });

  return useURLPoll<PrometheusRulesResponse>(url, delay, namespace);
};

export default usePrometheusRulesPoll;
