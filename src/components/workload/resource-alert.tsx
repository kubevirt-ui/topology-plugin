import React from 'react';
import { Link } from 'react-router-dom';

import {
  DaemonSetModel,
  DeploymentConfigModel,
  DeploymentModel,
  modelToRef,
  ServiceModel as KnativeServiceModel,
  StatefulSetModel,
} from '@kubevirt-ui/kubevirt-api/console';
import {
  Action,
  DetailsResourceAlertContent,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { AlertActionLink } from '@patternfly/react-core';
import { GraphElement } from '@patternfly/react-topology';
import { DeploymentActionFactory } from '@topology-utils/deployment-factory';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceCondition } from '@topology-utils/types/k8s-types';

import { getResource } from '../../utils';
import useTelemetry from '../../utils/hooks/useTelemetry/useTelemetry';
import { getReferenceForResource } from '../../utils/k8s-utils';

const addHealthChecksRefs = [
  modelToRef(DeploymentConfigModel),
  modelToRef(DeploymentModel),
  modelToRef(DaemonSetModel),
  modelToRef(StatefulSetModel),
  modelToRef(KnativeServiceModel),
];

export const useHealthChecksAlert = (element: GraphElement): DetailsResourceAlertContent | null => {
  const resource = getResource(element);
  const kind = resource?.kind;
  const name = resource?.metadata?.name;
  const namespace = resource?.metadata?.namespace;
  const { t } = useTopologyTranslation();
  const kindForCRDResource = resource ? getReferenceForResource(resource) : undefined;
  const resourceModel = kindForCRDResource ? getK8sModel(kindForCRDResource) : undefined;
  const resourceKind = resourceModel?.crd ? kindForCRDResource : kind;

  const [canAddHealthChecks, canAddHealthChecksLoading] = useAccessReview({
    group: resourceModel?.apiGroup,
    resource: resourceModel?.plural,
    namespace,
    name,
    verb: 'update',
  });

  if (!resource || !addHealthChecksRefs.includes(getReferenceForResource(resource))) {
    return null;
  }

  const containers = resource?.spec?.template?.spec?.containers;
  const containersName = containers?.map((container) => container.name);
  const healthCheckAdded = containers?.every(
    (container) => container.readinessProbe || container.livenessProbe || container.startupProbe,
  );

  const showAlert = !healthCheckAdded && canAddHealthChecks && !canAddHealthChecksLoading;

  const addHealthChecksLink = `/k8s/ns/${namespace}/${resourceKind}/${name}/containers/${containersName[0]}/health-checks`;

  const alertMessage =
    containersName?.length > 1
      ? t('Not all Containers have health checks to ensure your application is running correctly.')
      : t(
          'Container {{containersName}} does not have health checks to ensure your application is running correctly.',
          { containersName },
        );

  return showAlert
    ? {
        title: t('Health checks'),
        dismissible: true,
        content: (
          <>
            {alertMessage} <Link to={addHealthChecksLink}>{t('Add health checks')}</Link>
          </>
        ),
        variant: 'default',
      }
    : null;
};

export const useResourceQuotaAlert = (element: GraphElement): DetailsResourceAlertContent => {
  const { t } = useTopologyTranslation();
  const fireTelemetryEvent = useTelemetry();
  const resource = getResource(element);
  const name = resource?.metadata?.name;
  const namespace = resource?.metadata?.namespace;

  const [canUseAlertAction, canUseAlertActionLoading] = useAccessReview({
    group: DeploymentModel.apiGroup,
    resource: DeploymentModel.plural,
    namespace,
    name,
    verb: 'patch',
  });

  if (!resource || modelToRef(DeploymentModel) !== getReferenceForResource(resource)) return null;

  const statusConditions: K8sResourceCondition[] = resource.status?.conditions ?? [];
  const replicaFailure = statusConditions.find((condition) => condition.type === 'ReplicaFailure');
  const replicaFailureMsg: string = replicaFailure?.message ?? '';
  const resourceQuotaRequested = replicaFailureMsg.split(':')?.[3] ?? '';

  let alertAction: Action;
  if (resourceQuotaRequested.includes('limits')) {
    alertAction = DeploymentActionFactory.EditResourceLimits(DeploymentModel, resource);
  } else if (resourceQuotaRequested.includes('pods')) {
    alertAction = CommonActionFactory.ModifyCount(DeploymentModel, resource);
  }

  const showAlertActionLink = alertAction && canUseAlertAction && !canUseAlertActionLoading;

  const alertActionCta = alertAction?.cta as () => void;

  const onAlertActionClick = () => {
    fireTelemetryEvent('Resource Quota Warning Alert Action Link Clicked');
    alertActionCta();
  };

  const alertActionLink = showAlertActionLink ? (
    <AlertActionLink onClick={onAlertActionClick}>{alertAction.label as string}</AlertActionLink>
  ) : undefined;

  return replicaFailure
    ? {
        title: t('Resource Quotas'),
        dismissible: true,
        content: replicaFailureMsg,
        actionLinks: alertActionLink,
        variant: 'warning',
      }
    : null;
};
