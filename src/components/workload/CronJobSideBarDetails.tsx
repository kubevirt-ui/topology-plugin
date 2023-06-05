import React, { FC } from 'react';

import { CronJobModel } from '@kubevirt-ui/kubevirt-api/console';
import { DetailsTabSectionExtensionHook, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { CronJobKind } from '@topology-utils/hooks/useBuildsConfigWatcher/utils/types';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { getResource } from '../../utils';
import DetailsItem from '../common/DetailsItem/DetailsItem';
import PodRingSet from '../common/PodRingSet';
import ResourceSummary from '../common/ResourceSummary/ResourceSummary';

type CronJobSideBarDetailsProps = {
  cronjob: CronJobKind;
};

const CronJobSideBarDetails: FC<CronJobSideBarDetailsProps> = ({ cronjob }) => {
  const { t } = useTopologyTranslation();

  return (
    <div className="overview__sidebar-pane-body resource-overview__body">
      <div className="resource-overview__pod-counts">
        <PodRingSet key={cronjob.metadata.uid} obj={cronjob} path="" />
      </div>
      <ResourceSummary resource={cronjob} showPodSelector>
        <DetailsItem label={t('Schedule')} obj={cronjob} path="spec.schedule" />
        <DetailsItem label={t('Concurrency policy')} obj={cronjob} path="spec.concurrencyPolicy" />
        <DetailsItem
          label={t('Starting deadline seconds')}
          obj={cronjob}
          path="spec.startingDeadlineSeconds"
        >
          {cronjob.spec.startingDeadlineSeconds
            ? t('second', { count: cronjob.spec.startingDeadlineSeconds })
            : t('Not configured')}
        </DetailsItem>
        <DetailsItem label={t('Last schedule time')} obj={cronjob} path="status.lastScheduleTime">
          <Timestamp timestamp={cronjob.status.lastScheduleTime} />
        </DetailsItem>
      </ResourceSummary>
    </div>
  );
};

export const useCronJobSideBarDetails: DetailsTabSectionExtensionHook = (element: GraphElement) => {
  const resource = getResource<CronJobKind>(element);
  if (!resource || resource.kind !== CronJobModel.kind) {
    return [undefined, true, undefined];
  }
  const section = <CronJobSideBarDetails cronjob={resource} />;
  return [section, true, undefined];
};
