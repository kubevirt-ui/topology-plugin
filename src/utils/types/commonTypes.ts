import { FunctionComponent, ReactElement } from 'react';

import { Alert, K8sResourceCommon, Selector } from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceCondition } from '@topology-utils/types/k8s-types';

import { JSONSchema7 } from './jsonSchema7Types';
import { PodTemplate } from './podTypes';

export type DeploymentCondition = {
  lastUpdateTime?: string;
} & K8sResourceCondition;

export type DeploymentKind = {
  spec: {
    minReadySeconds?: number;
    paused?: boolean;
    progressDeadlineSeconds?: number;
    replicas?: number;
    revisionHistoryLimit?: number;
    selector: Selector;
    strategy?: {
      rollingUpdate?: {
        maxSurge: number | string;
        maxUnavailable: number | string;
      };
      type?: string;
    };
    template: PodTemplate;
  };
  status?: {
    availableReplicas?: number;
    collisionCount?: number;
    conditions?: DeploymentCondition[];
    observedGeneration?: number;
    readyReplicas?: number;
    replicas?: number;
    unavailableReplicas?: number;
    updatedReplicas?: number;
  };
} & K8sResourceCommon;

export type RollingUpdate = { maxUnavailable?: number | string; maxSurge?: number | string };
export type DeploymentUpdateStrategy =
  | {
      type: 'Recreate';
    }
  | {
      type: 'RollingUpdate';
      rollingUpdate: RollingUpdate;
    };

export type CRDVersion = {
  name: string;
  served: boolean;
  storage: boolean;
  schema: {
    // NOTE: Actually a subset of JSONSchema, but using this type for convenience
    openAPIV3Schema: JSONSchema7;
  };
};

export type CustomResourceDefinitionKind = {
  spec: {
    group: string;
    versions: CRDVersion[];
    names: {
      kind: string;
      singular: string;
      plural: string;
      listKind: string;
      shortNames?: string[];
    };
    scope: 'Cluster' | 'Namespaced';
  };
  status?: {
    conditions?: K8sResourceCondition[];
  };
} & K8sResourceCommon;

export type RouteIngress = {
  conditions: K8sResourceCondition[];
  host?: string;
  routerCanonicalHostname?: string;
  routerName?: string;
  wildcardPolicy?: string;
};

export type Alerts = {
  data: Alert[];
  loaded: boolean;
  loadError?: string | Error;
};

export enum FLAGS {
  AUTH_ENABLED = 'AUTH_ENABLED',
  PROMETHEUS = 'PROMETHEUS',
  OPENSHIFT = 'OPENSHIFT',
  MONITORING = 'MONITORING',
  CAN_GET_NS = 'CAN_GET_NS',
  CAN_LIST_NS = 'CAN_LIST_NS',
  CAN_LIST_NODE = 'CAN_LIST_NODE',
  CAN_LIST_PV = 'CAN_LIST_PV',
  CAN_LIST_CRD = 'CAN_LIST_CRD',
  CAN_LIST_USERS = 'CAN_LIST_USERS',
  CAN_LIST_GROUPS = 'CAN_LIST_GROUPS',
  CAN_LIST_OPERATOR_GROUP = 'CAN_LIST_OPERATOR_GROUP',
  CAN_LIST_PACKAGE_MANIFEST = 'CAN_LIST_PACKAGE_MANIFEST',
  CAN_CREATE_PROJECT = 'CAN_CREATE_PROJECT',
  CAN_LIST_VSC = 'CAN_LIST_VSC',
  CLUSTER_AUTOSCALER = 'CLUSTER_AUTOSCALER',
  SHOW_OPENSHIFT_START_GUIDE = 'SHOW_OPENSHIFT_START_GUIDE',
  CLUSTER_API = 'CLUSTER_API',
  CLUSTER_VERSION = 'CLUSTER_VERSION',
  MACHINE_CONFIG = 'MACHINE_CONFIG',
  MACHINE_AUTOSCALER = 'MACHINE_AUTOSCALER',
  MACHINE_HEALTH_CHECK = 'MACHINE_HEALTH_CHECK',
  CONSOLE_LINK = 'CONSOLE_LINK',
  CONSOLE_CLI_DOWNLOAD = 'CONSOLE_CLI_DOWNLOAD',
  CONSOLE_NOTIFICATION = 'CONSOLE_NOTIFICATION',
  CONSOLE_EXTERNAL_LOG_LINK = 'CONSOLE_EXTERNAL_LOG_LINK',
  CONSOLE_YAML_SAMPLE = 'CONSOLE_YAML_SAMPLE',
}

export type Diff<T, K> = Omit<T, keyof K>;

export enum NamespacedPageVariants {
  light = 'light',
  default = 'default',
}

export type Tab = {
  name: string;
  component: FunctionComponent<{}> | ReactElement; // eslint-disable-line @typescript-eslint/ban-types
};
