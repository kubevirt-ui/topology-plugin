import React, { FC } from 'react';

import { DeploymentConfigModel } from '@kubevirt-ui/kubevirt-api/console';
import { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { getResource } from '../../utils';
import DeploymentConfigDetailsList from '../common/DeploymentConfigDetailsList';
import LoadingInline from '../common/LoadingInline/LoadingInline';
import PodRingSet from '../common/PodRingSet';
import ResourceSummary from '../common/ResourceSummary/ResourceSummary';

import WorkloadPausedAlert from './WorkloadPausedAlert/WorkloadPausedAlert';

type DeploymentConfigSideBarDetailsProps = {
  dc: K8sResourceKind;
};

const DeploymentConfigSideBarDetails: FC<DeploymentConfigSideBarDetailsProps> = ({ dc }) => {
  const { t } = useTopologyTranslation();
  return (
    <div className="overview__sidebar-pane-body resource-overview__body">
      {dc.spec.paused && <WorkloadPausedAlert obj={dc} model={DeploymentConfigModel} />}
      <div className="resource-overview__pod-counts">
        <PodRingSet key={dc.metadata.uid} obj={dc} path="/spec/replicas" />
      </div>
      <div className="resource-overview__summary">
        <ResourceSummary resource={dc} showPodSelector showNodeSelector showTolerations>
          <dt>{t('Status')}</dt>
          <dd>
            {dc.status.availableReplicas === dc.status.updatedReplicas ? (
              t('Active')
            ) : (
              <div>
                <span className="co-icon-space-r">
                  <LoadingInline />
                </span>{' '}
                {t('Updating')}
              </div>
            )}
          </dd>
        </ResourceSummary>
      </div>
      <div className="resource-overview__details">
        <DeploymentConfigDetailsList dc={dc} />
      </div>
    </div>
  );
};

export const useDeploymentConfigSideBarDetails: DetailsTabSectionExtensionHook = (
  element: GraphElement,
) => {
  const resource = getResource(element);
  if (!resource || resource.kind !== DeploymentConfigModel.kind) {
    return [undefined, true, undefined];
  }
  const section = <DeploymentConfigSideBarDetails dc={resource} />;
  return [section, true, undefined];
};
