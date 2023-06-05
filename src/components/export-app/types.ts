import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';

export type ExportAppUserSettings = {
  [key: string]: {
    groupVersionKind: K8sGroupVersionKind;
    uid: string;
    name: string;
    namespace: string;
  };
};
