import React from 'react';

import { PodKind } from '@topology-utils/types/podTypes';

import PodOverviewItem from './PodsOverviewItem';

type PodOverviewListProps = {
  pods: PodKind[];
};

const PodsOverviewList: React.FC<PodOverviewListProps> = ({ pods }) => (
  <ul className="list-group">
    {pods?.map((pod) => (
      <PodOverviewItem key={pod.metadata.uid} pod={pod} />
    ))}
  </ul>
);

export default PodsOverviewList;
