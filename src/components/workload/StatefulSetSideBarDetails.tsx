import React, { FC } from 'react';

import { StatefulSetModel } from '@kubevirt-ui/kubevirt-api/console';
import { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';

import { getResource } from '../../utils';
import PodRingSet from '../common/PodRingSet';
import ResourceSummary from '../common/ResourceSummary/ResourceSummary';

type StatefulSetSideBarDetailsProps = {
  ss: K8sResourceKind;
};

const StatefulSetSideBarDetails: FC<StatefulSetSideBarDetailsProps> = ({ ss }) => (
  <div className="overview__sidebar-pane-body resource-overview__body">
    <div className="resource-overview__pod-counts">
      <PodRingSet key={ss.metadata.uid} obj={ss} path="/spec/replicas" />
    </div>
    <ResourceSummary resource={ss} showPodSelector showNodeSelector showTolerations />
  </div>
);

export const useStatefulSetSideBarDetails: DetailsTabSectionExtensionHook = (
  element: GraphElement,
) => {
  const resource = getResource(element);
  if (!resource || resource.kind !== StatefulSetModel.kind) {
    return [undefined, true, undefined];
  }
  const section = <StatefulSetSideBarDetails ss={resource} />;
  return [section, true, undefined];
};
