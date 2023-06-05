import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { getBuildNumber } from '@topology-utils/hooks/useBuildsConfigWatcher/utils/utils';
import { resourcePath } from '@topology-utils/resource-link-utils';

type BuildNumberLinkProps = {
  build: any;
};

const BuildNumberLink: FC<BuildNumberLinkProps> = ({ build }) => {
  const {
    metadata: { name, namespace },
  } = build;
  const buildNumber = getBuildNumber(build);
  const title = isFinite(buildNumber) ? `#${buildNumber}` : name;

  return <Link to={resourcePath('Build', name, namespace)}>{title}</Link>;
};

export default BuildNumberLink;
