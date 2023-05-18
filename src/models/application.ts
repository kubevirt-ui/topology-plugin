import { K8sKind } from '@openshift-console/dynamic-plugin-sdk';

export const ApplicationModel: K8sKind = {
  id: 'application',
  kind: 'application',
  plural: 'applications',
  label: 'Application',
  labelPlural: 'Applications',
  abbr: 'A',
  apiGroup: '',
  apiVersion: '',
  namespaced: true,
  crd: false,
};
