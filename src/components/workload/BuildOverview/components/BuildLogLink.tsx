import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { resourcePath } from '@topology-utils/resource-link-utils';

import { BuildStrategyType } from '../utils/types';

import BuildPipelineLogLink from './BuildPipelineLogLink';

type BuildLogLinkProps = {
  build: any;
};

const BuildLogLink: FC<BuildLogLinkProps> = ({ build }) => {
  const {
    metadata: { name, namespace },
  } = build;
  const isPipeline = get(build, 'spec.strategy.type') === BuildStrategyType.JenkinsPipeline;
  const { t } = useTopologyTranslation();
  return isPipeline ? (
    <BuildPipelineLogLink obj={build} />
  ) : (
    <Link to={`${resourcePath('Build', name, namespace)}/logs`}>
      {t('plugin__topology-plugin~View logs')}
    </Link>
  );
};

export default BuildLogLink;
