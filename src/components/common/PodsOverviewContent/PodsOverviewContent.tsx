import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { BuildConfigData } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { Alert, AlertActionLink } from '@patternfly/react-core';
import { isEmpty, size, take } from '@topology-utils/common-utils';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { resourcePath } from '@topology-utils/resource-link-utils';
import { K8sResourceKind } from '@topology-utils/types/k8s-types';
import { PodKind } from '@topology-utils/types/podTypes';

import SidebarSectionHeading from '../../workload/JobOverview/components/SidebarSectionHeading';
import LoadingBox from '../StatusBox/components/LoadingBox';

import PodsOverviewList from './components/PodsOverviewList';
import { MAX_ERROR_PODS, MAX_PODS } from './utils/const';
import {
  isComplete,
  isDeploymentGeneratedByWebConsole,
  isPodError,
  isPodWithoutImageId,
  podCompare,
} from './utils/utils';

type PodsOverviewContentProps = {
  obj: K8sResourceKind;
  pods: PodKind[];
  loaded: boolean;
  loadError: string;
  allPodsLink?: string;
  emptyText?: string;
  buildConfigData?: BuildConfigData;
  podsFilter?: (pod: PodKind) => boolean;
};

const PodsOverviewContent: FC<PodsOverviewContentProps> = ({
  obj,
  pods,
  loaded,
  loadError,
  allPodsLink,
  emptyText,
  buildConfigData,
}) => {
  const {
    metadata: { name, namespace },
  } = obj;
  const { t } = useTopologyTranslation();
  const [showWaitingPods, setShowWaitingPods] = useState(false);
  const showWaitingForBuildAlert =
    buildConfigData?.buildConfigs?.length > 0 &&
    !buildConfigData.buildConfigs[0].builds.some((build) => isComplete(build)) &&
    isDeploymentGeneratedByWebConsole(obj);

  let filteredPods = [...pods];
  if (showWaitingForBuildAlert && !showWaitingPods) {
    filteredPods = filteredPods.filter((pod) => !isPodWithoutImageId(pod));
  }
  filteredPods.sort(podCompare);

  const errorPodCount = size(pods?.filter((pod) => isPodError(pod)));
  const podsShown = Math.max(Math.min(errorPodCount, MAX_ERROR_PODS), MAX_PODS);
  const linkTo =
    allPodsLink || `${resourcePath(modelToRef(getK8sModel(obj)), name, namespace)}/pods`;
  const emptyMessage = emptyText || t('No Pods found for this resource.');

  const podAlert = showWaitingForBuildAlert ? (
    <Alert
      isInline
      variant="info"
      title={t('Waiting for the build')}
      actionLinks={
        <AlertActionLink
          onClick={() => setShowWaitingPods(!showWaitingPods)}
          data-test="waiting-pods"
        >
          {showWaitingPods
            ? t('Hide waiting pods with errors')
            : t('Show waiting pods with errors')}
        </AlertActionLink>
      }
    >
      {t(
        'Waiting for the first build to run successfully. You may temporarily see "ImagePullBackOff" and "ErrImagePull" errors while waiting.',
      )}
    </Alert>
  ) : null;

  return (
    <>
      <SidebarSectionHeading text={t('Pods')}>
        {size(pods) > podsShown && (
          <Link className="sidebar__section-view-all" to={linkTo}>
            {t('View all {{podSize}}', { podSize: size(pods) })}
          </Link>
        )}
      </SidebarSectionHeading>
      {buildConfigData?.loaded && !buildConfigData?.loadError && podAlert}
      {isEmpty(filteredPods) ? (
        <span className="text-muted">{loaded || !!loadError ? emptyMessage : <LoadingBox />}</span>
      ) : (
        <PodsOverviewList pods={take(filteredPods, podsShown)} />
      )}
    </>
  );
};

export default PodsOverviewContent;
