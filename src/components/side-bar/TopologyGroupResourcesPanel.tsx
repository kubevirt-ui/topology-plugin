import React, { FC, ReactElement } from 'react';

import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { getReferenceForResource } from '@topology-utils/k8s-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import SidebarSectionHeading from '../workload/JobOverview/components/SidebarSectionHeading';

import TopologyGroupResourceList from './TopologyGroupResourceList';

type TopologyGroupResourcesPanelProps = {
  manifestResources: K8sResourceKind[];
  releaseNamespace: string;
  linkForResource?: (obj: K8sResourceKind) => ReactElement;
};

const TopologyGroupResourcesPanel: FC<TopologyGroupResourcesPanelProps> = ({
  manifestResources,
  releaseNamespace,
  linkForResource,
}) => {
  const kinds = manifestResources
    .reduce((resourceKinds, resource) => {
      const kind = getReferenceForResource(resource);
      if (!resourceKinds.includes(kind)) {
        resourceKinds.push(kind);
      }
      return resourceKinds;
    }, [])
    .sort((a, b) => a.localeCompare(b));

  return kinds.reduce((lists, kind) => {
    const model = getK8sModel(kind);
    const resources = manifestResources.filter((resource) => resource.kind === model.kind);
    if (resources.length) {
      lists.push(
        <div key={model.kind}>
          <SidebarSectionHeading text={model.labelPlural} />
          <TopologyGroupResourceList
            resources={resources}
            releaseNamespace={releaseNamespace}
            linkForResource={linkForResource}
          />
        </div>,
      );
    }
    return lists;
  }, []);
};

export default TopologyGroupResourcesPanel;
