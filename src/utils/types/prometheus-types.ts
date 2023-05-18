import { PrometheusRule } from '@openshift-console/dynamic-plugin-sdk';

type Group = {
  rules: PrometheusRule[];
  file: string;
  name: string;
};

export type PrometheusRulesResponse = {
  data: {
    groups: Group[];
  };
  status: string;
};
