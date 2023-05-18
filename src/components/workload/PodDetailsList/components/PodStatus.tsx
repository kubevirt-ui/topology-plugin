import React, { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { Divider, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { ContainerSpec } from '@topology-utils/hooks/useBuildsConfigWatcher/utils/types';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { podPhase } from '@topology-utils/pod-utils';
import { resourcePath } from '@topology-utils/resource-link-utils';
import { PodKind } from '@topology-utils/types/podTypes';

import { isContainerCrashLoopBackOff, isWindowsPod } from '../utils/utils';

import PodStatusPopover from './PodStatusPopover';

export type PodStatusProps = {
  pod: PodKind;
};

const PodStatus: FC<PodStatusProps> = ({ pod }) => {
  const status = podPhase(pod);
  const unschedulableCondition = pod.status?.conditions?.find(
    (condition) => condition.reason === 'Unschedulable' && condition.status === 'False',
  );
  const containerStatusStateWaiting = pod.status?.containerStatuses?.find(
    (cs) => cs.state?.waiting,
  );
  const { t } = useTopologyTranslation();

  if (status === 'Pending' && unschedulableCondition) {
    return (
      <PodStatusPopover
        bodyContent={unschedulableCondition.message}
        headerContent={t('Pod unschedulable')}
        status={status}
      />
    );
  }
  if (
    (status === 'CrashLoopBackOff' || status === 'ErrImagePull' || status === 'ImagePullBackOff') &&
    containerStatusStateWaiting
  ) {
    let footerLinks: ReactNode;
    let headerTitle = '';
    if (status === 'CrashLoopBackOff') {
      headerTitle = t('Pod crash loop back-off');
      const containers: ContainerSpec[] = pod.spec.containers;
      footerLinks = (
        <TextContent>
          <Text component={TextVariants.p}>
            {t(
              'CrashLoopBackOff indicates that the application within the container is failing to start properly.',
            )}
          </Text>
          <Text component={TextVariants.p}>
            {t('To troubleshoot, view logs and events, then debug in terminal.')}
          </Text>
          <Text component={TextVariants.p}>
            <Link to={`${resourcePath('Pod', pod.metadata.name, pod.metadata.namespace)}/logs`}>
              {t('View logs')}
            </Link>
            &emsp;
            <Link to={`${resourcePath('Pod', pod.metadata.name, pod.metadata.namespace)}/events`}>
              {t('View events')}
            </Link>
          </Text>
          <Divider />
          {containers.map((container) => {
            if (isContainerCrashLoopBackOff(pod, container.name) && !isWindowsPod(pod)) {
              return (
                <div key={container.name}>
                  <Link
                    to={`${resourcePath(
                      'Pod',
                      pod.metadata.name,
                      pod.metadata.namespace,
                    )}/containers/${container.name}/debug`}
                    data-test={`popup-debug-container-link-${container.name}`}
                  >
                    {t('Debug container {{name}}', { name: container.name })}
                  </Link>
                </div>
              );
            }
          })}
        </TextContent>
      );
    }

    return (
      <PodStatusPopover
        headerContent={headerTitle}
        bodyContent={containerStatusStateWaiting.state.waiting.message}
        footerContent={footerLinks}
        status={status}
      />
    );
  }

  return <Status status={status} />;
};

export default PodStatus;
