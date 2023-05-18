import { K8sResourceCommon, MatchLabels, Selector } from '@openshift-console/dynamic-plugin-sdk';

export type ResourceQuotaKind = {
  spec?: {
    hard?: { [key: string]: string };
    scopes?: string[];
    scopeSelector?: {
      matchExpressions?: { scopeName: string; operator: string; values?: string[] }[];
    };
  };
  status?: {
    hard?: { [key: string]: string };
    used?: { [key: string]: string };
  };
} & K8sResourceCommon;

export type ClusterResourceQuotaKind = {
  spec?: {
    selector?: {
      labels?: Selector;
      annotations?: MatchLabels;
    };
    quota?: {
      hard?: { [key: string]: string };
      scopes?: string[];
      scopeSelector?: {
        matchExpressions?: { scopeName: string; operator: string; values?: string[] }[];
      };
    };
  };
  status?: {
    namespaces?: {
      namespace: string;
      status: { used?: { [key: string]: string }; hard?: { [key: string]: string } };
    }[];
    total?: { hard?: { [key: string]: string }; used?: { [key: string]: string } };
  };
} & K8sResourceCommon;

export type AppliedClusterResourceQuotaKind = ClusterResourceQuotaKind;
