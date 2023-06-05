import i18next from 'i18next';
import { configureUpdateStrategyModal } from 'src/components/modals/ConfigureUpdateStrategyModal/ConfigureUpdateStrategyModal';

import { DeploymentConfigModel, modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { Action, k8sCreate, K8sKind } from '@openshift-console/dynamic-plugin-sdk';
import { k8sPatchResource } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s';
import { asAccessReview } from '@topology-utils/resources/shared';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import errorModal from '../components/modals/ErrorModal';
import { resourceLimitsModal } from '../components/modals/ResourceLimitsModal';
import { serviceBindingModal } from '../components/modals/ServiceBindingModal';
import { ServiceBindingModel } from '../models/ServiceBindingModel';

import { getName, getNamespace } from './common-utils';
import { resourceObjPath } from './resource-link-utils';
import { togglePaused } from './workload-pause-utils';

export type ResourceActionCreator = (
  kind: K8sKind,
  obj: K8sResourceKind,
  relatedResource?: K8sResourceKind,
  message?: JSX.Element,
) => Action;

export type ResourceActionFactory = { [name: string]: ResourceActionCreator };

const deploymentConfigRollout = (dc: K8sResourceKind): Promise<K8sResourceKind> => {
  const req = {
    kind: 'DeploymentRequest',
    apiVersion: 'apps.openshift.io/v1',
    name: dc.metadata.name,
    latest: true,
    force: true,
  };
  return k8sCreate({
    model: DeploymentConfigModel,
    data: req,
    name: getName(dc),
    ns: getNamespace(dc),
    path: 'instantiate',
  });
};

const restartRollout = (model: K8sKind, obj: K8sResourceKind) => {
  const patch = [];
  if (!('annotations' in obj.spec.template.metadata)) {
    patch.push({
      path: '/spec/template/metadata/annotations',
      op: 'add',
      value: {},
    });
  }
  patch.push({
    path: '/spec/template/metadata/annotations/openshift.openshift.io~1restartedAt',
    op: 'add',
    value: new Date(),
  });

  return k8sPatchResource({
    model,
    resource: obj,
    data: patch,
  });
};

export const DeploymentActionFactory: ResourceActionFactory = {
  EditDeployment: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: `edit-deployment`,
    label: i18next.t('plugin__topology-pluginEdit {{kind}}', { kind: kind.kind }),
    cta: {
      href: `${resourceObjPath(obj, kind.crd ? modelToRef(kind) : kind.kind)}/form`,
    },
    // TODO: Fallback to "View YAML"? We might want a similar fallback for annotations, labels, etc.
    accessReview: asAccessReview(kind, obj, 'update'),
  }),
  UpdateStrategy: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'edit-update-strategy',
    label: i18next.t('plugin__topology-pluginEdit update strategy'),
    cta: () => configureUpdateStrategyModal({ deployment: obj }),
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      name: obj.metadata.name,
      namespace: obj.metadata.namespace,
      verb: 'patch',
    },
  }),
  PauseRollout: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'pause-rollout',
    label: obj.spec.paused
      ? i18next.t('plugin__topology-pluginResume rollouts')
      : i18next.t('plugin__topology-pluginPause rollouts'),
    cta: () => togglePaused(kind, obj).catch((err) => errorModal({ error: err.message })),
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      name: obj.metadata.name,
      namespace: obj.metadata.namespace,
      verb: 'patch',
    },
  }),
  RestartRollout: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'restart-rollout',
    label: i18next.t('plugin__topology-pluginRestart rollout'),
    cta: () => restartRollout(kind, obj).catch((err) => errorModal({ error: err.message })),
    disabled: obj.spec.paused || false,
    disabledTooltip: 'The deployment is paused and cannot be restarted.',
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      name: obj.metadata.name,
      namespace: obj.metadata.namespace,
      verb: 'patch',
    },
  }),
  StartDCRollout: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'start-rollout',
    label: i18next.t('plugin__topology-pluginStart rollout'),
    cta: () =>
      deploymentConfigRollout(obj).catch((err) => {
        const error = err.message;
        errorModal({ error });
      }),
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      subresource: 'instantiate',
      name: obj.metadata.name,
      namespace: obj.metadata.namespace,
      verb: 'create',
    },
  }),
  EditResourceLimits: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'edit-resource-limits',
    label: i18next.t('plugin__topology-pluginEdit resource limits'),
    cta: () =>
      resourceLimitsModal({
        model: kind,
        resource: obj,
      }),
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      name: obj.metadata.name,
      namespace: obj.metadata.namespace,
      verb: 'patch',
    },
  }),
  CreateServiceBinding: (kind: K8sKind, obj: K8sResourceKind): Action => ({
    id: 'create-service-binding',
    label: i18next.t('plugin__topology-pluginCreate Service Binding'),
    cta: () =>
      serviceBindingModal({
        model: kind,
        source: obj,
      }),
    accessReview: asAccessReview(ServiceBindingModel, obj, 'create'),
  }),
};
