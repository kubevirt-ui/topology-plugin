import React, { FC } from 'react';

import {
  getGroupVersionKindForResource,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

type TopologyApplicationResourceListProps = {
  resources: K8sResourceKind[];
};

const TopologyApplicationResourceList: FC<TopologyApplicationResourceListProps> = ({
  resources,
}) => {
  return (
    <ul className="list-group">
      {resources?.map((resource) => {
        const {
          metadata: { name, namespace, uid },
        } = resource;
        return (
          <li className="list-group-item  container-fluid" key={uid}>
            <ResourceLink
              groupVersionKind={getGroupVersionKindForResource(resource)}
              name={name}
              namespace={namespace}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default TopologyApplicationResourceList;
