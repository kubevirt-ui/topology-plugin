import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { modelToRef } from '@kubevirt-ui/kubevirt-api/console';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { resourcePath } from '@topology-utils/resource-link-utils';

import { JobKind } from '../../../utils/hooks/useBuildsConfigWatcher/utils/types';

import JobsOverviewList from './components/JobOverviewList';
import SidebarSectionHeading from './components/SidebarSectionHeading';

type JobsOverviewProps = {
  jobs: JobKind[];
  obj: K8sResourceCommon;
  allJobsLink?: string;
  emptyText?: string;
};

const MAX_JOBS = 3;

const JobsOverview: FC<JobsOverviewProps> = ({ jobs, obj, allJobsLink, emptyText }) => {
  const {
    metadata: { name, namespace },
  } = obj;
  const { t } = useTopologyTranslation();
  const linkTo =
    allJobsLink || `${resourcePath(modelToRef(getK8sModel(obj)), name, namespace)}/jobs`;
  const emptyMessage = emptyText || t('No Jobs found for this resource.');

  return (
    <>
      <SidebarSectionHeading text="Jobs">
        {jobs?.length > MAX_JOBS && (
          <Link className="sidebar__section-view-all" to={linkTo}>
            {t('View all ({{jobCount}})', { jobCount: jobs.length })}
          </Link>
        )}
      </SidebarSectionHeading>
      {!(jobs?.length > 0) ? (
        <span className="text-muted">{emptyMessage}</span>
      ) : (
        <JobsOverviewList jobs={jobs.slice(0, MAX_JOBS)} />
      )}
    </>
  );
};

export default JobsOverview;
