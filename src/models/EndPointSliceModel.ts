import { K8sKind, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export const EndPointSliceModel: K8sKind = {
  kind: 'EndpointSlice',
  label: 'EndpointSlice',
  labelPlural: 'EndpointSlices',
  apiGroup: 'discovery.k8s.io',
  apiVersion: 'v1',
  abbr: 'EPS',
  namespaced: true,
  plural: 'endpointslices',
};

type EndpointSlice = {
  kind?: string;
  name?: string;
  namespace?: string;
  uid?: string;
};

export type EndpointSliceKind = {
  endpoints?: EndpointSlice[];
} & K8sResourceCommon;
