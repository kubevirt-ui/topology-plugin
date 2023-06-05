import React from 'react';

import { PodKind } from '@topology-utils/types/podTypes';

import ResourceSummary from '../common/ResourceSummary/ResourceSummary';

type PodResourceSummaryProps = {
  pod: PodKind;
};

const PodResourceSummary: React.FC<PodResourceSummaryProps> = ({ pod }) => (
  <ResourceSummary
    resource={pod}
    showNodeSelector
    nodeSelector="spec.nodeSelector"
    showTolerations
  />
);

export default PodResourceSummary;
