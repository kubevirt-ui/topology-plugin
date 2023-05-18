import React, { FC } from 'react';

import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import ResourceSummary from '../common/ResourceSummary/ResourceSummary';

const DefaultResourceSideBar: FC<{ resource: K8sResourceKind }> = ({ resource }) => {
  return (
    <div className="overview__sidebar-pane resource-overview">
      <div className="overview__sidebar-pane-body resource-overview__body">
        <div className="resource-overview__summary">
          <ResourceSummary resource={resource} />
        </div>
      </div>
    </div>
  );
};

export default DefaultResourceSideBar;
