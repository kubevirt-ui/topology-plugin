import React, { FC } from 'react';

import { DeploymentModel } from '@kubevirt-ui/kubevirt-api/console';
import { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { DeploymentKind } from '@topology-utils/types/commonTypes';

import { getResource } from '../../utils';
import DeploymentDetailsList from '../common/DeploymentDetailsList/DeploymentDetailsList';
import LoadingInline from '../common/LoadingInline/LoadingInline';
import PodRingSet from '../common/PodRingSet';
import ResourceSummary from '../common/ResourceSummary/ResourceSummary';

import WorkloadPausedAlert from './WorkloadPausedAlert/WorkloadPausedAlert';

type DeploymentSideBarDetailsProps = {
  deployment: DeploymentKind;
};

const DeploymentSideBarDetails: FC<DeploymentSideBarDetailsProps> = ({ deployment: d }) => {
  const { t } = useTopologyTranslation();
  return (
    <div className="overview__sidebar-pane-body resource-overview__body">
      {d.spec.paused && <WorkloadPausedAlert obj={d} model={DeploymentModel} />}
      <div className="resource-overview__pod-counts">
        <PodRingSet key={d.metadata.uid} obj={d} path="/spec/replicas" />
      </div>
      <div className="resource-overview__summary">
        <ResourceSummary resource={d} showPodSelector showNodeSelector showTolerations>
          <dt>{t('Status')}</dt>
          <dd>
            {d.status.availableReplicas === d.status.updatedReplicas ? (
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
        <DeploymentDetailsList deployment={d} />
      </div>
    </div>
  );
};

export const useDeploymentSideBarDetails: DetailsTabSectionExtensionHook = (
  element: GraphElement,
) => {
  const resource = getResource<DeploymentKind>(element);
  if (!resource || resource.kind !== DeploymentModel.kind) {
    return [undefined, true, undefined];
  }
  const section = <DeploymentSideBarDetails deployment={resource} />;
  return [section, true, undefined];
};
