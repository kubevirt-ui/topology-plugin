import { K8sResourceKind } from '@topology-utils/types/k8s-types';

type ResourceItem = {
  [key: string]: K8sResourceKind[];
};

export type ResourceUtil = (obj: K8sResourceKind, props: any) => ResourceItem | undefined;

export const MONITORABLE_KINDS = ['Deployment', 'DeploymentConfig', 'StatefulSet', 'DaemonSet'];

export interface ResourceType {
  request: number | string;
  requestUnit: string;
  defaultRequestUnit: string;
  limit: number | string;
  limitUnit: string;
  defaultLimitUnit: string;
}
export interface LimitsData {
  cpu: ResourceType;
  memory: ResourceType;
}
