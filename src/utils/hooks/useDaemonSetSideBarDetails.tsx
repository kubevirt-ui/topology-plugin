import React from 'react';

import { DaemonSetModel } from '@kubevirt-ui/kubevirt-api/console';
import { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { getResource } from '@topology-utils';
import { DaemonSetKind } from '@topology-utils/types/k8s-types';

import DaemonSetSideBarDetails from '../../components/workload/DaemonSetSideBarDetails';

const useDaemonSetSideBarDetails: DetailsTabSectionExtensionHook = (element: GraphElement) => {
  const resource = getResource<DaemonSetKind>(element);
  if (!resource || resource.kind !== DaemonSetModel.kind) {
    return [undefined, true, undefined];
  }
  const section = <DaemonSetSideBarDetails ds={resource} />;
  return [section, true, undefined];
};

export default useDaemonSetSideBarDetails;
