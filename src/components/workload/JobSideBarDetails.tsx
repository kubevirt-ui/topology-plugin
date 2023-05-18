import React, { FC } from 'react';

import { JobModel } from '@kubevirt-ui/kubevirt-api/console';
import { DetailsTabSectionExtensionHook } from '@openshift-console/dynamic-plugin-sdk';
import { GraphElement } from '@patternfly/react-topology';
import { JobKind } from '@topology-utils/hooks/useBuildsConfigWatcher/utils/types';
import usePodsWatcher from '@topology-utils/hooks/usePodsWatcher/usePodsWatcher';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';

import { getResource } from '../../utils';
import DetailsItem from '../common/DetailsItem/DetailsItem';
import PodRingSet from '../common/PodRingSet';
import ResourceSummary from '../common/ResourceSummary/ResourceSummary';
import { pluralize } from '../common/ResourceSummary/utils/utils';
import StatusBox from '../common/StatusBox/StatusBox';

type JobSideBarDetailsProps = {
  job: JobKind;
};

const JobSideBarDetails: FC<JobSideBarDetailsProps> = ({ job }) => {
  const { namespace } = job.metadata;
  const { podData, loaded, loadError } = usePodsWatcher(job, 'Job', namespace);
  const { t } = useTopologyTranslation();
  return (
    <div className="overview__sidebar-pane-body resource-overview__body">
      <div className="resource-overview__pod-counts">
        <StatusBox loaded={loaded} data={podData} loadError={loadError}>
          <PodRingSet key={job.metadata.uid} obj={job} path="" />
        </StatusBox>
      </div>
      <ResourceSummary resource={job} showPodSelector>
        <DetailsItem label={t('Desired completions')} obj={job} path="spec.completions" />
        <DetailsItem label={t('Parallelism')} obj={job} path="spec.parallelism" />
        <DetailsItem
          label={t('Active deadline seconds')}
          obj={job}
          path="spec.activeDeadlineSeconds"
        >
          {job.spec?.activeDeadlineSeconds
            ? pluralize(job.spec.activeDeadlineSeconds, 'second')
            : t('Not configured')}
        </DetailsItem>
      </ResourceSummary>
    </div>
  );
};

export const useJobSideBarDetails: DetailsTabSectionExtensionHook = (element: GraphElement) => {
  const resource = getResource<JobKind>(element);
  if (!resource || resource.kind !== JobModel.kind) {
    return [undefined, true, undefined];
  }
  const section = <JobSideBarDetails job={resource} />;
  return [section, true, undefined];
};
