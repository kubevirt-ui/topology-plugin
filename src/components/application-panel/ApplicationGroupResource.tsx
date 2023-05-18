import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk-internal';
import { isEmpty, size, take } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { getReferenceForResource } from '../../utils/k8s-utils';
import SidebarSectionHeading from '../workload/JobOverview/components/SidebarSectionHeading';

import TopologyApplicationResourceList from './TopologyApplicationList';

const MAX_RESOURCES = 5;

export type ApplicationGroupResourceProps = {
  title: string;
  resourcesData: K8sResourceKind[];
  group: string;
};

const ApplicationGroupResource: FC<ApplicationGroupResourceProps> = ({
  title,
  resourcesData,
  group,
}) => {
  const { t } = useTopologyTranslation();
  const [activeNamespace] = useActiveNamespace();
  return !isEmpty(resourcesData) ? (
    <div className="overview__sidebar-pane-body">
      <SidebarSectionHeading text={title}>
        {size(resourcesData) > MAX_RESOURCES && (
          <Link
            className="sidebar__section-view-all"
            to={`/search/ns/${activeNamespace}?kind=${getReferenceForResource(
              resourcesData[0],
            )}&q=${encodeURIComponent(`app.kubernetes.io/part-of=${group}`)}`}
          >
            {t('View all {{size}}', { size: size(resourcesData) })}
          </Link>
        )}
      </SidebarSectionHeading>
      <TopologyApplicationResourceList resources={take(resourcesData, MAX_RESOURCES)} />
    </div>
  ) : null;
};

export default ApplicationGroupResource;
