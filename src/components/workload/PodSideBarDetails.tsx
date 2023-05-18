import React, { FC } from 'react';

import { PodModel } from '@kubevirt-ui/kubevirt-api/console';
import { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { PodKind } from '@topology-utils/types/podTypes';

import { getResource } from '../../utils';
import PodRingSet from '../common/PodRingSet';

import PodDetailsList from './PodDetailsList/PodDetailsList';
import PodResourceSummary from './PodResourceSummary';

type PodSideBarDetailsProps = {
  pod: PodKind;
};

const PodSideBarDetails: FC<PodSideBarDetailsProps> = ({ pod }) => {
  return (
    <div className="overview__sidebar-pane-body resource-overview__body">
      <div className="resource-overview__pod-counts">
        <PodRingSet key={pod.metadata.uid} obj={pod} path="" />
      </div>
      <div className="resource-overview__summary">
        <PodResourceSummary pod={pod} />
      </div>
      <div className="resource-overview__details">
        <PodDetailsList pod={pod} />
      </div>
    </div>
  );
};

export const usePodSideBarDetails: DetailsTabSectionExtensionHook = (element: GraphElement) => {
  const resource = getResource<PodKind>(element);
  if (!resource || resource.kind !== PodModel.kind) {
    return [undefined, true, undefined];
  }
  const section = <PodSideBarDetails pod={resource} />;
  return [section, true, undefined];
};
