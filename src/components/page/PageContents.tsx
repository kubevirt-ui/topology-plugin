import React, { FC } from 'react';
import { Trans } from 'react-i18next';
import { match as RMatch } from 'react-router-dom';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { TopologyViewType } from '@topology-utils/types/topology-types';

import CreateProjectButton from '../dev-console/CreateProjectButton';
import CreateProjectListPage from '../dev-console/CreateProjectListPage';

import TopologyDataRenderer from './TopologyDataRenderer';

type PageContentsProps = {
  match: RMatch<{
    name?: string;
  }>;
  viewType: TopologyViewType;
};

const PageContents: FC<PageContentsProps> = ({ match, viewType }) => {
  const { t } = useTopologyTranslation();
  const namespace = match.params.name;

  return namespace ? (
    <TopologyDataRenderer viewType={viewType} />
  ) : (
    <CreateProjectListPage title={t('Topology')}>
      {(openProjectModal) => (
        <Trans t={t} ns="plugin__topology-plugin">
          Select a Project to view the topology
          <CreateProjectButton openProjectModal={openProjectModal} />.
        </Trans>
      )}
    </CreateProjectListPage>
  );
};

const PageContentsWithStartGuide = withStartGuide(PageContents);

export default PageContentsWithStartGuide;
