import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { BuildConfigModel } from '@kubevirt-ui/kubevirt-api/console';
import { ResourceLink, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { Button } from '@patternfly/react-core';
import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { getReferenceForResource } from '@topology-utils/k8s-utils';
import { resourcePath } from '@topology-utils/resource-link-utils';
import { BuildConfigOverviewItem } from '@topology-utils/types/topology-types';

import errorModal from '../../../modals/ErrorModal';
import { MAX_VISIBLE, startBuild } from '../utils/utils';

import BuildOverviewItem from './BuildOverviewItem';

type BuildOverviewListProps = {
  buildConfig: BuildConfigOverviewItem;
};

const BuildOverviewList: FC<BuildOverviewListProps> = ({ buildConfig }) => {
  const {
    metadata: { name, namespace },
    builds,
  } = buildConfig;
  const { t } = useTopologyTranslation();

  const canStartBuild = useAccessReview({
    group: BuildConfigModel.apiGroup,
    resource: BuildConfigModel.plural,
    subresource: 'instantiate',
    name,
    namespace,
    verb: 'create',
  });
  const onClick = () => {
    startBuild(buildConfig).catch((err) => {
      const error = err.message;
      errorModal({ error });
    });
  };
  return (
    <ul className="list-group">
      <li className="list-group-item build-overview__item">
        <div className="build-overview__item-title">
          <div>
            <ResourceLink inline kind="BuildConfig" name={name} namespace={namespace} />
          </div>
          {builds.length > MAX_VISIBLE && (
            <div>
              <Link
                className="sidebar__section-view-all"
                to={`${resourcePath(getReferenceForResource(buildConfig), name, namespace)}/builds`}
              >
                {t('View all {{buildsLength}}', {
                  buildsLength: builds.length,
                })}
              </Link>
            </div>
          )}
          {canStartBuild && (
            <div>
              <Button variant="secondary" onClick={onClick} data-test-id="start-build-action">
                {t('Start Build')}
              </Button>
            </div>
          )}
        </div>
      </li>
      {!(builds?.length > 0) ? (
        <li className="list-group-item">
          <span className="text-muted">{t('No Builds found for this Build Config.')}</span>
        </li>
      ) : (
        builds
          .slice(0, MAX_VISIBLE)
          .map((build) => <BuildOverviewItem key={build.metadata.uid} build={build} />)
      )}
    </ul>
  );
};

export default BuildOverviewList;
