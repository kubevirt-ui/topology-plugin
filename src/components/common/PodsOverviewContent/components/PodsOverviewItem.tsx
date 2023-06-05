import React from 'react';
import { Link } from 'react-router-dom';
import PodStatus from 'src/components/workload/PodDetailsList/components/PodStatus';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { resourcePath } from '@topology-utils/resource-link-utils';
import { PodKind } from '@topology-utils/types/podTypes';

import PodTraffic from '../../PodTraffic';

type PodOverviewItemProps = {
  pod: PodKind;
};

const PodOverviewItem: React.FC<PodOverviewItemProps> = ({ pod }) => {
  const {
    metadata: { name, namespace },
  } = pod;
  const { t } = useTopologyTranslation();
  return (
    <li className="list-group-item container-fluid">
      <div className="row">
        <span className="col-xs-5">
          <ResourceLink kind={'Pod'} name={name} namespace={namespace} />
        </span>
        <span className="col-xs-3">
          <PodStatus pod={pod} />
        </span>
        <span className="col-xs-1">
          <PodTraffic podName={name} namespace={namespace} tooltipFlag />
        </span>
        <span className="col-xs-3 text-right">
          <Link to={`${resourcePath('Pod', name, namespace)}/logs`}>{t('View logs')}</Link>
        </span>
      </div>
    </li>
  );
};

export default PodOverviewItem;
