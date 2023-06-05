import React, { FC, ReactElement } from 'react';

import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import TopologyGroupResourceItem from './TopologyGroupResourceItem';

type TopologyGroupResourceListProps = {
  resources: K8sResourceKind[];
  releaseNamespace: string;
  linkForResource?: (obj: K8sResourceKind) => ReactElement;
};

const TopologyGroupResourceList: FC<TopologyGroupResourceListProps> = ({
  resources,
  releaseNamespace,
  linkForResource,
}) => {
  return (
    <ul className="list-group">
      {resources
        .sort((r1, r2) => r1.metadata.name.localeCompare(r2.metadata.name))
        .map((resource) => (
          <TopologyGroupResourceItem
            key={resource.metadata.name}
            item={resource}
            releaseNamespace={releaseNamespace}
            linkForResource={linkForResource}
          />
        ))}
    </ul>
  );
};

export default TopologyGroupResourceList;
