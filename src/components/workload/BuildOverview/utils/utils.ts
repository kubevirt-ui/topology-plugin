import get from 'lodash.get';
import pick from 'lodash.pick';

import { BuildConfigModel } from '@kubevirt-ui/kubevirt-api/console';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { getName } from '@topology-utils/common-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

export const getJenkinsLogURL = (resource: K8sResourceKind): string =>
  get(resource, ['metadata', 'annotations', 'openshift.io/jenkins-console-log-url']);

export const MAX_VISIBLE = 3;

const createBuildRequest = (obj, model, subresource) => {
  const req = {
    kind: 'BuildRequest',
    apiVersion: 'build.openshift.io/v1',
    metadata: pick(obj.metadata, ['name', 'namespace']),
  };

  return k8sCreate({ model, data: req, name: getName(obj), path: subresource });
};

export const startBuild = (buildConfig) => {
  return createBuildRequest(buildConfig, BuildConfigModel, 'instantiate');
};
