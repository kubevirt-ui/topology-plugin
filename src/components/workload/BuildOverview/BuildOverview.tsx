import React, { FC } from 'react';

import { useTopologyTranslation } from '@topology-utils/hooks/useTopologyTranslation';
import { BuildConfigOverviewItem } from '@topology-utils/types/topology-types';

import SidebarSectionHeading from '../JobOverview/components/SidebarSectionHeading';

import BuildOverviewList from './components/BuildOverviewList';

type BuildConfigsOverviewProps = {
  buildConfigs: BuildConfigOverviewItem[];
  loaded?: boolean;
  loadError?: string;
};

const BuildOverview: FC<BuildConfigsOverviewProps> = ({ buildConfigs }) => {
  const { t } = useTopologyTranslation();
  if (!(buildConfigs?.length > 0)) {
    return null;
  }
  return (
    <div className="build-overview">
      <SidebarSectionHeading text={t('Builds')} />
      {buildConfigs.map((buildConfig) => (
        <BuildOverviewList key={buildConfig.metadata.uid} buildConfig={buildConfig} />
      ))}
    </div>
  );
};

export default BuildOverview;
