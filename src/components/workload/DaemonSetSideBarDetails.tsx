import React, { FC } from 'react';

import { DaemonSetModel } from '@kubevirt-ui/kubevirt-api/console';
import usePodsWatcher from '@topology-utils/hooks/usePodsWatcher/usePodsWatcher';
import { DaemonSetKind } from '@topology-utils/types/k8s-types';

import PodRing from '../common/PodRing/PodRing';
import ResourceSummary from '../common/ResourceSummary/ResourceSummary';
import StatusBox from '../common/StatusBox/StatusBox';

import DaemonSetDetailsList from './DaemonSetDetailsList';

type DaemonSetOverviewDetailsProps = {
  ds: DaemonSetKind;
};

const DaemonSetSideBarDetails: FC<DaemonSetOverviewDetailsProps> = ({ ds }) => {
  const { namespace } = ds.metadata;
  const { podData, loaded, loadError } = usePodsWatcher(ds, 'DaemonSet', namespace);

  return (
    <div className="overview__sidebar-pane-body resource-overview__body">
      <div className="resource-overview__pod-counts">
        <StatusBox loaded={loaded} data={podData} loadError={loadError}>
          <PodRing
            pods={podData?.pods ?? []}
            resourceKind={DaemonSetModel}
            obj={ds}
            enableScaling={false}
          />
        </StatusBox>
      </div>
      <div className="resource-overview__summary">
        <ResourceSummary resource={ds} showPodSelector showNodeSelector showTolerations />
      </div>
      <div className="resource-overview__details">
        <DaemonSetDetailsList ds={ds} />
      </div>
    </div>
  );
};

export default DaemonSetSideBarDetails;
